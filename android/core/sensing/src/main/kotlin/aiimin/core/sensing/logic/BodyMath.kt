package aiimin.core.sensing.logic

import kotlin.math.abs
import kotlin.math.sqrt

/**
 * Step-counter fallback for phones without Health Connect. The hardware
 * counter is cumulative since boot, so a day total is "now − counter at the
 * day's first reading", carried across reboots.
 */
object StepCounterMath {

    data class State(val day: String, val bootAt: Long, val baseline: Long, val last: Long, val carried: Long)

    /** Feed one reading; returns the new state and the day's steps so far. */
    fun update(prev: State?, day: String, bootAt: Long, counter: Long): Pair<State, Long> {
        if (prev == null || prev.day != day) {
            val s = State(day, bootAt, counter, counter, 0)
            return s to 0L
        }
        // Rebooted (boot time moved or the counter went backwards): bank what we had.
        if (abs(bootAt - prev.bootAt) > 60_000L || counter < prev.last) {
            val carried = prev.carried + (prev.last - prev.baseline)
            val s = State(day, bootAt, counter, counter, carried)
            return s to carried
        }
        val s = prev.copy(last = counter)
        return s to (prev.carried + counter - prev.baseline)
    }
}

/** Sleep attribution and regularity (WHOOP "consistency", Oura "timing"). */
object SleepMath {

    data class Session(val start: Long, val end: Long)

    data class Night(val minutes: Int, val start: Long, val end: Long, val midpoint: Long)

    /**
     * The night that belongs to a day is the sleep you woke up from on that day:
     * sessions ending between [dayStart] and [dayStart] + 18 h. The main sleep
     * is the longest; naps before it don't move its timing but do add minutes.
     */
    fun nightFor(sessions: List<Session>, dayStart: Long): Night? {
        val ends = sessions.filter { it.end > dayStart && it.end <= dayStart + 18 * 3_600_000L && it.end > it.start }
        val main = ends.maxByOrNull { it.end - it.start } ?: return null
        val total = ends.sumOf { it.end - it.start }
        return Night((total / 60_000L).toInt(), main.start, main.end, main.start + (main.end - main.start) / 2)
    }

    /**
     * 0–100 regularity from the spread of sleep midpoints over recent nights.
     * Midpoints are measured from local noon so 23:30 and 00:30 are close.
     * SD of 0 min → 100, 60 min → 50, ≥ 120 min → 0. Needs 3 nights.
     */
    fun regularity(midpointMinutesFromNoon: List<Int>): Int? {
        if (midpointMinutesFromNoon.size < 3) return null
        val mean = midpointMinutesFromNoon.average()
        val sd = sqrt(midpointMinutesFromNoon.sumOf { (it - mean) * (it - mean) } / midpointMinutesFromNoon.size)
        return (100 - sd / 1.2).toInt().coerceIn(0, 100)
    }
}
