package aiimin.core.engine.today

import org.junit.Test
import java.time.LocalDate
import kotlin.test.assertEquals
import kotlin.test.assertTrue

/** PRD Part 17: four Quick doors, never what the bar or the "+" sheet already offers. */
class QuickDoorsTest {
    private val install = LocalDate.of(2026, 10, 1)

    @Test fun `a new user sees Pour, Focus, Calendar, Plan`() =
        assertEquals(listOf("journalwrite", "focus", "calendar", "planday"), QuickDoors.pick(install, install.plusDays(2), emptyMap(), emptyList(), hasNote = false))

    @Test fun `Notes joins once a note is written`() =
        assertEquals(listOf("journalwrite", "focus", "calendar", "notes"), QuickDoors.pick(install, install.plusDays(2), emptyMap(), emptyList(), hasNote = true))

    @Test fun `after 7 days the row follows use`() {
        val opens = mapOf("budget" to 9, "focus" to 7, "moodyear" to 1, "goals" to 5, "calendar" to 2, "patterns" to 4)
        assertEquals(listOf("budget", "focus", "goals", "patterns"), QuickDoors.pick(install, install.plusDays(8), opens, emptyList(), false))
    }

    @Test fun `bar and plus-sheet features never appear`() {
        val opens = mapOf("money" to 99, "vault" to 99, "today" to 99, "me" to 99, "task" to 99, "expense" to 99, "note" to 99, "event" to 99, "doc" to 99)
        val doors = QuickDoors.pick(install, install.plusDays(30), opens, emptyList(), false)
        assertTrue(doors.none { it in QuickDoors.EXCLUDED }, doors.toString())
        assertEquals(4, doors.size)
    }

    @Test fun `pinned doors come first and stay`() =
        assertEquals(listOf("emergency", "budget", "focus", "goals"), QuickDoors.pick(install, install.plusDays(30), mapOf("budget" to 9, "focus" to 7, "goals" to 5), listOf("emergency"), false))

    @Test fun `keys with no screen behind them are skipped, so the row stays full`() {
        val opens = mapOf("txn" to 50, "goal" to 40, "budget" to 9)
        val doors = QuickDoors.pick(install, install.plusDays(30), opens, emptyList(), false, valid = setOf("budget", "journalwrite", "focus", "calendar", "planday", "notes"))
        assertEquals(listOf("budget", "journalwrite", "focus", "calendar"), doors)
    }
}
