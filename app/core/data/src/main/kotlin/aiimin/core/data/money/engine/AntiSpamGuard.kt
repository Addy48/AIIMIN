package aiimin.core.data.money.engine

/**
 * High-precision on-device spam & non-transaction filter for Indian SMS and push notifications.
 *
 * Catches:
 * 1. Mobile recharge offers and plan expiry notices.
 * 2. Pre-approved personal loans, credit lines, and instant cash ads.
 * 3. Bill payment due reminders (debts, not completed debits).
 * 4. Credit card limit increase offers and promotional upgrades.
 * 5. Gaming, betting, lottery, and promotional cashback codes.
 * 6. Pure OTP / 2FA messages that do not execute a money movement.
 */
object AntiSpamGuard {

    enum class SpamCategory {
        RECHARGE_PROMO,
        LOAN_OFFER,
        BILL_DUE_REMINDER,
        CARD_LIMIT_OFFER,
        PROMOTIONAL_GAMING,
        PURE_OTP,
        INFORMATIONAL,
    }

    data class SpamCheckResult(
        val isSpam: Boolean,
        val category: SpamCategory? = null,
        val matchedPattern: String? = null,
    )

    private val RECHARGE_PATTERNS = listOf(
        Regex("""\b(?:recharge\s+(?:with|of|now|done|successful)|plan\s+expir(?:ed|ing)|unlimited\s+calls|pack\s+validity|data\s+balance|free\s+5g|daily\s+data|topup\s+with)\b""", RegexOption.IGNORE_CASE),
        Regex("""\b(?:talktime|validity\s+(?:of|for)|data\s+pack|caller\s+tune)\b""", RegexOption.IGNORE_CASE),
        Regex("""\b(?:jio\s+recharge|airtel\s+thanks|vi\s+hero|bsnl\s+recharge)\b""", RegexOption.IGNORE_CASE),
    )

    private val LOAN_PATTERNS = listOf(
        Regex("""\b(?:pre-approved|eligible\s+for\s+(?:a\s+)?loan|personal\s+loan|instant\s+loan|get\s+up\s+to\s+(?:INR|Rs\.?|₹)?\s*\d+|loan\s+offer|instant\s+cash|disbursed\s+in\s+\d+\s+(?:mins|minutes)|zero\s+processing\s+fee|apply\s+(?:now|today|for\s+loan)|paperless\s+approval)\b""", RegexOption.IGNORE_CASE),
        Regex("""\b(?:interest\s+rate\s+starting|interest\s+free|flexible\s+emi|collateral\s+free)\b""", RegexOption.IGNORE_CASE),
        Regex("""\b(?:kreditbee|moneyview|cashe|stashfin|paysense|navi\s+finserv|bajaj\s+finserv\s+loan)\b""", RegexOption.IGNORE_CASE),
    )

    private val BILL_DUE_PATTERNS = listOf(
        Regex("""\b(?:bill\s+(?:is\s+)?(?:due|generated|reminder)|due\s+date|overdue|pay\s+before|minimum\s+amount\s+due|statement\s+ready|outstanding\s+amount|bill\s+of\s+(?:INR|Rs\.?|₹)?\s*[0-9,]+(?:\.[0-9]{2})?\s+is\s+due)\b""", RegexOption.IGNORE_CASE),
        Regex("""\b(?:pay\s+your\s+(?:electricity|broadband|water|gas|dth|postpaid)\s+bill)\b""", RegexOption.IGNORE_CASE),
        Regex("""\b(?:avoid\s+late\s+fee|total\s+amount\s+due)\b""", RegexOption.IGNORE_CASE),
    )

    private val CARD_LIMIT_PATTERNS = listOf(
        Regex("""\b(?:credit\s+limit\s+(?:increase|enhanced|upgraded|approved)|upgrade\s+your\s+card|lifetime\s+free\s+credit\s+card|apply\s+for\s+(?:a\s+)?credit\s+card)\b""", RegexOption.IGNORE_CASE),
        Regex("""\b(?:card\s+limit\s+has\s+been\s+increased\s+to)\b""", RegexOption.IGNORE_CASE),
    )

    private val PROMO_GAMING_PATTERNS = listOf(
        Regex("""\b(?:win\s+(?:upto|up\s+to)|bonus\s+cash|rummy|dream11|scratch\s+card|use\s+code|flat\s+off|cashback\s+scratch|jackpot|poker|betting)\b""", RegexOption.IGNORE_CASE),
        Regex("""\b(?:claim\s+(?:your\s+)?cashback|get\s+(?:INR|Rs\.?|₹)?\s*\d+\s+cashback\s+on\s+next)\b""", RegexOption.IGNORE_CASE),
    )

    private val PURE_OTP_PATTERNS = listOf(
        Regex("""\b(?:otp\s+is\s+\d+|is\s+your\s+(?:secret\s+)?otp|verification\s+code|login\s+code|do\s+not\s+share\s+this\s+otp)\b""", RegexOption.IGNORE_CASE),
        Regex("""\b(?:one\s+time\s+password\s+(?:is|for))\b""", RegexOption.IGNORE_CASE),
    )

    // Positive indicators that distinguish completed transactions from offers
    private val DEBIT_CONFIRMED_REGEX = Regex(
        """\b(?:debited\s+(?:by|for|with)?|spent\s+(?:on|at)?|paid\s+(?:to|at|for)?|withdrawn\s+(?:from)?|sent\s+(?:INR|Rs\.?|₹)?\s*[0-9,]+|transferred\s+(?:to|for)?)\b""",
        RegexOption.IGNORE_CASE,
    )

    private val CREDIT_CONFIRMED_REGEX = Regex(
        """\b(?:credited\s+(?:to|with|for)?|received\s+(?:INR|Rs\.?|₹)?\s*[0-9,]+|refund\s+of\s+(?:INR|Rs\.?|₹)?|deposited\s+(?:in|into)?)\b""",
        RegexOption.IGNORE_CASE,
    )

    /**
     * Inspects raw text body for spam and promotional indicators.
     */
    fun check(text: String): SpamCheckResult {
        val trimmed = text.trim()
        if (trimmed.length < 12) {
            return SpamCheckResult(isSpam = true, category = SpamCategory.INFORMATIONAL, matchedPattern = "too_short")
        }

        // 1. Check Pure OTP (unless it's an executed debit alert embedding an OTP reference)
        for (p in PURE_OTP_PATTERNS) {
            if (p.containsMatchIn(trimmed) &&
                !DEBIT_CONFIRMED_REGEX.containsMatchIn(trimmed) &&
                !CREDIT_CONFIRMED_REGEX.containsMatchIn(trimmed)
            ) {
                return SpamCheckResult(isSpam = true, category = SpamCategory.PURE_OTP, matchedPattern = p.pattern)
            }
        }

        // 2. Check Loan spam
        for (p in LOAN_PATTERNS) {
            if (p.containsMatchIn(trimmed)) {
                // If text says "loan disbursal" but doesn't explicitly have "A/c credited with", reject it
                if (!trimmed.contains("credited to", ignoreCase = true) && !trimmed.contains("credited with", ignoreCase = true)) {
                    return SpamCheckResult(isSpam = true, category = SpamCategory.LOAN_OFFER, matchedPattern = p.pattern)
                }
            }
        }

        // 3. Check Recharge spam
        for (p in RECHARGE_PATTERNS) {
            if (p.containsMatchIn(trimmed)) {
                return SpamCheckResult(isSpam = true, category = SpamCategory.RECHARGE_PROMO, matchedPattern = p.pattern)
            }
        }

        // 4. Check Bill Due reminders (debt notices != executed debits)
        for (p in BILL_DUE_PATTERNS) {
            if (p.containsMatchIn(trimmed)) {
                // Only treat as real payment if it explicitly says "payment received" or "paid successfully"
                if (!trimmed.contains("paid successfully", ignoreCase = true) &&
                    !trimmed.contains("payment of INR", ignoreCase = true) &&
                    !DEBIT_CONFIRMED_REGEX.containsMatchIn(trimmed)
                ) {
                    return SpamCheckResult(isSpam = true, category = SpamCategory.BILL_DUE_REMINDER, matchedPattern = p.pattern)
                }
            }
        }

        // 5. Check Card Limit spam
        for (p in CARD_LIMIT_PATTERNS) {
            if (p.containsMatchIn(trimmed)) {
                return SpamCheckResult(isSpam = true, category = SpamCategory.CARD_LIMIT_OFFER, matchedPattern = p.pattern)
            }
        }

        // 6. Check Promo & Gaming spam
        for (p in PROMO_GAMING_PATTERNS) {
            if (p.containsMatchIn(trimmed)) {
                return SpamCheckResult(isSpam = true, category = SpamCategory.PROMOTIONAL_GAMING, matchedPattern = p.pattern)
            }
        }

        return SpamCheckResult(isSpam = false)
    }
}
