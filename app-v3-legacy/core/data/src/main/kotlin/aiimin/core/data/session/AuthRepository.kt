package aiimin.core.data.session

import aiimin.core.model.OsIdRules
import aiimin.core.network.AiiminApi
import aiimin.core.network.ApiAuth
import aiimin.core.network.DeviceRequest
import aiimin.core.network.SessionCookieJar
import aiimin.core.network.SignInRequest
import aiimin.core.network.SignInUsernameRequest
import java.util.Locale
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import retrofit2.Response

@Singleton
class AuthRepository @Inject constructor(
    private val api: AiiminApi,
    private val session: SessionRepository,
    private val cookieJar: SessionCookieJar,
) {
    private val json = Json { ignoreUnknownKeys = true; isLenient = true }

    suspend fun validateSession(): Boolean {
        session.hydrate()
        val token = session.state.value.token
        if (token.isNullOrBlank()) return false
        ApiAuth.set(token)
        return runCatching {
            val res = api.getSession()
            if (!res.isSuccessful) {
                if (res.code() == 401) clearLocal()
                return false
            }
            val body = res.body()
            val fresh = body?.session?.token
            val plate = BiometricUnlock.plate(
                body?.user?.username,
                session.state.value.emailOrOsId,
            )
            val label = plate ?: body?.user?.email ?: session.state.value.emailOrOsId
            if (!fresh.isNullOrBlank()) {
                session.saveSession(fresh, label)
            } else if (body?.user == null && cookieJar.sessionToken().isNullOrBlank() &&
                token == ApiAuth.COOKIE_ONLY
            ) {
                clearLocal()
                return false
            }
            true
        }.getOrElse {
            // Network blip — keep local session; bootstrap will retry.
            true
        }
    }

    /**
     * Phone path: OS-ID + 6-digit PIN (same plate as aiimin.in).
     * Email identifier still works. Google signup is website-only.
     * Never invent credentials.
     */
    suspend fun signIn(identifier: String, pin: String): Result<Unit> = runCatching {
        require(pin.length == 6 && pin.all { it.isDigit() }) { "PIN must be 6 digits" }
        val id = identifier.trim()
        val res = if (OsIdRules.isEmailIdentifier(id)) {
            api.signInEmail(SignInRequest(id.lowercase(Locale.US), pin))
        } else {
            val osId = OsIdRules.normalize(id)
            val resolved = runCatching {
                val r = api.resolve(osId)
                if (r.isSuccessful) r.body()?.email else null
            }.getOrNull()
            if (!resolved.isNullOrBlank()) {
                api.signInEmail(SignInRequest(resolved.lowercase(Locale.US), pin))
            } else {
                api.signInUsername(SignInUsernameRequest(osId, pin))
            }
        }
        if (!res.isSuccessful) {
            error(parseAuthError(res) ?: "Sign-in failed (${res.code()})")
        }
        val token = resolveToken(res)
        val label = if (OsIdRules.isEmailIdentifier(id)) {
            id.lowercase(Locale.US)
        } else {
            OsIdRules.normalize(id)
        }
        session.saveSession(token, label)
        runCatching {
            api.registerDevice(
                DeviceRequest(deviceId = session.deviceId()),
            )
        }
        Unit
    }

    suspend fun signOut() {
        clearLocal()
    }

    private suspend fun clearLocal() {
        cookieJar.clear()
        session.clearSession()
    }

    private fun resolveToken(res: Response<*>): String {
        cookieJar.sessionToken()?.let { return it }
        val setCookies = res.headers().values("set-cookie") + res.headers().values("Set-Cookie")
        for (raw in setCookies) {
            val part = raw.substringBefore(';')
            val name = part.substringBefore('=').trim()
            val value = part.substringAfter('=', "").trim()
            if (name.contains("session_token", ignoreCase = true) && value.isNotBlank()) {
                return value
            }
        }
        // Cookie-only session — OkHttp jar holds it; store sentinel for isSignedIn.
        return ApiAuth.COOKIE_ONLY
    }

    private fun parseAuthError(res: Response<*>): String? {
        val body = runCatching { res.errorBody()?.string() }.getOrNull().orEmpty()
        if (body.isBlank()) return null
        return runCatching {
            val obj = json.parseToJsonElement(body).jsonObject
            (obj["message"] ?: obj["error"])?.jsonPrimitive?.content
        }.getOrNull()
    }
}
