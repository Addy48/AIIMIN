package aiimin.feature.lab

import androidx.lifecycle.ViewModel
import aiimin.core.data.LabState
import aiimin.core.data.LabStore
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.StateFlow

/** One job: **ask, review, act on patterns.** */
@HiltViewModel
class LabViewModel @Inject constructor(
    private val store: LabStore,
) : ViewModel() {

    val state: StateFlow<LabState> = store.state

    fun onSelect(index: Int) = store.select(index)
}
