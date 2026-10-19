package aiimin.core.model

import com.google.common.truth.Truth.assertThat
import kotlin.test.Test

/**
 * The other complaint, pinned:
 *
 * > "I didn't masturbate for 10 days, but 1 day I did, so the streak breaks and
 * > the system says u failed."
 *
 * Ten days of evidence must survive one event.
 */
class HoldTest {

    private fun holdAfter(days: Int, attainment: Double = 1.0, from: Hold = Hold.seed()): Hold =
        (1..days).fold(from) { hold, _ -> hold.advance(attainment) }

    @Test
    fun `ten clean days then one slip drops the number without erasing the ten`() {
        val clean = holdAfter(10)
        assertThat(clean.value).isGreaterThan(0.95)
        assertThat(clean.currentRun).isEqualTo(10)

        val afterSlip = clean.advance(0.0, incidentToday = 1)

        // Drops proportionally — nowhere near zero.
        assertThat(afterSlip.value).isGreaterThan(0.78)
        assertThat(afterSlip.value).isLessThan(clean.value)
        // The run is a fact and resets; the record is a record and does not.
        assertThat(afterSlip.currentRun).isEqualTo(0)
        assertThat(afterSlip.bestRun).isEqualTo(10)
        assertThat(afterSlip.rateLabel()).isEqualTo("1 in 30 days")
    }

    @Test
    fun `the way back is short and computable`() {
        val afterSlip = holdAfter(10).advance(0.0, incidentToday = 1)
        val days = afterSlip.daysToReach(target = 0.93)
        assertThat(days).isAtMost(4)
        assertThat(days).isAtLeast(1)

        val recovered = holdAfter(days, from = afterSlip)
        assertThat(recovered.value).isAtLeast(0.93)
    }

    @Test
    fun `a best run is never lost`() {
        val long = holdAfter(30)
        val broken = long.advance(0.0)
        val rebuilt = holdAfter(5, from = broken)
        assertThat(rebuilt.bestRun).isEqualTo(30)
        assertThat(rebuilt.currentRun).isEqualTo(5)
    }

    @Test
    fun `a day not logged does not count as a bad day`() {
        val clean = holdAfter(10)
        val skipped = clean.advance(null)
        assertThat(skipped.value).isEqualTo(clean.value)
        assertThat(skipped.currentRun).isEqualTo(clean.currentRun)
    }

    @Test
    fun `near-enough days keep the run alive`() {
        // 12,990 of 13,000 steps — the run must not break on a rounding error.
        val attainment = Attainment.more(12_990.0, 13_000.0)
        val hold = holdAfter(5).advance(attainment)
        assertThat(hold.currentRun).isEqualTo(6)
    }

    @Test
    fun `a hold is honest about being young`() {
        assertThat(holdAfter(3).mature).isFalse()
        assertThat(holdAfter(14).mature).isTrue()
    }

    @Test
    fun `the first observed day seeds instead of starting from zero`() {
        // Otherwise every commitment would look catastrophic on day one.
        val firstDay = Hold.seed().advance(1.0)
        assertThat(firstDay.value).isEqualTo(1.0)
    }
}
