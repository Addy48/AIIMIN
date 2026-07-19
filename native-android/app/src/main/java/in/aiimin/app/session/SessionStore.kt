package `in`.aiimin.app.session

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map

private val Context.dataStore by preferencesDataStore("aiimin_session")

class SessionStore(private val context: Context) {
    private val tokenKey = stringPreferencesKey("session_token")
    private val emailKey = stringPreferencesKey("email")
    private val deviceKey = stringPreferencesKey("device_id")

    val tokenFlow: Flow<String?> = context.dataStore.data.map { it[tokenKey] }
    val emailFlow: Flow<String?> = context.dataStore.data.map { it[emailKey] }

    suspend fun saveSession(token: String, email: String?) {
        context.dataStore.edit {
            it[tokenKey] = token
            if (email != null) it[emailKey] = email
        }
    }

    suspend fun deviceId(): String {
        val existing = context.dataStore.data.map { it[deviceKey] }.first()
        if (!existing.isNullOrBlank()) return existing
        val fresh = java.util.UUID.randomUUID().toString()
        context.dataStore.edit { it[deviceKey] = fresh }
        return fresh
    }

    suspend fun clear() {
        context.dataStore.edit { prefs ->
            val keepDevice = prefs[deviceKey]
            prefs.clear()
            if (keepDevice != null) prefs[deviceKey] = keepDevice
        }
    }

    suspend fun currentEmail(): String? = emailFlow.first()

    suspend fun currentToken(): String? = tokenFlow.first()
}
