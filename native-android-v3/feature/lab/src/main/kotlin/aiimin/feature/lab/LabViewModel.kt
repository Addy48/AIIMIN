package aiimin.feature.lab

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import aiimin.core.data.ConfigStore
import aiimin.core.data.LabState
import aiimin.core.data.LabStore
import aiimin.core.model.SubscriptionTier
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn

/** One job: **ask, review, act on patterns.** Phone OS lives on Day — not here. */
@HiltViewModel
class LabViewModel @Inject constructor(
    private val store: LabStore,
    config: ConfigStore,
) : ViewModel() {

    val state: StateFlow<LabState> = store.state
    val tier: StateFlow<SubscriptionTier> = config.state
        .map { it.identity.tier }
        .stateIn(
            viewModelScope,
            SharingStarted.WhileSubscribed(5_000),
            config.state.value.identity.tier,
        )

    fun onSelect(index: Int) = store.select(index)
}
