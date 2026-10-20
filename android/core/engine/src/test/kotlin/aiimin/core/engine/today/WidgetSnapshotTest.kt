package aiimin.core.engine.today

import aiimin.core.engine.raahi.RaahiMode
import com.google.common.truth.Truth.assertThat
import org.junit.Test
import java.time.LocalTime

/** PRD 1.4: the widget's snapshot. Titles hidden by default; no money, bill or vault text ever. */
class WidgetSnapshotTest {
    private val wake = LocalTime.of(7, 0)
    private val end = LocalTime.of(22, 0)
    private fun snap(l: NowLine, titles: Boolean = false, mode: RaahiMode = RaahiMode.QUIET, now: LocalTime = LocalTime.of(14, 30)) =
        WidgetSnapshot.of(l, 3, 5, listOf(true, true, true, false, false), titles, mode, now, wake, end, clock24 = true)

    @Test fun `titles hidden shows only times and counts`() {
        assertThat(snap(NowLine(NowKind.SOON, title = "Call Ravi", at = LocalTime.of(15, 0))).line).isEqualTo("1 task at 15:00")
        assertThat(snap(NowLine(NowKind.SOON, title = "Dentist", at = LocalTime.of(15, 0), isEvent = true, happeningNow = true)).line).isEqualTo("1 event now")
        assertThat(snap(NowLine(NowKind.TASK, title = "Renew passport")).line).isEqualTo("1 task up next")
        assertThat(snap(NowLine(NowKind.MINIMUM, title = "Walk", count = 2)).line).isEqualTo("2 minimums left")
        assertThat(snap(NowLine(NowKind.FOCUS, title = "Essay", minutesLeft = 12)).line).isEqualTo("Focus · 12 min left")
    }

    @Test fun `titles shown match Today's line`() {
        val l = NowLine(NowKind.SOON, title = "Call Ravi", at = LocalTime.of(15, 0))
        assertThat(snap(l, titles = true).line).isEqualTo(WhatNowText.line(l, true))
    }

    @Test fun `a bill never shows its name or amount, even with titles on`() {
        for (titles in listOf(true, false)) {
            val v = snap(NowLine(NowKind.BILL, title = "HDFC card", amountPaise = 1_234_500, count = 1), titles)
            assertThat(v.line).isEqualTo("A bill is due today")
            assertThat(v.line).doesNotContain("₹")
            assertThat(v.line).doesNotContain("HDFC")
        }
    }

    @Test fun `minimums read as a count and the sun sits on the waking day`() {
        val v = snap(NowLine(NowKind.CLEAR))
        assertThat(v.minimums).isEqualTo("3 of 5 minimums")
        assertThat(v.segments).containsExactly(true, true, true, false, false).inOrder()
        assertThat(v.sun).isWithin(0.001f).of(7.5f / 15f)
        assertThat(v.night).isFalse()
        val late = snap(NowLine(NowKind.CLEAR), now = LocalTime.of(23, 30))
        assertThat(late.night).isTrue()
        assertThat(late.sun).isEqualTo(1f)
    }

    @Test fun `Raahi shows in Quiet and Full, never in Off, and sits at sunset after day end`() {
        assertThat(snap(NowLine(NowKind.CLEAR), mode = RaahiMode.OFF).raahi).isNull()
        assertThat(snap(NowLine(NowKind.CLEAR), mode = RaahiMode.FULL).raahi).isEqualTo(WidgetRaahi.DAY)
        assertThat(snap(NowLine(NowKind.CLEAR), now = LocalTime.of(22, 30)).raahi).isEqualTo(WidgetRaahi.EVENING)
    }

    @Test fun `no minimums planned leaves the count empty`() {
        assertThat(WidgetSnapshot.of(NowLine(NowKind.CLEAR), 0, 0, emptyList(), false, RaahiMode.QUIET, LocalTime.NOON, wake, end, false).minimums).isEmpty()
    }
}
