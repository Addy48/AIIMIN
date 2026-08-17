package aiimin.designsystem.component

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import aiimin.designsystem.theme.AiiminTheme

/**
 * The sheet under every surface — not flat ink.
 *
 * A quiet vertical wash (bg → surface → bg) plus a faint accent vignette in the
 * top-right. Same locked palette; more depth than a single flat fill. Drafting
 * boards have grain; this is the Compose equivalent without breaking G4.
 */
@Composable
fun SheetGround(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit,
) {
    val colors = AiiminTheme.colors
    val wash = Brush.verticalGradient(
        colorStops = arrayOf(
            0.0f to colors.bg,
            0.35f to colors.surface.copy(alpha = if (colors.isDark) 0.55f else 0.9f),
            1.0f to colors.bg,
        ),
    )
    val vignette = Brush.radialGradient(
        colors = listOf(
            colors.accent.copy(alpha = if (colors.isDark) 0.07f else 0.05f),
            colors.bg.copy(alpha = 0f),
        ),
        center = Offset(x = 920f, y = 40f),
        radius = 980f,
    )

    Box(
        modifier
            .fillMaxSize()
            .background(wash)
            .background(vignette),
        content = content,
    )
}
