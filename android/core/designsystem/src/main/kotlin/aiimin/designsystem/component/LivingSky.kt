package aiimin.designsystem.component

import aiimin.core.engine.today.SkyNow
import aiimin.core.engine.today.SkyPhase
import aiimin.designsystem.theme.Horizon
import aiimin.designsystem.theme.LocalReduceMotion
import aiimin.designsystem.theme.Sky
import aiimin.designsystem.theme.SkyTint
import androidx.compose.animation.core.Animatable
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.graphics.drawscope.scale
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.launch
import kotlin.math.pow

fun skyTint(p: SkyPhase): SkyTint = when (p) {
    SkyPhase.NIGHT -> Sky.night
    SkyPhase.PRE_DAWN -> Sky.preDawn
    SkyPhase.DAWN -> Sky.dawn
    SkyPhase.MORNING -> Sky.morning
    SkyPhase.MIDDAY -> Sky.midday
    SkyPhase.GOLDEN -> Sky.golden
    SkyPhase.DUSK -> Sky.dusk
}

/** Colours blend in linear light, so dawn's peach and noon's cream never pass through a muddy grey (1.3). */
private fun lin(c: Float) = if (c <= 0.04045f) c / 12.92f else ((c + 0.055f) / 1.055f).pow(2.4f)
private fun gam(c: Float) = if (c <= 0.0031308f) c * 12.92f else 1.055f * c.pow(1f / 2.4f) - 0.055f
fun blendLinear(a: Color, b: Color, t: Float): Color = Color(
    gam(lin(a.red) + (lin(b.red) - lin(a.red)) * t),
    gam(lin(a.green) + (lin(b.green) - lin(a.green)) * t),
    gam(lin(a.blue) + (lin(b.blue) - lin(a.blue)) * t),
    1f,
)

/** The sky's tint at this minute. */
fun skyAt(s: SkyNow): SkyTint {
    val a = skyTint(s.from); val b = skyTint(s.to)
    return SkyTint(blendLinear(a.color, b.color, s.t), a.alpha + (b.alpha - a.alpha) * s.t, blendLinear(a.sun, b.sun, s.t))
}

/** The day arc's colours from the sky: the sun follows the light; line and dots stay ink. */
fun horizonFor(s: SkyNow, base: Horizon): Horizon = base.copy(sun = skyAt(s).sun)

/**
 * The living sky (PRD 1.3): a soft radial glow behind the Today header only. The light sits left at dawn,
 * overhead at noon and right at dusk; the page itself is never tinted. Each new minute eases in over 60 s;
 * with reduce motion the colour just changes.
 */
@Composable
fun Modifier.livingSky(s: SkyNow, heightFraction: Float = 1f): Modifier {
    val target = skyAt(s)
    val reduce = LocalReduceMotion.current
    val x = remember { Animatable(s.lightX) }
    val mix = remember { Animatable(1f) }
    val from = remember { arrayOf(target) }
    val to = remember { arrayOf(target) }
    LaunchedEffect(target.color, target.alpha, s.lightX) {
        if (reduce) { from[0] = target; to[0] = target; x.snapTo(s.lightX); return@LaunchedEffect }
        from[0] = SkyTint(blendLinear(from[0].color, to[0].color, mix.value), from[0].alpha + (to[0].alpha - from[0].alpha) * mix.value, to[0].sun)
        to[0] = target
        mix.snapTo(0f)
        launchBoth(x, s.lightX, mix)
    }
    return this.drawBehind {
        val m = mix.value
        val c = blendLinear(from[0].color, to[0].color, m)
        val a = (from[0].alpha + (to[0].alpha - from[0].alpha) * m).coerceAtMost(0.22f)
        val center = Offset(size.width * x.value, 0f)
        val r = size.width * 1.15f
        // An elliptical glow that is fully faded before the hero's bottom edge, so it never shows a seam.
        val h = size.height * heightFraction
        scale(scaleX = 1f, scaleY = h * 0.95f / r, pivot = Offset(center.x, 0f)) {
            drawCircle(Brush.radialGradient(listOf(c.copy(alpha = a), c.copy(alpha = a * 0.5f), Color.Transparent), center, r), r, center)
        }
    }
}

private suspend fun launchBoth(x: Animatable<Float, *>, lightX: Float, mix: Animatable<Float, *>) {
    coroutineScope {
        launch { x.animateTo(lightX, aiimin.designsystem.theme.Motion.sky()) }
        launch { mix.animateTo(1f, aiimin.designsystem.theme.Motion.sky()) }
    }
}
