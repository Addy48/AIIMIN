package aiimin.feature.config

import android.content.ClipData
import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.core.content.FileProvider
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import aiimin.core.data.ConfigStore
import aiimin.core.data.DayStore
import aiimin.core.data.DiscoveryState
import aiimin.core.data.DiscoveryStore
import aiimin.core.data.LabStore
import aiimin.core.data.JournalStore
import aiimin.core.data.knock.KnockStore
import aiimin.core.data.MoneyStore
import aiimin.core.data.OnboardingStore
import aiimin.core.data.SyncState
import aiimin.core.data.device.DeviceMetrics
import aiimin.core.data.device.DeviceMetricsRepository
import aiimin.core.data.export.LifeExport
import aiimin.core.data.money.ConnectionKind
import aiimin.core.data.money.ConnectionsState
import aiimin.core.data.money.ConnectionsStore
import aiimin.core.data.money.PaymentDraftSource
import aiimin.core.data.money.PaymentInboxState
import aiimin.core.data.money.PaymentInboxStore
import aiimin.core.data.session.AuthRepository
import aiimin.core.data.sync.GraphSyncRepository
import aiimin.core.data.UserGraphReset
import aiimin.core.model.LifeMode
import aiimin.core.model.SubscriptionTier
import aiimin.core.network.BillingRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import java.io.File
import javax.inject.Inject
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

/**
 * Config's one job: **configure the OS.**
 *
 * Prefs live in [ConfigStore]; life mode in [DayStore] so Today reweights the
 * same afternoon. Device grants for steps / screen time live here as opt-in.
 * Export builds a full AI-ready pack (TXT + JSON) with proper URI grants so
 * WhatsApp / Drive / Files actually receive the file — not only EXTRA_TEXT.
 */
@HiltViewModel
class ConfigViewModel @Inject constructor(
    @param:ApplicationContext private val appContext: Context,
    private val config: ConfigStore,
    private val day: DayStore,
    private val lab: LabStore,
    private val money: MoneyStore,
    private val journal: JournalStore,
    private val onboarding: OnboardingStore,
    private val device: DeviceMetricsRepository,
    private val connections: ConnectionsStore,
    private val paymentInbox: PaymentInboxStore,
    private val sync: GraphSyncRepository,
    private val auth: AuthRepository,
    private val graphReset: UserGraphReset,
    private val billing: BillingRepository,
    private val discovery: DiscoveryStore,
    private val knocks: KnockStore,
) : ViewModel() {

    val state: StateFlow<ConfigUiState> = combine(
        config.state,
        day.state,
        connections.state,
        sync.ui,
        knocks.prefs,
    ) { prefs, dayState, conn, syncUi, knock ->
        val pending = syncUi.pendingOutbox
        val meta = when {
            syncUi.isSyncing -> "Pulling the graph…"
            pending > 0 && prefs.sync == SyncState.LIVE ->
                "${prefs.syncMeta.substringBefore(" · pending").substringBefore(" · API")} · API · $pending pending"
            syncUi.lastError != null && prefs.sync == SyncState.HELD -> prefs.syncMeta
            else -> prefs.syncMeta
        }
        ConfigUiState(
            prefs = prefs.copy(
                connectionsLabel = conn.summaryLabel,
                syncMeta = meta,
                notificationsLabel = knock.summary,
            ),
            lifeMode = dayState.mode,
            connections = conn,
        )
    }.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5_000),
        ConfigUiState(
            prefs = config.state.value,
            lifeMode = day.state.value.mode,
            connections = connections.state.value,
        ),
    )

    val deviceMetrics: StateFlow<DeviceMetrics> = device.state
    val paymentInboxState: StateFlow<PaymentInboxState> = paymentInbox.state
    val discoveryState: StateFlow<DiscoveryState> = discovery.state

    init {
        device.start()
        viewModelScope.launch { discovery.hydrate() }
    }

    fun onDismissDiscovery(id: String) {
        viewModelScope.launch { discovery.dismiss(id) }
    }

    fun onToggleTheme() = config.toggleTheme()

    fun onToggleReduceMotion() = config.toggleReduceMotion()

    fun onToggleBiometric() = config.toggleBiometric()

    fun onSelectMode(mode: LifeMode) = day.setMode(mode)

    fun onSelectPlan(tier: SubscriptionTier) {
        viewModelScope.launch {
            val result = billing.selectTier(tier.id)
            result.fold(
                onSuccess = { snap ->
                    config.setSubscriptionTier(
                        tier = SubscriptionTier.fromId(snap.tierId),
                        periodEndIso = snap.periodEndIso,
                        upgradeOnly = snap.upgradeOnly,
                        notice = "Plan · ${SubscriptionTier.fromId(snap.tierId).label} · synced with aiimin.in",
                    )
                },
                onFailure = { e ->
                    val msg = e.message.orEmpty()
                    when {
                        msg.contains("Downgrades disabled") || msg.contains("Billing checkout") -> {
                            config.setNotice(msg)
                        }
                        msg == "offline" || msg.isEmpty() -> {
                            // Unsigned / offline — same local instant-apply as before.
                            config.setSubscriptionTier(
                                tier = tier,
                                notice = "Plan · ${tier.label} · on device (sign in to sync web)",
                            )
                        }
                        else -> {
                            config.setSubscriptionTier(
                                tier = tier,
                                notice = "Plan · ${tier.label} · on device · $msg",
                            )
                        }
                    }
                },
            )
        }
    }

    fun onOpenPlan(focus: SubscriptionTier? = null) {
        config.requestOpenPlan(focus)
        viewModelScope.launch {
            billing.refreshStatus()?.let { snap ->
                config.applyBillingStatus(
                    tier = SubscriptionTier.fromId(snap.tierId),
                    periodEndIso = snap.periodEndIso,
                    upgradeOnly = snap.upgradeOnly,
                )
            }
        }
    }

    fun onDismissPlan() = config.dismissPlanSheet()

    val openPlan: StateFlow<Boolean> = config.openPlan
    val planFocus: StateFlow<SubscriptionTier?> = config.planFocus

    fun onSyncNow() {
        viewModelScope.launch {
            config.syncNow()
            val result = sync.refreshAll()
            result.fold(
                onSuccess = { /* GraphSyncRepository already flipped ConfigStore */ },
                onFailure = { e ->
                    config.setNotice(e.message ?: "Sync failed")
                },
            )
            device.refresh()
        }
    }

    fun onSignOut() {
        viewModelScope.launch {
            auth.signOut()
            graphReset.resetForSignOut()
            onboarding.replay()
            config.setNotice("Signed out · sign in with OS-ID or email")
        }
    }

    fun onReplayCalibration() {
        graphReset.resetForSignOut()
        onboarding.replay()
    }

    /** Same list as Today — never a second catalog or a dead-end toast. */
    fun onOpenMinimums() = day.requestFocusMinimums()

    fun onAddConnection(label: String, kind: ConnectionKind) = connections.add(label, kind)

    fun onRemoveConnection(id: String) = connections.remove(id)

    fun onOpenMoneyForSms() {
        paymentInbox.requestOpenMoney()
        config.setNotice("Money · tap Allow SMS for transactional bank alerts")
    }

    fun onPastePaymentAlert(raw: String) {
        val ok = paymentInbox.ingest(raw, PaymentDraftSource.PASTE)
        config.setNotice(
            if (ok) "Payment draft queued · review on Money"
            else "Could not read a payment amount in that text.",
        )
    }

    fun onExport(rangeDays: Int = 7) {
        viewModelScope.launch {
            config.setNotice("Building AI export pack · ${rangeDays}d…")
            val ok = withContext(Dispatchers.IO) { writeAndShareExport(rangeDays) }
            if (!ok) {
                config.setNotice("Export failed — could not write or share the pack.")
            } else {
                config.setNotice("Share sheet opened · ${rangeDays}d pack attached.")
            }
        }
    }

    /** Almost-true 10-day phone + score + Lab sample for thorough QA. Today stays live. */
    fun loadTenDaySample() {
        device.loadTenDaySample()
        day.loadTenDaySampleHistory()
        lab.loadTenDaySample()
        config.setNotice("Sample · 10 days loaded · Today still live · Lab + export use sample past")
    }

    fun clearTenDaySample() {
        device.clearTenDaySample()
        day.clearSampleHistory()
        lab.resetToSeed()
        config.setNotice("Sample cleared · seed Lab restored")
    }

    /**
     * WhatsApp / many targets drop EXTRA_STREAM unless ClipData carries the URI
     * and FLAG_GRANT_READ_URI_PERMISSION is set on the chooser. `.md` is often
     * rejected — ship markdown body as `.txt` (universal) + `.json` twin.
     */
    private suspend fun writeAndShareExport(rangeDays: Int): Boolean {
        return try {
            val window = rangeDays.coerceIn(1, 30)
            val phoneDays = device.phoneHistory(window)
            val bundle = LifeExport.build(
                config = config.state.value.copy(
                    connectionsLabel = connections.state.value.summaryLabel,
                ),
                day = day.state.value,
                money = money.state.value,
                journal = journal.state.value,
                device = device.state.value,
                rangeDays = window,
                phoneDays = phoneDays,
            )
            val dir = File(appContext.cacheDir, "exports").apply { mkdirs() }
            // .txt carries the full Markdown — works in WhatsApp, Drive, Files, Mail.
            val txtFile = File(dir, "${bundle.fileStem}.txt")
            val jsonFile = File(dir, "${bundle.fileStem}.json")
            txtFile.writeText(bundle.markdown)
            jsonFile.writeText(bundle.json)

            val authority = "${appContext.packageName}.files"
            val txtUri = FileProvider.getUriForFile(appContext, authority, txtFile)
            val jsonUri = FileProvider.getUriForFile(appContext, authority, jsonFile)

            // Primary: single text/plain stream (highest compatibility).
            val primary = Intent(Intent.ACTION_SEND).apply {
                type = "text/plain"
                putExtra(Intent.EXTRA_STREAM, txtUri)
                putExtra(Intent.EXTRA_SUBJECT, "AIIMIN life export · ${bundle.fileStem}")
                putExtra(
                    Intent.EXTRA_TEXT,
                    "AIIMIN life export attached as .txt (full Markdown context). " +
                        "JSON twin also in the pack folder if your app accepts multiple files.",
                )
                clipData = ClipData.newUri(appContext.contentResolver, "AIIMIN export", txtUri)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }

            // Also offer multi when the target supports it (Drive, Files, Slack…).
            val multi = Intent(Intent.ACTION_SEND_MULTIPLE).apply {
                type = "*/*"
                putParcelableArrayListExtra(
                    Intent.EXTRA_STREAM,
                    arrayListOf(txtUri, jsonUri),
                )
                putExtra(Intent.EXTRA_SUBJECT, "AIIMIN life export · ${bundle.fileStem}")
                val clip = ClipData.newUri(appContext.contentResolver, "AIIMIN txt", txtUri)
                clip.addItem(ClipData.Item(jsonUri))
                clipData = clip
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }

            val chooser = Intent.createChooser(primary, "Export AIIMIN pack").apply {
                putExtra(Intent.EXTRA_INITIAL_INTENTS, arrayOf(multi))
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
            // Grant read to every package that could resolve the chooser.
            grantUriToResolvers(primary, txtUri)
            grantUriToResolvers(multi, txtUri)
            grantUriToResolvers(multi, jsonUri)

            appContext.startActivity(chooser)
            true
        } catch (e: Exception) {
            android.util.Log.w("AiiminExport", "share failed: ${e.message}")
            false
        }
    }

    private fun grantUriToResolvers(intent: Intent, uri: Uri) {
        val matches = appContext.packageManager.queryIntentActivities(intent, 0)
        for (info in matches) {
            appContext.grantUriPermission(
                info.activityInfo.packageName,
                uri,
                Intent.FLAG_GRANT_READ_URI_PERMISSION,
            )
        }
    }

    fun onOpenDelete() = config.openDelete()

    fun onCloseDelete() = config.closeDelete()

    fun onDeleteDraft(value: String) = config.setDeleteDraft(value)

    fun onConfirmDelete() = config.refuseDelete(config.state.value.deleteDraft)

    fun onDismissNotice() = config.clearNotice()

    fun refreshDevice() = device.refresh()

    fun needsActivityPermission(): Boolean = device.activityPermissionIntentNeeded()

    suspend fun needsHealthConnectPermission(): Boolean = device.needsHealthConnectPermission()

    fun healthConnectNeedsUpdate(): Boolean = device.healthConnectNeedsUpdate()

    fun healthConnectPermissions(): Set<String> = device.healthConnectPermissions()

    fun healthConnectPermissionContract() = device.healthConnectPermissionContract()

    fun healthConnectInstallIntent() = device.healthConnectInstallIntent()

    fun healthConnectManagePermissionsIntent() = device.healthConnectManagePermissionsIntent()

    fun usageAccessIntent() = device.usageAccessIntent()
}

data class ConfigUiState(
    val prefs: aiimin.core.data.ConfigState,
    val lifeMode: LifeMode,
    val connections: ConnectionsState = ConnectionsState(),
)
