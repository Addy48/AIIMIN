package aiimin.designsystem.component

import aiimin.designsystem.theme.Aiimin
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.asPaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// The shared layout pieces from the R6 audit (S1 to S9). One grid: 16 dp margins, 8 dp steps.

/** Non-blank, trimmed parts of a caption; an old "a · b" string is split on its dots. (S6) */
fun metaParts(vararg parts: String?): List<String> =
    parts.flatMap { it?.split(" · ").orEmpty() }.map { it.trim() }.filter { it.isNotEmpty() }

/**
 * A caption made of parts ("₹5,825 left", "11 days to go", "On pace"). Each part keeps its leading "·",
 * so when the line wraps the dot moves with its word and never dangles at a line end. (S6)
 */
@OptIn(ExperimentalLayoutApi::class)
@Composable
fun MetaLine(vararg parts: String?, modifier: Modifier = Modifier, style: TextStyle = Aiimin.type.caption) {
    val items = metaParts(*parts)
    if (items.isEmpty()) return
    FlowRow(modifier.semantics { contentDescription = items.joinToString(", ") }) {
        items.forEachIndexed { i, p ->
            Text(if (i == 0) p else " · $p", style = style, modifier = Modifier.clearAndSetSemantics {})
        }
    }
}

/** A real list: bullet column with a hanging indent, so wrapped lines start under the text. (S7) */
@Composable
fun BulletList(items: List<String>, modifier: Modifier = Modifier, style: TextStyle = Aiimin.type.body) {
    val c = Aiimin.colors
    Column(modifier, verticalArrangement = Arrangement.spacedBy(8.dp)) {
        items.forEach { item ->
            Row {
                // The dot sits on the first line's x-height centre.
                val lineHeight = with(LocalDensity.current) { style.lineHeight.toDp() }
                Box(Modifier.width(16.dp).heightIn(min = lineHeight), contentAlignment = Alignment.CenterStart) {
                    Box(Modifier.size(5.dp).clip(RoundedCornerShape(50)).background(c.textMuted))
                }
                Text(item, style = style, modifier = Modifier.weight(1f))
            }
        }
    }
}

/**
 * A count on an icon (S5): ink by default, with a 2 dp ring in the page colour so it never merges with
 * the icon it sits on. Place it with `Modifier.align(Alignment.TopEnd)` inside the icon's box.
 */
@Composable
fun CountBadge(count: Int, modifier: Modifier = Modifier, fill: Color = Aiimin.colors.text) {
    if (count <= 0) return
    val c = Aiimin.colors
    val shape = RoundedCornerShape(6.dp)
    Box(
        modifier.clip(shape).background(c.base).padding(2.dp).heightIn(min = 16.dp).widthIn(min = 16.dp)
            .clip(RoundedCornerShape(4.dp)).background(fill).padding(horizontal = 3.dp),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            if (count > 9) "9+" else count.toString(),
            style = Aiimin.type.caption.copy(color = c.onInk, fontSize = 10.sp, lineHeight = 14.sp, fontWeight = FontWeight.SemiBold),
            maxLines = 1,
        )
    }
}

/**
 * The bar at the bottom of a pushed screen (S2): page colour, top hairline, above the gesture bar with
 * 8 dp clear space, content on the 16 dp margins. Lists above it pad their end by [bottomActionsSpace].
 */
@Composable
fun BottomActions(modifier: Modifier = Modifier, content: @Composable RowScope.() -> Unit) {
    Column(modifier.fillMaxWidth().background(Aiimin.colors.base)) {
        Hairline()
        Row(
            Modifier.fillMaxWidth().navigationBarsPadding().padding(horizontal = Aiimin.space.gutter, vertical = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically,
            content = content,
        )
    }
}

/** Bottom padding for a scrolling page with no bar under it: the gesture bar plus 24 dp, so the last row clears it. (S2) */
@Composable
fun pageEndPadding(extra: Dp = 24.dp): PaddingValues =
    PaddingValues(bottom = WindowInsets.navigationBars.asPaddingValues().calculateBottomPadding() + extra)

/** Equal-width chip grid (S9): every chip in a row is the same width, rows line up, targets are 48 dp tall. */
@Composable
fun <T> PillGrid(items: List<T>, columns: Int, modifier: Modifier = Modifier, cell: @Composable (T, Modifier) -> Unit) {
    Column(modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(0.dp)) {
        items.chunked(columns).forEach { row ->
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                row.forEach { cell(it, Modifier.weight(1f)) }
                repeat(columns - row.size) { Spacer(Modifier.weight(1f)) }
            }
        }
    }
}

/** A plain card surface with the standard 16 dp padding (S8). */
@Composable
fun SurfaceCard(modifier: Modifier = Modifier, content: @Composable androidx.compose.foundation.layout.ColumnScope.() -> Unit) {
    val c = Aiimin.colors
    Column(
        modifier.fillMaxWidth().clip(aiimin.designsystem.theme.Shapes.card).background(c.surface)
            .border(1.dp, c.border, aiimin.designsystem.theme.Shapes.card).padding(16.dp),
        content = content,
    )
}
