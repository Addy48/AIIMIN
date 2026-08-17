package aiimin.feature.today

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import aiimin.core.data.AgendaStore
import aiimin.core.data.JournalStore
import aiimin.core.data.LocalGraphSearch
import aiimin.core.data.MoneyStore
import aiimin.core.data.NoteStore
import aiimin.core.data.TimelineItem
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn

@HiltViewModel
class TimelineViewModel @Inject constructor(
    notes: NoteStore,
    journal: JournalStore,
    money: MoneyStore,
    agenda: AgendaStore,
) : ViewModel() {

    val rows: StateFlow<List<TimelineItem>> = combine(
        notes.state,
        journal.state,
        money.state,
        agenda.state,
    ) { n, j, m, a ->
        LocalGraphSearch.timeline(n.notes, j.entries, m.ledger, a.events)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
}
