package aiimin.core.data.money

import android.util.Log
import aiimin.core.data.MoneyStore
import aiimin.core.data.di.ApplicationScope
import aiimin.core.data.prefs.AppPreferences
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.UUID
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
import kotlinx.serialization.builtins.ListSerializer
import kotlinx.serialization.json.Json

/**
 * Review queue for payment alerts (share / paste / opt-in notification).
 * Nothing hits the ledger / website until [approve].
 * Drafts survive process death via DataStore.
 */
@Singleton
class PaymentInboxStore @Inject constructor(
    private val money: MoneyStore,
    private val prefs: AppPreferences,
    @ApplicationScope private val scope: CoroutineScope,
) {

    private val json = Json { ignoreUnknownKeys = true; encodeDefaults = true }

    private val _state = MutableStateFlow(PaymentInboxState())
    val state: StateFlow<PaymentInboxState> = _state.asStateFlow()

    /** Unparsed share text parked for the Money paste box. */
    private val _sharedRaw = MutableStateFlow<String?>(null)
    val sharedRaw: StateFlow<String?> = _sharedRaw.asStateFlow()

    private val _openMoney = MutableSharedFlow<Unit>(extraBufferCapacity = 1)
    val openMoneyRequests: SharedFlow<Unit> = _openMoney.asSharedFlow()

    @Volatile
    private var stickyOpenMoney = false

    init {
        scope.launch { hydrateDrafts() }
    }

    fun requestOpenMoney() {
        stickyOpenMoney = true
        _openMoney.tryEmit(Unit)
    }

    /** True once if Money should open (share arrived before shell collected). */
    fun consumeStickyOpenMoney(): Boolean {
        if (!stickyOpenMoney) return false
        stickyOpenMoney = false
        return true
    }

    /**
     * Ingest raw alert text. Returns true when a draft was queued.
     * Dedupes on (amount, direction, preview) within a short window.
     * On parse miss: parks [raw] for paste + still opens Money.
     */
    fun ingest(raw: String, source: PaymentDraftSource): Boolean {
        val text = raw.trim()
        if (text.isEmpty()) {
            Log.w(TAG, "ingest empty source=$source")
            return false
        }
        val parsed = PaymentAlertParser.parse(text)
        if (parsed == null) {
            Log.i(TAG, "ingest parse-miss len=${text.length} source=$source — park paste")
            _sharedRaw.value = text.take(4_000)
            requestOpenMoney()
            return false
        }
        val now = System.currentTimeMillis()
        val name = parsed.merchant?.takeIf { it.isNotBlank() }
            ?: parsed.accountHint
            ?: "Payment alert"
        val category = when (parsed.direction) {
            PaymentAlertParser.Direction.CREDIT -> "INCOME"
            PaymentAlertParser.Direction.DEBIT -> guessCategory(name, parsed.channel)
        }
        val draft = PaymentDraft(
            id = UUID.randomUUID().toString(),
            amountInr = parsed.amountInr,
            direction = parsed.direction,
            merchant = parsed.merchant,
            accountHint = parsed.accountHint,
            channel = parsed.channel,
            category = category,
            preview = parsed.preview,
            source = source,
            atMs = now,
            dateIso = parsed.dateIso,
        )
        var added = false
        _state.update { inbox ->
            val dup = inbox.drafts.any {
                it.amountInr == draft.amountInr &&
                    it.direction == draft.direction &&
                    it.preview == draft.preview &&
                    now - it.atMs < 120_000L
            }
            if (dup) {
                Log.i(TAG, "ingest dup ₹${draft.amountInr} source=$source")
                return@update inbox
            }
            added = true
            inbox.copy(drafts = listOf(draft) + inbox.drafts).trimmed()
        }
        if (added) {
            Log.i(TAG, "ingest ok ₹${draft.amountInr} ${draft.direction} ${draft.channel} cat=$category source=$source")
            _sharedRaw.value = null
            requestOpenMoney()
            persistDrafts()
        }
        return added
    }

    fun consumeSharedRaw(): String? {
        val v = _sharedRaw.value
        _sharedRaw.value = null
        return v
    }

    /**
     * Commit draft to local ledger **synchronously** and return payload for website push.
     * Caller must push via [aiimin.core.data.sync.GraphSyncRepository].
     */
    fun approve(id: String): ApprovedPayment? {
        val draft = _state.value.drafts.firstOrNull { it.id == id } ?: return null
        val zone = ZoneId.systemDefault()
        val dateIso = draft.dateIso?.takeIf { it.matches(Regex("""\d{4}-\d{2}-\d{2}""")) }
            ?: Instant.ofEpochMilli(draft.atMs)
                .atZone(zone)
                .toLocalDate()
                .format(DateTimeFormatter.ISO_LOCAL_DATE)
        val dateLabel = runCatching {
            java.time.LocalDate.parse(dateIso).format(DateTimeFormatter.ofPattern("dd.MM"))
        }.getOrElse {
            Instant.ofEpochMilli(draft.atMs).atZone(zone).format(DateTimeFormatter.ofPattern("dd.MM"))
        }
        val name = draft.merchant?.takeIf { it.isNotBlank() }
            ?: draft.accountHint
            ?: "Payment alert"
        val categoryRaw = draft.category.ifBlank {
            when (draft.direction) {
                PaymentAlertParser.Direction.CREDIT -> "INCOME"
                PaymentAlertParser.Direction.DEBIT -> guessCategory(name, draft.channel)
            }
        }
        val category = toWebCategory(categoryRaw)
        val channel = listOfNotNull(draft.channel, draft.accountHint, draft.source.label)
            .joinToString(" · ")
        when (draft.direction) {
            PaymentAlertParser.Direction.DEBIT -> money.recordExpense(
                name = name,
                amount = draft.amountInr,
                category = category,
                channel = channel,
                dateLabel = dateLabel,
            )
            PaymentAlertParser.Direction.CREDIT -> money.recordIncome(
                name = name,
                amount = draft.amountInr,
                category = category,
                channel = channel,
                dateLabel = dateLabel,
            )
        }
        _state.update { it.copy(drafts = it.drafts.filterNot { d -> d.id == id }) }
        persistDrafts()
        Log.i(TAG, "approve ₹${draft.amountInr} $category → local + ready for sync")
        return ApprovedPayment(
            name = name,
            amountInr = draft.amountInr,
            category = category,
            type = when (draft.direction) {
                PaymentAlertParser.Direction.DEBIT -> "expense"
                PaymentAlertParser.Direction.CREDIT -> "income"
            },
            dateIso = dateIso,
            clientKey = draft.id,
        )
    }

    fun dismiss(id: String) {
        _state.update { it.copy(drafts = it.drafts.filterNot { d -> d.id == id }) }
        persistDrafts()
    }

    /** Human-typed amount + merchant — still goes through Approve. */
    fun enqueueManual(
        amountInr: Int,
        name: String,
        expense: Boolean,
        category: String = if (expense) "UNCATEGORISED" else "INCOME",
    ): Boolean {
        if (amountInr <= 0) return false
        val merchant = name.trim().ifBlank { "Manual entry" }
        val draft = PaymentDraft(
            id = UUID.randomUUID().toString(),
            amountInr = amountInr,
            direction = if (expense) {
                PaymentAlertParser.Direction.DEBIT
            } else {
                PaymentAlertParser.Direction.CREDIT
            },
            merchant = merchant,
            accountHint = null,
            channel = "MANUAL",
            category = category,
            preview = if (expense) "Manual expense · $merchant" else "Manual income · $merchant",
            source = PaymentDraftSource.MANUAL,
            atMs = System.currentTimeMillis(),
        )
        _state.update { it.copy(drafts = listOf(draft) + it.drafts).trimmed() }
        persistDrafts()
        requestOpenMoney()
        return true
    }

    fun clear() {
        _state.update { it.copy(drafts = emptyList()) }
        persistDrafts()
    }

    private fun persistDrafts() {
        val snap = _state.value.drafts
        scope.launch {
            prefs.writePaymentDraftsJson(
                json.encodeToString(ListSerializer(PaymentDraftDto.serializer()), snap.map { it.toDto() }),
            )
        }
    }

    private suspend fun hydrateDrafts() {
        val raw = prefs.read().paymentDraftsJson ?: return
        if (raw.isBlank()) return
        runCatching {
            val list = json.decodeFromString(ListSerializer(PaymentDraftDto.serializer()), raw)
            _state.value = PaymentInboxState(drafts = list.mapNotNull { it.toDraft() })
        }.onFailure { Log.w(TAG, "draft hydrate failed: ${it.message}") }
    }

    companion object {
        private const val TAG = "AiiminPay"
    }

    private fun guessCategory(name: String, channel: String): String {
        val n = name.lowercase()
        return when {
            listOf("swiggy", "zomato", "cafe", "restaurant", "food").any { it in n } -> "FOOD"
            listOf("blinkit", "bigbasket", "grocery", "zepto", "instamart").any { it in n } -> "GROCERY"
            listOf("uber", "ola", "metro", "petrol", "fuel", "rapido").any { it in n } -> "TRANSPORT"
            listOf("netflix", "spotify", "prime", "hotstar", "jio").any { it in n } -> "SUBS"
            listOf("rent", "landlord").any { it in n } -> "RENT"
            channel == "UPI" -> "UNCATEGORISED"
            else -> "UNCATEGORISED"
        }
    }

    /** Website Money uses free-text labels like "Food & Dining", not FOOD codes. */
    private fun toWebCategory(raw: String): String = when (raw.uppercase()) {
        "FOOD" -> "Food & Dining"
        "GROCERY" -> "Groceries"
        "TRANSPORT" -> "Transportation"
        "SUBS" -> "Subscriptions"
        "RENT" -> "Rent"
        "INCOME" -> "Income"
        "UNCATEGORISED", "OTHER", "" -> "Other"
        else -> raw
    }
}

/** Result of [PaymentInboxStore.approve] — feed this to GraphSync. */
data class ApprovedPayment(
    val name: String,
    val amountInr: Int,
    val category: String,
    val type: String,
    val dateIso: String,
    val clientKey: String,
)

enum class PaymentDraftSource(val label: String) {
    SHARE("SHARE"),
    PASTE("PASTE"),
    NOTIFICATION("NOTIF"),
    SMS("SMS"),
    AI_TEXT("AI"),
    MANUAL("MANUAL"),
}

data class PaymentDraft(
    val id: String,
    val amountInr: Int,
    val direction: PaymentAlertParser.Direction,
    val merchant: String?,
    val accountHint: String?,
    val channel: String,
    val category: String,
    val preview: String,
    val source: PaymentDraftSource,
    val atMs: Long,
    val dateIso: String? = null,
)

@Serializable
data class PaymentDraftDto(
    val id: String,
    val amountInr: Int,
    val direction: String,
    val merchant: String? = null,
    val accountHint: String? = null,
    val channel: String,
    val category: String = "UNCATEGORISED",
    val preview: String,
    val source: String,
    val atMs: Long,
    val dateIso: String? = null,
)

private fun PaymentDraft.toDto() = PaymentDraftDto(
    id = id,
    amountInr = amountInr,
    direction = direction.name,
    merchant = merchant,
    accountHint = accountHint,
    channel = channel,
    category = category,
    preview = preview,
    source = source.name,
    atMs = atMs,
    dateIso = dateIso,
)

private fun PaymentDraftDto.toDraft(): PaymentDraft? {
    val dir = runCatching { PaymentAlertParser.Direction.valueOf(direction) }.getOrNull()
        ?: return null
    val src = runCatching { PaymentDraftSource.valueOf(source) }.getOrNull()
        ?: PaymentDraftSource.PASTE
    return PaymentDraft(
        id = id,
        amountInr = amountInr,
        direction = dir,
        merchant = merchant,
        accountHint = accountHint,
        channel = channel,
        category = category,
        preview = preview,
        source = src,
        atMs = atMs,
        dateIso = dateIso,
    )
}

data class PaymentInboxState(
    val drafts: List<PaymentDraft> = emptyList(),
) {
    val pendingCount: Int get() = drafts.size

    fun trimmed(max: Int = 40) = copy(drafts = drafts.take(max))
}
