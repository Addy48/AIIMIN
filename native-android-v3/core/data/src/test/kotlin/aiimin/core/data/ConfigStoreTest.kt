package aiimin.core.data

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class ConfigStoreTest {

    private val store = ConfigStore()

    @Test
    fun `seed identity is labelled and dark by default`() {
        val s = store.state.value
        assertThat(s.isSeed).isTrue()
        assertThat(s.darkTheme).isTrue()
        assertThat(s.identity.osId).isEqualTo("AADI2004")
        assertThat(s.identity.xpPct).isGreaterThan(0.5f)
    }

    @Test
    fun `toggle theme flips drafting table and industry sheet`() {
        store.toggleTheme()
        assertThat(store.state.value.darkTheme).isFalse()
        assertThat(store.state.value.themeName).contains("Industry")
        store.toggleTheme()
        assertThat(store.state.value.darkTheme).isTrue()
    }

    @Test
    fun `reduce motion toggles`() {
        assertThat(store.state.value.reduceMotion).isFalse()
        store.toggleReduceMotion()
        assertThat(store.state.value.reduceMotion).isTrue()
    }

    @Test
    fun `sync now enters syncing then finish returns live`() {
        store.syncNow()
        assertThat(store.state.value.sync).isEqualTo(SyncState.SYNCING)
        store.finishSync()
        assertThat(store.state.value.sync).isEqualTo(SyncState.LIVE)
        assertThat(store.state.value.notice?.message).contains("Synced locally")
    }

    @Test
    fun `delete without exact DELETE is refused and nothing erased`() {
        store.openDelete()
        assertThat(store.state.value.deleteOpen).isTrue()
        val ok = store.refuseDelete("delete")
        assertThat(ok).isFalse()
        assertThat(store.state.value.deleteOpen).isTrue()
        assertThat(store.state.value.identity.name).isEqualTo("Aaditya Upadhyay")
    }

    @Test
    fun `delete with DELETE still refuses locally and closes veil`() {
        store.openDelete()
        val ok = store.refuseDelete("DELETE")
        assertThat(ok).isTrue()
        assertThat(store.state.value.deleteOpen).isFalse()
        assertThat(store.state.value.notice?.message).contains("Refused")
        assertThat(store.state.value.identity.name).isEqualTo("Aaditya Upadhyay")
    }
}
