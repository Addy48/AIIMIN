package aiimin.core.data

import aiimin.core.data.pulse.RunStatus
import aiimin.core.database.PulseRunEntity
import aiimin.core.engine.pulse.Job
import com.google.common.truth.Truth.assertThat
import org.junit.Test

class RunStatusTest {
    private val m = 60_000L
    private val now = 1_000 * m

    @Test fun `fresh run reads as healthy with its age`() {
        val s = RunStatus.of(Job.DEVICE, PulseRunEntity("DEVICE", lastRunAt = now - 2 * m, lastOkAt = now - 2 * m, lastMs = 140), now)
        assertThat(s.healthy).isTrue()
        assertThat(s.line).isEqualTo("Ran 2 min ago · took 140 ms")
    }

    @Test fun `failures are counted`() {
        val s = RunStatus.of(Job.SYNC, PulseRunEntity("SYNC", lastRunAt = now, lastOkAt = null, fails = 3), now)
        assertThat(s.healthy).isFalse()
        assertThat(s.line).isEqualTo("Failed 3 times · last worked never")
    }

    @Test fun `a killed worker shows up as stale`() {
        val s = RunStatus.of(Job.DEVICE, PulseRunEntity("DEVICE", lastRunAt = now - 90 * m, lastOkAt = now - 90 * m), now)
        assertThat(s.healthy).isFalse()
        assertThat(s.line).startsWith("Last ran 1 h ago")
    }

    @Test fun `never run is neutral`() {
        assertThat(RunStatus.of(Job.TRASH, null, now).line).isEqualTo("Not run yet")
    }
}
