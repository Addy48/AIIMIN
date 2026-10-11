package aiimin.core.engine.pulse

/**
 * Background jobs the Pulse heartbeat runs, with how stale each may get while
 * the app is open ([fgMs]) and while it is closed ([bgMs]).
 */
enum class Job(val label: String, val fgMs: Long, val bgMs: Long) {
    /** Screen time, steps, sleep and heart rate: one read of the phone's sensors. */
    DEVICE("Screen time and steps", 60_000, 15 * 60_000),
    /** Day rollover, noon settlement, budget carry, family tick. */
    DAY("Day rollover", 5 * 60_000, 15 * 60_000),
    SYNC("Sync", 30 * 60_000, 30 * 60_000),
    NOTIFY("Reminders", 60_000, 15 * 60_000),
    TRASH("Trash cleanup", 24 * 3_600_000L, 24 * 3_600_000L),
    WIDGET("Home-screen widget", 60_000, 30 * 60_000),
}

/** When each job needs to run again. Pure, so the heartbeat's decisions are testable. */
object Freshness {
    /** Measurements first, then the engines that read them, the widget last. */
    val order = listOf(Job.DEVICE, Job.DAY, Job.SYNC, Job.NOTIFY, Job.TRASH, Job.WIDGET)

    fun due(job: Job, lastOk: Long?, now: Long, foreground: Boolean, forced: Set<Job> = emptySet()): Boolean =
        job in forced || lastOk == null || now - lastOk >= if (foreground) job.fgMs else job.bgMs

    /** Missed two background runs in a row: the phone probably killed the worker. */
    fun unhealthy(job: Job, lastOk: Long?, now: Long): Boolean = lastOk != null && now - lastOk > 2 * job.bgMs

    /** Jobs to run this beat: overdue ones first (self-heal), then the rest in [order]. */
    fun plan(lastOk: Map<Job, Long>, now: Long, foreground: Boolean, forced: Set<Job> = emptySet()): List<Job> {
        val due = order.filter { due(it, lastOk[it], now, foreground, forced) }
        val (sick, fine) = due.partition { unhealthy(it, lastOk[it], now) }
        return sick + fine
    }
}
