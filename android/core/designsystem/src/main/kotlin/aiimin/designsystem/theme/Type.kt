package aiimin.designsystem.theme

import aiimin.designsystem.R
import androidx.compose.material3.Typography
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.text.ExperimentalTextApi
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontVariation
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.LineHeightStyle
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp

/**
 * Funnel Display (500/600/700) for numbers and titles, Golos Text (400/500/600)
 * for everything read. Every number uses tabular figures (handoff §2).
 */
@OptIn(ExperimentalTextApi::class)
private fun variable(res: Int, vararg weights: Int) = FontFamily(
    weights.map { w -> Font(res, FontWeight(w), variationSettings = FontVariation.Settings(FontVariation.weight(w))) },
)

@OptIn(ExperimentalTextApi::class)
val Funnel: FontFamily = variable(R.font.funnel_display, 400, 500, 600, 700)

@OptIn(ExperimentalTextApi::class)
val Golos: FontFamily = variable(R.font.golos_text, 400, 500, 600, 700)

/**
 * The AIIMIN wordmark face: Bodoni Moda 700 at its largest optical size (96), the same high-contrast
 * Didone the website uses (`--font-brand`). Only for the wordmark, never for reading text.
 */
@OptIn(ExperimentalTextApi::class)
val BrandSerif: FontFamily = FontFamily(
    Font(R.font.bodoni_moda, FontWeight.Bold, variationSettings = FontVariation.Settings(FontVariation.weight(700), FontVariation.Setting("opsz", 96f))),
)

@Immutable
data class AppType(
    /** heroTime: Today's clock. 68/65, -3%. */
    val display: TextStyle,
    /** heroNumber: Life Score. 92/78, -4%. */
    val heroNumber: TextStyle,
    /** moneyHero: 46/48, -3%. */
    val numberLarge: TextStyle,
    /** Card numbers: 22/26. */
    val numberMedium: TextStyle,
    /** Stat line and inline figures: 17/22 Funnel. */
    val numberSmall: TextStyle,
    /** screenTitle: 26/32. */
    val title: TextStyle,
    /** title: Now-card title, sheet titles. 22/26. */
    val cardTitle: TextStyle,
    /** pushTitle: pushed-screen bar. 18/24. */
    val headline: TextStyle,
    val body: TextStyle,
    val bodyStrong: TextStyle,
    val label: TextStyle,
    /** Section heads: 12/16, +8%, upper-case, muted. */
    val eyebrow: TextStyle,
    /** meta: row subtitles 12.5/18, muted. */
    val caption: TextStyle,
    /** chartAxis: 11.5/14. */
    val axis: TextStyle,
    val journal: TextStyle,
    val material: Typography,
)

private const val TNUM = "tnum"
private val Trim = LineHeightStyle(LineHeightStyle.Alignment.Center, LineHeightStyle.Trim.None)

internal fun appType(p: Palette): AppType {
    fun s(family: FontFamily, size: Double, line: Double, weight: FontWeight, tracking: Double = 0.0, num: Boolean = false) = TextStyle(
        fontFamily = family,
        fontSize = size.sp,
        lineHeight = line.sp,
        fontWeight = weight,
        letterSpacing = tracking.em,
        color = p.text,
        fontFeatureSettings = if (num) TNUM else null,
        lineHeightStyle = Trim,
    )
    val sb = FontWeight.SemiBold
    val display = s(Funnel, 68.0, 65.0, sb, -0.03, num = true)
    val heroNumber = s(Funnel, 92.0, 78.0, sb, -0.04, num = true)
    val numberLarge = s(Funnel, 46.0, 48.0, sb, -0.03, num = true)
    val numberMedium = s(Funnel, 22.0, 26.0, sb, -0.02, num = true)
    val numberSmall = s(Funnel, 17.0, 22.0, sb, -0.01, num = true)
    val title = s(Funnel, 26.0, 32.0, sb, -0.02)
    val cardTitle = s(Funnel, 22.0, 26.0, sb, -0.015)
    val headline = s(Funnel, 18.0, 24.0, sb, -0.01)
    val body = s(Golos, 15.0, 22.0, FontWeight.Normal, num = true)
    val bodyStrong = s(Golos, 15.0, 22.0, sb, num = true)
    val label = s(Golos, 13.0, 18.0, FontWeight.Medium, num = true)
    val eyebrow = s(Golos, 12.0, 16.0, sb, 0.08).copy(color = p.textMuted)
    val caption = s(Golos, 12.5, 18.0, FontWeight.Normal, num = true).copy(color = p.textMuted)
    val axis = s(Golos, 11.5, 14.0, FontWeight.Normal, num = true).copy(color = p.textMuted)
    val journal = TextStyle(fontFamily = FontFamily.Serif, fontSize = 18.sp, lineHeight = 29.sp, color = p.text)
    return AppType(
        display, heroNumber, numberLarge, numberMedium, numberSmall, title, cardTitle, headline, body, bodyStrong, label, eyebrow, caption, axis, journal,
        material = Typography(
            displayLarge = display, headlineLarge = title, headlineMedium = cardTitle,
            titleLarge = headline, titleMedium = headline, titleSmall = bodyStrong,
            bodyLarge = body, bodyMedium = body.copy(fontSize = 14.sp), bodySmall = caption,
            labelLarge = label.copy(fontSize = 14.sp), labelMedium = label, labelSmall = eyebrow,
        ),
    )
}

val LocalType = staticCompositionLocalOf { appType(LightPalette) }
