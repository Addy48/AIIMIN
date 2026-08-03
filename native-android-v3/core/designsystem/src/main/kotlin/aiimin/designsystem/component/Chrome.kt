package aiimin.designsystem.component

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import aiimin.designsystem.theme.AiiminTheme
import aiimin.designsystem.theme.Hairline

/** One drawn rule. Every divider in the app is this. */
@Composable
fun Rule(modifier: Modifier = Modifier, color: Color = AiiminTheme.colors.rule) {
    Box(modifier.fillMaxWidth().height(Hairline).background(color))
}

/** The faintest line — cell edges inside a grid, not section breaks. */
@Composable
fun HairRule(modifier: Modifier = Modifier) = Rule(modifier, AiiminTheme.colors.hair)

/**
 * The screen head: a rule pair with the surface name on the left and its meta
 * figure on the right. Every surface opens with exactly one of these.
 */
@Composable
fun ScreenHead(
    title: String,
    modifier: Modifier = Modifier,
    meta: String? = null,
    metaColor: Color = AiiminTheme.colors.muted,
) {
    Column(modifier.fillMaxWidth()) {
        Rule()
        Row(
            Modifier
                .fillMaxWidth()
                .padding(vertical = AiiminTheme.space.s3),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.Bottom,
        ) {
            Text(
                text = title.uppercase(),
                style = AiiminTheme.type.chrome,
                color = AiiminTheme.colors.text,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.weight(1f, fill = false),
            )
            if (meta != null) {
                Text(text = meta, style = AiiminTheme.type.mono, color = metaColor)
            }
        }
        Rule()
    }
}

/**
 * A section break: rule, then the all-caps label, with an optional figure on the
 * right in accent.
 */
@Composable
fun SectionRule(
    label: String,
    modifier: Modifier = Modifier,
    value: String? = null,
    valueColor: Color = AiiminTheme.colors.accent,
) {
    Column(modifier.fillMaxWidth().padding(top = AiiminTheme.space.s6)) {
        Rule()
        Row(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s3),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                text = label.uppercase(),
                style = AiiminTheme.type.sectionLabel,
                color = AiiminTheme.colors.muted,
            )
            if (value != null) {
                Text(
                    text = value,
                    style = AiiminTheme.type.mono(10.0, FontWeight.Medium),
                    color = valueColor,
                )
            }
        }
    }
}

/**
 * A bordered plate — the drawn box that holds a composer, an offer, a callout.
 * Hairline edge, square corners, no shadow: this is ink on paper, not elevation.
 */
@Composable
fun DraftedBox(
    modifier: Modifier = Modifier,
    borderColor: Color = AiiminTheme.colors.hair,
    background: Color = Color.Transparent,
    content: @Composable ColumnScope.() -> Unit,
) {
    Column(
        modifier
            .fillMaxWidth()
            .background(background)
            .border(Hairline, borderColor)
            .padding(AiiminTheme.space.s4),
        content = content,
    )
}

@Preview(showBackground = true, backgroundColor = 0xFF15171A)
@Composable
private fun ChromePreview() {
    AiiminTheme {
        Column(Modifier.padding(20.dp)) {
            ScreenHead(title = "AIIMIN · Day sheet", meta = "02.08.26 TUE")
            SectionRule(label = "Today's read", value = "78")
            DraftedBox(Modifier.padding(top = 12.dp)) {
                Text("Log anything — AIIMIN sorts it.", style = AiiminTheme.type.body)
            }
        }
    }
}
