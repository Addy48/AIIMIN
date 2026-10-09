package aiimin.core.data.day

import aiimin.core.data.core.DayClock
import aiimin.core.data.core.EventLogger
import aiimin.core.data.settings.Codecs
import aiimin.core.database.DayStateDao
import aiimin.core.database.DayStateEntity
import aiimin.core.database.DeviceDayDao
import aiimin.core.database.EventDao
import aiimin.core.database.FocusDao
import aiimin.core.database.JournalDao
import aiimin.core.database.MinimumDao
import aiimin.core.database.MoneyDao
import aiimin.core.database.TaskDao
import aiimin.core.database.TaskEntity
import aiimin.core.engine.DaySnapshot
import aiimin.core.engine.LogicalDay
import aiimin.core.engine.MinimumsTally
import aiimin.core.engine.Signals
import aiimin.core.engine.Tier
import aiimin.core.data.util.newId
import aiimin.core.sensing.logic.SleepMath
import java.time.DayOfWeek
import java.time.Instant
import java.time.LocalDate
import java.time.YearMonth
import java.time.ZoneId
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock

/**
 * Builds one day's [DaySnapshot] from what is stored. Every value carries its
 * evidence tier; missing data stays null (no data ≠ zero).
 */
@Singleton
class SnapshotBuilder @Inject constructor(
    private val tasks: TaskDao,
    private val minimums: MinimumDao,
    private val focus: FocusDao,
    private val journal: JournalDao,
    private val money: MoneyDao,
    private val device: DeviceDayDao,
    private val events: EventDao,
) {
    suspend fun build(day: LocalDate, state: DayStateEntity, logical: LogicalDay): DaySnapshot {
        val key = day.toString()
        val v = LinkedHashMap<String, Double?>()
        val ev = LinkedHashMap<String, Tier>()
        val start = logical.startOf(day).toInstant().toEpochMilli()
        val end = logical.endOf(day).toInstant().toEpochMilli()

        // Tasks: only what was on the plan before the day began (creating earns nothing).
        val plannedIds = Codecs.decodeList(state.plannedTasks)
        if (plannedIds.isNotEmpty()) {
            val planned = tasks.byIds(plannedIds).filter { !it.deleted }
            fun w(t: TaskEntity) = when (t.priority) { 2 -> 1.5; 0 -> 0.6; else -> 1.0 }
            val total = planned.sumOf(::w)
            if (total > 0) {
                v[Signals.TASKS] = planned.filter { it.done && it.doneDay == key }.sumOf(::w) / total * 100
                val churn = planned.any { events.count(key, "task.toggle", it.id) >= 3 }
                ev[Signals.TASKS] = if (churn) Tier.D else Tier.B
            }
        }

        // Focus: observed by the in-app timer, split across the day boundary, capped at 6 h.
        val sessions = focus.betweenNow(start, end)
        run {
            val mins = sessions.sumOf { s ->
                val span = (s.endAt - s.startAt).coerceAtLeast(1)
                val overlap = (minOf(s.endAt, end) - maxOf(s.startAt, start)).coerceAtLeast(0)
                s.minutes.toDouble() * overlap / span
            }
            v[Signals.FOCUS] = minOf(mins, 360.0)
            ev[Signals.FOCUS] = Tier.A
        }

        // Minimums: the planned set is frozen at the start of the day.
        val active = minimums.allNow()
        val plannedMins = Codecs.decodeList(state.plannedMins).ifEmpty {
            active.filter { !it.archived && it.addedOn < key }.map { it.id }
        }
        val ticks = minimums.ticksNow(key).associateBy { it.minimumId }
        val kept = plannedMins.filter { ticks[it]?.done == true }
        val keptProof = kept.count { ticks[it]?.proofDocId != null }
        if (plannedMins.isNotEmpty()) {
            v[Signals.MINIMUMS] = kept.size.toDouble() / plannedMins.size * 100
            val doubtful = kept.any { (ticks[it]?.toggles ?: 0) >= 3 || ticks[it]?.backfilled == true }
            ev[Signals.MINIMUMS] = when {
                doubtful -> Tier.D
                keptProof > 0 && keptProof * 2 >= kept.size -> Tier.B
                else -> Tier.C
            }
        }

        // Phone + body: measured, never typed.
        val d = device.get(key)
        d?.steps?.let {
            v[Signals.STEPS] = it.toDouble()
            ev[Signals.STEPS] = if (d.stepsSource == "health_connect") Tier.A else Tier.B
        }
        d?.screenPersonalMs?.let { v[Signals.SCREEN_PERSONAL] = it / 60_000.0; ev[Signals.SCREEN_PERSONAL] = Tier.A }
        d?.screenWorkMs?.let { v[Signals.SCREEN_WORK] = it / 60_000.0; ev[Signals.SCREEN_WORK] = Tier.A }
        d?.lateScreenMs?.let { v[Signals.LATE_SCREEN] = it / 60_000.0; ev[Signals.LATE_SCREEN] = Tier.A }
        d?.unlocks?.let { v[Signals.UNLOCKS] = it.toDouble(); ev[Signals.UNLOCKS] = Tier.A }
        d?.sleepMin?.let { v[Signals.SLEEP] = it.toDouble(); ev[Signals.SLEEP] = Tier.A }
        val week = device.range(day.minusDays(6).toString(), key).mapNotNull { dd ->
            val s = dd.sleepStart ?: return@mapNotNull null
            val e = dd.sleepEnd ?: return@mapNotNull null
            val mid = Instant.ofEpochMilli(s + (e - s) / 2).atZone(ZoneId.systemDefault())
            // minutes from the previous noon, so 23:30 and 00:30 sit close together
            ((mid.hour + 12) % 24) * 60 + mid.minute
        }
        SleepMath.regularity(week)?.let { v[Signals.SLEEP_REGULARITY] = it.toDouble(); ev[Signals.SLEEP_REGULARITY] = Tier.A }

        // Journal: the best entry of the day; the quality gate decides credit.
        val entries = journal.forDay(key).filter { !it.deleted }
        val best = entries.maxByOrNull { (if (it.qualityOk) 10_000 else 0) + it.words }
        v[Signals.JOURNAL] = when {
            best == null -> 0.0
            best.qualityOk -> 1.0
            best.words >= 10 -> 0.5
            else -> 0.0
        }
        ev[Signals.JOURNAL] = if (best?.qualityOk == true) Tier.B else Tier.C
        val moods = entries.mapNotNull { it.mood }

        // Money: personal ledger only; adherence to your own plan, never "spend less".
        val ym = YearMonth.from(day)
        val txns = money.betweenNow(ym.atDay(1).toString(), key).filter { it.ledger == "PERSONAL" }
        val budget = money.latestBudget(ym.toString())
        if (budget != null && budget.totalPaise > 0) {
            val spent = txns.filter { it.direction == "out" }.sumOf { it.amountPaise }
            val variable = (budget.totalPaise - budget.fixedPaise).coerceAtLeast(0)
            val line = budget.fixedPaise + variable * (day.dayOfMonth.toDouble() / ym.lengthOfMonth())
            if (line > 0) {
                v[Signals.MONEY_PACE] = spent / line * 100
                ev[Signals.MONEY_PACE] = Tier.A
            }
        }
        val stale = money.pendingDraftsNow().count { it.detectedAt < end - 48 * 3_600_000L }
        if (txns.isNotEmpty() || stale > 0) {
            v[Signals.MONEY_LOGGING] = txns.size.toDouble() / (txns.size + stale) * 100
            ev[Signals.MONEY_LOGGING] = Tier.A
        }

        // Family commitments assigned to me that were due today.
        val mine = tasks.forDayNow(key).filter { it.assignee == "me" }
        if (mine.isNotEmpty()) {
            v[Signals.FAMILY] = mine.count { it.done }.toDouble() / mine.size * 100
            ev[Signals.FAMILY] = Tier.C
        }

        // Custom signals: the last value logged for the day.
        events.forDayType(key, "signal.log").forEach { e ->
            val data = EventLogger.decodeData(e.data)
            val k = data["key"] as? String ?: return@forEach
            (data["value"] as? Number)?.toDouble()?.let { v[k] = it; ev[k] = Tier.valueOf(e.tier) }
        }

        return DaySnapshot(
            day = day,
            values = v,
            evidence = ev,
            minimums = MinimumsTally(plannedMins.size, kept.size, keptProof),
            type = logical.dayType(day),
            light = state.light,
            paused = state.paused,
            mood = if (moods.isEmpty()) null else moods.average().toInt(),
        )
    }
}

/**
 * Owns the logical day: freezes the plan when a day starts, closes days,
 * rolls unfinished tasks forward silently, and settles yesterday at noon.
 */
@Singleton
class DayRepository @Inject constructor(
    private val clock: DayClock,
    private val dao: DayStateDao,
    private val tasks: TaskDao,
    private val minimums: MinimumDao,
    private val builder: SnapshotBuilder,
    private val log: EventLogger,
) {
    private val mutex = Mutex()

    fun observe(day: LocalDate) = dao.observe(day.toString())

    val closedDays = dao.closed()

    /** Make sure today exists, closing every day in between. Idempotent; call often. */
    suspend fun ensureToday(): DayStateEntity = mutex.withLock {
        val today = clock.today()
        val logical = clock.logical()
        val latest = dao.latest()
        if (latest != null && LocalDate.parse(latest.day) < today) {
            var d = LocalDate.parse(latest.day)
            while (d < today) {
                val st = dao.get(d.toString()) ?: newState(d)
                if (st.closedAt == null) close(d, st, logical)
                d = d.plusDays(1)
                if (d < today && dao.get(d.toString()) == null) {
                    // A day the app never opened: it still happened, with its plan.
                    val gap = newState(d)
                    dao.upsert(gap)
                    close(d, gap, logical)
                }
            }
        }
        val st = dao.get(today.toString()) ?: newState(today).also {
            dao.upsert(it)
            log.log("day.open", "day", today.toString(), tier = Tier.A, source = "system", day = today)
        }
        settleDue(logical)
        st
    }

    private suspend fun newState(day: LocalDate): DayStateEntity {
        generateOccurrences(day)
        val logical = clock.logical()
        val dayStart = logical.startOf(day).toInstant().toEpochMilli()
        val key = day.toString()
        val planned = tasks.forDayNow(key).filter { !it.done && it.scheduledAt < dayStart && it.assignee == null }.map { it.id }
        val mins = minimums.activeNow().filter { it.addedOn < key }.map { it.id }
        return DayStateEntity(
            day = key,
            plannedTasks = Codecs.encodeList(planned),
            plannedMins = Codecs.encodeList(mins),
            startedAt = System.currentTimeMillis(),
        )
    }

    /** Recurring tasks get one occurrence per matching day. */
    private suspend fun generateOccurrences(day: LocalDate) {
        val key = day.toString()
        val dayStart = clock.logical().startOf(day).toInstant().toEpochMilli()
        for (tpl in tasks.recurring()) {
            val matches = when (tpl.recurrence) {
                "DAILY" -> true
                "WEEKDAYS" -> day.dayOfWeek != DayOfWeek.SATURDAY && day.dayOfWeek != DayOfWeek.SUNDAY
                "WEEKLY" -> tpl.day?.let { LocalDate.parse(it).dayOfWeek == day.dayOfWeek } ?: false
                else -> false
            }
            if (!matches || tasks.occurrenceCount(tpl.id, key) > 0 || tpl.day == key) continue
            tasks.upsert(
                tpl.copy(
                    id = newId(), day = key, recurrence = null, seriesId = tpl.id, done = false, doneAt = null,
                    doneDay = null, carried = 0, createdAt = dayStart - 1, scheduledAt = dayStart - 1,
                    remoteId = null, updatedAt = System.currentTimeMillis(),
                ),
            )
        }
    }

    private suspend fun close(day: LocalDate, st: DayStateEntity, logical: LogicalDay) {
        val snap = builder.build(day, st, logical)
        dao.upsert(st.copy(closedAt = System.currentTimeMillis(), snapshot = Codecs.encodeSnapshot(snap)))
        // Unfinished one-off tasks roll over quietly: no red pile, just a count.
        val next = day.plusDays(1).toString()
        tasks.forDayNow(day.toString()).filter { !it.done && it.seriesId == null && it.recurrence == null }.forEach {
            tasks.upsert(it.copy(day = next, carried = it.carried + 1, updatedAt = System.currentTimeMillis()))
        }
        log.log("day.close", "day", day.toString(), mapOf("planned" to snap.minimums.planned, "kept" to snap.minimums.kept), Tier.A, "system", day)
    }

    /** Yesterday stays open for honest late entries until noon, then freezes. */
    private suspend fun settleDue(logical: LogicalDay) {
        val now = clock.now()
        for (st in dao.closedNow().filter { !it.settled }) {
            val d = LocalDate.parse(st.day)
            if (!now.isBefore(logical.settlesAt(d).toInstant())) {
                // Re-close once more so backfills made before noon are included.
                val snap = builder.build(d, st, logical)
                dao.upsert(st.copy(settled = true, settledAt = now.toEpochMilli(), snapshot = Codecs.encodeSnapshot(snap)))
                log.log("day.settle", "day", st.day, tier = Tier.A, source = "system", day = d)
            }
        }
    }

    /** After a backfill: recompute yesterday's (still unsettled) snapshot. */
    suspend fun refreshYesterday() {
        val logical = clock.logical()
        val y = clock.today().minusDays(1)
        val st = dao.get(y.toString()) ?: return
        if (st.settled || st.closedAt == null) return
        dao.upsert(st.copy(snapshot = Codecs.encodeSnapshot(builder.build(y, st, logical))))
    }

    /** Only when yesterday actually exists in your history (not on day one). */
    suspend fun yesterdayOpen(): Boolean {
        val y = dao.get(clock.today().minusDays(1).toString()) ?: return false
        return clock.logical().backfill(clock.now(), y.backfills) is LogicalDay.Backfill.Allowed
    }

    suspend fun noteBackfill() {
        val y = dao.get(clock.today().minusDays(1).toString()) ?: return
        dao.upsert(y.copy(backfills = y.backfills + 1))
    }

    suspend fun liveSnapshot(): DaySnapshot {
        val st = ensureToday()
        return builder.build(LocalDate.parse(st.day), st, clock.logical())
    }

    suspend fun history(): List<DaySnapshot> = dao.closedNow().mapNotNull { it.snapshot?.let(Codecs::decodeSnapshot) }

    sealed interface Toggle {
        data object Done : Toggle
        data class Limit(val message: String) : Toggle
    }

    /** Light day: just the minimums, no pressure. 4 per month. */
    suspend fun setLight(on: Boolean): Toggle {
        val st = ensureToday()
        if (on && !st.light) {
            val month = st.day.take(7)
            val used = dao.closedNow().count { it.light && it.day.startsWith(month) }
            if (used >= clock.rules.intention.lightDaysPerMonth) return Toggle.Limit("You've used 4 light days this month")
        }
        dao.upsert(st.copy(light = on))
        log.log("day.light", "day", st.day, mapOf("on" to on))
        return Toggle.Done
    }

    /** Pause: score, streak and battery are neutral. 14 days a quarter; illness extends. */
    suspend fun setPaused(on: Boolean, reason: String?): Toggle {
        val st = ensureToday()
        if (on && !st.paused && reason != "illness") {
            val d = LocalDate.parse(st.day)
            val q = (d.monthValue - 1) / 3
            val used = dao.closedNow().count {
                val x = LocalDate.parse(it.day)
                it.paused && x.year == d.year && (x.monthValue - 1) / 3 == q
            }
            if (used >= clock.rules.intention.pauseDaysPerQuarter) return Toggle.Limit("14 pause days used this quarter. Choose Illness to extend.")
        }
        dao.upsert(st.copy(paused = on, pauseReason = if (on) reason ?: "pause" else null))
        log.log("day.pause", "day", st.day, mapOf("on" to on, "reason" to reason))
        return Toggle.Done
    }

    suspend fun today(): LocalDate = clock.today()
}
