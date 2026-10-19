package aiimin.core.data

import aiimin.core.data.util.Dates
import com.google.common.truth.Truth.assertThat
import org.junit.Test

class DatesTest {
    private val now = 10_000_000_000L

    @Test fun `ago covers each range`() {
        assertThat(Dates.ago(now - 20_000, now)).isEqualTo("just now")
        assertThat(Dates.ago(now - 12 * 60_000, now)).isEqualTo("12 min ago")
        assertThat(Dates.ago(now - 185 * 60_000, now)).isEqualTo("3 h ago")
    }
}
