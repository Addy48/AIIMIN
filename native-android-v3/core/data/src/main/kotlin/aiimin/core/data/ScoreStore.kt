package aiimin.core.data

import aiimin.core.model.ProvisionalScore
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

/**
 * Live Score marks — local (G7).
 *
 * Rails + ladder feed the **provisional** figure ([ProvisionalScore]). Settling
 * appends that figure into [DayStore] history so Today’s trajectory can move.
 * Published engine composition stays on [DayStore.score].
 */
@Singleton
class ScoreStore @Inject constructor(
    private val day: DayStore,
) {

    private val _state = MutableStateFlow(ScoreState.seed())
    val state: StateFlow<ScoreState> = _state.asStateFlow()

    fun bumpRail(index: Int) = _state.update { s ->
        if (index !in s.rails.indices) return@update s
        val next = s.rails.toMutableList()
        next[index] = next[index].copy(value = ProvisionalScore.bumpRail(next[index].value))
        s.copy(rails = next, settled = false, notice = null)
    }

    fun setRung(rung: Int) = _state.update {
        if (rung !in 1..5) return@update it
        it.copy(
            rung = rung,
            settled = false,
            notice = ScoreNotice("Day marked $rung of 5."),
        )
    }

    fun dismissNotice() = _state.update { it.copy(notice = null) }

    fun resetToSeed() {
        _state.value = ScoreState.seed()
    }

    fun markLocalProvisional() = _state.update {
        it.copy(
            notice = ScoreNotice("LOCAL MARK · published Life Score comes from sync (server)."),
            settled = false,
        )
    }

    /**
     * Lock today’s provisional mark into history. Local day mark —
     * published LHS stays server-side.
     */
    fun settleDay(): Int {
        val dayState = day.state.value
        val minsDone = dayState.pursuits.count { (it.attainment ?: 0.0) >= 0.999 }
        val s = _state.value
        val score = ProvisionalScore.compute(
            minsDone = minsDone,
            rails = s.rails.map { it.value },
            rung = s.rung,
        )
        day.appendHistory(score.toDouble())
        _state.update {
            it.copy(
                settled = true,
                notice = ScoreNotice("Day marked $score. Published score stays on server LHS."),
            )
        }
        return score
    }

    fun markServerPending() = _state.update {
        it.copy(notice = ScoreNotice("MARKED ON PHONE · SERVER PENDING"))
    }

    fun markPosted() = _state.update {
        it.copy(notice = ScoreNotice("Day marked. Posted daily log. Published score stays on server LHS."))
    }
}

data class ScoreNotice(val message: String)

data class RailMark(val label: String, val value: Int) {
    val pct: Float get() = value.coerceIn(0, 100) / 100f
}

data class ScoreMover(val label: String, val value: String, val accent: Boolean)

data class ScoreState(
    val rails: List<RailMark>,
    val rung: Int,
    val settled: Boolean,
    val notice: ScoreNotice? = null,
) {
    fun liveScore(minsDone: Int): Int = ProvisionalScore.compute(
        minsDone = minsDone,
        rails = rails.map { it.value },
        rung = rung,
    )

    fun deltaLabel(minsDone: Int): String =
        ProvisionalScore.deltaLabel(liveScore(minsDone))

    fun movers(minsDone: Int, minsTotal: Int = 5): List<ScoreMover> = listOf(
        ScoreMover("Walk kept · 07:04", "+2.1", accent = true),
        ScoreMover("Focus 2h15m", "+1.4", accent = true),
        ScoreMover("Screen time 5h12m", "−1.8", accent = false),
        ScoreMover(
            "Minimums open",
            ProvisionalScore.minsPenaltyLabel(minsDone, minsTotal),
            accent = minsDone >= minsTotal,
        ),
    )

    companion object {
        fun seed() = ScoreState(
            rails = listOf(
                RailMark("Body", 85),
                RailMark("Mind", 70),
                RailMark("People", 55),
            ),
            rung = 3,
            settled = false,
        )
    }
}
