package aiimin.core.data

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class OnboardingStoreTest {

    private val config = ConfigStore()
    private val day = DayStore()
    private val store = OnboardingStore(config, day)

    @Test
    fun `fresh starts at welcome ready for shell`() {
        val s = store.state.value
        assertThat(s.step).isEqualTo(1)
        assertThat(s.completed).isTrue()
        assertThat(s.pickedCount).isEqualTo(3)
        assertThat(s.chosenValid).isTrue()
    }

    @Test
    fun `next and back clamp to step range`() {
        store.back()
        assertThat(store.state.value.step).isEqualTo(1)
        repeat(10) { store.next() }
        assertThat(store.state.value.step).isEqualTo(OnboardingState.STEPS)
    }

    @Test
    fun `selectOsId normalises and validates`() {
        store.selectOsId("aadi2004")
        assertThat(store.state.value.chosenId).isEqualTo("AADI2004")
        assertThat(store.state.value.chosenValid).isTrue()
        store.selectOsId("BAD")
        assertThat(store.state.value.chosenValid).isFalse()
    }

    @Test
    fun `toggle minimum flips pick`() {
        store.toggleMinimum(0)
        assertThat(store.state.value.minimums[0].picked).isFalse()
        assertThat(store.state.value.pickedCount).isEqualTo(2)
    }

    @Test
    fun `settle refused without first capture`() {
        store.replay()
        assertThat(store.settleAndEnter()).isFalse()
        assertThat(store.state.value.completed).isFalse()
        assertThat(config.state.value.isSeed).isTrue()
    }

    @Test
    fun `settle writes config day and completes`() {
        store.replay()
        store.setFirstCapture("paid 240 metro, walked 25 min")
        assertThat(store.settleAndEnter()).isTrue()
        assertThat(store.state.value.completed).isTrue()
        assertThat(config.state.value.isSeed).isFalse()
        assertThat(config.state.value.identity.osId).isEqualTo("ADIT2K04")
        assertThat(config.state.value.minimumsLabel).isEqualTo("3 set")
        assertThat(day.state.value.pursuits).hasSize(3)
        assertThat(day.state.value.captures).hasSize(1)
        assertThat(day.state.value.captures.first().amount).isEqualTo(240)
    }

    @Test
    fun `skip and replay`() {
        store.replay()
        assertThat(store.state.value.completed).isFalse()
        store.skipToShell()
        assertThat(store.state.value.completed).isTrue()
        store.replay()
        assertThat(store.state.value.completed).isFalse()
        assertThat(store.state.value.step).isEqualTo(1)
    }
}