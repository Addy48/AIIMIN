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
        assertThat(s.selected?.rho).isEqualTo("−.61")
        assertThat(s.rejectedCount).isEqualTo(14)
        assertThat(s.headMeta).isEqualTo("SEED · DEMO")
    }

    @Test
    fun `select changes pair`() {
        store.select(2)
        assertThat(store.state.value.selected?.label).contains("Delivery")
        assertThat(store.state.value.selected?.rhoValue).isLessThan(0f)
    }

    @Test
    fun `select out of range ignored`() {
        store.select(99)
        assertThat(store.state.value.selectedIndex).isEqualTo(0)
    }

    @Test
    fun `remote survivor is live`() {
        store.applyRemote(
            aiimin.core.network.CorrelationsResponse(
                correlations = listOf(
                    aiimin.core.network.CorrelationDto(
                        signalALabel = "Mood",
                        signalBLabel = "Sleep",
                        rho = 0.61,
                        n = 40,
                        pValue = 0.004,
                        bhPassed = true,
                        headline = "When mood is higher, sleep trends up.",
                    ),
                    aiimin.core.network.CorrelationDto(
                        signalALabel = "Noise",
                        signalBLabel = "Focus",
                        rho = 0.12,
                        n = 40,
                        pValue = 0.4,
                        bhPassed = false,
                    ),
                ),
            ),
        )
        val s = store.state.value
        assertThat(s.isSeed).isFalse()
        assertThat(s.pairs).hasSize(1)
        assertThat(s.rejectedCount).isEqualTo(1)
        assertThat(s.headMeta).contains("LIVE")
        assertThat(s.selected?.plain).contains("sleep")
    }

    @Test
    fun `remote insufficient is live not seed`() {
        store.applyRemote(
            aiimin.core.network.CorrelationsResponse(insufficientData = true),
        )
        val s = store.state.value
        assertThat(s.isSeed).isFalse()
        assertThat(s.pairs).isEmpty()
        assertThat(s.headMeta).contains("INSUFFICIENT")
    }

    @Test
    fun `rhoValue parses unicode minus`() {
        assertThat(store.state.value.pairs[0].rhoValue).isWithin(0.01f).of(-0.61f)
        assertThat(store.state.value.pairs[1].rhoValue).isWithin(0.01f).of(0.54f)
    }
}
