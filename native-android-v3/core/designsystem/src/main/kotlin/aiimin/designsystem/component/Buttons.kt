package aiimin.designsystem.component

import android.view.HapticFeedbackConstants
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import aiimin.designsystem.theme.AiiminTheme
import aiimin.designsystem.theme.Hairline
import aiimin.designsystem.theme.MinTouchTarget

/** How a press feels in the hand. A commit must not feel like a browse. */
enum class Feedback(internal val constant: Int) {
    /** Any ordinary tap. */
    TAP(HapticFeedbackConstants.CONTEXT_CLICK),

    /** A write landed — Settle, Set, claim. Heavier on purpose. */
    COMMIT(HapticFeedbackConstants.CONFIRM),

    /** Something was refused or dropped. */
    REJECT(HapticFeedbackConstants.REJECT),
}

/**
 * The one filled object on the board: solid accent, page-ground ink, and the
 * only place a corner radius is allowed.
 */
@Composable
fun PrimaryButton(
    label: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    feedback: Feedback = Feedback.COMMIT,
) {
    val colors = AiiminTheme.colors
    val shape = RoundedCornerShape(AiiminTheme.radii.md)
    TapSurface(
        onClick = onClick,
        enabled = enabled,
        feedback = feedback,
        modifier = modifier.clip(shape).background(if (enabled) colors.accent else colors.hair),
        contentPadding = 13.dp,
    ) {
        Text(
            text = label.uppercase(),
            style = AiiminTheme.type.chrome,
            color = if (enabled) colors.onAccent else colors.muted,
            textAlign = TextAlign.Center,
        )
    }
}

/** Outlined and quiet — the alternative to a Primary, never a second Primary. */
@Composable
fun GhostButton(
    label: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    color: Color = AiiminTheme.colors.accent,
    enabled: Boolean = true,
    feedback: Feedback = Feedback.TAP,
) {
    val shape = RoundedCornerShape(AiiminTheme.radii.md)
    TapSurface(
        onClick = onClick,
        enabled = enabled,
        feedback = feedback,
        modifier = modifier
            .clip(shape)
            .border(BorderStroke(Hairline, AiiminTheme.colors.rule), shape),
        contentPadding = 9.dp,
    ) {
        Text(
            text = label.uppercase(),
            style = AiiminTheme.type.button,
            color = if (enabled) color else AiiminTheme.colors.muted,
            textAlign = TextAlign.Center,
        )
    }
}

/**
 * Shared press behaviour: a 0.97 squeeze on touch-down plus one light haptic
 * tick — the prototype's `.tap` class, in the hand.
 *
 * No ripple: a spreading circle is Material's language, not a drafting board's.
 */
@Composable
fun TapSurface(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    contentPadding: Dp = 0.dp,
    /** Off for chips and inline marks, which carry their own padding. */
    minTouchTarget: Boolean = true,
    feedback: Feedback = Feedback.TAP,
    content: @Composable () -> Unit,
) {
    val interactions = remember { MutableInteractionSource() }
    val pressed by interactions.collectIsPressedAsState()
    val squeeze by animateFloatAsState(
        targetValue = if (pressed) 0.97f else 1f,
        animationSpec = tween(durationMillis = 110),
        label = "tap-squeeze",
    )
    val view = LocalView.current

    Box(
        modifier
            .scale(squeeze)
            .then(if (minTouchTarget) Modifier.defaultMinSize(minHeight = MinTouchTarget) else Modifier)
            .clickable(interactionSource = interactions, indication = null, enabled = enabled) {
                view.performHapticFeedback(feedback.constant)
                onClick()
            }
            .padding(contentPadding),
        contentAlignment = Alignment.Center,
    ) {
        content()
    }
}

@Preview(showBackground = true, backgroundColor = 0xFF15171A)
@Composable
private fun ButtonsPreview() {
    AiiminTheme {
        Box(Modifier.padding(20.dp)) {
            PrimaryButton(label = "Settle", onClick = {})
        }
    }
}
