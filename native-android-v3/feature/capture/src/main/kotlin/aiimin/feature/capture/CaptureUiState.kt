package aiimin.feature.capture

import androidx.compose.runtime.Immutable
import aiimin.feature.capture.parse.CaptureField
import aiimin.feature.capture.parse.ParsedCapture

/**
 * Everything the Capture surface draws, in one immutable value.
 *
 * The invariant that makes this the trust surface: [offer] is a proposal and
 * nothing else. Only [settle] moves a reading into [settled]; until then the
 * only record of it is the text the user typed.
 */
@Immutable
data class CaptureUiState(
    val text: String = "",
    val offer: ParsedCapture? = null,
    /** The field whose editor is open, if any. */
    val editing: CaptureField? = null,
    val editingDraft: String = "",
    val holds: List<HeldCapture> = emptyList(),
    val settled: List<SettledCapture> = emptyList(),
    val notice: Notice? = null,
) {
    val hasOffer: Boolean get() = offer?.isEmpty == false
    val canSettle: Boolean get() = text.isNotBlank()
}

/** A capture the user drifted: read, kept, deliberately not committed. */
@Immutable
data class HeldCapture(
    val id: Long,
    val text: String,
    val reason: HoldReason,
)

enum class HoldReason {
    /** The user chose Drift. */
    DRIFTED,

    /** Settled with no connection — the write is queued, not lost. */
    QUEUED_OFFLINE,
    ;

    val label: String get() = if (this == DRIFTED) "HOLD" else "QUEUED"
}

/** A capture that has been committed. */
@Immutable
data class SettledCapture(
    val id: Long,
    val label: String,
    val time: String,
    val amount: Int?,
)

/** A one-line announcement, with the way back out of it when there is one. */
@Immutable
data class Notice(
    val message: String,
    val undoId: Long? = null,
)
