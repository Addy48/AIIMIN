package aiimin.core.engine

import kotlin.math.ceil
import kotlin.math.max

enum class StreakMark(val code: Char) { KEPT('K'), MISSED('X'), FROZEN('F'), REPAIRED('R'), PAUSED('P') }

data class StreakState(
    val current: Int,
    val longest: Int,
    val freezesBanked: Int,
    val totalKept: Int,
    /** One mark per history day, oldest first. History is never lost. */
    val marks: List<StreakMark>,
    /** Per history day: was it a kept day? Feeds the battery's day bonus. */
    val keptDays: List<Boolean>,
) {
    val log: String get() = marks.joinToString("") { it.code.toString() }
}

/**
 * Forgiving streaks (plan §6). A kept day is judged against YOUR OWN 20th
 * percentile, never a universal bar. Freezes are earned, never sold; a miss
 * can be repaired by keeping the next day plus one extra minimum.
 */
class StreakEngine(private val rules: RulesConfig) {

    private val r = rules.streak

    fun minimumsFloor(day: DaySnapshot): Int =
        if (day.light) 1 else max(1, ceil(day.minimums.planned * r.keptMinimumsShare).toInt())

    fun compute(scored: List<ScoredDay>, mode: BatteryMode): StreakState {
        // The bar is your own 20th percentile of the scored days BEFORE this one (last 60), so a day
        // is never judged against days that came after it. During calibration (under 14 earlier
        // scored days) there is no bar: the minimums floor and one A/B item decide (§9.3).
        val priorDis = ArrayList<Double>()

        var cur = 0
        var best = 0
        var freezes = 0
        var keptRun = 0
        var total = 0
        var lastFrozen = false
        var prevMissed = false
        var beforeBreak = 0
        val marks = ArrayList<StreakMark>(scored.size)
        val kept = ArrayList<Boolean>(scored.size)

        for (d in scored) {
            val h = d.snapshot
            if (h.paused) {
                marks += StreakMark.PAUSED
                kept += false
                prevMissed = false
                continue
            }
            val bar = if (priorDis.size >= 14) Stats.percentile(priorDis.takeLast(60), r.keptDIPct) else null
            // One point of tolerance: as your stretch anchor learns, an identical day can score a hair lower.
            val diOk = if (bar == null) true else d.di != null && d.di >= bar - 1.0
            val isKept = diOk && h.minimums.kept >= minimumsFloor(h) && h.hasVerifiedSignal
            d.di?.let { priorDis += it }
            kept += isKept
            if (isKept) {
                cur++
                total++
                keptRun++
                lastFrozen = false
                if (keptRun % r.freezeEvery == 0) freezes = minOf(r.freezeBank, freezes + 1)
                val canRepair = mode != BatteryMode.HARDCORE &&
                    prevMissed && marks.lastOrNull() == StreakMark.MISSED &&
                    h.minimums.kept >= ceil(h.minimums.planned * r.keptMinimumsShare).toInt() + 1
                if (canRepair) {
                    marks[marks.lastIndex] = StreakMark.REPAIRED
                    cur = beforeBreak + 2
                }
                marks += StreakMark.KEPT
                prevMissed = false
            } else if (freezes > 0 && !lastFrozen && mode != BatteryMode.HARDCORE) {
                freezes--
                lastFrozen = true
                marks += StreakMark.FROZEN
                prevMissed = false
            } else {
                beforeBreak = cur
                cur = 0
                keptRun = 0
                lastFrozen = false
                marks += StreakMark.MISSED
                prevMissed = true
            }
            best = max(best, cur)
        }
        return StreakState(cur, best, freezes, total, marks, kept)
    }
}
