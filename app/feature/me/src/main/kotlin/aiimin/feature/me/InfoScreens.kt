package aiimin.feature.me

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
        TopBar("Activity", onBack = { nav.back() })
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
    LaunchedEffect(Unit) { vm.markRead() }
    val zone = ZoneId.systemDefault()
    Column(Modifier.fillMaxSize().background(Aiimin.colors.base)) {
        TopBar("Notifications", onBack = { nav.back() })
        if (all.isEmpty()) {
            EmptyState(AppIcons.Bell, "All quiet", "Alerts come from real things: an expiring document, an event about to start, minimums left in the evening.")
            return@Column
        }
        LazyColumn(contentPadding = PaddingValues(horizontal = Aiimin.space.gutter, vertical = 8.dp)) {
            val today = LocalDate.now()
            all.groupBy { Instant.ofEpochMilli(it.at).atZone(zone).toLocalDate() == today }.toSortedMap(compareByDescending { it }).forEach { (isToday, list) ->
                item { SectionHeader(if (isToday) "Today" else "Earlier") }
                items(list, key = { it.id }) { n ->
                    ListRow(
                        n.title, subtitle = n.body, maxSubtitleLines = 3,
                        leading = {
                            IconTile(
                                when (n.route) { "doc" -> AppIcons.ShieldCheck; "money" -> AppIcons.Money; "score" -> AppIcons.Pulse; else -> AppIcons.Bell },
                                tint = if (n.priority >= 2) Aiimin.colors.accent else Aiimin.colors.textMuted,
                            )
                        },
                        trailing = { AppIconButton(AppIcons.Close, "Dismiss", { vm.dismiss(n.id) }, tint = Aiimin.colors.textFaint, size = 36.dp) },
                        onClick = {
                            when (n.route) {
                                "doc" -> n.routeArg?.let { nav.open(Route.Doc(it)) }
                                "money" -> nav.open(Route.MoneyInbox)
                                "score" -> nav.open(Route.Score)
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
        AppTextField(q, { q = it }, placeholder = "Tasks, notes, payments, documents, people", leading = AppIcons.Search, modifier = Modifier.padding(horizontal = Aiimin.space.gutter).focusRequester(focus))
        LazyColumn(contentPadding = PaddingValues(horizontal = Aiimin.space.gutter, vertical = 8.dp)) {
            if (q.length >= 2 && results.isEmpty()) item { Text("Nothing matches “$q”.", style = Aiimin.type.caption, modifier = Modifier.padding(8.dp)) }
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
    val nav = LocalNavigator.current
    val d by vm.data.collectAsStateWithLifecycle()
    val week by vm.week.collectAsStateWithLifecycle()
    val day by vm.day.collectAsStateWithLifecycle()
    val life by vm.life.collectAsStateWithLifecycle()
    val refreshing by vm.refreshing.collectAsStateWithLifecycle()
    val c = Aiimin.colors
    val stepsTarget = life?.intentions?.card(Signals.STEPS)?.target ?: 8000.0
    val screenLimit = life?.intentions?.card(Signals.SCREEN_PERSONAL)?.target
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar(Dates.relative(day, LocalDate.now()), onBack = { nav.back() }) {
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
                        Stat(data.steps?.let { "%,d".format(it) } ?: "—", "steps · ${if (data.stepsSource == "health_connect") "Health Connect" else if (data.stepsSource == "sensor") "phone step counter" else "not measured"}", Modifier.weight(1f))
                        Text("of %,d".format(stepsTarget.toLong()), style = Aiimin.type.caption)
                    }
                    Spacer(Modifier.height(8.dp))
                    Meter(((data.steps ?: 0) / stepsTarget).toFloat(), color = c.domains[0])
                    val hourly = DeviceRepository.longs(data.stepsHourly)
                    if (hourly.any { it > 0 }) {
                        Spacer(Modifier.height(14.dp))
                        Bars(hourly.map { it.toFloat() }, color = c.domains[0], labels = listOf("12a", "6a", "12p", "6p", "12a"), description = "Steps by hour")
                    }
                }
            }
            item {
                SectionHeader("Screen")
                Panel {
                    Row {
                        Stat(data.screenMs?.let { Dates.minutes(it / 60_000) } ?: "—", "screen time", Modifier.weight(1f))
                        Stat(data.unlocks?.toString() ?: "—", "unlocks", Modifier.weight(1f))
                        Stat(data.notifications?.toString() ?: "—", "notifications", Modifier.weight(1f))
                    }
                    Spacer(Modifier.height(12.dp))
                    Row {
                        Stat(data.screenPersonalMs?.let { Dates.minutes(it / 60_000) } ?: "—", "personal" + (screenLimit?.let { " · limit ${Dates.minutes(it.toLong())}" } ?: ""), Modifier.weight(1f))
                        Stat(data.screenWorkMs?.let { Dates.minutes(it / 60_000) } ?: "—", "work apps", Modifier.weight(1f))
                        Stat(data.lateScreenMs?.let { Dates.minutes(it / 60_000) } ?: "—", "late night", Modifier.weight(1f))
                    }
                    data.firstUnlockAt?.let { Text("First unlock ${Dates.clock(Instant.ofEpochMilli(it).atZone(ZoneId.systemDefault()).toLocalTime())}", style = Aiimin.type.caption, modifier = Modifier.padding(top = 10.dp)) }
                    val hourly = DeviceRepository.longs(data.screenHourly)
                    if (hourly.any { it > 0 }) {
                        Spacer(Modifier.height(14.dp))
                        Bars(hourly.map { it.toFloat() }, color = c.accent, labels = listOf("12a", "6a", "12p", "6p", "12a"), description = "Screen time by hour")
                    }
                }
            }
            val apps = DeviceRepository.apps(data)
            if (apps.isNotEmpty()) {
                item { SectionHeader("Apps") }
                items(apps.filter { it.ms > 0 }.take(12), key = { it.pkg }) { a ->
                    ListRow(
                        a.label,
                        subtitle = listOfNotNull("opened ${a.opens}×".takeIf { a.opens > 0 }, "${a.notifications} notifications".takeIf { a.notifications > 0 }).joinToString(" · ").ifBlank { null },
                        trailing = { Text(if (a.ms < 60_000) "<1m" else Dates.minutes(a.ms / 60_000), style = Aiimin.type.numberSmall) },
                    )
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
                        Bars(week.map { (it.steps ?: 0).toFloat() }, color = c.domains[0], height = 48.dp, highlight = week.size - 1, description = "Steps per day this week")
                        Spacer(Modifier.height(10.dp))
                        Text("Screen time", style = Aiimin.type.caption)
                        Bars(week.map { ((it.screenMs ?: 0) / 60_000).toFloat() }, color = c.accent, height = 48.dp, highlight = week.size - 1, description = "Screen time per day this week")
                    }
                }
            }
            item {
                Row(Modifier.fillMaxWidth().padding(top = 16.dp), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                    Tag("Observed · counts fully toward your score", icon = AppIcons.CheckCircle, color = c.done)
                    AppButton(if (refreshing) "Measuring…" else "Re-measure", { vm.refresh() }, kind = ButtonKind.GHOST, compact = true)
                }
            }
        }
    }
}
