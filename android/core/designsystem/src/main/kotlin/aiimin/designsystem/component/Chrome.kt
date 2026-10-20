package aiimin.designsystem.component

import aiimin.designsystem.theme.LocalReduceMotion
import androidx.compose.animation.core.StartOffset
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.interaction.collectIsPressedAsState
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.theme.Aiimin
import aiimin.designsystem.theme.Motion
import aiimin.designsystem.theme.Shapes
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay

// ------------------------------------------------------------------ top bars

/** Pushed-screen bar (handoff §5.2): 44 dp back target, left-aligned pushTitle, up to two actions. */
@Composable
fun TopBar(title: String, onBack: (() -> Unit)?, modifier: Modifier = Modifier, actions: @Composable RowScope.() -> Unit = {}) {
    Row(
        modifier.fillMaxWidth().statusBarsPadding().height(56.dp).padding(start = 4.dp, end = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        if (onBack != null) AppIconButton(AppIcons.ArrowLeft, "Back", onBack) else Spacer(Modifier.width(16.dp))
        Text(
            title,
            style = Aiimin.type.headline,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
            modifier = Modifier.weight(1f).padding(start = 4.dp).semantics { heading() },
        )
        Row(verticalAlignment = Alignment.CenterVertically, content = actions)
    }
}

/**
 * Root-screen bar (handoff §5.1): screenTitle on the left (Today shows the date),
 * then sync, search, assistant, bell. [overline] is the one-line status under the title.
 */
@Composable
fun LargeHeader(title: String, modifier: Modifier = Modifier, overline: String? = null, actions: @Composable RowScope.() -> Unit = {}) {
    Row(
        modifier.fillMaxWidth().statusBarsPadding().heightIn(min = 56.dp).padding(start = Aiimin.space.gutter, end = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(Modifier.weight(1f).padding(vertical = 6.dp)) {
            Text(title, style = Aiimin.type.title, modifier = Modifier.semantics { heading() })
            if (overline != null) Text(overline, style = Aiimin.type.caption)
        }
        Row(verticalAlignment = Alignment.CenterVertically, content = actions)
    }
}

// ------------------------------------------------------------------ dock

@Stable
data class DockItem(
    val label: String,
    val icon: ImageVector,
    val selected: Boolean,
    val onClick: () -> Unit,
    val badge: Boolean = false,
    /** Fill variant used only when selected (handoff: fill only for the selected dock tab). */
    val iconFill: ImageVector = icon,
    /** Small count on the icon (Money review inbox). Takes precedence over [badge]. */
    val count: Int = 0,
)

/**
 * Today · Money · ＋ · Vault · Me (handoff §5.3). 80 dp including the gesture inset,
 * top hairline. Selected tab = Phosphor fill icon + accentText label.
 * The centre button is a 56 dp square (radius 12), ink fill, white plus.
 */
@Composable
fun Dock(items: List<DockItem>, onPlus: () -> Unit, onPlusLong: () -> Unit, modifier: Modifier = Modifier, plusOpen: Boolean = false) {
    val c = Aiimin.colors
    val onInk = c.onInk
    Column(modifier.fillMaxWidth().background(c.base)) {
        Hairline()
        Row(
            Modifier.fillMaxWidth().navigationBarsPadding().height(72.dp).padding(horizontal = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            val half = items.size / 2
            items.take(half).forEach { DockButton(it) }
            Box(Modifier.weight(1f), contentAlignment = Alignment.Center) {
                val source = remember { androidx.compose.foundation.interaction.MutableInteractionSource() }
                val pressed by source.collectIsPressedAsState()
                val reduce = LocalReduceMotion.current
                val sc by androidx.compose.animation.core.animateFloatAsState(if (pressed && !reduce) Motion.PRESS_SCALE else 1f, Motion.tap(), label = "plus")
                // Part 26.5: the "+" turns 45 degrees while its sheet is open, on the sheet's own token.
                val turn by androidx.compose.animation.core.animateFloatAsState(
                    if (plusOpen) Motion.PLUS_OPEN_DEGREES else 0f,
                    Motion.move(reduce, if (plusOpen) Motion.emphasised() else Motion.exit()),
                    label = "plusTurn",
                )
                Box(
                    Modifier
                        .size(56.dp)
                        .graphicsLayer { scaleX = sc; scaleY = sc }
                        .clip(RoundedCornerShape(12.dp))
                        .background(c.text)
                        .plusClickable(source, onClick = onPlus, onLongClick = onPlusLong, label = "Capture. Long-press to speak")
                        .semantics { contentDescription = "Capture" },
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(AppIcons.Plus, null, tint = onInk, modifier = Modifier.size(26.dp).graphicsLayer { rotationZ = turn })
                }
            }
            items.drop(half).forEach { DockButton(it) }
        }
    }
}

@Composable
private fun RowScope.DockButton(item: DockItem) {
    val c = Aiimin.colors
    val color = if (item.selected) c.accentText else c.textMuted
    Column(
        Modifier
            .weight(1f)
            .clip(Shapes.small)
            .clickable(role = Role.Tab, onClick = item.onClick)
            .semantics { selected = item.selected }
            .padding(vertical = 8.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Box {
            // Part 26.5: the selected icon fills over 160 ms (outline and fill cross-fade; opacity only).
            val fill by androidx.compose.animation.core.animateFloatAsState(
                if (item.selected) 1f else 0f, Motion.fade(LocalReduceMotion.current, Motion.quick()), label = "tabFill",
            )
            Icon(item.icon, null, tint = color, modifier = Modifier.size(25.dp).graphicsLayer { alpha = 1f - fill })
            Icon(item.iconFill, null, tint = color, modifier = Modifier.size(25.dp).graphicsLayer { alpha = fill })
            if (item.count > 0) {
                Box(
                    Modifier.align(Alignment.TopEnd).offset(x = 9.dp, y = (-5).dp).heightIn(min = 16.dp).widthIn(min = 16.dp)
                        .clip(RoundedCornerShape(4.dp)).background(c.text).padding(horizontal = 4.dp),
                    contentAlignment = Alignment.Center,
                ) { Text(if (item.count > 9) "9+" else item.count.toString(), style = Aiimin.type.caption.copy(color = c.onInk, fontSize = 10.sp, fontWeight = FontWeight.SemiBold)) }
            } else if (item.badge) {
                Box(Modifier.align(Alignment.TopEnd).offset(x = 6.dp, y = (-3).dp).size(7.dp).clip(CircleShape).background(c.accent))
            }
        }
        Spacer(Modifier.height(3.dp))
        Text(item.label, style = Aiimin.type.caption.copy(color = color, fontWeight = if (item.selected) FontWeight.SemiBold else FontWeight.Medium, fontSize = 11.5.sp))
    }
}

@OptIn(androidx.compose.foundation.ExperimentalFoundationApi::class)
private fun Modifier.plusClickable(source: androidx.compose.foundation.interaction.MutableInteractionSource, onClick: () -> Unit, onLongClick: () -> Unit, label: String): Modifier =
    this.then(
        Modifier.combinedClickable(
            interactionSource = source,
            indication = null,
            onClick = onClick,
            onLongClick = onLongClick,
            onClickLabel = label,
            role = Role.Button,
        ),
    )

// ------------------------------------------------------------------ sheets

/**
 * App bottom sheet: L3 surface, drag handle, title row, keyboard-aware.
 * Sheets are for creating and editing; viewing happens on screens.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AppSheet(
    onDismiss: () -> Unit,
    title: String? = null,
    subtitle: String? = null,
    skipPartial: Boolean = true,
    content: @Composable ColumnScope.() -> Unit,
) {
    val c = Aiimin.colors
    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = skipPartial),
        containerColor = c.sheet,
        scrimColor = c.scrim,
        shape = Shapes.sheet,
        contentWindowInsets = { WindowInsets(0) },
        dragHandle = {
            Box(Modifier.padding(top = 10.dp, bottom = 8.dp).size(width = 38.dp, height = 4.dp).clip(RoundedCornerShape(2.dp)).background(c.borderStrong))
        },
    ) {
        Column(Modifier.fillMaxWidth().navigationBarsPadding().imePadding().padding(horizontal = 20.dp).padding(bottom = 16.dp)) {
            if (title != null) {
                Text(title, style = Aiimin.type.cardTitle, modifier = Modifier.padding(top = 4.dp).semantics { heading() })
            }
            if (subtitle != null) Text(subtitle, style = Aiimin.type.caption, modifier = Modifier.padding(top = 4.dp))
            if (title != null || subtitle != null) Spacer(Modifier.height(16.dp))
            content()
        }
    }
}

// ------------------------------------------------------------------ toasts with undo

@Stable
class Toaster {
    data class Toast(val id: Long, val text: String, val actionLabel: String?, val action: (() -> Unit)?, val durationMs: Long)

    var current by mutableStateOf<Toast?>(null)
        private set
    private var seq = 0L

    fun show(text: String, actionLabel: String? = null, durationMs: Long = 3200, action: (() -> Unit)? = null) {
        current = Toast(++seq, text, actionLabel, action, if (action != null) maxOf(durationMs, 6000) else durationMs)
    }

    fun undo(text: String, onUndo: () -> Unit) = show(text, "Undo", 6000, onUndo)

    fun dismiss(id: Long) {
        if (current?.id == id) current = null
    }
}

/** Bottom toast with a draining progress line for the undo window. */
@Composable
fun ToastHost(toaster: Toaster, modifier: Modifier = Modifier) {
    val c = Aiimin.colors
    val t = toaster.current
    val reduce = LocalReduceMotion.current
    AnimatedVisibility(
        visible = t != null,
        enter = if (reduce) fadeIn(Motion.reducedFade()) else slideInVertically(Motion.standard()) { it / 2 } + fadeIn(Motion.quick()),
        exit = if (reduce) fadeOut(Motion.reducedFade()) else slideOutVertically(Motion.exit()) { it / 2 } + fadeOut(Motion.exit()),
        modifier = modifier,
    ) {
        val toast = t ?: return@AnimatedVisibility
        val progress = remember(toast.id) { Animatable(1f) }
        LaunchedEffect(toast.id) {
            progress.animateTo(0f, tween(toast.durationMs.toInt(), easing = LinearEasing))
            toaster.dismiss(toast.id)
        }
        Column(
            Modifier
                .padding(horizontal = 16.dp, vertical = 8.dp)
                .fillMaxWidth()
                .clip(Shapes.control)
                .background(c.text)
                .semantics { contentDescription = toast.text },
        ) {
            Row(Modifier.padding(start = 16.dp, end = 6.dp).heightIn(min = 52.dp), verticalAlignment = Alignment.CenterVertically) {
                Text(toast.text, style = Aiimin.type.body.copy(color = c.onInk), modifier = Modifier.weight(1f), maxLines = 2)
                if (toast.actionLabel != null && toast.action != null) {
                    Text(
                        toast.actionLabel,
                        style = Aiimin.type.bodyStrong.copy(color = c.onInkAccent),
                        modifier = Modifier.clip(Shapes.small).clickable {
                            toast.action.invoke()
                            toaster.dismiss(toast.id)
                        }.padding(horizontal = 12.dp, vertical = 10.dp),
                    )
                }
            }
            if (toast.action != null) {
                // The undo window drains as a scale, not a width change (Part 26.5: transform and opacity only).
                Box(
                    Modifier.fillMaxWidth().height(2.dp)
                        .graphicsLayer { scaleX = progress.value; transformOrigin = androidx.compose.ui.graphics.TransformOrigin(0f, 0.5f) }
                        .background(c.onInkAccent),
                )
            }
        }
    }
}

// ------------------------------------------------------------------ empty / loading

@Composable
fun EmptyState(icon: ImageVector, title: String, body: String, modifier: Modifier = Modifier, action: String? = null, onAction: (() -> Unit)? = null) {
    val c = Aiimin.colors
    Column(modifier.fillMaxWidth().padding(vertical = 28.dp, horizontal = 24.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        Icon(icon, null, tint = c.textFaint, modifier = Modifier.size(32.dp))
        Spacer(Modifier.height(14.dp))
        Text(title, style = Aiimin.type.cardTitle.copy(fontSize = 20.sp), textAlign = TextAlign.Center)
        Spacer(Modifier.height(6.dp))
        Text(body, style = Aiimin.type.caption.copy(textAlign = TextAlign.Center, fontSize = 14.sp, lineHeight = 20.sp), modifier = Modifier.padding(horizontal = 8.dp))
        if (action != null && onAction != null) {
            Spacer(Modifier.height(18.dp))
            AppButton(action, onAction, kind = ButtonKind.SECONDARY, compact = true)
        }
    }
}

/**
 * Content-shaped placeholder block. Invisible for the first 300 ms, then fades in once: most loads finish
 * sooner, and a grey flash before real content reads as slower than a blank moment. No shimmer loop (Part 26.5).
 */
@Composable
fun Skeleton(modifier: Modifier) {
    val c = Aiimin.colors
    val shown = remember { Animatable(0f) }
    val reduce = LocalReduceMotion.current
    LaunchedEffect(Unit) {
        delay(300)
        shown.animateTo(1f, Motion.fade(reduce, Motion.standard()))
    }
    Box(modifier.graphicsLayer { alpha = shown.value }.clip(Shapes.small).background(c.raised))
}

/**
 * Three dots that breathe slowly while Raahi works (the stand-in for Raahi's thinking loop, Part 20.3,
 * on the ambient token). Reduce motion: still dots.
 */
@Composable
fun ThinkingDots() {
    val c = Aiimin.colors
    val reduce = LocalReduceMotion.current
    val t = rememberInfiniteTransition(label = "dots")
    Row(horizontalArrangement = Arrangement.spacedBy(5.dp), modifier = Modifier.padding(8.dp).semantics { contentDescription = "Thinking" }) {
        repeat(3) { i ->
            val a by t.animateFloat(0.3f, 1f, infiniteRepeatable(Motion.ambient(), RepeatMode.Reverse, StartOffset(i * Motion.STAGGER * 10)), label = "d$i")
            Box(Modifier.size(6.dp).graphicsLayer { alpha = if (reduce) 0.7f else a }.clip(CircleShape).background(c.textMuted))
        }
    }
}

/** Fires [block] once after [ms]; used for staged reveals on first visit only. */
@Composable
fun After(ms: Long, block: () -> Unit) {
    LaunchedEffect(Unit) {
        delay(ms)
        block()
    }
}
