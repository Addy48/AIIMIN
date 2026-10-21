package aiimin.feature.notes

import aiimin.core.data.notes.JournalRepository
import aiimin.core.data.notes.PourItem
import aiimin.core.data.notes.PourRepository
import aiimin.core.data.settings.SettingsStore
import aiimin.core.engine.pour.Feelings
import aiimin.core.engine.pour.Helplines
import aiimin.core.engine.pour.PourLines
import aiimin.core.engine.pour.SafetyCheck
import aiimin.core.engine.raahi.RaahiPose
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppIconButton
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.nav.LocalToaster
import aiimin.designsystem.component.Raahi
import aiimin.designsystem.component.RaahiSize
import aiimin.designsystem.component.pressable
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.theme.Aiimin
import aiimin.designsystem.theme.LocalReduceMotion
import aiimin.designsystem.theme.Motion
import aiimin.designsystem.theme.Shapes
import android.app.Activity
import android.view.WindowManager
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
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
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.time.LocalDate
import javax.inject.Inject

@HiltViewModel
class PourViewModel @Inject constructor(
    private val journal: JournalRepository,
    val pour: PourRepository,
    private val settings: SettingsStore,
) : ViewModel() {
    val entries = journal.entries.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)
    val worryMin = settings.settings.map { it.worryMin }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)
    val cooling = pour.items(PourRepository.KIND_COOL).stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    val letters = pour.items(PourRepository.KIND_LETTER).stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    val worries = pour.items(PourRepository.KIND_WORRY).stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList<PourItem>())

    /** Keep: saved privately, encrypted; feelings ride along as tags. Nothing is scored. */
    suspend fun keep(text: String, mood: Int?, feelings: List<String>, id: String?): String = journal.save(text, mood, feelings.map { it.lowercase() }, id).id
    suspend fun letGo(id: String?) { id?.let { journal.letGo(it) } }
    fun setWorryTime(min: Int?) = viewModelScope.launch { settings.update { it.copy(worryMin = min) } }
}

/** Where Pour is in its one flow (12.2, 12.6). */
internal enum class PourStep { WRITE, PUT_DOWN, CHOICE, TOOLBOX, TOOL, CLOSE }

/**
 * Pour (PRD Part 12): a quiet page and a cursor. Write or talk, then Keep or Let go, then "Just me" or
 * "Raahi, help me". Screenshots are blocked while it is open; one tap hides it; nothing here reaches notifications,
 * the widget, search, the score or any AI.
 */
@Composable
fun PourScreen(id: String?, prefill: String? = null, tool: String? = null, vm: PourViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val context = LocalContext.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    val reduce = LocalReduceMotion.current
    val c = Aiimin.colors
    val entries by vm.entries.collectAsStateWithLifecycle()
    val existing = entries?.firstOrNull { it.id == id }
    var text by rememberSaveable(existing?.id) { mutableStateOf(existing?.text ?: prefill.orEmpty()) }
    var savedId by rememberSaveable { mutableStateOf(id) }
    var step by rememberSaveable { mutableStateOf(if (tool != null) PourStep.TOOL else PourStep.WRITE) }
    var openTool by rememberSaveable { mutableStateOf(tool) }
    var feelings by rememberSaveable { mutableStateOf(existing?.tags?.map { t -> t.replaceFirstChar { it.uppercase() } }.orEmpty()) }
    var line by rememberSaveable { mutableStateOf<String?>(null) }
    var supportShown by rememberSaveable { mutableStateOf(false) }
    var supportOpen by rememberSaveable { mutableStateOf(false) }
    var timerMin by rememberSaveable { mutableStateOf(0) }
    val today = LocalDate.now()

    // 12.3: screenshots blocked and the recents thumbnail blank while Pour is open.
    DisposableEffect(Unit) {
        val w = (context as? Activity)?.window
        w?.addFlags(WindowManager.LayoutParams.FLAG_SECURE)
        onDispose { w?.clearFlags(WindowManager.LayoutParams.FLAG_SECURE) }
    }
    // 12.3: the local check, read only. It shows the card once per visit and never blocks the page.
    LaunchedEffect(text) {
        if (supportShown || text.length < 6) return@LaunchedEffect
        delay(500)
        if (SafetyCheck.flags(text)) { supportShown = true; supportOpen = true }
    }
    // The release (Let go): the words lift and fade; reduce motion only fades.
    val release = remember { Animatable(0f) }
    val lift = with(LocalDensity.current) { 48.dp.toPx() }

    fun close() { step = PourStep.CLOSE; line = PourLines.pick(PourLines.CLOSE, today) }

    Box(
        Modifier.fillMaxSize().background(c.base)
            // The faint sky tint (12.2): the day's band colour fading into the page.
            .background(Brush.verticalGradient(0f to c.band.copy(alpha = 0.55f), 0.45f to c.base)),
    ) {
        Column(Modifier.fillMaxSize().statusBarsPadding().imePadding()) {
            // Top: back, the gentle timer and quick hide. No title, no counter.
            Row(Modifier.fillMaxWidth().padding(horizontal = 4.dp, vertical = 4.dp), verticalAlignment = Alignment.CenterVertically) {
                AppIconButton(AppIcons.ArrowLeft, "Back", {
                    when (step) {
                        PourStep.TOOL -> { step = if (tool != null) PourStep.CLOSE else PourStep.TOOLBOX; openTool = null; if (tool != null) nav.back() }
                        PourStep.TOOLBOX -> step = PourStep.CHOICE
                        PourStep.PUT_DOWN -> step = PourStep.WRITE
                        else -> nav.back()
                    }
                }, tint = c.textMuted)
                Spacer(Modifier.weight(1f))
                if (step == PourStep.WRITE) {
                    Text(
                        when (timerMin) { 0 -> "Timer"; else -> "$timerMin min" },
                        style = Aiimin.type.label.copy(color = c.textMuted),
                        modifier = Modifier.clip(Shapes.control).pressable({ timerMin = when (timerMin) { 0 -> 5; 5 -> 10; else -> 0 } }).padding(horizontal = 12.dp, vertical = 10.dp),
                    )
                }
                AppIconButton(AppIcons.EyeSlash, "Hide now", { (context as? Activity)?.moveTaskToBack(true) }, tint = c.textMuted)
            }
            if (step == PourStep.WRITE && timerMin > 0) GentleTimer(timerMin, reduce)

            AnimatedContent(
                step,
                transitionSpec = {
                    if (reduce) fadeIn(Motion.reducedFade()) togetherWith fadeOut(Motion.reducedFade())
                    else (fadeIn(Motion.standard(60)) + slideInVertically(Motion.standard(60)) { it / 16 }) togetherWith fadeOut(Motion.exit())
                },
                modifier = Modifier.weight(1f),
                label = "pour",
            ) { s ->
                when (s) {
                    PourStep.WRITE, PourStep.PUT_DOWN -> Column(Modifier.fillMaxSize()) {
                        Row(Modifier.padding(horizontal = 24.dp, vertical = 4.dp), verticalAlignment = Alignment.CenterVertically) {
                            Raahi(RaahiPose.LISTENING, RaahiSize.MINI)
                            Spacer(Modifier.width(10.dp))
                            Text(PourLines.pick(PourLines.OPEN, today), style = Aiimin.type.caption.copy(color = c.textMuted))
                        }
                        if (supportOpen) SupportCard(Modifier.padding(horizontal = 16.dp, vertical = 8.dp), onOkay = { supportOpen = false })
                        val focus = remember { FocusRequester() }
                        LaunchedEffect(Unit) { if (s == PourStep.WRITE && text.isEmpty()) runCatching { focus.requestFocus() } }
                        BasicTextField(
                            text, { if (s == PourStep.WRITE) text = it },
                            textStyle = Aiimin.type.journal,
                            cursorBrush = SolidColor(c.accent),
                            readOnly = s != PourStep.WRITE,
                            modifier = Modifier.weight(1f).fillMaxWidth().verticalScroll(rememberScrollState()).padding(horizontal = 24.dp, vertical = 16.dp)
                                .focusRequester(focus)
                                .graphicsLayer { alpha = 1f - release.value; translationY = if (reduce) 0f else -lift * release.value },
                        )
                    }
                    PourStep.CHOICE -> ChoiceStep(line, onJustMe = { close() }, onHelp = { step = PourStep.TOOLBOX })
                    PourStep.TOOLBOX -> Toolbox(onTool = { openTool = it; step = PourStep.TOOL }, onSupport = { supportOpen = true }, supportOpen = supportOpen, onSupportClose = { supportOpen = false })
                    PourStep.TOOL -> PourTool(
                        openTool.orEmpty(), vm, text, feelings,
                        onFeelings = { f ->
                            feelings = f
                            scope.launch { if (savedId != null) savedId = vm.keep(text, existing?.mood, f, savedId) }
                        },
                        onDone = { if (tool != null) nav.back() else { step = PourStep.TOOLBOX; openTool = null } },
                    )
                    PourStep.CLOSE -> CloseStep(line.orEmpty(), onDone = { nav.back() })
                }
            }

            // The put-down bar: one action at a time, at the bottom edge.
            if (step == PourStep.WRITE) {
                BottomBar {
                    HoldToTalk(onText = { t -> text = (text.trimEnd() + " " + t).trim() })
                    Spacer(Modifier.weight(1f))
                    AppButton("Put it down", { step = PourStep.PUT_DOWN }, enabled = text.isNotBlank())
                }
            } else if (step == PourStep.PUT_DOWN) {
                BottomBar {
                    AppButton("Keep", {
                        scope.launch {
                            savedId = vm.keep(text, existing?.mood, feelings, savedId)
                            toaster.show("Kept privately")
                            line = null; step = PourStep.CHOICE
                        }
                    }, Modifier.weight(1f), kind = ButtonKind.SECONDARY)
                    Spacer(Modifier.width(12.dp))
                    // Let go is the highlighted default (12.2).
                    AppButton("Let go", {
                        scope.launch {
                            release.animateTo(1f, if (reduce) Motion.reducedFade() else Motion.release())
                            vm.letGo(savedId)
                            savedId = null; text = ""
                            release.snapTo(0f)
                            line = PourLines.pick(PourLines.LET_GO, today); step = PourStep.CHOICE
                        }
                    }, Modifier.weight(1f), icon = AppIcons.Leaf)
                }
            }
        }
    }
}

@Composable
private fun BottomBar(content: @Composable androidx.compose.foundation.layout.RowScope.() -> Unit) {
    Row(
        Modifier.fillMaxWidth().navigationBarsPadding().padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically, content = content,
    )
}

/** The optional 5 or 10 minute timer: a thin line that fills, never a countdown number (12.2). */
@Composable
private fun GentleTimer(minutes: Int, reduce: Boolean) {
    val c = Aiimin.colors
    val start = remember(minutes) { System.currentTimeMillis() }
    var now by remember { mutableLongStateOf(System.currentTimeMillis()) }
    LaunchedEffect(minutes) { while (true) { now = System.currentTimeMillis(); delay(if (reduce) 5_000 else 500) } }
    val f = ((now - start) / (minutes * 60_000f)).coerceIn(0f, 1f)
    Canvas(Modifier.fillMaxWidth().height(6.dp).padding(horizontal = 24.dp)) {
        val y = size.height / 2
        drawLine(c.border, Offset(0f, y), Offset(size.width, y), 2.dp.toPx(), StrokeCap.Round)
        drawLine(c.textMuted, Offset(0f, y), Offset(size.width * f, y), 2.dp.toPx(), StrokeCap.Round)
    }
}

/** Hold to talk: speech is turned into text on the phone; no audio is kept. */
@Composable
internal fun HoldToTalk(onText: (String) -> Unit, label: String = "Hold to talk") {
    val c = Aiimin.colors
    val toaster = LocalToaster.current
    var listening by remember { mutableStateOf(false) }
    val voice = aiimin.designsystem.component.rememberVoiceInput(
        "Speak", onText = onText, onListening = { listening = it },
        onUnavailable = { toaster.show("Speech isn't available on this phone. An offline speech pack in Android settings adds it.") },
    )
    Row(
        Modifier.clip(Shapes.control).background(if (listening) c.accentSoft else c.surface).border(1.dp, if (listening) c.accent else c.border, Shapes.control)
            .pointerInput(Unit) { detectTapGestures(onPress = { voice(); tryAwaitRelease(); if (listening) voice() }) }
            .padding(horizontal = 14.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(AppIcons.Mic, null, tint = if (listening) c.accentText else c.text, modifier = Modifier.size(18.dp))
        Spacer(Modifier.width(8.dp))
        Text(if (listening) "Listening…" else label, style = Aiimin.type.label)
    }
}

@Composable
private fun ChoiceStep(line: String?, onJustMe: () -> Unit, onHelp: () -> Unit) {
    val c = Aiimin.colors
    Column(Modifier.fillMaxSize().padding(horizontal = 24.dp), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
        Raahi(RaahiPose.LISTENING, RaahiSize.CARD, description = "Raahi")
        Spacer(Modifier.height(16.dp))
        Text(line ?: "Put down. What now?", style = Aiimin.type.cardTitle, textAlign = TextAlign.Center)
        Spacer(Modifier.height(32.dp))
        ChoiceCard("Just me", "That's all for now.", onJustMe)
        Spacer(Modifier.height(12.dp))
        ChoiceCard("Raahi, help me", "A few small tools: breathe, name it, write a letter, sort worries.", onHelp)
        Spacer(Modifier.height(24.dp))
        Text(PourLines.DISCLAIMER.substringBefore(" For"), style = Aiimin.type.caption.copy(color = c.textFaint), textAlign = TextAlign.Center)
    }
}

@Composable
private fun ChoiceCard(title: String, body: String, onClick: () -> Unit) {
    val c = Aiimin.colors
    Column(
        Modifier.fillMaxWidth().clip(Shapes.card).background(c.surface).border(1.dp, c.border, Shapes.card).pressable(onClick).padding(16.dp),
    ) {
        Text(title, style = Aiimin.type.bodyStrong)
        Text(body, style = Aiimin.type.caption, modifier = Modifier.padding(top = 2.dp))
    }
}

@Composable
private fun CloseStep(line: String, onDone: () -> Unit) {
    LaunchedEffect(Unit) { delay(2_600); onDone() }
    Column(Modifier.fillMaxSize().padding(horizontal = 32.dp), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
        aiimin.designsystem.component.RaahiScenePicture(aiimin.core.engine.raahi.RaahiScene.SITTING_SUNSET, 200.dp)
        Spacer(Modifier.height(20.dp))
        Text(line, style = Aiimin.type.cardTitle, textAlign = TextAlign.Center)
        Spacer(Modifier.height(24.dp))
        AppButton("Back to my day", onDone, kind = ButtonKind.GHOST)
    }
}

/**
 * The support card (12.3): helplines for the phone's country from the dataset, a Call button that opens the
 * dialer (the person taps to call), and "I'm okay, go back". It never blocks the page and stores nothing.
 */
@Composable
internal fun SupportCard(modifier: Modifier = Modifier, onOkay: () -> Unit) {
    val c = Aiimin.colors
    val context = LocalContext.current
    val country = remember { countryOf(context) }
    val help = remember(country) { Helplines.forCountry(country) }
    fun dial(n: String) = runCatching {
        context.startActivity(android.content.Intent(android.content.Intent.ACTION_DIAL, android.net.Uri.parse("tel:" + n.filter { it.isDigit() || it == '+' })))
    }
    Column(modifier.fillMaxWidth().clip(Shapes.card).background(c.surface).border(1.dp, c.borderStrong, Shapes.card).padding(16.dp)) {
        Text(PourLines.CARD_TITLE, style = Aiimin.type.bodyStrong)
        Text(PourLines.CARD_BODY, style = Aiimin.type.body.copy(color = c.textMuted))
        Spacer(Modifier.height(12.dp))
        if (help == null) {
            Text(Helplines.UNKNOWN, style = Aiimin.type.caption)
        } else {
            help.lines.take(2).forEach { h ->
                Row(Modifier.fillMaxWidth().padding(vertical = 4.dp), verticalAlignment = Alignment.CenterVertically) {
                    Column(Modifier.weight(1f)) {
                        Text(h.name, style = Aiimin.type.label, maxLines = 2)
                        Text(h.number, style = Aiimin.type.caption.copy(fontFeatureSettings = "tnum"))
                    }
                    AppButton("Call", { dial(h.dial) }, compact = true, icon = AppIcons.Phone)
                }
            }
            help.emergency?.let { e ->
                Row(Modifier.fillMaxWidth().padding(vertical = 4.dp), verticalAlignment = Alignment.CenterVertically) {
                    Text("Emergency · $e", style = Aiimin.type.label, modifier = Modifier.weight(1f))
                    AppButton("Call", { dial(e.split(' ').first()) }, compact = true, kind = ButtonKind.SECONDARY)
                }
            }
        }
        Spacer(Modifier.height(8.dp))
        AppButton("I'm okay, go back", onOkay, kind = ButtonKind.GHOST, compact = true)
    }
}

/** The dataset's country rule: SIM, then network, then the phone's region. */
private fun countryOf(context: android.content.Context): String? {
    val tm = context.getSystemService(android.content.Context.TELEPHONY_SERVICE) as? android.telephony.TelephonyManager
    return tm?.simCountryIso?.takeIf { it.isNotBlank() } ?: tm?.networkCountryIso?.takeIf { it.isNotBlank() }
        ?: java.util.Locale.getDefault().country.takeIf { it.isNotBlank() }
}

