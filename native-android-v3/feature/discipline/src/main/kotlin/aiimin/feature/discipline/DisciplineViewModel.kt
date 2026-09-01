package aiimin.feature.discipline

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import aiimin.core.data.BlockRules
import aiimin.core.data.DisciplineStore
import aiimin.core.data.sync.GraphSyncRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class DisciplineUiState(
    val streakDays: Int = 0,
    val totalLogs: Int = 0,
    val category: String = "screen",
    val intensity: Int = 3,
    val note: String = "",
    val lastOutcome: String? = null,
    val lastLoggedAt: Long? = null,
    val notice: String? = null,
    val blockApps: List<BlockAppTarget> = emptyList(),
    val blockedPackages: Set<String> = emptySet(),
)

data class BlockAppTarget(
    val packageName: String,
    val label: String,
)

@HiltViewModel
class DisciplineViewModel @Inject constructor(
    private val store: DisciplineStore,
    private val sync: GraphSyncRepository,
    @ApplicationContext private val context: Context,
) : ViewModel() {
    private val _blockApps = kotlinx.coroutines.flow.MutableStateFlow(loadBlockApps())
    private val _blockedPackages = kotlinx.coroutines.flow.MutableStateFlow(BlockRules.blockedPackages(context))

    val state: StateFlow<DisciplineUiState> = store.state.map { value ->
        DisciplineUiState(
            streakDays = value.streakDays,
            totalLogs = value.totalLogs,
            category = value.category,
            intensity = value.intensity,
            note = value.note,
            lastOutcome = value.lastOutcome,
            lastLoggedAt = value.lastLoggedAt,
            notice = value.notice,
            blockApps = _blockApps.value,
            blockedPackages = _blockedPackages.value,
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), DisciplineUiState())

    fun setCategory(value: String) = viewModelScope.launch { store.setCategory(value) }
    fun setIntensity(value: Int) = viewModelScope.launch { store.setIntensity(value) }
    fun setNote(value: String) = viewModelScope.launch { store.setNote(value) }
    fun dismissNotice() = viewModelScope.launch { store.dismissNotice() }

    fun toggleBlockedPackage(packageName: String) {
        val next = _blockedPackages.value.toMutableSet().apply {
            if (!add(packageName)) remove(packageName)
        }.toSet()
        _blockedPackages.value = next
        BlockRules.setBlockedPackages(context, next)
    }

    private fun loadBlockApps(): List<BlockAppTarget> {
        val launcher = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER)
        return context.packageManager.queryIntentActivities(launcher, PackageManager.MATCH_ALL)
            .mapNotNull { info ->
                val packageName = info.activityInfo?.packageName ?: return@mapNotNull null
                if (packageName == context.packageName) return@mapNotNull null
                BlockAppTarget(packageName, info.loadLabel(context.packageManager).toString())
            }
            .distinctBy { it.packageName }
            .sortedBy { it.label.lowercase() }
            .take(32)
    }

    fun logOutcome(outcome: String) = viewModelScope.launch {
        val draft = store.logOutcome(outcome)
        sync.enqueueDisciplineEvent(
            id = draft.id,
            category = draft.category,
            intensity = draft.intensity,
            outcome = draft.outcome,
            note = draft.note,
            startedAt = draft.startedAt,
            resolvedAt = draft.resolvedAt,
        )
    }
}
