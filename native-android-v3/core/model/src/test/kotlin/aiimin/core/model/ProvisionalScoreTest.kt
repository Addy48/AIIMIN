package aiimin.core.model

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class ProvisionalScoreTest {

    @Test
    fun `seed rails and mid rung match drafting table ballpark`() {
        // mins 3, rails 85/70/55 avg 70, rung 3 → ~76
        val score = ProvisionalScore.compute(
            minsDone = 3,
            rails = listOf(85, 70, 55),
            rung = 3,
        )
        assertThat(score).isEqualTo(76)
    }

    @Test
    fun `strong rails and top rung lift the figure`() {
        val score = ProvisionalScore.compute(5, listOf(100, 100, 100), 5)
        assertThat(score).isGreaterThan(80)
    }

    @Test
    fun `bump wraps at ceiling`() {
        assertThat(ProvisionalScore.bumpRail(100)).isEqualTo(40)
        assertThat(ProvisionalScore.bumpRail(85)).isEqualTo(90)
    }

    @Test
    fun `delta and mins penalty labels`() {
        assertThat(ProvisionalScore.deltaLabel(80)).isEqualTo("+2")
        assertThat(ProvisionalScore.deltaLabel(70)).isEqualTo("-8")
        assertThat(ProvisionalScore.minsPenaltyLabel(5)).isEqualTo("+0.9")
        assertThat(ProvisionalScore.minsPenaltyLabel(3)).isEqualTo("−0.7")
    }
}
