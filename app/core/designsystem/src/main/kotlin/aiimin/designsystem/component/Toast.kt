package aiimin.designsystem.component

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import aiimin.designsystem.theme.AiiminTheme
import aiimin.designsystem.theme.Hairline

/**
 * The confirmation line: a square accent tick, what happened, and — when the
 * thing that happened wrote something — the way back out of it.
 *
 * Every write in the app is announced here. A write with no [onUndo] is a write
 * that cannot be taken back, which should be rare enough to notice.
 */
@Composable
fun UndoToast(
    message: String?,
    modifier: Modifier = Modifier,
    actionLabel: String = "Undo",
    onUndo: (() -> Unit)? = null,
) {
    AnimatedVisibility(
        visible = message != null,
        enter = slideInVertically { it / 2 } + fadeIn(),
        exit = slideOutVertically { it / 2 } + fadeOut(),
        modifier = modifier,
    ) {
        Row(
            Modifier
                .fillMaxWidth()
                .background(AiiminTheme.colors.surface)
                .border(Hairline, AiiminTheme.colors.accent)
                .padding(horizontal = AiiminTheme.space.s4, vertical = 11.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
        ) {
            Box(
                Modifier
                    .size(8.dp)
                    .background(AiiminTheme.colors.accent),
            )
            Text(
                text = message.orEmpty(),
                style = AiiminTheme.type.bodySmall,
                modifier = Modifier.weight(1f),
            )
            if (onUndo != null) {
                TapSurface(onClick = onUndo, minTouchTarget = false) {
                    Text(
                        text = actionLabel.uppercase(),
                        style = AiiminTheme.type.button,
                        color = AiiminTheme.colors.accent,
                        modifier = Modifier.padding(6.dp),
                    )
                }
            }
        }
    }
}

@Preview(showBackground = true, backgroundColor = 0xFF15171A)
@Composable
private fun ToastPreview() {
    AiiminTheme {
        Box(Modifier.padding(20.dp)) {
            UndoToast(message = "Settled · ₹1,240 written to the ledger.", onUndo = {})
        }
    }
}
