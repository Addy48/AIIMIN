package aiimin.core.engine

import kotlin.math.abs
import kotlin.math.ceil
import kotlin.math.floor

/**
 * Robust statistics used by every baseline. Behaviour matches the prototype
 * exactly (including empty-list → 0), so scores agree across clients.
 */
object Stats {

    fun median(values: List<Double>): Double {
        if (values.isEmpty()) return 0.0
        val sorted = values.sorted()
        val mid = sorted.size / 2
        return if (sorted.size % 2 == 1) sorted[mid] else (sorted[mid - 1] + sorted[mid]) / 2.0
    }

    /** Linear-interpolated percentile, `p` in 0..100. */
    fun percentile(values: List<Double>, p: Double): Double {
        if (values.isEmpty()) return 0.0
        val sorted = values.sorted()
        val i = ((p / 100.0) * (sorted.size - 1)).coerceIn(0.0, (sorted.size - 1).toDouble())
        val lo = floor(i).toInt()
        val hi = ceil(i).toInt()
        return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo)
    }

    /** Median absolute deviation (unscaled; multiply by 1.4826 for a σ estimate). */
    fun mad(values: List<Double>): Double {
        val m = median(values)
        return median(values.map { abs(it - m) })
    }

    /**
     * Half-up rounding (JavaScript `Math.round`). Kotlin's `round()` is half-even,
     * which would make −10.5 → −10 here but 10.5 → 10 there; parity matters.
     */
    fun roundHalfUp(x: Double): Long = floor(x + 0.5).toLong()

    fun round1(x: Double): Double = roundHalfUp(x * 10.0) / 10.0
}
