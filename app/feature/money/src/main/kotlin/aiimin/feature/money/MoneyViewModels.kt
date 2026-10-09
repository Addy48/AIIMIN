package aiimin.feature.money

import aiimin.core.data.core.DayClock
import aiimin.core.data.money.Ledger
import aiimin.core.data.money.MonthMoney
import aiimin.core.data.money.MoneyRepository
import aiimin.core.data.vault.FamilyRepository
import aiimin.core.data.vault.ME
import aiimin.core.data.vault.VaultRepository
import aiimin.core.database.BudgetEntity
import aiimin.core.database.PersonEntity
import aiimin.core.database.TxnEntity
import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import java.io.File
import java.time.LocalDate
import java.time.YearMonth
import javax.inject.Inject
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

@OptIn(ExperimentalCoroutinesApi::class)
@HiltViewModel
class MoneyViewModel @Inject constructor(
    private val money: MoneyRepository,
    private val clock: DayClock,
) : ViewModel() {
    val today = MutableStateFlow(LocalDate.now())
    val ledger = MutableStateFlow(Ledger.PERSONAL)
    val month = MutableStateFlow(YearMonth.now())

    val data: StateFlow<MonthMoney?> = combine(month, ledger, today) { m, l, t -> Triple(m, l, t) }
        .flatMapLatest { (m, l, t) -> money.month(m, l, t) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)

    init {
        viewModelScope.launch {
            val t = clock.today()
            today.value = t
            month.value = YearMonth.from(t)
            money.ensureBudgetCarried()
        }
    }

    fun shift(by: Long) { month.value = month.value.plusMonths(by).let { if (it > YearMonth.from(today.value)) YearMonth.from(today.value) else it } }

    suspend fun add(paise: Long, dir: String, title: String, category: String, ledger: Ledger, day: LocalDate, note: String) =
        money.add(paise, dir, title, category, ledger, day = day, note = note)

    suspend fun capture(text: String) = money.capture(text, "paste")
    suspend fun delete(id: String) = money.delete(id)
    fun restore(t: TxnEntity) = viewModelScope.launch { money.restore(t) }
    suspend fun export(): File = money.exportCsv(month.value, ledger.value)
}

@HiltViewModel
class InboxViewModel @Inject constructor(private val money: MoneyRepository) : ViewModel() {
    val pending = money.pending().stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    suspend fun settle(id: String, category: String, ledger: Ledger, title: String, learn: Boolean) = money.settle(id, category, ledger, title, learn)
    fun dismiss(id: String) = viewModelScope.launch { money.dismiss(id) }
}

@HiltViewModel
class TxnViewModel @Inject constructor(
    private val money: MoneyRepository,
    private val vault: VaultRepository,
    family: FamilyRepository,
) : ViewModel() {
    val txn = MutableStateFlow<TxnEntity?>(null)
    val people: StateFlow<List<PersonEntity>> = family.people.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    val receiptTitle = MutableStateFlow<String?>(null)

    fun load(id: String) = viewModelScope.launch {
        txn.value = money.get(id)
        receiptTitle.value = txn.value?.receiptDocId?.let { vault.get(it)?.title }
    }

    fun save(t: TxnEntity, learn: Boolean) = viewModelScope.launch {
        money.update(t, learn)
        txn.value = t
    }

    suspend fun delete(id: String) = money.delete(id)
    fun restore(t: TxnEntity) = viewModelScope.launch { money.restore(t) }

    fun gift(hideFrom: String?, reveal: LocalDate?) = viewModelScope.launch {
        val t = txn.value ?: return@launch
        money.setGift(t.id, hideFrom, reveal)
        txn.value = money.get(t.id)
    }

    /** Receipts live in the vault (Household for shared spends), linked both ways. */
    suspend fun attachReceipt(uri: Uri) {
        val t = txn.value ?: return
        val owner = if (t.ledger == "HOUSEHOLD") "household" else ME
        val r = vault.import(uri, owner, titleHint = "Receipt · ${t.title}")
        money.linkReceipt(t.id, r.docId)
        txn.value = money.get(t.id)
        receiptTitle.value = vault.get(r.docId)?.title
    }
}

@HiltViewModel
class BudgetViewModel @Inject constructor(private val money: MoneyRepository, private val clock: DayClock) : ViewModel() {
    val current = MutableStateFlow<BudgetEntity?>(null)

    init {
        viewModelScope.launch {
            val today = clock.today()
            current.value = money.month(YearMonth.from(today), Ledger.PERSONAL, today).first().budget
        }
    }

    suspend fun save(total: Long, fixed: Long, caps: Map<String, Long>): YearMonth = money.setBudget(total, fixed, caps)
}
