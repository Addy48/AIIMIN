package aiimin.core.data.notify

import aiimin.core.data.R
import aiimin.core.data.core.DayClock
import aiimin.core.data.life.LifeRepository
import aiimin.core.data.settings.SettingsStore
import aiimin.core.data.util.Money
import aiimin.core.data.util.newId
import aiimin.core.database.CalendarDao
import aiimin.core.database.MoneyDao
import aiimin.core.database.NotificationDao
import aiimin.core.database.NotificationEntity
import aiimin.core.database.TaskDao
import aiimin.core.database.VaultDao
import aiimin.core.engine.BatteryState
import aiimin.core.engine.notify.BillTomorrow
import aiimin.core.engine.notify.Candidate
import aiimin.core.engine.notify.Category
import aiimin.core.engine.notify.Delivery
import aiimin.core.engine.notify.DocExpiry
import aiimin.core.engine.notify.EventSoon
import aiimin.core.engine.notify.Kind
import aiimin.core.engine.notify.NotifyCopy
import aiimin.core.engine.notify.NotifyPolicy
import aiimin.core.engine.notify.NotifyRules
import aiimin.core.engine.notify.NotifySnapshot
import aiimin.core.engine.notify.NotifyTiming
import aiimin.core.engine.notify.NudgeBudget
import aiimin.core.engine.notify.NudgeOutcome
import aiimin.core.engine.notify.PolicyContext
import aiimin.core.engine.notify.TaskTimed
import aiimin.core.database.NotifyLogEntity
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.sync.withLock
import android.Manifest
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import dagger.hilt.android.qualifiers.ApplicationContext
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.LocalTime
import java.time.YearMonth
import java.time.temporal.ChronoUnit
import java.time.temporal.IsoFields
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Notification engine v2 (PRD 2.1): the data side. One run builds a snapshot from the phone's own data, the pure
 * engine ([NotifyRules], [NotifyPolicy]) decides, and this class delivers: inbox rows for everything, system
 * notifications for what may pop up, an exact alarm for the next due minute, and one evening wrap-up for what
 * waited. Nothing leaves the phone.
 */
@Singleton
class NotificationRepository @Inject constructor(
    @ApplicationContext private val context: Context,
    private val dao: NotificationDao,
    private val vault: VaultDao,
    private val tasks: TaskDao,
    private val calendar: CalendarDao,
    private val money: MoneyDao,
    private val ledger: aiimin.core.database.LedgerDao,
    private val life: LifeRepository,
    private val minimums: aiimin.core.data.plan.MinimumRepository,
    private val settings: SettingsStore,
    private val clock: DayClock,
    private val notes: aiimin.core.database.NoteDao,
    private val pour: aiimin.core.database.PourDao,
) {
    val all = dao.all()
    val unread = dao.unread()
    suspend fun markAllRead() = dao.markAllRead()
    suspend fun dismiss(id: String) = dao.dismiss(id)

    private val snoozes = context.getSharedPreferences("notify_snooze", Context.MODE_PRIVATE)
    private val mutex = kotlinx.coroutines.sync.Mutex()

    private fun minuteOf(ms: Long): Int = java.time.Instant.ofEpochMilli(ms).atZone(clock.zone).toLocalTime().let { it.hour * 60 + it.minute }

    /** Opened from a notification: the only input the learned timing and the budget read. */
    suspend fun opened(key: String) {
        val now = System.currentTimeMillis()
        dao.opened(key, now, minuteOf(now))
    }

    /** Swiped away in the shade. */
    suspend fun dismissedInShade(key: String) = dao.dismissedLog(key, System.currentTimeMillis())

    /** Snooze: the notice comes back after [minutes]. */
    suspend fun snooze(key: String, minutes: Int) {
        NotificationManagerCompat.from(context).cancel(key.hashCode())
        val until = System.currentTimeMillis() + minutes * 60_000L
        snoozes.edit().putLong(key, until).commit()
        // A run arms the earliest of everything, so the snooze never replaces a nearer reminder.
        run()
    }

    fun cancel(key: String) = NotificationManagerCompat.from(context).cancel(key.hashCode())

    /** The category to ask "Stop these?" about (PRD 2.1), from the last 30 days. */
    val stopAsk: kotlinx.coroutines.flow.Flow<Category?> = kotlinx.coroutines.flow.combine(
        dao.logSinceFlow("0000"), settings.settings, clock.tick,
    ) { all, s, _ -> val log = all.filter { it.day >= LocalDate.now().minusDays(30).toString() }; NudgeBudget.stopAsk(outcomes(log, System.currentTimeMillis()), s.stopAnswered.mapNotNull(::categoryOf).toSet() + s.stoppedCategories.mapNotNull(::categoryOf)) }

    suspend fun answerStop(c: Category, stop: Boolean) = settings.update {
        it.copy(
            stopAnswered = it.stopAnswered + c.name,
            stoppedCategories = if (stop) it.stoppedCategories + c.name else it.stoppedCategories,
        )
    }

    /** On-phone counters per category for the tester build (2.1 "Measure for ourselves"). */
    data class Counter(val category: Category, val sent: Int, val opened: Int, val dismissed: Int, val inbox: Int, val channelOff: Boolean)

    fun counters(days: Long = 30): kotlinx.coroutines.flow.Flow<List<Counter>> = dao.logSinceFlow(java.time.LocalDate.now().minusDays(days).toString()).map { log ->
        val off = channelsOff()
        Category.entries.map { c ->
            val l = log.filter { it.category == c.name }
            Counter(c, l.count { it.delivery == "POST" }, l.count { it.openedAt != null }, l.count { it.dismissedAt != null }, l.count { it.delivery != "POST" }, c in off)
        }
    }

    /** Channels switched off in Android, or all of them when the app's notifications are off. */
    fun channelsOff(): Set<Category> {
        val nm = NotificationManagerCompat.from(context)
        if (!nm.areNotificationsEnabled()) return Category.entries.toSet()
        if (Build.VERSION.SDK_INT < 26) return emptySet()
        val sys = context.getSystemService(NotificationManager::class.java)
        return Category.entries.filter { sys.getNotificationChannel(it.channelId)?.importance == NotificationManager.IMPORTANCE_NONE }.toSet()
    }

    private fun permitted(): Boolean = Build.VERSION.SDK_INT < 33 ||
        ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED

    suspend fun run() = mutex.withLock { runLocked() }

    private suspend fun runLocked() {
        // Older rows kept the old wording (streaks, "Rough patch"); reworded once (PRD 13.2, C-001).
        if (!settings.current().notificationsReworded) {
            dao.reword("battery:", "A lighter day", "Today your minimums are the tiny versions, and each counts double.")
            dao.rewordBody("streak:", "The tiny versions count. Keep what you can.")
            settings.update { it.copy(notificationsReworded = true) }
        }
        ensureChannels(context)
        collapseRepeats()
        val s = settings.current()
        // Times are wall-clock: the calendar date, even when a late day end keeps the logical day on yesterday.
        val today = LocalDate.now(clock.zone)
        val logicalDay = clock.today()
        val nowMs = System.currentTimeMillis()
        val now = minuteOf(nowMs)
        val log = dao.logSince(today.minusDays(30).toString())
        val todayLog = log.filter { it.day == today.toString() }
        val opensBy = log.filter { it.openedMinute != null }.groupBy { it.rule }.mapValues { (_, v) -> v.map { it.openedMinute!! } }
        val historyDays = log.minOfOrNull { it.day }?.let { ChronoUnit.DAYS.between(LocalDate.parse(it), today).toInt() } ?: 0
        fun best(rule: String, default: Int, window: IntRange) = NotifyTiming.bestMinute(opensBy[rule].orEmpty(), historyDays, default, window)

        val snap = runCatching { snapshot(s, today, logicalDay, now, ::best) }.getOrElse { NotifySnapshot(today, now, 0, briefOn = false, nudgesOn = false) }
        val cands = NotifyRules.candidates(snap)
        val delivered = dao.existingKeys(cands.map { it.key }).toSet()
        val fresh = cands.filter { it.key !in delivered }
        val nudgesToday = todayLog.filter { it.kind == Kind.NUDGE.name && it.delivery == "POST" }
        val ctx = PolicyContext(
            nowMinute = now, quietFrom = s.quiet.fromMin, quietTo = s.quiet.toMin, quietOn = s.quiet.enabled,
            allowed = permitted(), channelsOff = channelsOff(),
            stopped = s.stoppedCategories.mapNotNull(::categoryOf).toSet(),
            nudgesShownToday = nudgesToday.size,
            allowance = NudgeBudget.allowance(dao.openedNudges(), s.notifyCeiling),
            lastNudgeMinute = nudgesToday.maxOfOrNull { it.shownMinute },
        )
        val decisions = NotifyPolicy.decide(fresh, ctx)
        val raahiArt = aiimin.core.engine.raahi.RaahiMode.of(s.raahiMode) != aiimin.core.engine.raahi.RaahiMode.OFF
        var nextAlarm: Long? = null
        fun wake(atMinute: Int) {
            val ms = today.atStartOfDay(clock.zone).plusMinutes(atMinute.toLong()).toInstant().toEpochMilli()
            if (ms > nowMs) nextAlarm = minOf(nextAlarm ?: ms, ms)
        }
        for (d in decisions) {
            val c = d.candidate
            when (d.delivery) {
                Delivery.SCHEDULE -> wake(d.atMinute)
                else -> {
                    val row = NotificationEntity(newId(), c.key, c.title, c.body, nowMs, c.route, c.routeArg, c.priority)
                    if (dao.insertIfNew(row) == -1L) continue
                    val how = when (d.delivery) { Delivery.POST_NOW -> "POST"; Delivery.DIGEST -> "DIGEST"; else -> "IN_APP" }
                    dao.log(NotifyLogEntity(c.key, c.rule, c.category.name, c.kind.name, how, today.toString(), nowMs, now))
                    if (d.delivery == Delivery.POST_NOW) post(c, d.silent, s.lockDetails, raahiArt)
                }
            }
        }

        // The evening wrap-up: what waited today, in one notice (2.1 "Bundling"), from day 2.
        val wrapAt = if (s.quiet.enabled && s.quiet.fromMin >= 18 * 60 + 30) s.quiet.fromMin - 30 else if (s.quiet.enabled && s.quiet.fromMin < 18 * 60 + 30) 23 * 60 else 21 * 60 + 30
        val installDays = s.installDay?.let { runCatching { ChronoUnit.DAYS.between(LocalDate.parse(it), today).toInt() }.getOrNull() } ?: 0
        if (s.notifyWrapUp && installDays >= 1) {
            val foldedKeys = (dao.logSince(today.toString()).filter { it.day == today.toString() && it.delivery == "DIGEST" }.map { it.key } +
                cands.filter { it.rule == "money.review" }.map { it.key }).distinct()
            if (now >= wrapAt) {
                val folded = foldedKeys.mapNotNull { dao.byKey(it) }.filter { !it.dismissed }
                val wrap = NotifyRules.wrapUp(today, wrapAt, folded.map { Candidate("folded", it.ruleKey, Kind.INFO, if (signedAiimin(it.ruleKey, it.route)) Category.MONEY else Category.DIGEST, now, 0, it.title, it.body, it.route, sensitive = signedAiimin(it.ruleKey, it.route)) }, s.playful)
                if (wrap != null && dao.byKey(wrap.key) == null) {
                    val d = NotifyPolicy.decide(listOf(wrap), ctx).single()
                    dao.insertIfNew(NotificationEntity(newId(), wrap.key, wrap.title, wrap.body, nowMs, wrap.route, null, 0))
                    dao.log(NotifyLogEntity(wrap.key, wrap.rule, wrap.category.name, wrap.kind.name, if (d.delivery == Delivery.POST_NOW) "POST" else "IN_APP", today.toString(), nowMs, now))
                    if (d.delivery == Delivery.POST_NOW) post(wrap, d.silent, s.lockDetails, raahiArt && !wrap.sensitive, lines = folded.map { it.title })
                }
            } else if (foldedKeys.isNotEmpty() || cands.any { it.kind == Kind.NUDGE }) wake(wrapAt)
        }

        // Snoozed notices come back on time.
        snoozes.all.forEach { (key, v) ->
            val until = v as? Long ?: return@forEach
            if (until <= nowMs) {
                snoozes.edit().remove(key).apply()
                val row = dao.byKey(key)
                val taskOpen = key.startsWith("task:") && tasks.get(key.split(':')[1])?.done == false
                val c = cands.firstOrNull { it.key == key }
                    ?: row?.takeIf { taskOpen }?.let { Candidate("task.soon", it.ruleKey, Kind.PROMISE, Category.REMINDERS, now, it.priority, it.title, it.body, it.route, it.routeArg, listOf(aiimin.core.engine.notify.NotifyAction("done", "Done"), aiimin.core.engine.notify.NotifyAction("snooze", "Snooze 1 h"))) }
                if (row != null && !row.dismissed && c != null) {
                    val d = NotifyPolicy.decide(listOf(c.copy(atMinute = now)), ctx).single()
                    if (d.delivery == Delivery.POST_NOW) post(c, d.silent, s.lockDetails, raahiArt)
                }
            } else nextAlarm = minOf(nextAlarm ?: until, until)
        }
        // One exact alarm for the next due minute (fixes NF1: events no longer wait for the 15-minute worker).
        // With nothing left today, wake a minute after midnight so tomorrow's early reminders are armed in time.
        val midnight = today.plusDays(1).atStartOfDay(clock.zone).plusMinutes(1).toInstant().toEpochMilli()
        NotifyAlarms.arm(context, nextAlarm ?: midnight)
    }

    private suspend fun snapshot(s: aiimin.core.data.settings.AppSettings, today: LocalDate, logicalDay: LocalDate, now: Int, best: (String, Int, IntRange) -> Int): NotifySnapshot {
        val dayStart = today.atStartOfDay(clock.zone).toInstant().toEpochMilli()
        val events = calendar.betweenNow(dayStart, dayStart + 24 * 3_600_000L).filter { !it.allDay && it.startAt >= dayStart && it.startAt < dayStart + 24 * 3_600_000L }
            .map { EventSoon(it.id, it.title, minuteOf(it.startAt)) }
        val dayTasks = (tasks.forDayNow(today.toString()) + if (logicalDay != today) tasks.forDayNow(logicalDay.toString()) else emptyList()).distinctBy { it.id }
        val timed = dayTasks.filter { !it.done && it.time != null && it.assignee == null }
            .mapNotNull { t -> runCatching { LocalTime.parse(t.time) }.getOrNull()?.let { TaskTimed(t.id, t.title, it.hour * 60 + it.minute) } }
        // Note reminders set for today; a locked note's title stays out of the notice.
        val noteReminders = notes.withReminders().mapNotNull { n ->
            val at = java.time.Instant.ofEpochMilli(n.reminderAt!!).atZone(clock.zone)
            if (at.toLocalDate() != today) null else aiimin.core.engine.notify.NoteReminder(n.id, n.title.ifBlank { "Note" }, at.hour * 60 + at.minute, n.locked)
        }
        // Pour: a held message whose day is up (today), and the daily worry time if one is set.
        // A held message past its 24 hours is offered until it is kept or let go (its key has no date, so it asks once);
        // worry time only reminds when something is in the box.
        val nowMs = System.currentTimeMillis()
        val pourReminders = pour.coolingNow().mapNotNull { e ->
            val at = java.time.Instant.ofEpochMilli(e.dueAt!!).atZone(clock.zone)
            when {
                e.dueAt!! > nowMs && at.toLocalDate() != today -> null
                at.toLocalDate() == today -> aiimin.core.engine.notify.PourReminder(e.id, "cool", at.hour * 60 + at.minute)
                else -> aiimin.core.engine.notify.PourReminder(e.id, "cool", now)
            }
        } + listOfNotNull(s.worryMin?.takeIf { pour.worryCount() > 0 }?.let { aiimin.core.engine.notify.PourReminder("worry", "worry", it) })
        val bills = ledger.billsNow().filter { it.status == "CONFIRMED" && it.remind && !it.autopay && runCatching { LocalDate.parse(it.nextDue) }.getOrNull() == today.plusDays(1) }
            .map { BillTomorrow(it.id, it.title, Money.whole(it.amountPaise)) }
        val docs = vault.withExpiry().mapNotNull { d -> runCatching { LocalDate.parse(d.expires!!) }.getOrNull()?.let { DocExpiry(d.id, d.title, ChronoUnit.DAYS.between(today, it), d.expires!!) } }
        val docCount = vault.allNow().count { !it.deleted }
        val last = context.getSharedPreferences(aiimin.core.data.vault.VaultBackupRepository.PREFS, Context.MODE_PRIVATE).getLong("last_at", 0L)
        val backupDays = if (last == 0L) null else ChronoUnit.DAYS.between(java.time.Instant.ofEpochMilli(last).atZone(clock.zone).toLocalDate(), today)
        val view = runCatching { life.compute() }.getOrNull()
        val left = runCatching { minimums.today(today).first() }.getOrDefault(emptyList()).filter { it.planned && !it.done }.map { it.minimum.name }
        val ym = YearMonth.from(today)
        val budget = money.budgetNow(ym.toString())
        val spent = if (budget == null) 0L else money.betweenNow(ym.atDay(1).toString(), today.toString()).filter { it.ledger == "PERSONAL" && it.direction == "out" }.sumOf { it.amountPaise }
        val dayEnd = s.dayEndMin
        val install = s.installDay?.let { runCatching { LocalDate.parse(it) }.getOrNull() } ?: today
        return NotifySnapshot(
            today = today, nowMinute = now, installDays = ChronoUnit.DAYS.between(install, today).toInt(),
            firstName = s.name.trim().split(" ").firstOrNull().orEmpty(), playful = s.playful,
            events = events, timedTasks = timed, noteReminders = noteReminders, pourReminders = pourReminders, bills = bills, docs = docs, docCount = docCount, lastBackupDays = backupDays,
            lastBackupDay = if (last == 0L) "never" else java.time.Instant.ofEpochMilli(last).atZone(clock.zone).toLocalDate().toString(),
            minimumsLeft = if (view?.today?.paused == true) emptyList() else left,
            paused = view?.today?.paused == true,
            lightDay = view?.battery?.state == BatteryState.LOW,
            pendingPayments = money.pendingDraftsNow().size,
            budgetShare = budget?.takeIf { it.totalPaise > 0 }?.let { (spent * 100 / it.totalPaise).toInt() },
            budgetLeftText = budget?.let { Money.format((it.totalPaise - spent).coerceAtLeast(0)) }.orEmpty(),
            budgetSpentText = Money.format(spent), budgetPlanText = budget?.let { Money.format(it.totalPaise) }.orEmpty(),
            budgetDaysLeft = ym.lengthOfMonth() - today.dayOfMonth + 1,
            weekLabel = "%d-W%02d".format(java.util.Locale.ROOT, today.get(IsoFields.WEEK_BASED_YEAR), today.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR)),
            dayEndMinute = if (dayEnd < 4 * 60) dayEnd + 24 * 60 else dayEnd,
            minimumsMinute = best("day.minimums", 20 * 60, (17 * 60)..(22 * 60)),
            weeklyMinute = best("insights.weekly", 18 * 60, (16 * 60)..(21 * 60)),
            briefMinute = best("day.brief", 8 * 60, (6 * 60)..(11 * 60)),
            billMinute = best("money.bill", 10 * 60, (8 * 60)..(20 * 60)),
            docMinute = 9 * 60,
            briefOn = s.notifyBrief, nudgesOn = s.notifyNudges, billsDocsOn = s.notifyBillsDocs,
            minimumsNudgeBody = minimumsNudgeBody(left.size),
            timeText = { m -> aiimin.core.data.util.Dates.clock(LocalTime.of((m / 60) % 24, m % 60)) },
        )
    }

    /**
     * Rules keyed by day ("inbox:2026-10-17", "task:<id>:2026-10-17") fire again each day; only the
     * newest of each family stays in the list, so yesterday's "6 payments to review" never piles up.
     */
    private suspend fun collapseRepeats() {
        val stale = dao.openNow().groupBy { family(it.ruleKey) }.values.flatMap { g -> g.sortedByDescending { it.at }.drop(1) }
        if (stale.isNotEmpty()) dao.dismissAll(stale.map { it.id })
    }

    /** A one-off notice from a finished job (a whole-year SMS import). Opens [route] when tapped. */
    suspend fun announce(key: String, title: String, body: String, route: String) {
        val nowMs = System.currentTimeMillis()
        if (dao.insertIfNew(NotificationEntity(newId(), key, title, body, nowMs, route, null, 1)) == -1L) return
        val s = settings.current()
        val c = Candidate("announce", key, Kind.PROMISE, if (signedAiimin(key, route)) Category.MONEY else Category.INSIGHTS, minuteOf(nowMs), 1, title, body, route, sensitive = signedAiimin(key, route))
        val d = NotifyPolicy.decide(listOf(c), PolicyContext(minuteOf(nowMs), s.quiet.fromMin, s.quiet.toMin, s.quiet.enabled, permitted(), channelsOff())).single()
        dao.log(NotifyLogEntity(key, c.rule, c.category.name, c.kind.name, if (d.delivery == Delivery.POST_NOW) "POST" else "IN_APP", clock.today().toString(), nowMs, minuteOf(nowMs)))
        if (d.delivery == Delivery.POST_NOW) post(c, d.silent, s.lockDetails, aiimin.core.engine.raahi.RaahiMode.of(s.raahiMode) != aiimin.core.engine.raahi.RaahiMode.OFF)
    }

    /** "Focus done" at the planned end (a promise the person set by starting the session). */
    suspend fun focusDone(label: String, minutes: Int) {
        val s = settings.current()
        val nowMs = System.currentTimeMillis()
        val copy = NotifyCopy.pick("focus.done", clock.today().toEpochDay(), mapOf("min" to "$minutes", "label" to label), s.playful)
        val c = Candidate("focus.done", "focus:$nowMs", Kind.PROMISE, Category.FOCUS, minuteOf(nowMs), 2, copy.title, copy.body, "focus")
        // Like every notice, it is also an inbox row, so a muted channel loses nothing.
        dao.insertIfNew(NotificationEntity(newId(), c.key, c.title, c.body, nowMs, c.route, null, c.priority))
        val d = NotifyPolicy.decide(listOf(c), PolicyContext(minuteOf(nowMs), s.quiet.fromMin, s.quiet.toMin, s.quiet.enabled, permitted(), channelsOff())).single()
        dao.log(NotifyLogEntity(c.key, c.rule, c.category.name, c.kind.name, if (d.delivery == Delivery.POST_NOW) "POST" else "IN_APP", clock.today().toString(), nowMs, minuteOf(nowMs)))
        if (d.delivery == Delivery.POST_NOW) post(c, d.silent, s.lockDetails, aiimin.core.engine.raahi.RaahiMode.of(s.raahiMode) != aiimin.core.engine.raahi.RaahiMode.OFF, notifyId = 7001)
    }

    private fun post(c: Candidate, silent: Boolean, lockDetails: Boolean, raahiArt: Boolean, lines: List<String> = emptyList(), notifyId: Int = c.key.hashCode()) {
        if (!permitted()) return
        val launch = context.packageManager.getLaunchIntentForPackage(context.packageName)?.apply {
            putExtra(EXTRA_ROUTE, c.route)
            putExtra(EXTRA_ARG, c.routeArg)
            putExtra(EXTRA_KEY, c.key)
            addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP)
        }
        val pi = launch?.let { PendingIntent.getActivity(context, c.key.hashCode(), it, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT) }
        val aiimin = signedAiimin(c.key, c.route) || c.category in setOf(Category.MONEY, Category.VAULT, Category.SECURITY)
        val b = NotificationCompat.Builder(context, c.category.channelId)
            // PRD 1.1 and 20.4: money, document and security notices are signed AIIMIN (its mark, no character);
            // the rest speak as Raahi, with its face as the large icon unless Raahi is Off.
            .setSmallIcon(if (aiimin) R.drawable.ic_stat_aiimin else R.drawable.ic_stat_raahi)
            .apply { if (raahiArt && !aiimin) setLargeIcon(android.graphics.BitmapFactory.decodeResource(context.resources, R.drawable.raahi_notif_large)) }
            .setContentTitle(c.title)
            .setContentText(c.body)
            .setStyle(
                if (lines.isNotEmpty()) NotificationCompat.InboxStyle().also { st -> lines.take(5).forEach { st.addLine(it) }; if (lines.size > 5) st.setSummaryText("+${lines.size - 5} more") }
                else NotificationCompat.BigTextStyle().bigText(c.body),
            )
            .setContentIntent(pi)
            .setDeleteIntent(NotifyAlarms.actionIntent(context, c.key, "dismissed", c.routeArg))
            .setAutoCancel(true)
            .setSilent(silent)
            .setCategory(if (c.kind == Kind.PROMISE && c.category == Category.REMINDERS) NotificationCompat.CATEGORY_REMINDER else NotificationCompat.CATEGORY_RECOMMENDATION)
            .setPriority(if (c.priority >= 2) NotificationCompat.PRIORITY_HIGH else NotificationCompat.PRIORITY_DEFAULT)
            // Lock screen: private by default for money and documents; no amounts or names (2.1).
            // Everything else keeps Android's default, so the person's own "hide sensitive content" still applies.
            .apply { if (c.sensitive && !lockDetails) setVisibility(NotificationCompat.VISIBILITY_PRIVATE) }
        if (c.sensitive && !lockDetails) {
            b.setPublicVersion(
                NotificationCompat.Builder(context, c.category.channelId).setSmallIcon(R.drawable.ic_stat_aiimin)
                    .setContentTitle("AIIMIN").setContentText(if (c.category == Category.MONEY) "1 money reminder" else "1 document reminder").build(),
            )
        }
        c.actions.take(2).forEach { a -> b.addAction(0, a.label, NotifyAlarms.actionIntent(context, c.key, a.id, c.routeArg)) }
        runCatching { NotificationManagerCompat.from(context).notify(notifyId, b.build()) }
    }

    companion object {
        const val EXTRA_ROUTE = "aiimin.route"
        const val EXTRA_ARG = "aiimin.arg"
        const val EXTRA_KEY = "aiimin.notify.key"

        /** The eight channels (master plan 14.2); the two old ones are removed. */
        fun ensureChannels(context: Context) {
            val nm = context.getSystemService(NotificationManager::class.java)
            listOf("aiimin_important", "aiimin_general").forEach { runCatching { nm.deleteNotificationChannel(it) } }
            val importance = mapOf(
                Category.REMINDERS to NotificationManager.IMPORTANCE_HIGH, Category.DAY to NotificationManager.IMPORTANCE_DEFAULT,
                Category.MONEY to NotificationManager.IMPORTANCE_DEFAULT, Category.VAULT to NotificationManager.IMPORTANCE_HIGH,
                Category.INSIGHTS to NotificationManager.IMPORTANCE_LOW, Category.SECURITY to NotificationManager.IMPORTANCE_HIGH,
                Category.FOCUS to NotificationManager.IMPORTANCE_LOW, Category.DIGEST to NotificationManager.IMPORTANCE_LOW,
            )
            val about = mapOf(
                Category.REMINDERS to "Tasks and events you gave a time, and focus done",
                Category.DAY to "Minimums and a lighter day",
                Category.MONEY to "Bills due, the month plan, payments to review",
                Category.VAULT to "Document expiry and vault backup",
                Category.INSIGHTS to "Your week, firsts",
                Category.SECURITY to "Account and security",
                Category.FOCUS to "The running focus session",
                Category.DIGEST to "The morning brief and the evening wrap-up",
            )
            Category.entries.forEach { c ->
                nm.createNotificationChannel(NotificationChannel(c.channelId, c.label, importance.getValue(c)).apply { description = about.getValue(c) })
            }
        }
    }
}

internal fun categoryOf(name: String): Category? = runCatching { Category.valueOf(name) }.getOrNull()

/** Shown nudges as outcomes: opened, or left (dismissed, or 12 hours without an open). Pending ones don't count. */
internal fun outcomes(log: List<NotifyLogEntity>, nowMs: Long): List<NudgeOutcome> =
    log.filter { it.kind == Kind.NUDGE.name && it.delivery == "POST" }
        .filter { it.openedAt != null || it.dismissedAt != null || nowMs - it.shownAt > 12 * 3_600_000L }
        .map { NudgeOutcome(categoryOf(it.category) ?: Category.DAY, LocalDate.parse(it.day).toEpochDay().toInt(), it.openedAt != null) }

/**
 * "inbox:2026-10-17" → "inbox:", "task:abc:2026-10-17" → "task:abc:", "review:2026-W42" → "review:" (and the
 * old "review:42" week keys, D-045); keys without a date or week are their own family.
 */
/** Notices about money, documents and backups are signed AIIMIN, never Raahi (PRD 1.1, 20.5). */
fun signedAiimin(ruleKey: String, route: String? = null): Boolean =
    route in setOf("money", "bills", "vault", "doc", "backup") || ruleKey.substringBefore(':') in setOf("doc", "backup", "bill", "budget", "inbox", "smsyear")

internal fun family(ruleKey: String): String {
    val last = ruleKey.substringAfterLast(':', "")
    val periodic = Regex("\\d{4}-\\d{2}-\\d{2}|\\d{4}-W\\d{2}").matches(last) || (ruleKey.startsWith("review:") && last.all { it.isDigit() } && last.isNotEmpty())
    return if (periodic) ruleKey.substringBeforeLast(':') + ":" else ruleKey
}

/** The evening minimums reminder's second line (PRD 13.2: no streaks, no guilt; C-001). */
fun minimumsNudgeBody(left: Int): String =
    if (left == 1) "Keep it if you can. The tiny version counts." else "Keep them if you can. The tiny versions count."
