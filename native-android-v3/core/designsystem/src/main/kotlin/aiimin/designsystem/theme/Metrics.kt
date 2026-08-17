package aiimin.designsystem.theme

import androidx.compose.runtime.Immutable
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/**
 * The 3.4 dp spacing scale from the prototype. Odd on purpose: it is a drafting
 * grid, not an 8 dp material grid, and the fractional step is what keeps the
 * hairlines from looking like boxes.
 */
@Immutable
data class AiiminSpacing(
    val s1: Dp = 3.4.dp,
    val s2: Dp = 6.8.dp,
    val s3: Dp = 10.2.dp,
    val s4: Dp = 13.6.dp,
    val s6: Dp = 20.4.dp,
    val s8: Dp = 27.2.dp,
) {
    /** Left/right page margin — the sheet edge. */
    val page: Dp get() = s6
}

/**
 * Square corners everywhere. Radius exists only on buttons, and stays small
 * enough to read as a milled edge rather than a pill.
 */
@Immutable
data class AiiminRadii(
    val sm: Dp = 2.dp,
    val md: Dp = 4.dp,
    val lg: Dp = 7.dp,
)

/** One physical hairline. Every border in the app is this width. */
val Hairline: Dp = 1.dp

/** Minimum touch target — anti-slop checklist, every tappable row clears this. */
val MinTouchTarget: Dp = 44.dp
