package aiimin.feature.vault

import aiimin.core.data.core.DayClock
import aiimin.core.data.plan.TaskRepository
import aiimin.core.data.vault.DocView
import aiimin.core.data.vault.FamilyRepository
import aiimin.core.data.vault.ImportResult
import aiimin.core.data.vault.VaultRepository
import aiimin.core.database.AccessLogEntity
import aiimin.core.database.DocEntity
import aiimin.core.database.EmergencyRequestEntity
import aiimin.core.database.PersonEntity
import aiimin.core.database.TaskEntity
import aiimin.core.privacy.AccessLevel
import aiimin.core.privacy.Role
import android.content.Context
import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import java.io.File
import java.time.LocalDate
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

@HiltViewModel
class VaultViewModel @Inject constructor(
    private val vault: VaultRepository,
    private val family: FamilyRepository,
    private val clock: DayClock,
) : ViewModel() {
    val docs: StateFlow<List<DocView>?> = vault.visible.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)
    val people: StateFlow<List<PersonEntity>> = family.people.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    val viewer: StateFlow<String> = family.viewer
    val busy = MutableStateFlow(false)
    val lastImport = MutableStateFlow<ImportResult?>(null)

    init {
        viewModelScope.launch { family.ensureSelf("") }
    }

    fun import(uris: List<Uri>, owner: String, sensitive: Boolean) = viewModelScope.launch {
        busy.value = true
        try {
            var last: ImportResult? = null
            uris.forEach { last = vault.import(it, owner, sensitive) }
            lastImport.value = last
        } finally {
            busy.value = false
        }
    }

    fun clearImport() { lastImport.value = null }
    fun previewAs(id: String) = family.previewAs(id)

    suspend fun doc(id: String) = vault.get(id)
    fun setCategory(d: DocEntity, cat: String) = viewModelScope.launch { vault.edit(d.copy(category = cat)) }
    fun setExpiry(id: String, date: LocalDate?, task: Boolean) = viewModelScope.launch { vault.setExpiry(id, date, task) }
    suspend fun today() = clock.today()
}

@HiltViewModel
class DocViewModel @Inject constructor(
    @ApplicationContext private val context: Context,
    private val vault: VaultRepository,
    private val family: FamilyRepository,
) : ViewModel() {
    private val id = MutableStateFlow<String?>(null)
    val view: StateFlow<DocView?> = combine(vault.visible, id) { list, i -> list.firstOrNull { it.doc.id == i } }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)
    val file = MutableStateFlow<File?>(null)
    val people = family.people.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    val log: StateFlow<List<AccessLogEntity>> = combine(vault.accessLog(200), id) { l, i -> l.filter { it.docId == i } }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

    fun load(docId: String) {
        if (id.value == docId) return
        id.value = docId
        viewModelScope.launch {
            vault.get(docId)?.let { d -> file.value = runCatching { vault.fileFor(d) }.getOrNull() }
        }
    }

    /** A shareable copy in cache/share, named after the document. */
    suspend fun shareCopy(d: DocEntity): File {
        val src = vault.fileFor(d, "share")
        val dir = File(context.cacheDir, "share").apply { mkdirs() }
        val out = File(dir, d.title.replace(Regex("[^A-Za-z0-9 ._-]"), "").trim().ifBlank { "document" } + "." + d.ext)
        src.copyTo(out, overwrite = true)
        return out
    }

    fun rename(d: DocEntity, title: String) = viewModelScope.launch { vault.edit(d.copy(title = title.trim())) }
    fun setCategory(d: DocEntity, cat: String) = viewModelScope.launch { vault.edit(d.copy(category = cat)) }
    fun move(d: DocEntity, owner: String) = viewModelScope.launch { vault.edit(d.copy(owner = owner)) }
    fun setExpiry(d: DocEntity, date: LocalDate?, task: Boolean) = viewModelScope.launch { vault.setExpiry(d.id, date, task) }
    fun share(d: DocEntity, who: String, level: AccessLevel, whenKind: String, until: LocalDate?) = viewModelScope.launch { vault.setShare(d.id, who, level, whenKind, until) }
    fun unshare(d: DocEntity, who: String) = viewModelScope.launch { vault.removeShare(d.id, who) }
    suspend fun delete(d: DocEntity) = vault.delete(d.id)
    fun restore(d: DocEntity) = viewModelScope.launch { vault.restore(d) }
}

@HiltViewModel
class PersonViewModel @Inject constructor(
    private val family: FamilyRepository,
    private val tasks: TaskRepository,
    private val clock: DayClock,
    vault: VaultRepository,
) : ViewModel() {
    private val id = MutableStateFlow<String?>(null)
    val person: StateFlow<PersonEntity?> = combine(family.people, id) { p, i -> p.firstOrNull { it.id == i } }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)
    val docs: StateFlow<List<DocView>> = combine(vault.visible, id) { d, i -> d.filter { it.doc.owner == i } }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    val tasksFor: StateFlow<List<TaskEntity>> = combine(tasks.family(), id) { t, i -> t.filter { it.assignee == i } }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    val requests: StateFlow<List<EmergencyRequestEntity>> = combine(family.requests, id) { r, i -> r.filter { it.ownerId == i } }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

    fun load(personId: String) { id.value = personId }
    fun save(p: PersonEntity) = viewModelScope.launch { family.update(p) }
    fun setDelegate(to: String?, cats: Set<String>) = viewModelScope.launch { id.value?.let { family.setDelegate(it, to, cats) } }
    fun addTask(title: String) = viewModelScope.launch { id.value?.let { tasks.create(title, clock.today(), assignee = it) } }
    fun request() = viewModelScope.launch { id.value?.let { family.requestEmergency(it) } }
    fun decide(rid: String, ok: Boolean) = viewModelScope.launch { family.decide(rid, ok) }
    fun previewAs(pid: String) = family.previewAs(pid)
    fun remove() = viewModelScope.launch { id.value?.let { family.remove(it) } }
}

@HiltViewModel
class FamilyViewModel @Inject constructor(
    private val family: FamilyRepository,
    vault: VaultRepository,
) : ViewModel() {
    val people = family.people.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    val requests = family.requests.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    val log = vault.accessLog(60).map { it }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

    fun add(name: String, relation: String, role: Role, invite: Boolean) = viewModelScope.launch { family.add(name, relation, role, invite) }
    fun decide(id: String, ok: Boolean) = viewModelScope.launch { family.decide(id, ok) }
}
