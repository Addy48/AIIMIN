package aiimin.designsystem.theme

import androidx.compose.material3.Typography
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.LineHeightStyle
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp

/**
 * One sans family for everything; numbers use tabular figures so they don't
 * jiggle as they change (no terminal mono — the benchmark's "too AI" finding).
 * Serif only on the journal canvas.
 */
@Immutable
data class AppType(
    /** Life Score, money totals. */
    val display: TextStyle,
    val numberLarge: TextStyle,
    val numberMedium: TextStyle,
    val numberSmall: TextStyle,
    val title: TextStyle,
    val headline: TextStyle,
    val body: TextStyle,
    val bodyStrong: TextStyle,
    val label: TextStyle,
    /** Section eyebrows: small, tracked, quiet. */
    val eyebrow: TextStyle,
    val caption: TextStyle,
    val journal: TextStyle,
    val material: Typography,
)

private val Sans = FontFamily.Default
private const val TNUM = "tnum, lnum"
private val Trim = LineHeightStyle(LineHeightStyle.Alignment.Center, LineHeightStyle.Trim.None)

internal fun appType(p: Palette): AppType {
    fun s(size: Int, line: Int, weight: FontWeight, tracking: Double = 0.0, num: Boolean = false) = TextStyle(
        fontFamily = Sans,
        fontSize = size.sp,
        lineHeight = line.sp,
        fontWeight = weight,
        letterSpacing = tracking.em,
        color = p.text,
        fontFeatureSettings = if (num) TNUM else null,
        lineHeightStyle = Trim,
    )
    val display = s(64, 66, FontWeight.SemiBold, -0.04, num = true)
    val numberLarge = s(34, 38, FontWeight.SemiBold, -0.03, num = true)
    val numberMedium = s(22, 26, FontWeight.SemiBold, -0.02, num = true)
    val numberSmall = s(15, 20, FontWeight.Medium, 0.0, num = true)
    val title = s(28, 34, FontWeight.SemiBold, -0.025)
    val headline = s(17, 22, FontWeight.SemiBold, -0.01)
    val body = s(15, 22, FontWeight.Normal)
    val bodyStrong = s(15, 22, FontWeight.Medium)
    val label = s(13, 18, FontWeight.Medium)
    val eyebrow = s(11, 14, FontWeight.SemiBold, 0.08).copy(color = p.textFaint)
    val caption = s(12, 16, FontWeight.Normal).copy(color = p.textMuted)
    val journal = TextStyle(fontFamily = FontFamily.Serif, fontSize = 18.sp, lineHeight = 29.sp, color = p.text)
    return AppType(
        display, numberLarge, numberMedium, numberSmall, title, headline, body, bodyStrong, label, eyebrow, caption, journal,
        material = Typography(
            displayLarge = display, headlineLarge = title, headlineMedium = title.copy(fontSize = 24.sp),
            titleLarge = headline.copy(fontSize = 20.sp), titleMedium = headline, titleSmall = bodyStrong,
            bodyLarge = body, bodyMedium = body.copy(fontSize = 14.sp), bodySmall = caption,
            labelLarge = label.copy(fontSize = 14.sp), labelMedium = label, labelSmall = eyebrow,
        ),
    )
}

val LocalType = staticCompositionLocalOf { appType(DarkPalette) }
