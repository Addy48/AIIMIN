package aiimin.app

import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.android.tools.screenshot.PreviewTest
import aiimin.designsystem.theme.AiiminTheme
import aiimin.feature.osid.OsIdScreen
import aiimin.feature.osid.OsIdUiState

private const val PHONE_W = 390
private const val TALL = 1000

@PreviewTest
@Preview(name = "OS-ID · dark", widthDp = PHONE_W, heightDp = TALL)
@Composable
fun OsIdDark() {
    AiiminTheme(darkTheme = true) { OsId(seed()) }
}

@PreviewTest
@Preview(name = "OS-ID · light", widthDp = PHONE_W, heightDp = TALL)
@Composable
fun OsIdLight() {
    AiiminTheme(darkTheme = false) { OsId(seed()) }
}

private fun seed() = OsIdUiState(
    osId = "AADI2004",
    holder = "A. UPADHYAY",
    issued = "14.03.25",
    memberNo = "#1204",
    tierLabel = "CORE",
    revisionsLeft = 1,
    isValid = true,
    isSeed = true,
)

@Composable
private fun OsId(state: OsIdUiState) {
    OsIdScreen(state = state, onCopy = {}, onShare = {}, onDismissNotice = {})
}
