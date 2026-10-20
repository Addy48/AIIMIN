package aiimin.core.engine.notify

data class Copy(val title: String, val body: String)

/**
 * The fixed wording (PRD 2.1 voice, 13.2): Raahi's plain-but-warm by default; the Playful switch adds light wit
 * on low-stakes nudges only. Money, documents, security and reminders always use their one plain line.
 */
object NotifyCopy {
    /** Words that never appear (13.2, 2.1 done-when); [NotifyCopyTest] checks every line. */
    val banned = listOf("missed", "streak", "overdue", "late", "behind", "failed", "forgot", "hurry", "last chance", "you'll lose", "don't lose", "we miss you")

    /** Rules whose first variant is the plain one; later variants are Playful. */
    val catalogue: Map<String, List<Copy>> = mapOf(
        "task.soon" to listOf(Copy("{task} in 10 minutes", "At {time}.")),
        "event.soon" to listOf(Copy("{event} in 10 minutes", "Starts at {time}.")),
        "task.still" to listOf(Copy("Still on for today?", "{task}. Move it, or do it now.")),
        "money.bill" to listOf(Copy("{bill} {amount} is due tomorrow", "Mark it paid once it's done.")),
        "money.review" to listOf(Copy("{n} to review", "Detected from your bank alerts. Nothing is booked until you settle it.")),
        "money.budget80" to listOf(Copy("80% of the month plan used", "{left} left for {days} days.")),
        "money.budget100" to listOf(Copy("Month plan reached", "{spent} of {plan} spent.")),
        "vault.expiry" to listOf(Copy("{doc} expires in {n} days", "Renewals take time. Today is a good day to start.")),
        "vault.expiry.today" to listOf(Copy("{doc} expires today", "Renew it, then add the new copy.")),
        "vault.expired" to listOf(Copy("{doc} expired {n} days ago", "Renew it, then add the new copy.")),
        "vault.backup" to listOf(Copy("Back up your vault", "Last backup {days} days ago. Keep a copy somewhere you trust.")),
        "vault.backup.never" to listOf(Copy("Back up your vault", "Your documents live only on this phone. Keep a backup somewhere you trust.")),
        "day.minimums" to listOf(
            Copy("{left} left today", "{nudge}"),
            Copy("Still time for the small stuff", "{list}. Tiny versions count."),
            Copy("A few small things left", "{list}. Five minutes each, or less."),
        ),
        "day.light" to listOf(
            Copy("A lighter day", "Today your minimums are the tiny versions, and each counts double."),
            Copy("Go easy today", "Tiny versions count double. That's the whole plan."),
        ),
        "insights.weekly" to listOf(
            Copy("Your week, in one screen", "Five minutes to close the week and set up the next."),
            Copy("Week {week}, folded into one screen", "Five minutes. Then the next one is yours."),
        ),
        "day.brief" to listOf(
            Copy("Good morning, {name}", "{summary}"),
            Copy("Today in one breath", "{summary}"),
        ),
        "digest.wrapup" to listOf(Copy("Today, wrapped up", "{n} to look at when you have a minute.")),
        "focus.done" to listOf(
            Copy("{min} minutes done", "{label}. Finish the session to keep the minutes."),
            Copy("Time. Nice work on {label}", "Finish, or add 5 minutes."),
        ),
    )

    /** Plain rules: money, documents, security, reminders. One sober line, never playful. */
    val plainRules = setOf("task.soon", "event.soon", "task.still", "money.bill", "money.review", "money.budget80", "money.budget100", "vault.expiry", "vault.expiry.today", "vault.expired", "vault.backup", "vault.backup.never", "digest.wrapup")

    /** The line for a rule: plain unless [playful], then rotated by day so the words change from day to day. */
    fun pick(rule: String, dayIndex: Long, vars: Map<String, String>, playful: Boolean, useName: Boolean = true): Copy {
        val list = catalogue.getValue(rule)
        val v = if (!playful || rule in plainRules || list.size == 1) list.first() else list[Math.floorMod(dayIndex + rule.hashCode(), list.size.toLong()).toInt()]
        fun fill(s: String): String {
            var out = if (useName && !vars["name"].isNullOrBlank()) s else s.replace(", {name}", "").replace("{name}", "")
            vars.forEach { (k, value) -> out = out.replace("{$k}", value) }
            return out.trim()
        }
        return Copy(fill(v.title), fill(v.body))
    }
}
