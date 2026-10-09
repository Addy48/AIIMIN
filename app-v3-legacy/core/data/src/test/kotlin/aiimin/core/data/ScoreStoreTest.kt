package aiimin.core.data

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class ScoreStoreTest {

    private val day = DayStore()
    private val store = ScoreStore(day)

    @Test
    fun `seed rails cover the canonical five dimensions and mid rung`() {
        val state = store.state.value
        assertThat(state.rails).hasSize(5)
        assertThat(state.rails.map { it.label }).containsExactly(
            "BODY", "MIND", "DISCIPLINE", "MONEY", "MOOD",
        ).inOrder()
        assertThat(state.rung).isEqualTo(3)
        assertThat(state.rails.all { it.value == 0 }).isTrue()
        assertThat(state.settled).isFalse()
    }

    @Test
    fun `bump rail advances by five and caps at one hundred`() {
        store.bumpRail(0)
        assertThat(store.state.value.rails[0].value).isEqualTo(5)
        repeat(19) { store.bumpRail(0) }
        assertThat(store.state.value.rails[0].value).isEqualTo(100)
    }

    @Test
    fun `set rung records reflection notice`() {
        store.setRung(5)
        assertThat(store.state.value.rung).isEqualTo(5)
        assertThat(store.state.value.notice?.message).contains("5 of 5")
    }

    @Test
    fun `settle marks reflection without appending a local score`() {
        val before = day.state.value.history.size
        store.settleDay()
        assertThat(store.state.value.settled).isTrue()
        assertThat(day.state.value.history).hasSize(before)
        assertThat(store.state.value.notice?.message).contains("Reflection saved")
        assertThat(store.state.value.notice?.message).contains("server sync")
    }

    @Test
    fun `server pending label is honest`() {
        store.markServerPending()
        assertThat(store.state.value.notice?.message).isEqualTo("REFLECTION SAVED · SERVER SYNC PENDING")
    }
}
