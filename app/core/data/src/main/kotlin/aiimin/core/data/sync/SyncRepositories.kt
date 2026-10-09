package aiimin.core.data.sync

import aiimin.core.data.core.DayClock
import aiimin.core.data.core.EventLogger
import aiimin.core.data.settings.SettingsStore
import aiimin.core.data.util.newId
import aiimin.core.database.MoneyDao
import aiimin.core.database.NoteDao
import aiimin.core.database.NoteEntity
import aiimin.core.database.TaskDao
import aiimin.core.database.TaskEntity
import aiimin.core.engine.Tier
import aiimin.core.model.OsIdRules
import aiimin.core.network.AiiminApi
import aiimin.core.network.ApiAuth
import aiimin.core.network.CreateMoneyTransactionRequest
import aiimin.core.network.CreateTaskRequest
import aiimin.core.network.DeviceRequest
import aiimin.core.network.SessionCookieJar
import aiimin.core.network.SignInRequest
import aiimin.core.network.SignInUsernameRequest
import aiimin.core.network.SyncBatchRequest
import aiimin.core.network.SyncMutationDto
import aiimin.core.network.UpdateTaskRequest
import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import java.time.Instant
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

data class Session(val token: String?, val label: String?) {
    val signedIn get() = !token.isNullOrBlank()
}

/** aiimin.in account: OS-ID or email + 6-digit PIN, same as the website. */
@Singleton
class AuthRepository @Inject constructor(
    @ApplicationContext private val context: Context,
    private val api: AiiminApi,
    private val cookies: SessionCookieJar,
    private val settings: SettingsStore,
) {
    private val token = stringPreferencesKey("token")
    private val label = stringPreferencesKey("label")
    private val json = Json { ignoreUnknownKeys = true; isLenient = true }

    val session: Flow<Session> = context.session.data.map { Session(it[token], it[label]) }

    /** Restore the bearer for this process; drop it only on a clear 401. */
    suspend fun restore(): Boolean {
        val s = session.first()
        if (!s.signedIn) return false
        ApiAuth.set(s.token)
        return runCatching {
            val res = api.getSession()
            if (res.code() == 401) {
                signOut()
                false
            } else {
                true
            }
        }.getOrDefault(true)
    }

    suspend fun signIn(identifier: String, pin: String): Result<Unit> = runCatching {
        require(pin.length == 6 && pin.all(Char::isDigit)) { "Your PIN is 6 digits" }
        val id = identifier.trim()
        val res = if (OsIdRules.isEmailIdentifier(id)) {
            api.signInEmail(SignInRequest(id.lowercase(Locale.US), pin))
        } else {
            val osId = OsIdRules.normalize(id)
            val email = runCatching { api.resolve(osId).takeIf { it.isSuccessful }?.body()?.email }.getOrNull()
            if (!email.isNullOrBlank()) api.signInEmail(SignInRequest(email.lowercase(Locale.US), pin)) else api.signInUsername(SignInUsernameRequest(osId, pin))
        }
        if (!res.isSuccessful) {
            val msg = runCatching {
                json.parseToJsonElement(res.errorBody()?.string().orEmpty()).jsonObject.let { (it["message"] ?: it["error"])?.jsonPrimitive?.content }
            }.getOrNull()
            error(msg ?: "Couldn't sign in (${res.code()})")
        }
        val t = cookies.sessionToken() ?: res.headers().values("set-cookie").firstNotNullOfOrNull { raw ->
            raw.substringBefore(';').takeIf { it.substringBefore('=').contains("session_token", true) }?.substringAfter('=')
        } ?: ApiAuth.COOKIE_ONLY
        context.session.edit {
            it[token] = t
            it[label] = if (OsIdRules.isEmailIdentifier(id)) id.lowercase(Locale.US) else OsIdRules.normalize(id)
        }
        ApiAuth.set(t)
        runCatching { api.registerDevice(DeviceRequest(deviceId = settings.deviceId(), appVersion = "4.0.0-alpha01")) }
    }

    suspend fun signOut() {
        cookies.clear()
        ApiAuth.clear()
        context.session.edit { it.clear() }
    }
}

data class SyncReport(val pushed: Int, val pulled: Int, val failed: Int, val at: Long)

/**
 * Keeps the app and aiimin.in in step. Local-first: the phone works offline
 * and syncs when it can. Journal text only leaves the phone if you switch on
 * journal sync.
 */
@Singleton
class SyncRepository @Inject constructor(
    private val api: AiiminApi,
    private val auth: AuthRepository,
    private val tasks: TaskDao,
    private val notes: NoteDao,
    private val money: MoneyDao,
    private val settings: SettingsStore,
    private val clock: DayClock,
    private val log: EventLogger,
) {
    suspend fun sync(): SyncReport? {
        if (!auth.session.first().signedIn) return null
        ApiAuth.set(auth.session.first().token)
        var pushed = 0
        var pulled = 0
        var failed = 0
        val since = settings.current().lastSyncAt ?: 0L

        // Tasks: push new + completion changes, pull what was added on the web.
        for (t in tasks.unsynced().filter { it.assignee == null && it.day != null }) {
            runCatching {
                api.createTask(CreateTaskRequest(t.title, t.day, t.time)).data?.id?.let { rid ->
                    tasks.upsert(t.copy(remoteId = rid))
                    if (t.done) api.updateTask(rid, UpdateTaskRequest(completed = true))
                    pushed++
                }
            }.onFailure { failed++ }
        }
        runCatching {
            val today = clock.today().toString()
            tasks.forDayNow(today).filter { it.remoteId != null && it.updatedAt > since }.forEach { t ->
                runCatching { api.updateTask(t.remoteId!!, UpdateTaskRequest(completed = t.done, title = t.title)); pushed++ }.onFailure { failed++ }
            }
            api.tasks(today).data.forEach { dto ->
                val rid = dto.id ?: return@forEach
                val title = dto.title
                if (tasks.byRemote(rid) == null && !title.isNullOrBlank()) {
                    val now = System.currentTimeMillis()
                    tasks.upsert(
                        TaskEntity(
                            id = newId(), title = title, day = dto.dueDate?.take(10) ?: today, time = dto.dueTime?.take(5), part = null,
                            createdAt = now, scheduledAt = now, done = dto.completed == true, doneDay = if (dto.completed == true) today else null,
                            remoteId = rid, updatedAt = now,
                        ),
                    )
                    pulled++
                }
            }
        }.onFailure { failed++ }

        // Notes: batch upserts / deletes.
        val dirty = notes.dirty()
        if (dirty.isNotEmpty()) {
            runCatching {
                val res = api.syncBatch(
                    SyncBatchRequest(dirty.take(50).map { n -> noteMutation(n) }),
                    idempotencyKey = "notes-" + dirty.take(50).joinToString("") { it.updatedAt.toString().takeLast(4) }.hashCode(),
                )
                res.results.filter { it.ok == true }.forEach { r ->
                    dirty.firstOrNull { it.id == r.id }?.let { notes.upsert(it.copy(dirty = false, remoteId = r.entityId ?: it.remoteId)) }
                    pushed++
                }
                failed += res.results.count { it.ok != true }
            }.onFailure { failed++ }
        }
        // Notes written on the website.
        runCatching {
            api.bootstrap().notes.forEach { dto ->
                val rid = dto.id ?: return@forEach
                if (notes.byRemote(rid) == null && notes.get(rid) == null) {
                    val now = System.currentTimeMillis()
                    notes.upsert(NoteEntity(rid, dto.title ?: "Untitled", dto.content ?: "", createdAt = now, updatedAt = now, remoteId = rid, dirty = false))
                    pulled++
                }
            }
        }

        // Money: local transactions to the web ledger, once each.
        money.betweenNow(clock.today().minusDays(35).toString(), clock.today().toString())
            .filter { it.remoteId == null && !it.deleted && it.ledger == "PERSONAL" }
            .take(40)
            .forEach { t ->
                runCatching {
                    val dto = api.createMoneyTransaction(
                        CreateMoneyTransactionRequest(t.amountPaise / 100.0, if (t.direction == "in") "income" else "expense", t.category, t.title, t.day, t.note, "android"),
                        idempotencyKey = t.id,
                    )
                    money.upsert(t.copy(remoteId = dto.id ?: "sent"))
                    pushed++
                }.onFailure { failed++ }
            }

        val now = System.currentTimeMillis()
        settings.update { it.copy(lastSyncAt = now) }
        log.log("sync", data = mapOf("pushed" to pushed, "pulled" to pulled, "failed" to failed), tier = Tier.A, source = "system")
        return SyncReport(pushed, pulled, failed, now)
    }

    private fun noteMutation(n: NoteEntity) = SyncMutationDto(
        id = n.id,
        type = if (n.deleted) "note.delete" else "note.upsert",
        payload = if (n.deleted) mapOf("id" to (n.remoteId ?: n.id)) else mapOf(
            "id" to (n.remoteId ?: n.id), "title" to n.title, "content" to n.body, "pinned" to n.pinned.toString(),
        ),
        clientMutatedAt = Instant.ofEpochMilli(n.updatedAt).toString(),
    )
}
