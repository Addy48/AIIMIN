package aiimin.core.engine.today

import org.junit.Test
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.ZoneOffset
import kotlin.test.assertEquals
import kotlin.test.assertNull

/** PRD §1.2 "Day-end hour is learned, never silent". */
class DayEndLearnerTest {
    private fun t(h: Int, m: Int = 0) = LocalTime.of(h, m)
    private val today = LocalDate.of(2026, 10, 20)

    @Test fun `seven nights give the median sleep start minus an hour`() {
        val nights = listOf(t(0, 30), t(23, 30), t(0, 0), t(1, 0), t(0, 15), t(23, 45), t(0, 45))
        // sorted: 23:30 23:45 0:00 0:15 0:30 0:45 1:00 -> median 0:15 -> day end 23:15
        assertEquals(DayEndDecision.Suggest(t(23, 15)), DayEndLearner.next(nights, t(22), DayEndMode.SET, null, today, usageAccess = true))
    }

    @Test fun `fewer than four valid nights gives nothing`() =
        assertEquals(DayEndDecision.None, DayEndLearner.next(listOf(t(0), null, t(1), null, t(0, 30), null, null), t(22), DayEndMode.SET, null, today, true))

    @Test fun `only the last seven nights count`() {
        val old = List(10) { t(3) }
        val recent = List(7) { t(23) }
        assertEquals(DayEndDecision.Suggest(t(22)), DayEndLearner.next(old + recent, t(21), DayEndMode.SET, null, today, true))
    }

    @Test fun `a pinned value is never overwritten`() =
        assertEquals(DayEndDecision.None, DayEndLearner.next(List(7) { t(1) }, t(21), DayEndMode.PINNED, null, today, true))

    @Test fun `after yes it moves at most 30 minutes a week`() {
        assertEquals(DayEndDecision.Apply(t(22, 30)), DayEndLearner.next(List(7) { t(1) }, t(22), DayEndMode.LEARNING, today.minusDays(8), today, true))
        assertEquals(DayEndDecision.None, DayEndLearner.next(List(7) { t(1) }, t(22), DayEndMode.LEARNING, today.minusDays(3), today, true))
    }

    @Test fun `without usage access it only suggests`() =
        assertEquals(DayEndDecision.Suggest(t(0)), DayEndLearner.next(List(7) { t(1) }, t(22), DayEndMode.LEARNING, today.minusDays(8), today, usageAccess = false))

    @Test fun `the floor is 20 00`() =
        assertEquals(DayEndDecision.Suggest(t(20)), DayEndLearner.next(List(7) { t(20, 30) }, t(22), DayEndMode.SET, null, today, true))

    @Test fun `no change gives nothing`() =
        assertEquals(DayEndDecision.None, DayEndLearner.next(List(7) { t(23) }, t(22), DayEndMode.SET, null, today, true))

    @Test fun `from onboarding the day end is sleep minus an hour, at least 20 00`() {
        assertEquals(t(22, 30), DayEndLearner.fromSleep(t(23, 30)))
        assertEquals(t(20), DayEndLearner.fromSleep(t(20, 30)))
        assertEquals(t(23, 30), DayEndLearner.fromSleep(t(0, 30)))
    }

    @Test fun `a night's sleep start is the longest screen-off stretch of 4 hours or more`() {
        fun ms(d: Int, h: Int, m: Int = 0) = LocalDateTime.of(2026, 10, d, h, m).toInstant(ZoneOffset.UTC).toEpochMilli()
        val events = listOf(
            ms(19, 21) to false, ms(19, 21, 40) to true, // 40 min off
            ms(19, 23, 50) to false, ms(20, 7, 10) to true, // the night
            ms(20, 8) to false, ms(20, 8, 5) to true,
        )
        assertEquals(t(23, 50), DayEndLearner.sleepStart(events, LocalDate.of(2026, 10, 19), ZoneOffset.UTC))
        assertNull(DayEndLearner.sleepStart(listOf(ms(19, 23) to false, ms(20, 1) to true), LocalDate.of(2026, 10, 19), ZoneOffset.UTC))
    }

    @Test fun `nights that start after 4 am do not count (shift work is later)`() {
        val nights = List(7) { t(6) }
        assertEquals(DayEndDecision.None, DayEndLearner.next(nights, t(22), DayEndMode.SET, null, today, true))
    }
}
