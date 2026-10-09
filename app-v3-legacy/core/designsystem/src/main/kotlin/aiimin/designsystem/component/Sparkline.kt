package aiimin.designsystem.component

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.clipRect
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import aiimin.designsystem.theme.AiiminTheme

/**
 * 7-day sparkline — shape only, no axes, no labels.
 *
 * Draws a single path that encodes the trend. Missing days (null) are rendered
 * as ghost dots — a break in the line. Inspired by Robinhood's inline portfolio
 * curve and Vercel's deployment-success sparklines.
 *
 * @param values  Ordered list of up to 7 data points (null = no data that day).
 *                Values are normalised internally — pass raw scores/counts.
 * @param color   Line colour; defaults to the theme accent.
 * @param height  Height of the canvas; keep small (20–32 dp) for inline use.
 */
@Composable
fun Sparkline(
    values: List<Float?>,
    modifier: Modifier = Modifier,
    color: Color? = null,
    height: Dp = 28.dp,
) {
    val accent = AiiminTheme.colors.accent
    val muted = AiiminTheme.colors.muted
    val reduceMotion = AiiminTheme.reduceMotion

    // Animate draw-in on first composition.
    var trigger by remember { mutableStateOf(false) }
    val progress by animateFloatAsState(
        targetValue = if (trigger) 1f else 0f,
        animationSpec = tween(if (reduceMotion) 0 else 500),
        label = "sparkline-draw",
    )
    LaunchedEffect(Unit) { trigger = true }

    val lineColor = color ?: accent
    val points = values.takeLast(7)
    val nonNull = points.filterNotNull()
    val min = nonNull.minOrNull() ?: 0f
    val max = nonNull.maxOrNull() ?: 1f
    val hasSpread = (max - min) > 0.001f
    val range = if (hasSpread) max - min else 1f

    Canvas(
        modifier = modifier
            .fillMaxWidth()
            .height(height),
    ) {
        val w = size.width
        val h = size.height
        val stepX = if (points.size > 1) w / (points.size - 1).toFloat() else w
        val padV = h * 0.14f

        // Build continuous segments (break on null).
        val segments = mutableListOf<MutableList<Offset>>()
        var current: MutableList<Offset>? = null

        points.forEachIndexed { i, v ->
            if (v == null) {
                current = null
            } else {
                val normY = if (hasSpread) (v - min) / range else 0.5f
                val x = i * stepX
                val y = h - padV - normY * (h - padV * 2)
                val pt = Offset(x, y)
                if (current == null) {
                    current = mutableListOf(pt).also { segments.add(it) }
                } else {
                    current?.add(pt)
                }
            }
        }

        clipRect(right = w * progress) {
            // Draw each segment as a smooth cubic bezier path.
            segments.forEach { seg ->
                if (seg.size == 1) {
                    drawCircle(color = lineColor, radius = 2.5f, center = seg[0])
                    return@forEach
                }
                val path = Path()
                path.moveTo(seg[0].x, seg[0].y)
                for (k in 1 until seg.size) {
                    val prev = seg[k - 1]
                    val curr = seg[k]
                    val cp1 = Offset((prev.x + curr.x) / 2f, prev.y)
                    val cp2 = Offset((prev.x + curr.x) / 2f, curr.y)
                    path.cubicTo(cp1.x, cp1.y, cp2.x, cp2.y, curr.x, curr.y)
                }
                drawPath(
                    path = path,
                    color = lineColor,
                    style = Stroke(
                        width = 1.5.dp.toPx(),
                        cap = StrokeCap.Round,
                        join = StrokeJoin.Round,
                    ),
                )
                // Terminal dot.
                drawCircle(color = lineColor, radius = 2.dp.toPx(), center = seg.last())
            }

            // Ghost dots for missing/null days.
            points.forEachIndexed { i, v ->
                if (v == null) {
                    val x = i * stepX
                    drawCircle(
                        color = muted.copy(alpha = 0.3f),
                        radius = 1.5.dp.toPx(),
                        center = Offset(x, h / 2f),
                    )
                }
            }
        }
    }
}
