package aiimin.core.data.ai

import aiimin.core.data.util.AppJson
import android.content.Context
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.serialization.Serializable
import kotlinx.serialization.builtins.ListSerializer

/** One capture (C5): what was said or typed and what it became. */
@Serializable
data class CaptureRecord(val id: String, val at: Long, val text: String, val created: List<Source>, val undone: Boolean = false)

/**
 * Recent captures (C5): every capture of the last 24 hours with the items it made, so a whole
 * capture can be undone later, not only from the snackbar. Kept on this phone only; no audio is kept.
 */
@Singleton
class CaptureLog @Inject constructor(@ApplicationContext context: Context, private val assistant: AssistantRepository) {
    private val prefs = context.getSharedPreferences("captures", Context.MODE_PRIVATE)
    private val ser = ListSerializer(CaptureRecord.serializer())
    private val state = MutableStateFlow(load())
    val recent: StateFlow<List<CaptureRecord>> = state.asStateFlow()

    private fun load(): List<CaptureRecord> {
        val cutoff = System.currentTimeMillis() - 24 * 3_600_000L
        return runCatching { AppJson.decodeFromString(ser, prefs.getString("all", "[]")!!) }.getOrDefault(emptyList()).filter { it.at >= cutoff }
    }

    private fun persist(list: List<CaptureRecord>) {
        val cutoff = System.currentTimeMillis() - 24 * 3_600_000L
        val keep = list.filter { it.at >= cutoff }.sortedByDescending { it.at }.take(100)
        prefs.edit().putString("all", AppJson.encodeToString(ser, keep)).apply()
        state.value = keep
    }

    fun record(text: String, created: List<Source>) {
        if (created.isEmpty()) return
        persist(listOf(CaptureRecord(aiimin.core.data.util.newId(), System.currentTimeMillis(), text.trim(), created)) + load())
    }

    /** Undo a whole capture: every item it created is removed (the usual undo for each kind). */
    suspend fun undo(id: String) {
        val list = load()
        val r = list.firstOrNull { it.id == id && !it.undone } ?: return
        assistant.revert(r.created)
        persist(list.map { if (it.id == id) it.copy(undone = true) else it })
    }

    fun refresh() { state.value = load() }
}
