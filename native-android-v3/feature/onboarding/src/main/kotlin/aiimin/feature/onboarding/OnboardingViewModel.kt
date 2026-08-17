package aiimin.feature.onboarding

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import aiimin.core.data.ConfigStore
import aiimin.core.data.OnboardingState
import aiimin.core.data.OnboardingStore
import aiimin.core.data.SyncState
import aiimin.core.data.session.AuthRepository
import aiimin.core.data.session.BiometricUnlock
import aiimin.core.data.session.SessionRepository
import aiimin.core.data.sync.GraphSyncRepository
import aiimin.core.data.UserGraphReset
import aiimin.core.model.OsIdRules
import aiimin.core.network.OsIdAvailability
import aiimin.core.network.OsIdAvailabilityRepository
import aiimin.core.network.OsIdCheckResult
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

/**
 * One job: **get a person from install to their first settled log.**
 *
 * Sign-in hits live Better Auth (OS-ID/email + PIN). OS-ID claim hits
 * `/auth/osid-available`. Never invent credentials.
 */
@HiltViewModel
class OnboardingViewModel @Inject constructor(
    private val store: OnboardingStore,
    private val osIdAvailability: OsIdAvailabilityRepository,
    private val auth: AuthRepository,
    private val sync: GraphSyncRepository,
    private val session: SessionRepository,
    private val graphReset: UserGraphReset,
    private val config: ConfigStore,
) : ViewModel() {

    val state: StateFlow<OnboardingState> = store.state

    private val _osIdLive = MutableStateFlow(
        OsIdCheckResult(OsIdAvailability.IDLE, ""),
    )
    val osIdLive: StateFlow<OsIdCheckResult> = _osIdLive.asStateFlow()

    private val _identifier = MutableStateFlow("")
    val identifier: StateFlow<String> = _identifier.asStateFlow()

    private val _pin = MutableStateFlow("")
    val pin: StateFlow<String> = _pin.asStateFlow()

    private val _authNotice = MutableStateFlow<String?>(null)
    val authNotice: StateFlow<String?> = _authNotice.asStateFlow()

    private val _authBusy = MutableStateFlow(false)
    val authBusy: StateFlow<Boolean> = _authBusy.asStateFlow()

    private val _offerBiometric = MutableStateFlow(false)
    val offerBiometric: StateFlow<Boolean> = _offerBiometric.asStateFlow()

    private var checkJob: Job? = null
    private var returningPrepared = false

    init {
        scheduleOsIdCheck(store.state.value.chosenId)
        viewModelScope.launch {
            session.state.collect { snap ->
                if (!snap.hydrated) return@collect
                val plate = BiometricUnlock.plate(
                    snap.emailOrOsId,
                    config.state.value.identity.osId,
                )
                if (_identifier.value.isBlank() && !plate.isNullOrBlank()) {
                    _identifier.value = plate
                }
                if (!returningPrepared && store.state.value.completed) {
                    returningPrepared = true
                    store.prepareReturningSignIn(plate)
                    if (!plate.isNullOrBlank()) _identifier.value = plate
                }
            }
        }
    }

    fun plate(): String? = BiometricUnlock.plate(
        session.state.value.emailOrOsId,
        config.state.value.identity.osId,
    )

    val signInUnlock: StateFlow<SignInUnlock> = combine(
        config.state,
        session.state,
        _identifier,
    ) { cfg, snap, id ->
        val remembered = BiometricUnlock.plate(snap.emailOrOsId, cfg.identity.osId)
        val typed = BiometricUnlock.plate(id, null)
        val plate = remembered ?: typed
        SignInUnlock(
            plate = plate,
            canDirect = BiometricUnlock.canDirectUnlock(
                biometricEnabled = cfg.biometricEnabled,
                sessionSignedIn = snap.isSignedIn,
                plate = plate,
            ),
        )
    }.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5_000),
        SignInUnlock(plate = null, canDirect = false),
    )

    fun canDirectUnlock(): Boolean = signInUnlock.value.canDirect

    data class SignInUnlock(val plate: String?, val canDirect: Boolean)

    fun onEnableBiometricNextTime() {
        config.setBiometricEnabled(true)
        _offerBiometric.value = false
        advanceAfterAuth()
    }

    fun onSkipBiometricOffer() {
        _offerBiometric.value = false
        advanceAfterAuth()
    }

    fun onBiometricUnlocked(onReturningEntered: () -> Unit) {
        val id = plate() ?: _identifier.value.trim().let {
            val n = OsIdRules.normalize(it)
            n.takeIf { OsIdRules.isValid(n) }
        }
        if (!session.state.value.isSignedIn) {
            _authNotice.value = "Session expired · use PIN"
            return
        }
        if (!id.isNullOrBlank()) {
            config.rememberOsId(id)
            store.skipClaimForReturningUser(id)
        }
        if (store.state.value.completed) onReturningEntered()
        else store.continuePastSignIn()
    }

    fun onNext() = store.next()
    fun onAgeConfirmed(on: Boolean) = store.setAgeConfirmed(on)
    fun onBack() = store.back()

    fun onAuthNotice(message: String?) {
        _authNotice.value = message
    }

    fun onIdentifierChange(value: String) = _identifier.update { value }

    fun onPinChange(value: String) = _pin.update { value.filter { ch -> ch.isDigit() }.take(6) }

    fun onSignIn(onReturningEntered: () -> Unit = {}) {
        if (_authBusy.value) return
        if (_pin.value.length != 6) {
            _authNotice.value = "PIN must be 6 digits"
            return
        }
        viewModelScope.launch {
            _authBusy.value = true
            _authNotice.value = null
            val result = auth.signIn(_identifier.value, _pin.value)
            _authBusy.value = false
            result.fold(
                onSuccess = {
                    _authNotice.value = "Signed in · syncing…"
                    graphReset.clearSeedForLiveSession()
                    sync.refreshAll()
                    val raw = _identifier.value.trim()
                    val normalized = OsIdRules.normalize(raw)
                    if (!OsIdRules.isEmailIdentifier(raw) && OsIdRules.isValid(normalized)) {
                        config.rememberOsId(normalized)
                    }
                    pendingReturningEntered = onReturningEntered
                    if (!config.state.value.biometricEnabled &&
                        !OsIdRules.isEmailIdentifier(raw) &&
                        OsIdRules.isValid(normalized)
                    ) {
                        _offerBiometric.value = true
                    } else {
                        advanceAfterAuth()
                    }
                },
                onFailure = { e ->
                    _authNotice.value = e.message ?: "Sign-in failed"
                },
            )
        }
    }

    private var pendingReturningEntered: () -> Unit = {}

    private fun advanceAfterAuth() {
        val raw = _identifier.value.trim()
        val normalized = OsIdRules.normalize(raw)
        if (store.state.value.completed) {
            pendingReturningEntered()
            return
        }
        if (!OsIdRules.isEmailIdentifier(raw) && OsIdRules.isValid(normalized)) {
            store.skipClaimForReturningUser(normalized)
        } else {
            store.continuePastSignIn()
        }
    }

    /** Skip auth only for craft — marks offline demo. */
    fun onContinueSignIn() {
        viewModelScope.launch {
            session.enableOfflineDemo()
            config.setSync(SyncState.DEMO)
            store.continuePastSignIn()
        }
    }

    /** Welcome skip — same offline gate or shell never opens. */
    fun onSkip(): Boolean {
        if (!store.skipToShell()) return false
        viewModelScope.launch {
            session.enableOfflineDemo()
            config.setSync(SyncState.DEMO)
        }
        return true
    }

    fun onSelectOsId(id: String) {
        store.selectOsId(id)
        scheduleOsIdCheck(id)
    }

    fun onArcChange(value: String) = store.setArc(value)
    fun onToggleMinimum(index: Int) = store.toggleMinimum(index)
    fun onFirstCaptureChange(value: String) = store.setFirstCapture(value)
    fun onSettleAndEnter(): Boolean = store.settleAndEnter()

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
        checkJob = viewModelScope.launch {
            _osIdLive.value = OsIdCheckResult(OsIdAvailability.CHECKING, "Checking…")
            delay(280)
            _osIdLive.value = osIdAvailability.check(normalized)
        }
    }
}
