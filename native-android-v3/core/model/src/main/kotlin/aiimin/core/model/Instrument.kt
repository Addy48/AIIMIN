package aiimin.core.model

/**
 * The eight instruments a life can be measured with.
 *
 * **The keys are immutable forever.** Labels may change, order may change,
 * a user may run four of them or six — but `BODY` is `BODY` for the life of the
 * product, because history is stored against these keys and history must not
 * be rewritten by a rename. (Engine v2 contract, rule 1.)
 *
 * Each person runs 4–6. The server computes every instrument it has data for,
 * so turning one on later reveals history rather than starting from nothing.
 */
enum class Instrument(val label: String, val blurb: String) {
    BODY("BODY", "Movement, training, sleep, food."),
    MIND("MIND", "Mood, attention, what the days feel like."),
    CRAFT("CRAFT", "The work that is yours — deep work, shipped things, practice."),
    MONEY("MONEY", "What comes in, what goes out, what is left."),
    PEOPLE("PEOPLE", "Who you saw, who you owe a call."),
    ORDER("ORDER", "Minimums kept, captures settled, the plan followed."),
    RECOVERY("RECOVERY", "Rest taken on purpose, not by collapse."),
    LEARNING("LEARNING", "Reading, study, reps at something new."),
    ;

    companion object {
        /** How many instruments a person may run at once. Fewer is a real choice. */
        val ALLOWED_COUNT = 4..6

        fun byKey(key: String): Instrument? = entries.firstOrNull { it.name == key }
    }
}

/**
 * A life mode re-weights the instruments for a season.
 *
 * This is what makes RECOVER mean something: on RECOVER a fourteen-hour grind
 * scores *lower* than a walk and nine hours of sleep, because the multiplier on
 * CRAFT drops and the multiplier on RECOVERY nearly doubles.
 */
enum class LifeMode(val label: String, private val multipliers: Map<Instrument, Double>) {
    BUILD(
        "BUILD",
        mapOf(
            Instrument.BODY to 1.0, Instrument.MIND to 1.0, Instrument.CRAFT to 1.4,
            Instrument.MONEY to 1.0, Instrument.PEOPLE to 0.8, Instrument.ORDER to 1.1,
            Instrument.RECOVERY to 0.7, Instrument.LEARNING to 0.9,
        ),
    ),
    RECOVER(
        "RECOVER",
        mapOf(
            Instrument.BODY to 1.2, Instrument.MIND to 1.2, Instrument.CRAFT to 0.5,
            Instrument.MONEY to 0.9, Instrument.PEOPLE to 1.1, Instrument.ORDER to 0.8,
            Instrument.RECOVERY to 1.6, Instrument.LEARNING to 0.7,
        ),
    ),
    EXAM(
        "EXAM",
        mapOf(
            Instrument.BODY to 0.8, Instrument.MIND to 1.1, Instrument.CRAFT to 0.7,
            Instrument.MONEY to 0.8, Instrument.PEOPLE to 0.6, Instrument.ORDER to 1.2,
            Instrument.RECOVERY to 1.0, Instrument.LEARNING to 1.5,
        ),
    ),
    TRAVEL(
        "TRAVEL",
        mapOf(
            Instrument.BODY to 0.8, Instrument.MIND to 1.0, Instrument.CRAFT to 0.6,
            Instrument.MONEY to 1.3, Instrument.PEOPLE to 1.2, Instrument.ORDER to 0.9,
            Instrument.RECOVERY to 1.1, Instrument.LEARNING to 0.8,
        ),
    ),
    ;

    operator fun get(instrument: Instrument): Double = multipliers.getValue(instrument)
}
