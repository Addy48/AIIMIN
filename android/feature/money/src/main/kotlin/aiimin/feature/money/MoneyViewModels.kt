package aiimin.feature.money

import aiimin.core.data.core.DayClock
import aiimin.core.data.money.Ledger
import aiimin.core.data.money.MonthMoney
import aiimin.core.data.money.MoneyRepository
import aiimin.core.data.vault.FamilyRepository
import aiimin.core.data.vault.ME
import aiimin.core.data.vault.VaultRepository
import aiimin.core.database.BudgetEntity
import aiimin.core.database.PersonEntity
import aiimin.core.database.TxnEntity
import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import java.io.File
import java.time.LocalDate
import java.time.YearMonth
import javax.inject.Inject
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.launch

@OptIn(ExperimentalCoroutinesApi::class)
@HiltViewModel
class MoneyViewModel @Inject constructor(
    private val money: MoneyRepository,
    private val clock: DayClock,
    notifications: aiimin.core.data.notify.NotificationRepository,
    private val accountsRepo: aiimin.core.data.money.AccountRepository,
    splits: aiimin.core.data.money.SplitRepository,
    private val bills: aiimin.core.data.money.BillRepository,
    settings: aiimin.core.data.settings.SettingsStore,
) : ViewModel() {
    val prefs = settings.settings.stateIn(viewModelScope, SharingStarted.Eagerly, null)
    private val t0 = System.currentTimeMillis()
    private fun tlog(w: String) = android.util.Log.d("AIIMIN_T", "$w +${System.currentTimeMillis() - t0}ms")
    /** Accounts row, owed and coming-up bills (M1 items 6, 8, 9). */
    val extras = aiimin.core.data.money.moneyExtras(accountsRepo, splits, bills).stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)
    /** Account chip selected on Money home: filters the payment list. */
    val accountFilter = MutableStateFlow<String?>(null)
    val quietAccounts = MutableStateFlow<Set<String>>(emptySet())
    val today = MutableStateFlow(LocalDate.now())
    val ledger = MutableStateFlow(Ledger.PERSONAL)
    val month = MutableStateFlow(YearMonth.now())
    val unread = notifications.unread.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), 0)
    val range = MutableStateFlow(aiimin.core.data.money.MoneyRange.M)
    val offset = MutableStateFlow(0)
    val series: StateFlow<aiimin.core.data.money.SpendSeries?> = combine(range, ledger, today, offset) { r, l, t, o -> arrayOf<Any>(r, l, t, o) }
        .flatMapLatest { a -> money.series(a[0] as aiimin.core.data.money.MoneyRange, a[1] as Ledger, a[2] as LocalDate, a[3] as Int) }
        .onEach { tlog("series") }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)
    fun setRange(r: aiimin.core.data.money.MoneyRange) { offset.value = 0; range.value = r }
    fun page(by: Int) { val next = offset.value + by; if (next <= 0) offset.value = next }

    val data: StateFlow<MonthMoney?> = combine(month, ledger, today) { m, l, t -> Triple(m, l, t) }
        .flatMapLatest { (m, l, t) -> money.month(m, l, t) }
        .onEach { tlog("month") }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)

    /** Accounts bank messages named that are not added yet (owner, 20 Oct). Declared before init, which fills it. */
    val found = MutableStateFlow<List<aiimin.core.data.money.SeenAccount>>(emptyList())

    init {
        viewModelScope.launch {
            val t = clock.today()
            today.value = t
            month.value = YearMonth.from(t)
            money.ensureBudgetCarried()
            runCatching { accountsRepo.ensureSeeded() }
            refreshFound()
            runCatching { bills.refresh() }
            quietAccounts.value = runCatching { accountsRepo.views().filter { it.quiet() }.map { it.account.id }.toSet() }.getOrDefault(emptySet())
        }
    }

    private suspend fun refreshFound() { found.value = runCatching { accountsRepo.suggestions() }.getOrDefault(emptyList()) }
    /** New alerts may name new accounts: Money re-reads them each time it comes to the front. */
    fun refreshFoundNow() = viewModelScope.launch { refreshFound() }
    fun linkTarget(s: aiimin.core.data.money.SeenAccount) = s.linkTarget(extras.value?.accounts.orEmpty())?.name
    // The card leaves at once, so a second tap can't reach it (one account per number).
    fun acceptFound(s: aiimin.core.data.money.SeenAccount) { found.value = found.value - s; viewModelScope.launch { accountsRepo.accept(s); refreshFound() } }
    fun dismissFound(s: aiimin.core.data.money.SeenAccount) { found.value = found.value - s; viewModelScope.launch { accountsRepo.dismiss(s.last4); refreshFound() } }

    fun accountOf(t: TxnEntity): String? = extras.value?.accounts?.let { accountsRepo.accountFor(t, it)?.id }

    suspend fun exportInfo(m: YearMonth, l: Ledger): Pair<Int, String> = money.exportCount(m, l) to money.exportName(m, l)
    suspend fun exportFor(m: YearMonth, l: Ledger): File = money.exportCsv(m, l)

    fun shift(by: Long) { month.value = month.value.plusMonths(by).let { if (it > YearMonth.from(today.value)) YearMonth.from(today.value) else it } }

    suspend fun add(paise: Long, dir: String, title: String, category: String, ledger: Ledger, day: LocalDate, note: String) =
        money.add(paise, dir, title, category, ledger, day = day, note = note)

    suspend fun capture(text: String) = money.capture(text, "paste")
    val categoriesOut = money.categories(inbound = false).stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    val categoriesIn = money.categories(inbound = true).stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    suspend fun delete(id: String) = money.delete(id)
    fun restore(t: TxnEntity) = viewModelScope.launch { money.restore(t) }
    suspend fun export(): File = money.exportCsv(month.value, ledger.value)
}

@HiltViewModel
class InboxViewModel @Inject constructor(private val money: MoneyRepository, settings: aiimin.core.data.settings.SettingsStore) : ViewModel() {
    val pending = money.pending().stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    /** Personal plus the ledgers turned on in Money settings, for the per-payment picker (4.4). */
    val ledgers = settings.settings.map { s -> Ledger.entries.filter { it == Ledger.PERSONAL || it.name in s.ledgersOn } }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), listOf(Ledger.PERSONAL))
    /** A place filed the same way three times by hand: "Make this a rule?" (Phase 2). */
    val offer = MutableStateFlow<aiimin.core.database.PayeeRuleEntity?>(null)

    init { viewModelScope.launch { runCatching { money.resortPending() } } }

    suspend fun settle(id: String, category: String, ledger: Ledger, title: String, learn: Boolean, note: String? = null, upiId: String? = null): String? {
        val txn = money.settle(id, category, ledger, title, learn, note)
        if (learn && offer.value == null) offer.value = money.ruleOffer(title, upiId)
        return txn
    }

    fun makeRule(place: aiimin.core.database.PayeeRuleEntity) = viewModelScope.launch { offer.value = null; money.makeRule(place) }
    fun notNow(place: aiimin.core.database.PayeeRuleEntity) = viewModelScope.launch { offer.value = null; money.dismissRuleOffer(place) }
    fun dismiss(id: String) = viewModelScope.launch { money.dismiss(id) }
    val categoriesOut = money.categories(inbound = false).stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    val categoriesIn = money.categories(inbound = true).stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    suspend fun recentItems(d: aiimin.core.database.TxnDraftEntity) = money.recentItems(d)
    suspend fun addCategory(raw: String, inbound: Boolean) = money.addCategory(raw, inbound)
}

@HiltViewModel
class TxnViewModel @Inject constructor(
    private val money: MoneyRepository,
    private val vault: VaultRepository,
    family: FamilyRepository,
    private val splits: aiimin.core.data.money.SplitRepository,
) : ViewModel() {
    fun split(people: List<Pair<String, String>>) = viewModelScope.launch {
        val t = txn.value ?: return@launch
        splits.splitEqually(t.id, people)
        txn.value = money.get(t.id)
    }

    fun clearSplit() = viewModelScope.launch {
        val t = txn.value ?: return@launch
        money.update(t.copy(splits = "[]"))
        txn.value = money.get(t.id)
    }
    val txn = MutableStateFlow<TxnEntity?>(null)
    val people: StateFlow<List<PersonEntity>> = family.people.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    val receiptTitle = MutableStateFlow<String?>(null)

    fun load(id: String) = viewModelScope.launch {
        txn.value = money.get(id)
        receiptTitle.value = txn.value?.receiptDocId?.let { vault.get(it)?.title }
    }

    val categoriesOut = money.categories(inbound = false).stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    val categoriesIn = money.categories(inbound = true).stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

    fun save(t: TxnEntity, learn: Boolean) = viewModelScope.launch {
        money.update(t, learn)
        txn.value = t
    }

    suspend fun delete(id: String) = money.delete(id)
    fun restore(t: TxnEntity) = viewModelScope.launch { money.restore(t) }

    fun gift(hideFrom: String?, reveal: LocalDate?) = viewModelScope.launch {
        val t = txn.value ?: return@launch
        money.setGift(t.id, hideFrom, reveal)
        txn.value = money.get(t.id)
    }

    /** Receipts live in the vault (Household for shared spends), linked both ways. */
    suspend fun attachReceipt(uri: Uri) {
        val t = txn.value ?: return
        val owner = if (t.ledger == "HOUSEHOLD") "household" else ME
        val r = vault.import(uri, owner, titleHint = "Receipt · ${t.title}")
        money.linkReceipt(t.id, r.docId)
        txn.value = money.get(t.id)
        receiptTitle.value = vault.get(r.docId)?.title
    }
}

@HiltViewModel
class BudgetViewModel @Inject constructor(private val money: MoneyRepository, private val clock: DayClock) : ViewModel() {
    val current = MutableStateFlow<BudgetEntity?>(null)

    init {
        viewModelScope.launch {
            val today = clock.today()
            current.value = money.month(YearMonth.from(today), Ledger.PERSONAL, today).first().budget
        }
    }

    suspend fun save(total: Long, fixed: Long, caps: Map<String, Long>): YearMonth = money.setBudget(total, fixed, caps)
}
