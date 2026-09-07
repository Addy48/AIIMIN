package aiimin.core.data

import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * Home-screen Day plate. Glance reads this — never recomputes Life Score.
 */
@Singleton
class WidgetSnapshotStore @Inject constructor() {

    private val _state = MutableStateFlow(WidgetSnapshot.empty())
    val state: StateFlow<WidgetSnapshot> = _state.asStateFlow()

    fun publish(snapshot: WidgetSnapshot) {
        _state.value = snapshot
    }
}

data class WidgetSnapshot(
    val osId: String?,
    val score: Int?,
    val steps: Long?,
    val screenLabel: String?,
) {
    companion object {
        fun empty() = WidgetSnapshot(
            osId = null,
            score = null,
            steps = null,
            screenLabel = null,
        )
    }
}
