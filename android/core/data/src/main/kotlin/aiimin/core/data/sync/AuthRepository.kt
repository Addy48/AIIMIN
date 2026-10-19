package aiimin.core.data.sync

import aiimin.core.data.core.Crypto
import aiimin.core.data.settings.SettingsStore
import aiimin.core.model.OsIdRules
import aiimin.core.network.AiiminApi
import aiimin.core.network.ApiAuth
import aiimin.core.network.DeleteUserRequest
import aiimin.core.network.DeviceRequest
import aiimin.core.network.ForgetPasswordRequest
import aiimin.core.network.SessionCookieJar
import aiimin.core.network.SignInRequest
import aiimin.core.network.SignInUsernameRequest
import aiimin.core.network.SignUpRequest
import aiimin.core.network.VerifyEmailRequest
import aiimin.core.network.WipeRequest
import android.content.Context
import android.util.Base64
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import java.io.IOException
import java.util.Locale
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive

private val Context.session: DataStore<Preferences> by preferencesDataStore("aiimin_session")

data class Session(
    val token: String?,
    val label: String?,
    val email: String? = null,
    val osId: String? = null,
    val name: String? = null,
    val verified: Boolean = true,
) {
    val signedIn get() = !token.isNullOrBlank()
}

/** What an auth call came back with. Never throws: the screens only render these. */
sealed interface AuthResult {
    data object Ok : AuthResult
    /** Account made (or found) but the email link has not been tapped yet. */
    data class NeedsVerification(val email: String) : AuthResult
    data class Failed(val kind: Kind, val message: String) : AuthResult
    enum class Kind { OFFLINE, RATE_LIMIT, BAD_CREDENTIALS, TAKEN, INVALID, SERVER }
}

data class OsIdCheck(val available: Boolean?, val message: String?)

/**
 * aiimin.in account, exactly as the website does it: Better Auth with an 8-character OS-ID
 * (or email) and a 6-digit PIN. The session token is encrypted with a Keystore key before it
 * is stored; it never sits in plain text on the phone.
 */
@Singleton
class AuthRepository @Inject constructor(
    @ApplicationContext private val context: Context,
    private val api: AiiminApi,
    private val cookies: SessionCookieJar,
    private val settings: SettingsStore,
    private val crypto: Crypto,
) {
    private val token = stringPreferencesKey("token_enc")
    private val tokenIv = stringPreferencesKey("token_iv")
    private val label = stringPreferencesKey("label")
    private val email = stringPreferencesKey("email")
    private val osId = stringPreferencesKey("os_id")
    private val name = stringPreferencesKey("name")
    private val verified = booleanPreferencesKey("verified")
    private val json = Json { ignoreUnknownKeys = true; isLenient = true }

    val session: Flow<Session> = context.session.data.map { p ->
        val t = p[token]?.let { c -> p[tokenIv]?.let { iv -> crypto.decryptText(c, iv, Crypto.SESSION).ifBlank { null } } }
        Session(t, p[label], p[email], p[osId], p[name], p[verified] ?: true)
    }

    suspend fun current(): Session = session.first()

    /** Restore the bearer for this process; drop it only on a clear 401. */
    suspend fun restore(): Boolean {
        val s = current()
        if (!s.signedIn) return false
        ApiAuth.set(s.token)
        return try {
            val res = api.getSession()
            if (res.code() == 401) { clearLocalSession(); false } else true
        } catch (_: IOException) {
            true // offline is not signed out
        } catch (_: Exception) {
            true
        }
    }

    suspend fun osIdAvailable(raw: String): OsIdCheck = try {
        val r = api.osIdAvailable(OsIdRules.normalize(raw))
        OsIdCheck(r.available, r.message)
    } catch (_: Exception) {
        OsIdCheck(null, null)
    }

    suspend fun signIn(identifier: String, pin: String): AuthResult {
        if (pin.length != 6 || !pin.all(Char::isDigit)) return AuthResult.Failed(AuthResult.Kind.INVALID, "Your PIN is 6 digits")
        val id = identifier.trim()
        if (id.isBlank()) return AuthResult.Failed(AuthResult.Kind.INVALID, "Enter your OS-ID or email")
        return try {
            val res = if (OsIdRules.isEmailIdentifier(id)) {
                api.signInEmail(SignInRequest(id.lowercase(Locale.US), pin))
            } else {
                val os = OsIdRules.normalize(id)
                val mail = runCatching { api.resolve(os).takeIf { it.isSuccessful }?.body()?.email }.getOrNull()
                if (!mail.isNullOrBlank()) api.signInEmail(SignInRequest(mail.lowercase(Locale.US), pin)) else api.signInUsername(SignInUsernameRequest(os, pin))
            }
            if (!res.isSuccessful) return failure(res.code(), res.errorBody()?.string().orEmpty(), id)
            val t = cookies.sessionToken() ?: res.headers().values("set-cookie").firstNotNullOfOrNull { raw ->
                raw.substringBefore(';').takeIf { it.substringBefore('=').contains("session_token", true) }?.substringAfter('=')
            } ?: ApiAuth.COOKIE_ONLY
            save(t, if (OsIdRules.isEmailIdentifier(id)) id.lowercase(Locale.US) else OsIdRules.normalize(id))
            ApiAuth.set(t)
            runCatching { api.registerDevice(DeviceRequest(deviceId = settings.deviceId(), appVersion = APP_VERSION)) }
            refreshProfile()
            AuthResult.Ok
        } catch (e: IOException) {
            unreachable(e, "sign in")
        } catch (e: Exception) {
            AuthResult.Failed(AuthResult.Kind.SERVER, "Couldn't sign in. Try again in a moment.")
        }
    }

    suspend fun signUp(fullName: String, mail: String, osIdRaw: String, pin: String): AuthResult {
        val m = mail.trim().lowercase(Locale.US)
        val os = OsIdRules.normalize(osIdRaw)
        if (pin.length != 6 || !pin.all(Char::isDigit)) return AuthResult.Failed(AuthResult.Kind.INVALID, "Your PIN is 6 digits")
        if (!OsIdRules.isEmailIdentifier(m)) return AuthResult.Failed(AuthResult.Kind.INVALID, "Check the email address")
        OsIdRules.issues(os).firstOrNull()?.let { return AuthResult.Failed(AuthResult.Kind.INVALID, it) }
        return try {
            val res = api.signUpEmail(SignUpRequest(m, pin, fullName.trim().ifBlank { os }, os))
            if (!res.isSuccessful) return failure(res.code(), res.errorBody()?.string().orEmpty(), m)
            AuthResult.NeedsVerification(m)
        } catch (e: IOException) {
            unreachable(e, "create an account")
        } catch (_: Exception) {
            AuthResult.Failed(AuthResult.Kind.SERVER, "Couldn't create the account. Try again in a moment.")
        }
    }

    suspend fun resendVerification(mail: String): AuthResult = try {
        val res = api.sendVerification(VerifyEmailRequest(mail.trim().lowercase(Locale.US)))
        if (res.isSuccessful) AuthResult.Ok else failure(res.code(), res.errorBody()?.string().orEmpty(), mail)
    } catch (_: IOException) {
        AuthResult.Failed(AuthResult.Kind.OFFLINE, "Needs internet")
    } catch (_: Exception) {
        AuthResult.Failed(AuthResult.Kind.SERVER, "Couldn't send the email. Try again in a moment.")
    }

    suspend fun forgotPin(mail: String): AuthResult = try {
        val res = api.forgetPassword(ForgetPasswordRequest(mail.trim().lowercase(Locale.US)))
        // The server answers the same whether or not the address exists; so do we.
        if (res.isSuccessful || res.code() == 404) AuthResult.Ok else failure(res.code(), res.errorBody()?.string().orEmpty(), mail)
    } catch (_: IOException) {
        AuthResult.Failed(AuthResult.Kind.OFFLINE, "Needs internet")
    } catch (_: Exception) {
        AuthResult.Failed(AuthResult.Kind.SERVER, "Couldn't send the email. Try again in a moment.")
    }

    /** Pulls name, OS-ID and email from the server and keeps them beside the session. */
    suspend fun refreshProfile() {
        runCatching {
            val u = api.authMe().body()?.user ?: return
            context.session.edit { p ->
                u.email?.let { p[email] = it }
                u.username?.let { p[osId] = it }
                u.fullName?.takeIf { it.isNotBlank() }?.let { p[name] = it }
                p[verified] = u.emailVerified ?: true
            }
        }
    }

    /** Server first (best effort), then forget the session. Local data is handled by the caller. */
    suspend fun signOut() {
        runCatching { api.logout() }
        clearLocalSession()
    }

    /** Signed-in browsers and phones (SE2). Null when offline or signed out. */
    suspend fun linkedSessions(): List<aiimin.core.network.SessionInfoDto>? = try {
        val s = current()
        if (!s.signedIn) null else {
            aiimin.core.network.ApiAuth.set(s.token)
            api.listSessions().takeIf { it.isSuccessful }?.body()
        }
    } catch (_: Exception) { null }

    suspend fun revokeSession(token: String): Boolean = try { api.revokeSession(aiimin.core.network.RevokeSessionRequest(token)).isSuccessful } catch (_: Exception) { false }

    /** The token of this phone's own session, so it is never offered for removal. */
    suspend fun ownToken(): String? = current().token

    suspend fun wipeServerData(): Boolean = try { api.wipeLifeData(WipeRequest()).isSuccessful } catch (_: Exception) { false }

    suspend fun deleteAccount(pin: String): AuthResult = try {
        val res = api.deleteUser(DeleteUserRequest(pin))
        if (res.isSuccessful) { clearLocalSession(); AuthResult.Ok } else failure(res.code(), res.errorBody()?.string().orEmpty(), "")
    } catch (_: IOException) {
        AuthResult.Failed(AuthResult.Kind.OFFLINE, "Needs internet to delete the account")
    } catch (_: Exception) {
        AuthResult.Failed(AuthResult.Kind.SERVER, "Couldn't delete the account. Try again in a moment.")
    }

    private suspend fun clearLocalSession() {
        cookies.clear()
        ApiAuth.clear()
        context.session.edit { it.clear() }
    }

    private suspend fun save(t: String, lbl: String) {
        val (c, iv) = crypto.encryptText(t, Crypto.SESSION)
        context.session.edit { p ->
            p[token] = c; p[tokenIv] = iv; p[label] = lbl
            if (OsIdRules.isEmailIdentifier(lbl)) p[email] = lbl else p[osId] = lbl
        }
    }

    /** Offline is the phone's problem; a bad certificate or unknown host is aiimin.in's. Say which. */
    private fun unreachable(e: IOException, what: String): AuthResult.Failed = when (e) {
        is java.net.UnknownHostException, is java.net.ConnectException, is java.net.SocketTimeoutException ->
            AuthResult.Failed(AuthResult.Kind.OFFLINE, "Needs internet to $what. Check your connection and try again.")
        else -> AuthResult.Failed(AuthResult.Kind.SERVER, "Can't reach aiimin.in securely right now. Try again later.")
    }

    private fun failure(code: Int, body: String, who: String): AuthResult.Failed = AuthErrors.map(code, body, who)

    companion object { const val APP_VERSION = "4.0.0-beta01" }
}

/** Better Auth error responses → what the person reads. Pure, so it is unit-tested. */
object AuthErrors {
    private val json = Json { ignoreUnknownKeys = true; isLenient = true }

    fun map(code: Int, body: String, who: String): AuthResult.Failed {
        val obj = runCatching { json.parseToJsonElement(body).jsonObject }.getOrNull()
        val serverMsg = obj?.let { (it["message"] ?: it["error"])?.jsonPrimitive?.content }
        val serverCode = obj?.get("code")?.jsonPrimitive?.content.orEmpty()
        return when {
            code == 429 || serverMsg?.contains("too many", true) == true -> AuthResult.Failed(AuthResult.Kind.RATE_LIMIT, "Too many tries. Wait a few minutes and try again.")
            serverCode.contains("VERIFIED", true) || serverMsg?.contains("verif", true) == true -> AuthResult.Failed(AuthResult.Kind.BAD_CREDENTIALS, "Verify your email first. We sent a link to $who.")
            serverCode.contains("EXIST", true) || serverMsg?.contains("already", true) == true -> AuthResult.Failed(AuthResult.Kind.TAKEN, "That email or OS-ID already has an account. Sign in instead.")
            code == 401 || code == 403 || serverCode.contains("INVALID", true) -> AuthResult.Failed(AuthResult.Kind.BAD_CREDENTIALS, "That OS-ID or PIN didn't match.")
            code == 404 && obj == null -> AuthResult.Failed(AuthResult.Kind.SERVER, "aiimin.in isn't answering right now. Try again later.")
            code in 400..499 -> AuthResult.Failed(AuthResult.Kind.INVALID, serverMsg ?: "Check what you entered.")
            else -> AuthResult.Failed(AuthResult.Kind.SERVER, "aiimin.in is having a moment. Try again shortly.")
        }
    }

}
