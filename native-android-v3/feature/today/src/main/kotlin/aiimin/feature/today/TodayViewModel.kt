package aiimin.feature.today

import androidx.lifecycle.ViewModel
import aiimin.core.data.DayStore
import aiimin.core.model.CommitmentShape
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.StateFlow

/**
 * Today's one job: **act on this day.**
 *
 * There is no state of its own here on purpose. Today is a read of the shared
 * day plus four verbs; inventing a private copy is how two surfaces start
 * telling a user different stories about the same afternoon.
 */
@HiltViewModel
class TodayViewModel @Inject constructor(
    private val store: DayStore,
) : ViewModel() {

    val state: StateFlow<aiimin.core.data.DayState> = store.state

    /**
     * Tick a pursuit, or reopen it.
     *
     * Quantities are not ticked — a walk is however many steps it was, and the
     * attainment curve decides what that is worth. Only SHOW_UP commitments are
     * binary, because presence genuinely is.
     */
    fun onToggle(commitmentId: Long) {
        val entry = store.state.value.today.firstOrNull { it.commitment.id == commitmentId } ?: return
        if (entry.commitment.shape != CommitmentShape.SHOW_UP) return
        val next = if (entry.observation.value == null || entry.observation.value == 0.0) 1.0 else null
        store.setProgress(commitmentId, next)
    }

    fun onRecordValue(commitmentId: Long, value: Double?) = store.setProgress(commitmentId, value)

    fun onMicroTaskChange(text: String) = store.setMicroTask(text)
}
