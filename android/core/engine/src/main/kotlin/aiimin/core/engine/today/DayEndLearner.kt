package aiimin.core.engine.today

import java.time.Instant
import java.time.LocalDate
import java.time.LocalTime
import java.time.ZoneId
import java.time.temporal.ChronoUnit

/** How the day-end hour is kept: set from onboarding, adjusting after a "Yes", or pinned by hand. */
enum class DayEndMode { SET, LEARNING, PINNED }

sealed interface DayEndDecision {
    data object None : DayEndDecision
    /** Show the card: "Your evenings seem to start near …. Use this?" */
    data class Suggest(val dayEnd: LocalTime) : DayEndDecision
    /** Already agreed to: move quietly (at most 30 minutes a week). */
    data class Apply(val dayEnd: LocalTime) : DayEndDecision
}

/**
 * PRD Part 3 §1.2 "Day-end hour is learned, never silent". Each night's sleep start is the start of the longest
 * screen-off stretch of 4 hours or more between 20:00 and noon; the day end is the median of the last 7 valid
 * nights minus one hour (needs 4 valid nights, never before 20:00). It is suggested once; after "Yes" it moves
 * at most 30 minutes a week, and only with Usage access. A pinned value is never touched. All on the phone.
 */
object DayEndLearner {
    private val FLOOR = LocalTime.of(20, 0)
    const val NIGHTS = 7
    const val MIN_VALID = 4
    const val MAX_STEP_MIN = 30L

    /** Minutes after 20:00, so 23:30 < 00:15 < 01:00 sort as one night. */
    private fun nightMin(t: LocalTime): Int = ((t.toSecondOfDay() / 60) - 20 * 60).let { if (it < 0) it + 24 * 60 else it }
    private fun fromNightMin(m: Int): LocalTime = LocalTime.of(((20 * 60 + m) / 60) % 24, (20 * 60 + m) % 60)

    /** Onboarding: day end = sleep minus one hour, not before 20:00. */
    fun fromSleep(sleep: LocalTime): LocalTime = fromNightMin(maxOf(0, nightMin(sleep) - 60))

    fun next(nights: List<LocalTime?>, current: LocalTime, mode: DayEndMode, lastChange: LocalDate?, today: LocalDate, usageAccess: Boolean): DayEndDecision {
        if (mode == DayEndMode.PINNED) return DayEndDecision.None
        // A "night" that starts after 04:00 is shift work or a long morning off-screen stretch: not learned (later).
        val valid = nights.takeLast(NIGHTS).filterNotNull().map(::nightMin).filter { it <= 8 * 60 }.sorted()
        if (valid.size < MIN_VALID) return DayEndDecision.None
        val median = if (valid.size % 2 == 1) valid[valid.size / 2] else (valid[valid.size / 2 - 1] + valid[valid.size / 2]) / 2
        val target = maxOf(0, ((median - 60) / 15) * 15)
        val cur = nightMin(current)
        if (target == cur) return DayEndDecision.None
        if (mode == DayEndMode.SET || !usageAccess) return DayEndDecision.Suggest(fromNightMin(target))
        if (lastChange != null && ChronoUnit.DAYS.between(lastChange, today) < 7) return DayEndDecision.None
        val step = (target - cur).coerceIn(-MAX_STEP_MIN.toInt(), MAX_STEP_MIN.toInt())
        return DayEndDecision.Apply(fromNightMin(cur + step))
    }

    /**
     * The night that starts on [day]: from screen on/off events (epoch ms, true = screen on), the start of the
     * longest screen-off stretch of at least 4 hours between 20:00 and noon the next day, or null.
     */
    fun sleepStart(events: List<Pair<Long, Boolean>>, day: LocalDate, zone: ZoneId): LocalTime? {
        val from = day.atTime(FLOOR).atZone(zone).toInstant().toEpochMilli()
        val to = day.plusDays(1).atTime(12, 0).atZone(zone).toInstant().toEpochMilli()
        var offAt: Long? = null
        var best: Pair<Long, Long>? = null
        for ((at, on) in events.sortedBy { it.first }) {
            if (at < from || at > to) continue
            if (!on && offAt == null) offAt = at
            if (on && offAt != null) {
                if (best == null || at - offAt > best.second - best.first) best = offAt to at
                offAt = null
            }
        }
        val b = best ?: return null
        if (b.second - b.first < 4 * 3_600_000L) return null
        return Instant.ofEpochMilli(b.first).atZone(zone).toLocalTime().withSecond(0).withNano(0)
    }
}
