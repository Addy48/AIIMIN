package aiimin.core.data

import aiimin.core.data.sync.Backoff
import aiimin.core.data.sync.Dedupe
import aiimin.core.data.sync.Merge
import aiimin.core.data.sync.MergeOutcome
import aiimin.core.data.sync.Snap
import com.google.common.truth.Truth.assertThat
import org.junit.Test

class SyncLogicTest {
    private val base = Snap.of("title" to "Buy milk", "done" to false)
    private val phoneEdit = Snap.of("title" to "Buy milk and eggs", "done" to false)
    private val webEdit = Snap.of("title" to "Buy milk", "done" to true)

    @Test fun `same on both sides is settled`() {
        assertThat(Merge.decide(base, phoneEdit, phoneEdit, localChanged = true)).isEqualTo(MergeOutcome.SAME)
    }

    @Test fun `only the web changed - the web's version comes in`() {
        assertThat(Merge.decide(base, base, webEdit, localChanged = false)).isEqualTo(MergeOutcome.TAKE_REMOTE)
    }

    @Test fun `only the phone changed - the phone's version goes up`() {
        assertThat(Merge.decide(base, phoneEdit, base, localChanged = true)).isEqualTo(MergeOutcome.PUSH_LOCAL)
    }

    @Test fun `both changed differently - held as a conflict, never overwritten`() {
        assertThat(Merge.decide(base, phoneEdit, webEdit, localChanged = true)).isEqualTo(MergeOutcome.CONFLICT)
    }

    @Test fun `no shared base falls back to who changed since the last sync`() {
        assertThat(Merge.decide(null, phoneEdit, webEdit, localChanged = true)).isEqualTo(MergeOutcome.PUSH_LOCAL)
        assertThat(Merge.decide(null, phoneEdit, webEdit, localChanged = false)).isEqualTo(MergeOutcome.TAKE_REMOTE)
    }

    @Test fun `snapshots are order independent and diff by field`() {
        assertThat(Snap.of("a" to 1, "b" to "x")).isEqualTo(Snap.of("b" to "x", "a" to 1))
        assertThat(Snap.diff(base, webEdit)).containsExactly("done")
        assertThat(Snap.parse(Snap.of("t" to null))["t"]).isNull()
    }

    @Test fun `dedupe keys ignore case and spacing but not the day or amount`() {
        assertThat(Dedupe.taskKey("Buy  Milk ", "2026-10-13")).isEqualTo(Dedupe.taskKey("buy milk", "2026-10-13T00:00:00Z"))
        assertThat(Dedupe.taskKey("Buy milk", "2026-10-13")).isNotEqualTo(Dedupe.taskKey("Buy milk", "2026-10-14"))
        assertThat(Dedupe.moneyKey(45000, "2026-10-13", "Swiggy")).isEqualTo(Dedupe.moneyKey(45000, "2026-10-13", " swiggy"))
        assertThat(Dedupe.moneyKey(45000, "2026-10-13", "Swiggy")).isNotEqualTo(Dedupe.moneyKey(45100, "2026-10-13", "Swiggy"))
        assertThat(Dedupe.eventKey("Standup", 1_700_000_045_000)).isEqualTo(Dedupe.eventKey("standup", 1_700_000_040_000))
    }

    @Test fun `backoff doubles from 30 seconds and caps at 30 minutes`() {
        assertThat(Backoff.delayFor(0)).isEqualTo(0)
        assertThat(Backoff.delayFor(1)).isEqualTo(30_000)
        assertThat(Backoff.delayFor(2)).isEqualTo(60_000)
        assertThat(Backoff.delayFor(4)).isEqualTo(240_000)
        assertThat(Backoff.delayFor(20)).isEqualTo(30 * 60_000)
    }
}
