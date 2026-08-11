package `in`.aiimin.app.ui.auth

import java.util.Locale

object OsIdRules {
    private val allowed = Regex("^[A-Z0-9@,._\\-=+*^$#!]+$")

    fun isEmailIdentifier(raw: String): Boolean {
        val v = raw.trim()
        if (Regex("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$").matches(v)) return true
        if (Regex("@[a-z0-9][a-z0-9.-]*\\.", RegexOption.IGNORE_CASE).containsMatchIn(v)) return true
        if (Regex("@[a-z0-9.-]{3,}$", RegexOption.IGNORE_CASE).containsMatchIn(v)) return true
        return false
    }

    fun isCompleteOsId(raw: String): Boolean {
        val v = raw.trim().uppercase(Locale.US)
        if (v.isEmpty() || isEmailIdentifier(v)) return false
        if (v.length != 8) return false
        if (!allowed.matches(v)) return false
        if ((v.count { it.isDigit() }) > 4) return false
        return true
    }

    fun normalizeLoginIdentifier(raw: String): String {
        val v = raw
        if (isEmailIdentifier(v) || (v.contains('@') && v.length > 8)) {
            return v.trim().lowercase(Locale.US)
        }
        return v.uppercase(Locale.US)
            .replace(Regex("[^A-Z0-9@,._\\-=+*^$#!]"), "")
            .take(8)
    }

    fun normalizeOsId(raw: String): String =
        raw.trim().uppercase(Locale.US)
            .replace(Regex("[^A-Z0-9@,._\\-=+*^$#!]"), "")
            .take(8)

    fun validateOsId(raw: String): String? {
        val val_ = normalizeOsId(raw)
        if (val_.isEmpty()) return "OS-ID cannot be empty."
        if (val_.length != 8) return "OS-ID must be exactly 8 characters."
        if (!allowed.matches(val_)) return "Only letters, numbers, and @,._-=+*^\$#! allowed."
        if (val_.count { it.isDigit() } > 4) return "Maximum 4 digits allowed."
        return null
    }

    fun maskIdentity(raw: String): String {
        val v = raw.trim()
        if (v.isEmpty()) return "your account"
        if (isEmailIdentifier(v)) {
            val parts = v.split("@", limit = 2)
            if (parts.size < 2) return "your account"
            val user = parts[0]
            val domain = parts[1]
            val u = if (user.length <= 2) "${user.firstOrNull() ?: '*'}*" else "${user.take(2)}***"
            return "$u@$domain"
        }
        return if (v.length >= 6) "${v.take(2)}****${v.takeLast(2)}"
        else if (v.length >= 3) "${v.take(1)}****${v.takeLast(1)}"
        else "your account"
    }
}
