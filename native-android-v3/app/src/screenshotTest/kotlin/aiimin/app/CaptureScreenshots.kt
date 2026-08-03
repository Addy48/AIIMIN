package aiimin.app

import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.android.tools.screenshot.PreviewTest
import aiimin.designsystem.theme.AiiminTheme
import aiimin.feature.capture.CaptureScreen
import aiimin.feature.capture.CaptureUiState
import aiimin.feature.capture.HeldCapture
import aiimin.feature.capture.HoldReason
import aiimin.feature.capture.Notice
import aiimin.feature.capture.SettledCapture
import aiimin.feature.capture.parse.CaptureField
import aiimin.feature.capture.parse.CaptureParser

/**
 * Capture's states, pinned as images: the offer as first read, the offer being
 * corrected, and the surface at rest. If a parse rule or a token moves, one of
 * these changes and the build says so.
 */
private const val PHONE_W = 390
private const val TALL = 1000

private val parser = CaptureParser()
private const val SENTENCE = "paid 1240 swiggy dinner with rohan, felt sluggish after"

private fun offered() = CaptureUiState(text = SENTENCE, offer = parser.parse(SENTENCE))

@PreviewTest
@Preview(name = "Capture · offer · dark", widthDp = PHONE_W, heightDp = TALL)
@Composable
fun CaptureOfferDark() {
    AiiminTheme(darkTheme = true) { Capture(offered()) }
}

@PreviewTest
@Preview(name = "Capture · offer · light", widthDp = PHONE_W, heightDp = TALL)
@Composable
fun CaptureOfferLight() {
    AiiminTheme(darkTheme = false) { Capture(offered()) }
}

/** The correction path: one tap opened the amount, the next one sets it. */
@PreviewTest
@Preview(name = "Capture · correcting", widthDp = PHONE_W, heightDp = TALL)
@Composable
fun CaptureCorrecting() {
    AiiminTheme(darkTheme = true) {
        Capture(
            offered().copy(
                editing = CaptureField.AMOUNT,
                editingDraft = "1240",
            ),
        )
    }
}

/** After a settle: the write announced, the way back out of it offered. */
@PreviewTest
@Preview(name = "Capture · settled", widthDp = PHONE_W, heightDp = TALL)
@Composable
fun CaptureSettled() {
    AiiminTheme(darkTheme = true) {
        Capture(
            CaptureUiState(
                settled = listOf(
                    SettledCapture(1, SENTENCE, "21:14", 1240),
                    SettledCapture(2, "metro fare ₹60", "09:51", 60),
                ),
                holds = listOf(
                    HeldCapture(3, "voice note · 0:34", HoldReason.DRIFTED),
                    HeldCapture(4, "receipt · blinkit", HoldReason.QUEUED_OFFLINE),
                ),
                notice = Notice("Settled · ₹1,240 written to the ledger.", undoId = 1),
            ),
        )
    }
}

/** At rest: no offer, honest empty states, nothing pretending to hold data. */
@PreviewTest
@Preview(name = "Capture · empty", widthDp = PHONE_W, heightDp = TALL)
@Composable
fun CaptureEmpty() {
    AiiminTheme(darkTheme = true) { Capture(CaptureUiState()) }
}

@Composable
private fun Capture(state: CaptureUiState) {
    CaptureScreen(
        state = state,
        onTextChange = {},
        onEditField = {},
        onEditDraftChange = {},
        onCommitEdit = {},
        onCancelEdit = {},
        onToggleField = {},
        onSettle = {},
        onDrift = {},
        onUndo = {},
        onPreset = {},
    )
}
