package aiimin.designsystem.component

import aiimin.designsystem.theme.LocalReduceMotion
import aiimin.designsystem.theme.Aiimin
import aiimin.designsystem.theme.Motion
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.gestures.detectHorizontalDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawWithCache
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.clipRect
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextLayoutResult
import androidx.compose.ui.text.drawText
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.rememberTextMeasurer
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlin.math.max

/**
 * Everything the month chart draws, in rupees. [daily] covers the whole month (future days 0);
 * [cumulative] covers the [elapsed] days only. With no plan, [pace], [low] and [high] are null.
 * [guides] are faint reference lines with a short label ("₹20k").
 */
data class PaceChartData(
    val daily: List<Double>,
    val cumulative: List<Double>,
    val pace: List<Double>?,
    val plan: Double?,
    val low: Double?,
    val high: Double?,
    val over: List<Boolean>,
    val spikeIndex: Int?,
    val spikeLabel: String?,
    val planLabel: String?,
    val labels: List<AxisLabel>,
    val guides: List<Pair<Double, String>> = emptyList(),
) {
    val elapsed get() = cumulative.size
    /** Where today stands: ahead of pace or not. Drives the line's colour at its tip. */
    val aheadNow get() = over.getOrNull(elapsed - 1) == true
}

/**
 * The month as one climbing line (plan Phase 20).
 *
 * - The line is a smooth curve in deep green while spending is on track, and turns orange only
 *   where it runs ahead of the even pace to plan: the colour is the answer.
 * - Above the pace line sits a warm "over plan" zone, so crossing into it reads at a glance.
 * - A soft cone shows where the month is likely to land; today breathes gently.
 * - Light rounded daily bars sit underneath for context; the biggest day wears a small label.
 *
 * Drag or tap to read a day in the headline above; the reading lets go 1.5 s after the finger does.
 */
@Composable
fun PaceChart(
    data: PaceChartData,
    selected: Int?,
    onSelect: (Int?) -> Unit,
    modifier: Modifier = Modifier,
    height: Dp = 220.dp,
    /** Colour of the small daily bars along the bottom. */
    barTint: Color = Aiimin.colors.borderStrong,
    description: String,
) {
    val c = Aiimin.colors
    val measurer = rememberTextMeasurer()
    val axis = Aiimin.type.axis
    val haptics = LocalHapticFeedback.current
    val draw = remember { Animatable(0f) }
    // Today pulses once after the line draws in, then rests (Part 26.5: nothing loops).
    val pulse = remember { Animatable(1f) }
    val reduce = LocalReduceMotion.current
    LaunchedEffect(data.daily, data.cumulative) {
        draw.snapTo(0f)
        draw.animateTo(1f, Motion.move(reduce, Motion.emphasised()))
        if (!reduce) {
            pulse.snapTo(0f)
            pulse.animateTo(1f, Motion.ambient())
        }
    }
    val n = data.daily.size.coerceAtLeast(1)
    val sel = rememberUpdatedState(selected)
    val scope = rememberCoroutineScope()
    val release = remember { arrayOfNulls<Job>(1) }
    fun indexAt(x: Float, w: Float) = ((x / w) * n).toInt().coerceIn(0, n - 1)

    Box(
        modifier
            .fillMaxWidth()
            .height(height)
            .semantics { contentDescription = description }
            .pointerInput(n) {
                detectTapGestures { pos ->
                    val i = indexAt(pos.x, size.width.toFloat())
                    onSelect(if (sel.value == i) null else i)
                }
            }
            .pointerInput(n) {
                var last = -1
                detectHorizontalDragGestures(
                    onDragStart = { pos ->
                        release[0]?.cancel()
                        last = indexAt(pos.x, size.width.toFloat())
                        haptics.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                        onSelect(last)
                    },
                    onDragEnd = { release[0] = scope.launch { delay(1_500); onSelect(null) } },
                    onDragCancel = { release[0] = scope.launch { delay(1_500); onSelect(null) } },
                ) { change, _ ->
                    change.consume()
                    val i = indexAt(change.position.x, size.width.toFloat())
                    if (i != last) {
                        last = i
                        haptics.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                        onSelect(i)
                    }
                }
            },
    ) {
        // Base layer is built once per data and size; scrubbing and the breathing dot only redraw the overlay.
        PaceBase(data, barTint, reveal = { draw.value })
        Canvas(Modifier.matchParentSize()) {
            val g = PaceGeometry(data, size.width, size.height, density)
            val tone = if (data.aheadNow) c.accent else c.done
            val i = sel.value
            val e = data.elapsed
            if (i == null) {
                if (draw.value < 1f || e == 0) return@Canvas
                // Today: a dot with a slow ripple, so the chart reads as live without shouting.
                val tip = Offset(g.x(e - 1), g.y(data.cumulative[e - 1]))
                val p = pulse.value
                drawCircle(tone.copy(alpha = 0.22f * (1f - p)), (6 + 12 * p) * g.dp1, tip)
                drawCircle(c.surface, 6.5f * g.dp1, tip)
                drawCircle(tone, 4.5f * g.dp1, tip)
                val si = data.spikeIndex
                if (si != null && data.spikeLabel != null) {
                    val l = measurer.measure(data.spikeLabel, axis.copy(color = c.textMuted))
                    val barTop = g.barTop(si)
                    val padX = 7 * g.dp1
                    val chipW = l.size.width + padX * 2
                    val chipH = l.size.height + 6 * g.dp1
                    // Keep clear of the "₹20k" guide labels on the left edge (24 Oct pass).
                    val lx = (g.x(si) - chipW / 2f).coerceIn((40 * g.dp1).coerceAtMost(g.w - chipW), g.w - chipW)
                    // D-006: the chip never sits on the running-total line; it moves above it, or below it when there is no room.
                    val under = (0 until e).filter { g.x(it) in lx - 4 * g.dp1..lx + chipW + 4 * g.dp1 }.map { g.y(data.cumulative[it]) }
                    val ly = spikeChipTop(barTop - g.barZone * 0.6f - chipH, chipH, under.minOrNull(), under.maxOrNull(), 5 * g.dp1, barTop - 3 * g.dp1)
                    drawLine(c.borderStrong, Offset(g.x(si), ly + chipH), Offset(g.x(si), barTop - 3 * g.dp1), strokeWidth = g.dp1)
                    chip(Offset(lx, ly), Size(chipW, chipH), c.surface, c.border, g.dp1)
                    drawText(l, topLeft = Offset(lx + padX, ly + 3 * g.dp1))
                }
                return@Canvas
            }
            if (i !in 0 until n) return@Canvas
            data.daily.getOrNull(i)?.takeIf { it > 0 }?.let {
                val top = g.barTop(i)
                drawRoundRect(c.text.copy(alpha = 0.7f), Offset(g.x(i) - g.barW / 2, top), Size(g.barW, g.base - top), CornerRadius(g.barW / 2))
            }
            drawLine(c.text.copy(alpha = 0.28f), Offset(g.x(i), g.top - 10 * g.dp1), Offset(g.x(i), g.base), strokeWidth = g.dp1)
            if (i < e) {
                val p = Offset(g.x(i), g.y(data.cumulative[i]))
                val t = if (data.over.getOrNull(i) == true) c.accent else c.done
                drawCircle(t.copy(alpha = 0.18f), 11 * g.dp1, p)
                drawCircle(c.surface, 6.5f * g.dp1, p)
                drawCircle(t, 4.5f * g.dp1, p)
            }
        }
    }
}

/** Shared scales for both layers. */
private class PaceGeometry(val data: PaceChartData, val w: Float, h: Float, density: Float) {
    val n = data.daily.size.coerceAtLeast(1)
    val dp1 = density
    val top = 26 * dp1
    val base = h - 24 * dp1
    val plotH = base - top
    val vmax = max(max(data.plan ?: 0.0, data.high ?: 0.0), data.cumulative.maxOrNull() ?: 0.0).coerceAtLeast(1.0) * 1.04
    val dayMax = data.daily.maxOrNull()?.takeIf { it > 0 } ?: 1.0
    val barW = (w / n * 0.46f).coerceIn(2 * dp1, 10 * dp1)
    val barZone = plotH * 0.24f
    fun x(i: Int) = (i + 0.5f) / n * w
    fun y(v: Double) = base - (v / vmax * plotH).toFloat()
    fun barTop(i: Int) = base - (data.daily[i] / dayMax * barZone).toFloat().coerceAtLeast(2 * dp1)
}

/**
 * Where the spike label's chip goes (D-006): [preferred] unless it overlaps the line between [lineTop] and
 * [lineBottom] (canvas y, top is 0); then above the line, or below it when the top has no room. Never below [floor].
 */
internal fun spikeChipTop(preferred: Float, chipH: Float, lineTop: Float?, lineBottom: Float?, gap: Float, floor: Float): Float {
    if (lineTop == null || lineBottom == null) return preferred
    val clear = preferred + chipH + gap <= lineTop || preferred - gap >= lineBottom
    if (clear) return preferred
    val above = lineTop - gap - chipH
    if (above >= 0f) return above
    val below = lineBottom + gap
    return if (below + chipH <= floor) below else preferred.coerceAtLeast(0f)
}

private fun DrawScope.chip(at: Offset, size: Size, fill: Color, stroke: Color, dp1: Float) {
    drawRoundRect(fill, at, size, CornerRadius(size.height / 2))
    drawRoundRect(stroke, at, size, CornerRadius(size.height / 2), style = Stroke(dp1))
}

/**
 * A smooth curve through [pts] that never overshoots (monotone cubic, Fritsch–Carlson), so a
 * running total that only climbs is drawn as a curve that only climbs.
 */
private fun smooth(pts: List<Offset>): Path {
    val path = Path()
    if (pts.isEmpty()) return path
    path.moveTo(pts[0].x, pts[0].y)
    if (pts.size == 1) return path
    val n = pts.size
    val d = FloatArray(n - 1) { (pts[it + 1].y - pts[it].y) / (pts[it + 1].x - pts[it].x).coerceAtLeast(0.0001f) }
    val m = FloatArray(n)
    m[0] = d[0]
    m[n - 1] = d[n - 2]
    for (i in 1 until n - 1) m[i] = if (d[i - 1] * d[i] <= 0f) 0f else (d[i - 1] + d[i]) / 2f
    for (i in 0 until n - 1) {
        if (d[i] == 0f) { m[i] = 0f; m[i + 1] = 0f; continue }
        val a = m[i] / d[i]
        val b = m[i + 1] / d[i]
        val s = a * a + b * b
        if (s > 9f) {
            val t = 3f / kotlin.math.sqrt(s)
            m[i] = t * a * d[i]
            m[i + 1] = t * b * d[i]
        }
    }
    for (i in 0 until n - 1) {
        val h = pts[i + 1].x - pts[i].x
        path.cubicTo(
            pts[i].x + h / 3f, pts[i].y + m[i] * h / 3f,
            pts[i + 1].x - h / 3f, pts[i + 1].y - m[i + 1] * h / 3f,
            pts[i + 1].x, pts[i + 1].y,
        )
    }
    return path
}

@Composable
private fun PaceBase(data: PaceChartData, barTint: Color, reveal: () -> Float) {
    val c = Aiimin.colors
    val measurer = rememberTextMeasurer()
    val axis = Aiimin.type.axis
    Spacer(
        Modifier.fillMaxSize().drawWithCache {
            val g = PaceGeometry(data, size.width, size.height, density)
            val dp1 = g.dp1
            val w = g.w
            val e = data.elapsed
            val tone = if (data.aheadNow) c.accent else c.done
            val toneSoft = if (data.aheadNow) c.accentSoft else c.doneSoft

            val pts = buildList {
                add(Offset(0f, g.base))
                for (i in 0 until e) add(Offset(g.x(i), g.y(data.cumulative[i])))
            }
            val tip = pts.last()
            val line = smooth(pts)
            val fill = Path().apply {
                addPath(line)
                lineTo(tip.x, g.base)
                close()
            }
            // The line's own colour changes at the day it crosses pace (hard stops).
            val lineBrush = if (data.over.any { it }) {
                val stops = ArrayList<Pair<Float, Color>>()
                var prev: Color? = null
                for (i in 0 until e) {
                    val col = if (data.over[i]) c.accent else c.done
                    val f = (g.x(i) - w / g.n / 2f).coerceAtLeast(0f) / w
                    if (prev != null && col != prev) stops += f to prev
                    if (col != prev) stops += f to col
                    prev = col
                }
                stops += 1f to (prev ?: c.done)
                if (stops.first().first > 0f) stops.add(0, 0f to stops.first().second)
                Brush.horizontalGradient(*stops.toTypedArray(), startX = 0f, endX = w)
            } else Brush.horizontalGradient(listOf(c.done, c.done))
            val fillBrush = Brush.verticalGradient(listOf(toneSoft.copy(alpha = 0.95f), toneSoft.copy(alpha = 0f)), startY = g.y(data.cumulative.maxOrNull() ?: 0.0), endY = g.base)

            // Over-plan zone: a warm glow hugging the pace line on its upper side, fading upward.
            val planY = data.plan?.let { g.y(it) }
            val glow = 44 * dp1
            val zone = planY?.let {
                Path().apply {
                    moveTo(0f, g.base)
                    lineTo(w, it)
                    lineTo(w, it - glow)
                    lineTo(0f, g.base - glow)
                    close()
                }
            }
            val zoneBrush = planY?.let {
                // Perpendicular to the pace line: from the line itself out to `glow` above it.
                val dx = w
                val dy = it - g.base
                val len = kotlin.math.sqrt(dx * dx + dy * dy)
                val up = Offset(dy / len, -dx / len) // unit normal pointing above the line
                val mid = Offset(w / 2f, (g.base + it) / 2f)
                Brush.linearGradient(listOf(c.accentSoft, c.accentSoft.copy(alpha = 0f)), start = mid, end = mid + up * glow)
            }

            val cone = if (data.low != null && data.high != null && e in 1 until g.n) Path().apply {
                moveTo(tip.x, tip.y)
                lineTo(w, g.y(data.high))
                lineTo(w, g.y(data.low))
                close()
            } else null
            // Orange only when even the low end lands over plan; a range that merely touches it stays green.
            val coneTone = if (data.plan != null && data.low != null && data.low > data.plan) c.accent else c.done
            val coneBrush = Brush.horizontalGradient(listOf(coneTone.copy(alpha = 0.20f), coneTone.copy(alpha = 0.06f)), startX = tip.x, endX = w)

            val dashed = PathEffect.dashPathEffect(floatArrayOf(5 * dp1, 5 * dp1))
            val dotted = PathEffect.dashPathEffect(floatArrayOf(1.5f * dp1, 4 * dp1))
            val planText: TextLayoutResult? = data.planLabel?.let { measurer.measure(it, axis.copy(color = c.text, fontWeight = FontWeight.SemiBold)) }
            val guideText = data.guides.map { (v, t) -> v to measurer.measure(t, axis.copy(color = c.textFaint)) }
            val axisText = data.labels.map { it to measurer.measure(it.text, axis.copy(color = c.textMuted)) }

            onDrawBehind {
                if (zone != null && zoneBrush != null) drawPath(zone, zoneBrush)
                // Faint reference lines ("₹20k") on the left, under everything else.
                guideText.forEach { (v, l) ->
                    val gy = g.y(v)
                    drawLine(c.border, Offset(l.size.width + 6 * dp1, gy), Offset(w, gy), strokeWidth = dp1, pathEffect = dotted)
                    drawText(l, topLeft = Offset(0f, gy - l.size.height / 2f))
                }
                // Daily bars: light, rounded, scaled to their own peak.
                data.daily.forEachIndexed { i, v ->
                    if (v <= 0.0) return@forEachIndexed
                    val t = g.barTop(i)
                    drawRoundRect(barTint.copy(alpha = 0.3f), Offset(g.x(i) - g.barW / 2, t), Size(g.barW, g.base - t), CornerRadius(g.barW / 2))
                }
                // Pace: the even climb to plan, with the plan named in a small chip at the end.
                if (planY != null) {
                    drawLine(c.bandLine, Offset(0f, g.base), Offset(w, planY), strokeWidth = 1.4f * dp1, pathEffect = dashed, cap = StrokeCap.Round)
                    planText?.let { l ->
                        val padX = 8 * dp1
                        val cw = l.size.width + padX * 2
                        val ch = l.size.height + 6 * dp1
                        val at = Offset(w - cw, (planY - ch - 6 * dp1).coerceAtLeast(0f))
                        chip(at, Size(cw, ch), c.surface, c.border, dp1)
                        drawText(l, topLeft = Offset(at.x + padX, at.y + 3 * dp1))
                    }
                }
                val r = reveal()
                clipRect(right = w * r) {
                    if (e > 0) {
                        cone?.let {
                            drawPath(it, coneBrush)
                            drawLine(coneTone.copy(alpha = 0.55f), tip, Offset(w, g.y((data.low!! + data.high!!) / 2)), strokeWidth = 1.4f * dp1, pathEffect = dotted, cap = StrokeCap.Round)
                        }
                        drawPath(fill, fillBrush)
                        drawPath(line, lineBrush, style = Stroke(3f * dp1, cap = StrokeCap.Round, join = StrokeJoin.Round))
                    }
                }
                if (r < 1f && e > 0) {
                    // The pen while the line draws in.
                    val px = (w * r).coerceAtMost(tip.x)
                    if (px > 0f && px < tip.x) drawCircle(tone, 3.5f * dp1, Offset(px, nearestY(pts, px)))
                }
                drawLine(c.border, Offset(0f, g.base), Offset(w, g.base), strokeWidth = dp1)
                axisText.forEach { (lab, l) ->
                    val lx = when (lab.index) {
                        0 -> 0f
                        g.n - 1 -> w - l.size.width
                        else -> (g.x(lab.index) - l.size.width / 2f).coerceIn(0f, w - l.size.width)
                    }
                    drawText(l, topLeft = Offset(lx, g.base + 7 * dp1))
                }
            }
        },
    )
}

/** Straight-line estimate of the curve's height at [x], good enough for the drawing pen. */
private fun nearestY(pts: List<Offset>, x: Float): Float {
    for (i in 1 until pts.size) {
        if (x <= pts[i].x) {
            val a = pts[i - 1]
            val b = pts[i]
            val t = ((x - a.x) / (b.x - a.x).coerceAtLeast(0.0001f)).coerceIn(0f, 1f)
            return a.y + (b.y - a.y) * t
        }
    }
    return pts.last().y
}
