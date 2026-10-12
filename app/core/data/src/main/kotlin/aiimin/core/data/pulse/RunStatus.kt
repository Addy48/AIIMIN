package aiimin.core.data.pulse

import aiimin.core.data.util.Dates
import aiimin.core.database.PulseRunEntity
import aiimin.core.engine.pulse.Freshness
import aiimin.core.engine.pulse.Job

/** One row of "How AIIMIN is running", worded for people, not engineers. */
data class RunStatus(val job: Job, val line: String, val healthy: Boolean) {
    companion object {
        fun of(job: Job, run: PulseRunEntity?, now: Long): RunStatus = when {
            run == null -> RunStatus(job, "Not run yet", healthy = true)
            run.fails > 0 -> RunStatus(job, "Failed ${if (run.fails == 1) "once" else "${run.fails} times"} · last worked ${run.lastOkAt?.let { Dates.ago(it, now) } ?: "never"}", healthy = false)
            Freshness.unhealthy(job, run.lastOkAt, now) -> RunStatus(job, "Last ran ${Dates.ago(run.lastOkAt!!, now)} · the phone may be stopping AIIMIN in the background", healthy = false)
            else -> RunStatus(job, "Ran ${Dates.ago(run.lastRunAt, now)} · took ${run.lastMs} ms", healthy = true)
        }
    }
}
