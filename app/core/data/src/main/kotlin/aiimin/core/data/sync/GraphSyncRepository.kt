package aiimin.core.data.sync

import aiimin.core.data.AgendaStore
import aiimin.core.data.ConfigStore
import aiimin.core.data.DayStore
import aiimin.core.data.JournalStore
import aiimin.core.data.LabStore
import aiimin.core.data.MoneyStore
import aiimin.core.data.NoteStore
import aiimin.core.data.PublishedLifeScoreStore
import aiimin.core.data.SpeakingStore
import aiimin.core.data.VaultListStore
import aiimin.core.data.SyncState
import aiimin.core.data.di.ApplicationScope
import aiimin.core.data.prefs.AppPreferences
import aiimin.core.data.session.SessionRepository
import aiimin.core.network.AiiminApi
import aiimin.core.network.CreateMoneyTransactionRequest
import aiimin.core.network.SyncBatchRequest
import aiimin.core.network.SyncMutationDto
import java.time.Instant
import java.util.UUID
import java.util.concurrent.CopyOnWriteArrayList
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.math.abs
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.serialization.builtins.ListSerializer
import kotlinx.serialization.json.Json
import retrofit2.HttpException

data class SyncUiState(
    val isSyncing: Boolean = false,
    val lastSyncedAtMillis: Long? = null,
    val lastError: String? = null,
    val pendingOutbox: Int = 0,
    val usingCache: Boolean = false,
)

/**
 * Pull graph from api.aiimin.in and push local mutations.
 * Flush outbox **before** hydrate so local settles are not wiped.
 *
 * Hydrates habits, journal, notes, agenda, published Life Score, speaking summary.
 */
@Singleton
class GraphSyncRepository @Inject constructor(
    private val api: AiiminApi,
    private val session: SessionRepository,
    private val day: DayStore,
    private val money: MoneyStore,
    private val journal: JournalStore,
    private val lab: LabStore,
    private val notes: NoteStore,
    private val agenda: AgendaStore,
    private val publishedScore: PublishedLifeScoreStore,
    private val speaking: SpeakingStore,
    private val vaultLists: VaultListStore,
    private val config: ConfigStore,
    private val prefs: AppPreferences,
    @ApplicationScope private val scope: CoroutineScope,
) {
    private val json = Json { ignoreUnknownKeys = true; encodeDefaults = true }
    private val mutex = Mutex()

    private val _ui = MutableStateFlow(SyncUiState())
    val ui: StateFlow<SyncUiState> = _ui.asStateFlow()

    private val outbox = CopyOnWriteArrayList<SyncMutationDto>()
    private val moneyOutbox = CopyOnWriteArrayList<CreateMoneyTransactionRequest>()

    @Volatile
    private var hydrated = false

    init {
        scope.launch { hydrateOutbox() }
    }

    suspend fun refreshAll(): Result<Unit> {
        hydrateOutbox()
        if (!session.state.value.isSignedIn) {
            return Result.failure(IllegalStateException("Not signed in"))
        }
        _ui.update { it.copy(isSyncing = true, lastError = null) }
        config.setSync(SyncState.SYNCING, "Pulling the graph…")
        return try {
            // Push first — never wipe local rows before remote has the writes.
            flushMoneyOutbox()
            flushOutbox()
            flushSpeakingOutbox()
            val boot = api.bootstrap()
            applyBootstrap(boot)
            hydrateMoneySafe()
            hydrateLifeScoreSafe()
            hydrateSpeakingSafe()
            hydrateLabSafe()
            val now = System.currentTimeMillis()
            _ui.update {
                it.copy(
                    isSyncing = false,
                    lastSyncedAtMillis = now,
                    lastError = null,
                    usingCache = false,
                    pendingOutbox = pendingCount(),
                )
            }
            config.finishSyncLive(now, pendingCount())
            Result.success(Unit)
        } catch (e: Exception) {
            val msg = friendly(e)
            _ui.update {
                it.copy(
                    isSyncing = false,
                    lastError = msg,
                    usingCache = true,
                    pendingOutbox = pendingCount(),
                )
            }
            config.setSync(SyncState.HELD, msg)
            if (e is HttpException && e.code() == 401) {
                session.clearSession()
            }
            Result.failure(e)
        }
    }

    fun enqueueHabitTick(serverHabitId: String) {
        enqueueMutation(
            SyncMutationDto(
                id = UUID.randomUUID().toString(),
                type = "habit.tick",
                payload = mapOf(
                    "habit_id" to serverHabitId,
                    "completed_at" to Instant.now().toString(),
                ),
                clientMutatedAt = Instant.now().toString(),
            ),
        )
    }

    fun enqueueHabitUntick(serverHabitId: String) {
        enqueueMutation(
            SyncMutationDto(
                id = UUID.randomUUID().toString(),
                type = "habit.untick",
                payload = mapOf(
                    "habit_id" to serverHabitId,
                    "completed_at" to Instant.now().toString(),
                ),
                clientMutatedAt = Instant.now().toString(),
            ),
        )
    }

    /**
     * Push queued mutations only — **no** bootstrap rehydrate.
     * Habit ticks must not call [refreshAll] or a lagging `habitCompletedToday`
     * wipes the optimistic Day tick the founder just saw.
     */
    suspend fun flushPendingMutations(): Result<Unit> {
        hydrateOutbox()
        if (!session.state.value.isSignedIn) {
            return Result.failure(IllegalStateException("Not signed in"))
        }
        return try {
            flushOutbox()
            flushSpeakingOutbox()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Pending habit.tick / habit.untick overlay for bootstrap merge —
     * keeps Day ticks honest until the server catches up.
     */
    fun pendingHabitOverlay(): PendingHabitOverlay {
        val ticks = linkedSetOf<String>()
        val unticks = linkedSetOf<String>()
        outbox.forEach { m ->
            val id = m.payload["habit_id"] ?: return@forEach
            when (m.type) {
                "habit.tick" -> {
                    ticks += id
                    unticks -= id
                }
                "habit.untick" -> {
                    unticks += id
                    ticks -= id
                }
            }
        }
        return PendingHabitOverlay(ticks = ticks, unticks = unticks)
    }

    data class PendingHabitOverlay(
        val ticks: Set<String>,
        val unticks: Set<String>,
    ) {
        fun apply(completedToday: Set<String>): Set<String> {
            val next = completedToday.toMutableSet()
            next.addAll(ticks)
            next.removeAll(unticks)
            return next
        }
    }

    /**
     * Drop a queued wealth POST that matches an undone Capture settle.
     * Already-flushed rows need website edit — returns false if nothing queued.
     */
    fun cancelPendingMoney(description: String, amountAbs: Int): Boolean {
        val before = moneyOutbox.size
        moneyOutbox.removeAll { req ->
            req.description == description &&
                abs(req.amount) == amountAbs.toDouble()
        }
        val removed = moneyOutbox.size < before
        if (removed) {
            _ui.update { it.copy(pendingOutbox = pendingCount()) }
            scope.launch { persistOutbox() }
        }
        return removed
    }

    fun enqueueJournal(content: String, mood: Int?, date: String?) {
        enqueueMutation(
            SyncMutationDto(
                id = UUID.randomUUID().toString(),
                type = "journal.upsert",
                payload = mapOf(
                    "content" to content,
                    "mood" to mood?.toString(),
                    "date" to date,
                ),
                clientMutatedAt = Instant.now().toString(),
            ),
        )
    }

    fun enqueueDisciplineEvent(
        id: String,
        category: String,
        intensity: Int,
        outcome: String,
        note: String,
        startedAt: String,
        resolvedAt: String,
    ) {
        enqueueMutation(
            SyncMutationDto(
                id = UUID.randomUUID().toString(),
                type = "discipline.urge.upsert",
                payload = mapOf(
                    "id" to id,
                    // Detailed category, intensity, note, and timestamps remain local.
                    // The server receives only the aggregate outcome needed for Life OS.
                    "category" to "discipline",
                    "outcome" to outcome,
                    "privacy_mode" to "local_detail_v1",
                ),
                clientMutatedAt = Instant.now().toString(),
            ),
        )
    }

    fun enqueueNote(
        id: String,
        title: String,
        content: String,
        color: String? = null,
        pinned: Boolean? = null,
    ) {
        enqueueMutation(
            SyncMutationDto(
                id = UUID.randomUUID().toString(),
                type = "note.upsert",
                payload = mapOf(
                    "id" to id,
                    "title" to title,
                    "content" to content,
                    "color" to color,
                    "pinned" to pinned?.toString(),
                ),
                clientMutatedAt = Instant.now().toString(),
            ),
        )
    }

    /** Local note + outbox. Caller should [flushPendingMutations] or wait for refresh. */
    fun saveNote(
        title: String,
        content: String,
        id: String? = null,
        pinned: Boolean? = null,
    ): String {
        val item = notes.upsertLocal(title = title, content = content, id = id)
        enqueueNote(
            id = item.id,
            title = item.title,
            content = item.content,
            pinned = pinned ?: item.pinned,
        )
        return item.id
    }

    fun enqueueNoteDelete(id: String) {
        outbox.removeAll { it.type == "note.upsert" && it.payload["id"] == id }
        enqueueMutation(
            SyncMutationDto(
                id = UUID.randomUUID().toString(),
                type = "note.delete",
                payload = mapOf("id" to id),
                clientMutatedAt = Instant.now().toString(),
            ),
        )
    }

    fun pendingNoteDeleteIds(): Set<String> =
        outbox.mapNotNull { m ->
            if (m.type == "note.delete") m.payload["id"] else null
        }.toSet()

    suspend fun pushExpense(
        name: String,
        amountInr: Int,
        category: String,
        dateIso: String?,
    ): Result<Unit> = pushMoneyTransaction(
        name = name,
        amountInr = amountInr,
        category = category,
        dateIso = dateIso,
        type = "expense",
    )

    suspend fun pushMoneyTransaction(
        name: String,
        amountInr: Int,
        category: String,
        dateIso: String?,
        type: String,
        clientKey: String? = null,
    ): Result<Unit> {
        // Website EntryForm: expenses are negative amounts.
        val signed = when (type.lowercase()) {
            "expense" -> -abs(amountInr.toDouble())
            "income" -> abs(amountInr.toDouble())
            else -> amountInr.toDouble()
        }
        val req = CreateMoneyTransactionRequest(
            amount = signed,
            type = type,
            category = category,
            description = name,
            date = dateIso,
            notes = clientKey?.let { "mobile:$it" },
            source = "mobile",
        )
        if (!session.state.value.isSignedIn) {
            enqueueMoney(req)
            return Result.failure(IllegalStateException("Not signed in — queued"))
        }
        return runCatching {
            api.createMoneyTransaction(req, idempotencyKey = clientKey ?: UUID.randomUUID().toString())
            Unit
        }.onFailure {
            enqueueMoney(req)
        }
    }

    fun pendingCount(): Int = outbox.size + moneyOutbox.size + speaking.pendingCount()

    fun clearOutboxes() {
        outbox.clear()
        moneyOutbox.clear()
        speaking.clearPending()
        _ui.update { it.copy(pendingOutbox = 0) }
        scope.launch { persistOutbox() }
    }

    private fun enqueueMutation(m: SyncMutationDto) {
        outbox += m
        _ui.update { it.copy(pendingOutbox = pendingCount()) }
        scope.launch { persistOutbox() }
    }

    private fun enqueueMoney(req: CreateMoneyTransactionRequest) {
        // Same clientKey / notes = same payment — never double-queue retries.
        val key = req.notes
        if (key != null && moneyOutbox.any { it.notes == key }) {
            return
        }
        moneyOutbox += req
        _ui.update { it.copy(pendingOutbox = pendingCount()) }
        scope.launch { persistOutbox() }
    }

    private suspend fun flushOutbox() {
        if (outbox.isEmpty()) return
        val batch = outbox.toList()
        val res = api.syncBatch(
            SyncBatchRequest(mutations = batch),
            idempotencyKey = UUID.randomUUID().toString(),
        )
        // Drop every mutation the server answered — ok or fail.
        // Leaving ok=false forever made Config show "14 pending" with no escape.
        val answered = res.results.mapNotNull { it.id }.toSet()
        val failMsg = res.results.firstOrNull { it.ok != true }?.error
        outbox.removeAll { it.id in answered }
        persistOutbox()
        _ui.update {
            it.copy(
                pendingOutbox = pendingCount(),
                lastError = failMsg?.take(80) ?: it.lastError,
            )
        }
    }

    private suspend fun flushMoneyOutbox() {
        if (moneyOutbox.isEmpty()) return
        val remaining = mutableListOf<CreateMoneyTransactionRequest>()
        for (req in moneyOutbox.toList()) {
            val key = req.notes?.removePrefix("mobile:")?.takeIf { it.isNotBlank() }
                ?: UUID.randomUUID().toString()
            val ok = runCatching {
                api.createMoneyTransaction(req, idempotencyKey = key)
            }.isSuccess
            if (!ok) remaining += req
        }
        moneyOutbox.clear()
        moneyOutbox.addAll(remaining)
        persistOutbox()
        _ui.update { it.copy(pendingOutbox = pendingCount()) }
    }

    private suspend fun hydrateOutbox() = mutex.withLock {
        if (hydrated) return
        val snap = prefs.read()
        runCatching {
            val raw = snap.outboxJson
            if (!raw.isNullOrBlank()) {
                val loaded = json.decodeFromString(ListSerializer(SyncMutationDto.serializer()), raw)
                val seen = outbox.map { it.id }.toHashSet()
                loaded.forEach { m ->
                    if (m.id !in seen) {
                        outbox += m
                        seen += m.id
                    }
                }
            }
        }
        runCatching {
            val raw = snap.moneyOutboxJson
            if (!raw.isNullOrBlank()) {
                moneyOutbox.addAll(
                    json.decodeFromString(
                        ListSerializer(CreateMoneyTransactionRequest.serializer()),
                        raw,
                    ),
                )
            }
        }
        hydrated = true
        _ui.update { it.copy(pendingOutbox = pendingCount()) }
    }

    private suspend fun persistOutbox() = mutex.withLock {
        prefs.writeOutboxJson(
            json.encodeToString(ListSerializer(SyncMutationDto.serializer()), outbox.toList()),
        )
        prefs.writeMoneyOutboxJson(
            json.encodeToString(
                ListSerializer(CreateMoneyTransactionRequest.serializer()),
                moneyOutbox.toList(),
            ),
        )
    }

    private suspend fun applyBootstrap(boot: aiimin.core.network.BootstrapResponse) {
        val completed = pendingHabitOverlay().apply(boot.habitCompletedToday.toSet())
        day.hydrateFromBootstrap(
            habits = boot.habits,
            completedToday = completed,
            userName = boot.user?.name,
        )
        journal.hydrateFromBootstrap(boot.journal)
        notes.hydrateFromBootstrap(boot.notes, excludeIds = pendingNoteDeleteIds())
        agenda.hydrateFromBootstrap(boot.agenda)
        vaultLists.hydrate(boot.familyDocuments, boot.resumes, boot.goals)
        publishedScore.hydrateFromBootstrap(boot.lifeScore)
        boot.user?.let { user ->
            config.applyRemoteIdentity(
                name = user.name,
                email = user.email,
                username = user.username,
            )
        }
    }

    /** Never treat a failed GET as “empty ledger”. */
    private suspend fun hydrateMoneySafe() {
        val tx = runCatching { api.moneyTransactions() }
        val budgets = runCatching { api.moneyBudgets() }
        if (tx.isFailure || budgets.isFailure) return
        money.hydrateFromApi(tx.getOrThrow(), budgets.getOrThrow())
    }

    private suspend fun hydrateLifeScoreSafe() {
        runCatching { api.lifeHealth(days = 14) }
            .onSuccess { publishedScore.hydrateFromApi(it) }
    }

    private suspend fun hydrateLabSafe() {
        runCatching { api.correlations() }
            .onSuccess { lab.applyRemote(it) }
    }

    private suspend fun hydrateSpeakingSafe() {
        runCatching { api.labSummary() }
            .onSuccess { speaking.hydrateSummary(it.practice?.speaking) }
    }

    private suspend fun flushSpeakingOutbox() {
        val pending = speaking.pendingRequests()
        if (pending.isEmpty()) return
        for (req in pending) {
            val ok = runCatching { api.postSpeakingPractice(req) }.isSuccess
            if (ok) speaking.removePending(req)
        }
        if (speaking.pendingCount() == 0) speaking.markAllSynced()
        _ui.update { it.copy(pendingOutbox = pendingCount()) }
    }

    private fun friendly(e: Exception): String = when {
        e is HttpException && e.code() == 401 -> "Session expired — sign in again"
        e is HttpException -> "Sync failed (${e.code()})"
        else -> e.message?.take(80) ?: "Sync failed"
    }
}
