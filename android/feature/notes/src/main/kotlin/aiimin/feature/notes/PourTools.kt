package aiimin.feature.notes

import aiimin.core.data.notes.PourItem
import aiimin.core.engine.pour.Feelings
import aiimin.core.engine.pour.PourLines
import aiimin.core.engine.pour.PourTiming
import aiimin.core.engine.pour.TellSomeone
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppTextField
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.DatePick
import aiimin.designsystem.nav.LocalToaster
import aiimin.designsystem.component.Pill
import aiimin.designsystem.component.SectionHeader
import aiimin.designsystem.component.TimePick
import aiimin.designsystem.component.Tool
import aiimin.designsystem.component.ToolGrid
import aiimin.designsystem.component.pressable
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.theme.Aiimin
import aiimin.designsystem.theme.LocalReduceMotion
import aiimin.designsystem.theme.Shapes
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.time.Instant
import java.time.LocalDate
import java.time.LocalTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale

/** Tool keys (12.6, first cut). Notifications open "cool" and "worry" straight away. */
internal object PourTools {
    const val BREATHE = "breathe"; const val NAME = "name"; const val TELL = "tell"; const val COOL = "cool"
    const val SAY = "say"; const val LETTER = "letter"; const val MAP = "map"; const val WORRY = "worry"
}

/** "Raahi, help me": the toolbox opens only from that tap (12.6). Scripted tools; no generated replies. */
@Composable
internal fun Toolbox(onTool: (String) -> Unit, onSupport: () -> Unit, supportOpen: Boolean, onSupportClose: () -> Unit) {
    val c = Aiimin.colors
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(horizontal = 16.dp)) {
        Text("Pick one, or none.", style = Aiimin.type.cardTitle, modifier = Modifier.padding(top = 8.dp))
        if (supportOpen) SupportCard(Modifier.padding(top = 12.dp), onOkay = onSupportClose)
        ToolGrid("Let it out", listOf(
            Tool(AppIcons.Hourglass, "Cooling-off pen") { onTool(PourTools.COOL) },
            Tool(AppIcons.Waveform, "Say it out loud") { onTool(PourTools.SAY) },
            Tool(AppIcons.EnvelopeSimple, "Letter never sent") { onTool(PourTools.LETTER) },
        ), Modifier.padding(top = 8.dp))
        ToolGrid("Think it through", listOf(
            Tool(AppIcons.Lightbulb, "Control map") { onTool(PourTools.MAP) },
            Tool(AppIcons.Clock, "Worry time") { onTool(PourTools.WORRY) },
        ), Modifier.padding(top = 8.dp))
        ToolGrid("Settle", listOf(
            Tool(AppIcons.Leaf, "Breathe, 60 s") { onTool(PourTools.BREATHE) },
            Tool(AppIcons.Heart, "Name the feeling") { onTool(PourTools.NAME) },
            Tool(AppIcons.ChatText, "Tell someone") { onTool(PourTools.TELL) },
        ), Modifier.padding(top = 8.dp))
        Text(
            PourLines.DISCLAIMER, style = Aiimin.type.caption.copy(color = c.textMuted),
            modifier = Modifier.padding(vertical = 24.dp).clip(Shapes.control).pressable(onSupport).padding(vertical = 8.dp),
        )
    }
}

@Composable
internal fun PourTool(key: String, vm: PourViewModel, written: String, feelings: List<String>, watch: (String) -> Unit, onFeelings: (List<String>) -> Unit, onDone: () -> Unit) {
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(horizontal = 16.dp).navigationBarsPadding()) {
        when (key) {
            PourTools.BREATHE -> Breathe(onDone)
            PourTools.NAME -> NameFeeling(feelings, onFeelings, onDone)
            PourTools.TELL -> TellSomeoneTool(watch, onDone)
            PourTools.COOL -> CoolingOff(vm, watch)
            PourTools.SAY -> SayItOutLoud(vm, watch, onDone)
            PourTools.LETTER -> Letter(vm, watch)
            PourTools.MAP -> ControlMap(vm, written, watch)
            PourTools.WORRY -> WorryTime(vm, watch)
        }
        Spacer(Modifier.height(32.dp))
    }
}

@Composable
private fun ToolTitle(title: String, body: String) {
    Text(title, style = Aiimin.type.cardTitle, modifier = Modifier.padding(top = 8.dp))
    Text(body, style = Aiimin.type.body.copy(color = Aiimin.colors.textMuted), modifier = Modifier.padding(top = 4.dp, bottom = 16.dp))
}

/** Breathe: a slow circle, 4 s in and 6 s out, for 60 seconds. Reduce motion keeps the circle still and changes the words. */
@Composable
private fun Breathe(onDone: () -> Unit) {
    val c = Aiimin.colors
    val reduce = LocalReduceMotion.current
    val start = remember { System.currentTimeMillis() }
    var now by remember { mutableLongStateOf(start) }
    LaunchedEffect(Unit) { while (now - start < PourTiming.BREATHE_SECONDS * 1000L) { delay(if (reduce) 500 else 16); now = System.currentTimeMillis() } }
    val ms = now - start
    val f = PourTiming.breath(ms)
    val done = ms >= PourTiming.BREATHE_SECONDS * 1000L
    ToolTitle("Breathe", "Follow the circle. In as it grows, out as it shrinks.")
    Box(Modifier.fillMaxWidth().height(280.dp), contentAlignment = Alignment.Center) {
        Canvas(Modifier.size(260.dp)) {
            val r = size.minDimension / 2
            drawCircle(c.border, r, style = Stroke(1.dp.toPx()))
            drawCircle(c.violetSoft, r * (if (reduce) 0.7f else 0.35f + 0.65f * f))
        }
        Text(
            if (done) "Done" else if ((ms % 10_000) < 4_000) "In" else "Out",
            style = Aiimin.type.cardTitle,
        )
    }
    Text("${((PourTiming.BREATHE_SECONDS * 1000L - ms).coerceAtLeast(0) / 1000)} s", style = Aiimin.type.caption, modifier = Modifier.fillMaxWidth(), textAlign = TextAlign.Center)
    Spacer(Modifier.height(24.dp))
    AppButton(if (done) "Done" else "Stop", onDone, Modifier.fillMaxWidth(), kind = if (done) ButtonKind.PRIMARY else ButtonKind.SECONDARY)
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun NameFeeling(chosen: List<String>, onChange: (List<String>) -> Unit, onDone: () -> Unit) {
    ToolTitle("Name the feeling", "Up to three words. If you kept what you wrote, they stay with it, for you only.")
    FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Feelings.WORDS.forEach { w -> Pill(w, w in chosen, { onChange(Feelings.toggle(chosen, w)) }) }
    }
    Spacer(Modifier.height(24.dp))
    AppButton("Done", onDone, Modifier.fillMaxWidth(), enabled = true)
}

@Composable
private fun TellSomeoneTool(watch: (String) -> Unit, onDone: () -> Unit) {
    val context = LocalContext.current
    var text by rememberSaveable { mutableStateOf(TellSomeone.TEXTS.first()) }
    LaunchedEffect(text) { watch(text) }
    ToolTitle("Tell someone", "Pick words, then pick the person in your messages. You press send.")
    TellSomeone.TEXTS.forEach { t ->
        Pick(t, t == text) { text = t }
        Spacer(Modifier.height(8.dp))
    }
    AppTextField(text, { text = it }, label = "Your words")
    Spacer(Modifier.height(16.dp))
    AppButton("Choose who", {
        val send = android.content.Intent(android.content.Intent.ACTION_SEND).setType("text/plain").putExtra(android.content.Intent.EXTRA_TEXT, text)
        context.startActivity(android.content.Intent.createChooser(send, "Send to"))
        onDone()
    }, Modifier.fillMaxWidth(), enabled = text.isNotBlank(), icon = AppIcons.ChatText)
}

@Composable
private fun Pick(text: String, selected: Boolean, onClick: () -> Unit) {
    val c = Aiimin.colors
    Text(
        text, style = Aiimin.type.body,
        modifier = Modifier.fillMaxWidth().clip(Shapes.card).background(if (selected) c.raised else c.surface)
            .border(1.dp, if (selected) c.text else c.border, Shapes.card).pressable(onClick).padding(16.dp),
    )
}

private val dayTime = DateTimeFormatter.ofPattern("EEE d MMM, h:mm a", Locale.ENGLISH)
private fun at(ms: Long) = Instant.ofEpochMilli(ms).atZone(ZoneId.systemDefault())

/** Cooling-off pen: write it, AIIMIN holds it for 24 hours, then asks "Still want to send it?". It never sends. */
@Composable
private fun CoolingOff(vm: PourViewModel, watch: (String) -> Unit) {
    val scope = rememberCoroutineScope()
    val toaster = LocalToaster.current
    val context = LocalContext.current
    val held by vm.cooling.collectAsStateWithLifecycle()
    var to by rememberSaveable { mutableStateOf("") }
    var msg by rememberSaveable { mutableStateOf("") }
    LaunchedEffect(msg) { watch(msg) }
    // The clock moves while the screen is open, so a held message turns to "Still want to send it?" on time.
    var nowMs by remember { mutableLongStateOf(System.currentTimeMillis()) }
    LaunchedEffect(Unit) { while (true) { delay(30_000); nowMs = System.currentTimeMillis() } }
    ToolTitle("Cooling-off pen", "Write the message you want to send. AIIMIN holds it for a day and asks again. It never sends anything.")
    held.forEach { m ->
        val due = (m.dueAt ?: 0L) <= nowMs || m.status == "kept"
        HeldCard(m, if (due) "Still want to send it?" else "Ready to look at ${dayTime.format(at(m.dueAt!!))}") {
            if (due) {
                AppButton("Copy", {
                    val cm = context.getSystemService(android.content.Context.CLIPBOARD_SERVICE) as android.content.ClipboardManager
                    cm.setPrimaryClip(android.content.ClipData.newPlainText("message", m.text))
                    toaster.show("Copied. AIIMIN sends nothing.")
                }, compact = true, kind = ButtonKind.SECONDARY, icon = AppIcons.Copy)
                if (m.status != "kept") AppButton("Keep", { scope.launch { vm.pour.keep(m.id) } }, compact = true, kind = ButtonKind.GHOST)
            }
            AppButton("Let go", { scope.launch { vm.pour.release(m.id); toaster.show("Let go") } }, compact = true, kind = ButtonKind.GHOST)
        }
        Spacer(Modifier.height(12.dp))
    }
    if (held.isNotEmpty()) SectionHeader("A new one")
    AppTextField(to, { to = it }, label = "To", placeholder = "Who it's for")
    Spacer(Modifier.height(12.dp))
    AppTextField(msg, { msg = it }, label = "Message", placeholder = "Say all of it", singleLine = false, minLines = 5)
    Spacer(Modifier.height(16.dp))
    AppButton("Hold it for 24 hours", {
        scope.launch { vm.pour.holdMessage(to, msg); to = ""; msg = ""; toaster.show("Held. You'll be asked tomorrow.") }
    }, Modifier.fillMaxWidth(), enabled = msg.isNotBlank(), icon = AppIcons.Hourglass)
}

@Composable
private fun HeldCard(m: PourItem, status: String, sealed: Boolean = false, actions: @Composable () -> Unit) {
    val c = Aiimin.colors
    Column(Modifier.fillMaxWidth().clip(Shapes.card).background(c.surface).border(1.dp, c.border, Shapes.card).padding(16.dp)) {
        if (m.to.isNotBlank()) Text("To ${m.to}", style = Aiimin.type.label.copy(color = c.textMuted))
        Text(if (sealed) "Sealed" else m.text, style = Aiimin.type.body, maxLines = 6, modifier = Modifier.padding(top = 4.dp))
        if (status.isNotEmpty()) Text(status, style = Aiimin.type.caption, modifier = Modifier.padding(top = 8.dp))
        Row(Modifier.padding(top = 8.dp), horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) { actions() }
    }
}

/** Say it out loud: up to 60 seconds, turned into text on the phone; no audio is ever kept. Then Keep or Let go. */
@Composable
private fun SayItOutLoud(vm: PourViewModel, watch: (String) -> Unit, onDone: () -> Unit) {
    val scope = rememberCoroutineScope()
    val toaster = LocalToaster.current
    var said by rememberSaveable { mutableStateOf("") }
    LaunchedEffect(said) { watch(said) }
    ToolTitle("Say it out loud", "Hold and speak, up to a minute at a time. Only the words stay, on this phone; the sound is never saved.")
    Box(Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) { HoldToTalk(onText = { t -> said = (said.trimEnd() + " " + t).trim() }, label = "Hold and speak") }
    Spacer(Modifier.height(16.dp))
    if (said.isNotBlank()) {
        Text(said, style = Aiimin.type.journal, modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp))
        Spacer(Modifier.height(16.dp))
        Row {
            AppButton("Keep", { scope.launch { vm.keep(said, null, emptyList(), null); toaster.show("Kept privately"); onDone() } }, Modifier.weight(1f), kind = ButtonKind.SECONDARY)
            Spacer(Modifier.width(12.dp))
            AppButton("Let go", { said = ""; toaster.show("Let go") }, Modifier.weight(1f), icon = AppIcons.Leaf)
        }
    }
}

/** A letter never sent: to someone; Keep, Seal until a date, or Let go. */
@Composable
private fun Letter(vm: PourViewModel, watch: (String) -> Unit) {
    val scope = rememberCoroutineScope()
    val toaster = LocalToaster.current
    val letters by vm.letters.collectAsStateWithLifecycle()
    var to by rememberSaveable { mutableStateOf("") }
    var body by rememberSaveable { mutableStateOf("") }
    LaunchedEffect(body) { watch(body) }
    val today = LocalDate.now()
    var sealing by remember { mutableStateOf(false) }
    ToolTitle("Letter never sent", "Write to anyone, even someone who is gone. It stays here, or you let it go.")
    AppTextField(to, { to = it }, label = "Dear", placeholder = "Who it's to")
    Spacer(Modifier.height(12.dp))
    AppTextField(body, { body = it }, label = "Letter", singleLine = false, minLines = 6)
    Spacer(Modifier.height(16.dp))
    Row {
        AppButton("Keep", { scope.launch { vm.pour.keepLetter(to, body, null); body = ""; to = ""; toaster.show("Kept privately") } }, Modifier.weight(1f), kind = ButtonKind.SECONDARY, enabled = body.isNotBlank())
        Spacer(Modifier.width(8.dp))
        AppButton("Seal", { sealing = true }, Modifier.weight(1f), kind = ButtonKind.SECONDARY, enabled = body.isNotBlank())
        Spacer(Modifier.width(8.dp))
        AppButton("Let go", { body = ""; to = ""; toaster.show("Let go") }, Modifier.weight(1f), enabled = body.isNotBlank())
    }
    if (sealing) DatePick(LocalDate.now().plusMonths(1), onPick = { d ->
        sealing = false
        // A seal opens on a later day; today would open at once.
        if (!d.isAfter(today)) { toaster.show("Pick a day after today"); return@DatePick }
        scope.launch { vm.pour.keepLetter(to, body, d); body = ""; to = ""; toaster.show("Sealed until ${d.format(DateTimeFormatter.ofPattern("d MMM yyyy", Locale.ENGLISH))}") }
    }, onDismiss = { sealing = false })
    if (letters.isNotEmpty()) SectionHeader("Your letters")
    letters.forEach { l ->
        val sealed = l.sealed(today)
        HeldCard(l, if (sealed) "Opens ${l.sealUntil!!.format(DateTimeFormatter.ofPattern("d MMM yyyy", Locale.ENGLISH))}" else "Kept ${dayTime.format(at(l.createdAt))}", sealed) {
            AppButton("Let go", { scope.launch { vm.pour.release(l.id) } }, compact = true, kind = ButtonKind.GHOST)
        }
        Spacer(Modifier.height(12.dp))
    }
}

/** Control map: each worry goes to "I can act" (a task for today) or "I can't" (released). */
@Composable
private fun ControlMap(vm: PourViewModel, written: String, watch: (String) -> Unit) {
    val scope = rememberCoroutineScope()
    val toaster = LocalToaster.current
    val worries by vm.worries.collectAsStateWithLifecycle()
    var add by rememberSaveable { mutableStateOf("") }
    LaunchedEffect(add) { watch(add) }
    var gone by remember { mutableStateOf(setOf<String>()) }
    ToolTitle("Control map", "One worry at a time. If you can act, it becomes a task for today. If you can't, let it go.")
    Row(verticalAlignment = Alignment.CenterVertically) {
        AppTextField(add, { add = it }, Modifier.weight(1f), label = "A worry", placeholder = written.lineSequence().firstOrNull { it.isNotBlank() }?.take(60) ?: "What's on your mind")
        Spacer(Modifier.width(8.dp))
        AppButton("Add", { scope.launch { vm.pour.dropWorry(add); add = "" } }, compact = true, enabled = add.isNotBlank())
    }
    Spacer(Modifier.height(16.dp))
    if (worries.isEmpty()) Text("No worries in the box.", style = Aiimin.type.caption)
    worries.forEach { w ->
        AnimatedVisibility(w.id !in gone, exit = fadeOut(aiimin.designsystem.theme.Motion.exit()) + shrinkVertically(aiimin.designsystem.theme.Motion.standard())) {
            Column(Modifier.padding(bottom = 12.dp)) {
                HeldCard(w, "") {
                    AppButton("I can act", { gone = gone + w.id; vm.act(w.id) { ok -> toaster.show(if (ok) "Added to Today" else "Couldn't make a task from that") } }, compact = true)
                    AppButton("I can't", { gone = gone + w.id; vm.release(w.id); toaster.show("Let go") }, compact = true, kind = ButtonKind.SECONDARY)
                }
            }
        }
    }
}

/** Worry time: drop worries in the box any time; one daily 15-minute slot to look at them, with a reminder. */
@Composable
private fun WorryTime(vm: PourViewModel, watch: (String) -> Unit) {
    val scope = rememberCoroutineScope()
    val toaster = LocalToaster.current
    val min by vm.worryMin.collectAsStateWithLifecycle()
    val worries by vm.worries.collectAsStateWithLifecycle()
    var picking by remember { mutableStateOf(false) }
    var add by rememberSaveable { mutableStateOf("") }
    LaunchedEffect(add) { watch(add) }
    val slot = min?.let { LocalTime.of(it / 60, it % 60) }
    val open = slot != null && PourTiming.inWorryTime(slot, LocalTime.now())
    val clock = DateTimeFormatter.ofPattern("h:mm a", Locale.ENGLISH)
    ToolTitle("Worry time", if (slot == null) "Pick 15 minutes a day for worrying. Outside it, drop a worry in the box and leave it there." else if (open) "It's your worry time. 15 minutes, then put it down." else "Your worry time is ${clock.format(slot)}. Drop it in the box and come back then.")
    Row(verticalAlignment = Alignment.CenterVertically) {
        AppTextField(add, { add = it }, Modifier.weight(1f), label = "Into the box")
        Spacer(Modifier.width(8.dp))
        AppButton("Drop", { scope.launch { vm.pour.dropWorry(add); add = ""; toaster.show("In the box") } }, compact = true, enabled = add.isNotBlank())
    }
    Spacer(Modifier.height(8.dp))
    Text("${worries.size} in the box", style = Aiimin.type.caption)
    if (open) {
        Spacer(Modifier.height(12.dp))
        worries.forEach { w -> Text("· ${w.text}", style = Aiimin.type.body, modifier = Modifier.padding(vertical = 4.dp)) }
    }
    Spacer(Modifier.height(24.dp))
    AppButton(if (slot == null) "Set my worry time" else "Change time · ${clock.format(slot)}", { picking = true }, Modifier.fillMaxWidth(), kind = ButtonKind.SECONDARY, icon = AppIcons.Clock)
    if (picking) TimePick(slot ?: LocalTime.of(18, 30), onPick = { t -> picking = false; vm.setWorryTime(t.hour * 60 + t.minute) }, onDismiss = { picking = false }, onClear = if (slot != null) ({ picking = false; vm.setWorryTime(null) }) else null)
}
