package aiimin.core.engine.today

import java.time.LocalDate
import java.time.temporal.ChronoUnit

/**
 * PRD Part 17: one row of four Quick doors on Today. A new user sees Pour, Focus, Calendar and Plan (Notes takes
 * Plan's place once a note exists); after 7 days the row follows what the person opens most. Pinned doors come
 * first. Nothing already in the bar or the "+" sheet ever appears. Counts stay on the phone.
 */
object QuickDoors {
    /** Keys are route names in lower case: Pour (the private writer, "journalwrite" until B7b), Focus, Calendar, Plan my day. */
    val DEFAULTS = listOf("journalwrite", "focus", "calendar", "planday")
    /** The bar (Today, Money, +, Vault, You), the "+" sheet's types and single items (a task, a note, a document). */
    val EXCLUDED = setOf("today", "money", "vault", "me", "you", "task", "expense", "note", "event", "doc", "document", "capture", "search", "notifications")
    const val SLOTS = 4
    const val LEARN_AFTER_DAYS = 7L

    /** [valid] is every key that has a screen behind it; others (single items like a payment) are skipped. */
    fun pick(installDay: LocalDate, today: LocalDate, opens: Map<String, Int>, pinned: List<String>, hasNote: Boolean, valid: Set<String>? = null): List<String> {
        val base = if (hasNote) DEFAULTS.dropLast(1) + "notes" else DEFAULTS
        val learned = if (ChronoUnit.DAYS.between(installDay, today) >= LEARN_AFTER_DAYS) {
            opens.filterKeys { it !in EXCLUDED && opens[it]!! > 0 }.entries.sortedWith(compareByDescending<Map.Entry<String, Int>> { it.value }.thenBy { it.key }).map { it.key }
        } else emptyList()
        return (pinned.filter { it !in EXCLUDED } + learned + base).distinct().filter { valid == null || it in valid }.take(SLOTS)
    }
}
