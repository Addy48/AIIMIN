package aiimin.feature.today

import aiimin.designsystem.component.IconButtonInset
import aiimin.designsystem.component.bleed
import aiimin.core.data.core.DayClock
import aiimin.core.data.life.LifeRepository
import aiimin.core.data.notes.JournalRepository
import aiimin.core.data.plan.CalendarRepository
import aiimin.core.data.plan.DayPart
import aiimin.core.data.plan.TaskRepository
import aiimin.core.data.util.Dates
import aiimin.core.database.CalendarEventEntity
import aiimin.core.database.TaskEntity
import aiimin.core.engine.Signals
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppIconButton
import aiimin.designsystem.component.AppTextField
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.Hairline
import aiimin.designsystem.component.SectionHeader
import aiimin.designsystem.component.Skeleton
import aiimin.designsystem.component.TopBar
import aiimin.designsystem.component.rememberVoiceInput
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.LocalToaster
import aiimin.designsystem.nav.Route
import aiimin.designsystem.theme.Aiimin
import androidx.compose.foundation.background
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
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import java.time.LocalDate
import java.time.LocalTime
import java.time.ZoneId
import javax.inject.Inject
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class PlanUi(
    val day: LocalDate,
    val carried: List<TaskEntity>,
    val events: List<CalendarEventEntity>,
    val candidates: List<TaskEntity>,
    val top: Set<String>,
)

@OptIn(ExperimentalCoroutinesApi::class)
@HiltViewModel
class PlanDayViewModel @Inject constructor(
    private val tasks: TaskRepository,
    private val calendar: CalendarRepository,
    private val clock: DayClock,
) : ViewModel() {
    private val target = MutableStateFlow<LocalDate?>(null)

    fun start(tomorrow: Boolean) {
        viewModelScope.launch { target.value = clock.today().let { if (tomorrow) it.plusDays(1) else it } }
    }

    val ui: StateFlow<PlanUi?> = target.flatMapLatest { day ->
        if (day == null) flowOf(null) else combine(
            tasks.forDay(day), tasks.upcoming(day), flowOf(Unit).flatMapLatest { calendarFlow(day) },
        ) { today, later, events ->
            val open = today.filter { !it.done }
            val soon = later.filter { it.day == null || LocalDate.parse(it.day!!) <= day.plusDays(3) }
            val all = (open + soon).distinctBy { it.id }
            PlanUi(day, open.filter { it.carried > 0 }, events, all, all.filter { it.priority >= 2 }.map { it.id }.toSet())
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)

    private fun calendarFlow(day: LocalDate) = kotlinx.coroutines.flow.flow {
        calendar.forDay(day).collect { emit(it) }
    }

    /** Star = high priority; three at most, because three is a day. */
    suspend fun toggleStar(t: TaskEntity, topCount: Int): Boolean {
        if (t.priority < 2 && topCount >= 3) return false
        tasks.update(t.copy(priority = if (t.priority >= 2) 1 else 2, updatedAt = System.currentTimeMillis()))
        return true
    }

    fun move(t: TaskEntity, day: LocalDate) = viewModelScope.launch { tasks.moveTo(t.id, day) }
    fun pullTo(t: TaskEntity, day: LocalDate) = viewModelScope.launch { tasks.moveTo(t.id, day) }
    fun drop(t: TaskEntity) = viewModelScope.launch { tasks.delete(t.id) }
    fun add(title: String, day: LocalDate) = viewModelScope.launch { tasks.create(title, day, part = DayPart.now()) }
    fun keepAll(list: List<TaskEntity>) = viewModelScope.launch { list.forEach { tasks.update(it.copy(carried = 0, updatedAt = System.currentTimeMillis())) } }
    fun keep(t: TaskEntity) = viewModelScope.launch { tasks.update(t.copy(carried = 0, updatedAt = System.currentTimeMillis())) }
}

/** T2 · Plan my day (or tomorrow): carry over, see the calendar, star up to three, add. Never blocks. */
@Composable
fun PlanDayScreen(tomorrow: Boolean, vm: PlanDayViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    val c = Aiimin.colors
    LaunchedEffect(tomorrow) { vm.start(tomorrow) }
    val ui by vm.ui.collectAsStateWithLifecycle()
    var text by remember { mutableStateOf("") }
    val voice = rememberVoiceInput(onText = { text = it }, onUnavailable = { toaster.show("Speech input isn't available on this phone") })
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar(if (tomorrow) "Plan tomorrow" else "Plan today", onBack = { nav.back() })
        val u = ui
        if (u == null) {
            Skeleton(Modifier.padding(Aiimin.space.gutter).fillMaxWidth().height(200.dp))
            return@Column
        }
        LazyColumn(Modifier.weight(1f), contentPadding = PaddingValues(start = Aiimin.space.gutter, end = Aiimin.space.gutter, bottom = 24.dp)) {
            item { Text(Dates.dayMonth(u.day), style = Aiimin.type.body.copy(color = c.textMuted)) }
            if (u.carried.isNotEmpty()) {
                item {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(Modifier.weight(1f)) { SectionHeader("From yesterday") }
                        // D-025: the word ends on the margin; its padded target hangs into it.
                        Text("Keep all", style = Aiimin.type.label.copy(color = c.link), modifier = Modifier.bleed(end = 8.dp).clickable { vm.keepAll(u.carried) }.padding(8.dp))
                    }
                }
                items(u.carried.size) { i ->
                    val t = u.carried[i]
                    Column {
                        Text(t.title, style = Aiimin.type.headline.copy(fontWeight = androidx.compose.ui.text.font.FontWeight.Normal), modifier = Modifier.padding(top = 12.dp))
                        Row(Modifier.padding(vertical = 8.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            AppButton("Keep", { vm.keep(t) }, kind = ButtonKind.SECONDARY, compact = true)
                            AppButton("Move", { vm.move(t, u.day.plusDays(1)); toaster.show("Moved to ${Dates.relative(u.day.plusDays(1), LocalDate.now())}") }, kind = ButtonKind.SECONDARY, compact = true)
                            AppButton("Drop", { vm.drop(t) }, kind = ButtonKind.SECONDARY, compact = true)
                        }
                        Hairline()
                    }
                }
            }
            if (u.events.isNotEmpty()) {
                item { SectionHeader("Calendar") }
                items(u.events.size) { i ->
                    val e = u.events[i]
                    val z = ZoneId.systemDefault()
                    val st = java.time.Instant.ofEpochMilli(e.startAt).atZone(z).toLocalTime()
                    Row(Modifier.fillMaxWidth().heightIn(min = 48.dp), verticalAlignment = Alignment.CenterVertically) {
                        // At least 92 dp and one line (A-028); grows with large text instead of running into the title.
                        Text(if (e.allDay) "all day" else Dates.clock(st), style = Aiimin.type.body.copy(color = c.textMuted, fontFeatureSettings = "tnum"), maxLines = 1, softWrap = false, modifier = Modifier.widthIn(min = 92.dp).padding(end = 8.dp))
                        Text(e.title, style = Aiimin.type.body.copy(color = c.text), modifier = Modifier.weight(1f))
                    }
                    Hairline()
                }
            }
            item {
                SectionHeader("Pick up to three that matter")
                if (u.candidates.isEmpty()) Text("Nothing to pick from yet. Add a task below.", style = Aiimin.type.caption)
            }
            items(u.candidates.size, key = { u.candidates[it].id }) { i ->
                val t = u.candidates[i]
                val starred = t.id in u.top
                Column {
                    Row(Modifier.fillMaxWidth().heightIn(min = 56.dp), verticalAlignment = Alignment.CenterVertically) {
                        Column(Modifier.weight(1f).padding(vertical = 8.dp)) {
                            Text(t.title, style = Aiimin.type.body.copy(color = c.text))
                            Text(
                                when {
                                    t.day == null -> "Someday"
                                    LocalDate.parse(t.day!!) == u.day -> t.time?.let { Dates.clock(it) } ?: "Anytime"
                                    else -> Dates.relative(LocalDate.parse(t.day!!), LocalDate.now())
                                },
                                style = Aiimin.type.caption,
                            )
                            // D-026 (S4): the action sits under the title, so the title keeps the full width at any text size.
                            if (t.day == null || LocalDate.parse(t.day!!) != u.day) {
                                Text(
                                    "Do it ${if (tomorrow) "tomorrow" else "today"}",
                                    style = Aiimin.type.label.copy(color = c.link),
                                    modifier = Modifier.clickable { vm.pullTo(t, u.day) }.heightIn(min = 40.dp).padding(top = 12.dp, bottom = 12.dp, end = 8.dp),
                                )
                            }
                        }
                        AppIconButton(
                            if (starred) AppIcons.StarFill else AppIcons.Star, if (starred) "Remove from top three" else "Add to top three",
                            { scope.launch { if (!vm.toggleStar(t, u.top.size)) toaster.show("Three is the most") } },
                            tint = if (starred) c.accent else c.textMuted,
                            modifier = Modifier.bleed(end = IconButtonInset),
                        )
                    }
                    Hairline()
                }
            }
            item {
                Row(Modifier.padding(top = 16.dp), verticalAlignment = Alignment.CenterVertically) {
                    Box(Modifier.weight(1f)) {
                        AppTextField(text, { text = it }, placeholder = "Add a task", onDone = { if (text.isNotBlank()) { vm.add(text.trim(), u.day); text = "" } })
                    }
                    AppIconButton(AppIcons.Mic, "Speak", voice, tint = c.text)
                }
                if (u.candidates.size > 8) Text("That's a lot. Three is a day.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 12.dp))
            }
        }
        Hairline()
        Row(Modifier.fillMaxWidth().navigationBarsPadding().padding(Aiimin.space.gutter)) {
            AppButton(if (tomorrow) "Save tomorrow's plan" else "Start the day", {
                if (text.isNotBlank()) vm.add(text.trim(), u.day)
                toaster.show(if (u.top.isEmpty()) "Plan saved" else "Top ${u.top.size} set")
                nav.back()
            }, Modifier.fillMaxWidth())
        }
    }
}

// ------------------------------------------------------------------ debrief

data class DebriefUi(val done: Int, val mins: String, val focus: String, val line: String?, val mood: Int?, val already: Boolean)

@HiltViewModel
class DebriefViewModel @Inject constructor(
    private val life: LifeRepository,
    private val journal: JournalRepository,
    private val tasks: TaskRepository,
    private val clock: DayClock,
) : ViewModel() {
    val summary = MutableStateFlow<DebriefUi?>(null)

    init {
        viewModelScope.launch {
            val v = life.compute()
            val t = v.today
            val tally = t.minimums
            val focus = t.value(Signals.FOCUS) ?: 0.0
            val doneTasks = tasks.recentDone(300).first().count { it.doneDay == clock.today().toString() }
            summary.value = DebriefUi(
                done = doneTasks,
                mins = if (tally.planned == 0) "no minimums" else "${tally.kept} of ${tally.planned} minimums",
                focus = if (focus <= 0) "no focus yet" else "${focus.toInt() / 60}h ${"%02d".format(focus.toInt() % 60)}m focus".replace("0h ", ""),
                line = null, mood = null, already = false,
            )
        }
    }

    suspend fun save(mood: Int?, line: String, tomorrowTask: String, tags: List<String>): String {
        if (line.isNotBlank() || mood != null) journal.save(line.ifBlank { "Mood noted." }, mood, tags)
        if (tomorrowTask.isNotBlank()) tasks.create(tomorrowTask.trim(), clock.today().plusDays(1), priority = 2)
        return tomorrowTask.trim()
    }
}

private val MOODS = listOf("Rough", "Low", "Okay", "Good", "Great")
private val GOT_IN_THE_WAY = listOf("Sleep", "Phone", "People", "Work", "Health", "Money", "Nothing")

/** T3 · Evening debrief: a kind minute. Mood and obstacles are optional and never scored. */
@Composable
fun DebriefScreen(vm: DebriefViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    val c = Aiimin.colors
    val s by vm.summary.collectAsStateWithLifecycle()
    var mood by remember { mutableStateOf<Int?>(null) }
    var line by remember { mutableStateOf("") }
    var tomorrow by remember { mutableStateOf("") }
    val tags = remember { mutableStateOf(setOf<String>()) }
    val voiceLine = rememberVoiceInput(onText = { line = if (line.isBlank()) it else "$line $it" }, onUnavailable = { toaster.show("Speech input isn't available on this phone") })
    val voiceTomorrow = rememberVoiceInput(onText = { tomorrow = it }, onUnavailable = { toaster.show("Speech input isn't available on this phone") })
    val words = line.trim().split(Regex("\\s+")).count { it.isNotBlank() }
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Evening debrief", onBack = { nav.back() })
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = Aiimin.space.gutter)) {
            Text("How did today go?", style = Aiimin.type.title, modifier = Modifier.padding(top = 4.dp))
            Text(Dates.dayMonth(LocalDate.now()), style = Aiimin.type.body.copy(color = c.textMuted))
            val u = s
            if (u != null) {
                Spacer(Modifier.height(16.dp))
                Text("${u.done} ${if (u.done == 1) "task" else "tasks"} done · ${u.mins} · ${u.focus}", style = Aiimin.type.headline.copy(fontWeight = androidx.compose.ui.text.font.FontWeight.Normal, lineHeight = 26.sp))
            }
            SectionHeader("Mood")
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                MOODS.forEachIndexed { i, label ->
                    val on = mood == i + 1
                    Column(
                        Modifier.weight(1f).heightIn(min = 64.dp).clip(RoundedCornerShape(8.dp))
                            .background(if (on) c.text else c.raised).clickable { mood = if (on) null else i + 1 }.padding(vertical = 12.dp),
                        horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center,
                    ) {
                        Text("${i + 1}", style = Aiimin.type.cardTitle.copy(color = if (on) c.base else c.text))
                        Text(label, style = Aiimin.type.caption.copy(color = if (on) c.base else c.textMuted))
                    }
                }
            }
            SectionHeader("One line about today")
            Row(verticalAlignment = Alignment.Top) {
                Box(Modifier.weight(1f)) { AppTextField(line, { line = it }, placeholder = "One line about today", singleLine = false) }
                AppIconButton(AppIcons.Mic, "Speak", voiceLine, tint = c.text)
            }
            Text("Write as much or as little as you like. It stays private and encrypted.${if (words > 0) " $words words so far." else ""}", style = Aiimin.type.caption, modifier = Modifier.padding(top = 8.dp))
            SectionHeader("Tomorrow's first task")
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(Modifier.weight(1f)) { AppTextField(tomorrow, { tomorrow = it }, placeholder = "What comes first tomorrow?") }
                AppIconButton(AppIcons.Mic, "Speak", voiceTomorrow, tint = c.text)
            }
            SectionHeader("What got in the way?")
            aiimin.designsystem.component.PillRow {
                GOT_IN_THE_WAY.forEach { t ->
                    aiimin.designsystem.component.Pill(t, t in tags.value, { tags.value = if (t in tags.value) tags.value - t else if (t == "Nothing") setOf(t) else tags.value - "Nothing" + t })
                }
            }
            Spacer(Modifier.height(24.dp))
        }
        Hairline()
        Row(Modifier.fillMaxWidth().navigationBarsPadding().padding(Aiimin.space.gutter)) {
            AppButton("Save and close the day", {
                scope.launch {
                    val first = vm.save(mood, line, tomorrow, tags.value.toList())
                    toaster.show(if (first.isNotBlank()) "Saved to journal · Tomorrow starts with: $first" else "Saved to journal")
                    nav.back()
                }
            }, Modifier.fillMaxWidth())
        }
    }
}
