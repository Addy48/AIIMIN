package aiimin.core.data

import aiimin.core.data.notify.streakNudgeBody
import com.google.common.truth.Truth.assertThat
import org.junit.Test

class StreakNudgeTest {
    @Test fun `no streak yet invites starting one`() =
        assertThat(streakNudgeBody(left = 3, streak = 0)).isEqualTo("Keep them today to start a streak.")

    @Test fun `a running streak carries on`() =
        assertThat(streakNudgeBody(left = 3, streak = 28)).isEqualTo("Keep them and your 28-day streak carries on.")

    @Test fun `one minimum left is it`() =
        assertThat(streakNudgeBody(left = 1, streak = 1)).isEqualTo("Keep it and your 1-day streak carries on.")
}
