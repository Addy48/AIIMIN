package aiimin.feature.onboarding

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class OsIdInputTest {
    @Test fun `an OS-ID typed in small letters becomes capitals`() {
        assertThat(osIdOrEmail("meer2004")).isEqualTo("MEER2004")
        assertThat(osIdOrEmail("Meer 2004")).isEqualTo("MEER2004")
    }

    @Test fun `an email is left as typed`() {
        assertThat(osIdOrEmail("meera@mail.com ")).isEqualTo("meera@mail.com")
    }
}
