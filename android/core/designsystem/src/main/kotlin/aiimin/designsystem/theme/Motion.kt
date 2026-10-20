package aiimin.designsystem.theme

import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.Easing
import androidx.compose.animation.core.FiniteAnimationSpec
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.SpringSpec
import androidx.compose.animation.core.TweenSpec
import androidx.compose.animation.core.snap
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.runtime.staticCompositionLocalOf
import kotlin.math.PI
import kotlin.math.cos

/**
 * The one motion token set (PRD Part 26.5). Every animation in the app uses these and nothing else.
 * Only transform, opacity and path trim move; nothing loops except Raahi ambient and a recording ring;
 * nothing animates while the person types. With reduce motion on, movement is replaced by a 200 ms fade.
 */
object Motion {
    /** Press feedback: linear-out (Material's linear-out, slow-in). */
    val LinearOut: Easing = CubicBezierEasing(0f, 0f, 0.2f, 1f)
    /** Toggles, chips, content in. */
    val Standard: Easing = CubicBezierEasing(0.2f, 0f, 0f, 1f)
    /** Sheets, shared-element moves, the "+" sheet. */
    val Emphasised: Easing = CubicBezierEasing(0.05f, 0.7f, 0.1f, 1f)
    /** Things leaving, always faster than entering. */
    val Exit: Easing = CubicBezierEasing(0.3f, 0f, 0.8f, 0.15f)
    /** Raahi breathing, sleeping and listening sway. */
    val Sine: Easing = Easing { t -> (0.5f - 0.5f * cos(PI * t)).toFloat() }

    const val TAP = 90
    const val QUICK = 160
    const val STANDARD = 280
    const val EMPHASISED = 420
    const val EXIT = 200
    const val AMBIENT_MIN = 2400
    const val AMBIENT_MAX = 4000
    const val REDUCED_FADE = 200
    const val STAGGER = 30
    const val STAGGER_MAX_ITEMS = 8

    /** Today's day-arc dot slides to now on open (Part 26.5 moment table). */
    const val ARC = 600
    /** Press scale on cards and buttons (0.97). */
    const val PRESS_SCALE = 0.97f
    /** List items rise this far as they fade in. */
    const val RISE_DP = 12f
    /** The "+" turns this far while its sheet is open. */
    const val PLUS_OPEN_DEGREES = 45f

    fun <T> tap(): TweenSpec<T> = tween(TAP, easing = LinearOut)
    fun <T> quick(delay: Int = 0): TweenSpec<T> = tween(QUICK, delay, Standard)
    fun <T> standard(delay: Int = 0): TweenSpec<T> = tween(STANDARD, delay, Standard)
    fun <T> emphasised(delay: Int = 0): TweenSpec<T> = tween(EMPHASISED, delay, Emphasised)
    fun <T> exit(): TweenSpec<T> = tween(EXIT, easing = Exit)
    fun <T> ambient(ms: Int = AMBIENT_MIN): TweenSpec<T> = tween(ms.coerceIn(AMBIENT_MIN, AMBIENT_MAX), easing = Sine)
    fun <T> springSoft(): SpringSpec<T> = spring(dampingRatio = 0.8f, stiffness = 300f)
    fun <T> reducedFade(): TweenSpec<T> = tween(REDUCED_FADE, easing = LinearEasing)
    fun <T> arc(): TweenSpec<T> = tween(ARC, easing = Standard)

    /** The opening screen's own curves (Part 26.2), used only by BootScene. */
    object Boot {
        val Rise: Easing = CubicBezierEasing(0.22f, 1f, 0.36f, 1f)
        val Draw: Easing = CubicBezierEasing(0.16f, 1f, 0.3f, 1f)
        val Move: Easing = CubicBezierEasing(0.65f, 0f, 0.35f, 1f)
        val Settle: Easing = CubicBezierEasing(0.34f, 1.5f, 0.5f, 1f)
        const val FULL_MS = 3500
        const val SHORT_MS = 900
        /** Reduce motion: the final frame fades in over 200 ms and holds 0.6 s. */
        const val REDUCED_MS = REDUCED_FADE + 600
        /** One clock for the whole scene: time runs linearly, each element eases its own segment. */
        fun <T> clock(ms: Int): TweenSpec<T> = tween(ms, easing = LinearEasing)
    }

    /** List entry: 30 ms per item, only the first 8 items are staggered. */
    fun staggerDelay(index: Int): Int = STAGGER * index.coerceIn(0, STAGGER_MAX_ITEMS - 1)

    /**
     * A movement (translate, scale, trim, progress) with reduce motion respected: the value jumps and the
     * surrounding screen's 200 ms fade carries the change.
     */
    fun <T> move(reduce: Boolean, spec: FiniteAnimationSpec<T>): FiniteAnimationSpec<T> = if (reduce) snap() else spec

    /** An opacity change: the token, or the 200 ms fade when reduce motion is on. */
    fun <T> fade(reduce: Boolean, spec: FiniteAnimationSpec<T>): FiniteAnimationSpec<T> = if (reduce) reducedFade() else spec
}

/** True when the person turned on Reduce motion in AIIMIN or "Remove animations" in Android. */
val LocalReduceMotion = staticCompositionLocalOf { false }
