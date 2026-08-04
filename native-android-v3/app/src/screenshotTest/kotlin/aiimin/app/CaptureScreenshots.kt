package aiimin.app

import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.android.tools.screenshot.PreviewTest
import aiimin.core.data.DayState
import aiimin.core.data.SettledLine
import aiimin.core.model.Observation
import aiimin.designsystem.theme.AiiminTheme
import aiimin.feature.today.TodayScreen
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

// --- Today ------------------------------------------------------------------

@PreviewTest
@Preview(name = "Today · dark", widthDp = PHONE_W, heightDp = 1200)
@Composable
fun TodayDark() {
    AiiminTheme(darkTheme = true) { Today(DayState.seed()) }
}

@PreviewTest
@Preview(name = "Today · light", widthDp = PHONE_W, heightDp = 1200)
@Composable
fun TodayLight() {
    AiiminTheme(darkTheme = false) { Today(DayState.seed()) }
}

/** A day in progress: some pursuits met, a floor breached, four weeks of history. */
@PreviewTest
@Preview(name = "Today · in progress", widthDp = PHONE_W, heightDp = 1200)
@Composable
fun TodayInProgress() {
    val seed = DayState.seed()
    val progressed = seed.copy(
        baselineDays = 34,
        history = List(28) { 62.0 + it * 0.55 },
        microTask = "Finish the parser and settle the day",
        captures = listOf(
            SettledLine("paid 1240 swiggy dinner with rohan", "21:14", 1240),
            SettledLine("metro fare 60", "09:51", 60),
        ),
        today = seed.today.map { entry ->
            val value = when (entry.commitment.id) {
                1L -> 95.0      // deep work, 95 of the 120 minutes promised
                2L -> 3_100.0   // a seated day — the walk barely happened
                3L -> 1.0       // journalled
                5L -> 3_100.0   // same steps, read as a floor: warns, never scores
                6L -> 5.4       // slept 5.4 against a 6.5 floor
                else -> null    // spends not logged — unknown, not zero
            }
            val holds = mapOf(1L to 0.93, 2L to 0.71, 3L to 0.87, 4L to 0.62)
            entry.copy(
                observation = Observation(entry.commitment.id, value),
                hold = aiimin.core.model.Hold(
                    value = holds[entry.commitment.id] ?: 0.0,
                    currentRun = if (entry.commitment.id == 1L) 6 else 0,
                    bestRun = if (entry.commitment.id == 1L) 21 else 4,
                    observedDays = if (holds.containsKey(entry.commitment.id)) 34 else 0,
                ),
            )
        },
    )
    AiiminTheme(darkTheme = true) { Today(progressed) }
}

@Composable
private fun Today(state: DayState) {
    TodayScreen(
        state = state,
        onOpenCapture = {},
        onToggle = {},
        onMicroTaskChange = {},
    )
}
