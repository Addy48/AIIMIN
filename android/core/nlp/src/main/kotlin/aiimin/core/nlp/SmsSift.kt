package aiimin.core.nlp

/** One message from the phone's SMS inbox. [sender] is the address as the phone shows it ("VM-HDFCBK-S"). */
data class SmsMessage(val sender: String, val body: String, val at: Long)

/** What a message is, before any of the person's filters apply. Only [PAYMENT] can become a transaction. */
enum class SmsKind { PAYMENT, OTP, OFFER, REQUEST, FAILED, REMINDER, BALANCE, NOT_MONEY }

enum class SmsDirection { BOTH, OUT, IN }

/** Why a message was left out. The first eight mirror [SmsKind]; the rest are the person's own filters. */
enum class SkipReason(val one: String, val many: String) {
    OTP("OTP", "OTPs"),
    OFFER("offer", "offers"),
    REQUEST("payment request", "payment requests"),
    FAILED("failed payment", "failed payments"),
    REMINDER("reminder or statement", "reminders and statements"),
    BALANCE("balance update", "balance updates"),
    NOT_MONEY("other message", "other messages"),
    PERSON("message from a person", "messages from people"),
    BANK("from another bank", "from other banks"),
    ACCOUNT("from another account", "from other accounts"),
    DIRECTION("in the other direction", "in the other direction"),
    AMOUNT("below your minimum", "below your minimum"),
    WORD("with a word you skip", "with words you skip"),
    REPEAT("repeat of another message", "repeats of other messages"),
}

/**
 * The person's filter for reading bank messages: past imports and live alerts both use it.
 * Empty sets mean "every". Saved as a short string in settings ([encode]/[decode]).
 */
data class SmsFilter(
    val banks: Set<String> = emptySet(),
    val accounts: Set<String> = emptySet(),
    val direction: SmsDirection = SmsDirection.BOTH,
    val minRupees: Long = 0,
    val skipWords: List<String> = emptyList(),
    /** Skip messages sent from a phone number (forwards, people) — banks send from short codes. */
    val banksOnly: Boolean = true,
) {
    val words: List<String> get() = skipWords.map { it.trim() }.filter { it.isNotEmpty() }

    /** "HDFC Bank, SBI · Money out · ₹100 and up · Skips 1 word" */
    fun summary(): String = buildList {
        val b = banks.sorted()
        add(if (b.isEmpty()) "Every bank" else if (b.size <= 2) b.joinToString(", ") else "${b.take(2).joinToString(", ")} +${b.size - 2}")
        if (accounts.isNotEmpty()) add(accounts.sorted().joinToString(", ") { "••$it" })
        add(when (direction) { SmsDirection.BOTH -> "Money in and out"; SmsDirection.OUT -> "Money out"; SmsDirection.IN -> "Money in" })
        add(if (minRupees <= 0) "Any amount" else "${SmsSift.rupees(minRupees)} and up")
        words.size.takeIf { it > 0 }?.let { add("Skips $it word${if (it == 1) "" else "s"}") }
        if (!banksOnly) add("People too")
    }.joinToString(" · ")

    fun encode(): String = listOf(
        "b=" + banks.sorted().joinToString("|") { clean(it) },
        "a=" + accounts.sorted().joinToString("|") { clean(it) },
        "d=" + direction.name,
        "m=" + minRupees,
        "w=" + words.joinToString("|") { clean(it) },
        "o=" + if (banksOnly) "1" else "0",
    ).joinToString(";")

    companion object {
        private fun clean(s: String) = s.replace(Regex("[;|=]"), " ").trim()

        fun decode(s: String?): SmsFilter {
            if (s.isNullOrBlank()) return SmsFilter()
            val kv = s.split(';').mapNotNull { p -> p.indexOf('=').takeIf { it > 0 }?.let { p.substring(0, it) to p.substring(it + 1) } }.toMap()
            if (kv.isEmpty()) return SmsFilter()
            fun list(k: String) = kv[k].orEmpty().split('|').map { it.trim() }.filter { it.isNotEmpty() }
            return SmsFilter(
                banks = list("b").toSet(),
                accounts = list("a").toSet(),
                direction = runCatching { SmsDirection.valueOf(kv["d"].orEmpty()) }.getOrDefault(SmsDirection.BOTH),
                minRupees = kv["m"]?.toLongOrNull()?.coerceAtLeast(0) ?: 0,
                skipWords = list("w"),
                banksOnly = kv["o"] != "0",
            )
        }
    }
}

/** A message that passed: the parsed alert plus where it came from. */
data class SiftedSms(val message: SmsMessage, val alert: BankAlert, val bank: String?)

data class SiftResult(
    val kept: List<SiftedSms>,
    val skipped: Map<SkipReason, Int>,
    /** Every bank that sent a real payment in these messages, filtered out or not (for the filter chips). */
    val banks: Map<String, Int>,
    val accounts: Map<String, Int>,
)

/**
 * Sorting the SMS inbox into "payments" and "noise" (OTPs, offers, collect requests, failed
 * payments, statements, balance updates), then applying the person's [SmsFilter]. Runs on the phone.
 */
object SmsSift {
    private val I = RegexOption.IGNORE_CASE
    private val AMOUNT = Regex("""(?:rs\.?|inr|₹)\s*[\d,]+""", I)
    private val OTP = Regex("""\botp\b|one[- ]?time[- ]password|verification code|\bdo not share\b|\bdon'?t share\b|\bnever share\b""", I)
    private val REQUEST = Regex("""\brequested\b|collect request|requesting money|has requested""", I)
    private val FAILED = Regex("""\bfailed\b|\bdeclined\b|\bunsuccessful\b|could not be processed""", I)
    private val REFUND_IN = Regex("""(?:refund|revers)[\s\S]*credited|credited[\s\S]*(?:refund|revers)""", I)
    private val REMINDER = Regex("""will be (?:auto[- ]?)?debited|is due\b|due date|total (?:amt |amount )?due|min(?:imum)?\.? (?:amt |amount )?due|\bstatement\b|mandate (?:is )?(?:registered|created|set up)|\boverdue\b|\bplease pay\b|\bpay your\b|refund reference|will be credited|refund (?:is |has been )?initiated""", I)
    private val MOVED = Regex("""debited|credited|\bspent\b|\bpaid\b|\bsent\b|received|withdrawn|withdrawal|deposited|transferred|refund|reversed|purchase|\btxn of\b|\b(?:debit|credit)\s*:|\btxn\b.{0,80}unauthori[sz]ed|\btransaction (?:number|no\.?)\s*\w+\s+for\s+rs|\bhas (?:a )?(?:debit|credit)\b""", I)
    /** "has been debited with … Register for e-statement" is a payment even though it says "statement". */
    private val PAST_MOVED = Regex("""\b(?:has been|was|been|is)\s+(?:debited|credited)|\b(?:debited|credited)\s+(?:with|by|for|from|to|rs|inr)|\b(?:debit|credit)\s*:""", I)
    private val BALANCE = Regex("""avl\.? bal|available bal|\bbal(?:ance)?\s*(?:is|:)|a/c bal""", I)
    /**
     * Forged or phishing "alerts": pressure words (click, verify, claim, a call-back number, a prize with a fee). Real bank texts also say
     * "click" or "call" (to report fraud), but they carry the person's masked account AND a date, bank reference or balance; a forged one does not.
     */
    private val SPOOF_ASK = Regex("""\bclick\b|\bverify\b|\bto (?:reverse|claim)\b|\bclaim\b|processing fee|\bkyc\b|will be blocked|account (?:is |will be )?(?:suspended|blocked|frozen)|congratulations|\bwon\b|\blottery\b|\bcall\s+\+?(?:[6-9]\d{9}|9X{9})|\bcall (?:me|us) (?:now|immediately)|\bupdate your\b""", I)
    private val OWN_MASK = Regex("""[xX*]{2,}\s?\d{2,}|\b\d?X{3,}\d{3,4}\b|\ba/c\s*[xX]\d{3,4}|\b[xX]\d{3,4}\b""")
    private val REAL_DETAIL = Regex("""\b\d{1,2}[-/ ][A-Za-z]{3}[-/ ]\d{2,4}\b|\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b|\b\d{4}-\d{2}-\d{2}\b|\bref(?:erence)?\b|\butr\b|\brrn\b|\bbal\b|\bbalance\b""", I)
    private val OFFER = Regex("""\boffers?\b|pre-?approved|apply now|\bclick\b|eligible|congratulations|\bwin\b|limited (?:period|time)|\bloan\b|\bupto\b|get instant|\bavail\b""", I)

    private val SENDER_DLT = Regex("""^[A-Z]{2}-([A-Z0-9]{3,9})(?:-[A-Z])?$""")
    private val SENDER_BARE = Regex("""^[A-Z][A-Z0-9]{2,8}$""")
    private val PROMO_TAG = Regex("""-P$""")

    /** Sender code without operator prefix or type tag: "VM-HDFCBK-S" → "HDFCBK". A phone number → "". */
    fun senderCode(address: String): String {
        val a = address.trim().uppercase()
        SENDER_DLT.find(a)?.let { return it.groupValues[1] }
        if (!SENDER_BARE.matches(a)) return ""
        // Some phones store "VM-HDFCBK" as "VMHDFCBK": a DLT header is 6 characters after a 2-letter prefix.
        val rest = a.drop(2)
        return if (a.length == 8 && a.take(2).all { it.isLetter() } && BANKS.any { rest.startsWith(it.first) }) rest else a
    }

    private val BANKS = listOf(
        "HDFC" to "HDFC Bank", "SBI" to "SBI", "ICICI" to "ICICI Bank", "AXIS" to "Axis Bank", "KOTAK" to "Kotak Bank",
        "PNB" to "PNB", "BOB" to "Bank of Baroda", "BARODA" to "Bank of Baroda", "CANBNK" to "Canara Bank", "CANARA" to "Canara Bank",
        "UNION" to "Union Bank", "IDFC" to "IDFC First", "YES" to "Yes Bank", "INDUS" to "IndusInd Bank", "FEDBNK" to "Federal Bank",
        "FEDERAL" to "Federal Bank", "AUBANK" to "AU Bank", "AUSFB" to "AU Bank", "PAYTM" to "Paytm", "AIRBNK" to "Airtel Payments Bank",
        "IPPB" to "India Post Bank", "BOI" to "Bank of India", "CENTBK" to "Central Bank", "IOB" to "Indian Overseas Bank",
        "RBL" to "RBL Bank", "SCB" to "Standard Chartered", "HSBC" to "HSBC", "CITI" to "Citi", "DBS" to "DBS", "AMEX" to "Amex",
        "JUPITR" to "Jupiter", "IDBI" to "IDBI Bank", "BANDHN" to "Bandhan Bank", "INDBNK" to "Indian Bank", "UCO" to "UCO Bank",
    )

    /** The bank as people say it: "AD-SBIUPI" → "SBI". Unknown codes stay as their code; a phone number → null. */
    fun bankOf(address: String): String? {
        val code = senderCode(address).ifEmpty { return null }
        BANKS.firstOrNull { (prefix, _) -> code.startsWith(prefix) }?.let { return it.second }
        if (code.endsWith("SBI")) return "SBI" // CBSSBI, ATMSBI
        return code
    }

    /** A known bank's name for a sender header ("AD-ICICIT-S" → "ICICI Bank"); null for unknown codes and numbers. */
    fun knownBankOf(address: String): String? {
        val code = senderCode(address).ifEmpty { return null }
        BANKS.firstOrNull { (prefix, _) -> code.startsWith(prefix) }?.let { return it.second }
        return if (code.endsWith("SBI")) "SBI" else null
    }

    private val MASKED = Regex("""(?i)(?:x{2,}|\*{2,}|ending\s*|a/c\s*(?:no\.?\s*)?)(\d{3,4})\b""")

    /**
     * The bank whose name sits nearest the masked account number ("from Kotak Bank A/c XX4455" → "Kotak Bank",
     * even when an offer elsewhere names another bank). Names inside UPI handles ("shop@sbi") and IFSC codes
     * ("SBIN0001234") don't count. Null if no bank is named.
     */
    fun bankNamedIn(body: String): String? {
        val up = body.uppercase()
        val anchor = MASKED.find(body)?.range?.first ?: 0
        var best: Pair<Int, String>? = null
        for ((prefix, name) in BANKS) {
            val words = listOf(name.uppercase()) + if (prefix.length >= 3) listOf(prefix) else emptyList()
            for (w in words) {
                Regex("""(?<![@\w])${Regex.escape(w)}(?![@\w])""").findAll(up).forEach { m ->
                    val d = kotlin.math.abs(m.range.first - anchor)
                    if (best == null || d < best!!.first) best = d to name
                }
            }
        }
        return best?.second
    }

    fun kind(sender: String, body: String): SmsKind {
        if (!AMOUNT.containsMatchIn(body)) return SmsKind.NOT_MONEY
        if (OTP.containsMatchIn(body)) return SmsKind.OTP
        if (PROMO_TAG.containsMatchIn(sender.trim().uppercase())) return SmsKind.OFFER
        // a forged "debited" text must never become a payment
        if (SPOOF_ASK.containsMatchIn(body) && !(OWN_MASK.containsMatchIn(body) && REAL_DETAIL.containsMatchIn(body))) return SmsKind.OFFER
        if (REQUEST.containsMatchIn(body)) return SmsKind.REQUEST
        if (FAILED.containsMatchIn(body) && !REFUND_IN.containsMatchIn(body)) return SmsKind.FAILED
        if (REMINDER.containsMatchIn(body) && !PAST_MOVED.containsMatchIn(body)) return SmsKind.REMINDER
        if (MOVED.containsMatchIn(body)) return SmsKind.PAYMENT
        if (BALANCE.containsMatchIn(body)) return SmsKind.BALANCE
        if (OFFER.containsMatchIn(body)) return SmsKind.OFFER
        return SmsKind.NOT_MONEY
    }

    private fun reasonFor(kind: SmsKind): SkipReason = when (kind) {
        SmsKind.OTP -> SkipReason.OTP
        SmsKind.OFFER -> SkipReason.OFFER
        SmsKind.REQUEST -> SkipReason.REQUEST
        SmsKind.FAILED -> SkipReason.FAILED
        SmsKind.REMINDER -> SkipReason.REMINDER
        SmsKind.BALANCE -> SkipReason.BALANCE
        SmsKind.PAYMENT, SmsKind.NOT_MONEY -> SkipReason.NOT_MONEY
    }

    /** The parsed alert when [m] is a real payment, or why it is left out. */
    fun check(m: SmsMessage, f: SmsFilter): Pair<BankAlert?, SkipReason?> {
        val kind = kind(m.sender, m.body)
        if (kind != SmsKind.PAYMENT) return null to reasonFor(kind)
        val alert = BankSms.parse(m.body) ?: return null to SkipReason.NOT_MONEY
        val bank = bankOf(m.sender)
        val reason = when {
            f.banksOnly && bank == null -> SkipReason.PERSON
            f.banks.isNotEmpty() && bank !in f.banks -> SkipReason.BANK
            else -> filterReason(alert, m.body, f)
        }
        return alert to reason
    }

    /**
     * The parts of the filter that need no sender: account, direction, amount, words. Live
     * notification alerts use only these (a notification has an app, not a bank sender code).
     */
    fun filterReason(alert: BankAlert, body: String, f: SmsFilter): SkipReason? = when {
        f.accounts.isNotEmpty() && alert.accountLast4 !in f.accounts -> SkipReason.ACCOUNT
        f.direction == SmsDirection.OUT && alert.direction != MoneyDirection.OUT -> SkipReason.DIRECTION
        f.direction == SmsDirection.IN && alert.direction != MoneyDirection.IN -> SkipReason.DIRECTION
        alert.amount < f.minRupees -> SkipReason.AMOUNT
        f.words.any { body.contains(it, ignoreCase = true) } -> SkipReason.WORD
        else -> null
    }

    fun sift(messages: List<SmsMessage>, f: SmsFilter): SiftResult {
        val kept = mutableListOf<SiftedSms>()
        val skipped = linkedMapOf<SkipReason, Int>()
        val banks = linkedMapOf<String, Int>()
        val accounts = linkedMapOf<String, Int>()
        val seen = HashSet<String>()
        for (m in messages) {
            val (alert, reason) = check(m, f)
            // The same alert can arrive twice (resent, or stored under two sender forms): key by bank reference, else text.
            val repeat = alert != null && !seen.add(alert.reference ?: m.body.trim())
            if (alert != null && !repeat) {
                bankOf(m.sender)?.let { banks[it] = (banks[it] ?: 0) + 1 }
                alert.accountLast4?.let { accounts[it] = (accounts[it] ?: 0) + 1 }
            }
            val r = if (repeat) SkipReason.REPEAT else reason
            if (r != null) skipped[r] = (skipped[r] ?: 0) + 1
            else if (alert != null) kept += SiftedSms(m, alert, bankOf(m.sender))
        }
        return SiftResult(kept, skipped, banks, accounts)
    }

    /** "32 skipped: 18 OTPs, 9 offers, 4 balance updates and 1 more". Empty when nothing was skipped. */
    fun skippedLine(skipped: Map<SkipReason, Int>): String {
        val total = skipped.values.sum()
        if (total == 0) return ""
        val sorted = skipped.entries.filter { it.value > 0 }.sortedWith(compareByDescending<Map.Entry<SkipReason, Int>> { it.value }.thenBy { it.key.ordinal })
        val top = sorted.take(3).joinToString(", ") { "${it.value} ${if (it.value == 1) it.key.one else it.key.many}" }
        val rest = sorted.drop(3).sumOf { it.value }
        return "$total skipped: $top" + if (rest > 0) " and $rest more" else ""
    }

    /** ₹ with Indian grouping: 150000 → "₹1,50,000". */
    fun rupees(r: Long): String {
        val s = kotlin.math.abs(r).toString()
        val grouped = if (s.length <= 3) s else {
            val head = s.dropLast(3)
            head.reversed().chunked(2).joinToString(",").reversed() + "," + s.takeLast(3)
        }
        return (if (r < 0) "−₹" else "₹") + grouped
    }
}
