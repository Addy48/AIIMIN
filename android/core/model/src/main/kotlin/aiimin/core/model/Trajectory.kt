package aiimin.core.model

import kotlin.math.abs
import kotlin.math.sqrt

/** Which way the last four weeks are pointing — and whether we may say so. */
enum class Direction { RISING, HOLDING, SLIPPING }

/**
 * The second number.
 *
 * A single figure hides the difference between a bad day and a bad month. The
 * trajectory is the ordinary-least-squares slope of the score over the trailing
 * window, published with its standard error, and it only claims a direction
 * when the slope clears its own error bar. Everything else is HOLDING, honestly.
 */
data class Trajectory(
    /** Points per day. */
    val slope: Double,
    val standardError: Double,
    val days: Int,
) {
    val direction: Direction
        get() = when {
            days < MIN_DAYS -> Direction.HOLDING
            // A zero standard error means the line is exact, not that it is flat.
            standardError > 0.0 && abs(slope) <= SIGNIFICANCE * standardError -> Direction.HOLDING
            abs(slope) < FLAT -> Direction.HOLDING
            slope > 0 -> Direction.RISING
            else -> Direction.SLIPPING
        }

    /** Change across the whole window, which is the number a person can feel. */
    val overWindow: Double get() = slope * days

    companion object {
        const val MIN_DAYS = 7
        private const val SIGNIFICANCE = 1.96

        /** Below this, points per day, nobody could feel the difference. */
        private const val FLAT = 0.05

        /** @param series oldest first, one score per day. */
        fun of(series: List<Double>): Trajectory {
            val n = series.size
            if (n < 2) return Trajectory(0.0, 0.0, n)

            val xs = List(n) { it.toDouble() }
            val meanX = xs.average()
            val meanY = series.average()
            val sxx = xs.sumOf { (it - meanX) * (it - meanX) }
            if (sxx <= 0.0) return Trajectory(0.0, 0.0, n)

            val sxy = xs.indices.sumOf { (xs[it] - meanX) * (series[it] - meanY) }
            val slope = sxy / sxx
            val intercept = meanY - slope * meanX

            if (n <= 2) return Trajectory(slope, 0.0, n)
            val residualSumSq = xs.indices.sumOf { i ->
                val predicted = intercept + slope * xs[i]
                val residual = series[i] - predicted
                residual * residual
            }
            val se = sqrt(residualSumSq / (n - 2) / sxx)
            return Trajectory(slope, se, n)
        }
    }
}
