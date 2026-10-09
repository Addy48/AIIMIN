package aiimin.core.model

import kotlin.math.abs
import kotlin.math.min

/**
 * How much of a day happened, on a continuous scale.
 *
 * **Nothing in this engine is binary.** 12,990 steps against a 13,000 target is
 * not a failure, it is 0.9997 of a day, and the maths says so. A threshold on a
 * continuous quantity throws away information and lies about effort; that is the
 * single defect this file exists to remove.
 *
 * The curve is an ease-out between a soft floor and the target:
 * - near the target it is **flat**, so a small miss costs almost nothing;
 * - low down it is **steep**, so starting to do the thing is worth a lot —
 *   effort should be rewarded most where it is hardest to produce;
 * - below the soft floor it is **zero**, so the scale still means something.
 *
 * A symmetric S-curve was tried first and rejected: it compresses the low end
 * too, so 9,000 of 13,000 steps scored 0.48. Two thirds of the work is not half
 * a day.
 */
object Attainment {

    /** Overshoot is worth something, but one heroic day must not buy a week. */
    const val MAX_OVERSHOOT = 0.10

    /** The ceiling any single attainment can reach. */
    const val MAX = 1.0 + MAX_OVERSHOOT

    /**
     * For [CommitmentShape.LESS]: how fast attainment decays per incident.
     * Tuned so one slip in a month leaves ~0.85 — an excellent month, and the
     * number says so instead of shouting "streak broken".
     */
    private const val INCIDENT_DECAY = 6.2

    /**
     * @return attainment in `[0, 1.1]`, or `null` when nothing was observed —
     *   which is not zero and must never be treated as zero.
     */
    fun of(commitment: Commitment, observation: Observation): Double? {
        val value = observation.value ?: return null
        return when (commitment.shape) {
            CommitmentShape.MORE -> more(value, commitment.target, commitment.softFloorRatio)
            CommitmentShape.LESS -> less(value)
            CommitmentShape.BAND -> band(value, commitment.bandLow, commitment.bandHigh)
            CommitmentShape.SHOW_UP -> if (value > 0.0) 1.0 else 0.0
        }
    }

    /**
     * More is better.
     *
     * ```
     * F = softFloorRatio · target          the point where the day did not happen
     * u = (x − F) / (target − F)
     * a = easeOut(u)  ( = 1 − (1 − u)² )
     * ```
     * plus capped credit for overshoot.
     */
    fun more(value: Double, target: Double, softFloorRatio: Double = Commitment.DEFAULT_SOFT_FLOOR): Double {
        require(target > 0.0) { "target must be positive" }
        val floor = target * softFloorRatio
        val base = when {
            value <= floor -> 0.0
            value >= target -> 1.0
            else -> easeOut((value - floor) / (target - floor))
        }
        val overshoot = if (value > target) {
            min(MAX_OVERSHOOT, MAX_OVERSHOOT * (value - target) / target)
        } else {
            0.0
        }
        return base + overshoot
    }

    /**
     * Less is better — the shape for anything you are trying not to do.
     *
     * There is no streak here on purpose. Ten clean days and one slip is
     * `a ≈ 0.85`, not zero, because ten clean days happened and pretending
     * otherwise is a lie the user can feel.
     */
    fun less(incidents: Double): Double {
        require(incidents >= 0.0) { "incidents cannot be negative" }
        return Math.exp(-incidents / INCIDENT_DECAY).coerceIn(0.0, 1.0)
    }

    /** Inside a range is a full day; outside decays smoothly by how far outside. */
    fun band(value: Double, low: Double, high: Double): Double {
        require(high > low) { "band high must exceed low" }
        if (value in low..high) return 1.0
        val width = high - low
        val distance = if (value < low) low - value else value - high
        return easeOut(1.0 - (distance / width).coerceIn(0.0, 1.0))
    }

    /** `1 − (1 − u)²` — steep where effort is hardest, flat where it is nearly done. */
    fun easeOut(u: Double): Double {
        val t = u.coerceIn(0.0, 1.0)
        val inverse = 1.0 - t
        return 1.0 - inverse * inverse
    }

    /** True when two attainments are close enough that no user should see a difference. */
    fun indistinguishable(a: Double, b: Double, epsilon: Double = 0.005): Boolean =
        abs(a - b) < epsilon
}
