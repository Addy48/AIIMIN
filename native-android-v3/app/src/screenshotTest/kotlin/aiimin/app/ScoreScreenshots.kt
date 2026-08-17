package aiimin.app

import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.android.tools.screenshot.PreviewTest
import aiimin.core.data.ScoreState
import aiimin.designsystem.theme.AiiminTheme
import aiimin.feature.score.ScoreScreen
import aiimin.feature.score.ScoreUiState

private const val PHONE_W = 390
private const val TALL = 980

@PreviewTest
@Preview(name = "Score · dark", widthDp = PHONE_W, heightDp = TALL)
@Composable
fun ScoreDark() {
    AiiminTheme(darkTheme = true) { Board(seed()) }
}

@PreviewTest
@Preview(name = "Score · light", widthDp = PHONE_W, heightDp = TALL)
@Composable
fun ScoreLight() {
    AiiminTheme(darkTheme = false) { Board(seed()) }
}

@PreviewTest
@Preview(name = "Score · settled", widthDp = PHONE_W, heightDp = TALL)
@Composable
fun ScoreSettled() {
    AiiminTheme(darkTheme = true) {
        Board(
            seed().copy(
                marks = ScoreState.seed().copy(
                    settled = true,
                    rung = 4,
                    notice = null,
                ),
            ),
        )
    }
}

private fun seed() = ScoreUiState(
    marks = ScoreState.seed(),
    minsDone = 3,
    minsTotal = 4,
    engineState = 0.0,
    engineBand = 12.0,
    engineConfidence = 0.0,
)

@Composable
private fun Board(state: ScoreUiState) {
    ScoreScreen(
        state = state,
        onBumpRail = {},
        onSetRung = {},
        onSettle = {},
        onDismissNotice = {},
    )
}
