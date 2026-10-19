package aiimin.core.engine

import aiimin.core.engine.Fixtures.RULES
import aiimin.core.engine.Fixtures.TODAY
import aiimin.core.engine.Fixtures.baseDay
import aiimin.core.engine.Fixtures.baseHistory
import aiimin.core.engine.Fixtures.day
import aiimin.core.engine.Fixtures.history
import com.google.common.truth.Truth.assertThat
import java.time.Instant
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneId
import kotlin.test.Test

/**
 * Rules from the plan's test matrix (Part 1 §16) that the prototype harness
 * did not automate. Numbered by that matrix, prefixed M.
 */
class EngineRulesTest {

    private val policy = IntentionPolicy(RULES)
    private val defaults = IntentionSet.default()
    private val kolkata = ZoneId.of("Asia/Kolkata")

    private fun at(y: Int, mo: Int, d: Int, h: Int, mi: Int): Instant =
        LocalDateTime.of(y, mo, d, h, mi).atZone(kolkata).toInstant()

    @Test
    fun `M4 lowering a target below your own P40 floor is rejected with the floor shown`() {
        val focus = defaults.card(Signals.FOCUS)!!
        val r = policy.propose(defaults, Signals.FOCUS, focus.copy(target = 50.0), baseHistory(30), TODAY)

        assertThat(r).isInstanceOf(IntentionChange.Rejected.BelowYourFloor::class.java)
        assertThat((r as IntentionChange.Rejected.BelowYourFloor).floor).isEqualTo(110.0)
    }

    @Test
    fun `M5 easing a target waits 7 days, tightening applies now`() {
        val hist = history(30) { i, d -> baseDay(d).let { it.copy(values = it.values + (Signals.FOCUS to (80.0 + i))) } }
        val focus = defaults.card(Signals.FOCUS)!!

        val eased = policy.propose(defaults, Signals.FOCUS, focus.copy(target = 105.0), hist, TODAY)
        assertThat(eased).isInstanceOf(IntentionChange.Scheduled::class.java)
        eased as IntentionChange.Scheduled
        assertThat(eased.applyOn).isEqualTo(TODAY.plusDays(7))
        assertThat(eased.set.card(Signals.FOCUS)!!.target).isEqualTo(120.0)
        assertThat(eased.set.applyPending(TODAY.plusDays(6)).card(Signals.FOCUS)!!.target).isEqualTo(120.0)
        assertThat(eased.set.applyPending(TODAY.plusDays(7)).card(Signals.FOCUS)!!.target).isEqualTo(105.0)

        val tightened = policy.propose(defaults, Signals.FOCUS, focus.copy(target = 150.0), hist, TODAY)
        assertThat(tightened).isInstanceOf(IntentionChange.Applied::class.java)
    }

    @Test
    fun `M6 a third not-relevant switch in one month is blocked`() {
        var set = defaults
        listOf(Signals.DRILLS, Signals.FAMILY).forEach { k ->
            val r = policy.propose(set, k, set.card(k)!!.copy(direction = Direction.OFF), emptyList(), TODAY)
            set = (r as IntentionChange.Scheduled).set
        }
        val third = policy.propose(set, Signals.JOURNAL, set.card(Signals.JOURNAL)!!.copy(direction = Direction.OFF), emptyList(), TODAY)

        assertThat(third).isEqualTo(IntentionChange.Rejected.NotRelevantLimit)
    }

    @Test
    fun `coverage - can't drop below 4 scored signals across 3 domains`() {
        val thin = IntentionSet.default().copy(
            cards = defaults.cards.filterKeys { it in setOf(Signals.FOCUS, Signals.TASKS, Signals.STEPS, Signals.MONEY_PACE) },
        )
        val r = policy.propose(thin, Signals.STEPS, thin.card(Signals.STEPS)!!.copy(direction = Direction.TRACK), emptyList(), TODAY)

        assertThat(r).isEqualTo(IntentionChange.Rejected.Coverage)
    }

    @Test
    fun `M10 M11 an entry at 00 20 can be filed to yesterday until noon, not after`() {
        val day = LogicalDay(DayMode.Midnight, kolkata)

        val early = day.backfill(at(2026, 10, 10, 0, 20), usedForYesterday = 0)
        assertThat(early).isEqualTo(LogicalDay.Backfill.Allowed(LocalDate.of(2026, 10, 9), remaining = 4))
        assertThat(day.backfill(at(2026, 10, 10, 12, 30), 0)).isEqualTo(LogicalDay.Backfill.Settled)
        assertThat(day.backfill(at(2026, 10, 10, 9, 0), 5)).isEqualTo(LogicalDay.Backfill.LimitReached)
        assertThat(Tier.B.lower()).isEqualTo(Tier.C)
    }

    @Test
    fun `M12 a 23 30 to 00 40 focus session splits 30 and 40`() {
        val split = LogicalDay(DayMode.Midnight, kolkata).splitMinutes(at(2026, 10, 9, 23, 30), at(2026, 10, 10, 0, 40))

        assertThat(split).containsExactly(LocalDate.of(2026, 10, 9), 30L, LocalDate.of(2026, 10, 10), 40L).inOrder()
    }

    @Test
    fun `fixed later end keeps 2 AM on the previous day and roster night shift owns the morning`() {
        assertThat(LogicalDay(DayMode.FixedEnd(3), kolkata).dayOf(at(2026, 10, 10, 2, 0))).isEqualTo(LocalDate.of(2026, 10, 9))

        val roster = DayMode.Roster("N,N,O,O".toList().filter { it != ',' }, start = LocalDate.of(2026, 10, 9), nightEndHour = 8)
        val shift = LogicalDay(roster, kolkata)
        assertThat(shift.dayOf(at(2026, 10, 10, 6, 0))).isEqualTo(LocalDate.of(2026, 10, 9))
        assertThat(shift.dayType(LocalDate.of(2026, 10, 11))).isEqualTo(DayType.REST)
    }

    @Test
    fun `clock moved back marks the event tier D with a skew flag`() {
        val chain = EventChain(RULES, "dev", "Asia/Kolkata")
        val (_, tail) = chain.append(ChainTail.EMPTY, at(2026, 10, 9, 10, 0), TODAY, "min.toggle", null, emptyMap(), Tier.C, "ui")
        val (skewed, _) = chain.append(tail, at(2026, 10, 9, 9, 30), TODAY, "min.toggle", null, emptyMap(), Tier.B, "ui")

        assertThat(skewed.tier).isEqualTo(Tier.D)
        assertThat(skewed.data["clockSkew"]).isEqualTo(true)
    }

    @Test
    fun `M16 gentle - three misses in the first week cost 4, not 6`() {
        val d = day(LocalDate.of(2026, 1, 1), mins = MinimumsTally(5, 2, 0))
        val b = BatteryEngine(RULES).compute(listOf(d), emptyList(), BatteryMode.GENTLE)

        // +2 +2 for the two kept (tier C), then 0 − 2 − 2 for the three missed.
        assertThat(b.value).isEqualTo(70 + 4 - 4)
    }

    @Test
    fun `a missed day is repaired by keeping the next day plus one extra minimum`() {
        // No freeze banked yet (fewer than 7 kept days), so the miss is real.
        val hist = history(6) { i, d ->
            val kept = when (i) {
                2 -> 0
                1 -> 6 // floor is 5, so 6 is "one extra"
                else -> 5
            }
            baseDay(d, mins = MinimumsTally(8, kept, 3))
        }
        val streak = StreakEngine(RULES).compute(ScoreEngine(RULES, defaults).series(hist), BatteryMode.STANDARD)

        assertThat(streak.log).isEqualTo("KKKKRK")
        assertThat(streak.current).isEqualTo(6)
    }

    @Test
    fun `hardcore mode never freezes or repairs`() {
        val hist = history(16) { i, d -> baseDay(d, mins = MinimumsTally(8, if (i == 3) 0 else 7, 3)) }
        val streak = StreakEngine(RULES).compute(ScoreEngine(RULES, defaults).series(hist), BatteryMode.HARDCORE)

        assertThat(streak.marks).contains(StreakMark.MISSED)
        assertThat(streak.current).isEqualTo(2)
        assertThat(streak.longest).isEqualTo(13)
    }

    @Test
    fun `day-mode can change at most once every 14 days`() {
        assertThat(LogicalDay.canChangeMode(TODAY.minusDays(13), TODAY)).isFalse()
        assertThat(LogicalDay.canChangeMode(TODAY.minusDays(14), TODAY)).isTrue()
        assertThat(LogicalDay.canChangeMode(null, TODAY)).isTrue()
    }
}
