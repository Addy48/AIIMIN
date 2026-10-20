package aiimin.feature.today

import aiimin.designsystem.component.enterStagger
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.layout.LastBaseline
import aiimin.designsystem.component.armShared
import aiimin.designsystem.component.opensScreen
import aiimin.core.data.day.DayRepository
import aiimin.core.data.plan.MinimumToday
import aiimin.core.data.util.Dates
import aiimin.core.model.ScreenSummary
import aiimin.core.engine.BatteryState
import aiimin.core.engine.Signals
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppSheet
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.CheckCircle
import aiimin.designsystem.component.DayHorizon
import aiimin.designsystem.component.DoneText
import aiimin.designsystem.component.EvidenceDot
import aiimin.designsystem.component.HorizonTick
import aiimin.designsystem.component.Hairline
import aiimin.designsystem.component.IconTile
import aiimin.designsystem.component.LargeHeader
import aiimin.designsystem.component.ListRow
import aiimin.designsystem.component.RootActions
import aiimin.designsystem.component.SectionHeader
import aiimin.designsystem.component.Skeleton
import aiimin.designsystem.component.Tag
import aiimin.designsystem.component.pressable
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.LocalToaster
import aiimin.designsystem.nav.Route
import aiimin.designsystem.nav.go
import aiimin.designsystem.theme.Aiimin
import aiimin.designsystem.component.Raahi
import aiimin.designsystem.component.RaahiSize
import aiimin.designsystem.theme.Horizons
import aiimin.designsystem.theme.Motion
import aiimin.designsystem.theme.Shapes
import androidx.compose.animation.core.tween
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.CustomAccessibilityAction
import androidx.compose.ui.semantics.customActions
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.foundation.layout.RowScope
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import java.time.LocalTime
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

/**
 * Today (T1), laid out per the handoff §6: date bar, hero time, horizon, the one Now card,
 * a quiet stat line, Later today, Minimums, the pinned note. Nothing else is a card.
 */
@Composable
fun TodayScreen(vm: TodayViewModel = hiltViewModel()) {
    val ui by vm.ui.collectAsStateWithLifecycle()
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val context = androidx.compose.ui.platform.LocalContext.current
    val scope = rememberCoroutineScope()
    var minimumSheet by remember { mutableStateOf<MinimumToday?>(null) }
    var earlierOpen by remember { mutableStateOf(false) }
    var nowMs by remember { mutableLongStateOf(System.currentTimeMillis()) }
    LaunchedEffect(Unit) {
        while (true) {
            nowMs = System.currentTimeMillis()
            delay(20_000)
        }
    }
    val u = ui
    if (u == null) {
        TodaySkeleton()
        return
    }
    val now = remember(nowMs) { LocalTime.now() }
    val hour = now.hour

    fun toggleTask(id: String) = scope.launch {
        val r = vm.toggleTask(id) ?: return@launch
        if (r.done) toaster.show(if (r.xp > 0 && !u.hideXp) "Done · +${r.xp} XP" else "Done")
    }

    val all = u.flow.values.flatten().filter { it.kind != FlowKind.EXPIRY }
    val later = all.filter { !it.done && (it.time == null || it.time >= now.minusMinutes(5) || it.carried > 0) }
        .sortedWith(compareBy({ it.time == null }, { it.time }))
    val earlier = all.filter { it !in later }
    val light = u.dayState?.light == true
    val lowBattery = u.life?.battery?.state != BatteryState.OK

    var yesterdayOpenList by remember { mutableStateOf(false) }
    LazyColumn(Modifier.fillMaxSize().background(Aiimin.colors.base), contentPadding = PaddingValues(bottom = 32.dp)) {
        fun row(it: FlowItem, i: Int) = item(key = "l" + it.kind.name + it.id) {
            LaterRow(
                it,
                modifier = if (i >= 0) Modifier.enterStagger(i) else Modifier,
                onToggle = { toggleTask(it.id) },
                onOpen = {
                    when (it.kind) {
                        FlowKind.TASK -> nav.open(Route.Task(it.id))
                        FlowKind.EXPIRY -> nav.open(Route.Doc(it.id))
                        FlowKind.EVENT -> nav.open(Route.Calendar)
                    }
                },
                onLong = {
                    if (it.kind == FlowKind.TASK) scope.launch {
                        val t = vm.deleteTask(it.id) ?: return@launch
                        toaster.undo("Task removed") { vm.restoreTask(t) }
                    }
                },
            )
            Hairline(Modifier.padding(horizontal = Aiimin.space.gutter))
        }
        item {
            val status = when {
                u.dayState?.paused == true -> "Paused today · nothing counts against you"
                light -> "Light day · just the minimums"
                u.yesterdayOpen -> "Yesterday stays open till noon"
                else -> null
            }
            LargeHeader(title = Dates.dayMonth(u.date), overline = status) { RootActions(u.unread) }
        }
        item {
            Column(Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 2.dp)) {
                // PRD 1.6b: Raahi's line replaces the plain greeting; none on later opens or when Raahi is Off.
                val greet = u.greeting.joinToString(" ")
                val said = if (greet.isEmpty()) "" else " $greet"
                val meridiem: @Composable () -> Unit = { Text(Dates.meridiem(now), style = Aiimin.type.bodyStrong.copy(color = Aiimin.colors.text)) }
                val greeting: @Composable () -> Unit = {
                    u.greeting.forEach { line ->
                        Text(line, style = Aiimin.type.body.copy(color = Aiimin.colors.textMuted), maxLines = 2, overflow = TextOverflow.Ellipsis)
                    }
                }
                // Raahi Mini, 28 dp beside the clock (1.1); nothing when Off.
                val mini: @Composable (Modifier) -> Unit = { m -> Raahi(u.mini, RaahiSize.MINI, m, motion = u.miniMotion) }
                // D-002: "AM" and the greeting sit on the clock's baseline. At large text the clock fills the width,
                // so the two lines move under it instead of floating beside it.
                if (LocalDensity.current.fontScale < 1.5f) {
                    Row(Modifier.fillMaxWidth().semantics(mergeDescendants = true) { contentDescription = "It is ${Dates.clock(now)}.$said" }) {
                        Text(Dates.clockPlain(now), style = Aiimin.type.display, modifier = Modifier.alignBy(LastBaseline))
                        Spacer(Modifier.width(10.dp))
                        Column(Modifier.weight(1f).alignBy(LastBaseline)) { meridiem(); greeting() }
                        // Raahi stands on the clock's baseline.
                        mini(Modifier.alignBy { it.measuredHeight }.padding(start = 8.dp))
                    }
                } else {
                    Column(Modifier.semantics(mergeDescendants = true) { contentDescription = "It is ${Dates.clock(now)}.$said" }) {
                        Row(Modifier.fillMaxWidth()) {
                            Text(Dates.clockPlain(now), style = Aiimin.type.display, modifier = Modifier.alignBy(LastBaseline))
                            Spacer(Modifier.width(8.dp))
                            Box(Modifier.weight(1f).alignBy(LastBaseline)) { meridiem() }
                            mini(Modifier.alignBy { it.measuredHeight }.padding(start = 8.dp))
                        }
                        greeting()
                    }
                }
            }
        }
        // PRD 1.2: one "What now?" line, then the stat line (owner, 20 Oct), the slim arc and the Quick doors (Part 17).
        item {
            WhatNowCard(
                u.whatNow,
                onDone = { toggleTask(it) },
                onKeepMinimum = { name -> u.minimums.firstOrNull { it.minimum.name == name && !it.done }?.let { m -> scope.launch { vm.toggleMinimum(m.minimum.id) } } },
                onNotNow = { vm.notNow(it) },
                modifier = Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 20.dp),
            )
        }
        u.dayEndSuggest?.let { t ->
            item { DayEndCard(t, u.dayEnd, onYes = { vm.acceptDayEnd(t) }, onKeep = { vm.keepDayEnd() }, modifier = Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 12.dp)) }
        }
        item { StatLine(u, Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 14.dp, bottom = 4.dp)) }
        item {
            DayHorizon(
                nowMinute = now.hour * 60 + now.minute,
                ticks = later.filter { it.time != null }.map { HorizonTick(it.time!!.hour * 60 + it.time.minute, Dates.clockPlain(it.time)) },
                horizon = Horizons.at(hour, Aiimin.colors.isDark),
                wakeMinute = u.wakeMin, sleepMinute = u.sleepMin,
                modifier = Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 8.dp),
            )
        }
        u.setup?.let { steps ->
            item {
                FirstWeekCard(steps, onStep = { step ->
                    when (step) {
                        aiimin.core.engine.today.SetupStep.SCREEN_TIME -> runCatching { context.startActivity(vm.usageSettings()) }
                        aiimin.core.engine.today.SetupStep.MINIMUM -> nav.open(Route.Minimums)
                        aiimin.core.engine.today.SetupStep.CAPTURE -> nav.capture()
                        aiimin.core.engine.today.SetupStep.DOCUMENT -> nav.tab(aiimin.designsystem.nav.Tab.VAULT)
                        aiimin.core.engine.today.SetupStep.BUDGET -> nav.open(Route.Budget)
                    }
                }, modifier = Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 16.dp))
            }
        }
        item {
            QuickDoorsRow(u.doors, u.pinnedDoors, onPin = { key ->
                vm.togglePin(key)
                toaster.show(if (key in u.pinnedDoors) "Unpinned" else "Pinned to Today")
            }, modifier = Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 16.dp))
        }
        item { PhoneDataCard(vm, Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 12.dp)) }
        item { KeepAliveCard(vm, Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 12.dp)) }

        // ---- Minimums
        item {
            Column(Modifier.padding(horizontal = Aiimin.space.gutter)) {
                SectionHeader(
                    "Minimums · ${u.minimums.count { it.done }} of ${u.minimums.size} kept",
                    action = "Edit",
                    onAction = { nav.open(Route.Minimums) },
                )
            }
        }
        if (u.minimums.isEmpty()) {
            item {
                Column(Modifier.padding(horizontal = Aiimin.space.gutter).padding(bottom = 6.dp)) {
                    Text("The floor for a day you keep: small things you'd do even on a bad day.", style = Aiimin.type.caption)
                    Spacer(Modifier.height(10.dp))
                    AppButton("Add minimums", { nav.open(Route.Minimums) }, kind = ButtonKind.SECONDARY, compact = true)
                }
            }
        }
        u.minimums.forEach { m ->
            item(key = "m" + m.minimum.id) {
                MinimumRow(
                    m, lowBattery,
                    onToggle = { scope.launch { val xp = vm.toggleMinimum(m.minimum.id); if (xp > 0 && !u.hideXp) toaster.show("Kept · +$xp XP") } },
                    onLong = { minimumSheet = m },
                    onProof = { nav.open(Route.Minimums) },
                )
                Hairline(Modifier.padding(horizontal = Aiimin.space.gutter))
            }
        }
        if (lowBattery && u.minimums.isNotEmpty()) {
            item { Text("A lighter day: tiny versions count double today.", style = Aiimin.type.caption, modifier = Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 8.dp)) }
        }
        // ---- Today list (PRD 1.2): one list, an Evening section, and "From yesterday · N" folded at the top.
        item {
            Column(Modifier.padding(horizontal = Aiimin.space.gutter)) {
                SectionHeader(if (light) "Hidden for today" else "Today", action = "All tasks", onAction = { nav.open(Route.Upcoming) })
            }
        }
        if (light) {
            item {
                Text(
                    "${later.count { it.kind == FlowKind.TASK }} tasks are tucked away. Turn off light day to see them.",
                    style = Aiimin.type.caption,
                    modifier = Modifier.padding(horizontal = Aiimin.space.gutter).padding(bottom = 6.dp),
                )
            }
        } else {
            val evening = aiimin.core.engine.today.WhatNow.eveningStart(u.dayEnd)
            val carried = later.filter { it.carried > 0 }
            val fresh = later.filter { it.carried == 0 }
            val dayItems = fresh.filter { it.part != aiimin.core.data.plan.DayPart.EVENING && (it.time == null || it.time.isBefore(evening)) }
            val eveningItems = fresh.filter { it !in dayItems }
            if (later.isEmpty()) {
                item { Text("Nothing left on the plan. The rest of today is yours.", style = Aiimin.type.caption, modifier = Modifier.padding(horizontal = Aiimin.space.gutter).padding(vertical = 8.dp)) }
            }
            if (carried.isNotEmpty()) {
                item(key = "carried") {
                    Row(
                        Modifier.fillMaxWidth().clickable { yesterdayOpenList = !yesterdayOpenList }.padding(horizontal = Aiimin.space.gutter).heightIn(min = 52.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text("From yesterday · ${carried.size}", style = Aiimin.type.body.copy(color = Aiimin.colors.textMuted), modifier = Modifier.weight(1f))
                        Icon(if (yesterdayOpenList) AppIcons.CaretUp else AppIcons.CaretDown, null, tint = Aiimin.colors.textFaint, modifier = Modifier.size(16.dp))
                    }
                    Hairline(Modifier.padding(horizontal = Aiimin.space.gutter))
                }
                if (yesterdayOpenList) carried.forEach { row(it, -1) }
            }
            dayItems.forEachIndexed { i, it -> row(it, i) }
            if (eveningItems.isNotEmpty()) {
                item(key = "evening") { Column(Modifier.padding(horizontal = Aiimin.space.gutter)) { SectionHeader("Evening") } }
                eveningItems.forEachIndexed { i, it -> row(it, dayItems.size + i) }
            }
            if (earlier.isNotEmpty()) {
                item(key = "earlier") {
                    Row(
                        Modifier.fillMaxWidth().clickable { earlierOpen = !earlierOpen }.padding(horizontal = Aiimin.space.gutter).heightIn(min = 52.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        val done = earlier.count { it.done }
                        val open = earlier.size - done
                        Text(
                            "Earlier today · $done done" + if (open > 0) ", $open open" else "",
                            style = Aiimin.type.body.copy(color = Aiimin.colors.textMuted),
                            modifier = Modifier.weight(1f),
                        )
                        Icon(if (earlierOpen) AppIcons.CaretUp else AppIcons.CaretDown, null, tint = Aiimin.colors.textFaint, modifier = Modifier.size(16.dp))
                    }
                    Hairline(Modifier.padding(horizontal = Aiimin.space.gutter))
                }
                if (earlierOpen) earlier.forEach { it ->
                    item(key = "e" + it.kind.name + it.id) {
                        LaterRow(it, onToggle = { toggleTask(it.id) }, onOpen = { if (it.kind == FlowKind.TASK) nav.open(Route.Task(it.id)) }, onLong = {})
                        Hairline(Modifier.padding(horizontal = Aiimin.space.gutter))
                    }
                }
            }
            item { QuickAdd(u.date, vm, Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 10.dp)) }
        }

        // ---- Pinned note
        u.pinned?.let { n ->
            item {
                Column(Modifier.padding(horizontal = Aiimin.space.gutter)) {
                    SectionHeader("Pinned note")
                    Column(Modifier.fillMaxWidth().opensScreen(Route.Note(n.id)).pressable({ armShared(Route.Note(n.id)); nav.open(Route.Note(n.id)) })) {
                        Text(n.title.ifBlank { "Untitled" }, style = Aiimin.type.headline)
                        Text(aiimin.core.data.notes.notePreview(n.body), style = Aiimin.type.caption.copy(fontSize = 14.sp, lineHeight = 20.sp), maxLines = 2, overflow = TextOverflow.Ellipsis, modifier = Modifier.padding(top = 3.dp))
                    }
                }
            }
        }
        // ---- Body of the day (streak and battery live in You, PRD 1.2)
        item { PhoneBody(u, Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 14.dp)) }
        // At a glance: Money review, Vault and Journal one tap from Today (findability audit, plan §2.3.3).
        if (u.glance.isNotEmpty()) {
            item {
                Column(Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 14.dp)) {
                    SectionHeader("At a glance")
                    u.glance.forEach { g ->
                        Row(
                            Modifier.fillMaxWidth().pressable({ nav.go(g.route) }).heightIn(min = 52.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            val warn = g.area == GlanceArea.VAULT
                            Icon(
                                when (g.area) { GlanceArea.MONEY -> AppIcons.Wallet; GlanceArea.VAULT -> AppIcons.WarningCircle; GlanceArea.JOURNAL -> AppIcons.BookOpen },
                                null, tint = if (warn) Aiimin.colors.warn else Aiimin.colors.text, modifier = Modifier.size(22.dp),
                            )
                            Spacer(Modifier.width(12.dp))
                            Text(g.text, style = Aiimin.type.body, modifier = Modifier.weight(1f), maxLines = 2, overflow = TextOverflow.Ellipsis)
                            Icon(AppIcons.CaretRight, null, tint = Aiimin.colors.textMuted, modifier = Modifier.size(16.dp))
                        }
                    }
                }
            }
        }
    }

    minimumSheet?.let { m ->
        AppSheet(onDismiss = { minimumSheet = null }, title = m.minimum.name, subtitle = m.minimum.tiny.takeIf { it.isNotBlank() }?.let { "Tiny version: $it" }) {
            if (u.yesterdayOpen) {
                ListRow(
                    "This was for yesterday",
                    subtitle = "Files it to yesterday at lower evidence. Until 12:00 today, up to 5.",
                    leading = { IconTile(AppIcons.ClockCounter) },
                    onClick = {
                        scope.launch {
                            val ok = vm.backfillMinimum(m.minimum.id)
                            toaster.show(if (ok) "Filed to yesterday" else "Yesterday has settled")
                            minimumSheet = null
                        }
                    },
                )
            }
            ListRow("Add proof", subtitle = "A photo or document lifts this to backed evidence", leading = { IconTile(AppIcons.Camera) }, onClick = {
                minimumSheet = null
                nav.open(Route.Minimums)
            })
            ListRow("Edit minimums", subtitle = "Changes start tomorrow", leading = { IconTile(AppIcons.Sliders) }, onClick = {
                minimumSheet = null
                nav.open(Route.Minimums)
            })
        }
    }
}

/** 1 rising, 0 holding, -1 slipping: the last 7 days against the 28-day base (holding inside ±3). */
internal fun momentum(scores: List<Double>): Int {
    if (scores.size < 8) return 0
    val recent = scores.takeLast(7).average()
    val base = scores.takeLast(35).average()
    return when {
        recent - base > 3 -> 1
        recent - base < -3 -> -1
        else -> 0
    }
}

internal fun ago(at: Long): String {
    val m = (System.currentTimeMillis() - at) / 60_000
    return when {
        m < 1 -> "now"
        m < 60 -> "${m}m"
        m < 24 * 60 -> "${m / 60}h"
        else -> "${m / (24 * 60)}d"
    }
}

@Composable
private fun TodaySkeleton() {
    Column(Modifier.fillMaxSize().background(Aiimin.colors.base).padding(Aiimin.space.gutter).padding(top = 64.dp)) {
        Skeleton(Modifier.width(160.dp).height(26.dp))
        Spacer(Modifier.height(24.dp))
        Skeleton(Modifier.width(150.dp).height(60.dp))
        Spacer(Modifier.height(18.dp))
        Skeleton(Modifier.fillMaxWidth().height(84.dp))
        Spacer(Modifier.height(22.dp))
        Skeleton(Modifier.fillMaxWidth().height(150.dp))
    }
}

/**
 * Score, minimums, focus as three equal columns: number on top, a short label under it. Each cell
 * is one line and shares the width equally, so nothing wraps letter by letter at large text sizes.
 */
@Composable
private fun StatLine(u: TodayUi, modifier: Modifier) {
    val nav = LocalNavigator.current
    val c = Aiimin.colors
    val life = u.life
    val score = life?.readout?.score
    val focus = life?.today?.value(Signals.FOCUS)
    @Composable
    fun RowScope.Cell(value: String, label: String, route: Route, trailing: (@Composable () -> Unit)? = null) {
        // Owner, 20 Oct: each figure and its label centred in its own equal column.
        Column(
            Modifier.weight(1f).opensScreen(route).clip(Shapes.small).clickable { armShared(route); nav.open(route) }.padding(vertical = 6.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(value, style = Aiimin.type.numberMedium, maxLines = 1, overflow = TextOverflow.Ellipsis)
                trailing?.let { Spacer(Modifier.width(4.dp)); it() }
            }
            Text(label, style = Aiimin.type.caption.copy(color = c.textMuted), maxLines = 1, overflow = TextOverflow.Ellipsis, textAlign = androidx.compose.ui.text.style.TextAlign.Center)
        }
    }
    Row(modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.Top) {
        when {
            u.hideScore -> Cell("—", "Score hidden", Route.Score)
            score == null -> {
                val left = life?.readout?.calibrating?.values?.sorted()?.getOrNull(3)
                // D-040: the value and its label say the same thing.
                Cell(if (left != null && left > 0) (if (left == 1) "1 day" else "$left days") else "Soon", "Until your score", Route.Score)
            }
            else -> Cell(score.toString(), life.readout.band.label, Route.Score) {
                Icon(when (momentum(life.readout.series.mapNotNull { it.score })) { 1 -> AppIcons.ArrowUp; -1 -> AppIcons.ArrowDown; else -> AppIcons.ArrowRight }, null, tint = c.textMuted, modifier = Modifier.size(14.dp))
            }
        }
        Cell("${u.minimums.count { it.done }}/${u.minimums.size}", "Minimums", Route.Minimums)
        Cell(Dates.minutes((focus ?: 0.0).toLong()), "Focus", Route.Focus())
    }
}

@OptIn(ExperimentalFoundationApi::class)
@Composable
private fun LaterRow(item: FlowItem, onToggle: () -> Unit, onOpen: () -> Unit, onLong: () -> Unit, modifier: Modifier = Modifier) {
    val c = Aiimin.colors
    Row(
        modifier
            .fillMaxWidth()
            .combinedClickable(onClick = onOpen, onLongClick = onLong, onLongClickLabel = "Remove")
            // Spec T1: time | title | tag, no checkbox. Done lives on the task itself; screen readers get it as an action.
            .semantics {
                if (item.kind == FlowKind.TASK) customActions = listOf(CustomAccessibilityAction("Mark done") { onToggle(); true })
            }
            .padding(start = Aiimin.space.gutter, end = Aiimin.space.gutter)
            .heightIn(min = 56.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(
            item.time?.let(Dates::clockPlain) ?: "anytime",
            style = if (item.time != null) Aiimin.type.bodyStrong.copy(color = if (item.done) c.textFaint else c.text) else Aiimin.type.caption,
            modifier = Modifier.width(56.dp),
        )
        Column(Modifier.weight(1f).padding(vertical = 8.dp)) {
            DoneText(item.title, item.done && item.kind == FlowKind.TASK, style = Aiimin.type.bodyStrong.copy(fontWeight = FontWeight.Medium))
            val sub = listOfNotNull(item.subtitle.takeIf { it != null }, if (item.priority == 2 && !item.done) "High" else null, if (item.carried > 0 && !item.done) "from yesterday" else null).distinct().joinToString(" · ")
            if (sub.isNotBlank()) Text(sub, style = Aiimin.type.caption)
        }
        Spacer(Modifier.width(8.dp))
        Text(
            when (item.kind) { FlowKind.TASK -> "task"; FlowKind.EVENT -> "event"; FlowKind.EXPIRY -> "expiry" },
            style = Aiimin.type.caption,
        )
    }
}

@OptIn(ExperimentalFoundationApi::class)
@Composable
private fun MinimumRow(m: MinimumToday, lowBattery: Boolean, onToggle: () -> Unit, onLong: () -> Unit, onProof: () -> Unit) {
    val c = Aiimin.colors
    val name = if (lowBattery && m.minimum.tiny.isNotBlank()) m.minimum.tiny else m.minimum.name
    val tier = when {
        !m.done -> 'C'
        (m.tick?.toggles ?: 1) >= 3 || m.tick?.backfilled == true -> 'D'
        m.tick?.proofDocId != null -> 'B'
        else -> 'C'
    }
    Row(
        Modifier
            .fillMaxWidth()
            .combinedClickable(onClick = onToggle, onLongClick = onLong, onClickLabel = if (m.done) "Untick" else "Keep")
            .padding(start = Aiimin.space.gutter - 10.dp, end = Aiimin.space.gutter - 4.dp)
            .heightIn(min = 56.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        CheckCircle(m.done, onToggle, "Keep $name", proof = m.tick?.proofDocId != null)
        Column(Modifier.weight(1f).padding(vertical = 8.dp)) {
            DoneText(name, m.done, style = Aiimin.type.bodyStrong.copy(fontWeight = FontWeight.Medium))
            val how = when {
                m.tick?.proofDocId != null -> "Backed by a photo"
                m.done && m.tick?.backfilled == true -> "Filed to yesterday"
                m.done -> "Your tap"
                else -> "Tap to keep it, or add a photo"
            }
            Text(how, style = Aiimin.type.caption)
        }
        if (m.done) EvidenceDot(tier)
        else AppIconButtonProof(onProof)
    }
}

@Composable
private fun AppIconButtonProof(onClick: () -> Unit) {
    aiimin.designsystem.component.AppIconButton(AppIcons.Camera, "Add proof", onClick, tint = Aiimin.colors.textMuted)
}

@Composable
private fun QuickAdd(day: java.time.LocalDate, vm: TodayViewModel, modifier: Modifier) {
    val c = Aiimin.colors
    var text by remember { mutableStateOf("") }
    val part = aiimin.core.data.plan.DayPart.now()
    Row(
        modifier.fillMaxWidth().clip(Shapes.control).border(1.dp, c.borderStrong, Shapes.control).padding(horizontal = 14.dp).heightIn(min = 48.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(AppIcons.Plus, null, tint = c.textFaint, modifier = Modifier.size(16.dp))
        Spacer(Modifier.width(10.dp))
        Box(Modifier.weight(1f)) {
            if (text.isEmpty()) Text("Add a task for ${part.label.lowercase()}", style = Aiimin.type.body.copy(color = c.textFaint))
            BasicTextField(
                text, { text = it }, singleLine = true, textStyle = Aiimin.type.body, cursorBrush = SolidColor(c.text),
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
                keyboardActions = KeyboardActions(onDone = { vm.addTask(text, part, day); text = "" }),
                modifier = Modifier.fillMaxWidth().semantics { contentDescription = "Add a task" },
            )
        }
        if (text.isNotBlank()) aiimin.designsystem.component.AppIconButton(AppIcons.ArrowRight, "Add", { vm.addTask(text, part, day); text = "" }, tint = c.link)
    }
}

@Composable
internal fun BatteryMeter(fraction: Float, low: Boolean, segments: Int = 10, modifier: Modifier = Modifier) {
    val c = Aiimin.colors
    val on = (fraction.coerceIn(0f, 1f) * segments).let { kotlin.math.round(it).toInt() }
    Row(modifier.semantics { contentDescription = "Battery ${(fraction * 100).toInt()} percent" }, horizontalArrangement = Arrangement.spacedBy(3.dp)) {
        repeat(segments) { i ->
            Box(Modifier.size(width = 7.dp, height = 12.dp).clip(androidx.compose.foundation.shape.RoundedCornerShape(1.5.dp)).background(if (i < on) (if (low) c.warn else c.text) else c.overlay))
        }
    }
}

@Composable
private fun PhoneBody(u: TodayUi, modifier: Modifier) {
    val nav = LocalNavigator.current
    val d = u.device
    val c = Aiimin.colors
    Row(modifier.fillMaxWidth().padding(top = 4.dp)) {
        Column(Modifier.weight(1f).clickable { nav.open(Route.PhoneDay) }.padding(vertical = 12.dp)) {
            // Total matches Android's Digital Wellbeing (calendar day); the caption says what the score counts.
            val sum = d?.screenMs?.let { ScreenSummary.of(it, d.screenPersonalMs ?: it, emptyList(), 0) }
            Text("Screen time", style = Aiimin.type.caption)
            Text(sum?.let { ScreenSummary.fmt(it.totalMs) } ?: "—", style = Aiimin.type.numberSmall, modifier = Modifier.padding(top = 3.dp))
            Text(
                sum?.countedLine ?: d?.pickups?.let { ScreenSummary.pickupLine(it, d.pickupsLabel) } ?: d?.unlocks?.let { ScreenSummary.pickupLine(it, "unlocks") } ?: "Turn on screen time",
                style = Aiimin.type.caption,
            )
        }
        Box(Modifier.width(1.dp).height(72.dp).background(c.border))
        Column(Modifier.weight(1f).clickable { nav.open(Route.Body) }.padding(vertical = 12.dp, horizontal = 16.dp)) {
            Text("Sleep · steps", style = Aiimin.type.caption)
            Text(d?.sleepMin?.let { Dates.minutes(it.toLong()) } ?: "—", style = Aiimin.type.numberSmall, modifier = Modifier.padding(top = 3.dp))
            Text(d?.steps?.let { "%,d steps".format(it) } ?: "Connect sensors", style = Aiimin.type.caption)
        }
    }
    Hairline()
}


/**
 * Shown only while screen time or steps can't be measured: one tap per missing source. Without
 * these the Body and Mind areas of the score have nothing measured to stand on.
 */
@Composable
private fun PhoneDataCard(vm: TodayViewModel, modifier: Modifier) {
    val context = androidx.compose.ui.platform.LocalContext.current
    val a by vm.access.collectAsStateWithLifecycle()
    androidx.lifecycle.compose.LifecycleEventEffect(androidx.lifecycle.Lifecycle.Event.ON_RESUME) { vm.refreshAccess() }
    val health = androidx.activity.compose.rememberLauncherForActivityResult(vm.healthContract()) { vm.refreshAccess() }
    val perm = androidx.activity.compose.rememberLauncherForActivityResult(androidx.activity.result.contract.ActivityResultContracts.RequestPermission()) { vm.refreshAccess() }
    val acc = a ?: return
    if (acc.usage && acc.steps) return
    val c = Aiimin.colors
    val shape = androidx.compose.foundation.shape.RoundedCornerShape(14.dp)
    Column(modifier.fillMaxWidth().clip(shape).background(c.surface).border(1.dp, c.border, shape).padding(16.dp)) {
        Text("MEASURE YOUR DAY", style = Aiimin.type.eyebrow.copy(color = c.textMuted))
        Text("Let the phone count screen time and steps", style = Aiimin.type.headline, modifier = Modifier.padding(top = 4.dp))
        Text("Measured numbers count more in your score than taps. They're read on this phone and never leave it.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 4.dp, bottom = 8.dp))
        if (!acc.usage) SetupRow(AppIcons.DeviceMobile, "Screen time", "Opens Usage access › AIIMIN › Allow") { runCatching { context.startActivity(vm.usageSettings()) } }
        if (!acc.steps) SetupRow(AppIcons.Footprints, "Steps and sleep", if (acc.health == aiimin.core.sensing.HealthAvailability.AVAILABLE) "Health Connect asks once" else "Step counter on this phone") {
            when (acc.health) {
                aiimin.core.sensing.HealthAvailability.AVAILABLE -> health.launch(vm.healthPermissions)
                else -> if (android.os.Build.VERSION.SDK_INT >= 29) perm.launch(android.Manifest.permission.ACTIVITY_RECOGNITION) else runCatching { context.startActivity(vm.healthInstall()) }
            }
        }
    }
}

/** Shown when Pulse sees a stalled job on a phone known to pause apps (or with battery limits on). */
@Composable
private fun KeepAliveCard(vm: TodayViewModel, modifier: Modifier) {
    val steps by vm.keepAlive.collectAsStateWithLifecycle()
    val text = steps ?: return
    val context = androidx.compose.ui.platform.LocalContext.current
    val nav = LocalNavigator.current
    val c = Aiimin.colors
    val shape = androidx.compose.foundation.shape.RoundedCornerShape(14.dp)
    Column(modifier.fillMaxWidth().clip(shape).background(c.surface).border(1.dp, c.border, shape).padding(16.dp)) {
        Text("Your phone is pausing AIIMIN in the background", style = Aiimin.type.headline)
        Text("So screen time, steps and reminders pause until you open the app. $text", style = Aiimin.type.caption, modifier = Modifier.padding(top = 6.dp))
        // Primary action full width; the two quiet ones share a row. Fits any phone width and text size.
        AppButton("Open App info", { runCatching { context.startActivity(vm.appDetails()) } }, Modifier.fillMaxWidth().padding(top = 14.dp))
        Row(Modifier.fillMaxWidth().padding(top = 6.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            AppButton("What's running", { nav.open(aiimin.designsystem.nav.Route.Running) }, Modifier.weight(1f), kind = ButtonKind.GHOST, compact = true)
            AppButton("Later", { vm.dismissKeepAlive() }, Modifier.weight(1f), kind = ButtonKind.GHOST, compact = true)
        }
    }
}

@Composable
private fun SetupRow(icon: androidx.compose.ui.graphics.vector.ImageVector, title: String, sub: String, onClick: () -> Unit) {
    val c = Aiimin.colors
    Row(Modifier.fillMaxWidth().clip(androidx.compose.foundation.shape.RoundedCornerShape(10.dp)).clickable(onClick = onClick).heightIn(min = 56.dp).padding(vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
        Icon(icon, null, tint = c.text, modifier = Modifier.size(22.dp))
        Spacer(Modifier.width(12.dp))
        Column(Modifier.weight(1f)) {
            Text(title, style = Aiimin.type.bodyStrong)
            Text(sub, style = Aiimin.type.caption)
        }
        Text("Turn on", style = Aiimin.type.label.copy(color = c.link, fontSize = 14.sp))
    }
}
