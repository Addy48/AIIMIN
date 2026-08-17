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
 * One job: install → signed-in (or offline demo) → first settled log.
 * [completed] defaults **false** for new installs; DataStore persists after settle/skip.
 * Config → Replay / Sign out resets the path.
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

    private val _state = MutableStateFlow(OnboardingState.fresh(completed = false))
    val state: StateFlow<OnboardingState> = _state.asStateFlow()

    init {
        scope.launch {
            val completed = prefs.read().onboardingCompleted
            _state.update { it.copy(completed = completed) }
        }
    }

    fun next() = _state.update { s ->
        if (s.step == 1 && !s.ageConfirmed) s
        else if (s.step >= OnboardingState.STEPS) s else s.copy(step = s.step + 1)
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

    fun setAgeConfirmed(on: Boolean) = _state.update { it.copy(ageConfirmed = on) }

    /**
     * Returning phone: jump to Sign in with the remembered OS-ID.
     * Welcome / 18+ already passed. Google is not a phone path.
     */
    fun prepareReturningSignIn(osId: String?) {
        val id = osId?.let { aiimin.core.model.OsIdRules.normalize(it) }
        val valid = id != null && aiimin.core.model.OsIdRules.isValid(id)
        _state.update {
            it.copy(
                step = 2,
                ageConfirmed = true,
                chosenId = if (valid && id != null) id else it.chosenId,
            )
        }
    }

    /** Sign-in is visual-only locally — advance without storing a PIN. */
    fun continuePastSignIn() = next()

    /**
     * Returning user already holds a valid OS-ID (signed in with it).
     * Skip the claim plate — go to Arc (step 4).
     */
    fun skipClaimForReturningUser(osId: String) {
        val normalized = OsIdRules.normalize(osId)
        if (!OsIdRules.isValid(normalized)) {
            next()
            return
        }
        _state.update {
            it.copy(
                chosenId = normalized,
                step = 4.coerceAtMost(OnboardingState.STEPS),
            )
        }
    }

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
    fun skipToShell(): Boolean {
        if (!_state.value.ageConfirmed) return false
        _state.update { it.copy(completed = true) }
        persistCompleted(true)
        return true
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
    val ageConfirmed: Boolean = false,
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
            ageConfirmed = false,
        )
    }
}

private fun amountFrom(line: String): Int? {
    val m = Regex("""(?:₹|rs\.?\s*)?(\d{2,6})""", RegexOption.IGNORE_CASE)
        .find(line)
    return m?.groupValues?.getOrNull(1)?.toIntOrNull()
}
