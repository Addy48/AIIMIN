package aiimin.core.engine

/**
 * Every engine constant in one versioned place (plan Part 1 §15, prototype `CFG`).
 *
 * The version is written into every event and every closed day, so when a rule
 * changes the server can replay history under the new rules instead of patching
 * numbers. In production the backend serves this; the app ships [V2] as the
 * offline default.
 */
data class RulesConfig(
    val version: String,
    val day: DayRules,
    val baseline: BaselineRules,
    val intention: IntentionRules,
    val tiers: TierRules,
    val score: ScoreRules,
    val streak: StreakRules,
    val battery: BatteryRules,
    val focus: FocusRules,
    val xp: XpRules,
    val share: ShareRules,
    val vcs: VcsRules,
) {
    data class DayRules(
        val backfillUntilHour: Int,
        val backfillMax: Int,
        val modeChangeCooldownDays: Int,
        /** Clock moving back by more than this flags new events as skewed (Tier D). */
        val clockSkewToleranceMin: Int,
    )

    data class BaselineRules(
        val calibDays: Int,
        val minValid: Int,
        val longWindow: Int,
        val zClip: Double,
    )

    data class IntentionRules(
        val floorPctMore: Double,
        val ceilPctLess: Double,
        val suggestPct: Double,
        val suggestWindow: Int,
        val floorWindow: Int,
        val easeDelayDays: Int,
        val notRelevantPerMonth: Int,
        val todayOverridesPerMonth: Int,
        val minSignals: Int,
        val minDomains: Int,
        val maxDomains: Int,
        val maxSignalShare: Double,
        val challengeEasy: Double,
        val challengeStretch: Double,
        val challengeHard: Double,
        val pauseDaysPerQuarter: Int,
        val lightDaysPerMonth: Int,
    )

    data class TierRules(
        val a: Double,
        val b: Double,
        val c: Double,
        val d: Double,
        /** Tier C/D evidence can make up at most this much of a signal's adherence. */
        val unverifiedCeiling: Double,
    ) {
        fun multiplier(tier: Tier): Double = when (tier) {
            Tier.A -> a
            Tier.B -> b
            Tier.C -> c
            Tier.D -> d
        }
    }

    data class ScoreRules(
        val insufficientShare: Double,
        val outlierIQR: Double,
        val outlierMinDays: Int,
        val outlierWindow: Int,
        val verifiedForOutlier: Double,
        val ewmaWindow: Int,
        val halfLife: Double,
        val warmupDays: Int,
        val riseSigma: Double,
        val riseMin: Double,
        val fallSigma: Double,
        val fallMin: Double,
        val confidenceDays: Int,
        val eliteVerified: Double,
        val calibSignalsForHeadline: Int,
    )

    data class StreakRules(
        val keptDIPct: Double,
        val keptMinimumsShare: Double,
        val repairHours: Int,
        val freezeEvery: Int,
        val freezeBank: Int,
    )

    data class BatteryRules(
        val start: Int,
        val gainA: Int,
        val gainC: Int,
        val dayBonus: Int,
        val gainMax: Int,
        val miss: Map<BatteryMode, Int>,
        val lossCap: Map<BatteryMode, Int>,
        val lowBattery: Int,
        val comebackDays: Int,
        val comebackTo: Int,
        val modeCooldownDays: Int,
        val freeMissEveryDays: Int,
        val lightDayMaxLoss: Int,
        val gentleFloor: Int,
        val window: Int,
    )

    data class FocusRules(val idlePauseMin: Int, val minSession: Int, val maxDayMin: Int)

    data class XpRules(
        val dailySoftCap: Int,
        val overCapMult: Double,
        val showedUp: Int,
        val taskHigh: Int,
        val taskNormal: Int,
        val taskLow: Int,
        val taskUnplanned: Int,
    )

    data class ShareRules(val linkExpiryDays: Int, val emergencyWaitH: Int, val emergencyAccessDays: Int)

    data class VcsRules(val seasonDays: Int, val leagueSize: Int, val provisionalDays: Int)

    companion object {
        /** Rules 2.0.0 — identical to the prototype's `CFG` (v2_10_core.js). */
        val V2 = RulesConfig(
            version = "2.0.0",
            day = DayRules(backfillUntilHour = 12, backfillMax = 5, modeChangeCooldownDays = 14, clockSkewToleranceMin = 10),
            baseline = BaselineRules(calibDays = 14, minValid = 7, longWindow = 90, zClip = 3.0),
            intention = IntentionRules(
                floorPctMore = 40.0, ceilPctLess = 60.0, suggestPct = 60.0, suggestWindow = 9, floorWindow = 28,
                easeDelayDays = 7, notRelevantPerMonth = 2, todayOverridesPerMonth = 4,
                minSignals = 4, minDomains = 3, maxDomains = 7, maxSignalShare = 0.25,
                challengeEasy = 0.7, challengeStretch = 1.0, challengeHard = 1.1,
                pauseDaysPerQuarter = 14, lightDaysPerMonth = 4,
            ),
            tiers = TierRules(a = 1.0, b = 0.85, c = 0.6, d = 0.3, unverifiedCeiling = 0.70),
            score = ScoreRules(
                insufficientShare = 0.5, outlierIQR = 1.5, outlierMinDays = 14, outlierWindow = 60,
                verifiedForOutlier = 0.6, ewmaWindow = 28, halfLife = 7.0, warmupDays = 7,
                riseSigma = 0.6, riseMin = 2.0, fallSigma = 1.0, fallMin = 4.0,
                confidenceDays = 28, eliteVerified = 0.6, calibSignalsForHeadline = 4,
            ),
            streak = StreakRules(keptDIPct = 20.0, keptMinimumsShare = 0.6, repairHours = 48, freezeEvery = 7, freezeBank = 2),
            battery = BatteryRules(
                start = 70, gainA = 4, gainC = 2, dayBonus = 5, gainMax = 20,
                miss = mapOf(BatteryMode.GENTLE to -2, BatteryMode.STANDARD to -3, BatteryMode.HARDCORE to -5),
                lossCap = mapOf(BatteryMode.GENTLE to -6, BatteryMode.STANDARD to -10, BatteryMode.HARDCORE to -20),
                lowBattery = 25, comebackDays = 3, comebackTo = 40, modeCooldownDays = 7,
                freeMissEveryDays = 7, lightDayMaxLoss = -2, gentleFloor = 5, window = 60,
            ),
            focus = FocusRules(idlePauseMin = 5, minSession = 10, maxDayMin = 360),
            xp = XpRules(
                dailySoftCap = 600, overCapMult = 0.25, showedUp = 5,
                taskHigh = 45, taskNormal = 30, taskLow = 18, taskUnplanned = 8,
            ),
            share = ShareRules(linkExpiryDays = 7, emergencyWaitH = 72, emergencyAccessDays = 30),
            vcs = VcsRules(seasonDays = 28, leagueSize = 30, provisionalDays = 28),
        )
    }
}
