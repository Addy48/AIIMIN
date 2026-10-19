package aiimin.core.engine

import com.google.common.truth.Truth.assertThat
import java.util.Random
import org.junit.Test

/**
 * Score Engine 3 test vectors EV1–EV12 (plan §9.9), a port of the persona simulation in
 * docs/engine/score_engine_3_reference.py: five equal-weight signals (steps, sleep range,
 * personal screen time, focus, minimums), 120 days with realistic noise. The RNG differs from
 * Python's, so each vector checks the behaviour band the plan specifies, not one exact run.
 */
class ScoreEngine3VectorsTest {

    private enum class Dir { MORE, LESS, BAND }

    private val dirs = linkedMapOf("steps" to Dir.MORE, "sleep" to Dir.BAND, "screen" to Dir.LESS, "focus" to Dir.MORE, "minimums" to Dir.MORE)
    private val tierW = mapOf("A" to 1.0, "B" to 0.85, "C" to 0.6, "D" to 0.3)
    private val normal = mapOf("steps" to 8000.0, "screen" to 150.0, "focus" to 90.0, "minimums" to 3.0)
    private val stretchT = mapOf("steps" to 9500.0, "screen" to 120.0, "focus" to 110.0, "minimums" to 3.0)
    private val sleepBand = 7.0 to 8.5

    private data class Day(val shown: Double?, val level: Double?, val momentum: Double, val di: Double?)

    private lateinit var rnd: Random
    private fun n(m: Double, sd: Double) = maxOf(0.0, m + rnd.nextGaussian() * sd)
    private fun <T> pick(vararg xs: T) = xs[rnd.nextInt(xs.size)]

    private fun steady(d: Int) = mapOf("steps" to n(8800.0, 1200.0), "sleep" to n(7.6, .4), "screen" to n(135.0, 25.0), "focus" to n(100.0, 20.0), "minimums" to pick(3.0, 3.0, 3.0, 2.0))
    private fun badDay() = mapOf("steps" to 2500.0, "sleep" to 3.5, "screen" to 420.0, "focus" to 0.0, "minimums" to 1.0)
    private fun bad(d: Int) = if (d == 70) badDay() else steady(d)
    private fun sickweek(d: Int) = if (d in 60..66) badDay() else steady(d)
    private fun improver(d: Int): Map<String, Double> {
        val f = minOf(1.0, d / 56.0)
        return mapOf("steps" to n(4000 + 5000 * f, 900.0), "sleep" to n(6.2 + 1.4 * f, .5), "screen" to n(300 - 160 * f, 40.0), "focus" to n(30 + 70 * f, 15.0), "minimums" to if (f < .5) pick(1.0, 2.0) else pick(2.0, 3.0, 3.0))
    }
    private fun decliner(d: Int): Map<String, Double> {
        val f = ((d - 60) / 30.0).coerceIn(0.0, 1.0)
        return mapOf("steps" to n(8800 - 4500 * f, 1000.0), "sleep" to n(7.6 - 1.4 * f, .4), "screen" to n(135 + 170 * f, 30.0), "focus" to n(100 - 70 * f, 15.0), "minimums" to if (f < .5) pick(3.0, 3.0, 2.0) else pick(1.0, 1.0, 2.0))
    }
    private fun peak(d: Int) = if (d in 90 until 104) mapOf("steps" to n(11500.0, 800.0), "sleep" to n(7.8, .2), "screen" to n(80.0, 10.0), "focus" to n(150.0, 15.0), "minimums" to 3.0) else steady(d)
    private fun tapper(d: Int) = mapOf("steps" to n(5000.0, 900.0), "sleep" to n(6.5, .5), "screen" to n(260.0, 40.0), "focus" to n(40.0, 15.0), "minimums" to 3.0)
    private fun struggling(d: Int) = mapOf("steps" to n(3500.0, 900.0), "sleep" to n(5.8, .6), "screen" to n(330.0, 50.0), "focus" to n(20.0, 10.0), "minimums" to pick(0.0, 1.0, 1.0, 2.0))
    private fun spikefaker(d: Int) = if (d % 10 == 0) tapper(d) + mapOf("steps" to 20000.0, "focus" to 400.0, "screen" to 20.0) else tapper(d)

    private fun simulate(
        gen: (Int) -> Map<String, Double>,
        targets: Map<String, Double> = normal,
        tiers: Map<String, String> = mapOf("steps" to "A", "sleep" to "A", "screen" to "A", "focus" to "A", "minimums" to "C"),
        pause: Set<Int> = emptySet(),
        seed: Long = 5,
    ): List<Day> {
        rnd = Random(seed)
        val hist = dirs.keys.associateWith { mutableListOf<Double>() }
        val e = Score3.Level()
        return (0 until 120).map { d ->
            if (d in pause) {
                e.settle(null, 0.0)
                return@map Day(e.shown(), e.level, e.momentum(), null)
            }
            val v = gen(d)
            var di = 0.0
            var ver = 0.0
            for ((k, x) in v) {
                val tw = tierW.getValue(tiers.getValue(k))
                val p = when (dirs.getValue(k)) {
                    Dir.BAND -> Score3.credit(Score3.bandPoints(x, sleepBand.first, sleepBand.second), tw, 1.0)
                    Dir.MORE, Dir.LESS -> {
                        val more = dirs.getValue(k) == Dir.MORE
                        val t = targets.getValue(k)
                        Score3.credit(Score3.points(more, x, t, hist.getValue(k)), tw, Score3.challenge(Score3.targetRank(more, t, hist.getValue(k))))
                    }
                }
                di += 0.2 * p
                hist.getValue(k) += x
                if (tiers.getValue(k) in setOf("A", "B")) ver += 0.2
            }
            e.settle(di, ver)
            Day(e.shown(), e.level, e.momentum(), di)
        }
    }

    private fun List<Day>.levels(r: IntRange) = r.map { this[it].level!! }

    @Test fun `EV1 steady person sits in Good from day 29`() {
        val o = simulate(::steady)
        o.levels(29..119).forEach { assertThat(it).isIn(com.google.common.collect.Range.closed(64.0, 75.0)) }
        assertThat(o.levels(29..119).average()).isIn(com.google.common.collect.Range.closed(66.0, 73.0))
    }

    @Test fun `EV2 stretch targets never score lower than easy ones`() {
        val easy = simulate(::steady).levels(29..119).average()
        val stretch = simulate(::steady, stretchT).levels(29..119).average()
        assertThat(stretch - easy).isAtLeast(-2.0)
    }

    @Test fun `EV3 one terrible day costs at most 3·5 and recovers`() {
        val o = simulate(::bad)
        assertThat(o[69].level!! - o[70].level!!).isAtMost(3.5)
        assertThat(o[71].level!!).isAtLeast(o[70].level!! - 0.01)
        assertThat(kotlin.math.abs(o[80].level!! - o[69].level!!)).isAtMost(2.5)
    }

    @Test fun `EV4 a paused sick week leaves the level unchanged`() {
        val o = simulate(::steady, pause = (60..66).toSet())
        assertThat(o[66].level).isEqualTo(o[59].level)
        assertThat(o[67].level!!).isAtLeast(o[59].level!! - 3.0)
    }

    @Test fun `EV5 an unpaused sick week dips and recovers within two weeks`() {
        val o = simulate(::sickweek)
        val dip = o[59].level!! - o.levels(60..67).min()
        assertThat(dip).isIn(com.google.common.collect.Range.closed(8.0, 20.0))
        assertThat(o[81].level!!).isAtLeast(o[59].level!! - 4.0)
        // Two days under 30 in a row → the "Rough patch?" offer.
        assertThat(o[60].di!! < 30 && o[61].di!! < 30).isTrue()
    }

    @Test fun `EV6 an improver shows momentum and climbs`() {
        val o = simulate(::improver)
        (14..55).forEach { assertThat(o[it].momentum).isAtLeast(3.0) }
        assertThat(o[13].level!!).isLessThan(55.0)
        assertThat(o[90].level!!).isAtLeast(64.0)
    }

    @Test fun `EV7 a real decline shows in momentum fast and in the level over a month`() {
        val o = simulate(::decliner)
        assertThat((60..75).minOf { o[it].momentum }).isAtMost(-5.0)
        // Reference run: 71.4 → 55.0 by day 90 (−16.4). Slump protection slows the fall, never hides it.
        assertThat(o[59].level!! - o[92].level!!).isAtLeast(15.0)
        assertThat(o[59].level!! - o[119].level!!).isAtLeast(20.0)
    }

    @Test fun `EV8 a verified peak fortnight reaches Peak and returns`() {
        val o = simulate(::peak, stretchT)
        assertThat(o.levels(90..105).max()).isAtLeast(78.0)
        assertThat(o[119].level!!).isLessThan(78.0)
    }

    @Test fun `EV9 a tapper with weak measured signals stays at or under 55`() {
        assertThat(simulate(::tapper).levels(29..119).max()).isAtMost(55.0)
    }

    @Test fun `EV10 tapped spikes every tenth day gain almost nothing`() {
        val taps = mapOf("steps" to "C", "sleep" to "C", "screen" to "C", "focus" to "C", "minimums" to "C")
        val tapper = simulate(::tapper, tiers = taps).levels(29..119).average()
        val faker = simulate(::spikefaker, tiers = taps).levels(29..119).average()
        assertThat(faker - tapper).isAtMost(5.0)
    }

    @Test fun `EV11 sandbagging gains little, and targets below your own P40 are refused`() {
        // A target far below your normal earns at most a few points over your 60th percentile
        // (the challenge factor shrinks the good news; reference run +3.8)…
        val easyT = normal + mapOf("steps" to 6000.0, "focus" to 60.0, "screen" to 200.0)
        val p60 = normal + mapOf("steps" to 9100.0, "focus" to 105.0, "screen" to 130.0)
        val easy = simulate(::steady, easyT).levels(29..119).average()
        val fair = simulate(::steady, p60).levels(29..119).average()
        assertThat(easy - fair).isAtMost(5.0)
        // …and such a target can't be set in the first place (history floor, §9.2.1).
        val defaults = IntentionSet.default()
        val focus = defaults.card(Signals.FOCUS)!!
        val r = IntentionPolicy(Fixtures.RULES).propose(defaults, Signals.FOCUS, focus.copy(target = 50.0), Fixtures.baseHistory(30), Fixtures.TODAY)
        assertThat(r).isInstanceOf(IntentionChange.Rejected.BelowYourFloor::class.java)
    }

    @Test fun `EV12 a struggling person is Rebuilding, not crushed`() {
        val o = simulate(::struggling)
        assertThat(o.levels(29..119).max()).isAtMost(35.0)
        assertThat(o.levels(29..119).min()).isAtLeast(5.0)
    }
}
