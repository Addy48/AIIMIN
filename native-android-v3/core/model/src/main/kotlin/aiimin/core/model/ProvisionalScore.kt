package aiimin.core.model

import kotlin.math.roundToInt

/**
 * Drafting Table **provisional** live-score curve — the marking surface formula.
 *
 * This is **not** the published Life Score engine ([Composition]). The Live Score
 * screen uses this so Rail + Ladder visibly move one figure while marks are
 * open. The engine v2 number stays the published state on Today / server.
 *
 * `round(70.7 + minsDone*1.9 + (rung-3)*1.6 + (railAvg-70)*0.12)`
 */
object ProvisionalScore {

    const val BASELINE = 78

    fun compute(minsDone: Int, rails: List<Int>, rung: Int): Int {
        require(rails.isNotEmpty()) { "at least one rail" }
        require(rung in 1..5) { "rung 1..5" }
        val railAvg = rails.map { it.toDouble() }.average()
        return (70.7 + minsDone * 1.9 + (rung - 3) * 1.6 + (railAvg - 70.0) * 0.12)
            .roundToInt()
    }

    /** Signed delta versus [BASELINE], matching the prototype chrome. */
    fun deltaLabel(score: Int, baseline: Int = BASELINE): String {
        val d = score - baseline
        return when {
            d > 0 -> "+$d"
            d < 0 -> "$d"
            else -> "0"
        }
    }

    fun minsPenaltyLabel(done: Int, total: Int = 5): String {
        if (done >= total) return "+0.9"
        val pen = (total - done) * 0.35
        return "−${"%.1f".format(pen)}"
    }

    /** Snap a rail mark to the nearest five in 40..100. */
    fun snapRail(value: Int): Int = ((value / 5) * 5).coerceIn(40, 100)

    /** Prototype bump: +5, or wrap to 40 at 100. */
    fun bumpRail(value: Int): Int {
        val current = snapRail(value)
        return if (current >= 100) 40 else snapRail(current + 5)
    }
}
