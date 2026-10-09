package aiimin.feature.notes

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import aiimin.core.data.NoteState
import aiimin.core.data.NoteStore
import aiimin.core.data.sync.GraphSyncRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

/**
 * One job: **park and keep thoughts** — compose · pin · sync.
 */
@HiltViewModel
class NotesViewModel @Inject constructor(
    private val notes: NoteStore,
    private val sync: GraphSyncRepository,
) : ViewModel() {

    val state: StateFlow<NoteState> = notes.state

    fun onNew() = notes.startNew()
    fun onEdit(id: String) = notes.startEdit(id)
    fun onCancel() = notes.cancelCompose()
    fun onTitle(value: String) = notes.setDraftTitle(value)
    fun onBody(value: String) = notes.setDraftBody(value)

    fun onSave() {
        val item = notes.saveDraft() ?: return
        sync.enqueueNote(
            id = item.id,
            title = item.title,
            content = item.content,
            pinned = item.pinned,
        )
        viewModelScope.launch { sync.flushPendingMutations() }
    }

    fun onTogglePin(id: String) {
        notes.togglePin(id)
        val note = notes.state.value.notes.firstOrNull { it.id == id } ?: return
        sync.enqueueNote(
            id = note.id,
            title = note.title,
            content = note.content,
            pinned = note.pinned,
        )
        viewModelScope.launch { sync.flushPendingMutations() }
    }

    fun onDelete(id: String) {
        notes.deleteLocal(id)
        sync.enqueueNoteDelete(id)
        viewModelScope.launch { sync.flushPendingMutations() }
    }

    fun onDismissNotice() = notes.dismissNotice()
}
