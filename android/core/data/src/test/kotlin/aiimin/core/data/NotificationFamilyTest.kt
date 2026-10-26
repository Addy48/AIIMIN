package aiimin.core.data

import aiimin.core.data.notify.family
import com.google.common.truth.Truth.assertThat
import org.junit.Test

class NotificationFamilyTest {
    @Test fun `daily keys share a family, others stand alone`() {
        assertThat(family("inbox:2026-10-17")).isEqualTo("inbox:")
        assertThat(family("inbox:2026-10-16")).isEqualTo("inbox:")
        assertThat(family("task:abc:2026-10-17")).isEqualTo("task:abc:")
        assertThat(family("doc:xyz:30")).isEqualTo("doc:xyz:30")
        assertThat(family("event:e1")).isEqualTo("event:e1")
    }

    @Test fun `weekly review cards share a family (D-045)`() {
        assertThat(family("review:2026-W42")).isEqualTo("review:")
        assertThat(family("review:2026-W43")).isEqualTo("review:")
        assertThat(family("review:42")).isEqualTo("review:")
    }
}
