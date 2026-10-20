package aiimin.feature.assistant

import aiimin.core.data.ai.Action
import aiimin.core.data.ai.AssistantRepository
import aiimin.core.data.ai.ChatContext
import aiimin.core.data.ai.Source
import aiimin.core.database.ChatMessageEntity
import aiimin.core.database.ChatThreadEntity
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.FlowPreview
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.debounce
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.flow.mapLatest
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

@OptIn(ExperimentalCoroutinesApi::class)
@HiltViewModel
class ChatViewModel @Inject constructor(private val repo: AssistantRepository) : ViewModel() {
    val thread = MutableStateFlow<String?>(null)
    val messages: StateFlow<List<ChatMessageEntity>> = thread.flatMapLatest { id -> if (id == null) flowOf(emptyList()) else repo.messages(id) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    val threads: StateFlow<List<ChatThreadEntity>> = repo.threads.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    val busy = MutableStateFlow(false)
    val starters = MutableStateFlow<List<String>>(emptyList())
    private var context: ChatContext? = null
    private var started = false

    fun start(prompt: String?, ctx: String?, autoSend: Boolean, prefill: (String) -> Unit) {
        if (started) return
        started = true
        context = ctx?.let { ChatContext(label = it) }
        viewModelScope.launch { starters.value = repo.starters() }
        if (prompt != null) if (autoSend) send(prompt) else prefill(prompt)
    }

    fun send(text: String) {
        if (text.isBlank() || busy.value) return
        viewModelScope.launch {
            busy.value = true
            try {
                val id = thread.value ?: repo.newThread().also { thread.value = it }
                repo.send(id, text, context)
            } finally {
                busy.value = false
            }
        }
    }

    fun open(id: String) { thread.value = id }
    fun newChat() { thread.value = null }
    fun delete(id: String) = viewModelScope.launch { repo.deleteThread(id); if (thread.value == id) thread.value = null }

    suspend fun apply(m: ChatMessageEntity) = repo.apply(m.id)
    fun undo(m: ChatMessageEntity) = viewModelScope.launch { repo.undo(m.id) }
    fun discard(m: ChatMessageEntity) = viewModelScope.launch { repo.discard(m.id) }

    fun actions(m: ChatMessageEntity) = repo.actions(m)
    fun sources(m: ChatMessageEntity) = repo.sources(m)
    fun followups(m: ChatMessageEntity) = repo.followups(m)
    fun saw(m: ChatMessageEntity) = repo.saw(m)
}

@OptIn(FlowPreview::class, ExperimentalCoroutinesApi::class)
@HiltViewModel
class CaptureViewModel @Inject constructor(
    private val repo: AssistantRepository,
    private val log: aiimin.core.data.ai.CaptureLog,
    private val settings: aiimin.core.data.settings.SettingsStore,
) : ViewModel() {
    val text = MutableStateFlow("")
    /** The type the person picked on the chooser; reset whenever the text changes. */
    val forced = MutableStateFlow<aiimin.core.nlp.Kind?>(null)
    val preview: StateFlow<List<Action>> = kotlinx.coroutines.flow.combine(text.debounce(180), forced) { t, f -> t to f }
        .mapLatest { (t, f) -> repo.preview(t, f) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

    suspend fun save(): List<Source> {
        val list = repo.preview(text.value, forced.value)
        val created = repo.execute(list, "capture")
        log.record(text.value, created)
        text.value = ""
        return created
    }

    /** Save exactly these (the person may have removed or edited some on the review sheet). */
    suspend fun saveActions(list: List<Action>): List<Source> {
        val created = repo.execute(list, "capture")
        log.record(text.value, created)
        // First-week ladder: "Say one capture" is done (PRD 1.2).
        if (created.isNotEmpty() && !settings.current().firstCaptureDone) settings.update { it.copy(firstCaptureDone = true) }
        text.value = ""
        return created
    }

    fun revert(created: List<Source>) = viewModelScope.launch { repo.revert(created) }
}

@HiltViewModel
class RecentCapturesViewModel @Inject constructor(private val log: aiimin.core.data.ai.CaptureLog) : ViewModel() {
    val recent = log.recent
    init { log.refresh() }
    fun undo(id: String) = viewModelScope.launch { log.undo(id) }
}
