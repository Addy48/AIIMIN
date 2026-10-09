package aiimin.core.data.session

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class BiometricUnlockTest {

    @Test
    fun `plate prefers valid OS-ID over email label`() {
        assertThat(BiometricUnlock.plate("aadi2004", null)).isEqualTo("AADI2004")
        assertThat(BiometricUnlock.plate("me@aiimin.in", "ADIT2K04")).isEqualTo("ADIT2K04")
        assertThat(BiometricUnlock.plate("me@aiimin.in", null)).isNull()
        assertThat(BiometricUnlock.plate(null, "BAD")).isNull()
    }

    @Test
    fun `direct unlock needs flag session and plate`() {
        assertThat(BiometricUnlock.canDirectUnlock(true, true, "AADI2004")).isTrue()
        assertThat(BiometricUnlock.canDirectUnlock(false, true, "AADI2004")).isFalse()
        assertThat(BiometricUnlock.canDirectUnlock(true, false, "AADI2004")).isFalse()
        assertThat(BiometricUnlock.canDirectUnlock(true, true, null)).isFalse()
    }
}
