package aiimin.core.data

import aiimin.core.network.AgendaDto
import aiimin.core.network.LifeHealthDto
import aiimin.core.network.LifeHealthSystemsDto
import aiimin.core.network.NoteDto
import com.google.common.truth.Truth.assertThat
import org.junit.Test

class GraphHydrateStoresTest {

    @Test
    fun noteStore_hydratesPinnedAndContent() {
        val store = NoteStore()
        store.hydrateFromBootstrap(
            listOf(
                NoteDto(id = "n1", title = "Alpha", content = "Body one", pinned = true),
                NoteDto(id = "n2", title = "", content = "Untitled body", pinned = false),
            ),
        )
        val s = store.state.value
        assertThat(s.notes).hasSize(2)
        assertThat(s.pinnedFirst.first().title).isEqualTo("Alpha")
        assertThat(s.source).isEqualTo(NoteSource.LIVE)
    }

    @Test
    fun noteStore_upsertQueuesPending() {
        val store = NoteStore()
        store.clearForLive()
        val item = store.upsertLocal(title = "Park", content = "Remember sync")
        assertThat(item.pending).isTrue()
        assertThat(store.state.value.notes.first().title).isEqualTo("Park")
    }

    @Test
    fun noteStore_deleteLocal_removesRowAndMarksWipe() {
        val store = NoteStore()
        store.clearForLive()
        val item = store.upsertLocal(title = "Park", content = "Remember sync")
        store.deleteLocal(item.id)
        val s = store.state.value
        assertThat(s.notes).isEmpty()
        assertThat(s.notice?.message).isEqualTo("DELETED · SYNC WILL WIPE")
    }

    @Test
    fun noteStore_hydrate_skipsPendingDeletes() {
        val store = NoteStore()
        store.hydrateFromBootstrap(
            rows = listOf(
                NoteDto(id = "keep", title = "Keep", content = "stay"),
                NoteDto(id = "gone", title = "Gone", content = "wipe"),
            ),
            excludeIds = setOf("gone"),
        )
        val ids = store.state.value.notes.map { it.id }
        assertThat(ids).containsExactly("keep")
        assertThat(ids).doesNotContain("gone")
    }

    @Test
    fun agendaStore_parsesIsoStart() {
        val store = AgendaStore()
        store.hydrateFromBootstrap(
            listOf(
                AgendaDto(
                    id = "a1",
                    title = "Standup",
                    startAt = "2030-01-15T09:00:00Z",
                    endAt = "2030-01-15T09:30:00Z",
                    allDay = false,
                    eventType = "meeting",
                ),
            ),
        )
        val s = store.state.value
        assertThat(s.events).hasSize(1)
        assertThat(s.events.first().title).isEqualTo("Standup")
        assertThat(s.source).isEqualTo(AgendaSource.LIVE)
    }

    @Test
    fun publishedLifeScore_mapsCanonicalDimensions() {
        val store = PublishedLifeScoreStore()
        store.hydrateFromApi(
            LifeHealthDto(
                globalScore = 72.4,
                systemScores = LifeHealthSystemsDto(
                    physical = 80.0,
                    cognitive = 70.0,
                    discipline = 65.0,
                    financial = 60.0,
                    emotional = 75.0,
                ),
            ),
        )
        val s = store.state.value
        assertThat(s.available).isTrue()
        assertThat(s.global).isEqualTo(72)
        assertThat(s.dimensions.map { it.label }).containsExactly(
            "BODY", "MIND", "DISCIPLINE", "MONEY", "MOOD",
        ).inOrder()
        assertThat(s.source).isEqualTo(LifeScoreSource.API)
    }

    @Test
    fun speakingStore_recordsAndQueues() {
        val store = SpeakingStore()
        store.clearForLive()
        store.recordSession(
            promptId = "hr-0",
            promptText = "Tell me about yourself",
            confidence = 80,
            clarity = 70,
            pace = 75,
            durationSec = 60,
        )
        assertThat(store.pendingCount()).isEqualTo(1)
        assertThat(store.state.value.sessions).hasSize(1)
        assertThat(store.state.value.latestScore).isEqualTo(80)
        store.clearPending()
        assertThat(store.pendingCount()).isEqualTo(0)
    }

    @Test
    fun speakingTopics_hasUsefulBank() {
        assertThat(SpeakingTopics.ALL.size).isAtLeast(30)
        val a = SpeakingTopics.random()
        val b = SpeakingTopics.random(excludingId = a.id)
        assertThat(b.id).isNotEqualTo(a.id)
        assertThat(SpeakingTopics.byCategory("HR")).isNotEmpty()
    }

    @Test
    fun discovery_filtersDismissed() {
        val dismissed = setOf("english_spark")
        val state = DiscoveryState.from(dismissed)
        assertThat(state.tips.none { it.id == "english_spark" }).isTrue()
        assertThat(state.unread).isEqualTo(DiscoveryState.from(emptySet()).unread - 1)
    }
}
