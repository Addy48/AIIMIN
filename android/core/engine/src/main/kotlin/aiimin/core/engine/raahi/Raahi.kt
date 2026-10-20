package aiimin.core.engine.raahi

import java.time.LocalDate
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit

/**
 * Raahi, the companion (PRD 1.1, 1.6b, 13, 20). Pure rules only: which mode, which pose, which greeting and
 * whether a motion may play. Fixed strings, never generated, so it works offline and sends nothing.
 */
enum class RaahiMode { FULL, QUIET, OFF;
    companion object { fun of(raw: String?): RaahiMode = entries.firstOrNull { it.name == raw } ?: QUIET }
}

/**
 * The poses in the asset pack (Part 20.2). There is no sad, hungry, disappointed or crying pose, by rule (20.5);
 * [RaahiPoseTest] fails if one is ever added. [key] is the file name part: `raahi_pose_<key>_<size>`.
 */
enum class RaahiPose(val key: String) {
    IDLE("idle"), WAKING("waking_stretch"), THINKING("thinking"), NOTICING("noticing"), SETTLE("settle"),
    SLEEPING("sleeping"), LISTENING("listening"), WALKING("walking"), WAVING("waving"), NODDING("nodding"),
    POINTING("pointing"), SATCHEL_OPEN("satchel_open"), HOLDING_POSTCARD("holding_postcard"),
    QUIET_CELEBRATION("quiet_celebration"),
}

/** The two scenes (Part 20.2, poses 14 and 16): drawn as a whole picture, only at card and hero size. */
enum class RaahiScene(val key: String) { SITTING_SUNSET("sitting_sunset"), HOLDING_LANTERN("holding_lantern") }

/** One played motion (Part 20.3). The breathing loops are not counted; they only run in Full. */
enum class RaahiMotion { WAKE, NOD, NOTICE, SETTLE, WAVE, HOP, POSE_CHANGE }

/** The day's motion count, stored as "yyyy-MM-dd|motions|hops". */
data class RaahiBudget(val day: LocalDate?, val motions: Int = 0, val hops: Int = 0) {
    fun encode(): String = "${day ?: ""}|$motions|$hops"
    companion object {
        fun decode(raw: String?): RaahiBudget = raw?.split('|')?.takeIf { it.size == 3 }?.let {
            RaahiBudget(runCatching { LocalDate.parse(it[0]) }.getOrNull(), it[1].toIntOrNull() ?: 0, it[2].toIntOrNull() ?: 0)
        } ?: RaahiBudget(null)
    }
}

object RaahiRules {
    /** Quiet: at most 3 motions a day (1.1). */
    const val QUIET_MOTIONS_PER_DAY = 3
    /** The small hop for firsts: at most twice a day in any mode (20.3). */
    const val HOPS_PER_DAY = 2

    /** Off hides the art everywhere (the name and voice stay, 1.1). */
    fun showsArt(mode: RaahiMode) = mode != RaahiMode.OFF

    /** The breathing and sway loops run in Full only, and never with reduce motion. */
    fun loops(mode: RaahiMode, reduceMotion: Boolean) = mode == RaahiMode.FULL && !reduceMotion

    /**
     * May this motion play now? Returns the decision and the budget to store. Reduce motion and Off never play
     * (static art instead, 1.6 and 20.3); Quiet stops after three a day; the hop stops after two a day.
     */
    fun play(mode: RaahiMode, reduceMotion: Boolean, today: LocalDate, budget: RaahiBudget, motion: RaahiMotion): Pair<Boolean, RaahiBudget> {
        val b = if (budget.day == today) budget else RaahiBudget(today)
        if (mode == RaahiMode.OFF || reduceMotion) return false to b
        if (motion == RaahiMotion.HOP && b.hops >= HOPS_PER_DAY) return false to b
        if (mode == RaahiMode.QUIET && b.motions >= QUIET_MOTIONS_PER_DAY) return false to b
        return true to b.copy(motions = b.motions + 1, hops = b.hops + if (motion == RaahiMotion.HOP) 1 else 0)
    }
}

/** What Today knows when it picks Raahi Mini's pose beside the clock (20.2). */
data class MiniState(
    val hour: Int,
    val firstOpenToday: Boolean,
    val dayClosed: Boolean,
    val afterDayEnd: Boolean,
    val nothingLeft: Boolean,
    val allMinimumsKept: Boolean,
    val needsAttention: Boolean,
)

object RaahiMini {
    /** Poses the 28 dp Mini may use (20.4: poses 1 to 8 and 10; the sunset scene is too detailed at 28 dp). */
    val POSES = setOf(
        RaahiPose.IDLE, RaahiPose.WAKING, RaahiPose.THINKING, RaahiPose.NOTICING, RaahiPose.SETTLE,
        RaahiPose.SLEEPING, RaahiPose.LISTENING, RaahiPose.WALKING, RaahiPose.NODDING,
    )

    fun pose(s: MiniState): RaahiPose = when {
        s.afterDayEnd && (s.nothingLeft || s.dayClosed) -> RaahiPose.SLEEPING
        s.dayClosed || s.allMinimumsKept -> RaahiPose.SETTLE
        s.needsAttention -> RaahiPose.NOTICING
        s.firstOpenToday && s.hour in 5..11 -> RaahiPose.WAKING
        else -> RaahiPose.IDLE
    }
}

/** Everything the greeting may use (1.6b): first name and minimum count only, both already on the phone. */
data class GreetInput(
    val mode: RaahiMode,
    val now: LocalDateTime,
    val firstName: String,
    /** The last day the app was opened before today; null on the very first open after onboarding. */
    val lastOpenDay: LocalDate?,
    /** A greeting already showed on an earlier open today. */
    val greetedToday: Boolean,
    /** The name was already used in a line today (at most one line a day uses it). */
    val nameUsedToday: Boolean,
    val dayClosedToday: Boolean,
    val minimumsToday: Int,
    val newDevice: Boolean = false,
    /** Full mode only: a first worth one more line. */
    val first: RaahiFirst? = null,
    /** The late-night hour from Settings (22, 23 or 0). */
    val lateHour: Int = 23,
)

/** Firsts that earn Full mode's second line (1.6b), with their fixed wording. */
enum class RaahiFirst(val line: String) {
    FIRST_DOCUMENT("Your first document is in the Vault."),
    FIRST_WEEK("One week in. Start small, keep going."),
}

data class Greeting(val lines: List<String>, val usedName: Boolean, val pose: RaahiPose?) {
    companion object { val NONE = Greeting(emptyList(), false, null) }
}

object RaahiGreeting {
    data class Variant(val text: String, val named: Boolean = false)

    private fun v(text: String) = Variant(text, text.contains("{name}"))

    // Fixed strings from 1.6b and 13.3. 12 words or fewer, no guilt words (13.2); tests check both.
    val FIRST = listOf(v("Hi {name}. Let's start small."), v("Hello. One thing at a time."))
    val NEW_DEVICE = listOf(v("Welcome back, {name}. Your data is syncing."), v("Welcome back. Your data is syncing."))
    val AWAY_LONG = listOf(v("Welcome back. No catch-up needed. Start with today."), v("Welcome back. Start with today."), v("No catch-up needed."))
    val AWAY_SHORT = listOf(v("Welcome back, {name}."), v("Good to see you."))
    val DAY_CLOSED = listOf(v("Day closed. Rest well."), v("That's today."))
    val LATE = listOf(v("Still up? That's fine."), v("It's late. One last thing, or rest."))
    val MORNING = listOf(v("Good morning, {name}."), v("Morning. {n} minimums today."), v("A fresh page."))
    val AFTERNOON = listOf(v("Good afternoon."), v("Good afternoon, {name}."))
    val EVENING = listOf(v("Good evening, {name}."), v("Evening. Whenever you're ready."))

    val ALL: List<String> get() = (FIRST + NEW_DEVICE + AWAY_LONG + AWAY_SHORT + DAY_CLOSED + LATE + MORNING + AFTERNOON + EVENING).map { it.text } + RaahiFirst.entries.map { it.line }

    /** One line per open in Quiet, up to two in Full (a first), none when Off; nothing on later opens the same day. */
    fun pick(i: GreetInput): Greeting {
        if (i.mode == RaahiMode.OFF) return Greeting.NONE
        val today = i.now.toLocalDate()
        val firstLine = if (i.greetedToday) null else primary(i, today)
        val extra = if (i.mode == RaahiMode.FULL) i.first?.line else null
        val lines = listOfNotNull(firstLine?.first, extra)
        if (lines.isEmpty()) return Greeting.NONE
        val pose = when {
            firstLine == null -> RaahiPose.QUIET_CELEBRATION
            i.lastOpenDay != null && ChronoUnit.DAYS.between(i.lastOpenDay, today) >= 2 -> RaahiPose.WAVING
            i.lastOpenDay == null -> RaahiPose.WAVING
            else -> null
        }
        return Greeting(lines, firstLine?.second == true, pose)
    }

    private fun primary(i: GreetInput, today: LocalDate): Pair<String, Boolean>? {
        val away = i.lastOpenDay?.let { ChronoUnit.DAYS.between(it, today) } ?: 0
        val h = i.now.hour
        val late = h < 4 || (i.lateHour in 1..23 && h >= i.lateHour)
        val bank = when {
            i.newDevice -> NEW_DEVICE
            i.lastOpenDay == null -> FIRST
            away >= 7 -> AWAY_LONG
            away >= 2 -> AWAY_SHORT
            i.dayClosedToday -> DAY_CLOSED
            late -> LATE
            h < 12 -> MORNING
            h < 17 -> AFTERNOON
            else -> EVENING
        }
        val nameOk = i.firstName.isNotBlank() && !i.nameUsedToday
        val choices = bank.filter { (nameOk || !it.named) && (i.minimumsToday > 0 || !it.text.contains("{n}")) }
        if (choices.isEmpty()) return null
        // Rotate by day, so the line changes from one day to the next but not between opens of the same day.
        val pick = choices[Math.floorMod(today.toEpochDay(), choices.size.toLong()).toInt()]
        val text = pick.text.replace("{name}", i.firstName.trim()).replace("{n} minimums", if (i.minimumsToday == 1) "1 minimum" else "${i.minimumsToday} minimums")
        return text to pick.named
    }
}
