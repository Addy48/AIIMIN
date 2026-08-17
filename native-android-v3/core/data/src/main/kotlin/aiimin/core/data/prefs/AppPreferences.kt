package aiimin.core.data.prefs

/**
 * Durable key-value prefs for the V3 shell.
 *
 * Scope is narrow on purpose (G8): theme, reduce-motion, onboarding gate,
 * calibration identity, session token, and connections JSON.
 */
interface AppPreferences {
    suspend fun read(): PersistedPrefs
    suspend fun writeTheme(dark: Boolean)
    suspend fun writeReduceMotion(on: Boolean)
    suspend fun writeOnboardingCompleted(completed: Boolean)
    suspend fun writeCalibration(osId: String, arc: String, minimumsLabel: String)
    suspend fun writeConnectionsJson(json: String)
    suspend fun writeSession(token: String, label: String?)
    suspend fun clearSession()
    suspend fun writeDeviceId(deviceId: String)
    suspend fun setOfflineDemo(on: Boolean)
    suspend fun writeOutboxJson(json: String)
    suspend fun writeMoneyOutboxJson(json: String)
    suspend fun writePaymentDraftsJson(json: String)
    suspend fun writeSmsOptIn(on: Boolean)
    suspend fun writeSmsLastScanMs(ms: Long)
    suspend fun writeSubscriptionTier(tierId: String)
    suspend fun writeBiometricEnabled(on: Boolean)
}

/** Snapshot applied once at store hydrate. Missing keys → craft defaults. */
data class PersistedPrefs(
    val darkTheme: Boolean = true,
    val reduceMotion: Boolean = false,
    /** Default false — unsigned installs must sign in before shell. */
    val onboardingCompleted: Boolean = false,
    val osId: String? = null,
    val arc: String? = null,
    val minimumsLabel: String? = null,
    val isSeed: Boolean = true,
    val connectionsJson: String? = null,
    val sessionToken: String? = null,
    val sessionLabel: String? = null,
    val deviceId: String? = null,
    val offlineDemo: Boolean = false,
    val outboxJson: String? = null,
    val moneyOutboxJson: String? = null,
    val paymentDraftsJson: String? = null,
    /** Founder opt-in: scan transactional SMS when READ_SMS granted. */
    val smsOptIn: Boolean = false,
    val smsLastScanMs: Long? = null,
    /** explore | core | pro | elite — same ids as web tierGating. */
    val subscriptionTier: String? = null,
    val biometricEnabled: Boolean = false,
)

/** JVM / unit-test stand-in — no disk, same defaults as a cold DataStore. */
class InMemoryAppPreferences(
    initial: PersistedPrefs = PersistedPrefs(),
) : AppPreferences {
    @Volatile
    private var snap: PersistedPrefs = initial

    override suspend fun read(): PersistedPrefs = snap

    override suspend fun writeTheme(dark: Boolean) {
        snap = snap.copy(darkTheme = dark)
    }

    override suspend fun writeReduceMotion(on: Boolean) {
        snap = snap.copy(reduceMotion = on)
    }

    override suspend fun writeOnboardingCompleted(completed: Boolean) {
        snap = snap.copy(onboardingCompleted = completed)
    }

    override suspend fun writeCalibration(osId: String, arc: String, minimumsLabel: String) {
        snap = snap.copy(
            osId = osId,
            arc = arc,
            minimumsLabel = minimumsLabel,
            isSeed = false,
        )
    }

    override suspend fun writeConnectionsJson(json: String) {
        snap = snap.copy(connectionsJson = json)
    }

    override suspend fun writeSession(token: String, label: String?) {
        snap = snap.copy(sessionToken = token, sessionLabel = label)
    }

    override suspend fun clearSession() {
        snap = snap.copy(sessionToken = null, sessionLabel = null)
    }

    override suspend fun writeDeviceId(deviceId: String) {
        snap = snap.copy(deviceId = deviceId)
    }

    override suspend fun setOfflineDemo(on: Boolean) {
        snap = snap.copy(offlineDemo = on)
    }

    override suspend fun writeOutboxJson(json: String) {
        snap = snap.copy(outboxJson = json)
    }

    override suspend fun writeMoneyOutboxJson(json: String) {
        snap = snap.copy(moneyOutboxJson = json)
    }

    override suspend fun writePaymentDraftsJson(json: String) {
        snap = snap.copy(paymentDraftsJson = json)
    }

    override suspend fun writeSmsOptIn(on: Boolean) {
        snap = snap.copy(smsOptIn = on)
    }

    override suspend fun writeSmsLastScanMs(ms: Long) {
        snap = snap.copy(smsLastScanMs = ms)
    }

    override suspend fun writeSubscriptionTier(tierId: String) {
        snap = snap.copy(subscriptionTier = tierId)
    }

    override suspend fun writeBiometricEnabled(on: Boolean) {
        snap = snap.copy(biometricEnabled = on)
    }
}
