package aiimin.designsystem.component

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

/** Pushed-screen bar: back, centred title, actions. */
@Composable
fun TopBar(title: String, onBack: (() -> Unit)?, modifier: Modifier = Modifier, actions: @Composable RowScope.() -> Unit = {}) {
    Row(
        modifier.fillMaxWidth().statusBarsPadding().height(56.dp).padding(horizontal = 6.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(Modifier.width(96.dp)) {
            if (onBack != null) AppIconButton(AppIcons.CaretLeft, "Back", onBack)
        }
        Text(
            title,
            style = Aiimin.type.headline,
            textAlign = TextAlign.Center,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
            modifier = Modifier.weight(1f).semantics { heading() },
        )
        Row(Modifier.width(96.dp), horizontalArrangement = Arrangement.End, verticalAlignment = Alignment.CenterVertically, content = actions)
    }
}

/** Root-screen header: big title, optional overline, actions on the right. */
@Composable
fun LargeHeader(title: String, modifier: Modifier = Modifier, overline: String? = null, actions: @Composable RowScope.() -> Unit = {}) {
    Row(
        modifier.fillMaxWidth().statusBarsPadding().padding(start = Aiimin.space.gutter, end = 8.dp, top = 12.dp, bottom = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(Modifier.weight(1f)) {
            if (overline != null) Text(overline, style = Aiimin.type.caption)
            Text(title, style = Aiimin.type.title, modifier = Modifier.semantics { heading() })
        }
        Row(verticalAlignment = Alignment.CenterVertically, content = actions)
    }
}

// ------------------------------------------------------------------ dock

@Stable
data class DockItem(val label: String, val icon: ImageVector, val selected: Boolean, val onClick: () -> Unit, val badge: Boolean = false)

/**
 * Today · Money · ＋ · Vault · Me. The centre button is the front door to
 * capture: tap for the capture sheet, long-press for voice.
 */
@Composable
fun Dock(items: List<DockItem>, onPlus: () -> Unit, onPlusLong: () -> Unit, modifier: Modifier = Modifier) {
    val c = Aiimin.colors
    Column(modifier.fillMaxWidth().background(c.base)) {
        Hairline()
        Row(
            Modifier.fillMaxWidth().navigationBarsPadding().height(64.dp).padding(horizontal = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            val half = items.size / 2
            items.take(half).forEach { DockButton(it) }
            Box(Modifier.weight(1f), contentAlignment = Alignment.Center) {
                Box(
                    Modifier
                        .size(48.dp)
                        .shadow(8.dp, CircleShape, ambientColor = c.accent, spotColor = c.accent)
                        .clip(CircleShape)
                        .background(c.accent)
                        .plusClickable(onClick = onPlus, onLongClick = onPlusLong, label = "Capture. Long-press to speak")
                        .semantics { contentDescription = "Capture" },
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(AppIcons.Plus, null, tint = c.onAccent, modifier = Modifier.size(22.dp))
                }
            }
            items.drop(half).forEach { DockButton(it) }
        }
    }
}

@Composable
private fun RowScope.DockButton(item: DockItem) {
    val c = Aiimin.colors
    val color = if (item.selected) c.text else c.textFaint
    Column(
        Modifier
            .weight(1f)
            .clip(Shapes.row)
            .clickable(role = Role.Tab, onClick = item.onClick)
            .semantics { selected = item.selected }
            .padding(vertical = 6.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Box {
            Icon(item.icon, null, tint = color, modifier = Modifier.size(24.dp))
            if (item.badge) Box(Modifier.align(Alignment.TopEnd).size(7.dp).clip(CircleShape).background(c.accent))
        }
        Spacer(Modifier.height(3.dp))
        Text(item.label, style = Aiimin.type.caption.copy(color = color))
        Box(Modifier.padding(top = 3.dp).size(width = 14.dp, height = 2.dp).clip(Shapes.pill).background(if (item.selected) c.accent else Color.Transparent))
    }
}

@OptIn(androidx.compose.foundation.ExperimentalFoundationApi::class)
private fun Modifier.plusClickable(onClick: () -> Unit, onLongClick: () -> Unit, label: String): Modifier =
    this.then(
        Modifier.combinedClickable(
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
            Box(Modifier.padding(top = 10.dp, bottom = 6.dp).size(width = 36.dp, height = 4.dp).clip(Shapes.pill).background(c.borderStrong))
        },
    ) {
        Column(Modifier.fillMaxWidth().navigationBarsPadding().imePadding().padding(horizontal = 20.dp).padding(bottom = 16.dp)) {
            if (title != null) {
                Text(title, style = Aiimin.type.headline.copy(fontSize = 20.sp), modifier = Modifier.padding(top = 4.dp).semantics { heading() })
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
    AnimatedVisibility(
        visible = t != null,
        enter = slideInVertically(tween(Motion.BASE, easing = Motion.enter)) { it / 2 } + fadeIn(tween(Motion.FAST)),
        exit = slideOutVertically(tween(Motion.FAST, easing = Motion.exit)) { it / 2 } + fadeOut(tween(Motion.FAST)),
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
                .shadow(12.dp, Shapes.row)
                .clip(Shapes.row)
                .background(if (c.isDark) c.overlay else Color(0xFF1F1F22))
                .semantics { contentDescription = toast.text },
        ) {
            Row(Modifier.padding(start = 16.dp, end = 6.dp).heightIn(min = 48.dp), verticalAlignment = Alignment.CenterVertically) {
                Text(toast.text, style = Aiimin.type.body.copy(color = Color(0xFFF2F2F3)), modifier = Modifier.weight(1f), maxLines = 2)
                if (toast.actionLabel != null && toast.action != null) {
                    Text(
                        toast.actionLabel,
                        style = Aiimin.type.bodyStrong.copy(color = c.accent),
                        modifier = Modifier.clip(Shapes.small).clickable {
                            toast.action.invoke()
                            toaster.dismiss(toast.id)
                        }.padding(horizontal = 12.dp, vertical = 10.dp),
                    )
                }
            }
            if (toast.action != null) {
                Box(Modifier.fillMaxWidth(progress.value).height(2.dp).background(c.accent))
            }
        }
    }
}

// ------------------------------------------------------------------ empty / loading

@Composable
fun EmptyState(icon: ImageVector, title: String, body: String, modifier: Modifier = Modifier, action: String? = null, onAction: (() -> Unit)? = null) {
    val c = Aiimin.colors
    Column(modifier.fillMaxWidth().padding(vertical = 28.dp, horizontal = 24.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        Box(Modifier.size(52.dp).clip(CircleShape).background(c.raised).border(1.dp, c.border, CircleShape), contentAlignment = Alignment.Center) {
            Icon(icon, null, tint = c.textMuted, modifier = Modifier.size(24.dp))
        }
        Spacer(Modifier.height(14.dp))
        Text(title, style = Aiimin.type.headline, textAlign = TextAlign.Center)
        Spacer(Modifier.height(4.dp))
        Text(body, style = Aiimin.type.caption.copy(textAlign = TextAlign.Center), modifier = Modifier.padding(horizontal = 8.dp))
        if (action != null && onAction != null) {
            Spacer(Modifier.height(16.dp))
            AppButton(action, onAction, kind = ButtonKind.SECONDARY, compact = true)
        }
    }
}

/** Content-shaped shimmer block. */
@Composable
fun Skeleton(modifier: Modifier) {
    val c = Aiimin.colors
    val t = rememberInfiniteTransition(label = "sk")
    val a by t.animateFloat(0.45f, 0.9f, infiniteRepeatable(tween(900), RepeatMode.Reverse), label = "skA")
    Box(modifier.graphicsLayer { alpha = a }.clip(Shapes.small).background(c.raised))
}

/** Three dots that breathe while the assistant works. */
@Composable
fun ThinkingDots() {
    val c = Aiimin.colors
    val t = rememberInfiniteTransition(label = "dots")
    Row(horizontalArrangement = Arrangement.spacedBy(5.dp), modifier = Modifier.padding(8.dp)) {
        repeat(3) { i ->
            val a by t.animateFloat(0.25f, 1f, infiniteRepeatable(tween(600, delayMillis = i * 150), RepeatMode.Reverse), label = "d$i")
            Box(Modifier.size(6.dp).graphicsLayer { alpha = a }.clip(CircleShape).background(c.textMuted))
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
