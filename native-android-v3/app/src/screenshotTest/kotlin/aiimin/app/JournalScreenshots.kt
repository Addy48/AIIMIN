package aiimin.app

import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.android.tools.screenshot.PreviewTest
import aiimin.core.data.JournalState
import aiimin.core.data.JournalTemplate
import aiimin.designsystem.theme.AiiminTheme
import aiimin.feature.journal.JournalScreen

private const val PHONE_W = 390
private const val TALL = 980

@PreviewTest
@Preview(name = "Journal · dark", widthDp = PHONE_W, heightDp = TALL)
@Composable
fun JournalDark() {
    AiiminTheme(darkTheme = true) { Board(JournalState.seed()) }
}

@PreviewTest
@Preview(name = "Journal · light", widthDp = PHONE_W, heightDp = TALL)
@Composable
fun JournalLight() {
    AiiminTheme(darkTheme = false) { Board(JournalState.seed()) }
}

@PreviewTest
@Preview(name = "Journal · drafting", widthDp = PHONE_W, heightDp = TALL)
@Composable
fun JournalDrafting() {
    AiiminTheme(darkTheme = true) {
        Board(
            JournalState.seed().copy(
                template = JournalTemplate.CBT,
                mood = 4,
                draft = "Situation: late ship. Thought: I am falling behind. Evidence: two merges landed. Reframe: crowded week, not a failed one.",
            ),
        )
    }
}

@Composable
private fun Board(state: JournalState) {
    JournalScreen(
        state = state,
        onTemplate = {},
        onDraft = {},
        onMood = {},
        onSave = {},
        onDismissNotice = {},
    )
}
