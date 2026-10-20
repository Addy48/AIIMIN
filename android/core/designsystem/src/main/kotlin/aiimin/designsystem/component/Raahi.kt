package aiimin.designsystem.component

import aiimin.core.engine.raahi.RaahiMode
import aiimin.core.engine.raahi.RaahiMotion
import aiimin.core.engine.raahi.RaahiPose
import aiimin.core.engine.raahi.RaahiRules
import aiimin.core.engine.raahi.RaahiScene
import aiimin.designsystem.R
import aiimin.designsystem.theme.LocalReduceMotion
import aiimin.designsystem.theme.Motion
import androidx.compose.animation.Crossfade
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.snap
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.TransformOrigin
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/** Raahi's mode for the whole app (Settings › Raahi). Off hides every picture of Raahi; the name stays (PRD 1.1). */
val LocalRaahiMode = staticCompositionLocalOf { RaahiMode.QUIET }

/** The three sizes of detail (Part 20.2): the 28 dp Mini, the 64 dp card and the 220 dp hero. */
enum class RaahiSize(val dp: Dp) { MINI(28.dp), CARD(64.dp), HERO(220.dp) }

/** File per pose and size (Part 20.4 names). An explicit map, so resource shrinking keeps every file. */
fun raahiRes(pose: RaahiPose, size: RaahiSize): Int = when (pose) {
    RaahiPose.IDLE -> when (size) { RaahiSize.MINI -> R.drawable.raahi_pose_idle_mini; RaahiSize.CARD -> R.drawable.raahi_pose_idle_card; RaahiSize.HERO -> R.drawable.raahi_pose_idle_hero }
    RaahiPose.WAKING -> when (size) { RaahiSize.MINI -> R.drawable.raahi_pose_waking_stretch_mini; RaahiSize.CARD -> R.drawable.raahi_pose_waking_stretch_card; RaahiSize.HERO -> R.drawable.raahi_pose_waking_stretch_hero }
    RaahiPose.THINKING -> when (size) { RaahiSize.MINI -> R.drawable.raahi_pose_thinking_mini; RaahiSize.CARD -> R.drawable.raahi_pose_thinking_card; RaahiSize.HERO -> R.drawable.raahi_pose_thinking_hero }
    RaahiPose.NOTICING -> when (size) { RaahiSize.MINI -> R.drawable.raahi_pose_noticing_mini; RaahiSize.CARD -> R.drawable.raahi_pose_noticing_card; RaahiSize.HERO -> R.drawable.raahi_pose_noticing_hero }
    RaahiPose.SETTLE -> when (size) { RaahiSize.MINI -> R.drawable.raahi_pose_settle_mini; RaahiSize.CARD -> R.drawable.raahi_pose_settle_card; RaahiSize.HERO -> R.drawable.raahi_pose_settle_hero }
    RaahiPose.SLEEPING -> when (size) { RaahiSize.MINI -> R.drawable.raahi_pose_sleeping_mini; RaahiSize.CARD -> R.drawable.raahi_pose_sleeping_card; RaahiSize.HERO -> R.drawable.raahi_pose_sleeping_hero }
    RaahiPose.LISTENING -> when (size) { RaahiSize.MINI -> R.drawable.raahi_pose_listening_mini; RaahiSize.CARD -> R.drawable.raahi_pose_listening_card; RaahiSize.HERO -> R.drawable.raahi_pose_listening_hero }
    RaahiPose.WALKING -> when (size) { RaahiSize.MINI -> R.drawable.raahi_pose_walking_mini; RaahiSize.CARD -> R.drawable.raahi_pose_walking_card; RaahiSize.HERO -> R.drawable.raahi_pose_walking_hero }
    RaahiPose.WAVING -> when (size) { RaahiSize.MINI -> R.drawable.raahi_pose_waving_mini; RaahiSize.CARD -> R.drawable.raahi_pose_waving_card; RaahiSize.HERO -> R.drawable.raahi_pose_waving_hero }
    RaahiPose.NODDING -> when (size) { RaahiSize.MINI -> R.drawable.raahi_pose_nodding_mini; RaahiSize.CARD -> R.drawable.raahi_pose_nodding_card; RaahiSize.HERO -> R.drawable.raahi_pose_nodding_hero }
    RaahiPose.POINTING -> when (size) { RaahiSize.MINI -> R.drawable.raahi_pose_pointing_mini; RaahiSize.CARD -> R.drawable.raahi_pose_pointing_card; RaahiSize.HERO -> R.drawable.raahi_pose_pointing_hero }
    RaahiPose.SATCHEL_OPEN -> when (size) { RaahiSize.MINI -> R.drawable.raahi_pose_satchel_open_mini; RaahiSize.CARD -> R.drawable.raahi_pose_satchel_open_card; RaahiSize.HERO -> R.drawable.raahi_pose_satchel_open_hero }
    RaahiPose.HOLDING_POSTCARD -> when (size) { RaahiSize.MINI -> R.drawable.raahi_pose_holding_postcard_mini; RaahiSize.CARD -> R.drawable.raahi_pose_holding_postcard_card; RaahiSize.HERO -> R.drawable.raahi_pose_holding_postcard_hero }
    RaahiPose.QUIET_CELEBRATION -> when (size) { RaahiSize.MINI -> R.drawable.raahi_pose_quiet_celebration_mini; RaahiSize.CARD -> R.drawable.raahi_pose_quiet_celebration_card; RaahiSize.HERO -> R.drawable.raahi_pose_quiet_celebration_hero }
}

fun raahiSceneRes(scene: RaahiScene): Int = when (scene) {
    RaahiScene.SITTING_SUNSET -> R.drawable.raahi_scene_sitting_sunset
    RaahiScene.HOLDING_LANTERN -> R.drawable.raahi_scene_holding_lantern
}

/**
 * Raahi in one pose. Draws nothing when Raahi is Off. [motion] plays once when it changes (the caller has
 * already counted it against the day's budget, [RaahiRules.play]); with reduce motion the pose simply
 * changes. The breathing loop runs in Full only. Only transform and opacity move (Part 26.5).
 */
@Composable
fun Raahi(
    pose: RaahiPose,
    size: RaahiSize,
    modifier: Modifier = Modifier,
    motion: RaahiMotion? = null,
    description: String? = null,
) {
    val mode = LocalRaahiMode.current
    if (!RaahiRules.showsArt(mode)) return
    val reduce = LocalReduceMotion.current
    val loop = RaahiRules.loops(mode, reduce)
    val breathe = if (loop) {
        val t = rememberInfiniteTransition(label = "raahi")
        // Idle breathing 2.4 s, sleeping 3 s, listening sway 4 s (Part 20.3): a tiny rise, never bouncy.
        val ms = when (pose) { RaahiPose.SLEEPING -> 3000; RaahiPose.LISTENING -> Motion.AMBIENT_MAX; else -> Motion.AMBIENT_MIN }
        t.animateFloat(0f, 1f, infiniteRepeatable(Motion.ambient(ms), RepeatMode.Reverse), label = "breathe").value
    } else 0f
    val played = remember { Animatable(1f) }
    LaunchedEffect(motion) {
        if (motion == null || reduce) { played.snapTo(1f); return@LaunchedEffect }
        played.snapTo(0f)
        played.animateTo(1f, if (motion == RaahiMotion.WAVE) Motion.emphasised() else Motion.standard())
    }
    val p = played.value
    val sway = pose == RaahiPose.LISTENING
    Box(
        modifier.size(size.dp).then(
            if (description == null) Modifier.clearAndSetSemantics { } else Modifier.semantics { contentDescription = description },
        ),
    ) {
        Crossfade(pose, animationSpec = if (reduce) snap() else Motion.standard(), label = "pose") { shown ->
            Image(
                painterResource(raahiRes(shown, size)),
                contentDescription = null,
                contentScale = ContentScale.Fit,
                modifier = Modifier.size(size.dp).graphicsLayer {
                    transformOrigin = TransformOrigin(0.5f, 1f)
                    val wave = kotlin.math.sin(p * Math.PI * 2).toFloat()
                    when (motion) {
                        // A small hop for firsts and a short rise for waking, settling and noticing.
                        RaahiMotion.HOP -> translationY = -wave.coerceAtLeast(0f) * size.dp.toPx() * 0.08f
                        RaahiMotion.NOD -> rotationZ = -6f * kotlin.math.sin(p * Math.PI).toFloat()
                        RaahiMotion.WAVE -> rotationZ = 3f * wave
                        null -> Unit
                        else -> { val s = 0.94f + 0.06f * p; scaleX = s; scaleY = s }
                    }
                    if (loop) {
                        if (sway) rotationZ += (breathe - 0.5f) * 1.6f
                        else { scaleY *= 1f + 0.015f * breathe; translationY -= breathe * size.dp.toPx() * 0.006f }
                    }
                },
            )
        }
    }
}

/** A scene (sunset, lantern) at card or hero width; nothing when Raahi is Off. */
@Composable
fun RaahiScenePicture(scene: RaahiScene, width: Dp, modifier: Modifier = Modifier) {
    if (!RaahiRules.showsArt(LocalRaahiMode.current)) return
    Image(
        painterResource(raahiSceneRes(scene)), contentDescription = null, contentScale = ContentScale.Fit,
        modifier = modifier.width(width).clearAndSetSemantics { },
    )
}

/** What each mode does, in Raahi's plain words (Settings › Raahi and onboarding screen 6). */
fun raahiModeHelp(mode: RaahiMode): String = when (mode) {
    RaahiMode.FULL -> "More poses and small moves. A second line for firsts."
    RaahiMode.QUIET -> "One line when you open the app. At most 3 small moves a day."
    RaahiMode.OFF -> "No pictures of Raahi. Its name stays on its notes and replies."
}

/** Full / Quiet / Off with the chosen mode's meaning under it. */
@Composable
fun RaahiModePicker(mode: RaahiMode, onPick: (RaahiMode) -> Unit, modifier: Modifier = Modifier) {
    androidx.compose.foundation.layout.Column(modifier) {
        Segmented(listOf("Full", "Quiet", "Off"), mode.ordinal, { onPick(RaahiMode.entries[it]) })
        androidx.compose.material3.Text(
            raahiModeHelp(mode),
            style = aiimin.designsystem.theme.Aiimin.type.caption,
            modifier = Modifier.padding(top = 8.dp),
        )
    }
}
