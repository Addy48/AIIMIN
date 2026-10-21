package aiimin.core.nlp

import java.time.LocalDate
import java.time.YearMonth

data class DocFields(
    val expires: LocalDate? = null,
    /** PAN, masked Aadhaar (last 4 only), passport or policy number. */
    val number: String? = null,
    val vehicle: String? = null,
    /** When this version starts (a cover's timeline and gap check). */
    val starts: LocalDate? = null,
    /** The insurer or issuer, from a fixed list; never guessed. */
    val provider: String? = null,
)

/**
 * India-first field extraction from document text (OCR or text layer).
 * Aadhaar is never kept in full. Prototype reference: `extractFields`.
 */
object DocumentFields {

    private val I = RegexOption.IGNORE_CASE
    private const val MONTHS = "jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec"
    private val MONTH_KEYS = listOf("jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec")

    private val NUMERIC_DATE = Regex("""(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})""")
    private val DAY_MONTH_YEAR = Regex("""(\d{1,2})[\s\-]*($MONTHS)[a-z]*[\s\-,]*(\d{2,4})""", I)
    private val MONTH_YEAR = Regex("""($MONTHS)[a-z]*[\s\-,]*(\d{4})""", I)
    private val EXPIRY_CUE = Regex(
        """(valid\s*(?:till|upto|up to|until)|expir\w*|renewal\s*due|due\s*date|date\s*of\s*expiry|policy\s*end)""",
        I,
    )
    private val START_CUE = Regex(
        """(valid\s*from|period\s*of\s*(?:insurance|cover)\W*(?:from)?|commencement(?:\s*date)?|start\s*date|effective\s*(?:from|date)|risk\s*start)""",
        I,
    )
    private val TO_CUE = Regex("""\b(?:to|till|until|upto)\b""", I)
    private val PROVIDERS = listOf(
        "ICICI Lombard" to "icici lombard", "ICICI Prudential" to "icici prudential", "HDFC Ergo" to "hdfc ergo", "HDFC Life" to "hdfc life",
        "Star Health" to "star health", "Care Health" to "care health", "Niva Bupa" to "niva bupa", "Bajaj Allianz" to "bajaj allianz",
        "Tata AIG" to "tata aig", "New India Assurance" to "new india assurance", "United India" to "united india insurance",
        "National Insurance" to "national insurance", "Oriental Insurance" to "oriental insurance", "Reliance General" to "reliance general",
        "SBI General" to "sbi general", "SBI Life" to "sbi life", "Aditya Birla" to "aditya birla", "ManipalCigna" to "manipalcigna",
        "Go Digit" to "go digit", "Acko" to "acko", "Kotak" to "kotak mahindra general", "IFFCO Tokio" to "iffco tokio",
        "Royal Sundaram" to "royal sundaram", "Chola MS" to "cholamandalam", "Future Generali" to "future generali", "Max Life" to "max life",
        "LIC" to "life insurance corporation",
    )
    private val PAN = Regex("""\b[A-Z]{5}[0-9]{4}[A-Z]\b""")
    private val AADHAAR = Regex("""\b\d{4}\s?\d{4}\s?\d{4}\b""")
    private val PASSPORT = Regex("""\b[A-PR-WY][1-9]\d\s?\d{4}[1-9]\b""")
    private val VEHICLE = Regex("""\b[A-Z]{2}[-\s]?\d{1,2}[-\s]?[A-Z]{1,3}[-\s]?\d{4}\b""")
    private val POLICY = Regex("""policy\s*(?:no\.?|number|#)\s*[:\-]?\s*([A-Z0-9/\-]{5,})""", I)

    /** dd/mm/yyyy (Indian order), "17 Dec 2026", or "Dec 2026" (→ last day of month). */
    fun parseAnyDate(s: String): LocalDate? {
        val text = s.trim()
        NUMERIC_DATE.find(text)?.let { m ->
            val y = m.groupValues[3].toInt().let { if (it < 100) it + 2000 else it }
            return runCatching { LocalDate.of(y, m.groupValues[2].toInt(), m.groupValues[1].toInt()) }.getOrNull()
        }
        DAY_MONTH_YEAR.find(text)?.let { m ->
            val y = m.groupValues[3].toInt().let { if (it < 100) it + 2000 else it }
            val month = MONTH_KEYS.indexOf(m.groupValues[2].take(3).lowercase()) + 1
            return runCatching { LocalDate.of(y, month, m.groupValues[1].toInt()) }.getOrNull()
        }
        MONTH_YEAR.find(text)?.let { m ->
            val month = MONTH_KEYS.indexOf(m.groupValues[1].take(3).lowercase()) + 1
            return runCatching { YearMonth.of(m.groupValues[2].toInt(), month).atEndOfMonth() }.getOrNull()
        }
        return null
    }

    fun extract(text: String): DocFields {
        var best: LocalDate? = null
        for (m in EXPIRY_CUE.findAll(text)) {
            val window = text.substring(m.range.first, minOf(text.length, m.range.first + 60)).replaceFirst(m.value, "")
            val d = parseAnyDate(window)
            if (d != null && (best == null || d.isAfter(best))) best = d
        }
        var number: String? = PAN.find(text)?.value
        if (number == null) AADHAAR.find(text)?.let { number = "XXXX XXXX " + it.value.replace(" ", "").takeLast(4) }
        if (number == null) number = PASSPORT.find(text)?.value
        val vehicle = VEHICLE.find(text)?.value
        if (number == null) number = POLICY.find(text)?.groupValues?.get(1)
        var starts: LocalDate? = null
        START_CUE.find(text)?.let { m ->
            val window = text.substring(m.range.last + 1, minOf(text.length, m.range.last + 1 + 60))
            starts = parseAnyDate(window)
            // "From 14/10/2026 To 13/10/2027": the end follows the start.
            if (best == null) TO_CUE.find(window)?.let { t -> parseAnyDate(window.substring(t.range.last + 1))?.let { e -> if (starts == null || e.isAfter(starts)) best = e } }
        }
        val low = text.lowercase()
        val provider = PROVIDERS.firstOrNull { low.contains(it.second) }?.first
        return DocFields(best, number, vehicle, starts, provider)
    }

    private val CATEGORY_RULES: List<Pair<String, Regex>> = listOf(
        // Insurance first: a motor policy mentions a vehicle and an owner's name.
        "Insurance" to Regex("""insurance|policy|premium|mediclaim|\blic\b"""),
        "Identity" to Regex("""aadhaar|aadhar|pan card|passport|voter id|driving licen[cs]e|identity card"""),
        "Health" to Regex("""prescription|report|blood|ecg|\blab\b|hospital|doctor|vaccin"""),
        "Vehicle" to Regex("""\brc\b|registration certificate|\bpuc\b|vehicle|\bcar\b|scooter|bike"""),
        "Finance & Tax" to Regex("""statement|form 16|\bitr\b|\btax\b|\bgst|invoice|bank|mutual fund|folio"""),
        "Property" to Regex("""rent agreement|sale deed|property|lease|khata"""),
        "Education" to Regex("""marksheet|degree|certificate|semester|transcript"""),
        "Bills & Warranties" to Regex("""\bbill\b|warranty|receipt|electricity|wifi|wi-fi|appliance"""),
        "Legal" to Regex("""\bwill\b|affidavit|legal|court|notary"""),
    )

    fun guessCategory(fileName: String, text: String = ""): String {
        val s = (fileName + " " + text.take(1500)).lowercase()
        return CATEGORY_RULES.firstOrNull { it.second.containsMatchIn(s) }?.first ?: "Other"
    }
}
