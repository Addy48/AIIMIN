package `in`.aiimin.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val Accent = Color(0xFFFF6B35)
val AccentCalm = Color(0xFFE85A24)
val Success = Color(0xFF10B981)
val Warning = Color(0xFFFACC15)
val Muted = Color(0xFF6B7280)

private val DarkColors = darkColorScheme(
    primary = Accent,
    onPrimary = Color(0xFF1A1A1A),
    secondary = Success,
    background = Color(0xFF1A1A1A),
    surface = Color(0xFF2D2D2D),
    surfaceVariant = Color(0xFF333333),
    onBackground = Color(0xFFF0EDE8),
    onSurface = Color(0xFFF0EDE8),
    onSurfaceVariant = Muted,
    error = Color(0xFFEF4444),
    outline = Muted,
)

private val LightColors = lightColorScheme(
    primary = Accent,
    onPrimary = Color.White,
    secondary = Success,
    background = Color(0xFFEDE4D3),
    surface = Color.White,
    surfaceVariant = Color(0xFFF7F1E6),
    onBackground = Color(0xFF14171A),
    onSurface = Color(0xFF14171A),
    onSurfaceVariant = Muted,
    error = Color(0xFFEF4444),
    outline = Color(0xFFD1D5DB),
)

@Composable
fun AiiminTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    MaterialTheme(
        colorScheme = if (darkTheme) DarkColors else LightColors,
        typography = AiiminTypography,
        content = content,
    )
}
