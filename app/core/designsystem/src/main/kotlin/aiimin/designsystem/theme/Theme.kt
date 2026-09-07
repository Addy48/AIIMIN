package aiimin.designsystem.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle

/**
 * The Drafting Table theme.
 *
 * Material3 is the substrate — it supplies ripples, text selection and the
 * accessibility plumbing — but the visual language is AIIMIN's. Read colour,
 * type and spacing from [AiiminTheme], never from `MaterialTheme` directly.
 * Dynamic colour is deliberately **off**: the palette is locked.
 */
object AiiminTheme {
    val colors: AiiminColors
        @Composable @ReadOnlyComposable get() = LocalAiiminColors.current

    val type: AiiminTypography
        @Composable @ReadOnlyComposable get() = LocalAiiminTypography.current

    val space: AiiminSpacing
        @Composable @ReadOnlyComposable get() = LocalAiiminSpacing.current

    val radii: AiiminRadii
        @Composable @ReadOnlyComposable get() = LocalAiiminRadii.current

    /** Config toggle + system animator scale — screens read this for motion. */
    val reduceMotion: Boolean
        @Composable @ReadOnlyComposable get() = LocalReduceMotion.current
}

val LocalAiiminColors = staticCompositionLocalOf { DraftingTableDark }
val LocalAiiminTypography = staticCompositionLocalOf { AiiminTypography() }
val LocalAiiminSpacing = staticCompositionLocalOf { AiiminSpacing() }
val LocalAiiminRadii = staticCompositionLocalOf { AiiminRadii() }
val LocalReduceMotion = staticCompositionLocalOf { false }

@Composable
fun AiiminTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    reduceMotion: Boolean = false,
    content: @Composable () -> Unit,
) {
    val colors = if (darkTheme) DraftingTableDark else IndustrySheetLight
    val typography = AiiminTypography()

    CompositionLocalProvider(
        LocalAiiminColors provides colors,
        LocalAiiminTypography provides typography,
        LocalAiiminSpacing provides AiiminSpacing(),
        LocalAiiminRadii provides AiiminRadii(),
        LocalReduceMotion provides reduceMotion,
    ) {
        MaterialTheme(
            colorScheme = colors.toMaterialScheme(),
            typography = MaterialTheme.typography.mappedTo(typography),
            content = content,
        )
    }
}

/**
 * Material roles pointed at our tokens, so any M3 component that slips into a
 * screen still draws in the Drafting Table palette instead of purple.
 */
private fun AiiminColors.toMaterialScheme() = if (isDark) {
    darkColorScheme(
        primary = accent,
        onPrimary = onAccent,
        secondary = accent,
        onSecondary = onAccent,
        background = bg,
        onBackground = text,
        surface = surface,
        onSurface = text,
        surfaceVariant = tint,
        onSurfaceVariant = muted,
        outline = rule,
        outlineVariant = hair,
        error = danger,
        onError = Color.White,
    )
} else {
    lightColorScheme(
        primary = accent,
        onPrimary = onAccent,
        secondary = accent,
        onSecondary = onAccent,
        background = bg,
        onBackground = text,
        surface = surface,
        onSurface = text,
        surfaceVariant = tint,
        onSurfaceVariant = muted,
        outline = rule,
        outlineVariant = hair,
        error = danger,
        onError = Color.White,
    )
}

private fun androidx.compose.material3.Typography.mappedTo(
    type: AiiminTypography,
): androidx.compose.material3.Typography = copy(
    displayLarge = type.figure,
    headlineSmall = type.chrome.asHeading(),
    titleMedium = type.chrome,
    titleSmall = type.sectionLabel,
    bodyLarge = type.body,
    bodyMedium = type.bodySmall,
    labelLarge = type.button,
    labelSmall = type.cellLabel,
)

private fun TextStyle.asHeading() = copy(fontSize = fontSize * 1.4f, lineHeight = fontSize * 1.7f)
