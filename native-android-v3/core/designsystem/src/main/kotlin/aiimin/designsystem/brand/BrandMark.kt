package aiimin.designsystem.brand

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathMeasure
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.scale
import androidx.compose.ui.graphics.drawscope.translate
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import aiimin.designsystem.component.Text
import aiimin.designsystem.theme.AiiminTheme
import aiimin.designsystem.theme.BrandSpark
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

/** Genesis brand law — splash whisper under AIIMIN. */
private const val SplashLawCopy = "One screen. Every day."

/** Drafting Table settle — soft expo out. */
private val DraftEase = CubicBezierEasing(0.22f, 1f, 0.36f, 1f)
private val DraftEaseIn = CubicBezierEasing(0.4f, 0f, 0.2f, 1f)
/** Stroke climb — ease-in-out so legs meet without linear machine feel. */
private val StrokeEase = CubicBezierEasing(0.45f, 0.05f, 0.25f, 1f)
/** Word dock — longer soft settle into center. */
private val MeetEase = CubicBezierEasing(0.16f, 1f, 0.3f, 1f)
/** Spark land — soft overshoot without alarm. */
private val SparkSpring = spring<Float>(
    dampingRatio = 0.62f,
    stiffness = Spring.StiffnessMediumLow,
)
/** Law plants under wordmark — short settle, no bounce theater. */
private val LawStickSpring = spring<Float>(
    dampingRatio = 0.82f,
    stiffness = Spring.StiffnessMedium,
)

/**
 * The AIIMIN mark: a peak "A" of nested chevrons under an arch, with the warm
 * node at the summit.
 *
 * Geometry matches the web BrandMark (512 artboard). Strokes take theme ink;
 * the node stays [BrandSpark].
 */
@Composable
fun BrandMark(
    modifier: Modifier = Modifier,
    size: Dp = 20.dp,
    inkColor: Color = AiiminTheme.colors.text,
    mutedColor: Color = AiiminTheme.colors.muted,
    nodeColor: Color = BrandSpark,
) {
    Canvas(
        modifier
            .size(size)
            .semantics { contentDescription = "AIIMIN" },
    ) {
        drawBrandMarkBilateral(
            ink = inkColor,
            muted = mutedColor,
            node = nodeColor,
            sideT = 1f,
            nodeT = 1f,
            glowT = 0f,
            nodePulse = 1f,
            ringBurst = 0f,
            tipGlow = false,
            solidSparkOnly = true,
        )
    }
}

/**
 * Compact animated mark for secondary surfaces. Cold-open uses [AiiminSplash].
 */
@Composable
fun AnimatedBrandMark(
    modifier: Modifier = Modifier,
    size: Dp = 72.dp,
    reduceMotion: Boolean = AiiminTheme.reduceMotion,
    inkColor: Color = AiiminTheme.colors.text,
    mutedColor: Color = AiiminTheme.colors.muted,
    nodeColor: Color = BrandSpark,
) {
    val draw = remember { Animatable(if (reduceMotion) 1f else 0f) }
    val settle = remember { Animatable(if (reduceMotion) 1f else 0.92f) }
    val spark = remember { Animatable(if (reduceMotion) 1f else 0f) }
    LaunchedEffect(reduceMotion) {
        if (reduceMotion) {
            draw.snapTo(1f)
            settle.snapTo(1f)
            spark.snapTo(1f)
            return@LaunchedEffect
        }
        draw.snapTo(0f)
        settle.snapTo(0.92f)
        spark.snapTo(0f)
        launch { draw.animateTo(1f, tween(900, easing = DraftEase)) }
        launch {
            settle.animateTo(1.02f, tween(700, delayMillis = 80, easing = DraftEase))
            settle.animateTo(1f, tween(260, easing = FastOutSlowInEasing))
        }
        launch {
            delay(520)
            spark.snapTo(0.15f)
            spark.animateTo(1f, SparkSpring)
        }
    }
    val p = draw.value
    Canvas(
        modifier
            .size(size)
            .graphicsLayer {
                scaleX = settle.value
                scaleY = settle.value
                alpha = (0.25f + 0.75f * p).coerceIn(0f, 1f)
            }
            .semantics { contentDescription = "AIIMIN" },
    ) {
        drawBrandMarkBilateral(
            ink = inkColor,
            muted = mutedColor,
            node = nodeColor,
            sideT = p,
            nodeT = ((p - 0.55f) / 0.45f).coerceIn(0f, 1f),
            glowT = ((p - 0.55f) / 0.45f).coerceIn(0f, 1f) * 0.35f,
            nodePulse = spark.value.coerceAtLeast(0.01f),
            ringBurst = 0f,
            tipGlow = false,
            solidSparkOnly = true,
        )
    }
}

/**
 * Sole cold-open — one continuous arc:
 * mark climb + spark · word+law lockup fades as one · soft veil.
 * No independent Y-bounce on text. ~2.85s.
 */
@Composable
fun AiiminSplash(
    onFinished: () -> Unit,
    modifier: Modifier = Modifier,
    reduceMotion: Boolean = AiiminTheme.reduceMotion,
    onFirstFrame: () -> Unit = {},
) {
    SideEffect { onFirstFrame() }

    val veil = remember { Animatable(1f) }
    val atmos = remember { Animatable(if (reduceMotion) 0.55f else 0f) }
    val sideT = remember { Animatable(if (reduceMotion) 1f else 0f) }
    val nodeT = remember { Animatable(if (reduceMotion) 1f else 0f) }
    /** Soft bloom under solid disc — never rings. */
    val glowT = remember { Animatable(if (reduceMotion) 0.18f else 0f) }
    /** Spark scale: 0 → spring → 1. */
    val sparkPop = remember { Animatable(if (reduceMotion) 1f else 0f) }
    val markScale = remember { Animatable(if (reduceMotion) 1f else 0.92f) }
    val markAlpha = remember { Animatable(if (reduceMotion) 1f else 0f) }
    /** 0 = letters open; 1 = brand tracking connected. */
    val wordMeet = remember { Animatable(if (reduceMotion) 1f else 0f) }
    val wordAlpha = remember { Animatable(if (reduceMotion) 1f else 0f) }
    val wordScale = remember { Animatable(if (reduceMotion) 1f else 0.985f) }
    val wordY = remember { Animatable(0f) }
    /** Law + rule fade with word — one lockup, no independent bounce. */
    val lawAlpha = remember { Animatable(if (reduceMotion) 1f else 0f) }
    val lawY = remember { Animatable(0f) }
    val lawX = remember { Animatable(0f) }
    val lawMeet = remember { Animatable(if (reduceMotion) 1f else 0f) }
    val lawStick = remember { Animatable(1f) }
    val ruleAlpha = remember { Animatable(if (reduceMotion) 1f else 0f) }
    val ruleGrow = remember { Animatable(if (reduceMotion) 1f else 0f) }
    /** Whole lockup under mark breathes in as one. */
    val lockupAlpha = remember { Animatable(if (reduceMotion) 1f else 0f) }

    val colors = AiiminTheme.colors

    LaunchedEffect(Unit) {
        if (reduceMotion) {
            delay(100)
            veil.animateTo(0f, tween(120))
            onFinished()
            return@LaunchedEffect
        }

        // Continuous one-arc choreography — overlapping, no jump cuts.
        launch { markAlpha.animateTo(1f, tween(560, easing = DraftEase)) }
        launch { atmos.animateTo(1f, tween(1_400, easing = DraftEase)) }
        launch { markScale.animateTo(1f, tween(1_200, easing = MeetEase)) }
        launch { sideT.animateTo(1f, tween(1_280, easing = StrokeEase)) }

        launch {
            delay(720)
            sparkPop.snapTo(0.18f)
            nodeT.snapTo(0f)
            glowT.snapTo(0f)
            launch { nodeT.animateTo(1f, tween(480, easing = DraftEase)) }
            launch {
                glowT.animateTo(0.42f, tween(360, easing = DraftEase))
                glowT.animateTo(0.16f, tween(720, easing = MeetEase))
            }
            sparkPop.animateTo(1f, tween(640, easing = MeetEase))
        }

        launch {
            delay(980)
            launch { lockupAlpha.animateTo(1f, tween(700, easing = DraftEase)) }
            launch { wordAlpha.animateTo(1f, tween(700, easing = DraftEase)) }
            launch { wordScale.animateTo(1f, tween(980, easing = MeetEase)) }
            launch { wordMeet.animateTo(1f, tween(1_050, easing = MeetEase)) }
            launch {
                delay(120)
                lawAlpha.animateTo(1f, tween(720, easing = DraftEase))
            }
            launch {
                delay(120)
                lawMeet.animateTo(1f, tween(900, easing = MeetEase))
            }
            launch {
                delay(160)
                ruleAlpha.animateTo(1f, tween(640, easing = DraftEase))
            }
            launch {
                delay(160)
                ruleGrow.animateTo(1f, tween(780, easing = MeetEase))
            }
        }

        delay(2_850)
        launch { atmos.animateTo(0.32f, tween(520, easing = DraftEaseIn)) }
        veil.animateTo(0f, tween(560, easing = DraftEaseIn))
        onFinished()
    }

    val meet = wordMeet.value.coerceIn(0f, 1f)
    val trackingEm = (0.28f * (1f - meet) + (-0.04f) * meet).em
    val lawT = lawMeet.value.coerceIn(0f, 1f)
    val lawTrackingEm = (0.28f * (1f - lawT) + 0.12f * lawT).em
    val nodePulse = sparkPop.value.coerceAtLeast(0.01f)
    val ruleWidthDp = (4f + 32f * ruleGrow.value.coerceIn(0f, 1f)).dp

    Box(
        modifier
            .fillMaxSize()
            .graphicsLayer { alpha = veil.value }
            .background(colors.bg),
        contentAlignment = Alignment.Center,
    ) {
        // Steel atmosphere — breathes with climb; no orange wash.
        Canvas(Modifier.fillMaxSize()) {
            val a = atmos.value
            val steel = colors.accent
            val rOuter = size.minDimension * (0.42f + 0.28f * a)
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(
                        steel.copy(alpha = 0.22f * a),
                        steel.copy(alpha = 0.06f * a),
                        Color.Transparent,
                    ),
                    center = center,
                    radius = rOuter,
                ),
                radius = rOuter,
                center = center,
            )
        }

        // Mark planted high; word + law = tight lockup beneath.
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 48.dp),
        ) {
            Canvas(
                Modifier
                    .size(176.dp)
                    .graphicsLayer {
                        scaleX = markScale.value
                        scaleY = markScale.value
                        alpha = markAlpha.value
                    }
                    .semantics { contentDescription = "AIIMIN" },
            ) {
                drawBrandMarkBilateral(
                    ink = colors.text,
                    muted = colors.muted,
                    node = BrandSpark,
                    sideT = sideT.value,
                    nodeT = nodeT.value,
                    glowT = glowT.value,
                    nodePulse = nodePulse,
                    ringBurst = 0f,
                    tipGlow = false,
                    solidSparkOnly = true,
                )
            }

            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 14.dp)
                    .graphicsLayer { alpha = lockupAlpha.value },
            ) {
                Text(
                    text = "AIIMIN",
                    style = AiiminTheme.type.wordmarkSplash.copy(letterSpacing = trackingEm),
                    color = colors.text,
                    textAlign = TextAlign.Center,
                    maxLines = 1,
                    modifier = Modifier
                        .fillMaxWidth()
                        .graphicsLayer {
                            alpha = wordAlpha.value
                            scaleX = wordScale.value
                            scaleY = wordScale.value
                            translationY = wordY.value
                        },
                )

                // Hairline grows from center as law docks — tight under wordmark.
                Box(
                    Modifier
                        .padding(top = 8.dp)
                        .width(ruleWidthDp)
                        .height(1.dp)
                        .graphicsLayer { alpha = ruleAlpha.value * 0.55f }
                        .background(colors.accent),
                )

                Text(
                    text = SplashLawCopy,
                    style = AiiminTheme.type.splashLaw.copy(letterSpacing = lawTrackingEm),
                    color = colors.muted,
                    textAlign = TextAlign.Center,
                    maxLines = 1,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 6.dp)
                        .graphicsLayer {
                            alpha = lawAlpha.value
                            translationX = lawX.value
                            translationY = lawY.value
                            scaleX = lawStick.value
                            scaleY = lawStick.value
                        },
                )
            }
        }
    }
}

/** Visible geometry: x 60..452, y 96..416 of the 512-unit artboard. */
private const val ViewX = 60f
private const val ViewY = 96f
private const val ViewW = 392f
private const val ViewH = 320f

/**
 * Draw left + right halves growing toward the summit together.
 * [sideT] 0..1 drives arch, peak, and inner in lockstep from both feet.
 */
private fun DrawScope.drawBrandMarkBilateral(
    ink: Color,
    muted: Color,
    node: Color,
    sideT: Float,
    nodeT: Float,
    glowT: Float,
    nodePulse: Float,
    ringBurst: Float,
    tipGlow: Boolean,
    solidSparkOnly: Boolean = false,
) {
    val unit = minOf(size.width / ViewW, size.height / ViewH)
    val drawnW = ViewW * unit
    val drawnH = ViewH * unit
    val t = sideT.coerceIn(0f, 1f)
    // Peak / inner lag slightly so the arch leads the meet.
    val peakFrac = ((t - 0.08f) / 0.92f).coerceIn(0f, 1f)
    val innerFrac = ((t - 0.18f) / 0.82f).coerceIn(0f, 1f)

    translate(
        left = (size.width - drawnW) / 2f - ViewX * unit,
        top = (size.height - drawnH) / 2f - ViewY * unit,
    ) {
        scale(scale = unit, pivot = Offset.Zero) {
            val rb = if (solidSparkOnly) 0f else ringBurst.coerceIn(0f, 1f)
            if (rb > 0f) {
                val spark = Offset(256f, 240f)
                for (i in 0..2) {
                    val rt = ((rb * 1.15f) - i * 0.18f).coerceIn(0f, 1f)
                    if (rt <= 0f) continue
                    val radius = 36f + rt * (95f + i * 42f)
                    val alpha = (1f - rt) * (0.34f - i * 0.08f)
                    if (alpha <= 0f) continue
                    drawCircle(
                        color = node.copy(alpha = alpha),
                        radius = radius,
                        center = spark,
                        style = Stroke(width = 3.5f - i * 0.6f),
                    )
                }
            }

            val archInk = muted.copy(alpha = 0.58f)
            // Butt caps on climb + settle — Round caps stacked at apex = grey bead.
            val archStroke = Stroke(width = 24f, cap = StrokeCap.Butt, join = StrokeJoin.Round)
            if (t >= 0.995f) {
                drawPath(ArchFull.path, archInk, style = archStroke)
            } else {
                drawPartialPath(ArchLeft, archInk, archStroke, t, tipGlow = false)
                drawPartialPath(ArchRight, archInk, archStroke, t, tipGlow = false)
            }

            val tipP = tipGlow && !solidSparkOnly && peakFrac in 0.02f..0.98f
            if (peakFrac >= 0.995f) {
                drawPath(PeakFull.path, ink, style = stroke(24f))
            } else {
                drawPartialPath(PeakLeft, ink, stroke(24f), peakFrac, tipP, ink)
                drawPartialPath(PeakRight, ink, stroke(24f), peakFrac, tipP, ink)
            }

            val tipI = tipGlow && !solidSparkOnly && innerFrac in 0.02f..0.98f
            val innerInk = muted.copy(alpha = 0.85f)
            if (innerFrac >= 0.995f) {
                drawPath(InnerFull.path, innerInk, style = stroke(18f))
            } else {
                drawPartialPath(InnerLeft, innerInk, stroke(18f), innerFrac, tipI, muted)
                drawPartialPath(InnerRight, innerInk, stroke(18f), innerFrac, tipI, muted)
            }

            val nt = nodeT.coerceIn(0f, 1f)
            if (nt > 0f) {
                val spark = Offset(256f, 240f)
                val pop = nodePulse.coerceAtLeast(0.01f)
                val g = glowT.coerceIn(0f, 1f)
                if (solidSparkOnly) {
                    // Soft fixed bloom under solid disc — presence, not radiating rings.
                    if (g > 0f) {
                        drawCircle(
                            color = node.copy(alpha = 0.22f * g * nt),
                            radius = 52f * pop,
                            center = spark,
                        )
                        drawCircle(
                            color = node.copy(alpha = 0.10f * g * nt),
                            radius = 72f * pop,
                            center = spark,
                        )
                    }
                    drawCircle(
                        color = node.copy(alpha = nt),
                        radius = 30f * pop,
                        center = spark,
                    )
                } else {
                    if (g > 0f) {
                        drawCircle(
                            color = node.copy(alpha = 0.22f * g),
                            radius = 78f * pop * (0.75f + 0.3f * g),
                            center = spark,
                        )
                        drawCircle(
                            color = node.copy(alpha = 0.12f * g),
                            radius = 118f * (0.6f + 0.45f * g),
                            center = spark,
                        )
                    }
                    drawCircle(
                        color = node.copy(alpha = nt),
                        radius = 30f * pop,
                        center = spark,
                    )
                    drawCircle(
                        color = Color.White.copy(alpha = 0.35f * nt),
                        radius = 11f * pop,
                        center = spark,
                    )
                }
            }
        }
    }
}

private fun DrawScope.drawPartialPath(
    measured: MeasuredStroke,
    color: Color,
    style: Stroke,
    fraction: Float,
    tipGlow: Boolean = false,
    tipColor: Color = color,
) {
    val f = fraction.coerceIn(0f, 1f)
    if (f <= 0f) return
    val path = measured.path
    val measure = measured.measure
    val len = measured.length
    if (f >= 1f) {
        drawPath(path, color, style = style)
        return
    }
    val out = Path()
    measure.getSegment(0f, len * f, out, true)
    drawPath(out, color, style = style)
    if (tipGlow && len > 0f) {
        val tip = measure.getPosition(len * f)
        val tipR = style.width * 0.55f
        drawCircle(tipColor.copy(alpha = 0.38f), radius = tipR * 1.45f, center = tip)
        drawCircle(tipColor.copy(alpha = 0.88f), radius = tipR * 0.48f, center = tip)
    }
}

private fun stroke(width: Float) =
    Stroke(width = width, cap = StrokeCap.Round, join = StrokeJoin.Round)

/** Cached geometry — avoid alloc per frame during splash draw. */
private class MeasuredStroke(builder: Path.() -> Unit) {
    val path = Path().apply(builder)
    val measure = PathMeasure().also { it.setPath(path, false) }
    val length: Float get() = measure.length
}

private val ArchLeft = MeasuredStroke {
    moveTo(80f, 384f)
    cubicTo(80f, 192f, 208f, 112f, 256f, 112f)
}
private val ArchRight = MeasuredStroke {
    moveTo(432f, 384f)
    cubicTo(432f, 192f, 304f, 112f, 256f, 112f)
}
/** Single arch L→apex→R — settles without tip blob. */
private val ArchFull = MeasuredStroke {
    moveTo(80f, 384f)
    cubicTo(80f, 192f, 208f, 112f, 256f, 112f)
    cubicTo(304f, 112f, 432f, 192f, 432f, 384f)
}
private val PeakLeft = MeasuredStroke {
    moveTo(144f, 384f)
    lineTo(256f, 176f)
}
private val PeakRight = MeasuredStroke {
    moveTo(368f, 384f)
    lineTo(256f, 176f)
}
private val PeakFull = MeasuredStroke {
    moveTo(144f, 384f)
    lineTo(256f, 176f)
    lineTo(368f, 384f)
}
private val InnerLeft = MeasuredStroke {
    moveTo(192f, 368f)
    lineTo(256f, 272f)
}
private val InnerRight = MeasuredStroke {
    moveTo(320f, 368f)
    lineTo(256f, 272f)
}
private val InnerFull = MeasuredStroke {
    moveTo(192f, 368f)
    lineTo(256f, 272f)
    lineTo(320f, 368f)
}

@Preview
@Composable
private fun BrandMarkPreview() {
    AiiminTheme { BrandMark(size = 96.dp) }
}

@Preview
@Composable
private fun SplashPreview() {
    AiiminTheme { AiiminSplash(onFinished = {}) }
}
