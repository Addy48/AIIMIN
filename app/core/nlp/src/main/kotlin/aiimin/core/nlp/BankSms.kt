package aiimin.core.nlp

enum class MoneyDirection { IN, OUT }

data class BankAlert(
    val amount: Long,
    val direction: MoneyDirection,
    /** Payee or payer as shown to the person ("Zomato"). */
    val name: String,
    /** UPI / UTR reference — the primary duplicate key. Null when the bank gave none. */
    val reference: String?,
    /** Account last 4 digits, when present — secondary duplicate key with amount + date. */
    val accountLast4: String?,
    val upiId: String?,
)

/**
 * Bank / UPI alert → structured transaction, parsed on the device (plan §12).
 * Prototype reference: `parseBankSms`. Works on pasted text today; the same
 * parser runs on SMS / notification capture once permissions are granted.
 */
object BankSms {

    private val I = RegexOption.IGNORE_CASE
    private val AMOUNT = Regex("""(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{1,2})?)""", I)
    private val OUT = Regex("""debit|spent|paid|sent|withdrawn|purchase""", I)
    private val IN = Regex("""credit|received|refund|deposited""", I)
    private val COUNTERPARTY = Regex("""(?:\bto|\bat|\bvpa|\btowards|\bby upi/?)\s+([A-Za-z0-9@._\- ]{3,40}?)(?:\s+on|\s+via|\s+ref|\.(?:\s|$)|,|$)""", I)
    private val REFERENCE = Regex("""(?:ref(?:erence)?\s*(?:no\.?)?|utr)\s*[:\-]?\s*([A-Za-z0-9]{6,})""", I)
    private val ACCOUNT = Regex("""(?:a/c|acct|account|card)\s*(?:no\.?)?\s*[x*]+(\d{3,4})""", I)
    private val UPI_ID = Regex("""\b([a-z0-9._\-]{2,}@[a-z]{2,})\b""", I)

    fun parse(text: String): BankAlert? {
        val amt = AMOUNT.find(text) ?: return null
        val amount = amt.groupValues[1].replace(",", "").toDoubleOrNull() ?: return null
        val out = OUT.containsMatchIn(text)
        val inc = IN.containsMatchIn(text)
        val counterparty = COUNTERPARTY.find(text)?.groupValues?.get(1)
        val name = counterparty?.let(::payeeName)?.ifEmpty { null } ?: "Bank transaction"
        return BankAlert(
            amount = kotlin.math.floor(amount + 0.5).toLong(),
            direction = if (inc && !out) MoneyDirection.IN else MoneyDirection.OUT,
            name = name,
            reference = REFERENCE.find(text)?.groupValues?.get(1),
            accountLast4 = ACCOUNT.find(text)?.groupValues?.get(1),
            upiId = UPI_ID.find(text)?.groupValues?.get(1)?.lowercase(),
        )
    }

    private val HANDLE = Regex("""^([a-z0-9._\-]+)@[a-z]+\s*(.*)$""", I)

    /** UPI handles of well-known payees → the name people know them by. */
    private val KNOWN = linkedMapOf(
        "pvrcinemas" to "PVR Cinemas", "pvr" to "PVR Cinemas", "inox" to "INOX", "bookmyshow" to "BookMyShow",
        "swiggy" to "Swiggy", "zomato" to "Zomato", "olamoney" to "Ola", "olacabs" to "Ola", "ola" to "Ola", "uber" to "Uber",
        "rapido" to "Rapido", "amazonpay" to "Amazon", "amazon" to "Amazon", "flipkart" to "Flipkart", "myntra" to "Myntra",
        "bigbasket" to "BigBasket", "blinkit" to "Blinkit", "zepto" to "Zepto", "dmart" to "DMart", "netflix" to "Netflix",
        "airtel" to "Airtel", "jio" to "Jio", "irctc" to "IRCTC", "phonepe" to "PhonePe", "paytm" to "Paytm", "spotify" to "Spotify",
        "starbucks" to "Starbucks", "dominos" to "Domino's", "apollo" to "Apollo", "makemytrip" to "MakeMyTrip", "nykaa" to "Nykaa",
    )

    /**
     * The payee as a person would write it. "VPA pvrcinemas@ybl PVR Phoenix" → "PVR Phoenix"
     * (the bank's own label wins); "swiggy8@ybl" → "Swiggy"; "9822104471@ybl" → "UPI ••4471".
     */
    fun payeeName(counterparty: String): String {
        val s = counterparty.trim().replaceFirst(Regex("""^vpa\s+""", I), "").trim()
        val m = HANDLE.find(s) ?: return tidy(s.replace(Regex("""@.*"""), ""))
        val label = m.groupValues[2].trim()
        if (label.count { it.isLetter() } >= 3) return tidy(label)
        return fromHandle(m.groupValues[1])
    }

    private fun fromHandle(handle: String): String {
        val h = handle.lowercase()
        val letters = h.replace(Regex("""[^a-z]"""), "")
        KNOWN.entries.firstOrNull { letters == it.key || letters.startsWith(it.key) }?.let { return it.value }
        if (letters.length < 3) {
            val digits = h.filter { it.isDigit() }
            return if (digits.length >= 4) "UPI ••" + digits.takeLast(4) else "UPI payment"
        }
        return tidy(h.replace(Regex("""[._\-]+"""), " ").replace(Regex("""\d+"""), " "))
    }

    /** Collapses spaces; all-lower or all-upper words get a capital first letter, mixed case is kept (PVR, McDonald's). */
    private fun tidy(s: String): String = s.trim().split(Regex("""\s+""")).filter { it.isNotBlank() }.joinToString(" ") { w ->
        when {
            w.length <= 4 && w.all { !it.isLetter() || it.isUpperCase() } -> w
            w == w.lowercase() || w == w.uppercase() -> w.lowercase().replaceFirstChar { it.uppercase() }
            else -> w
        }
    }

    /** Learn-once payee mapping and first-guess categories (plan §11.2 #3). */
    fun guessCategory(name: String): String {
        val s = name.lowercase()
        return when {
            Regex("""swiggy|zomato|cafe|coffee|food|restaurant|chai|dominos""").containsMatchIn(s) -> "Food"
            Regex("""uber|ola|rapido|metro|petrol|fuel""").containsMatchIn(s) -> "Transport"
            Regex("""bigbasket|blinkit|zepto|dmart|grocer|kirana""").containsMatchIn(s) -> "Grocery"
            Regex("""netflix|jio|airtel|prime|spotify""").containsMatchIn(s) -> "Subs"
            else -> "Other"
        }
    }

    /** Normalised payee key used by learned rules ("Zomato Ltd" and "zomato" match). */
    fun payeeKey(name: String): String = name.lowercase().replace(Regex("[^a-z]"), "").take(14)
}
