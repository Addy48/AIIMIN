package aiimin.core.data.money

import aiimin.core.database.CategoryEntity
import aiimin.core.database.PayeeRuleEntity

/**
 * Merchant memory (plan §3, the owner's Sanchy story): name the place once, pick its category, say what
 * you bought. The next alert from the same UPI handle or name arrives named and sorted, so only the item
 * is left to type. Pure, so the rules are tested without a database.
 */
object MerchantMemory {
    private const val MAX_NOTES = 5

    data class Guess(val title: String, val category: String, val confidence: Double)

    fun notes(r: PayeeRuleEntity): List<String> = r.lastNotes.split('|').map { it.trim() }.filter { it.isNotEmpty() }

    /** The rule after a payment is settled: the chosen place and category, the item added to the recent list. */
    fun learn(cur: PayeeRuleEntity?, key: String, place: String, category: String, ledger: String, note: String?, now: Long): PayeeRuleEntity {
        val item = note?.trim()?.replace("|", " ").orEmpty()
        val old = cur?.let(::notes).orEmpty()
        val recent = if (item.isEmpty()) old else (listOf(item) + old.filterNot { it.equals(item, ignoreCase = true) }).take(MAX_NOTES)
        return PayeeRuleEntity(
            key = key, category = category, ledger = ledger, updatedAt = now,
            label = place.trim().ifEmpty { cur?.label.orEmpty() },
            alwaysAsk = cur?.alwaysAsk ?: false,
            hits = (cur?.hits ?: 0) + 1,
            lastNotes = recent.joinToString("|"),
        )
    }

    /** How a new alert is filled in: the learned place and category, or the cleaned SMS name. */
    fun guess(rule: PayeeRuleEntity?, parsedName: String, hasReference: Boolean, fallbackCategory: String): Guess {
        val applied = rule?.takeIf { !it.alwaysAsk }
        return Guess(
            title = rule?.label?.ifBlank { null } ?: parsedName,
            category = applied?.category ?: fallbackCategory,
            confidence = when {
                applied != null && hasReference -> 0.95
                applied != null -> 0.9
                hasReference -> 0.8
                else -> 0.6
            },
        )
    }

    /** Built-in and custom categories together, most used lately first; archived custom ones hidden. */
    fun categories(builtIn: List<String>, custom: List<CategoryEntity>, used: Map<String, Int>): List<String> {
        val all = (builtIn + custom.filter { !it.archived }.map { it.name }).distinct()
        val order = all.withIndex().associate { it.value to it.index }
        return all.sortedWith(compareByDescending<String> { used[it] ?: 0 }.thenBy { order[it] })
    }

    /** A tidy new category name, or null when it is empty or already exists (any case). */
    fun newCategoryName(raw: String, existing: List<String>): String? {
        val n = raw.trim().replace(Regex("""\s+"""), " ").replaceFirstChar { it.uppercase() }
        if (n.isEmpty() || existing.any { it.equals(n, ignoreCase = true) }) return null
        return n
    }
}
