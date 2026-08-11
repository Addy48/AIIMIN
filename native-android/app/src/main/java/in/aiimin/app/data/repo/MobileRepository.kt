package `in`.aiimin.app.data.repo

import com.squareup.moshi.Moshi
import com.squareup.moshi.Types
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import `in`.aiimin.app.data.local.AiiminDatabase
import `in`.aiimin.app.data.local.HabitCacheEntity
import `in`.aiimin.app.data.local.JournalCacheEntity
import `in`.aiimin.app.data.local.NoteCacheEntity
import `in`.aiimin.app.data.local.OutboxEntity
import `in`.aiimin.app.data.network.ApiClient
import `in`.aiimin.app.data.network.AgendaDto
import `in`.aiimin.app.data.network.BootstrapResponse
import `in`.aiimin.app.data.network.BootstrapUser
import `in`.aiimin.app.data.network.DeviceRequest
import `in`.aiimin.app.data.network.DriveStatusDto
import `in`.aiimin.app.data.network.FamilyDocDto
import `in`.aiimin.app.data.network.GoalDto
import `in`.aiimin.app.data.network.AuthApi
import `in`.aiimin.app.data.network.MobileApi
import `in`.aiimin.app.data.network.PasswordResetRequest
import `in`.aiimin.app.data.network.ResumeDto
import `in`.aiimin.app.data.network.SignInRequest
import `in`.aiimin.app.data.network.SignInUsernameRequest
import `in`.aiimin.app.data.network.SignUpRequest
import `in`.aiimin.app.data.network.SyncBatchRequest
import `in`.aiimin.app.data.network.SyncMutation
import `in`.aiimin.app.session.SessionStore
import `in`.aiimin.app.ui.auth.OsIdRules
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import retrofit2.HttpException
import java.util.Locale
import java.util.UUID

data class VaultSnapshot(
    val family: List<FamilyDocDto> = emptyList(),
    val resumes: List<ResumeDto> = emptyList(),
    val drive: DriveStatusDto? = null,
    val agenda: List<AgendaDto> = emptyList(),
    val goals: List<GoalDto> = emptyList(),
    val user: BootstrapUser? = null,
    val serverTime: String? = null,
    val lifeScore: Any? = null,
)

data class SyncUiState(
    val isSyncing: Boolean = false,
    val lastSyncedAtMillis: Long? = null,
    val lastError: String? = null,
    val usingCache: Boolean = false,
    val pendingOutbox: Int = 0,
)

class MobileRepository(
    private val api: MobileApi,
    private val authApi: AuthApi,
    private val db: AiiminDatabase,
    private val sessionStore: SessionStore,
) {
    private val moshi = Moshi.Builder().add(KotlinJsonAdapterFactory()).build()
    private val mapAdapter = moshi.adapter<Map<String, Any?>>(
        Types.newParameterizedType(Map::class.java, String::class.java, Any::class.java),
    )

    private val _vault = MutableStateFlow(VaultSnapshot())
    val vault: StateFlow<VaultSnapshot> = _vault.asStateFlow()

    private val _syncUi = MutableStateFlow(SyncUiState())
    val syncUi: StateFlow<SyncUiState> = _syncUi.asStateFlow()

    fun updatePendingOutboxCount(count: Int) {
        _syncUi.value = _syncUi.value.copy(pendingOutbox = count)
    }

    fun habits(): Flow<List<HabitCacheEntity>> = db.habits().observe()
    fun notes(): Flow<List<NoteCacheEntity>> = db.notes().observe()
    fun journal(): Flow<List<JournalCacheEntity>> = db.journal().observe()

    suspend fun resolveIdentifier(identifier: String): Result<String?> = runCatching {
        val id = identifier.trim()
        if (OsIdRules.isEmailIdentifier(id)) return@runCatching id.lowercase(Locale.US)
        val auth = authApi
        val res = auth.resolve(OsIdRules.normalizeOsId(id))
        if (res.code() == 404) return@runCatching null
        val body = res.body()
        if (!res.isSuccessful) {
            error(body?.error ?: "Could not resolve OS-ID (${res.code()})")
        }
        body?.email
    }

    /** Cold start: token must load real bootstrap or we kick back to welcome gate. */
    suspend fun validateSession(): Boolean {
        if (!ensureBearerToken()) return false
        return runCatching {
            refreshBootstrap()
            true
        }.recoverCatching { e ->
            if (e is HttpException && e.code() == 401) {
                clearSession()
                false
            } else if (verifySessionAlive()) {
                true
            } else {
                clearSession()
                false
            }
        }.getOrElse {
            clearSession()
            false
        }
    }

    private suspend fun ensureBearerToken(): Boolean {
        val stored = sessionStore.currentToken()
        if (stored.isNullOrBlank()) return false
        if (stored != ApiClient.COOKIE_ONLY_TOKEN) return true
        val fromJar = ApiClient.sessionTokenFromJar()
        if (!fromJar.isNullOrBlank()) {
            sessionStore.saveSession(fromJar, sessionStore.currentEmail())
            return true
        }
        return verifySessionAlive()
    }

    private suspend fun verifySessionAlive(): Boolean {
        val res = authApi.getSession()
        if (!res.isSuccessful) return false
        val token = res.body()?.session?.token
        if (!token.isNullOrBlank()) {
            sessionStore.saveSession(token, res.body()?.user?.email ?: sessionStore.currentEmail())
        }
        return res.body()?.user != null
    }

    private suspend fun clearSession() {
        ApiClient.clearCookies()
        sessionStore.clear()
        _vault.value = VaultSnapshot()
    }

    /** Website parity: OS-ID or email + 6-digit PIN. */
    suspend fun signInWithOsIdOrEmail(identifier: String, pin: String): Result<Unit> = runCatching {
        require(pin.length == 6 && pin.all { it.isDigit() }) { "PIN must be 6 digits" }
        val auth = authApi
        val id = identifier.trim()
        val res = if (OsIdRules.isEmailIdentifier(id)) {
            auth.signInEmail(SignInRequest(id.lowercase(Locale.US), pin))
        } else {
            val osId = OsIdRules.normalizeOsId(id)
            val resolved = runCatching {
                val r = auth.resolve(osId)
                if (r.isSuccessful) r.body()?.email else null
            }.getOrNull()
            if (!resolved.isNullOrBlank()) {
                auth.signInEmail(SignInRequest(resolved.lowercase(Locale.US), pin))
            } else {
                auth.signInUsername(SignInUsernameRequest(osId, pin))
            }
        }
        if (!res.isSuccessful) {
            val body = res.errorBody()?.string().orEmpty()
            error(parseAuthError(body) ?: "Sign-in failed (${res.code()})")
        }
        val token = ApiClient.resolveSessionToken(authApi, res)
        val label = if (OsIdRules.isEmailIdentifier(id)) id.lowercase(Locale.US) else OsIdRules.normalizeOsId(id)
        sessionStore.saveSession(token, label)
        registerDevice()
        refreshBootstrap()
        Unit
    }

    suspend fun signUpWithOsId(
        osId: String,
        pin: String,
        fullName: String,
        email: String,
    ): Result<Unit> = runCatching {
        require(pin.length == 6 && pin.all { it.isDigit() }) { "PIN must be 6 digits" }
        OsIdRules.validateOsId(osId)?.let { error(it) }
        val username = OsIdRules.normalizeOsId(osId)
        val authEmail = email.trim().lowercase(Locale.US).ifBlank {
            "${username.lowercase(Locale.US)}@aiimin.com"
        }
        val auth = authApi
        val res = auth.signUpEmail(
            SignUpRequest(
                email = authEmail,
                password = pin,
                name = fullName.trim().ifBlank { username },
                username = username,
            ),
        )
        if (!res.isSuccessful) {
            val body = res.errorBody()?.string().orEmpty()
            error(parseAuthError(body) ?: "Sign-up failed (${res.code()})")
        }
        val token = ApiClient.resolveSessionToken(authApi, res)
        sessionStore.saveSession(token, authEmail)
        registerDevice()
        refreshBootstrap()
        Unit
    }

    /** @deprecated Prefer signInWithOsIdOrEmail — kept for token paste escape hatch */
    suspend fun signIn(email: String, password: String): Result<Unit> =
        signInWithOsIdOrEmail(email, password)

    suspend fun signInWithToken(token: String, email: String?) {
        sessionStore.saveSession(token.trim(), email)
        registerDevice()
        refreshBootstrap()
    }

    suspend fun signOut() {
        clearSession()
    }

    suspend fun requestPasswordReset(identifier: String): Result<Unit> = runCatching {
        val auth = authApi
        val raw = identifier.trim()
        val email = if (OsIdRules.isEmailIdentifier(raw)) {
            raw.lowercase(Locale.US)
        } else {
            val resolved = auth.resolve(OsIdRules.normalizeOsId(raw))
            if (resolved.isSuccessful) resolved.body()?.email else null
        } ?: error("Could not resolve account email")
        val res = auth.requestPasswordReset(PasswordResetRequest(email = email))
        if (!res.isSuccessful) {
            val body = res.errorBody()?.string().orEmpty()
            error(parseAuthError(body) ?: "Could not send recovery link (${res.code()})")
        }
    }

    private fun parseAuthError(body: String): String? {
        if (body.isBlank()) return null
        return runCatching {
            val map = moshi.adapter<Map<String, Any?>>(
                Types.newParameterizedType(Map::class.java, String::class.java, Any::class.java),
            ).fromJson(body)
            (map?.get("message") ?: map?.get("error"))?.toString()
        }.getOrNull()
    }

    suspend fun registerDevice() {
        runCatching {
            api.registerDevice(DeviceRequest(deviceId = sessionStore.deviceId()))
        }
    }

    suspend fun refreshBootstrap(): BootstrapResponse {
        _syncUi.value = _syncUi.value.copy(isSyncing = true, lastError = null)
        return try {
            refreshBootstrapInternal()
        } catch (e: Exception) {
            _syncUi.value = _syncUi.value.copy(
                isSyncing = false,
                lastError = friendlySyncError(e),
                usingCache = true,
            )
            throw e
        }
    }

    /** Flush pending mutations then pull bootstrap. Outbox 404 never blocks refresh. */
    suspend fun syncAll(): Result<Unit> = runCatching {
        _syncUi.value = _syncUi.value.copy(isSyncing = true, lastError = null, usingCache = false)
        runCatching { flushOutboxSafe() }
        refreshBootstrapInternal()
        Unit
    }.onFailure { e ->
        val err = e as? Exception ?: Exception(e.message, e)
        _syncUi.value = _syncUi.value.copy(
            isSyncing = false,
            lastError = friendlySyncError(err),
            usingCache = true,
        )
    }

    private suspend fun flushOutboxSafe() {
        try {
            flushOutbox()
        } catch (e: HttpException) {
            if (e.code() == 404) return
            throw e
        }
    }

    private fun friendlySyncError(e: Exception): String = when (e) {
        is HttpException -> when (e.code()) {
            401 -> "Session expired — sign in again"
            404 -> "Could not reach sync API — showing cached data"
            in 500..599 -> "Server busy — try again shortly"
            else -> "Sync failed (HTTP ${e.code()})"
        }
        else -> e.message?.take(120) ?: "Sync failed"
    }

    private suspend fun refreshBootstrapInternal(): BootstrapResponse {
        val boot = api.bootstrap()
        if (boot.error != null) error(boot.error!!)
        val done = boot.habitCompletedToday.toSet()
        db.habits().upsertAll(
            boot.habits.map {
                HabitCacheEntity(
                    id = it.id,
                    name = it.name ?: "Habit",
                    emoji = it.emoji ?: "🎯",
                    doneToday = done.contains(it.id),
                )
            },
        )
        db.notes().upsertAll(
            boot.notes.mapNotNull { n ->
                val id = n.id ?: return@mapNotNull null
                NoteCacheEntity(
                    id = id,
                    title = n.title.orEmpty(),
                    content = n.content.orEmpty(),
                    color = n.color ?: "#2D2D2D",
                    pinned = n.pinned == true,
                    updatedAt = System.currentTimeMillis(),
                )
            },
        )
        db.journal().upsertAll(
            boot.journal.mapNotNull { j ->
                val id = j.id ?: return@mapNotNull null
                JournalCacheEntity(
                    id = id,
                    date = j.date.orEmpty(),
                    content = j.content.orEmpty(),
                    updatedAt = System.currentTimeMillis(),
                )
            },
        )
        _vault.value = VaultSnapshot(
            family = boot.familyDocuments,
            resumes = boot.resumes,
            drive = boot.drive,
            agenda = boot.agenda,
            goals = boot.goals,
            user = boot.user,
            serverTime = boot.serverTime,
            lifeScore = boot.lifeScore,
        )
        _syncUi.value = SyncUiState(
            isSyncing = false,
            lastSyncedAtMillis = System.currentTimeMillis(),
            lastError = null,
            usingCache = false,
        )
        return boot
    }

    suspend fun tickHabit(habitId: String) {
        db.habits().setDone(habitId, true)
        val id = UUID.randomUUID().toString()
        val payload = mapOf<String, Any?>(
            "habit_id" to habitId,
            "log_id" to id,
        )
        db.outbox().upsert(
            OutboxEntity(id = id, type = "habit.tick", payloadJson = mapAdapter.toJson(payload)),
        )
    }

    suspend fun saveJournal(content: String, date: String) {
        val id = UUID.randomUUID().toString()
        db.journal().upsert(JournalCacheEntity(id, date, content, System.currentTimeMillis()))
        val payload = mapOf<String, Any?>("id" to id, "content" to content, "date" to date)
        db.outbox().upsert(OutboxEntity(id, "journal.upsert", mapAdapter.toJson(payload)))
    }

    suspend fun saveNote(title: String, content: String, color: String) {
        val id = UUID.randomUUID().toString()
        db.notes().upsert(
            NoteCacheEntity(id, title, content, color, false, System.currentTimeMillis()),
        )
        val payload = mapOf<String, Any?>(
            "id" to id,
            "title" to title,
            "content" to content,
            "color" to color,
        )
        db.outbox().upsert(OutboxEntity(id, "note.upsert", mapAdapter.toJson(payload)))
    }

    suspend fun flushOutbox(): Int {
        val pending = db.outbox().pending()
        if (pending.isEmpty()) return 0
        val mutations = pending.map {
            val payload = mapAdapter.fromJson(it.payloadJson) ?: emptyMap()
            SyncMutation(id = it.id, type = it.type, payload = payload)
        }
        val res = try {
            api.syncBatch(
                SyncBatchRequest(mutations),
                idempotencyKey = UUID.randomUUID().toString(),
            )
        } catch (e: HttpException) {
            if (e.code() == 404) return 0
            throw e
        }
        var ok = 0
        res.results.forEach { r ->
            val id = r.id ?: return@forEach
            if (r.ok) {
                db.outbox().delete(id)
                ok++
            } else {
                db.outbox().setStatus(id, "error")
            }
        }
        return ok
    }
}
