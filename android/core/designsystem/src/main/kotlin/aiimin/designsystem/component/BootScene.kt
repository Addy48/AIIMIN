package aiimin.designsystem.component

import aiimin.designsystem.theme.Aiimin
import aiimin.designsystem.theme.BootColors
import aiimin.designsystem.theme.BrandSerif
import aiimin.designsystem.theme.LightPalette
import aiimin.designsystem.theme.Motion
import android.graphics.BlurMaskFilter
import android.os.Build
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.Easing
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.BlendMode
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.ImageShader
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathMeasure
import androidx.compose.ui.graphics.ShaderBrush
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.TileMode
import androidx.compose.ui.graphics.asAndroidPath
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.graphics.drawscope.scale
import androidx.compose.ui.graphics.drawscope.translate
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlin.math.abs
import kotlin.math.hypot
import kotlin.math.roundToInt
import kotlin.math.sin
import kotlinx.coroutines.withContext


/**
 * The opening screen (PRD Part 26): one small orange dot rises like a sun over a warm page and the AIIMIN
 * mark grows out of it, then the name and "Start small. Keep going." No Raahi, no landscape.
 *
 * A direct port of `aiimin/05-design/boot/boot-prototype.html` (390 x 844 design frame, 512-unit mark) on
 * one clock. Rays, glow, grain and the mark's soft shadow are made once and then only moved, scaled, faded
 * or turned; the six wordmark letters are the only per-frame blur. Tap anywhere skips. When the sequence
 * ends it holds its last frame until [ready], then cross-fades into the app over 200 ms.
 */
@Composable
fun BootScene(mode: BootMode, ready: Boolean, onDone: () -> Unit, onHandOff: () -> Unit = {}) {
    if (mode == BootMode.NONE) {
        LaunchedEffect(Unit) { onHandOff(); onDone() }
        return
    }
    val total = when (mode) {
        BootMode.FULL -> Motion.Boot.FULL_MS
        BootMode.SHORT -> Motion.Boot.SHORT_MS
        else -> Motion.Boot.REDUCED_MS
    }
    val clock = remember { Animatable(0f) }
    val out = remember { Animatable(0f) }
    var skipped by remember { mutableStateOf(false) }
    // Wall-clock time: with Android's "Remove animations" Compose would jump to the end, but the reduced
    // opening is still a 200 ms fade and a 0.6 s hold (Part 26.2 rule 3).
    LaunchedEffect(Unit) { withContext(WallClock) { clock.animateTo(total / 1000f, Motion.Boot.clock(total)) } }
    // Hand-off: after the last beat (or a tap) and once the app is ready; the last frame holds meanwhile.
    val ended = skipped || clock.value >= total / 1000f
    LaunchedEffect(ended, ready) {
        if (ended && ready) {
            // The app starts its entrance as the scene leaves, so Today rises while the mark zooms past.
            onHandOff()
            withContext(WallClock) { out.animateTo(1f, if (mode == BootMode.REDUCED) Motion.reducedFade() else Motion.handOff()) }
            onDone()
        }
    }
    val t = clock.value
    BoxWithConstraints(
        Modifier.fillMaxSize()
            .graphicsLayer {
                // Zoom-through: the scene grows slightly as it fades, so the hand-off reads as moving forward.
                alpha = 1f - out.value
                if (mode != BootMode.REDUCED) { val z = 1f + 0.08f * out.value; scaleX = z; scaleY = z }
            }
            .clickable(interactionSource = remember { MutableInteractionSource() }, indication = null, onClickLabel = "Skip") { skipped = true }
            .clearAndSetSemantics { contentDescription = "AIIMIN. Start small. Keep going." },
    ) {
        val s = maxWidth / 390.dp
        val top = (maxHeight - 844.dp * s) / 2
        val f = frame(mode, t)
        BootCanvas(f, s, top)
        BootType(f, mode, t, s, top)
    }
}

private object WallClock : androidx.compose.ui.MotionDurationScale {
    override val scaleFactor: Float = 1f
}

/** Everything that moves at time t, in the prototype's units (design px, 512-unit mark). */
private class Frame(
    val alpha: Float, val dotScreen: Float, val dotR: Float, val dotO: Float, val sunUp: Float,
    val arch: Float, val peak: Float, val inner: Float, val ring: Float, val lift: Float, val motesO: Float,
    val rays: Boolean, val t: Float,
)

private const val MARK = 176f
private const val TOP0 = 206f
private const val CX = 195f
private const val S = MARK / 512f
private fun sy(y: Float) = TOP0 + y * S
private fun seg(t: Float, a: Float, b: Float, e: Easing? = null): Float {
    val p = ((t - a) / (b - a)).coerceIn(0f, 1f)
    return e?.transform(p) ?: p
}
private fun lerp(a: Float, b: Float, p: Float) = a + (b - a) * p

private fun frame(mode: BootMode, t: Float): Frame = when (mode) {
    BootMode.REDUCED -> Frame(seg(t, 0f, 0.2f), sy(240f), 28f, 1f, 1f, 1f, 1f, 1f, 0f, -40f, 0f, rays = false, t = 0f)
    // The returning open (owner, 22 Oct: "I still want some kind of animation"): the same story as the full one,
    // told in 1.4 s. The sun rises from just below, the mark draws out of it, the ring breathes once, the mark
    // lifts and the name opens; the tagline follows in one quick beat.
    BootMode.SHORT -> {
        val rise = seg(t, 0f, 0.45f, Motion.Boot.Rise)
        val fall = seg(t, 0.45f, 0.8f, Motion.Boot.Settle)
        Frame(
            alpha = 1f,
            dotScreen = if (t < 0.45f) lerp(sy(330f), sy(150f), rise) else lerp(sy(150f), sy(240f), fall),
            dotR = if (t < 0.45f) lerp(10f, 22f, rise) else lerp(22f, 28f, fall),
            dotO = seg(t, 0f, 0.12f),
            sunUp = seg(t, 0f, 0.6f, Motion.Boot.Rise),
            arch = seg(t, 0.35f, 0.75f, Motion.Boot.Draw),
            peak = seg(t, 0.42f, 0.82f, Motion.Boot.Draw),
            inner = seg(t, 0.5f, 0.88f, Motion.Boot.Draw),
            ring = seg(t, 0.6f, 1.05f),
            lift = -40f * seg(t, 0.75f, 1.05f, Motion.Boot.Move),
            motesO = seg(t, 0.1f, 0.6f),
            rays = true, t = t,
        )
    }
    else -> {
        val rise = seg(t, 0.15f, 1.05f, Motion.Boot.Rise)
        val fall = seg(t, 1.1f, 1.85f, Motion.Boot.Settle)
        Frame(
            alpha = 1f,
            dotScreen = if (t < 1.1f) lerp(626f, sy(150f), rise) else lerp(sy(150f), sy(240f), fall),
            dotR = if (t < 1.1f) lerp(5f, 22f, rise) else lerp(22f, 28f, fall),
            dotO = seg(t, 0.12f, 0.3f),
            sunUp = seg(t, 0.15f, 1.5f, Motion.Boot.Rise),
            arch = seg(t, 0.95f, 1.8f, Motion.Boot.Draw),
            peak = seg(t, 1.12f, 1.9f, Motion.Boot.Draw),
            inner = seg(t, 1.36f, 2.0f, Motion.Boot.Draw),
            ring = seg(t, 1.65f, 2.55f),
            lift = -40f * seg(t, 1.9f, 2.5f, Motion.Boot.Move),
            motesO = seg(t, 0.7f, 1.8f),
            rays = true, t = t,
        )
    }
}

private class Mote(val x: Float, val y: Float, val sp: Float, val f: Float, val ph: Float, val sz: Float, val a: Float)

/** 22 motes from the prototype's seeded generator, so every launch looks the same. */
private val MOTES: List<Mote> = run {
    var seed = 7L
    fun rnd(): Float { seed = (seed * 16807) % 2147483647; return seed / 2147483647f }
    List(22) { Mote(20 + rnd() * 350, 300 + rnd() * 340, 10 + rnd() * 22, 0.6f + rnd() * 1.1f, rnd() * 6.28f, 2 + rnd() * 3.2f, 0.35f + rnd() * 0.5f) }
}

private val ARCH_L = Path().apply { moveTo(256f, 112f); cubicTo(208f, 112f, 80f, 192f, 80f, 384f) }
private val ARCH_R = Path().apply { moveTo(256f, 112f); cubicTo(304f, 112f, 432f, 192f, 432f, 384f) }
private val PEAK_L = Path().apply { moveTo(256f, 176f); lineTo(144f, 384f) }
private val PEAK_R = Path().apply { moveTo(256f, 176f); lineTo(368f, 384f) }
private val INNER_L = Path().apply { moveTo(256f, 272f); lineTo(192f, 368f) }
private val INNER_R = Path().apply { moveTo(256f, 272f); lineTo(320f, 368f) }

private fun trimmed(p: Path, t: Float): Path {
    val m = PathMeasure().apply { setPath(p, false) }
    return Path().also { m.getSegment(0f, m.length * t.coerceIn(0f, 1f), it, true) }
}

@Composable
private fun BootCanvas(f: Frame, s: Float, top: Dp) {
    val density = LocalDensity.current
    val unit = with(density) { 1.dp.toPx() } * s
    val topPx = with(density) { top.toPx() }
    val glowBrush = remember { Brush.radialGradient(*BootColors.glow.toTypedArray(), center = Offset.Zero, radius = 260f) }
    val rays = remember { raysBitmap() }
    val grain = remember { grainBrush() }
    val shadow = remember { markShadow() }
    Canvas(Modifier.fillMaxSize().graphicsLayer { alpha = f.alpha }.clipToBounds()) {
        drawRect(Brush.verticalGradient(*BootColors.sky.toTypedArray()))
        translate(0f, topPx) {
            scale(unit, unit, pivot = Offset.Zero) {
                val dy = f.dotScreen + f.lift
                // Light rays: one bitmap, turned 4 degrees a second and scaled with the sun.
                if (f.rays) {
                    val ra = 0.7f * f.sunUp * (1 - 0.45f * seg(f.t, 2.4f, 3.2f))
                    if (ra > 0.01f) translate(CX, dy) {
                        rotate(f.t * 4f, pivot = Offset.Zero) {
                            scale(0.6f + 0.4f * f.sunUp, pivot = Offset.Zero) {
                                drawImage(rays, topLeft = Offset(-450f, -450f), alpha = ra)
                            }
                        }
                    }
                }
                // Sun glow follows the dot.
                translate(CX, dy) {
                    scale(0.3f + 0.7f * f.sunUp, pivot = Offset.Zero) {
                        drawCircle(glowBrush, radius = 260f, center = Offset.Zero, alpha = 0.95f * f.sunUp * f.dotO)
                    }
                }
                // The mark: soft shadow (made once) fades in as it draws; strokes trim from the apex outward.
                translate(CX - MARK / 2, TOP0 + f.lift) {
                    scale(S, S, pivot = Offset.Zero) {
                        val drawn = maxOf(f.arch, f.peak)
                        if (drawn > 0.01f) drawImage(shadow, topLeft = Offset(-SHADOW_PAD.toFloat(), -SHADOW_PAD.toFloat()), alpha = drawn)
                        val arch = Stroke(24f, cap = StrokeCap.Round, join = StrokeJoin.Round)
                        val inner = Stroke(18f, cap = StrokeCap.Round, join = StrokeJoin.Round)
                        if (f.arch > 0.035f) { drawPath(trimmed(ARCH_L, f.arch), LightPalette.markArch, style = arch); drawPath(trimmed(ARCH_R, f.arch), LightPalette.markArch, style = arch) }
                        if (f.peak > 0.035f) { drawPath(trimmed(PEAK_L, f.peak), LightPalette.text, style = arch); drawPath(trimmed(PEAK_R, f.peak), LightPalette.text, style = arch) }
                        if (f.inner > 0.035f) { drawPath(trimmed(INNER_L, f.inner), LightPalette.markInner, style = inner, alpha = 0.85f); drawPath(trimmed(INNER_R, f.inner), LightPalette.markInner, style = inner, alpha = 0.85f) }
                        val cy = (f.dotScreen - TOP0) / S
                        if (f.ring > 0f && f.ring < 1f) {
                            drawCircle(LightPalette.accent, lerp(28f, 86f, Motion.Boot.Draw.transform(f.ring)), Offset(256f, cy), alpha = 0.5f * (1 - f.ring), style = Stroke(3f))
                        }
                        drawCircle(LightPalette.accent, f.dotR, Offset(256f, cy), alpha = f.dotO)
                    }
                }
                // Dust motes drift up and sideways; deterministic.
                if (f.motesO > 0f) MOTES.forEach { m ->
                    val y = m.y - m.sp * f.t
                    val x = m.x + sin(f.t * m.f + m.ph) * 10
                    val a = f.motesO * m.a * (0.6f + 0.4f * sin(f.t * m.f * 2 + m.ph)) * ((y - 120) / 160).coerceIn(0f, 1f)
                    if (a > 0.01f) {
                        drawCircle(BootColors.moteHalo, m.sz * 1.6f, Offset(x, y), alpha = a * 0.5f)
                        drawCircle(BootColors.mote, m.sz / 2, Offset(x, y), alpha = a)
                    }
                }
            }
        }
        // Vignette keeps the eye on the mark; paper grain stops the gradient from banding.
        val c = Offset(size.width / 2, size.height * 0.42f)
        val far = hypot(maxOf(c.x, size.width - c.x), maxOf(c.y, size.height - c.y))
        drawRect(Brush.radialGradient(0f to Color.Transparent, 0.55f to Color.Transparent, 1f to BootColors.vignette, center = c, radius = far))
        drawRect(grain, alpha = 0.38f, blendMode = BlendMode.Multiply)
    }
}

/** The AIIMIN wordmark (letters open outward from the centre) and the tagline, real text for TalkBack. */
@Composable
private fun BootType(f: Frame, mode: BootMode, t: Float, s: Float, top: Dp) {
    val ink = Aiimin.colors.text
    val density = LocalDensity.current
    // Sizes follow the screen width, not the text size setting: the wordmark is a drawing here (Part 26.0).
    fun px(v: Float) = with(density) { (v * s).dp.toSp() }
    val px1 = with(density) { 1.dp.toPx() } * s
    val word = TextStyle(
        fontFamily = BrandSerif, fontWeight = FontWeight.Bold, fontSize = px(44f), letterSpacing = px(-0.03f * 44),
        color = ink, shadow = Shadow(BootColors.shadow, Offset(0f, 10f * px1), 22f * px1),
    )
    val liftDp = (f.lift * s).dp
    Row(
        Modifier.offset(y = top + (TOP0 + MARK + 20).dp * s + liftDp).width(390.dp * s),
        horizontalArrangement = androidx.compose.foundation.layout.Arrangement.Center,
    ) {
        "AIIMIN".forEachIndexed { i, ch ->
            val p = when (mode) {
                BootMode.FULL -> { val d = abs(i - 2.5f); seg(t, 2.0f + d * 0.07f, 2.65f + d * 0.07f, Motion.Boot.Draw) }
                BootMode.SHORT -> { val d = abs(i - 2.5f); seg(t, 0.82f + d * 0.04f, 1.15f + d * 0.04f, Motion.Boot.Draw) }
                else -> 1f
            }
            val blur = 6f * (1 - p)
            Box(
                Modifier.graphicsLayer {
                    alpha = p
                    translationX = (i - 2.5f) * -26f * (1 - p) * px1
                    translationY = 12f * (1 - p) * px1
                    if (blur > 0.05f && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                        renderEffect = androidx.compose.ui.graphics.BlurEffect(blur * px1, blur * px1)
                    }
                },
            ) {
                Text(ch.toString(), style = word.copy(color = BootColors.highlight, shadow = null), modifier = Modifier.offset { IntOffset(0, px1.roundToInt().coerceAtLeast(1)) })
                Text(ch.toString(), style = word)
            }
        }
    }
    val tag = Aiimin.type.body.copy(fontSize = px(17f), lineHeight = px(26f), letterSpacing = 0.01.sp, textAlign = TextAlign.Center)
    Row(
        Modifier.offset(y = top + (TOP0 + MARK + 20 + 58).dp * s + liftDp).width(390.dp * s),
        horizontalArrangement = androidx.compose.foundation.layout.Arrangement.Center,
    ) {
        listOf("Start small." to Aiimin.colors.textMuted, "Keep going." to ink).forEachIndexed { i, (w, color) ->
            val p = when (mode) {
                BootMode.FULL -> seg(t, 2.5f + i * 0.28f, 3.05f + i * 0.28f, Motion.Boot.Rise)
                BootMode.SHORT -> seg(t, 1.0f + i * 0.12f, 1.32f + i * 0.12f, Motion.Boot.Rise)
                else -> 1f
            }
            // Each phrase slides up out of its own mask.
            Box(Modifier.clipToBounds()) {
                Text(
                    w, style = tag.copy(color = color, shadow = Shadow(BootColors.highlight, Offset(0f, px1), 0f)),
                    modifier = Modifier.graphicsLayer { translationY = (1 - p) * size.height * 1.1f; alpha = (p * 2.5f).coerceAtMost(1f) }
                        .padding(horizontal = (0.18f * 17 * s).dp),
                )
            }
        }
    }
}

/** 18 thin rays (3 of every 20 degrees) fading out by 46 percent of their radius; drawn once. */
private fun raysBitmap(): ImageBitmap {
    val bmp = android.graphics.Bitmap.createBitmap(900, 900, android.graphics.Bitmap.Config.ARGB_8888)
    val cv = android.graphics.Canvas(bmp)
    val shader = android.graphics.RadialGradient(
        450f, 450f, 450f,
        intArrayOf(BootColors.ray.toArgbInt(), BootColors.ray.copy(alpha = BootColors.ray.alpha * 0.45f).toArgbInt(), 0),
        floatArrayOf(0f, 0.16f, 0.46f), android.graphics.Shader.TileMode.CLAMP,
    )
    val paint = android.graphics.Paint(android.graphics.Paint.ANTI_ALIAS_FLAG).apply { this.shader = shader }
    val oval = android.graphics.RectF(0f, 0f, 900f, 900f)
    for (k in 0 until 18) cv.drawArc(oval, -90f + k * 20f, 3f, true, paint)
    return bmp.asImageBitmap()
}

/** Fine paper grain, tiled; made once from a seeded generator. */
private fun grainBrush(): ShaderBrush {
    val n = 128
    val bmp = android.graphics.Bitmap.createBitmap(n, n, android.graphics.Bitmap.Config.ARGB_8888)
    var seed = 11L
    val base = BootColors.grain.toArgbInt() and 0x00FFFFFF
    for (y in 0 until n) for (x in 0 until n) {
        seed = (seed * 16807) % 2147483647
        val a = ((seed % 1000) / 1000f * 0.18f * 255).toInt().coerceIn(0, 255)
        bmp.setPixel(x, y, (a shl 24) or base)
    }
    return ShaderBrush(ImageShader(bmp.asImageBitmap(), TileMode.Repeated, TileMode.Repeated))
}

/** The mark's warm drop shadow (0 12 blur 14, plus a tight 0 2), blurred once in software. */
private const val SHADOW_PAD = 140

private fun markShadow(): ImageBitmap {
    val pad = SHADOW_PAD
    val bmp = android.graphics.Bitmap.createBitmap(512 + pad * 2, 512 + pad * 2, android.graphics.Bitmap.Config.ARGB_8888)
    val cv = android.graphics.Canvas(bmp)
    cv.translate(pad.toFloat(), pad.toFloat())
    fun paint(color: Color, blur: Float, width: Float) = android.graphics.Paint(android.graphics.Paint.ANTI_ALIAS_FLAG).apply {
        style = android.graphics.Paint.Style.STROKE; strokeWidth = width; strokeCap = android.graphics.Paint.Cap.ROUND
        strokeJoin = android.graphics.Paint.Join.ROUND; this.color = color.toArgbInt()
        if (blur > 0) maskFilter = BlurMaskFilter(blur, BlurMaskFilter.Blur.NORMAL)
    }
    val wide = paint(BootColors.shadow, 14f / S, 24f)
    val tight = paint(BootColors.shadowTight, 3f / S, 24f)
    listOf(ARCH_L, ARCH_R, PEAK_L, PEAK_R).forEach { p ->
        cv.save(); cv.translate(0f, 12f / S); cv.drawPath(p.asAndroidPath(), wide); cv.restore()
        cv.save(); cv.translate(0f, 2f / S); cv.drawPath(p.asAndroidPath(), tight); cv.restore()
    }
    return bmp.asImageBitmap()
}

private fun Color.toArgbInt(): Int = android.graphics.Color.argb((alpha * 255).roundToInt(), (red * 255).roundToInt(), (green * 255).roundToInt(), (blue * 255).roundToInt())
