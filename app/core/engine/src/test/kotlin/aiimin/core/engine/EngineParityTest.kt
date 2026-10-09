package aiimin.core.engine

import aiimin.core.engine.Fixtures.BASE_EVIDENCE
import aiimin.core.engine.Fixtures.BASE_VALUES
import aiimin.core.engine.Fixtures.PERFECT_VALUES
import aiimin.core.engine.Fixtures.RULES
import aiimin.core.engine.Fixtures.TODAY
import aiimin.core.engine.Fixtures.allTier
import aiimin.core.engine.Fixtures.baseDay
import aiimin.core.engine.Fixtures.baseHistory
import aiimin.core.engine.Fixtures.day
import aiimin.core.engine.Fixtures.history
import com.google.common.truth.Truth.assertThat
import java.time.Instant
import java.time.LocalDate
import kotlin.math.abs
import kotlin.test.Test

/**
 * The prototype's engine harness (Settings → Demo tools → Run engine tests),
 * ported one-to-one. IDs match v2_80_tests.js so a failure here maps straight
 * back to the reference. T14–T17 live in :core:privacy, T18–T22 in :core:nlp.
 */
class EngineParityTest {

    private val defaults = IntentionSet.default()

    private fun engine(set: IntentionSet = defaults) = ScoreEngine(RULES, set)

    @Test
    fun `T1 work screen time set to track-only never changes the score`() {
        val set = defaults.update(Signals.SCREEN_WORK) { it.copy(direction = Direction.TRACK) }
        val hist = baseHistory(40)
        val last = hist.last()
        val heavy = last.copy(values = last.values + (Signals.SCREEN_WORK to 600.0))
        val light = last.copy(values = last.values + (Signals.SCREEN_WORK to 10.0))

        val a = engine(set).dailyIndex(heavy, hist, null).value!!
        val b = engine(set).dailyIndex(light, hist, null).value!!

        assertThat(abs(a - b)).isLessThan(1e-9)
    }

    @Test
    fun `T2 track-only signal is excluded from weights`() {
        val set = defaults.update(Signals.STEPS) { it.copy(direction = Direction.TRACK) }

        assertThat(engine(set).weights()).doesNotContainKey(Signals.STEPS)
        assertThat(engine(defaults).weights()).containsKey(Signals.STEPS)
    }

    @Test
    fun `T3 no signal exceeds 25 percent of the score`() {
        val set = defaults.update(Signals.FOCUS) { it.copy(weight = 3) }
        val w = engine(set).weights()

        assertThat(w.values.all { it <= 0.2501 }).isTrue()
        assertThat(w.values.sum()).isWithin(1e-9).of(1.0)

        // A lopsided set still can't let one signal dominate.
        val lopsided = IntentionSet.default().copy(
            cards = defaults.cards.mapValues { (k, c) ->
                if (k == Signals.FOCUS) c.copy(weight = 3) else if (c.isScored) c.copy(weight = 1) else c
            }.filterKeys { it in setOf(Signals.FOCUS, Signals.TASKS, Signals.STEPS, Signals.JOURNAL, Signals.MONEY_PACE) },
        )
        assertThat(engine(lopsided).weights().values.max()).isAtMost(0.2501)
    }

    @Test
    fun `T4 easy target earns less adherence than a stretch target`() {
        val hist = baseHistory(40)
        val easy = engine(defaults.update(Signals.FOCUS) { it.copy(target = 60.0) }).challenge(Signals.FOCUS, hist)
        val stretch = engine(defaults.update(Signals.FOCUS) { it.copy(target = 140.0) }).challenge(Signals.FOCUS, hist)

        assertThat(easy.challenge).isEqualTo(Challenge.EASY)
        assertThat(stretch.factor).isAtLeast(easy.factor)
    }

    @Test
    fun `T5 trend half ignores the target so sandbagging cannot raise it`() {
        val hist = baseHistory(40)
        val honest = engine().signalScore(Signals.FOCUS, 110.0, Tier.A, DayType.WORK, hist, null)!!
        val sandbag = engine(defaults.update(Signals.FOCUS) { it.copy(target = 10.0) })
            .signalScore(Signals.FOCUS, 110.0, Tier.A, DayType.WORK, hist, null)!!

        assertThat(abs(honest.z - sandbag.z)).isLessThan(1e-9)
    }

    @Test
    fun `T6 one perfect day on taps alone is clipped to your normal range`() {
        val hist = baseHistory(40) + day(TODAY, PERFECT_VALUES, allTier(PERFECT_VALUES, Tier.C), MinimumsTally(8, 8, 0))

        assertThat(engine().series(hist).last().clipped).isTrue()
    }

    @Test
    fun `T7 the same perfect day with verified evidence is believed`() {
        val hist = baseHistory(40) + day(TODAY, PERFECT_VALUES, allTier(PERFECT_VALUES, Tier.A), MinimumsTally(8, 8, 0))

        assertThat(engine().series(hist).last().clipped).isFalse()
    }

    @Test
    fun `T8 score rises slowly for new and unverified accounts`() {
        val perfect = mapOf(
            Signals.TASKS to 100.0, Signals.FOCUS to 300.0, Signals.MINIMUMS to 100.0, Signals.STEPS to 12000.0,
            Signals.JOURNAL to 1.0, Signals.MONEY_PACE to 70.0, Signals.MONEY_LOGGING to 100.0, Signals.SCREEN_PERSONAL to 30.0,
        )
        val hist = history(10) { _, d -> day(d, perfect, allTier(perfect, Tier.C)) }
        val s = engine().series(hist).mapNotNull { it.score }
        val jumps = s.zipWithNext { a, b -> b - a }

        assertThat(jumps).isNotEmpty()
        assertThat(jumps.max()).isAtMost(2.01)
    }

    @Test
    fun `T9 no headline before 4 signals are calibrated`() {
        assertThat(engine().headlineReady(baseHistory(5))).isFalse()
        assertThat(engine().headlineReady(baseHistory(14))).isTrue()

        val readout = LifeEngine(RULES).evaluate(defaults, baseHistory(5), null, BatteryMode.GENTLE, TODAY)
        assertThat(readout.score).isNull()
        assertThat(readout.band).isEqualTo(Band.CALIBRATING)
        assertThat(readout.calibrating[Signals.FOCUS]).isEqualTo(9)
    }

    @Test
    fun `T10 mood never changes the score`() {
        val low = history(40) { _, d -> baseDay(d, mood = 1) }
        val high = history(40) { _, d -> baseDay(d, mood = 10) }

        val a = engine().series(low).map { it.score to it.di }
        val b = engine().series(high).map { it.score to it.di }
        assertThat(a).isEqualTo(b)
    }

    @Test
    fun `T11 gentle battery - first weekly miss is free, daily loss capped`() {
        val oneBadDay = listOf(day(LocalDate.of(2026, 1, 1), mins = MinimumsTally(8, 0, 0)))

        val b = BatteryEngine(RULES).compute(oneBadDay, emptyList(), BatteryMode.GENTLE)

        assertThat(b.value).isEqualTo(RULES.battery.start + RULES.battery.lossCap.getValue(BatteryMode.GENTLE))
    }

    @Test
    fun `T12 standard battery at zero starts a comeback and never deletes`() {
        val hist = history(12) { _, d -> day(d, mins = MinimumsTally(8, 0, 0)) }
        val before = hist.toList()

        val b = BatteryEngine(RULES).compute(hist, emptyList(), BatteryMode.STANDARD)

        assertThat(b.state).isEqualTo(BatteryState.COMEBACK)
        assertThat(b.knockouts).isEqualTo(1)
        assertThat(hist).isEqualTo(before) // nothing in history is touched
    }

    @Test
    fun `T13 streak survives one missed day with a banked freeze`() {
        val hist = history(16) { i, d -> baseDay(d, mins = MinimumsTally(8, if (i == 3) 0 else 7, 3)) }

        val streak = StreakEngine(RULES).compute(engine().series(hist), BatteryMode.GENTLE)

        assertThat(streak.marks).contains(StreakMark.FROZEN)
        assertThat(streak.marks).doesNotContain(StreakMark.MISSED)
        assertThat(streak.current).isEqualTo(15)
    }

    @Test
    fun `T23 verified consistency score uses only tier A-B and never raw values`() {
        val hist = baseHistory(28)
        val scored = engine().series(hist)
        val streak = StreakEngine(RULES).compute(scored, BatteryMode.GENTLE)

        val v = VerifiedConsistencyEngine(RULES).compute(scored, streak.keptDays)

        assertThat(v.vcs).isIn(0..100)
        val fields = VerifiedConsistency::class.java.declaredFields.map { it.name }.toSet()
        assertThat(fields).containsExactly("vcs", "consistencyPct", "improvementPct", "verifiedPct", "provisional")
    }

    @Test
    fun `T24 XP - creating earns nothing, soft cap applies above 600 per day`() {
        val policy = XpPolicy(RULES)
        val capped = XpState.fresh().copy(day = TODAY, dayTotal = 600, showedUpToday = true)

        assertThat(policy.award(capped, 100, TODAY).awarded).isEqualTo(25)
        assertThat(policy.award(XpState.fresh(), XpEvent.Created("task"), TODAY).awarded).isEqualTo(0)
        assertThat(policy.award(XpState.fresh(), XpEvent.Created("note"), TODAY).state).isEqualTo(XpState.fresh())
    }

    @Test
    fun `T25 event log hash chain verifies and detects edits`() {
        val chain = EventChain(RULES, deviceId = "dev_test", tz = "Asia/Kolkata")
        var tail = ChainTail.EMPTY
        val events = (1..5).map { n ->
            val (e, t) = chain.append(
                tail, Instant.parse("2026-10-09T04:00:00Z").plusSeconds(n * 60L), TODAY,
                "task.toggle", EventRef("task", "t$n"), mapOf("done" to true, "n" to n), Tier.B, "ui",
            )
            tail = t
            e
        }

        assertThat(EventChain.verify(events).ok).isTrue()

        val tampered = events.toMutableList().apply { this[2] = this[2].copy(data = mapOf("done" to false, "n" to 3)) }
        assertThat(EventChain.verify(tampered)).isEqualTo(ChainCheck(false, 3))

        val dropped = events.filterIndexed { i, _ -> i != 1 }
        assertThat(EventChain.verify(dropped).ok).isFalse()
    }
}
