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

    private object Keys {
        val DARK_THEME = booleanPreferencesKey("dark_theme")
        val REDUCE_MOTION = booleanPreferencesKey("reduce_motion")
        val ONBOARDING_COMPLETED = booleanPreferencesKey("onboarding_completed")
        val OS_ID = stringPreferencesKey("os_id")
        val ARC = stringPreferencesKey("arc")
        val MINIMUMS_LABEL = stringPreferencesKey("minimums_label")
        val IS_SEED = booleanPreferencesKey("is_seed")
    }

    private fun Preferences.toPersisted() = PersistedPrefs(
        darkTheme = this[Keys.DARK_THEME] ?: true,
        reduceMotion = this[Keys.REDUCE_MOTION] ?: false,
        onboardingCompleted = this[Keys.ONBOARDING_COMPLETED] ?: true,
        osId = this[Keys.OS_ID],
        arc = this[Keys.ARC],
        minimumsLabel = this[Keys.MINIMUMS_LABEL],
        isSeed = this[Keys.IS_SEED] ?: true,
    )
}
