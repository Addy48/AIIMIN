package aiimin.core.data.money

/**
 * On-device parse of Indian bank / UPI **payment alert text**.
 *
 * Play forbids `READ_SMS` for AIIMIN. Text arrives only when the user
 * shares/pastes an alert, or (opt-in) via notification listener. Raw bodies
 * never leave the device; only approved drafts hit [aiimin.core.data.MoneyStore].
 */
import aiimin.core.data.money.engine.AntiSpamGuard

object PaymentAlertParser {

    enum class Direction { DEBIT, CREDIT }

    data class Parsed(
        val amountInr: Int,
        val direction: Direction,
        val merchant: String?,
        val accountHint: String?,
        val channel: String,
        /** Short redacted preview for the review row — never the full SMS. */
        val preview: String,
        /** ISO-8601 local date when the alert embeds one; else null (approve uses today). */
        val dateIso: String? = null,
        /** Optional available balance if present in alert. */
        val balanceInr: Int? = null,
    )

    private val amountPatterns = listOf(
        // Explicit verb + amount: "debited by INR 500", "spent Rs 1,200", "paid ₹450"
        Regex(
            """(?:debited\s+(?:by|for|with)?|spent|paid|purchase\s+of|withdrawn|transferred\s+(?:of)?)\s*(?:INR|Rs\.?|₹)?\s*([0-9]{1,3}(?:,[0-9]{2,3})+|[0-9]+)(?:\.[0-9]{1,2})?""",
            RegexOption.IGNORE_CASE,
        ),
        // Explicit credit verb + amount: "credited with INR 10,000", "received Rs 500"
        Regex(
            """(?:credited\s+(?:with|for|to)?|received|refund\s+of|deposited)\s*(?:INR|Rs\.?|₹)?\s*([0-9]{1,3}(?:,[0-9]{2,3})+|[0-9]+)(?:\.[0-9]{1,2})?""",
            RegexOption.IGNORE_CASE,
        ),
        // "Amount Debited: INR 1,250.00"
        Regex(
            """amount\s+(?:debited|credited)\s*[:\-]?\s*(?:INR|Rs\.?|₹)?\s*([0-9]{1,3}(?:,[0-9]{2,3})+|[0-9]+)""",
            RegexOption.IGNORE_CASE,
        ),
        // General currency token followed by amount (not preceded by Bal/Balance)
        Regex(
            """(?<!bal[:\s]|balance[:\s]|bal\.\s)(?:INR|Rs\.?|₹)\s*([0-9]{1,3}(?:,[0-9]{2,3})+|[0-9]+)(?:\.[0-9]{1,2})?""",
            RegexOption.IGNORE_CASE,
        ),
    )

    private val balancePattern = Regex(
        """(?:avail(?:able)?\s+bal(?:ance)?|bal(?:ance)?)\s*(?:is|:|\-)?\s*(?:INR|Rs\.?|₹)?\s*([0-9]{1,3}(?:,[0-9]{2,3})+|[0-9]+)(?:\.[0-9]{1,2})?""",
        RegexOption.IGNORE_CASE,
    )

    private val debitWords = Regex(
        """\b(debited|spent|paid|purchase|withdrawn|dr\.?|sent|transferred)\b""",
        RegexOption.IGNORE_CASE,
    )
    private val creditWords = Regex(
        """\b(credited|received|refund|cr\.?|deposited)\b""",
        RegexOption.IGNORE_CASE,
    )

    private val merchantPatterns = listOf(
        Regex("""(?:at|to|towards)\s+([A-Za-z0-9 &._-]{2,40})""", RegexOption.IGNORE_CASE),
        Regex("""UPI[- /]([A-Za-z0-9.@-]{3,40})""", RegexOption.IGNORE_CASE),
        Regex("""(?:VPA|UPI ID|Info)[:\s]+([A-Za-z0-9.@-]{3,40})""", RegexOption.IGNORE_CASE),
        Regex("""from\s+([A-Za-z0-9 &._-]{2,40})""", RegexOption.IGNORE_CASE),
    )

    private val knownBankNames = setOf(
        "hdfc", "sbi", "icici", "axis", "kotak", "yes bank", "idfc", "bob", "pnb",
        "union bank", "canara", "indusind", "federal bank", "rbl", "standard chartered",
        "citibank", "hsbc", "bank of baroda", "punjab national", "state bank of india",
        "account", "a/c", "acct",
    )

    private val accountHints = listOf(
        Regex("""(?:A/c|Ac|Account|acct|Card)[.\s:-]*([Xx*0-9]{4,})""", RegexOption.IGNORE_CASE),
        Regex("""\b((?:HDFC|SBI|ICICI|AXIS|FI|KOTAK|YES|IDFC|BOB|PNB|UNION|CANARA)[A-Za-z]*)\b""", RegexOption.IGNORE_CASE),
        Regex("""\b(GPay|Google Pay|PhonePe|Paytm|Amazon Pay|CRED|BHIM)\b""", RegexOption.IGNORE_CASE),
    )

    /** on 05-08-26 · on 05/08/2026 · on 5 Aug 2026 */
    private val datePatterns = listOf(
        Regex(
            """\bon\s+(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})\b""",
            RegexOption.IGNORE_CASE,
        ),
        Regex(
            """\bon\s+(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{2,4})\b""",
            RegexOption.IGNORE_CASE,
        ),
    )

    private val monthIndex = mapOf(
        "jan" to 1, "feb" to 2, "mar" to 3, "apr" to 4, "may" to 5, "jun" to 6,
        "jul" to 7, "aug" to 8, "sep" to 9, "oct" to 10, "nov" to 11, "dec" to 12,
    )

    fun parse(raw: String): Parsed? {
        val text = raw.trim().replace('\u00a0', ' ')
        if (text.length < 12) return null

        // 1. Anti-Spam Guard Gate
        val spamCheck = AntiSpamGuard.check(text)
        if (spamCheck.isSpam) return null

        // 2. Amount Extraction
        val amount = extractAmount(text) ?: return null
        if (amount <= 0 || amount > 10_000_000) return null

        val direction = when {
            creditWords.containsMatchIn(text) && !debitWords.containsMatchIn(text) -> Direction.CREDIT
            debitWords.containsMatchIn(text) -> Direction.DEBIT
            creditWords.containsMatchIn(text) -> Direction.CREDIT
            else -> Direction.DEBIT
        }

        val merchant = merchantPatterns.firstNotNullOfOrNull { re ->
            re.find(text)?.groupValues?.getOrNull(1)?.trim()?.takeIf { it.length in 2..40 }
        }?.let { cleanMerchant(it) }?.takeIf { candidate ->
            val lower = candidate.lowercase()
            knownBankNames.none { lower == it || lower.startsWith("$it ") }
        }

        val accountHint = accountHints.firstNotNullOfOrNull { re ->
            re.find(text)?.groupValues?.getOrNull(1)?.trim()?.takeIf { it.isNotBlank() }
        }

        val channel = when {
            text.contains("UPI", ignoreCase = true) ||
                text.contains("VPA", ignoreCase = true) -> "UPI"
            text.contains("NEFT", ignoreCase = true) -> "NEFT"
            text.contains("IMPS", ignoreCase = true) -> "IMPS"
            text.contains("card", ignoreCase = true) -> "CARD"
            else -> "ALERT"
        }

        val balanceInr = balancePattern.find(text)?.groupValues?.getOrNull(1)?.let { rawBal ->
            rawBal.replace(",", "").substringBefore('.').toIntOrNull()
        }

        return Parsed(
            amountInr = amount,
            direction = direction,
            merchant = merchant,
            accountHint = accountHint,
            channel = channel,
            preview = redactPreview(text),
            dateIso = extractDateIso(text),
            balanceInr = balanceInr,
        )
    }

    private fun extractDateIso(text: String): String? {
        datePatterns[0].find(text)?.let { m ->
            val d = m.groupValues[1].toIntOrNull() ?: return@let
            val mo = m.groupValues[2].toIntOrNull() ?: return@let
            val yRaw = m.groupValues[3].toIntOrNull() ?: return@let
            val y = if (yRaw < 100) 2000 + yRaw else yRaw
            return formatIso(y, mo, d)
        }
        datePatterns[1].find(text)?.let { m ->
            val d = m.groupValues[1].toIntOrNull() ?: return@let
            val mo = monthIndex[m.groupValues[2].lowercase().take(3)] ?: return@let
            val yRaw = m.groupValues[3].toIntOrNull() ?: return@let
            val y = if (yRaw < 100) 2000 + yRaw else yRaw
            return formatIso(y, mo, d)
        }
        return null
    }

    private fun formatIso(year: Int, month: Int, day: Int): String? {
        if (month !in 1..12 || day !in 1..31 || year !in 2000..2100) return null
        return "%04d-%02d-%02d".format(year, month, day)
    }

    private fun extractAmount(text: String): Int? {
        for (re in amountPatterns) {
            val m = re.find(text) ?: continue
            val rawAmt = m.groupValues.getOrNull(1) ?: continue
            val normalized = rawAmt.replace(",", "").substringBefore('.')
            val value = normalized.toIntOrNull() ?: continue
            if (value > 0) return value
        }
        return null
    }

    private fun cleanMerchant(raw: String): String {
        return raw
            .replace(Regex("""\s+"""), " ")
            .trim(' ', '.', ',', '-', ':')
            .take(36)
    }

    private fun redactPreview(text: String): String {
        val oneLine = text.replace('\n', ' ').replace(Regex("""\s+"""), " ").trim()
        val masked = oneLine
            .replace(Regex("""\b\d{6,}\b"""), "••••")
            .replace(Regex("""[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+"""), "••••@••••")
        return if (masked.length <= 96) masked else masked.take(93) + "…"
    }
}
