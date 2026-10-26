package aiimin.designsystem.component

import aiimin.designsystem.theme.LightPalette

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/**
 * The AIIMIN mark, light variant (web/public/AIIMIN_logo.svg and the launcher icon):
 * pale arch, ink peak-A, grey inner A and the orange sun. Drawn in the 512-unit
 * source geometry and scaled, so it stays sharp at any size. No ground of its own.
 */
@Composable
fun BrandMark(modifier: Modifier = Modifier, size: Dp = 32.dp) {
    Canvas(modifier.size(size).semantics { contentDescription = "AIIMIN" }) {
        val k = this.size.minDimension / 512f
        fun p(x: Float, y: Float) = Offset(x * k, y * k)
        val arch = Path().apply {
            moveTo(80 * k, 384 * k)
            cubicTo(80 * k, 192 * k, 208 * k, 112 * k, 256 * k, 112 * k)
            cubicTo(304 * k, 112 * k, 432 * k, 192 * k, 432 * k, 384 * k)
        }
        drawPath(arch, LightPalette.markArch, alpha = 0.9f, style = Stroke(24 * k, cap = StrokeCap.Round))
        val peak = Path().apply { moveTo(144 * k, 384 * k); lineTo(256 * k, 176 * k); lineTo(368 * k, 384 * k) }
        drawPath(peak, LightPalette.text, style = Stroke(24 * k, cap = StrokeCap.Round, join = StrokeJoin.Round))
        val inner = Path().apply { moveTo(192 * k, 368 * k); lineTo(256 * k, 272 * k); lineTo(320 * k, 368 * k) }
        drawPath(inner, LightPalette.markInner, alpha = 0.85f, style = Stroke(18 * k, cap = StrokeCap.Round, join = StrokeJoin.Round))
        drawCircle(LightPalette.accent, radius = 28 * k, center = p(256f, 240f))
    }
}
