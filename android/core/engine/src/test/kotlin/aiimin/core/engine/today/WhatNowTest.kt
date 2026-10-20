package aiimin.core.engine.today

import org.junit.Test
import java.time.LocalDate
import java.time.LocalTime
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

/** PRD Part 3 §1.2 Decision 2: the fixed "What now?" order, first match wins. */
class WhatNowTest {
    private val tue = LocalDate.of(2026, 10, 20)
    private fun at(h: Int, m: Int = 0) = LocalTime.of(h, m)
    private fun input(
        time: LocalTime = at(10),
        date: LocalDate = tue,
        focus: FocusNow? = null,
        timed: List<Timed> = emptyList(),
        bills: List<BillDue> = emptyList(),
        dayEnd: LocalTime = at(22),
        wrappedUp: Boolean = false,
        landmarkDue: Boolean = false,
        minimumsLeft: List<String> = emptyList(),
        tasks: List<OpenTask> = emptyList(),
        hidden: Set<NowKind> = emptySet(),
        skips: Map<NowKind, Int> = emptyMap(),
        raahiOn: Boolean = true,
    ) = NowInput(date, time, focus, timed, bills, dayEnd, wrappedUp, landmarkDue, minimumsLeft, tasks, hidden, skips, raahiOn)

    private val task = OpenTask("t1", "Send Q4 draft", priority = 1, time = null, createdAt = 5)

    @Test fun `1 a running focus session wins`() {
        val l = WhatNow.pick(input(focus = FocusNow("Deck", 18), timed = listOf(Timed("e", "Standup", at(10, 10), at(10, 30), true)), tasks = listOf(task)))
        assertEquals(NowKind.FOCUS, l.kind)
        assertEquals("Focus · Deck · 18 min left", WhatNowText.line(l, clock24 = false))
    }

    @Test fun `2 something starting within 90 minutes`() {
        val l = WhatNow.pick(input(timed = listOf(Timed("e", "Call CA", at(11, 20), at(11, 50), true)), tasks = listOf(task)))
        assertEquals(NowKind.SOON, l.kind)
        assertEquals("Call CA at 11:20 AM", WhatNowText.line(l, clock24 = false))
        assertEquals("Call CA at 11:20", WhatNowText.line(l, clock24 = true))
    }

    @Test fun `2 more than 90 minutes away is not soon`() {
        val l = WhatNow.pick(input(timed = listOf(Timed("e", "Call CA", at(11, 31), null, true)), tasks = listOf(task)))
        assertEquals(NowKind.TASK, l.kind)
    }

    @Test fun `2 happening now beats starting soon`() {
        val l = WhatNow.pick(input(timed = listOf(Timed("a", "Later", at(10, 5), null, true), Timed("b", "Standup", at(9, 50), at(10, 20), true))))
        assertEquals("b", l.targetId)
        assertEquals("Standup · now", WhatNowText.line(l, clock24 = false))
    }

    @Test fun `2 says whether it is an event or a timed task`() {
        assertTrue(WhatNow.pick(input(timed = listOf(Timed("e", "Standup", at(10, 30), null, true)))).isEvent)
        assertFalse(WhatNow.pick(input(timed = listOf(Timed("t", "Send draft", at(10, 30), null, false)))).isEvent)
    }

    @Test fun `2 ties go to the earliest start`() {
        val l = WhatNow.pick(input(timed = listOf(Timed("a", "B", at(11), null, false), Timed("b", "A", at(10, 30), null, false))))
        assertEquals("b", l.targetId)
    }

    @Test fun `3 a bill due today`() {
        val l = WhatNow.pick(input(bills = listOf(BillDue("b", "Electricity", 184_500)), tasks = listOf(task)))
        assertEquals(NowKind.BILL, l.kind)
        assertEquals("Electricity: ₹1,845 due today", WhatNowText.line(l, clock24 = false))
    }

    @Test fun `4 after the day-end hour it is wrap up`() {
        val l = WhatNow.pick(input(time = at(22, 10), minimumsLeft = listOf("Read"), tasks = listOf(task)))
        assertEquals(NowKind.WRAP_UP, l.kind)
        assertEquals("Wrap up your day · 2 min", WhatNowText.line(l, clock24 = false))
    }

    @Test fun `4 once wrapped up it moves on`() {
        val l = WhatNow.pick(input(time = at(22, 10), wrappedUp = true, minimumsLeft = listOf("Read")))
        assertEquals(NowKind.MINIMUM, l.kind)
    }

    @Test fun `5 Monday plans the week, the 1st plans the month`() {
        val mon = LocalDate.of(2026, 10, 19)
        assertEquals("Plan your week", WhatNowText.line(WhatNow.pick(input(date = mon, landmarkDue = true, tasks = listOf(task))), false))
        val first = LocalDate.of(2026, 11, 1)
        assertEquals("Plan your month", WhatNowText.line(WhatNow.pick(input(date = first, landmarkDue = true, tasks = listOf(task))), false))
    }

    @Test fun `6 a minimum left once the evening starts`() {
        assertEquals(NowKind.TASK, WhatNow.pick(input(time = at(15), minimumsLeft = listOf("Walk 20 minutes"), tasks = listOf(task))).kind)
        val l = WhatNow.pick(input(time = at(18), minimumsLeft = listOf("Walk 20 minutes", "Read"), tasks = listOf(task)))
        assertEquals(NowKind.MINIMUM, l.kind)
        assertEquals("Walk 20 minutes · 2 minimums left", WhatNowText.line(l, false))
    }

    @Test fun `7 the top open task by priority then earliest`() {
        val tasks = listOf(
            OpenTask("low", "Low", 0, null, 1), OpenTask("late", "High later", 2, at(16), 2), OpenTask("early", "High early", 2, at(14), 3),
        )
        assertEquals("early", WhatNow.pick(input(tasks = tasks)).targetId)
    }

    @Test fun `8 nothing left`() {
        assertEquals("All clear. Raahi is resting.", WhatNowText.line(WhatNow.pick(input()), false))
        assertEquals("All clear. The rest is yours.", WhatNowText.line(WhatNow.pick(input(raahiOn = false)), false))
    }

    @Test fun `exactly one line at every minute of the day`() {
        for (m in 0 until 24 * 60) {
            val l = WhatNow.pick(input(time = LocalTime.of(m / 60, m % 60), minimumsLeft = listOf("Read"), tasks = listOf(task)))
            assertTrue(l.kind in NowKind.entries)
        }
    }

    @Test fun `not now hides that kind for today`() {
        val l = WhatNow.pick(input(bills = listOf(BillDue("b", "Rent", 100)), tasks = listOf(task), hidden = setOf(NowKind.BILL)))
        assertEquals(NowKind.TASK, l.kind)
    }

    @Test fun `three skips of one kind drop it one step`() {
        assertEquals(listOf(NowKind.FOCUS, NowKind.SOON, NowKind.WRAP_UP, NowKind.BILL, NowKind.LANDMARK, NowKind.MINIMUM, NowKind.TASK, NowKind.CLEAR), WhatNow.order(mapOf(NowKind.BILL to 3)))
        assertEquals(WhatNow.BASE, WhatNow.order(mapOf(NowKind.BILL to 2)))
        // After the day end, with a bill skipped three times, wrap up comes first.
        val l = WhatNow.pick(input(time = at(22, 30), bills = listOf(BillDue("b", "Rent", 100)), skips = mapOf(NowKind.BILL to 3)))
        assertEquals(NowKind.WRAP_UP, l.kind)
    }

    @Test fun `clear never drops and focus is never demoted below clear`() {
        assertEquals(NowKind.CLEAR, WhatNow.order(mapOf(NowKind.TASK to 9)).last())
    }

    @Test fun `every line and reason is free of guilt words`() {
        val guilt = Regex("""\b(late|overdue|missed|streak|behind|failed)\b""", RegexOption.IGNORE_CASE)
        val lines = listOf(
            input(focus = FocusNow("", 5)), input(timed = listOf(Timed("e", "X", at(10, 30), null, true))), input(bills = listOf(BillDue("b", "Rent", 100))),
            input(time = at(23)), input(landmarkDue = true), input(time = at(19), minimumsLeft = listOf("Read")), input(tasks = listOf(task)), input(),
        ).map { WhatNow.pick(it) }
        lines.forEach { assertFalse(guilt.containsMatchIn(WhatNowText.line(it, false) + " " + WhatNowText.why(it, false)), it.toString()) }
    }

    @Test fun `two neighbours demoted together each drop one step`() {
        val o = WhatNow.order(mapOf(NowKind.BILL to 3, NowKind.WRAP_UP to 3))
        assertTrue(o.indexOf(NowKind.LANDMARK) < o.indexOf(NowKind.WRAP_UP), o.toString())
        assertTrue(o.indexOf(NowKind.SOON) < o.indexOf(NowKind.BILL), o.toString())
        assertEquals(NowKind.CLEAR, o.last())
    }

    @Test fun `an event across midnight is happening after midnight`() {
        val l = WhatNow.pick(input(time = at(0, 30), timed = listOf(Timed("p", "Party", at(23), at(1), true))))
        assertEquals(NowKind.SOON, l.kind)
        assertTrue(l.happeningNow)
    }
}
