package aiimin.core.data.sync

import aiimin.core.network.CreateMoneyTransactionRequest
import aiimin.core.network.SyncMutationDto
import com.google.common.truth.Truth.assertThat
import kotlinx.serialization.builtins.ListSerializer
import kotlinx.serialization.json.Json
import org.junit.Test

class OutboxSerializationTest {

    private val json = Json { ignoreUnknownKeys = true; encodeDefaults = true }

    @Test
    fun `mutation outbox round-trips`() {
        val items = listOf(
            SyncMutationDto(
                id = "a1",
                type = "habit.tick",
                payload = mapOf("habit_id" to "h1", "completed_at" to "2026-08-05T12:00:00Z"),
                clientMutatedAt = "2026-08-05T12:00:00Z",
            ),
            SyncMutationDto(
                id = "j1",
                type = "journal.upsert",
                payload = mapOf("content" to "hello", "mood" to "3", "date" to "2026-08-05"),
                clientMutatedAt = "2026-08-05T12:01:00Z",
            ),
        )
        val encoded = json.encodeToString(ListSerializer(SyncMutationDto.serializer()), items)
        val decoded = json.decodeFromString(ListSerializer(SyncMutationDto.serializer()), encoded)
        assertThat(decoded).hasSize(2)
        assertThat(decoded[0].type).isEqualTo("habit.tick")
        assertThat(decoded[1].payload["content"]).isEqualTo("hello")
    }

    @Test
    fun `note delete mutation round-trips`() {
        val items = listOf(
            SyncMutationDto(
                id = "d1",
                type = "note.delete",
                payload = mapOf("id" to "note-uuid"),
                clientMutatedAt = "2026-08-14T15:00:00Z",
            ),
        )
        val encoded = json.encodeToString(ListSerializer(SyncMutationDto.serializer()), items)
        val decoded = json.decodeFromString(ListSerializer(SyncMutationDto.serializer()), encoded)
        assertThat(decoded).hasSize(1)
        assertThat(decoded[0].type).isEqualTo("note.delete")
        assertThat(decoded[0].payload["id"]).isEqualTo("note-uuid")
    }

    @Test
    fun `money outbox round-trips`() {
        val items = listOf(
            CreateMoneyTransactionRequest(
                amount = 240.0,
                type = "expense",
                category = "FOOD",
                description = "Metro",
                date = "2026-08-05",
            ),
        )
        val encoded = json.encodeToString(
            ListSerializer(CreateMoneyTransactionRequest.serializer()),
            items,
        )
        val decoded = json.decodeFromString(
            ListSerializer(CreateMoneyTransactionRequest.serializer()),
            encoded,
        )
        assertThat(decoded).hasSize(1)
        assertThat(decoded[0].amount).isEqualTo(240.0)
        assertThat(decoded[0].description).isEqualTo("Metro")
    }
}
