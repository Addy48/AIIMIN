package aiimin.core.model

import com.google.common.truth.Truth.assertThat
import kotlin.test.Test

/**
 * The founder's complaint, pinned as tests:
 *
 * > "everyday I walk 13k steps so on my streak marker it gets marked, but if I
 * > walk 12.99k steps it's not marked and told as a failure."
 *
 * If any of these ever fail, the cliff is back.
 */
class AttainmentTest {

    private val steps = Commitment(
        id = 1,
        instrument = Instrument.BODY,
        kind = CommitmentKind.PURSUIT,
        shape = CommitmentShape.MORE,
        label = "Walk",
        unit = "steps",
        target = 13_000.0,
    )

    @Test
    fun `12990 steps is indistinguishable from 13000`() {
        val near = Attainment.of(steps, Observation(1, 12_990.0))!!
        val exact = Attainment.of(steps, Observation(1, 13_000.0))!!
        assertThat(Attainment.indistinguishable(near, exact)).isTrue()
        assertThat(near).isGreaterThan(0.99)
    }

    @Test
    fun `a near miss anywhere near the target costs almost nothing`() {
        // The curve is flat approaching the target — that is the whole point.
        assertThat(Attainment.more(12_500.0, 13_000.0)).isGreaterThan(0.99)
        assertThat(Attainment.more(12_000.0, 13_000.0)).isGreaterThan(0.97)
    }

    @Test
    fun `a real shortfall is a real number, not a failure`() {
        val half = Attainment.more(9_000.0, 13_000.0)
        assertThat(half).isGreaterThan(0.60)
        assertThat(half).isLessThan(0.85)
    }

    @Test
    fun `below the soft floor the day did not happen`() {
        assertThat(Attainment.more(3_000.0, 13_000.0)).isEqualTo(0.0)
    }

    @Test
    fun `overshoot counts but is capped so one day cannot buy a week`() {
        val big = Attainment.more(26_000.0, 13_000.0)
        assertThat(big).isEqualTo(Attainment.MAX)
        assertThat(big).isLessThan(1.2)
    }

    @Test
    fun `nothing observed is not zero`() {
        assertThat(Attainment.of(steps, Observation(1, null))).isNull()
    }

    @Test
    fun `one slip in a month is still an excellent month`() {
        assertThat(Attainment.less(0.0)).isEqualTo(1.0)
        assertThat(Attainment.less(1.0)).isGreaterThan(0.80)
        assertThat(Attainment.less(4.0)).isLessThan(0.60)
    }

    @Test
    fun `a band is satisfied anywhere inside it and decays smoothly outside`() {
        val sleep = Commitment(
            id = 2,
            instrument = Instrument.BODY,
            kind = CommitmentKind.PURSUIT,
            shape = CommitmentShape.BAND,
            label = "Sleep",
            unit = "h",
            target = 8.0,
            bandLow = 7.0,
            bandHigh = 9.0,
        )
        assertThat(Attainment.of(sleep, Observation(2, 7.5))).isEqualTo(1.0)
        assertThat(Attainment.of(sleep, Observation(2, 9.0))).isEqualTo(1.0)
        val short = Attainment.of(sleep, Observation(2, 6.5))!!
        assertThat(short).isLessThan(1.0)
        assertThat(short).isGreaterThan(0.5)
    }

    @Test
    fun `showing up is binary because presence genuinely is`() {
        val journal = Commitment(
            id = 3,
            instrument = Instrument.MIND,
            kind = CommitmentKind.PURSUIT,
            shape = CommitmentShape.SHOW_UP,
            label = "Journal",
        )
        assertThat(Attainment.of(journal, Observation(3, 1.0))).isEqualTo(1.0)
        assertThat(Attainment.of(journal, Observation(3, 0.0))).isEqualTo(0.0)
    }

    @Test
    fun `a floor never contributes to the score`() {
        val floor = Commitment(
            id = 4,
            instrument = Instrument.BODY,
            kind = CommitmentKind.FLOOR,
            shape = CommitmentShape.MORE,
            label = "Steps floor",
            target = 5_000.0,
            reason = "sedentary work day",
        )
        assertThat(floor.scored).isFalse()
        assertThat(steps.scored).isTrue()
    }
}
