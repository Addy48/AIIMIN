package aiimin.core.data

import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

/**
 * Local day-mark capture state.
 *
 * This class deliberately does not calculate Life Score. The published score is
 * produced by the server LHS engine and hydrated through PublishedLifeScoreStore.
 * The local mark is a reflection input that is posted as a daily log.
 */
@Singleton
class ScoreStore @Inject constructor(
    private val day: DayStore,
) {
    private val _state = MutableStateFlow(ScoreState.seed())
    val state: StateFlow<ScoreState> = _state.asStateFlow()

    /** Retained for compatibility with the old rail interaction; it is capture state only. */
    fun bumpRail(index: Int) = _state.update { state ->
        if (index !in state.rails.indices) return@update state
        val rails = state.rails.toMutableList()
        rails[index] = rails[index].copy(value = (rails[index].value + 5).coerceAtMost(100))
        state.copy(rails = rails, settled = false, notice = null)
    }

    fun setRung(rung: Int) = _state.update {
        if (rung !in 1..5) return@update it
        it.copy(rung = rung, settled = false, notice = ScoreNotice("Day reflection marked $rung of 5."))
    }

    fun dismissNotice() = _state.update { it.copy(notice = null) }

    fun resetToSeed() {
        _state.value = ScoreState.seed()
    }

    fun markLocalProvisional() = _state.update {
        it.copy(notice = ScoreNotice("LOCAL REFLECTION · published Life Score comes from server sync."), settled = false)
    }

    /** Save the reflection input only. It never appends a locally computed score. */
    fun settleDay() {
        _state.update {
            it.copy(
                settled = true,
                notice = ScoreNotice("Reflection saved. Published Life Score updates after server sync."),
            )
        }
    }

    fun markServerPending() = _state.update { it.copy(notice = ScoreNotice("REFLECTION SAVED · SERVER SYNC PENDING")) }

    fun markPosted() = _state.update { it.copy(notice = ScoreNotice("Reflection posted. Published Life Score stays server-calculated.")) }
}

data class ScoreNotice(val message: String)

data class RailMark(val label: String, val value: Int) {
    val pct: Float get() = value.coerceIn(0, 100) / 100f
}

data class ScoreState(
    val rails: List<RailMark>,
    val rung: Int,
    val settled: Boolean,
    val notice: ScoreNotice? = null,
) {
    companion object {
        fun seed() = ScoreState(
            rails = listOf(
                RailMark("BODY", 0),
                RailMark("MIND", 0),
                RailMark("DISCIPLINE", 0),
                RailMark("MONEY", 0),
                RailMark("MOOD", 0),
            ),
            rung = 3,
            settled = false,
        )
    }
}
