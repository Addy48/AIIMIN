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
    fun `toggle theme flips AIIMIN Light and Dark`() {
        store.toggleTheme()
        assertThat(store.state.value.darkTheme).isFalse()
        assertThat(store.state.value.themeName).isEqualTo("AIIMIN Light")
        store.toggleTheme()
        assertThat(store.state.value.darkTheme).isTrue()
        assertThat(store.state.value.themeName).isEqualTo("AIIMIN Dark")
    }

    @Test
    fun `reduce motion toggles`() {
        assertThat(store.state.value.reduceMotion).isFalse()
        store.toggleReduceMotion()
        assertThat(store.state.value.reduceMotion).isTrue()
    }

    @Test
    fun `remote identity does not invent OS-ID from email`() {
        val before = store.state.value.identity.osId
        store.applyRemoteIdentity("Aaditya", "aaditya@gmail.com")
        assertThat(store.state.value.identity.email).isEqualTo("aaditya@gmail.com")
        assertThat(store.state.value.identity.osId).isEqualTo(before)
    }

    @Test
    fun `remote username remembers OS-ID without using email prefix`() {
        store.applyRemoteIdentity("Aaditya", "aaditya@gmail.com", "adit2k04")
        assertThat(store.state.value.identity.email).isEqualTo("aaditya@gmail.com")
        assertThat(store.state.value.identity.osId).isEqualTo("ADIT2K04")
        store.applyRemoteIdentity("Aaditya", "aaditya@gmail.com", "not-an-id")
        assertThat(store.state.value.identity.osId).isEqualTo("ADIT2K04")
    }

    @Test
    fun `rememberOsId persists valid plate`() {
        store.rememberOsId("adit2k04")
        assertThat(store.state.value.identity.osId).isEqualTo("ADIT2K04")
        store.rememberOsId("nope")
        assertThat(store.state.value.identity.osId).isEqualTo("ADIT2K04")
    }

    @Test
    fun `biometric off by default then toggles`() {
        assertThat(store.state.value.biometricEnabled).isFalse()
        store.toggleBiometric()
        assertThat(store.state.value.biometricEnabled).isTrue()
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
