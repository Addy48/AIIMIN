package aiimin.core.data

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class LocalGraphSearchTest {

    private val note = NoteItem(
        id = "n1",
        title = "Capture beats memory",
        content = "Park the thought",
        pinned = false,
        updatedAt = 2_000L,
    )
    private val journal = JournalEntry(
        date = "01.08",
        template = JournalTemplate.CBT,
        mood = 2,
        excerpt = "Reframe held",
        body = "Reframe held",
    )
    private val money = LedgerEntry(
        id = 9,
        name = "Coffee",
        meta = "cafe",
        amount = -80,
        category = "food",
    )
    private val agenda = AgendaEvent(
        id = "a1",
        title = "Standup",
        startEpochMs = 3_000L,
        endEpochMs = null,
        allDay = false,
        eventType = null,
    )

    @Test
    fun `query matches note title`() {
        val r = LocalGraphSearch.search("capture", listOf(note), listOf(journal), listOf(money), listOf(agenda))
        assertThat(r.notes).hasSize(1)
        assertThat(r.journal).isEmpty()
    }

    @Test
    fun `query matches journal excerpt`() {
        val r = LocalGraphSearch.search("reframe", listOf(note), listOf(journal), listOf(money), listOf(agenda))
        assertThat(r.journal).hasSize(1)
        assertThat(r.notes).isEmpty()
    }

    @Test
    fun `empty query returns empty groups`() {
        val r = LocalGraphSearch.search("  ", listOf(note), listOf(journal), listOf(money), listOf(agenda))
        assertThat(r.isEmpty).isTrue()
    }

    @Test
    fun `timeline merge sorts newest first`() {
        val rows = LocalGraphSearch.timeline(listOf(note), emptyList(), listOf(money), listOf(agenda))
        assertThat(rows.first().kind).isEqualTo("AGENDA")
        assertThat(rows.map { it.kind }).containsExactly("AGENDA", "NOTE", "MONEY").inOrder()
    }
}
