package aiimin.designsystem.component

import aiimin.designsystem.theme.Aiimin
import aiimin.designsystem.theme.Shapes
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

class Tool(val icon: ImageVector, val label: String, val onClick: () -> Unit)

/**
 * A tab's secondary tools as a quiet 2-column grid (instead of a row of orange links).
 * Tiles in a row share one height, so a label that wraps never makes its neighbour look short.
 */
@Composable
fun ToolGrid(title: String, tools: List<Tool>, modifier: Modifier = Modifier) {
    val c = Aiimin.colors
    Column(modifier) {
        SectionHeader(title)
        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            tools.chunked(2).forEach { pair ->
                Row(Modifier.fillMaxWidth().height(IntrinsicSize.Min), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    pair.forEach { t ->
                        Row(
                            Modifier.weight(1f).fillMaxHeight().heightIn(min = 52.dp).clip(Shapes.card).background(c.surface)
                                .border(1.dp, c.border, Shapes.card).pressable(t.onClick).padding(horizontal = 12.dp, vertical = 12.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Icon(t.icon, null, tint = c.text, modifier = Modifier.size(18.dp))
                            Spacer(Modifier.width(8.dp))
                            Text(t.label, style = Aiimin.type.bodyStrong.copy(fontSize = 14.sp, lineHeight = 18.sp), maxLines = 2)
                        }
                    }
                    if (pair.size == 1) Spacer(Modifier.weight(1f))
                }
            }
        }
    }
}
