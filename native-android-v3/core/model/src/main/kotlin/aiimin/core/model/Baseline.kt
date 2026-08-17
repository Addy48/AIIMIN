package aiimin.core.model

import kotlin.math.abs
import kotlin.math.exp
import kotlin.math.tanh

/**
 * "Today against your own normal" — for the signals nobody sets a target for.
 *
 * Mood, sleep duration, resting heart rate later: there is no target, only a
 * personal distribution. Every wearable that works converged on the same answer,
 * a personal rolling baseline rather than a population norm, and the accepted
 * minimum before such a baseline means anything is about two weeks.
 *
 * Median and MAD rather than mean and standard deviation, because one 3 a.m.
 * night must not be allowed to redefine what your normal is.
 */
object Baseline {

    /** The window a personal normal is read from. */
    const val WINDOW_DAYS = 28

    /** Below this many observations the baseline is shrunk toward a prior. */
    const val SHRINK_K = 10.0

    /** MAD → σ for a normal distribution. */
    private const val MAD_TO_SIGMA = 1.4826

    /** z is clipped here so a single extreme day cannot dominate. */
    private const val Z_CLIP = 3.0

    /** Stand-in spread when a history is perfectly flat: 5% of its own level. */
    private const val FLAT_SCALE = 0.05

    /**
     * @param history the trailing values, most recent last. At most [WINDOW_DAYS] are used.
     * @param prior what to fall back toward while the baseline is young, 0–100.
     * @return a 0–100 reading of today against this person's own normal.
     */
    fun score(value: Double, history: List<Double>, prior: Double = 50.0): Double {
        val window = history.takeLast(WINDOW_DAYS)
        if (window.isEmpty()) return prior
        val z = zScore(value, window)
        val observed = 50.0 + 50.0 * tanh(z / 2.0)
        val lambda = SHRINK_K / (SHRINK_K + window.size)
        return (lambda * prior + (1 - lambda) * observed).coerceIn(0.0, 100.0)
    }

    /** Robust standardisation. Returns 0 when the history has no spread. */
    fun zScore(value: Double, history: List<Double>): Double {
        if (history.isEmpty()) return 0.0
        val med = median(history)
        val mad = median(history.map { abs(it - med) })
        // A perfectly steady history has no spread, but "the same as always" and
        // "a quarter more than always" are still different days. Fall back to a
        // scale proportional to the level itself rather than refusing to answer.
        val scale = if (mad > 0.0) MAD_TO_SIGMA * mad else FLAT_SCALE * abs(med)
        if (scale <= 0.0) return 0.0
        return ((value - med) / scale).coerceIn(-Z_CLIP, Z_CLIP)
    }

    fun median(values: List<Double>): Double {
        if (values.isEmpty()) return 0.0
        val sorted = values.sorted()
        val mid = sorted.size / 2
        return if (sorted.size % 2 == 1) sorted[mid] else (sorted[mid - 1] + sorted[mid]) / 2.0
    }

    /**
     * How grown-up this baseline is, 0–1. Used for confidence, never to lower a
     * score — a young baseline is uncertain, not bad.
     */
    fun maturity(observedDays: Int): Double = 1.0 - exp(-observedDays / 14.0)
}
