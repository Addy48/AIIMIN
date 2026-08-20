package aiimin.feature.osid

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import aiimin.core.data.ConfigStore
import aiimin.core.model.OsIdRules
import aiimin.core.model.SubscriptionTier
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn

/**
 * OS-ID's one job: **own your identifier.**
 *
 * Reads the claimed id from [ConfigStore]. Copy is local clipboard via the
 * screen callback — this VM only records that a copy was requested.
 */
@HiltViewModel
class OsIdViewModel @Inject constructor(
    config: ConfigStore,
) : ViewModel() {

    private val notice = MutableStateFlow<String?>(null)

    val state: StateFlow<OsIdUiState> = combine(config.state, notice) { prefs, n ->
        OsIdUiState.from(prefs).copy(notice = n)
    }.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5_000),
        OsIdUiState.from(config.state.value),
    )

    fun onCopied() {
        notice.value = "Copied · ${state.value.osId}"
    }

    fun onShared() {
        notice.value = "Share sheet · ${state.value.osId}"
    }

    fun onDismissNotice() {
        notice.value = null
    }
}

data class OsIdUiState(
    val osId: String,
    val holder: String,
    val issued: String,
    val memberNo: String,
    val tier: SubscriptionTier,
    val periodEndIso: String?,
    val revisionsLeft: Int,
    val isValid: Boolean,
    val isSeed: Boolean,
    val notice: String? = null,
) {
    val tierLabel: String get() = tier.label.uppercase()

    companion object {
        fun from(prefs: aiimin.core.data.ConfigState) = OsIdUiState(
            osId = prefs.identity.osId,
            holder = "A. UPADHYAY",
            issued = "14.03.25",
            memberNo = "#1204",
            tier = prefs.identity.tier,
            periodEndIso = prefs.identity.periodEndIso,
            revisionsLeft = 1,
            isValid = OsIdRules.isValid(prefs.identity.osId),
            isSeed = prefs.isSeed,
        )
    }
}
