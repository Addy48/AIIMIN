package aiimin.feature.money

import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import aiimin.core.data.MoneyStore
import aiimin.core.data.MoneyTab
import aiimin.core.data.money.MoneyImportRepository
import aiimin.core.data.money.PaymentDraftSource
import aiimin.core.data.money.PaymentInboxState
import aiimin.core.data.money.PaymentInboxStore
import aiimin.core.data.money.TransactionalSmsScanner
import aiimin.core.data.sync.GraphSyncRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

/**
 * Money's one job: **log and see money truth.**
 *
 * Ingest paths (opt-in SMS · share · paste · AI text · spreadsheet · manual).
 * Nothing hits the website until Approve (or signed-in AI/sheet import).
 */
@HiltViewModel
class MoneyViewModel @Inject constructor(
    private val store: MoneyStore,
    private val inbox: PaymentInboxStore,
    private val sync: GraphSyncRepository,
    private val smsScanner: TransactionalSmsScanner,
    private val importer: MoneyImportRepository,
    private val config: aiimin.core.data.ConfigStore,
) : ViewModel() {

    val state: StateFlow<aiimin.core.data.MoneyState> = store.state
    val inboxState: StateFlow<PaymentInboxState> = inbox.state
    val tier: StateFlow<aiimin.core.model.SubscriptionTier> = config.state
        .map { it.identity.tier }
        .stateIn(
            viewModelScope,
            SharingStarted.WhileSubscribed(5_000),
            config.state.value.identity.tier,
        )

    private val _pasteDraft = MutableStateFlow("")
    val pasteDraft: StateFlow<String> = _pasteDraft.asStateFlow()

    private val _pasteNotice = MutableStateFlow<String?>(null)
    val pasteNotice: StateFlow<String?> = _pasteNotice.asStateFlow()

    private val _refreshing = MutableStateFlow(false)
    val refreshing: StateFlow<Boolean> = _refreshing.asStateFlow()

    private val _manualAmount = MutableStateFlow("")
    val manualAmount: StateFlow<String> = _manualAmount.asStateFlow()

    private val _manualName = MutableStateFlow("")
    val manualName: StateFlow<String> = _manualName.asStateFlow()

    private val _manualExpense = MutableStateFlow(true)
    val manualExpense: StateFlow<Boolean> = _manualExpense.asStateFlow()

    private val _smsEnabled = MutableStateFlow(false)
    val smsEnabled: StateFlow<Boolean> = _smsEnabled.asStateFlow()

    private val _smsHasPermission = MutableStateFlow(false)
    val smsHasPermission: StateFlow<Boolean> = _smsHasPermission.asStateFlow()

    private val _importBusy = MutableStateFlow(false)
    val importBusy: StateFlow<Boolean> = _importBusy.asStateFlow()

    init {
        viewModelScope.launch {
            inbox.sharedRaw.collect { raw ->
                if (!raw.isNullOrBlank() && _pasteDraft.value.isBlank()) {
                    _pasteDraft.value = raw
                    inbox.consumeSharedRaw()
                    _pasteNotice.value = "Shared / AI text ready — Queue draft or Run AI import."
                }
            }
        }
        viewModelScope.launch { refreshSmsFlags() }
    }

    fun refreshSmsFlags() {
        viewModelScope.launch {
            _smsHasPermission.value = smsScanner.hasReadPermission()
            _smsEnabled.value = smsScanner.isOptInEnabled()
        }
    }

    fun onSelectTab(tab: MoneyTab) = store.setTab(tab)

    fun onPasteDraftChange(value: String) = _pasteDraft.update { value }

    fun onManualAmountChange(value: String) =
        _manualAmount.update { value.filter { ch -> ch.isDigit() }.take(9) }

    fun onManualNameChange(value: String) = _manualName.update { value.take(48) }

    fun onManualExpenseChange(expense: Boolean) = _manualExpense.update { expense }

    fun onSubmitPaste() {
        val raw = _pasteDraft.value
        val ok = inbox.ingest(raw, PaymentDraftSource.PASTE)
        _pasteNotice.value = if (ok) {
            "Draft queued — approve below."
        } else {
            "No payment amount found. Use AI import for messy text, or Manual entry."
        }
        if (ok) _pasteDraft.value = ""
    }

    fun onSubmitManual() {
        val amount = _manualAmount.value.toIntOrNull() ?: 0
        val ok = inbox.enqueueManual(
            amountInr = amount,
            name = _manualName.value,
            expense = _manualExpense.value,
        )
        _pasteNotice.value = if (ok) {
            "Manual draft queued — Approve below."
        } else {
            "Enter a positive amount (rupees)."
        }
        if (ok) {
            _manualAmount.value = ""
            _manualName.value = ""
        }
    }

    fun onEnableSmsOptIn(granted: Boolean) {
        viewModelScope.launch {
            if (!granted) {
                _pasteNotice.value = "SMS permission denied — use paste, AI, Excel, or Manual."
                _smsHasPermission.value = false
                return@launch
            }
            smsScanner.setOptIn(true)
            _smsEnabled.value = true
            _smsHasPermission.value = true
            _pasteNotice.value = "SMS opt-in on — scanning transactional alerts…"
            runSmsScan()
        }
    }

    fun onDisableSms() {
        viewModelScope.launch {
            smsScanner.setOptIn(false)
            _smsEnabled.value = false
            _pasteNotice.value = "SMS scan off — other import paths still work."
        }
    }

    fun onScanSms() {
        viewModelScope.launch { runSmsScan() }
    }

    private suspend fun runSmsScan() {
        val result = smsScanner.scanRecent()
        _pasteNotice.value = when {
            result.permissionDenied -> "Allow SMS to scan bank alerts (transactional only)."
            result.optInOff -> "Turn on SMS opt-in first."
            result.error != null -> result.error
            result.queued > 0 -> "SMS · ${result.queued} drafts from ${result.scanned} messages — Approve below."
            else -> "SMS · scanned ${result.scanned} · no new transactional alerts."
        }
        refreshSmsFlags()
    }

    fun onRunAiImport() {
        val text = _pasteDraft.value
        if (text.isBlank()) {
            _pasteNotice.value = "Paste chat / SMS / notes text first."
            return
        }
        viewModelScope.launch {
            _importBusy.value = true
            when (val out = importer.importAiText(text)) {
                is MoneyImportRepository.ImportOutcome.Ok -> {
                    _pasteNotice.value = out.message
                    if (out.remoteCount > 0 || out.localDrafts == 0 && out.message.contains("imported", true)) {
                        _pasteDraft.value = ""
                    } else if (out.localDrafts > 0) {
                        _pasteDraft.value = ""
                    }
                }
                is MoneyImportRepository.ImportOutcome.Fail -> _pasteNotice.value = out.message
            }
            _importBusy.value = false
        }
    }

    fun onImportUri(uri: Uri?) {
        if (uri == null) return
        viewModelScope.launch {
            _importBusy.value = true
            when (val out = importer.importUri(uri)) {
                is MoneyImportRepository.ImportOutcome.Ok -> _pasteNotice.value = out.message
                is MoneyImportRepository.ImportOutcome.Fail -> _pasteNotice.value = out.message
            }
            _importBusy.value = false
        }
    }

    fun onApproveDraft(id: String) {
        viewModelScope.launch {
            val approved = inbox.approve(id) ?: return@launch
            val result = sync.pushMoneyTransaction(
                name = approved.name,
                amountInr = approved.amountInr,
                category = approved.category,
                dateIso = approved.dateIso,
                type = approved.type,
                clientKey = approved.clientKey,
            )
            if (result.isSuccess) {
                _pasteNotice.value = "Approved · synced to aiimin.in"
                sync.refreshAll()
            } else {
                _pasteNotice.value = "Approved locally · queued for sync when online"
            }
        }
    }

    fun onDismissDraft(id: String) = inbox.dismiss(id)

    fun clearPasteNotice() = _pasteNotice.update { null }

    fun onPullRefresh() {
        viewModelScope.launch {
            _refreshing.value = true
            if (_smsEnabled.value && _smsHasPermission.value) {
                runSmsScan()
            }
            sync.refreshAll()
            _refreshing.value = false
        }
    }
}
