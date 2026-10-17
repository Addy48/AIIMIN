package aiimin.core.data.pulse

import aiimin.core.data.util.Dates
import aiimin.core.database.PulseRunEntity
import aiimin.core.engine.pulse.Freshness
import aiimin.core.engine.pulse.Job

/**
 * One row of "How AIIMIN is running", worded for people, not engineers.
 * [waiting]: nothing to judge yet (never ran, or sync is off while signed out) — shown neutral, not green.
 */
data class RunStatus(val job: Job, val line: String, val healthy: Boolean, val waiting: Boolean = false) {
    companion object {
        fun of(job: Job, run: PulseRunEntity?, now: Long, signedIn: Boolean = true): RunStatus = when {
            job == Job.SYNC && !signedIn -> RunStatus(job, "Off · sign in to sync", healthy = true, waiting = true)
            run == null -> RunStatus(job, "Not run yet", healthy = true, waiting = true)
            run.fails > 0 -> RunStatus(job, "Failed ${if (run.fails == 1) "once" else "${run.fails} times"} · last worked ${run.lastOkAt?.let { Dates.ago(it, now) } ?: "never"}", healthy = false)
            Freshness.unhealthy(job, run.lastOkAt, now) -> RunStatus(job, "Last ran ${Dates.ago(run.lastOkAt!!, now)} · the phone may be stopping AIIMIN in the background", healthy = false)
            else -> RunStatus(job, "Ran ${Dates.ago(run.lastRunAt, now)} · took ${run.lastMs} ms", healthy = true)
        }
    }
}
