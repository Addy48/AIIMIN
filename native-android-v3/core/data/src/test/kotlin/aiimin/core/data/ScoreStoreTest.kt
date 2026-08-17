package aiimin.core.data

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class ScoreStoreTest {

    private val day = DayStore()
    private val store = ScoreStore(day)

    @Test
    fun `seed rails and mid rung`() {
        val s = store.state.value
        assertThat(s.rails).hasSize(3)
        assertThat(s.rung).isEqualTo(3)
        assertThat(s.liveScore(minsDone = 3)).isEqualTo(76)
        assertThat(s.settled).isFalse()
    }

    @Test
    fun `bump rail advances by five and wraps`() {
        store.bumpRail(0)
        assertThat(store.state.value.rails[0].value).isEqualTo(90)
        repeat(3) { store.bumpRail(0) }
        assertThat(store.state.value.rails[0].value).isEqualTo(40)
    }

    @Test
    fun `set rung records notice`() {
        store.setRung(5)
        assertThat(store.state.value.rung).isEqualTo(5)
        assertThat(store.state.value.notice?.message).contains("5 of 5")
    }

    @Test
    fun `settle appends history and marks settled`() {
        val before = day.state.value.history.size
        val score = store.settleDay()
        assertThat(score).isEqualTo(store.state.value.liveScore(0))
        // settle uses current pursuits done count (seed = 0 done)
        assertThat(store.state.value.settled).isTrue()
        assertThat(day.state.value.history).hasSize(before + 1)
        assertThat(day.state.value.history.last()).isEqualTo(score.toDouble())
        assertThat(store.state.value.notice?.message).contains("Day marked")
        assertThat(store.state.value.notice?.message).contains("server LHS")
    }

    @Test
    fun `server pending label is honest`() {
        store.markServerPending()
        assertThat(store.state.value.notice?.message).isEqualTo("MARKED ON PHONE · SERVER PENDING")
    }
}
