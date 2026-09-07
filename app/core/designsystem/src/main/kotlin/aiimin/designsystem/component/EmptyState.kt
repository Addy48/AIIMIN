package aiimin.designsystem.component

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import aiimin.designsystem.theme.AiiminTheme

/**
 * The empty state: framed like a blank plate on the drafting board — label,
 * one honest line, optional action. Never a spinner, never a shrug illustration.
 */
@Composable
fun EmptyState(
    label: String,
    message: String,
    modifier: Modifier = Modifier,
    actionLabel: String? = null,
    onAction: (() -> Unit)? = null,
) {
    BlueprintBox(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = AiiminTheme.space.s4),
        accent = false,
        tinted = true,
    ) {
        Column(
            Modifier
                .fillMaxWidth()
                .padding(vertical = AiiminTheme.space.s4),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
        ) {
            Text(
                text = label.uppercase(),
                style = AiiminTheme.type.sectionLabel,
                color = AiiminTheme.colors.accent,
            )
            Text(
                text = message,
                style = AiiminTheme.type.bodySmall,
                color = AiiminTheme.colors.muted,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(horizontal = AiiminTheme.space.s3),
            )
            if (actionLabel != null && onAction != null) {
                GhostButton(
                    label = actionLabel,
                    onClick = onAction,
                    modifier = Modifier.padding(top = AiiminTheme.space.s2),
                )
            }
        }
    }
}

@Preview(showBackground = true, backgroundColor = 0xFF15171A)
@Composable
private fun EmptyStatePreview() {
    AiiminTheme {
        EmptyState(
            label = "Nothing held",
            message = "Captures you drift instead of settling wait here until you decide.",
            actionLabel = "New capture",
            onAction = {},
            modifier = Modifier.padding(20.dp),
        )
    }
}
