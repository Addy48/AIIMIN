package aiimin.core.engine

import java.time.LocalDate
import kotlin.math.min
import kotlin.math.pow

enum class Priority { HIGH, NORMAL, LOW }

/**
 * What can earn XP. Effort and outcomes only (plan, approved decisions):
 * finishing what you chose and verified effort. [Created] exists so callers can
 * pass every behaviour through one door — it always earns zero.
 */
sealed interface XpEvent {
    data class TaskCompleted(val planned: Boolean, val priority: Priority) : XpEvent
    data class MinimumKept(val firstTimeToday: Boolean) : XpEvent
    data class FocusSession(val minutes: Int) : XpEvent
    data class DrillCompleted(val correct: Int, val firstTimeToday: Boolean) : XpEvent
    data class JournalSettled(val passedQualityGate: Boolean) : XpEvent
    data object GoalCompleted : XpEvent
    data object PaymentReconciled : XpEvent
    data class Created(val what: String) : XpEvent
}

data class XpState(
    val level: Int,
    /** XP inside the current level. */
    val xp: Int,
    val xpToNext: Int,
    val day: LocalDate?,
    val dayTotal: Int,
    val showedUpToday: Boolean,
) {
    companion object {
        fun fresh(): XpState = XpState(level = 1, xp = 0, xpToNext = XpPolicy.xpToNext(1), day = null, dayTotal = 0, showedUpToday = false)
    }
}

data class XpAward(val state: XpState, val awarded: Int, val leveledUp: Boolean)

/** XP is progression only. It never feeds the Life Score or the leaderboard. */
class XpPolicy(private val rules: RulesConfig) {

    private val r = rules.xp

    fun baseFor(event: XpEvent): Int = when (event) {
        is XpEvent.TaskCompleted -> if (!event.planned) {
            r.taskUnplanned
        } else {
            when (event.priority) {
                Priority.HIGH -> r.taskHigh
                Priority.NORMAL -> r.taskNormal
                Priority.LOW -> r.taskLow
            }
        }
        is XpEvent.MinimumKept -> if (event.firstTimeToday) 10 else 0
        is XpEvent.FocusSession -> if (event.minutes < rules.focus.minSession) 0 else min(180, event.minutes * 4)
        is XpEvent.DrillCompleted -> if (event.firstTimeToday) 30 + event.correct * 10 else 0
        is XpEvent.JournalSettled -> if (event.passedQualityGate) 25 else 0
        XpEvent.GoalCompleted -> 50
        XpEvent.PaymentReconciled -> 3
        is XpEvent.Created -> 0
    }

    fun award(state: XpState, event: XpEvent, today: LocalDate): XpAward = award(state, baseFor(event), today)

    /** One small "showed up" bonus per day; above the soft cap extra XP counts at 25%. */
    fun award(state: XpState, base: Int, today: LocalDate): XpAward {
        if (base <= 0) return XpAward(state, 0, false)
        var s = if (state.day == today) state else state.copy(day = today, dayTotal = 0, showedUpToday = false)
        var n = base
        if (!s.showedUpToday) {
            s = s.copy(showedUpToday = true)
            n += r.showedUp
        }
        val award = when {
            s.dayTotal >= r.dailySoftCap -> Stats.roundHalfUp(n * r.overCapMult).toInt()
            s.dayTotal + n > r.dailySoftCap -> {
                val under = r.dailySoftCap - s.dayTotal
                under + Stats.roundHalfUp((n - under) * r.overCapMult).toInt()
            }
            else -> n
        }
        var level = s.level
        var xp = s.xp + award
        var next = s.xpToNext
        var leveled = false
        while (xp >= next) {
            xp -= next
            level++
            next = xpToNext(level)
            leveled = true
        }
        return XpAward(s.copy(level = level, xp = xp, xpToNext = next, dayTotal = s.dayTotal + award), award, leveled)
    }

    /** Clawback when an outcome is reversed (untick, undo). Never drops a level. */
    fun reverse(state: XpState, amount: Int): XpState = state.copy(
        xp = (state.xp - amount).coerceAtLeast(0),
        dayTotal = (state.dayTotal - amount).coerceAtLeast(0),
    )

    companion object {
        fun xpToNext(level: Int): Int = Stats.roundHalfUp(500 * (level + 1.0).pow(1.35)).toInt()
    }
}
