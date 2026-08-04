package aiimin.feature.score

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import aiimin.core.data.DayStore
import aiimin.core.data.ScoreState
import aiimin.core.data.ScoreStore
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn

/**
 * One job: **mark and settle the day.**
 *
 * Rails + ladder move the provisional figure; Settle locks it into day history.
 */
@HiltViewModel
class ScoreViewModel @Inject constructor(
    private val score: ScoreStore,
    day: DayStore,
) : ViewModel() {

    val state: StateFlow<ScoreUiState> = combine(score.state, day.state) { marks, dayState ->
        val minsDone = dayState.pursuits.count { (it.attainment ?: 0.0) >= 0.999 }
        val minsTotal = dayState.pursuits.size.coerceAtLeast(1)
        ScoreUiState(
            marks = marks,
            minsDone = minsDone,
            minsTotal = minsTotal,
            engineState = dayState.score.state,
            engineBand = dayState.score.band,
            engineConfidence = dayState.score.confidence,
        )
    }.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5_000),
        ScoreUiState.from(score.state.value, day.state.value),
    )

    fun onBumpRail(index: Int) = score.bumpRail(index)
    fun onSetRung(rung: Int) = score.setRung(rung)
    fun onSettle() = score.settleDay()
    fun onDismissNotice() = score.dismissNotice()
}

data class ScoreUiState(
    val marks: ScoreState,
    val minsDone: Int,
    val minsTotal: Int,
    val engineState: Double,
    val engineBand: Double,
    val engineConfidence: Double,
) {
    val live: Int get() = marks.liveScore(minsDone)
    val delta: String get() = marks.deltaLabel(minsDone)
    val movers get() = marks.movers(minsDone, minsTotal)

    companion object {
        fun from(marks: ScoreState, day: aiimin.core.data.DayState): ScoreUiState {
            val minsDone = day.pursuits.count { (it.attainment ?: 0.0) >= 0.999 }
            return ScoreUiState(
                marks = marks,
                minsDone = minsDone,
                minsTotal = day.pursuits.size.coerceAtLeast(1),
                engineState = day.score.state,
                engineBand = day.score.band,
                engineConfidence = day.score.confidence,
            )
        }
    }
}
