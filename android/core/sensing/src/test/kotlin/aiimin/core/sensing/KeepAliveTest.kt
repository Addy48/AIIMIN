package aiimin.core.sensing

import aiimin.core.sensing.logic.KeepAlive
import com.google.common.truth.Truth.assertThat
import org.junit.Test

class KeepAliveTest {
    @Test fun `each maker gets its own steps`() {
        assertThat(KeepAlive.steps("Xiaomi")).contains("Autostart")
        assertThat(KeepAlive.steps("POCO")).contains("Autostart")
        assertThat(KeepAlive.steps("samsung")).contains("Never sleeping apps")
        assertThat(KeepAlive.steps("OnePlus")).contains("Allow background activity")
        assertThat(KeepAlive.steps("vivo")).contains("Background power consumption")
        assertThat(KeepAlive.steps("Google")).contains("Unrestricted")
    }

    @Test fun `card shows only when a job stalled and the phone may be the cause`() {
        val day = 86_400_000L
        assertThat(KeepAlive.show(stalledAt = 0, needsKeepAlive = true, unrestricted = false, dismissedAt = null, now = 1)).isTrue()
        assertThat(KeepAlive.show(stalledAt = null, needsKeepAlive = true, unrestricted = false, dismissedAt = null, now = 1)).isFalse()
        assertThat(KeepAlive.show(stalledAt = 0, needsKeepAlive = true, unrestricted = false, dismissedAt = null, now = 2 * day)).isFalse() // old stall
        assertThat(KeepAlive.show(stalledAt = 0, needsKeepAlive = false, unrestricted = true, dismissedAt = null, now = 1)).isFalse()
        assertThat(KeepAlive.show(stalledAt = 0, needsKeepAlive = false, unrestricted = false, dismissedAt = null, now = 1)).isTrue()
        // dismissed: quiet for a week
        assertThat(KeepAlive.show(10 * day, true, false, dismissedAt = 8 * day, now = 10 * day + 1)).isFalse()
        assertThat(KeepAlive.show(10 * day, true, false, dismissedAt = 0, now = 10 * day + 1)).isTrue()
    }
}
