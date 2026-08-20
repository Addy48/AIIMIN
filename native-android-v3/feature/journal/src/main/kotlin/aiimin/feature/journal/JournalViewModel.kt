package aiimin.feature.journal

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import aiimin.core.data.JournalState
import aiimin.core.data.JournalStore
import aiimin.core.data.JournalTemplate
import aiimin.core.data.sync.GraphSyncRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import java.time.LocalDate
import javax.inject.Inject
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

/** One job: **reflection capture.** */
@HiltViewModel
class JournalViewModel @Inject constructor(
    private val store: JournalStore,
    private val sync: GraphSyncRepository,
) : ViewModel() {

    val state: StateFlow<JournalState> = store.state

    fun onTemplate(template: JournalTemplate) = store.setTemplate(template)
    fun onDraft(value: String) = store.setDraft(value)
    fun onAppendDraft(value: String) = store.appendDraft(value)
    fun onQuery(value: String) = store.setQuery(value)
    fun onMood(mood: Int) = store.setMood(mood)
    fun onVoiceFailed() = store.voiceFailed()
    fun exportText(): String = store.exportText()

    fun onSave() {
        val snap = store.state.value
        val body = snap.draft.trim()
        val mood = snap.mood
        if (!store.save()) return
        sync.enqueueJournal(
            content = body,
            mood = mood,
            date = LocalDate.now().toString(),
        )
        viewModelScope.launch { sync.refreshAll() }
    }

    fun onDismissNotice() = store.dismissNotice()
}
