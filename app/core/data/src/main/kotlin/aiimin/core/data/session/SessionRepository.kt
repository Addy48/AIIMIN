package aiimin.core.data.session

import aiimin.core.data.prefs.AppPreferences
import aiimin.core.network.ApiAuth
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import java.util.UUID

data class SessionState(
    val token: String? = null,
    val emailOrOsId: String? = null,
    val deviceId: String? = null,
    val hydrated: Boolean = false,
    val offlineDemo: Boolean = false,
) {
    val isSignedIn: Boolean get() = !token.isNullOrBlank()
    val canEnterShell: Boolean get() = isSignedIn || offlineDemo
}

/**
 * Durable session for native ↔ api.aiimin.in.
 * Token lives in DataStore via [AppPreferences]; [ApiAuth] mirrors for OkHttp.
 */
@Singleton
class SessionRepository @Inject constructor(
    private val prefs: AppPreferences,
) {
    private val _state = MutableStateFlow(SessionState())
    val state: StateFlow<SessionState> = _state.asStateFlow()

    suspend fun hydrate() {
        val snap = prefs.read()
        val token = snap.sessionToken
        val label = snap.sessionLabel
        val device = snap.deviceId ?: newDeviceId().also { prefs.writeDeviceId(it) }
        ApiAuth.set(token)
        _state.value = SessionState(
            token = token,
            emailOrOsId = label,
            deviceId = device,
            hydrated = true,
            offlineDemo = snap.offlineDemo,
        )
    }

    suspend fun enableOfflineDemo() {
        prefs.setOfflineDemo(true)
        _state.update { it.copy(offlineDemo = true, hydrated = true) }
    }

    suspend fun saveSession(token: String, label: String?) {
        prefs.writeSession(token, label)
        prefs.setOfflineDemo(false)
        ApiAuth.set(token)
        _state.update {
            it.copy(
                token = token,
                emailOrOsId = label,
                hydrated = true,
                offlineDemo = false,
            )
        }
    }

    suspend fun clearSession() {
        prefs.clearSession()
        prefs.setOfflineDemo(false)
        ApiAuth.clear()
        _state.update {
            it.copy(
                token = null,
                emailOrOsId = null,
                hydrated = true,
                offlineDemo = false,
            )
        }
    }

    suspend fun deviceId(): String {
        val existing = _state.value.deviceId ?: prefs.read().deviceId
        if (!existing.isNullOrBlank()) {
            _state.update { it.copy(deviceId = existing) }
            return existing
        }
        val fresh = newDeviceId()
        prefs.writeDeviceId(fresh)
        _state.update { it.copy(deviceId = fresh) }
        return fresh
    }

    private fun newDeviceId(): String = UUID.randomUUID().toString()
}
