package aiimin.feature.today

import aiimin.core.data.app.ActivityLine
import aiimin.core.data.app.ActivityRepository
import aiimin.core.data.core.DayClock
import aiimin.core.data.day.DayRepository
import aiimin.core.data.device.DeviceRepository
import aiimin.core.data.pulse.Pulse
import aiimin.core.data.pulse.Reason
import aiimin.core.engine.pulse.Job
import kotlinx.coroutines.flow.filter
import kotlinx.coroutines.flow.filterNotNull
import kotlinx.coroutines.flow.mapLatest
import aiimin.core.data.life.LifeRepository
import aiimin.core.data.life.LifeView
import aiimin.core.data.notes.NoteRepository
import aiimin.core.database.NoteEntity
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
import kotlinx.coroutines.flow.map
import aiimin.core.engine.today.BillDue
import aiimin.core.engine.today.DayEndDecision
import aiimin.core.engine.today.DayEndLearner
import aiimin.core.engine.today.DayEndMode
import aiimin.core.engine.today.FirstWeek
import aiimin.core.engine.today.FocusNow
import aiimin.core.engine.today.NowInput
import aiimin.core.engine.today.NowKind
import aiimin.core.engine.today.NowLine
import aiimin.core.engine.today.OpenTask
import aiimin.core.engine.today.QuickDoors
import aiimin.core.engine.today.SetupStep
import aiimin.core.engine.today.Timed
import aiimin.core.engine.today.WhatNow

enum class FlowKind { TASK, EVENT, EXPIRY }

/** Process-wide: the day the landmark line was first shown, and the day the day end was last learned. */
private var landmarkSessionDay: LocalDate? = null
private var lastLearnedDay: LocalDate? = null

/** Quick door keys that have a screen behind them (FeatureIndex routes plus Pour's writer). */
private val DOOR_KEYS: Set<String> = aiimin.designsystem.nav.FeatureIndex.all.map { it.route::class.simpleName.orEmpty().lowercase() }.toSet() + "journalwrite"

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

data class TodayUi(
    val date: LocalDate,
    val name: String,
    val flow: Map<DayPart, List<FlowItem>>,
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
    val pinned: NoteEntity? = null,
    val glance: List<GlanceLine> = emptyList(),
    /** PRD 1.2: the one "What now?" line (fixed order, offline). */
    val whatNow: NowLine = NowLine(NowKind.CLEAR),
    val dayEnd: LocalTime = LocalTime.of(22, 0),
    /** First-week ladder (days 1 to 7, until all five are done), or null. */
    val setup: List<Pair<SetupStep, Boolean>>? = null,
    /** Quick doors (Part 17): route keys, four of them. */
    val doors: List<String> = emptyList(),
    /** A learned day-end hour to offer ("Your evenings seem to start near …"), or null. */
    val dayEndSuggest: LocalTime? = null,
    val hasBudget: Boolean = false,
    val hasNote: Boolean = false,
    val pinnedDoors: List<String> = emptyList(),
    /** Whether yesterday was closed (wrap-up after midnight belongs to yesterday). */
    val yesterdayClosed: Boolean = false,
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
    private val device: DeviceRepository,
    private val pulse: Pulse,
    activity: ActivityRepository,
    private val vault: VaultRepository,
    private val settingsStore: SettingsStore,
    notes: NoteRepository,
    money: aiimin.core.data.money.MoneyRepository,
    journal: aiimin.core.data.notes.JournalRepository,
    bills: aiimin.core.data.money.BillRepository,
) : ViewModel() {

    /** What the phone can measure right now; refreshed on every resume so a grant shows at once. */
    val access = MutableStateFlow<aiimin.core.data.device.SensorAccess?>(null)
    private val setupPrefs = MutableStateFlow(0L)
    fun refreshAccess() = viewModelScope.launch {
        val before = access.value
        access.value = runCatching { device.access() }.getOrNull()
        // A sensor was just granted: measure now instead of waiting for the next minute's beat.
        if (before != null && before != access.value) pulse.beat(Reason.MANUAL, force = setOf(Job.DEVICE))
    }
    /** Steps for the "phone is pausing AIIMIN" card, or null when it shouldn't show (plan Phase 16). */
    val keepAlive: StateFlow<String?> = combine(settingsStore.settings, clock.tick) { s, now -> Triple(s.stallDetectedAt, s.keepAliveDismissedAt, now) }
        .distinctUntilChanged()
        .mapLatest { (stalled, dismissed, now) ->
            if (stalled == null) return@mapLatest null
            val (facts, profile) = runCatching { device.profile() }.getOrNull() ?: return@mapLatest null
            if (aiimin.core.sensing.logic.KeepAlive.show(stalled, profile.needsKeepAlive, device.backgroundUnrestricted(), dismissed, now)) aiimin.core.sensing.logic.KeepAlive.steps(facts.maker) else null
        }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)
    fun dismissKeepAlive() = viewModelScope.launch { settingsStore.update { it.copy(keepAliveDismissedAt = System.currentTimeMillis()) } }
    fun appDetails() = device.appDetailsIntent()
    val healthPermissions get() = device.healthPermissions
    fun healthContract() = device.healthContract()
    fun usageSettings() = device.usageSettingsIntent()
    fun healthInstall() = device.healthInstallIntent()

    private val zone: ZoneId get() = clock.zone
    private val _part = MutableStateFlow(DayPart.now())
    val part: StateFlow<DayPart> = _part
    fun selectPart(p: DayPart) { _part.value = p }

    private val yesterdayOpen = MutableStateFlow(false)

    private val base: kotlinx.coroutines.flow.Flow<TodayUi> = clock.todayFlow.distinctUntilChanged().flatMapLatest { day ->
        val plan = combine(
            tasks.forDay(day),
            flow { emitAll(calendar.forDay(day)) },
            minimums.today(day),
            combine(days.observe(day), days.observe(day.minusDays(1))) { a, y -> a to (y?.closedAt != null) },
            flow { emit(vault.expiring(30)) },
        ) { t, e, m, st, exp -> Plan(t, e, m, st.first, exp.firstOrNull(), st.second) }
        // Score, phone numbers and unread come from Pulse's one snapshot, the same one the widget and reminders read.
        val live = pulse.liveDay.filterNotNull().filter { it.date == day }
        val ambient = combine(live, focus.active, activity.recent(4)) { l, f, a -> Ambient(l.life, l.device, l.unread, f, a) }
        // At a glance: this month's personal spend, payments waiting for review, today's journal.
        val glanceIn = combine(
            money.month(java.time.YearMonth.from(day), aiimin.core.data.money.Ledger.PERSONAL, day),
            money.pending(),
            journal.entries,
            notes.all(),
        ) { m, pending, entries, ns -> GlanceIn(m.spent, pending.size, entries.any { it.day == day }, ns, m.budget != null) }
        combine(plan, ambient, settingsStore.settings, yesterdayOpen, glanceIn) { p, a, s, y, g ->
            val ns = g.notes
            val items = buildFlow(day, p.tasks, p.events)
            TodayUi(
                date = day, name = s.name, flow = items,
                minimums = p.mins.filter { it.planned || it.done }, dayState = p.state, life = a.life, device = a.device,
                unread = a.unread, focus = a.focus, activity = a.activity,
                expiringTitle = p.expiring?.title, expiringId = p.expiring?.id, yesterdayOpen = y,
                hideScore = s.hideScore, hideXp = s.hideXp, pinned = ns.firstOrNull { it.pinned && !it.deleted },
                hasBudget = g.budgetSet, hasNote = ns.any { !it.deleted }, yesterdayClosed = p.yesterdayClosed,
                glance = atAGlance(
                    day, g.spent, g.toReview,
                    p.expiring?.let { d -> d.expires?.let { runCatching { java.time.LocalDate.parse(it) }.getOrNull() }?.let { GlanceDoc(d.id, d.title, it) } },
                    g.journalToday,
                ),
            )
        }
    }

    /** Bills due today (rule 3), documents saved (first-week step) and the learned day end. */
    private val billsToday = bills.comingUp(0)
    private val hasDoc = vault.visible.map { it.isNotEmpty() }
    private val dayEndOffer = MutableStateFlow<LocalTime?>(null)

    val ui: StateFlow<TodayUi?> = combine(base, billsToday, hasDoc, clock.tick, combine(settingsStore.settings, access, dayEndOffer) { s, a, o -> Triple(s, a, o) }) { b, billList, doc, nowMs, (s, acc, offer) ->
        val now = Instant.ofEpochMilli(nowMs).atZone(zone)
        val time = now.toLocalTime()
        val dayEnd = LocalTime.of((s.dayEndMin / 60) % 24, s.dayEndMin % 60)
        val items = b.flow.values.flatten()
        // "Plan your week/month" shows for the first app session of a Monday or the 1st (process-wide, so tab
        // switches don't drop it), and is marked shown only once it was actually the line.
        val landmark = (b.date.dayOfWeek == java.time.DayOfWeek.MONDAY || b.date.dayOfMonth == 1) &&
            (s.landmarkShownOn != b.date.toString() || landmarkSessionDay == b.date)
        // After midnight and before 04:00 the evening still belongs to the day before (wrap-up, Not now).
        val night = time.isBefore(LocalTime.of(4, 0)) && dayEnd.hour >= 4
        val lineDay = if (night) b.date.minusDays(1) else b.date
        val hidden = s.whatNowHidden?.takeIf { it.substringBefore('|') == lineDay.toString() }?.substringAfter('|')
            ?.split(',')?.mapNotNull { k -> runCatching { NowKind.valueOf(k) }.getOrNull() }?.toSet().orEmpty()
        val input = NowInput(
            date = b.date, time = time,
            focus = b.focus?.let { f -> FocusNow(f.label, (f.plannedMin - f.elapsedMs(nowMs) / 60_000).toInt().coerceAtLeast(0)) },
            timed = items.filter { !it.done && it.time != null && it.kind != FlowKind.EXPIRY }.map { Timed(it.id, it.title, it.time!!, it.end, it.kind == FlowKind.EVENT) },
            bills = billList.filter { it.nextDue == b.date.toString() }.map { BillDue(it.id, it.title, it.amountPaise) },
            dayEnd = dayEnd,
            wrappedUp = if (night) b.yesterdayClosed else b.dayState?.closedAt != null,
            landmarkDue = landmark,
            minimumsLeft = b.minimums.filter { it.planned && !it.done }.map { it.minimum.name },
            tasks = items.filter { it.kind == FlowKind.TASK && !it.done }.mapIndexed { i, t -> OpenTask(t.id, t.title, t.priority, t.time, i.toLong()) },
            hidden = hidden,
            skips = s.whatNowSkips.mapNotNull { (k, v) -> runCatching { NowKind.valueOf(k) to v }.getOrNull() }.toMap(),
            raahiOn = true,
        )
        val install = s.installDay?.let { runCatching { LocalDate.parse(it) }.getOrNull() } ?: b.date
        val done = buildSet {
            if (acc?.usage == true) add(SetupStep.SCREEN_TIME)
            if (b.minimums.isNotEmpty()) add(SetupStep.MINIMUM)
            if (s.firstCaptureDone) add(SetupStep.CAPTURE)
            if (doc) add(SetupStep.DOCUMENT)
            if (b.hasBudget) add(SetupStep.BUDGET)
        }
        val pick = WhatNow.pick(input)
        if (pick.kind == NowKind.LANDMARK && landmarkSessionDay != b.date) {
            landmarkSessionDay = b.date
            viewModelScope.launch { settingsStore.update { it.copy(landmarkShownOn = b.date.toString()) } }
        }
        b.copy(
            whatNow = pick,
            dayEnd = dayEnd,
            setup = if (FirstWeek.show(install, b.date, done)) FirstWeek.steps().map { it to (it in done) } else null,
            doors = QuickDoors.pick(install, b.date, s.featureOpens, s.pinnedDoors, b.hasNote, valid = DOOR_KEYS),
            dayEndSuggest = offer,
            pinnedDoors = s.pinnedDoors,
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)

    /** "Not now": hidden until midnight; the third skip of a kind drops it one step (PRD 1.2). */
    fun notNow(kind: NowKind) = viewModelScope.launch {
        val d = clock.today()
        val day = (if (LocalTime.now(zone).isBefore(LocalTime.of(4, 0)) && settingsStore.current().dayEndMin >= 4 * 60) d.minusDays(1) else d).toString()
        settingsStore.update { st ->
            val kinds = st.whatNowHidden?.takeIf { it.substringBefore('|') == day }?.substringAfter('|')?.split(',')?.filter { it.isNotBlank() }.orEmpty()
            st.copy(
                whatNowHidden = day + "|" + (kinds + kind.name).distinct().joinToString(","),
                whatNowSkips = st.whatNowSkips + (kind.name to ((st.whatNowSkips[kind.name] ?: 0) + 1)),
            )
        }
    }

    /** Long-press a Quick door: pin it first in the row, or unpin it (Part 17.2). */
    fun togglePin(key: String) = viewModelScope.launch {
        settingsStore.update { st -> st.copy(pinnedDoors = if (key in st.pinnedDoors) st.pinnedDoors - key else (listOf(key) + st.pinnedDoors).take(4)) }
    }

    /** The learned day-end card: "Yes" starts gentle adjusting; "Keep" asks again in a week. */
    fun acceptDayEnd(t: LocalTime) = viewModelScope.launch {
        val d = clock.today().toString()
        settingsStore.update { it.copy(dayEndMin = t.hour * 60 + t.minute, dayEndMode = DayEndMode.LEARNING.name, dayEndChangedOn = d) }
        dayEndOffer.value = null
    }
    fun keepDayEnd() = viewModelScope.launch {
        val d = clock.today().toString()
        settingsStore.update { it.copy(dayEndAskedOn = d) }
        dayEndOffer.value = null
    }

    private suspend fun learnDayEnd() {
        val s = settingsStore.current()
        val today = clock.today()
        val nights = runCatching { device.nightStarts(7, today, zone) }.getOrDefault(emptyList())
        val current = LocalTime.of((s.dayEndMin / 60) % 24, s.dayEndMin % 60)
        val mode = runCatching { DayEndMode.valueOf(s.dayEndMode) }.getOrDefault(DayEndMode.SET)
        val usageOn = runCatching { device.access().usage }.getOrDefault(false)
        when (val d = DayEndLearner.next(nights, current, mode, s.dayEndChangedOn?.let(LocalDate::parse), today, usageOn)) {
            is DayEndDecision.Apply -> settingsStore.update { it.copy(dayEndMin = d.dayEnd.hour * 60 + d.dayEnd.minute, dayEndChangedOn = today.toString()) }
            is DayEndDecision.Suggest -> {
                val asked = s.dayEndAskedOn?.let(LocalDate::parse)
                if (asked == null || ChronoUnit.DAYS.between(asked, today) >= 7) dayEndOffer.value = d.dayEnd
            }
            DayEndDecision.None -> Unit
        }
    }

    private data class Plan(
        val tasks: List<TaskEntity>,
        val events: List<CalendarEventEntity>,
        val mins: List<MinimumToday>,
        val state: DayStateEntity?,
        val expiring: aiimin.core.database.DocEntity?,
        val yesterdayClosed: Boolean,
    )

    private data class GlanceIn(val spent: Long, val toReview: Int, val journalToday: Boolean, val notes: List<NoteEntity>, val budgetSet: Boolean)

    private data class Ambient(val life: LifeView?, val device: DeviceDayEntity?, val unread: Int, val focus: ActiveFocus?, val activity: List<ActivityLine>)

    init {
        viewModelScope.launch {
            days.ensureToday()
            yesterdayOpen.value = days.yesterdayOpen()
            val today = clock.today()
            val st = settingsStore.current()
            // People upgrading from an earlier build are not new: their first week is behind them.
            if (st.installDay == null) settingsStore.update { it.copy(installDay = (if (st.onboarded && st.xp.xp > 0) today.minusDays(30) else today).toString()) }
            refreshAccess()
            if (lastLearnedDay != today) { lastLearnedDay = today; learnDayEnd() }
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
