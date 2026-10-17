package aiimin.core.model

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class ScreenSummaryTest {
    private val m = 60_000L

    @Test fun `other apps row makes the list add up to the total`() {
        val s = ScreenSummary.of(totalMs = 100 * m, personalMs = 100 * m, appMs = listOf(50 * m, 30 * m, 10 * m, 5 * m, 5 * m), shown = 3)
        assertThat(s.otherMs).isEqualTo(10 * m)
    }

    @Test fun `overlap never makes other negative`() {
        val s = ScreenSummary.of(totalMs = 60 * m, personalMs = 60 * m, appMs = listOf(40 * m, 40 * m), shown = 2)
        assertThat(s.otherMs).isEqualTo(0)
    }

    @Test fun `counted line appears only when work apps change the number`() {
        assertThat(ScreenSummary.of(100 * m, 100 * m, emptyList(), 0).countedLine).isNull()
        assertThat(ScreenSummary.of(100 * m, 70 * m, emptyList(), 0).countedLine).isEqualTo("1h 10m counted · 30m work")
    }

    @Test fun `pickups prefer unlocks on a secure phone and screen-ons otherwise`() {
        assertThat(ScreenSummary.pickups(secure = true, unlocks = 41, screenOns = 60)).isEqualTo(41 to "unlocks")
        assertThat(ScreenSummary.pickups(secure = false, unlocks = 0, screenOns = 60)).isEqualTo(60 to "pickups")
    }

    @Test fun `format covers each range`() {
        assertThat(ScreenSummary.fmt(30_000)).isEqualTo("<1m")
        assertThat(ScreenSummary.fmt(45 * m)).isEqualTo("45m")
        assertThat(ScreenSummary.fmt(120 * m)).isEqualTo("2h")
        assertThat(ScreenSummary.fmt(135 * m)).isEqualTo("2h 15m")
    }
}
