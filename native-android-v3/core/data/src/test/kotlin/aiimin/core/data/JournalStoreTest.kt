package aiimin.core.data

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class JournalStoreTest {

    private val store = JournalStore()

    @Test
    fun `seed has history and free write`() {
        val s = store.state.value
        assertThat(s.template).isEqualTo(JournalTemplate.FREE_WRITE)
        assertThat(s.entries).hasSize(2)
        assertThat(s.mood).isEqualTo(3)
    }

    @Test
    fun `save empty draft refused`() {
        assertThat(store.save()).isFalse()
        assertThat(store.state.value.entries).hasSize(2)
    }

    @Test
    fun `save prepends entry and clears draft`() {
        store.setTemplate(JournalTemplate.CBT)
        store.setMood(5)
        store.setDraft("Situation clear. Reframe held.")
        assertThat(store.save()).isTrue()
        val s = store.state.value
        assertThat(s.entries).hasSize(3)
        assertThat(s.entries.first().template).isEqualTo(JournalTemplate.CBT)
        assertThat(s.entries.first().mood).isEqualTo(5)
        assertThat(s.draft).isEmpty()
        assertThat(s.notice?.message).contains("Saved")
    }
}
