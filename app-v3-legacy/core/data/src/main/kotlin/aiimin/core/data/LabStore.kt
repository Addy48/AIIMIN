package aiimin.core.data

import aiimin.core.network.CorrelationsResponse
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

    fun resetToSeed() {
        _state.value = LabState.seed()
    }

    fun markSeedOnly() = _state.update {
        it.copy(isSeed = true, headMetaOverride = "SEED · DEMO — not your live correlations")
    }

    /** Almost-true 10-day phone sample correlations for thorough Lab QA. */
    fun applyRemote(data: CorrelationsResponse) {
        if (data.insufficientData || data.correlations.isEmpty()) {
            _state.update {
                LabState(
                    pairs = emptyList(),
                    selectedIndex = 0,
                    daysLogged = 0,
                    rejectedCount = 0,
                    isSeed = false,
                    headMetaOverride = "INSUFFICIENT · need more days",
                )
            }
            return
        }
        val survivors = data.correlations.filter { it.bhPassed }
        val rejected = (data.correlations.size - survivors.size).coerceAtLeast(0)
        val pairs = survivors.map { row ->
            val rho = row.rho ?: 0.0
            val rhoStr = when {
                rho < 0 -> "−.${"%.0f".format(kotlin.math.abs(rho) * 100)}"
                else -> "+.${"%.0f".format(rho * 100)}"
            }
            val q = row.pValue?.let { p ->
                if (p < 0.001) ".001" else ".${"%03d".format((p * 1000).toInt().coerceAtLeast(1))}"
            } ?: "—"
            val a = row.signalALabel ?: row.signalA ?: "A"
            val b = row.signalBLabel ?: row.signalB ?: "B"
            CorrelationPair(
                label = "$a → $b",
                full = "$a → $b",
                rho = rhoStr,
                q = q,
                n = row.n ?: 0,
                plain = row.headline
                    ?: data.insights.firstOrNull { it.headline != null }?.headline
                    ?: "When $a moves, $b tends to follow.",
            )
        }
        val n = survivors.maxOfOrNull { it.n ?: 0 } ?: 0
        _state.value = LabState(
            pairs = pairs.ifEmpty {
                listOf(
                    CorrelationPair(
                        label = "No survivors",
                        full = "Benjamini–Hochberg rejected the rest",
                        rho = "—",
                        q = "—",
                        n = n,
                        plain = "Nothing cleared FDR 0.10. That is a result — not a demo.",
                    )
                )
            },
            selectedIndex = 0,
            daysLogged = n,
            rejectedCount = rejected,
            isSeed = false,
            headMetaOverride = "LIVE · n=${n}d · $rejected rejected",
        )
    }

    fun loadTenDaySample() = _state.update {
        LabState(
            pairs = listOf(
                CorrelationPair(
                    label = "Walk → screen time",
                    full = "07:00 walk → screen time",
                    rho = "−.72",
                    q = ".008",
                    n = 10,
                    plain = "Sample 10d: morning walk days sit ~2h lower on screen.",
                ),
                CorrelationPair(
                    label = "Steps → Life Score",
                    full = "Daily steps → Life Score",
                    rho = "+.81",
                    q = ".003",
                    n = 10,
                    plain = "Sample 10d: higher step days track with a stronger published mark.",
                ),
                CorrelationPair(
                    label = "Unlocks → screen",
                    full = "Unlock count → screen time",
                    rho = "+.64",
                    q = ".022",
                    n = 10,
                    plain = "Sample 10d: twitchy unlock days also run longer screen sessions.",
                ),
                CorrelationPair(
                    label = "Sleep proxy → focus",
                    full = "Late-night screen → next focus",
                    rho = "−.48",
                    q = ".061",
                    n = 10,
                    plain = "Sample 10d: heavy late Instagram nights lean into thinner deep work.",
                ),
            ),
            selectedIndex = 0,
            daysLogged = 10,
            rejectedCount = 2,
            isSeed = true,
            headMetaOverride = "SAMPLE · 10 DAYS — almost-true phone ledger",
        )
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
    val isSeed: Boolean = true,
    val headMetaOverride: String? = null,
) {
    val selected: CorrelationPair?
        get() = if (pairs.isEmpty()) null else pairs.getOrNull(selectedIndex.coerceIn(0, pairs.lastIndex))

    val headMeta: String
        get() = headMetaOverride
            ?: if (isSeed) "SEED · DEMO"
            else "n=${daysLogged}d"

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
            isSeed = true,
        )
    }
}
