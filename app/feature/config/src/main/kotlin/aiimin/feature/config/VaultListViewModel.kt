package aiimin.feature.config

import androidx.lifecycle.ViewModel
import aiimin.core.data.VaultListStore
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

@HiltViewModel
class VaultListViewModel @Inject constructor(
    store: VaultListStore,
) : ViewModel() {
    val state = store.state
}
