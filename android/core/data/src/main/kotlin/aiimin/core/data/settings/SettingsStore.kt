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
import androidx.datastore.preferences.core.doublePreferencesKey
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
    val theme: AppTheme = AppTheme.LIGHT,
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
    /** Apps that don't count as distraction during focus (a music player, a reference app). */
    val focusAllowedApps: Set<String> = emptySet(),
    /** Set by "Check against your phone": EVENTS or EVENTS_WITH_GAP_FILL; null = the phone's profile decides. */
    val screenStrategy: String? = null,
    /** What Digital Wellbeing said divided by what AIIMIN measured, from the last self-check. */
    val screenCalibration: Double? = null,
    val lateHour: Int = 23,
    val quiet: QuietHours = QuietHours(true, 22 * 60, 7 * 60),
    val reduceMotion: Boolean = false,
    val appLock: Boolean = false,
    val hideInRecents: Boolean = false,
    val journalSync: Boolean = false,
    /** What may leave the phone when signed in (see [SyncKinds]). Journal has its own switch. */
    val syncScope: Set<String> = SyncKinds.DEFAULT,
    /** Background sync only on Wi-Fi or other unmetered networks. */
    val syncWifiOnly: Boolean = false,
    val dob: String? = null,
    val primaryBank: String? = null,
    val banks: List<String> = emptyList(),
    /** Masked account numbers the person marked "Not mine" (never offered again). */
    val dismissedAccounts: Set<String> = emptySet(),
    /** The day (ISO) the full opening last played; later cold starts that day get the short one (Part 26.2). */
    val lastBootDay: String? = null,
    /** The first day this install opened (first-week card, Quick doors learning). */
    val installDay: String? = null,
    /** Day-end hour in minutes after midnight (PRD 1.2): drives "Wrap up" and the Evening section only. */
    val dayEndMin: Int = 22 * 60,
    /** SET (from onboarding), LEARNING (after "Yes" on the card), PINNED (edited by hand). */
    val dayEndMode: String = "SET",
    val dayEndChangedOn: String? = null,
    /** The day the learned day-end card was last answered "Keep"; asked again after 7 days. */
    val dayEndAskedOn: String? = null,
    /** "What now?" kinds skipped (three drop a kind one step) and kinds hidden today (day|KIND,KIND). */
    val whatNowSkips: Map<String, Int> = emptyMap(),
    val whatNowHidden: String? = null,
    /** The day the Monday / 1st "Plan your week/month" line was shown, so it shows once. */
    val landmarkShownOn: String? = null,
    /** Opens per screen (route key) for the Quick doors, and doors pinned by hand. On the phone only. */
    val featureOpens: Map<String, Int> = emptyMap(),
    val pinnedDoors: List<String> = emptyList(),
    /** First-week ladder: a capture has been saved at least once. */
    val firstCaptureDone: Boolean = false,
    val cashWallet: Boolean = true,
    val lifeScoreSharedWith: Set<String> = emptySet(),
    val stepCounterState: String? = null,
    val focusActive: String? = null,
    val lastSyncAt: Long? = null,
    /** When the person closed the "phone is pausing AIIMIN" card; it stays away for a week. */
    val keepAliveDismissedAt: Long? = null,
    /** When Pulse last found a job that had missed two background runs (the phone paused AIIMIN). */
    val stallDetectedAt: Long? = null,
    /** First day bank alerts count from (yyyy-MM-dd), chosen when importing past messages. */
    val moneyTrackFrom: String? = null,
    /** The bank-message filter ([aiimin.core.nlp.SmsFilter.encode]); past imports and live alerts both use it. */
    val smsFilter: String? = null,
    /** A whole-year import in progress or just finished ([aiimin.core.data.money.SmsYearRun.encode]). */
    val smsYearRun: String? = null,
    val deviceId: String = "",
    /** Your UPI ID, for "Ask for ₹…" pay links when settling splits (P2). Never a collect request. */
    val myUpiId: String = "",
    val city: String = "",
    /** Display language for dates and numbers; "en-IN" only for now (SE12). */
    val language: String = "en-IN",
    /** First-run "what's new" seen for this version (SE14). */
    val seenVersion: Int = 0,
    /** Extra ledgers shown on Money (SE7). Personal is always on. */
    val ledgersOn: Set<String> = setOf("HOUSEHOLD", "BUSINESS"),
    /** Payments below this many rupees roll up per payee per week (SE7). */
    val rollupBelow: Int = 200,
    /** In-app text size on top of the system's (SE11), 0.9–1.3. */
    val textScale: Float = 1f,
    val haptics: Boolean = true,
    /** Speech language for capture: en-IN, hi-IN, or "auto" (SE12). */
    val voiceLanguage: String = "en-IN",
)

/** The kinds of data the Sync settings page can switch. */
object SyncKinds {
    const val TASKS = "tasks"
    const val NOTES = "notes"
    const val MONEY = "money"
    const val CALENDAR = "calendar"
    const val GOALS = "goals"
    const val MINIMUMS = "minimums"
    val ADDED_V2 = setOf(CALENDAR, GOALS, MINIMUMS)
    val DEFAULT = setOf(TASKS, NOTES, MONEY) + ADDED_V2
}

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
        val focusAllowedApps = stringSetPreferencesKey("focus_allowed_apps")
        val screenStrategy = stringPreferencesKey("screen_strategy")
        val keepAliveDismissed = stringPreferencesKey("keep_alive_dismissed")
        val stallDetected = stringPreferencesKey("stall_detected")
        val moneyTrackFrom = stringPreferencesKey("money_track_from")
        val smsFilter = stringPreferencesKey("sms_filter")
        val smsYearRun = stringPreferencesKey("sms_year_run")
        val screenCalibration = doublePreferencesKey("screen_calibration")
        val lateHour = intPreferencesKey("late_hour")
        val quiet = stringPreferencesKey("quiet")
        val reduceMotion = booleanPreferencesKey("reduce_motion")
        val appLock = booleanPreferencesKey("app_lock")
        val hideRecents = booleanPreferencesKey("hide_recents")
        val journalSync = booleanPreferencesKey("journal_sync")
        val syncScope = stringSetPreferencesKey("sync_scope")
        val syncScopeV2 = booleanPreferencesKey("sync_scope_v2")
        val syncWifiOnly = booleanPreferencesKey("sync_wifi_only")
        val dob = stringPreferencesKey("dob")
        val primaryBank = stringPreferencesKey("primary_bank")
        val banks = stringPreferencesKey("banks")
        val dismissedAccounts = stringSetPreferencesKey("dismissed_accounts")
        val lastBootDay = stringPreferencesKey("last_boot_day")
        val installDay = stringPreferencesKey("install_day")
        val dayEndMin = intPreferencesKey("day_end_min")
        val dayEndMode = stringPreferencesKey("day_end_mode")
        val dayEndChangedOn = stringPreferencesKey("day_end_changed_on")
        val dayEndAskedOn = stringPreferencesKey("day_end_asked_on")
        val whatNowSkips = stringPreferencesKey("what_now_skips")
        val whatNowHidden = stringPreferencesKey("what_now_hidden")
        val landmarkShownOn = stringPreferencesKey("landmark_shown_on")
        val featureOpens = stringPreferencesKey("feature_opens")
        val pinnedDoors = stringPreferencesKey("pinned_doors")
        val firstCaptureDone = booleanPreferencesKey("first_capture_done")
        val cashWallet = booleanPreferencesKey("cash_wallet")
        val scoreShare = stringSetPreferencesKey("score_share")
        val stepCounter = stringPreferencesKey("step_counter")
        val focus = stringPreferencesKey("focus_active")
        val lastSync = stringPreferencesKey("last_sync")
        val device = stringPreferencesKey("device_id")
        val myUpi = stringPreferencesKey("my_upi")
        val city = stringPreferencesKey("city")
        val language = stringPreferencesKey("language")
        val seenVersion = intPreferencesKey("seen_version")
        val ledgersOn = stringSetPreferencesKey("ledgers_on")
        val rollupBelow = intPreferencesKey("rollup_below")
        val textScale = stringPreferencesKey("text_scale")
        val haptics = booleanPreferencesKey("haptics")
        val voiceLang = stringPreferencesKey("voice_lang")
    }

    val settings: Flow<AppSettings> = context.store.data.map(::read)

    suspend fun current(): AppSettings = settings.first()

    private fun read(p: Preferences): AppSettings = AppSettings(
        onboarded = p[K.onboarded] ?: false,
        name = p[K.name].orEmpty(),
        role = p[K.role] ?: "default",
        priorities = p[K.priorities]?.split('|')?.filter { it.isNotBlank() }.orEmpty(),
        theme = p[K.theme]?.let { runCatching { AppTheme.valueOf(it) }.getOrNull() } ?: AppTheme.LIGHT,
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
        focusAllowedApps = p[K.focusAllowedApps] ?: emptySet(),
        screenStrategy = p[K.screenStrategy],
        screenCalibration = p[K.screenCalibration],
        lateHour = p[K.lateHour] ?: 23,
        quiet = p[K.quiet]?.split(',')?.let { QuietHours(it[0] == "1", it[1].toInt(), it[2].toInt()) } ?: QuietHours(true, 22 * 60, 7 * 60),
        reduceMotion = p[K.reduceMotion] ?: false,
        appLock = p[K.appLock] ?: false,
        hideInRecents = p[K.hideRecents] ?: false,
        journalSync = p[K.journalSync] ?: false,
        // Scopes saved before v2 only knew tasks/notes/money; the kinds added later start on.
        syncScope = p[K.syncScope]?.let { if (p[K.syncScopeV2] == true) it else it + SyncKinds.ADDED_V2 } ?: SyncKinds.DEFAULT,
        syncWifiOnly = p[K.syncWifiOnly] ?: false,
        dob = p[K.dob],
        primaryBank = p[K.primaryBank],
        banks = p[K.banks]?.split("|")?.filter { it.isNotBlank() }.orEmpty(),
        dismissedAccounts = p[K.dismissedAccounts] ?: emptySet(),
        lastBootDay = p[K.lastBootDay],
        installDay = p[K.installDay],
        dayEndMin = p[K.dayEndMin] ?: 22 * 60,
        dayEndMode = p[K.dayEndMode] ?: "SET",
        dayEndChangedOn = p[K.dayEndChangedOn],
        dayEndAskedOn = p[K.dayEndAskedOn],
        whatNowSkips = decodeCounts(p[K.whatNowSkips]),
        whatNowHidden = p[K.whatNowHidden],
        landmarkShownOn = p[K.landmarkShownOn],
        featureOpens = decodeCounts(p[K.featureOpens]),
        pinnedDoors = p[K.pinnedDoors]?.split("|")?.filter { it.isNotBlank() }.orEmpty(),
        firstCaptureDone = p[K.firstCaptureDone] ?: false,
        cashWallet = p[K.cashWallet] ?: true,
        lifeScoreSharedWith = p[K.scoreShare] ?: emptySet(),
        stepCounterState = p[K.stepCounter],
        focusActive = p[K.focus],
        lastSyncAt = p[K.lastSync]?.toLongOrNull(),
        keepAliveDismissedAt = p[K.keepAliveDismissed]?.toLongOrNull(),
        stallDetectedAt = p[K.stallDetected]?.toLongOrNull(),
        moneyTrackFrom = p[K.moneyTrackFrom],
        smsFilter = p[K.smsFilter],
        smsYearRun = p[K.smsYearRun],
        deviceId = p[K.device].orEmpty(),
        myUpiId = p[K.myUpi].orEmpty(),
        city = p[K.city].orEmpty(),
        language = p[K.language] ?: "en-IN",
        seenVersion = p[K.seenVersion] ?: 0,
        ledgersOn = p[K.ledgersOn] ?: setOf("HOUSEHOLD", "BUSINESS"),
        rollupBelow = p[K.rollupBelow] ?: 200,
        textScale = p[K.textScale]?.toFloatOrNull()?.coerceIn(0.9f, 1.3f) ?: 1f,
        haptics = p[K.haptics] ?: true,
        voiceLanguage = p[K.voiceLang] ?: "en-IN",
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
            p[K.focusAllowedApps] = s.focusAllowedApps
            s.screenStrategy?.let { p[K.screenStrategy] = it } ?: p.remove(K.screenStrategy)
            s.screenCalibration?.let { p[K.screenCalibration] = it } ?: p.remove(K.screenCalibration)
            p[K.lateHour] = s.lateHour
            p[K.quiet] = "${if (s.quiet.enabled) 1 else 0},${s.quiet.fromMin},${s.quiet.toMin}"
            p[K.reduceMotion] = s.reduceMotion
            p[K.appLock] = s.appLock
            p[K.hideRecents] = s.hideInRecents
            p[K.journalSync] = s.journalSync
            p[K.syncScope] = s.syncScope
            p[K.syncScopeV2] = true
            p[K.syncWifiOnly] = s.syncWifiOnly
            s.dob?.let { p[K.dob] = it } ?: p.remove(K.dob)
            s.primaryBank?.let { p[K.primaryBank] = it } ?: p.remove(K.primaryBank)
            p[K.banks] = s.banks.joinToString("|")
            p[K.dismissedAccounts] = s.dismissedAccounts
            s.lastBootDay?.let { p[K.lastBootDay] = it } ?: p.remove(K.lastBootDay)
            s.installDay?.let { p[K.installDay] = it } ?: p.remove(K.installDay)
            p[K.dayEndMin] = s.dayEndMin
            p[K.dayEndMode] = s.dayEndMode
            s.dayEndChangedOn?.let { p[K.dayEndChangedOn] = it } ?: p.remove(K.dayEndChangedOn)
            s.dayEndAskedOn?.let { p[K.dayEndAskedOn] = it } ?: p.remove(K.dayEndAskedOn)
            p[K.whatNowSkips] = encodeCounts(s.whatNowSkips)
            s.whatNowHidden?.let { p[K.whatNowHidden] = it } ?: p.remove(K.whatNowHidden)
            s.landmarkShownOn?.let { p[K.landmarkShownOn] = it } ?: p.remove(K.landmarkShownOn)
            p[K.featureOpens] = encodeCounts(s.featureOpens)
            p[K.pinnedDoors] = s.pinnedDoors.joinToString("|")
            p[K.firstCaptureDone] = s.firstCaptureDone
            p[K.cashWallet] = s.cashWallet
            p[K.scoreShare] = s.lifeScoreSharedWith
            s.stepCounterState?.let { p[K.stepCounter] = it } ?: p.remove(K.stepCounter)
            s.focusActive?.let { p[K.focus] = it } ?: p.remove(K.focus)
            s.lastSyncAt?.let { p[K.lastSync] = it.toString() } ?: p.remove(K.lastSync)
            s.keepAliveDismissedAt?.let { p[K.keepAliveDismissed] = it.toString() } ?: p.remove(K.keepAliveDismissed)
            s.stallDetectedAt?.let { p[K.stallDetected] = it.toString() } ?: p.remove(K.stallDetected)
            s.moneyTrackFrom?.let { p[K.moneyTrackFrom] = it } ?: p.remove(K.moneyTrackFrom)
            s.smsFilter?.let { p[K.smsFilter] = it } ?: p.remove(K.smsFilter)
            s.smsYearRun?.let { p[K.smsYearRun] = it } ?: p.remove(K.smsYearRun)
            p[K.device] = s.deviceId
            p[K.myUpi] = s.myUpiId
            p[K.city] = s.city
            p[K.language] = s.language
            p[K.seenVersion] = s.seenVersion
            p[K.ledgersOn] = s.ledgersOn
            p[K.rollupBelow] = s.rollupBelow
            p[K.textScale] = s.textScale.toString()
            p[K.haptics] = s.haptics
            p[K.voiceLang] = s.voiceLanguage
        }
    }

    /** Wipes every setting; the device id stays so this install remains one device on the server. */
    suspend fun clearAll() {
        val id = current().deviceId
        context.store.edit { it.clear(); if (id.isNotEmpty()) it[K.device] = id }
    }

    suspend fun deviceId(): String {
        val s = current()
        if (s.deviceId.isNotEmpty()) return s.deviceId
        val id = "dev_" + java.util.UUID.randomUUID().toString().take(12)
        update { it.copy(deviceId = id) }
        return id
    }
}

/** "a:3|b:1" <-> map; tolerant of junk so a bad value never breaks settings. */
internal fun decodeCounts(raw: String?): Map<String, Int> =
    raw?.split("|")?.mapNotNull { e -> e.substringBefore(':').takeIf { it.isNotBlank() }?.let { k -> e.substringAfter(':', "").toIntOrNull()?.let { k to it } } }?.toMap().orEmpty()

internal fun encodeCounts(m: Map<String, Int>): String = m.entries.joinToString("|") { "${it.key}:${it.value}" }
