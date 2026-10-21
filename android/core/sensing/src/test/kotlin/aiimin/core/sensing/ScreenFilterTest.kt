package aiimin.core.sensing

import aiimin.core.sensing.logic.KeepAlive
import aiimin.core.sensing.logic.ScreenFilter
import aiimin.core.sensing.logic.UsageTimeline
import aiimin.core.sensing.logic.UsageTimeline.Event
import aiimin.core.sensing.logic.UsageTimeline.Kind
import com.google.common.truth.Truth.assertThat
import org.junit.Test

/** PRD 3.3 and 4.3: screensavers and always-on displays never count; the maker card shows once per maker. */
class ScreenFilterTest {
    private val min = 60_000L

    @Test fun `a screensaver that comes to the front while charging is not screen time`() {
        val ev = listOf(
            Event(0, Kind.SCREEN_ON), Event(0, Kind.RESUMED, "com.whatsapp", "Main"),
            Event(10 * min, Kind.PAUSED, "com.whatsapp", "Main"),
            Event(10 * min, Kind.RESUMED, "com.samsung.android.app.screensaver", "Dream"),
            Event(70 * min, Kind.PAUSED, "com.samsung.android.app.screensaver", "Dream"),
            Event(70 * min, Kind.RESUMED, "com.miui.aod", "Aod"), Event(90 * min, Kind.SCREEN_OFF),
        )
        val r = UsageTimeline.compute(ev, 0, 100 * min, counted = { ScreenFilter.counts(it, emptySet()) }, hourStart = { it - it % (60 * min) })
        assertThat(r.totalMs).isEqualTo(10 * min)
        assertThat(r.apps.map { it.pkg }).containsExactly("com.whatsapp")
    }

    @Test fun `checked only within 5 percent`() {
        assertThat(ScreenFilter.checked(1.04)).isTrue()
        assertThat(ScreenFilter.checked(0.95)).isTrue()
        assertThat(ScreenFilter.checked(1.06)).isFalse()
        assertThat(ScreenFilter.checked(null)).isFalse()
    }

    @Test fun `the keep-running card shows once per maker, only on makers that stop apps`() {
        assertThat(KeepAlive.intro("Xiaomi", needsKeepAlive = true, unrestricted = false, shownFor = null)).isTrue()
        assertThat(KeepAlive.intro("Xiaomi", true, false, shownFor = "xiaomi")).isFalse()
        // spoofed: the same app moved to a Vivo phone sees the Vivo card once
        assertThat(KeepAlive.intro("vivo", true, false, shownFor = "xiaomi")).isTrue()
        assertThat(KeepAlive.intro("Google", needsKeepAlive = false, unrestricted = false, shownFor = null)).isFalse()
        assertThat(KeepAlive.intro("Samsung", true, unrestricted = true, shownFor = null)).isFalse()
    }
}
