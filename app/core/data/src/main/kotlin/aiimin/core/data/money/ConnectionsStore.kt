package aiimin.core.data.money

import aiimin.core.data.di.ApplicationScope
import aiimin.core.data.prefs.AppPreferences
import java.util.UUID
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import org.json.JSONArray
import org.json.JSONObject

/**
 * User-owned money connections (banks / UPI apps / cards).
 *
 * Never seed founder-specific labels (HDFC / Fi / Google). Empty until the
 * user adds their own. Persisted as JSON in [AppPreferences].
 */
@Singleton
class ConnectionsStore @Inject constructor(
    private val prefs: AppPreferences,
    @ApplicationScope private val scope: CoroutineScope,
) {

    private val _state = MutableStateFlow(ConnectionsState())
    val state: StateFlow<ConnectionsState> = _state.asStateFlow()

    init {
        scope.launch {
            val raw = prefs.read().connectionsJson
            _state.value = ConnectionsState.fromJson(raw)
        }
    }

    fun add(label: String, kind: ConnectionKind) {
        val clean = label.trim().take(40)
        if (clean.isEmpty()) return
        _state.update { current ->
            val next = current.copy(
                items = current.items + MoneyConnection(
                    id = UUID.randomUUID().toString(),
                    label = clean,
                    kind = kind,
                ),
            )
            persist(next)
            next
        }
    }

    fun remove(id: String) = _state.update { current ->
        val next = current.copy(items = current.items.filterNot { it.id == id })
        persist(next)
        next
    }

    private fun persist(state: ConnectionsState) {
        scope.launch { prefs.writeConnectionsJson(state.toJson()) }
    }
}

enum class ConnectionKind(val label: String) {
    BANK("BANK"),
    UPI("UPI"),
    CARD("CARD"),
    OTHER("OTHER"),
}

data class MoneyConnection(
    val id: String,
    val label: String,
    val kind: ConnectionKind,
)

data class ConnectionsState(
    val items: List<MoneyConnection> = emptyList(),
) {
    val summaryLabel: String
        get() = when {
            items.isEmpty() -> "None · tap to add"
            items.size <= 3 -> items.joinToString(", ") { it.label }
            else -> items.take(2).joinToString(", ") { it.label } + " +${items.size - 2}"
        }

    fun toJson(): String {
        val arr = JSONArray()
        items.forEach { c ->
            arr.put(
                JSONObject()
                    .put("id", c.id)
                    .put("label", c.label)
                    .put("kind", c.kind.name),
            )
        }
        return arr.toString()
    }

    companion object {
        fun fromJson(raw: String?): ConnectionsState {
            if (raw.isNullOrBlank()) return ConnectionsState()
            return try {
                val arr = JSONArray(raw)
                val items = buildList {
                    for (i in 0 until arr.length()) {
                        val o = arr.getJSONObject(i)
                        val kind = runCatching {
                            ConnectionKind.valueOf(o.optString("kind", "OTHER"))
                        }.getOrDefault(ConnectionKind.OTHER)
                        val label = o.optString("label").trim()
                        val id = o.optString("id").ifBlank { UUID.randomUUID().toString() }
                        if (label.isNotEmpty()) {
                            add(MoneyConnection(id = id, label = label, kind = kind))
                        }
                    }
                }
                ConnectionsState(items)
            } catch (_: Exception) {
                ConnectionsState()
            }
        }
    }
}
