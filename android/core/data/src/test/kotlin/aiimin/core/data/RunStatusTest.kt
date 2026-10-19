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

    @Test fun `a job that has not run yet is neutral, not healthy`() {
        val s = RunStatus.of(Job.DEVICE, null, now)
        assertThat(s.line).isEqualTo("Not run yet")
        assertThat(s.waiting).isTrue()
    }

    @Test fun `sync while signed out says it is off`() {
        val s = RunStatus.of(Job.SYNC, PulseRunEntity("SYNC", lastRunAt = now - 16 * m, lastOkAt = now - 16 * m, lastMs = 0), now, signedIn = false)
        assertThat(s.line).isEqualTo("Off · sign in to sync")
        assertThat(s.waiting).isTrue()
    }
}
