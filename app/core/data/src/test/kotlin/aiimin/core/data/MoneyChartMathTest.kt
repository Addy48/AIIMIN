package aiimin.core.data

import aiimin.core.data.money.MoneyChartMath
import com.google.common.truth.Truth.assertThat
import org.junit.Test

class MoneyChartMathTest {

    @Test fun `cumulative ends at the total`() {
        val days = listOf(100L, 0L, 250L, 50L)
        assertThat(MoneyChartMath.cumulative(days)).containsExactly(100L, 100L, 350L, 400L).inOrder()
    }

    @Test fun `pace climbs evenly from zero to the plan on the last day`() {
        val p = MoneyChartMath.pace(planPaise = 3_000, days = 30)
        assertThat(p.size).isEqualTo(30)
        assertThat(p.first()).isEqualTo(100)
        assertThat(p[14]).isEqualTo(1_500)
        assertThat(p.last()).isEqualTo(3_000)
    }

    @Test fun `projection matches the likely-to-land card`() {
        // spent 18,420 by day 15 of 31, typical day 1,000 → 16 days left at 0.8× and 1.2×
        val (low, high) = MoneyChartMath.projection(spentPaise = 18_420, typicalDayPaise = 1_000, elapsedDays = 15, daysLeft = 16)
        assertThat(low).isEqualTo(18_420 + 12_800)
        assertThat(high).isEqualTo(18_420 + 19_200)
    }

    @Test fun `projection falls back to the running average when there is no typical day`() {
        val (low, high) = MoneyChartMath.projection(spentPaise = 1_500, typicalDayPaise = 0, elapsedDays = 3, daysLeft = 10)
        assertThat(low).isEqualTo(1_500 + 4_000)
        assertThat(high).isEqualTo(1_500 + 6_000)
    }

    @Test fun `only a real outlier gets a label`() {
        assertThat(MoneyChartMath.spike(listOf(100L, 120L, 900L, 90L, 110L))).isEqualTo(2)
        assertThat(MoneyChartMath.spike(listOf(100L, 120L, 200L, 90L, 110L))).isNull()
        assertThat(MoneyChartMath.spike(listOf(0L, 0L, 0L))).isNull()
        assertThat(MoneyChartMath.spike(listOf(500L))).isNull()
    }

    @Test fun `over pace marks the days spending ran ahead of the plan`() {
        val over = MoneyChartMath.overPace(cumulative = listOf(50L, 250L, 280L), pace = listOf(100L, 200L, 300L))
        assertThat(over).containsExactly(false, true, false).inOrder()
    }

    @Test fun `a range whose ends match is said once`() =
        assertThat(MoneyChartMath.rangeLabel(40_000, 40_000)).isEqualTo("₹400")

    @Test fun `a real range keeps both ends`() =
        assertThat(MoneyChartMath.rangeLabel(40_000, 60_000)).isEqualTo("₹400 – ₹600")

    @Test fun `the separator can be words`() =
        assertThat(MoneyChartMath.rangeLabel(40_000, 60_000, sep = " to ")).isEqualTo("₹400 to ₹600")
}
