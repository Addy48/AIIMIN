package aiimin.core.data

import aiimin.core.model.Instrument
import aiimin.core.model.Observation
import com.google.common.truth.Truth.assertThat
import org.junit.Test

/**
 * The rules the day itself has to keep, whatever any surface draws.
 */
class DayStoreTest {

    private val store = DayStore()

    private fun withValues(vararg values: Pair<Long, Double?>): DayState {
        values.forEach { (id, value) -> store.setProgress(id, value) }
        return store.state.value
    }

    @Test
    fun `a settled capture is visible to every surface at once`() {
        store.recordCapture("paid 1240 swiggy dinner", "21:14", 1240)
        assertThat(store.state.value.captures).hasSize(1)

        store.removeCapture("paid 1240 swiggy dinner")
        assertThat(store.state.value.captures).isEmpty()
    }

    @Test
    fun `a breached floor warns and does not touch the score`() {
        // Steps floor is commitment 5; the walk pursuit is 2.
        val withoutFloor = withValues(2L to 13_000.0)
        val scoreBefore = withoutFloor.score.state

        val withFloor = withValues(5L to 3_100.0)
        assertThat(withFloor.breachedFloors.map { it.commitment.id }).contains(5L)
        assertThat(withFloor.score.state).isWithin(1e-9).of(scoreBefore)
    }

    @Test
    fun `ten steps short is not a lost day`() {
        val day = withValues(2L to 12_990.0)
        val body = day.score.readings.first { it.instrument == Instrument.BODY }
        assertThat(body.score).isAtLeast(99.0)
    }

    @Test
    fun `an unlogged commitment lowers confidence, not the state`() {
        val partial = withValues(1L to 120.0)
        assertThat(partial.score.state).isWithin(0.5).of(100.0)
        assertThat(partial.score.confidence).isLessThan(0.5)
        assertThat(partial.score.band).isGreaterThan(0.0)

        val money = partial.score.readings.first { it.instrument == Instrument.MONEY }
        assertThat(money.covered).isFalse()
    }

    @Test
    fun `a fresh day claims nothing`() {
        val fresh = DayState.seed()
        assertThat(fresh.score.confidence).isEqualTo(0.0)
        assertThat(fresh.score.readings.none { it.covered }).isTrue()
        assertThat(fresh.captures).isEmpty()
    }

    @Test
    fun `reopening a commitment returns it to unknown, not to zero`() {
        withValues(3L to 1.0)
        val reopened = withValues(3L to null)
        val journal = reopened.today.first { it.commitment.id == 3L }
        assertThat(journal.observation).isEqualTo(Observation(3L, null))
        assertThat(journal.attainment).isNull()
    }

    @Test
    fun `config minimums focus is one-shot`() {
        assertThat(store.focusMinimums.value).isFalse()
        store.requestFocusMinimums()
        assertThat(store.focusMinimums.value).isTrue()
        store.consumeFocusMinimums()
        assertThat(store.focusMinimums.value).isFalse()
    }
}
