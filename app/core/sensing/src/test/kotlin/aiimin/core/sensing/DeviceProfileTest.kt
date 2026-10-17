package aiimin.core.sensing

import aiimin.core.sensing.logic.DeviceFacts
import aiimin.core.sensing.logic.DeviceProfile
import aiimin.core.sensing.logic.ScreenStrategy
import aiimin.core.sensing.logic.StepStrategy
import com.google.common.truth.Truth.assertThat
import org.junit.Test

class DeviceProfileTest {
    private fun p(maker: String, hc: Boolean = true, sensor: Boolean = true, apps: Set<String> = emptySet()) =
        DeviceProfile.pick(DeviceFacts(maker, sdk = 35, healthConnect = hc, stepSensor = sensor, healthApps = apps, secureLock = true))

    @Test fun `samsung and xiaomi get gap fill`() {
        assertThat(p("samsung").screen).isEqualTo(ScreenStrategy.EVENTS_WITH_GAP_FILL)
        assertThat(p("Xiaomi").screen).isEqualTo(ScreenStrategy.EVENTS_WITH_GAP_FILL)
        assertThat(p("Google").screen).isEqualTo(ScreenStrategy.EVENTS)
        assertThat(p("Nothing").screen).isEqualTo(ScreenStrategy.EVENTS)
    }

    @Test fun `steps prefer health connect, then sensor, then nothing`() {
        assertThat(p("Nothing").steps).isEqualTo(StepStrategy.HEALTH_CONNECT_AGGREGATE)
        assertThat(p("Nothing", hc = false).steps).isEqualTo(StepStrategy.PHONE_SENSOR)
        assertThat(p("Nothing", hc = false, sensor = false).steps).isEqualTo(StepStrategy.UNAVAILABLE)
    }

    @Test fun `preferred origin follows installed health apps`() {
        assertThat(p("samsung", apps = setOf("com.sec.android.app.shealth", "com.google.android.apps.fitness")).preferredOrigin).isEqualTo("com.sec.android.app.shealth")
        assertThat(p("Google", apps = setOf("com.google.android.apps.fitness")).preferredOrigin).isEqualTo("com.google.android.apps.fitness")
        assertThat(p("Google").preferredOrigin).isNull()
    }

    @Test fun `aggressive background killers need keep-alive help`() {
        assertThat(p("Xiaomi").needsKeepAlive).isTrue()
        assertThat(p("OnePlus").needsKeepAlive).isTrue()
        assertThat(p("Google").needsKeepAlive).isFalse()
    }

    @Test fun `calibration keeps the strategy closer to what the phone says`() {
        assertThat(DeviceProfile.chooseByCalibration(eventsMs = 100, altMs = 140, userMs = 135)).isEqualTo(ScreenStrategy.EVENTS_WITH_GAP_FILL)
        assertThat(DeviceProfile.chooseByCalibration(eventsMs = 100, altMs = 80, userMs = 102)).isEqualTo(ScreenStrategy.EVENTS)
        // within 10 %: keep plain events, never flip on noise
        assertThat(DeviceProfile.chooseByCalibration(eventsMs = 100, altMs = 104, userMs = 105)).isEqualTo(ScreenStrategy.EVENTS)
    }
}
