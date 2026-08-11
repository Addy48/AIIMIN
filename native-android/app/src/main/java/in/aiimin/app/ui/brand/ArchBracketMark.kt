package `in`.aiimin.app.ui.brand

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import `in`.aiimin.app.ui.theme.Accent

/**
 * AIIMIN Arch Bracket mark — matches website EDITOR_PICK / DARK_PICK.
 */
@Composable
fun ArchBracketMark(
    modifier: Modifier = Modifier,
    size: Dp = 72.dp,
    darkChip: Boolean = false,
) {
    val chipFill = if (darkChip) Color(0xFF14171A) else Color.White
    val chipStroke = if (darkChip) Color(0xFF2A2A2E) else Color(0xFFB8C0CC)
    val arch = if (darkChip) Color(0xFF6B7280) else Color(0xFFD1D5DB)
    val outer = if (darkChip) Color(0xFFEDE4D3) else Color(0xFF14171A)
    val inner = if (darkChip) Color(0xFFB9AF9E) else Color(0xFF6B7280)
    val archAlpha = if (darkChip) 0.65f else 0.9f
    val innerAlpha = if (darkChip) 0.75f else 0.85f

    Canvas(modifier = modifier.size(size)) {
        val s = this.size.minDimension
        val scale = s / 512f
        fun sx(x: Float) = x * scale
        fun sy(y: Float) = y * scale

        drawRoundRect(
            color = chipFill,
            size = Size(s, s),
            cornerRadius = CornerRadius(112f * scale, 112f * scale),
        )
        drawRoundRect(
            color = chipStroke,
            size = Size(s, s),
            cornerRadius = CornerRadius(112f * scale, 112f * scale),
            style = Stroke(width = 4f * scale),
        )

        // Arch — cubic approx via path strokes (two arcs as cubic segments)
        val archPath = androidx.compose.ui.graphics.Path().apply {
            moveTo(sx(80f), sy(384f))
            cubicTo(sx(80f), sy(192f), sx(208f), sy(112f), sx(256f), sy(112f))
            cubicTo(sx(304f), sy(112f), sx(432f), sy(192f), sx(432f), sy(384f))
        }
        drawPath(
            path = archPath,
            color = arch.copy(alpha = archAlpha),
            style = Stroke(width = 24f * scale, cap = StrokeCap.Round),
        )

        val outerPath = androidx.compose.ui.graphics.Path().apply {
            moveTo(sx(144f), sy(384f))
            lineTo(sx(256f), sy(176f))
            lineTo(sx(368f), sy(384f))
        }
        drawPath(
            path = outerPath,
            color = outer,
            style = Stroke(width = 24f * scale, cap = StrokeCap.Round, join = StrokeJoin.Round),
        )

        val innerPath = androidx.compose.ui.graphics.Path().apply {
            moveTo(sx(192f), sy(368f))
            lineTo(sx(256f), sy(272f))
            lineTo(sx(320f), sy(368f))
        }
        drawPath(
            path = innerPath,
            color = inner.copy(alpha = innerAlpha),
            style = Stroke(width = 18f * scale, cap = StrokeCap.Round, join = StrokeJoin.Round),
        )

        drawCircle(
            color = Accent,
            radius = 28f * scale,
            center = Offset(sx(256f), sy(240f)),
        )
    }
}
