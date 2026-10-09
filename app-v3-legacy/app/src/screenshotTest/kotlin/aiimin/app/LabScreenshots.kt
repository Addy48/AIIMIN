package aiimin.app

import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.android.tools.screenshot.PreviewTest
import aiimin.core.data.LabState
import aiimin.designsystem.theme.AiiminTheme
import aiimin.feature.lab.LabScreen

private const val PHONE_W = 390
private const val TALL = 1100

@PreviewTest
@Preview(name = "Lab · dark", widthDp = PHONE_W, heightDp = TALL)
@Composable
fun LabDark() {
    AiiminTheme(darkTheme = true) { Board(LabState.seed()) }
}

@PreviewTest
@Preview(name = "Lab · light", widthDp = PHONE_W, heightDp = TALL)
@Composable
fun LabLight() {
    AiiminTheme(darkTheme = false) { Board(LabState.seed()) }
}

@PreviewTest
@Preview(name = "Lab · pair 2", widthDp = PHONE_W, heightDp = TALL)
@Composable
fun LabPairTwo() {
    AiiminTheme(darkTheme = true) {
        Board(LabState.seed().copy(selectedIndex = 2))
    }
}

@Composable
private fun Board(state: LabState) {
    LabScreen(state = state, onSelect = {})
}
