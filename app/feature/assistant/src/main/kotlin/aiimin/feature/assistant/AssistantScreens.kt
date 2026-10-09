package aiimin.feature.assistant

import aiimin.core.data.ai.Action
import aiimin.core.data.ai.Source
import aiimin.core.database.ChatMessageEntity
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppIconButton
import aiimin.designsystem.component.AppSheet
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.ListRow
import aiimin.designsystem.component.ThinkingDots
import aiimin.designsystem.component.TopBar
import aiimin.designsystem.component.rememberVoiceInput
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.LocalToaster
import aiimin.designsystem.nav.Route
import aiimin.designsystem.theme.Aiimin
import aiimin.designsystem.theme.Shapes
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import kotlinx.coroutines.launch

internal fun iconFor(a: Action): ImageVector = when (a) {
    is Action.Expense -> AppIcons.ArrowUpRight
    is Action.Income -> AppIcons.ArrowDownLeft
    is Action.Task -> AppIcons.ListChecks
    is Action.Event -> AppIcons.Calendar
    is Action.Note -> AppIcons.Note
    is Action.TickMinimum -> AppIcons.CheckCircle
    is Action.StartFocus -> AppIcons.Timer
    is Action.FamilyTask -> AppIcons.Users
}

@Composable
fun AssistantScreen(route: Route.Assistant, vm: ChatViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    val messages by vm.messages.collectAsStateWithLifecycle()
    val busy by vm.busy.collectAsStateWithLifecycle()
    val starters by vm.starters.collectAsStateWithLifecycle()
    val threads by vm.threads.collectAsStateWithLifecycle()
    var input by remember { mutableStateOf("") }
    var threadsOpen by remember { mutableStateOf(false) }
    val list = rememberLazyListState()
    val c = Aiimin.colors
    LaunchedEffect(Unit) { vm.start(route.prompt, route.context, route.autoSend) { input = it } }
    LaunchedEffect(messages.size, busy) { if (messages.isNotEmpty()) list.animateScrollToItem(messages.size) }
    val voice = rememberVoiceInput("Say it — “spent 200 on lunch and remind me to call Mom at 7”", onText = { vm.send(it) }, onUnavailable = { toaster.show("Speech input isn't available on this phone") })

    Column(Modifier.fillMaxSize().background(c.base).imePadding()) {
        TopBar("Assistant", onBack = { nav.back() }) {
            AppIconButton(AppIcons.Rows, "Conversations", { threadsOpen = true })
            AppIconButton(AppIcons.Pencil, "New conversation", { vm.newChat() })
        }
        LazyColumn(Modifier.weight(1f), state = list, contentPadding = PaddingValues(horizontal = Aiimin.space.gutter, vertical = 8.dp)) {
            if (messages.isEmpty()) {
                item {
                    Column(Modifier.padding(top = 24.dp)) {
                        Text("Tell it what happened, or ask.", style = Aiimin.type.title)
                        Spacer(Modifier.height(6.dp))
                        Text("It turns one sentence into payments, tasks, calendar blocks and ticked minimums — shown to you first. It answers from your own data and says what it read.", style = Aiimin.type.body.copy(color = c.textMuted))
                        Spacer(Modifier.height(20.dp))
                        starters.forEach { s ->
                            Row(
                                Modifier.fillMaxWidth().padding(vertical = 3.dp).clip(Shapes.row).border(1.dp, c.border, Shapes.row).clickable { vm.send(s) }.padding(14.dp),
                                verticalAlignment = Alignment.CenterVertically,
                            ) {
                                Text(s, style = Aiimin.type.body, modifier = Modifier.weight(1f))
                                Icon(AppIcons.ArrowRight, null, tint = c.textFaint, modifier = Modifier.size(16.dp))
                            }
                        }
                    }
                }
            }
            items(messages, key = { it.id }) { m ->
                AnimatedVisibility(true, enter = fadeIn(tween(200)) + slideInVertically(tween(220)) { it / 6 }) {
                    if (m.role == "user") UserBubble(m.text) else AssistantMessage(m, vm, onSource = { s -> openSource(nav, s) }, onFollow = { f ->
                        if (f == "Open AI settings") nav.open(Route.AiSettings) else vm.send(f)
                    }, onApply = {
                        scope.launch {
                            val n = vm.apply(m)
                            toaster.undo("Applied $n change${if (n == 1) "" else "s"}") { vm.undo(m) }
                        }
                    })
                }
            }
            if (busy) item { ThinkingDots() }
        }
        Composer(input, { input = it }, onSend = { vm.send(input); input = "" }, onVoice = voice, enabled = !busy)
    }
    if (threadsOpen) {
        AppSheet({ threadsOpen = false }, title = "Conversations") {
            if (threads.isEmpty()) Text("No conversations yet.", style = Aiimin.type.caption)
            threads.take(30).forEach { t ->
                ListRow(t.title, onClick = { vm.open(t.id); threadsOpen = false }, trailing = {
                    AppIconButton(AppIcons.Trash, "Delete conversation", { vm.delete(t.id) }, tint = c.textFaint, size = 36.dp)
                })
            }
        }
    }
}

private fun openSource(nav: aiimin.designsystem.nav.AppNavigator, s: Source) = when (s.type) {
    "task" -> nav.open(Route.Task(s.id))
    "txn" -> nav.open(Route.Txn(s.id))
    "doc" -> nav.open(Route.Doc(s.id))
    "note" -> nav.open(Route.Note(s.id))
    "event" -> nav.open(Route.Calendar)
    "score" -> nav.open(Route.Score)
    "device" -> nav.open(Route.PhoneDay)
    "focus" -> nav.open(Route.Focus())
    "min" -> nav.open(Route.Minimums)
    else -> Unit
}

@Composable
private fun UserBubble(text: String) {
    val c = Aiimin.colors
    Box(Modifier.fillMaxWidth().padding(vertical = 6.dp), contentAlignment = Alignment.CenterEnd) {
        Text(text, style = Aiimin.type.body, modifier = Modifier.widthIn(max = 300.dp).clip(Shapes.row).background(c.raised).padding(horizontal = 14.dp, vertical = 10.dp))
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun AssistantMessage(m: ChatMessageEntity, vm: ChatViewModel, onSource: (Source) -> Unit, onFollow: (String) -> Unit, onApply: () -> Unit) {
    val c = Aiimin.colors
    val actions = vm.actions(m)
    val sources = vm.sources(m)
    val saw = vm.saw(m)
    var showSaw by remember { mutableStateOf(false) }
    Column(Modifier.fillMaxWidth().padding(vertical = 8.dp)) {
        Text(m.text, style = Aiimin.type.body)
        if (actions.isNotEmpty()) {
            Spacer(Modifier.height(10.dp))
            Column(Modifier.fillMaxWidth().clip(Shapes.row).border(1.dp, c.border, Shapes.row)) {
                actions.forEachIndexed { i, a ->
                    if (i > 0) Box(Modifier.fillMaxWidth().height(1.dp).background(c.border))
                    Row(Modifier.padding(horizontal = 12.dp, vertical = 10.dp), verticalAlignment = Alignment.CenterVertically) {
                        Icon(iconFor(a), null, tint = c.textMuted, modifier = Modifier.size(18.dp))
                        Spacer(Modifier.width(10.dp))
                        Column(Modifier.weight(1f)) {
                            Text(a.headline, style = Aiimin.type.bodyStrong)
                            Text(a.label, style = Aiimin.type.caption)
                        }
                    }
                }
                Row(Modifier.fillMaxWidth().background(c.surface).padding(10.dp), horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                    when (m.proposalState) {
                        "proposed" -> {
                            AppButton("Apply", onApply, compact = true, icon = AppIcons.Check)
                            AppButton("Discard", { vm.discard(m) }, compact = true, kind = ButtonKind.GHOST)
                        }
                        "applied" -> {
                            Text("Applied", style = Aiimin.type.label.copy(color = c.done), modifier = Modifier.weight(1f))
                            AppButton("Undo", { vm.undo(m) }, compact = true, kind = ButtonKind.GHOST, icon = AppIcons.Undo)
                        }
                        "undone" -> Text("Undone", style = Aiimin.type.label.copy(color = c.textMuted))
                        else -> Text("Discarded", style = Aiimin.type.label.copy(color = c.textFaint))
                    }
                }
            }
        }
        if (sources.isNotEmpty()) {
            Spacer(Modifier.height(8.dp))
            FlowRow(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                sources.forEach { s ->
                    Text(
                        s.label, style = Aiimin.type.label.copy(color = c.accent), maxLines = 1,
                        modifier = Modifier.clip(Shapes.tag).border(1.dp, c.accent.copy(alpha = 0.35f), Shapes.tag).clickable { onSource(s) }.padding(horizontal = 8.dp, vertical = 5.dp),
                    )
                }
            }
        }
        val follow = vm.followups(m)
        if (follow.isNotEmpty() || saw.isNotEmpty()) {
            Spacer(Modifier.height(6.dp))
            FlowRow(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                follow.forEach { f -> Text(f, style = Aiimin.type.label.copy(color = c.textMuted), modifier = Modifier.clip(Shapes.tag).clickable { onFollow(f) }.padding(vertical = 4.dp)) }
                if (saw.isNotEmpty()) Text(if (showSaw) "Read: " + saw.joinToString(" · ") else "What it read", style = Aiimin.type.caption, modifier = Modifier.clickable { showSaw = !showSaw }.padding(vertical = 4.dp))
            }
        }
    }
}

@Composable
private fun Composer(value: String, onChange: (String) -> Unit, onSend: () -> Unit, onVoice: () -> Unit, enabled: Boolean) {
    val c = Aiimin.colors
    Row(
        Modifier.fillMaxWidth().background(c.base).navigationBarsPadding().padding(horizontal = 12.dp, vertical = 8.dp),
        verticalAlignment = Alignment.Bottom,
    ) {
        Box(Modifier.weight(1f).clip(Shapes.row).background(c.raised).border(1.dp, c.border, Shapes.row).heightIn(min = 48.dp).padding(horizontal = 14.dp, vertical = 13.dp)) {
            if (value.isEmpty()) Text("Log or ask anything", style = Aiimin.type.body.copy(color = c.textFaint))
            BasicTextField(value, onChange, textStyle = Aiimin.type.body, cursorBrush = SolidColor(c.accent), maxLines = 5, modifier = Modifier.fillMaxWidth())
        }
        Spacer(Modifier.width(8.dp))
        if (value.isBlank()) {
            AppIconButton(AppIcons.Mic, "Speak", onVoice, tint = c.onAccent, background = c.accent, size = 48.dp)
        } else {
            AppIconButton(AppIcons.Send, "Send", { if (enabled) onSend() }, tint = c.onAccent, background = if (enabled) c.accent else c.textFaint, size = 48.dp)
        }
    }
}

// ------------------------------------------------------------------ ＋ capture sheet

/**
 * The front door. One line — typed or spoken — previewed live as what it will
 * become, saved in one tap, undone in one tap.
 */
@Composable
fun CaptureSheet(prefill: String?, startVoice: Boolean, onDismiss: () -> Unit, vm: CaptureViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    // Typing lives in local state; a StateFlow round-trip drops fast keystrokes.
    var text by remember { mutableStateOf(prefill.orEmpty()) }
    LaunchedEffect(text) { vm.text.value = text }
    val preview by vm.preview.collectAsStateWithLifecycle()
    val c = Aiimin.colors
    val focus = remember { FocusRequester() }
    val voice = rememberVoiceInput(onText = { text = it }, onUnavailable = { toaster.show("Speech input isn't available on this phone") })
    LaunchedEffect(Unit) {
        if (startVoice) voice() else runCatching { focus.requestFocus() }
    }
    val journalLine = text.isNotBlank() && preview.isEmpty()
    AppSheet(onDismiss) {
        Row(verticalAlignment = Alignment.Top) {
            Box(Modifier.weight(1f).padding(top = 10.dp)) {
                if (text.isEmpty()) Text("Spent 240 on lunch, call Ravi at 5…", style = Aiimin.type.headline.copy(color = c.textFaint))
                BasicTextField(text, { text = it }, textStyle = Aiimin.type.headline, cursorBrush = SolidColor(c.accent), maxLines = 4, modifier = Modifier.fillMaxWidth().focusRequester(focus))
            }
            AppIconButton(AppIcons.Mic, "Speak", voice, tint = c.accent)
        }
        Spacer(Modifier.height(12.dp))
        preview.forEach { a ->
            Row(Modifier.padding(vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
                Icon(iconFor(a), null, tint = c.textMuted, modifier = Modifier.size(18.dp))
                Spacer(Modifier.width(10.dp))
                Column(Modifier.weight(1f)) {
                    Text(a.headline, style = Aiimin.type.bodyStrong, maxLines = 1)
                    Text(a.label, style = Aiimin.type.caption)
                }
            }
        }
        if (journalLine) Text("Sounds like a journal line — it'll open the journal, which stays private.", style = Aiimin.type.caption)
        Spacer(Modifier.height(14.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            AppButton("Document", { onDismiss(); nav.open(Route.Vault) }, kind = ButtonKind.SECONDARY, compact = true, icon = AppIcons.FileText)
            AppButton("Ask instead", { onDismiss(); nav.open(Route.Assistant(text.ifBlank { null }, autoSend = text.isNotBlank())) }, kind = ButtonKind.SECONDARY, compact = true, icon = AppIcons.Chat)
            Spacer(Modifier.weight(1f))
            AppButton(if (preview.size > 1) "Add ${preview.size}" else "Add", {
                if (journalLine) {
                    onDismiss()
                    nav.open(Route.JournalWrite())
                } else {
                    scope.launch {
                        vm.text.value = text
                        val created = vm.save()
                        onDismiss()
                        if (created.isNotEmpty()) toaster.undo(if (created.size == 1) "Added “${created.first().label}”" else "Added ${created.size} items") { vm.revert(created) }
                    }
                }
            }, compact = true, enabled = text.isNotBlank())
        }
    }
}
