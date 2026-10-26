package aiimin.core.nlp

import java.math.BigDecimal
import java.math.RoundingMode

internal data class Amount(
    val start: Int,
    val end: Int,
    val paise: Long,
    val currency: String,
    /** A currency word or symbol sits next to the number. */
    val marked: Boolean,
)

/** [chosen] is the one certain amount of the clause, or null; [unsure] says why when the clause has digits that might be money but cannot be trusted. */
internal data class MoneyScan(val chosen: Amount?, val candidates: List<Amount>, val unsure: String?, val rest: String)

/**
 * Money is exact: BigDecimal in, paise out, never rounded. A number is money only if a currency word/symbol
 * sits next to it, or it is the one stand-alone number left after times, dates, quantities and codes are
 * set aside. Anything else that looks like an amount (a sum, a negative, "24O", "1e3", two competing
 * figures) is reported as [MoneyScan.unsure] so the caller asks instead of saving a guess.
 */
internal object MoneyParser {
    private val I = RegexOption.IGNORE_CASE

    private val NUMBER = Regex("""(?<![\d,]|\d\.)(\d{1,3}(?:,\d{2,3})+(?:\.\d+)?|\d+(?:\.\d+)?|(?<!\w)\.\d+)""")
    private val SUFFIX = Regex("""^\s*(k|thousand|hazaar|lakhs?|crores?|cr|million|mn)(?![a-z])""", I)
    private val SLASH_DASH = Regex("""^\s*/-""")
    private val UNIT_AFTER = Regex(
        """^\s*(?:kgs?|kilos?|grams?|gms?|g|ml|l|ltrs?|litres?|liters?|pages?|pg|mins?|minutes?|hours?|hrs?|km|kms|people|persons?|ppl|pcs|pieces?|items?|days?|months?|years?|weeks?|times|%|percent|ghante|ghanta|din|mahine|saal|reps|glasses|pushups|steps|x)\b""", I,
    )
    private val CODE_BEFORE = Regex("""\b(?:number|no\.?|num|#|code|pin|room|flat|gate|locker|bus|order|id|ref|otp|plot|house|apt|apartment|floor|block|tower|seat|coach|platform|gate)\s*$""", I)
    private val INR_BEFORE = Regex("""(?:₹|\brs\.?|\binr|\brupees|\brupee)\s*$""", I)
    private val CUR_BEFORE = Regex("""(₹|\$|€|£|¥|\bus\$|\ba\$|\bc\$|\brs\.?|\binr|\busd|\baud|\bcad|\beur|\bgbp|\baed|\bsgd|\bjpy|\brupees|\brupee|\bdollars?|\beuros?|\bpounds?)\s*$""", I)
    private val CUR_AFTER = Regex("""^\s*(₹|\$|€|£|¥|rs\b\.?|inr\b|usd\b|aud\b|cad\b|eur\b|gbp\b|aed\b|sgd\b|jpy\b|rupees?\b|dollars?\b|bucks\b|euros?\b|pounds?\b|quid\b|dirhams?\b|yen\b|only\b)""", I)
    private val MY_SHARE = Regex("""\b(?:my share|mera hissa|mere hisse)\s*(?:is|=|:)?\s*$""", I)

    private val NEG = Regex("""(?:^|\s)-\d""")
    private val SUM = Regex("""\d\s*\+\s*\d""")
    private val OCR = Regex("""\b\d+o\b|\d[o]\d|\b\d+e\d+\b""", I)
    private val HEDGE = Regex("""\b(?:maybe|shayad|perhaps|probably|possibly|ya)\b""", I)

    fun currencyOf(token: String, default: String): String = when (token.lowercase().trimEnd('.')) {
        "₹", "rs", "inr", "rupee", "rupees", "only" -> "INR"
        "$", "us$", "usd", "dollar", "dollars", "bucks" -> "USD"
        "a$", "aud" -> "AUD"
        "c$", "cad" -> "CAD"
        "€", "eur", "euro", "euros" -> "EUR"
        "£", "gbp", "pound", "pounds", "quid" -> "GBP"
        "aed", "dirham", "dirhams" -> "AED"
        "sgd" -> "SGD"
        "¥", "jpy", "yen" -> "JPY"
        else -> default
    }

    fun scan(text: String, defaultCurrency: String = "INR"): MoneyScan {
        val t = text.lowercase()
        var unsure: String? = null
        val all = ArrayList<Amount>()
        val hasDigits = t.any { it.isDigit() }
        if (!hasDigits) return MoneyScan(null, emptyList(), null, t)

        if (NEG.containsMatchIn(t)) unsure = "negative amount"
        else if (SUM.containsMatchIn(t)) unsure = "sum of amounts"
        else if (OCR.containsMatchIn(t)) unsure = "garbled number"

        for (m in NUMBER.findAll(t)) {
            val s = m.range.first
            var e = m.range.last + 1
            val before = t.substring(0, s)
            val rest = t.substring(e)
            // letters glued to the number ("24o", "5kg", "3rd", "10am") are not a plain amount
            val glued = rest.firstOrNull()?.isLetter() == true
            var mult = BigDecimal.ONE
            var suffixed = false
            SUFFIX.find(rest)?.let { sm ->
                suffixed = true
                mult = when (sm.groupValues[1].lowercase()) {
                    "k", "thousand", "hazaar" -> BigDecimal(1000)
                    "lakh", "lakhs" -> BigDecimal(100_000)
                    "crore", "crores", "cr" -> BigDecimal(10_000_000)
                    else -> BigDecimal(1_000_000)
                }
                e += sm.value.length
            }
            if (glued && !suffixed) continue
            val after = t.substring(e)
            val slash = SLASH_DASH.find(after)
            if (slash != null) e += slash.value.length
            val tail = t.substring(e)

            var currency = defaultCurrency
            var marked = slash != null
            if (slash != null) currency = "INR"
            val cb = CUR_BEFORE.find(before)
            val ca = CUR_AFTER.find(tail)
            if (cb != null) { marked = true; currency = currencyOf(cb.groupValues[1], defaultCurrency) }
            else if (ca != null) { marked = true; currency = currencyOf(ca.groupValues[1], defaultCurrency) }

            if (!marked) {
                if (UNIT_AFTER.containsMatchIn(tail)) continue
                if (CODE_BEFORE.containsMatchIn(before)) continue
            }
            val raw = BigDecimal(m.groupValues[1].replace(",", "")).multiply(mult).multiply(BigDecimal(100))
            val paise = raw.setScale(0, RoundingMode.DOWN)
            if (raw.compareTo(paise) != 0) { unsure = unsure ?: "fractional paise"; continue }
            if (paise.signum() <= 0 || paise > BigDecimal("100000000000000")) { unsure = unsure ?: "amount out of range"; continue }
            all += Amount(s, e, paise.toLong(), currency, marked)
        }

        if (HEDGE.containsMatchIn(t) && all.isNotEmpty()) unsure = unsure ?: "hedged amount"
        if (unsure != null) return MoneyScan(null, all, unsure, t)
        if (all.isEmpty()) return MoneyScan(null, all, null, t)

        val share = all.firstOrNull { MY_SHARE.containsMatchIn(t.substring(0, it.start)) }
        val chosen: Amount? = when {
            share != null -> share
            all.size == 1 -> all[0]
            all.count { it.marked } == 1 -> all.first { it.marked }
            all.count { it.marked } > 1 -> { unsure = "several amounts"; null }
            else -> {
                val sorted = all.sortedByDescending { it.paise }
                // a small whole number beside a bigger one is a count ("3 books 900")
                val countLike = sorted.drop(1).all { it.paise % 100 == 0L && it.paise <= 900 && t.substring(it.end).trimStart().firstOrNull()?.isLetter() == true }
                if (countLike) sorted[0] else { unsure = "several amounts"; null }
            }
        }
        val rest = if (chosen != null) (t.substring(0, chosen.start) + " " + t.substring(chosen.end)) else t
        return MoneyScan(chosen, all, unsure, rest)
    }
}
