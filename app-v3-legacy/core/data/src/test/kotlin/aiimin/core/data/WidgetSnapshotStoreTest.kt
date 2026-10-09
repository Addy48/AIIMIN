package aiimin.core.data

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class WidgetSnapshotStoreTest {

    @Test
    fun `publish replaces empty and never invents a score`() {
        val store = WidgetSnapshotStore()
        assertThat(store.state.value.score).isNull()
        store.publish(
            WidgetSnapshot(osId = "ADIT2K04", score = 72, steps = 4_200, screenLabel = "3h 12m"),
        )
        val s = store.state.value
        assertThat(s.osId).isEqualTo("ADIT2K04")
        assertThat(s.score).isEqualTo(72)
        assertThat(s.steps).isEqualTo(4_200L)
        assertThat(s.screenLabel).isEqualTo("3h 12m")
        store.publish(WidgetSnapshot.empty())
        assertThat(store.state.value.score).isNull()
    }
}
