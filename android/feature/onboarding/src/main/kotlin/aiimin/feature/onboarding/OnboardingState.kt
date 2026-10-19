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

/** Everything the ten pages collect. Saved on every change so a killed app resumes where it was. */
data class Draft(
    val step: Int = 0,
    val name: String = "",
    val dob: String? = null,
    val role: String? = null,
    val mins: List<MinPick> = emptyList(),
    val minsTouched: Boolean = false,
    val battery: String = "GENTLE",
    val banks: List<String> = emptyList(),
    val cash: Boolean = true,
    val plan: String = "",
    val firstWin: String? = null,
    /** Shift workers: the repeating roster, D (day) · N (night) · O (off), starting today. */
    val roster: String = "",
) {
    val battery_: BatteryMode get() = runCatching { BatteryMode.valueOf(battery) }.getOrDefault(BatteryMode.GENTLE)
    val dobDate: LocalDate? get() = dob?.let { runCatching { LocalDate.parse(it) }.getOrNull() }

    fun toJson(): String = JSONObject().apply {
        put("step", step); put("name", name); put("dob", dob); put("role", role); put("minsTouched", minsTouched)
        put("battery", battery); put("cash", cash); put("plan", plan); put("firstWin", firstWin); put("roster", roster)
        put("mins", JSONArray(mins.map { JSONObject().put("t", it.title).put("y", it.tiny) }))
        put("banks", JSONArray(banks))
    }.toString()

    companion object {
        fun fromJson(s: String): Draft? = runCatching {
            val o = JSONObject(s)
            fun str(k: String) = if (o.isNull(k)) null else o.getString(k)
            Draft(
                step = o.optInt("step"), name = o.optString("name"), dob = str("dob"), role = str("role"),
                mins = o.optJSONArray("mins")?.let { a -> (0 until a.length()).map { MinPick(a.getJSONObject(it).getString("t"), a.getJSONObject(it).optString("y")) } }.orEmpty(),
                minsTouched = o.optBoolean("minsTouched"), battery = o.optString("battery", "GENTLE"),
                banks = o.optJSONArray("banks")?.let { a -> (0 until a.length()).map { a.getString(it) } }.orEmpty(),
                cash = o.optBoolean("cash", true), plan = o.optString("plan"), firstWin = str("firstWin"), roster = o.optString("roster"),
            )
        }.getOrNull()
    }
}

internal val UI_ROLES = listOf(
    Triple("student", "Student", "Study focus, assignments, pocket money"),
    Triple("default", "Working professional", "Meetings, focus time, salary and UPI spends"),
    Triple("freelancer", "Freelancer or creator", "Billable focus, irregular income, runway"),
    Triple("business", "Business owner", "Business books kept apart from personal money"),
    Triple("shift", "Shift worker", "Your day runs on your roster, not midnight"),
    Triple("homemaker", "Running the home", "Household money, family papers, everyone's tasks"),
    Triple("creator", "Social media or screen-heavy work", "Work screen time isn't counted against you"),
    Triple("manual", "Hands-on or field work", "Steps don't count; rest and sleep do"),
    Triple("blank", "Something else", "Start from a blank slate"),
)

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

/** Role → the minimums pre-ticked on O4. */
internal fun defaultMinsFor(role: String?): List<MinPick> = when (role) {
    "student" -> listOf("Read 10 pages", "Plan tomorrow", "Drink 2 litres of water")
    "freelancer", "business" -> listOf("Plan tomorrow", "Log every spend", "Walk 20 minutes")
    "manual" -> listOf("One stretch", "Drink 2 litres of water", "Journal 3 lines")
    "shift" -> listOf("Walk 20 minutes", "No phone in bed", "Plan tomorrow")
    "homemaker" -> listOf("Log every spend", "Plan tomorrow", "Walk 20 minutes")
    else -> listOf("Walk 20 minutes", "Read 10 pages", "Plan tomorrow")
}.mapNotNull { t -> SUGGESTED_MINS.firstOrNull { it.title == t } }

internal val BANKS = listOf(
    "HDFC", "SBI", "ICICI", "Axis", "Kotak", "PNB", "Bank of Baroda", "IDFC First",
    "Yes", "IndusInd", "Federal", "AU", "Paytm Payments", "Airtel Payments",
)

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
        prefs.edit().putString("d", _draft.value.toJson()).apply()
    }

    fun go(step: Int) = update { it.copy(step = step.coerceIn(0, 9)) }

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
            setup.complete(
                SetupRepository.SetupInput(
                    name = d.name, dob = d.dobDate, role = (d.role ?: "default").let { if (it == "blank") "default" else it },
                    mins = d.mins.map { it.title to it.tiny }, battery = d.battery_, banks = d.banks,
                    primaryBank = d.banks.firstOrNull(), cash = d.cash, monthlyPlanRupees = d.plan.filter(Char::isDigit).toLongOrNull(),
                ),
            )
            // The roster picked on the role page becomes the day mode from today (§4.70 SE3).
            if (d.role == "shift" && d.roster.isNotBlank()) {
                val today = java.time.LocalDate.now()
                settings.update { it.copy(dayMode = aiimin.core.engine.DayMode.Roster(d.roster.toList(), today), dayModeChangedOn = today) }
            }
            prefs.edit().clear().apply()
            sync.refreshState()
            onDone()
        }
    }
}
