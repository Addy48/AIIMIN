package aiimin.core.engine.raahi

import java.time.LocalDate
import java.time.LocalDateTime
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class RaahiTest {
    private val day = LocalDate.of(2026, 10, 20)

    private fun greet(
        hour: Int = 9,
        mode: RaahiMode = RaahiMode.QUIET,
        name: String = "Meera",
        lastOpen: LocalDate? = day.minusDays(1),
        greetedToday: Boolean = false,
        nameUsedToday: Boolean = false,
        dayClosed: Boolean = false,
        minimums: Int = 3,
        newDevice: Boolean = false,
        first: RaahiFirst? = null,
        lateHour: Int = 23,
        date: LocalDate = day,
    ) = RaahiGreeting.pick(GreetInput(mode, LocalDateTime.of(date, java.time.LocalTime.of(hour, 0)), name, lastOpen, greetedToday, nameUsedToday, dayClosed, minimums, newDevice, first, lateHour))

    // --- modes and motion budget (1.1 done-when: "at most 3 animations in a day (counted in a test)")

    @Test fun defaultModeIsQuiet() {
        assertEquals(RaahiMode.QUIET, RaahiMode.of(null))
        assertEquals(RaahiMode.QUIET, RaahiMode.of("junk"))
        assertEquals(RaahiMode.OFF, RaahiMode.of("OFF"))
    }

    @Test fun quietPlaysAtMostThreeMotionsADay() {
        var b = RaahiBudget(null)
        var played = 0
        repeat(10) {
            val (ok, next) = RaahiRules.play(RaahiMode.QUIET, false, day, b, RaahiMotion.NOD)
            if (ok) played++
            b = next
        }
        assertEquals(3, played)
        // A new day resets the count.
        assertTrue(RaahiRules.play(RaahiMode.QUIET, false, day.plusDays(1), b, RaahiMotion.NOD).first)
    }

    @Test fun fullHasNoDailyCapButHopsStopAtTwo() {
        var b = RaahiBudget(null)
        repeat(10) { b = RaahiRules.play(RaahiMode.FULL, false, day, b, RaahiMotion.NOD).second }
        assertTrue(RaahiRules.play(RaahiMode.FULL, false, day, b, RaahiMotion.WAVE).first)
        var hops = 0
        repeat(5) { val (ok, next) = RaahiRules.play(RaahiMode.FULL, false, day, b, RaahiMotion.HOP); if (ok) hops++; b = next }
        assertEquals(2, hops)
    }

    @Test fun offAndReduceMotionNeverPlay() {
        val b = RaahiBudget(day)
        RaahiMotion.entries.forEach { m ->
            assertFalse(RaahiRules.play(RaahiMode.OFF, false, day, b, m).first)
            assertFalse(RaahiRules.play(RaahiMode.FULL, true, day, b, m).first)
            assertFalse(RaahiRules.play(RaahiMode.QUIET, true, day, b, m).first)
        }
        assertFalse(RaahiRules.loops(RaahiMode.FULL, true))
        assertFalse(RaahiRules.loops(RaahiMode.QUIET, false))
        assertTrue(RaahiRules.loops(RaahiMode.FULL, false))
    }

    @Test fun offHidesArt() {
        assertFalse(RaahiRules.showsArt(RaahiMode.OFF))
        assertTrue(RaahiRules.showsArt(RaahiMode.QUIET))
        assertTrue(RaahiRules.showsArt(RaahiMode.FULL))
    }

    @Test fun budgetRoundTripsAndToleratesJunk() {
        val b = RaahiBudget(day, 2, 1)
        assertEquals(b, RaahiBudget.decode(b.encode()))
        assertEquals(RaahiBudget(null), RaahiBudget.decode("bad"))
        assertEquals(RaahiBudget(null), RaahiBudget.decode(null))
    }

    // --- poses (20.5: no sad pose exists)

    @Test fun noBannedPoseExists() {
        val banned = listOf("sad", "hungry", "disappointed", "cry", "angry", "upset", "tired")
        (RaahiPose.entries.map { it.key } + RaahiScene.entries.map { it.key }).forEach { k ->
            banned.forEach { assertFalse("$k is banned", k.contains(it)) }
        }
    }

    @Test fun miniPicksPoseFromTheDay() {
        val base = MiniState(hour = 14, firstOpenToday = false, dayClosed = false, afterDayEnd = false, nothingLeft = false, allMinimumsKept = false, needsAttention = false)
        assertEquals(RaahiPose.IDLE, RaahiMini.pose(base))
        assertEquals(RaahiPose.WAKING, RaahiMini.pose(base.copy(hour = 7, firstOpenToday = true)))
        assertEquals(RaahiPose.IDLE, RaahiMini.pose(base.copy(hour = 15, firstOpenToday = true)))
        assertEquals(RaahiPose.NOTICING, RaahiMini.pose(base.copy(needsAttention = true)))
        assertEquals(RaahiPose.SETTLE, RaahiMini.pose(base.copy(allMinimumsKept = true, needsAttention = true)))
        assertEquals(RaahiPose.SETTLE, RaahiMini.pose(base.copy(dayClosed = true)))
        assertEquals(RaahiPose.SLEEPING, RaahiMini.pose(base.copy(hour = 23, afterDayEnd = true, nothingLeft = true)))
        assertEquals(RaahiPose.SLEEPING, RaahiMini.pose(base.copy(hour = 23, afterDayEnd = true, dayClosed = true)))
        // Every pose the Mini can pick is one it may use at 28 dp.
        listOf(base, base.copy(hour = 7, firstOpenToday = true), base.copy(needsAttention = true), base.copy(dayClosed = true), base.copy(afterDayEnd = true, nothingLeft = true))
            .forEach { assertTrue(RaahiMini.pose(it) in RaahiMini.POSES) }
    }

    // --- greetings, one test per situation in 1.6b

    @Test fun firstEverOpen() {
        assertTrue((0..3).any { greet(lastOpen = null, date = day.plusDays(it.toLong())).lines == listOf("Hi Meera. Let's start small.") })
        assertTrue(greet(lastOpen = null).lines.single() in listOf("Hi Meera. Let's start small.", "Hello. One thing at a time."))
        assertEquals(RaahiPose.WAVING, greet(lastOpen = null).pose)
    }

    @Test fun sameDayLaterOpensSayNothing() {
        assertEquals(Greeting.NONE, greet(greetedToday = true))
        assertEquals(Greeting.NONE, greet(greetedToday = true, mode = RaahiMode.FULL))
    }

    @Test fun morning() {
        assertTrue(greet(hour = 8).lines.single() in listOf("Good morning, Meera.", "Morning. 3 minimums today.", "A fresh page."))
        // One minimum reads "1 minimum".
        val all = (0..6).map { greet(hour = 8, minimums = 1, date = day.plusDays(it.toLong()), lastOpen = day.plusDays(it - 1L)).lines.single() }
        assertTrue(all.none { it.contains("1 minimums") })
        assertTrue(all.any { it == "Morning. 1 minimum today." })
        // No minimums: never "0 minimums".
        assertTrue((0..6).none { greet(hour = 8, minimums = 0, date = day.plusDays(it.toLong()), lastOpen = day.plusDays(it - 1L)).lines.single().contains("minimum") })
    }

    @Test fun afternoonAndEvening() {
        assertTrue(greet(hour = 14).lines.single() in listOf("Good afternoon.", "Good afternoon, Meera."))
        assertTrue(greet(hour = 19).lines.single() in listOf("Good evening, Meera.", "Evening. Whenever you're ready."))
    }

    @Test fun lateNight() {
        assertTrue(greet(hour = 2).lines.single() in RaahiGreeting.LATE.map { it.text })
        assertTrue(greet(hour = 23).lines.single() in RaahiGreeting.LATE.map { it.text })
        assertTrue(greet(hour = 23, lateHour = 0).lines.single() in RaahiGreeting.EVENING.map { it.text.replace("{name}", "Meera") })
        assertTrue(greet(hour = 22, lateHour = 22).lines.single() in RaahiGreeting.LATE.map { it.text })
    }

    @Test fun backAfterTwoToSixDays() {
        (2..6).forEach { d -> assertTrue(greet(lastOpen = day.minusDays(d.toLong())).lines.single() in listOf("Welcome back, Meera.", "Good to see you.")) }
        assertEquals(RaahiPose.WAVING, greet(lastOpen = day.minusDays(3)).pose)
    }

    @Test fun backAfterSevenDaysNeverMentionsMissedDays() {
        (7..40).forEach { d ->
            val line = greet(lastOpen = day.minusDays(d.toLong())).lines.single()
            assertTrue(line in RaahiGreeting.AWAY_LONG.map { it.text })
            assertFalse(line.contains(Regex("\\d")))
        }
    }

    @Test fun afterWrapUp() {
        assertTrue(greet(hour = 22, dayClosed = true).lines.single() in listOf("Day closed. Rest well.", "That's today."))
    }

    @Test fun newDevice() {
        assertTrue(greet(newDevice = true).lines.single() in listOf("Welcome back, Meera. Your data is syncing.", "Welcome back. Your data is syncing."))
    }

    @Test fun offSaysNothing() {
        assertEquals(Greeting.NONE, greet(mode = RaahiMode.OFF))
        assertEquals(Greeting.NONE, greet(mode = RaahiMode.OFF, lastOpen = null, first = RaahiFirst.FIRST_WEEK))
    }

    @Test fun fullAddsASecondLineForFirstsQuietDoesNot() {
        assertEquals(2, greet(mode = RaahiMode.FULL, first = RaahiFirst.FIRST_DOCUMENT).lines.size)
        assertEquals(1, greet(mode = RaahiMode.QUIET, first = RaahiFirst.FIRST_DOCUMENT).lines.size)
        // Later open the same day in Full: only the first's line, with the small celebration pose.
        val later = greet(mode = RaahiMode.FULL, greetedToday = true, first = RaahiFirst.FIRST_WEEK)
        assertEquals(listOf(RaahiFirst.FIRST_WEEK.line), later.lines)
        assertEquals(RaahiPose.QUIET_CELEBRATION, later.pose)
    }

    @Test fun nameAtMostOnceADay() {
        (0..30).forEach { d ->
            val date = day.plusDays(d.toLong())
            val g = greet(nameUsedToday = true, date = date, lastOpen = date.minusDays(1), hour = listOf(8, 14, 19)[d % 3])
            assertFalse(g.lines.joinToString().contains("Meera"))
            assertFalse(g.usedName)
        }
        val named = (0..6).map { greet(date = day.plusDays(it.toLong()), lastOpen = day.plusDays(it - 1L), hour = 19) }.first { it.lines.single().contains("Meera") }
        assertTrue(named.usedName)
    }

    @Test fun blankNameNeverLeavesAGap() {
        (0..10).forEach { d ->
            val date = day.plusDays(d.toLong())
            listOf(8, 14, 19).forEach { h ->
                val line = greet(name = " ", date = date, lastOpen = date.minusDays(1), hour = h).lines.single()
                assertFalse(line, line.contains(", .") || line.contains("{"))
            }
        }
        assertNull(greet(name = "", lastOpen = day.minusDays(3), date = day).lines.singleOrNull()?.takeIf { it.contains(",  ") })
    }

    @Test fun sameDaySameLineAcrossOpens() {
        assertEquals(greet(hour = 9).lines, greet(hour = 10).lines)
    }

    @Test fun everyLineIsShortAndFreeOfGuiltWords() {
        val guilt = listOf("missed", "streak", "overdue", "late ", "behind", "failed", "forgot")
        RaahiGreeting.ALL.forEach { line ->
            val words = line.replace("{name}", "Meera").replace("{n}", "3").split(' ').size
            assertTrue("$line has $words words", words <= 12)
            guilt.forEach { g -> assertFalse("$line has $g", line.lowercase().contains(g)) }
        }
    }
}
