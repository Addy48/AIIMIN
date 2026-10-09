package aiimin.designsystem.component

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
    val (bg, fg, border) = when (kind) {
        ButtonKind.PRIMARY -> Triple(c.accent, c.onAccent, null)
        ButtonKind.SECONDARY -> Triple(c.raised, c.text, c.border)
        ButtonKind.GHOST -> Triple(Color.Transparent, c.text, null)
        ButtonKind.DANGER -> Triple(c.dangerSoft, c.danger, null)
    }
    Row(
        modifier
            .alphaIf(!enabled)
            .pressable(if (enabled) onClick else null)
            .clip(Shapes.control)
            .background(bg)
            .then(if (border != null) Modifier.border(1.dp, border, Shapes.control) else Modifier)
            .heightIn(min = if (compact) 36.dp else 48.dp)
            .padding(horizontal = if (compact) 14.dp else 20.dp),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        if (icon != null) {
            Icon(icon, null, tint = fg, modifier = Modifier.size(if (compact) 16.dp else 18.dp))
            Spacer(Modifier.width(8.dp))
        }
        Text(text, style = Aiimin.type.bodyStrong.copy(color = fg), maxLines = 1)
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
            .clip(CircleShape)
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
 * The completion circle. Fills with a spring and a tick, with a light haptic;
 * unchecking is quiet. 28 dp visual inside a 44 dp target.
 */
@Composable
fun CheckCircle(
    checked: Boolean,
    onToggle: () -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    color: Color = Aiimin.colors.done,
) {
    val c = Aiimin.colors
    val haptics = LocalHapticFeedback.current
    val fill by animateColorAsState(if (checked) color else Color.Transparent, tween(Motion.FAST), label = "fill")
    val tick by animateFloatAsState(if (checked) 1f else 0f, spring(dampingRatio = 0.45f, stiffness = Spring.StiffnessMediumLow), label = "tick")
    Box(
        modifier
            .size(44.dp)
            .clip(CircleShape)
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
                .size(26.dp)
                .clip(CircleShape)
                .background(fill)
                .border(1.75.dp, if (checked) color else c.borderStrong, CircleShape),
            contentAlignment = Alignment.Center,
        ) {
            if (tick > 0.01f) {
                Icon(AppIcons.Check, null, tint = Color.White, modifier = Modifier.size(14.dp).scale(tick))
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
    val bg by animateColorAsState(if (selected) c.accentSoft else c.raised, tween(Motion.FAST), label = "pillBg")
    val fg = if (selected) c.accent else c.textMuted
    Row(
        modifier
            .clip(Shapes.control)
            .background(bg)
            .border(1.dp, if (selected) c.accent.copy(alpha = 0.5f) else c.border, Shapes.control)
            .clickable(role = Role.Tab, onClick = onClick)
            .heightIn(min = 34.dp)
            .padding(horizontal = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        if (icon != null) Icon(icon, null, tint = fg, modifier = Modifier.size(15.dp))
        Text(text, style = Aiimin.type.label.copy(color = fg), maxLines = 1)
        if (count != null) Text(count.toString(), style = Aiimin.type.caption.copy(color = fg.copy(alpha = 0.7f), fontFeatureSettings = "tnum"))
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
    BoxWithConstraints(
        modifier.fillMaxWidth().height(38.dp).clip(Shapes.control).background(c.raised).border(1.dp, c.border, Shapes.control).padding(3.dp),
    ) {
        val w = maxWidth / options.size
        val x by animateDpAsState(w * selected, spring(dampingRatio = 0.85f, stiffness = Spring.StiffnessMediumLow), label = "thumb")
        Box(Modifier.offset(x = x).width(w).fillMaxHeight().clip(Shapes.control).background(c.overlay))
        Row(Modifier.fillMaxWidth()) {
            options.forEachIndexed { i, o ->
                Box(
                    Modifier.width(w).fillMaxHeight().clip(Shapes.control).clickable(role = Role.Tab) { onSelect(i) },
                    contentAlignment = Alignment.Center,
                ) {
                    Text(o, style = Aiimin.type.label.copy(color = if (i == selected) c.text else c.textMuted), maxLines = 1, textAlign = TextAlign.Center)
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
                .clip(Shapes.row)
                .background(c.raised)
                .border(1.dp, c.border, Shapes.row)
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
                    keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
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
        subtitle = subtitle,
        maxSubtitleLines = 3,
        leading = icon?.let { { IconTile(it) } },
        onClick = { onChange(!checked) },
        trailing = {
            val x by animateDpAsState(if (checked) 18.dp else 0.dp, tween(Motion.FAST), label = "knob")
            val track by animateColorAsState(if (checked) c.accent else c.overlay, tween(Motion.FAST), label = "track")
            Box(
                Modifier.width(44.dp).height(26.dp).clip(Shapes.pill).background(track).padding(3.dp)
                    .semantics { stateDescription = if (checked) "On" else "Off" },
            ) {
                Box(Modifier.offset(x = x).size(20.dp).clip(CircleShape).background(Color.White))
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

