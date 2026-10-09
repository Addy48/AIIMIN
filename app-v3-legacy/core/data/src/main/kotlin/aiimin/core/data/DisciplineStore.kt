package aiimin.core.data

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.longPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import dagger.hilt.android.qualifiers.ApplicationContext
import java.time.Instant
import java.util.UUID
import javax.inject.Inject
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map

data class DisciplineRecordState(
    val streakDays: Int = 0,
    val totalLogs: Int = 0,
    val category: String = "screen",
    val intensity: Int = 3,
    val note: String = "",
    val lastOutcome: String? = null,
    val lastLoggedAt: Long? = null,
    val notice: String? = null,
)

data class DisciplineEventDraft(
    val id: String,
    val category: String,
    val intensity: Int,
    val outcome: String,
    val note: String,
    val startedAt: String,
    val resolvedAt: String,
)

class DisciplineStore @Inject constructor(
    private val dataStore: DataStore<Preferences>,
    @ApplicationContext context: Context,
) {
    private val cipher = SensitiveCipher()
    private val streakKey = stringPreferencesKey("discipline_vault_streak_v1")
    private val totalKey = stringPreferencesKey("discipline_vault_total_v1")
    private val categoryKey = stringPreferencesKey("discipline_vault_category_v1")
    private val intensityKey = stringPreferencesKey("discipline_vault_intensity_v1")
    private val noteKey = stringPreferencesKey("discipline_vault_note_v1")
    private val outcomeKey = stringPreferencesKey("discipline_vault_outcome_v1")
    private val loggedAtKey = stringPreferencesKey("discipline_vault_logged_at_v1")
    private val noticeKey = stringPreferencesKey("discipline_vault_notice_v1")
    // Legacy keys are only read for a one-time compatibility migration.
    private val oldStreakKey = intPreferencesKey("discipline_streak_days")
    private val oldTotalKey = intPreferencesKey("discipline_total_logs")
    private val oldCategoryKey = stringPreferencesKey("discipline_category")
    private val oldIntensityKey = intPreferencesKey("discipline_intensity")
    private val oldNoteKey = stringPreferencesKey("discipline_note")
    private val oldOutcomeKey = stringPreferencesKey("discipline_last_outcome")
    private val oldLoggedAtKey = longPreferencesKey("discipline_last_logged_at")
    private val oldNoticeKey = stringPreferencesKey("discipline_notice")

    private fun read(prefs: Preferences, key: Preferences.Key<String>, old: String? = null): String? =
        cipher.decrypt(prefs[key]) ?: old

    val state: Flow<DisciplineRecordState> = dataStore.data.map { prefs ->
        DisciplineRecordState(
            streakDays = read(prefs, streakKey, prefs[oldStreakKey]?.toString())?.toIntOrNull() ?: 0,
            totalLogs = read(prefs, totalKey, prefs[oldTotalKey]?.toString())?.toIntOrNull() ?: 0,
            category = read(prefs, categoryKey, prefs[oldCategoryKey]) ?: "screen",
            intensity = (read(prefs, intensityKey, prefs[oldIntensityKey]?.toString())?.toIntOrNull() ?: 3).coerceIn(1, 5),
            note = read(prefs, noteKey, prefs[oldNoteKey]) ?: "",
            lastOutcome = read(prefs, outcomeKey, prefs[oldOutcomeKey]),
            lastLoggedAt = read(prefs, loggedAtKey, prefs[oldLoggedAtKey]?.toString())?.toLongOrNull(),
            notice = read(prefs, noticeKey, prefs[oldNoticeKey]),
        )
    }

    suspend fun setCategory(value: String) { dataStore.edit { it[categoryKey] = cipher.encrypt(value) } }
    suspend fun setIntensity(value: Int) { dataStore.edit { it[intensityKey] = cipher.encrypt(value.coerceIn(1, 5).toString()) } }
    suspend fun setNote(value: String) { dataStore.edit { it[noteKey] = cipher.encrypt(value.take(1_000)) } }
    suspend fun dismissNotice() { dataStore.edit { it.remove(noticeKey) } }

    suspend fun mergeRemoteSummary(streakDays: Int, totalLogs: Int, lastOutcome: String?) {
        val local = state.first()
        if (totalLogs < local.totalLogs) return
        dataStore.edit { prefs ->
            prefs[streakKey] = cipher.encrypt(streakDays.coerceAtLeast(0).toString())
            prefs[totalKey] = cipher.encrypt(totalLogs.coerceAtLeast(0).toString())
            lastOutcome?.let { prefs[outcomeKey] = cipher.encrypt(it) }
        }
    }

    suspend fun logOutcome(outcome: String): DisciplineEventDraft {
        val snapshot = state.first()
        val now = System.currentTimeMillis()
        val nextStreak = if (outcome == "resisted") snapshot.streakDays + 1 else 0
        val draft = DisciplineEventDraft(
            id = UUID.randomUUID().toString(),
            category = snapshot.category,
            intensity = snapshot.intensity,
            outcome = outcome,
            note = snapshot.note,
            startedAt = Instant.ofEpochMilli(now - 5 * 60_000L).toString(),
            resolvedAt = Instant.ofEpochMilli(now).toString(),
        )
        dataStore.edit { prefs ->
            prefs[streakKey] = cipher.encrypt(nextStreak.toString())
            prefs[totalKey] = cipher.encrypt((snapshot.totalLogs + 1).toString())
            prefs[outcomeKey] = cipher.encrypt(outcome)
            prefs[loggedAtKey] = cipher.encrypt(now.toString())
            prefs[noticeKey] = cipher.encrypt(if (outcome == "resisted") "Resisted logged · ${nextStreak}d streak" else "Logged without judgement · reset the next decision")
            prefs[noteKey] = cipher.encrypt("")
            prefs.remove(oldStreakKey)
            prefs.remove(oldTotalKey)
            prefs.remove(oldCategoryKey)
            prefs.remove(oldIntensityKey)
            prefs.remove(oldNoteKey)
            prefs.remove(oldOutcomeKey)
            prefs.remove(oldLoggedAtKey)
            prefs.remove(oldNoticeKey)
        }
        return draft
    }
}
