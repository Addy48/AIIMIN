package aiimin.core.data

import aiimin.core.data.prefs.InMemoryAppPreferences
import com.google.common.truth.Truth.assertThat
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.test.UnconfinedTestDispatcher
import kotlinx.coroutines.test.runTest
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class PrefsPersistenceTest {

    @Test
    fun `theme and reduce-motion survive a new ConfigStore on the same prefs`() = runTest {
        val prefs = InMemoryAppPreferences()
        val scope = CoroutineScope(UnconfinedTestDispatcher(testScheduler) + SupervisorJob())

        val first = ConfigStore(prefs, scope)
        first.toggleTheme()
        first.toggleReduceMotion()
        assertThat(first.state.value.darkTheme).isFalse()
        assertThat(first.state.value.reduceMotion).isTrue()

        val second = ConfigStore(prefs, scope)
        assertThat(second.state.value.darkTheme).isFalse()
        assertThat(second.state.value.reduceMotion).isTrue()
    }

    @Test
    fun `calibration identity survives a new ConfigStore on the same prefs`() = runTest {
        val prefs = InMemoryAppPreferences()
        val scope = CoroutineScope(UnconfinedTestDispatcher(testScheduler) + SupervisorJob())

        val first = ConfigStore(prefs, scope)
        first.applyCalibration(osId = "ADIT2K04", arc = "Ship V3.", minimumsCount = 4)
        assertThat(first.state.value.isSeed).isFalse()

        val second = ConfigStore(prefs, scope)
        assertThat(second.state.value.identity.osId).isEqualTo("ADIT2K04")
        assertThat(second.state.value.identity.arc).isEqualTo("Ship V3.")
        assertThat(second.state.value.minimumsLabel).isEqualTo("4 set")
        assertThat(second.state.value.isSeed).isFalse()
    }

    @Test
    fun `onboarding completed gate survives a new OnboardingStore on the same prefs`() = runTest {
        val prefs = InMemoryAppPreferences()
        val scope = CoroutineScope(UnconfinedTestDispatcher(testScheduler) + SupervisorJob())
        val config = ConfigStore(prefs, scope)
        val day = DayStore()

        val first = OnboardingStore(config, day, prefs, scope)
        first.replay()
        assertThat(first.state.value.completed).isFalse()

        val second = OnboardingStore(config, day, prefs, scope)
        assertThat(second.state.value.completed).isFalse()

        second.setAgeConfirmed(true)
        second.skipToShell()
        val third = OnboardingStore(config, day, prefs, scope)
        assertThat(third.state.value.completed).isTrue()
    }
}
