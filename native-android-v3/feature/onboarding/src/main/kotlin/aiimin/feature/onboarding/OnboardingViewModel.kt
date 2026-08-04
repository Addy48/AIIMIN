package aiimin.feature.onboarding

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import aiimin.core.data.OnboardingState
import aiimin.core.data.OnboardingStore
import aiimin.core.model.OsIdRules
import aiimin.core.network.OsIdAvailability
import aiimin.core.network.OsIdAvailabilityRepository
import aiimin.core.network.OsIdCheckResult
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/**
 * One job: **get a person from install to their first settled log.**
 *
 * OS-ID step hits live `/auth/osid-available`. Auth / PIN stay out of this VM
 * (founder types credentials; never invent auth).
 */
@HiltViewModel
class OnboardingViewModel @Inject constructor(
    private val store: OnboardingStore,
    private val osIdAvailability: OsIdAvailabilityRepository,
) : ViewModel() {

    val state: StateFlow<OnboardingState> = store.state

    private val _osIdLive = MutableStateFlow(
        OsIdCheckResult(OsIdAvailability.IDLE, ""),
    )
    val osIdLive: StateFlow<OsIdCheckResult> = _osIdLive.asStateFlow()

    private var checkJob: Job? = null

    init {
        // Seed alts / default id — verify against the live graph once.
        scheduleOsIdCheck(store.state.value.chosenId)
    }

    fun onNext() = store.next()
    fun onBack() = store.back()
    fun onContinueSignIn() = store.continuePastSignIn()

    fun onSelectOsId(id: String) {
        store.selectOsId(id)
        scheduleOsIdCheck(id)
    }

    fun onArcChange(value: String) = store.setArc(value)
    fun onToggleMinimum(index: Int) = store.toggleMinimum(index)
    fun onFirstCaptureChange(value: String) = store.setFirstCapture(value)
    fun onSettleAndEnter(): Boolean = store.settleAndEnter()
    fun onSkip() = store.skipToShell()

    /** Claim CTA — live free, or offline + valid shape (honest unverified). */
    fun canClaimOsId(): Boolean {
        val s = store.state.value
        if (!s.chosenValid) return false
        return when (_osIdLive.value.status) {
            OsIdAvailability.AVAILABLE -> true
            OsIdAvailability.OFFLINE -> true
            else -> false
        }
    }

    private fun scheduleOsIdCheck(raw: String) {
        checkJob?.cancel()
        val normalized = OsIdRules.normalize(raw)
        if (!OsIdRules.isValid(normalized)) {
            _osIdLive.value = OsIdCheckResult(
                OsIdAvailability.INVALID,
                OsIdRules.issues(normalized).firstOrNull() ?: "Invalid OS-ID",
            )
            return
        }
        _osIdLive.value = OsIdCheckResult(OsIdAvailability.CHECKING, "Checking the graph…")
        checkJob = viewModelScope.launch {
            delay(DEBOUNCE_MS)
            if (OsIdRules.normalize(store.state.value.chosenId) != normalized) return@launch
            _osIdLive.value = osIdAvailability.check(normalized)
        }
    }

    private companion object {
        const val DEBOUNCE_MS = 320L
    }
}
