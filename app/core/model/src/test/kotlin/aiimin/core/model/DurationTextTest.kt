package aiimin.core.model

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class DurationTextTest {
    private val m = 60_000L

    @Test fun `reads the ways people write a screen time`() {
        assertThat(DurationText.parseMs("1h 31m")).isEqualTo(91 * m)
        assertThat(DurationText.parseMs("1 hr, 31 min")).isEqualTo(91 * m)
        assertThat(DurationText.parseMs("2 hours")).isEqualTo(120 * m)
        assertThat(DurationText.parseMs("45 min")).isEqualTo(45 * m)
        assertThat(DurationText.parseMs("1:31")).isEqualTo(91 * m)
        assertThat(DurationText.parseMs("95")).isEqualTo(95 * m)
    }

    @Test fun `rejects nonsense`() {
        assertThat(DurationText.parseMs("")).isNull()
        assertThat(DurationText.parseMs("lots")).isNull()
        assertThat(DurationText.parseMs("30h")).isNull() // more than a day
    }
}
