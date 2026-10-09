package aiimin.core.nlp

import kotlin.math.roundToLong

enum class CaptureType { EXPENSE, INCOME, NOTE, HABIT, TASK, JOURNAL }

/** What the capture box should assume when the text alone is ambiguous. */
enum class CaptureMode { ALL, TASK, EXPENSE, NOTE, MOOD, HABIT }

data class Capture(
    val type: CaptureType?,
    val amount: Long = 0,
    val label: String = "",
    val category: String? = null,
    val mood: Int? = null,
    val tags: List<String> = emptyList(),
    /** "5:30 PM" style, for display. */
    val timeLabel: String? = null,
    /** "17:30", for scheduling. */
    val time24: String? = null,
    /** today / tomorrow / tonight / morning / afternoon / evening. */
    val dayWord: String? = null,
    val raw: String = "",
)

/**
 * One line of plain language → one structured item. India-first: ₹, Rs,
 * "1.5k", "2 lakh". Times and mood scores are removed before amounts are read,
 * so "at 17:30" or "7/10" never become money. Prototype reference: `parseCap`.
 */
object CaptureParser {

    private val I = RegexOption.IGNORE_CASE
    private const val AMT = """((?:\d[\d,]*(?:\.\d+)?|\.\d+)\s*(?:k|lakhs?|lac|cr|crores?)?)"""
    private const val INCOME_WORDS = """received|refund\w*|credited|cashback|salary|deposited|reimburs\w*|bonus"""

    private val TAG = Regex("""#(\w+)""")
    private val TIME_12 = Regex("""\b(\d{1,2}(?::\d{2})?)\s*(am|pm)\b""", I)
    private val TIME_24 = Regex("""\b([01]?\d|2[0-3]):([0-5]\d)\b""")
    private val DAY_PART = Regex("""\b(tomorrow|tonight|today|morning|afternoon|evening)\b""", I)
    private val MOOD = Regex("""(\d{1,2})\s*/\s*10""")
    private val INCOME_WORD = Regex("""\b($INCOME_WORDS|income)\b""", I)
    private val INCOME_BEFORE = Regex("""(?:$INCOME_WORDS|got)[^\d\n]{0,20}$AMT""", I)
    private val INCOME_AFTER = Regex("""$AMT[^\d\n]{0,20}(?:$INCOME_WORDS|income)""", I)
    private val SPEND = Regex("""(?:paid|spent|gave|bought|cost|charged?|charges)[^\d\n]{0,20}$AMT""", I)
    private val BARE = Regex("""(?:₹|rs\.?)\s*$AMT""", I)
    private val ANY_AMOUNT = Regex(AMT, I)
    private val NOTE = Regex("""^(?:note|n)[:\-\s]+(.+)""", I)
    private val HABIT = Regex("""^habit[:\-\s]+(.+)""", I)
    private val HABIT_PHRASE = Regex("""\b(?:read \d+ pages|workout|ran \d+k|meditat\w*|journalled?|journaling)\b""", I)
    private val TASK_VERB = Regex("""^(?:call|email|review|meet|schedule|buy|fix|debug|write|finish|ship|deploy|prep|clean|organize|send|draft|plan)\b""", I)
    private val TASK = Regex("""^(?:task|t)[:\-\s]+(.+)""", I)
    private val SPEND_KEYWORDS = Regex(
        """\b(swiggy|zomato|uber|ola|rapido|metro|petrol|fuel|lunch|dinner|breakfast|coffee|chai|grocery|groceries|bigbasket|blinkit|zepto|dmart|rent|bill|recharge|netflix|amazon|flipkart|auto|rickshaw|cab|taxi|bus|train|movie|snacks|tea|parking|toll|medicine|pharmacy)\b""",
        I,
    )
    private val LEADING_NUMBER = Regex("""^(\d*\.?\d+)""")

    fun parse(text: String, mode: CaptureMode = CaptureMode.ALL): Capture {
        val t = text.trim()
        if (t.isEmpty()) return Capture(type = null)
        val tags = TAG.findAll(t).map { "#" + it.groupValues[1] }.toList()

        var timeLabel: String? = null
        var time24: String? = null
        val m12 = TIME_12.find(t)
        val m24 = TIME_24.find(t)
        if (m12 != null) {
            val parts = m12.groupValues[1].split(":")
            val hh = parts[0].toInt()
            val mm = parts.getOrNull(1)?.toInt() ?: 0
            val h = (hh % 12) + if (m12.groupValues[2].equals("pm", true)) 12 else 0
            time24 = "%02d:%02d".format(h, mm)
            timeLabel = clockLabel(h, mm)
        } else if (m24 != null) {
            val h = m24.groupValues[1].toInt()
            val mm = m24.groupValues[2].toInt()
            time24 = "%02d:%02d".format(h, mm)
            timeLabel = clockLabel(h, mm)
        }
        val dayWord = DAY_PART.find(t)?.groupValues?.get(1)?.lowercase()

        val clean = t.replace(Regex("""\d{1,2}\s*/\s*10"""), " ")
            .replace(Regex("""\b\d{1,2}:\d{2}\b"""), " ")
            .replace(Regex("""\b\d{1,2}\s*(?:am|pm)\b""", I), " ")
            .trim()

        val incomeWord = INCOME_WORD.containsMatchIn(clean)
        val mR = INCOME_BEFORE.find(clean)
        val mRafter = INCOME_AFTER.find(clean)
        val mA = SPEND.find(clean)
        val mBare = BARE.find(clean)
        val mM = MOOD.find(t)
        val mN = NOTE.find(t)
        val mH = HABIT.find(t)
        val habitPhrase = HABIT_PHRASE.find(t)
        val mTaskVerb = TASK_VERB.find(t)
        val mT = TASK.find(t)

        var type: CaptureType? = null
        var amount = 0L
        val mood = mM?.groupValues?.get(1)?.toInt()?.coerceIn(1, 10)

        val incAmt = maxOf(amountOf(mR), amountOf(mRafter))
        val bareAmt = amountOf(mBare)
        val spendAmt = amountOf(mA)
        when {
            incomeWord && (incAmt > 0 || bareAmt > 0) && spendAmt == 0L -> {
                type = CaptureType.INCOME
                amount = if (incAmt > 0) incAmt else bareAmt
            }
            spendAmt > 0 -> {
                type = CaptureType.EXPENSE
                amount = spendAmt
            }
            bareAmt > 0 -> {
                type = CaptureType.EXPENSE
                amount = bareAmt
            }
            incomeWord && incAmt > 0 -> {
                type = CaptureType.INCOME
                amount = incAmt
            }
            SPEND_KEYWORDS.containsMatchIn(clean) -> {
                val v = amountOf(ANY_AMOUNT.find(clean))
                if (v > 0) {
                    type = CaptureType.EXPENSE
                    amount = v
                }
            }
        }
        if (mN != null) type = type ?: CaptureType.NOTE
        if (mH != null) {
            type = CaptureType.HABIT
        } else if (habitPhrase != null && mN == null && mT == null) {
            type = CaptureType.HABIT
        }
        if (mT != null || (type == null && mTaskVerb != null && mR == null && mA == null && mM == null && mN == null && mH == null)) {
            type = CaptureType.TASK
        }
        if (mM != null && type == null) type = CaptureType.JOURNAL

        if (type == null && mode != CaptureMode.ALL) {
            when (mode) {
                CaptureMode.TASK -> type = CaptureType.TASK
                CaptureMode.EXPENSE -> {
                    type = CaptureType.EXPENSE
                    amount = Regex("""[\d,]+(?:\.\d+)?""").find(t)?.value?.replace(",", "")?.toDoubleOrNull()?.roundToLong() ?: 0
                }
                CaptureMode.NOTE -> type = CaptureType.NOTE
                CaptureMode.MOOD -> type = CaptureType.JOURNAL
                CaptureMode.HABIT -> type = CaptureType.HABIT
                CaptureMode.ALL -> Unit
            }
        }

        var label = ""
        var category: String? = null
        if (type == CaptureType.EXPENSE || type == CaptureType.INCOME) {
            category = categoryOf(t)
            val isIncome = Regex("""received|refund|credited|salary|deposited|cashback|income|bonus|reimburs""").containsMatchIn(t.lowercase())
            if (type == CaptureType.INCOME && !isIncome && amount == 0L) type = CaptureType.NOTE
            label = moneyLabel(t)
        }
        when (type) {
            CaptureType.NOTE -> label = t.replaceFirst(Regex("""^(note|n)[:\-\s]+""", I), "").take(40).ifEmpty { "Quick capture" }
            CaptureType.JOURNAL -> label = "Journal entry"
            CaptureType.HABIT -> label = (mH?.groupValues?.get(1) ?: habitPhrase?.value ?: t).take(30)
            CaptureType.TASK -> label = t.replaceFirst(Regex("""^(task|t)[:\-\s]+""", I), "").take(40)
            else -> Unit
        }
        if (type == null) {
            type = CaptureType.NOTE
            label = t.take(40)
        }
        return Capture(type, amount, label, category, mood, tags, timeLabel, time24, dayWord, t)
    }

    fun categoryOf(text: String): String? {
        val low = text.lowercase()
        return when {
            Regex("""\b(swiggy|zomato|food|dinner|lunch|breakfast|cafe|coffee|chai|restaurant|hotel)\b""").containsMatchIn(low) -> "Food"
            Regex("""\b(petrol|metro|uber|ola|rapido|cab|taxi|fuel|auto|rickshaw|autorickshaw|bus|train|parking|toll)\b""").containsMatchIn(low) -> "Transport"
            Regex("""\b(jio|airtel|netflix|prime|spotify|subscription|sub)\b""").containsMatchIn(low) -> "Subs"
            Regex("""\b(bigbasket|blinkit|zepto|dmart|grocery|groceries|provisions|supermarket|store|kirana)\b""").containsMatchIn(low) -> "Grocery"
            else -> null
        }
    }

    /** "paid 450 for lunch" → "Lunch" (the prototype kept the "for"). */
    private fun moneyLabel(t: String): String {
        val name = t.replaceFirst(Regex("""^(paid|spent|received|got|bought|cost|charged?)\s*""", I), "")
            .replaceFirst(Regex("""(₹|\brs\.?)""", I), "")
            .replaceFirst(Regex("""\d[\d,]*(?:\.\d+)?\s*(?:k|lakhs?|lac|cr|crores?)?""", I), "")
            .replaceFirst(Regex("""\b\d{1,2}:\d{2}\b"""), "")
            .trim()
            .replaceFirst(Regex("""^(for|on|at|to|towards)\s+""", I), "")
            .split(Regex("""\s+""")).filter { it.isNotBlank() }.take(3).joinToString(" ")
            .ifEmpty { "Expense" }
        return name.replaceFirstChar { it.uppercase() }
    }

    private fun amountOf(m: MatchResult?): Long {
        val g = m?.groupValues?.getOrNull(1)?.takeIf { it.isNotEmpty() } ?: return 0
        val raw = g.replace(Regex("""[,\s]"""), "").lowercase()
        val mult = when {
            raw.endsWith("k") -> 1_000.0
            Regex("""(lakhs?|lac)$""").containsMatchIn(raw) -> 100_000.0
            Regex("""(crores?|cr)$""").containsMatchIn(raw) -> 10_000_000.0
            else -> 1.0
        }
        val v = LEADING_NUMBER.find(raw)?.value?.toDoubleOrNull() ?: return 0
        val total = v * mult
        return if (total.isFinite()) kotlin.math.floor(total + 0.5).toLong() else 0
    }

    private fun clockLabel(h: Int, m: Int): String =
        "${if (h % 12 == 0) 12 else h % 12}:${"%02d".format(m)} ${if (h < 12) "AM" else "PM"}"
}
