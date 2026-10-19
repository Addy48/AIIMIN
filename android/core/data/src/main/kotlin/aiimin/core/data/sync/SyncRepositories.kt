package aiimin.core.data.sync

import aiimin.core.data.core.Crypto
import aiimin.core.data.core.DayClock
import aiimin.core.data.core.EventLogger
import aiimin.core.data.plan.GoalRepository
import aiimin.core.data.plan.Milestone
import aiimin.core.data.settings.SettingsStore
import aiimin.core.data.settings.SyncKinds
import aiimin.core.data.util.AppJson
import aiimin.core.data.util.newId
import aiimin.core.database.CalendarDao
import aiimin.core.database.CalendarEventEntity
import aiimin.core.database.GoalDao
import aiimin.core.database.GoalEntity
import aiimin.core.database.JournalDao
import aiimin.core.database.MinimumDao
import aiimin.core.database.MinimumEntity
import aiimin.core.database.MinimumTickEntity
import aiimin.core.database.MoneyDao
import aiimin.core.database.NoteDao
import aiimin.core.database.NoteEntity
import aiimin.core.database.SyncConflictEntity
import aiimin.core.database.SyncMetaDao
import aiimin.core.database.SyncShadowEntity
import aiimin.core.database.TaskDao
import aiimin.core.database.TaskEntity
import aiimin.core.database.TxnEntity
import aiimin.core.engine.Tier
import aiimin.core.network.AiiminApi
import aiimin.core.network.ApiAuth
import aiimin.core.network.CalendarEventDto
import aiimin.core.network.CalendarEventRequest
import aiimin.core.network.CreateMoneyTransactionRequest
import aiimin.core.network.CreateTaskRequest
import aiimin.core.network.GoalRequest
import aiimin.core.network.HabitRequest
import aiimin.core.network.MilestoneDto
import aiimin.core.network.RemoteGoalDto
import aiimin.core.network.RemoteHabitDto
import aiimin.core.network.SyncBatchRequest
import aiimin.core.network.SyncMutationDto
import aiimin.core.network.UpdateTaskRequest
import java.io.IOException
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.serialization.builtins.ListSerializer
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.booleanOrNull
import kotlinx.serialization.json.contentOrNull
import kotlinx.serialization.json.jsonPrimitive
import retrofit2.HttpException

data class SyncReport(val pushed: Int, val pulled: Int, val failed: Int, val conflicts: Int, val at: Long)

/** What the sync icon, the Sync sheet and the Sync settings page show. */
sealed interface SyncState {
    data object SignedOut : SyncState
    data class Idle(val lastAt: Long?) : SyncState
    data object Syncing : SyncState
    data object Offline : SyncState
    data class Attention(val message: String) : SyncState
}

/** Counts on each side, for the "bring your data here?" choice after a first sign-in. */
data class MergePreview(val webTasks: Int, val webNotes: Int, val webPayments: Int, val phoneTasks: Int, val phoneNotes: Int, val phonePayments: Int) {
    val webHasData get() = webTasks + webNotes + webPayments > 0
    val phoneHasData get() = phoneTasks + phoneNotes + phonePayments > 0
}

/** Running totals for one sync pass. */
private class Tally {
    var pushed = 0
    var pulled = 0
    var failed = 0
    var conflicts = 0
}

/**
 * Keeps the phone and aiimin.in in step. Local-first: everything works offline and catches up
 * when it can. What leaves the phone is limited to the switches on the Sync settings page; journal
 * text only goes if its own switch is on. Synced data is stored as plain text on the server; there
 * is no end-to-end encryption. Documents, bank-SMS text, emergency cards and health samples never sync.
 *
 * Each item that exists on both sides is settled with a three-way merge against the last state
 * both agreed on (the shadow). One side changed: that change wins. Both changed: the item is held
 * as a conflict for the person to choose (G5). A delete on either side is a delete on both, and the
 * phone keeps deleted items in Trash for 30 days.
 */
@Singleton
class SyncRepository @Inject constructor(
    @dagger.hilt.android.qualifiers.ApplicationContext private val appContext: android.content.Context,
    private val api: AiiminApi,
    private val auth: AuthRepository,
    private val tasks: TaskDao,
    private val notes: NoteDao,
    private val money: MoneyDao,
    private val calendar: CalendarDao,
    private val goals: GoalDao,
    private val minimums: MinimumDao,
    private val journal: JournalDao,
    private val meta: SyncMetaDao,
    private val crypto: Crypto,
    private val settings: SettingsStore,
    private val clock: DayClock,
    private val log: EventLogger,
) {
    private val mutex = Mutex()
    private val _state = MutableStateFlow<SyncState>(SyncState.SignedOut)
    val state: StateFlow<SyncState> = _state.asStateFlow()

    /** Consecutive failed runs and when the next automatic try is allowed (exponential backoff). */
    @Volatile private var failures = 0
    @Volatile private var nextTryAt = 0L

    val openConflicts = meta.openConflicts()

    /** Called at launch and after sign-in/out so the icon is right before the first sync. */
    suspend fun refreshState() {
        _state.value = if (auth.current().signedIn) SyncState.Idle(settings.current().lastSyncAt) else SyncState.SignedOut
    }

    /** First sign-in: how much is on each side, before anything is merged. */
    suspend fun previewMerge(): MergePreview? {
        val s = auth.current()
        if (!s.signedIn) return null
        ApiAuth.set(s.token)
        return try {
            val webTasks = api.tasks(null).data.size
            val webNotes = api.bootstrap().notes.size
            val webPay = api.moneyTransactions().size
            MergePreview(webTasks, webNotes, webPay, tasks.withRemote().size + tasks.unsynced().size, notes.dirty().size, money.count())
        } catch (_: Exception) { null }
    }

    /**
     * Forget every tie to the account (after sign-out, or after the server copy was wiped). Nothing on
     * the phone is removed; the next sign-in starts a fresh merge, so another account never sees this
     * phone's items as "deleted on the web".
     */
    suspend fun unlinkAll() = mutex.withLock {
        meta.unlinkTasks(); meta.unlinkNotes(); meta.unlinkTxns(); meta.unlinkEvents()
        meta.unlinkGoals(); meta.unlinkMinimums(); meta.unlinkTicks(); meta.unlinkJournal()
        meta.clearShadows()
        meta.clearConflicts()
        settings.update { it.copy(lastSyncAt = null) }
        failures = 0
        nextTryAt = 0
    }

    /** What "Replace this phone's data" would do, measured before anything changes. */
    data class ReplacePlan(
        val tasks: Int, val notes: Int, val events: Int, val goals: Int,
        val webTasks: Int, val webNotes: Int, val webEvents: Int, val webGoals: Int,
        /** Null when it is safe to go ahead; otherwise why it is refused. */
        val blocked: String?,
    ) {
        val total get() = tasks + notes + events + goals
    }

    private val replacePrefs by lazy { appContext.getSharedPreferences("replace_undo", android.content.Context.MODE_PRIVATE) }

    /**
     * Guardrails for AU3: signed in, online, the web answered for every kind, and only kinds that
     * are switched on in Sync settings and that the web actually has something for are replaced.
     * Family tasks and undated (Someday) tasks are never touched: the web can't hold them.
     */
    suspend fun planReplace(): ReplacePlan {
        val s = auth.current()
        fun blocked(why: String) = ReplacePlan(0, 0, 0, 0, 0, 0, 0, 0, why)
        if (!s.signedIn) return blocked("Sign in first.")
        ApiAuth.set(s.token)
        val scope = settings.current().syncScope
        val today = clock.today()
        val zone = ZoneId.systemDefault()
        val web = try {
            listOf(
                if (SyncKinds.TASKS in scope) api.tasks(null).data.size else 0,
                if (SyncKinds.NOTES in scope) api.bootstrap().notes.size else 0,
                if (SyncKinds.CALENDAR in scope) api.calendarEvents(today.minusDays(30).atStartOfDay(zone).toInstant().toString(), today.plusDays(180).atStartOfDay(zone).toInstant().toString()).size else 0,
                if (SyncKinds.GOALS in scope) api.goals().size else 0,
            )
        } catch (_: IOException) {
            return blocked("You're offline. Nothing was changed.")
        } catch (_: Exception) {
            return blocked("aiimin.in didn't answer properly. Nothing was changed.")
        }
        val (wt, wn, we, wg) = web
        if (wt + wn + we + wg == 0) return blocked("aiimin.in has nothing to bring in, so this phone's data was kept.")
        return ReplacePlan(
            tasks = if (wt > 0) replaceableTasks().size else 0,
            notes = if (wn > 0) replaceableNotes().size else 0,
            events = if (we > 0) calendar.unsynced().size else 0,
            goals = if (wg > 0) goals.unsynced().size else 0,
            webTasks = wt, webNotes = wn, webEvents = we, webGoals = wg, blocked = null,
        )
    }

    private suspend fun replaceableTasks() = tasks.unsynced().filter { it.assignee == null && it.day != null }
    private suspend fun replaceableNotes() = notes.dirty().filter { it.remoteId == null && !it.deleted }

    /**
     * AU3 "Replace this phone's data", only after [planReplace] said yes: the phone-only items of
     * the kinds the web has go to Trash (restorable for 30 days, or all at once with
     * [undoReplace]), then a sync brings in the web's copy. Payments, journal and documents are
     * never touched. Re-checks the plan right before acting, so a stale screen can't trigger it.
     */
    suspend fun replaceLocalWithWeb(): SyncReport? {
        val plan = planReplace()
        if (plan.blocked != null) { _state.value = SyncState.Attention(plan.blocked); return null }
        val now = System.currentTimeMillis()
        val moved = mutableListOf<String>()
        if (plan.webTasks > 0) replaceableTasks().forEach { tasks.upsert(it.copy(deleted = true, updatedAt = now)); moved += "${KIND_TASK}:${it.id}" }
        if (plan.webNotes > 0) replaceableNotes().forEach { notes.upsert(it.copy(deleted = true, dirty = false, updatedAt = now)); moved += "${KIND_NOTE}:${it.id}" }
        if (plan.webEvents > 0) calendar.unsynced().forEach { calendar.upsert(it.copy(deleted = true, updatedAt = now)); moved += "${KIND_EVENT}:${it.id}" }
        if (plan.webGoals > 0) goals.unsynced().forEach { goals.upsert(it.copy(deleted = true, updatedAt = now)); moved += "${KIND_GOAL}:${it.id}" }
        replacePrefs.edit().putString("ids", moved.joinToString(",")).putLong("at", now).apply()
        log.log("sync.replace_local", data = mapOf("moved" to moved.size), tier = Tier.A, source = "user")
        return sync(force = true)
    }

    /** When the last replace happened and how many items it moved, while it can still be undone. */
    fun lastReplace(): Pair<Long, Int>? {
        val at = replacePrefs.getLong("at", 0L)
        val ids = replacePrefs.getString("ids", "").orEmpty().split(",").filter { it.isNotBlank() }
        return if (at == 0L || ids.isEmpty() || System.currentTimeMillis() - at > 30L * 86_400_000L) null else at to ids.size
    }

    /** Brings back everything the last replace moved to Trash (it then syncs up as new items). */
    suspend fun undoReplace(): Int {
        val ids = replacePrefs.getString("ids", "").orEmpty().split(",").filter { it.isNotBlank() }
        val now = System.currentTimeMillis()
        var n = 0
        for (k in ids) {
            val (kind, id) = k.split(":", limit = 2).let { it[0] to it.getOrElse(1) { "" } }
            when (kind) {
                KIND_TASK -> tasks.get(id)?.takeIf { it.deleted }?.let { tasks.upsert(it.copy(deleted = false, updatedAt = now)); n++ }
                KIND_NOTE -> notes.get(id)?.takeIf { it.deleted }?.let { notes.upsert(it.copy(deleted = false, dirty = true, updatedAt = now)); n++ }
                KIND_EVENT -> calendar.get(id)?.takeIf { it.deleted }?.let { calendar.upsert(it.copy(deleted = false, updatedAt = now)); n++ }
                KIND_GOAL -> goals.get(id)?.takeIf { it.deleted }?.let { goals.upsert(it.copy(deleted = false, updatedAt = now)); n++ }
            }
        }
        replacePrefs.edit().clear().apply()
        log.log("sync.replace_undo", data = mapOf("restored" to n), tier = Tier.A, source = "user")
        return n
    }

    /**
     * One full pass. Automatic callers pass [force] = false and are held back while the backoff
     * window from earlier failures is open; "Sync now" passes true.
     */
    suspend fun sync(force: Boolean = true): SyncReport? = mutex.withLock {
        val s = auth.current()
        if (!s.signedIn) { _state.value = SyncState.SignedOut; return null }
        if (!force && System.currentTimeMillis() < nextTryAt) return null
        ApiAuth.set(s.token)
        _state.value = SyncState.Syncing
        val cfg = settings.current()
        val since = cfg.lastSyncAt ?: 0L
        val t = Tally()
        val scope = cfg.syncScope
        val steps = buildList<Pair<String, suspend () -> Unit>> {
            if (SyncKinds.TASKS in scope) add("tasks" to suspend { syncTasks(since, t) })
            if (SyncKinds.NOTES in scope) add("notes" to suspend { syncNotes(since, t) })
            if (SyncKinds.MONEY in scope) add("money" to suspend { syncMoney(t) })
            if (SyncKinds.CALENDAR in scope) add("calendar" to suspend { syncCalendar(since, t) })
            if (SyncKinds.GOALS in scope) add("goals" to suspend { syncGoals(since, t) })
            if (SyncKinds.MINIMUMS in scope) add("minimums" to suspend { syncMinimums(since, t) })
            if (cfg.journalSync) add("journal" to suspend { syncJournal(t) })
        }
        for ((name, step) in steps) {
            try {
                step()
            } catch (_: IOException) {
                return fail(SyncState.Offline)
            } catch (e: HttpException) {
                if (e.code() == 401) return fail(SyncState.Attention("Sign in again to keep syncing"))
                // One kind failing (server error) does not stop the others.
                t.failed++
                log.log("sync.error", data = mapOf("kind" to name, "code" to e.code()), tier = Tier.A, source = "system")
            } catch (e: kotlinx.serialization.SerializationException) {
                t.failed++
                log.log("sync.error", data = mapOf("kind" to name, "parse" to true), tier = Tier.A, source = "system")
            }
        }
        val now = System.currentTimeMillis()
        settings.update { it.copy(lastSyncAt = now) }
        meta.purgeResolved(now - 30L * 86_400_000L)
        if (t.failed > 0) {
            failures++
            nextTryAt = now + Backoff.delayFor(failures)
        } else {
            failures = 0
            nextTryAt = 0
        }
        _state.value = when {
            t.conflicts > 0 -> SyncState.Attention("${t.conflicts} ${if (t.conflicts == 1) "change needs" else "changes need"} your choice")
            t.failed > 0 -> SyncState.Attention("${t.failed} ${if (t.failed == 1) "item" else "items"} didn't sync. They'll retry.")
            else -> SyncState.Idle(now)
        }
        log.log("sync", data = mapOf("pushed" to t.pushed, "pulled" to t.pulled, "failed" to t.failed, "conflicts" to t.conflicts), tier = Tier.A, source = "system")
        return SyncReport(t.pushed, t.pulled, t.failed, t.conflicts, now)
    }

    private fun fail(state: SyncState): SyncReport? {
        failures++
        nextTryAt = System.currentTimeMillis() + Backoff.delayFor(failures)
        _state.value = state
        return null
    }

    /** True while the last run failed and the next automatic one is waiting. */
    fun retryAt(): Long? = nextTryAt.takeIf { it > System.currentTimeMillis() }

    // ------------------------------------------------------------------ shared merge step

    /**
     * Settles one linked item. Returns what happened so the caller can count it.
     * While a conflict for the item is open nothing moves; the person decides first.
     */
    private suspend fun settle(
        t: Tally, kind: String, localId: String, remoteId: String, title: String,
        local: String, remote: String, localChanged: Boolean,
        applyRemote: suspend () -> Unit, pushLocal: suspend () -> Unit,
    ): MergeOutcome {
        if (meta.openFor(kind, localId) != null) { t.conflicts++; return MergeOutcome.CONFLICT }
        val base = meta.shadow(kind, localId)?.snapshot
        val outcome = Merge.decide(base, local, remote, localChanged)
        when (outcome) {
            MergeOutcome.SAME -> shadow(kind, localId, local)
            MergeOutcome.TAKE_REMOTE -> { applyRemote(); shadow(kind, localId, remote); t.pulled++ }
            MergeOutcome.PUSH_LOCAL -> try {
                pushLocal(); shadow(kind, localId, local); t.pushed++
            } catch (e: Exception) { rethrowNetwork(e); t.failed++ }
            MergeOutcome.CONFLICT -> {
                meta.putConflict(SyncConflictEntity(newId(), kind, localId, remoteId, title, local, remote, System.currentTimeMillis()))
                t.conflicts++
            }
        }
        return outcome
    }

    private suspend fun shadow(kind: String, localId: String, snap: String) =
        meta.putShadow(SyncShadowEntity(kind, localId, snap, System.currentTimeMillis()))

    // ------------------------------------------------------------------ tasks

    private fun taskSnap(title: String, done: Boolean) = Snap.of("title" to title, "done" to done)

    private suspend fun syncTasks(since: Long, t: Tally) {
        // Deletes made on the phone.
        for (task in tasks.deletedWithRemote()) {
            try {
                api.deleteTask(task.remoteId!!)
                tasks.upsert(task.copy(remoteId = null))
                meta.dropShadow(KIND_TASK, task.id)
                t.pushed++
            } catch (e: Exception) { rethrowNetwork(e); t.failed++ }
        }
        val remote = api.tasks(null).data.filter { it.id != null && !it.title.isNullOrBlank() }
        val byId = remote.associateBy { it.id!! }
        val linked = tasks.withRemote().map { it.remoteId }.toMutableSet()
        val today = clock.today()

        // Link pairs that were made separately on both sides (same title and day) instead of doubling them.
        val unlinkedRemote = remote.filter { it.id !in linked }.groupBy { Dedupe.taskKey(it.title, it.dueDate) }.mapValues { it.value.toMutableList() }.toMutableMap()
        for (local in tasks.unsynced().filter { it.assignee == null }) {
            val match = unlinkedRemote[Dedupe.taskKey(local.title, local.day)]?.removeFirstOrNull() ?: continue
            tasks.upsert(local.copy(remoteId = match.id))
            linked += match.id
            shadow(KIND_TASK, local.id, taskSnap(match.title!!.trim(), match.completed == true))
        }

        // Settle everything linked.
        for (local in tasks.withRemote().filter { it.assignee == null }) {
            val dto = byId[local.remoteId] ?: continue
            val rTitle = dto.title!!.trim()
            val rDone = dto.completed == true
            settle(
                t, KIND_TASK, local.id, dto.id!!, local.title,
                taskSnap(local.title, local.done), taskSnap(rTitle, rDone), local.updatedAt > since,
                applyRemote = { applyTask(local, rTitle, rDone) },
                pushLocal = { api.updateTask(dto.id!!, UpdateTaskRequest(completed = local.done, title = local.title)) },
            )
        }

        // New on the web.
        for (dto in remote.filter { it.id !in linked }) {
            val done = dto.completed == true
            val day = dto.dueDate?.take(10)?.let { runCatching { LocalDate.parse(it) }.getOrNull() }
            // Skip long-finished history; keep everything open and everything recent.
            if (done && day != null && day.isBefore(today.minusDays(14))) continue
            val now = System.currentTimeMillis()
            val id = newId()
            tasks.upsert(
                TaskEntity(
                    id = id, title = dto.title!!.trim(), day = (day ?: today).toString(), time = dto.dueTime?.take(5), part = null,
                    createdAt = now, scheduledAt = now, done = done, doneAt = if (done) now else null,
                    doneDay = if (done) today.toString() else null, remoteId = dto.id, updatedAt = now,
                ),
            )
            shadow(KIND_TASK, id, taskSnap(dto.title!!.trim(), done))
            t.pulled++
        }

        // New on the phone. Undated (Someday) and family tasks stay here: the web has no place for them.
        for (local in tasks.unsynced().filter { it.assignee == null && it.day != null }) {
            try {
                api.createTask(CreateTaskRequest(local.title, local.day, local.time)).data?.id?.let { rid ->
                    if (local.done) api.updateTask(rid, UpdateTaskRequest(completed = true))
                    tasks.upsert(local.copy(remoteId = rid))
                    shadow(KIND_TASK, local.id, taskSnap(local.title, local.done))
                    t.pushed++
                }
            } catch (e: Exception) { rethrowNetwork(e); t.failed++ }
        }

        // Deleted on the web: to Trash here, unless the phone changed it since; then it goes back up.
        val goneTasks = tasks.withRemote().filter { it.remoteId !in byId && it.assignee == null }
        if (since > 0 && massDelete(goneTasks.size, tasks.withRemote().size, t, "tasks")) return
        if (since > 0) for (local in goneTasks) {
            if (local.updatedAt > since) tasks.upsert(local.copy(remoteId = null))
            else tasks.upsert(local.copy(deleted = true, remoteId = null, updatedAt = System.currentTimeMillis()))
            meta.dropShadow(KIND_TASK, local.id)
            t.pulled++
        }
    }

    private suspend fun applyTask(local: TaskEntity, title: String, done: Boolean) {
        val now = System.currentTimeMillis()
        val today = clock.today().toString()
        tasks.upsert(
            local.copy(
                title = title, done = done,
                doneAt = if (done) local.doneAt ?: now else null,
                doneDay = if (done) local.doneDay ?: today else null,
                updatedAt = now,
            ),
        )
    }

    // ------------------------------------------------------------------ notes

    private fun noteSnap(title: String, body: String, pinned: Boolean) = Snap.of("title" to title, "body" to body, "pinned" to pinned)

    private suspend fun syncNotes(since: Long, t: Tally) {
        val remote = api.bootstrap().notes.filter { it.id != null }
        val byId = remote.associateBy { it.id!! }
        val toPush = mutableListOf<NoteEntity>()

        // Phone edits to notes the web also has: three-way check before anything is sent.
        for (n in notes.dirty()) {
            val rid = n.remoteId
            val dto = rid?.let { byId[it] }
            if (n.deleted || dto == null) { toPush += n; continue }
            if (meta.openFor(KIND_NOTE, n.id) != null) { t.conflicts++; continue }
            val mine = noteSnap(n.title, n.body, n.pinned)
            val theirs = noteSnap(dto.title.orEmpty(), dto.content.orEmpty(), dto.pinned == true)
            when (Merge.decide(meta.shadow(KIND_NOTE, n.id)?.snapshot, mine, theirs, localChanged = true)) {
                MergeOutcome.SAME -> { notes.upsert(n.copy(dirty = false)); shadow(KIND_NOTE, n.id, mine) }
                MergeOutcome.TAKE_REMOTE -> {
                    notes.upsert(n.copy(title = dto.title.orEmpty(), body = dto.content.orEmpty(), pinned = dto.pinned == true, dirty = false, updatedAt = remoteAt(dto.updatedAt)))
                    shadow(KIND_NOTE, n.id, theirs)
                    t.pulled++
                }
                // The shadow moves only once the server confirms (below).
                MergeOutcome.PUSH_LOCAL -> toPush += n
                MergeOutcome.CONFLICT -> {
                    meta.putConflict(SyncConflictEntity(newId(), KIND_NOTE, n.id, rid, n.title, mine, theirs, System.currentTimeMillis()))
                    t.conflicts++
                }
            }
        }
        // Brand-new phone notes that match a web note word for word are linked, not doubled.
        val unlinked = remote.filter { dto -> notes.byRemote(dto.id!!) == null && notes.get(dto.id!!) == null }
            .groupBy { Dedupe.noteKey(it.title, it.content) }.mapValues { it.value.toMutableList() }.toMutableMap()
        val linkedNow = mutableSetOf<String>()
        for (n in toPush.toList()) {
            if (n.remoteId != null || n.deleted) continue
            val match = unlinked[Dedupe.noteKey(n.title, n.body)]?.removeFirstOrNull() ?: continue
            notes.upsert(n.copy(remoteId = match.id, dirty = false))
            shadow(KIND_NOTE, n.id, noteSnap(n.title, n.body, n.pinned))
            linkedNow += match.id!!
            toPush.remove(n)
        }

        for (batch in toPush.chunked(50)) {
            try {
                val res = api.syncBatch(
                    SyncBatchRequest(batch.map { noteMutation(it) }),
                    idempotencyKey = "notes-" + batch.joinToString("") { it.id.take(4) + it.updatedAt }.hashCode(),
                )
                for (r in res.results) {
                    val n = batch.firstOrNull { it.id == r.id } ?: continue
                    if (r.ok == true) {
                        if (n.deleted) {
                            notes.upsert(n.copy(dirty = false, remoteId = null))
                            meta.dropShadow(KIND_NOTE, n.id)
                        } else {
                            val rid = r.entityId ?: n.remoteId ?: n.id
                            notes.upsert(n.copy(dirty = false, remoteId = rid))
                            shadow(KIND_NOTE, n.id, noteSnap(n.title, n.body, n.pinned))
                            linkedNow += rid
                        }
                        t.pushed++
                    } else t.failed++
                }
            } catch (e: Exception) { rethrowNetwork(e); t.failed++ }
        }

        // Notes written or edited on the website.
        for (dto in remote) {
            val rid = dto.id!!
            if (rid in linkedNow) continue
            val local = notes.byRemote(rid) ?: notes.get(rid)
            if (local == null) {
                val at = remoteAt(dto.updatedAt)
                notes.upsert(NoteEntity(rid, dto.title?.ifBlank { null } ?: "Untitled", dto.content.orEmpty(), pinned = dto.pinned == true, createdAt = at, updatedAt = at, remoteId = rid, dirty = false))
                shadow(KIND_NOTE, rid, noteSnap(dto.title?.ifBlank { null } ?: "Untitled", dto.content.orEmpty(), dto.pinned == true))
                t.pulled++
            } else if (!local.dirty && !local.deleted) {
                settle(
                    t, KIND_NOTE, local.id, rid, local.title,
                    noteSnap(local.title, local.body, local.pinned), noteSnap(dto.title.orEmpty(), dto.content.orEmpty(), dto.pinned == true), localChanged = false,
                    applyRemote = { notes.upsert(local.copy(title = dto.title.orEmpty(), body = dto.content.orEmpty(), pinned = dto.pinned == true, remoteId = rid, updatedAt = remoteAt(dto.updatedAt))) },
                    pushLocal = {},
                )
            }
        }
    }

    private fun remoteAt(iso: String?): Long = iso?.let { runCatching { Instant.parse(it).toEpochMilli() }.getOrNull() } ?: System.currentTimeMillis()

    private fun noteMutation(n: NoteEntity) = SyncMutationDto(
        id = n.id,
        type = if (n.deleted) "note.delete" else "note.upsert",
        payload = if (n.deleted) mapOf("id" to (n.remoteId ?: n.id)) else mapOf(
            "id" to (n.remoteId ?: n.id), "title" to n.title, "content" to n.body, "pinned" to n.pinned.toString(),
        ),
        clientMutatedAt = Instant.ofEpochMilli(n.updatedAt).toString(),
    )

    // ------------------------------------------------------------------ money

    private suspend fun syncMoney(t: Tally) {
        for (txn in money.deletedWithRemote()) {
            try {
                api.deleteMoneyTransaction(txn.remoteId!!)
                money.upsert(txn.copy(remoteId = "sent"))
                t.pushed++
            } catch (e: Exception) { rethrowNetwork(e); t.failed++ }
        }
        val from = clock.today().minusDays(90).toString()
        val to = clock.today().toString()
        val local = money.betweenNow(from, to)
        val remote = api.moneyTransactions().take(400)
        // A payment already on the web (same amount, day and name) is linked, not sent twice.
        val webKeys = remote.filter { it.id != null && money.byRemote(it.id!!) == null }.groupBy { dto ->
            Dedupe.moneyKey(Math.round(Math.abs(dto.amount ?: 0.0) * 100), dto.date?.take(10).orEmpty(), (dto.description ?: dto.name ?: dto.category ?: "Payment").trim())
        }.mapValues { it.value.toMutableList() }.toMutableMap()
        for (txn in local.filter { it.remoteId == null && !it.deleted && it.ledger == "PERSONAL" }.take(60)) {
            val match = webKeys[Dedupe.moneyKey(txn.amountPaise, txn.day, txn.title)]?.removeFirstOrNull()
            if (match != null) { money.upsert(txn.copy(remoteId = match.id)); continue }
            try {
                val dto = api.createMoneyTransaction(
                    CreateMoneyTransactionRequest(txn.amountPaise / 100.0, if (txn.direction == "in") "income" else "expense", txn.category, txn.title, txn.day, txn.note, "android"),
                    idempotencyKey = txn.id,
                )
                money.upsert(txn.copy(remoteId = dto.id ?: "sent"))
                t.pushed++
            } catch (e: Exception) { rethrowNetwork(e); t.failed++ }
        }
        // Payments logged on the web that the phone has never seen.
        val known = money.betweenNow(from, to).map { Dedupe.moneyKey(it.amountPaise, it.day, it.title) }.toMutableSet()
        for (dto in remote) {
            val rid = dto.id ?: continue
            if (money.byRemote(rid) != null) continue
            val day = dto.date?.take(10) ?: continue
            if (day < from) continue
            val paise = Math.round(Math.abs(dto.amount ?: 0.0) * 100)
            val title = (dto.description ?: dto.name ?: dto.category ?: "Payment").trim()
            val key = Dedupe.moneyKey(paise, day, title)
            if (paise == 0L || key in known) continue
            known += key
            val at = runCatching { LocalDate.parse(day).atTime(12, 0).atZone(ZoneId.systemDefault()).toInstant().toEpochMilli() }.getOrDefault(System.currentTimeMillis())
            money.upsert(
                TxnEntity(
                    id = newId(), at = at, day = day, amountPaise = paise, direction = if (dto.type == "income") "in" else "out", title = title,
                    category = dto.category ?: "Other", method = "BANK", source = "web", note = dto.notes.orEmpty(), remoteId = rid, createdAt = System.currentTimeMillis(),
                ),
            )
            t.pulled++
        }
    }

    // ------------------------------------------------------------------ calendar

    private fun eventSnap(title: String, start: Long, end: Long, allDay: Boolean, location: String) =
        Snap.of("title" to title, "start" to start, "end" to end, "allDay" to allDay, "location" to location)

    private fun eventSnap(e: CalendarEventEntity) = eventSnap(e.title, e.startAt, e.endAt, e.allDay, e.location)

    private fun eventSnap(d: CalendarEventDto): String {
        val start = millis(d.startTime) ?: 0L
        return eventSnap(d.title.orEmpty().trim(), start, millis(d.endTime) ?: start, d.allDay == true, d.location.orEmpty())
    }

    private fun millis(iso: String?): Long? = iso?.let { runCatching { Instant.parse(it).toEpochMilli() }.getOrNull() }

    private fun eventRequest(e: CalendarEventEntity) = CalendarEventRequest(
        title = e.title, startTime = Instant.ofEpochMilli(e.startAt).toString(), endTime = Instant.ofEpochMilli(e.endAt).toString(),
        allDay = e.allDay, location = e.location.ifBlank { null }, reminderMinutes = e.remindMin, eventType = "event",
    )

    private suspend fun syncCalendar(since: Long, t: Tally) {
        for (e in calendar.deletedWithRemote()) {
            try {
                api.deleteCalendarEvent(e.remoteId!!)
                calendar.upsert(e.copy(remoteId = null))
                meta.dropShadow(KIND_EVENT, e.id)
                t.pushed++
            } catch (ex: Exception) { rethrowNetwork(ex); t.failed++ }
        }
        val today = clock.today()
        val zone = ZoneId.systemDefault()
        val winStart = today.minusDays(30).atStartOfDay(zone).toInstant()
        val winEnd = today.plusDays(180).atStartOfDay(zone).toInstant()
        val remote = api.calendarEvents(winStart.toString(), winEnd.toString()).filter { it.id != null && !it.title.isNullOrBlank() && millis(it.startTime) != null }
        val byId = remote.associateBy { it.id!! }
        val linked = calendar.withRemote().mapNotNull { it.remoteId }.toMutableSet()

        val unlinked = remote.filter { it.id !in linked }.groupBy { Dedupe.eventKey(it.title, millis(it.startTime)!!) }.mapValues { it.value.toMutableList() }.toMutableMap()
        for (local in calendar.unsynced()) {
            val match = unlinked[Dedupe.eventKey(local.title, local.startAt)]?.removeFirstOrNull() ?: continue
            calendar.upsert(local.copy(remoteId = match.id))
            linked += match.id!!
            shadow(KIND_EVENT, local.id, eventSnap(match))
        }

        for (local in calendar.withRemote()) {
            val dto = byId[local.remoteId] ?: continue
            settle(
                t, KIND_EVENT, local.id, dto.id!!, local.title,
                eventSnap(local), eventSnap(dto), local.updatedAt > since,
                applyRemote = { applyEvent(local, dto) },
                pushLocal = { api.updateCalendarEvent(dto.id!!, eventRequest(local)) },
            )
        }

        for (dto in remote.filter { it.id !in linked }) {
            val start = millis(dto.startTime)!!
            val id = newId()
            calendar.upsert(
                CalendarEventEntity(
                    id = id, title = dto.title!!.trim(), startAt = start, endAt = (millis(dto.endTime) ?: start).coerceAtLeast(start),
                    allDay = dto.allDay == true, location = dto.location.orEmpty(),
                    source = if (dto.sourceType == "google") "google" else "web",
                    remindMin = dto.reminderMinutes, updatedAt = System.currentTimeMillis(), remoteId = dto.id,
                ),
            )
            shadow(KIND_EVENT, id, eventSnap(dto))
            t.pulled++
        }

        for (local in calendar.unsynced()) {
            try {
                val dto = api.createCalendarEvent(eventRequest(local))
                val rid = dto.id ?: continue
                calendar.upsert(local.copy(remoteId = rid))
                shadow(KIND_EVENT, local.id, eventSnap(local))
                t.pushed++
            } catch (e: Exception) { rethrowNetwork(e); t.failed++ }
        }

        // Gone from the web inside the window we asked for: deleted there.
        if (since > 0) {
            val from = winStart.toEpochMilli()
            val to = winEnd.toEpochMilli()
            val gone = calendar.withRemote().filter { it.remoteId !in byId && it.startAt in from..to }
            if (massDelete(gone.size, calendar.withRemote().count { it.startAt in from..to }, t, "events")) return
            for (local in gone) {
                if (local.updatedAt > since) calendar.upsert(local.copy(remoteId = null))
                else calendar.upsert(local.copy(deleted = true, remoteId = null, updatedAt = System.currentTimeMillis()))
                meta.dropShadow(KIND_EVENT, local.id)
                t.pulled++
            }
        }
    }

    private suspend fun applyEvent(local: CalendarEventEntity, dto: CalendarEventDto) {
        val start = millis(dto.startTime) ?: local.startAt
        calendar.upsert(
            local.copy(
                title = dto.title.orEmpty().trim().ifBlank { local.title }, startAt = start,
                endAt = (millis(dto.endTime) ?: start).coerceAtLeast(start), allDay = dto.allDay == true,
                location = dto.location.orEmpty(), updatedAt = System.currentTimeMillis(),
            ),
        )
    }

    // ------------------------------------------------------------------ goals

    private val milestoneSer = ListSerializer(Milestone.serializer())

    private fun goalSnap(title: String, why: String, due: String?, archived: Boolean, milestones: List<Milestone>) =
        Snap.of("title" to title, "why" to why, "due" to due, "archived" to archived, "milestones" to milestones.joinToString("\n") { (if (it.done) "x " else "o ") + it.t })

    private fun localMilestones(g: GoalEntity): List<Milestone> = runCatching { AppJson.decodeFromString(milestoneSer, g.milestones) }.getOrDefault(emptyList())

    private fun goalSnap(g: GoalEntity) = goalSnap(g.title, g.why, g.due, g.archived, localMilestones(g))

    private fun remoteMilestones(d: RemoteGoalDto): List<Milestone> = (d.milestones as? JsonArray).orEmpty().mapNotNull { el ->
        val o = el as? JsonObject ?: return@mapNotNull null
        val text = (o["text"] ?: o["title"] ?: o["t"])?.jsonPrimitive?.contentOrNull?.trim().orEmpty()
        if (text.isEmpty()) null else Milestone(text, o["done"]?.jsonPrimitive?.booleanOrNull == true)
    }

    private fun remoteArchived(d: RemoteGoalDto) = d.status == "archived" || d.status == "completed"

    private fun goalSnap(d: RemoteGoalDto) = goalSnap(
        (d.title ?: d.metric).orEmpty().trim(), d.why.orEmpty(), d.targetDate?.take(10), remoteArchived(d), remoteMilestones(d),
    )

    private fun goalRequest(g: GoalEntity) = GoalRequest(
        title = g.title, why = g.why.ifBlank { null }, targetDate = g.due,
        status = if (g.archived) "archived" else "in_progress",
        milestones = localMilestones(g).map { MilestoneDto(it.t, it.done) }, category = "life",
    )

    private suspend fun syncGoals(since: Long, t: Tally) {
        for (g in goals.deletedWithRemote()) {
            try {
                api.deleteGoal(g.remoteId!!)
                goals.upsert(g.copy(remoteId = null))
                meta.dropShadow(KIND_GOAL, g.id)
                t.pushed++
            } catch (e: Exception) { rethrowNetwork(e); t.failed++ }
        }
        val remote = api.goals().filter { it.id != null && !(it.title ?: it.metric).isNullOrBlank() }
        val byId = remote.associateBy { it.id!! }
        val linked = goals.withRemote().mapNotNull { it.remoteId }.toMutableSet()

        val unlinked = remote.filter { it.id !in linked }.groupBy { Dedupe.nameKey(it.title ?: it.metric) }.mapValues { it.value.toMutableList() }.toMutableMap()
        for (local in goals.unsynced()) {
            val match = unlinked[Dedupe.nameKey(local.title)]?.removeFirstOrNull() ?: continue
            goals.upsert(local.copy(remoteId = match.id))
            linked += match.id!!
            shadow(KIND_GOAL, local.id, goalSnap(match))
        }

        for (local in goals.withRemote()) {
            val dto = byId[local.remoteId] ?: continue
            settle(
                t, KIND_GOAL, local.id, dto.id!!, local.title,
                goalSnap(local), goalSnap(dto), local.updatedAt > since,
                applyRemote = { applyGoal(local, dto) },
                pushLocal = { api.updateGoal(dto.id!!, goalRequest(local)) },
            )
        }

        for (dto in remote.filter { it.id !in linked }) {
            val id = newId()
            val now = System.currentTimeMillis()
            goals.upsert(
                GoalEntity(
                    id = id, title = (dto.title ?: dto.metric)!!.trim(), why = dto.why.orEmpty(), due = dto.targetDate?.take(10),
                    milestones = AppJson.encodeToString(milestoneSer, remoteMilestones(dto)), archived = remoteArchived(dto),
                    createdAt = now, updatedAt = now, remoteId = dto.id,
                ),
            )
            shadow(KIND_GOAL, id, goalSnap(dto))
            t.pulled++
        }

        for (local in goals.unsynced()) {
            try {
                val rid = api.createGoal(goalRequest(local)).id ?: continue
                goals.upsert(local.copy(remoteId = rid))
                shadow(KIND_GOAL, local.id, goalSnap(local))
                t.pushed++
            } catch (e: Exception) { rethrowNetwork(e); t.failed++ }
        }

        val goneGoals = goals.withRemote().filter { it.remoteId !in byId }
        if (since > 0 && massDelete(goneGoals.size, goals.withRemote().size, t, "goals")) return
        if (since > 0) for (local in goneGoals) {
            if (local.updatedAt > since) goals.upsert(local.copy(remoteId = null))
            else goals.upsert(local.copy(deleted = true, remoteId = null, updatedAt = System.currentTimeMillis()))
            meta.dropShadow(KIND_GOAL, local.id)
            t.pulled++
        }
    }

    private suspend fun applyGoal(local: GoalEntity, dto: RemoteGoalDto) {
        goals.upsert(
            local.copy(
                title = (dto.title ?: dto.metric).orEmpty().trim().ifBlank { local.title }, why = dto.why.orEmpty(),
                due = dto.targetDate?.take(10), archived = remoteArchived(dto),
                milestones = AppJson.encodeToString(milestoneSer, remoteMilestones(dto)), updatedAt = System.currentTimeMillis(),
            ),
        )
    }

    // ------------------------------------------------------------------ minimums ↔ habits

    private fun minSnap(name: String, archived: Boolean) = Snap.of("name" to name, "archived" to archived)

    private fun remoteDays(d: RemoteHabitDto): Set<String> =
        ((d.meta as? JsonObject)?.get("completedDates") as? JsonArray).orEmpty().mapNotNull { it.jsonPrimitive.contentOrNull?.take(10) }.toSet()

    private fun remoteTiny(d: RemoteHabitDto): String = (d.meta as? JsonObject)?.get("tiny")?.jsonPrimitive?.contentOrNull.orEmpty()

    private suspend fun syncMinimums(since: Long, t: Tally) {
        val remote = api.habits(status = "").filter { it.id != null && !it.name.isNullOrBlank() }
        val byId = remote.associateBy { it.id!! }
        val all = minimums.allNow()
        val linked = all.mapNotNull { it.remoteId }.toMutableSet()
        val today = clock.today()

        // Minimums made on the phone: link to a web habit of the same name, or create one.
        val unlinked = remote.filter { it.id !in linked && it.status != "archived" }.groupBy { Dedupe.nameKey(it.name) }.mapValues { it.value.toMutableList() }.toMutableMap()
        for (m in all.filter { it.remoteId == null && !it.archived }) {
            val match = unlinked[Dedupe.nameKey(m.name)]?.removeFirstOrNull()
            if (match != null) {
                minimums.upsert(m.copy(remoteId = match.id))
                linked += match.id!!
                shadow(KIND_MIN, m.id, minSnap(match.name!!.trim(), false))
                continue
            }
            try {
                val rid = api.createHabit(HabitRequest(name = m.name, emoji = "", category = m.domain, frequency = "daily", meta = mapOf("tiny" to m.tiny, "source" to "android"))).id ?: continue
                minimums.upsert(m.copy(remoteId = rid))
                linked += rid
                shadow(KIND_MIN, m.id, minSnap(m.name, false))
                t.pushed++
            } catch (e: Exception) { rethrowNetwork(e); t.failed++ }
        }

        for (m in minimums.allNow().filter { it.remoteId != null }) {
            val dto = byId[m.remoteId] ?: continue
            settle(
                t, KIND_MIN, m.id, dto.id!!, m.name,
                minSnap(m.name, m.archived), minSnap(dto.name!!.trim(), dto.status == "archived"), m.updatedAt > since,
                applyRemote = { minimums.upsert(m.copy(name = dto.name!!.trim(), archived = dto.status == "archived", updatedAt = System.currentTimeMillis())) },
                pushLocal = { api.updateHabit(dto.id!!, HabitRequest(name = m.name, status = if (m.archived) "archived" else "active")) },
            )
        }

        // Habits made on the web join as minimums from today.
        for (dto in remote.filter { it.id !in linked && it.status != "archived" }) {
            val id = newId()
            val now = System.currentTimeMillis()
            minimums.upsert(
                MinimumEntity(
                    id = id, name = dto.name!!.trim(), tiny = remoteTiny(dto), domain = dto.category ?: "discipline",
                    addedOn = today.toString(), sort = minimums.allNow().size, createdAt = now, remoteId = dto.id, updatedAt = now,
                ),
            )
            shadow(KIND_MIN, id, minSnap(dto.name!!.trim(), false))
            t.pulled++
        }

        // Ticks: the phone's own ticks go up as habit.tick / habit.untick.
        val from = today.minusDays(30).toString()
        val byLocal = minimums.allNow().associateBy { it.id }
        val pending = minimums.unsyncedTicks(from).filter { byLocal[it.minimumId]?.remoteId != null }
        for (batch in pending.chunked(50)) {
            val muts = batch.map { tk ->
                SyncMutationDto(
                    id = tk.minimumId + "@" + tk.day,
                    type = if (tk.done) "habit.tick" else "habit.untick",
                    payload = mapOf("habit_id" to byLocal[tk.minimumId]!!.remoteId, "completed_at" to noonOf(tk.day)),
                    clientMutatedAt = Instant.ofEpochMilli(tk.updatedAt).toString(),
                )
            }
            try {
                val res = api.syncBatch(SyncBatchRequest(muts), idempotencyKey = "ticks-" + batch.joinToString("") { it.minimumId.take(4) + it.day + it.updatedAt }.hashCode())
                for (r in res.results) {
                    val tk = batch.firstOrNull { it.minimumId + "@" + it.day == r.id } ?: continue
                    if (r.ok == true) { minimums.markTickSynced(tk.minimumId, tk.day, tk.updatedAt); t.pushed++ } else t.failed++
                }
            } catch (e: Exception) { rethrowNetwork(e); t.failed++ }
        }

        // Ticks made on the web (last 14 days) the phone has not got.
        val pullFrom = today.minusDays(14).toString()
        for (m in minimums.allNow().filter { it.remoteId != null && !it.archived }) {
            val days = remoteDays(byId[m.remoteId] ?: continue).filter { it >= pullFrom && it <= today.toString() }
            if (days.isEmpty()) continue
            val mine = minimums.ticksFor(m.id, pullFrom).associateBy { it.day }
            for (day in days) {
                val cur = mine[day]
                if (cur == null || (!cur.done && cur.synced)) {
                    minimums.upsertTick(MinimumTickEntity(m.id, day, true, cur?.proofDocId, cur?.toggles ?: 1, false, System.currentTimeMillis(), synced = true))
                    t.pulled++
                }
            }
        }
    }

    private fun noonOf(day: String): String =
        runCatching { LocalDate.parse(day).atTime(12, 0).atZone(ZoneId.systemDefault()).toInstant().toString() }.getOrDefault(Instant.now().toString())

    // ------------------------------------------------------------------ journal (opt-in, push only)

    /**
     * Journal text is encrypted on the phone; when its own switch is on, each day's entries are sent
     * as one plain-text entry so the web can show them. Stored as mode "android" so it never
     * overwrites an entry written on the web the same day.
     */
    private suspend fun syncJournal(t: Tally) {
        val dirty = journal.dirty()
        if (dirty.isEmpty()) return
        val days = dirty.map { it.day }.distinct()
        val muts = mutableListOf<SyncMutationDto>()
        val members = mutableMapOf<String, List<aiimin.core.database.JournalEntity>>()
        for (day in days) {
            val live = journal.dayNow(day)
            members[day] = dirty.filter { it.day == day }
            if (live.isEmpty()) {
                // Everything that day was deleted on the phone: delete the web copy too.
                for (gone in dirty.filter { it.day == day }) {
                    val rid = gone.remoteId
                    if (rid != null) {
                        try { api.deleteJournal(rid) } catch (e: Exception) { rethrowNetwork(e); if (!(e is HttpException && e.code() == 404)) { t.failed++; continue } }
                    }
                    journal.markSynced(gone.id, null, gone.updatedAt)
                    t.pushed++
                }
                continue
            }
            val body = live.joinToString("\n\n") { crypto.decryptText(it.cipher, it.iv) }
            val envelope = JsonObject(
                mapOf(
                    "v" to kotlinx.serialization.json.JsonPrimitive(2),
                    "mode" to kotlinx.serialization.json.JsonPrimitive("android"),
                    "body" to kotlinx.serialization.json.JsonPrimitive(body),
                ),
            ).toString()
            muts += SyncMutationDto(
                id = day, type = "journal.upsert",
                payload = buildMap {
                    put("content", envelope)
                    put("date", day)
                    live.lastOrNull { it.mood != null }?.mood?.let { put("mood", it.toString()) }
                },
                clientMutatedAt = Instant.ofEpochMilli(live.maxOf { it.updatedAt }).toString(),
            )
        }
        for (batch in muts.chunked(50)) {
            try {
                val res = api.syncBatch(SyncBatchRequest(batch), idempotencyKey = "journal-" + batch.joinToString("") { it.id + it.clientMutatedAt }.hashCode())
                for (r in res.results) {
                    val day = r.id ?: continue
                    if (r.ok == true) {
                        for (e in journal.dayNow(day) + members[day].orEmpty().filter { it.deleted }) journal.markSynced(e.id, r.entityId, e.updatedAt)
                        t.pushed++
                    } else t.failed++
                }
            } catch (e: Exception) { rethrowNetwork(e); t.failed++ }
        }
    }

    // ------------------------------------------------------------------ conflicts (G5)

    /**
     * The person chose a side. Keeping the web's version writes it here; keeping the phone's makes
     * the web's version the new base, so the next pass sends the phone's version up.
     */
    suspend fun resolve(conflictId: String, keepPhone: Boolean) {
        val c = meta.conflict(conflictId) ?: return
        val now = System.currentTimeMillis()
        if (!keepPhone) applySnapshot(c.kind, c.localId, Snap.parse(c.remote))
        else touchLocal(c.kind, c.localId, now)
        shadow(c.kind, c.localId, c.remote)
        meta.resolve(c.id)
        log.log("sync.conflict", data = mapOf("kind" to c.kind, "kept" to if (keepPhone) "phone" else "web"), tier = Tier.A, source = "user")
    }

    private suspend fun touchLocal(kind: String, id: String, now: Long) {
        when (kind) {
            KIND_TASK -> tasks.get(id)?.let { tasks.upsert(it.copy(updatedAt = now)) }
            KIND_NOTE -> notes.get(id)?.let { notes.upsert(it.copy(dirty = true, updatedAt = now)) }
            KIND_EVENT -> calendar.get(id)?.let { calendar.upsert(it.copy(updatedAt = now)) }
            KIND_GOAL -> goals.get(id)?.let { goals.upsert(it.copy(updatedAt = now)) }
            KIND_MIN -> minimums.get(id)?.let { minimums.upsert(it.copy(updatedAt = now)) }
        }
    }

    private suspend fun applySnapshot(kind: String, id: String, s: Map<String, String?>) {
        when (kind) {
            KIND_TASK -> tasks.get(id)?.let { applyTask(it, s["title"] ?: it.title, s["done"] == "true") }
            KIND_NOTE -> notes.get(id)?.let { notes.upsert(it.copy(title = s["title"] ?: it.title, body = s["body"] ?: it.body, pinned = s["pinned"] == "true", dirty = false, updatedAt = System.currentTimeMillis())) }
            KIND_EVENT -> calendar.get(id)?.let {
                calendar.upsert(
                    it.copy(
                        title = s["title"] ?: it.title, startAt = s["start"]?.toLongOrNull() ?: it.startAt, endAt = s["end"]?.toLongOrNull() ?: it.endAt,
                        allDay = s["allDay"] == "true", location = s["location"].orEmpty(), updatedAt = System.currentTimeMillis(),
                    ),
                )
            }
            KIND_GOAL -> goals.get(id)?.let {
                val ms = s["milestones"].orEmpty().lines().filter { l -> l.length > 2 }.map { l -> Milestone(l.drop(2), l.startsWith("x ")) }
                goals.upsert(
                    it.copy(
                        title = s["title"] ?: it.title, why = s["why"].orEmpty(), due = s["due"], archived = s["archived"] == "true",
                        milestones = AppJson.encodeToString(milestoneSer, ms), updatedAt = System.currentTimeMillis(),
                    ),
                )
            }
            KIND_MIN -> minimums.get(id)?.let { minimums.upsert(it.copy(name = s["name"] ?: it.name, archived = s["archived"] == "true", updatedAt = System.currentTimeMillis())) }
        }
    }

    /**
     * Brake: if the web suddenly lacks more than half of the linked items (and more than 5), that
     * looks like an outage or the wrong account, not real deletes. Nothing is removed; the person
     * is told, and the next sync checks again.
     */
    private suspend fun massDelete(gone: Int, linked: Int, t: Tally, what: String): Boolean {
        if (gone > 5 && gone * 2 > linked) {
            t.failed++
            log.log("sync.mass_delete_blocked", data = mapOf("kind" to what, "gone" to gone, "linked" to linked), tier = Tier.A, source = "system")
            return true
        }
        return false
    }

    private fun rethrowNetwork(e: Throwable) {
        if (e is IOException) throw e
        if (e is HttpException && e.code() == 401) throw e
    }

    companion object {
        const val KIND_TASK = "task"
        const val KIND_NOTE = "note"
        const val KIND_EVENT = "event"
        const val KIND_GOAL = "goal"
        const val KIND_MIN = "minimum"

        fun kindLabel(kind: String) = when (kind) {
            KIND_TASK -> "Task"
            KIND_NOTE -> "Note"
            KIND_EVENT -> "Event"
            KIND_GOAL -> "Goal"
            KIND_MIN -> "Minimum"
            else -> kind.replaceFirstChar { it.uppercase() }
        }
    }
}
