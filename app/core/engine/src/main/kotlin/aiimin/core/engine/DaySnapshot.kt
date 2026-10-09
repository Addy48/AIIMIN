package aiimin.core.engine

import java.time.LocalDate

/** Minimums planned at the start of the day versus kept (and kept with proof). */
data class MinimumsTally(val planned: Int, val kept: Int, val keptWithProof: Int) {
    companion object {
        val NONE = MinimumsTally(0, 0, 0)
    }
}

/**
 * One logical day's raw signal values plus the evidence behind each.
 *
 * Built from the event log by the data layer; the engine never reads anything
 * else. A missing key or a null value means "no data", which is different from
 * zero. Mood is carried for pattern-finding only: no engine reads it (law 7).
 */
data class DaySnapshot(
    val day: LocalDate,
    val values: Map<String, Double?>,
    val evidence: Map<String, Tier>,
    val minimums: MinimumsTally,
    val type: DayType = DayType.WORK,
    val light: Boolean = false,
    val paused: Boolean = false,
    val mood: Int? = null,
) {
    fun value(key: String): Double? = values[key]

    fun tier(key: String): Tier = evidence[key] ?: Tier.C

    val hasVerifiedSignal: Boolean
        get() = values.any { (k, v) -> v != null && tier(k).isVerified }
}
