package aiimin.feature.capture

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import aiimin.feature.capture.parse.CaptureField
import aiimin.feature.capture.parse.CaptureParser
import dagger.hilt.android.lifecycle.HiltViewModel
import java.time.Clock
import java.time.LocalTime
import java.time.format.DateTimeFormatter
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

/**
 * Capture's one job: turn one sentence into structured truth the user can
 * correct **before** it commits.
 *
 * State is local for now (guardrail G7 — get the surface right, then wire it).
 * When the API lands, [settle] posts to `/db/<entity>` and [drift] is what the
 * offline queue flushes; the shape of this state does not have to change for
 * that, which is the point of building it this way round.
 */
@HiltViewModel
class CaptureViewModel @Inject constructor(
    private val parser: CaptureParser,
    private val clock: Clock,
) : ViewModel() {

    private val _state = MutableStateFlow(CaptureUiState())
    val state: StateFlow<CaptureUiState> = _state.asStateFlow()

    private var nextId = 1L

    fun onTextChange(text: String) = _state.update { current ->
        current.copy(
            text = text,
            offer = parser.parse(text).takeIf { text.isNotBlank() },
            editing = null,
        )
    }

    /** Tap a chip: open its editor, pre-filled, ready to overwrite. */
    fun onEditField(field: CaptureField) = _state.update { current ->
        if (current.editing == field) {
            current.copy(editing = null)
        } else {
            current.copy(editing = field, editingDraft = current.offer?.chip(field)?.value.orEmpty())
        }
    }

    fun onEditDraftChange(value: String) = _state.update { it.copy(editingDraft = value) }

    /** The second of the two taps: the correction lands and the field is on. */
    fun onCommitEdit() = _state.update { current ->
        val field = current.editing ?: return@update current
        val offer = current.offer ?: return@update current
        current.copy(
            offer = offer.withValue(field, current.editingDraft.trim()),
            editing = null,
            editingDraft = "",
        )
    }

    fun onCancelEdit() = _state.update { it.copy(editing = null, editingDraft = "") }

    /** Drop a reading from the commit, or put it back. One tap, reversible. */
    fun onToggleField(field: CaptureField) = _state.update { current ->
        val offer = current.offer ?: return@update current
        current.copy(offer = offer.toggle(field))
    }

    /**
     * Commit. This is the only path that writes, and it is only ever reached by
     * an explicit press.
     */
    fun onSettle() = _state.update { current ->
        if (!current.canSettle) return@update current
        val offer = current.offer
        val amount = offer?.settledAmount()
        val settled = SettledCapture(
            id = nextId++,
            label = current.text.trim(),
            time = LocalTime.now(clock).format(TIME),
            amount = amount,
        )
        current.copy(
            text = "",
            offer = null,
            editing = null,
            editingDraft = "",
            settled = listOf(settled) + current.settled,
            notice = Notice(
                message = amount?.let { "Settled · ₹${it.grouped()} written to the ledger." }
                    ?: "Settled · logged to the day.",
                undoId = settled.id,
            ),
        )
    }

    /** Hold it. Read, kept, nothing written — the escape hatch from a bad parse. */
    fun onDrift() = _state.update { current ->
        if (current.text.isBlank()) return@update current
        current.copy(
            text = "",
            offer = null,
            editing = null,
            holds = listOf(
                HeldCapture(nextId++, current.text.trim(), HoldReason.DRIFTED),
            ) + current.holds,
            notice = Notice("Drifted. Held here, nothing committed."),
        )
    }

    /** Take back the last write, whole. */
    fun onUndo(id: Long) = _state.update { current ->
        val undone = current.settled.firstOrNull { it.id == id } ?: return@update current
        current.copy(
            settled = current.settled - undone,
            text = undone.label,
            offer = parser.parse(undone.label),
            notice = null,
        )
    }

    fun onNoticeShown() = viewModelScope.launch {
        kotlinx.coroutines.delay(NOTICE_MILLIS)
        _state.update { it.copy(notice = null) }
    }

    fun onDismissNotice() = _state.update { it.copy(notice = null) }

    fun onPreset(preset: CapturePreset) = _state.update { current ->
        preset.seedText?.let { seed -> return@update onSeed(current, seed) }
        current.copy(notice = Notice(preset.unavailableReason))
    }

    private fun onSeed(current: CaptureUiState, seed: String) = current.copy(
        text = seed,
        offer = parser.parse(seed),
        editing = null,
        notice = null,
    )

    private fun Int.grouped(): String {
        val digits = toString()
        if (digits.length <= 3) return digits
        val head = digits.dropLast(3)
        val tail = digits.takeLast(3)
        return head.reversed().chunked(2).joinToString(",").reversed() + ",$tail"
    }

    private companion object {
        val TIME: DateTimeFormatter = DateTimeFormatter.ofPattern("HH:mm")
        const val NOTICE_MILLIS = 4200L
    }
}

/**
 * The six ways in. Two of them work today; the rest name what they are waiting
 * for rather than pretending.
 */
enum class CapturePreset(
    val label: String,
    val seedText: String? = null,
    val unavailableReason: String = "",
) {
    EXPENSE("Expense", seedText = "paid  swiggy dinner"),
    NOTE("Note", seedText = "note: "),
    JOURNAL("Journal", unavailableReason = "Journal is a surface of its own — it comes later in the build."),
    VOICE("Voice", unavailableReason = "Voice capture arrives with the voice line."),
    SCAN("Scan", unavailableReason = "Receipt scan needs the camera pipeline."),
    HABIT("Habit", unavailableReason = "Daily minimums live on Today, which is the next screen."),
    ;

    val available: Boolean get() = seedText != null
}
