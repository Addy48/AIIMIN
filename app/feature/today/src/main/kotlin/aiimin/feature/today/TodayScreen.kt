package aiimin.feature.today

import aiimin.core.data.day.DayRepository
import aiimin.core.data.life.NudgeAction
import aiimin.core.data.plan.DayPart
import aiimin.core.data.plan.MinimumToday
import aiimin.core.data.util.Dates
import aiimin.core.engine.Band
import aiimin.core.engine.BatteryState
import aiimin.core.engine.Signals
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppIconButton
import aiimin.designsystem.component.AppSheet
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.CheckCircle
import aiimin.designsystem.component.CountingNumber
import aiimin.designsystem.component.DoneText
import aiimin.designsystem.component.EmptyState
import aiimin.designsystem.component.IconTile
import aiimin.designsystem.component.LargeHeader
import aiimin.designsystem.component.ListRow
import aiimin.designsystem.component.Panel
import aiimin.designsystem.component.RingSpec
import aiimin.designsystem.component.Rings
import aiimin.designsystem.component.SectionHeader
import aiimin.designsystem.component.Segmented
import aiimin.designsystem.component.Skeleton
import aiimin.designsystem.component.Tag
import aiimin.designsystem.component.pressable
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.LocalToaster
import aiimin.designsystem.nav.Route
import aiimin.designsystem.theme.Aiimin
import aiimin.designsystem.theme.Motion
import aiimin.designsystem.theme.Shapes
import androidx.compose.animation.animateContentSize
import androidx.compose.animation.core.tween
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.foundation.clickable
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import java.time.LocalTime
import kotlinx.coroutines.launch

@Composable
fun TodayScreen(vm: TodayViewModel = hiltViewModel()) {
    val ui by vm.ui.collectAsStateWithLifecycle()
    val part by vm.part.collectAsStateWithLifecycle()
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    var minimumSheet by remember { mutableStateOf<MinimumToday?>(null) }
    val u = ui
    if (u == null) {
        TodaySkeleton()
        return
    }

    fun toggleTask(id: String) = scope.launch {
        val r = vm.toggleTask(id) ?: return@launch
        if (r.done) toaster.show(if (r.xp > 0 && !u.hideXp) "Done · +${r.xp} XP" else "Done")
    }

    LazyColumn(Modifier.fillMaxSize().background(Aiimin.colors.base), contentPadding = PaddingValues(bottom = 120.dp)) {
        item {
            LargeHeader(
                title = greeting(u.name),
                overline = Dates.long(u.date),
            ) {
                AppIconButton(AppIcons.Search, "Search", { nav.open(Route.Search) })
                Box {
                    AppIconButton(AppIcons.Bell, "Notifications", { nav.open(Route.Notifications) })
                    if (u.unread > 0) Box(Modifier.align(Alignment.TopEnd).padding(10.dp).size(8.dp).clip(CircleShape).background(Aiimin.colors.accent))
                }
                AppIconButton(AppIcons.Chat, "Assistant", { nav.open(Route.Assistant()) })
            }
        }
        if (u.yesterdayOpen) {
            item {
                Row(Modifier.padding(horizontal = Aiimin.space.gutter, vertical = 4.dp)) {
                    Tag("Yesterday stays open until 12:00 — long-press a minimum to file it there", icon = AppIcons.ClockCounter)
                }
            }
        }
        item { NowNext(u, vm) { toggleTask(it) } }
        item { LifeStrip(u) }
        val nudges = u.life?.nudges.orEmpty()
        if (nudges.isNotEmpty() && !u.hideScore) {
            item {
                Column(Modifier.padding(horizontal = Aiimin.space.gutter)) {
                    SectionHeader("Move it today")
                    nudges.forEach { n ->
                        NudgeRow(n.label, n.gain) {
                            when (n.action) {
                                NudgeAction.FOCUS_25 -> nav.open(Route.Focus(minutes = 25))
                                NudgeAction.JOURNAL -> nav.open(Route.JournalWrite())
                                NudgeAction.KEEP_MINIMUM -> nav.open(Route.Minimums)
                                NudgeAction.FINISH_TASK -> u.now?.item?.takeIf { it.kind == FlowKind.TASK }?.let { nav.open(Route.Task(it.id)) }
                                NudgeAction.WALK -> nav.open(Route.PhoneDay)
                            }
                        }
                    }
                }
            }
        }
        item {
            Column(Modifier.padding(horizontal = Aiimin.space.gutter)) {
                SectionHeader("Day flow", action = "Calendar", onAction = { nav.open(Route.Calendar) })
                val counts = DayPart.entries.map { p -> u.flow[p].orEmpty().count { !it.done && it.kind != FlowKind.EXPIRY } }
                Segmented(
                    DayPart.entries.mapIndexed { i, p -> if (counts[i] > 0) "${p.label} · ${counts[i]}" else p.label },
                    DayPart.entries.indexOf(part),
                    { vm.selectPart(DayPart.entries[it]) },
                )
                Spacer(Modifier.height(8.dp))
            }
        }
        val list = u.flow[part].orEmpty()
        val nowLineIndex = if (part == DayPart.now()) list.indexOfFirst { it.time != null && it.time > LocalTime.now() }.let { if (it < 0) list.count { i -> i.time != null } else it } else -1
        if (list.isEmpty()) {
            item {
                Text(
                    emptyPartLine(part),
                    style = Aiimin.type.caption,
                    modifier = Modifier.padding(horizontal = Aiimin.space.gutter + 4.dp, vertical = 10.dp),
                )
            }
        }
        list.forEachIndexed { i, it ->
            if (i == nowLineIndex && it.time != null) item(key = "nowline") { NowLine() }
            item(key = it.kind.name + it.id) {
                DayRow(
                    it,
                    onToggle = { toggleTask(it.id) },
                    onOpen = {
                        when (it.kind) {
                            FlowKind.TASK -> nav.open(Route.Task(it.id))
                            FlowKind.EXPIRY -> nav.open(Route.Doc(it.id))
                            FlowKind.EVENT -> nav.open(Route.Calendar)
                        }
                    },
                    onLong = {
                        if (it.kind == FlowKind.TASK) {
                            scope.launch {
                                val t = vm.deleteTask(it.id) ?: return@launch
                                toaster.undo("Task removed") { vm.restoreTask(t) }
                            }
                        }
                    },
                    onFocus = { nav.open(Route.Focus(taskId = it.id, label = it.title)) },
                )
            }
        }
        item { QuickAdd(part) { title -> vm.addTask(title, part, u.date) } }

        item { MinimumsBlock(u, vm, onToggle = { m -> scope.launch { val xp = vm.toggleMinimum(m.minimum.id); if (xp > 0 && !u.hideXp) toaster.show("Kept · +$xp XP") } }, onLong = { minimumSheet = it }) }
        item { PhoneBody(u) }
        item { QuickActions(u) }
        if (u.activity.isNotEmpty()) {
            item {
                Column(Modifier.padding(horizontal = Aiimin.space.gutter)) {
                    SectionHeader("Recent", action = "All", onAction = { nav.open(Route.Activity) })
                    u.activity.take(3).forEach { a ->
                        Row(Modifier.padding(vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
                            aiimin.designsystem.component.EvidenceDot(a.tier.name.first())
                            Spacer(Modifier.width(10.dp))
                            Text(a.text, style = Aiimin.type.body, modifier = Modifier.weight(1f))
                            Text(ago(a.at), style = Aiimin.type.caption)
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
            ListRow("Add proof", subtitle = "A photo or document lifts this to corroborated evidence", leading = { IconTile(AppIcons.Camera) }, onClick = {
                minimumSheet = null
                nav.open(Route.Minimums)
            })
            ListRow("Edit minimums", leading = { IconTile(AppIcons.Sliders) }, onClick = {
                minimumSheet = null
                nav.open(Route.Minimums)
            })
        }
    }
}

private fun greeting(name: String): String {
    val h = LocalTime.now().hour
    val part = when {
        h < 5 -> "Late night"
        h < 12 -> "Morning"
        h < 17 -> "Afternoon"
        else -> "Evening"
    }
    return if (name.isBlank()) part else "$part, ${name.trim().split(" ").first()}"
}

private fun emptyPartLine(p: DayPart) = when (p) {
    DayPart.MORNING -> "Nothing planned this morning."
    DayPart.AFTERNOON -> "A clear afternoon."
    DayPart.EVENING -> "Nothing for the evening yet."
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
        Skeleton(Modifier.width(140.dp).height(14.dp))
        Spacer(Modifier.height(10.dp))
        Skeleton(Modifier.width(220.dp).height(28.dp))
        Spacer(Modifier.height(24.dp))
        Skeleton(Modifier.fillMaxWidth().height(110.dp))
        Spacer(Modifier.height(12.dp))
        Skeleton(Modifier.fillMaxWidth().height(150.dp))
    }
}

@Composable
private fun NowNext(u: TodayUi, vm: TodayViewModel, onDone: (String) -> Unit) {
    val nav = LocalNavigator.current
    val c = Aiimin.colors
    val now = u.now
    Panel(Modifier.padding(horizontal = Aiimin.space.gutter, vertical = 8.dp), padding = PaddingValues(0.dp)) {
        Row(Modifier.fillMaxWidth()) {
            Column(Modifier.padding(16.dp).weight(1f)) {
                if (now == null) {
                    Text("NOTHING PLANNED", style = Aiimin.type.eyebrow)
                    Spacer(Modifier.height(6.dp))
                    Text("A blank day. Add one thing that matters.", style = Aiimin.type.headline)
                    Spacer(Modifier.height(12.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        AppButton("Plan with AI", { nav.open(Route.Assistant("Plan my day", autoSend = true)) }, compact = true, icon = AppIcons.Chat)
                        AppButton("Add task", { nav.capture() }, kind = ButtonKind.SECONDARY, compact = true)
                    }
                    return@Column
                }
                val it = now.item
                val eyebrow = when {
                    now.isNow -> "NOW"
                    it.time != null -> {
                        val m = vm.minutesUntil(it.time)
                        if (m <= 0) "NEXT" else "NEXT · IN ${if (m < 60) "$m MIN" else "${m / 60} H ${m % 60} MIN"}"
                    }
                    else -> "UP NEXT"
                }
                Text(eyebrow, style = Aiimin.type.eyebrow.copy(color = if (now.isNow) c.accent else c.textFaint))
                Spacer(Modifier.height(6.dp))
                Text(it.title, style = Aiimin.type.headline.copy(fontSize = 20.sp), maxLines = 2)
                val time = listOfNotNull(it.time?.let(Dates::clock), it.end?.let { e -> "– " + Dates.clock(e) }).joinToString(" ")
                if (time.isNotBlank() || it.subtitle != null) {
                    Text(listOfNotNull(time.ifBlank { null }, it.subtitle).joinToString(" · "), style = Aiimin.type.caption, modifier = Modifier.padding(top = 2.dp))
                }
                Spacer(Modifier.height(12.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                    if (it.kind == FlowKind.TASK) {
                        AppButton("Done", { onDone(it.id) }, compact = true, icon = AppIcons.Check)
                        AppButton("Focus", { nav.open(Route.Focus(taskId = it.id, label = it.title)) }, kind = ButtonKind.SECONDARY, compact = true, icon = AppIcons.Timer)
                    } else {
                        AppButton("Open", { nav.open(Route.Calendar) }, kind = ButtonKind.SECONDARY, compact = true)
                    }
                    Spacer(Modifier.weight(1f))
                    if (now.moreToday > 0) Text("+${now.moreToday} today", style = Aiimin.type.caption)
                }
            }
        }
    }
}

@Composable
private fun LifeStrip(u: TodayUi) {
    val nav = LocalNavigator.current
    val c = Aiimin.colors
    val life = u.life
    val today = life?.today
    val minsPlanned = today?.minimums?.planned ?: 0
    val minsKept = today?.minimums?.kept ?: 0
    val plan = today?.value(Signals.TASKS)
    val steps = u.device?.steps
    val stepsTarget = life?.intentions?.card(Signals.STEPS)?.target ?: 8000.0
    Panel(Modifier.padding(horizontal = Aiimin.space.gutter, vertical = 8.dp), onClick = { nav.open(Route.Score) }) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Rings(
                listOf(
                    RingSpec(if (minsPlanned > 0) minsKept.toFloat() / minsPlanned else 0f, c.done, "Minimums"),
                    RingSpec(((plan ?: 0.0) / 100).toFloat(), c.accent, "Planned tasks"),
                    RingSpec(((steps ?: 0L) / stepsTarget).toFloat(), c.domains[4], "Movement"),
                ),
                size = 104.dp, stroke = 10.dp,
            )
            Spacer(Modifier.width(18.dp))
            Column(Modifier.weight(1f)) {
                val score = life?.readout?.score
                if (u.hideScore) {
                    Text("LIFE SCORE", style = Aiimin.type.eyebrow)
                    Text("Hidden", style = Aiimin.type.headline.copy(color = c.textMuted))
                } else if (score == null) {
                    Text("CALIBRATING", style = Aiimin.type.eyebrow)
                    val left = life?.readout?.calibrating?.values?.sorted()?.getOrNull(3) ?: 14
                    Text("$left days to your first score", style = Aiimin.type.bodyStrong, modifier = Modifier.padding(top = 4.dp))
                    Text("Measured against you, not anyone else.", style = Aiimin.type.caption)
                } else {
                    Text("LIFE SCORE", style = Aiimin.type.eyebrow)
                    Row(verticalAlignment = Alignment.Bottom) {
                        CountingNumber(score, Aiimin.type.numberLarge)
                        Spacer(Modifier.width(8.dp))
                        Text(life.readout.band.label, style = Aiimin.type.label.copy(color = bandColor(life.readout.band)), modifier = Modifier.padding(bottom = 6.dp))
                    }
                }
                Spacer(Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(14.dp)) {
                    life?.battery?.let { b ->
                        MiniStat(
                            when (b.state) {
                                BatteryState.COMEBACK -> AppIcons.BatteryEmpty
                                BatteryState.LOW -> AppIcons.BatteryLow
                                else -> AppIcons.BatteryHigh
                            },
                            if (b.state == BatteryState.COMEBACK) "Comeback ${b.comebackDays}/3" else "${b.value}%",
                            if (b.state == BatteryState.OK) c.textMuted else c.warn,
                        )
                    }
                    life?.readout?.streak?.let { MiniStat(AppIcons.Flame, "${it.current}d", if (it.current > 0) c.accent else c.textMuted) }
                }
            }
        }
        Spacer(Modifier.height(12.dp))
        Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
            Legend(c.done, "Minimums", "$minsKept/$minsPlanned")
            Legend(c.accent, "Plan", plan?.let { "${it.toInt()}%" } ?: "—")
            Legend(c.domains[4], "Move", steps?.let { "%,d".format(it) } ?: "—")
        }
    }
}

@Composable
private fun bandColor(b: Band): Color = when (b) {
    Band.ELITE, Band.STRONG -> Aiimin.colors.done
    Band.GOOD -> Aiimin.colors.text
    Band.STEADY -> Aiimin.colors.textMuted
    Band.REBUILDING -> Aiimin.colors.warn
    Band.CALIBRATING -> Aiimin.colors.textFaint
}

@Composable
private fun MiniStat(icon: ImageVector, text: String, tint: Color) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Icon(icon, null, tint = tint, modifier = Modifier.size(15.dp))
        Spacer(Modifier.width(4.dp))
        Text(text, style = Aiimin.type.label.copy(color = tint, fontFeatureSettings = "tnum"))
    }
}

@Composable
private fun Legend(color: Color, label: String, value: String) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Box(Modifier.size(8.dp).clip(CircleShape).background(color))
        Spacer(Modifier.width(6.dp))
        Text(label, style = Aiimin.type.caption)
        Spacer(Modifier.width(6.dp))
        Text(value, style = Aiimin.type.label.copy(fontFeatureSettings = "tnum"))
    }
}

@Composable
private fun NudgeRow(label: String, gain: Double, onClick: () -> Unit) {
    val c = Aiimin.colors
    Row(
        Modifier.fillMaxWidth().padding(vertical = 3.dp).clip(Shapes.row).background(c.surface).border(1.dp, c.border, Shapes.row)
            .pressable(onClick).padding(horizontal = 14.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text("+" + "%.1f".format(gain), style = Aiimin.type.numberSmall.copy(color = c.done), modifier = Modifier.width(52.dp))
        Text(label, style = Aiimin.type.body, modifier = Modifier.weight(1f))
        Icon(AppIcons.ArrowRight, null, tint = c.textFaint, modifier = Modifier.size(16.dp))
    }
}

@Composable
private fun NowLine() {
    val c = Aiimin.colors
    Row(Modifier.padding(horizontal = Aiimin.space.gutter, vertical = 2.dp).semantics { contentDescription = "Now" }, verticalAlignment = Alignment.CenterVertically) {
        Text(Dates.clock(LocalTime.now()), style = Aiimin.type.caption.copy(color = c.accent, fontFeatureSettings = "tnum"), modifier = Modifier.width(64.dp))
        Box(Modifier.size(6.dp).clip(CircleShape).background(c.accent))
        Box(Modifier.weight(1f).height(1.dp).background(c.accent.copy(alpha = 0.6f)))
    }
}

@OptIn(ExperimentalFoundationApi::class)
@Composable
private fun DayRow(item: FlowItem, onToggle: () -> Unit, onOpen: () -> Unit, onLong: () -> Unit, onFocus: () -> Unit) {
    val c = Aiimin.colors
    Row(
        Modifier
            .fillMaxWidth()
            .animateContentSize(tween(Motion.BASE))
            .combinedClickable(onClick = onOpen, onLongClick = onLong, onLongClickLabel = "Remove")
            .padding(start = Aiimin.space.gutter, end = 8.dp)
            .heightIn(min = 56.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(
            item.time?.let(Dates::clock) ?: if (item.kind == FlowKind.TASK) "Any" else "All day",
            style = Aiimin.type.caption.copy(fontFeatureSettings = "tnum", color = if (item.time != null) c.textMuted else c.textFaint),
            modifier = Modifier.width(64.dp),
        )
        when (item.kind) {
            FlowKind.TASK -> CheckCircle(item.done, onToggle, "Mark ${item.title} done")
            FlowKind.EVENT -> Box(Modifier.size(44.dp), contentAlignment = Alignment.Center) { Box(Modifier.size(width = 4.dp, height = 22.dp).clip(Shapes.pill).background(c.violet)) }
            FlowKind.EXPIRY -> Box(Modifier.size(44.dp), contentAlignment = Alignment.Center) { Icon(AppIcons.ShieldCheck, null, tint = c.warn, modifier = Modifier.size(20.dp)) }
        }
        Column(Modifier.weight(1f).padding(vertical = 8.dp)) {
            DoneText(item.title, item.done && item.kind == FlowKind.TASK)
            val sub = listOfNotNull(
                item.subtitle,
                if (item.priority == 2 && !item.done) "High" else null,
                if (item.assignee == "me") "Family" else null,
            ).joinToString(" · ")
            if (sub.isNotBlank()) Text(sub, style = Aiimin.type.caption)
        }
        if (item.kind == FlowKind.TASK && !item.done) {
            AppIconButton(AppIcons.Timer, "Focus on ${item.title}", onFocus, tint = c.textFaint)
        }
    }
}

@Composable
private fun QuickAdd(part: DayPart, onAdd: (String) -> Unit) {
    val c = Aiimin.colors
    var text by remember { mutableStateOf("") }
    Row(
        Modifier.padding(horizontal = Aiimin.space.gutter, vertical = 6.dp).fillMaxWidth().clip(Shapes.row).border(1.dp, c.border, Shapes.row)
            .padding(horizontal = 14.dp).heightIn(min = 46.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(AppIcons.Plus, null, tint = c.textFaint, modifier = Modifier.size(16.dp))
        Spacer(Modifier.width(10.dp))
        Box(Modifier.weight(1f)) {
            if (text.isEmpty()) Text("Add to ${part.label.lowercase()}", style = Aiimin.type.body.copy(color = c.textFaint))
            BasicTextField(
                text, { text = it }, singleLine = true, textStyle = Aiimin.type.body, cursorBrush = SolidColor(c.accent),
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
                keyboardActions = KeyboardActions(onDone = { onAdd(text); text = "" }),
                modifier = Modifier.fillMaxWidth().semantics { contentDescription = "Add to ${part.label.lowercase()}" },
            )
        }
        if (text.isNotBlank()) AppIconButton(AppIcons.ArrowRight, "Add", { onAdd(text); text = "" }, tint = c.accent)
    }
}

@OptIn(ExperimentalLayoutApi::class, ExperimentalFoundationApi::class)
@Composable
private fun MinimumsBlock(u: TodayUi, vm: TodayViewModel, onToggle: (MinimumToday) -> Unit, onLong: (MinimumToday) -> Unit) {
    val nav = LocalNavigator.current
    val c = Aiimin.colors
    val scope = rememberCoroutineScope()
    val toaster = LocalToaster.current
    val light = u.dayState?.light == true
    val lowBattery = u.life?.battery?.state != BatteryState.OK
    Column(Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 12.dp)) {
        SectionHeader(
            "Daily minimums" + if (u.minimums.isNotEmpty()) " · ${u.minimums.count { it.done }} of ${u.minimums.size}" else "",
            action = if (light) "Light day on" else "Light day",
            onAction = {
                scope.launch {
                    when (val r = vm.setLight(!light)) {
                        is DayRepository.Toggle.Limit -> toaster.show(r.message)
                        DayRepository.Toggle.Done -> toaster.show(if (!light) "Light day — just the minimums, no pressure" else "Light day off")
                    }
                }
            },
        )
        if (u.minimums.isEmpty()) {
            EmptyState(AppIcons.ListChecks, "No minimums yet", "The floor for a day you keep: small things you'll do even on a bad day.", action = "Add minimums", onAction = { nav.open(Route.Minimums) })
            return@Column
        }
        FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            u.minimums.forEach { m ->
                val label = if (lowBattery && m.minimum.tiny.isNotBlank()) m.minimum.tiny else m.minimum.name
                Row(
                    Modifier
                        .clip(Shapes.control)
                        .background(if (m.done) c.doneSoft else c.surface)
                        .border(1.dp, if (m.done) c.done.copy(alpha = 0.5f) else c.border, Shapes.control)
                        .combinedClickable(onClick = { onToggle(m) }, onLongClick = { onLong(m) }, onClickLabel = if (m.done) "Untick" else "Keep")
                        .padding(start = 6.dp, end = 14.dp)
                        .heightIn(min = 40.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Box(
                        Modifier.size(22.dp).clip(CircleShape).background(if (m.done) c.done else Color.Transparent)
                            .border(1.5.dp, if (m.done) c.done else c.borderStrong, CircleShape),
                        contentAlignment = Alignment.Center,
                    ) { if (m.done) Icon(AppIcons.Check, null, tint = Color.White, modifier = Modifier.size(12.dp)) }
                    Spacer(Modifier.width(8.dp))
                    Text(label, style = Aiimin.type.label.copy(color = if (m.done) c.text else c.textMuted))
                    if (m.tick?.proofDocId != null) {
                        Spacer(Modifier.width(6.dp))
                        Icon(AppIcons.Paperclip, null, tint = c.done, modifier = Modifier.size(12.dp))
                    }
                }
            }
        }
        if (lowBattery) Text("Low battery: tiny versions count double today.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 8.dp))
    }
}

@Composable
private fun PhoneBody(u: TodayUi) {
    val nav = LocalNavigator.current
    val d = u.device
    Column(Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 16.dp)) {
        SectionHeader("Phone & body", action = "Details", onAction = { nav.open(Route.PhoneDay) })
        Panel(onClick = { nav.open(Route.PhoneDay) }) {
            Row(Modifier.fillMaxWidth()) {
                BodyStat(AppIcons.Footprints, d?.steps?.let { "%,d".format(it) }, "steps", Modifier.weight(1f))
                BodyStat(AppIcons.Phone, d?.screenMs?.let { Dates.minutes(it / 60_000) }, "screen", Modifier.weight(1f))
                BodyStat(AppIcons.LockOpen, d?.unlocks?.toString(), "unlocks", Modifier.weight(1f))
                BodyStat(AppIcons.Bed, d?.sleepMin?.let { Dates.minutes(it.toLong()) }, "sleep", Modifier.weight(1f))
            }
            if (d == null || (d.steps == null && d.screenMs == null)) {
                Text("Connect sensors to measure these automatically", style = Aiimin.type.caption.copy(color = Aiimin.colors.accent), modifier = Modifier.padding(top = 10.dp).clickable { nav.open(Route.Sensors) })
            }
        }
    }
}

@Composable
private fun BodyStat(icon: ImageVector, value: String?, label: String, modifier: Modifier) {
    val c = Aiimin.colors
    Column(modifier, horizontalAlignment = Alignment.Start) {
        Icon(icon, null, tint = c.textFaint, modifier = Modifier.size(18.dp))
        Spacer(Modifier.height(6.dp))
        Text(value ?: "—", style = Aiimin.type.numberSmall.copy(fontWeight = FontWeight.SemiBold, color = if (value == null) c.textFaint else c.text))
        Text(label, style = Aiimin.type.caption)
    }
}

@Composable
private fun QuickActions(u: TodayUi) {
    val nav = LocalNavigator.current
    val h = LocalTime.now().hour
    data class QA(val icon: ImageVector, val label: String, val go: () -> Unit)
    val actions = buildList {
        u.expiringId?.let { id -> add(QA(AppIcons.ShieldCheck, "Renew", { nav.open(Route.Doc(id)) })) }
        if (h < 16) {
            add(QA(AppIcons.Chat, "Plan", { nav.open(Route.Assistant("Plan my day", autoSend = true)) }))
            add(QA(AppIcons.Timer, "Focus", { nav.open(Route.Focus()) }))
            add(QA(AppIcons.Calendar, "Calendar", { nav.open(Route.Calendar) }))
            add(QA(AppIcons.Note, "Note", { nav.open(Route.Note()) }))
        } else {
            add(QA(AppIcons.BookOpen, "Journal", { nav.open(Route.JournalWrite()) }))
            add(QA(AppIcons.Chat, "Debrief", { nav.open(Route.Assistant("Debrief my day", autoSend = true)) }))
            add(QA(AppIcons.Calendar, "Tomorrow", { nav.open(Route.Upcoming) }))
            add(QA(AppIcons.Timer, "Focus", { nav.open(Route.Focus()) }))
        }
    }.take(4)
    Column(Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 16.dp)) {
        SectionHeader("Shortcuts")
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            actions.forEach { a ->
                Panel(Modifier.weight(1f), onClick = a.go, padding = PaddingValues(vertical = 14.dp, horizontal = 8.dp)) {
                    Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(a.icon, null, tint = Aiimin.colors.text, modifier = Modifier.size(20.dp))
                        Spacer(Modifier.height(6.dp))
                        Text(a.label, style = Aiimin.type.caption.copy(color = Aiimin.colors.text))
                    }
                }
            }
        }
    }
}
