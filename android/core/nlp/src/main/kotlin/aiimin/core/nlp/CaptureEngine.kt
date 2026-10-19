package aiimin.core.nlp

import aiimin.core.nlp.CaptureLexicon as L
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
    /** Minutes for FOCUS and MINIMUM lines ("focus 25 min", "walked 30 min"). */
    val minutes: Int? = null,
    val confidence: Double = 0.0,
    val reason: String = "",
    /** The words of this clause as the person wrote them (a note keeps its own text). */
    val raw: String = "",
)

data class Analysis(val items: List<Item>, val normalized: String)

/**
 * One line of plain language → structured items, or a question. Pipeline: normalise to Roman Hinglish →
 * split into clauses → per clause read date/time, then money, then decide the kind from cues.
 * The engine never guesses: when no rule is confident it returns [Kind.CHOOSE] so the sheet can ask.
 */
object CaptureEngine {
    private val I = RegexOption.IGNORE_CASE
    private const val CONFIDENT = 0.6

    fun analyze(
        text: String,
        now: LocalDateTime = LocalDateTime.now(),
        defaultCurrency: String = "INR",
        forced: Kind? = null,
    ): Analysis {
        val trimmed = text.trim()
        if (trimmed.isEmpty()) return Analysis(emptyList(), "")
        val norm = L.SPOKEN_FILLERS.replace(HinglishNormalizer.normalize(trimmed), "").replace(Regex("""\s+"""), " ").trim()
        val caseMap = caseMapOf(trimmed)
        if (norm in L.FEATURES) return Analysis(listOf(Item(Kind.FEATURE, label = norm, confidence = 1.0, reason = "feature word", raw = trimmed)), norm)
        val clauses = splitClauses(norm)
        val single = clauses.size == 1
        val items = clauses.map { c ->
            val item = classify(c, now, defaultCurrency, caseMap, if (single) trimmed else c)
            if (item.kind == Kind.CHOOSE && forced != null) coerce(c, forced, now, defaultCurrency, caseMap, if (single) trimmed else c) else item
        }
        return Analysis(items, norm)
    }

    // ------------------------------------------------------------------ clauses

    private val NOTE_PREFIX = Regex("""^(?:add (?:a )?note|note|idea|list|jot down|remember(?! to\b))\b[\s:\-]*(.*)$""", I)
    private val NOTE_COLON = Regex("""^n\s*[:\-]\s*(.*)$""", I)
    private val TASK_PREFIX = Regex("""^(?:task|todo|reminder|t)\s*[:\-]\s*(.*)$""", I)
    private val JOURNAL_PREFIX = Regex("""^journal\b[\s:\-]*(.*)$""", I)
    private val HABIT_PREFIX = Regex("""^habit\s*[:\-]\s*(.*)$""", I)
    private val MOOD_TEN = Regex("""\b\d{1,2}\s*/\s*10\b""")
    private val MOOD_N = Regex("""^mood\s+\d{1,2}\b""", I)
    private val NEGATED_SPEND = Regex("""\b(?:did not|didn'?t|didnt|haven'?t|nothing|no)\s+(?:spend|spent|to log|expense|kharch)\b|\bnothing to log\b""", I)

    private val CONNECTOR = Regex("""\s+(?:and then|and|then|aur|phir|also)\s+|\s*;\s*|\s*\n\s*|,\s+""", I)
    private val NOTE_INLINE = Regex("""\s+(?=note\s*:)""", I)

    private fun startsWithTaskVerb(s: String): Boolean {
        val w = s.trim().split(Regex("""\s+""")).firstOrNull()?.trim(',', '.') ?: return false
        return w in L.TASK_VERBS || L.TASK_LEAD_PHRASES.any { it.containsMatchIn(s.trim()) }
    }

    private fun hasInfinitive(s: String) = s.split(Regex("""\s+""")).any { it.trim(',', '.') in L.INFINITIVES }

    /** "lunch 200 and chai 30, call Ravi at 5": split where the next piece is its own thing (has a number or starts with an action). */
    internal fun splitClauses(norm: String): List<String> {
        if (NOTE_PREFIX.containsMatchIn(norm) || NOTE_COLON.containsMatchIn(norm) || JOURNAL_PREFIX.containsMatchIn(norm) || TASK_PREFIX.containsMatchIn(norm)) return listOf(norm)
        val out = ArrayList<String>()
        val pieces = ArrayList<String>()
        val seps = ArrayList<String>()
        var last = 0
        // split on note: inline first
        val pre = NOTE_INLINE.split(norm).filter { it.isNotBlank() }
        if (pre.size > 1) return pre.flatMap { splitClauses(it.trim()) }
        for (m in CONNECTOR.findAll(norm)) {
            pieces += norm.substring(last, m.range.first); seps += m.value; last = m.range.last + 1
        }
        pieces += norm.substring(last)
        var current = pieces[0]
        for (i in 1 until pieces.size) {
            val right = pieces[i].trim()
            val rightCore = right.replace(Regex("""^(?:then|and|aur|phir)\s+"""), "")
            val digitRight = rightCore.any { it.isDigit() }
            val actionRight = startsWithTaskVerb(rightCore) || hasInfinitive(rightCore) || Regex("""^(?:remind|note)\b""").containsMatchIn(rightCore)
            val leftOk = current.isNotBlank() && (current.any { it.isDigit() } || startsWithTaskVerb(current) || hasInfinitive(current) || L.SPEND_VERBS.any { Regex("""\b$it\b""").containsMatchIn(current) })
            val shareTail = rightCore.startsWith("my share") || rightCore.startsWith("mera hissa")
            val isComma = seps[i - 1].contains(',')
            val split = rightCore.isNotBlank() && leftOk && !shareTail && (digitRight || actionRight) &&
                // a bare number after "and" with nothing else ("2 and 3") is not a clause
                rightCore.any { it.isLetter() }
            if (split) { out += current.trim(); current = rightCore } else current = current + (if (isComma) ", " else " " + seps[i - 1].trim() + " ") + right
        }
        out += current.trim()
        return out.filter { it.isNotBlank() }
    }

    // ------------------------------------------------------------------ decision

    private class Ctx(
        val clause: String,
        val whenInfo: When,
        val money: MoneyScan,
        val words: List<String>,
        val raw: String,
        val caseMap: Map<String, String>,
    )

    private fun tokens(s: String): List<String> = s.split(Regex("""[\s]+""")).map { it.trim(',', '.', '!', '?', ':', ';', '"', '(', ')') }.filter { it.isNotEmpty() }

    private fun classify(clause0: String, now: LocalDateTime, cur: String, caseMap: Map<String, String>, raw: String): Item {
        var clause = clause0.trim()
        // note / task / journal prefixes decide at once; digits inside never turn them into money
        NOTE_PREFIX.find(clause)?.let { return noteItem(it.groupValues[1].ifBlank { clause }, raw, caseMap, "note prefix") }
        NOTE_COLON.find(clause)?.let { return noteItem(it.groupValues[1].ifBlank { clause }, raw, caseMap, "note prefix") }
        JOURNAL_PREFIX.find(clause)?.let { if (it.groupValues[1].isNotBlank()) return Item(Kind.JOURNAL, label = "Journal entry", confidence = 0.95, reason = "journal prefix", raw = raw) }
        if (MOOD_TEN.containsMatchIn(clause) || MOOD_N.containsMatchIn(clause)) return Item(Kind.JOURNAL, label = "Journal entry", confidence = 0.95, reason = "mood score", raw = raw)
        HABIT_PREFIX.find(clause)?.let { return Item(Kind.MINIMUM, label = cap(it.groupValues[1]), confidence = 0.9, reason = "habit prefix", raw = raw) }
        val taskPrefix = TASK_PREFIX.find(clause)
        if (taskPrefix != null) clause = taskPrefix.groupValues[1].ifBlank { clause }

        clause = L.LEADING_FILLERS.replace(clause, "").let { L.INLINE_FILLERS.replace(it, " ") }.replace(Regex("""\s+"""), " ").trim()
        if (clause.isEmpty()) return Item(Kind.CHOOSE, reason = "empty", raw = raw)

        if (NEGATED_SPEND.containsMatchIn(clause)) return noteItem(clause, raw, caseMap, "nothing spent")

        val wordsAll = tokens(clause)
        val pastCue = wordsAll.any { it in L.SPEND_VERBS || it in setOf("khaya", "piya", "kiya", "kiye", "liya") }
        val w = WhenParser.parse(clause, now, past = pastCue)
        val money = MoneyParser.scan(w.rest, cur)
        val ctx = Ctx(clause, w, money, tokens(money.rest), raw, caseMap)
        return decide(ctx, taskPrefix != null, wordsAll)
    }

    private fun decide(c: Ctx, taskPrefix: Boolean, allWords: List<String>): Item {
        val w = c.whenInfo
        val m = c.money
        val words = c.words
        val text = c.clause
        val lower = words.toSet()
        fun item(kind: Kind, conf: Double, why: String, paise: Long? = m.chosen?.paise, cur: String = m.chosen?.currency ?: "INR", minutes: Int? = null) = Item(
            kind, paise, cur, label(c, kind), if (kind == Kind.EXPENSE || kind == Kind.RECURRING || kind == Kind.INCOME) category(c, kind) else null,
            w.date, w.time24, w.dayPart, w.recurrence, minutes, conf, why, c.raw,
        )

        val hasMoneyMarked = m.chosen?.marked == true
        val spendVerb = lower.any { it in L.SPEND_VERBS }
        val broughtHome = Regex("""\b(?:leke|lekar|le)\s+aa\w+""").containsMatchIn(text)
        val incomeCue = lower.any { it in L.INCOME_CUES && !(broughtHome && it.startsWith("aa")) }
        val weakVerb = words.firstOrNull() in L.WEAK_SPEND
        val spendNoun = lower.any { it in L.SPEND_NOUNS }
        val taskLead = startsWithTaskVerb(text) && words.size >= 2
        val inf = hasInfinitive(text)
        val dated = w.hasDate || w.time24 != null
        val eventWith = L.EVENT_WITH.containsMatchIn(text)
        val eventNoun = lower.any { it in L.EVENT_NOUNS }
        val journal = lower.any { it in L.JOURNAL_WORDS } || L.JOURNAL_PHRASES.containsMatchIn(text)
        val minutesNum = Regex("""\d+""").find(w.rest)?.value?.toIntOrNull()

        // money the parser could not trust: ask (never save a guess)
        if (m.unsure != null) return Item(Kind.CHOOSE, reason = "amount unsure: ${m.unsure}", raw = c.raw, confidence = 0.2)

        // focus and minimums are read before money: "pomodoro 25", "ran 5k" are not payments
        if (Regex("""\b(?:focus|deep work|pomodoro)\b""", I).containsMatchIn(text) && (minutesNum != null || Regex("""\b(?:start|begin)\b""").containsMatchIn(text)))
            return item(Kind.FOCUS, 0.9, "focus", paise = null, minutes = minutesNum)
        val minVerb = lower.any { it in L.MIN_VERBS }
        if (minVerb && !hasMoneyMarked && (L.MIN_UNIT.containsMatchIn(w.rest) || "done" in lower || Regex("""\bdid (?:my|the)\b""").containsMatchIn(text)) &&
            !(lower.any { it in L.SPEND_VERBS - setOf("kiya", "kiye") }) && !incomeCue
        ) return item(Kind.MINIMUM, 0.85, "activity log", paise = null, minutes = L.MIN_UNIT.find(w.rest)?.value?.let { Regex("""\d+""").find(it)?.value?.toIntOrNull() })

        // repeat words
        if (w.recurrence != null) {
            if (m.chosen != null) return item(Kind.RECURRING, 0.92, "recurring payment")
            if (words.size >= 1) return item(Kind.RECURRING, 0.85, "repeating task", paise = null)
        }

        // documents with an expiry
        val docNoun = lower.any { it in L.DOC_NOUNS }
        val docCue = L.DOC_CUES.containsMatchIn(text) || (w.partialDate && lower.any { it == "renew" || it == "expire" })
        if (docNoun && docCue && !startsWithTaskVerb(text) && m.chosen == null) return item(Kind.DOCUMENT, 0.9, "document expiry", paise = null)
        if (docNoun && docCue && m.chosen == null && (w.partialDate || w.date != null) && !inf && !startsWithTaskVerb(text)) return item(Kind.DOCUMENT, 0.8, "document expiry", paise = null)

        // who owes whom is not an expense until the person says which way it goes
        if (Regex("""\b(?:owes?|owed|owing)\b""", I).containsMatchIn(text) && m.chosen != null) return Item(Kind.CHOOSE, reason = "who owes whom", raw = c.raw, confidence = 0.3)
        val neAgent = Regex("""\b(?!maine\b)\w+ ne\b""", I).containsMatchIn(text) && Regex("""\b(?:bheje|bheja|diye|diya|di|liye|liya|de)\b""").containsMatchIn(text)
        if (neAgent && m.chosen != null) {
            return if ("udhaar" in lower) Item(Kind.CHOOSE, reason = "borrowed or repaid?", raw = c.raw, confidence = 0.3)
            else item(Kind.INCOME, 0.9, "someone sent money")
        }

        // events with someone, before verbs: "call with client at 4:30"
        if (eventWith && dated && m.chosen == null) return item(Kind.EVENT, 0.9, "event with someone", paise = null)

        // money
        if (m.chosen != null) {
            val noPaise = taskPrefix || Regex("""^(?:remind|need|have|dont|don't)""").containsMatchIn(text)
            if (noPaise) return item(Kind.TASK, 0.85, "reminder mentioning money", paise = null)
            if (incomeCue && !spendVerb) return item(Kind.INCOME, 0.92, "income cue")
            if (incomeCue && spendVerb && !weakVerb) {
                // "received 3000 for rent paid": decided by the word nearest the amount; keep simple: income words win
                return item(Kind.INCOME, 0.75, "income cue with spend verb")
            }
            if (spendVerb) return item(Kind.EXPENSE, 0.95, "spend verb")
            if (hasMoneyMarked) return item(Kind.EXPENSE, 0.9, "currency marked amount")
            if (spendNoun) return item(Kind.EXPENSE, 0.85, "spend word with an amount")
            if (weakVerb) return if (dated) item(Kind.TASK, 0.7, "payment reminder", paise = null) else item(Kind.EXPENSE, 0.75, "pay/buy with an amount")
            if (fuzzyHit(words, L.SPEND_NOUNS) || fuzzyHit(allWords, L.SPEND_VERBS)) return item(Kind.EXPENSE, 0.7, "spend word (typo) with an amount")
            return Item(Kind.CHOOSE, reason = "amount without a clear meaning", raw = c.raw, confidence = 0.3)
        }

        // an event word with a date or time
        if (eventNoun && dated && !(taskLead || inf)) return item(Kind.EVENT, 0.9, "event word with a date")
        // action lines
        if ((taskLead || inf || taskPrefix) && (words.size >= 2 || taskPrefix)) return item(Kind.TASK, 0.9, "action line")
        if (journal) return item(Kind.JOURNAL, 0.8, "feeling words")
        if (eventNoun && dated) return item(Kind.EVENT, 0.8, "event word with a date")
        // a short thing at a date or time: "kal subah yoga"
        if (dated && words.isNotEmpty() && words.size <= 5 && words.any { it !in L.LABEL_EDGE }) return item(Kind.TASK, 0.7, "dated line")
        return Item(Kind.CHOOSE, reason = "no clear cue", raw = c.raw, confidence = 0.2)
    }

    private fun noteItem(body: String, raw: String, caseMap: Map<String, String>, why: String): Item {
        val shown = raw.replace(Regex("""^\s*(?:add (?:a )?note|note|idea|list|jot down|remember|n)\b[\s:\-]*""", I), "").ifBlank { body }
        return Item(Kind.NOTE, label = cap(shown).take(40), confidence = 0.98, reason = why, raw = raw)
    }

    /** A person picked a type in the chooser: build that kind from whatever was read. */
    private fun coerce(clause0: String, kind: Kind, now: LocalDateTime, cur: String, caseMap: Map<String, String>, raw: String): Item {
        val clause = L.LEADING_FILLERS.replace(clause0, "").trim()
        val w = WhenParser.parse(clause, now)
        val m = MoneyParser.scan(w.rest, cur)
        val c = Ctx(clause, w, m, tokens(m.rest), raw, caseMap)
        return when (kind) {
            Kind.EXPENSE, Kind.INCOME -> Item(kind, m.chosen?.paise, m.chosen?.currency ?: cur, label(c, kind), category(c, kind), w.date, null, null, null, null, 1.0, "chosen", raw)
            Kind.NOTE -> noteItem(clause, raw, caseMap, "chosen")
            Kind.JOURNAL -> Item(Kind.JOURNAL, label = "Journal entry", confidence = 1.0, reason = "chosen", raw = raw)
            else -> Item(kind, null, cur, label(c, kind), null, w.date, w.time24, w.dayPart, w.recurrence, null, 1.0, "chosen", raw)
        }
    }

    // ------------------------------------------------------------------ labels

    private fun cap(s: String) = s.trim().replaceFirstChar { it.uppercase() }

    private fun label(c: Ctx, kind: Kind): String {
        var ws = c.words
        if (kind == Kind.EXPENSE || kind == Kind.INCOME || kind == Kind.RECURRING) ws = ws.filter { it !in L.LABEL_STOP }
        else ws = ws.filter { it !in setOf("rupees") }
        // task lead-ins
        ws = ws.dropWhile { it in setOf("remind", "me", "to", "need", "have", "dont", "don't", "forget", "mujhe", "please", "i") }
        var list = ws.toMutableList()
        while (list.isNotEmpty() && list.first() in L.LABEL_EDGE) list.removeAt(0)
        while (list.isNotEmpty() && list.last() in L.LABEL_EDGE) list.removeAt(list.size - 1)
        list = list.take(6).toMutableList()
        val s = list.joinToString(" ") { c.caseMap[it] ?: it }
        return cap(s).ifEmpty {
            when (kind) { Kind.EXPENSE -> "Expense"; Kind.INCOME -> "Income"; Kind.RECURRING -> "Recurring"; Kind.EVENT -> "Event"; Kind.TASK -> "Task"; else -> "" }
        }
    }

    private fun category(c: Ctx, kind: Kind): String? {
        if (kind == Kind.INCOME) {
            val t = c.clause
            return when {
                Regex("""salary|tankhwah|vetan""").containsMatchIn(t) -> "Salary"
                Regex("""refund""").containsMatchIn(t) -> "Refund"
                Regex("""interest|dividend""").containsMatchIn(t) -> "Interest"
                Regex("""freelance|business|client""").containsMatchIn(t) -> "Business"
                else -> null
            }
        }
        return L.category(c.words, c.clause)
    }

    // ------------------------------------------------------------------ small helpers

    /** Original spelling of words the person capitalised (names), so labels read "Call Ravi" not "Call ravi". */
    private fun caseMapOf(raw: String): Map<String, String> {
        val m = HashMap<String, String>()
        for (t in raw.split(Regex("""\s+"""))) {
            val w = t.trim(',', '.', '!', '?', ':', ';')
            if (w.length > 1 && w.first().isUpperCase() && w.drop(1).any { it.isLowerCase() }) m[w.lowercase()] = w
        }
        return m
    }

    private fun fuzzyHit(words: List<String>, set: Set<String>): Boolean = words.any { w -> w.length >= 4 && set.any { it.length >= 4 && editOne(w, it) } }

    /** True when [a] and [b] differ by one insertion, deletion, substitution or adjacent swap. */
    private fun editOne(a: String, b: String): Boolean {
        if (a == b) return true
        if (kotlin.math.abs(a.length - b.length) > 1) return false
        if (a.length == b.length) {
            val d = a.indices.filter { a[it] != b[it] }
            return d.size == 1 || (d.size == 2 && d[1] == d[0] + 1 && a[d[0]] == b[d[1]] && a[d[1]] == b[d[0]])
        }
        val (s, l) = if (a.length < b.length) a to b else b to a
        var i = 0
        while (i < s.length && s[i] == l[i]) i++
        return s.substring(i) == l.substring(i + 1)
    }
}
