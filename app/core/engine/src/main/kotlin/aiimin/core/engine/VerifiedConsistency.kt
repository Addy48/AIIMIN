package aiimin.core.engine

import kotlin.math.min

/**
 * Verified Consistency Score — what a future leaderboard may rank (plan §9).
 *
 * Deliberately a different number from the Life Score, built only from
 * percentages of Tier A/B evidence. It has no field for raw values, money,
 * health, mood or journal content, so it can't leak them.
 */
data class VerifiedConsistency(
    val vcs: Int,
    val consistencyPct: Int,
    val improvementPct: Int,
    val verifiedPct: Int,
    val provisional: Boolean,
)

class VerifiedConsistencyEngine(private val rules: RulesConfig) {

    fun compute(scored: List<ScoredDay>, keptDays: List<Boolean>): VerifiedConsistency {
        val season = rules.vcs.seasonDays
        val from = maxOf(0, scored.size - season)
        val days = scored.subList(from, scored.size)
        val provisional = scored.size < rules.vcs.provisionalDays
        if (days.isEmpty()) return VerifiedConsistency(0, 0, 0, 0, true)

        val committed = days.indices.filter { i ->
            val h = days[i].snapshot
            !h.paused && h.minimums.planned > 0
        }
        val consistent = committed.count { i ->
            keptDays.getOrNull(from + i) == true && days[i].snapshot.minimums.keptWithProof >= 1
        }.toDouble() / maxOf(1, committed.size)
        val verified = days.sumOf { it.verifiedShare } / days.size
        val first = days.take(7).mapNotNull { it.di }
        val last = days.takeLast(7).mapNotNull { it.di }
        val improve = if (first.isNotEmpty() && last.isNotEmpty()) {
            ((Stats.median(last) - Stats.median(first)) / 20.0).coerceIn(-1.0, 1.0)
        } else {
            0.0
        }
        val raw = (70 * consistent + 20 * (improve + 1) / 2 + 10 * verified).coerceIn(0.0, 100.0)
        return VerifiedConsistency(
            vcs = Stats.roundHalfUp(raw * min(1.0, verified / 0.5)).toInt(),
            consistencyPct = Stats.roundHalfUp(consistent * 100).toInt(),
            improvementPct = Stats.roundHalfUp(improve * 100).toInt(),
            verifiedPct = Stats.roundHalfUp(verified * 100).toInt(),
            provisional = provisional,
        )
    }
}
