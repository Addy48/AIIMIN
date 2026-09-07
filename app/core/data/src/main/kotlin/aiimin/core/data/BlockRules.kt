package aiimin.core.data

import android.content.Context

object BlockRules {
    private const val PREFS = "aiimin_block_rules"
    private const val KEY_BLOCKED = "blocked_packages"
    private const val KEY_TERMS = "blocked_terms"
    private val defaultTerms = setOf(
        "porn", "pornhub", "xvideos", "xhamster", "redtube", "xxx", "hentai",
        "rule34", "nude", "nudity",
    )

    fun blockedPackages(context: Context): Set<String> =
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .getStringSet(KEY_BLOCKED, emptySet())?.toSet().orEmpty()

    fun setBlockedPackages(context: Context, packages: Set<String>) {
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .edit().putStringSet(KEY_BLOCKED, packages.toSet()).apply()
    }

    fun blockedTerms(context: Context): Set<String> =
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .getStringSet(KEY_TERMS, defaultTerms)?.toSet().orEmpty()

    fun setBlockedTerms(context: Context, terms: Set<String>) {
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .edit().putStringSet(KEY_TERMS, terms.map { it.trim().lowercase() }.filter { it.length >= 3 }.toSet()).apply()
    }

    fun textIsBlocked(context: Context, text: String): Boolean {
        val normalized = text.lowercase().replace(Regex("[^a-z0-9.]+"), " ")
        return blockedTerms(context).any { term -> normalized.contains(term) }
    }
}
