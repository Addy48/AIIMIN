package aiimin.core.data.plan

import aiimin.core.data.core.DayClock
import aiimin.core.data.core.EventLogger
import aiimin.core.data.day.DayRepository
import aiimin.core.data.life.XpRepository
import aiimin.core.data.settings.Codecs
import aiimin.core.data.settings.SettingsStore
import aiimin.core.data.util.AppJson
import aiimin.core.data.util.newId
import aiimin.core.database.CalendarDao
import aiimin.core.database.CalendarEventEntity
import aiimin.core.database.DayStateDao
import aiimin.core.database.FocusDao
import aiimin.core.database.FocusSessionEntity
import aiimin.core.database.MinimumDao
import aiimin.core.database.MinimumEntity
import aiimin.core.database.MinimumTickEntity
import aiimin.core.database.TaskDao
import aiimin.core.database.TaskEntity
import aiimin.core.engine.Priority
import aiimin.core.engine.Tier
import aiimin.core.engine.XpEvent
import aiimin.core.sensing.UsageReader
import java.time.Instant
import java.time.LocalDate
import java.time.LocalTime
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.map
import kotlinx.serialization.Serializable

enum class DayPart(val label: String) {
    MORNING("Morning"), AFTERNOON("Afternoon"), EVENING("Evening");

    companion object {
        /** Before 12:00 morning, before 17:00 afternoon, after that evening. */
        fun of(time: String?, fallback: String?): DayPart {
            time?.let { runCatching { LocalTime.parse(it) }.getOrNull() }?.let { t ->
                return when {
                    t.hour < 12 -> MORNING
                    t.hour < 17 -> AFTERNOON
                    else -> EVENING
                }
            }
            return fallback?.let { runCatching { valueOf(it) }.getOrNull() } ?: MORNING
        }

        fun now(t: LocalTime = LocalTime.now()): DayPart = of(t.toString().take(5), null)
    }
}

@Serializable
data class Subtask(val t: String, val d: Boolean = false)

data class TaskToggle(val done: Boolean, val xp: Int, val planned: Boolean)

@Singleton
class TaskRepository @Inject constructor(
    private val dao: TaskDao,
    private val dayState: DayStateDao,
    private val clock: DayClock,
    private val log: EventLogger,
    private val xp: XpRepository,
) {
    fun forDay(day: LocalDate): Flow<List<TaskEntity>> = dao.forDay(day.toString())
    fun upcoming(after: LocalDate): Flow<List<TaskEntity>> = dao.upcoming(after.toString())
    fun observe(id: String) = dao.observe(id)
    fun family() = dao.family()
    fun recentDone(n: Int) = dao.recentDone(n)
    suspend fun get(id: String) = dao.get(id)

    /** Creating earns nothing — no XP, no score (law 3). */
    suspend fun create(
        title: String,
        day: LocalDate?,
        time: String? = null,
        part: DayPart? = null,
        priority: Int = 1,
        notes: String = "",
        recurrence: String? = null,
        assignee: String? = null,
        source: String = "ui",
    ): String {
        val now = System.currentTimeMillis()
        val id = newId()
        dao.upsert(
            TaskEntity(
                id = id, title = title.trim(), notes = notes, day = day?.toString(), time = time,
                part = (part ?: DayPart.of(time, null)).name, priority = priority, createdAt = now, scheduledAt = now,
                recurrence = recurrence, assignee = assignee, updatedAt = now,
            ),
        )
        log.log("task.create", "task", id, mapOf("day" to day?.toString(), "src" to source), Tier.C, source)
        return id
    }

    suspend fun update(t: TaskEntity) {
        val old = dao.get(t.id)
        val moved = old != null && old.day != t.day
        dao.upsert(t.copy(updatedAt = System.currentTimeMillis(), scheduledAt = if (moved) System.currentTimeMillis() else t.scheduledAt))
        log.log("task.edit", "task", t.id, mapOf("moved" to moved))
    }

    suspend fun toggle(id: String): TaskToggle? {
        val t = dao.get(id) ?: return null
        val today = clock.today()
        val done = !t.done
        val plannedIds = Codecs.decodeList(dayState.get(today.toString())?.plannedTasks)
        val planned = id in plannedIds
        val churn = log.countToday("task.toggle", id) >= 2
        dao.upsert(
            t.copy(
                done = done, doneAt = if (done) System.currentTimeMillis() else null,
                doneDay = if (done) today.toString() else null, updatedAt = System.currentTimeMillis(),
            ),
        )
        log.log("task.toggle", "task", id, mapOf("done" to done, "planned" to planned), if (churn) Tier.D else if (planned) Tier.B else Tier.C)
        val pr = when (t.priority) { 2 -> Priority.HIGH; 0 -> Priority.LOW; else -> Priority.NORMAL }
        val event = XpEvent.TaskCompleted(planned, pr)
        return if (done && !churn) {
            TaskToggle(true, xp.award(event).awarded, planned)
        } else {
            if (!done) xp.reverse(aiimin.core.engine.XpPolicy(clock.rules).baseFor(event))
            TaskToggle(done, 0, planned)
        }
    }

    suspend fun toggleSubtask(id: String, index: Int) {
        val t = dao.get(id) ?: return
        val subs = subtasks(t).toMutableList()
        if (index !in subs.indices) return
        subs[index] = subs[index].copy(d = !subs[index].d)
        dao.upsert(t.copy(subtasks = AppJson.encodeToString(kotlinx.serialization.builtins.ListSerializer(Subtask.serializer()), subs), updatedAt = System.currentTimeMillis()))
    }

    suspend fun setSubtasks(id: String, subs: List<Subtask>) {
        val t = dao.get(id) ?: return
        dao.upsert(t.copy(subtasks = AppJson.encodeToString(kotlinx.serialization.builtins.ListSerializer(Subtask.serializer()), subs), updatedAt = System.currentTimeMillis()))
    }

    fun subtasks(t: TaskEntity): List<Subtask> =
        runCatching { AppJson.decodeFromString(kotlinx.serialization.builtins.ListSerializer(Subtask.serializer()), t.subtasks) }.getOrDefault(emptyList())

    suspend fun delete(id: String): TaskEntity? {
        val t = dao.get(id) ?: return null
        dao.upsert(t.copy(deleted = true, updatedAt = System.currentTimeMillis()))
        log.log("task.delete", "task", id)
        return t
    }

    suspend fun restore(t: TaskEntity) {
        dao.upsert(t.copy(deleted = false, updatedAt = System.currentTimeMillis()))
        log.log("task.restore", "task", t.id)
    }

    suspend fun moveTo(id: String, day: LocalDate?) {
        val t = dao.get(id) ?: return
        update(t.copy(day = day?.toString()))
    }

    suspend fun search(q: String) = dao.search("%$q%")
}

@Singleton
class CalendarRepository @Inject constructor(
    private val dao: CalendarDao,
    private val clock: DayClock,
    private val log: EventLogger,
) {
    suspend fun forDay(day: LocalDate): Flow<List<CalendarEventEntity>> {
        val l = clock.logical()
        return dao.between(l.startOf(day).toInstant().toEpochMilli(), l.endOf(day).toInstant().toEpochMilli())
    }

    fun between(from: Instant, to: Instant) = dao.between(from.toEpochMilli(), to.toEpochMilli())

    suspend fun get(id: String) = dao.get(id)

    suspend fun save(e: CalendarEventEntity): String {
        dao.upsert(e.copy(updatedAt = System.currentTimeMillis()))
        log.log("event.save", "event", e.id, mapOf("allDay" to e.allDay))
        return e.id
    }

    suspend fun create(title: String, start: Instant, end: Instant, allDay: Boolean = false, source: String = "local", docId: String? = null, location: String = ""): String =
        save(CalendarEventEntity(newId(), title.trim(), start.toEpochMilli(), end.toEpochMilli(), allDay, location, source, docId, updatedAt = System.currentTimeMillis()))

    suspend fun delete(id: String): CalendarEventEntity? {
        val e = dao.get(id) ?: return null
        dao.upsert(e.copy(deleted = true, updatedAt = System.currentTimeMillis()))
        log.log("event.delete", "event", id)
        return e
    }

    suspend fun restore(e: CalendarEventEntity) = dao.upsert(e.copy(deleted = false, updatedAt = System.currentTimeMillis()))

    suspend fun forDoc(docId: String) = dao.forDoc(docId)

    suspend fun search(q: String) = dao.search("%$q%")
}

data class MinimumToday(val minimum: MinimumEntity, val tick: MinimumTickEntity?, val planned: Boolean) {
    val done get() = tick?.done == true
}

@Singleton
class MinimumRepository @Inject constructor(
    private val dao: MinimumDao,
    private val dayState: DayStateDao,
    private val days: DayRepository,
    private val clock: DayClock,
    private val log: EventLogger,
    private val xp: XpRepository,
) {
    fun today(day: LocalDate): Flow<List<MinimumToday>> = combine(dao.active(), dao.ticks(day.toString()), dayState.observe(day.toString())) { mins, ticks, st ->
        val planned = Codecs.decodeList(st?.plannedMins).toSet()
        val byId = ticks.associateBy { it.minimumId }
        mins.map { MinimumToday(it, byId[it.id], it.id in planned || planned.isEmpty()) }
    }

    fun history(from: LocalDate) = dao.ticksSince(from.toString())

    /** New minimums join the frozen plan tomorrow, so nobody adds an easy one at 11 PM. */
    suspend fun add(name: String, tiny: String = "", domain: String = "discipline", startToday: Boolean = false): String {
        val id = newId()
        val today = clock.today()
        dao.upsert(
            MinimumEntity(
                id, name.trim(), tiny.trim(), domain,
                addedOn = if (startToday) today.minusDays(1).toString() else today.toString(),
                sort = dao.activeNow().size, createdAt = System.currentTimeMillis(),
            ),
        )
        if (startToday) {
            dayState.get(today.toString())?.let { st ->
                dayState.upsert(st.copy(plannedMins = Codecs.encodeList(Codecs.decodeList(st.plannedMins) + id)))
            }
        }
        log.log("min.create", "min", id, mapOf("startToday" to startToday))
        return id
    }

    suspend fun edit(m: MinimumEntity) {
        dao.upsert(m)
        log.log("min.edit", "min", m.id)
    }

    suspend fun archive(id: String) {
        dao.get(id)?.let { dao.upsert(it.copy(archived = true)) }
        log.log("min.archive", "min", id)
    }

    /** Rewarded once a day; ticking on and off again makes the evidence doubtful. */
    suspend fun toggle(id: String): Int {
        val day = clock.today().toString()
        val cur = dao.tick(id, day)
        val done = !(cur?.done ?: false)
        val toggles = (cur?.toggles ?: 0) + 1
        dao.upsertTick(MinimumTickEntity(id, day, done, cur?.proofDocId, toggles, false, System.currentTimeMillis()))
        val tier = when {
            toggles >= 3 -> Tier.D
            cur?.proofDocId != null -> Tier.B
            else -> Tier.C
        }
        log.log("min.toggle", "min", id, mapOf("done" to done), tier)
        return if (done) {
            xp.award(XpEvent.MinimumKept(firstTimeToday = toggles == 1)).awarded
        } else {
            if (toggles == 2) xp.reverse(10)
            0
        }
    }

    /** Proof (photo / doc) upgrades a kept minimum from claimed to corroborated. */
    suspend fun attachProof(id: String, docId: String) {
        val day = clock.today().toString()
        val cur = dao.tick(id, day)
        dao.upsertTick(MinimumTickEntity(id, day, true, docId, cur?.toggles ?: 1, false, System.currentTimeMillis()))
        log.log("min.proof", "min", id, mapOf("doc" to docId), Tier.B)
    }

    /** "This was for yesterday": until noon, one tier lower, max 5. */
    suspend fun backfillYesterday(id: String): Boolean {
        if (!days.yesterdayOpen()) return false
        val y = clock.today().minusDays(1)
        dao.upsertTick(MinimumTickEntity(id, y.toString(), true, null, 1, true, System.currentTimeMillis()))
        log.log("backfill", "min", id, mapOf("day" to y.toString()), Tier.D, day = y)
        days.noteBackfill()
        days.refreshYesterday()
        return true
    }

    suspend fun active() = dao.activeNow()
}

@Serializable
data class ActiveFocus(
    val id: String,
    val label: String,
    val taskId: String? = null,
    val startAt: Long,
    val plannedMin: Int,
    val pausedAt: Long? = null,
    val pausedMs: Long = 0,
) {
    fun elapsedMs(now: Long): Long = ((pausedAt ?: now) - startAt - pausedMs).coerceAtLeast(0)
    val running get() = pausedAt == null
}

data class FocusResult(val minutes: Int, val distractedMin: Int, val xp: Int)

@Singleton
class FocusRepository @Inject constructor(
    @dagger.hilt.android.qualifiers.ApplicationContext private val context: android.content.Context,
    private val dao: FocusDao,
    private val settings: SettingsStore,
    private val clock: DayClock,
    private val log: EventLogger,
    private val xp: XpRepository,
    private val usage: UsageReader,
) {
    val active: Flow<ActiveFocus?> = settings.settings.map { s -> s.focusActive?.let { runCatching { AppJson.decodeFromString(ActiveFocus.serializer(), it) }.getOrNull() } }

    suspend fun current(): ActiveFocus? = settings.current().focusActive?.let { runCatching { AppJson.decodeFromString(ActiveFocus.serializer(), it) }.getOrNull() }

    private suspend fun save(a: ActiveFocus?) = settings.update { it.copy(focusActive = a?.let { x -> AppJson.encodeToString(ActiveFocus.serializer(), x) }) }

    suspend fun start(label: String, minutes: Int, taskId: String? = null) {
        if (current() != null) return
        val a = ActiveFocus(newId(), label.ifBlank { "Focus" }, taskId, System.currentTimeMillis(), minutes)
        save(a)
        log.log("focus.start", "focus", a.id, mapOf("planned" to minutes), Tier.A, "timer")
    }

    suspend fun pause() {
        val a = current() ?: return
        if (a.running) save(a.copy(pausedAt = System.currentTimeMillis()))
    }

    suspend fun resume() {
        val a = current() ?: return
        val p = a.pausedAt ?: return
        save(a.copy(pausedAt = null, pausedMs = a.pausedMs + (System.currentTimeMillis() - p)))
    }

    /**
     * Ends the session. Time spent in other apps during it is subtracted, so
     * a timer left running while scrolling doesn't count (plan §5.7).
     */
    suspend fun finish(completed: Boolean): FocusResult? {
        val a = current() ?: return null
        val now = System.currentTimeMillis()
        save(null)
        val rawMin = (a.elapsedMs(now) / 60_000L).toInt()
        val screen = runCatching {
            usage.read(Instant.ofEpochMilli(a.startAt), Instant.ofEpochMilli(now), clock.zone, emptySet())
        }.getOrNull()
        val distracted = screen?.apps?.filter { it.pkg != context.packageName }?.sumOf { it.ms }?.div(60_000L)?.toInt() ?: 0
        val minutes = (rawMin - distracted).coerceAtLeast(0).coerceAtMost(clock.rules.focus.maxDayMin)
        if (minutes >= 1) {
            dao.upsert(FocusSessionEntity(a.id, a.startAt, now, minutes, a.label, a.taskId, if (completed) "done" else "stopped"))
        }
        log.log("focus.session", "focus", a.id, mapOf("min" to minutes, "distracted" to distracted, "done" to completed), Tier.A, "timer")
        val award = if (minutes >= clock.rules.focus.minSession) xp.award(XpEvent.FocusSession(minutes)).awarded else 0
        return FocusResult(minutes, distracted, award)
    }

    suspend fun discard() {
        val a = current() ?: return
        save(null)
        log.log("focus.discard", "focus", a.id, tier = Tier.A, source = "timer")
    }

    suspend fun today(): Flow<List<FocusSessionEntity>> {
        val l = clock.logical()
        val d = clock.today()
        return dao.between(l.startOf(d).toInstant().toEpochMilli(), l.endOf(d).toInstant().toEpochMilli())
    }

    fun between(from: Instant, to: Instant) = dao.between(from.toEpochMilli(), to.toEpochMilli())
}
