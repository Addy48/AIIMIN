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
        snoozes.edit().putLong(key, until).apply()
        NotifyAlarms.arm(context, until)
    }

    fun cancel(key: String) = NotificationManagerCompat.from(context).cancel(key.hashCode())

    /** The category to ask "Stop these?" about (PRD 2.1), from the last 30 days. */
    val stopAsk: kotlinx.coroutines.flow.Flow<Category?> = kotlinx.coroutines.flow.combine(
        dao.logSinceFlow(java.time.LocalDate.now().minusDays(30).toString()), settings.settings,
    ) { log, s -> NudgeBudget.stopAsk(outcomes(log, System.currentTimeMillis()), s.stopAnswered.mapNotNull(::categoryOf).toSet() + s.stoppedCategories.mapNotNull(::categoryOf)) }

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
        val today = clock.today()
        val nowMs = System.currentTimeMillis()
        val now = minuteOf(nowMs)
        val log = dao.logSince(today.minusDays(30).toString())
        val todayLog = log.filter { it.day == today.toString() }
        val opensBy = log.filter { it.openedMinute != null }.groupBy { it.rule }.mapValues { (_, v) -> v.map { it.openedMinute!! } }
        val historyDays = log.minOfOrNull { it.day }?.let { ChronoUnit.DAYS.between(LocalDate.parse(it), today).toInt() } ?: 0
        fun best(rule: String, default: Int, window: IntRange) = NotifyTiming.bestMinute(opensBy[rule].orEmpty(), historyDays, default, window)

        val snap = snapshot(s, today, now, ::best)
        val cands = NotifyRules.candidates(snap)
        val delivered = dao.existingKeys(cands.map { it.key }).toSet()
        val fresh = cands.filter { it.key !in delivered }
        val nudgesToday = todayLog.filter { it.kind == Kind.NUDGE.name && it.delivery == "POST" }
        val ctx = PolicyContext(
            nowMinute = now, quietFrom = s.quiet.fromMin, quietTo = s.quiet.toMin, quietOn = s.quiet.enabled,
            allowed = permitted(), channelsOff = channelsOff(),
            stopped = s.stoppedCategories.mapNotNull(::categoryOf).toSet(),
            nudgesShownToday = nudgesToday.size,
            allowance = NudgeBudget.allowance(log.count { it.kind == Kind.NUDGE.name && it.openedAt != null }, s.notifyCeiling),
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
        val wrapAt = (if (s.quiet.enabled) s.quiet.fromMin - 30 else 21 * 60).coerceIn(18 * 60, 23 * 60)
        val installDays = s.installDay?.let { runCatching { ChronoUnit.DAYS.between(LocalDate.parse(it), today).toInt() }.getOrNull() } ?: 0
        if (s.notifyWrapUp && installDays >= 1) {
            val foldedKeys = (dao.logSince(today.toString()).filter { it.day == today.toString() && it.delivery == "DIGEST" }.map { it.key } +
                cands.filter { it.rule == "money.review" }.map { it.key }).distinct()
            if (now >= wrapAt) {
                val folded = foldedKeys.mapNotNull { dao.byKey(it) }.filter { !it.dismissed }
                val wrap = NotifyRules.wrapUp(today, wrapAt, folded.map { Candidate("folded", it.ruleKey, Kind.INFO, Category.DIGEST, now, 0, it.title, it.body, it.route) }, s.playful)
                if (wrap != null && dao.byKey(wrap.key) == null) {
                    val d = NotifyPolicy.decide(listOf(wrap), ctx).single()
                    dao.insertIfNew(NotificationEntity(newId(), wrap.key, wrap.title, wrap.body, nowMs, wrap.route, null, 0))
                    dao.log(NotifyLogEntity(wrap.key, wrap.rule, wrap.category.name, wrap.kind.name, if (d.delivery == Delivery.POST_NOW) "POST" else "IN_APP", today.toString(), nowMs, now))
                    if (d.delivery == Delivery.POST_NOW) post(wrap, d.silent, s.lockDetails, raahiArt, lines = folded.map { it.title })
                }
            } else if (foldedKeys.isNotEmpty() || cands.any { it.kind == Kind.NUDGE }) wake(wrapAt)
        }

        // Snoozed notices come back on time.
        snoozes.all.forEach { (key, v) ->
            val until = v as? Long ?: return@forEach
            if (until <= nowMs) {
                snoozes.edit().remove(key).apply()
                dao.byKey(key)?.let { row -> cands.firstOrNull { it.key == key }?.let { post(it, false, s.lockDetails, raahiArt) } ?: postRow(row, s.lockDetails, raahiArt) }
            } else nextAlarm = minOf(nextAlarm ?: until, until)
        }
        // One exact alarm for the next due minute (fixes NF1: events no longer wait for the 15-minute worker).
        nextAlarm?.let { NotifyAlarms.arm(context, it) } ?: NotifyAlarms.cancel(context)
    }

    private suspend fun snapshot(s: aiimin.core.data.settings.AppSettings, today: LocalDate, now: Int, best: (String, Int, IntRange) -> Int): NotifySnapshot {
        val dayStart = today.atStartOfDay(clock.zone).toInstant().toEpochMilli()
        val events = calendar.betweenNow(dayStart, dayStart + 24 * 3_600_000L).filter { !it.allDay && it.startAt >= dayStart && it.startAt < dayStart + 24 * 3_600_000L }
            .map { EventSoon(it.id, it.title, minuteOf(it.startAt)) }
        val timed = tasks.forDayNow(today.toString()).filter { !it.done && it.time != null && it.assignee == null }
            .mapNotNull { t -> runCatching { LocalTime.parse(t.time) }.getOrNull()?.let { TaskTimed(t.id, t.title, it.hour * 60 + it.minute) } }
        val bills = ledger.billsNow().filter { it.status == "CONFIRMED" && it.remind && !it.autopay && LocalDate.parse(it.nextDue) == today.plusDays(1) }
            .map { BillTomorrow(it.id, it.title, Money.whole(it.amountPaise)) }
        val docs = vault.withExpiry().map { DocExpiry(it.id, it.title, ChronoUnit.DAYS.between(today, LocalDate.parse(it.expires!!))) }
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
            events = events, timedTasks = timed, bills = bills, docs = docs, docCount = docCount, lastBackupDays = backupDays,
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
        val c = Candidate("announce", key, Kind.PROMISE, if (signedAiimin(key, route)) Category.MONEY else Category.INSIGHTS, minuteOf(nowMs), 1, title, body, route)
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
        val d = NotifyPolicy.decide(listOf(c), PolicyContext(minuteOf(nowMs), s.quiet.fromMin, s.quiet.toMin, s.quiet.enabled, permitted(), channelsOff())).single()
        if (d.delivery == Delivery.POST_NOW) post(c, d.silent, s.lockDetails, aiimin.core.engine.raahi.RaahiMode.of(s.raahiMode) != aiimin.core.engine.raahi.RaahiMode.OFF, notifyId = 7001)
    }

    private fun postRow(n: NotificationEntity, lockDetails: Boolean, raahiArt: Boolean) =
        post(Candidate("repost", n.ruleKey, Kind.PROMISE, if (signedAiimin(n.ruleKey, n.route)) Category.MONEY else Category.REMINDERS, 0, n.priority, n.title, n.body, n.route, n.routeArg, sensitive = signedAiimin(n.ruleKey, n.route)), false, lockDetails, raahiArt)

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
            .setVisibility(if (c.sensitive && !lockDetails) NotificationCompat.VISIBILITY_PRIVATE else NotificationCompat.VISIBILITY_PUBLIC)
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
