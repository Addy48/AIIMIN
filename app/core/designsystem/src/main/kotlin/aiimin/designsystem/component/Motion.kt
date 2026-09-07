package aiimin.designsystem.component

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.layout.offset
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.unit.IntOffset
import aiimin.designsystem.theme.AiiminTheme
import kotlin.math.roundToInt

/** Drafting Table enter — soft settle, not a bounce. */
private val DraftEase = CubicBezierEasing(0.22f, 1f, 0.36f, 1f)

/**
 * Screen-enter rise. Shorter travel (8dp), longer settle (480ms), tighter
 * stagger. Collapses when reduce-motion is on.
 *
 * Critique of the old motion: 12dp + 360ms felt jumpy and unfinished; siblings
 * stacked with 40ms gaps read as flicker. New defaults trade pop for presence.
 */
@Composable
fun Modifier.riseIn(delayMs: Int = 0): Modifier {
    val reduce = AiiminTheme.reduceMotion
    val progress = remember { Animatable(if (reduce) 1f else 0f) }
    LaunchedEffect(reduce, delayMs) {
        if (reduce) {
            progress.snapTo(1f)
            return@LaunchedEffect
        }
        progress.snapTo(0f)
        progress.animateTo(
            targetValue = 1f,
            animationSpec = tween(
                durationMillis = 480,
                delayMillis = delayMs,
                easing = DraftEase,
            ),
        )
    }
    val t = progress.value
    // Ease the Y travel itself so late frames barely move.
    val y = ((1f - t) * (1f - t) * 8f)
    return this
        .alpha(t)
        .offset { IntOffset(0, y.roundToInt()) }
}

/** Press feedback duration shared by TapSurface — kept interruptible. */
val TapPressMillis: Int = 120

val TapPressEasing = FastOutSlowInEasing
