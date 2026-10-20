package aiimin.designsystem.component

/** Which opening plays (PRD Part 26.2 rule 2). NONE is a warm resume: no scene at all. */
enum class BootMode { FULL, SHORT, REDUCED, NONE }

/**
 * Part 26.2: the full opening on the first launch ever and the first launch of each day, the short one on
 * other cold starts, none on a warm resume or when opened straight to a screen (shortcut, notification).
 * Reduce motion shows the still final frame.
 */
fun bootMode(coldStart: Boolean, openedToScreen: Boolean, reduce: Boolean, lastFullDay: String?, today: String): BootMode = when {
    !coldStart || openedToScreen -> BootMode.NONE
    reduce -> BootMode.REDUCED
    lastFullDay != today -> BootMode.FULL
    else -> BootMode.SHORT
}
