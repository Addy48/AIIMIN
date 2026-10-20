package aiimin.designsystem.component

import aiimin.designsystem.theme.LightPalette

import aiimin.designsystem.theme.Aiimin
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathMeasure
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.scale
import androidx.compose.ui.graphics.drawscope.translate
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.delay

/**
 * The opening moment (plan Phase 3): the arch draws itself, the peak-A is traced, the sun rises
 * into place, then the whole mark lifts and fades into the app. About 1.1 s, cold start only.
 * Geometry is the AIIMIN logo's 512-unit artwork, so it matches the launcher icon exactly.
 */
@Composable
fun BootMark(onDone: () -> Unit) {
    val c = Aiimin.colors
    val arch = remember { Animatable(0f) }
    val peak = remember { Animatable(0f) }
    val inner = remember { Animatable(0f) }
    val sun = remember { Animatable(0f) }
    val word = remember { Animatable(0f) }
    val exit = remember { Animatable(0f) }
    val ease = CubicBezierEasing(0.2f, 0f, 0f, 1f)
    LaunchedEffect(Unit) {
        coroutineScope {
            async { arch.animateTo(1f, tween(480, easing = ease)) }
            async { delay(120); peak.animateTo(1f, tween(420, easing = ease)) }
            async { delay(240); inner.animateTo(1f, tween(340, easing = ease)) }
            async { delay(430); sun.animateTo(1f, tween(420, easing = CubicBezierEasing(0.34f, 1.56f, 0.64f, 1f))) }
            async { delay(560); word.animateTo(1f, tween(520, easing = ease)) }
        }
        delay(380)
        exit.animateTo(1f, tween(280, easing = CubicBezierEasing(0.4f, 0f, 0.2f, 1f)))
        onDone()
    }
    val archPath = remember { Path().apply { moveTo(80f, 384f); cubicTo(80f, 192f, 208f, 112f, 256f, 112f); cubicTo(304f, 112f, 432f, 192f, 432f, 384f) } }
    val peakPath = remember { Path().apply { moveTo(144f, 384f); lineTo(256f, 176f); lineTo(368f, 384f) } }
    val innerPath = remember { Path().apply { moveTo(192f, 368f); lineTo(256f, 272f); lineTo(320f, 368f) } }
    fun trimmed(p: Path, t: Float): Path {
        val m = PathMeasure().apply { setPath(p, false) }
        return Path().also { out -> m.getSegment(0f, m.length * t, out, true) }
    }
    Box(
        Modifier.fillMaxSize().graphicsLayer { alpha = 1f - exit.value }.background(c.base),
        contentAlignment = Alignment.Center,
    ) {
      Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.graphicsLayer { val s = 1f + 0.06f * exit.value; scaleX = s; scaleY = s; translationY = -24f * exit.value }) {
        Canvas(Modifier.size(120.dp)) {
            val k = size.minDimension / 512f
            scale(k, k, pivot = Offset.Zero) {
                drawPath(trimmed(archPath, arch.value), LightPalette.markArch, style = Stroke(24f, cap = StrokeCap.Round))
                drawPath(trimmed(peakPath, peak.value), c.text, style = Stroke(24f, cap = StrokeCap.Round, join = StrokeJoin.Round))
                drawPath(trimmed(innerPath, inner.value), LightPalette.markInner.copy(alpha = 0.85f), style = Stroke(18f, cap = StrokeCap.Round, join = StrokeJoin.Round))
                val r = 28f * sun.value
                if (r > 0f) translate(0f, 70f * (1f - sun.value.coerceAtMost(1f))) { drawCircle(LightPalette.accent, r, Offset(256f, 240f)) }
            }
        }
        // The wordmark rises in under the mark, in the website's Bodoni Moda, then a quiet line.
        Text(
            "AIIMIN",
            style = TextStyle(fontFamily = aiimin.designsystem.theme.BrandSerif, fontWeight = FontWeight.Bold, fontSize = 44.sp, letterSpacing = (-0.03f * 44).sp, color = c.text),
            modifier = Modifier.padding(top = 14.dp).graphicsLayer { alpha = word.value; translationY = 18f * (1f - word.value) },
        )
        Text(
            "One screen, every day.",
            style = Aiimin.type.caption.copy(color = c.textMuted, letterSpacing = 0.4.sp),
            modifier = Modifier.padding(top = 6.dp).graphicsLayer { alpha = (word.value * 1.4f - 0.4f).coerceIn(0f, 1f) },
        )
      }
    }
}
