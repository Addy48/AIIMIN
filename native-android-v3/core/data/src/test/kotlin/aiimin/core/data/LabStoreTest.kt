package aiimin.core.data

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class LabStoreTest {

    private val store = LabStore()

    @Test
    fun `seed has five survivors and first pair selected`() {
        val s = store.state.value
        assertThat(s.pairs).hasSize(5)
        assertThat(s.selectedIndex).isEqualTo(0)
        assertThat(s.selected.rho).isEqualTo("−.61")
        assertThat(s.rejectedCount).isEqualTo(14)
        assertThat(s.headMeta).isEqualTo("n=184d")
    }

    @Test
    fun `select changes pair`() {
        store.select(2)
        assertThat(store.state.value.selected.label).contains("Delivery")
        assertThat(store.state.value.selected.rhoValue).isLessThan(0f)
    }

    @Test
    fun `select out of range ignored`() {
        store.select(99)
        assertThat(store.state.value.selectedIndex).isEqualTo(0)
    }

    @Test
    fun `rhoValue parses unicode minus`() {
        assertThat(store.state.value.pairs[0].rhoValue).isWithin(0.01f).of(-0.61f)
        assertThat(store.state.value.pairs[1].rhoValue).isWithin(0.01f).of(0.54f)
    }
}
