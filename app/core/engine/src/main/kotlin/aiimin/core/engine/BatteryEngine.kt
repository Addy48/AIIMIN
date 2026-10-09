package aiimin.core.engine

import kotlin.math.max
import kotlin.math.min

enum class BatteryState { OK, LOW, COMEBACK }

data class Battery(
    val value: Int,
    val mode: BatteryMode,
    val state: BatteryState,
    /** Progress through the 3-day comeback quest. */
    val comebackDays: Int,
    val knockouts: Int,
)

/**
 * Discipline Battery (plan §7, Option A). Bounded, recoverable, never deletes:
 * gains lead, the first miss each week is free, daily loss is capped, damage is
 * halved when low, and zero starts a comeback quest instead of a knockout.
 * Not part of the Life Score.
 */
class BatteryEngine(private val rules: RulesConfig) {

    private val r = rules.battery

    /** [keptDays] aligns with [days] (from [StreakEngine]); missing entries count as not kept. */
    fun compute(days: List<DaySnapshot>, keptDays: List<Boolean>, mode: BatteryMode): Battery {
        val from = max(0, days.size - r.window)
        var hp = r.start
        var comebackMode = false
        var comeback = 0
        var freeMissUsedOn = -99
        var knockouts = 0
        val miss = r.miss.getValue(mode)
        val cap = r.lossCap.getValue(mode)

        for (i in 0 until days.size - from) {
            val h = days[from + i]
            if (h.paused) continue
            val t = h.minimums
            if (comebackMode) {
                comeback = if (t.kept >= 1) comeback + 1 else 0
                if (comeback >= r.comebackDays) {
                    comebackMode = false
                    hp = r.comebackTo
                    comeback = 0
                }
                continue
            }
            val dayKept = keptDays.getOrNull(from + i) == true
            val gain = min(
                r.gainMax,
                t.keptWithProof * r.gainA + (t.kept - t.keptWithProof) * r.gainC + if (dayKept) r.dayBonus else 0,
            )
            var misses = max(0, t.planned - t.kept)
            if (misses > 0 && i - freeMissUsedOn >= r.freeMissEveryDays && mode != BatteryMode.HARDCORE) {
                misses--
                freeMissUsedOn = i
            }
            var loss = misses * miss
            if (h.light) loss = max(loss, r.lightDayMaxLoss)
            if (hp < r.lowBattery) loss = Stats.roundHalfUp(loss / 2.0).toInt()
            loss = max(loss, cap)
            hp = (hp + gain + loss).coerceIn(0, 100)
            if (hp <= 0) {
                if (mode == BatteryMode.GENTLE) {
                    hp = r.gentleFloor
                } else {
                    comebackMode = true
                    comeback = 0
                    knockouts++
                }
            }
        }
        val state = when {
            comebackMode -> BatteryState.COMEBACK
            hp < r.lowBattery -> BatteryState.LOW
            else -> BatteryState.OK
        }
        return Battery(hp, mode, state, comeback, knockouts)
    }
}
