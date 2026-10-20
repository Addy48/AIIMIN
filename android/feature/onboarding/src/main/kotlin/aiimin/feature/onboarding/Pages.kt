package aiimin.feature.onboarding

import aiimin.core.data.ai.Action
import aiimin.core.data.device.SensorAccess
import aiimin.core.data.util.Dates
import aiimin.core.engine.BatteryMode
import aiimin.core.sensing.HealthAvailability
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppIconButton
import aiimin.designsystem.component.AppSheet
import aiimin.designsystem.component.AppTextField
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.DatePick
import aiimin.designsystem.component.Hairline
import aiimin.designsystem.component.SwitchRow
import aiimin.designsystem.component.rememberVoiceInput
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.theme.Aiimin
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import java.text.NumberFormat
import java.time.LocalDate
import java.util.Locale
import kotlinx.coroutines.launch

private val GUTTER = 24.dp

@Composable
private fun Headline(title: String, helper: String? = null) {
    Spacer(Modifier.height(16.dp))
    Text(title, style = Aiimin.type.title.copy(fontSize = 30.sp, lineHeight = 36.sp))
    if (helper != null) Text(helper, style = Aiimin.type.body.copy(color = Aiimin.colors.textMuted), modifier = Modifier.padding(top = 10.dp))
    Spacer(Modifier.height(24.dp))
}

// ------------------------------------------------------------------ O2

@Composable
fun NamePage(d: Draft, onName: (String) -> Unit, onDob: (LocalDate) -> Unit) {
    val c = Aiimin.colors
    var picking by remember { mutableStateOf(false) }
    Headline("What should we call you?")
    AppTextField(d.name, { onName(it.split(" ").joinToString(" ") { w -> w.replaceFirstChar(Char::uppercase) }) }, label = "First name", placeholder = "Meera")
    Text("Just a first name is fine.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 6.dp))
    Spacer(Modifier.height(24.dp))
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
    Text("AIIMIN accounts are for people 18 and over.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 6.dp))
    if (picking) DatePick(d.dobDate ?: LocalDate.now().minusYears(25), { onDob(it); picking = false }, { picking = false })
}

// ------------------------------------------------------------------ O3

private fun roleIcon(key: String): ImageVector = when (key) {
    "student" -> AppIcons.BookOpen
    "default" -> AppIcons.Briefcase
    "freelancer" -> AppIcons.Pencil
    "business" -> AppIcons.Wallet
    "shift" -> AppIcons.Moon
    "homemaker" -> AppIcons.Users
    "creator" -> AppIcons.Phone
    "manual" -> AppIcons.Footprints
    else -> AppIcons.Sliders
}

@Composable
fun RolePage(d: Draft, onPick: (String) -> Unit, onRoster: (String) -> Unit = {}) {
    val c = Aiimin.colors
    Headline("Who are you here?", "This only pre-fills what counts. You can change any of it, and nobody is scored against a preset.")
    UI_ROLES.forEach { (key, title, desc) ->
        val on = d.role == key
        Row(
            Modifier.fillMaxWidth().padding(vertical = 3.dp).clip(RoundedCornerShape(10.dp)).background(if (on) c.surface else c.base)
                .border(if (on) 1.5.dp else 1.dp, if (on) c.text else c.border, RoundedCornerShape(10.dp))
                .clickable { onPick(key) }.padding(horizontal = 14.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(roleIcon(key), null, tint = c.text, modifier = Modifier.size(24.dp))
            Spacer(Modifier.width(14.dp))
            Column(Modifier.weight(1f)) {
                Text(title, style = Aiimin.type.body.copy(color = c.text, fontWeight = FontWeight.SemiBold, fontSize = 16.sp))
                Text(desc, style = Aiimin.type.caption)
            }
            Box(Modifier.size(22.dp).clip(CircleShape).border(1.5.dp, if (on) c.text else c.textFaint, CircleShape), contentAlignment = Alignment.Center) {
                if (on) Box(Modifier.size(12.dp).clip(CircleShape).background(c.text))
            }
        }
    }
    if (d.role == "shift") {
        Text("Your roster", style = Aiimin.type.headline, modifier = Modifier.padding(top = 18.dp))
        Text("D day · N night · O off, repeating from today. Your day then ends after each shift, not at midnight.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 4.dp, bottom = 8.dp))
        aiimin.designsystem.component.PillRow {
            listOf("DDNNOO", "DDDDOO", "NNNOO", "DNOO").forEach { p ->
                aiimin.designsystem.component.Pill(p.toList().joinToString(" "), d.roster == p, { onRoster(p) })
            }
        }
        aiimin.designsystem.component.AppTextField(
            d.roster, { v -> onRoster(v.uppercase().filter { it in "DNO" }.take(28)) },
            placeholder = "Or type your own, like DDNNOOO", modifier = Modifier.padding(top = 8.dp),
        )
    }
}

// ------------------------------------------------------------------ O4

@Composable
fun MinimumsPage(d: Draft, onChange: (List<MinPick>) -> Unit) {
    val c = Aiimin.colors
    var adding by remember { mutableStateOf(false) }
    var own by remember { mutableStateOf("") }
    var ownTiny by remember { mutableStateOf("") }
    var note by remember { mutableStateOf<String?>(null) }
    Headline("Your daily minimums", "The floor for a day you keep. Small enough for a bad day. Pick two to four.")
    val rows = SUGGESTED_MINS + d.mins.filter { m -> SUGGESTED_MINS.none { it.title == m.title } }
    rows.forEach { m ->
        val on = d.mins.any { it.title == m.title }
        Row(
            Modifier.fillMaxWidth().clickable {
                if (on) { onChange(d.mins.filter { it.title != m.title }); note = null }
                else if (d.mins.size >= 4) note = "Four is the most. Untick one first."
                else { onChange(d.mins + m); note = null }
            }.heightIn(min = 64.dp).padding(vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(
                Modifier.size(24.dp).clip(RoundedCornerShape(6.dp)).background(if (on) c.text else androidx.compose.ui.graphics.Color.Transparent).border(1.5.dp, if (on) c.text else c.textFaint, RoundedCornerShape(6.dp)),
                contentAlignment = Alignment.Center,
            ) { if (on) Icon(AppIcons.Check, null, tint = c.base, modifier = Modifier.size(16.dp)) }
            Spacer(Modifier.width(14.dp))
            Column {
                Text(m.title, style = Aiimin.type.body.copy(color = c.text, fontSize = 16.sp, fontWeight = FontWeight.Medium))
                if (m.tiny.isNotBlank()) Text("Tiny version: ${m.tiny}", style = Aiimin.type.caption)
            }
        }
        Hairline()
    }
    if (note != null) Text(note!!, style = Aiimin.type.caption.copy(color = c.warn, fontSize = 13.sp), modifier = Modifier.padding(top = 10.dp))
    if (!adding) {
        Row(Modifier.fillMaxWidth().clickable { adding = true }.heightIn(min = 56.dp), verticalAlignment = Alignment.CenterVertically) {
            Icon(AppIcons.Plus, null, tint = c.text, modifier = Modifier.size(22.dp))
            Spacer(Modifier.width(14.dp))
            Text("Your own…", style = Aiimin.type.body.copy(color = c.text, fontSize = 16.sp))
        }
    } else {
        Column(Modifier.padding(top = 12.dp)) {
            AppTextField(own, { own = it }, label = "Minimum", placeholder = "Call Mom")
            Spacer(Modifier.height(8.dp))
            AppTextField(ownTiny, { ownTiny = it }, label = "Tiny version (optional)", placeholder = "Send a message")
            Spacer(Modifier.height(10.dp))
            AppButton("Add", {
                if (own.isNotBlank()) {
                    if (d.mins.size >= 4) note = "Four is the most. Untick one first."
                    else { onChange(d.mins + MinPick(own.trim(), ownTiny.trim())); own = ""; ownTiny = ""; adding = false; note = null }
                }
            }, compact = true, enabled = own.isNotBlank())
        }
    }
    Spacer(Modifier.height(12.dp))
    Text("${d.mins.size} picked", style = Aiimin.type.caption)
}

// ------------------------------------------------------------------ O5

@Composable
fun BatteryPage(d: Draft, onPick: (BatteryMode) -> Unit) {
    val c = Aiimin.colors
    Headline("How firm should it be?", "The battery shows how this week is going. You can change the mode once a week.")
    listOf(
        Triple(BatteryMode.GENTLE, "Gentle", "Misses cost little, the first each week is free, and it never drops below 10. Most people should start here."),
        Triple(BatteryMode.STANDARD, "Standard", "Misses cost more. At zero, a three-day comeback restores it. Nothing is ever deleted."),
        Triple(BatteryMode.HARDCORE, "Hardcore", "No free misses, no freezes, no repairs. Misses cost more. For people who want it to bite."),
    ).forEach { (mode, title, body) ->
        val on = d.battery_ == mode
        Column(
            Modifier.fillMaxWidth().padding(vertical = 4.dp).clip(RoundedCornerShape(12.dp)).background(if (on) c.surface else c.base)
                .border(if (on) 1.5.dp else 1.dp, if (on) c.text else c.border, RoundedCornerShape(12.dp))
                .clickable { onPick(mode) }.padding(16.dp),
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(title, style = Aiimin.type.headline, modifier = Modifier.weight(1f))
                if (mode == BatteryMode.GENTLE) Text("Recommended", style = Aiimin.type.eyebrow.copy(color = c.accentText))
            }
            Text(body, style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(top = 6.dp))
            if (on && mode == BatteryMode.HARDCORE) Text("Hardcore can only be switched off after 7 days.", style = Aiimin.type.caption.copy(color = c.warn, fontSize = 13.sp), modifier = Modifier.padding(top = 8.dp))
        }
    }
    Spacer(Modifier.height(20.dp))
    Text("Starts at 70", style = Aiimin.type.caption)
    Spacer(Modifier.height(6.dp))
    Box(Modifier.fillMaxWidth().height(10.dp).clip(RoundedCornerShape(3.dp)).background(c.border)) {
        Box(Modifier.fillMaxWidth(0.7f).height(10.dp).background(c.text))
    }
}

// ------------------------------------------------------------------ O6

@OptIn(androidx.compose.foundation.ExperimentalFoundationApi::class, ExperimentalLayoutApi::class)
@Composable
fun MoneyPage(d: Draft, onBanks: (List<String>) -> Unit, onCash: (Boolean) -> Unit, onPlan: (String) -> Unit) {
    val c = Aiimin.colors
    var other by remember { mutableStateOf("") }
    var addingOther by remember { mutableStateOf(false) }
    Headline("Where does your money move?", "Pick the account you use most. Spends you speak or type go here unless you say otherwise.")
    val tiles = BANKS + d.banks.filter { it !in BANKS } + "Other…"
    tiles.chunked(3).forEach { row ->
        Row(Modifier.fillMaxWidth().padding(vertical = 4.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            row.forEach { bank ->
                val on = bank in d.banks
                val primary = d.banks.firstOrNull() == bank
                Box(
                    Modifier.weight(1f).heightIn(min = 52.dp).clip(RoundedCornerShape(8.dp)).background(if (on) c.text else c.base)
                        .border(1.dp, if (on) c.text else c.borderStrong, RoundedCornerShape(8.dp))
                        .combinedClickable(
                            onClick = {
                                if (bank == "Other…") addingOther = true
                                else onBanks(if (on) d.banks - bank else d.banks + bank)
                            },
                            onLongClick = { if (on && !primary) onBanks(listOf(bank) + (d.banks - bank)) },
                        ).padding(6.dp),
                    contentAlignment = Alignment.Center,
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(bank, style = Aiimin.type.label.copy(color = if (on) c.base else c.text, fontSize = 14.sp), maxLines = 1)
                        if (primary) Text("Primary", style = Aiimin.type.eyebrow.copy(color = c.accent, fontSize = 10.sp))
                    }
                }
            }
            repeat(3 - row.size) { Spacer(Modifier.weight(1f)) }
        }
    }
    if (addingOther) {
        Spacer(Modifier.height(8.dp))
        AppTextField(other, { other = it }, placeholder = "Bank name", onDone = {
            if (other.isNotBlank()) { onBanks(d.banks + other.trim()); other = ""; addingOther = false }
        })
    }
    if (d.banks.size > 1) Text("Long-press a bank to make it Primary.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 8.dp))
    Spacer(Modifier.height(16.dp))
    SwitchRow("I also use cash", d.cash, onCash, subtitle = "Adds a Cash wallet.")
    Spacer(Modifier.height(20.dp))
    Text("A monthly plan for spending?", style = Aiimin.type.headline)
    Text("Optional. Money is scored as keeping your own pace, never as spending less.", style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(top = 6.dp, bottom = 12.dp))
    val digits = d.plan.filter(Char::isDigit)
    AppTextField(
        if (digits.isEmpty()) "" else NumberFormat.getIntegerInstance(Locale.forLanguageTag("en-IN")).format(digits.toLong()),
        { onPlan(it.filter(Char::isDigit).take(9)) }, label = "₹ per month", keyboardType = KeyboardType.Number, placeholder = "40,000",
    )
}

// ------------------------------------------------------------------ O7

private data class Perm(val key: String, val icon: ImageVector, val title: String, val line: String)

private val PERMS = listOf(
    Perm("usage", AppIcons.Phone, "Screen time", "Usage access: per-app time, unlocks, late nights."),
    Perm("health", AppIcons.Footprints, "Steps and sleep", "Health Connect: the same numbers your phone and watch show."),
    Perm("listener", AppIcons.Wallet, "Payment alerts", "Reads bank and UPI notifications so you don't type spends. Nothing is booked until you review it. OTPs and personal messages are ignored."),
    Perm("notify", AppIcons.BellSimple, "Reminders", "Expiring documents, events starting, minimums left today."),
)

private fun disclosure(key: String): Pair<String, List<String>> = when (key) {
    "usage" -> "Read your screen time?" to listOf(
        "AIIMIN reads which apps were in front and for how long, and how often you unlock.",
        "The app list stays on this phone. Only daily totals can sync, and only if you sign in and leave sync on.",
        "You can turn this off any time in Android settings.",
    )
    "health" -> "Read steps and sleep?" to listOf(
        "AIIMIN reads steps, sleep sessions and resting heart rate from Health Connect to measure your day, not to judge it.",
        "It stays on this phone. Daily totals can sync to aiimin.in if you sign in.",
        "Revoke any time in Health Connect.",
    )
    "listener" -> "Read payment alerts?" to listOf(
        "AIIMIN reads bank and UPI notifications on this phone and suggests the payment for you to confirm.",
        "OTPs and personal messages are ignored. The alert text stays on this phone.",
        "Nothing is booked until you review it.",
    )
    else -> "Send reminders?" to listOf(
        "AIIMIN reminds you about expiring documents, events about to start and minimums left today.",
        "You choose quiet hours in Settings.",
    )
}

@Composable
fun PermissionsPage(
    access: SensorAccess?,
    onRequest: (String) -> Unit,
    onHealthRationale: () -> Unit,
) {
    val c = Aiimin.colors
    var asking by remember { mutableStateOf<String?>(null) }
    var declined by remember { mutableStateOf(setOf<String>()) }
    Headline("Let the phone do the logging", "Each is optional. You can change them later in Me → Sensors and permissions.")
    PERMS.forEach { p ->
        val granted = when (p.key) {
            "usage" -> access?.usage == true
            "health" -> access?.steps == true || access?.sleep == true
            "listener" -> access?.notificationListener == true
            else -> access?.postNotifications == true
        }
        Column(Modifier.fillMaxWidth().padding(vertical = 10.dp)) {
            Row(verticalAlignment = Alignment.Top) {
                Icon(p.icon, null, tint = c.text, modifier = Modifier.padding(top = 2.dp).size(24.dp))
                Spacer(Modifier.width(14.dp))
                Column(Modifier.weight(1f)) {
                    Text(p.title, style = Aiimin.type.body.copy(color = c.text, fontWeight = FontWeight.SemiBold, fontSize = 16.sp))
                    Text(p.line, style = Aiimin.type.caption)
                    if (p.key == "health") Text("How Health Connect data is used", style = Aiimin.type.caption.copy(color = c.link), modifier = Modifier.clickable(onClick = onHealthRationale).padding(vertical = 6.dp))
                    if (p.key == "health" && access?.health == HealthAvailability.UNAVAILABLE) Text("Health Connect isn't on this phone.", style = Aiimin.type.caption.copy(color = c.warn))
                    if (p.key == "usage" && !granted && p.key in declined) Text("Not turned on yet.", style = Aiimin.type.caption.copy(color = c.warn))
                }
                Spacer(Modifier.width(10.dp))
                if (granted) Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(AppIcons.Check, null, tint = c.done, modifier = Modifier.size(18.dp))
                    Spacer(Modifier.width(4.dp))
                    Text("Allowed", style = Aiimin.type.label.copy(color = c.done))
                } else AppButton(if (p.key == "health" && access?.health == HealthAvailability.UNAVAILABLE) "Install" else "Allow", { asking = p.key }, compact = true, kind = ButtonKind.SECONDARY)
            }
            Spacer(Modifier.height(10.dp))
            Hairline()
        }
    }
    asking?.let { key ->
        val (title, bullets) = disclosure(key)
        AppSheet({ asking = null }, title = title) {
            bullets.forEach { Text(it, style = Aiimin.type.body.copy(color = c.text), modifier = Modifier.padding(bottom = 10.dp)) }
            Spacer(Modifier.height(8.dp))
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                AppButton("Not now", { declined = declined + key; asking = null }, Modifier.weight(1f), kind = ButtonKind.SECONDARY)
                AppButton("Allow", { asking = null; onRequest(key) }, Modifier.weight(1f))
            }
        }
    }
}

// ------------------------------------------------------------------ O8

@Composable
fun VoicePage(
    saved: String?,
    preview: suspend (String) -> List<Action>,
    save: suspend (List<Action>) -> String,
    onSaved: (String) -> Unit,
    toast: (String) -> Unit,
) {
    val c = Aiimin.colors
    val scope = rememberCoroutineScope()
    var typing by remember { mutableStateOf(false) }
    var text by remember { mutableStateOf("") }
    var cards by remember { mutableStateOf<List<Action>>(emptyList()) }
    var tried by remember { mutableStateOf(false) }
    var listening by remember { mutableStateOf(false) }
    fun run(t: String) {
        scope.launch { cards = preview(t); tried = true }
    }
    val voice = rememberVoiceInput(
        onText = { listening = false; text = it; run(it) },
        onUnavailable = { listening = false; typing = true; toast("Voice needs microphone access. You can type instead.") },
    )
    Headline("Say one thing you need to do today", "Like: “Call the electrician at 5” or “Spent 120 on chai and samosa”.")
    if (saved != null) {
        Row(Modifier.fillMaxWidth().clip(RoundedCornerShape(12.dp)).background(c.surface).border(1.dp, c.border, RoundedCornerShape(12.dp)).padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
            Icon(AppIcons.CheckCircle, null, tint = c.done, modifier = Modifier.size(24.dp))
            Spacer(Modifier.width(12.dp))
            Column {
                Text(saved, style = Aiimin.type.headline.copy(fontSize = 17.sp))
                Text("Saved. It's on your Today.", style = Aiimin.type.caption)
            }
        }
        return
    }
    if (cards.isNotEmpty()) {
        Text("“$text”", style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(bottom = 12.dp))
        cards.forEach { a ->
            Column(Modifier.fillMaxWidth().padding(vertical = 5.dp).clip(RoundedCornerShape(12.dp)).background(c.paper).border(1.dp, c.border, RoundedCornerShape(12.dp)).padding(16.dp)) {
                Text(a.headline, style = Aiimin.type.headline.copy(fontSize = 18.sp))
                Text(a.label, style = Aiimin.type.body.copy(color = c.textMuted, fontSize = 14.sp), modifier = Modifier.padding(top = 4.dp))
            }
        }
        Spacer(Modifier.height(16.dp))
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            AppButton("Try again", { cards = emptyList(); tried = false; text = "" }, Modifier.weight(1f), kind = ButtonKind.SECONDARY)
            AppButton("Save", { scope.launch { val label = save(cards); onSaved(label.ifBlank { cards.first().headline }) } }, Modifier.weight(1f))
        }
        return
    }
    if (tried) Text("I couldn't catch that. Try again, or type it.", style = Aiimin.type.body.copy(color = c.warn), modifier = Modifier.padding(bottom = 16.dp))
    if (typing) {
        AppTextField(text, { text = it }, placeholder = "Type it here", singleLine = false, onDone = { if (text.isNotBlank()) run(text) })
        Spacer(Modifier.height(12.dp))
        AppButton("Read it", { if (text.isNotBlank()) run(text) }, enabled = text.isNotBlank())
    } else {
        Column(Modifier.fillMaxWidth().padding(top = 16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
            Box(
                Modifier.size(96.dp).clip(CircleShape).background(if (listening) c.accent else c.text).clickable { listening = true; voice() },
                contentAlignment = Alignment.Center,
            ) { Icon(AppIcons.Mic, "Talk", tint = c.onInk, modifier = Modifier.size(40.dp)) }
            Spacer(Modifier.height(12.dp))
            Text(if (listening) "Listening…" else "Tap to talk", style = Aiimin.type.label.copy(color = c.text))
            Spacer(Modifier.height(20.dp))
            Text("or type it", style = Aiimin.type.body.copy(color = c.link), modifier = Modifier.clickable { typing = true }.padding(10.dp))
        }
    }
}

// ------------------------------------------------------------------ O9

@Composable
fun KeepSafePage(signedInAs: String?) {
    val c = Aiimin.colors
    Headline("Keep it safe and on the web too", "Sign in to keep your data safe across phones and see it on aiimin.in. Or keep it only on this phone; you can sign in later.")
    if (signedInAs != null) {
        Row(Modifier.fillMaxWidth().clip(RoundedCornerShape(12.dp)).background(c.surface).border(1.dp, c.border, RoundedCornerShape(12.dp)).padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
            Icon(AppIcons.CheckCircle, null, tint = c.done, modifier = Modifier.size(24.dp))
            Spacer(Modifier.width(12.dp))
            Text("Signed in as $signedInAs", style = Aiimin.type.headline.copy(fontSize = 17.sp))
        }
        Spacer(Modifier.height(20.dp))
    }
    Text(
        "What syncs: tasks, notes and payments go to aiimin.in over an encrypted connection, so you see them on the website. " +
            "Journal text only syncs if you switch it on. Documents and bank-message text never leave your phone. " +
            "You choose what syncs, any time, in Me → Account.",
        style = Aiimin.type.body.copy(color = c.textMuted, fontSize = 15.sp, lineHeight = 22.sp),
    )
}

// ------------------------------------------------------------------ O10

@Composable
fun ReadyPage(d: Draft, signedInAs: String?, access: SensorAccess?, onJump: (Int) -> Unit) {
    val c = Aiimin.colors
    val role = UI_ROLES.firstOrNull { it.first == d.role }?.second ?: "Something else"
    Headline(if (d.name.isBlank()) "You're set" else "You're set, ${d.name}")
    val phone = listOfNotNull(
        if (access?.usage == true) "screen time" else null, if (access?.steps == true) "steps" else null,
        if (access?.sleep == true) "sleep" else null, if (access?.notificationListener == true) "payment alerts" else null,
    )
    listOf(
        Triple("Role", role, 2),
        Triple("Minimums", d.mins.joinToString(", ") { it.title }.ifBlank { "None yet" }, 3),
        Triple("Battery", d.battery_.name.lowercase().replaceFirstChar(Char::uppercase), 4),
        Triple("Primary account", d.banks.firstOrNull() ?: if (d.cash) "Cash" else "None yet", 5),
        Triple("Phone data", phone.joinToString(", ").ifBlank { "none yet" }, 6),
        Triple("Backup", signedInAs?.let { "signed in as $it" } ?: "this phone only", 8),
    ).forEach { (k, v, step) ->
        Row(Modifier.fillMaxWidth().clickable { onJump(step) }.padding(vertical = 12.dp), verticalAlignment = Alignment.Top) {
            Text(k, style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.width(136.dp))
            Text(v, style = Aiimin.type.body.copy(color = c.text), modifier = Modifier.weight(1f))
        }
        Hairline()
    }
    if (d.role == "shift" && d.roster.isBlank()) Text("Set your roster in Me → Settings → My day.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 12.dp))
    Spacer(Modifier.height(20.dp))
    Text(
        "Your Life Score appears once four of your signals, across three areas, have 7 days of data: a provisional score first, firm after 14 days. Until then you'll see each signal calibrating.",
        style = Aiimin.type.body.copy(color = c.textMuted, fontSize = 15.sp, lineHeight = 22.sp),
    )
    d.firstWin?.let { Text("“$it” is on your Today.", style = Aiimin.type.body.copy(color = c.text, fontWeight = FontWeight.Medium), modifier = Modifier.padding(top = 14.dp)) }
}

@Composable
fun UnderAgePage(onClose: () -> Unit) {
    val c = Aiimin.colors
    Column(Modifier.fillMaxWidth().padding(horizontal = GUTTER).padding(top = 80.dp)) {
        Text("AIIMIN accounts are for adults.", style = Aiimin.type.title.copy(fontSize = 28.sp, lineHeight = 34.sp))
        Text("A parent can add you to their family as a profile.", style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(top = 12.dp, bottom = 32.dp))
        AppButton("Close", onClose, Modifier.fillMaxWidth())
    }
}
