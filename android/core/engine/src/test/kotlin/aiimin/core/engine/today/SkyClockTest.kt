package aiimin.core.engine.today

import com.google.common.truth.Truth.assertThat
import org.junit.Test
import java.time.LocalDate
import java.time.LocalTime
import java.time.ZoneId

/** PRD 1.3: the living sky follows the real sun for the phone's zone, with no location and no network. */
class SkyClockTest {
    private val ist = ZoneId.of("Asia/Kolkata")
    private val delhi = SkyPlace(28.6, 77.2)

    @Test fun `Delhi in December at 06 45 is pre-dawn, in June it is morning light`() {
        val dec = SkyClock.sun(LocalDate.of(2026, 12, 15), ist, delhi)
        assertThat(SkyClock.now(LocalTime.of(6, 45), dec).dominant).isEqualTo(SkyPhase.PRE_DAWN)
        val jun = SkyClock.sun(LocalDate.of(2026, 6, 15), ist, delhi)
        assertThat(SkyClock.now(LocalTime.of(6, 45), jun).dominant).isEqualTo(SkyPhase.MORNING)
        assertThat(jun.fallback).isFalse()
    }

    @Test fun `sunrise and sunset in Delhi are within half an hour of the almanac`() {
        val jun = SkyClock.sun(LocalDate.of(2026, 6, 21), ist, delhi)
        assertThat(jun.sunrise.toSecondOfDay() / 60).isIn(5 * 60 + 5..5 * 60 + 45)   // ~05:24
        assertThat(jun.sunset.toSecondOfDay() / 60).isIn(19 * 60..19 * 60 + 40)      // ~19:22
    }

    @Test fun `the zone alone gives a usable sun for India and London`() {
        val ind = SkyClock.sun(LocalDate.of(2026, 10, 22), ist)
        assertThat(ind.fallback).isFalse()
        assertThat(ind.noon.hour).isEqualTo(11)
        val ldn = SkyClock.sun(LocalDate.of(2026, 10, 22), ZoneId.of("Europe/London"))
        assertThat(ldn.sunrise.hour).isEqualTo(7)
    }

    @Test fun `a place that cannot match the zone falls back to fixed hours`() {
        assertThat(SkyClock.sun(LocalDate.of(2026, 10, 22), ist, SkyPlace(40.7, -74.0)).fallback).isTrue()
        // polar night in Tromso-like latitude
        assertThat(SkyClock.sun(LocalDate.of(2026, 12, 21), ZoneId.of("Europe/Oslo"), SkyPlace(78.0, 15.0)).fallback).isTrue()
    }

    @Test fun `light comes from the left at dawn, the middle at noon, the right at dusk, and night is night`() {
        val s = SkyClock.sun(LocalDate.of(2026, 10, 22), ist)
        assertThat(SkyClock.now(s.sunrise.plusMinutes(10), s).lightX).isLessThan(0.3f)
        assertThat(SkyClock.now(s.noon, s).lightX).isWithin(0.08f).of(0.5f)
        assertThat(SkyClock.now(s.sunset.minusMinutes(5), s).lightX).isGreaterThan(0.75f)
        val late = SkyClock.now(LocalTime.of(1, 12), s)
        assertThat(late.night).isTrue()
        assertThat(late.dominant).isEqualTo(SkyPhase.NIGHT)
        assertThat(SkyClock.now(s.noon, s).dominant).isEqualTo(SkyPhase.MIDDAY)
    }

    @Test fun `keyframes are in order through the day`() {
        val k = SkyClock.keyframes(SkyClock.sun(LocalDate.of(2026, 10, 22), ist)).map { it.second }
        assertThat(k).containsExactly(SkyPhase.PRE_DAWN, SkyPhase.DAWN, SkyPhase.MORNING, SkyPhase.MIDDAY, SkyPhase.GOLDEN, SkyPhase.DUSK, SkyPhase.NIGHT).inOrder()
    }
}
