package aiimin.core.data

import aiimin.core.data.money.SmsPeriods
import aiimin.core.data.money.SmsYearRun
import com.google.common.truth.Truth.assertThat
import java.time.YearMonth
import org.junit.Test

class SmsPeriodsTest {
    private val now = YearMonth.of(2026, 10)

    @Test fun `recent months run newest first`() {
        val m = SmsPeriods.recentMonths(now, 12)
        assertThat(m.first()).isEqualTo(now)
        assertThat(m.last()).isEqualTo(YearMonth.of(2025, 11))
        assertThat(m).hasSize(12)
    }

    @Test fun `the last 12 months are worked through oldest first, ending this month`() {
        val m = SmsPeriods.yearMonths(null, now)
        assertThat(m.first()).isEqualTo(YearMonth.of(2025, 11))
        assertThat(m.last()).isEqualTo(now)
        assertThat(m).hasSize(12)
    }

    @Test fun `a calendar year is January to December, and this year stops at this month`() {
        assertThat(SmsPeriods.yearMonths(2025, now)).containsExactlyElementsIn((1..12).map { YearMonth.of(2025, it) }).inOrder()
        assertThat(SmsPeriods.yearMonths(2026, now)).hasSize(10)
        assertThat(SmsPeriods.yearMonths(2027, now)).isEmpty()
    }

    @Test fun `year labels say what is covered`() {
        assertThat(SmsPeriods.yearLabel(null, now)).isEqualTo("the last 12 months")
        assertThat(SmsPeriods.yearLabel(2025, now)).isEqualTo("2025")
        assertThat(SmsPeriods.yearLabel(2026, now)).isEqualTo("2026 so far")
    }

    @Test fun `month names drop the year only when it is this year`() {
        assertThat(SmsPeriods.monthName(YearMonth.of(2026, 3), now)).isEqualTo("March")
        assertThat(SmsPeriods.monthName(YearMonth.of(2025, 12), now)).isEqualTo("December 2025")
    }

    @Test fun `a year run reports progress in plain words`() {
        val run = SmsYearRun("2025", (5..12).map { YearMonth.of(2025, it) }, total = 12, added = 120, skipped = 40)
        assertThat(run.doneMonths).isEqualTo(4)
        assertThat(run.progressLine()).isEqualTo("4 of 12 months read · 120 payments found")
        assertThat(run.finished).isFalse()
        val done = run.copy(remaining = emptyList(), added = 214)
        assertThat(done.finished).isTrue()
        assertThat(done.doneLine()).isEqualTo("Done reading 2025: 214 payments are waiting in Review")
        assertThat(done.copy(added = 1).doneLine()).isEqualTo("Done reading 2025: 1 payment is waiting in Review")
        assertThat(done.copy(added = 0).doneLine()).isEqualTo("Done reading 2025: no new payments found")
    }

    @Test fun `a year run survives being saved and read back`() {
        val run = SmsYearRun("the last 12 months", listOf(YearMonth.of(2026, 9), YearMonth.of(2026, 10)), 12, 7, 3, stopped = true)
        assertThat(SmsYearRun.decode(run.encode())).isEqualTo(run)
        assertThat(SmsYearRun.decode(null)).isNull()
        assertThat(SmsYearRun.decode("nonsense")).isNull()
    }
}
