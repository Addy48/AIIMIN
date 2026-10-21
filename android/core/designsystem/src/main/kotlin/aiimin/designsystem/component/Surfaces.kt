package aiimin.designsystem.component

import aiimin.designsystem.theme.LocalReduceMotion
import aiimin.designsystem.theme.Motion
import androidx.compose.foundation.shape.RoundedCornerShape
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
import androidx.compose.foundation.layout.fillMaxHeight
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
import androidx.compose.foundation.layout.widthIn
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
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.runtime.setValue
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween

/** Press feedback used by every tappable surface (Part 26.5 `tap`: 0.97 scale, 90 ms; none with reduce motion). */
@Composable
fun Modifier.pressable(onClick: (() -> Unit)?, role: Role = Role.Button, onClickLabel: String? = null): Modifier {
    if (onClick == null) return this
    val source = remember { MutableInteractionSource() }
    val pressed by source.collectIsPressedAsState()
    val s by animateFloatAsState(if (pressed && !LocalReduceMotion.current) Motion.PRESS_SCALE else 1f, Motion.tap(), label = "press")
    return this
        .scale(s)
        .clickable(interactionSource = source, indication = null, role = role, onClickLabel = onClickLabel, onClick = onClick)
}

/**
 * List entry (Part 26.5): the item fades in and rises 12 dp, 30 ms after the one before it (first 8 only),
 * once per screen visit; reduce motion shows it at once.
 */
@Composable
fun Modifier.enterStagger(index: Int): Modifier {
    val reduce = LocalReduceMotion.current
    var shown by androidx.compose.runtime.saveable.rememberSaveable { androidx.compose.runtime.mutableStateOf(reduce) }
    val p = remember { androidx.compose.animation.core.Animatable(if (shown) 1f else 0f) }
    androidx.compose.runtime.LaunchedEffect(Unit) {
        if (!shown) {
            p.animateTo(1f, Motion.standard(delay = Motion.staggerDelay(index)))
            shown = true
        }
    }
    return this.graphicsLayer {
        alpha = p.value
        translationY = (1f - p.value) * Motion.RISE_DP * density
    }
}

/**
 * A group of content. Per the spec (hairlines, not boxes) it sits flat on the paper with a hairline
 * under it; pass a [color] and [bordered] only for the few true surfaces (Now card, review card).
 */
@Composable
fun Panel(
    modifier: Modifier = Modifier,
    onClick: (() -> Unit)? = null,
    /** Default: 16 dp all round for a filled or bordered card (S8), 12 dp top and bottom for a flat group. */
    padding: PaddingValues? = null,
    color: Color = Color.Transparent,
    shape: Shape = Shapes.card,
    bordered: Boolean = false,
    /** The route this panel opens, so it grows into that screen (Part 26.5 container transform). */
    opens: Any? = null,
    content: @Composable ColumnScope.() -> Unit,
) {
    val c = Aiimin.colors
    val key = opens?.let(::sharedKeyOf)
    Column(
        modifier
            .fillMaxWidth()
            .sharedContainer(key)
            .pressable(onClick?.let { click -> { key?.let(SharedNav::arm); click() } })
            .clip(shape)
            .background(color)
            .then(if (bordered) Modifier.border(1.dp, c.border, shape) else Modifier)
            .padding(padding ?: if (bordered || color != Color.Transparent) PaddingValues(16.dp) else PaddingValues(vertical = 12.dp)),
        content = content,
    )
    if (!bordered && color == Color.Transparent) Hairline()
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
    val hasAction = action != null && onAction != null
    Row(
        // With an action the row is the action's 48 dp touch height, so the header grows ~4 dp, not ~30.
        modifier.fillMaxWidth().padding(top = if (hasAction) 0.dp else 18.dp, bottom = if (hasAction) 0.dp else 8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(title.uppercase(), style = Aiimin.type.eyebrow, modifier = Modifier.weight(1f))
        trailing?.invoke(this)
        if (hasAction) {
            Box(
                Modifier.heightIn(min = 48.dp).widthIn(min = 48.dp).clip(Shapes.small).clickable(onClick = onAction!!).padding(horizontal = 8.dp),
                contentAlignment = Alignment.Center,
            ) {
                Text(action!!, style = Aiimin.type.labelLarge.copy(color = Aiimin.colors.link, fontWeight = FontWeight.Medium))
            }
        }
    }
}

/** Icon inside a soft tinted square; the standard leading element of a row. */
@Composable
fun IconTile(icon: ImageVector, tint: Color = Aiimin.colors.textMuted, background: Color = Color.Transparent, size: Dp = 36.dp) {
    // A bare icon by default, flush with the margin like the text above it (S1); a tinted square only when it
    // carries status (warn, danger, done).
    val bare = background == Color.Transparent
    Box(Modifier.size(size).clip(Shapes.small).background(background), contentAlignment = if (bare) Alignment.CenterStart else Alignment.Center) {
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
    // Two lines by default: at 1.15× and 1.3× text one line cut targets and instructions mid-word (audit A-018).
    maxSubtitleLines: Int = 2,
    /** The route this row opens, so it grows into that screen (Part 26.5 container transform). */
    opens: Any? = null,
) {
    val key = opens?.let(::sharedKeyOf)
    Row(
        modifier
            .fillMaxWidth()
            .heightIn(min = 52.dp)
            .sharedContainer(key)
            .then(if (onClick != null) Modifier.clip(Shapes.row).clickable { key?.let(SharedNav::arm); onClick() } else Modifier)
            .padding(vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        // S1: one row shape everywhere. No side padding, so the leading icon starts and the trailing item ends
        // exactly on the 16 dp page margins; the leading slot is 40 dp so every title starts on one column.
        if (leading != null) {
            Box(Modifier.width(40.dp), contentAlignment = Alignment.CenterStart) { leading() }
            Spacer(Modifier.width(8.dp))
        }
        Column(Modifier.weight(1f)) {
            Text(title, style = Aiimin.type.bodyStrong.copy(color = titleColor), maxLines = 2, overflow = TextOverflow.Ellipsis)
            if (subtitle != null) {
                Text(subtitle, style = Aiimin.type.caption, maxLines = maxSubtitleLines, overflow = TextOverflow.Ellipsis)
            }
        }
        if (trailing != null) {
            Spacer(Modifier.width(8.dp))
            Box(contentAlignment = Alignment.CenterEnd) { trailing() }
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

/** Initials in an ink square (handoff §5.12: radius 8, no circles). Selected chips and avatars share the look. */
@Composable
fun Avatar(name: String, hueIndex: Int, modifier: Modifier = Modifier, size: Dp = 40.dp, outlined: Boolean = false) {
    val c = Aiimin.colors
    val initials = name.trim().split(Regex("\\s+")).filter { it.isNotEmpty() }.take(2).joinToString("") { it.first().uppercase() }.ifEmpty { "?" }
    val shape = RoundedCornerShape(if (size >= 56.dp) 12.dp else 8.dp)
    val onInk = c.onInk
    Box(
        modifier.size(size).clip(shape).then(if (outlined) Modifier.border(1.dp, c.borderStrong, shape) else Modifier.background(c.text)),
        contentAlignment = Alignment.Center,
    ) {
        Text(initials, style = Aiimin.type.headline.copy(color = if (outlined) c.text else onInk, fontSize = (size.value * 0.36f).sp))
    }
}

/** Small status tag: radius 5, sunk fill, text label always present. */
@Composable
fun Tag(text: String, color: Color = Aiimin.colors.textMuted, background: Color = Aiimin.colors.raised, icon: ImageVector? = null) {
    Row(
        Modifier.clip(Shapes.tag).background(background).padding(horizontal = 8.dp, vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        if (icon != null) Icon(icon, null, tint = color, modifier = Modifier.size(12.dp))
        Text(text, style = Aiimin.type.caption.copy(color = color, fontWeight = FontWeight.SemiBold), maxLines = 1)
    }
}

/**
 * Evidence mark (handoff §5.9, plan §2.7), 10 dp. A = solid ink dot (Measured);
 * B = dot with ring (Backed by proof); C = hollow ring (Your tap); D = dashed ring (Late or unsure).
 * Shape carries the meaning, so it works without colour.
 */
@Composable
fun EvidenceDot(tier: Char, modifier: Modifier = Modifier, size: Dp = 10.dp) {
    val c = Aiimin.colors
    val ink = c.text
    val bg = c.base
    val d = size
    androidx.compose.foundation.Canvas(modifier.size(d + 8.dp).semantics { contentDescription = when (tier) { 'A' -> "Measured"; 'B' -> "Backed by proof"; 'C' -> "Your tap"; else -> "Added later or unsure" } }) {
        val cx = this.size.width / 2f
        val cy = this.size.height / 2f
        val r = d.toPx() / 2f
        when (tier) {
            'A' -> drawCircle(ink, r, androidx.compose.ui.geometry.Offset(cx, cy))
            'B' -> {
                drawCircle(ink, r, androidx.compose.ui.geometry.Offset(cx, cy))
                drawCircle(ink, r + 3.5.dp.toPx(), androidx.compose.ui.geometry.Offset(cx, cy), style = androidx.compose.ui.graphics.drawscope.Stroke(1.5.dp.toPx()))
                drawCircle(bg, r + 1.5.dp.toPx(), androidx.compose.ui.geometry.Offset(cx, cy), style = androidx.compose.ui.graphics.drawscope.Stroke(2.dp.toPx()), alpha = 0f)
            }
            'C' -> drawCircle(ink, r - 0.75.dp.toPx(), androidx.compose.ui.geometry.Offset(cx, cy), style = androidx.compose.ui.graphics.drawscope.Stroke(1.5.dp.toPx()))
            else -> drawCircle(
                ink, r - 0.75.dp.toPx(), androidx.compose.ui.geometry.Offset(cx, cy),
                style = androidx.compose.ui.graphics.drawscope.Stroke(1.5.dp.toPx(), pathEffect = androidx.compose.ui.graphics.PathEffect.dashPathEffect(floatArrayOf(3.dp.toPx(), 2.5.dp.toPx()))),
            )
        }
    }
}

/** Screen body padding helper. */
@Composable
fun Gutter(content: @Composable ColumnScope.() -> Unit) {
    Column(Modifier.fillMaxWidth().padding(horizontal = Aiimin.space.gutter), content = content)
}


/**
 * Expiry vial (handoff §5.11): 12×44, radius 6, 1.5 dp ink border, filled from the bottom.
 * Under 10 % left = accent, otherwise vialCalm; no expiry = full ink.
 */
@Composable
fun ExpiryVial(percentLeft: Float?, modifier: Modifier = Modifier) {
    val c = Aiimin.colors
    val p = percentLeft?.coerceIn(0f, 1f)
    val fill = when { p == null -> c.text; p < 0.10f -> c.accent; else -> c.vialCalm }
    val shape = RoundedCornerShape(6.dp)
    Box(modifier.size(width = 12.dp, height = 44.dp).clip(shape).border(1.5.dp, c.text, shape), contentAlignment = Alignment.BottomCenter) {
        Box(Modifier.fillMaxWidth().fillMaxHeight(((p ?: 1f)).coerceAtLeast(0.06f)).background(fill))
    }
}

/** A document thumbnail: a white page with hairline and three grey text lines (40×52). */
@Composable
fun DocThumb(modifier: Modifier = Modifier, locked: Boolean = false, tint: Color? = null) {
    val c = Aiimin.colors
    val shape = RoundedCornerShape(5.dp)
    Box(modifier.size(width = 40.dp, height = 52.dp).clip(shape).background(tint ?: c.paper).border(1.dp, c.borderStrong, shape).padding(horizontal = 8.dp, vertical = 8.dp)) {
        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Box(Modifier.fillMaxWidth(0.55f).height(4.dp).background(c.text))
            Box(Modifier.fillMaxWidth().height(2.dp).background(c.borderStrong))
            Box(Modifier.fillMaxWidth(0.8f).height(2.dp).background(c.borderStrong))
            Box(Modifier.fillMaxWidth(0.6f).height(2.dp).background(c.borderStrong))
        }
        if (locked) Icon(AppIcons.LockSimple, null, tint = c.text, modifier = Modifier.align(Alignment.BottomEnd).size(12.dp))
    }
}
