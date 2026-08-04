package aiimin.core.data.prefs

/**
 * Durable key-value prefs for the V3 shell.
 *
 * Scope is narrow on purpose (G8): theme, reduce-motion, onboarding gate, and
 * the identity fields calibration writes. Day / Money / Lab seed data stays
 * in-memory until Room or the API owns it.
 */
interface AppPreferences {
    suspend fun read(): PersistedPrefs
    suspend fun writeTheme(dark: Boolean)
    suspend fun writeReduceMotion(on: Boolean)
    suspend fun writeOnboardingCompleted(completed: Boolean)
    suspend fun writeCalibration(osId: String, arc: String, minimumsLabel: String)
}

/** Snapshot applied once at store hydrate. Missing keys → craft defaults. */
data class PersistedPrefs(
    val darkTheme: Boolean = true,
    val reduceMotion: Boolean = false,
    /** Craft default true so shell screens stay reachable without replaying. */
    val onboardingCompleted: Boolean = true,
    val osId: String? = null,
    val arc: String? = null,
    val minimumsLabel: String? = null,
    val isSeed: Boolean = true,
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
}
