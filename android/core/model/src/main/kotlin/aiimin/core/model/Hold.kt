package aiimin.core.model

import kotlin.math.ceil
import kotlin.math.ln

/**
 * What replaces the streak.
 *
 * A streak counter is a fragile state variable: one event annihilates every day
 * of evidence before it. That is factually wrong — ten clean days still
 * happened — and it is the mechanism that turns a tool into a source of guilt.
 *
 * **Hold** is an exponentially weighted average of attainment with a fourteen-day
 * half-life. Ten strong days followed by one slip take it from about 0.95 to
 * about 0.82: it drops, proportionally and honestly, and it *remembers*. Because
 * it remembers, the app can show the one thing a streak never could — how many
 * ordinary days it takes to get back.
 *
 * The memory is **asymmetric on purpose**: falling uses a fourteen-day
 * half-life so one bad day costs little, and returning uses a faster constant so
 * coming back is visibly quick. Slow to fall, quick to recover — that is the
 * mix. A symmetric average punished a slip for a week, which is the same
 * cruelty as a streak wearing better clothes.
 *
 * [bestRun] is never reset. A record is a record; it does not stop having
 * happened because a new run started.
 */
data class Hold(
    /** EWMA of attainment, `[0, 1.1]`. The headline. */
    val value: Double = 0.0,
    /** Consecutive days at or above [RUN_THRESHOLD]. A fact, never a verdict. */
    val currentRun: Int = 0,
    /** The longest run ever recorded. **Never** reset. */
    val bestRun: Int = 0,
    /** For LESS-shaped commitments: incidents in the trailing 30 days. */
    val incidents30d: Int = 0,
    /** How many days have fed this Hold. Below [MATURE_DAYS] it is still settling. */
    val observedDays: Int = 0,
) {
    val mature: Boolean get() = observedDays >= MATURE_DAYS

    /**
     * Fold one day in.
     *
     * A day with no observation does **not** count as a zero — it simply does
     * not move the Hold. Not logging is not the same as not doing, and the
     * engine must never confuse the two.
     */
    fun advance(attainment: Double?, incidentToday: Int = 0): Hold {
        if (attainment == null) {
            return copy(incidents30d = incidents30d + incidentToday)
        }
        val seeded = if (observedDays == 0) attainment else value
        val alpha = if (attainment >= seeded) ALPHA_RETURN else ALPHA_FALL
        val next = alpha * attainment + (1 - alpha) * seeded
        val run = if (attainment >= RUN_THRESHOLD) currentRun + 1 else 0
        return Hold(
            value = next.coerceIn(0.0, Attainment.MAX),
            currentRun = run,
            bestRun = maxOf(bestRun, run),
            incidents30d = incidents30d + incidentToday,
            observedDays = observedDays + 1,
        )
    }

    /**
     * The way back — the number a streak counter can never give you.
     *
     * How many ordinary days at [dayQuality] it takes for the Hold to reach
     * [target]. Answering this is the difference between "you failed" and
     * "two days and you're back".
     */
    fun daysToReach(target: Double, dayQuality: Double = 1.0): Int {
        if (value >= target) return 0
        if (dayQuality <= target) return UNREACHABLE
        val remaining = (dayQuality - target) / (dayQuality - value)
        return ceil(ln(remaining) / ln(1 - ALPHA_RETURN)).toInt().coerceAtLeast(1)
    }

    /** Incidents per 30 days, the honest headline for a LESS commitment. */
    fun rateLabel(): String = when (incidents30d) {
        0 -> "none in 30 days"
        1 -> "1 in 30 days"
        else -> "$incidents30d in 30 days"
    }

    companion object {
        /** Falling: fourteen-day half-life, `α = 2 / (N + 1)`, N = 14. Forgiving. */
        const val ALPHA_FALL = 2.0 / 15.0

        /** Returning: faster, so two or three ordinary days visibly bring it back. */
        const val ALPHA_RETURN = 0.30

        /** What counts as a day held. Deliberately below 1.0 — near enough is held. */
        const val RUN_THRESHOLD = 0.9

        const val MATURE_DAYS = 14

        const val UNREACHABLE = Int.MAX_VALUE

        fun seed(): Hold = Hold()
    }
}
