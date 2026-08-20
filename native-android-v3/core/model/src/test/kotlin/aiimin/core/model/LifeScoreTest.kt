package aiimin.core.model

import com.google.common.truth.Truth.assertThat
import kotlin.test.Test

/** The publication contract: missing data widens the band, it never lowers the number. */
class LifeScoreTest {

    private val base = mapOf(
        Instrument.BODY to 1.0,
        Instrument.MIND to 1.0,
        Instrument.CRAFT to 1.0,
        Instrument.MONEY to 1.0,
    )

    private fun reading(instrument: Instrument, score: Double, coverage: Double = 1.0) =
        InstrumentReading(instrument, score, coverage)

    @Test
    fun `weights always normalise to one`() {
        val w = Composition.weights(base, LifeMode.BUILD)
        assertThat(w.values.sum()).isWithin(1e-9).of(1.0)
    }

    @Test
    fun `RECOVER makes rest matter more than grinding`() {
        val instruments = base + (Instrument.RECOVERY to 1.0)
        val build = Composition.weights(instruments, LifeMode.BUILD)
        val recover = Composition.weights(instruments, LifeMode.RECOVER)

        assertThat(recover.getValue(Instrument.RECOVERY))
            .isGreaterThan(build.getValue(Instrument.RECOVERY))
        assertThat(recover.getValue(Instrument.CRAFT))
            .isLessThan(build.getValue(Instrument.CRAFT))
    }

    @Test
    fun `the same day scores differently in different modes - which is the point`() {
        val instruments = base + (Instrument.RECOVERY to 1.0)
        val grindDay = listOf(
            reading(Instrument.BODY, 40.0),
            reading(Instrument.MIND, 50.0),
            reading(Instrument.CRAFT, 95.0),
            reading(Instrument.MONEY, 60.0),
            reading(Instrument.RECOVERY, 20.0),
        )
        val inBuild = Composition.compose(
            grindDay, Composition.weights(instruments, LifeMode.BUILD), LifeMode.BUILD, baselineDays = 30,
        )
        val inRecover = Composition.compose(
            grindDay, Composition.weights(instruments, LifeMode.RECOVER), LifeMode.RECOVER, baselineDays = 30,
        )
        assertThat(inRecover.state).isLessThan(inBuild.state)
    }

    @Test
    fun `missing instruments lower confidence, never the state`() {
        val weights = Composition.weights(base, LifeMode.BUILD)
        val full = listOf(
            reading(Instrument.BODY, 80.0),
            reading(Instrument.MIND, 80.0),
            reading(Instrument.CRAFT, 80.0),
            reading(Instrument.MONEY, 80.0),
        )
        val partial = listOf(
            reading(Instrument.BODY, 80.0),
            reading(Instrument.MIND, 80.0),
            reading(Instrument.CRAFT, 0.0, coverage = 0.0),
            reading(Instrument.MONEY, 0.0, coverage = 0.0),
        )

        val complete = Composition.compose(full, weights, LifeMode.BUILD, baselineDays = 60)
        val sparse = Composition.compose(partial, weights, LifeMode.BUILD, baselineDays = 60)

        assertThat(sparse.state).isWithin(1e-9).of(complete.state)
        assertThat(sparse.confidence).isLessThan(complete.confidence)
        assertThat(sparse.band).isGreaterThan(complete.band)
    }

    @Test
    fun `a brand new account still gets an honest number`() {
        val weights = Composition.weights(base, LifeMode.BUILD)
        val day1 = Composition.compose(
            listOf(reading(Instrument.BODY, 70.0)),
            weights,
            LifeMode.BUILD,
            baselineDays = 1,
        )
        assertThat(day1.state).isWithin(1e-9).of(70.0)
        assertThat(day1.confidence).isLessThan(0.2)
        assertThat(day1.band).isGreaterThan(9.0)
    }

    @Test
    fun `attribution names what moved and keeps it to three`() {
        val weights = Composition.weights(base, LifeMode.BUILD)
        val today = listOf(
            reading(Instrument.BODY, 90.0),
            reading(Instrument.MIND, 40.0),
            reading(Instrument.CRAFT, 70.0),
            reading(Instrument.MONEY, 71.0),
        )
        val norm = mapOf(
            Instrument.BODY to 60.0,
            Instrument.MIND to 70.0,
            Instrument.CRAFT to 70.0,
            Instrument.MONEY to 70.0,
        )
        val score = Composition.compose(today, weights, LifeMode.BUILD, sevenDayNorm = norm, baselineDays = 30)
        assertThat(score.attribution).hasSize(3)
        assertThat(score.attribution.first().instrument)
            .isAnyOf(Instrument.BODY, Instrument.MIND)
    }

    @Test
    fun `learned weights are ignored until there is enough life to learn from`() {
        val learned = mapOf(Instrument.CRAFT to 10.0, Instrument.BODY to 0.1)
        val early = Composition.weights(base, LifeMode.BUILD, learned, days = 20)
        val plain = Composition.weights(base, LifeMode.BUILD)
        assertThat(early).isEqualTo(plain)
    }

    @Test
    fun `learned weights may lean but never lurch`() {
        val learned = mapOf(
            Instrument.CRAFT to 100.0,
            Instrument.BODY to 0.001,
            Instrument.MIND to 0.001,
            Instrument.MONEY to 0.001,
        )
        val plain = Composition.weights(base, LifeMode.BUILD)
        val leaned = Composition.weights(base, LifeMode.BUILD, learned, days = 365)

        assertThat(leaned.getValue(Instrument.CRAFT)).isGreaterThan(plain.getValue(Instrument.CRAFT))
        // Clamped: nothing collapses to nothing, however loud the correlation.
        base.keys.forEach { instrument ->
            assertThat(leaned.getValue(instrument)).isGreaterThan(0.0)
            assertThat(leaned.getValue(instrument))
                .isLessThan(plain.getValue(instrument) * (1 + Composition.LEARNED_CLAMP) * 1.5)
        }
    }

    @Test
    fun `trajectory stays quiet unless the slope clears its own error bar`() {
        val noise = listOf(70.0, 68.0, 72.0, 69.0, 71.0, 70.0, 69.0, 71.0)
        assertThat(Trajectory.of(noise).direction).isEqualTo(Direction.HOLDING)

        val climbing = List(14) { 60.0 + it * 1.5 }
        assertThat(Trajectory.of(climbing).direction).isEqualTo(Direction.RISING)

        val falling = List(14) { 85.0 - it * 1.4 }
        assertThat(Trajectory.of(falling).direction).isEqualTo(Direction.SLIPPING)
    }

    @Test
    fun `a personal baseline beats a population norm`() {
        // Someone who habitually sleeps six hours is not scored against eight.
        val shortSleeper = List(28) { 6.0 }
        assertThat(Baseline.score(6.0, shortSleeper)).isWithin(2.0).of(50.0)
        assertThat(Baseline.score(7.5, shortSleeper)).isGreaterThan(50.0)
    }

    @Test
    fun `one wild night does not redefine normal`() {
        val history = List(27) { 7.0 } + 2.0
        val z = Baseline.zScore(7.0, history)
        assertThat(kotlin.math.abs(z)).isLessThan(0.5)
    }
}
