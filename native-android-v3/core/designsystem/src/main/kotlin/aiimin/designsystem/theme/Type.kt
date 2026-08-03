package aiimin.designsystem.theme

import androidx.compose.runtime.Immutable
import androidx.compose.ui.text.ExperimentalTextApi
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontVariation
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextGeometricTransform
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import aiimin.designsystem.R

/**
 * Three faces, one job each (LOCKED, guardrail G4):
 * - **Barlow Condensed** — chrome: screen heads, section labels, buttons, tabs.
 * - **Barlow** — body copy.
 * - **JetBrains Mono** — every numeral in the app, without exception.
 */
val BarlowCondensed = FontFamily(
    Font(R.font.core_designsystem_barlow_condensed_medium, FontWeight.Medium),
    Font(R.font.core_designsystem_barlow_condensed_semibold, FontWeight.SemiBold),
    Font(R.font.core_designsystem_barlow_condensed_bold, FontWeight.Bold),
)

val Barlow = FontFamily(
    Font(R.font.core_designsystem_barlow_regular, FontWeight.Normal),
    Font(R.font.core_designsystem_barlow_medium, FontWeight.Medium),
    Font(R.font.core_designsystem_barlow_semibold, FontWeight.SemiBold),
)

/** One variable file, instanced per weight (`wght` axis needs API 26 — our minSdk). */
val JetBrainsMono = FontFamily(
    monoFont(FontWeight.Normal, 400),
    monoFont(FontWeight.Medium, 500),
    monoFont(FontWeight.Bold, 700),
)

@OptIn(ExperimentalTextApi::class)
private fun monoFont(weight: FontWeight, axis: Int) = Font(
    resId = R.font.core_designsystem_jetbrains_mono_variable,
    weight = weight,
    variationSettings = FontVariation.Settings(FontVariation.weight(axis)),
)

/**
 * The prototype's `F` type scale, one-for-one. Sizes are the CSS px values —
 * the phone renders at the same nominal scale, so px maps to sp directly.
 */
@Immutable
data class AiiminTypography(
    /** Screen head, primary buttons, tab labels. */
    val chrome: TextStyle = TextStyle(
        fontFamily = BarlowCondensed,
        fontWeight = FontWeight.SemiBold,
        fontSize = 13.sp,
        lineHeight = 13.sp,
        letterSpacing = 0.18.em,
    ),
    /** The all-caps label that opens a section, above its rule. */
    val sectionLabel: TextStyle = TextStyle(
        fontFamily = BarlowCondensed,
        fontWeight = FontWeight.SemiBold,
        fontSize = 10.sp,
        letterSpacing = 0.20.em,
    ),
    /** The smallest label: cell captions inside a grid. */
    val cellLabel: TextStyle = TextStyle(
        fontFamily = BarlowCondensed,
        fontWeight = FontWeight.SemiBold,
        fontSize = 9.5.sp,
        letterSpacing = 0.16.em,
    ),
    /** Ghost/secondary button face. */
    val button: TextStyle = TextStyle(
        fontFamily = BarlowCondensed,
        fontWeight = FontWeight.SemiBold,
        fontSize = 12.sp,
        letterSpacing = 0.10.em,
    ),
    /** Reading copy. */
    val body: TextStyle = TextStyle(
        fontFamily = Barlow,
        fontWeight = FontWeight.Normal,
        fontSize = 13.sp,
        lineHeight = 19.5.sp,
    ),
    /** Smaller reading copy — meta lines, toast text. */
    val bodySmall: TextStyle = TextStyle(
        fontFamily = Barlow,
        fontWeight = FontWeight.Normal,
        fontSize = 12.5.sp,
        lineHeight = 18.sp,
    ),
    /** Default numeral style. */
    val mono: TextStyle = TextStyle(
        fontFamily = JetBrainsMono,
        fontWeight = FontWeight.Normal,
        fontSize = 10.5.sp,
    ),
    /** The one big figure on a screen — the Life Score, a balance. */
    val figure: TextStyle = TextStyle(
        fontFamily = JetBrainsMono,
        fontWeight = FontWeight.Bold,
        fontSize = 52.sp,
        lineHeight = 52.sp,
        letterSpacing = (-0.02).em,
    ),
) {
    /** A numeral at an arbitrary size — use for every figure that is not [figure]. */
    fun mono(size: Double, weight: FontWeight = FontWeight.Normal): TextStyle =
        mono.copy(fontSize = size.sp, fontWeight = weight)
}

/**
 * Barlow Condensed already carries the drafting-board narrowness; this is here
 * for the rare case a non-condensed face has to be squeezed into a rule.
 */
internal val CondenseSlightly = TextGeometricTransform(scaleX = 0.94f)
