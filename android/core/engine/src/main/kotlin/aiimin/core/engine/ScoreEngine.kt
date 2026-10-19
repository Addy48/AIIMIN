package aiimin.core.engine

import kotlin.math.abs
import kotlin.math.exp
import kotlin.math.ln
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
    /** The Life Score shown after this day (conservative while the range is wide, §9.2.7). */
    val score: Double?,
    /** Raw level before the conservative display adjustment. */
    val level: Double? = score,
    /** Form (≈7-day) minus base (≈42-day): Rising ≥ +3, Slipping ≤ −3. */
    val momentum: Double = 0.0,
    /** Range (uncertainty) in points; shown as ± while above 3. */
    val range: Double = 15.0,
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

    /** Every non-paused value of a signal before [uptoIdx] (all of history when null), oldest first. */
    private fun allBefore(key: String, history: List<DaySnapshot>, uptoIdx: Int?): List<Double> {
        val end = uptoIdx ?: history.size
        return (0 until end).mapNotNull { i -> history[i].takeUnless { it.paused }?.value(key) }
    }

    /**
     * Score Engine 3 (plan §9.2): points anchored at YOUR target (meeting it = 70), a personal
     * stretch anchor above it, then credit — good news shrinks toward 50 with weaker evidence and
     * easier targets; bad news is believed as it is. [histIdx] null means "today, against all history".
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
        val hist = allBefore(key, history, histIdx)
        val t = c.targetFor(type)
        val pts: Double
        val ch: Double
        val adherence: Double
        when (c.direction) {
            Direction.BAND -> {
                val lo = c.band?.start ?: (t * 0.8)
                val hi = c.band?.endInclusive ?: (t * 1.2)
                pts = Score3.bandPoints(value, lo, hi)
                ch = 1.0
                adherence = if (value in lo..hi) 1.0 else pts / 80.0
            }
            Direction.MORE, Direction.LESS -> {
                val more = c.direction == Direction.MORE
                pts = Score3.points(more, value, t, hist)
                ch = Score3.challenge(Score3.targetRank(more, t, hist))
                adherence = if (more) (if (t > 0) min(1.0, value / t) else 1.0) else min(1.0, t / max(value, 1e-6))
            }
            else -> return null
        }
        val credited = Score3.credit(pts, rules.tiers.multiplier(tier), ch)
        val calibrated = hist.size >= baseline.calibDays
        val med = Stats.median(hist.takeLast(baseline.longWindow))
        val m = (Stats.mad(hist.takeLast(baseline.longWindow)) * 1.4826).takeIf { it != 0.0 } ?: max(1.0, abs(med) * 0.15)
        val z = if (calibrated) ((value - med) / m).coerceIn(-baseline.zClip, baseline.zClip) else 0.0
        return SignalScore(score = credited.coerceIn(0.0, 100.0), adherence = adherence, z = z, tier = tier, calibrated = calibrated)
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
     * Level, momentum and range (plan §9.2.5–7): level moves a seventh of the way to each day's
     * index (half-life 7 days), at most 3 points a day (5 while uncertain); exceptional unverified
     * days count as your ceiling; falls are halved when far below your 90-day high. Paused or
     * insufficient days don't move the level; the range grows a little.
     */
    fun series(history: List<DaySnapshot>): List<ScoredDay> {
        val out = ArrayList<ScoredDay>(history.size)
        val lv = Score3.Level()
        history.forEachIndexed { i, h ->
            val r = dailyIndex(h, history, i)
            if (r.value == null) {
                lv.settle(null, 0.0)
                out += ScoredDay(h, null, r.verifiedShare, false, lv.shown()?.let(Stats::round1), lv.level?.let(Stats::round1), lv.momentum(), lv.phi)
                return@forEachIndexed
            }
            val clipped = lv.settle(r.value, r.verifiedShare)
            out += ScoredDay(h, Stats.round1(r.value), r.verifiedShare, clipped, lv.shown()?.let(Stats::round1), lv.level?.let(Stats::round1), lv.momentum(), lv.phi)
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

    /** Words, not judgement (§9.8 bands). Peak needs a mostly verified month. */
    fun band(lifeScore: Int?, verifiedShare28: Double): Band = when {
        lifeScore == null -> Band.CALIBRATING
        lifeScore >= 80 -> if (verifiedShare28 >= score.eliteVerified) Band.PEAK else Band.STRONG
        lifeScore >= 72 -> Band.STRONG
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
    PEAK("Peak"),
}

/** Score Engine 3 math, kept pure and separate so the EV1–EV12 vectors can test it directly. */
object Score3 {
    const val AT_TARGET = 70.0
    private const val GAMMA = 0.8
    private val K = ln(4.0)

    /** Stretch anchor: halfway from 1.25·T to your own P90 (or 1.10·T) at 14 days, mostly yours by 60. */
    fun stretch(more: Boolean, t: Double, hist: List<Double>): Double {
        val n = hist.size.toDouble()
        val w = n / (n + 14.0)
        val last = hist.takeLast(90)
        return if (more) {
            val d = 1.25 * t
            val p = max(if (last.isEmpty()) d else Stats.percentile(last, 90.0), 1.10 * t)
            d * (1 - w) + p * w
        } else {
            val d = 0.75 * t
            val p = min(if (last.isEmpty()) d else Stats.percentile(last, 10.0), 0.90 * t)
            d * (1 - w) + p * w
        }
    }

    fun points(more: Boolean, x: Double, t: Double, hist: List<Double>): Double {
        if (t <= 0) return if (more) AT_TARGET else 100.0
        val h = stretch(more, t, hist)
        return if (more) {
            if (x <= t) AT_TARGET * (max(x, 0.0) / t).pow(GAMMA)
            else AT_TARGET + 30 * (1 - exp(-K * (x - t) / max(1e-6, h - t)))
        } else {
            if (x >= t) AT_TARGET * (t / max(x, 1e-6)).pow(GAMMA)
            else AT_TARGET + 30 * (1 - exp(-K * (t - x) / max(1e-6, t - h)))
        }
    }

    fun bandPoints(x: Double, lo: Double, hi: Double): Double {
        val mid = (lo + hi) / 2
        val hw = max(1e-6, (hi - lo) / 2)
        if (x in lo..hi) return 80 + 20 * (1 - abs(x - mid) / hw)
        val d = if (x < lo) lo - x else x - hi
        return 80 * exp(-0.5 * (d / hw).pow(2))
    }

    /** Where the target sits in your last 28 values (0..1, higher = harder). */
    fun targetRank(more: Boolean, t: Double, hist: List<Double>): Double {
        if (hist.size < 7) return 0.6
        val h = hist.takeLast(28)
        val r = (h.count { it < t } + 0.5 * h.count { it == t }) / h.size
        return if (more) r else 1 - r
    }

    fun challenge(r: Double): Double = when {
        r <= 0.4 -> 0.6
        r <= 0.6 -> 0.6 + (r - 0.4) / 0.2 * 0.4
        else -> min(1.1, 1.0 + (r - 0.6) / 0.3 * 0.1)
    }

    fun credit(p: Double, tier: Double, challenge: Double): Double = if (p <= 50) p else min(100.0, 50 + (p - 50) * tier * challenge)

    /** The level state machine of the reference implementation. */
    class Level {
        var base: Double? = null; private set
        var form: Double? = null; private set
        var level: Double? = null; private set
        var n = 0; private set
        var phi = 15.0; private set
        private val hist = ArrayList<Double>()
        private val highs = ArrayList<Double>()

        /** Returns true when the day was clipped as an exceptional unverified spike. */
        fun settle(diIn: Double?, verified: Double): Boolean {
            if (diIn == null) { phi = min(15.0, sqrt(phi * phi + 1.0)); return false }
            var di = diIn
            var clipped = false
            if (hist.size >= 14) {
                val w = hist.takeLast(60)
                val hi = Stats.percentile(w, 90.0) + 1.5 * (Stats.percentile(w, 75.0) - Stats.percentile(w, 25.0))
                if (di > hi && verified < 0.6) { di = hi; clipped = true }
            }
            hist += di
            n++
            val l = level
            if (l == null) {
                base = di; form = di; level = di
            } else {
                base = base!! + (2.0 / 43) * (di - base!!)
                form = form!! + (2.0 / 8) * (di - form!!)
                val target = l + (1 - 2.0.pow(-1.0 / 7)) * (di - l)
                val cap = if (phi > 8) 5.0 else 3.0
                var move = (target - l).coerceIn(-cap, cap)
                val high = if (highs.isEmpty()) l else highs.takeLast(90).max()
                if (move < 0 && l < high - 6) move *= 0.5
                level = l + move
            }
            highs += level!!
            val w = 0.4 + 0.6 * verified
            phi = sqrt(1 / (1 / (phi * phi + 0.25) + w / 144.0))
            return clipped
        }

        fun momentum(): Double = form?.let { it - base!! } ?: 0.0

        /** Conservative for the first 30 scored days, so the number rises as it learns. */
        fun shown(): Double? = level?.let { it - if (n < 30) 1.5 * phi else 0.0 }
    }
}
