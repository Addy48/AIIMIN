package aiimin.core.nlp

enum class MoneyDirection { IN, OUT }

data class BankAlert(
    /** Whole rupees, rounded: only for filters and totals. Anything that is saved uses [paise]. */
    val amount: Long,
    val direction: MoneyDirection,
    /** Payee or payer as shown to the person ("Zomato"). */
    val name: String,
    /** UPI / UTR reference — the primary duplicate key. Null when the bank gave none. */
    val reference: String?,
    /** Account last 4 digits, when present — secondary duplicate key with amount + date. */
    val accountLast4: String?,
    val upiId: String?,
    /** Exact amount in paise ("Rs.176.50" is 17650, never 177). */
    val paise: Long = amount * 100,
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
    private val FROM = Regex("""\bfrom\s+(?!a/c|acct|account|ac\b|your\b)(?:vpa\s+)?([A-Za-z0-9@._\-& ]{3,40}?)(?:\s+on\b|\s+via|\s+ref|\.(?:\s|$)|,|$)""", I)
    private val UPI_ID = Regex("""\b([a-z0-9._\-]{2,}@[a-z]{2,})\b""", I)

    fun parse(text: String): BankAlert? {
        val amt = AMOUNT.find(text) ?: return null
        val exact = amt.groupValues[1].replace(",", "").toBigDecimalOrNull() ?: return null
        val amount = exact.toDouble()
        val out = OUT.containsMatchIn(text)
        val inc = IN.containsMatchIn(text)
        // "Your a/c … is credited for Rs 700 and debited from a/c …" names both sides. The direction is the side that
        // names the person's own account, which every bank introduces first ("Your a/c", "Acct XX224", "Your VPA … linked a/c").
        val inbound = if (inc && out) ownSideIsCredit(text) else inc && !out
        // Money in: who sent it ("by NEFT from ACME PVT LTD"); "debited from A/c" is never a payee.
        val counterparty = (if (inbound) FROM.find(text)?.groupValues?.get(1) else null) ?: COUNTERPARTY.find(text)?.groupValues?.get(1)
        val name = counterparty?.let(::payeeName)?.ifEmpty { null } ?: "Bank transaction"
        return BankAlert(
            amount = kotlin.math.floor(amount + 0.5).toLong(),
            direction = if (inbound) MoneyDirection.IN else MoneyDirection.OUT,
            name = name,
            reference = REFERENCE.find(text)?.groupValues?.get(1),
            accountLast4 = ACCOUNT.find(text)?.groupValues?.get(1),
            upiId = UPI_ID.find(text)?.groupValues?.get(1)?.lowercase(),
            paise = exact.movePointRight(2).setScale(0, java.math.RoundingMode.HALF_UP).toLong(),
        )
    }

    private val OWN_ACCOUNT = Regex("""\byour\s+(?:a/c|acct|account|vpa|card)\b|(?:a/c|acct|account)\s*(?:no\.?)?\s*[x*]+\d{3,4}""", I)
    private val DEBIT_WORD = Regex("""debit""", I)
    private val CREDIT_WORD = Regex("""credit""", I)

    /**
     * When a message says both "credited" and "debited": true when the credit is on the person's own account.
     * The own account is the first account the message names; the verb that follows it (else the nearest one before it) is theirs.
     */
    fun ownSideIsCredit(text: String): Boolean {
        val own = OWN_ACCOUNT.find(text)?.range?.first ?: 0
        val d = DEBIT_WORD.findAll(text).map { it.range.first }.toList()
        val c = CREDIT_WORD.findAll(text).map { it.range.first }.toList()
        val dAfter = d.firstOrNull { it >= own }
        val cAfter = c.firstOrNull { it >= own }
        return when {
            dAfter != null && cAfter != null -> cAfter < dAfter
            cAfter != null -> true
            dAfter != null -> false
            else -> (c.lastOrNull() ?: -1) > (d.lastOrNull() ?: -1)
        }
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
        val m = HANDLE.find(s) ?: return plainName(s.replace(Regex("""@.*"""), ""))
        val label = m.groupValues[2].trim()
        if (label.count { it.isLetter() } >= 3) return tidy(label)
        return fromHandle(m.groupValues[1])
    }

    /** Consumer numbers, card tails and "A/c" go; known billers get the name people use (audit A-003). */
    private val NOISE = Regex("""\b(?:consumer|cons|no|number|acct|account|card|ref)\b\.?|a/c|\bx+\d{2,}\b|\b\d{4,}\b""", I)
    private val BILLERS = linkedMapOf(
        "msedcl" to "MSEDCL Electricity", "mahadiscom" to "MSEDCL Electricity", "bescom" to "BESCOM Electricity",
        "tneb" to "TNEB Electricity", "tangedco" to "TNEB Electricity", "bses" to "BSES Electricity",
        "tatapower" to "Tata Power", "adanielectricity" to "Adani Electricity", "mahanagargas" to "Mahanagar Gas",
        "igl" to "Indraprastha Gas", "lic" to "LIC",
    )

    private fun plainName(raw: String): String {
        val cleaned = raw.replace(NOISE, " ").replace(Regex("""\s+"""), " ").trim().ifEmpty { raw.trim() }
        val letters = cleaned.lowercase().replace(Regex("""[^a-z]"""), "")
        BILLERS.entries.firstOrNull { letters.startsWith(it.key) }?.let { return it.value }
        return tidy(cleaned)
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
    private val ACRONYMS = setOf("PVR", "INOX", "SBI", "HDFC", "ICICI", "LIC", "ATM", "UPI", "KFC", "IRCTC", "BSES", "IKEA", "HP", "BP", "DLF", "NEFT", "IMPS")

    private fun tidy(s: String): String {
        val words = s.trim().split(Regex("""\s+""")).filter { it.isNotBlank() }
        // A name shouted in capitals ("ACME PVT LTD") reads as "Acme Pvt Ltd"; real acronyms stay.
        if (words.size > 1 && s.none { it.isLowerCase() }) {
            return words.joinToString(" ") { w -> if (w in ACRONYMS) w else w.lowercase().replaceFirstChar { it.uppercase() } }
        }
        return tidyMixed(words)
    }

    private fun tidyMixed(words: List<String>): String = words.joinToString(" ") { w ->
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
