package `in`.aiimin.app.data.prefs

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import org.json.JSONArray
import java.time.LocalDate

private val Context.appPrefsStore by preferencesDataStore("aiimin_app_prefs")

data class FocusStats(
    val todayMinutes: Int = 0,
    val todaySessions: Int = 0,
    val weeklyMinutes: List<Int> = List(7) { 0 },
)

enum class ThemeMode { SYSTEM, LIGHT, DARK }

data class NoteDraft(val title: String = "", val body: String = "", val color: String = "#2D2D2D")

class AppPrefs(private val context: Context) {
    private val focusDayKey = stringPreferencesKey("focus_day")
    private val focusTodayMinKey = intPreferencesKey("focus_today_min")
    private val focusTodaySessionsKey = intPreferencesKey("focus_today_sessions")
    private val focusWeekKey = stringPreferencesKey("focus_week_json")
    private val disciplineStreakKey = intPreferencesKey("discipline_streak")
    private val disciplineLastDayKey = stringPreferencesKey("discipline_last_day")
    private val themeModeKey = stringPreferencesKey("theme_mode")
    private val signupTierKey = stringPreferencesKey("signup_tier_awareness")
    private val signupLifeArcKey = stringPreferencesKey("signup_life_arc")
    private val noteDraftTitleKey = stringPreferencesKey("note_draft_title")
    private val noteDraftBodyKey = stringPreferencesKey("note_draft_body")
    private val noteDraftColorKey = stringPreferencesKey("note_draft_color")
    private val biometricUnlockKey = booleanPreferencesKey("biometric_unlock")

    val biometricUnlockEnabled: Flow<Boolean> = context.appPrefsStore.data.map {
        it[biometricUnlockKey] == true
    }

    val themeMode: Flow<ThemeMode> = context.appPrefsStore.data.map { prefs ->
        when (prefs[themeModeKey]) {
            "light" -> ThemeMode.LIGHT
            "dark" -> ThemeMode.DARK
            else -> ThemeMode.SYSTEM
        }
    }

    val noteDraft: Flow<NoteDraft> = context.appPrefsStore.data.map { prefs ->
        NoteDraft(
            title = prefs[noteDraftTitleKey] ?: "",
            body = prefs[noteDraftBodyKey] ?: "",
            color = prefs[noteDraftColorKey] ?: "#2D2D2D",
        )
    }

    val focusStats: Flow<FocusStats> = context.appPrefsStore.data.map { prefs ->
        val today = LocalDate.now().toString()
        val storedDay = prefs[focusDayKey]
        val todayMin = if (storedDay == today) prefs[focusTodayMinKey] ?: 0 else 0
        val todaySessions = if (storedDay == today) prefs[focusTodaySessionsKey] ?: 0 else 0
        val week = parseWeek(prefs[focusWeekKey], today)
        FocusStats(todayMin, todaySessions, week)
    }

    val disciplineStreak: Flow<Int> = context.appPrefsStore.data.map {
        it[disciplineStreakKey] ?: 0
    }

    suspend fun logFocusSession(durationMinutes: Int) {
        val today = LocalDate.now().toString()
        context.appPrefsStore.edit { prefs ->
            val storedDay = prefs[focusDayKey]
            val baseMin = if (storedDay == today) prefs[focusTodayMinKey] ?: 0 else 0
            val baseSessions = if (storedDay == today) prefs[focusTodaySessionsKey] ?: 0 else 0
            prefs[focusDayKey] = today
            prefs[focusTodayMinKey] = baseMin + durationMinutes
            prefs[focusTodaySessionsKey] = baseSessions + 1
            val week = parseWeek(prefs[focusWeekKey], today).toMutableList()
            val dayIndex = LocalDate.now().dayOfWeek.value - 1
            week[dayIndex] = week[dayIndex] + durationMinutes
            prefs[focusWeekKey] = JSONArray(week).toString()
        }
    }

    suspend fun logDisciplineUrge() {
        val today = LocalDate.now()
        val todayStr = today.toString()
        context.appPrefsStore.edit { prefs ->
            val last = prefs[disciplineLastDayKey]
            val streak = prefs[disciplineStreakKey] ?: 0
            val newStreak = when (last) {
                todayStr -> streak
                today.minusDays(1).toString() -> streak + 1
                else -> 1
            }
            prefs[disciplineLastDayKey] = todayStr
            prefs[disciplineStreakKey] = newStreak.coerceAtLeast(1)
        }
    }

    suspend fun currentFocusStats(): FocusStats = focusStats.first()
    suspend fun currentDisciplineStreak(): Int = disciplineStreak.first()

    suspend fun setBiometricUnlockEnabled(enabled: Boolean) {
        context.appPrefsStore.edit { prefs ->
            if (enabled) prefs[biometricUnlockKey] = true else prefs.remove(biometricUnlockKey)
        }
    }

    suspend fun setThemeMode(mode: ThemeMode) {
        context.appPrefsStore.edit { prefs ->
            prefs[themeModeKey] = when (mode) {
                ThemeMode.LIGHT -> "light"
                ThemeMode.DARK -> "dark"
                ThemeMode.SYSTEM -> "system"
            }
        }
    }

    suspend fun saveNoteDraft(draft: NoteDraft) {
        context.appPrefsStore.edit { prefs ->
            prefs[noteDraftTitleKey] = draft.title
            prefs[noteDraftBodyKey] = draft.body
            prefs[noteDraftColorKey] = draft.color
        }
    }

    suspend fun clearNoteDraft() {
        context.appPrefsStore.edit { prefs ->
            prefs.remove(noteDraftTitleKey)
            prefs.remove(noteDraftBodyKey)
            prefs.remove(noteDraftColorKey)
        }
    }

    suspend fun saveSignupAwareness(tier: String, lifeArc: String) {
        context.appPrefsStore.edit { prefs ->
            prefs[signupTierKey] = tier
            if (lifeArc.isNotBlank()) prefs[signupLifeArcKey] = lifeArc
        }
    }

    private fun parseWeek(json: String?, today: String): List<Int> {
        val base = List(7) { 0 }.toMutableList()
        if (json.isNullOrBlank()) return base
        return runCatching {
            val arr = JSONArray(json)
            for (i in 0 until minOf(7, arr.length())) {
                base[i] = arr.getInt(i)
            }
            base
        }.getOrDefault(base)
    }
}
