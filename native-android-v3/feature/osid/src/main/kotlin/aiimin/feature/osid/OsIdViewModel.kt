package aiimin.feature.osid

import androidx.lifecycle.ViewModel
import aiimin.core.data.ConfigStore
import aiimin.core.model.OsIdRules
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

/**
 * OS-ID's one job: **own your identifier.**
 *
 * Reads the claimed id from [ConfigStore]. Copy is local clipboard via the
 * screen callback — this VM only records that a copy was requested.
 */
@HiltViewModel
class OsIdViewModel @Inject constructor(
    private val config: ConfigStore,
) : ViewModel() {

    private val _state = MutableStateFlow(OsIdUiState.from(config.state.value))
    val state: StateFlow<OsIdUiState> = _state.asStateFlow()

    init {
        // Keep in sync if Config identity changes (seed only for now).
        _state.value = OsIdUiState.from(config.state.value)
    }

    fun onCopied() = _state.update {
        it.copy(notice = "Copied · ${it.osId}")
    }

    fun onDismissNotice() = _state.update { it.copy(notice = null) }
}

data class OsIdUiState(
    val osId: String,
    val holder: String,
    val issued: String,
    val memberNo: String,
    val tierLabel: String,
    val revisionsLeft: Int,
    val isValid: Boolean,
    val isSeed: Boolean,
    val notice: String? = null,
) {
    companion object {
        fun from(prefs: aiimin.core.data.ConfigState) = OsIdUiState(
            osId = prefs.identity.osId,
            holder = "A. UPADHYAY",
            issued = "14.03.25",
            memberNo = "#1204",
            tierLabel = prefs.identity.tierLabel,
            revisionsLeft = 1,
            isValid = OsIdRules.isValid(prefs.identity.osId),
            isSeed = prefs.isSeed,
        )
    }
}
