package aiimin.core.engine

import java.time.LocalDate

/** Everything the Today and Score screens read, recomputed from history every time. */
data class LifeReadout(
    /** Headline Life Score, or null while calibrating. Never stored, never shared by default. */
    val score: Int?,
    val band: Band,
    val series: List<ScoredDay>,
    val today: DailyIndex?,
    val verifiedShare28: Double,
    val streak: StreakState,
    val battery: Battery,
    val contributors: List<Contributor>,
    /** Signals still calibrating, with days left. */
    val calibrating: Map<String, Int>,
)

/**
 * One call from settled history (+ today's live snapshot) to every derived
 * number. Same order as the prototype's `recomputeLife`: pending intentions →
 * score series → streak → battery.
 */
class LifeEngine(private val rules: RulesConfig = RulesConfig.V2) {

    fun evaluate(
        intentions: IntentionSet,
        history: List<DaySnapshot>,
        today: DaySnapshot?,
        batteryMode: BatteryMode,
        asOf: LocalDate,
    ): LifeReadout {
        val live = intentions.applyPending(asOf)
        val engine = ScoreEngine(rules, live)
        val series = engine.series(history)
        val last = series.lastOrNull { it.score != null }?.score
        val headline = if (engine.headlineReady(history) && last != null) Stats.roundHalfUp(last).toInt() else null
        val vs28 = engine.verifiedShare(series)
        val streak = StreakEngine(rules).compute(series, batteryMode)
        val battery = BatteryEngine(rules).compute(history, streak.keptDays, batteryMode)
        return LifeReadout(
            score = headline,
            band = engine.band(headline, vs28),
            series = series,
            today = today?.let { engine.dailyIndex(it, history, null) },
            verifiedShare28 = vs28,
            streak = streak,
            battery = battery,
            contributors = engine.contributors(history),
            calibrating = engine.weights().keys
                .map { it to engine.calibration(it, history) }
                .filter { !it.second.done }
                .associate { it.first to it.second.daysLeft },
        )
    }
}
