package aiimin.feature.config

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import aiimin.core.data.ConfigStore
import aiimin.core.data.DayStore
import aiimin.core.model.LifeMode
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

/**
 * Config's one job: **configure the OS.**
 *
 * Prefs live in [ConfigStore]; life mode in [DayStore] so Today reweights the
 * same afternoon. Nothing here deletes an account or hits `/api` (G6/G7).
 */
@HiltViewModel
class ConfigViewModel @Inject constructor(
    private val config: ConfigStore,
    private val day: DayStore,
) : ViewModel() {

    val state: StateFlow<ConfigUiState> = combine(config.state, day.state) { prefs, dayState ->
        ConfigUiState(prefs = prefs, lifeMode = dayState.mode)
    }.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5_000),
        ConfigUiState(prefs = config.state.value, lifeMode = day.state.value.mode),
    )

    fun onToggleTheme() = config.toggleTheme()

    fun onToggleReduceMotion() = config.toggleReduceMotion()

    fun onSelectMode(mode: LifeMode) = day.setMode(mode)

    fun onSyncNow() {
        config.syncNow()
        viewModelScope.launch {
            delay(900)
            config.finishSync()
        }
    }

    fun onOpenMinimums() = config.setNotice(
        "Daily minimums live on Today. Edit them there after calibration.",
    )

    fun onOpenConnections() = config.setNotice(
        "Connections need the live account graph. Listed here as seed labels only.",
    )

    fun onExport() = config.setNotice(
        "Export needs the live API. Nothing left this device.",
    )

    fun onOpenDelete() = config.openDelete()

    fun onCloseDelete() = config.closeDelete()

    fun onDeleteDraft(value: String) = config.setDeleteDraft(value)

    fun onConfirmDelete() = config.refuseDelete(config.state.value.deleteDraft)

    fun onDismissNotice() = config.clearNotice()
}

data class ConfigUiState(
    val prefs: aiimin.core.data.ConfigState,
    val lifeMode: LifeMode,
)
