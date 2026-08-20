package aiimin.core.data.prefs

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.emptyPreferences
import androidx.datastore.preferences.core.stringPreferencesKey
import java.io.IOException
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.first

/**
 * Preferences DataStore backend. Corruption / IO → empty prefs (seed defaults),
 * never a broad catch that swallows [CancellationException].
 */
class DataStoreAppPreferences(
    private val dataStore: DataStore<Preferences>,
) : AppPreferences {

    override suspend fun read(): PersistedPrefs {
        val prefs = dataStore.data
            .catch { e -> if (e is IOException) emit(emptyPreferences()) else throw e }
            .first()
        return prefs.toPersisted()
    }

    override suspend fun writeTheme(dark: Boolean) {
        dataStore.edit { it[Keys.DARK_THEME] = dark }
    }

    override suspend fun writeReduceMotion(on: Boolean) {
        dataStore.edit { it[Keys.REDUCE_MOTION] = on }
    }

    override suspend fun writeOnboardingCompleted(completed: Boolean) {
        dataStore.edit { it[Keys.ONBOARDING_COMPLETED] = completed }
    }

    override suspend fun writeCalibration(osId: String, arc: String, minimumsLabel: String) {
        dataStore.edit {
            it[Keys.OS_ID] = osId
            it[Keys.ARC] = arc
            it[Keys.MINIMUMS_LABEL] = minimumsLabel
            it[Keys.IS_SEED] = false
        }
    }

    override suspend fun writeConnectionsJson(json: String) {
        dataStore.edit { it[Keys.CONNECTIONS_JSON] = json }
    }

    override suspend fun writeSession(token: String, label: String?) {
        dataStore.edit {
            it[Keys.SESSION_TOKEN] = token
            if (label != null) it[Keys.SESSION_LABEL] = label
            else it.remove(Keys.SESSION_LABEL)
        }
    }

    override suspend fun clearSession() {
        dataStore.edit {
            it.remove(Keys.SESSION_TOKEN)
            it.remove(Keys.SESSION_LABEL)
        }
    }

    override suspend fun writeDeviceId(deviceId: String) {
        dataStore.edit { it[Keys.DEVICE_ID] = deviceId }
    }

    override suspend fun setOfflineDemo(on: Boolean) {
        dataStore.edit { it[Keys.OFFLINE_DEMO] = on }
    }

    override suspend fun writeOutboxJson(json: String) {
        dataStore.edit { it[Keys.OUTBOX_JSON] = json }
    }

    override suspend fun writeMoneyOutboxJson(json: String) {
        dataStore.edit { it[Keys.MONEY_OUTBOX_JSON] = json }
    }

    override suspend fun writePaymentDraftsJson(json: String) {
        dataStore.edit { it[Keys.PAYMENT_DRAFTS_JSON] = json }
    }

    override suspend fun writeSmsOptIn(on: Boolean) {
        dataStore.edit { it[Keys.SMS_OPT_IN] = on }
    }

    override suspend fun writeSmsLastScanMs(ms: Long) {
        dataStore.edit { it[Keys.SMS_LAST_SCAN_MS] = ms.toString() }
    }

    override suspend fun writeSubscriptionTier(tierId: String) {
        dataStore.edit { it[Keys.SUBSCRIPTION_TIER] = tierId }
    }

    override suspend fun writeBiometricEnabled(on: Boolean) {
        dataStore.edit { it[Keys.BIOMETRIC_ENABLED] = on }
    }

    private object Keys {
        val DARK_THEME = booleanPreferencesKey("dark_theme")
        val REDUCE_MOTION = booleanPreferencesKey("reduce_motion")
        val ONBOARDING_COMPLETED = booleanPreferencesKey("onboarding_completed")
        val OS_ID = stringPreferencesKey("os_id")
        val ARC = stringPreferencesKey("arc")
        val MINIMUMS_LABEL = stringPreferencesKey("minimums_label")
        val IS_SEED = booleanPreferencesKey("is_seed")
        val CONNECTIONS_JSON = stringPreferencesKey("connections_json")
        val SESSION_TOKEN = stringPreferencesKey("session_token")
        val SESSION_LABEL = stringPreferencesKey("session_label")
        val DEVICE_ID = stringPreferencesKey("device_id")
        val OFFLINE_DEMO = booleanPreferencesKey("offline_demo")
        val OUTBOX_JSON = stringPreferencesKey("sync_outbox_json")
        val MONEY_OUTBOX_JSON = stringPreferencesKey("money_outbox_json")
        val PAYMENT_DRAFTS_JSON = stringPreferencesKey("payment_drafts_json")
        val SMS_OPT_IN = booleanPreferencesKey("sms_opt_in")
        val SMS_LAST_SCAN_MS = stringPreferencesKey("sms_last_scan_ms")
        val SUBSCRIPTION_TIER = stringPreferencesKey("subscription_tier")
        val BIOMETRIC_ENABLED = booleanPreferencesKey("biometric_enabled")
    }

    private fun Preferences.toPersisted() = PersistedPrefs(
        darkTheme = this[Keys.DARK_THEME] ?: true,
        reduceMotion = this[Keys.REDUCE_MOTION] ?: false,
        onboardingCompleted = this[Keys.ONBOARDING_COMPLETED] ?: false,
        osId = this[Keys.OS_ID],
        arc = this[Keys.ARC],
        minimumsLabel = this[Keys.MINIMUMS_LABEL],
        isSeed = this[Keys.IS_SEED] ?: true,
        connectionsJson = this[Keys.CONNECTIONS_JSON],
        sessionToken = this[Keys.SESSION_TOKEN],
        sessionLabel = this[Keys.SESSION_LABEL],
        deviceId = this[Keys.DEVICE_ID],
        offlineDemo = this[Keys.OFFLINE_DEMO] ?: false,
        outboxJson = this[Keys.OUTBOX_JSON],
        moneyOutboxJson = this[Keys.MONEY_OUTBOX_JSON],
        paymentDraftsJson = this[Keys.PAYMENT_DRAFTS_JSON],
        smsOptIn = this[Keys.SMS_OPT_IN] ?: false,
        smsLastScanMs = this[Keys.SMS_LAST_SCAN_MS]?.toLongOrNull(),
        subscriptionTier = this[Keys.SUBSCRIPTION_TIER],
        biometricEnabled = this[Keys.BIOMETRIC_ENABLED] ?: false,
    )
}
