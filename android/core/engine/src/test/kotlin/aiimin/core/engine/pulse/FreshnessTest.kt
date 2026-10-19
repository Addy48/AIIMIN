package aiimin.core.engine.pulse

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class FreshnessTest {
    private val m = 60_000L

    @Test fun `screen time is due every minute in the foreground and every 15 in the background`() {
        assertThat(Freshness.due(Job.DEVICE, lastOk = 0, now = 61_000, foreground = true)).isTrue()
        assertThat(Freshness.due(Job.DEVICE, lastOk = 0, now = 10 * m, foreground = false)).isFalse()
        assertThat(Freshness.due(Job.DEVICE, lastOk = 0, now = 15 * m, foreground = false)).isTrue()
    }

    @Test fun `never-run jobs are always due`() {
        assertThat(Freshness.due(Job.TRASH, lastOk = null, now = 1, foreground = false)).isTrue()
    }

    @Test fun `a forced job runs even when fresh`() {
        assertThat(Freshness.due(Job.SYNC, lastOk = 0, now = 1, foreground = true, forced = setOf(Job.SYNC))).isTrue()
    }

    @Test fun `overdue twice the background interval counts as unhealthy`() {
        assertThat(Freshness.unhealthy(Job.SYNC, lastOk = 0, now = 61 * m)).isTrue()
        assertThat(Freshness.unhealthy(Job.SYNC, lastOk = 0, now = 59 * m)).isFalse()
        assertThat(Freshness.unhealthy(Job.SYNC, lastOk = null, now = 999 * m)).isFalse()
    }

    @Test fun `measurements run before the engines that read them`() {
        assertThat(Freshness.order.indexOf(Job.DEVICE)).isLessThan(Freshness.order.indexOf(Job.NOTIFY))
        assertThat(Freshness.order.indexOf(Job.DAY)).isLessThan(Freshness.order.indexOf(Job.NOTIFY))
        assertThat(Freshness.order.last()).isEqualTo(Job.WIDGET)
        assertThat(Freshness.order.toSet()).isEqualTo(Job.entries.toSet())
    }

    @Test fun `unhealthy jobs jump the queue`() {
        val plan = Freshness.plan(lastOk = mapOf(Job.DEVICE to 50 * m, Job.SYNC to 0L), now = 70 * m, foreground = false)
        assertThat(plan.first()).isEqualTo(Job.SYNC) // 70 min > 2 × 30
        assertThat(plan).contains(Job.DEVICE) // 20 min: due, but healthy
    }
}
