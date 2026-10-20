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
 * Today's horizon (handoff §6 T1, slimmed to 72 dp in PRD 1.2): y = 50 − 44·sin(πx/W)^1.3 from 7 AM to 11 PM.
 * Solid ink up to now, dotted after; baseline at y = 78; sun r=8 at now;
 * 2 dp ticks at the next items, labels skipped when closer than 40 dp.
 * Only the sun, horizon and dotted arc change with the hour; the background never does.
 * On the first open the sun slides along the arc to now (600 ms, Part 26.5), then rests.
 */
@Composable
fun DayHorizon(nowMinute: Int, ticks: List<HorizonTick>, horizon: Horizon, modifier: Modifier = Modifier, description: String = "Your day so far") {
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
        val start = 7 * 60
        val end = 23 * 60
        fun frac(min: Int) = ((min - start).toFloat() / (end - start)).coerceIn(0f, 1f)
        fun px(min: Int) = frac(min) * w
        fun py(min: Int): Float = base - (44 * dp) * sin(PI.toFloat() * frac(min)).toDouble().pow(1.3).toFloat()
        val target = nowMinute.coerceIn(start, end)
        val now = (start + (target - start) * travel.value).toInt()
        fun path(a: Int, b: Int): Path = Path().apply {
            var m = a
            moveTo(px(a), py(a))
            while (m < b) { m = (m + 6).coerceAtMost(b); lineTo(px(m), py(m)) }
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
        ticks.sortedBy { it.minute }.forEach { t ->
            if (t.minute <= target || t.minute > end) return@forEach
            val x = px(t.minute)
            drawLine(horizon.line, Offset(x, base - 1 * dp), Offset(x, base + 7 * dp), strokeWidth = 2 * dp)
            val layout = measurer.measure(t.label, axis)
            val tx = (x - layout.size.width / 2f).coerceIn(0f, w - layout.size.width)
            if (tx >= lastRight + 8 * dp) {
                drawText(layout, topLeft = Offset(tx, base + 10 * dp))
                lastRight = tx + layout.size.width
            }
        }
        // sun
        drawCircle(horizon.sun, 8 * dp, Offset(px(now), py(now)))
    }
}
