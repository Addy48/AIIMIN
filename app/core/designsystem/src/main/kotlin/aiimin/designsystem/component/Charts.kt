package aiimin.designsystem.component

import aiimin.designsystem.theme.Aiimin
import aiimin.designsystem.theme.Motion
import aiimin.designsystem.theme.Shapes
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.animateIntAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import kotlin.math.max

@Immutable
data class RingSpec(val progress: Float, val color: Color, val label: String)

/**
 * Concentric progress rings (Apple Fitness): readable from arm's length.
 * Progress above 1 keeps sweeping in a second, darker lap.
 */
@Composable
fun Rings(rings: List<RingSpec>, modifier: Modifier = Modifier, size: Dp = 132.dp, stroke: Dp = 12.dp, gap: Dp = 4.dp) {
    val track = Aiimin.colors.raised
    val anim = rings.map { r ->
        val a = remember { Animatable(0f) }
        LaunchedEffect(r.progress) { a.animateTo(r.progress.coerceIn(0f, 2f), tween(900, easing = Motion.enter)) }
        a.value
    }
    Canvas(
        modifier.size(size).semantics {
            contentDescription = rings.joinToString { "${it.label} ${(it.progress * 100).toInt()} percent" }
        },
    ) {
        val sw = stroke.toPx()
        rings.forEachIndexed { i, r ->
            val inset = i * (sw + gap.toPx()) + sw / 2
            val arcSize = Size(this.size.width - inset * 2, this.size.height - inset * 2)
            val tl = Offset(inset, inset)
            drawArc(track, 0f, 360f, false, tl, arcSize, style = Stroke(sw))
            val p = anim[i]
            drawArc(r.color, -90f, 360f * p.coerceAtMost(1f), false, tl, arcSize, style = Stroke(sw, cap = StrokeCap.Round))
            if (p > 1f) {
                drawArc(r.color.copy(alpha = 0.55f), -90f, 360f * (p - 1f), false, tl, arcSize, style = Stroke(sw, cap = StrokeCap.Round))
            }
        }
    }
}

/** Single arc gauge for the Life Score (270° sweep, opens at the bottom). */
@Composable
fun ScoreArc(value: Float?, modifier: Modifier = Modifier, size: Dp = 200.dp, color: Color = Aiimin.colors.accent) {
    val track = Aiimin.colors.raised
    val p by animateFloatAsState(((value ?: 0f) / 100f).coerceIn(0f, 1f), tween(1100, easing = Motion.enter), label = "arc")
    Canvas(modifier.size(size)) {
        val sw = 14.dp.toPx()
        val inset = sw / 2
        val s = Size(this.size.width - sw, this.size.height - sw)
        drawArc(track, 135f, 270f, false, Offset(inset, inset), s, style = Stroke(sw, cap = StrokeCap.Round))
        if (value != null) drawArc(color, 135f, 270f * p, false, Offset(inset, inset), s, style = Stroke(sw, cap = StrokeCap.Round))
    }
}

/**
 * Vertical bars (Apple Health 24 h histogram). [highlight] marks "now";
 * values are relative to the max in view.
 */
@Composable
fun Bars(
    values: List<Float>,
    modifier: Modifier = Modifier,
    color: Color = Aiimin.colors.accent,
    highlight: Int? = null,
    height: Dp = 72.dp,
    labels: List<String>? = null,
    description: String = "Bar chart",
) {
    val c = Aiimin.colors
    val peak = max(values.maxOrNull() ?: 0f, 0.0001f)
    val grow by animateFloatAsState(1f, tween(700, easing = Motion.enter), label = "grow")
    Column(modifier.semantics { contentDescription = description }) {
        Canvas(Modifier.fillMaxWidth().height(height)) {
            val n = values.size.coerceAtLeast(1)
            val slot = this.size.width / n
            val bw = (slot * 0.62f).coerceAtLeast(2f)
            values.forEachIndexed { i, v ->
                val h = (v / peak) * this.size.height * grow
                val x = i * slot + (slot - bw) / 2
                val col = when {
                    highlight == null -> color
                    i == highlight -> color
                    else -> color.copy(alpha = 0.45f)
                }
                drawRoundRect(c.raised, Offset(x, 0f), Size(bw, this.size.height), CornerRadius(bw / 2))
                if (v > 0f) drawRoundRect(col, Offset(x, this.size.height - h), Size(bw, max(h, bw)), CornerRadius(bw / 2))
            }
        }
        if (labels != null) {
            Row(Modifier.fillMaxWidth().padding(top = 6.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                labels.forEach { Text(it, style = Aiimin.type.caption.copy(fontFeatureSettings = "tnum")) }
            }
        }
    }
}

/** A trend line with a soft fill, optional dashed baseline (your normal). */
@Composable
fun Sparkline(
    values: List<Float?>,
    modifier: Modifier = Modifier,
    color: Color = Aiimin.colors.accent,
    baseline: Float? = null,
    height: Dp = 64.dp,
) {
    val faint = Aiimin.colors.textFaint
    Canvas(modifier.fillMaxWidth().height(height)) {
        val pts = values.withIndex().filter { it.value != null }
        if (pts.size < 2) return@Canvas
        val lo = (pts.minOf { it.value!! }).coerceAtMost(baseline ?: Float.MAX_VALUE)
        val hi = (pts.maxOf { it.value!! }).coerceAtLeast(baseline ?: -Float.MAX_VALUE)
        val span = (hi - lo).takeIf { it > 0f } ?: 1f
        fun x(i: Int) = i / (values.size - 1).toFloat() * size.width
        fun y(v: Float) = size.height - (v - lo) / span * (size.height * 0.85f) - size.height * 0.075f
        val line = Path()
        pts.forEachIndexed { k, p -> if (k == 0) line.moveTo(x(p.index), y(p.value!!)) else line.lineTo(x(p.index), y(p.value!!)) }
        val fill = Path().apply {
            addPath(line)
            lineTo(x(pts.last().index), size.height)
            lineTo(x(pts.first().index), size.height)
            close()
        }
        drawPath(fill, color.copy(alpha = 0.12f))
        drawPath(line, color, style = Stroke(2.dp.toPx(), cap = StrokeCap.Round))
        if (baseline != null) {
            val by = y(baseline)
            var cx = 0f
            while (cx < size.width) {
                drawLine(faint, Offset(cx, by), Offset(cx + 6f, by), 1.dp.toPx())
                cx += 12f
            }
        }
        val last = pts.last()
        drawCircle(color, 3.5.dp.toPx(), Offset(x(last.index), y(last.value!!)))
    }
}

/** Thin progress bar with a rounded fill. */
@Composable
fun Meter(progress: Float, modifier: Modifier = Modifier, color: Color = Aiimin.colors.accent, height: Dp = 6.dp, overColor: Color = Aiimin.colors.danger) {
    val p by animateFloatAsState(progress.coerceIn(0f, 1f), tween(600, easing = Motion.enter), label = "meter")
    Box(modifier.fillMaxWidth().height(height).clip(Shapes.pill).background(Aiimin.colors.raised)) {
        Box(Modifier.fillMaxHeight().fillMaxWidth(p).clip(Shapes.pill).background(if (progress > 1f) overColor else color))
    }
}

/** Number that counts to its new value (score, totals, XP). */
@Composable
fun CountingNumber(value: Int, style: TextStyle, modifier: Modifier = Modifier, format: (Int) -> String = { it.toString() }) {
    val v by animateIntAsState(value, tween(700, easing = Motion.enter), label = "count")
    Text(format(v), style = style, modifier = modifier)
}

/** A labelled stat used in compact rows: big number, small unit, caption. */
@Composable
fun Stat(value: String, caption: String, modifier: Modifier = Modifier, unit: String? = null, color: Color = Aiimin.colors.text) {
    Column(modifier) {
        Row(verticalAlignment = Alignment.Bottom) {
            Text(value, style = Aiimin.type.numberMedium.copy(color = color))
            if (unit != null) Text(" $unit", style = Aiimin.type.caption, modifier = Modifier.padding(bottom = 2.dp))
        }
        Text(caption, style = Aiimin.type.caption)
    }
}

@Composable
fun FillBox(modifier: Modifier = Modifier) = Box(modifier.fillMaxSize())
