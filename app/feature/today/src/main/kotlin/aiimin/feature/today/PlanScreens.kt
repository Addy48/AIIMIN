package aiimin.feature.today

import aiimin.core.data.day.DayRepository
import aiimin.core.data.plan.DayPart
import aiimin.core.data.util.Dates
import aiimin.core.database.CalendarEventEntity
import aiimin.core.database.MinimumEntity
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppIconButton
import aiimin.designsystem.component.AppSheet
import aiimin.designsystem.component.AppTextField
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.CheckCircle
import aiimin.designsystem.component.DatePick
import aiimin.designsystem.component.DoneText
import aiimin.designsystem.component.EmptyState
import aiimin.designsystem.component.Hairline
import aiimin.designsystem.component.IconTile
import aiimin.designsystem.component.ListRow
import aiimin.designsystem.component.Panel
import aiimin.designsystem.component.Pill
import aiimin.designsystem.component.PillRow
import aiimin.designsystem.component.SectionHeader
import aiimin.designsystem.component.Segmented
import aiimin.designsystem.component.Stepper
import aiimin.designsystem.component.SwitchRow
import aiimin.designsystem.component.Tag
import aiimin.designsystem.component.TimePick
import aiimin.designsystem.component.TopBar
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.LocalToaster
import aiimin.designsystem.nav.Route
import aiimin.designsystem.theme.Aiimin
import aiimin.designsystem.theme.Shapes
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.text.BasicTextField
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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import java.time.LocalDate
import java.time.LocalTime
import java.time.format.TextStyle
import java.util.Locale
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

// =================================================================== task

@Composable
fun TaskScreen(id: String, vm: TaskViewModel = hiltViewModel()) {
    LaunchedEffect(id) { vm.load(id) }
    val t by vm.task.collectAsStateWithLifecycle()
    val today by vm.today.collectAsStateWithLifecycle()
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    val task = t
    var pickDate by remember { mutableStateOf(false) }
    var pickTime by remember { mutableStateOf(false) }
    Column(Modifier.fillMaxSize().background(Aiimin.colors.base)) {
        TopBar("Task", onBack = { nav.back() }) {
            if (task != null) {
                AppIconButton(AppIcons.Trash, "Delete task", {
                    scope.launch {
                        vm.delete(task)?.let { old -> toaster.undo("Task deleted") { vm.restore(old) } }
                        nav.back()
                    }
                })
            }
        }
        if (task == null) return@Column
        var title by remember(task.id) { mutableStateOf(task.title) }
        var notes by remember(task.id) { mutableStateOf(task.notes) }
        var sub by remember { mutableStateOf("") }
        LazyColumn(Modifier.weight(1f), contentPadding = PaddingValues(horizontal = Aiimin.space.gutter, vertical = 8.dp)) {
            item {
                Row(verticalAlignment = Alignment.Top) {
                    CheckCircle(task.done, { scope.launch { vm.toggle(task)?.let { if (it.done) toaster.show(if (it.xp > 0) "Done · +${it.xp} XP" else "Done") } } }, "Mark done")
                    Box(Modifier.weight(1f).padding(top = 10.dp)) {
                        BasicTextField(
                            title, { title = it; vm.setTitle(task, it) },
                            textStyle = Aiimin.type.title.copy(fontSize = 24.sp), cursorBrush = SolidColor(Aiimin.colors.accent),
                            modifier = Modifier.fillMaxWidth(),
                        )
                    }
                }
                if (task.carried > 0 && !task.done) Tag("Carried over ${task.carried}× — no pile, just a count", icon = AppIcons.ArrowsClockwise)
                Spacer(Modifier.height(16.dp))
            }
            item {
                SectionHeader("When")
                PillRow {
                    Pill("Today", task.day == today.toString(), { vm.setDay(task, today) })
                    Pill("Tomorrow", task.day == today.plusDays(1).toString(), { vm.setDay(task, today.plusDays(1)) })
                    Pill(task.day?.takeIf { it != today.toString() && it != today.plusDays(1).toString() }?.let { Dates.short(LocalDate.parse(it)) } ?: "Pick date", task.day != null && task.day != today.toString() && task.day != today.plusDays(1).toString(), { pickDate = true }, icon = AppIcons.Calendar)
                    Pill("Someday", task.day == null, { vm.setDay(task, null) })
                }
                Spacer(Modifier.height(8.dp))
                ListRow(
                    "Time", subtitle = task.time?.let(Dates::clock) ?: "Anytime in the ${DayPart.of(null, task.part).label.lowercase()}",
                    leading = { IconTile(AppIcons.Clock) }, onClick = { pickTime = true },
                )
                if (task.time == null) {
                    Segmented(DayPart.entries.map { it.label }, DayPart.entries.indexOf(DayPart.of(null, task.part)), { vm.setPart(task, DayPart.entries[it]) })
                }
                Spacer(Modifier.height(12.dp))
                SectionHeader("Priority")
                Segmented(listOf("Low", "Normal", "High"), task.priority.coerceIn(0, 2), { vm.setPriority(task, it) })
                Spacer(Modifier.height(12.dp))
                SectionHeader("Repeat")
                val reps = listOf(null to "Never", "DAILY" to "Daily", "WEEKDAYS" to "Weekdays", "WEEKLY" to "Weekly")
                Segmented(reps.map { it.second }, reps.indexOfFirst { it.first == task.recurrence }.coerceAtLeast(0), { vm.setRepeat(task, reps[it].first) })
            }
            item {
                SectionHeader("Steps")
                vm.subtasks(task).forEachIndexed { i, s ->
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        CheckCircle(s.d, { vm.toggleSub(task, i) }, "Step ${s.t}")
                        DoneText(s.t, s.d, Aiimin.type.body, Modifier.weight(1f))
                        AppIconButton(AppIcons.Close, "Remove step", { vm.removeSub(task, i) }, tint = Aiimin.colors.textFaint)
                    }
                }
                AppTextField(sub, { sub = it }, placeholder = "Add a step", leading = AppIcons.Plus, onDone = { vm.addSub(task, sub); sub = "" })
                Spacer(Modifier.height(16.dp))
                SectionHeader("Notes")
                AppTextField(notes, { notes = it }, placeholder = "Anything to remember", singleLine = false, minLines = 3, onDone = { vm.setNotes(task, notes) })
                if (notes != task.notes) AppButton("Save notes", { vm.setNotes(task, notes) }, kind = ButtonKind.SECONDARY, compact = true, modifier = Modifier.padding(top = 8.dp))
            }
        }
        Row(Modifier.fillMaxWidth().navigationBarsPadding().padding(Aiimin.space.gutter), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            AppButton("Focus on this", { nav.open(Route.Focus(taskId = task.id, label = task.title)) }, Modifier.weight(1f), kind = ButtonKind.SECONDARY, icon = AppIcons.Timer)
            AppButton(if (task.done) "Reopen" else "Mark done", { scope.launch { vm.toggle(task)?.let { if (it.done) { toaster.show(if (it.xp > 0) "Done · +${it.xp} XP" else "Done"); nav.back() } } } }, Modifier.weight(1f), icon = AppIcons.Check)
        }
        if (pickDate) DatePick(task.day?.let(LocalDate::parse) ?: today, { vm.setDay(task, it) }, { pickDate = false })
        if (pickTime) TimePick(task.time?.let(LocalTime::parse) ?: LocalTime.of(9, 0), { vm.setTime(task, it) }, { pickTime = false }, onClear = { vm.setTime(task, null) })
    }
}

// =================================================================== calendar

@Composable
fun CalendarScreen(vm: CalendarViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    val selected by vm.selected.collectAsStateWithLifecycle()
    val agenda by vm.agenda.collectAsStateWithLifecycle()
    var editing by remember { mutableStateOf<CalendarEventEntity?>(null) }
    var adding by remember { mutableStateOf(false) }
    val c = Aiimin.colors
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar(Dates.long(selected).substringAfter(", "), onBack = { nav.back() }) {
            AppIconButton(AppIcons.CalendarPlus, "New event", { adding = true })
        }
        val start = selected.minusDays(selected.dayOfWeek.value.toLong() - 1)
        Row(Modifier.fillMaxWidth().padding(horizontal = 12.dp), verticalAlignment = Alignment.CenterVertically) {
            AppIconButton(AppIcons.CaretLeft, "Previous week", { vm.select(selected.minusWeeks(1)) }, tint = c.textMuted, size = 36.dp)
            Row(Modifier.weight(1f), horizontalArrangement = Arrangement.SpaceBetween) {
                (0..6).map { start.plusDays(it.toLong()) }.forEach { d ->
                    val sel = d == selected
                    Column(
                        Modifier.clip(Shapes.row).background(if (sel) c.accent else Color.Transparent).clickable { vm.select(d) }.padding(vertical = 8.dp, horizontal = 8.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                    ) {
                        Text(d.dayOfWeek.getDisplayName(TextStyle.NARROW, Locale.ENGLISH), style = Aiimin.type.caption.copy(color = if (sel) c.onAccent else c.textFaint))
                        Text(d.dayOfMonth.toString(), style = Aiimin.type.numberSmall.copy(color = if (sel) c.onAccent else c.text))
                    }
                }
            }
            AppIconButton(AppIcons.CaretRight, "Next week", { vm.select(selected.plusWeeks(1)) }, tint = c.textMuted, size = 36.dp)
        }
        Hairline(Modifier.padding(top = 8.dp))
        LazyColumn(Modifier.weight(1f), contentPadding = PaddingValues(Aiimin.space.gutter)) {
            if (agenda.events.isEmpty() && agenda.tasks.none { it.time != null }) {
                item { EmptyState(AppIcons.Calendar, "Nothing scheduled", "A free day. Add an event, or ask the assistant to block time.", action = "New event", onAction = { adding = true }) }
            }
            items(agenda.events, key = { it.id }) { e ->
                val st = vm.instant(e.startAt).toLocalTime()
                val en = vm.instant(e.endAt).toLocalTime()
                Panel(Modifier.padding(vertical = 4.dp), onClick = { if (e.source == "vault" && e.docId != null) nav.open(Route.Doc(e.docId!!)) else editing = e }) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(Modifier.size(width = 4.dp, height = 36.dp).clip(Shapes.pill).background(if (e.source == "vault") c.warn else c.violet))
                        Spacer(Modifier.width(12.dp))
                        Column(Modifier.weight(1f)) {
                            Text(e.title, style = Aiimin.type.bodyStrong)
                            Text(if (e.allDay) "All day" else "${Dates.clock(st)} – ${Dates.clock(en)}" + e.location.takeIf { it.isNotBlank() }?.let { " · $it" }.orEmpty(), style = Aiimin.type.caption)
                        }
                    }
                }
            }
            val timed = agenda.tasks.filter { it.time != null }
            if (timed.isNotEmpty()) {
                item { SectionHeader("Timed tasks") }
                items(timed, key = { "t" + it.id }) { t ->
                    ListRow(t.title, subtitle = Dates.clock(t.time), leading = { IconTile(AppIcons.ListChecks) }, onClick = { nav.open(Route.Task(t.id)) })
                }
            }
        }
    }
    if (adding || editing != null) {
        val e = editing
        EventSheet(
            initial = e, date = selected,
            startOf = { vm.instant(it).toLocalTime() },
            onSave = { title, date, s, en, allDay, loc -> vm.save(e?.id, title, date, s, en, allDay, loc); adding = false; editing = null },
            onDelete = e?.let { ev ->
                {
                    scope.launch { vm.delete(ev.id)?.let { old -> toaster.undo("Event deleted") { vm.restore(old) } } }
                    editing = null
                }
            },
            onDismiss = { adding = false; editing = null },
        )
    }
}

@Composable
private fun EventSheet(
    initial: CalendarEventEntity?,
    date: LocalDate,
    startOf: (Long) -> LocalTime,
    onSave: (String, LocalDate, LocalTime, LocalTime, Boolean, String) -> Unit,
    onDelete: (() -> Unit)?,
    onDismiss: () -> Unit,
) {
    var title by remember { mutableStateOf(initial?.title.orEmpty()) }
    var day by remember { mutableStateOf(date) }
    var start by remember { mutableStateOf(initial?.let { startOf(it.startAt) } ?: LocalTime.now().plusHours(1).withMinute(0)) }
    var end by remember { mutableStateOf(initial?.let { startOf(it.endAt) } ?: start.plusMinutes(30)) }
    var allDay by remember { mutableStateOf(initial?.allDay ?: false) }
    var location by remember { mutableStateOf(initial?.location.orEmpty()) }
    var pick by remember { mutableStateOf<String?>(null) }
    AppSheet(onDismiss, title = if (initial == null) "New event" else "Edit event") {
        AppTextField(title, { title = it }, placeholder = "What's happening")
        Spacer(Modifier.height(10.dp))
        ListRow("Date", subtitle = Dates.long(day), leading = { IconTile(AppIcons.Calendar) }, onClick = { pick = "date" })
        SwitchRow("All day", allDay, { allDay = it })
        if (!allDay) {
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                ListRow("Starts", subtitle = Dates.clock(start), modifier = Modifier.weight(1f), onClick = { pick = "start" })
                ListRow("Ends", subtitle = Dates.clock(end), modifier = Modifier.weight(1f), onClick = { pick = "end" })
            }
        }
        AppTextField(location, { location = it }, placeholder = "Place (optional)", leading = AppIcons.Compass)
        Spacer(Modifier.height(16.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            if (onDelete != null) AppButton("Delete", onDelete, kind = ButtonKind.DANGER, modifier = Modifier.weight(1f))
            AppButton("Save", { if (title.isNotBlank()) onSave(title, day, start, end, allDay, location) }, Modifier.weight(1f), enabled = title.isNotBlank())
        }
    }
    when (pick) {
        "date" -> DatePick(day, { day = it }, { pick = null })
        "start" -> TimePick(start, { start = it; if (end <= it) end = it.plusMinutes(30) }, { pick = null })
        "end" -> TimePick(end, { end = it }, { pick = null })
    }
}

// =================================================================== focus

@Composable
fun FocusScreen(route: Route.Focus, vm: FocusViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val active by vm.active.collectAsStateWithLifecycle()
    val result by vm.result.collectAsStateWithLifecycle()
    val c = Aiimin.colors
    var now by remember { mutableLongStateOf(System.currentTimeMillis()) }
    LaunchedEffect(active) {
        while (active != null) {
            now = System.currentTimeMillis()
            delay(1000)
        }
    }
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Focus", onBack = { nav.back() })
        val a = active
        Column(Modifier.weight(1f).fillMaxWidth().padding(Aiimin.space.gutter), horizontalAlignment = Alignment.CenterHorizontally) {
            if (a != null) {
                val elapsed = a.elapsedMs(now)
                val planned = a.plannedMin * 60_000L
                val remaining = planned - elapsed
                val p by animateFloatAsState((elapsed.toFloat() / planned).coerceIn(0f, 1f), tween(900), label = "focus")
                Spacer(Modifier.height(24.dp))
                Text(a.label, style = Aiimin.type.headline, textAlign = TextAlign.Center)
                Spacer(Modifier.height(24.dp))
                Box(contentAlignment = Alignment.Center) {
                    val track = c.raised
                    val ring = if (a.running) c.accent else c.textFaint
                    Canvas(Modifier.size(260.dp)) {
                        val sw = 10.dp.toPx()
                        val s = Size(size.width - sw, size.height - sw)
                        drawArc(track, 0f, 360f, false, Offset(sw / 2, sw / 2), s, style = Stroke(sw))
                        drawArc(ring, -90f, 360f * p, false, Offset(sw / 2, sw / 2), s, style = Stroke(sw, cap = StrokeCap.Round))
                    }
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        val ms = if (remaining >= 0) remaining else -remaining
                        Text((if (remaining < 0) "+" else "") + "%d:%02d".format(ms / 60_000, (ms / 1000) % 60), style = Aiimin.type.display.copy(fontSize = 56.sp))
                        Text(if (!a.running) "Paused" else if (remaining < 0) "Over your plan — finish when ready" else "of ${a.plannedMin} min", style = Aiimin.type.caption)
                    }
                }
                Spacer(Modifier.height(32.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    if (a.running) AppButton("Pause", { vm.pause() }, kind = ButtonKind.SECONDARY, icon = AppIcons.Pause) else AppButton("Resume", { vm.resume() }, kind = ButtonKind.SECONDARY, icon = AppIcons.Play)
                    AppButton("Finish", { vm.finish(remaining <= 0) }, icon = AppIcons.Check)
                }
                Spacer(Modifier.height(12.dp))
                Text("Discard session", style = Aiimin.type.label.copy(color = c.textFaint), modifier = Modifier.clip(Shapes.small).clickable { vm.discard(); toaster.show("Session discarded") }.padding(8.dp))
                Spacer(Modifier.weight(1f))
                Text("Leave the app if you like. Time spent in other apps is taken out when you finish, so the minutes stay honest.", style = Aiimin.type.caption.copy(textAlign = TextAlign.Center), modifier = Modifier.padding(horizontal = 12.dp))
            } else if (result != null) {
                val r = result!!
                Spacer(Modifier.height(48.dp))
                Icon(AppIcons.CheckCircle, null, tint = c.done, modifier = Modifier.size(56.dp))
                Spacer(Modifier.height(16.dp))
                Text("${r.minutes} minutes focused", style = Aiimin.type.title, textAlign = TextAlign.Center)
                if (r.distractedMin > 0) Text("${r.distractedMin} min in other apps taken out", style = Aiimin.type.caption, modifier = Modifier.padding(top = 4.dp))
                if (r.xp > 0) Tag("+${r.xp} XP", color = c.accent, background = c.accentSoft)
                Spacer(Modifier.height(32.dp))
                AppButton("Done", { nav.back() })
            } else {
                var label by remember { mutableStateOf(route.label.orEmpty()) }
                var minutes by remember { mutableStateOf(route.minutes) }
                Spacer(Modifier.height(24.dp))
                AppTextField(label, { label = it }, placeholder = "What are you focusing on?", leading = AppIcons.Target)
                Spacer(Modifier.height(24.dp))
                Text("%d".format(minutes), style = Aiimin.type.display)
                Text("minutes", style = Aiimin.type.caption)
                Spacer(Modifier.height(16.dp))
                Stepper("$minutes min", { minutes = (minutes - 5).coerceAtLeast(5) }, { minutes = (minutes + 5).coerceAtMost(180) })
                Spacer(Modifier.height(16.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    listOf(15, 25, 50, 90).forEach { m -> Pill("$m", minutes == m, { minutes = m }) }
                }
                Spacer(Modifier.weight(1f))
                AppButton("Start", { vm.start(label.ifBlank { "Focus" }, minutes, route.taskId) }, Modifier.fillMaxWidth(), icon = AppIcons.Play)
            }
        }
    }
}

// =================================================================== minimums

@Composable
fun MinimumsScreen(vm: MinimumsViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    val list by vm.list.collectAsStateWithLifecycle()
    val history by vm.history.collectAsStateWithLifecycle()
    val today by vm.today.collectAsStateWithLifecycle()
    val state by vm.dayState.collectAsStateWithLifecycle()
    val c = Aiimin.colors
    var adding by remember { mutableStateOf(false) }
    var editing by remember { mutableStateOf<MinimumEntity?>(null) }
    var pausing by remember { mutableStateOf(false) }
    var proofFor by remember { mutableStateOf<String?>(null) }
    val picker = rememberLauncherForActivityResult(ActivityResultContracts.PickVisualMedia()) { uri ->
        val id = proofFor
        if (uri != null && id != null) scope.launch {
            runCatching { vm.attachProof(id, uri) }.onSuccess { toaster.show("Proof added — counts as corroborated") }.onFailure { toaster.show("Couldn't add that photo") }
        }
        proofFor = null
    }
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Daily minimums", onBack = { nav.back() }) { AppIconButton(AppIcons.Plus, "Add minimum", { adding = true }) }
        LazyColumn(Modifier.weight(1f), contentPadding = PaddingValues(horizontal = Aiimin.space.gutter, vertical = 8.dp)) {
            item {
                Text("The floor for a day you keep. Small enough to do on a bad day; the plan freezes at the start of each day, so new ones join tomorrow.", style = Aiimin.type.caption)
                Spacer(Modifier.height(12.dp))
            }
            if (list.isEmpty()) item { EmptyState(AppIcons.ListChecks, "No minimums yet", "Try: Read 10 pages · Walk 20 minutes · No phone in bed.", action = "Add one", onAction = { adding = true }) }
            items(list, key = { it.minimum.id }) { m ->
                Panel(Modifier.padding(vertical = 4.dp), padding = PaddingValues(start = 4.dp, end = 4.dp, top = 4.dp, bottom = 4.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        CheckCircle(m.done, { scope.launch { vm.toggle(m.minimum.id) } }, "Keep ${m.minimum.name}")
                        Column(Modifier.weight(1f).clickable { editing = m.minimum }) {
                            Text(m.minimum.name, style = Aiimin.type.bodyStrong)
                            val sub = listOfNotNull(
                                m.minimum.tiny.takeIf { it.isNotBlank() }?.let { "Tiny: $it" },
                                if (!m.planned) "Starts tomorrow" else null,
                                if (m.tick?.proofDocId != null) "Proof attached" else null,
                            ).joinToString(" · ")
                            if (sub.isNotBlank()) Text(sub, style = Aiimin.type.caption)
                        }
                        AppIconButton(AppIcons.Camera, "Add proof photo", {
                            proofFor = m.minimum.id
                            picker.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly))
                        }, tint = c.textFaint)
                    }
                }
            }
            item {
                SectionHeader("Last 4 weeks")
                Heat(history, today, list.size.coerceAtLeast(1))
                Spacer(Modifier.height(16.dp))
                SectionHeader("Pause")
                val paused = state?.paused == true
                ListRow(
                    if (paused) "Today is paused" else "Pause today",
                    subtitle = if (paused) "Score, streak and battery are neutral today. Tap to resume." else "Sick, travelling, a festival. Up to 14 days a quarter; illness can extend.",
                    leading = { IconTile(AppIcons.Pause) }, maxSubtitleLines = 3,
                    onClick = { if (paused) scope.launch { vm.pause(false, null) } else pausing = true },
                )
            }
        }
    }
    if (adding || editing != null) {
        val e = editing
        var name by remember { mutableStateOf(e?.name.orEmpty()) }
        var tiny by remember { mutableStateOf(e?.tiny.orEmpty()) }
        var domain by remember { mutableStateOf(e?.domain ?: "discipline") }
        AppSheet({ adding = false; editing = null }, title = if (e == null) "New minimum" else "Edit minimum", subtitle = if (e == null && list.isNotEmpty()) "Joins your plan tomorrow." else null) {
            AppTextField(name, { name = it }, placeholder = "e.g. Read 10 pages")
            Spacer(Modifier.height(10.dp))
            AppTextField(tiny, { tiny = it }, placeholder = "Tiny version for low days, e.g. Read 1 page")
            Spacer(Modifier.height(12.dp))
            PillRow {
                listOf("body" to "Body", "mind" to "Mind", "craft" to "Work", "money" to "Money", "people" to "People", "discipline" to "Discipline").forEach { (k, l) ->
                    Pill(l, domain == k, { domain = k })
                }
            }
            Spacer(Modifier.height(16.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                if (e != null) AppButton("Archive", { vm.archive(e.id); editing = null }, kind = ButtonKind.DANGER, modifier = Modifier.weight(1f))
                AppButton("Save", {
                    if (e == null) vm.add(name, tiny, domain) else vm.edit(e.copy(name = name.trim(), tiny = tiny.trim(), domain = domain))
                    adding = false; editing = null
                }, Modifier.weight(1f), enabled = name.isNotBlank())
            }
        }
    }
    if (pausing) {
        AppSheet({ pausing = false }, title = "Pause today", subtitle = "Nothing is lost. The day is neutral for your score, streak and battery.") {
            listOf("sick" to "Unwell", "travel" to "Travelling", "festival" to "Festival or family event", "illness" to "Longer illness (extends the limit)").forEach { (k, l) ->
                ListRow(l, onClick = {
                    scope.launch {
                        when (val r = vm.pause(true, k)) {
                            is DayRepository.Toggle.Limit -> toaster.show(r.message)
                            DayRepository.Toggle.Done -> toaster.show("Today is paused")
                        }
                        pausing = false
                    }
                })
            }
        }
    }
}

@Composable
private fun Heat(history: Map<String, Int>, today: LocalDate, total: Int) {
    val c = Aiimin.colors
    val days = (27 downTo 0).map { today.minusDays(it.toLong()) }
    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
        days.chunked(7).forEach { week ->
            Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                week.forEach { d ->
                    val share = (history[d.toString()] ?: 0).toFloat() / total
                    Box(
                        Modifier.weight(1f).height(22.dp).clip(Shapes.small)
                            .background(if (share <= 0f) c.raised else c.done.copy(alpha = 0.25f + 0.75f * share.coerceAtMost(1f)))
                            .then(if (d == today) Modifier.border(1.dp, c.accent, Shapes.small) else Modifier),
                    )
                }
            }
        }
    }
}

// =================================================================== upcoming

@Composable
fun UpcomingScreen(vm: UpcomingViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val list by vm.list.collectAsStateWithLifecycle()
    val today by vm.today.collectAsStateWithLifecycle()
    val c = Aiimin.colors
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Upcoming", onBack = { nav.back() })
        if (list.isEmpty()) {
            EmptyState(AppIcons.Calendar, "Nothing ahead", "Tasks for later days and someday ideas collect here.")
            return@Column
        }
        val groups = list.groupBy { t ->
            val d = t.day?.let(LocalDate::parse)
            when {
                d == null -> "Someday"
                d == today.plusDays(1) -> "Tomorrow"
                d <= today.plusDays(7) -> "This week"
                else -> "Later"
            }
        }
        LazyColumn(contentPadding = PaddingValues(horizontal = Aiimin.space.gutter, vertical = 8.dp)) {
            listOf("Tomorrow", "This week", "Later", "Someday").forEach { g ->
                val items = groups[g].orEmpty()
                if (items.isNotEmpty()) {
                    item { SectionHeader("$g · ${items.size}") }
                    items(items, key = { it.id }) { t ->
                        ListRow(
                            t.title,
                            subtitle = listOfNotNull(t.day?.let { Dates.relative(LocalDate.parse(it), today) }, t.time?.let(Dates::clock)).joinToString(" · ").ifBlank { null },
                            onClick = { nav.open(Route.Task(t.id)) },
                            trailing = { Text("Today", style = Aiimin.type.label.copy(color = c.accent), modifier = Modifier.clip(Shapes.small).clickable { vm.moveToday(t.id) }.padding(8.dp)) },
                        )
                    }
                }
            }
        }
    }
}
