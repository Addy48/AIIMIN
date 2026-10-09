package aiimin.core.data.settings

import aiimin.core.engine.BatteryMode
import aiimin.core.engine.DayMode
import aiimin.core.engine.IntentionSet
import aiimin.core.engine.XpState
import aiimin.core.nlp.AiModule
import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.core.stringSetPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import java.time.LocalDate
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map

private val Context.store: DataStore<Preferences> by preferencesDataStore("aiimin_settings")

enum class AppTheme { SYSTEM, LIGHT, DARK }

data class QuietHours(val enabled: Boolean, val fromMin: Int, val toMin: Int)

/** Everything a person chooses. Read as one value; written through [SettingsStore.update]. */
data class AppSettings(
    val onboarded: Boolean = false,
    val name: String = "",
    val role: String = "default",
    val priorities: List<String> = emptyList(),
    val theme: AppTheme = AppTheme.SYSTEM,
    val batteryMode: BatteryMode = BatteryMode.GENTLE,
    val batteryModeChangedOn: LocalDate? = null,
    val dayMode: DayMode = DayMode.Midnight,
    val dayModeChangedOn: LocalDate? = null,
    val intentions: IntentionSet = IntentionSet.default(),
    val aiScope: Set<AiModule> = setOf(AiModule.TASKS, AiModule.CALENDAR, AiModule.MONEY, AiModule.NOTES, AiModule.FAMILY),
    /** Smart mode: answers may use the aiimin.in model with only in-scope data. */
    val aiSmart: Boolean = false,
    val xp: XpState = XpState.fresh(),
    val hideScore: Boolean = false,
    val hideXp: Boolean = false,
    val workApps: Set<String> = emptySet(),
    val lateHour: Int = 23,
    val quiet: QuietHours = QuietHours(true, 22 * 60, 7 * 60),
    val reduceMotion: Boolean = false,
    val appLock: Boolean = false,
    val journalSync: Boolean = false,
    val lifeScoreSharedWith: Set<String> = emptySet(),
    val stepCounterState: String? = null,
    val focusActive: String? = null,
    val lastSyncAt: Long? = null,
    val deviceId: String = "",
)

@Singleton
class SettingsStore @Inject constructor(@ApplicationContext private val context: Context) {

    private object K {
        val onboarded = booleanPreferencesKey("onboarded")
        val name = stringPreferencesKey("name")
        val role = stringPreferencesKey("role")
        val priorities = stringPreferencesKey("priorities")
        val theme = stringPreferencesKey("theme")
        val battery = stringPreferencesKey("battery")
        val batteryOn = stringPreferencesKey("battery_on")
        val dayMode = stringPreferencesKey("day_mode")
        val dayModeOn = stringPreferencesKey("day_mode_on")
        val intentions = stringPreferencesKey("intentions")
        val aiScope = stringSetPreferencesKey("ai_scope")
        val aiSmart = booleanPreferencesKey("ai_smart")
        val xp = stringPreferencesKey("xp")
        val hideScore = booleanPreferencesKey("hide_score")
        val hideXp = booleanPreferencesKey("hide_xp")
        val workApps = stringSetPreferencesKey("work_apps")
        val lateHour = intPreferencesKey("late_hour")
        val quiet = stringPreferencesKey("quiet")
        val reduceMotion = booleanPreferencesKey("reduce_motion")
        val appLock = booleanPreferencesKey("app_lock")
        val journalSync = booleanPreferencesKey("journal_sync")
        val scoreShare = stringSetPreferencesKey("score_share")
        val stepCounter = stringPreferencesKey("step_counter")
        val focus = stringPreferencesKey("focus_active")
        val lastSync = stringPreferencesKey("last_sync")
        val device = stringPreferencesKey("device_id")
    }

    val settings: Flow<AppSettings> = context.store.data.map(::read)

    suspend fun current(): AppSettings = settings.first()

    private fun read(p: Preferences): AppSettings = AppSettings(
        onboarded = p[K.onboarded] ?: false,
        name = p[K.name].orEmpty(),
        role = p[K.role] ?: "default",
        priorities = p[K.priorities]?.split('|')?.filter { it.isNotBlank() }.orEmpty(),
        theme = p[K.theme]?.let { runCatching { AppTheme.valueOf(it) }.getOrNull() } ?: AppTheme.SYSTEM,
        batteryMode = p[K.battery]?.let { runCatching { BatteryMode.valueOf(it) }.getOrNull() } ?: BatteryMode.GENTLE,
        batteryModeChangedOn = p[K.batteryOn]?.let(LocalDate::parse),
        dayMode = p[K.dayMode]?.let(Codecs::decodeDayMode) ?: DayMode.Midnight,
        dayModeChangedOn = p[K.dayModeOn]?.let(LocalDate::parse),
        intentions = p[K.intentions]?.let { runCatching { Codecs.decodeIntentions(it) }.getOrNull() } ?: IntentionSet.default(),
        aiScope = p[K.aiScope]?.mapNotNull { runCatching { AiModule.valueOf(it) }.getOrNull() }?.toSet()
            ?: AppSettings().aiScope,
        aiSmart = p[K.aiSmart] ?: false,
        xp = p[K.xp]?.let { runCatching { Codecs.decodeXp(it) }.getOrNull() } ?: XpState.fresh(),
        hideScore = p[K.hideScore] ?: false,
        hideXp = p[K.hideXp] ?: false,
        workApps = p[K.workApps] ?: emptySet(),
        lateHour = p[K.lateHour] ?: 23,
        quiet = p[K.quiet]?.split(',')?.let { QuietHours(it[0] == "1", it[1].toInt(), it[2].toInt()) } ?: QuietHours(true, 22 * 60, 7 * 60),
        reduceMotion = p[K.reduceMotion] ?: false,
        appLock = p[K.appLock] ?: false,
        journalSync = p[K.journalSync] ?: false,
        lifeScoreSharedWith = p[K.scoreShare] ?: emptySet(),
        stepCounterState = p[K.stepCounter],
        focusActive = p[K.focus],
        lastSyncAt = p[K.lastSync]?.toLongOrNull(),
        deviceId = p[K.device].orEmpty(),
    )

    suspend fun update(change: (AppSettings) -> AppSettings) {
        context.store.edit { p ->
            val s = change(read(p))
            p[K.onboarded] = s.onboarded
            p[K.name] = s.name
            p[K.role] = s.role
            p[K.priorities] = s.priorities.joinToString("|")
            p[K.theme] = s.theme.name
            p[K.battery] = s.batteryMode.name
            s.batteryModeChangedOn?.let { p[K.batteryOn] = it.toString() } ?: p.remove(K.batteryOn)
            p[K.dayMode] = Codecs.encodeDayMode(s.dayMode)
            s.dayModeChangedOn?.let { p[K.dayModeOn] = it.toString() } ?: p.remove(K.dayModeOn)
            p[K.intentions] = Codecs.encodeIntentions(s.intentions)
            p[K.aiScope] = s.aiScope.map { it.name }.toSet()
            p[K.aiSmart] = s.aiSmart
            p[K.xp] = Codecs.encodeXp(s.xp)
            p[K.hideScore] = s.hideScore
            p[K.hideXp] = s.hideXp
            p[K.workApps] = s.workApps
            p[K.lateHour] = s.lateHour
            p[K.quiet] = "${if (s.quiet.enabled) 1 else 0},${s.quiet.fromMin},${s.quiet.toMin}"
            p[K.reduceMotion] = s.reduceMotion
            p[K.appLock] = s.appLock
            p[K.journalSync] = s.journalSync
            p[K.scoreShare] = s.lifeScoreSharedWith
            s.stepCounterState?.let { p[K.stepCounter] = it } ?: p.remove(K.stepCounter)
            s.focusActive?.let { p[K.focus] = it } ?: p.remove(K.focus)
            s.lastSyncAt?.let { p[K.lastSync] = it.toString() } ?: p.remove(K.lastSync)
            p[K.device] = s.deviceId
        }
    }

    suspend fun deviceId(): String {
        val s = current()
        if (s.deviceId.isNotEmpty()) return s.deviceId
        val id = "dev_" + java.util.UUID.randomUUID().toString().take(12)
        update { it.copy(deviceId = id) }
        return id
    }
}
