package aiimin.designsystem.theme

import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.runtime.staticCompositionLocalOf
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
    /** Side gutter of every screen. */
    val gutter: Dp = 20.dp,
)

object Shapes {
    val card = RoundedCornerShape(16.dp)
    val row = RoundedCornerShape(12.dp)
    val small = RoundedCornerShape(8.dp)
    val pill = RoundedCornerShape(percent = 50)
    /** Buttons, chips, segments: squared-off, not pills. */
    val control = RoundedCornerShape(10.dp)
    val tag = RoundedCornerShape(5.dp)
    val sheet = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)
}

/** Motion: short, ease-out on enter, ease-in on exit (plan Part 2 §9). */
object Motion {
    val enter = CubicBezierEasing(0.16f, 1f, 0.3f, 1f)
    val exit = CubicBezierEasing(0.7f, 0f, 0.84f, 0f)
    val standard = CubicBezierEasing(0.2f, 0f, 0f, 1f)
    const val FAST = 150
    const val BASE = 220
    const val SLOW = 300
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

@Composable
fun AiiminTheme(mode: ThemeMode = ThemeMode.SYSTEM, content: @Composable () -> Unit) {
    val dark = when (mode) {
        ThemeMode.SYSTEM -> isSystemInDarkTheme()
        ThemeMode.LIGHT -> false
        ThemeMode.DARK -> true
    }
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
    CompositionLocalProvider(LocalPalette provides p, LocalType provides type, LocalSpacing provides Spacing()) {
        MaterialTheme(colorScheme = scheme, typography = type.material, content = content)
    }
}
