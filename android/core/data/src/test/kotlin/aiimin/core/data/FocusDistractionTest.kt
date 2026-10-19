package aiimin.core.data

import aiimin.core.data.plan.FocusRepository
import com.google.common.truth.Truth.assertThat
import org.junit.Test

class FocusDistractionTest {
    private val m = 60_000L

    @Test fun `calls, AIIMIN and allowed apps are not distraction`() {
        val apps = listOf("in.aiimin.app" to 30 * m, "com.google.android.dialer" to 8 * m, "spotify" to 20 * m, "instagram" to 5 * m)
        assertThat(FocusRepository.distractedMinutes(apps, "in.aiimin.app", setOf("spotify"))).isEqualTo(5)
    }

    @Test fun `without allowed apps everything else counts`() {
        val apps = listOf("spotify" to 20 * m, "instagram" to 5 * m)
        assertThat(FocusRepository.distractedMinutes(apps, "in.aiimin.app", emptySet())).isEqualTo(25)
    }
}
