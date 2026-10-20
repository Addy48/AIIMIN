package aiimin.feature.assistant

import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.graphics.graphicsLayer
import aiimin.designsystem.component.enterStagger
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextOverflow
import aiimin.designsystem.component.IconButtonInset
import aiimin.designsystem.component.bleed
import aiimin.designsystem.theme.LocalReduceMotion
import aiimin.designsystem.theme.Motion
import androidx.compose.animation.core.animateFloat
import androidx.compose.ui.unit.sp
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.layout.statusBarsPadding
import aiimin.core.data.ai.Action
import aiimin.core.data.ai.Source
import aiimin.core.database.ChatMessageEntity
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppIconButton
import aiimin.designsystem.component.AppSheet
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.ListRow
import aiimin.designsystem.component.Pill
import aiimin.designsystem.component.PillRow
import aiimin.designsystem.component.SectionHeader
import aiimin.designsystem.component.AppTextField
import aiimin.designsystem.component.ThinkingDots
import aiimin.designsystem.component.TopBar
import aiimin.designsystem.component.rememberVoiceInput
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.LocalToaster
import aiimin.designsystem.nav.Route
import aiimin.designsystem.nav.go
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
import androidx.compose.foundation.layout.fillMaxHeight
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
    is Action.Recurring -> AppIcons.ArrowUpRight
    is Action.Choose -> AppIcons.Note
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
                AnimatedVisibility(true, enter = if (LocalReduceMotion.current) fadeIn(Motion.reducedFade()) else fadeIn(Motion.standard()) + slideInVertically(Motion.standard()) { it / 6 }) {
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
        // D-039: the bar sits on the 16 dp page margins like everything above it.
        Modifier.fillMaxWidth().background(c.base).navigationBarsPadding().padding(horizontal = Aiimin.space.gutter, vertical = 8.dp),
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
 * The "+" capture sheet (PRD Part 3 §1.2b, motion 26.5): type-first. It rises from the bar with the keyboard
 * already open, a mic beside the field, live chips under it ("₹240 · Food · Expense") that can be tapped to
 * change, six quick types, up to three suggestions, and one Save. Parsing is on the phone; nothing is sent.
 * Typing a feature's name ("vault") offers to open it. Everything saved can be undone from the toast.
 */
@Composable
fun CaptureSheet(prefill: String?, startVoice: Boolean, onDismiss: () -> Unit, initialType: String? = null, vm: CaptureViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    val reduce = aiimin.designsystem.theme.LocalReduceMotion.current
    var text by remember { mutableStateOf(prefill.orEmpty()) }
    val forced by vm.forced.collectAsStateWithLifecycle()
    // The view model outlives the sheet: every opening starts clean, with the shortcut's type if there is one.
    var chooserPick by remember { mutableStateOf(false) }
    LaunchedEffect(Unit) { vm.forced.value = quickKind(initialType) }
    LaunchedEffect(text) { vm.text.value = text }
    var saving by remember { mutableStateOf(false) }
    val preview by vm.preview.collectAsStateWithLifecycle()
    val keyboard = androidx.compose.ui.platform.LocalSoftwareKeyboardController.current
    val focusManager = androidx.compose.ui.platform.LocalFocusManager.current
    var listening by remember { mutableStateOf(false) }
    var dropped by remember { mutableStateOf(setOf<Int>()) }
    var edits by remember { mutableStateOf(mapOf<Int, Action>()) }
    var editing by remember { mutableStateOf<Int?>(null) }
    val c = Aiimin.colors
    val focus = remember { FocusRequester() }
    var heard by remember { mutableStateOf("") }
    var level by remember { mutableStateOf(0f) }
    val voice = rememberVoiceInput(
        onText = { listening = false; heard = ""; text = if (text.isBlank()) it else "${text.trimEnd()} $it" },
        onUnavailable = { listening = false; heard = ""; toaster.show("Speech input isn't available on this phone") },
        onPartial = { heard = it },
        onLevel = { level = it },
        onListening = { listening = it; if (!it) level = 0f },
    )
    fun speak() { listening = true; voice() }
    // 26.5: the sheet rises on the emphasised token and the field takes focus 120 ms in, so the keyboard
    // doesn't jump the sheet mid-rise; reduce motion fades instead.
    val rise = remember { androidx.compose.animation.core.Animatable(0f) }
    val leave = remember { androidx.compose.animation.core.Animatable(0f) }
    LaunchedEffect(Unit) {
        if (startVoice) speak()
        launch { rise.animateTo(1f, aiimin.designsystem.theme.Motion.fade(reduce, aiimin.designsystem.theme.Motion.emphasised())) }
        kotlinx.coroutines.delay(120)
        if (!startVoice) runCatching { focus.requestFocus(); keyboard?.show() }
    }
    LaunchedEffect(preview) { dropped = emptySet(); edits = emptyMap() }
    val goTo = remember(text) { aiimin.designsystem.nav.FeatureIndex.navigationMatches(text).take(3) }
    val journalLine = text.isNotBlank() && preview.isEmpty() && goTo.isEmpty()
    // Private writing goes to Pour (never saved by the sheet): when the text reads like it, or Journal is picked.
    val toPour = journalLine && (forced == null || forced == aiimin.core.nlp.Kind.JOURNAL)
    val items = preview.mapIndexed { i, a -> edits[i] ?: a }
    val kept = items.filterIndexed { i, a -> i !in dropped && a !is Action.Choose }
    val unsure = items.any { it is Action.Choose }

    var closing by remember { mutableStateOf(false) }
    fun close(after: () -> Unit = {}) {
        if (closing) return
        closing = true
        keyboard?.hide(); focusManager.clearFocus()
        scope.launch {
            // On save the sheet shrinks toward the bar (exit token), then closes.
            leave.animateTo(1f, aiimin.designsystem.theme.Motion.fade(reduce, aiimin.designsystem.theme.Motion.exit()))
            onDismiss(); after()
        }
    }
    // One save per sheet; it runs in the view model, so closing the sheet can't cancel it halfway.
    fun save() {
        if (saving) return
        saving = true
        vm.saveAll(kept) { created ->
            close { if (created.isNotEmpty()) toaster.undo(if (created.size == 1) "Saved." else "Saved ${created.size}.") { vm.revert(created) } }
        }
    }

    androidx.compose.ui.window.Dialog(
        onDismissRequest = { if (editing != null) editing = null else close() },
        properties = androidx.compose.ui.window.DialogProperties(usePlatformDefaultWidth = false, decorFitsSystemWindows = false),
    ) {
        Box(Modifier.fillMaxSize()) {
            Box(
                Modifier.fillMaxSize().graphicsLayer { alpha = rise.value * (1f - leave.value) }.background(c.scrim)
                    .clickable(indication = null, interactionSource = remember { androidx.compose.foundation.interaction.MutableInteractionSource() }, onClickLabel = "Close") { close() },
            )
            Column(
                Modifier.align(Alignment.BottomCenter).fillMaxWidth()
                    .graphicsLayer {
                        val r = rise.value
                        translationY = if (reduce) 0f else (1f - r) * size.height + leave.value * size.height * 0.35f
                        alpha = if (reduce) r * (1f - leave.value) else 1f - leave.value
                        val shrink = 1f - 0.12f * leave.value
                        scaleX = shrink; scaleY = shrink
                        transformOrigin = androidx.compose.ui.graphics.TransformOrigin(0.5f, 1f)
                    }
                    .clip(RoundedCornerShape(topStart = 22.dp, topEnd = 22.dp)).background(c.sheet)
                    // Taps on the sheet itself don't reach the scrim (no extra button for TalkBack).
                    .pointerInput(Unit) { detectTapGestures { } }
                    .navigationBarsPadding().imePadding().padding(horizontal = Aiimin.space.gutter).padding(top = 10.dp, bottom = 12.dp),
            ) {
                Box(Modifier.align(Alignment.CenterHorizontally).size(width = 38.dp, height = 4.dp).clip(RoundedCornerShape(2.dp)).background(c.borderStrong))
                Spacer(Modifier.height(14.dp))
                // Field with the mic beside it.
                Row(verticalAlignment = Alignment.Bottom) {
                    Box(Modifier.weight(1f).clip(Shapes.row).background(c.raised).border(1.dp, c.border, Shapes.row).heightIn(min = 52.dp).padding(horizontal = 14.dp, vertical = 14.dp)) {
                        val shown = if (listening && heard.isNotBlank()) (if (text.isBlank()) "" else "$text ") + heard else null
                        if (text.isEmpty() && shown == null) Text(
                            if (listening) "Listening…" else "Spent 240 on lunch, call Ravi at 5",
                            style = Aiimin.type.body.copy(color = c.textFaint, fontSize = 17.sp), maxLines = 1, overflow = TextOverflow.Ellipsis,
                            modifier = Modifier.padding(start = 3.dp),
                        )
                        if (shown != null) Text(shown, style = Aiimin.type.body.copy(fontSize = 17.sp))
                        else BasicTextField(
                            // A type picked on the "not sure" card is for that text only; a quick type stays.
                            text, { text = it; if (chooserPick) { vm.forced.value = null; chooserPick = false } },
                            textStyle = Aiimin.type.body.copy(fontSize = 17.sp, color = c.text), cursorBrush = SolidColor(c.text), maxLines = 5,
                            modifier = Modifier.fillMaxWidth().focusRequester(focus).semantics { contentDescription = "Capture" },
                        )
                    }
                    Spacer(Modifier.width(8.dp))
                    AppIconButton(
                        AppIcons.Mic, if (listening) "Stop listening" else "Speak", { if (listening) listening = false else speak() },
                        tint = if (listening) c.onAccent else c.text, background = if (listening) c.accent else c.raised, size = 52.dp,
                    )
                }
                if (listening) Meter18(true, level)
                // Six quick types (1.2b); picking one files the text as that type.
                Spacer(Modifier.height(10.dp))
                androidx.compose.foundation.lazy.LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    items(QUICK_TYPES.size) { i ->
                        val (label, key) = QUICK_TYPES[i]
                        val kind = quickKind(key)
                        Pill(label, forced == kind && kind != null, {
                            if (key == "document") close { nav.go(Route.Vault) } else vm.forced.value = if (forced == kind) null else kind
                        }, icon = quickIcon(key))
                    }
                }
                // Live chips; tap one to change it.
                if (items.isNotEmpty()) {
                    Spacer(Modifier.height(10.dp))
                    @OptIn(androidx.compose.foundation.layout.ExperimentalLayoutApi::class)
                    androidx.compose.foundation.layout.FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        items.forEachIndexed { i, a ->
                            if (i in dropped || a is Action.Choose) return@forEachIndexed
                            Row(
                                Modifier.enterStagger(i).clip(Shapes.control).background(c.surface).border(1.dp, c.borderStrong, Shapes.control)
                                    .clickable(onClickLabel = "Change") { editing = i }.heightIn(min = 44.dp).padding(horizontal = 12.dp),
                                verticalAlignment = Alignment.CenterVertically,
                            ) {
                                Icon(iconFor(a), null, tint = c.text, modifier = Modifier.size(16.dp))
                                Spacer(Modifier.width(6.dp))
                                Text(chipText(a), style = Aiimin.type.label.copy(fontSize = 14.sp), maxLines = 1, overflow = TextOverflow.Ellipsis)
                            }
                        }
                    }
                }
                items.filterIsInstance<Action.Choose>().firstOrNull()?.let { a ->
                    Spacer(Modifier.height(10.dp))
                    ChooserCard(a) { vm.forced.value = it; chooserPick = true }
                }
                // Up to three suggestions: features named in the text.
                if (goTo.isNotEmpty()) {
                    Spacer(Modifier.height(6.dp))
                    goTo.forEach { f ->
                        Row(
                            Modifier.fillMaxWidth().clip(Shapes.row).clickable { close { nav.go(f.route) } }.heightIn(min = 48.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Icon(f.icon, null, tint = c.text, modifier = Modifier.size(20.dp))
                            Spacer(Modifier.width(12.dp))
                            Text("Open ${f.title}", style = Aiimin.type.body, maxLines = 1, modifier = Modifier.weight(1f))
                            Icon(AppIcons.ArrowRight, null, tint = c.textMuted, modifier = Modifier.size(16.dp))
                        }
                    }
                }
                if (toPour) Text("Sounds like a private line. Save opens Pour, which stays on this phone.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 8.dp))
                Spacer(Modifier.height(12.dp))
                AppButton(
                    when {
                        unsure -> "Pick a type first"
                        toPour -> "Write it in Pour"
                        kept.size > 1 -> "Save ${kept.size}"
                        else -> "Save"
                    },
                    {
                        if (toPour) close { nav.open(Route.JournalWrite(prefill = text.trim())) } else save()
                    },
                    Modifier.fillMaxWidth(),
                    enabled = !saving && !unsure && (kept.isNotEmpty() || toPour),
                )
            }
            editing?.let { i ->
                items.getOrNull(i)?.let { a ->
                    CardEditor(a, onDismiss = { editing = null }, onRemove = { dropped = dropped + i; editing = null }) { e -> edits = edits + (i to e); editing = null }
                }
            }
        }
    }
}

/** The six quick types under the field (1.2b). */
private val QUICK_TYPES = listOf("Task" to "task", "Expense" to "expense", "Note" to "note", "Event" to "event", "Journal" to "journal", "Document" to "document")

private fun quickKind(key: String?): aiimin.core.nlp.Kind? = when (key) {
    "task" -> aiimin.core.nlp.Kind.TASK; "expense" -> aiimin.core.nlp.Kind.EXPENSE; "note" -> aiimin.core.nlp.Kind.NOTE
    "event" -> aiimin.core.nlp.Kind.EVENT; "journal" -> aiimin.core.nlp.Kind.JOURNAL; else -> null
}

private fun quickIcon(key: String): ImageVector = when (key) {
    "task" -> AppIcons.CheckSquare; "expense" -> AppIcons.Wallet; "note" -> AppIcons.Note; "event" -> AppIcons.Calendar
    "journal" -> AppIcons.BookOpen; else -> AppIcons.FileText
}

/** "₹240 · Food · Expense", "Call CA · Tomorrow 4:30 PM" (1.2b chips). */
private fun rel(day: String) = runCatching { aiimin.core.data.util.Dates.relative(java.time.LocalDate.parse(day), java.time.LocalDate.now()) }.getOrDefault(day)

internal fun chipText(a: Action): String = when (a) {
    is Action.Expense -> "${aiimin.core.data.util.Money.formatIn(a.paise, a.currency)} · ${a.category} · Expense"
    is Action.Income -> "${aiimin.core.data.util.Money.formatIn(a.paise, a.currency)} · ${a.category} · Income"
    is Action.Recurring -> "${aiimin.core.data.util.Money.formatIn(a.paise, a.currency)} · ${a.title} · ${a.cadence.lowercase()}"
    is Action.Task -> listOfNotNull(a.title, rel(a.day) + (a.time?.let { " " + (aiimin.core.data.util.Dates.clock(it) ?: it) } ?: "")).joinToString(" · ")
    is Action.Event -> a.title + " · " + rel(a.date) + (if (a.minutes >= 1440) " all day" else " " + (aiimin.core.data.util.Dates.clock(a.time) ?: a.time))
    else -> a.headline + " · " + typeName(a)
}

/** "I am not sure what this is": five buttons instead of a silent guess. */
@Composable
private fun ChooserCard(a: Action.Choose, onPick: (aiimin.core.nlp.Kind) -> Unit) {
    val c = Aiimin.colors
    Column(
        Modifier.fillMaxWidth().clip(RoundedCornerShape(10.dp)).background(c.surface).border(1.dp, c.border, RoundedCornerShape(10.dp)).padding(horizontal = 16.dp, vertical = 14.dp),
    ) {
        Text("Not sure what this is", style = Aiimin.type.bodyStrong)
        Text("“${a.text.take(60)}”", style = Aiimin.type.caption, maxLines = 1, modifier = Modifier.padding(top = 2.dp))
        PillRow {
            listOf("Expense" to aiimin.core.nlp.Kind.EXPENSE, "Task" to aiimin.core.nlp.Kind.TASK, "Event" to aiimin.core.nlp.Kind.EVENT,
                "Note" to aiimin.core.nlp.Kind.NOTE, "Journal" to aiimin.core.nlp.Kind.JOURNAL).forEach { (label, kind) -> Pill(label, false, { onPick(kind) }) }
        }
    }
}

/** C4 · edit one capture item; the type can change and the fields re-map. */
@Composable
private fun CardEditor(start: Action, onDismiss: () -> Unit, onRemove: (() -> Unit)? = null, onDone: (Action) -> Unit) {
    val c = Aiimin.colors
    val toaster = LocalToaster.current
    val today = java.time.LocalDate.now()
    var type by remember { mutableStateOf(typeName(start)) }
    var title by remember { mutableStateOf(start.headline) }
    val startCurrency = (start as? Action.Expense)?.currency ?: (start as? Action.Income)?.currency ?: "INR"
    var amount by remember { mutableStateOf(((start as? Action.Expense)?.paise ?: (start as? Action.Income)?.paise)?.let { plainAmount(it) }.orEmpty()) }
    var category by remember { mutableStateOf((start as? Action.Expense)?.category ?: (start as? Action.Income)?.category ?: "Food") }
    var day by remember {
        mutableStateOf(
            when (start) {
                is Action.Expense -> start.day; is Action.Income -> start.day; is Action.Task -> start.day; is Action.Event -> start.date
                is Action.FamilyTask -> start.day; else -> today.toString()
            }.let { runCatching { java.time.LocalDate.parse(it) }.getOrDefault(today) },
        )
    }
    var time by remember { mutableStateOf((start as? Action.Event)?.time ?: (start as? Action.Task)?.time) }
    var minutes by remember { mutableStateOf((start as? Action.Event)?.minutes ?: 30) }
    var body by remember { mutableStateOf((start as? Action.Note)?.body.orEmpty()) }
    var pickDay by remember { mutableStateOf(false) }
    var pickTime by remember { mutableStateOf(false) }
    val respeak = rememberVoiceInput(onText = { title = it }, onUnavailable = { toaster.show("Speech input isn't available on this phone") })
    val editable = start !is Action.TickMinimum && start !is Action.StartFocus && start !is Action.FamilyTask && start !is Action.Recurring && start !is Action.Choose
    Box(Modifier.fillMaxSize().background(c.scrim).clickable(indication = null, interactionSource = remember { androidx.compose.foundation.interaction.MutableInteractionSource() }, onClick = onDismiss))
    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.BottomCenter) {
        Column(
            Modifier.fillMaxWidth().fillMaxHeight(0.86f).clip(RoundedCornerShape(topStart = 22.dp, topEnd = 22.dp)).background(c.surface)
                .clickable(indication = null, interactionSource = remember { androidx.compose.foundation.interaction.MutableInteractionSource() }) {}
                .navigationBarsPadding().imePadding().padding(horizontal = Aiimin.space.gutter),
        ) {
            Box(Modifier.padding(top = 12.dp).align(Alignment.CenterHorizontally).size(36.dp, 4.dp).clip(RoundedCornerShape(2.dp)).background(c.border))
            Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(top = 18.dp)) {
                Text("Edit item", style = Aiimin.type.title)
                if (editable) {
                    SectionHeader("Type")
                    PillRow { listOf("Task", "Event", "Expense", "Income", "Note").forEach { t -> Pill(t, type == t, { type = t }) } }
                }
                Spacer(Modifier.height(10.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    AppTextField(title, { title = it }, label = if (type == "Expense" || type == "Income") "Payee or what for" else "Title", modifier = Modifier.weight(1f))
                    AppIconButton(AppIcons.Mic, "Re-speak this item", { respeak() })
                }
                when (type) {
                    "Expense", "Income" -> {
                        Spacer(Modifier.height(10.dp))
                        AppTextField(amount, { v -> amount = cleanAmount(v) }, label = if (startCurrency == "INR") "Amount (₹)" else "Amount ($startCurrency)", keyboardType = androidx.compose.ui.text.input.KeyboardType.Decimal)
                        SectionHeader("Category")
                        PillRow { (if (type == "Expense") aiimin.core.data.money.Categories.SPEND else aiimin.core.data.money.Categories.INCOME).forEach { k -> Pill(k, category == k, { category = k }) } }
                    }
                    "Note" -> {
                        Spacer(Modifier.height(10.dp))
                        AppTextField(body, { body = it }, label = "Text", singleLine = false, minLines = 4)
                    }
                }
                if (type != "Note") {
                    SectionHeader("When")
                    PillRow {
                        Pill("Today", day == today, { day = today })
                        Pill(if (type == "Expense" || type == "Income") "Yesterday" else "Tomorrow", day == (if (type == "Expense" || type == "Income") today.minusDays(1) else today.plusDays(1)), {
                            day = if (type == "Expense" || type == "Income") today.minusDays(1) else today.plusDays(1)
                        })
                        Pill(aiimin.core.data.util.Dates.short(day), false, { pickDay = true }, icon = AppIcons.CalendarBlank)
                    }
                    if (type == "Task" || type == "Event") {
                        ListRow("Time", subtitle = time?.let { aiimin.core.data.util.Dates.clock(it) } ?: if (type == "Event") "Pick a time" else "Any time", onClick = { pickTime = true })
                    }
                    if (type == "Event") {
                        SectionHeader("Length")
                        PillRow { listOf(15, 30, 45, 60, 90, 120).forEach { m -> Pill(if (m < 60) "$m min" else "${m / 60}h" + if (m % 60 > 0) " ${m % 60}m" else "", minutes == m, { minutes = m }) } }
                    }
                }
            }
            val paise = amountToPaise(amount)
            val ok = title.isNotBlank() && when (type) { "Expense", "Income" -> paise > 0; "Event" -> time != null; else -> true }
            Row(Modifier.fillMaxWidth().padding(vertical = 16.dp), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                AppButton(if (onRemove != null) "Remove" else "Cancel", onRemove ?: onDismiss, Modifier.weight(1f), kind = ButtonKind.SECONDARY)
                AppButton("Done", {
                    val d = day.toString()
                    onDone(
                        if (!editable) start else when (type) {
                            "Expense" -> Action.Expense(title.trim(), paise, category, d, startCurrency)
                            "Income" -> Action.Income(title.trim(), paise, category, d, startCurrency)
                            "Event" -> Action.Event(title.trim(), d, time ?: "09:00", minutes)
                            "Note" -> Action.Note(title.trim(), body)
                            else -> Action.Task(title.trim(), d, time)
                        },
                    )
                }, Modifier.weight(2f), enabled = ok)
            }
        }
    }
    if (pickDay) aiimin.designsystem.component.DatePick(day, { day = it; pickDay = false }, { pickDay = false })
    if (pickTime) aiimin.designsystem.component.TimePick(
        time?.let { runCatching { java.time.LocalTime.parse(it) }.getOrNull() } ?: java.time.LocalTime.of(9, 0),
        { time = "%02d:%02d".format(it.hour, it.minute); pickTime = false }, { pickTime = false },
        onClear = if (type == "Task") ({ time = null; pickTime = false }) else null,
    )
}

/** 18 ink bars; they only move while the phone is actually listening (the one recording loop, Part 26.5). */
@Composable
private fun Meter18(active: Boolean, level: Float = 0f) {
    val c = Aiimin.colors
    // The wave runs only while listening and never with reduce motion (the bars still follow the mic level).
    val phase = if (active && !LocalReduceMotion.current) {
        val t = androidx.compose.animation.core.rememberInfiniteTransition(label = "level")
        t.animateFloat(0f, 6.2832f, androidx.compose.animation.core.infiniteRepeatable(androidx.compose.animation.core.tween(Motion.AMBIENT_MIN, easing = androidx.compose.animation.core.LinearEasing)), label = "p").value
    } else 0f
    Row(Modifier.fillMaxWidth().height(56.dp), horizontalArrangement = Arrangement.Center, verticalAlignment = Alignment.CenterVertically) {
        repeat(18) { i ->
            // Follows the real microphone level; the gentle wave only shapes it across the bars.
            val h = if (active) 6f + 44f * level.coerceIn(0.08f, 1f) * (0.45f + 0.55f * kotlin.math.abs(kotlin.math.sin(phase + i * 0.7f))) else 4f + (i % 3) * 3f
            Box(Modifier.padding(horizontal = 2.dp).width(4.dp).height(h.dp).clip(RoundedCornerShape(2.dp)).background(c.text))
        }
    }
}

/** "1950" paise → "19.5"; whole rupees stay whole. Typing keeps at most two decimals. */
private fun plainAmount(minor: Long): String = java.math.BigDecimal(minor).movePointLeft(2).stripTrailingZeros().toPlainString()
private fun cleanAmount(v: String): String {
    val f = v.filter { it.isDigit() || it == '.' }
    val dot = f.indexOf('.')
    return if (dot < 0) f else f.substring(0, dot + 1) + f.substring(dot + 1).replace(".", "").take(2)
}
private fun amountToPaise(v: String): Long = v.toBigDecimalOrNull()?.movePointRight(2)?.toLong() ?: 0L

private fun typeName(a: Action) = when (a) {
    is Action.Expense -> "Expense"; is Action.Income -> "Income"; is Action.Task -> "Task"; is Action.Event -> "Event"
    is Action.Recurring -> "Repeating"; is Action.Choose -> "Choose"
    is Action.Note -> "Note"; is Action.TickMinimum -> "Minimum"; is Action.StartFocus -> "Focus"; is Action.FamilyTask -> "Family task"
}

private fun captureTitle(a: Action) = when (a) {
    is Action.Expense -> "${aiimin.core.data.util.Money.formatIn(a.paise, a.currency)} · ${a.title}"
    is Action.Income -> "${aiimin.core.data.util.Money.formatIn(a.paise, a.currency)} · ${a.title}"
    is Action.Recurring -> "${aiimin.core.data.util.Money.formatIn(a.paise, a.currency)} · ${a.title} · ${a.cadence.lowercase()}"
    else -> a.headline
}

private fun captureWhen(a: Action) = when (a) {
    is Action.Event -> aiimin.core.data.util.Dates.relative(java.time.LocalDate.parse(a.date), java.time.LocalDate.now()) + (if (a.minutes >= 1440) " all day" else " " + aiimin.core.data.util.Dates.clock(a.time))
    is Action.Expense -> "Expense"; is Action.Income -> "Income"
    else -> typeName(a)
}

private fun reviewTitle(a: Action) = when (a) {
    is Action.Expense -> "−${aiimin.core.data.util.Money.formatIn(a.paise, a.currency)} · ${a.title}"
    is Action.Income -> "+${aiimin.core.data.util.Money.formatIn(a.paise, a.currency)} · ${a.title}"
    is Action.Recurring -> "${aiimin.core.data.util.Money.formatIn(a.paise, a.currency)} · ${a.title}"
    is Action.Event -> a.title + if (a.minutes >= 1440) " · all day" else " · " + aiimin.core.data.util.Dates.clock(a.time)
    else -> a.headline
}

private fun destination(a: Action): String {
    val today = java.time.LocalDate.now()
    fun part(time: String?): String = time?.let { aiimin.core.data.util.Dates.clock(it) } ?: "anytime"
    return when (a) {
        is Action.Expense -> if (a.currency == "INR") "Money › ${a.category}" else "Notes › ${a.currency} amount (not in rupee totals)"
        is Action.Income -> if (a.currency == "INR") "Money › ${a.category}" else "Notes › ${a.currency} amount (not in rupee totals)"
        is Action.Recurring -> "Money › Bills › repeats ${a.cadence.lowercase()} from " + aiimin.core.data.util.Dates.relative(java.time.LocalDate.parse(a.nextDue), today)
        is Action.Choose -> ""
        is Action.Task -> aiimin.core.data.util.Dates.relative(java.time.LocalDate.parse(a.day), today) + " › " + part(a.time)
        is Action.Event -> aiimin.core.data.util.Dates.relative(java.time.LocalDate.parse(a.date), today) + (if (a.minutes >= 1440) " › Calendar · all day" else " › Calendar · reminder 10 min before")
        is Action.Note -> "Notes"
        is Action.TickMinimum -> "Today › Minimums"
        is Action.StartFocus -> "Focus · ${a.minutes} min"
        is Action.FamilyTask -> "Family › ${a.personName}"
    }
}

/** C5 · Recent captures: the last 24 hours, with what each became, and undo per capture. */
@Composable
fun RecentCapturesScreen(vm: RecentCapturesViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val c = Aiimin.colors
    val list by vm.recent.collectAsStateWithLifecycle()
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Recent captures", onBack = { nav.back() })
        if (list.isEmpty()) {
            aiimin.designsystem.component.EmptyState(raahi = aiimin.core.engine.raahi.RaahiPose.SATCHEL_OPEN, icon = AppIcons.Waveform, title = "Nothing in the last 24 hours", body = "What you capture with ＋ shows here for a day, with everything it created, so you can undo a whole capture.")
            return@Column
        }
        androidx.compose.foundation.lazy.LazyColumn(contentPadding = androidx.compose.foundation.layout.PaddingValues(start = Aiimin.space.gutter, end = Aiimin.space.gutter, bottom = 32.dp)) {
            list.forEach { r ->
                item(key = r.id) {
                    var open by remember { mutableStateOf(false) }
                    Column(Modifier.fillMaxWidth().padding(vertical = 14.dp)) {
                        Text(
                            aiimin.core.data.util.Dates.clock(java.time.Instant.ofEpochMilli(r.at).atZone(java.time.ZoneId.systemDefault()).toLocalTime()) + " · ${r.created.size} ${if (r.created.size == 1) "item" else "items"}" + if (r.undone) " · undone" else "",
                            style = Aiimin.type.caption,
                        )
                        Text(
                            "“${r.text.ifBlank { "—" }}”", style = Aiimin.type.body.copy(fontSize = 16.sp), maxLines = if (open) 20 else 2,
                            modifier = Modifier.padding(top = 4.dp).clickable { open = !open },
                        )
                        r.created.forEach { s ->
                            Row(Modifier.fillMaxWidth().padding(top = 8.dp).clickable(enabled = !r.undone) {
                                when (s.type) {
                                    "txn" -> nav.open(Route.Txn(s.id)); "task" -> nav.open(Route.Task(s.id)); "note" -> nav.open(Route.Note(s.id))
                                    "event" -> nav.open(Route.Calendar); else -> Unit
                                }
                            }, verticalAlignment = Alignment.CenterVertically) {
                                Icon(AppIcons.ArrowBendDownRight, null, tint = c.textMuted, modifier = Modifier.size(16.dp))
                                Spacer(Modifier.width(8.dp))
                                Text(s.label, style = Aiimin.type.body.copy(color = if (r.undone) c.textFaint else c.text), maxLines = 1)
                            }
                        }
                        if (!r.undone) Text(
                            "Undo this capture", style = Aiimin.type.label.copy(color = c.link, fontSize = 14.sp),
                            modifier = Modifier.padding(top = 12.dp).clickable { vm.undo(r.id); toaster.show("Capture undone") }.padding(vertical = 6.dp),
                        )
                    }
                    aiimin.designsystem.component.Hairline()
                }
            }
        }
    }
}
