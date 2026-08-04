package aiimin.feature.journal

import androidx.lifecycle.ViewModel
import aiimin.core.data.JournalState
import aiimin.core.data.JournalStore
import aiimin.core.data.JournalTemplate
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.StateFlow

/** One job: **reflection capture.** */
@HiltViewModel
class JournalViewModel @Inject constructor(
    private val store: JournalStore,
) : ViewModel() {

    val state: StateFlow<JournalState> = store.state

    fun onTemplate(template: JournalTemplate) = store.setTemplate(template)
    fun onDraft(value: String) = store.setDraft(value)
    fun onMood(mood: Int) = store.setMood(mood)
    fun onSave() = store.save()
    fun onDismissNotice() = store.dismissNotice()
}
