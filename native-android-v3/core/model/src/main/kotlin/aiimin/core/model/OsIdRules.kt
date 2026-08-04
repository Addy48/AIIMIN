package aiimin.core.model

/**
 * OS-ID rules — the part number contract.
 *
 * Exactly 8 · uppercase A–Z / 0–9 · at most 4 digits · one lifetime revision
 * (revision tracking is account-side; this validates shape only).
 */
object OsIdRules {
    const val LENGTH = 8
    const val MAX_DIGITS = 4

    fun normalize(raw: String): String = raw.trim().uppercase()

    fun isValid(raw: String): Boolean {
        val id = normalize(raw)
        if (id.length != LENGTH) return false
        if (!id.all { it in 'A'..'Z' || it in '0'..'9' }) return false
        if (id.count { it.isDigit() } > MAX_DIGITS) return false
        return true
    }

    fun digitCount(raw: String): Int = normalize(raw).count { it.isDigit() }

    fun issues(raw: String): List<String> {
        val id = normalize(raw)
        val out = mutableListOf<String>()
        if (id.length != LENGTH) out += "Length must be exactly $LENGTH"
        if (id.any { it !in 'A'..'Z' && it !in '0'..'9' }) out += "Only A–Z and 0–9"
        if (digitCount(id) > MAX_DIGITS) out += "At most $MAX_DIGITS digits"
        return out
    }
}
