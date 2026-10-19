package aiimin.core.data.plan

import aiimin.core.data.util.AppJson
import aiimin.core.data.settings.Codecs
import aiimin.core.database.GoalDao
import aiimin.core.database.GoalEntity
import aiimin.core.data.util.newId
import android.content.Context
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.serialization.Serializable
import kotlinx.serialization.builtins.ListSerializer

@Serializable
data class Milestone(val t: String, val done: Boolean = false)

@Serializable
data class Goal(
    val id: String,
    val title: String,
    val why: String = "",
    /** ISO date or null. */
    val due: String? = null,
    val milestones: List<Milestone> = emptyList(),
    /** Tasks linked to this goal; their completion is part of the progress. */
    val taskIds: List<String> = emptyList(),
    val archived: Boolean = false,
    val createdAt: Long = System.currentTimeMillis(),
)

/**
 * Goals live in Room (v2; one SharedPreferences document in v1, imported once on first start).
 * Creating a goal earns nothing; progress is computed from what is finished (milestones and
 * linked tasks), never typed in. Reads are synchronous from memory so screens never wait;
 * writes land in the database right after and are picked up by sync.
 */
@Singleton
class GoalRepository @Inject constructor(
    @ApplicationContext context: Context,
    private val tasks: TaskRepository,
    private val dao: GoalDao,
) {
    private val prefs = context.getSharedPreferences("goals", Context.MODE_PRIVATE)
    private val ser = ListSerializer(Goal.serializer())
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
    private val state = MutableStateFlow<List<Goal>>(emptyList())
    val goals: StateFlow<List<Goal>> = state.asStateFlow()

    init {
        scope.launch {
            importLegacy()
            dao.all().collect { rows -> state.value = rows.map(::toGoal) }
        }
    }

    /** v1 kept goals in SharedPreferences; move them into the table once, then drop the file. */
    private suspend fun importLegacy() {
        val raw = prefs.getString("all", null) ?: return
        val legacy = runCatching { AppJson.decodeFromString(ser, raw) }.getOrNull().orEmpty()
        for (g in legacy) if (dao.get(g.id) == null) dao.upsert(toEntity(g, g.createdAt))
        prefs.edit().remove("all").apply()
    }

    fun get(id: String): Goal? = state.value.firstOrNull { it.id == id }

    fun save(g: Goal): String {
        val list = state.value
        state.value = if (list.any { it.id == g.id }) list.map { if (it.id == g.id) g else it } else list + g
        scope.launch {
            val cur = dao.get(g.id)
            dao.upsert(toEntity(g, System.currentTimeMillis()).copy(remoteId = cur?.remoteId))
        }
        return g.id
    }

    fun create(title: String): String = save(Goal(newId(), title.trim()))

    fun update(id: String, change: (Goal) -> Goal) {
        val g = get(id) ?: return
        save(change(g))
    }

    /** Soft delete: it sits in Trash for 30 days and the web copy goes on the next sync. */
    fun delete(id: String) {
        state.update { list -> list.filter { it.id != id } }
        scope.launch { dao.get(id)?.let { dao.upsert(it.copy(deleted = true, updatedAt = System.currentTimeMillis())) } }
    }

    /** Adds a task for this goal (undated, so it sits in Someday) and links it. */
    suspend fun addTask(goalId: String, title: String, day: java.time.LocalDate? = null): String {
        val id = tasks.create(title, day)
        update(goalId) { it.copy(taskIds = it.taskIds + id) }
        return id
    }

    /** 0..1 from milestones done and linked tasks done; null when nothing is linked yet. */
    suspend fun progress(g: Goal): Float? {
        val linked = g.taskIds.mapNotNull { tasks.get(it) }.filter { !it.deleted }
        val total = g.milestones.size + linked.size
        if (total == 0) return null
        return (g.milestones.count { it.done } + linked.count { it.done }).toFloat() / total
    }

    companion object {
        private val milestoneSer = ListSerializer(Milestone.serializer())

        fun toGoal(e: GoalEntity) = Goal(
            id = e.id, title = e.title, why = e.why, due = e.due,
            milestones = runCatching { AppJson.decodeFromString(milestoneSer, e.milestones) }.getOrDefault(emptyList()),
            taskIds = Codecs.decodeList(e.taskIds), archived = e.archived, createdAt = e.createdAt,
        )

        fun toEntity(g: Goal, updatedAt: Long) = GoalEntity(
            id = g.id, title = g.title, why = g.why, due = g.due,
            milestones = AppJson.encodeToString(milestoneSer, g.milestones),
            taskIds = Codecs.encodeList(g.taskIds), archived = g.archived, createdAt = g.createdAt, updatedAt = updatedAt,
        )
    }
}
