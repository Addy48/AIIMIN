package aiimin.feature.onboarding

import aiimin.core.data.ai.Action
import aiimin.core.data.util.Dates
import aiimin.core.engine.raahi.RaahiMode
import aiimin.core.engine.raahi.RaahiMotion
import aiimin.core.engine.raahi.RaahiPose
import aiimin.core.engine.today.DayEndLearner
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppIconButton
import aiimin.designsystem.component.AppSheet
import aiimin.designsystem.component.AppTextField
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.ConsentText
import aiimin.designsystem.component.DatePick
import aiimin.designsystem.component.DayHorizon
import aiimin.designsystem.component.Hairline
import aiimin.designsystem.component.Pill
import aiimin.designsystem.component.Raahi
import aiimin.designsystem.component.RaahiModePicker
import aiimin.designsystem.component.RaahiSize
import aiimin.designsystem.component.TimePick
import aiimin.designsystem.component.rememberVoiceInput
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.theme.Aiimin
import aiimin.designsystem.theme.Horizons
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.TransformOrigin
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import java.time.LocalDate
import java.time.LocalTime
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

/** Raahi's one line for the screen, with its pose beside it (PRD 1.6b). With Raahi Off only the line shows. */
@Composable
internal fun RaahiSays(pose: RaahiPose, line: String, motion: RaahiMotion? = null) {
    Row(Modifier.fillMaxWidth().padding(top = 8.dp, bottom = 20.dp), verticalAlignment = Alignment.CenterVertically) {
        Raahi(pose, RaahiSize.CARD, motion = motion)
        if (aiimin.core.engine.raahi.RaahiRules.showsArt(aiimin.designsystem.component.LocalRaahiMode.current)) Spacer(Modifier.width(12.dp))
        Text(line, style = Aiimin.type.cardTitle, modifier = Modifier.weight(1f).semantics { heading() })
    }
}

private fun clockOf(min: Int): LocalTime = LocalTime.of((min / 60) % 24, min % 60)

// ------------------------------------------------------------------ 1 Hello

@Composable
fun ColumnScope.HelloPage() {
    val c = Aiimin.colors
    Spacer(Modifier.height(8.dp))
    Row(verticalAlignment = Alignment.CenterVertically) {
        aiimin.designsystem.component.BrandMark(size = 26.dp)
        Spacer(Modifier.width(8.dp))
        Text("AIIMIN", style = Aiimin.type.headline.copy(fontWeight = FontWeight.Bold, letterSpacing = 1.8.sp))
    }
    Raahi(RaahiPose.WAVING, RaahiSize.HERO, Modifier.align(Alignment.CenterHorizontally).padding(top = 16.dp), motion = RaahiMotion.WAVE)
    Text(
        "Welcome to AIIMIN. I'm Raahi, an AI that walks your day with you.",
        // Hero screens are one centred composition: Raahi and the words share the centre line.
        style = Aiimin.type.title.copy(letterSpacing = (-0.4).sp, textAlign = TextAlign.Center),
        modifier = Modifier.fillMaxWidth().padding(top = 16.dp).semantics { heading() },
    )
    Text("It only ever compares you with you.", style = Aiimin.type.body.copy(color = c.textMuted, textAlign = TextAlign.Center), modifier = Modifier.fillMaxWidth().padding(top = 8.dp))
}

@Composable
fun AboutYouPage(d: Draft, onName: (String) -> Unit, onDob: (LocalDate) -> Unit, onCountry: (String) -> Unit) {
    val c = Aiimin.colors
    var picking by remember { mutableStateOf(false) }
    var country by remember { mutableStateOf(false) }
    val guessed = remember { d.country }
    RaahiSays(RaahiPose.WAVING, "What should I call you?")
    AppTextField(d.name, { onName(it.split(" ").joinToString(" ") { w -> w.replaceFirstChar(Char::uppercase) }) }, label = "First name", placeholder = "Meera")
    Text("Just a first name is fine.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 8.dp))
    // Country is guessed from the SIM, network or language; the screen only confirms it (1.6).
    Row(Modifier.fillMaxWidth().padding(top = 16.dp).heightIn(min = 48.dp), verticalAlignment = Alignment.CenterVertically) {
        Text("Country", style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.width(96.dp))
        Text(countryName(d.country), style = Aiimin.type.bodyStrong, modifier = Modifier.weight(1f))
        Text("Change", style = Aiimin.type.label.copy(color = c.link), modifier = Modifier.clickable { country = true }.padding(12.dp))
    }
    Spacer(Modifier.height(8.dp))
    Text("Date of birth", style = Aiimin.type.label.copy(color = c.textMuted), modifier = Modifier.padding(bottom = 8.dp))
    Row(
        Modifier.fillMaxWidth().heightIn(min = 52.dp).clip(RoundedCornerShape(8.dp)).background(c.surface)
            .border(1.dp, c.borderStrong, RoundedCornerShape(8.dp)).clickable { picking = true }.padding(horizontal = 16.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(AppIcons.Calendar, null, tint = c.textMuted, modifier = Modifier.size(20.dp))
        Spacer(Modifier.width(12.dp))
        Text(d.dobDate?.let { Dates.dayMonthOf(it) + " " + it.year } ?: "Choose a date", style = Aiimin.type.body.copy(color = if (d.dob == null) c.textFaint else c.text))
    }
    Text("AIIMIN is for people 18 and over. Only your age group is kept, never the date.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 8.dp))
    if (picking) DatePick(d.dobDate ?: LocalDate.now().minusYears(25), { onDob(it); picking = false }, { picking = false })
    if (country) AppSheet({ country = false }, title = "Country") {
        Text("AIIMIN is set up for India first. Other countries open one at a time, each after its own review.", style = Aiimin.type.body)
        Row(Modifier.padding(top = 12.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            (listOf("IN") + listOfNotNull(guessed.takeIf { it != "IN" })).distinct().forEach { code ->
                Pill(countryName(code), d.country == code, { onCountry(code); country = false })
            }
        }
        Spacer(Modifier.height(16.dp))
    }
}

internal fun countryName(code: String): String = java.util.Locale.Builder().setRegion(code).build().getDisplayCountry(java.util.Locale.ENGLISH).ifBlank { code }

// ------------------------------------------------------------------ 2 Your day

@Composable
fun YourDayPage(d: Draft, onWake: (Int) -> Unit, onSleep: (Int) -> Unit) {
    val c = Aiimin.colors
    var pick by remember { mutableStateOf<String?>(null) }
    RaahiSays(RaahiPose.IDLE, "When do you wake and sleep? I'll draw your day.")
    // The arc draws again whenever a time changes (Part 26.5: the day-arc moment).
    key(d.wakeMin, d.sleepMin) {
        DayHorizon(
            nowMinute = d.sleepMin, ticks = emptyList(), horizon = Horizons.at(12, false),
            wakeMinute = d.wakeMin, sleepMinute = d.sleepMin,
            description = "Your day from ${Dates.clock(clockOf(d.wakeMin))} to ${Dates.clock(clockOf(d.sleepMin))}",
        )
    }
    Spacer(Modifier.height(12.dp))
    listOf("wake" to ("I wake up" to d.wakeMin), "sleep" to ("I go to sleep" to d.sleepMin)).forEach { (k, v) ->
        Row(Modifier.fillMaxWidth().clickable { pick = k }.heightIn(min = 56.dp), verticalAlignment = Alignment.CenterVertically) {
            Icon(if (k == "wake") AppIcons.Sun else AppIcons.MoonStars, null, tint = c.text, modifier = Modifier.size(24.dp))
            Spacer(Modifier.width(16.dp))
            Text(v.first, style = Aiimin.type.body, modifier = Modifier.weight(1f))
            Text(Dates.clock(clockOf(v.second)), style = Aiimin.type.bodyStrong)
        }
        Hairline()
    }
    val dayEnd = DayEndLearner.fromSleep(clockOf(d.sleepMin))
    Text("Your day closes at ${Dates.clock(dayEnd)}, an hour before sleep. You can change it in Settings.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 12.dp))
    pick?.let { k ->
        TimePick(clockOf(if (k == "wake") d.wakeMin else d.sleepMin), { t ->
            val m = t.hour * 60 + t.minute
            if (k == "wake") onWake(m) else onSleep(m)
            pick = null
        }, { pick = null })
    }
}

// ------------------------------------------------------------------ 3 Minimums

@Composable
fun MinimumsPage(d: Draft, onChange: (List<MinPick>) -> Unit) {
    val c = Aiimin.colors
    var adding by remember { mutableStateOf(false) }
    var own by remember { mutableStateOf("") }
    var ownTiny by remember { mutableStateOf("") }
    var note by remember { mutableStateOf<String?>(null) }
    RaahiSays(RaahiPose.NOTICING, "Pick up to three small things for every day.")
    Text("Small enough for a bad day. Each has a tiny version for days with little left.", style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(bottom = 8.dp))
    val rows = SUGGESTED_MINS + d.mins.filter { m -> SUGGESTED_MINS.none { it.title == m.title } }
    rows.forEach { m ->
        val on = d.mins.any { it.title == m.title }
        Row(
            Modifier.fillMaxWidth().clickable {
                if (on) { onChange(d.mins.filter { it.title != m.title }); note = null }
                else if (d.mins.size >= MAX_MINS) note = "Three is the most. Untick one first."
                else { onChange(d.mins + m); note = null }
            }.heightIn(min = 64.dp).padding(vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(
                Modifier.size(24.dp).clip(RoundedCornerShape(6.dp)).background(if (on) c.text else c.base).border(1.5.dp, if (on) c.text else c.textFaint, RoundedCornerShape(6.dp)),
                contentAlignment = Alignment.Center,
            ) { if (on) Icon(AppIcons.Check, null, tint = c.base, modifier = Modifier.size(16.dp)) }
            Spacer(Modifier.width(16.dp))
            Column {
                Text(m.title, style = Aiimin.type.body.copy(color = c.text, fontWeight = FontWeight.Medium))
                if (m.tiny.isNotBlank()) Text("Tiny version: ${m.tiny}", style = Aiimin.type.caption)
            }
        }
        Hairline()
    }
    if (note != null) Text(note!!, style = Aiimin.type.note.copy(color = c.warn), modifier = Modifier.padding(top = 12.dp))
    if (!adding) {
        Row(Modifier.fillMaxWidth().clickable { adding = true }.heightIn(min = 56.dp), verticalAlignment = Alignment.CenterVertically) {
            Icon(AppIcons.Plus, null, tint = c.text, modifier = Modifier.size(24.dp))
            Spacer(Modifier.width(16.dp))
            Text("Your own…", style = Aiimin.type.body.copy(color = c.text))
        }
    } else {
        Column(Modifier.padding(top = 12.dp)) {
            AppTextField(own, { own = it }, label = "Minimum", placeholder = "Call Mom")
            Spacer(Modifier.height(8.dp))
            AppTextField(ownTiny, { ownTiny = it }, label = "Tiny version (optional)", placeholder = "Send a message")
            Spacer(Modifier.height(12.dp))
            AppButton("Add", {
                if (own.isNotBlank()) {
                    if (d.mins.size >= MAX_MINS) note = "Three is the most. Untick one first."
                    else { onChange(d.mins + MinPick(own.trim(), ownTiny.trim())); own = ""; ownTiny = ""; adding = false; note = null }
                }
            }, compact = true, enabled = own.isNotBlank())
        }
    }
    Text("${d.mins.size} of $MAX_MINS picked", style = Aiimin.type.caption, modifier = Modifier.padding(top = 12.dp))
}

// ------------------------------------------------------------------ 4 Try capture

/** The example Raahi offers (1.6b screen 4). */
internal const val TRY_EXAMPLE = "spend 240 on lunch and call Ravi at 5"

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun TryCapturePage(
    saved: String?,
    preview: suspend (String) -> List<Action>,
    save: suspend (List<Action>) -> String,
    onSaved: (String) -> Unit,
) {
    val c = Aiimin.colors
    val scope = rememberCoroutineScope()
    var text by remember { mutableStateOf("") }
    var cards by remember { mutableStateOf<List<Action>>(emptyList()) }
    var listening by remember { mutableStateOf(false) }
    var nodded by remember { mutableStateOf(false) }
    // Live chips, as in the "+" sheet: the same engine reads the line as it is typed.
    LaunchedEffect(text) {
        if (text.isBlank()) { cards = emptyList(); return@LaunchedEffect }
        delay(250)
        cards = preview(text)
    }
    val voice = rememberVoiceInput(onText = { listening = false; text = it }, onUnavailable = { listening = false }, onListening = { listening = it })
    RaahiSays(
        if (saved != null) RaahiPose.NODDING else RaahiPose.THINKING,
        if (saved != null) "Saved." else "Try it: spend 240 on lunch and call Ravi at 5.",
        motion = if (saved != null && nodded) RaahiMotion.NOD else null,
    )
    if (saved != null) {
        Row(Modifier.fillMaxWidth().clip(RoundedCornerShape(12.dp)).background(c.surface).border(1.dp, c.border, RoundedCornerShape(12.dp)).padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
            Icon(AppIcons.CheckCircle, null, tint = c.done, modifier = Modifier.size(24.dp))
            Spacer(Modifier.width(12.dp))
            Column {
                Text(saved, style = Aiimin.type.headline)
                Text("It's on your Today. Everything can be undone.", style = Aiimin.type.caption)
            }
        }
        return
    }
    Row(verticalAlignment = Alignment.CenterVertically) {
        AppTextField(text, { text = it }, placeholder = "Type or say it", singleLine = false, modifier = Modifier.weight(1f))
        AppIconButton(AppIcons.Mic, if (listening) "Stop listening" else "Speak", { voice() })
    }
    if (text.isBlank()) Pill("Use the example", false, { text = TRY_EXAMPLE }, modifier = Modifier.padding(top = 12.dp))
    if (cards.isNotEmpty()) {
        FlowRow(Modifier.padding(top = 16.dp), horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            cards.forEach { a ->
                Column(Modifier.clip(RoundedCornerShape(12.dp)).background(c.paper).border(1.dp, c.border, RoundedCornerShape(12.dp)).padding(horizontal = 16.dp, vertical = 12.dp)) {
                    Text(a.headline, style = Aiimin.type.bodyStrong)
                    Text(a.label, style = Aiimin.type.caption)
                }
            }
        }
        AppButton("Save", {
            scope.launch {
                save(cards)
                nodded = true
                onSaved(cards.joinToString(", ") { it.headline })
            }
        }, Modifier.fillMaxWidth().padding(top = 16.dp))
    }
}

// ------------------------------------------------------------------ 5 Bank SMS

@Composable
fun BankSmsPage(granted: Boolean) {
    val c = Aiimin.colors
    RaahiSays(RaahiPose.IDLE, "Optional. I read bank texts on this phone only.")
    // Part 23, word for word, before Android's own prompt.
    Text(ConsentText.READ_SMS, style = Aiimin.type.body)
    if (granted) Row(Modifier.padding(top = 16.dp), verticalAlignment = Alignment.CenterVertically) {
        Icon(AppIcons.Check, null, tint = c.done, modifier = Modifier.size(20.dp))
        Spacer(Modifier.width(8.dp))
        Text("Allowed. New bank accounts are offered to you, never added on their own.", style = Aiimin.type.label.copy(color = c.done))
    }
}

// ------------------------------------------------------------------ 6 Chattiness

@Composable
fun ChattinessPage(mode: RaahiMode, onPick: (RaahiMode) -> Unit, playful: Boolean, onPlayful: (Boolean) -> Unit) {
    RaahiSays(RaahiPose.IDLE, "How much should I talk? Quiet is my default.")
    RaahiModePicker(mode, onPick)
    Text("No sound in any mode. Change it any time in Settings › Raahi.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 12.dp))
    // PRD 2.1: the Playful switch is offered here; money, documents and safety stay plain.
    Spacer(Modifier.height(16.dp))
    aiimin.designsystem.component.SwitchRow("Playful lines", playful, onPlayful, subtitle = "A little wit on small nudges. Money, documents and safety stay plain.")
}

/** The notification groups on the onboarding sheet (PRD 2.1); reminders are always on. */
@Composable
internal fun NotifyGroups(billsDocs: Boolean, brief: Boolean, wrapUp: Boolean, nudges: Boolean, save: ((aiimin.core.data.settings.AppSettings) -> aiimin.core.data.settings.AppSettings) -> Unit) {
    Text("Your reminders always arrive. Pick the rest:", style = Aiimin.type.bodyStrong, modifier = Modifier.padding(top = 12.dp, bottom = 4.dp))
    aiimin.designsystem.component.SwitchRow("Bills and documents", billsDocs, { v -> save { it.copy(notifyBillsDocs = v) } })
    aiimin.designsystem.component.SwitchRow("Morning brief", brief, { v -> save { it.copy(notifyBrief = v) } })
    aiimin.designsystem.component.SwitchRow("Evening wrap-up", wrapUp, { v -> save { it.copy(notifyWrapUp = v) } })
    aiimin.designsystem.component.SwitchRow("Nudges", nudges, { v -> save { it.copy(notifyNudges = v) } }, subtitle = "One a day to start")
    Spacer(Modifier.height(12.dp))
}

// ------------------------------------------------------------------ 7 Done

@Composable
fun ColumnScope.DonePage(d: Draft, shrink: Float) {
    val c = Aiimin.colors
    // Raahi shrinks from hero size into its 28 dp place beside the clock (Part 20.3 #12), then Today opens.
    val scale = 1f - (1f - RaahiSize.MINI.dp.value / RaahiSize.HERO.dp.value) * shrink
    Raahi(
        RaahiPose.IDLE, RaahiSize.HERO,
        Modifier.align(Alignment.CenterHorizontally).padding(top = 16.dp).shrinkToSlot(scale, shrink),
    )
    // With Raahi Off there is nothing beside the clock, so the line does not promise it.
    val off = !aiimin.core.engine.raahi.RaahiRules.showsArt(aiimin.designsystem.component.LocalRaahiMode.current)
    Text(if (off) "That's it. Your day is ready." else "That's it. I'll be here beside the clock.", style = Aiimin.type.title.copy(textAlign = TextAlign.Center), modifier = Modifier.fillMaxWidth().padding(top = 16.dp).semantics { heading() })
    val dayEnd = DayEndLearner.fromSleep(clockOf(d.sleepMin))
    Column(Modifier.fillMaxWidth().padding(top = 16.dp), verticalArrangement = Arrangement.spacedBy(8.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        Text("Your day: ${Dates.clock(clockOf(d.wakeMin))} to ${Dates.clock(clockOf(d.sleepMin))}, closing at ${Dates.clock(dayEnd)}.", style = Aiimin.type.body.copy(color = c.textMuted, textAlign = TextAlign.Center))
        Text(if (d.mins.isEmpty()) "No minimums yet. Add them any time." else "Minimums: " + d.mins.joinToString(", ") { it.title } + ".", style = Aiimin.type.body.copy(color = c.textMuted, textAlign = TextAlign.Center))
        d.firstWin?.let { Text("On your Today: $it.", style = Aiimin.type.body.copy(color = c.textMuted, textAlign = TextAlign.Center)) }
    }
}

/** Scale toward the top end, where the clock's Raahi slot is, and fade the last stretch. Transform and opacity only. */
private fun Modifier.shrinkToSlot(scale: Float, t: Float): Modifier = graphicsLayer {
    scaleX = scale; scaleY = scale
    // Mini stands beside "AM", a little left of the screen's centre, so the hero shrinks toward that point.
    transformOrigin = TransformOrigin(0.3f, 0f)
    translationY = -t * size.height * 0.4f
    alpha = 1f - (t - 0.8f).coerceAtLeast(0f) * 5f
}

// ------------------------------------------------------------------ Under 18

@Composable
fun UnderAgePage(eighteenth: LocalDate?, onPrint: () -> Unit, onRemind: (LocalDate) -> Unit, onClose: () -> Unit) {
    val c = Aiimin.colors
    Column(Modifier.fillMaxWidth().padding(horizontal = 24.dp).padding(top = 48.dp)) {
        Raahi(RaahiPose.IDLE, RaahiSize.HERO, Modifier.align(Alignment.CenterHorizontally))
        // Part 23, word for word.
        Text(ConsentText.UNDER_18, style = Aiimin.type.cardTitle.copy(textAlign = TextAlign.Center), modifier = Modifier.fillMaxWidth().padding(top = 16.dp))
        Text("For a parent: nothing about your child was saved on this phone.", style = Aiimin.type.body.copy(color = c.textMuted, textAlign = TextAlign.Center), modifier = Modifier.fillMaxWidth().padding(top = 12.dp))
        Spacer(Modifier.height(24.dp))
        AppButton("Print the Start Small planner", onPrint, Modifier.fillMaxWidth(), kind = ButtonKind.SECONDARY)
        if (eighteenth != null) {
            Spacer(Modifier.height(12.dp))
            AppButton("Remind me on my 18th birthday", { onRemind(eighteenth) }, Modifier.fillMaxWidth(), kind = ButtonKind.SECONDARY)
        }
        Spacer(Modifier.height(12.dp))
        AppButton("Close", onClose, Modifier.fillMaxWidth())
    }
}
