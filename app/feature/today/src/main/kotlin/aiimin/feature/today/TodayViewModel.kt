package aiimin.feature.today

import android.content.Intent
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import aiimin.core.data.AgendaState
import aiimin.core.data.AgendaStore
import aiimin.core.data.DayQuoteRepository
import aiimin.core.data.DayStore
import aiimin.core.data.NoteState
import aiimin.core.data.NoteStore
import aiimin.core.data.PublishedLifeScoreState
import aiimin.core.data.PublishedLifeScoreStore
import aiimin.core.data.device.DeviceMetrics
import aiimin.core.data.device.DeviceMetricsRepository
import aiimin.core.data.device.StepsStatus
import aiimin.core.data.sync.GraphSyncRepository
import aiimin.core.model.CommitmentShape
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

/**
 * Today's one job: **act on this day.**
 *
 * Device metrics + API graph pull. Habit ticks enqueue for `/mobile/sync/batch`.
 * Agenda / notes / published Life Score are read-only strips from GraphSync.
 */
@HiltViewModel
class TodayViewModel @Inject constructor(
    private val store: DayStore,
    private val device: DeviceMetricsRepository,
    private val sync: GraphSyncRepository,
    private val quotes: DayQuoteRepository,
    agendaStore: AgendaStore,
    noteStore: NoteStore,
    publishedLifeScore: PublishedLifeScoreStore,
) : ViewModel() {

    val state: StateFlow<aiimin.core.data.DayState> = store.state
    val deviceMetrics: StateFlow<DeviceMetrics> = device.state
    val dayQuote: StateFlow<String> = quotes.quote
    val agenda: StateFlow<AgendaState> = agendaStore.state
    val notes: StateFlow<NoteState> = noteStore.state
    val publishedScore: StateFlow<PublishedLifeScoreState> = publishedLifeScore.state
    val focusMinimums: StateFlow<Boolean> = store.focusMinimums

    private val _refreshing = MutableStateFlow(false)
    val refreshing: StateFlow<Boolean> = _refreshing.asStateFlow()

    init {
        device.start()
        store.clearIdentityMicroTask()
        viewModelScope.launch { quotes.ensureToday() }
        viewModelScope.launch {
            device.state.collectLatest { metrics ->
                if (metrics.stepsStatus != StepsStatus.LIVE) return@collectLatest
                val steps = metrics.steps ?: return@collectLatest
                if (steps <= 0L) return@collectLatest
                val walk = store.state.value.today.firstOrNull {
                    it.commitment.label.equals("Walk", ignoreCase = true) ||
                        it.commitment.unit.equals("steps", ignoreCase = true)
                } ?: return@collectLatest
                if (walk.commitment.shape == CommitmentShape.SHOW_UP) return@collectLatest
                store.setProgress(walk.commitment.id, steps.toDouble())
            }
        }
    }

    override fun onCleared() {
        device.stop()
        super.onCleared()
    }

    fun onToggle(commitmentId: Long) {
        val entry = store.state.value.today.firstOrNull { it.commitment.id == commitmentId } ?: return
        if (entry.commitment.shape != CommitmentShape.SHOW_UP) return
        val next = if (entry.observation.value == null || entry.observation.value == 0.0) 1.0 else null
        store.setProgress(commitmentId, next)
        val serverId = entry.commitment.serverId
        if (serverId != null) {
            if (next == 1.0) sync.enqueueHabitTick(serverId)
            else sync.enqueueHabitUntick(serverId)
            // Flush only — never refreshAll here (bootstrap lag resets the tick).
            viewModelScope.launch { sync.flushPendingMutations() }
        }
    }

    fun onRecordValue(commitmentId: Long, value: Double?) = store.setProgress(commitmentId, value)

    fun adjustStepsGoal(delta: Long) {
        val next = device.adjustStepsTarget(delta)
        store.setWalkStepsTarget(next)
    }

    fun adjustScreenGoal(delta: Long) {
        device.adjustScreenTarget(delta)
    }

    fun refreshDevice() = device.refresh()

    fun onScrollToMinimumsConsumed() = store.consumeFocusMinimums()

    fun onPullRefresh() {
        viewModelScope.launch {
            _refreshing.value = true
            device.refresh()
            sync.refreshAll()
            quotes.ensureToday()
            _refreshing.value = false
        }
    }

    fun needsActivityPermission(): Boolean = device.activityPermissionIntentNeeded()

    suspend fun needsHealthConnectPermission(): Boolean = device.needsHealthConnectPermission()

    fun healthConnectNeedsUpdate(): Boolean = device.healthConnectNeedsUpdate()

    fun healthConnectInstallIntent(): Intent = device.healthConnectInstallIntent()

    fun healthConnectSettingsIntent(): Intent? = device.healthConnectSettingsIntent()

    fun healthConnectManagePermissionsIntent(): Intent = device.healthConnectManagePermissionsIntent()

    fun healthConnectPermissionContract() = device.healthConnectPermissionContract()

    fun healthConnectPermissions() = device.healthConnectPermissions()

    fun usageAccessIntent(): Intent = device.usageAccessIntent()
}
