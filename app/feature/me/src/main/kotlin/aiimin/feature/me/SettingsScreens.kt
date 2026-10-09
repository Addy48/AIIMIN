package aiimin.feature.me

import aiimin.core.data.app.PreferencesRepository
import aiimin.core.data.settings.AppTheme
import aiimin.core.data.util.Dates
import aiimin.core.engine.DayMode
import aiimin.core.nlp.AiModule
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppSheet
import aiimin.designsystem.component.AppTextField
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.IconTile
import aiimin.designsystem.component.ListRow
import aiimin.designsystem.component.Panel
import aiimin.designsystem.component.Pill
import aiimin.designsystem.component.PillRow
import aiimin.designsystem.component.SectionHeader
import aiimin.designsystem.component.Segmented
import aiimin.designsystem.component.SwitchRow
import aiimin.designsystem.component.Tag
import aiimin.designsystem.component.TimePick
import aiimin.designsystem.component.TopBar
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.LocalToaster
import aiimin.designsystem.nav.Route
import aiimin.designsystem.theme.Aiimin
import aiimin.core.sensing.HealthAvailability
import android.Manifest
import android.content.Intent
import android.os.Build
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.core.content.FileProvider
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.compose.LifecycleEventEffect
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import java.time.LocalTime
import kotlinx.coroutines.launch

// =================================================================== settings

@Composable
fun SettingsScreen(vm: MeViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    val context = LocalContext.current
    val s by vm.settings.collectAsStateWithLifecycle()
    val integrity by vm.integrity.collectAsStateWithLifecycle()
    var dayMode by remember { mutableStateOf(false) }
    var quietPick by remember { mutableStateOf<String?>(null) }
    val c = Aiimin.colors
    val st = s ?: return
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Settings", onBack = { nav.back() })
        LazyColumn(contentPadding = PaddingValues(start = Aiimin.space.gutter, end = Aiimin.space.gutter, bottom = 40.dp)) {
            item {
                SectionHeader("Look")
                Segmented(listOf("System", "Light", "Dark"), st.theme.ordinal, { vm.update { s -> s.copy(theme = AppTheme.entries[it]) } })
                SwitchRow("Reduce motion", st.reduceMotion, { v -> vm.update { it.copy(reduceMotion = v) } })
            }
            item {
                SectionHeader("Your day")
                ListRow(
                    "When your day ends",
                    subtitle = when (val m = st.dayMode) {
                        DayMode.Midnight -> "Midnight"
                        is DayMode.FixedEnd -> "${m.endHour}:00 AM the next morning"
                        is DayMode.Roster -> "Shift roster · ${m.pattern.joinToString("")}"
                    } + " · late entries can be filed to yesterday until noon",
                    leading = { IconTile(AppIcons.MoonStars) }, maxSubtitleLines = 2, onClick = { dayMode = true },
                )
                ListRow("Late-night screen time starts", subtitle = "${st.lateHour}:00", leading = { IconTile(AppIcons.Moon) }, trailing = {
                    Row { listOf(22, 23, 0).forEach { h -> Pill(if (h == 0) "12" else "$h", st.lateHour == h, { vm.update { it.copy(lateHour = h) } }) } }
                })
            }
            item {
                SectionHeader("Notifications")
                SwitchRow("Quiet hours", st.quiet.enabled, { v -> vm.update { it.copy(quiet = it.quiet.copy(enabled = v)) } }, subtitle = "Holds back low and medium alerts. Important ones still come through.")
                if (st.quiet.enabled) {
                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        ListRow("From", subtitle = Dates.clock(LocalTime.of(st.quiet.fromMin / 60, st.quiet.fromMin % 60)), modifier = Modifier.weight(1f), onClick = { quietPick = "from" })
                        ListRow("Until", subtitle = Dates.clock(LocalTime.of(st.quiet.toMin / 60, st.quiet.toMin % 60)), modifier = Modifier.weight(1f), onClick = { quietPick = "to" })
                    }
                }
            }
            item {
                SectionHeader("Score & rewards")
                SwitchRow("Hide the Life Score number", st.hideScore, { v -> vm.update { it.copy(hideScore = v) } }, subtitle = "See areas and trends only. Good if the number makes you anxious.")
                SwitchRow("Hide XP", st.hideXp, { v -> vm.update { it.copy(hideXp = v) } })
            }
            item {
                SectionHeader("Privacy & data")
                SwitchRow("Lock the app", st.appLock, { v -> vm.update { it.copy(appLock = v) } }, subtitle = "Fingerprint or screen lock when opening AIIMIN", icon = AppIcons.Fingerprint)
                ListRow("Check data integrity", subtitle = when (integrity) {
                    null -> "Verifies the hash chain of your activity log"
                    true -> "Intact — nothing changed outside AIIMIN"
                    false -> "Data was changed outside AIIMIN. Your score is greyed until you re-baseline."
                }, leading = { IconTile(AppIcons.ShieldCheck) }, maxSubtitleLines = 2, onClick = { vm.verify() })
                ListRow("Export everything", subtitle = "A zip of your log, tasks, notes and vault files", leading = { IconTile(AppIcons.Export) }, onClick = {
                    scope.launch {
                        val f = vm.exportAll(journal = false)
                        val uri = FileProvider.getUriForFile(context, context.packageName + ".files", f)
                        context.startActivity(Intent.createChooser(Intent(Intent.ACTION_SEND).setType("application/zip").putExtra(Intent.EXTRA_STREAM, uri).addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION), "Export"))
                    }
                })
                Text("No lending, no credit scoring, no selling data. SMS and documents are read on this phone.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 10.dp))
            }
        }
    }
    if (dayMode) {
        var end by remember { mutableStateOf((st.dayMode as? DayMode.FixedEnd)?.endHour ?: 0) }
        var roster by remember { mutableStateOf((st.dayMode as? DayMode.Roster)?.pattern?.joinToString(",") ?: "D,D,N,N,O,O") }
        var mode by remember { mutableStateOf(when (st.dayMode) { DayMode.Midnight -> 0; is DayMode.FixedEnd -> 1; is DayMode.Roster -> 2 }) }
        AppSheet({ dayMode = false }, title = "When your day ends", subtitle = "Applies from tomorrow; can change once every 14 days, so nobody moves midnight to save a day.") {
            Segmented(listOf("Midnight", "Later", "Shift roster"), mode, { mode = it })
            Spacer(Modifier.height(10.dp))
            when (mode) {
                1 -> PillRow { (1..5).forEach { h -> Pill("$h AM", end == h, { end = h }) } }
                2 -> AppTextField(roster, { roster = it.uppercase() }, label = "Pattern from today (D day · N night · O off)")
            }
            Spacer(Modifier.height(14.dp))
            AppButton("Save", {
                scope.launch {
                    val m = when (mode) {
                        1 -> DayMode.FixedEnd(end.coerceIn(1, 5))
                        2 -> DayMode.Roster(roster.filter { it in "DNO" }.toList().ifEmpty { listOf('D') }, vm.today(), 8)
                        else -> DayMode.Midnight
                    }
                    when (val r = vm.setDayMode(m)) {
                        is PreferencesRepository.Result.Wait -> toaster.show("You can change this again on ${Dates.short(r.until)}")
                        PreferencesRepository.Result.Done -> { toaster.show("Saved"); dayMode = false }
                    }
                }
            }, Modifier.fillMaxWidth())
        }
    }
    quietPick?.let { which ->
        val cur = if (which == "from") st.quiet.fromMin else st.quiet.toMin
        TimePick(LocalTime.of(cur / 60, cur % 60), { t ->
            vm.update { s -> s.copy(quiet = if (which == "from") s.quiet.copy(fromMin = t.hour * 60 + t.minute) else s.quiet.copy(toMin = t.hour * 60 + t.minute)) }
        }, { quietPick = null })
    }
}

// =================================================================== sensors

@Composable
fun SensorsScreen(vm: SensorsViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val context = LocalContext.current
    val access by vm.access.collectAsStateWithLifecycle()
    val apps by vm.apps.collectAsStateWithLifecycle()
    val s by vm.settings.collectAsStateWithLifecycle()
    var pickWork by remember { mutableStateOf(false) }
    val c = Aiimin.colors
    LifecycleEventEffect(Lifecycle.Event.ON_RESUME) { vm.refresh() }
    val health = rememberLauncherForActivityResult(vm.healthContract()) { vm.refresh() }
    val perm = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { vm.refresh() }
    val a = access
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Sensors & permissions", onBack = { nav.back() })
        LazyColumn(contentPadding = PaddingValues(Aiimin.space.gutter)) {
            item {
                Text("AIIMIN measures these so you never have to type them. Measured values count as observed evidence. Everything stays on this phone.", style = Aiimin.type.caption)
                Spacer(Modifier.height(12.dp))
            }
            item {
                SensorRow("Screen time & app use", "Usage access — screen time per app, unlocks, late-night use, notifications", a?.usage) { context.startActivity(vm.usageSettings()) }
                SensorRow(
                    "Steps, sleep, heart rate", when (a?.health) {
                        HealthAvailability.NEEDS_UPDATE -> "Health Connect needs an update"
                        HealthAvailability.UNAVAILABLE -> "Health Connect isn't on this phone — install it for steps and sleep"
                        else -> "Health Connect — the same steps your phone and watch show, de-duplicated"
                    }, a?.let { it.steps && it.sleep },
                ) {
                    when (a?.health) {
                        HealthAvailability.AVAILABLE -> health.launch(vm.healthPermissions)
                        else -> runCatching { context.startActivity(vm.healthInstall()) }
                    }
                }
                if (Build.VERSION.SDK_INT >= 29) {
                    SensorRow("Step counter (backup)", "Used only when Health Connect isn't available", a?.activityRecognition) { perm.launch(Manifest.permission.ACTIVITY_RECOGNITION) }
                }
                SensorRow("Bank alerts", "Notification access — reads payment alerts so you don't type them. Nothing is booked until you review.", a?.notificationListener) { context.startActivity(vm.listenerSettings()) }
                if (Build.VERSION.SDK_INT >= 33) {
                    SensorRow("Notifications", "Expiring documents, events starting, minimums left today", a?.postNotifications) { perm.launch(Manifest.permission.POST_NOTIFICATIONS) }
                }
            }
            item {
                SectionHeader("Work apps")
                ListRow(
                    "${s?.workApps?.size ?: 0} apps tagged as work",
                    subtitle = "Their time counts as work screen time — tracked, not judged. Only leisure scrolling counts against you, if you choose.",
                    leading = { IconTile(AppIcons.Code) }, maxSubtitleLines = 3, onClick = { vm.loadApps(); pickWork = true },
                )
            }
        }
    }
    if (pickWork) {
        AppSheet({ pickWork = false }, title = "Tag work apps", skipPartial = false) {
            LazyColumn(Modifier.height(480.dp)) {
                items(apps, key = { it.first }) { (pkg, label) ->
                    SwitchRow(label, pkg in (s?.workApps ?: emptySet()), { vm.toggleWork(pkg) })
                }
            }
        }
    }
}

@Composable
private fun SensorRow(title: String, body: String, on: Boolean?, onClick: () -> Unit) {
    val c = Aiimin.colors
    Panel(Modifier.padding(vertical = 4.dp), onClick = onClick) {
        Row {
            Column(Modifier.weight(1f)) {
                Text(title, style = Aiimin.type.bodyStrong)
                Text(body, style = Aiimin.type.caption)
            }
            when (on) {
                true -> Tag("On", color = c.done, background = c.doneSoft)
                false -> Tag("Turn on", color = c.accent, background = c.accentSoft)
                null -> Unit
            }
        }
    }
}

// =================================================================== assistant settings

@Composable
fun AiSettingsScreen(vm: MeViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val s by vm.settings.collectAsStateWithLifecycle()
    val session by vm.session.collectAsStateWithLifecycle()
    val c = Aiimin.colors
    val st = s ?: return
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Assistant", onBack = { nav.back() })
        LazyColumn(contentPadding = PaddingValues(Aiimin.space.gutter)) {
            item {
                Text("The assistant proposes and you approve. It never changes anything silently, never edits settled days, never touches your score, and never writes your journal.", style = Aiimin.type.body)
                SectionHeader("What it may read")
            }
            items(AiModule.entries) { m ->
                SwitchRow(m.label, m in st.aiScope, { on -> vm.update { it.copy(aiScope = if (on) it.aiScope + m else it.aiScope - m) } },
                    subtitle = when (m) {
                        AiModule.JOURNAL -> "Off by default — your journal stays yours"
                        AiModule.VAULT -> "Titles, dates and text of documents; never sensitive ones"
                        AiModule.FAMILY -> "Only items shared with you"
                        else -> null
                    })
            }
            item {
                SectionHeader("Mode")
                SwitchRow(
                    "Smart answers", st.aiSmart && session?.signedIn == true,
                    { on -> if (session?.signedIn == true) vm.update { it.copy(aiSmart = on) } else nav.open(Route.Account) },
                    subtitle = if (session?.signedIn == true) "Questions may use the aiimin.in model with a short summary of only the areas above. Logging and proposals always run on this phone." else "Connect your aiimin.in account first. Until then, everything runs on this phone.",
                )
                Text("Each reply shows what it read — tap “Read” under any answer.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 8.dp))
            }
        }
    }
}

// =================================================================== account

@Composable
fun AccountScreen(vm: AccountViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val session by vm.session.collectAsStateWithLifecycle()
    val s by vm.settings.collectAsStateWithLifecycle()
    val busy by vm.busy.collectAsStateWithLifecycle()
    val msg by vm.message.collectAsStateWithLifecycle()
    val c = Aiimin.colors
    LaunchedEffect(msg) { msg?.let { toaster.show(it); vm.message.value = null } }
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Account & sync", onBack = { nav.back() })
        Column(Modifier.padding(Aiimin.space.gutter)) {
            if (session?.signedIn == true) {
                Panel {
                    Text(session?.label.orEmpty(), style = Aiimin.type.headline)
                    Text("Tasks, notes and payments sync with aiimin.in. The phone works offline and catches up.", style = Aiimin.type.caption)
                    Text("Last sync: " + (s?.lastSyncAt?.let { java.text.DateFormat.getDateTimeInstance().format(java.util.Date(it)) } ?: "never"), style = Aiimin.type.caption, modifier = Modifier.padding(top = 6.dp))
                }
                Spacer(Modifier.height(10.dp))
                SwitchRow("Sync journal text", s?.journalSync == true, { vm.journalSync(it) }, subtitle = "Off by default. When off, your journal never leaves this phone.")
                Spacer(Modifier.height(10.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    AppButton(if (busy) "Syncing…" else "Sync now", { vm.syncNow() }, Modifier.weight(1f), enabled = !busy, icon = AppIcons.ArrowsClockwise)
                    AppButton("Sign out", { vm.signOut() }, Modifier.weight(1f), kind = ButtonKind.SECONDARY)
                }
            } else {
                var id by remember { mutableStateOf("") }
                var pin by remember { mutableStateOf("") }
                Text("Connect aiimin.in", style = Aiimin.type.title)
                Text("Use your OS-ID or email and your 6-digit PIN — the same as the website. You can use the app fully without an account.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 4.dp, bottom = 16.dp))
                AppTextField(id, { id = it }, label = "OS-ID or email")
                Spacer(Modifier.height(10.dp))
                AppTextField(pin, { pin = it.filter(Char::isDigit).take(6) }, label = "PIN", keyboardType = KeyboardType.NumberPassword)
                Spacer(Modifier.height(16.dp))
                AppButton(if (busy) "Signing in…" else "Sign in", { vm.signIn(id, pin) }, Modifier.fillMaxWidth(), enabled = !busy && id.isNotBlank() && pin.length == 6)
                Text("New here? Create your OS-ID on aiimin.in.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 12.dp))
            }
        }
    }
}
