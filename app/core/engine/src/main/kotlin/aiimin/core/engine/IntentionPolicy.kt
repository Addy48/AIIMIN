package aiimin.core.engine

import java.time.LocalDate

sealed interface IntentionChange {
    data class Applied(val set: IntentionSet) : IntentionChange

    /** A loosening: saved now, live on [applyOn] (7-day rule). */
    data class Scheduled(val set: IntentionSet, val applyOn: LocalDate) : IntentionChange

    sealed interface Rejected : IntentionChange {
        data class BelowYourFloor(val floor: Double) : Rejected
        data class AboveYourCeiling(val ceiling: Double) : Rejected
        data object NotRelevantLimit : Rejected
        data object Coverage : Rejected
        data object UnknownSignal : Rejected
    }
}

/**
 * Anti-sandbagging (plan §3.6): history floor, asymmetric cooldown, a cap on
 * "not relevant", and coverage of at least 4 signals across 3 domains.
 * Harder applies now; easier waits 7 days. Why / if-then edits apply now.
 */
class IntentionPolicy(private val rules: RulesConfig) {

    private val r = rules.intention

    fun propose(
        set: IntentionSet,
        key: String,
        next: Intention,
        history: List<DaySnapshot>,
        today: LocalDate,
    ): IntentionChange {
        val cur = set.card(key) ?: return IntentionChange.Rejected.UnknownSignal
        val vals = ScoreEngine(rules, set).historyValues(key, history).takeLast(r.floorWindow)

        if (vals.size >= rules.baseline.minValid) {
            if (next.direction == Direction.MORE) {
                val floor = Stats.percentile(vals, r.floorPctMore)
                if (next.target < floor) return IntentionChange.Rejected.BelowYourFloor(floor)
            }
            if (next.direction == Direction.LESS) {
                val ceiling = Stats.percentile(vals, r.ceilPctLess)
                if (next.target > ceiling) return IntentionChange.Rejected.AboveYourCeiling(ceiling)
            }
        }

        if (next.direction == Direction.OFF && cur.direction != Direction.OFF) {
            val used = set.notRelevantChanges.count { it.year == today.year && it.month == today.month }
            if (used >= r.notRelevantPerMonth) return IntentionChange.Rejected.NotRelevantLimit
        }

        val hypothetical = set.with(key, cur.copy(direction = next.direction, weight = next.weight))
        val w = ScoreEngine(rules, hypothetical).weights()
        val domains = w.keys.mapNotNull { hypothetical.def(it)?.domain }.toSet()
        if (w.size < r.minSignals || domains.size < r.minDomains) return IntentionChange.Rejected.Coverage

        val loosens = setOf(Direction.TRACK, Direction.OFF)
        val easier = (cur.direction == Direction.MORE && (next.direction != Direction.MORE || next.target < cur.target)) ||
            (cur.direction == Direction.LESS && (next.direction != Direction.LESS || next.target > cur.target)) ||
            next.weight < cur.weight ||
            (next.direction in loosens && cur.direction !in loosens)

        val withText = cur.copy(why = next.why, ifThen = next.ifThen)
        return if (easier) {
            val applyOn = today.plusDays(r.easeDelayDays.toLong())
            val staged = withText.copy(pending = PendingChange(applyOn, next.copy(pending = null)))
            val changes = if (next.direction == Direction.OFF) set.notRelevantChanges + today else set.notRelevantChanges
            IntentionChange.Scheduled(set.with(key, staged).copy(notRelevantChanges = changes), applyOn)
        } else {
            IntentionChange.Applied(set.with(key, next.copy(pending = null, changedOn = today)))
        }
    }

    /** Adaptive default: 60th percentile of your last 9 valid days (Adams et al.). */
    fun suggestedTarget(set: IntentionSet, key: String, history: List<DaySnapshot>): Double? {
        val c = set.card(key) ?: return null
        val vals = ScoreEngine(rules, set).historyValues(key, history).takeLast(r.suggestWindow)
        if (vals.size < rules.baseline.minValid) return null
        return when (c.direction) {
            Direction.MORE -> Stats.percentile(vals, r.suggestPct)
            Direction.LESS -> Stats.percentile(vals, 100 - r.suggestPct)
            else -> null
        }
    }
}
