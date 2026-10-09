package aiimin.feature.today

import aiimin.core.data.app.ActivityLine
import aiimin.core.data.app.ActivityRepository
import aiimin.core.data.core.DayClock
import aiimin.core.data.day.DayRepository
import aiimin.core.data.device.DeviceRepository
import aiimin.core.data.life.LifeRepository
import aiimin.core.data.life.LifeView
import aiimin.core.data.notify.NotificationRepository
import aiimin.core.data.plan.ActiveFocus
import aiimin.core.data.plan.CalendarRepository
import aiimin.core.data.plan.DayPart
import aiimin.core.data.plan.FocusRepository
import aiimin.core.data.plan.MinimumRepository
import aiimin.core.data.plan.MinimumToday
import aiimin.core.data.plan.TaskRepository
import aiimin.core.data.settings.SettingsStore
import aiimin.core.data.vault.VaultRepository
import aiimin.core.database.CalendarEventEntity
import aiimin.core.database.DayStateEntity
import aiimin.core.database.DeviceDayEntity
import aiimin.core.database.TaskEntity
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import java.time.Instant
import java.time.LocalDate
import java.time.LocalTime
import java.time.ZoneId
import java.time.temporal.ChronoUnit
import javax.inject.Inject
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.emitAll
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

enum class FlowKind { TASK, EVENT, EXPIRY }

data class FlowItem(
    val kind: FlowKind,
    val id: String,
    val title: String,
    val time: LocalTime?,
    val end: LocalTime?,
    val done: Boolean,
    val part: DayPart,
    val priority: Int = 1,
    val carried: Int = 0,
    val subtitle: String? = null,
    val assignee: String? = null,
)

data class NowCard(val item: FlowItem, val isNow: Boolean, val moreToday: Int)

data class TodayUi(
    val date: LocalDate,
    val name: String,
    val flow: Map<DayPart, List<FlowItem>>,
    val now: NowCard?,
    val minimums: List<MinimumToday>,
    val dayState: DayStateEntity?,
    val life: LifeView?,
    val device: DeviceDayEntity?,
    val unread: Int,
    val focus: ActiveFocus?,
    val activity: List<ActivityLine>,
    val expiringTitle: String?,
    val expiringId: String?,
    val yesterdayOpen: Boolean,
    val hideScore: Boolean,
    val hideXp: Boolean,
) {
    val tasksOpen get() = flow.values.flatten().count { it.kind == FlowKind.TASK && !it.done }
}

@OptIn(ExperimentalCoroutinesApi::class)
@HiltViewModel
class TodayViewModel @Inject constructor(
    private val clock: DayClock,
    private val tasks: TaskRepository,
    private val calendar: CalendarRepository,
    private val minimums: MinimumRepository,
    private val focus: FocusRepository,
    private val days: DayRepository,
    life: LifeRepository,
    device: DeviceRepository,
    notifications: NotificationRepository,
    activity: ActivityRepository,
    vault: VaultRepository,
    settings: SettingsStore,
) : ViewModel() {

    private val zone: ZoneId get() = clock.zone
    private val _part = MutableStateFlow(DayPart.now())
    val part: StateFlow<DayPart> = _part
    fun selectPart(p: DayPart) { _part.value = p }

    private val yesterdayOpen = MutableStateFlow(false)

    val ui: StateFlow<TodayUi?> = clock.todayFlow.distinctUntilChanged().flatMapLatest { day ->
        val plan = combine(
            tasks.forDay(day),
            flow { emitAll(calendar.forDay(day)) },
            minimums.today(day),
            days.observe(day),
            flow { emit(vault.expiring(30)) },
        ) { t, e, m, st, exp -> Plan(t, e, m, st, exp.firstOrNull()) }
        val ambient = combine(life.view, device.observe(day), notifications.unread, focus.active, activity.recent(4)) { l, d, u, f, a -> Ambient(l, d, u, f, a) }
        combine(plan, ambient, settings.settings, yesterdayOpen) { p, a, s, y ->
            val items = buildFlow(day, p.tasks, p.events)
            TodayUi(
                date = day, name = s.name, flow = items, now = nowCard(items.values.flatten()),
                minimums = p.mins.filter { it.planned || it.done }, dayState = p.state, life = a.life, device = a.device,
                unread = a.unread, focus = a.focus, activity = a.activity,
                expiringTitle = p.expiring?.title, expiringId = p.expiring?.id, yesterdayOpen = y,
                hideScore = s.hideScore, hideXp = s.hideXp,
            )
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)

    private data class Plan(
        val tasks: List<TaskEntity>,
        val events: List<CalendarEventEntity>,
        val mins: List<MinimumToday>,
        val state: DayStateEntity?,
        val expiring: aiimin.core.database.DocEntity?,
    )

    private data class Ambient(val life: LifeView?, val device: DeviceDayEntity?, val unread: Int, val focus: ActiveFocus?, val activity: List<ActivityLine>)

    init {
        viewModelScope.launch {
            days.ensureToday()
            yesterdayOpen.value = days.yesterdayOpen()
        }
    }

    private fun buildFlow(day: LocalDate, tasks: List<TaskEntity>, events: List<CalendarEventEntity>): Map<DayPart, List<FlowItem>> {
        val items = mutableListOf<FlowItem>()
        tasks.filter { it.assignee == null || it.assignee == "me" }.forEach { t ->
            val time = t.time?.let { runCatching { LocalTime.parse(it) }.getOrNull() }
            items += FlowItem(
                FlowKind.TASK, t.id, t.title, time, null, t.done, DayPart.of(t.time, t.part), t.priority, t.carried,
                subtitle = if (t.carried > 0 && !t.done) "Carried ${t.carried}×" else null, assignee = t.assignee,
            )
        }
        events.forEach { e ->
            val start = Instant.ofEpochMilli(e.startAt).atZone(zone)
            val end = Instant.ofEpochMilli(e.endAt).atZone(zone)
            if (e.allDay || e.source == "vault") {
                items += FlowItem(if (e.source == "vault") FlowKind.EXPIRY else FlowKind.EVENT, e.docId ?: e.id, e.title, null, null, false, DayPart.MORNING, subtitle = "All day")
            } else {
                val st = if (start.toLocalDate() < day) LocalTime.MIDNIGHT else start.toLocalTime()
                items += FlowItem(
                    FlowKind.EVENT, e.id, e.title, st, end.toLocalTime(), false, DayPart.of(st.toString().take(5), null),
                    subtitle = e.location.ifBlank { null },
                )
            }
        }
        val order = compareBy<FlowItem>({ it.kind != FlowKind.EXPIRY }, { it.time == null }, { it.time }, { -it.priority })
        return DayPart.entries.associateWith { p -> items.filter { it.part == p }.sortedWith(order) }
    }

    /** The one thing that matters now: a running event, else the next timed item, else the top open task. */
    private fun nowCard(all: List<FlowItem>): NowCard? {
        val now = LocalTime.now(zone)
        val open = all.filter { !it.done && it.kind != FlowKind.EXPIRY }
        val running = open.firstOrNull { it.kind == FlowKind.EVENT && it.time != null && it.end != null && now >= it.time && now < it.end }
        val next = open.filter { it.time != null && it.time >= now }.minByOrNull { it.time!! }
        val top = open.filter { it.kind == FlowKind.TASK && it.time == null }.maxByOrNull { it.priority }
        val pick = running ?: next ?: top ?: return null
        val rest = open.count { it.id != pick.id && it.kind == FlowKind.TASK }
        return NowCard(pick, running != null, rest)
    }

    fun minutesUntil(t: LocalTime): Long = ChronoUnit.MINUTES.between(LocalTime.now(zone), t)

    suspend fun toggleTask(id: String) = tasks.toggle(id)
    suspend fun toggleMinimum(id: String) = minimums.toggle(id)
    suspend fun backfillMinimum(id: String) = minimums.backfillYesterday(id).also { yesterdayOpen.value = days.yesterdayOpen() }

    fun addTask(title: String, part: DayPart, day: LocalDate) {
        if (title.isBlank()) return
        viewModelScope.launch { tasks.create(title, day, part = part) }
    }

    suspend fun deleteTask(id: String) = tasks.delete(id)
    fun restoreTask(t: TaskEntity) = viewModelScope.launch { tasks.restore(t) }
    fun moveTomorrow(id: String) = viewModelScope.launch { tasks.moveTo(id, clock.today().plusDays(1)) }
    suspend fun setLight(on: Boolean) = days.setLight(on)
}
