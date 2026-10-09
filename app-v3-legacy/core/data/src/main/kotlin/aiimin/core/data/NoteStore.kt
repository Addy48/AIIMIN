package aiimin.core.data

import aiimin.core.network.NoteDto
import java.util.UUID
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

/**
 * Notes vault — list · composer · pin · sync via GraphSync `note.upsert` / `note.delete`.
 */
@Singleton
class NoteStore @Inject constructor() {

    private val _state = MutableStateFlow(NoteState.seed())
    val state: StateFlow<NoteState> = _state.asStateFlow()

    fun hydrateFromBootstrap(rows: List<NoteDto>, excludeIds: Set<String> = emptySet()) {
        val mapped = rows.mapNotNull { it.toNote() }.filter { it.id !in excludeIds }
        _state.update { s ->
            // Keep pending local notes that server has not echoed yet.
            val pending = s.notes.filter {
                it.pending &&
                    it.id !in excludeIds &&
                    mapped.none { remote -> remote.id == it.id }
            }
            val merged = (pending + mapped).distinctBy { it.id }
                .sortedWith(compareByDescending<NoteItem> { it.pinned }.thenByDescending { it.updatedAt })
            s.copy(
                notes = merged,
                headMeta = if (merged.isEmpty()) "LIVE · EMPTY" else "LIVE · ${merged.size}",
                source = NoteSource.LIVE,
            )
        }
    }

    fun setDraftTitle(value: String) = _state.update { it.copy(draftTitle = value) }

    fun setDraftBody(value: String) = _state.update { it.copy(draftBody = value) }

    fun startNew() = _state.update {
        it.copy(
            editingId = null,
            draftTitle = "",
            draftBody = "",
            composing = true,
        )
    }

    fun startEdit(id: String) = _state.update { s ->
        val note = s.notes.firstOrNull { it.id == id } ?: return@update s
        s.copy(
            editingId = note.id,
            draftTitle = note.title,
            draftBody = note.content,
            composing = true,
        )
    }

    fun cancelCompose() = _state.update {
        it.copy(composing = false, editingId = null, draftTitle = "", draftBody = "")
    }

    /** Optimistic upsert — returns local id used for `note.upsert`. */
    fun saveDraft(): NoteItem? {
        val s = _state.value
        val body = s.draftBody.trim()
        val title = s.draftTitle.trim()
        if (body.isEmpty() && title.isEmpty()) return null
        val item = NoteItem(
            id = s.editingId ?: UUID.randomUUID().toString(),
            title = title.ifBlank {
                body.lineSequence().firstOrNull().orEmpty().take(48).ifBlank { "Untitled" }
            },
            content = body.ifBlank { title },
            pinned = s.notes.firstOrNull { it.id == s.editingId }?.pinned == true,
            updatedAt = System.currentTimeMillis(),
            pending = true,
        )
        _state.update { cur ->
            val without = cur.notes.filterNot { it.id == item.id }
            cur.copy(
                notes = listOf(item) + without,
                headMeta = "LIVE · ${without.size + 1}",
                notice = NoteNotice("Saved · sync will push"),
                composing = false,
                editingId = null,
                draftTitle = "",
                draftBody = "",
            )
        }
        return item
    }

    fun upsertLocal(title: String, content: String, id: String? = null): NoteItem {
        val cleanTitle = title.trim().ifBlank {
            content.trim().lineSequence().firstOrNull().orEmpty().take(48)
        }
        val cleanBody = content.trim()
        val item = NoteItem(
            id = id ?: UUID.randomUUID().toString(),
            title = cleanTitle.ifBlank { "Untitled" },
            content = cleanBody,
            pinned = false,
            updatedAt = System.currentTimeMillis(),
            pending = true,
        )
        _state.update { s ->
            val without = s.notes.filterNot { it.id == item.id }
            s.copy(
                notes = listOf(item) + without,
                headMeta = "LIVE · ${without.size + 1}",
                notice = NoteNotice("Note queued · sync will push"),
            )
        }
        return item
    }

    fun togglePin(id: String) = _state.update { s ->
        s.copy(
            notes = s.notes.map { n ->
                if (n.id == id) n.copy(pinned = !n.pinned, pending = true, updatedAt = System.currentTimeMillis())
                else n
            },
        )
    }

    fun deleteLocal(id: String) = _state.update { s ->
        val next = s.notes.filterNot { it.id == id }
        s.copy(
            notes = next,
            headMeta = if (next.isEmpty()) "LIVE · EMPTY" else "LIVE · ${next.size}",
            notice = NoteNotice("DELETED · SYNC WILL WIPE"),
            composing = if (s.editingId == id) false else s.composing,
            editingId = if (s.editingId == id) null else s.editingId,
        )
    }

    fun markSynced(id: String, serverId: String? = null) = _state.update { s ->
        s.copy(
            notes = s.notes.map { n ->
                when {
                    n.id == id && serverId != null -> n.copy(id = serverId, pending = false)
                    n.id == id -> n.copy(pending = false)
                    else -> n
                }
            },
        )
    }

    fun clearForLive() = _state.update {
        NoteState.empty().copy(headMeta = "LIVE · EMPTY", source = NoteSource.LIVE)
    }

    fun resetToSeed() {
        _state.value = NoteState.seed()
    }

    fun dismissNotice() = _state.update { it.copy(notice = null) }
}

enum class NoteSource { SEED, LIVE }

data class NoteItem(
    val id: String,
    val title: String,
    val content: String,
    val pinned: Boolean,
    val updatedAt: Long,
    val pending: Boolean = false,
) {
    val excerpt: String get() = content.replace('\n', ' ').take(96)
}

data class NoteNotice(val message: String)

data class NoteState(
    val notes: List<NoteItem>,
    val headMeta: String,
    val source: NoteSource,
    val notice: NoteNotice? = null,
    val composing: Boolean = false,
    val editingId: String? = null,
    val draftTitle: String = "",
    val draftBody: String = "",
) {
    val pinnedFirst: List<NoteItem>
        get() = notes.sortedWith(compareByDescending<NoteItem> { it.pinned }.thenByDescending { it.updatedAt })

    val canSave: Boolean
        get() = draftTitle.isNotBlank() || draftBody.isNotBlank()

    companion object {
        fun empty() = NoteState(notes = emptyList(), headMeta = "—", source = NoteSource.SEED)

        fun seed() = NoteState(
            notes = listOf(
                NoteItem(
                    id = "seed-note-1",
                    title = "Capture beats memory",
                    content = "Park the thought here. Sync paints live notes when signed in.",
                    pinned = true,
                    updatedAt = 0L,
                ),
            ),
            headMeta = "SEED",
            source = NoteSource.SEED,
        )
    }
}

private fun NoteDto.toNote(): NoteItem? {
    val body = content.orEmpty().trim()
    val head = title.orEmpty().trim()
    if (body.isEmpty() && head.isEmpty()) return null
    return NoteItem(
        id = id ?: UUID.randomUUID().toString(),
        title = head.ifBlank { body.lineSequence().firstOrNull().orEmpty().take(48).ifBlank { "Untitled" } },
        content = body.ifBlank { head },
        pinned = pinned == true,
        updatedAt = parseMillis(updatedAt ?: createdAt),
    )
}

private fun parseMillis(raw: String?): Long {
    if (raw.isNullOrBlank()) return 0L
    return runCatching { java.time.Instant.parse(raw).toEpochMilli() }.getOrDefault(0L)
}
