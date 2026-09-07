package aiimin.feature.today

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import aiimin.core.data.AgendaStore
import aiimin.core.data.GraphSearchResult
import aiimin.core.data.JournalStore
import aiimin.core.data.LocalGraphSearch
import aiimin.core.data.MoneyStore
import aiimin.core.data.NoteStore
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn

@HiltViewModel
class SearchViewModel @Inject constructor(
    notes: NoteStore,
    journal: JournalStore,
    money: MoneyStore,
    agenda: AgendaStore,
) : ViewModel() {

    private val _query = MutableStateFlow("")
    val query: StateFlow<String> = _query

    val result: StateFlow<GraphSearchResult> = combine(
        _query,
        notes.state,
        journal.state,
        money.state,
        agenda.state,
    ) { q, n, j, m, a ->
        LocalGraphSearch.search(q, n.notes, j.entries, m.ledger, a.events)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), GraphSearchResult.EMPTY)

    fun onQuery(value: String) {
        _query.value = value
    }
}
