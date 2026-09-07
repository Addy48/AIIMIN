package aiimin.app.ui.shell

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.width
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
 * Active tab: accent ink + a short steel tick above the glyph. Inactive sit at
 * 0.5. Surface plate under the bar so the sheet edge reads as a tool rail.
 */
@Composable
fun BottomBar(
    current: Tab?,
    onSelect: (Tab) -> Unit,
    modifier: Modifier = Modifier,
) {
    val colors = AiiminTheme.colors
    Column(modifier.fillMaxWidth().background(colors.surface)) {
        Rule(color = colors.rule)
        Row(
            Modifier
                .fillMaxWidth()
                .navigationBarsPadding()
                .height(BarHeight),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Tab.entries.forEach { tab ->
                val selected = tab == current
                val ink = if (selected) colors.accent else colors.text
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
                        verticalArrangement = Arrangement.spacedBy(4.dp),
                        modifier = Modifier.alpha(if (selected) 1f else INACTIVE_ALPHA),
                    ) {
                        Box(
                            Modifier
                                .width(18.dp)
                                .height(2.dp)
                                .background(if (selected) colors.accent else colors.bg.copy(alpha = 0f)),
                        )
                        AiiminGlyph(icon = tab.icon, color = ink)
                        Text(
                            text = tab.label,
                            style = AiiminTheme.type.cellLabel,
                            color = ink,
                        )
                    }
                }
            }
        }
    }
}

private val BarHeight = 68.dp
private const val INACTIVE_ALPHA = 0.5f

@Preview(showBackground = true, backgroundColor = 0xFF15171A)
@Composable
private fun BottomBarPreview() {
    AiiminTheme {
        BottomBar(current = Tab.DAY, onSelect = {})
    }
}
