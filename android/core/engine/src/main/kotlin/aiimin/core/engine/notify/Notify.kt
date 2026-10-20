package aiimin.core.engine.notify

/**
 * Notification engine v2 (PRD 2.1): promises always arrive; nudges are earned. Pure and tested; the data
 * layer builds the snapshot and delivers the decisions. Nothing here leaves the phone.
 */

/** The eight Android channels (master plan 14.2); each can be switched off on its own. */
enum class Category(val channelId: String, val label: String) {
    REMINDERS("aiimin_reminders", "Your reminders"),
    DAY("aiimin_day", "Your day"),
    MONEY("aiimin_money", "Money"),
    VAULT("aiimin_vault", "Documents & family"),
    INSIGHTS("aiimin_insights", "Insights"),
    SECURITY("aiimin_security", "Account & security"),
    FOCUS("aiimin_focus", "Focus timer"),
    DIGEST("aiimin_digest", "Morning and evening"),
}

/**
 * PROMISE: what the person set or must know (reminders, events, bills due, document expiry); never capped or
 * delayed. CRITICAL: security and emergency; also ignores quiet hours. NUDGE: earned, capped, spaced.
 * INFO: inbox and Today only.
 */
enum class Kind { PROMISE, CRITICAL, NUDGE, INFO }

enum class Delivery { POST_NOW, SCHEDULE, IN_APP, DIGEST }

data class NotifyAction(val id: String, val label: String)

data class Candidate(
    val rule: String,
    /** Dedupe key: the same key is delivered once. */
    val key: String,
    val kind: Kind,
    val category: Category,
    /** Minute of the day it is due (≤ now = due now). */
    val atMinute: Int,
    val priority: Int,
    val title: String,
    val body: String,
    val route: String,
    val routeArg: String? = null,
    val actions: List<NotifyAction> = emptyList(),
    /** One plain sentence for "Why am I seeing this?". */
    val why: String = "",
    /** Names money or documents: hidden on the lock screen unless the person turns details on. */
    val sensitive: Boolean = false,
)

data class Decision(val candidate: Candidate, val delivery: Delivery, val atMinute: Int = candidate.atMinute, val silent: Boolean = false)

/** One delivered nudge in the log: its category, the day index it was shown, and whether it was opened. */
data class NudgeOutcome(val category: Category, val day: Int, val opened: Boolean)

object NudgeBudget {
    const val START = 1
    const val OPENS_PER_STEP = 3
    const val DEFAULT_CEILING = 4
    val CEILING_RANGE = 2..6
    const val IGNORED_TO_ASK = 3

    /** Nudges allowed today: 1 to start, one more for every 3 opened, up to the ceiling (2.1). */
    fun allowance(openedNudges: Int, ceiling: Int): Int =
        (START + openedNudges / OPENS_PER_STEP).coerceAtMost(ceiling.coerceIn(CEILING_RANGE))

    /**
     * The category to ask "Stop these?" about: the last three nudges shown in it were all left unopened, and it
     * has not been answered. Oldest first in [history].
     */
    fun stopAsk(history: List<NudgeOutcome>, answered: Set<Category>): Category? =
        history.groupBy { it.category }.entries
            .filter { (c, list) -> c !in answered && list.size >= IGNORED_TO_ASK && list.takeLast(IGNORED_TO_ASK).none { it.opened } }
            .maxByOrNull { (_, list) -> list.last().day }?.key
}

data class PolicyContext(
    val nowMinute: Int,
    val quietFrom: Int,
    val quietTo: Int,
    val quietOn: Boolean = true,
    /** POST_NOTIFICATIONS granted and notifications on for the app. */
    val allowed: Boolean = true,
    /** Channels switched off in Android: their content goes to the inbox (2.1 "Muted phone"). */
    val channelsOff: Set<Category> = emptySet(),
    /** Categories the person stopped ("Stop these?") or switched off in AIIMIN's settings. */
    val stopped: Set<Category> = emptySet(),
    val nudgesShownToday: Int = 0,
    val allowance: Int = NudgeBudget.START,
    /** Minute the last nudge was shown today, or null. */
    val lastNudgeMinute: Int? = null,
    val spacingMinutes: Int = 180,
)

object NotifyPolicy {
    fun quiet(min: Int, from: Int, to: Int): Boolean = if (from <= to) min in from until to else min >= from || min < to

    fun decide(cands: List<Candidate>, ctx: PolicyContext): List<Decision> {
        var slots = (ctx.allowance - ctx.nudgesShownToday).coerceAtLeast(0)
        var last = ctx.lastNudgeMinute
        val isQuiet = ctx.quietOn && quiet(ctx.nowMinute, ctx.quietFrom, ctx.quietTo)
        return cands.sortedWith(compareByDescending<Candidate> { it.priority }.thenBy { it.atMinute }).map { c ->
            val future = c.atMinute > ctx.nowMinute
            when {
                !ctx.allowed || c.category in ctx.channelsOff -> Decision(c, if (future) Delivery.SCHEDULE else Delivery.IN_APP)
                c.kind == Kind.CRITICAL -> Decision(c, if (future) Delivery.SCHEDULE else Delivery.POST_NOW)
                // Promises are never capped or delayed; in quiet hours they arrive without sound.
                c.kind == Kind.PROMISE -> Decision(c, if (future) Delivery.SCHEDULE else Delivery.POST_NOW, silent = isQuiet)
                c.kind == Kind.INFO -> Decision(c, Delivery.IN_APP)
                c.category in ctx.stopped -> Decision(c, Delivery.IN_APP)
                future -> Decision(c, Delivery.SCHEDULE)
                isQuiet -> Decision(c, Delivery.IN_APP)
                slots == 0 -> Decision(c, Delivery.DIGEST)
                // No more than one nudge within 3 hours of another: wait, or fold into the evening wrap-up.
                last != null && ctx.nowMinute - last!! < ctx.spacingMinutes -> {
                    val next = last!! + ctx.spacingMinutes
                    if (ctx.quietOn && quiet(next, ctx.quietFrom, ctx.quietTo) || next >= 24 * 60) Decision(c, Delivery.DIGEST)
                    else Decision(c, Delivery.SCHEDULE, atMinute = next)
                }
                else -> { slots--; last = ctx.nowMinute; Decision(c, Delivery.POST_NOW) }
            }
        }
    }
}

/** When a kind of notice is opened, learned on the phone (2.1 "Timing"); fixed hours until two weeks of history. */
object NotifyTiming {
    const val MIN_DAYS = 14
    const val MIN_OPENS = 5

    fun bestMinute(openedMinutes: List<Int>, historyDays: Int, default: Int, window: IntRange): Int {
        if (historyDays < MIN_DAYS || openedMinutes.size < MIN_OPENS) return default.coerceIn(window)
        val s = openedMinutes.sorted()
        return s[s.size / 2].coerceIn(window)
    }
}
