package aiimin.feature.today

import aiimin.core.data.core.DayClock
import aiimin.core.data.life.LifeRepository
import aiimin.core.data.money.MoneyRepository
import aiimin.core.data.notes.NoteRepository
import aiimin.core.data.plan.Goal
import aiimin.core.data.plan.GoalRepository
import aiimin.core.data.plan.Milestone
import aiimin.core.data.plan.TaskRepository
import aiimin.core.data.util.Dates
import aiimin.core.data.util.Money
import aiimin.core.data.vault.VaultRepository
import aiimin.core.database.TaskEntity
import aiimin.core.engine.Signals
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppIconButton
import aiimin.designsystem.component.AppTextField
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.CheckCircle
import aiimin.designsystem.component.DatePick
import aiimin.designsystem.component.EmptyState
import aiimin.designsystem.component.Hairline
import aiimin.designsystem.component.Sparkline
import aiimin.designsystem.component.SectionHeader
import aiimin.designsystem.component.Skeleton
import aiimin.designsystem.component.TopBar
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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.produceState
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import java.time.LocalDate
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

@HiltViewModel
class GoalsViewModel @Inject constructor(private val repo: GoalRepository, private val tasks: TaskRepository) : ViewModel() {
    val goals = repo.goals
    suspend fun progress(g: Goal) = repo.progress(g)
    suspend fun linked(g: Goal): List<TaskEntity> = g.taskIds.mapNotNull { tasks.get(it) }.filter { !it.deleted }
    fun create(title: String): String = repo.create(title)
    fun get(id: String) = repo.get(id)
    fun update(id: String, change: (Goal) -> Goal) = repo.update(id, change)
    fun delete(id: String) = repo.delete(id)
    suspend fun addTask(id: String, title: String) = repo.addTask(id, title)
    fun toggleTask(taskId: String) = viewModelScope.launch { tasks.toggle(taskId) }
}

/** T15 · Goals. Progress is computed from finished work, never dragged. */
@Composable
fun GoalsScreen(vm: GoalsViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val c = Aiimin.colors
    val goals by vm.goals.collectAsStateWithLifecycle()
    var adding by remember { mutableStateOf(false) }
    var title by remember { mutableStateOf("") }
    val live = goals.filter { !it.archived }
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Goals", onBack = { nav.back() }) { AppIconButton(AppIcons.Plus, "New goal", { adding = true }) }
        if (live.isEmpty() && !adding) {
            EmptyState(raahi = aiimin.core.engine.raahi.RaahiPose.POINTING, icon = AppIcons.Flag, title = "No goals yet", body = "A goal is something that takes weeks. Link tasks and milestones to it, and the progress works itself out.", action = "New goal", onAction = { adding = true })
            return@Column
        }
        LazyColumn(contentPadding = PaddingValues(start = Aiimin.space.gutter, end = Aiimin.space.gutter, bottom = 40.dp)) {
            if (adding) item {
                Column(Modifier.padding(vertical = 12.dp)) {
                    AppTextField(title, { title = it }, placeholder = "What do you want to reach?", onDone = {
                        if (title.isNotBlank()) { val id = vm.create(title); title = ""; adding = false; nav.open(Route.Goal(id)) }
                    })
                    Row(Modifier.padding(top = 12.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        AppButton("Create", { if (title.isNotBlank()) { val id = vm.create(title); title = ""; adding = false; nav.open(Route.Goal(id)) } }, compact = true, enabled = title.isNotBlank())
                        AppButton("Cancel", { adding = false; title = "" }, kind = ButtonKind.SECONDARY, compact = true)
                    }
                }
            }
            items(live, key = { it.id }) { g ->
                val progress by produceState<Float?>(null, g) { value = vm.progress(g) }
                Column(Modifier.fillMaxWidth().clickable { nav.open(Route.Goal(g.id)) }.padding(vertical = 16.dp)) {
                    Text(g.title, style = Aiimin.type.headline)
                    Spacer(Modifier.height(8.dp))
                    Box(Modifier.fillMaxWidth().height(4.dp).clip(RoundedCornerShape(2.dp)).background(c.border)) {
                        Box(Modifier.fillMaxWidth((progress ?: 0f).coerceIn(0f, 1f)).height(4.dp).background(c.text))
                    }
                    val next = g.milestones.firstOrNull { !it.done }
                    Text(
                        listOfNotNull(
                            progress?.let { "${(it * 100).toInt()}% done" } ?: "Nothing linked yet",
                            next?.let { "next: ${it.t}" },
                            g.due?.let { "by ${Dates.shortDm(LocalDate.parse(it))}" },
                        ).joinToString(" · "),
                        style = Aiimin.type.caption, modifier = Modifier.padding(top = 8.dp),
                    )
                }
                Hairline()
            }
        }
    }
}

/** T16 · Goal: why, date, milestones, linked tasks. Creating earns nothing; finishing milestones does. */
@Composable
fun GoalScreen(id: String?, vm: GoalsViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    val c = Aiimin.colors
    val all by vm.goals.collectAsStateWithLifecycle()
    val g = all.firstOrNull { it.id == id }
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Goal", onBack = { nav.back() }) {
            if (g != null) AppIconButton(AppIcons.Trash, "Delete goal", { vm.delete(g.id); toaster.show("Goal deleted"); nav.back() }, tint = c.text)
        }
        if (g == null) {
            EmptyState(AppIcons.Flag, "Goal not found", "It may have been deleted.")
            return@Column
        }
        var datePick by remember { mutableStateOf(false) }
        var milestone by remember { mutableStateOf("") }
        var task by remember { mutableStateOf("") }
        val linked by produceState(emptyList<TaskEntity>(), g) { value = vm.linked(g) }
        val progress by produceState<Float?>(null, g, linked.map { it.done }) { value = vm.progress(g) }
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = Aiimin.space.gutter)) {
            var title by remember(g.id) { mutableStateOf(g.title) }
            AppTextField(title, { title = it; vm.update(g.id) { x -> x.copy(title = it) } }, textStyle = Aiimin.type.title)
            Spacer(Modifier.height(8.dp))
            var why by remember(g.id) { mutableStateOf(g.why) }
            AppTextField(why, { why = it; vm.update(g.id) { x -> x.copy(why = it) } }, placeholder = "Why it matters, in one line")
            Spacer(Modifier.height(16.dp))
            Box(Modifier.fillMaxWidth().height(8.dp).clip(RoundedCornerShape(3.dp)).background(c.border)) {
                Box(Modifier.fillMaxWidth((progress ?: 0f).coerceIn(0f, 1f)).height(8.dp).background(c.text))
            }
            Text(progress?.let { "${(it * 100).toInt()}% · from ${g.milestones.count { m -> m.done }} of ${g.milestones.size} milestones and ${linked.count { t -> t.done }} of ${linked.size} tasks" } ?: "Progress appears once you add a milestone or link a task.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 8.dp))
            Row(Modifier.fillMaxWidth().clickable { datePick = true }.heightIn(min = 56.dp), verticalAlignment = Alignment.CenterVertically) {
                Text("Target date", style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.weight(1f))
                Text(g.due?.let { Dates.dayMonth(LocalDate.parse(it)) } ?: "Not set", style = Aiimin.type.body.copy(color = c.text))
            }
            Hairline()
            SectionHeader("Milestones")
            g.milestones.forEachIndexed { i, m ->
                Row(Modifier.fillMaxWidth().heightIn(min = 48.dp), verticalAlignment = Alignment.CenterVertically) {
                    CheckCircle(m.done, { vm.update(g.id) { x -> x.copy(milestones = x.milestones.mapIndexed { k, y -> if (k == i) y.copy(done = !y.done) else y }) } }, m.t)
                    Text(m.t, style = Aiimin.type.body.copy(color = if (m.done) c.textMuted else c.text, textDecoration = if (m.done) androidx.compose.ui.text.style.TextDecoration.LineThrough else null), modifier = Modifier.weight(1f))
                    AppIconButton(AppIcons.Close, "Remove", { vm.update(g.id) { x -> x.copy(milestones = x.milestones.filterIndexed { k, _ -> k != i }) } }, tint = c.textMuted)
                }
            }
            AppTextField(milestone, { milestone = it }, placeholder = "Add a milestone", onDone = {
                if (milestone.isNotBlank()) { vm.update(g.id) { x -> x.copy(milestones = x.milestones + Milestone(milestone.trim())) }; milestone = "" }
            })
            SectionHeader("Tasks for this goal")
            linked.forEach { t ->
                Row(Modifier.fillMaxWidth().heightIn(min = 48.dp).clickable { nav.open(Route.Task(t.id)) }, verticalAlignment = Alignment.CenterVertically) {
                    CheckCircle(t.done, { vm.toggleTask(t.id) }, t.title)
                    Text(t.title, style = Aiimin.type.body.copy(color = if (t.done) c.textMuted else c.text), modifier = Modifier.weight(1f))
                }
            }
            AppTextField(task, { task = it }, placeholder = "Add a task to this goal", onDone = {
                if (task.isNotBlank()) { val t = task.trim(); task = ""; scope.launch { vm.addTask(g.id, t); toaster.show("Added to Someday") } }
            })
            Spacer(Modifier.height(16.dp))
            AppButton(if (g.archived) "Bring back" else "Archive goal", { vm.update(g.id) { x -> x.copy(archived = !x.archived) }; nav.back() }, kind = ButtonKind.SECONDARY)
            Spacer(Modifier.height(32.dp))
        }
        if (datePick) DatePick(g.due?.let(LocalDate::parse) ?: LocalDate.now().plusMonths(1), { d -> vm.update(g.id) { x -> x.copy(due = d.toString()) }; datePick = false }, { datePick = false })
    }
}

// ------------------------------------------------------------------ weekly review

data class WeekUi(
    val scores: List<Float?>,
    val kept: Int,
    val days: Int,
    val focusTotal: Int,
    val bestDay: String?,
    val spent: Long,
    val topCats: List<Pair<String, Long>>,
    val expiring: List<String>,
    val weekNo: Int,
    val upcoming: List<TaskEntity>,
)

@HiltViewModel
class WeeklyReviewViewModel @Inject constructor(
    private val life: LifeRepository,
    private val money: MoneyRepository,
    private val vault: VaultRepository,
    private val tasks: TaskRepository,
    private val notes: NoteRepository,
    private val clock: DayClock,
) : ViewModel() {
    val ui = MutableStateFlow<WeekUi?>(null)

    init {
        viewModelScope.launch {
            val v = life.compute()
            val today = clock.today()
            val series = v.readout.series.takeLast(7)
            val hist = v.history.takeLast(7)
            val kept = hist.count { it.minimums.planned > 0 && it.minimums.kept == it.minimums.planned }
            val focus = hist.mapNotNull { it.value(Signals.FOCUS) }
            val best = hist.maxByOrNull { it.value(Signals.FOCUS) ?: 0.0 }?.takeIf { (it.value(Signals.FOCUS) ?: 0.0) > 0 }?.day?.let { Dates.dayMonth(it).replace(",", "") }
            val from = today.minusDays(6).toString()
            val txns = money.recent(2000).first().filter { !it.deleted && it.direction == "out" && it.day >= from }
            val cats = txns.groupBy { it.category }.mapValues { it.value.sumOf { t -> t.amountPaise } }.entries.sortedByDescending { it.value }.take(3).map { it.key to it.value }
            val docs = vault.visible.first().filter { (it.daysToExpiry ?: 999) in 0..30 }.map { "${it.doc.title} · ${it.daysToExpiry} days" }
            val upcoming = tasks.upcoming(today).first().filter { it.day != null }.take(10)
            ui.value = WeekUi(series.map { it.score?.toFloat() }, kept, hist.size, focus.sum().toInt(), best, txns.sumOf { it.amountPaise }, cats, docs, java.time.temporal.IsoFields.WEEK_OF_WEEK_BASED_YEAR.let { today.get(it) }, upcoming)
        }
    }

    suspend fun save(week: Int, line: String, ui: WeekUi, picks: List<TaskEntity>): String {
        val body = buildString {
            if (line.isNotBlank()) append(line.trim()).append("\n\n")
            append("Score this week: ").append(ui.scores.filterNotNull().let { if (it.isEmpty()) "not enough days yet" else "${it.first().toInt()} → ${it.last().toInt()}" }).append('\n')
            append("Kept days: ${ui.kept} of ${ui.days}\n")
            append("Focus: ${ui.focusTotal / 60}h ${ui.focusTotal % 60}m").append(ui.bestDay?.let { " · best day $it" } ?: "").append('\n')
            append("Spent: ${Money.whole(ui.spent)}").append(if (ui.topCats.isNotEmpty()) " · " + ui.topCats.joinToString(", ") { "${it.first} ${Money.whole(it.second)}" } else "").append('\n')
            if (ui.expiring.isNotEmpty()) append("Expiring: ${ui.expiring.joinToString("; ")}\n")
            if (picks.isNotEmpty()) append("\nNext week:\n").append(picks.joinToString("\n") { "- [ ] ${it.title}" })
        }
        picks.forEach { tasks.update(it.copy(priority = 2, updatedAt = System.currentTimeMillis())) }
        notes.save(null, "Week $week review", body)
        return "Week $week review"
    }
}

/** T17 · Weekly review. It is saved as a Note, never as a journal entry: the journal is only ever written by you. */
@Composable
fun WeeklyReviewScreen(vm: WeeklyReviewViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    val c = Aiimin.colors
    val u by vm.ui.collectAsStateWithLifecycle()
    var line by remember { mutableStateOf("") }
    val picks = remember { mutableStateOf(setOf<String>()) }
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Weekly review", onBack = { nav.back() })
        val w = u
        if (w == null) { Skeleton(Modifier.padding(Aiimin.space.gutter).fillMaxWidth().height(220.dp)); return@Column }
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = Aiimin.space.gutter)) {
            Text("The week in one line", style = Aiimin.type.eyebrow.copy(color = c.textMuted), modifier = Modifier.padding(top = 8.dp, bottom = 8.dp))
            AppTextField(line, { line = it }, placeholder = "One line about your week", singleLine = false)
            SectionHeader("Score")
            val pts = w.scores
            if (pts.count { it != null } >= 2) {
                Sparkline(pts, height = 80.dp, color = c.text)
                Text("${pts.filterNotNull().first().toInt()} → ${pts.filterNotNull().last().toInt()} over the week", style = Aiimin.type.caption, modifier = Modifier.padding(top = 8.dp))
            } else Text("Not enough days yet.", style = Aiimin.type.caption)
            SectionHeader("Kept days")
            Text("${w.kept} of ${w.days}", style = Aiimin.type.title)
            SectionHeader("Focus")
            Text(if (w.focusTotal <= 0) "No focus sessions this week." else "${w.focusTotal / 60}h ${"%02d".format(w.focusTotal % 60)}m total" + (w.bestDay?.let { " · best day $it" } ?: ""), style = Aiimin.type.body.copy(color = c.text))
            SectionHeader("Money")
            Text(if (w.spent <= 0) "Nothing spent this week." else "${Money.whole(w.spent)} spent", style = Aiimin.type.title)
            w.topCats.forEach { (k, v) ->
                Row(Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                    Text(k, style = Aiimin.type.body.copy(color = c.text), modifier = Modifier.weight(1f))
                    Text(Money.whole(v), style = Aiimin.type.body.copy(fontFeatureSettings = "tnum"))
                }
            }
            if (w.expiring.isNotEmpty()) {
                SectionHeader("Documents expiring in 30 days")
                w.expiring.forEach { Text(it, style = Aiimin.type.body.copy(color = c.text), modifier = Modifier.padding(vertical = 4.dp)) }
            }
            SectionHeader("Next week · pick up to three")
            if (w.upcoming.isEmpty()) Text("No tasks lined up. Add some from Today.", style = Aiimin.type.caption)
            w.upcoming.forEach { t ->
                val on = t.id in picks.value
                Row(Modifier.fillMaxWidth().heightIn(min = 48.dp).clickable {
                    if (on) picks.value = picks.value - t.id else if (picks.value.size < 3) picks.value = picks.value + t.id else toaster.show("Three is the most")
                }, verticalAlignment = Alignment.CenterVertically) {
                    CheckCircle(on, { if (on) picks.value = picks.value - t.id else if (picks.value.size < 3) picks.value = picks.value + t.id else toaster.show("Three is the most") }, t.title)
                    Text(t.title, style = Aiimin.type.body.copy(color = c.text), modifier = Modifier.weight(1f))
                    Text(t.day?.let { Dates.relative(LocalDate.parse(it), LocalDate.now()) } ?: "", style = Aiimin.type.caption)
                }
            }
            Spacer(Modifier.height(24.dp))
        }
        Hairline()
        Row(Modifier.fillMaxWidth().navigationBarsPadding().padding(Aiimin.space.gutter)) {
            AppButton("Save to Notes", {
                scope.launch {
                    val name = vm.save(w.weekNo, line, w, w.upcoming.filter { it.id in picks.value })
                    toaster.show("Saved to Notes as '$name'")
                    nav.back()
                }
            }, Modifier.fillMaxWidth())
        }
    }
}
