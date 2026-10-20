package aiimin.core.data.today

import aiimin.core.data.core.DayClock
import aiimin.core.data.day.DayRepository
import aiimin.core.data.money.BillRepository
import aiimin.core.data.plan.CalendarRepository
import aiimin.core.data.plan.FocusRepository
import aiimin.core.data.plan.MinimumRepository
import aiimin.core.data.plan.TaskRepository
import aiimin.core.data.settings.SettingsStore
import aiimin.core.engine.raahi.RaahiMode
import aiimin.core.engine.today.BillDue
import aiimin.core.engine.today.FocusNow
import aiimin.core.engine.today.NowInput
import aiimin.core.engine.today.NowKind
import aiimin.core.engine.today.OpenTask
import aiimin.core.engine.today.Timed
import aiimin.core.engine.today.WhatNow
import aiimin.core.engine.today.WidgetSnapshot
import aiimin.core.engine.today.WidgetView
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.debounce
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.drop
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.map
import java.time.Instant
import java.time.LocalTime
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Reads today once for the home-screen widget (PRD 1.4) and runs the same "What now?" rules as Today.
 * The widget never claims the week or month line (that belongs to the first open of the app) and never reads
 * the vault, money amounts or notes.
 */
@Singleton
class WidgetSource @Inject constructor(
    private val clock: DayClock,
    private val tasks: TaskRepository,
    private val calendar: CalendarRepository,
    private val minimums: MinimumRepository,
    private val focus: FocusRepository,
    private val days: DayRepository,
    private val bills: BillRepository,
    private val settings: SettingsStore,
) {
    /**
     * Emits when anything the widget shows changes (a minimum ticked, a task done or added, the day closed, a
     * setting); the app refreshes the widget on it, so the home screen follows within about a second.
     */
    @OptIn(kotlinx.coroutines.ExperimentalCoroutinesApi::class, kotlinx.coroutines.FlowPreview::class)
    val changes: kotlinx.coroutines.flow.Flow<Unit> = clock.todayFlow.distinctUntilChanged().flatMapLatest { day ->
        combine(tasks.forDay(day), minimums.today(day), days.observe(day), settings.settings, focus.active) { t, m, d, s, f ->
            listOf(t, m, d?.closedAt, s.widgetTitles, s.raahiMode, s.whatNowHidden, s.wakeMin, s.dayEndMin, f)
        }
    }.distinctUntilChanged().drop(1).debounce(300).map { }

    suspend fun snapshot(clock24: Boolean): WidgetView {
        val s = settings.current()
        val day = clock.today()
        val nowMs = System.currentTimeMillis()
        val time = LocalTime.now(clock.zone).withSecond(0).withNano(0)
        val dayEnd = LocalTime.of((s.dayEndMin / 60) % 24, s.dayEndMin % 60)
        val wake = LocalTime.of((s.wakeMin / 60) % 24, s.wakeMin % 60)
        val mine = tasks.forDay(day).first().filter { it.assignee == null || it.assignee == "me" }
        val events = calendar.forDay(day).first().filter { !it.allDay && it.source != "vault" }
        val mins = minimums.today(day).first().filter { it.planned || it.done }
        val timed = mine.filter { !it.done && it.time != null }.mapNotNull { t ->
            runCatching { LocalTime.parse(t.time) }.getOrNull()?.let { Timed(t.id, t.title, it, null, false) }
        } + events.map { e ->
            val st = Instant.ofEpochMilli(e.startAt).atZone(clock.zone)
            Timed(e.id, e.title, if (st.toLocalDate() < day) LocalTime.MIDNIGHT else st.toLocalTime(), Instant.ofEpochMilli(e.endAt).atZone(clock.zone).toLocalTime(), true)
        }
        val hidden = s.whatNowHidden?.takeIf { it.substringBefore('|') == day.toString() }?.substringAfter('|')
            ?.split(',')?.mapNotNull { k -> runCatching { NowKind.valueOf(k) }.getOrNull() }?.toSet().orEmpty()
        val mode = RaahiMode.of(s.raahiMode)
        val line = WhatNow.pick(
            NowInput(
                date = day, time = time,
                focus = focus.active.first()?.let { f -> FocusNow(f.label, (f.plannedMin - f.elapsedMs(nowMs) / 60_000).toInt().coerceAtLeast(0)) },
                timed = timed,
                bills = bills.comingUp(0).first().filter { it.nextDue == day.toString() }.map { BillDue(it.id, it.title, it.amountPaise) },
                dayEnd = dayEnd,
                wrappedUp = days.observe(day).first()?.closedAt != null,
                landmarkDue = false,
                minimumsLeft = mins.filter { it.planned && !it.done }.map { it.minimum.name },
                tasks = mine.filter { !it.done }.mapIndexed { i, t -> OpenTask(t.id, t.title, t.priority, t.time?.let { runCatching { LocalTime.parse(it) }.getOrNull() }, i.toLong()) },
                hidden = hidden,
                skips = s.whatNowSkips.mapNotNull { (k, v) -> runCatching { NowKind.valueOf(k) to v }.getOrNull() }.toMap(),
                raahiOn = mode != RaahiMode.OFF,
            ),
        )
        return WidgetSnapshot.of(
            line, mins.count { it.done }, mins.size, mins.map { it.done }, s.widgetTitles, mode, time, wake, dayEnd, clock24,
        )
    }
}
