package aiimin.core.data.device

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class WalkInsightTest {

    @Test
    fun labels_match_clock_and_intensity() {
        assertThat(labelWalk(8, 1_200, 20)).contains("college")
        assertThat(labelWalk(13, 800, 15)).isEqualTo("Lunch walk")
        assertThat(labelWalk(18, 600, 12)).isEqualTo("Before dinner walk")
        assertThat(labelWalk(19, 700, 14)).isEqualTo("After dinner walk")
        assertThat(labelWalk(19, 2_800, 45)).startsWith("Gym")
    }

    @Test
    fun compose_interrelates_lunch_and_screen() {
        val lines = composeLines(
            steps = 7_200L,
            screenMs = 5L * 60 * 60 * 1000,
            unlocks = 55,
            apps = listOf(AppUse("com.instagram.android", "Instagram", 3L * 60 * 60 * 1000)),
            walks = listOf(
                WalkBout(
                    startMs = System.currentTimeMillis() - 3_600_000,
                    endMs = System.currentTimeMillis() - 3_000_000,
                    steps = 900,
                    label = "Lunch walk",
                ),
            ),
        )
        assertThat(lines.any { it.contains("Lunch walk") }).isTrue()
        assertThat(lines.any { it.contains("Instagram") }).isTrue()
    }
}
