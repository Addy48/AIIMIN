package aiimin.core.engine.notify

import java.time.LocalDate

data class EventSoon(val id: String, val title: String, val startMinute: Int)
data class TaskTimed(val id: String, val title: String, val minute: Int)

/** A note the person asked to be reminded about today (Part 11 "Time"). A locked note's title is never shown. */
data class NoteReminder(val id: String, val title: String, val minute: Int, val locked: Boolean)
/** Pour (12.6): a cooling-off message whose 24 hours end, or the daily worry time. Never carries the text. */
data class PourReminder(val id: String, val kind: String, val minute: Int)
data class BillTomorrow(val id: String, val title: String, val amountText: String)
/** [expires] is part of the key, so a renewed document (same id, new date) is reminded again. */
data class DocExpiry(val id: String, val title: String, val daysLeft: Long, val expires: String = "")

/** Everything the rules read, built once per run by the data layer. Plain data, no Android. */
data class NotifySnapshot(
    val today: LocalDate,
    val nowMinute: Int,
    /** Days since install (0 on the first day). */
    val installDays: Int,
    val firstName: String = "",
    val playful: Boolean = false,
    val events: List<EventSoon> = emptyList(),
    val timedTasks: List<TaskTimed> = emptyList(),
    val noteReminders: List<NoteReminder> = emptyList(),
    val pourReminders: List<PourReminder> = emptyList(),
    val bills: List<BillTomorrow> = emptyList(),
    val docs: List<DocExpiry> = emptyList(),
    val docCount: Int = 0,
    /** Days since the last vault backup; null = never. [lastBackupDay] keys the nudge, so each lapse nudges again. */
    val lastBackupDays: Long? = null,
    val lastBackupDay: String = "never",
    val minimumsLeft: List<String> = emptyList(),
    val paused: Boolean = false,
    val lightDay: Boolean = false,
    val pendingPayments: Int = 0,
    /** Personal month plan: share used (0–100+), and the texts for the lines. */
    val budgetShare: Int? = null,
    val budgetLeftText: String = "",
    val budgetSpentText: String = "",
    val budgetPlanText: String = "",
    val budgetDaysLeft: Int = 0,
    val weekLabel: String = "",
    val dayEndMinute: Int = 22 * 60,
    /** Learned or default minutes (NotifyTiming). */
    val minimumsMinute: Int = 20 * 60,
    val weeklyMinute: Int = 18 * 60,
    val briefMinute: Int = 8 * 60,
    val billMinute: Int = 10 * 60,
    val docMinute: Int = 9 * 60,
    val briefOn: Boolean = true,
    val nudgesOn: Boolean = true,
    val billsDocsOn: Boolean = true,
    val minimumsNudgeBody: String = "",
    val timeText: (Int) -> String = { m -> "%d:%02d".format(m / 60, m % 60) },
)

/** Snapshot to candidates (PRD 2.1 promises and nudges; master plan 14.3 triggers). */
object NotifyRules {
    const val LEAD = 10
    /** The morning brief starts on day 3 (master plan 14.3), so day 1 has at most one nudge (2.1). */
    const val BRIEF_FROM_DAY = 2

    fun candidates(s: NotifySnapshot): List<Candidate> = buildList {
        val day = s.today.toEpochDay()
        fun copy(rule: String, vars: Map<String, String> = emptyMap(), useName: Boolean = false) = NotifyCopy.pick(rule, day, vars, s.playful, useName)

        // Promises: what the person set. Never capped; due 10 minutes before.
        s.events.filter { it.startMinute > s.nowMinute }.forEach { e ->
            val c = copy("event.soon", mapOf("event" to e.title, "time" to s.timeText(e.startMinute)))
            add(Candidate("event.soon", "event:${e.id}:${s.today}:${e.startMinute}", Kind.PROMISE, Category.REMINDERS, e.startMinute - LEAD, 2, c.title, c.body, "today", e.id,
                listOf(NotifyAction("snooze", "Snooze 5 min")), why = "It's in your calendar for ${s.timeText(e.startMinute)}."))
        }
        s.timedTasks.forEach { t ->
            if (t.minute > s.nowMinute) {
                val c = copy("task.soon", mapOf("task" to t.title, "time" to s.timeText(t.minute)))
                add(Candidate("task.soon", "task:${t.id}:${s.today}:${t.minute}", Kind.PROMISE, Category.REMINDERS, t.minute - LEAD, 2, c.title, c.body, "today", t.id,
                    listOf(NotifyAction("done", "Done"), NotifyAction("snooze", "Snooze 1 h")), why = "You gave it a time today."))
            } else if (s.nowMinute >= t.minute + 30) {
                val c = copy("task.still", mapOf("task" to t.title))
                add(Candidate("task.still", "still:${t.id}:${s.today}", Kind.INFO, Category.DAY, s.nowMinute, 1, c.title, c.body, "today", t.id, why = "Its time passed half an hour ago."))
            }
        }
        // A note reminder is a promise at its own minute; a locked note says only that there is one.
        s.noteReminders.forEach { n ->
            val c = if (n.locked) copy("note.remind.locked") else copy("note.remind", mapOf("note" to n.title))
            add(Candidate(if (n.locked) "note.remind.locked" else "note.remind", "note:${n.id}:${s.today}:${n.minute}", Kind.PROMISE, Category.REMINDERS, n.minute, 2,
                c.title, c.body, "note", n.id, why = "You asked to be reminded about this note.", sensitive = n.locked))
        }
        // Pour's reminders say only that something is waiting: no words from the space, nothing on the lock screen.
        s.pourReminders.forEach { p ->
            val rule = if (p.kind == "worry") "pour.worry" else "pour.cool"
            val c = copy(rule)
            add(Candidate(rule, if (p.kind == "worry") "pour:worry:${s.today}" else "pour:${p.id}", Kind.PROMISE, Category.REMINDERS, p.minute, 2, c.title, c.body, "pour", p.id,
                why = if (p.kind == "worry") "You set a daily worry time." else "You held a message for 24 hours.", sensitive = true))
        }
        if (s.billsDocsOn) {
            s.bills.forEach { b ->
                val c = copy("money.bill", mapOf("bill" to b.title, "amount" to b.amountText))
                add(Candidate("money.bill", "bill:${b.id}:${s.today.plusDays(1)}", Kind.PROMISE, Category.MONEY, s.billMinute, 2, c.title, c.body, "bills", b.id,
                    listOf(NotifyAction("paid", "Mark paid")), why = "A bill you confirmed is due tomorrow.", sensitive = true))
            }
            // Documents: 30, 7 and 0 days arrive; 90 and 60 days and the week after expiry wait in the inbox.
            s.docs.forEach { d ->
                val step = listOf(0L, 7L, 30L, 60L, 90L).firstOrNull { d.daysLeft <= it } ?: return@forEach
                if (d.daysLeft < -7) return@forEach
                val (rule, vars) = when {
                    d.daysLeft < 0 -> "vault.expired" to mapOf("doc" to d.title, "n" to "${-d.daysLeft}")
                    d.daysLeft == 0L -> "vault.expiry.today" to mapOf("doc" to d.title)
                    else -> "vault.expiry" to mapOf("doc" to d.title, "n" to "${d.daysLeft}")
                }
                val c = copy(rule, vars)
                val kind = if (d.daysLeft >= 0 && step <= 30) Kind.PROMISE else Kind.INFO
                add(Candidate(rule, "doc:${d.id}:${d.expires}:$step", kind, Category.VAULT, s.docMinute, if (step <= 30) 2 else 1, c.title, c.body, "doc", d.id,
                    why = "A document in your vault has an expiry date.", sensitive = true))
            }
        }

        // Nudges: earned, capped and spaced by the policy.
        if (s.nudgesOn) {
            if (s.minimumsLeft.isNotEmpty() && !s.paused) {
                val n = s.minimumsLeft.size
                val c = copy("day.minimums", mapOf("left" to "$n ${if (n == 1) "minimum" else "minimums"}", "nudge" to s.minimumsNudgeBody, "list" to s.minimumsLeft.take(2).joinToString(", ")))
                add(Candidate("day.minimums", "min:${s.today}", Kind.NUDGE, Category.DAY, s.minimumsMinute.coerceAtMost(s.dayEndMinute - 30), 2, c.title, c.body, "today",
                    actions = listOf(NotifyAction("open", "Open")), why = "You set daily minimums and some are open."))
            }
            if (s.lightDay) {
                val c = copy("day.light")
                add(Candidate("day.light", "light:${s.today}", Kind.NUDGE, Category.DAY, 10 * 60, 1, c.title, c.body, "today", why = "Your week has been heavy, so today asks less."))
            }
            if (s.docCount > 0) {
                val step = when { s.lastBackupDays == null -> "never"; s.lastBackupDays >= 30 -> "30"; s.lastBackupDays >= 14 -> "14"; else -> null }
                if (step != null) {
                    val c = if (step == "never") copy("vault.backup.never") else copy("vault.backup", mapOf("days" to "${s.lastBackupDays}"))
                    add(Candidate("vault.backup", "backup:${s.lastBackupDay}:$step", Kind.NUDGE, Category.VAULT, s.docMinute, 1, c.title, c.body, "backup", why = "Your documents have no recent backup."))
                }
            }
            s.budgetShare?.let { share ->
                if (share >= 100) {
                    val c = copy("money.budget100", mapOf("spent" to s.budgetSpentText, "plan" to s.budgetPlanText))
                    add(Candidate("money.budget100", "budget:${s.today.withDayOfMonth(1)}:100", Kind.INFO, Category.MONEY, s.nowMinute, 1, c.title, c.body, "money", why = "Your month plan is used.", sensitive = true))
                } else if (share >= 80) {
                    val c = copy("money.budget80", mapOf("left" to s.budgetLeftText, "days" to "${s.budgetDaysLeft}"))
                    add(Candidate("money.budget80", "budget:${s.today.withDayOfMonth(1)}:80", Kind.NUDGE, Category.MONEY, s.billMinute, 1, c.title, c.body, "money", why = "80% of your month plan is used.", sensitive = true))
                }
            }
            if (s.today.dayOfWeek == java.time.DayOfWeek.SUNDAY) {
                val c = copy("insights.weekly", mapOf("week" to s.weekLabel))
                add(Candidate("insights.weekly", "review:${s.weekLabel}", Kind.NUDGE, Category.INSIGHTS, s.weeklyMinute, 1, c.title, c.body, "score", why = "Sunday: your week is ready to look at."))
            }
        }
        // Payments to review always wait for the evening wrap-up (master plan 14.3).
        if (s.pendingPayments > 0) {
            val c = copy("money.review", mapOf("n" to "${s.pendingPayments} ${if (s.pendingPayments == 1) "payment" else "payments"}"))
            add(Candidate("money.review", "inbox:${s.today}", Kind.INFO, Category.MONEY, s.nowMinute, 0, c.title, c.body, "money", why = "Bank alerts found payments for you to confirm."))
        }
        // The morning brief carries the day; it is a bundle, not a nudge, and starts on day 3.
        if (s.briefOn && s.installDays >= BRIEF_FROM_DAY && s.nowMinute < 12 * 60) {
            val parts = listOfNotNull(
                (s.timedTasks.size + s.events.size).takeIf { it > 0 }?.let { "$it timed ${if (it == 1) "thing" else "things"}" },
                s.minimumsLeft.size.takeIf { it > 0 }?.let { "$it ${if (it == 1) "minimum" else "minimums"}" },
                s.bills.size.takeIf { it > 0 }?.let { "$it ${if (it == 1) "bill" else "bills"} due tomorrow" },
            )
            val summary = if (parts.isEmpty()) "Nothing timed. The day is yours." else parts.joinToString(", ").replaceFirstChar { it.uppercase() } + "."
            val c = copy("day.brief", mapOf("name" to s.firstName, "summary" to summary), useName = true)
            add(Candidate("day.brief", "brief:${s.today}", Kind.PROMISE, Category.DIGEST, s.briefMinute, 1, c.title, c.body, "today", why = "Your morning brief."))
        }
    }

    /** The evening wrap-up: one notice for what was folded today, or null when nothing was (2.1 "Bundling"). */
    fun wrapUp(today: LocalDate, minute: Int, folded: List<Candidate>, playful: Boolean): Candidate? {
        if (folded.isEmpty()) return null
        val c = NotifyCopy.pick("digest.wrapup", today.toEpochDay(), mapOf("n" to "${folded.size} ${if (folded.size == 1) "thing" else "things"}"), playful)
        // Carrying a money or document line makes the whole wrap-up private on the lock screen.
        return Candidate("digest.wrapup", "wrap:$today", Kind.PROMISE, Category.DIGEST, minute, 1, c.title, c.body, "notifications",
            why = "Today's notes that waited, in one place.", sensitive = folded.any { it.sensitive || it.category == Category.MONEY || it.category == Category.VAULT })
    }
}
