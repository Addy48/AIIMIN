package aiimin.core.engine

import kotlin.math.abs
import kotlin.math.exp
import kotlin.math.max
import kotlin.math.min
import kotlin.math.pow
import kotlin.math.sqrt

enum class Challenge(val label: String) { NONE("—"), EASY("Easy"), STRETCH("Stretch"), HARD("Hard") }

data class ChallengeReading(val challenge: Challenge, val factor: Double, val gapPct: Int?, val typical: Double?)

/** One signal's 0–100 score for one day, with the reason behind it. */
data class SignalScore(
    val score: Double,
    /** Raw adherence 0..1 before tier and challenge adjustments. */
    val adherence: Double,
    /** Distance from your own normal in robust σ, clipped. 0 until calibrated. */
    val z: Double,
    val tier: Tier,
    val calibrated: Boolean,
)

data class DailyIndex(
    /** 0–100, or null when the day can't be judged. */
    val value: Double?,
    val reason: String?,
    val verifiedShare: Double,
    val parts: Map<String, SignalScore>,
)

/** A settled day after scoring. Derived, never stored as truth. */
data class ScoredDay(
    val snapshot: DaySnapshot,
    /** Daily index rounded to 0.1, before outlier clipping (what the ledger shows). */
    val di: Double?,
    val verifiedShare: Double,
    /** True when an unverified spike was clipped to your personal ceiling. */
    val clipped: Boolean,
    /** Smoothed, rate-limited Life Score after this day. */
    val score: Double?,
)

data class Contributor(val signal: String, val points: Double)

/**
 * Intention model → per-signal scores against YOUR baseline → daily index →
 * outlier-safe smoothing → Life Score (plan §3–§5; prototype v2_20_engine.js).
 *
 * Pure: give it the history, get numbers back. History is oldest-first and
 * contains settled days only; today's live snapshot is passed separately.
 */
class ScoreEngine(
    private val rules: RulesConfig,
    private val intentions: IntentionSet,
) {
    private val baseline = rules.baseline
    private val score = rules.score

    // ---------------------------------------------------------------- weights

    /**
     * Normalised weights of scored signals; no signal above the share cap.
     *
     * The prototype capped and then renormalised, which let a heavy signal climb
     * back over 25% when few signals are scored. Here the excess is
     * redistributed (water-filling) until every share fits. Identical to the
     * prototype whenever nothing hits the cap, which includes the defaults.
     */
    fun weights(): Map<String, Double> {
        val scored = intentions.cards.filter { (k, c) -> c.isScored && intentions.def(k) != null }
        if (scored.isEmpty()) return emptyMap()
        val cap = rules.intention.maxSignalShare
        val raw = scored.mapValues { (_, c) -> c.weight.toDouble() }
        val fixed = LinkedHashMap<String, Double>()
        // With fewer than 1/cap signals the cap can't hold; coverage rules forbid that state.
        if (raw.size * cap < 1.0) return raw.mapValues { (_, w) -> w / raw.values.sum() }
        while (true) {
            val free = raw.filterKeys { it !in fixed }
            val budget = 1.0 - fixed.values.sum()
            val freeTotal = free.values.sum()
            val over = free.filter { (_, w) -> w / freeTotal * budget > cap + 1e-12 }
            if (over.isEmpty()) {
                return raw.keys.associateWith { k -> fixed[k] ?: (raw.getValue(k) / freeTotal * budget) }
            }
            over.keys.forEach { fixed[it] = cap }
        }
    }

    // ---------------------------------------------------------------- baselines

    /** Non-paused values of a signal in the long window ending before [uptoIdx]. */
    fun historyValues(key: String, history: List<DaySnapshot>, uptoIdx: Int? = null): List<Double> {
        val end = uptoIdx ?: history.size
        val start = max(0, end - baseline.longWindow)
        return (start until end).mapNotNull { i -> history[i].takeUnless { it.paused }?.value(key) }
    }

    data class Calibration(val daysWithData: Int, val done: Boolean, val daysLeft: Int)

    fun calibration(key: String, history: List<DaySnapshot>): Calibration {
        val n = history.count { !it.paused && it.value(key) != null }
        return Calibration(n, n >= baseline.calibDays, max(0, baseline.calibDays - n))
    }

    /** Easy / Stretch / Hard versus your last 28 valid days (plan §3.6 rule 3). */
    fun challenge(key: String, history: List<DaySnapshot>): ChallengeReading {
        val c = intentions.card(key)
        val vals = historyValues(key, history).takeLast(rules.intention.floorWindow)
        if (c == null || vals.size < baseline.minValid || c.direction !in setOf(Direction.MORE, Direction.LESS)) {
            return ChallengeReading(Challenge.NONE, 1.0, null, null)
        }
        val p50 = Stats.percentile(vals, 50.0)
        val p75 = Stats.percentile(vals, 75.0)
        val p25 = Stats.percentile(vals, 25.0)
        val t = c.target
        val label = if (c.direction == Direction.MORE) {
            if (t <= p50) Challenge.EASY else if (t <= p75) Challenge.STRETCH else Challenge.HARD
        } else {
            if (t >= p50) Challenge.EASY else if (t >= p25) Challenge.STRETCH else Challenge.HARD
        }
        val factor = when (label) {
            Challenge.EASY -> rules.intention.challengeEasy
            Challenge.HARD -> rules.intention.challengeHard
            else -> rules.intention.challengeStretch
        }
        val gap = if (p50 != 0.0) Stats.roundHalfUp((t - p50) / p50 * 100).toInt() else null
        return ChallengeReading(label, factor, gap, p50)
    }

    // ---------------------------------------------------------------- signal score

    /**
     * Half adherence (did you meet YOUR target), half trend (are you better than
     * your own normal). The trend half never sees the target, so easy targets
     * can't inflate it. [histIdx] null means "today, against all history".
     */
    fun signalScore(
        key: String,
        value: Double?,
        tier: Tier,
        type: DayType,
        history: List<DaySnapshot>,
        histIdx: Int?,
    ): SignalScore? {
        val c = intentions.card(key) ?: return null
        if (value == null || !c.isScored) return null
        val vals = historyValues(key, history, histIdx)
        val med = Stats.median(vals)
        val m = (Stats.mad(vals) * 1.4826).takeIf { it != 0.0 } ?: max(1.0, abs(med) * 0.15)
        val z = ((value - med) / m).coerceIn(-baseline.zClip, baseline.zClip)
        val t = c.targetFor(type)

        val adherence: Double
        var trend: Double
        when (c.direction) {
            Direction.MORE -> {
                adherence = if (t > 0) min(1.0, value / t) else 1.0
                trend = 50 + 20 * z
            }
            Direction.LESS -> {
                adherence = min(1.0, t / max(value, 0.0001))
                trend = 50 - 20 * z
            }
            else -> { // BAND: two-sided, like resting heart rate
                val lo = c.band?.start ?: (t * 0.8)
                val hi = c.band?.endInclusive ?: (t * 1.2)
                val w = max(1e-6, (hi - lo) / 2)
                adherence = if (value in lo..hi) 1.0 else max(0.0, 1 - (if (value < lo) lo - value else value - hi) / (2 * w))
                val mid = (lo + hi) / 2
                trend = 100 * exp(-((value - mid) / max(m, w)).pow(2) / 2)
            }
        }
        val challengeFactor = if (histIdx == null) challenge(key, history).factor else 1.0
        var adhScore = adherence * rules.tiers.multiplier(tier) * challengeFactor
        if (!tier.isVerified) adhScore = min(adhScore, rules.tiers.unverifiedCeiling)
        val calibrated = vals.size >= baseline.calibDays
        trend = if (calibrated) trend.coerceIn(0.0, 100.0) else 50.0
        return SignalScore(
            score = (50 * min(1.0, adhScore) + 0.5 * trend).coerceIn(0.0, 100.0),
            adherence = adherence,
            z = if (calibrated) z else 0.0,
            tier = tier,
            calibrated = calibrated,
        )
    }

    // ---------------------------------------------------------------- daily index

    /** Weighted mean of today's signal scores; null when under half the signals have data. */
    fun dailyIndex(snap: DaySnapshot, history: List<DaySnapshot>, histIdx: Int?): DailyIndex {
        val w = weights()
        if (snap.paused) return DailyIndex(null, "paused", 0.0, emptyMap())
        var have = 0
        var sum = 0.0
        var wsum = 0.0
        var verified = 0.0
        val parts = LinkedHashMap<String, SignalScore>()
        for ((k, wk) in w) {
            val v = snap.value(k) ?: continue
            val r = signalScore(k, v, snap.tier(k), snap.type, history, histIdx) ?: continue
            have++
            sum += wk * r.score
            wsum += wk
            parts[k] = r
            if (snap.tier(k).isVerified) verified += wk
        }
        if (w.isEmpty() || have.toDouble() / w.size < score.insufficientShare) {
            return DailyIndex(null, "insufficient data", 0.0, parts)
        }
        return DailyIndex(sum / wsum, null, if (wsum > 0) verified / wsum else 0.0, parts)
    }

    // ---------------------------------------------------------------- Life Score series

    /**
     * Outlier-safe, uncertainty-aware smoothing (plan §5.2–§5.4):
     * unverified spikes are clipped to your personal ceiling; the score is an
     * EWMA (half-life 7) that rises no faster than your own variability and
     * evidence justify, and falls faster than it rises.
     */
    fun series(history: List<DaySnapshot>): List<ScoredDay> {
        val out = ArrayList<ScoredDay>(history.size)
        val dis = ArrayList<Double>()
        var s: Double? = null
        val lambda = 0.5.pow(1.0 / score.halfLife)
        history.forEachIndexed { i, h ->
            val r = dailyIndex(h, history, i)
            val shownDi = r.value?.let { Stats.round1(it) }
            if (r.value == null) {
                out += ScoredDay(h, null, r.verifiedShare, false, s?.let { Stats.round1(it) })
                return@forEachIndexed
            }
            var di: Double = r.value
            var clipped = false
            val last = dis.takeLast(score.outlierWindow)
            if (last.size >= score.outlierMinDays) {
                val q1 = Stats.percentile(last, 25.0)
                val q3 = Stats.percentile(last, 75.0)
                val hi = Stats.percentile(last, 90.0) + score.outlierIQR * (q3 - q1)
                if (di > hi && r.verifiedShare < score.verifiedForOutlier) {
                    clipped = true
                    di = hi
                }
            }
            dis += di

            val win = dis.takeLast(score.ewmaWindow)
            var num = 0.0
            var den = 0.0
            win.forEachIndexed { j, x ->
                val wt = lambda.pow(win.size - 1 - j)
                num += x * wt
                den += wt
            }
            var raw = num / den
            val n = dis.size
            if (n < score.warmupDays) raw = (n * raw + (score.warmupDays - n) * 50) / score.warmupDays

            val prev = s
            s = if (prev == null) {
                raw
            } else {
                val sigma = Stats.mad(dis.takeLast(score.outlierWindow)) * 1.4826
                val from = max(0, i - (score.confidenceDays - 1))
                val vsSum = (from..i).sumOf { idx -> if (idx == i) r.verifiedShare else out[idx].verifiedShare }
                val vs = vsSum / min(score.confidenceDays, i + 1)
                val conf = min(1.0, n.toDouble() / score.confidenceDays) * sqrt(max(0.05, vs))
                val maxRise = max(score.riseMin, score.riseSigma * sigma) * conf
                val maxFall = max(score.fallMin, score.fallSigma * sigma)
                raw.coerceIn(prev - maxFall, prev + maxRise)
            }
            out += ScoredDay(h, shownDi, r.verifiedShare, clipped, Stats.round1(s!!))
        }
        return out
    }

    /** No headline until enough scored signals have finished calibrating. */
    fun headlineReady(history: List<DaySnapshot>): Boolean =
        weights().keys.count { calibration(it, history).done } >= score.calibSignalsForHeadline

    fun verifiedShare(scored: List<ScoredDay>, days: Int = 28): Double {
        val last = scored.takeLast(days)
        return if (last.isEmpty()) 0.0 else last.sumOf { it.verifiedShare } / last.size
    }

    /** Words, not judgement. Elite needs a mostly verified month. */
    fun band(lifeScore: Int?, verifiedShare28: Double): Band = when {
        lifeScore == null -> Band.CALIBRATING
        lifeScore >= 90 -> if (verifiedShare28 >= score.eliteVerified) Band.ELITE else Band.STRONG
        lifeScore >= 75 -> Band.STRONG
        lifeScore >= 60 -> Band.GOOD
        lifeScore >= 40 -> Band.STEADY
        else -> Band.REBUILDING
    }

    /** Each signal's push over the last [days] days, in points against a neutral 50. */
    fun contributors(history: List<DaySnapshot>, days: Int = 7): List<Contributor> {
        val w = weights()
        val start = max(0, history.size - days)
        return w.mapNotNull { (k, wk) ->
            val sc = (start until history.size).mapNotNull { i ->
                val h = history[i]
                signalScore(k, h.value(k), h.tier(k), h.type, history, i)?.score
            }
            if (sc.isEmpty()) null else Contributor(k, Stats.roundHalfUp((sc.average() - 50) * wk * 10) / 10.0)
        }.sortedByDescending { it.points }
    }

    /** "Move it today": what a change to today's snapshot would add to today's index. */
    fun projectedGain(today: DaySnapshot, history: List<DaySnapshot>, change: (DaySnapshot) -> DaySnapshot): Double {
        val base = dailyIndex(today, history, null).value ?: return 0.0
        val next = dailyIndex(change(today), history, null).value ?: return 0.0
        return Stats.round1(next - base)
    }
}

enum class Band(val label: String) {
    CALIBRATING("Calibrating"),
    REBUILDING("Rebuilding"),
    STEADY("Steady"),
    GOOD("Good"),
    STRONG("Strong"),
    ELITE("Elite"),
}
