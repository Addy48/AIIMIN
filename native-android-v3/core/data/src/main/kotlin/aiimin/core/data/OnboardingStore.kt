package aiimin.core.data

import aiimin.core.data.di.ApplicationScope
import aiimin.core.data.prefs.AppPreferences
import aiimin.core.data.prefs.InMemoryAppPreferences
import aiimin.core.model.OsIdRules
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

/**
 * Calibration (onboarding) — local (G7).
 *
 * One job of the surface: get a person from install to their first settled log.
 * Auth / Groq / live OS-ID availability land later; this holds the six-step
 * Drafting Table flow and the completion gate.
 *
 * [completed] defaults **true** so other surfaces stay reachable in craft;
 * Config → Replay resets the path. The flag now survives process death via
 * [AppPreferences].
 */
@Singleton
class OnboardingStore @Inject constructor(
    private val config: ConfigStore,
    private val day: DayStore,
    private val prefs: AppPreferences,
    @ApplicationScope private val scope: CoroutineScope,
) {

    /** Unit tests — in-memory prefs. */
    constructor(config: ConfigStore, day: DayStore) : this(
        config,
        day,
        InMemoryAppPreferences(),
        CoroutineScope(SupervisorJob() + Dispatchers.Unconfined),
    )

    private val _state = MutableStateFlow(OnboardingState.fresh(completed = true))
    val state: StateFlow<OnboardingState> = _state.asStateFlow()

    init {
        scope.launch {
            val completed = prefs.read().onboardingCompleted
            _state.update { it.copy(completed = completed) }
        }
    }

    fun next() = _state.update { s ->
        if (s.step >= OnboardingState.STEPS) s else s.copy(step = s.step + 1)
    }

    fun back() = _state.update { s ->
        if (s.step <= 1) s else s.copy(step = s.step - 1)
    }

    fun selectOsId(id: String) = _state.update {
        it.copy(chosenId = OsIdRules.normalize(id))
    }

    fun setArc(value: String) = _state.update { it.copy(arc = value) }

    fun toggleMinimum(index: Int) = _state.update { s ->
        if (index !in s.minimums.indices) return@update s
        val next = s.minimums.toMutableList()
        next[index] = next[index].copy(picked = !next[index].picked)
        s.copy(minimums = next)
    }

    fun setFirstCapture(value: String) = _state.update { it.copy(firstCapture = value) }

    /** Sign-in is visual-only locally — advance without storing a PIN. */
    fun continuePastSignIn() = next()

    /**
     * Settle the first line, write identity + minimums into the shared stores,
     * enter the shell. Local only — no network. Persists the gate.
     */
    fun settleAndEnter(): Boolean {
        val s = _state.value
        if (!OsIdRules.isValid(s.chosenId)) return false
        val picked = s.minimums.filter { it.picked }.map { it.label }
        if (picked.size < 3) return false
        val line = s.firstCapture.trim()
        if (line.isEmpty()) return false

        config.applyCalibration(
            osId = s.chosenId,
            arc = s.arc.trim().ifEmpty { ConfigState.seed().identity.arc },
            minimumsCount = picked.size,
        )
        day.applyCalibration(picked)
        day.recordCapture(line, "now", amountFrom(line))

        _state.update { it.copy(completed = true, step = OnboardingState.STEPS) }
        persistCompleted(true)
        return true
    }

    /** Craft escape — mark complete without writing. */
    fun skipToShell() {
        _state.update { it.copy(completed = true) }
        persistCompleted(true)
    }

    /** Replay from Config — wipe completion, keep seed alts. */
    fun replay() {
        _state.update { OnboardingState.fresh(completed = false) }
        persistCompleted(false)
    }

    private fun persistCompleted(completed: Boolean) {
        scope.launch { prefs.writeOnboardingCompleted(completed) }
    }
}

data class OnboardingMinimum(val label: String, val picked: Boolean)

data class OnboardingState(
    val step: Int,
    val chosenId: String,
    val alts: List<String>,
    val arc: String,
    val minimums: List<OnboardingMinimum>,
    val firstCapture: String,
    val completed: Boolean,
) {
    val pickedCount: Int get() = minimums.count { it.picked }
    val chosenValid: Boolean get() = OsIdRules.isValid(chosenId)
    val digitCount: Int get() = OsIdRules.digitCount(chosenId)
    val canSettle: Boolean
        get() = chosenValid && pickedCount >= 3 && firstCapture.trim().isNotEmpty()

    companion object {
        const val STEPS = 6

        val CATALOG = listOf(
            "Morning walk · 25 min",
            "Journal entry",
            "Log spends",
            "Read 20 pages",
            "Lab: shadowing drill",
        )

        val ALTS = listOf("ADIT2K04", "AADIUP04", "UPADHY24")

        fun fresh(completed: Boolean = false) = OnboardingState(
            step = 1,
            chosenId = "ADIT2K04",
            alts = ALTS,
            arc = "",
            minimums = CATALOG.mapIndexed { i, label ->
                OnboardingMinimum(label, picked = i < 3)
            },
            firstCapture = "",
            completed = completed,
        )
    }
}

private fun amountFrom(line: String): Int? {
    val m = Regex("""(?:₹|rs\.?\s*)?(\d{2,6})""", RegexOption.IGNORE_CASE)
        .find(line)
    return m?.groupValues?.getOrNull(1)?.toIntOrNull()
}
