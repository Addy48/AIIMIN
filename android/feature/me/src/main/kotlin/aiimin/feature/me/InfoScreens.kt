package aiimin.feature.me

import androidx.compose.foundation.lazy.itemsIndexed
import aiimin.designsystem.component.enterStagger
import aiimin.designsystem.component.bleed
import aiimin.designsystem.component.IconButtonInset
import kotlinx.coroutines.launch
import androidx.compose.ui.draw.clip
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Icon
import aiimin.designsystem.theme.Shapes
import aiimin.designsystem.component.pressable
import aiimin.core.model.ScreenSummary
import aiimin.designsystem.component.Segmented
import aiimin.designsystem.component.AppSheet
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import aiimin.core.data.app.ResultType
import aiimin.core.data.device.DeviceRepository
import aiimin.core.data.util.Dates
import aiimin.core.engine.Signals
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppIconButton
import aiimin.designsystem.component.AppTextField
import aiimin.designsystem.component.Bars
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.EmptyState
import aiimin.designsystem.component.EvidenceDot
import aiimin.designsystem.component.IconTile
import aiimin.designsystem.component.ListRow
import aiimin.designsystem.component.Meter
import aiimin.designsystem.component.Panel
import aiimin.designsystem.component.SectionHeader
import aiimin.designsystem.component.Stat
import aiimin.designsystem.component.Tag
import aiimin.designsystem.component.TopBar
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.go
import aiimin.designsystem.nav.Route
import aiimin.designsystem.nav.Tab
import aiimin.designsystem.theme.Aiimin
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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId

@Composable
fun ActivityScreen(vm: ActivityViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val lines by vm.lines.collectAsStateWithLifecycle()
    val zone = ZoneId.systemDefault()
    Column(Modifier.fillMaxSize().background(Aiimin.colors.base)) {
        TopBar("Activity", onBack = { nav.back() }) { AppIconButton(AppIcons.Waveform, "Recent captures", { nav.open(Route.RecentCaptures) }) }
        if (lines.isEmpty()) {
            EmptyState(AppIcons.ClockCounter, "Nothing yet", "Everything you do is written to a private, tamper-evident log. It shows up here.")
            return@Column
        }
        LazyColumn(contentPadding = PaddingValues(horizontal = Aiimin.space.gutter, vertical = 8.dp)) {
            lines.groupBy { Instant.ofEpochMilli(it.at).atZone(zone).toLocalDate() }.forEach { (day, l) ->
                item { SectionHeader(Dates.relative(day, LocalDate.now())) }
                items(l) { a ->
                    Row(Modifier.padding(vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
                        EvidenceDot(a.tier.name.first())
                        Spacer(Modifier.width(12.dp))
                        Text(a.text, style = Aiimin.type.body, modifier = Modifier.weight(1f))
                        Text(Dates.clock(Instant.ofEpochMilli(a.at).atZone(zone).toLocalTime()), style = Aiimin.type.caption.copy(fontFeatureSettings = "tnum"))
                    }
                }
            }
        }
    }
}

@Composable
fun NotificationsScreen(vm: NotificationsViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val all by vm.all.collectAsStateWithLifecycle()
    val stopAsk by vm.stopAsk.collectAsStateWithLifecycle()
    LaunchedEffect(Unit) { vm.markRead() }
    val zone = ZoneId.systemDefault()
    Column(Modifier.fillMaxSize().background(Aiimin.colors.base)) {
        TopBar("Notifications", onBack = { nav.back() }, actions = { AppIconButton(AppIcons.Gear, "Notification settings", { nav.open(Route.NotifySettings) }) })
        stopAsk?.let { cat ->
            aiimin.designsystem.component.StopTheseCard(cat.label, onStop = { vm.answerStop(cat, true) }, onKeep = { vm.answerStop(cat, false) }, modifier = Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 8.dp))
        }
        if (all.isEmpty()) {
            EmptyState(raahi = aiimin.core.engine.raahi.RaahiPose.SLEEPING, icon = AppIcons.Bell, title = "All quiet", body = "Alerts come from real things: an expiring document, an event about to start, minimums left in the evening.")
            return@Column
        }
        LazyColumn(contentPadding = PaddingValues(horizontal = Aiimin.space.gutter, vertical = 8.dp)) {
            val today = LocalDate.now()
            all.groupBy { Instant.ofEpochMilli(it.at).atZone(zone).toLocalDate() == today }.toSortedMap(compareByDescending { it }).forEach { (isToday, list) ->
                item { SectionHeader(if (isToday) "Today" else "Earlier") }
                itemsIndexed(list, key = { _, it -> it.id }) { i, n ->
                    ListRow(
                        n.title, modifier = Modifier.enterStagger(i), subtitle = n.body, maxSubtitleLines = 3,
                        leading = {
                            IconTile(
                                when (n.route) { "doc" -> AppIcons.ShieldCheck; "money", "bills" -> AppIcons.Money; "score" -> AppIcons.Pulse; else -> AppIcons.Bell },
                                tint = if (n.priority >= 2) Aiimin.colors.text else Aiimin.colors.textMuted, // ink, not orange: one orange element per screen
                            )
                        },
                        // D-028: the close mark ends on the page margin; its 48 dp target hangs into the margin.
                        trailing = { AppIconButton(AppIcons.Close, "Dismiss", { vm.dismiss(n.id) }, tint = Aiimin.colors.textFaint, modifier = Modifier.bleed(end = IconButtonInset)) },
                        onClick = {
                            when (n.route) {
                                "doc" -> n.routeArg?.let { nav.open(Route.Doc(it)) }
                                "money" -> nav.open(Route.MoneyInbox)
                                "bills" -> nav.open(Route.Recurring)
                                "backup" -> nav.open(Route.VaultBackup)
                                "score" -> nav.open(Route.Score)
                                "note" -> nav.open(n.routeArg?.let { Route.Note(it) } ?: Route.Notes)
                                "pour" -> nav.open(Route.JournalWrite(tool = if (n.routeArg == "worry") "worry" else "cool"))
                                else -> nav.tab(Tab.TODAY)
                            }
                        },
                    )
                }
            }
        }
    }
}

@Composable
fun SearchScreen(vm: SearchViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    var q by androidx.compose.runtime.remember { androidx.compose.runtime.mutableStateOf("") }
    LaunchedEffect(q) { vm.query.value = q }
    val results by vm.results.collectAsStateWithLifecycle()
    val focus = androidx.compose.runtime.remember { FocusRequester() }
    LaunchedEffect(Unit) { runCatching { focus.requestFocus() } }
    Column(Modifier.fillMaxSize().background(Aiimin.colors.base)) {
        TopBar("Search", onBack = { nav.back() })
        AppTextField(q, { q = it }, placeholder = "Features, tasks, notes, payments, people", leading = AppIcons.Search, modifier = Modifier.padding(horizontal = Aiimin.space.gutter).focusRequester(focus))
        // Features first ("Go to"), then content: typing "budget" or "emergency" opens the screen itself.
        val features = androidx.compose.runtime.remember(q) { aiimin.designsystem.nav.FeatureIndex.match(q) }
        LazyColumn(contentPadding = PaddingValues(horizontal = Aiimin.space.gutter, vertical = 8.dp)) {
            if (q.isBlank()) item { Text("Type a feature or anything you saved: “budget”, “emergency”, “screen time”.", style = Aiimin.type.caption, modifier = Modifier.padding(8.dp)) }
            if (q.length >= 2 && results.isEmpty() && features.isEmpty()) item { Text("Nothing matches “$q”.", style = Aiimin.type.caption, modifier = Modifier.padding(8.dp)) }
            if (features.isNotEmpty()) {
                item { SectionHeader("Go to") }
                items(features, key = { "go-" + it.title }) { f ->
                    ListRow(f.title, subtitle = f.subtitle, leading = { IconTile(f.icon) }, onClick = { nav.go(f.route) })
                }
            }
            results.groupBy { it.type }.forEach { (type, list) ->
                item { SectionHeader("${type.label} · ${list.size}") }
                items(list, key = { it.type.name + it.id }) { h ->
                    ListRow(
                        h.title, subtitle = h.subtitle,
                        leading = { IconTile(when (type) { ResultType.TASK -> AppIcons.ListChecks; ResultType.NOTE -> AppIcons.Note; ResultType.MONEY -> AppIcons.Money; ResultType.DOC -> AppIcons.FileText; ResultType.PERSON -> AppIcons.Me; ResultType.EVENT -> AppIcons.Calendar }) },
                        onClick = {
                            when (type) {
                                ResultType.TASK -> nav.open(Route.Task(h.id))
                                ResultType.NOTE -> nav.open(Route.Note(h.id))
                                ResultType.MONEY -> nav.open(Route.Txn(h.id))
                                ResultType.DOC -> nav.open(Route.Doc(h.id))
                                ResultType.PERSON -> nav.open(Route.Person(h.id))
                                ResultType.EVENT -> nav.open(Route.Calendar)
                            }
                        },
                    )
                }
            }
        }
    }
}

@Composable
fun PhoneDayScreen(vm: PhoneDayViewModel = hiltViewModel()) {
    var appSheet by remember { mutableStateOf<aiimin.core.data.device.AppUse?>(null) }
    var checkSheet by remember { mutableStateOf(false) }
    val prefs by vm.prefs.collectAsStateWithLifecycle()
    val nav = LocalNavigator.current
    val d by vm.data.collectAsStateWithLifecycle()
    val week by vm.week.collectAsStateWithLifecycle()
    val day by vm.day.collectAsStateWithLifecycle()
    val life by vm.life.collectAsStateWithLifecycle()
    val refreshing by vm.refreshing.collectAsStateWithLifecycle()
    val c = Aiimin.colors
    val stepsTarget = life?.intentions?.card(Signals.STEPS)?.target ?: 8000.0
    val screenLimit = life?.intentions?.card(Signals.SCREEN_PERSONAL)?.target
    val context = androidx.compose.ui.platform.LocalContext.current
    Column(Modifier.fillMaxSize().background(c.base)) {
        // "Phone day · Today": a bare "Today" read like the Today tab (audit A-026).
        TopBar("Phone day · " + Dates.relative(day, LocalDate.now()), onBack = { nav.back() }) {
            AppIconButton(AppIcons.CaretLeft, "Previous day", { vm.shift(-1) }, tint = c.textMuted)
            AppIconButton(AppIcons.CaretRight, "Next day", { vm.shift(1) }, tint = c.textMuted)
        }
        val data = d
        if (data == null || (data.steps == null && data.screenMs == null && data.sleepMin == null)) {
            EmptyState(AppIcons.Phone, "Nothing measured yet", "Turn on Usage access and Health Connect so steps, screen time and sleep fill in by themselves.", action = "Set up sensors", onAction = { nav.open(Route.Sensors) })
            return@Column
        }
        LazyColumn(contentPadding = PaddingValues(start = Aiimin.space.gutter, end = Aiimin.space.gutter, bottom = 40.dp)) {
            item {
                SectionHeader("Movement")
                Panel {
                    Row(verticalAlignment = Alignment.Bottom) {
                        // 4.3: Measured (Health Connect or the phone's counter), Estimated (filled from a partial day), Not measured: never a 0.
                        Stat(data.steps?.let { "%,d".format(it) } ?: "—", when {
                            data.steps == null || data.stepsSource == null -> "Not measured"
                            data.stepsSource == "estimated" -> "Estimated steps"
                            else -> "Measured · " + when (data.stepsSource) {
                                "health_connect" -> data.stepsOrigin?.takeIf { it != "Health Connect" }?.let { "from $it via Health Connect" } ?: "Health Connect"
                                else -> "phone step counter"
                            }
                        }, Modifier.weight(1f))
                        Text("of %,d".format(stepsTarget.toLong()), style = Aiimin.type.caption)
                    }
                    Spacer(Modifier.height(8.dp))
                    Meter(((data.steps ?: 0) / stepsTarget).toFloat(), color = c.domains[0])
                    val hourly = DeviceRepository.longs(data.stepsHourly)
                    if (hourly.any { it > 0 }) {
                        Spacer(Modifier.height(16.dp))
                        Bars(hourly.map { it.toFloat() }, color = c.text, labels = listOf("12a", "6a", "12p", "6p", "12a"), description = "Steps by hour")
                    }
                }
            }
            val apps = DeviceRepository.apps(data)
            val total = data.screenMs
            val sum = total?.let { ScreenSummary.of(it, data.screenPersonalMs ?: it, apps.map { a -> a.ms }, shown = 12) }
            item {
                SectionHeader("Screen")
                if (total == null || sum == null) {
                    Text(
                        "Turn on usage access to see your screen time. AIIMIN reads which apps were in front and for how long. The app list stays on your phone; only daily totals sync if backup is on.",
                        style = Aiimin.type.body,
                    )
                    AppButton("Open settings", { runCatching { context.startActivity(vm.usageSettingsIntent()) } }, compact = true, modifier = Modifier.padding(top = 12.dp))
                } else {
                    // One hero number: the calendar-day total, the same window as Digital Wellbeing.
                    Text(ScreenSummary.fmt(total), style = Aiimin.type.numberLarge)
                    Text(
                        listOfNotNull(
                            sum.countedLine,
                            data.pickups?.let { ScreenSummary.pickupLine(it, data.pickupsLabel) } ?: data.unlocks?.let { ScreenSummary.pickupLine(it, "unlocks") },
                            data.notifications?.takeIf { it > 0 }?.let { ScreenSummary.pickupLine(it, "notifications") },
                            data.lateScreenMs?.takeIf { it >= 60_000 }?.let { "${ScreenSummary.fmt(it)} after ${prefs?.lateHour ?: 23}:00" },
                        ).joinToString(" · "),
                        style = Aiimin.type.caption, modifier = Modifier.padding(top = 4.dp),
                    )
                    screenLimit?.let {
                        Meter((((data.screenPersonalMs ?: total) / 60_000.0) / it).toFloat().coerceIn(0f, 1f), color = c.text, modifier = Modifier.padding(top = 12.dp))
                        Text("Your personal limit: ${Dates.minutes(it.toLong())}", style = Aiimin.type.caption, modifier = Modifier.padding(top = 8.dp))
                    }
                    data.firstUnlockAt?.let { Text("First unlock ${Dates.clock(Instant.ofEpochMilli(it).atZone(ZoneId.systemDefault()).toLocalTime())}", style = Aiimin.type.caption, modifier = Modifier.padding(top = 8.dp)) }
                    val hourly = DeviceRepository.longs(data.screenHourly)
                    if (hourly.any { it > 0 }) {
                        Spacer(Modifier.height(16.dp))
                        Bars(hourly.map { it.toFloat() }, color = c.text, labels = listOf("12a", "6a", "12p", "6p", "12a"), description = "Screen time by hour")
                    }
                    Text("Updated ${Dates.ago(data.updatedAt)} · midnight to midnight, like Android's Digital Wellbeing", style = Aiimin.type.caption.copy(color = c.textFaint), modifier = Modifier.padding(top = 8.dp))
                    if (day == LocalDate.now()) {
                        // Confidence: checked against the phone's own number, or an offer to check.
                        val cal = prefs?.screenCalibration
                        val checked = aiimin.core.sensing.logic.ScreenFilter.checked(cal)
                        Row(Modifier.padding(top = 8.dp).clip(Shapes.small).pressable({ checkSheet = true }).heightIn(min = 40.dp), verticalAlignment = Alignment.CenterVertically) {
                            Icon(if (checked) AppIcons.SealCheck else AppIcons.Scales, null, tint = if (checked) c.done else c.warn, modifier = Modifier.size(16.dp))
                            Spacer(Modifier.width(8.dp))
                            Text(
                                when {
                                    checked -> "Checked against your phone"
                                    cal != null -> "Estimate · off by ${(kotlin.math.abs(cal - 1.0) * 100).toInt()}% last check · check again"
                                    else -> "Check against your phone (20 seconds)"
                                },
                                style = Aiimin.type.caption.copy(color = if (checked) c.textMuted else c.warn),
                            )
                        }
                    }
                }
            }
            appSheet?.let { a ->
                item {
                    val work = a.pkg in (prefs?.workApps ?: emptySet())
                    val weekAvg = week.mapNotNull { d -> DeviceRepository.apps(d).firstOrNull { it.pkg == a.pkg }?.ms }.let { if (it.isEmpty()) 0L else it.sum() / week.size.coerceAtLeast(1) }
                    AppSheet({ appSheet = null }, title = a.label) {
                        Text("Today ${Dates.minutes(a.ms / 60_000)} · 7-day average ${Dates.minutes(weekAvg / 60_000)}", style = Aiimin.type.body)
                        SectionHeader("Counts as")
                        Segmented(listOf("Personal", "Work"), if (work) 1 else 0, { i -> vm.tagWork(a.pkg, i == 1) })
                        Text(if (work) "Work time isn't counted against your personal screen time." else "Counted in personal screen time.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 8.dp, bottom = 12.dp))
                    }
                }
            }
            if (apps.isNotEmpty()) {
                item { SectionHeader("Apps") }
                val dupes = apps.groupBy { it.label }.filterValues { it.size > 1 }.keys
                items(apps.filter { it.ms > 0 }.take(12), key = { it.pkg }) { a ->
                    ListRow(
                        a.label + (if (a.label in dupes) " · " + a.pkg.substringAfterLast('.') else "") + if (a.pkg in (prefs?.workApps ?: emptySet())) " · work" else "", onClick = { appSheet = a },
                        subtitle = listOfNotNull("opened ${a.opens}×".takeIf { a.opens > 0 }, ScreenSummary.pickupLine(a.notifications, "notifications").takeIf { a.notifications > 0 }).joinToString(" · ").ifBlank { null },
                        trailing = { Text(ScreenSummary.fmt(a.ms), style = Aiimin.type.numberSmall) },
                    )
                }
                // The rows plus this one add up to the hero number.
                if (sum != null && sum.otherMs >= 60_000) item(key = "other-apps") {
                    ListRow("Other apps", trailing = { Text(ScreenSummary.fmt(sum.otherMs), style = Aiimin.type.numberSmall) })
                }
            }
            item {
                SectionHeader("Sleep")
                Panel {
                    Row {
                        Stat(data.sleepMin?.let { Dates.minutes(it.toLong()) } ?: "—", "asleep", Modifier.weight(1f))
                        Stat(
                            data.sleepStart?.let { Dates.clock(Instant.ofEpochMilli(it).atZone(ZoneId.systemDefault()).toLocalTime()) } ?: "—", "fell asleep", Modifier.weight(1f),
                        )
                        Stat(data.sleepEnd?.let { Dates.clock(Instant.ofEpochMilli(it).atZone(ZoneId.systemDefault()).toLocalTime()) } ?: "—", "woke", Modifier.weight(1f))
                    }
                    data.restingHr?.let { Text("Resting heart rate $it bpm", style = Aiimin.type.caption, modifier = Modifier.padding(top = 8.dp)) }
                }
            }
            if (week.size >= 2) {
                item {
                    SectionHeader("This week")
                    Panel {
                        Text("Steps", style = Aiimin.type.caption)
                        // No steps measured all week: say so instead of drawing an empty chart (audit A-027).
                        if (week.all { (it.steps ?: 0L) == 0L }) Text("Not measured this week. Connect Health Connect in Phone data.", style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(vertical = 8.dp))
                        else Bars(week.map { (it.steps ?: 0).toFloat() }, color = c.domains[0], height = 48.dp, highlight = week.size - 1, description = "Steps per day this week")
                        Spacer(Modifier.height(12.dp))
                        Text("Counted screen time", style = Aiimin.type.caption)
                        Bars(week.map { ((it.screenPersonalMs ?: it.screenMs ?: 0) / 60_000).toFloat() }, color = c.text, height = 48.dp, highlight = week.size - 1, description = "Screen time per day this week")
                    }
                }
            }
            item {
                Column(Modifier.fillMaxWidth().padding(top = 16.dp)) {
                    if (total != null) Tag("Observed · counts fully toward your score", icon = AppIcons.CheckCircle, color = c.done)
                    AppButton(if (refreshing) "Measuring…" else "Re-measure", { vm.refresh() }, Modifier.fillMaxWidth().padding(top = 12.dp), kind = ButtonKind.SECONDARY, compact = true)
                }
            }
        }
    }
    if (checkSheet) {
        var typed by remember { mutableStateOf("") }
        var busy by remember { mutableStateOf(false) }
        val toaster = aiimin.designsystem.nav.LocalToaster.current
        val scope = androidx.compose.runtime.rememberCoroutineScope()
        AppSheet({ checkSheet = false }, title = "Check against your phone") {
            Text("Open Digital Wellbeing, read today's screen time, and type it here. AIIMIN keeps whichever way of measuring matches this phone best.", style = Aiimin.type.body)
            AppButton("Open Digital Wellbeing", {
                runCatching {
                    context.startActivity(android.content.Intent().setClassName("com.google.android.apps.wellbeing", "com.google.android.apps.wellbeing.settings.TopLevelSettingsActivity").addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK))
                }.recoverCatching { context.startActivity(android.content.Intent(android.provider.Settings.ACTION_SETTINGS).addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK)) }
            }, kind = ButtonKind.SECONDARY, compact = true, modifier = Modifier.padding(top = 12.dp))
            AppTextField(typed, { typed = it }, label = "Your phone says", placeholder = "1h 31m", modifier = Modifier.padding(top = 16.dp))
            AppButton(if (busy) "Checking…" else "Save", {
                busy = true
                scope.launch {
                    val msg = vm.calibrate(typed)
                    busy = false
                    toaster.show(msg ?: "Couldn't read screen time. Is usage access on?")
                    if (msg != null && msg != "Type it like 1h 31m") checkSheet = false
                }
            }, enabled = typed.isNotBlank() && !busy, modifier = Modifier.fillMaxWidth().padding(top = 16.dp, bottom = 8.dp))
        }
    }
}
