package aiimin.core.data

import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

/**
 * Lab correlations — local seed (G7).
 *
 * Survivors only (q under 0.10). Selection drives the pair card + scatter.
 * Real Spearman / BH correction lands with the lab API routes.
 */
@Singleton
class LabStore @Inject constructor() {

    private val _state = MutableStateFlow(LabState.seed())
    val state: StateFlow<LabState> = _state.asStateFlow()

    fun select(index: Int) = _state.update { s ->
        if (index !in s.pairs.indices) return@update s
        s.copy(selectedIndex = index)
    }
}

data class CorrelationPair(
    val label: String,
    val full: String,
    val rho: String,
    val q: String,
    val n: Int,
    val plain: String,
) {
    val rhoValue: Float
        get() = rho
            .replace('−', '-')
            .replace("+", "")
            .toFloatOrNull() ?: 0f
}

data class LabState(
    val pairs: List<CorrelationPair>,
    val selectedIndex: Int,
    val daysLogged: Int,
    val rejectedCount: Int,
) {
    val selected: CorrelationPair get() = pairs[selectedIndex.coerceIn(pairs.indices)]
    val headMeta: String get() = "n=${daysLogged}d"

    companion object {
        fun seed() = LabState(
            pairs = listOf(
                CorrelationPair(
                    label = "Walk → screen time",
                    full = "07:00 walk → screen time",
                    rho = "−.61",
                    q = ".004",
                    n = 18,
                    plain = "When the morning walk lands, screen time trends down ~40%.",
                ),
                CorrelationPair(
                    label = "Sleep → focus hours",
                    full = "Sleep duration → focus hours",
                    rho = "+.54",
                    q = ".011",
                    n = 96,
                    plain = "Longer sleep nights tend to buy more deep-work hours next day.",
                ),
                CorrelationPair(
                    label = "Delivery spend → mood",
                    full = "Delivery spend → next-day mood",
                    rho = "−.38",
                    q = ".042",
                    n = 74,
                    plain = "Heavy delivery days lean into a flatter mood the morning after.",
                ),
                CorrelationPair(
                    label = "Journal streak → Mind",
                    full = "Journal streak → Mind area",
                    rho = "+.35",
                    q = ".058",
                    n = 120,
                    plain = "Keeping the journal open tracks with a steadier Mind reading.",
                ),
                CorrelationPair(
                    label = "Steps → sleep quality",
                    full = "Daily steps → sleep quality",
                    rho = "+.31",
                    q = ".089",
                    n = 151,
                    plain = "Higher step days lean into slightly better sleep quality.",
                ),
            ),
            selectedIndex = 0,
            daysLogged = 184,
            rejectedCount = 14,
        )
    }
}
