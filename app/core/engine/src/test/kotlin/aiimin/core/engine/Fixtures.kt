package aiimin.core.engine

import java.time.LocalDate

/** Shared fixtures mirroring the prototype harness (v2_80_tests.js `mkHist` / `base`). */
internal object Fixtures {

    val TODAY: LocalDate = LocalDate.of(2026, 10, 9)
    val RULES = RulesConfig.V2

    val BASE_VALUES: Map<String, Double?> = mapOf(
        Signals.TASKS to 70.0, Signals.FOCUS to 110.0, Signals.MINIMUMS to 75.0, Signals.STEPS to 7500.0,
        Signals.JOURNAL to 1.0, Signals.MONEY_PACE to 95.0, Signals.MONEY_LOGGING to 85.0,
        Signals.SCREEN_PERSONAL to 140.0, Signals.SCREEN_WORK to 300.0,
    )

    val BASE_EVIDENCE: Map<String, Tier> = mapOf(
        Signals.TASKS to Tier.B, Signals.FOCUS to Tier.A, Signals.MINIMUMS to Tier.C, Signals.STEPS to Tier.C,
        Signals.JOURNAL to Tier.B, Signals.MONEY_PACE to Tier.A, Signals.MONEY_LOGGING to Tier.A,
        Signals.SCREEN_PERSONAL to Tier.C, Signals.SCREEN_WORK to Tier.C,
    )

    val DEFAULT_MINS = MinimumsTally(planned = 8, kept = 6, keptWithProof = 2)

    fun day(
        date: LocalDate,
        values: Map<String, Double?> = emptyMap(),
        evidence: Map<String, Tier> = emptyMap(),
        mins: MinimumsTally = DEFAULT_MINS,
        mood: Int? = null,
    ) = DaySnapshot(date, values, evidence, mins, DayType.WORK, mood = mood)

    fun baseDay(date: LocalDate, mins: MinimumsTally = DEFAULT_MINS, mood: Int? = null) =
        day(date, BASE_VALUES, BASE_EVIDENCE, mins, mood)

    /** [n] days ending yesterday, oldest first; [f] gets (daysAgo, date). */
    fun history(n: Int, f: (Int, LocalDate) -> DaySnapshot): List<DaySnapshot> =
        (n downTo 1).map { i -> f(i, TODAY.minusDays(i.toLong())) }

    fun baseHistory(n: Int): List<DaySnapshot> = history(n) { _, d -> baseDay(d) }

    fun allTier(values: Map<String, Double?>, tier: Tier): Map<String, Tier> = values.keys.associateWith { tier }

    val PERFECT_VALUES: Map<String, Double?> = mapOf(
        Signals.TASKS to 100.0, Signals.FOCUS to 400.0, Signals.MINIMUMS to 100.0, Signals.STEPS to 30000.0,
        Signals.JOURNAL to 1.0, Signals.MONEY_PACE to 60.0, Signals.MONEY_LOGGING to 100.0,
        Signals.SCREEN_PERSONAL to 10.0,
    )
}
