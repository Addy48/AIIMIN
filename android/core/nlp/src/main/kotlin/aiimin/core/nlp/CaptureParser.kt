package aiimin.core.nlp

import java.time.LocalDate
import java.time.LocalDateTime

enum class CaptureType { EXPENSE, INCOME, NOTE, HABIT, TASK, JOURNAL, EVENT, RECURRING, DOCUMENT, MINIMUM, FOCUS }

/** What the capture box should assume when the text alone is ambiguous. */
enum class CaptureMode { ALL, TASK, EXPENSE, NOTE, MOOD, HABIT }

data class Capture(
    /** Null when the engine is not sure: the caller must ask (the type chooser), never guess. */
    val type: CaptureType?,
    /** Whole rupees, kept for old callers. Use [paise] for anything that is saved. */
    val amount: Long = 0,
    val label: String = "",
    val category: String? = null,
    val mood: Int? = null,
    val tags: List<String> = emptyList(),
    /** "5:30 PM" style, for display. */
    val timeLabel: String? = null,
    /** "17:30", for scheduling. */
    val time24: String? = null,
    /** today / tomorrow when the line named them. */
    val dayWord: String? = null,
    val raw: String = "",
    /** Exact money in the smallest unit; 0 when the line had no certain amount. */
    val paise: Long = 0,
    val currency: String = "INR",
    val date: LocalDate? = null,
    val recurrence: String? = null,
    val minutes: Int? = null,
    /** True when the line needs the type chooser. */
    val choose: Boolean = false,
)

/**
 * One line of plain language → one structured item (the first clause). Thin wrapper over [CaptureEngine],
 * which does the real work (Hinglish normalising, exact paise, currency, dates, kinds, confidence).
 */
object CaptureParser {

    private val TAG = Regex("""#(\w+)""")
    private val MOOD = Regex("""(\d{1,2})\s*/\s*10""")

    fun parse(text: String, mode: CaptureMode = CaptureMode.ALL, now: LocalDateTime = LocalDateTime.now()): Capture {
        val t = text.trim()
        if (t.isEmpty()) return Capture(type = null)
        val tags = TAG.findAll(t).map { "#" + it.groupValues[1] }.toList()
        val forced = when (mode) {
            CaptureMode.TASK -> Kind.TASK
            CaptureMode.EXPENSE -> Kind.EXPENSE
            CaptureMode.NOTE -> Kind.NOTE
            CaptureMode.MOOD -> Kind.JOURNAL
            CaptureMode.HABIT -> Kind.MINIMUM
            CaptureMode.ALL -> null
        }
        val item = CaptureEngine.analyze(t, now, forced = forced).items.firstOrNull() ?: return Capture(type = null, raw = t, tags = tags)
        val mood = MOOD.find(t)?.groupValues?.get(1)?.toInt()?.coerceIn(1, 10)
        val today = now.toLocalDate()
        val dayWord = when (item.date) { today -> "today"; today.plusDays(1) -> "tomorrow"; else -> null } ?: item.dayPart.takeIf { it == "morning" || it == "evening" || it == "afternoon" }
        val type = when (item.kind) {
            Kind.EXPENSE -> CaptureType.EXPENSE
            Kind.INCOME -> CaptureType.INCOME
            Kind.TASK -> CaptureType.TASK
            Kind.EVENT -> CaptureType.EVENT
            Kind.NOTE -> CaptureType.NOTE
            Kind.JOURNAL -> CaptureType.JOURNAL
            Kind.RECURRING -> CaptureType.RECURRING
            Kind.DOCUMENT -> CaptureType.DOCUMENT
            Kind.MINIMUM -> CaptureType.MINIMUM
            Kind.FOCUS -> CaptureType.FOCUS
            Kind.FEATURE, Kind.CHOOSE -> null
        }
        val paise = item.paise ?: 0L
        return Capture(
            type = type, amount = paise / 100, label = item.label.ifEmpty { if (type == CaptureType.NOTE) t.take(40) else "" }, category = item.category, mood = mood, tags = tags,
            timeLabel = item.time24?.let { clockLabel(it) }, time24 = item.time24, dayWord = dayWord, raw = t,
            paise = paise, currency = item.currency, date = item.date, recurrence = item.recurrence, minutes = item.minutes, choose = item.kind == Kind.CHOOSE,
        )
    }

    fun categoryOf(text: String): String? = CaptureLexicon.category(text.lowercase().split(Regex("""\W+""")).filter { it.isNotEmpty() }, text.lowercase())

    private fun clockLabel(hhmm: String): String {
        val (h, m) = hhmm.split(":").map { it.toInt() }
        return "${if (h % 12 == 0) 12 else h % 12}:${"%02d".format(m)} ${if (h < 12) "AM" else "PM"}"
    }
}
