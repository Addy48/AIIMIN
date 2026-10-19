package aiimin.core.data

import aiimin.core.data.app.withName
import com.google.common.truth.Truth.assertThat
import org.junit.Test

class ActivityNameTest {
    @Test fun `a row names what it was about`() =
        assertThat(withName("Added a task", "Buy milk and eggs")).isEqualTo("Added a task · Buy milk and eggs")

    @Test fun `no name keeps the plain row`() = assertThat(withName("Wrote a note", " ")).isEqualTo("Wrote a note")

    @Test fun `long names are cut with an ellipsis`() =
        assertThat(withName("Wrote a note", "a".repeat(60))).isEqualTo("Wrote a note · " + "a".repeat(39) + "…")
}
