package aiimin.feature.onboarding

import aiimin.core.data.ai.Action
import aiimin.core.data.ai.AssistantRepository
import aiimin.core.data.app.SetupRepository
import aiimin.core.data.device.DeviceRepository
import aiimin.core.data.device.SensorAccess
import aiimin.core.data.sync.AuthRepository
import aiimin.core.data.sync.AuthResult
import aiimin.core.data.sync.MergePreview
import aiimin.core.data.sync.SyncRepository
import aiimin.core.engine.BatteryMode
import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import java.time.LocalDate
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import org.json.JSONArray
import org.json.JSONObject

/** A minimum with its tiny version (the one used on a low-battery day). */
data class MinPick(val title: String, val tiny: String = "")

/**
 * Everything the seven screens collect (PRD 1.6). Saved on every change so a killed app or Back resumes in place.
 * The date of birth lives only here, on the phone, until onboarding ends; then the draft is erased and only the
 * age band is kept (4.7). Under 18, the draft is erased at once (Part 23: "I haven't saved anything").
 */
data class Draft(
    val step: Int = 0,
    /** Screen 1's second half (name, country, date of birth) is open. */
    val helloOpen: Boolean = false,
    val name: String = "",
    val dob: String? = null,
    val country: String = "IN",
    val wakeMin: Int = 7 * 60,
    val sleepMin: Int = 23 * 60,
    val mins: List<MinPick> = emptyList(),
    val minsTouched: Boolean = false,
    val firstWin: String? = null,
    /** FULL, QUIET (default) or OFF, chosen on screen 6 and applied live. */
    val raahiMode: String = "QUIET",
    /** Screen 1 passed the age check. Until then the name and date of birth stay in memory only. */
    val ageOk: Boolean = false,
) {
    /** What may be written to the phone: before the age check, nothing typed on screen 1 (Part 23). */
    fun storable(): Draft = if (ageOk) this else copy(name = "", dob = null)

    val dobDate: LocalDate? get() = dob?.let { runCatching { LocalDate.parse(it) }.getOrNull() }

    fun toJson(): String = JSONObject().apply {
        put("v", 2); put("step", step); put("helloOpen", helloOpen); put("name", name); put("dob", dob); put("country", country)
        put("wake", wakeMin); put("sleep", sleepMin); put("minsTouched", minsTouched); put("firstWin", firstWin); put("raahi", raahiMode); put("ageOk", ageOk)
        put("mins", JSONArray(mins.map { JSONObject().put("t", it.title).put("y", it.tiny) }))
    }.toString()

    companion object {
        const val LAST = 6

        fun fromJson(s: String): Draft? = runCatching {
            val o = JSONObject(s)
            fun str(k: String) = if (o.isNull(k)) null else o.optString(k).takeIf { o.has(k) }
            Draft(
                // A draft from the old ten-page flow keeps what it can and resumes on screen 1's details.
                step = if (o.optInt("v") == 2) o.optInt("step").coerceIn(0, LAST) else 0,
                helloOpen = o.optBoolean("helloOpen", o.optInt("v") != 2 && o.optString("name").isNotBlank()),
                name = o.optString("name"), dob = str("dob"), country = o.optString("country", "IN"),
                wakeMin = o.optInt("wake", 7 * 60), sleepMin = o.optInt("sleep", 23 * 60),
                mins = o.optJSONArray("mins")?.let { a -> (0 until a.length()).map { MinPick(a.getJSONObject(it).getString("t"), a.getJSONObject(it).optString("y")) } }.orEmpty().take(3),
                minsTouched = o.optBoolean("minsTouched"), firstWin = str("firstWin"), raahiMode = o.optString("raahi", "QUIET"), ageOk = o.optBoolean("ageOk", o.optInt("v") != 2),
            )
        }.getOrNull()
    }
}

internal val SUGGESTED_MINS = listOf(
    MinPick("Walk 20 minutes", "Walk to the gate"),
    MinPick("Read 10 pages", "Read one page"),
    MinPick("Journal 3 lines", "Write one line"),
    MinPick("No phone in bed", "Phone off the bed"),
    MinPick("Log every spend", "Log one spend"),
    MinPick("Drink 2 litres of water", "One glass"),
    MinPick("One stretch", "Stand and reach up"),
    MinPick("Plan tomorrow", "Pick tomorrow's one thing"),
)

/** The first suggestion, pre-ticked on screen 3 (PRD 1.6: "a pre-filled first suggestion"). */
internal val FIRST_MIN: MinPick = SUGGESTED_MINS.first()

/** Up to three minimums (1.6 screen 3). */
const val MAX_MINS = 3

@HiltViewModel
class OnboardingViewModel @Inject constructor(
    @ApplicationContext private val context: Context,
    private val setup: SetupRepository,
    private val device: DeviceRepository,
    val auth: AuthRepository,
    private val sync: SyncRepository,
    private val assistant: AssistantRepository,
    private val settings: aiimin.core.data.settings.SettingsStore,
) : ViewModel() {
    private val prefs = context.getSharedPreferences("onboarding_draft", Context.MODE_PRIVATE)
    private val _draft = MutableStateFlow(
        prefs.getString("d", null)?.let(Draft::fromJson) ?: Draft(),
    )
    val draft: StateFlow<Draft> = _draft.asStateFlow()
    val session = auth.session
    val access = MutableStateFlow<SensorAccess?>(null)
    val saving = MutableStateFlow(false)
    val merge = MutableStateFlow<MergePreview?>(null)

    fun update(change: (Draft) -> Draft) {
        _draft.update(change)
        prefs.edit().putString("d", _draft.value.storable().toJson()).apply()
    }

    fun go(step: Int) = update { it.copy(step = step.coerceIn(0, Draft.LAST)) }

    /** Under 18: nothing is kept, not even the name (Part 23). */
    fun forget() {
        prefs.edit().clear().commit()
        _draft.value = Draft()
    }

    fun smsGranted(): Boolean = androidx.core.content.ContextCompat.checkSelfPermission(context, android.Manifest.permission.READ_SMS) == android.content.pm.PackageManager.PERMISSION_GRANTED
    fun notificationsGranted(): Boolean = android.os.Build.VERSION.SDK_INT < 33 ||
        androidx.core.content.ContextCompat.checkSelfPermission(context, android.Manifest.permission.POST_NOTIFICATIONS) == android.content.pm.PackageManager.PERMISSION_GRANTED

    fun recheck() { viewModelScope.launch { access.value = device.access() } }

    fun usageIntent() = device.usageSettingsIntent()
    fun healthContract() = device.healthContract()
    fun healthInstallIntent() = device.healthInstallIntent()
    fun listenerIntent() = device.notificationListenerSettings()
    val healthPermissions get() = device.healthPermissions

    /** After a first sign-in: how much is already on aiimin.in, so the person chooses before anything merges. */
    fun loadMerge() { viewModelScope.launch { merge.value = sync.previewMerge() } }
    suspend fun planReplace() = sync.planReplace()

    fun mergeDone(choice: MergeChoice) {
        merge.value = null
        viewModelScope.launch {
            when (choice) {
                // "Keep this phone separate" = signed in, but nothing syncs until the person turns it on.
                MergeChoice.SEPARATE -> { settings.update { it.copy(syncScope = emptySet()) }; sync.sync() }
                MergeChoice.REPLACE -> sync.replaceLocalWithWeb()
                MergeChoice.MERGE -> sync.sync()
            }
        }
    }

    suspend fun signIn(id: String, pin: String): AuthResult = auth.signIn(id, pin).also { if (it is AuthResult.Ok) { sync.refreshState(); loadMerge() } }

    /** The first win: a spoken or typed line becomes real items, and stays undoable from Today. */
    suspend fun preview(text: String): List<Action> = assistant.preview(text)
    suspend fun saveWin(list: List<Action>): String {
        val created = assistant.execute(list, "onboarding")
        return created.firstOrNull()?.label ?: ""
    }

    fun finish(onDone: () -> Unit) {
        val d = _draft.value
        saving.value = true
        viewModelScope.launch {
            val today = LocalDate.now()
            val sleep = java.time.LocalTime.of((d.sleepMin / 60) % 24, d.sleepMin % 60)
            val dayEnd = aiimin.core.engine.today.DayEndLearner.fromSleep(sleep)
            // Screen 2 sets the day end and the arc; screen 6 sets Raahi. Written before setup flips to Today.
            settings.update {
                it.copy(
                    country = d.country, wakeMin = d.wakeMin, sleepMin = d.sleepMin,
                    dayEndMin = dayEnd.hour * 60 + dayEnd.minute, dayEndMode = "SET", dayEndChangedOn = today.toString(),
                    raahiMode = aiimin.core.engine.raahi.RaahiMode.of(d.raahiMode).name,
                    installDay = it.installDay ?: today.toString(),
                    // The capture tried on screen 4 counts for the first-week card.
                    firstCaptureDone = it.firstCaptureDone || d.firstWin != null,
                )
            }
            setup.complete(
                SetupRepository.SetupInput(
                    name = d.name, ageBand = d.dobDate?.let { aiimin.core.engine.profile.AgeBand.of(it, today) }, role = "default",
                    mins = d.mins.map { it.title to it.tiny }, battery = aiimin.core.engine.BatteryMode.GENTLE, banks = emptyList(),
                    primaryBank = null, cash = true, monthlyPlanRupees = null,
                ),
            )
            // The draft (and the date of birth in it) is erased; only the band was kept.
            prefs.edit().clear().apply()
            sync.refreshState()
            onDone()
        }
    }
}
