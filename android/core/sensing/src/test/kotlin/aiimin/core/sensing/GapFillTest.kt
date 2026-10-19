package aiimin.core.sensing

import aiimin.core.sensing.logic.GapFill
import aiimin.core.sensing.logic.UsageTimeline
import aiimin.core.sensing.logic.UsageTimeline.Event
import aiimin.core.sensing.logic.UsageTimeline.Kind
import com.google.common.truth.Truth.assertThat
import org.junit.Test

class GapFillTest {
    private val m = 60_000L

    @Test fun `a session with no interaction for 30 minutes is cut at the last interaction plus 30`() {
        assertThat(GapFill.cap(sessionStart = 0, sessionEnd = 120 * m, interactions = listOf(5 * m, 20 * m), limitMs = 30 * m)).isEqualTo(50 * m)
    }

    @Test fun `active sessions are untouched`() {
        assertThat(GapFill.cap(0, 60 * m, listOf(10 * m, 35 * m, 58 * m), 30 * m)).isEqualTo(60 * m)
    }

    @Test fun `a lost pause on a samsung-style stream no longer counts two hours`() {
        val events = listOf(
            Event(10 * m, Kind.RESUMED, "yt", "Main"),
            Event(12 * m, Kind.INTERACTION, "yt"),
            // pause dropped; next sign of anything is another app 2 h later
            Event(130 * m, Kind.RESUMED, "chat", "A"),
            Event(135 * m, Kind.PAUSED, "chat", "A"),
        )
        fun run(gap: Long?) = UsageTimeline.compute(
            events = events, windowStart = 0, windowEnd = 24 * 60 * m, counted = { true },
            hourStart = { it - Math.floorMod(it, 3_600_000L) }, gapFillMs = gap,
        )
        assertThat(run(null).apps.first { it.pkg == "yt" }.ms).isEqualTo(120 * m)
        assertThat(run(30 * m).apps.first { it.pkg == "yt" }.ms).isEqualTo(32 * m)
    }
}
