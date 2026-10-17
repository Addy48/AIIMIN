package aiimin.designsystem.component

import androidx.compose.foundation.selection.toggleable

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.unit.sp
import androidx.compose.ui.text.font.FontWeight
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.theme.Aiimin
import aiimin.designsystem.theme.Motion
import aiimin.designsystem.theme.Shapes
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

// ------------------------------------------------------------------ buttons

enum class ButtonKind { PRIMARY, SECONDARY, GHOST, DANGER }

@Composable
fun AppButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    kind: ButtonKind = ButtonKind.PRIMARY,
    icon: ImageVector? = null,
    enabled: Boolean = true,
    compact: Boolean = false,
) {
    val c = Aiimin.colors
    // Handoff §5.7: primary = ink fill + white text; secondary = transparent with a 1dp outline. No gradients, no pills.
    val onInk = if (c.isDark) c.base else Color.White
    val (bg, fg, border) = when (kind) {
        ButtonKind.PRIMARY -> Triple(c.text, onInk, null)
        ButtonKind.SECONDARY -> Triple(Color.Transparent, c.text, c.borderStrong)
        ButtonKind.GHOST -> Triple(Color.Transparent, c.accentText, null)
        ButtonKind.DANGER -> Triple(Color.Transparent, c.warn, c.warn)
    }
    Row(
        modifier
            .alphaIf(!enabled)
            .pressable(if (enabled) onClick else null)
            .clip(Shapes.control)
            .background(bg)
            .then(if (border != null) Modifier.border(1.5.dp, border, Shapes.control) else Modifier)
            .heightIn(min = if (compact) 40.dp else 52.dp)
            .padding(horizontal = if (compact) 14.dp else 20.dp),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        if (icon != null) {
            Icon(icon, null, tint = fg, modifier = Modifier.size(if (compact) 16.dp else 18.dp))
            Spacer(Modifier.width(8.dp))
        }
        // Labels shrink a step at large text sizes instead of being cut ("Plan tomorrow" → "Plan").
        val size = if (compact) 14.sp else 15.5.sp
        androidx.compose.foundation.text.BasicText(
            text,
            style = Aiimin.type.bodyStrong.copy(color = fg, fontSize = size),
            maxLines = 1,
            autoSize = androidx.compose.foundation.text.TextAutoSize.StepBased(minFontSize = 11.sp, maxFontSize = size, stepSize = 0.5.sp),
            modifier = Modifier.weight(1f, fill = false),
        )
    }
}

private fun Modifier.alphaIf(dim: Boolean) = if (dim) this.alpha(0.4f) else this

/** 44 dp touch target, icon only, always labelled for TalkBack. */
@Composable
fun AppIconButton(
    icon: ImageVector,
    contentDescription: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    tint: Color = Aiimin.colors.text,
    background: Color = Color.Transparent,
    size: Dp = 44.dp,
) {
    Box(
        modifier
            .size(size)
            .clip(Shapes.control)
            .background(background)
            .clickable(role = Role.Button, onClickLabel = contentDescription, onClick = onClick)
            .semantics { this.contentDescription = contentDescription },
        contentAlignment = Alignment.Center,
    ) {
        Icon(icon, null, tint = tint, modifier = Modifier.size(22.dp))
    }
}

// ------------------------------------------------------------------ check

/**
 * The completion checkbox (handoff §5.10): 22 dp, radius 6. Off = 1.5 dp ring,
 * on = ink fill with a white check that draws in over 150 ms. 44 dp touch target.
 */
@Composable
fun CheckCircle(
    checked: Boolean,
    onToggle: () -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    color: Color = Aiimin.colors.text,
    proof: Boolean = false,
) {
    val c = Aiimin.colors
    val haptics = LocalHapticFeedback.current
    val fill by animateColorAsState(if (checked) color else Color.Transparent, tween(Motion.FAST), label = "fill")
    val tick by animateFloatAsState(if (checked) 1f else 0f, tween(150, easing = Motion.enter), label = "tick")
    val shape = RoundedCornerShape(6.dp)
    Box(
        modifier
            .size(44.dp)
            .clip(Shapes.small)
            .clickable(role = Role.Checkbox, onClickLabel = label) {
                if (!checked) haptics.performHapticFeedback(HapticFeedbackType.ToggleOn)
                onToggle()
            }
            .semantics {
                contentDescription = label
                stateDescription = if (checked) "Done" else "Not done"
            },
        contentAlignment = Alignment.Center,
    ) {
        Box(
            Modifier
                .size(22.dp)
                .then(if (proof && checked) Modifier.border(1.5.dp, color, RoundedCornerShape(8.dp)).padding(2.5.dp) else Modifier)
                .clip(shape)
                .background(fill)
                .then(if (checked) Modifier else Modifier.border(1.5.dp, c.textFaint, shape)),
            contentAlignment = Alignment.Center,
        ) {
            if (tick > 0.01f) {
                Icon(AppIcons.Check, null, tint = if (c.isDark) c.base else Color.White, modifier = Modifier.size(15.dp).scale(0.6f + 0.4f * tick).alpha(tick))
            }
        }
    }
}

/** Title that strikes through when done (Things-style). */
@Composable
fun DoneText(text: String, done: Boolean, style: TextStyle = Aiimin.type.bodyStrong, modifier: Modifier = Modifier, maxLines: Int = 2) {
    val color by animateColorAsState(if (done) Aiimin.colors.textFaint else style.color, tween(Motion.BASE), label = "doneText")
    Text(
        text,
        style = style.copy(color = color, textDecoration = if (done) TextDecoration.LineThrough else null),
        maxLines = maxLines,
        modifier = modifier,
    )
}

// ------------------------------------------------------------------ chips & segments

@Composable
fun Pill(
    text: String,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    icon: ImageVector? = null,
    count: Int? = null,
) {
    val c = Aiimin.colors
    val onInk = if (c.isDark) c.base else Color.White
    val bg by animateColorAsState(if (selected) c.text else Color.Transparent, tween(Motion.FAST), label = "pillBg")
    val fg by animateColorAsState(if (selected) onInk else c.text, tween(Motion.FAST), label = "pillFg")
    val chip = RoundedCornerShape(6.dp)
    Row(
        modifier
            .pressable(onClick, role = Role.Tab)
            .clip(chip)
            .background(bg)
            .then(if (selected) Modifier else Modifier.border(1.dp, c.borderStrong, chip))
            .heightIn(min = 36.dp)
            .padding(horizontal = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        if (icon != null) Icon(icon, null, tint = fg, modifier = Modifier.size(16.dp))
        Text(text, style = Aiimin.type.label.copy(color = fg, fontSize = 14.sp), maxLines = 1)
        if (count != null) Text(count.toString(), style = Aiimin.type.caption.copy(color = fg.copy(alpha = 0.7f)))
    }
}

@Composable
fun PillRow(content: @Composable () -> Unit) {
    Row(
        Modifier.fillMaxWidth().horizontalScroll(rememberScrollState()).padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
    ) { content() }
}

/**
 * Segmented control with a sliding thumb. Equal widths, so it never scrolls
 * horizontally (the Day Flow fix).
 */
@Composable
fun Segmented(options: List<String>, selected: Int, onSelect: (Int) -> Unit, modifier: Modifier = Modifier) {
    val c = Aiimin.colors
    val inner = RoundedCornerShape(8.dp)
    BoxWithConstraints(
        modifier.fillMaxWidth().height(40.dp).clip(Shapes.control).background(c.segmentTrack).padding(3.dp),
    ) {
        val w = maxWidth / options.size
        val x by animateDpAsState(w * selected, spring(dampingRatio = 0.85f, stiffness = 400f), label = "thumb")
        Box(
            Modifier.offset(x = x).width(w).fillMaxHeight()
                .shadow(1.dp, inner, ambientColor = Color(0x33000000), spotColor = Color(0x33000000))
                .clip(inner).background(if (c.isDark) c.overlay else Color.White),
        )
        Row(Modifier.fillMaxWidth()) {
            options.forEachIndexed { i, o ->
                Box(
                    Modifier.width(w).fillMaxHeight().clip(inner).clickable(role = Role.Tab) { onSelect(i) },
                    contentAlignment = Alignment.Center,
                ) {
                    Text(o, style = Aiimin.type.label.copy(color = c.text, fontWeight = FontWeight.SemiBold), maxLines = 1, textAlign = TextAlign.Center)
                }
            }
        }
    }
}

// ------------------------------------------------------------------ text input

@Composable
fun AppTextField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String = "",
    label: String? = null,
    singleLine: Boolean = true,
    minLines: Int = 1,
    keyboardType: KeyboardType = KeyboardType.Text,
    capitalization: androidx.compose.ui.text.input.KeyboardCapitalization = androidx.compose.ui.text.input.KeyboardCapitalization.None,
    leading: ImageVector? = null,
    textStyle: TextStyle = Aiimin.type.body,
    onDone: (() -> Unit)? = null,
    trailing: (@Composable () -> Unit)? = null,
) {
    val c = Aiimin.colors
    androidx.compose.foundation.layout.Column(modifier) {
        if (label != null) {
            Text(label, style = Aiimin.type.caption, modifier = Modifier.padding(start = 4.dp, bottom = 6.dp))
        }
        Row(
            Modifier
                .fillMaxWidth()
                .clip(Shapes.control)
                .background(c.surface)
                .border(1.dp, c.borderStrong, Shapes.control)
                .heightIn(min = 48.dp)
                .padding(horizontal = 14.dp, vertical = 12.dp),
            verticalAlignment = if (singleLine) Alignment.CenterVertically else Alignment.Top,
        ) {
            if (leading != null) {
                Icon(leading, null, tint = c.textFaint, modifier = Modifier.size(18.dp))
                Spacer(Modifier.width(10.dp))
            }
            Box(Modifier.weight(1f)) {
                if (value.isEmpty()) Text(placeholder, style = textStyle.copy(color = c.textFaint))
                BasicTextField(
                    value = value,
                    onValueChange = onValueChange,
                    singleLine = singleLine,
                    minLines = minLines,
                    textStyle = textStyle,
                    cursorBrush = SolidColor(c.accent),
                    keyboardOptions = KeyboardOptions(keyboardType = keyboardType, capitalization = capitalization),
                    keyboardActions = KeyboardActions(onDone = { onDone?.invoke() }, onSend = { onDone?.invoke() }),
                    modifier = Modifier.fillMaxWidth().semantics { contentDescription = label ?: placeholder },
                )
            }
            if (trailing != null) trailing()
        }
    }
}

/** Labelled on/off switch row. */
@Composable
fun SwitchRow(title: String, checked: Boolean, onChange: (Boolean) -> Unit, subtitle: String? = null, icon: ImageVector? = null) {
    val c = Aiimin.colors
    ListRow(
        title = title,
        // The whole row is a switch for TalkBack ("Haptics, switch, on"), not a plain button (audit A-046).
        modifier = Modifier.toggleable(value = checked, role = androidx.compose.ui.semantics.Role.Switch, onValueChange = onChange),
        subtitle = subtitle,
        maxSubtitleLines = 3,
        leading = icon?.let { { IconTile(it) } },
        onClick = null,
        trailing = {
            val x by animateDpAsState(if (checked) 16.dp else 0.dp, tween(Motion.FAST, easing = Motion.enter), label = "knob")
            val track by animateColorAsState(if (checked) c.text else c.borderStrong, tween(Motion.FAST), label = "track")
            Box(
                Modifier.width(46.dp).height(28.dp).clip(Shapes.control).background(track).padding(3.dp),
            ) {
                Box(Modifier.offset(x = x + 2.dp).size(22.dp).clip(RoundedCornerShape(6.dp)).background(if (checked && c.isDark) c.base else Color.White))
            }
        },
    )
}

/** − value + stepper for targets and amounts. */
@Composable
fun Stepper(value: String, onMinus: () -> Unit, onPlus: () -> Unit, modifier: Modifier = Modifier) {
    val c = Aiimin.colors
    Row(
        modifier.clip(Shapes.control).background(c.raised).border(1.dp, c.border, Shapes.control),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        AppIconButton(AppIcons.Minus, "Decrease", onMinus, size = 40.dp, tint = c.textMuted)
        Text(value, style = Aiimin.type.numberSmall, modifier = Modifier.padding(horizontal = 4.dp))
        AppIconButton(AppIcons.Plus, "Increase", onPlus, size = 40.dp, tint = c.textMuted)
    }
}

