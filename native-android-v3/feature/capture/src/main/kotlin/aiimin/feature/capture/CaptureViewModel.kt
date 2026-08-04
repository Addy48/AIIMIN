package aiimin.feature.capture

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import aiimin.core.data.DayStore
import aiimin.core.data.MoneyStore
import aiimin.core.network.CaptureParseRepository
import aiimin.core.network.ParseChipDto
import aiimin.core.network.ParseResponse
import aiimin.feature.capture.parse.CaptureChip
import aiimin.feature.capture.parse.CaptureField
import aiimin.feature.capture.parse.CaptureParser
import aiimin.feature.capture.parse.ParsedCapture
import dagger.hilt.android.lifecycle.HiltViewModel
import java.time.Clock
import java.time.LocalDate
import java.time.LocalTime
import java.time.format.DateTimeFormatter
import javax.inject.Inject
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

/**
 * Capture's one job: turn one sentence into structured truth the user can
 * correct **before** it commits.
 *
 * Local [CaptureParser] paints immediately. When a session bearer exists,
 * `/intelligence/parse` may refine the offer (server AI keys — never in APK).
 */
@HiltViewModel
class CaptureViewModel @Inject constructor(
    private val parser: CaptureParser,
    private val aiParse: CaptureParseRepository,
    private val clock: Clock,
    private val day: DayStore,
    private val money: MoneyStore,
) : ViewModel() {

    private val _state = MutableStateFlow(CaptureUiState())
    val state: StateFlow<CaptureUiState> = _state.asStateFlow()

    private var nextId = 1L
    private val moneyByCapture = mutableMapOf<Long, Long>()
    private var aiJob: Job? = null

    fun onTextChange(text: String) {
        _state.update { current ->
            current.copy(
                text = text,
                offer = parser.parse(text).takeIf { text.isNotBlank() },
                parseSource = ParseSource.LOCAL,
                editing = null,
            )
        }
        scheduleAiParse(text)
    }

    fun onEditField(field: CaptureField) = _state.update { current ->
        if (current.editing == field) {
            current.copy(editing = null)
        } else {
            current.copy(editing = field, editingDraft = current.offer?.chip(field)?.value.orEmpty())
        }
    }

    fun onEditDraftChange(value: String) = _state.update { it.copy(editingDraft = value) }

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

    fun onToggleField(field: CaptureField) = _state.update { current ->
        val offer = current.offer ?: return@update current
        current.copy(offer = offer.toggle(field))
    }

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
        day.recordCapture(settled.label, settled.time, amount)
        if (amount != null && amount > 0) {
            val category = offer?.chip(CaptureField.CATEGORY)?.takeIf { it.included }?.value
                ?.uppercase()
                ?: "UNCATEGORISED"
            val moneyId = money.recordExpense(
                name = offer?.chip(CaptureField.MERCHANT)?.takeIf { it.included }?.value
                    ?: settled.label.take(28),
                amount = amount,
                category = category,
                dateLabel = LocalDate.now(clock).format(DATE),
            )
            moneyByCapture[settled.id] = moneyId
        }
        current.copy(
            text = "",
            offer = null,
            parseSource = ParseSource.LOCAL,
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

    fun onDrift() = _state.update { current ->
        if (current.text.isBlank()) return@update current
        current.copy(
            text = "",
            offer = null,
            parseSource = ParseSource.LOCAL,
            editing = null,
            holds = listOf(
                HeldCapture(nextId++, current.text.trim(), HoldReason.DRIFTED),
            ) + current.holds,
            notice = Notice("Drifted. Held here, nothing committed."),
        )
    }

    fun onUndo(id: Long) = _state.update { current ->
        val undone = current.settled.firstOrNull { it.id == id } ?: return@update current
        day.removeCapture(undone.label)
        moneyByCapture.remove(id)?.let { money.removeEntry(it) }
        current.copy(
            settled = current.settled - undone,
            text = undone.label,
            offer = parser.parse(undone.label),
            parseSource = ParseSource.LOCAL,
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

    private fun onSeed(current: CaptureUiState, seed: String): CaptureUiState {
        scheduleAiParse(seed)
        return current.copy(
            text = seed,
            offer = parser.parse(seed),
            parseSource = ParseSource.LOCAL,
            editing = null,
            notice = null,
        )
    }

    private fun scheduleAiParse(text: String) {
        aiJob?.cancel()
        val trimmed = text.trim()
        if (trimmed.isEmpty()) return
        aiJob = viewModelScope.launch {
            delay(AI_DEBOUNCE_MS)
            if (_state.value.text.trim() != trimmed) return@launch
            val ai = aiParse.parse(trimmed) ?: return@launch
            if (_state.value.text.trim() != trimmed) return@launch
            val mapped = ai.toParsedCapture() ?: return@launch
            _state.update {
                it.copy(offer = mapped, parseSource = ParseSource.AI)
            }
        }
    }

    private fun Int.grouped(): String {
        val digits = toString()
        if (digits.length <= 3) return digits
        val head = digits.dropLast(3)
        val tail = digits.takeLast(3)
        return head.reversed().chunked(2).joinToString(",").reversed() + ",$tail"
    }

    private companion object {
        val TIME: DateTimeFormatter = DateTimeFormatter.ofPattern("HH:mm")
        val DATE: DateTimeFormatter = DateTimeFormatter.ofPattern("dd.MM")
        const val NOTICE_MILLIS = 4200L
        const val AI_DEBOUNCE_MS = 480L
    }
}

private fun ParseResponse.toParsedCapture(): ParsedCapture? {
    val mapped = chips.mapNotNull { it.toChip() }
    if (mapped.isEmpty()) return null
    return ParsedCapture(text = text.orEmpty(), chips = mapped.sortedBy { it.field.ordinal })
}

private fun ParseChipDto.toChip(): CaptureChip? {
    val field = when (field.lowercase()) {
        "amount" -> CaptureField.AMOUNT
        "category" -> CaptureField.CATEGORY
        "merchant" -> CaptureField.MERCHANT
        "people" -> CaptureField.PEOPLE
        "mood" -> CaptureField.MOOD
        "duration" -> CaptureField.DURATION
        else -> return null
    }
    val value = value.trim()
    if (value.isEmpty()) return null
    return CaptureChip(field, value, included)
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
    JOURNAL("Journal", unavailableReason = "Journal is a surface of its own — open it from Config."),
    VOICE("Voice", unavailableReason = "Voice capture arrives with the voice line."),
    SCAN("Scan", unavailableReason = "Receipt scan needs the camera pipeline."),
    HABIT("Habit", unavailableReason = "Daily minimums live on Today."),
    ;

    val available: Boolean get() = seedText != null
}
