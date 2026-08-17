package aiimin.designsystem.component

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.zIndex
import aiimin.designsystem.theme.AiiminTheme
import aiimin.designsystem.theme.Hairline

/**
 * A blueprint frame: hairline (or accent) edge and an optional legend that
 * breaks the top border. Corner `+` registration marks removed — looked noisy.
 *
 * Use for the composer, an offer, a figure — not for every list row.
 */
@Composable
fun BlueprintBox(
    modifier: Modifier = Modifier,
    legend: String? = null,
    accent: Boolean = false,
    tinted: Boolean = false,
    @Suppress("UNUSED_PARAMETER")
    marks: Boolean = false,
    content: @Composable ColumnScope.() -> Unit,
) {
    val colors = AiiminTheme.colors
    val edge = if (accent) colors.accent else colors.hair

    Box(modifier.fillMaxWidth()) {
        Column(
            Modifier
                .fillMaxWidth()
                .background(if (tinted) colors.tint else Color.Transparent)
                .border(Hairline, edge)
                .padding(AiiminTheme.space.s4),
            content = content,
        )

        if (legend != null) {
            Text(
                text = legend.uppercase(),
                style = AiiminTheme.type.sectionLabel,
                color = colors.accent,
                modifier = Modifier
                    .zIndex(1f)
                    .align(Alignment.TopStart)
                    .offset(x = AiiminTheme.space.s4, y = (-6).dp)
                    .background(colors.bg)
                    .padding(horizontal = AiiminTheme.space.s2),
            )
        }
    }
}

@Preview(showBackground = true, backgroundColor = 0xFF15171A)
@Composable
private fun BlueprintPreview() {
    AiiminTheme {
        Column(Modifier.padding(24.dp)) {
            BlueprintBox(legend = "The offer", accent = true, tinted = true) {
                Text("paid 1240 swiggy dinner with rohan, felt sluggish after")
            }
        }
    }
}
