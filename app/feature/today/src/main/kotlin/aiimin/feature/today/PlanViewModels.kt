package aiimin.feature.today

import aiimin.core.data.core.DayClock
import aiimin.core.data.day.DayRepository
import aiimin.core.data.plan.CalendarRepository
import aiimin.core.data.plan.DayPart
import aiimin.core.data.plan.FocusRepository
import aiimin.core.data.plan.FocusResult
import aiimin.core.data.plan.MinimumRepository
import aiimin.core.data.plan.Subtask
import aiimin.core.data.plan.TaskRepository
import aiimin.core.data.vault.ME
import aiimin.core.data.vault.VaultRepository
import aiimin.core.database.CalendarEventEntity
import aiimin.core.database.MinimumEntity
import aiimin.core.database.TaskEntity
import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import java.time.Instant
import java.time.LocalDate
import java.time.LocalTime
import javax.inject.Inject
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.emitAll
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

@HiltViewModel
class TaskViewModel @Inject constructor(
    private val tasks: TaskRepository,
    private val clock: DayClock,
) : ViewModel() {
    private val id = MutableStateFlow<String?>(null)

    @OptIn(ExperimentalCoroutinesApi::class)
    val task: StateFlow<TaskEntity?> = id.flatMapLatest { i -> if (i == null) flow { emit(null) } else tasks.observe(i) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)

    val today = MutableStateFlow(LocalDate.now())

    fun load(taskId: String) {
        id.value = taskId
        viewModelScope.launch { today.value = clock.today() }
    }

    fun subtasks(t: TaskEntity) = tasks.subtasks(t)

    private var titleJob: Job? = null
    fun setTitle(t: TaskEntity, title: String) {
        titleJob?.cancel()
        titleJob = viewModelScope.launch {
            delay(400)
            if (title.isNotBlank()) tasks.update(t.copy(title = title.trim()))
        }
    }

    fun setNotes(t: TaskEntity, notes: String) = viewModelScope.launch { tasks.update(t.copy(notes = notes)) }
    fun setDay(t: TaskEntity, day: LocalDate?) = viewModelScope.launch { tasks.update(t.copy(day = day?.toString())) }
    fun setTime(t: TaskEntity, time: LocalTime?) = viewModelScope.launch {
        tasks.update(t.copy(time = time?.toString()?.take(5), part = (time?.let { DayPart.of(it.toString().take(5), null) } ?: DayPart.of(null, t.part)).name))
    }
    fun setPart(t: TaskEntity, p: DayPart) = viewModelScope.launch { tasks.update(t.copy(part = p.name, time = null)) }
    fun setPriority(t: TaskEntity, p: Int) = viewModelScope.launch { tasks.update(t.copy(priority = p)) }
    fun setRepeat(t: TaskEntity, r: String?) = viewModelScope.launch { tasks.update(t.copy(recurrence = r)) }
    fun toggleSub(t: TaskEntity, i: Int) = viewModelScope.launch { tasks.toggleSubtask(t.id, i) }
    fun addSub(t: TaskEntity, text: String) = viewModelScope.launch {
        if (text.isNotBlank()) tasks.setSubtasks(t.id, tasks.subtasks(t) + Subtask(text.trim()))
    }
    fun removeSub(t: TaskEntity, i: Int) = viewModelScope.launch { tasks.setSubtasks(t.id, tasks.subtasks(t).filterIndexed { k, _ -> k != i }) }
    suspend fun toggle(t: TaskEntity) = tasks.toggle(t.id)
    suspend fun delete(t: TaskEntity) = tasks.delete(t.id)
    fun restore(t: TaskEntity) = viewModelScope.launch { tasks.restore(t) }
}

@OptIn(ExperimentalCoroutinesApi::class)
@HiltViewModel
class CalendarViewModel @Inject constructor(
    private val calendar: CalendarRepository,
    private val tasks: TaskRepository,
    private val clock: DayClock,
) : ViewModel() {
    val selected = MutableStateFlow(LocalDate.now())
    val zone get() = clock.zone

    init {
        viewModelScope.launch { selected.value = clock.today() }
    }

    data class DayAgenda(val events: List<CalendarEventEntity>, val tasks: List<TaskEntity>)

    val agenda: StateFlow<DayAgenda> = selected.flatMapLatest { d ->
        combine(flow { emitAll(calendar.forDay(d)) }, tasks.forDay(d)) { e, t -> DayAgenda(e, t.filter { it.assignee == null }) }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), DayAgenda(emptyList(), emptyList()))

    fun select(d: LocalDate) { selected.value = d }

    fun save(id: String?, title: String, date: LocalDate, start: LocalTime, end: LocalTime, allDay: Boolean, location: String) = viewModelScope.launch {
        val l = clock.logical()
        val s = if (allDay) l.startOf(date).toInstant() else date.atTime(start).atZone(clock.zone).toInstant()
        val e = if (allDay) l.endOf(date).toInstant() else date.atTime(if (end > start) end else start.plusMinutes(30)).atZone(clock.zone).toInstant()
        if (id == null) {
            calendar.create(title, s, e, allDay, location = location)
        } else {
            calendar.get(id)?.let { calendar.save(it.copy(title = title, startAt = s.toEpochMilli(), endAt = e.toEpochMilli(), allDay = allDay, location = location)) }
        }
    }

    suspend fun delete(id: String) = calendar.delete(id)
    fun restore(e: CalendarEventEntity) = viewModelScope.launch { calendar.restore(e) }
    fun instant(ms: Long) = Instant.ofEpochMilli(ms).atZone(clock.zone)
}

@HiltViewModel
class FocusViewModel @Inject constructor(private val focus: FocusRepository) : ViewModel() {
    val active = focus.active.stateIn(viewModelScope, SharingStarted.Eagerly, null)
    val result = MutableStateFlow<FocusResult?>(null)

    fun start(label: String, minutes: Int, taskId: String?) = viewModelScope.launch { result.value = null; focus.start(label, minutes, taskId) }
    fun pause() = viewModelScope.launch { focus.pause() }
    fun resume() = viewModelScope.launch { focus.resume() }
    fun finish(completed: Boolean) = viewModelScope.launch { result.value = focus.finish(completed) }
    fun discard() = viewModelScope.launch { focus.discard() }
}

@HiltViewModel
class MinimumsViewModel @Inject constructor(
    private val minimums: MinimumRepository,
    private val days: DayRepository,
    private val vault: VaultRepository,
    private val clock: DayClock,
) : ViewModel() {
    val today = MutableStateFlow(LocalDate.now())

    @OptIn(ExperimentalCoroutinesApi::class)
    val list = today.flatMapLatest { minimums.today(it) }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

    @OptIn(ExperimentalCoroutinesApi::class)
    val history = today.flatMapLatest { d -> minimums.history(d.minusDays(27)).map { ticks -> ticks.filter { it.done }.groupBy { it.day }.mapValues { it.value.size } } }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyMap())

    @OptIn(ExperimentalCoroutinesApi::class)
    val dayState = today.flatMapLatest { days.observe(it) }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)

    init {
        viewModelScope.launch { today.value = clock.today() }
    }

    fun add(name: String, tiny: String, domain: String) = viewModelScope.launch { minimums.add(name, tiny, domain, startToday = list.value.isEmpty()) }
    fun edit(m: MinimumEntity) = viewModelScope.launch { minimums.edit(m) }
    fun archive(id: String) = viewModelScope.launch { minimums.archive(id) }
    suspend fun toggle(id: String) = minimums.toggle(id)
    suspend fun pause(on: Boolean, reason: String?) = days.setPaused(on, reason)

    suspend fun attachProof(id: String, uri: Uri) {
        val r = vault.import(uri, ME, titleHint = "Proof · ${LocalDate.now()}")
        minimums.attachProof(id, r.docId)
    }
}

@OptIn(ExperimentalCoroutinesApi::class)
@HiltViewModel
class UpcomingViewModel @Inject constructor(private val tasks: TaskRepository, private val clock: DayClock) : ViewModel() {
    val today = MutableStateFlow(LocalDate.now())
    val list = today.flatMapLatest { tasks.upcoming(it) }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

    init {
        viewModelScope.launch { today.value = clock.today() }
    }

    fun moveToday(id: String) = viewModelScope.launch { tasks.moveTo(id, clock.today()) }
}
