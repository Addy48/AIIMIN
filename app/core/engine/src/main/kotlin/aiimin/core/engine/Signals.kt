package aiimin.core.engine

import java.time.LocalDate

/** How a value was obtained (plan §4). Observed beats claimed. */
enum class Tier { A, B, C, D;

    val isVerified: Boolean get() = this == A || this == B

    /** One tier lower — used for backfills ("this was for yesterday"). */
    fun lower(): Tier = when (this) {
        A -> B
        B -> C
        C, D -> D
    }
}

/** What a signal means for this person (plan §3.2). */
enum class Direction(val label: String, val scored: Boolean) {
    MORE("More is better", true),
    LESS("Less is better", true),
    BAND("Target range", true),
    TRACK("Track only", false),
    OFF("Not relevant", false),
}

enum class DayType { WORK, REST, SHIFT }

enum class BatteryMode { GENTLE, STANDARD, HARDCORE }

/** A user-nameable group of signals. Built-ins below; users may add up to 7. */
data class Domain(val key: String, val name: String) {
    companion object {
        val BODY = Domain("body", "Body")
        val CRAFT = Domain("craft", "Work / Craft")
        val MIND = Domain("mind", "Mind")
        val MONEY = Domain("money", "Money")
        val PEOPLE = Domain("people", "People")
        val DISCIPLINE = Domain("discipline", "Discipline")
        val BUILT_IN = listOf(BODY, CRAFT, MIND, MONEY, PEOPLE, DISCIPLINE)
    }
}

/**
 * Every signal is measured the same way for everyone. What it *means* is set
 * per person by an [Intention].
 */
data class SignalDef(
    val key: String,
    val name: String,
    val unit: String,
    val domain: String,
    /** Evidence tier when nothing better is known (e.g. no Health Connect). */
    val defaultTier: Tier,
    val how: String,
    /** Sensitive signals (§3.8) are off by default and never pre-filled by presets. */
    val sensitive: Boolean = false,
)

object Signals {
    const val TASKS = "tasks"
    const val FOCUS = "focus"
    const val MINIMUMS = "minimums"
    const val STEPS = "steps"
    const val JOURNAL = "journal"
    const val DRILLS = "drills"
    const val SCREEN_PERSONAL = "screen_personal"
    const val SCREEN_WORK = "screen_work"
    const val MONEY_PACE = "money_pace"
    const val MONEY_LOGGING = "money_logging"
    const val FAMILY = "family"
    const val SLEEP = "sleep"
    const val SLEEP_REGULARITY = "sleep_regularity"
    const val LATE_SCREEN = "late_screen"
    const val UNLOCKS = "unlocks"

    val BUILT_IN: Map<String, SignalDef> = listOf(
        SignalDef(TASKS, "Planned tasks done", "%", "craft", Tier.B, "Tasks that were on your plan before the day started"),
        SignalDef(FOCUS, "Focus minutes", "min", "craft", Tier.A, "In-app focus timer (observed)"),
        SignalDef(MINIMUMS, "Daily minimums kept", "%", "discipline", Tier.C, "Minimums planned at 00:00; proof upgrades to B"),
        SignalDef(STEPS, "Steps", "steps", "body", Tier.A, "Health Connect (observed); manual entry is Tier C"),
        SignalDef(JOURNAL, "Journal", "entry", "mind", Tier.B, "Entry of 40+ words that is not a near-copy"),
        SignalDef(DRILLS, "Drill accuracy", "%", "mind", Tier.A, "First attempt per drill per day"),
        SignalDef(SCREEN_PERSONAL, "Personal screen time", "min", "mind", Tier.A, "Usage access, apps you have not tagged as work"),
        SignalDef(SCREEN_WORK, "Work screen time", "min", "craft", Tier.A, "Usage access, apps you tag as work"),
        SignalDef(MONEY_PACE, "Spend vs plan pace", "% of pace", "money", Tier.A, "Personal ledger vs a pace line that front-loads fixed costs"),
        SignalDef(MONEY_LOGGING, "Money logged & reviewed", "%", "money", Tier.A, "Logged ÷ (logged + detected-but-unlogged > 48 h)"),
        SignalDef(FAMILY, "Family commitments kept", "%", "people", Tier.C, "Family tasks assigned to you that were due"),
        SignalDef(SLEEP, "Sleep", "min", "body", Tier.A, "Health Connect sleep for the night you woke from"),
        SignalDef(SLEEP_REGULARITY, "Sleep regularity", "/100", "body", Tier.A, "How steady your sleep midpoint is across the last 7 nights"),
        SignalDef(LATE_SCREEN, "Late-night screen time", "min", "mind", Tier.A, "Phone use after your late hour (23:00 by default)"),
        SignalDef(UNLOCKS, "Phone unlocks", "count", "mind", Tier.A, "Times the phone was unlocked"),
    ).associateBy { it.key }
}

/** A loosening that waits out the cooldown (plan §3.6 rule 2). */
data class PendingChange(val applyOn: LocalDate, val next: Intention)

/** The intention card (plan §3.2). */
data class Intention(
    val direction: Direction,
    val target: Double,
    /** Low 1 · Normal 2 · High 3. Zero means unscored. */
    val weight: Int,
    val band: ClosedFloatingPointRange<Double>? = null,
    val targetsByDayType: Map<DayType, Double> = emptyMap(),
    val why: String = "",
    val ifThen: String = "",
    val pending: PendingChange? = null,
    val changedOn: LocalDate? = null,
) {
    val isScored: Boolean get() = direction.scored && weight > 0

    fun targetFor(type: DayType): Double = targetsByDayType[type] ?: target
}

/**
 * Everything one person has decided about their signals. Custom signals carry
 * their own [SignalDef] in [customDefs] and their card in [cards].
 */
data class IntentionSet(
    val role: String,
    val cards: Map<String, Intention>,
    val customDefs: Map<String, SignalDef> = emptyMap(),
    /** Days on which a signal was switched to "not relevant" (max 2/month). */
    val notRelevantChanges: List<LocalDate> = emptyList(),
) {
    fun def(key: String): SignalDef? = Signals.BUILT_IN[key] ?: customDefs[key]

    fun card(key: String): Intention? = cards[key]

    fun with(key: String, card: Intention): IntentionSet = copy(cards = cards + (key to card))

    fun update(key: String, change: (Intention) -> Intention): IntentionSet =
        cards[key]?.let { with(key, change(it)) } ?: this

    /** Pending loosenings whose cooldown has passed become the live card. */
    fun applyPending(today: LocalDate): IntentionSet = copy(
        cards = cards.mapValues { (_, c) ->
            val p = c.pending
            if (p != null && !p.applyOn.isAfter(today)) p.next.copy(pending = null, changedOn = today) else c
        },
    )

    companion object {
        fun default(): IntentionSet {
            fun card(dir: Direction, target: Double, weight: Int) = Intention(dir, target, weight)
            return IntentionSet(
                role = "default",
                cards = mapOf(
                    Signals.TASKS to card(Direction.MORE, 80.0, 2),
                    Signals.FOCUS to card(Direction.MORE, 120.0, 2),
                    Signals.MINIMUMS to card(Direction.MORE, 75.0, 3),
                    Signals.STEPS to card(Direction.MORE, 8000.0, 2),
                    Signals.JOURNAL to card(Direction.MORE, 1.0, 1),
                    Signals.DRILLS to card(Direction.MORE, 70.0, 1),
                    Signals.SCREEN_PERSONAL to card(Direction.LESS, 150.0, 1),
                    Signals.SCREEN_WORK to card(Direction.TRACK, 0.0, 0),
                    Signals.MONEY_PACE to card(Direction.LESS, 100.0, 2),
                    Signals.MONEY_LOGGING to card(Direction.MORE, 90.0, 1),
                    Signals.FAMILY to card(Direction.MORE, 80.0, 1),
                    Signals.SLEEP to Intention(Direction.BAND, 450.0, 2, band = 420.0..540.0),
                    Signals.SLEEP_REGULARITY to card(Direction.MORE, 75.0, 1),
                    Signals.LATE_SCREEN to card(Direction.TRACK, 0.0, 0),
                    Signals.UNLOCKS to card(Direction.TRACK, 0.0, 0),
                ),
            )
        }
    }
}

/** Role presets only PRE-FILL cards. Nobody is ever scored against a preset. */
data class RolePreset(
    val key: String,
    val name: String,
    val description: String,
    val overrides: Map<String, (Intention) -> Intention> = emptyMap(),
    val suggestsShiftDay: Boolean = false,
    val suggestsBattery: BatteryMode? = null,
) {
    fun applyTo(base: IntentionSet): IntentionSet =
        overrides.entries.fold(base.copy(role = key)) { set, (k, f) -> set.update(k, f) }

    companion object {
        private fun dir(d: Direction): (Intention) -> Intention = { it.copy(direction = d) }

        val ALL: List<RolePreset> = listOf(
            RolePreset("default", "Balanced", "A sensible starting point you can tune."),
            RolePreset(
                "creator", "Social media / screen-heavy work",
                "Work screen time is tracked, not judged. Only leisure scrolling counts.",
                mapOf(
                    Signals.SCREEN_WORK to dir(Direction.TRACK),
                    Signals.SCREEN_PERSONAL to { it.copy(direction = Direction.LESS, target = 90.0) },
                ),
            ),
            RolePreset(
                "manual", "Physical / manual work",
                "Your job already moves you: steps are tracked, rest matters more.",
                mapOf(Signals.STEPS to dir(Direction.TRACK), Signals.SCREEN_PERSONAL to dir(Direction.TRACK), Signals.FOCUS to dir(Direction.OFF)),
            ),
            RolePreset(
                "business", "Business owner",
                "Business money lives in its own ledger. Personal money is what we score.",
                mapOf(Signals.MONEY_LOGGING to { it.copy(weight = 3) }, Signals.FOCUS to { it.copy(target = 90.0) }),
            ),
            RolePreset(
                "freelancer", "Freelancer / irregular income",
                "Budget only money received; runway matters more than monthly pace.",
                mapOf(Signals.MONEY_PACE to dir(Direction.TRACK), Signals.MONEY_LOGGING to { it.copy(weight = 3) }),
            ),
            RolePreset(
                "student", "Student", "Study focus and planned work matter most.",
                mapOf(Signals.FOCUS to { it.copy(target = 150.0, weight = 3) }, Signals.MONEY_PACE to { it.copy(weight = 1) }),
            ),
            RolePreset(
                "shift", "Shift / night worker", "Use the shift roster day; steps and screen time are tracked.",
                mapOf(Signals.STEPS to dir(Direction.TRACK), Signals.SCREEN_PERSONAL to dir(Direction.TRACK)),
                suggestsShiftDay = true,
            ),
            RolePreset(
                "homemaker", "Running a household", "Family commitments and household money weigh more.",
                mapOf(Signals.FAMILY to { it.copy(weight = 3) }, Signals.FOCUS to dir(Direction.OFF)),
            ),
            RolePreset(
                "gentle", "A gentle, low-pressure setup", "Fewer scored signals, kinder battery, one thing at a time.",
                mapOf(Signals.DRILLS to dir(Direction.OFF), Signals.SCREEN_PERSONAL to dir(Direction.TRACK)),
                suggestsBattery = BatteryMode.GENTLE,
            ),
        )

        fun byKey(key: String): RolePreset? = ALL.firstOrNull { it.key == key }
    }
}
