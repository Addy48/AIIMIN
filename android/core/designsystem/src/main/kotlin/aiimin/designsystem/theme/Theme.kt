package aiimin.designsystem.theme

import android.provider.Settings
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.runtime.remember
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.Density
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

enum class ThemeMode { SYSTEM, LIGHT, DARK }

@Immutable
data class Spacing(
    val xxs: Dp = 2.dp,
    val xs: Dp = 4.dp,
    val sm: Dp = 8.dp,
    val md: Dp = 12.dp,
    val lg: Dp = 16.dp,
    val xl: Dp = 20.dp,
    val xxl: Dp = 24.dp,
    val xxxl: Dp = 32.dp,
    /** Side margin of every screen (PRD 8 dp grid, 16 dp margins; R6 S1). */
    val gutter: Dp = 16.dp,
)

object Shapes {
    val card = RoundedCornerShape(14.dp)
    val row = RoundedCornerShape(12.dp)
    val small = RoundedCornerShape(8.dp)
    val pill = RoundedCornerShape(percent = 50)
    /** Buttons, chips, segments: squared-off, not pills. */
    val control = RoundedCornerShape(10.dp)
    val tag = RoundedCornerShape(5.dp)
    val sheet = RoundedCornerShape(topStart = 22.dp, topEnd = 22.dp)
}

val LocalSpacing = staticCompositionLocalOf { Spacing() }

object Aiimin {
    val colors: Palette
        @Composable @ReadOnlyComposable get() = LocalPalette.current
    val type: AppType
        @Composable @ReadOnlyComposable get() = LocalType.current
    val space: Spacing
        @Composable @ReadOnlyComposable get() = LocalSpacing.current
}

/** System text size times the in-app size, kept inside 0.85x to 2.0x (Part 18: 2.0x must not clip). */
fun clampFontScale(system: Float, inApp: Float): Float = (system * inApp).coerceIn(0.85f, 2.0f)

/**
 * Light theme only (PRD 1.1): [mode] is kept for old call sites and ignored; the dark palette is dormant.
 * [reduceMotion] is the in-app setting; Android's "Remove animations" turns it on as well.
 */
@Composable
fun AiiminTheme(mode: ThemeMode = ThemeMode.LIGHT, textScale: Float = 1f, reduceMotion: Boolean = false, content: @Composable () -> Unit) {
    val dark = false
    val p = if (dark) DarkPalette else LightPalette
    val scheme = if (dark) {
        darkColorScheme(
            primary = p.accent, onPrimary = p.onAccent, background = p.base, onBackground = p.text,
            surface = p.surface, onSurface = p.text, surfaceVariant = p.raised, onSurfaceVariant = p.textMuted,
            surfaceContainer = p.surface, surfaceContainerHigh = p.raised, surfaceContainerHighest = p.overlay,
            surfaceContainerLow = p.surface, outline = p.borderStrong, outlineVariant = p.border, error = p.danger,
            secondary = p.violet, tertiary = p.done, scrim = p.scrim,
        )
    } else {
        lightColorScheme(
            primary = p.accent, onPrimary = p.onAccent, background = p.base, onBackground = p.text,
            surface = p.surface, onSurface = p.text, surfaceVariant = p.raised, onSurfaceVariant = p.textMuted,
            surfaceContainer = p.surface, surfaceContainerHigh = p.raised, surfaceContainerHighest = p.overlay,
            surfaceContainerLow = p.surface, outline = p.borderStrong, outlineVariant = p.border, error = p.danger,
            secondary = p.violet, tertiary = p.done, scrim = p.scrim,
        )
    }
    val type = appType(p)
    // The design is drawn at 390 dp wide. Narrow phones scale everything down a little and wide ones up a little,
    // so a 320 dp phone doesn't wrap every line and a 450 dp one doesn't look sparse. The person's own font size
    // setting is kept (up to 2.0x); the layouts have no fixed heights on text rows.
    val base = LocalDensity.current
    val widthDp = LocalConfiguration.current.screenWidthDp.toFloat()
    val fit = if (widthDp <= 0f) 1f else (widthDp / 390f).coerceIn(0.92f, 1.1f)
    // The in-app text size (Appearance) multiplies the system one; the result stays inside the tested range.
    val density = remember(base.density, base.fontScale, fit, textScale) { Density(base.density * fit, clampFontScale(base.fontScale, textScale)) }
    val resolver = LocalContext.current.contentResolver
    val systemOff = remember(resolver) { Settings.Global.getFloat(resolver, Settings.Global.ANIMATOR_DURATION_SCALE, 1f) == 0f }
    CompositionLocalProvider(
        LocalDensity provides density, LocalPalette provides p, LocalType provides type, LocalSpacing provides Spacing(),
        LocalReduceMotion provides (reduceMotion || systemOff),
    ) {
        MaterialTheme(colorScheme = scheme, typography = type.material, content = content)
    }
}
