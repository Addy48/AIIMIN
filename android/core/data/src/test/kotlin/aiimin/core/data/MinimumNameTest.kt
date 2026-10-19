package aiimin.core.data

import aiimin.core.data.plan.sameMinimumName
import com.google.common.truth.Truth.assertThat
import org.junit.Test

class MinimumNameTest {
    @Test fun `case and spacing do not make a new minimum`() =
        assertThat(sameMinimumName("Walk 20 minutes", "  walk  20 Minutes ")).isTrue()

    @Test fun `different habits stay different`() =
        assertThat(sameMinimumName("Walk 20 minutes", "Walk 30 minutes")).isFalse()

    @Test fun `blank never matches`() = assertThat(sameMinimumName("", " ")).isFalse()
}
