package aiimin.feature.me

import aiimin.core.data.app.ActivityRepository
import aiimin.core.data.app.ExportRepository
import aiimin.core.data.pulse.Pulse
import aiimin.core.data.pulse.Reason
import aiimin.core.engine.pulse.Job
import aiimin.core.data.app.PreferencesRepository
import aiimin.core.data.app.SearchHit
import aiimin.core.data.app.SearchRepository
import aiimin.core.data.core.DayClock
import aiimin.core.data.core.EventLogger
import aiimin.core.data.device.DeviceRepository
import aiimin.core.data.device.SensorAccess
import aiimin.core.data.life.LifeRepository
import aiimin.core.data.notify.NotificationRepository
import aiimin.core.data.settings.AppSettings
import aiimin.core.data.sync.AuthRepository
import aiimin.core.data.sync.SyncRepository
import aiimin.core.database.DeviceDayEntity
import aiimin.core.engine.BatteryMode
import aiimin.core.engine.DayMode
import aiimin.core.engine.Intention
import aiimin.core.engine.IntentionChange
import aiimin.core.engine.ScoreEngine
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import java.io.File
import java.time.LocalDate
import javax.inject.Inject
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.FlowPreview
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.debounce
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.mapLatest
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

@HiltViewModel
class MeViewModel @Inject constructor(
    life: LifeRepository,
    private val prefs: PreferencesRepository,
    private val clock: DayClock,
    private val log: EventLogger,
    private val export: ExportRepository,
    auth: AuthRepository,
    notes: aiimin.core.data.notes.NoteRepository,
    calendar: aiimin.core.data.plan.CalendarRepository,
    billing: aiimin.core.data.plan.PlayBillingRepository,
) : ViewModel() {
    val plan = kotlinx.coroutines.flow.MutableStateFlow(aiimin.core.data.plan.Plan.FREE).also { f ->
        viewModelScope.launch { runCatching { billing.refreshPurchases() }; billing.entitlement.collect { f.value = it.plan } }
    }
    val life = life.view
    val settings: StateFlow<AppSettings?> = prefs.state.stateIn(viewModelScope, SharingStarted.Eagerly, null)
    val session = auth.session.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)
    val integrity = MutableStateFlow<Boolean?>(null)
    /** (notes, pinned) for the Workspace caption. */
    val noteCounts: StateFlow<Pair<Int, Int>> = notes.all().mapLatest { l -> l.size to l.count { it.pinned } }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), 0 to 0)
    val eventsThisWeek: StateFlow<Int> = calendar.between(
        java.time.Instant.now(), java.time.Instant.now().plusSeconds(7 * 86_400L),
    ).mapLatest { it.size }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), 0)

    fun update(change: (AppSettings) -> AppSettings) = viewModelScope.launch { prefs.update(change) }
    suspend fun setBattery(m: BatteryMode) = prefs.setBatteryMode(m)
    suspend fun setDayMode(m: DayMode) = prefs.setDayMode(m)
    suspend fun applyPreset(key: String) = prefs.applyPreset(key)
    suspend fun change(key: String, next: Intention): IntentionChange = prefs.changeIntention(key, next)
    suspend fun suggestion(key: String) = prefs.suggestedTarget(key)
    suspend fun addCustom(name: String, unit: String, domain: String, target: Double, more: Boolean = true) = prefs.addCustomSignal(name, unit, domain, target, more)
    suspend fun logCustom(key: String, value: Double, yesterday: Boolean) = prefs.logCustom(key, value, yesterday)
    fun verify() = viewModelScope.launch { integrity.value = log.verify() }
    suspend fun exportAll(journal: Boolean): File = export.exportAll(journal)
    suspend fun today() = clock.today()

    /** Your normal for one signal: median, P40, P60 of the last 28 valid days. */
    fun normal(key: String): Triple<Double, Double, Double>? {
        val v = life.value ?: return null
        val vals = ScoreEngine(clock.rules, v.intentions).historyValues(key, v.history).takeLast(28)
        if (vals.size < 7) return null
        return Triple(
            aiimin.core.engine.Stats.median(vals),
            aiimin.core.engine.Stats.percentile(vals, 40.0),
            aiimin.core.engine.Stats.percentile(vals, 60.0),
        )
    }

    fun calibration(key: String): Int {
        val v = life.value ?: return 0
        return ScoreEngine(clock.rules, v.intentions).calibration(key, v.history).daysWithData
    }
}

@HiltViewModel
class SensorsViewModel @Inject constructor(
    private val device: DeviceRepository,
    private val prefs: PreferencesRepository,
    private val pulse: Pulse,
) : ViewModel() {
    val access = MutableStateFlow<SensorAccess?>(null)
    val apps = MutableStateFlow<List<Pair<String, String>>>(emptyList())
    val settings = prefs.state.stateIn(viewModelScope, SharingStarted.Eagerly, null)

    fun refresh() = viewModelScope.launch {
        access.value = device.access()
        pulse.beat(Reason.MANUAL, force = setOf(Job.DEVICE))
    }

    fun loadApps() = viewModelScope.launch { if (apps.value.isEmpty()) apps.value = device.launchableApps() }
    fun toggleWork(pkg: String) = viewModelScope.launch { prefs.update { s -> s.copy(workApps = if (pkg in s.workApps) s.workApps - pkg else s.workApps + pkg) } }

    val healthPermissions get() = device.healthPermissions
    fun healthContract() = device.healthContract()
    fun healthInstall() = device.healthInstallIntent()
    fun usageSettings() = device.usageSettingsIntent()
    fun listenerSettings() = device.notificationListenerSettings()
}

@OptIn(ExperimentalCoroutinesApi::class)
@HiltViewModel
class PhoneDayViewModel @Inject constructor(private val device: DeviceRepository, private val clock: DayClock, life: LifeRepository, private val settings: aiimin.core.data.settings.SettingsStore, private val pulse: Pulse) : ViewModel() {
    val prefs = settings.settings.stateIn(viewModelScope, SharingStarted.Eagerly, null)
    /** S9: tag an app as work (its time stops counting as personal screen time). */
    fun tagWork(pkg: String, work: Boolean) = viewModelScope.launch { settings.update { it.copy(workApps = if (work) it.workApps + pkg else it.workApps - pkg) } }
    val day = MutableStateFlow(LocalDate.now())
    val data: StateFlow<DeviceDayEntity?> = day.flatMapLatest { device.observe(it) }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)
    val week: StateFlow<List<DeviceDayEntity>> = day.flatMapLatest { device.since(it.minusDays(6)) }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    val life = life.view
    val refreshing = MutableStateFlow(false)

    init {
        viewModelScope.launch { day.value = clock.today() }
    }

    /** Today goes through Pulse so every surface updates together; an earlier day is re-read directly. */
    fun refresh() = viewModelScope.launch {
        refreshing.value = true
        if (day.value == clock.today()) pulse.beat(Reason.MANUAL, force = setOf(Job.DEVICE)) else runCatching { device.refresh(day.value) }
        refreshing.value = false
    }

    fun usageSettingsIntent() = device.usageSettingsIntent()

    /** Self-check against Digital Wellbeing; returns a sentence for the toast, or null if it couldn't measure. */
    suspend fun calibrate(text: String): String? {
        val ms = aiimin.core.model.DurationText.parseMs(text) ?: return "Type it like 1h 31m"
        val r = device.calibrate(ms) ?: return null
        return when {
            r.offPercent <= 3 -> "Matches your phone"
            r.capped -> "Adjusted for this phone; now within ${r.offPercent}%"
            else -> "Saved. AIIMIN is within ${r.offPercent}% of your phone"
        }
    }


    fun shift(by: Long) = viewModelScope.launch {
        val t = clock.today()
        day.value = day.value.plusDays(by).let { if (it > t) t else it }
        runCatching { device.refresh(day.value) }
    }
}

@HiltViewModel
class ActivityViewModel @Inject constructor(activity: ActivityRepository) : ViewModel() {
    val lines = activity.recent(200).stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
}

@HiltViewModel
class NotificationsViewModel @Inject constructor(private val repo: NotificationRepository) : ViewModel() {
    val all = repo.all.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    fun markRead() = viewModelScope.launch { repo.markAllRead() }
    fun dismiss(id: String) = viewModelScope.launch { repo.dismiss(id) }
    val stopAsk = repo.stopAsk.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)
    fun answerStop(c: aiimin.core.engine.notify.Category, stop: Boolean) = viewModelScope.launch { repo.answerStop(c, stop) }
}

@OptIn(FlowPreview::class, ExperimentalCoroutinesApi::class)
@HiltViewModel
class SearchViewModel @Inject constructor(search: SearchRepository) : ViewModel() {
    val query = MutableStateFlow("")
    val results: StateFlow<List<SearchHit>> = query.debounce(200).mapLatest { q -> search.search(q) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
}
