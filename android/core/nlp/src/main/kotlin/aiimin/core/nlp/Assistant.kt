package aiimin.core.nlp

import java.time.LocalDate

/** What the assistant may read, switched per module by the person (plan §13). */
enum class AiModule(val label: String) {
    TASKS("Tasks & plan"),
    CALENDAR("Calendar"),
    MONEY("Money"),
    NOTES("Notes"),
    JOURNAL("Journal"),
    VAULT("Vault documents (never sensitive ones)"),
    FAMILY("Family (shared items only)"),
}

data class AiScope(val allowed: Set<AiModule>) {
    operator fun contains(m: AiModule) = m in allowed

    companion object {
        /** Journal and Vault start off; the person opts in. */
        val DEFAULT = AiScope(setOf(AiModule.TASKS, AiModule.CALENDAR, AiModule.MONEY, AiModule.NOTES, AiModule.FAMILY))
    }
}

/** A change the assistant suggests. Nothing happens until the person applies it. */
sealed interface Proposal {
    val module: AiModule

    data class Expense(val title: String, val amount: Long, val category: String) : Proposal {
        override val module get() = AiModule.MONEY
    }

    data class Income(val title: String, val amount: Long, val category: String) : Proposal {
        override val module get() = AiModule.MONEY
    }

    data class Note(val title: String, val body: String) : Proposal {
        override val module get() = AiModule.NOTES
    }

    data class Task(val title: String, val time24: String?, val day: LocalDate) : Proposal {
        override val module get() = AiModule.TASKS
    }

    data class CalendarBlock(val title: String, val time24: String, val date: LocalDate) : Proposal {
        override val module get() = AiModule.CALENDAR
    }
}

/** The on-device first step for every message: propose, refuse on scope, or answer. */
sealed interface AiDecision {
    /** "Here is what I would add" — shown as Apply / Edit / Discard cards with one Undo. */
    data class Propose(val proposals: List<Proposal>) : AiDecision

    /** The message needs a module the person switched off. Links to AI settings. */
    data class ScopeBlocked(val module: AiModule) : AiDecision

    /** A question: answer from [module] data only, citing every source. */
    data class Answer(val module: AiModule) : AiDecision
}

/**
 * Plain language → proposals, with scope enforced before anything is read.
 * The assistant never writes the journal: mood or journal-like lines produce
 * no proposal. Prototype reference: v2_40_ai.js `proposalsFrom` / `aiAnswer`.
 */
object Assistant {

    private val I = RegexOption.IGNORE_CASE
    private val ACTION_STARTS = Regex(
        """^(add|create|log|remind|schedule|book|note|save|put|set|plan|track|paid|spent|got|received|i spent|i paid|task|buy|call|email|pay)\b""" +
            """|\b(remind me|add (a )?task|log (an? )?(expense|spend)|schedule|book a|note that|save this)\b""",
        I,
    )
    private const val NEXT_ITEM = """(?:paid|spent|add|remind|call|buy|schedule|book|note|log|pay|₹|rs\.?|\d)"""
    private val SPLIT = Regex(
        """\s*(?:;|\band then\b|\band also\b|,\s*and\b|\band\b(?=\s+$NEXT_ITEM)|,(?=\s*$NEXT_ITEM))\s*""",
        I,
    )
    private val LEAD_IN = Regex("""^(please\s+)?(can you\s+)?(add|create|log|remind me to|remind me|save|put|track|note that|note:)\s*""", I)
    private val SCHEDULING = Regex("""remind|schedule|book|meeting|call .* at""", I)
    private val LEADING_AMOUNT = Regex("""^(?:₹|rs\.?\s*)?\d""", I)
    private val DAY_WORDS = Regex("""\b(tomorrow|today|tonight)\b""", I)

    fun wantsAction(text: String): Boolean = ACTION_STARTS.containsMatchIn(text.trim())

    /** "paid 450 for lunch and 180 for uber" → two items. */
    fun splitItems(text: String): List<String> = text.split(SPLIT).map { it.trim() }.filter { it.isNotEmpty() }

    fun proposalsFrom(text: String, today: LocalDate): List<Proposal> {
        if (!wantsAction(text)) return emptyList()
        var lastWasMoney = false
        return splitItems(text).mapNotNull { part ->
            val clean = part.replaceFirst(LEAD_IN, "")
            // "spent 250 on lunch and 120 on auto": a bare amount after an expense is another expense.
            val p = CaptureParser.parse(clean).let { c ->
                if (lastWasMoney && c.type != CaptureType.EXPENSE && c.type != CaptureType.INCOME && LEADING_AMOUNT.containsMatchIn(clean)) {
                    CaptureParser.parse("spent $clean")
                } else c
            }
            lastWasMoney = p.type == CaptureType.EXPENSE
            val type = p.type ?: return@mapNotNull null
            val date = if (p.dayWord == "tomorrow") today.plusDays(1) else today
            when {
                SCHEDULING.containsMatchIn(part) && (p.time24 != null || p.dayWord != null) -> Proposal.CalendarBlock(
                    title = p.label.ifEmpty { clean }
                        .replace(Regex("""\b(at|on)\s+\d.*$""", I), "")
                        .replace(DAY_WORDS, "")
                        .squash()
                        .ifEmpty { clean },
                    time24 = p.time24 ?: "10:00",
                    date = date,
                )
                type == CaptureType.EXPENSE -> Proposal.Expense(p.label.ifEmpty { "Expense" }, p.amount, p.category ?: "Other")
                type == CaptureType.INCOME -> Proposal.Income(p.label.ifEmpty { "Income" }, p.amount, p.category ?: "Income")
                type == CaptureType.NOTE -> Proposal.Note(p.label.ifEmpty { clean }.take(60), clean)
                type == CaptureType.TASK || type == CaptureType.HABIT -> Proposal.Task(
                    title = p.label.ifEmpty { clean }
                        .replace(DAY_WORDS, "")
                        .replace(Regex("""\b(at|by)\s+\d{1,2}(:\d{2})?\s*(am|pm)?\b""", I), "")
                        .squash()
                        .ifEmpty { clean },
                    time24 = p.time24,
                    day = date,
                )
                else -> null // JOURNAL: the assistant never writes your journal
            }
        }
    }

    fun moduleOf(question: String): AiModule {
        val s = question.lowercase()
        return when {
            Regex("""journal|diary|reflect|mood""").containsMatchIn(s) -> AiModule.JOURNAL
            Regex("""vault|document|\bdoc\b|insurance|policy|passport|aadha|\bpan\b|certificate|expir|renew|prescription|warranty""").containsMatchIn(s) -> AiModule.VAULT
            Regex("""money|budget|spend|expense|ledger|salary|income|net worth|upi|\bbill""").containsMatchIn(s) -> AiModule.MONEY
            Regex("""calendar|meeting|schedule|agenda|event""").containsMatchIn(s) -> AiModule.CALENDAR
            Regex("""\bnote|idea|\[\[""").containsMatchIn(s) -> AiModule.NOTES
            Regex("""family|\bmom\b|\bdad\b|household""").containsMatchIn(s) -> AiModule.FAMILY
            else -> AiModule.TASKS
        }
    }

    /** Scope is checked before any data is touched; a blocked message reads nothing. */
    fun decide(message: String, scope: AiScope, today: LocalDate): AiDecision {
        val proposals = proposalsFrom(message, today)
        if (proposals.isNotEmpty()) {
            proposals.firstOrNull { it.module !in scope }?.let { return AiDecision.ScopeBlocked(it.module) }
            return AiDecision.Propose(proposals)
        }
        val module = moduleOf(message)
        return if (module in scope) AiDecision.Answer(module) else AiDecision.ScopeBlocked(module)
    }

    private fun String.squash() = replace(Regex("""\s{2,}"""), " ").trim().replaceFirstChar { it.uppercase() }
}
