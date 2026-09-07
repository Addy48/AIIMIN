package aiimin.feature.capture.parse

import javax.inject.Inject
import javax.inject.Singleton

/**
 * Reads one sentence into structured fields, on the device, with rules.
 *
 * This is deliberately **not** the AI parse. The server's `/intelligence/parse`
 * is the real reader and lands when Capture is wired to the API; until then this
 * gives the surface something honest to offer, works offline, and is the
 * fallback for when the parse call fails or the tier's parse budget is spent.
 *
 * Every rule here is conservative: a reading the rules are not sure about
 * arrives with `included = false`, so an unattended Settle never writes a guess.
 */
@Singleton
class CaptureParser @Inject constructor() {

    fun parse(text: String): ParsedCapture {
        val trimmed = text.trim()
        if (trimmed.isEmpty()) return ParsedCapture(text = trimmed, chips = emptyList())

        val chips = buildList {
            val duration = readDuration(trimmed)
            val mood = readMood(trimmed)
            // "8/10" and "25 min" are already spoken for; blank them out so their
            // digits cannot be re-read as an amount.
            val amount = readAmount(trimmed, withoutClaimedNumbers(trimmed))
            val merchant = readMerchant(trimmed)
            val category = readCategory(trimmed, merchant)
            val people = readPeople(trimmed)

            amount?.let { add(CaptureChip(CaptureField.AMOUNT, it.display, included = it.confident)) }
            category?.let { add(CaptureChip(CaptureField.CATEGORY, it.name, included = it.confident)) }
            merchant?.let { add(CaptureChip(CaptureField.MERCHANT, it, included = true)) }
            people.forEach { add(CaptureChip(CaptureField.PEOPLE, it, included = true)) }
            mood?.let { add(CaptureChip(CaptureField.MOOD, it.display, included = it.confident)) }
            duration?.let { add(CaptureChip(CaptureField.DURATION, it.value, included = true)) }
        }

        return ParsedCapture(text = trimmed, chips = chips)
    }

    // --- amount ---------------------------------------------------------------

    private data class Amount(val display: String, val confident: Boolean)

    private fun readAmount(text: String, unclaimed: String): Amount? {
        CURRENCY.find(text)?.let { match ->
            return Amount(match.groupValues[1].groupDigits(), confident = true)
        }
        SPEND_VERB.find(text)?.let { match ->
            return Amount(match.groupValues[2].groupDigits(), confident = true)
        }
        // A bare number with no money context is a weak reading — offer it, off.
        val bare = BARE_NUMBER.find(unclaimed)?.value?.takeIf { it.length >= 2 } ?: return null
        return Amount(bare.groupDigits(), confident = false)
    }

    /** The sentence with every number another field already owns blanked out. */
    private fun withoutClaimedNumbers(text: String): String =
        listOf(OUT_OF_TEN, MINUTES, HOURS).fold(text) { acc, regex -> regex.replace(acc, " ") }

    private fun String.groupDigits(): String {
        val digits = filter(Char::isDigit).trimStart('0').ifEmpty { "0" }
        // Indian grouping: last three, then pairs — 12,34,567.
        if (digits.length <= 3) return digits
        val head = digits.dropLast(3)
        val tail = digits.takeLast(3)
        val grouped = head.reversed().chunked(2).joinToString(",").reversed()
        return "$grouped,$tail"
    }

    // --- mood -----------------------------------------------------------------

    private data class Mood(val display: String, val raw: String, val confident: Boolean)

    private fun readMood(text: String): Mood? {
        OUT_OF_TEN.find(text)?.let { match ->
            val score = match.groupValues[1]
            return Mood(display = "$score/10", raw = score, confident = true)
        }
        val word = MOOD_WORDS.entries.firstOrNull { (word, _) -> text.containsWord(word) }
            ?: return null
        return Mood(display = word.value, raw = word.key, confident = false)
    }

    // --- duration -------------------------------------------------------------

    private data class Duration(val value: String)

    private fun readDuration(text: String): Duration? {
        HOURS.find(text)?.let { match ->
            val hours = match.groupValues[1].toIntOrNull() ?: return@let
            return Duration((hours * 60).toString())
        }
        MINUTES.find(text)?.let { match ->
            return Duration(match.groupValues[1])
        }
        return null
    }

    // --- merchant and category ------------------------------------------------

    private fun readMerchant(text: String): String? =
        MERCHANTS.keys.firstOrNull { text.containsWord(it) }?.let { MERCHANTS.getValue(it) }

    private data class Category(val name: String, val confident: Boolean)

    private fun readCategory(text: String, merchant: String?): Category? {
        merchant?.let { name ->
            MERCHANT_CATEGORY[name]?.let { return Category(it, confident = true) }
        }
        val keyword = CATEGORY_WORDS.entries.firstOrNull { (word, _) -> text.containsWord(word) }
            ?: return null
        return Category(keyword.value, confident = true)
    }

    // --- people ---------------------------------------------------------------

    private fun readPeople(text: String): List<String> =
        WITH_PEOPLE.findAll(text)
            .flatMap { match -> match.groupValues[1].split(" and ", ",", "&") }
            .map { it.trim() }
            .filter { it.isNotEmpty() && it.length <= 20 }
            .map { name -> name.replaceFirstChar(Char::uppercaseChar) }
            .distinct()
            .toList()

    private fun String.containsWord(word: String): Boolean =
        Regex("""\b${Regex.escape(word)}\b""", RegexOption.IGNORE_CASE).containsMatchIn(this)

    private companion object {
        val CURRENCY = Regex("""(?:₹|\brs\.?|\binr)\s*([\d,]+)""", RegexOption.IGNORE_CASE)
        val SPEND_VERB = Regex(
            """\b(paid|spent|spend|bought|cost|charged|billed)\b[^\d]{0,12}([\d,]+)""",
            RegexOption.IGNORE_CASE,
        )
        val BARE_NUMBER = Regex("""\b\d[\d,]*\b""")
        val OUT_OF_TEN = Regex("""\b(10|[0-9])\s*/\s*10\b""")
        val MINUTES = Regex("""\b(\d{1,3})\s*(?:min|mins|minutes)\b""", RegexOption.IGNORE_CASE)
        val HOURS = Regex("""\b(\d{1,2})\s*(?:h|hr|hrs|hour|hours)\b""", RegexOption.IGNORE_CASE)
        val WITH_PEOPLE = Regex("""\bwith\s+([a-z][a-z ,&]*?)(?=[,.]|\s+(?:at|in|for|and then)\b|$)""", RegexOption.IGNORE_CASE)

        val MERCHANTS = mapOf(
            "swiggy" to "Swiggy",
            "zomato" to "Zomato",
            "blinkit" to "Blinkit",
            "zepto" to "Zepto",
            "bigbasket" to "BigBasket",
            "dmart" to "DMart",
            "amazon" to "Amazon",
            "flipkart" to "Flipkart",
            "uber" to "Uber",
            "ola" to "Ola",
            "rapido" to "Rapido",
            "metro" to "Delhi Metro",
            "irctc" to "IRCTC",
            "spotify" to "Spotify",
            "netflix" to "Netflix",
            "jio" to "Jio",
            "airtel" to "Airtel",
        )

        val MERCHANT_CATEGORY = mapOf(
            "Swiggy" to "Food",
            "Zomato" to "Food",
            "Blinkit" to "Grocery",
            "Zepto" to "Grocery",
            "BigBasket" to "Grocery",
            "DMart" to "Grocery",
            "Amazon" to "Shopping",
            "Flipkart" to "Shopping",
            "Uber" to "Transport",
            "Ola" to "Transport",
            "Rapido" to "Transport",
            "Delhi Metro" to "Transport",
            "IRCTC" to "Transport",
            "Spotify" to "Subscriptions",
            "Netflix" to "Subscriptions",
            "Jio" to "Bills",
            "Airtel" to "Bills",
        )

        val CATEGORY_WORDS = mapOf(
            "dinner" to "Food",
            "lunch" to "Food",
            "breakfast" to "Food",
            "coffee" to "Food",
            "groceries" to "Grocery",
            "grocery" to "Grocery",
            "fare" to "Transport",
            "cab" to "Transport",
            "petrol" to "Transport",
            "fuel" to "Transport",
            "rent" to "Housing",
            "medicine" to "Health",
            "gym" to "Health",
            "doctor" to "Health",
            "books" to "Learning",
            "course" to "Learning",
        )

        val MOOD_WORDS = mapOf(
            "sluggish" to "low",
            "drained" to "low",
            "tired" to "low",
            "low" to "low",
            "flat" to "low",
            "sharp" to "high",
            "clear" to "high",
            "great" to "high",
            "good" to "high",
            "calm" to "steady",
            "steady" to "steady",
            "anxious" to "low",
        )
    }
}
