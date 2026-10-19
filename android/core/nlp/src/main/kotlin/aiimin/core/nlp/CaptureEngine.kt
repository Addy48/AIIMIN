package aiimin.core.nlp

import java.time.LocalDate
import java.time.LocalDateTime

/** What one clause of a capture line turned into. CHOOSE means "ask the person"; nothing is filed silently. */
enum class Kind { EXPENSE, INCOME, TASK, EVENT, NOTE, JOURNAL, RECURRING, DOCUMENT, MINIMUM, FOCUS, FEATURE, CHOOSE }

data class Item(
    val kind: Kind,
    /** Exact money in the smallest unit (paise/cents). Null when the clause has no amount or the amount is not certain. */
    val paise: Long? = null,
    val currency: String = "INR",
    val label: String = "",
    val category: String? = null,
    val date: LocalDate? = null,
    val time24: String? = null,
    /** morning / afternoon / evening / night when no clock time was given. */
    val dayPart: String? = null,
    /** daily / weekly / monthly / yearly / alternate / weekdays */
    val recurrence: String? = null,
    val confidence: Double = 0.0,
    val reason: String = "",
    val raw: String = "",
)

data class Analysis(val items: List<Item>, val normalized: String)

object CaptureEngine {
    fun analyze(
        text: String,
        now: LocalDateTime = LocalDateTime.now(),
        defaultCurrency: String = "INR",
        forced: Kind? = null,
    ): Analysis = Analysis(listOf(Item(Kind.CHOOSE, raw = text)), text)
}
