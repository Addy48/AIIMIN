package aiimin.designsystem.component

import aiimin.designsystem.theme.Aiimin
import aiimin.designsystem.theme.Horizon
import aiimin.designsystem.theme.LocalReduceMotion
import aiimin.designsystem.theme.Motion
import androidx.compose.animation.core.Animatable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.drawText
import androidx.compose.ui.text.rememberTextMeasurer
import androidx.compose.ui.unit.dp
import kotlin.math.PI
import kotlin.math.pow
import kotlin.math.sin

/** A tick on the day line: when it happens (minutes since midnight) and the label under it. */
data class HorizonTick(val minute: Int, val label: String)

/**
 * Today's horizon (handoff §6 T1, slimmed to 72 dp in PRD 1.2): y = 50 − 40·sin(πx/W)^1.3 from 7 AM to 11 PM (the sun stays inside).
 * Solid ink up to now, dotted after; baseline at y = 78; sun r=8 at now;
 * 2 dp ticks at the next items, labels skipped when closer than 40 dp.
 * Only the sun, horizon and dotted arc change with the hour; the background never does.
 * On the first open the sun slides along the arc to now (600 ms, Part 26.5), then rests.
 */
@Composable
fun DayHorizon(
    nowMinute: Int,
    ticks: List<HorizonTick>,
    horizon: Horizon,
    modifier: Modifier = Modifier,
    description: String = "Your day so far",
    /** The arc runs from waking to sleep (PRD 1.6 screen 2); a sleep time after midnight runs into the next day. */
    wakeMinute: Int = 7 * 60,
    sleepMinute: Int = 23 * 60,
    /** Shown under the arc at night, e.g. "Tomorrow starts at 7:00" (1.3 night state). */
    nightLabel: String = "",
) {
    val measurer = rememberTextMeasurer()
    val axis = Aiimin.type.axis
    val reduce = LocalReduceMotion.current
    var slid by rememberSaveable { mutableStateOf(false) }
    val travel = remember { Animatable(if (slid || reduce) 1f else 0f) }
    LaunchedEffect(Unit) {
        if (!slid) {
            travel.animateTo(1f, Motion.move(reduce, Motion.arc()))
            slid = true
        }
    }
    Canvas(modifier.fillMaxWidth().height(72.dp).semantics { contentDescription = description }) {
        val w = size.width
        val dp = 1.dp.toPx()
        val base = 50 * dp
        val start = wakeMinute
        val end = if (sleepMinute > wakeMinute) sleepMinute else sleepMinute + 24 * 60
        // After midnight on a late day, the small hours belong to the evening before.
        fun onDay(min: Int) = if (end > 24 * 60 && min < start) min + 24 * 60 else min
        fun frac(min: Int) = ((min - start).toFloat() / (end - start)).coerceIn(0f, 1f)
        // Inset by the sun's radius so the sun at wake or day end sits inside the 16 dp margins, never past them.
        val sunR = 8 * dp
        fun px(min: Int) = sunR + frac(min) * (w - 2 * sunR)
        // sin(PI.toFloat()) is a hair below zero, and a negative to the 1.3 power is NaN: clamp, or the arc and sun vanish at day end.
        fun py(min: Int): Float = base - (40 * dp) * sin(PI.toFloat() * frac(min)).coerceAtLeast(0f).toDouble().pow(1.3).toFloat()
        val target = onDay(nowMinute).coerceIn(start, end)
        val now = (start + (target - start) * travel.value).toInt()
        fun path(a: Int, b: Int): Path = Path().apply {
            var m = a
            moveTo(px(a), py(a))
            while (m < b) { m = (m + 6).coerceAtMost(b); lineTo(px(m), py(m)) }
        }
        // Night (1.3): after the day end and before waking, the day's arc is complete and a moon ring rests at its end.
        val night = onDay(nowMinute) !in start..end
        if (night) {
            drawPath(path(start, end), horizon.line, style = Stroke(2.2f * dp, cap = StrokeCap.Round))
            drawLine(horizon.line, Offset(0f, base), Offset(w, base), strokeWidth = 1.5f * dp)
            drawCircle(aiimin.designsystem.theme.Sky.moon, sunR, Offset(px(end), py(end)), style = Stroke(2f * dp))
            if (nightLabel.isNotEmpty()) {
                val layout = measurer.measure(nightLabel, axis)
                drawText(layout, topLeft = Offset((w - layout.size.width) / 2f, base + 10 * dp))
            }
            return@Canvas
        }
        // dotted future arc: dots every 6 dp along the curve (a dash PathEffect on a long polyline drops out on some GPUs)
        var m = target.toFloat()
        var carry = 0f
        var prev = Offset(px(target), py(target))
        while (m < end) {
            m = (m + 3f).coerceAtMost(end.toFloat())
            val cur = Offset(px(m.toInt()), py(m.toInt()))
            carry += (cur - prev).getDistance()
            prev = cur
            if (carry >= 6 * dp) { carry = 0f; drawCircle(horizon.dottedFuture, 1.1f * dp, cur) }
        }
        // solid past arc
        drawPath(path(start, now), horizon.line, style = Stroke(2.2f * dp, cap = StrokeCap.Round))
        // baseline
        drawLine(horizon.line, Offset(0f, base), Offset(w, base), strokeWidth = 1.5f * dp)
        // ticks + labels
        // A label shows only if it clears the one before it by 8 dp at the current text size.
        var lastRight = -1000f
        ticks.sortedBy { onDay(it.minute) }.forEach { t ->
            val tm = onDay(t.minute)
            if (tm <= target || tm > end) return@forEach
            val x = px(tm)
            drawLine(horizon.line, Offset(x, base - 1 * dp), Offset(x, base + 7 * dp), strokeWidth = 2 * dp)
            val layout = measurer.measure(t.label, axis)
            val tx = (x - layout.size.width / 2f).coerceIn(0f, w - layout.size.width)
            if (tx >= lastRight + 8 * dp) {
                drawText(layout, topLeft = Offset(tx, base + 10 * dp))
                lastRight = tx + layout.size.width
            }
        }
        // sun
        drawCircle(horizon.sun, sunR, Offset(px(now), py(now)))
    }
}
