package aiimin.designsystem.component

import aiimin.designsystem.theme.LocalReduceMotion
import aiimin.designsystem.theme.Motion
import aiimin.designsystem.theme.Shapes
import androidx.compose.animation.BoundsTransform
import androidx.compose.animation.ExperimentalSharedTransitionApi
import androidx.compose.animation.SharedTransitionScope
import androidx.compose.runtime.Composable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Modifier
import androidx.navigation3.ui.LocalNavAnimatedContentScope

/**
 * Screen to screen (PRD Part 26.5): the tapped card grows into the screen it opens (container transform)
 * and back shrinks it again, including the predictive back gesture. The shell wraps every screen in
 * [sharedContainer] keyed by its route; a card that opens a screen passes the same route as `sharedKey`.
 */
@OptIn(ExperimentalSharedTransitionApi::class)
val LocalSharedScope = staticCompositionLocalOf<SharedTransitionScope?> { null }

/** The key that joins a card to the screen it opens. */
fun sharedKeyOf(route: Any): String = "screen:$route"

/**
 * Which navigation is a container transform: the shell cross-fades screens for these instead of sliding,
 * so the growing card carries the movement on its own.
 */
object SharedNav {
    private var armedKey: String? = null
    private var armedAt = 0L
    private val opened = mutableSetOf<String>()

    /** Called by a card just before it opens [key]. */
    fun arm(key: String) {
        armedKey = key
        armedAt = System.nanoTime()
    }

    /**
     * True if the screen being opened was opened by its card (within a second of the tap). Idempotent:
     * the transition spec may be read more than once for one navigation.
     */
    fun opening(key: String): Boolean {
        val hit = armedKey == key && System.nanoTime() - armedAt < 1_000_000_000L
        if (hit) opened += key
        return hit
    }

    /** True if the screen being closed was opened by a card, so it shrinks back into it. */
    fun closing(key: String): Boolean {
        if (armedKey == key) armedKey = null
        return key in opened
    }

    /** The screen left the back stack for good. */
    fun forget(key: String) {
        opened -= key
    }
}

/** Joins this card or screen to its partner under [key]; no-op without a shell or with reduce motion. */
@OptIn(ExperimentalSharedTransitionApi::class)
@Composable
fun Modifier.sharedContainer(key: String?): Modifier {
    if (key == null || LocalReduceMotion.current) return this
    val scope = LocalSharedScope.current ?: return this
    val anim = LocalNavAnimatedContentScope.current
    return with(scope) {
        this@sharedContainer.sharedBounds(
            sharedContentState = rememberSharedContentState(key),
            animatedVisibilityScope = anim,
            boundsTransform = BoundsTransform { _, _ -> Motion.emphasised() },
            resizeMode = SharedTransitionScope.ResizeMode.RemeasureToBounds,
            clipInOverlayDuringTransition = OverlayClip(Shapes.card),
        )
    }
}

/**
 * The screen inside a shared container keeps its final (lookahead) size during the transform, so it is laid
 * out once rather than at every frame's size; the container clips it while it grows.
 */
@OptIn(ExperimentalSharedTransitionApi::class)
@Composable
fun Modifier.keepFinalSize(): Modifier {
    if (LocalReduceMotion.current) return this
    val scope = LocalSharedScope.current ?: return this
    return with(scope) { this@keepFinalSize.skipToLookaheadSize() }
}

/** A card that opens [route]: it grows into that screen. Pair with [armShared] in the click. */
@Composable
fun Modifier.opensScreen(route: Any): Modifier = sharedContainer(sharedKeyOf(route))

/** Marks the next navigation to [route] as a container transform. */
fun armShared(route: Any) = SharedNav.arm(sharedKeyOf(route))
