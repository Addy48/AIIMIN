package aiimin.designsystem.component

import aiimin.designsystem.theme.LocalReduceMotion
import aiimin.designsystem.theme.Motion
import aiimin.designsystem.theme.Aiimin
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.gestures.detectDragGesturesAfterLongPress
import androidx.compose.foundation.gestures.detectHorizontalDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.RoundRect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextMeasurer
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.drawText
import androidx.compose.ui.text.rememberTextMeasurer
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import kotlin.math.max
import kotlin.math.min
import kotlin.math.roundToInt

/** One bar. [stub] draws a 2 % future stub; [gap] draws a dot (measured data with no reading). */
data class BarPoint(val value: Double, val stub: Boolean = false, val gap: Boolean = false)

/** An x-axis label at bar [index]. */
data class AxisLabel(val index: Int, val text: String)

/**
 * One interaction model for every chart (plan §2.12, handoff §7).
 * Tap selects (tap again clears); long-press then drag scrubs with a haptic tick per bar;
 * a quick horizontal swipe pages the period. The headline *above* the chart is the readout,
 * so nothing is drawn under the finger. Bars start at zero; selected bar = accent, the rest chartInactive.
 */
@Composable
internal fun ScrubBarChartCanvas(
    points: List<BarPoint>,
    selected: Int?,
    onSelect: (Int?) -> Unit,
    modifier: Modifier = Modifier,
    usual: Double? = null,
    usualLabel: String? = null,
    bandLow: Double? = null,
    bandHigh: Double? = null,
    labels: List<AxisLabel> = emptyList(),
    height: Dp = 200.dp,
    maxValue: Double? = null,
    onPage: ((Int) -> Unit)? = null,
    description: String = "Bar chart",
) {
    val c = Aiimin.colors
    val measurer = rememberTextMeasurer()
    val axis = Aiimin.type.axis
    val haptics = LocalHapticFeedback.current
    val grow = remember { Animatable(0f) }
    val reduce = LocalReduceMotion.current
    LaunchedEffect(points) {
        grow.snapTo(0f)
        grow.animateTo(1f, Motion.move(reduce, Motion.quick()))
    }
    val currentSelected = rememberUpdatedState(selected)
    val currentPoints = rememberUpdatedState(points)
    val barCount = points.size.coerceAtLeast(1)
    fun indexAt(x: Float, width: Float): Int = ((x / width) * barCount).toInt().coerceIn(0, barCount - 1)

    val colorSel = c.accent
    Canvas(
        modifier
            .fillMaxWidth()
            .height(height)
            .semantics { contentDescription = description }
            .pointerInput(Unit) {
                if (onPage != null) {
                    var total = 0f
                    detectHorizontalDragGestures(onDragStart = { total = 0f }, onDragEnd = {
                        if (kotlin.math.abs(total) > 80f) onPage(if (total < 0) 1 else -1)
                    }) { change, delta -> total += delta; change.consume() }
                }
            }
            .pointerInput(barCount) {
                detectTapGestures { pos ->
                    val i = indexAt(pos.x, size.width.toFloat())
                    onSelect(if (currentSelected.value == i) null else i)
                }
            }
            .pointerInput(barCount) {
                var last = -1
                detectDragGesturesAfterLongPress(
                    onDragStart = { pos ->
                        val i = indexAt(pos.x, size.width.toFloat())
                        last = i
                        haptics.performHapticFeedback(HapticFeedbackType.LongPress)
                        onSelect(i)
                    },
                    onDrag = { change, _ ->
                        change.consume()
                        val i = indexAt(change.position.x, size.width.toFloat())
                        if (i != last) {
                            last = i
                            haptics.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                            onSelect(i)
                        }
                    },
                )
            },
    ) {
        val dp1 = 1.dp.toPx()
        val w = size.width
        val topPad = 14 * dp1
        val bottomPad = if (labels.isEmpty()) 6 * dp1 else 22 * dp1
        val base = size.height - bottomPad
        val plotH = base - topPad
        val vmax = (maxValue ?: max(
            currentPoints.value.filter { !it.stub }.maxOfOrNull { it.value } ?: 1.0,
            max(bandHigh ?: 0.0, usual ?: 0.0),
        ) * 1.12).coerceAtLeast(1.0)
        fun y(v: Double) = base - (v / vmax * plotH).toFloat()
        val n = currentPoints.value.size
        if (n == 0) return@Canvas
        val gap = when { n > 20 -> 2.dp.toPx(); n > 10 -> 4.dp.toPx(); else -> 8.dp.toPx() }
        val bw = (w - gap * (n - 1)) / n
        // usual band
        if (bandLow != null && bandHigh != null) drawRect(c.band, Offset(0f, y(bandHigh)), Size(w, y(bandLow) - y(bandHigh)))
        // bars
        currentPoints.value.forEachIndexed { i, p ->
            val x = i * (bw + gap)
            if (p.gap) {
                drawCircle(c.borderStrong, 1.6f * dp1, Offset(x + bw / 2, base - 3 * dp1))
                return@forEachIndexed
            }
            val v = if (p.stub) vmax * 0.02 else p.value
            val h = ((v / vmax) * plotH).toFloat().coerceAtLeast(1.5f * dp1) * (if (p.stub) 1f else grow.value)
            val color = when {
                p.stub -> c.futureBar
                currentSelected.value == i -> colorSel
                currentSelected.value != null -> c.chartInactive
                else -> c.text
            }
            val r = 3.dp.toPx()
            val path = Path().apply {
                addRoundRect(RoundRect(x, base - h, x + bw, base, CornerRadius(r), CornerRadius(r), CornerRadius(1.dp.toPx()), CornerRadius(1.dp.toPx())))
            }
            drawPath(path, color)
        }
        // baseline
        drawLine(c.text, Offset(0f, base), Offset(w, base), strokeWidth = dp1)
        // dashed usual line with a bg-backed label at the right end
        if (usual != null) {
            val yy = y(usual)
            drawLine(c.bandLine, Offset(0f, yy), Offset(w, yy), strokeWidth = 1.5f * dp1, pathEffect = PathEffect.dashPathEffect(floatArrayOf(4 * dp1, 4 * dp1)))
            if (usualLabel != null) {
                val l = measurer.measure(usualLabel, axis.copy(color = c.textMuted))
                val lx = w - l.size.width - 4 * dp1
                val ly = yy - l.size.height - 3 * dp1
                drawRect(c.base, Offset(lx - 4 * dp1, ly - 1 * dp1), Size(l.size.width + 8 * dp1, l.size.height + 2 * dp1))
                drawText(l, topLeft = Offset(lx, ly))
            }
        }
        // selection hairline
        currentSelected.value?.let { i ->
            if (i in 0 until n) {
                val cx = i * (bw + gap) + bw / 2
                drawLine(c.text.copy(alpha = 0.35f), Offset(cx, topPad - 6 * dp1), Offset(cx, base), strokeWidth = dp1)
            }
        }
        axisLabels(measurer, axis, labels, n, bw, gap, w, base, c.textMuted)
    }
}

private fun DrawScope.axisLabels(measurer: TextMeasurer, style: TextStyle, labels: List<AxisLabel>, n: Int, bw: Float, gap: Float, w: Float, base: Float, color: Color) {
    labels.forEach { l ->
        val layout = measurer.measure(l.text, style.copy(color = color))
        val cx = l.index * (bw + gap) + bw / 2
        val x = when (l.index) {
            0 -> 0f
            n - 1 -> w - layout.size.width
            else -> (cx - layout.size.width / 2f).coerceIn(0f, w - layout.size.width)
        }
        drawText(layout, topLeft = Offset(x, base + 6.dp.toPx()))
    }
}

/** A point on a trend line; a null [value] is a gap (never zero, never interpolated). */
data class LinePoint(val value: Double?, val hollow: Boolean = false)

/**
 * The Life Score line (handoff §7): domain min(values,66)−2 … max(values,70)+2, the "your usual" band,
 * 2 dp ink line with round joins, a 6 dp accent marker with a 2 dp bg stroke, a 1 dp hairline at the selection.
 * The drag area covers the full chart height.
 */
@Composable
fun ScrubLineChart(
    points: List<LinePoint>,
    selected: Int?,
    onSelect: (Int?) -> Unit,
    modifier: Modifier = Modifier,
    bandLow: Double? = null,
    bandHigh: Double? = null,
    bandLabel: String? = "your usual",
    secondary: List<Double?>? = null,
    labels: List<AxisLabel> = emptyList(),
    height: Dp = 190.dp,
    domainMin: Double? = null,
    domainMax: Double? = null,
    onPage: ((Int) -> Unit)? = null,
    description: String = "Trend line",
) {
    val c = Aiimin.colors
    val measurer = rememberTextMeasurer()
    val axis = Aiimin.type.axis
    val haptics = LocalHapticFeedback.current
    val draw = remember { Animatable(0f) }
    val reduce = LocalReduceMotion.current
    LaunchedEffect(points.size, points.firstOrNull()?.value) {
        draw.snapTo(0f)
        draw.animateTo(1f, Motion.move(reduce, Motion.emphasised()))
    }
    val currentSelected = rememberUpdatedState(selected)
    val n = points.size.coerceAtLeast(1)
    fun indexAt(x: Float, width: Float): Int = if (n <= 1) 0 else ((x / width) * (n - 1)).roundToInt().coerceIn(0, n - 1)
    Canvas(
        modifier
            .fillMaxWidth()
            .height(height)
            .semantics { contentDescription = description }
            .pointerInput(Unit) {
                if (onPage != null) {
                    var total = 0f
                    detectHorizontalDragGestures(onDragStart = { total = 0f }, onDragEnd = { if (kotlin.math.abs(total) > 80f) onPage(if (total < 0) 1 else -1) }) { ch, d -> total += d; ch.consume() }
                }
            }
            .pointerInput(n) {
                detectTapGestures { pos ->
                    val i = indexAt(pos.x, size.width.toFloat())
                    onSelect(if (currentSelected.value == i) null else i)
                }
            }
            .pointerInput(n) {
                var last = -1
                detectDragGesturesAfterLongPress(
                    onDragStart = { pos -> last = indexAt(pos.x, size.width.toFloat()); haptics.performHapticFeedback(HapticFeedbackType.LongPress); onSelect(last) },
                    onDrag = { ch, _ ->
                        ch.consume()
                        val i = indexAt(ch.position.x, size.width.toFloat())
                        if (i != last) { last = i; haptics.performHapticFeedback(HapticFeedbackType.TextHandleMove); onSelect(i) }
                    },
                )
            },
    ) {
        val dp1 = 1.dp.toPx()
        val w = size.width
        val topPad = 14 * dp1
        val bottomPad = if (labels.isEmpty()) 8 * dp1 else 24 * dp1
        val base = size.height - bottomPad
        val plotH = base - topPad
        val vals = points.mapNotNull { it.value }
        if (vals.isEmpty()) {
            drawLine(c.text, Offset(0f, base), Offset(w, base), strokeWidth = dp1)
            return@Canvas
        }
        val lo = domainMin ?: (min(vals.min(), 66.0) - 2)
        val hi = domainMax ?: (max(vals.max(), 70.0) + 2)
        fun y(v: Double) = base - (((v - lo) / (hi - lo)) * plotH).toFloat()
        fun x(i: Int) = if (n <= 1) w / 2 else i * (w / (n - 1))
        if (bandLow != null && bandHigh != null) {
            drawRect(c.bandScore, Offset(0f, y(bandHigh)), Size(w, y(bandLow) - y(bandHigh)))
            if (bandLabel != null) {
                val l = measurer.measure(bandLabel, axis.copy(color = c.violet))
                drawText(l, topLeft = Offset(w - l.size.width - 4 * dp1, y(bandHigh) + 3 * dp1))
            }
        }
        drawLine(c.text, Offset(0f, base), Offset(w, base), strokeWidth = dp1)
        // secondary (form) line: thin, dotted
        secondary?.let { sec ->
            val p = Path()
            var started = false
            sec.forEachIndexed { i, v ->
                if (v == null) { started = false; return@forEachIndexed }
                if (!started) { p.moveTo(x(i), y(v)); started = true } else p.lineTo(x(i), y(v))
            }
            drawPath(p, c.textMuted, style = Stroke(1.2f * dp1, cap = StrokeCap.Round, pathEffect = PathEffect.dashPathEffect(floatArrayOf(1 * dp1, 3.5f * dp1))))
        }
        // level line, broken at gaps, drawn in as the chart appears
        val shownTo = (n * draw.value).toInt()
        var path = Path()
        var started = false
        fun flush() {
            if (started) drawPath(path, c.text, style = Stroke(2 * dp1, cap = StrokeCap.Round, join = StrokeJoin.Round))
            path = Path(); started = false
        }
        points.forEachIndexed { i, p ->
            if (i > shownTo) return@forEachIndexed
            val v = p.value
            if (v == null) { flush(); return@forEachIndexed }
            if (!started) { path.moveTo(x(i), y(v)); started = true } else path.lineTo(x(i), y(v))
        }
        flush()
        // rest / paused days: hollow marks
        points.forEachIndexed { i, p ->
            val v = p.value
            if (p.hollow && v != null && i <= shownTo) {
                drawCircle(c.base, 3.5f * dp1, Offset(x(i), y(v)))
                drawCircle(c.text, 3.5f * dp1, Offset(x(i), y(v)), style = Stroke(1.4f * dp1))
            }
        }
        // selection / today marker
        val sel = currentSelected.value
        val markIdx = sel ?: points.indexOfLast { it.value != null }
        if (sel != null && points.getOrNull(sel)?.value != null && sel != n - 1) {
            drawLine(c.text.copy(alpha = 0.4f), Offset(x(sel), topPad - 6 * dp1), Offset(x(sel), base), strokeWidth = dp1)
        }
        points.getOrNull(markIdx)?.value?.let { v ->
            drawCircle(c.base, 6 * dp1, Offset(x(markIdx), y(v)))
            drawCircle(c.accent, 4 * dp1, Offset(x(markIdx), y(v)))
        }
        axisLabels(measurer, axis, labels, n, w, base, c.textMuted) { i -> x(i) }
    }
}

private fun DrawScope.axisLabels(measurer: TextMeasurer, style: TextStyle, labels: List<AxisLabel>, n: Int, w: Float, base: Float, color: Color, xOf: (Int) -> Float) {
    labels.forEach { l ->
        val layout = measurer.measure(l.text, style.copy(color = color))
        val cx = xOf(l.index)
        val x = when (l.index) {
            0 -> 0f
            n - 1 -> w - layout.size.width
            else -> (cx - layout.size.width / 2f).coerceIn(0f, w - layout.size.width)
        }
        drawText(layout, topLeft = Offset(x, base + 6.dp.toPx()))
    }
}
