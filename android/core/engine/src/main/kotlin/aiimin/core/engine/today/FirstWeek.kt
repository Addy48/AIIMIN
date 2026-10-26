package aiimin.core.engine.today

import java.time.LocalDate
import java.time.temporal.ChronoUnit

/** The first-week ladder's five one-tap steps (master plan Phase 6 R1), in this order. */
enum class SetupStep(val label: String) {
    SCREEN_TIME("Turn on screen time"),
    MINIMUM("Add one minimum"),
    CAPTURE("Say one capture"),
    DOCUMENT("Save one document"),
    BUDGET("Set a money budget"),
}

/** PRD §1.2: a small card under the "What now?" line on days 1 to 7, gone once all five are done. */
object FirstWeek {
    fun steps(): List<SetupStep> = SetupStep.entries.toList()

    fun show(installDay: LocalDate, today: LocalDate, done: Set<SetupStep>): Boolean =
        ChronoUnit.DAYS.between(installDay, today) in 0..6 && done.size < SetupStep.entries.size

    fun next(done: Set<SetupStep>): SetupStep? = steps().firstOrNull { it !in done }

    fun progress(done: Set<SetupStep>): String = "${done.size} of ${SetupStep.entries.size} set up"
}
