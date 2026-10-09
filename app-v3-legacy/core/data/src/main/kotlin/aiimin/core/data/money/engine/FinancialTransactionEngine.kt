package aiimin.core.data.money.engine

import android.util.Log
import aiimin.core.data.money.PaymentAlertParser
import aiimin.core.data.money.PaymentDraft
import aiimin.core.data.money.PaymentDraftSource
import java.util.UUID

/**
 * Dedicated on-device Financial Intelligence & Transaction Processing Engine.
 *
 * Responsibilities:
 * 1. Authority validation: Checks TRAI DLT headers for SMS and package names for Notifications.
 * 2. Spam & Promo Filtration: Blocks loan spam, recharge offers, bill due notices, OTPs, and betting.
 * 3. Deep Transaction Parsing: High-precision extraction of amount, direction, merchant, and account hints.
 * 4. Cross-channel Deduplication: Eliminates double-counting when both a Bank SMS and UPI Push Notification fire.
 */
object FinancialTransactionEngine {

    private const val TAG = "AiiminEngine"

    sealed class EngineResult {
        data class Accepted(val draft: PaymentDraft) : EngineResult()
        data class Rejected(val reason: String, val category: AntiSpamGuard.SpamCategory? = null) : EngineResult()
        data class Duplicate(val originalDraftId: String, val amountInr: Int) : EngineResult()
    }

    /**
     * Process an incoming text alert from any source (SMS, Notification, Share, Paste).
     */
    fun process(
        rawText: String,
        source: PaymentDraftSource,
        senderHeaderOrPackage: String? = null,
        existingDrafts: List<PaymentDraft> = emptyList(),
    ): EngineResult {
        val text = rawText.trim().replace('\u00a0', ' ')
        if (text.length < 12) {
            return EngineResult.Rejected("Message too short (< 12 chars)")
        }

        // 1. Check Sender Authority (if sender context is provided)
        when (source) {
            PaymentDraftSource.SMS -> {
                if (senderHeaderOrPackage != null && !SenderAuthorityClassifier.isAuthorizedSmsSender(senderHeaderOrPackage)) {
                    logD("Rejected SMS from unauthorized sender: $senderHeaderOrPackage")
                    return EngineResult.Rejected("Unauthorized SMS sender: $senderHeaderOrPackage")
                }
            }
            PaymentDraftSource.NOTIFICATION -> {
                if (senderHeaderOrPackage != null && !SenderAuthorityClassifier.isAuthorizedNotificationPackage(senderHeaderOrPackage)) {
                    logD("Rejected Notification from unauthorized package: $senderHeaderOrPackage")
                    return EngineResult.Rejected("Unauthorized notification package: $senderHeaderOrPackage")
                }
            }
            else -> {
                // Share, Paste, Manual are direct user actions — skip authority check
            }
        }

        // 2. Anti-Spam Guard Check
        val spamResult = AntiSpamGuard.check(text)
        if (spamResult.isSpam) {
            logI("SpamGuard blocked message (${spamResult.category}): $text")
            return EngineResult.Rejected("Spam detected: ${spamResult.category}", spamResult.category)
        }

        // 3. Bank & UPI Parsing
        val parsed = PaymentAlertParser.parse(text)
        if (parsed == null) {
            logD("Parser miss for text: ${text.take(80)}")
            return EngineResult.Rejected("Could not extract transactional entities")
        }

        val now = System.currentTimeMillis()
        val name = parsed.merchant?.takeIf { it.isNotBlank() }
            ?: parsed.accountHint
            ?: "Payment alert"

        val category = when (parsed.direction) {
            PaymentAlertParser.Direction.CREDIT -> "INCOME"
            PaymentAlertParser.Direction.DEBIT -> guessCategory(name, parsed.channel)
        }

        // 4. Cross-channel & Temporal Deduplication
        // If an SMS and Notification arrive within 3 minutes (180s) with matching amount and direction:
        val dup = existingDrafts.firstOrNull { existing ->
            existing.amountInr == parsed.amountInr &&
                existing.direction == parsed.direction &&
                (now - existing.atMs) < 180_000L &&
                (existing.merchant.equals(parsed.merchant, ignoreCase = true) ||
                    existing.channel == parsed.channel ||
                    existing.source != source) // Correlate across SMS and NOTIFICATION
        }

        if (dup != null) {
            logI("Deduplicated transaction ₹${parsed.amountInr} against draft ${dup.id}")
            return EngineResult.Duplicate(originalDraftId = dup.id, amountInr = parsed.amountInr)
        }

        val draft = PaymentDraft(
            id = UUID.randomUUID().toString(),
            amountInr = parsed.amountInr,
            direction = parsed.direction,
            merchant = parsed.merchant,
            accountHint = parsed.accountHint,
            channel = parsed.channel,
            category = category,
            preview = parsed.preview,
            source = source,
            atMs = now,
            dateIso = parsed.dateIso,
        )

        logI("Accepted verified transaction: ₹${draft.amountInr} ${draft.direction} at ${draft.merchant} ($source)")
        return EngineResult.Accepted(draft)
    }

    private fun logD(msg: String) {
        try {
            Log.d(TAG, msg)
        } catch (_: Throwable) {
            // Ignored when running outside Android runtime
        }
    }

    private fun logI(msg: String) {
        try {
            Log.i(TAG, msg)
        } catch (_: Throwable) {
            // Ignored when running outside Android runtime
        }
    }

    private fun guessCategory(name: String, channel: String): String {
        val n = name.lowercase()
        return when {
            listOf("swiggy", "zomato", "cafe", "restaurant", "food", "mcdonalds", "starbucks", "dominos", "kfc").any { it in n } -> "FOOD"
            listOf("blinkit", "bigbasket", "grocery", "zepto", "instamart", "dmart", "nature basket").any { it in n } -> "GROCERY"
            listOf("uber", "ola", "metro", "petrol", "fuel", "rapido", "indian oil", "bpcl", "hpcl").any { it in n } -> "TRANSPORT"
            listOf("netflix", "spotify", "prime", "hotstar", "youtube", "apple.com/bill", "google play").any { it in n } -> "SUBS"
            listOf("rent", "landlord", "society maintenance").any { it in n } -> "RENT"
            listOf("amazon", "flipkart", "myntra", "ajio", "zara", "h&m").any { it in n } -> "SHOPPING"
            channel == "UPI" -> "UNCATEGORISED"
            else -> "UNCATEGORISED"
        }
    }
}
