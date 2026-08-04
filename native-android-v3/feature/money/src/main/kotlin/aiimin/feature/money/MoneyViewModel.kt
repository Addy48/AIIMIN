package aiimin.feature.money

import androidx.lifecycle.ViewModel
import aiimin.core.data.MoneyStore
import aiimin.core.data.MoneyTab
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.StateFlow

/**
 * Money's one job: **log and see money truth.**
 *
 * No private copy of the ledger — Capture writes here too. Inventing a second
 * store is how Overview and Capture start disagreeing about the same spend.
 */
@HiltViewModel
class MoneyViewModel @Inject constructor(
    private val store: MoneyStore,
) : ViewModel() {

    val state: StateFlow<aiimin.core.data.MoneyState> = store.state

    fun onSelectTab(tab: MoneyTab) = store.setTab(tab)
}
