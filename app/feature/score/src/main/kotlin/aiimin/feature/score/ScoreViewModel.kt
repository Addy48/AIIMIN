package aiimin.feature.score

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import aiimin.core.data.DailyLogRepository
import aiimin.core.data.DayStore
import aiimin.core.data.PublishedLifeScoreState
import aiimin.core.data.PublishedLifeScoreStore
import aiimin.core.data.ScoreState
import aiimin.core.data.ScoreStore
import dagger.hilt.android.lifecycle.HiltViewModel
import java.time.LocalDate
import javax.inject.Inject
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

/**
 * One job: capture and sync a day reflection.
 *
 * The numeric Life Score is always the published server result. The app never
 * computes a competing provisional score from rails, rungs, or local pursuits.
 */
@HiltViewModel
class ScoreViewModel @Inject constructor(
    private val score: ScoreStore,
    day: DayStore,
    publishedLifeScore: PublishedLifeScoreStore,
    private val dailyLogs: DailyLogRepository,
) : ViewModel() {

    val state: StateFlow<ScoreUiState> = combine(
        score.state,
        day.state,
        publishedLifeScore.state,
    ) { marks, dayState, published ->
        ScoreUiState.from(marks, dayState, published)
    }.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5_000),
        ScoreUiState.from(score.state.value, day.state.value, publishedLifeScore.state.value),
    )

    fun onBumpRail(index: Int) = score.bumpRail(index)
    fun onSetRung(rung: Int) = score.setRung(rung)

    fun onSettle() {
        score.settleDay()
        val rung = score.state.value.rung
        viewModelScope.launch {
            dailyLogs.postMark(LocalDate.now().toString(), rung)
                .onSuccess { score.markPosted() }
                .onFailure { score.markServerPending() }
        }
    }

    fun onDismissNotice() = score.dismissNotice()
}

data class ScoreUiState(
    val marks: ScoreState,
    val minsDone: Int,
    val minsTotal: Int,
    /** Compatibility metadata only; the UI should read [published]. */
    val engineState: Double,
    val engineBand: Double,
    val engineConfidence: Double,
    val published: PublishedLifeScoreState = PublishedLifeScoreState.absent(),
) {
    val scoreAvailable: Boolean get() = published.available && published.global != null
    val displayScore: Int? get() = published.global
    val confidenceLabel: String get() = published.confidenceLabel ?: "unavailable"
    val trendLabel: String get() = published.trendDirection ?: "unknown"

    companion object {
        fun from(
            marks: ScoreState,
            day: aiimin.core.data.DayState,
            published: PublishedLifeScoreState = PublishedLifeScoreState.absent(),
        ): ScoreUiState {
            val minsDone = day.pursuits.count { (it.attainment ?: 0.0) >= 0.999 }
            return ScoreUiState(
                marks = marks,
                minsDone = minsDone,
                minsTotal = day.pursuits.size.coerceAtLeast(1),
                engineState = published.global?.toDouble() ?: 0.0,
                engineBand = published.uncertaintyBand?.toDouble() ?: 0.0,
                engineConfidence = published.confidenceScore ?: 0.0,
                published = published,
            )
        }
    }
}
