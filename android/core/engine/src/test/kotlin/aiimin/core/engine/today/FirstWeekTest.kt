package aiimin.core.engine.today

import org.junit.Test
import java.time.LocalDate
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

/** Master plan Phase 6 R1 / PRD §1.2: five one-tap steps, days 1 to 7 only. */
class FirstWeekTest {
    private val install = LocalDate.of(2026, 10, 20)

    @Test fun `shows on days 1 to 7`() {
        assertTrue(FirstWeek.show(install, install, emptySet()))
        assertTrue(FirstWeek.show(install, install.plusDays(6), emptySet()))
        assertFalse(FirstWeek.show(install, install.plusDays(7), emptySet()))
    }

    @Test fun `never after all five are done`() = assertFalse(FirstWeek.show(install, install, SetupStep.entries.toSet()))

    @Test fun `steps keep their order and the next one is first open`() {
        assertEquals(SetupStep.entries.toList(), FirstWeek.steps())
        assertEquals(SetupStep.MINIMUM, FirstWeek.next(setOf(SetupStep.SCREEN_TIME)))
    }

    @Test fun `wording is plain, short and free of guilt words`() {
        val guilt = Regex("""\b(late|overdue|missed|streak|behind|failed)\b""", RegexOption.IGNORE_CASE)
        SetupStep.entries.forEach { s ->
            assertFalse(guilt.containsMatchIn(s.label))
            assertTrue(s.label.split(" ").size <= 6, s.label)
        }
        assertEquals("2 of 5 set up", FirstWeek.progress(setOf(SetupStep.CAPTURE, SetupStep.BUDGET)))
    }
}
