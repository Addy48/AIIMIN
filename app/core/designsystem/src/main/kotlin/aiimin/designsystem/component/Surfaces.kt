package aiimin.designsystem.component

import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.theme.Aiimin
import aiimin.designsystem.theme.PersonHues
import aiimin.designsystem.theme.Shapes
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween

/** Gentle press feedback used by every tappable surface (scale 0.98, 120 ms). */
@Composable
fun Modifier.pressable(onClick: (() -> Unit)?, role: Role = Role.Button, onClickLabel: String? = null): Modifier {
    if (onClick == null) return this
    val source = remember { MutableInteractionSource() }
    val pressed by source.collectIsPressedAsState()
    val s by animateFloatAsState(if (pressed) 0.98f else 1f, tween(120), label = "press")
    return this
        .scale(s)
        .clickable(interactionSource = source, indication = null, role = role, onClickLabel = onClickLabel, onClick = onClick)
}

/** An L1 card floating over the canvas. */
@Composable
fun Panel(
    modifier: Modifier = Modifier,
    onClick: (() -> Unit)? = null,
    padding: PaddingValues = PaddingValues(16.dp),
    color: Color = Aiimin.colors.surface,
    shape: Shape = Shapes.card,
    bordered: Boolean = true,
    content: @Composable ColumnScope.() -> Unit,
) {
    val c = Aiimin.colors
    Column(
        modifier
            .fillMaxWidth()
            .pressable(onClick)
            .clip(shape)
            .background(color)
            .then(if (bordered) Modifier.border(1.dp, c.border, shape) else Modifier)
            .padding(padding),
        content = content,
    )
}

/** Quiet tracked eyebrow above a group, with an optional action on the right. */
@Composable
fun SectionHeader(
    title: String,
    modifier: Modifier = Modifier,
    action: String? = null,
    onAction: (() -> Unit)? = null,
    trailing: (@Composable RowScope.() -> Unit)? = null,
) {
    Row(
        modifier.fillMaxWidth().padding(top = 8.dp, bottom = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(title.uppercase(), style = Aiimin.type.eyebrow, modifier = Modifier.weight(1f))
        trailing?.invoke(this)
        if (action != null && onAction != null) {
            Text(
                action,
                style = Aiimin.type.label.copy(color = Aiimin.colors.accent),
                modifier = Modifier.clip(Shapes.small).clickable(onClick = onAction).padding(horizontal = 6.dp, vertical = 4.dp),
            )
        }
    }
}

/** Icon inside a soft tinted square; the standard leading element of a row. */
@Composable
fun IconTile(icon: ImageVector, tint: Color = Aiimin.colors.textMuted, background: Color = Color.Transparent, size: Dp = 36.dp) {
    // A bare icon by default; a tinted square only when it carries status (warn, danger, done).
    Box(Modifier.size(size).clip(Shapes.small).background(background), contentAlignment = Alignment.Center) {
        Icon(icon, contentDescription = null, tint = tint, modifier = Modifier.size(if (background == Color.Transparent) size * 0.6f else size * 0.5f))
    }
}

@Composable
fun ListRow(
    title: String,
    modifier: Modifier = Modifier,
    subtitle: String? = null,
    leading: (@Composable () -> Unit)? = null,
    trailing: (@Composable () -> Unit)? = null,
    onClick: (() -> Unit)? = null,
    titleColor: Color = Aiimin.colors.text,
    maxSubtitleLines: Int = 1,
) {
    Row(
        modifier
            .fillMaxWidth()
            .heightIn(min = 52.dp)
            .then(if (onClick != null) Modifier.clip(Shapes.row).clickable(onClick = onClick) else Modifier)
            .padding(vertical = 10.dp, horizontal = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        if (leading != null) {
            leading()
            Spacer(Modifier.width(12.dp))
        }
        Column(Modifier.weight(1f)) {
            Text(title, style = Aiimin.type.bodyStrong.copy(color = titleColor), maxLines = 2, overflow = TextOverflow.Ellipsis)
            if (subtitle != null) {
                Text(subtitle, style = Aiimin.type.caption, maxLines = maxSubtitleLines, overflow = TextOverflow.Ellipsis)
            }
        }
        if (trailing != null) {
            Spacer(Modifier.width(8.dp))
            trailing()
        }
    }
}

@Composable
fun Hairline(modifier: Modifier = Modifier) {
    Box(modifier.fillMaxWidth().height(1.dp).background(Aiimin.colors.border))
}

@Composable
fun Chevron() {
    Icon(AppIcons.CaretRight, null, tint = Aiimin.colors.textFaint, modifier = Modifier.size(16.dp))
}

/** Initials on a muted hue; stable per person. */
@Composable
fun Avatar(name: String, hueIndex: Int, modifier: Modifier = Modifier, size: Dp = 40.dp) {
    val initials = name.trim().split(Regex("\\s+")).filter { it.isNotEmpty() }.take(2).joinToString("") { it.first().uppercase() }.ifEmpty { "?" }
    Box(
        modifier.size(size).clip(CircleShape).background(PersonHues[Math.floorMod(hueIndex, PersonHues.size)]),
        contentAlignment = Alignment.Center,
    ) {
        Text(initials, style = Aiimin.type.label.copy(color = Color(0xFF231A12), fontWeight = FontWeight.SemiBold, fontSize = (size.value * 0.36f).sp))
    }
}

/** Small status pill: "Calibrating", "Tier A", "Expires in 7 d". */
@Composable
fun Tag(text: String, color: Color = Aiimin.colors.textMuted, background: Color = Aiimin.colors.raised, icon: ImageVector? = null) {
    Row(
        Modifier.clip(Shapes.tag).background(background).padding(horizontal = 7.dp, vertical = 3.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        if (icon != null) Icon(icon, null, tint = color, modifier = Modifier.size(12.dp))
        Text(text, style = Aiimin.type.caption.copy(color = color, fontWeight = FontWeight.Medium, fontSize = 11.sp), maxLines = 1)
    }
}

/**
 * Evidence dot (plan §4): filled = observed, ringed = corroborated,
 * hollow = claimed, faint = doubtful. Shape, not just colour, carries meaning.
 */
@Composable
fun EvidenceDot(tier: Char, modifier: Modifier = Modifier) {
    val c = Aiimin.colors
    val d = Modifier.size(8.dp).clip(CircleShape)
    Box(
        when (tier) {
            'A' -> modifier.then(d).background(c.done)
            'B' -> modifier.then(d).border(2.dp, c.done, CircleShape)
            'C' -> modifier.then(d).border(1.5.dp, c.textFaint, CircleShape)
            else -> modifier.then(d).background(c.textFaint.copy(alpha = 0.35f))
        },
    )
}

/** Screen body padding helper. */
@Composable
fun Gutter(content: @Composable ColumnScope.() -> Unit) {
    Column(Modifier.fillMaxWidth().padding(horizontal = Aiimin.space.gutter), content = content)
}
