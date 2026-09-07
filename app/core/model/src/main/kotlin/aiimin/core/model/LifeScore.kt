package aiimin.core.model

import kotlin.math.abs

/** One instrument's reading for a day, with how much of it was actually observed. */
data class InstrumentReading(
    val instrument: Instrument,
    /** 0–100, computed over covered members only. */
    val score: Double,
    /** Fraction of this instrument's weight that had data behind it. */
    val coverage: Double,
) {
    val covered: Boolean get() = coverage > 0.0
}

/** What moved the number, and by how much. Three of these, never more. */
data class Attribution(
    val instrument: Instrument,
    /** Points of the final state, versus this instrument's own 7-day norm. */
    val delta: Double,
)

/**
 * The published score.
 *
 * Two numbers and a band, never one number alone: [state] is today, [trajectory]
 * is the direction of the last four weeks, and [confidence] says how much of it
 * rests on real data.
 *
 * **Missing data never lowers [state].** It narrows what we know, so it widens
 * the band. A person who logged nothing sees a wide band and an honest prompt,
 * not a bad number — which is the single most common reason people quit
 * self-tracking, and the cheapest one to not do.
 */
data class LifeScore(
    val state: Double,
    val confidence: Double,
    val trajectory: Trajectory,
    val mode: LifeMode,
    val readings: List<InstrumentReading>,
    val attribution: List<Attribution>,
    val engineVersion: String = ENGINE_VERSION,
) {
    /** ± band around [state], widening as confidence falls. */
    val band: Double get() = MAX_BAND * (1.0 - confidence)

    companion object {
        const val ENGINE_VERSION = "v2.0"
        const val MAX_BAND = 12.0
    }
}

/**
 * Composition — the only place instrument readings become one number.
 *
 * Weights are the user's own, multiplied by the mode, renormalised over what was
 * actually covered. The renormalisation is what stops a missing instrument from
 * quietly acting like a zero.
 */
object Composition {

    /** After this many days, the engine may start listening to the user's own correlations. */
    const val IDIOGRAPHIC_MIN_DAYS = 60

    /** No learned weight may move more than this far from the declared one. */
    const val LEARNED_CLAMP = 0.40

    /**
     * @param baseWeights what the user said mattered, at calibration. Need not sum to 1.
     * @param learned optional per-instrument weights derived from this user's own
     *   surviving correlations. Only applied once [days] clears
     *   [IDIOGRAPHIC_MIN_DAYS], and always clamped — the engine may lean, never lurch.
     */
    fun weights(
        baseWeights: Map<Instrument, Double>,
        mode: LifeMode,
        learned: Map<Instrument, Double>? = null,
        days: Int = 0,
    ): Map<Instrument, Double> {
        val moded = baseWeights.mapValues { (instrument, w) -> w * mode[instrument] }
        val normalisedMode = normalise(moded)
        if (learned.isNullOrEmpty() || days < IDIOGRAPHIC_MIN_DAYS) return normalisedMode

        val normalisedLearned = normalise(learned.filterKeys { it in baseWeights })
        val lambda = IDIOGRAPHIC_MIN_DAYS.toDouble() / (IDIOGRAPHIC_MIN_DAYS + days)
        val blended = normalisedMode.mapValues { (instrument, modeWeight) ->
            val learnedWeight = normalisedLearned[instrument] ?: modeWeight
            val mixed = lambda * modeWeight + (1 - lambda) * learnedWeight
            mixed.coerceIn(modeWeight * (1 - LEARNED_CLAMP), modeWeight * (1 + LEARNED_CLAMP))
        }
        return normalise(blended)
    }

    /**
     * @param baselineDays how long this person has been recorded — young baselines
     *   are uncertain, which widens the band and changes nothing else.
     */
    fun compose(
        readings: List<InstrumentReading>,
        weights: Map<Instrument, Double>,
        mode: LifeMode,
        history: List<Double> = emptyList(),
        sevenDayNorm: Map<Instrument, Double> = emptyMap(),
        baselineDays: Int = 0,
    ): LifeScore {
        val covered = readings.filter { it.covered }
        val totalWeight = readings.sumOf { weights[it.instrument] ?: 0.0 }
        val coveredWeight = covered.sumOf { (weights[it.instrument] ?: 0.0) * it.coverage }

        val state = if (coveredWeight <= 0.0) {
            0.0
        } else {
            covered.sumOf { (weights[it.instrument] ?: 0.0) * it.coverage * it.score } / coveredWeight
        }

        val coverageRatio = if (totalWeight <= 0.0) 0.0 else (coveredWeight / totalWeight).coerceIn(0.0, 1.0)
        val confidence = (coverageRatio * Baseline.maturity(baselineDays)).coerceIn(0.0, 1.0)

        val attribution = covered
            .map { reading ->
                val weight = weights[reading.instrument] ?: 0.0
                val norm = sevenDayNorm[reading.instrument] ?: reading.score
                Attribution(reading.instrument, weight * (reading.score - norm))
            }
            .filter { abs(it.delta) > 0.01 }
            .sortedByDescending { abs(it.delta) }
            .take(3)

        return LifeScore(
            state = state.coerceIn(0.0, 100.0),
            confidence = confidence,
            trajectory = Trajectory.of(history),
            mode = mode,
            readings = readings,
            attribution = attribution,
        )
    }

    private fun normalise(weights: Map<Instrument, Double>): Map<Instrument, Double> {
        val total = weights.values.sum()
        if (total <= 0.0) {
            val equal = if (weights.isEmpty()) 0.0 else 1.0 / weights.size
            return weights.mapValues { equal }
        }
        return weights.mapValues { (_, w) -> w / total }
    }
}
