package aiimin.app.ui.shell

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import aiimin.app.navigation.Tab
import aiimin.designsystem.component.Rule
import aiimin.designsystem.component.TapSurface
import aiimin.designsystem.component.Text
import aiimin.designsystem.icon.AiiminGlyph
import aiimin.designsystem.theme.AiiminTheme

/**
 * DAY · MONEY · CAPTURE · LAB · CONFIG.
 *
 * The active tab is full ink; the rest sit at 0.55 — readable, not washed out.
 * No pill, no indicator bar: the drawing marks state by weight, not by chrome.
 */
@Composable
fun BottomBar(
    current: Tab?,
    onSelect: (Tab) -> Unit,
    modifier: Modifier = Modifier,
) {
    Column(modifier.fillMaxWidth().background(AiiminTheme.colors.bg)) {
        Rule()
        Row(
            Modifier
                .fillMaxWidth()
                .navigationBarsPadding()
                .height(BarHeight),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Tab.entries.forEach { tab ->
                val selected = tab == current
                TapSurface(
                    onClick = { onSelect(tab) },
                    modifier = Modifier
                        .weight(1f)
                        .semantics {
                            role = Role.Tab
                            this.selected = selected
                        },
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(5.dp),
                        modifier = Modifier.alpha(if (selected) 1f else INACTIVE_ALPHA),
                    ) {
                        AiiminGlyph(icon = tab.icon, color = AiiminTheme.colors.text)
                        Text(
                            text = tab.label,
                            style = AiiminTheme.type.cellLabel,
                            color = AiiminTheme.colors.text,
                        )
                    }
                }
            }
        }
    }
}

private val BarHeight = 66.dp
private const val INACTIVE_ALPHA = 0.55f

@Preview(showBackground = true, backgroundColor = 0xFF15171A)
@Composable
private fun BottomBarPreview() {
    AiiminTheme {
        BottomBar(current = Tab.DAY, onSelect = {})
    }
}
