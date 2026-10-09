package aiimin.feature.me

import aiimin.core.data.app.ActivityRepository
import aiimin.core.data.app.ExportRepository
import aiimin.core.data.app.Maintenance
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
) : ViewModel() {
    val life = life.view
    val settings: StateFlow<AppSettings?> = prefs.state.stateIn(viewModelScope, SharingStarted.Eagerly, null)
    val session = auth.session.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)
    val integrity = MutableStateFlow<Boolean?>(null)

    fun update(change: (AppSettings) -> AppSettings) = viewModelScope.launch { prefs.update(change) }
    suspend fun setBattery(m: BatteryMode) = prefs.setBatteryMode(m)
    suspend fun setDayMode(m: DayMode) = prefs.setDayMode(m)
    suspend fun applyPreset(key: String) = prefs.applyPreset(key)
    suspend fun change(key: String, next: Intention): IntentionChange = prefs.changeIntention(key, next)
    suspend fun suggestion(key: String) = prefs.suggestedTarget(key)
    suspend fun addCustom(name: String, unit: String, domain: String, target: Double) = prefs.addCustomSignal(name, unit, domain, target)
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
    private val maintenance: Maintenance,
) : ViewModel() {
    val access = MutableStateFlow<SensorAccess?>(null)
    val apps = MutableStateFlow<List<Pair<String, String>>>(emptyList())
    val settings = prefs.state.stateIn(viewModelScope, SharingStarted.Eagerly, null)

    fun refresh() = viewModelScope.launch {
        access.value = device.access()
        maintenance.run()
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
class PhoneDayViewModel @Inject constructor(private val device: DeviceRepository, private val clock: DayClock, life: LifeRepository) : ViewModel() {
    val day = MutableStateFlow(LocalDate.now())
    val data: StateFlow<DeviceDayEntity?> = day.flatMapLatest { device.observe(it) }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)
    val week: StateFlow<List<DeviceDayEntity>> = day.flatMapLatest { device.since(it.minusDays(6)) }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    val life = life.view
    val refreshing = MutableStateFlow(false)

    init {
        viewModelScope.launch {
            day.value = clock.today()
            refresh()
        }
    }

    fun refresh() = viewModelScope.launch {
        refreshing.value = true
        runCatching { device.refresh(day.value) }
        refreshing.value = false
    }

    fun shift(by: Long) = viewModelScope.launch {
        val t = clock.today()
        day.value = day.value.plusDays(by).let { if (it > t) t else it }
        runCatching { device.refresh(day.value) }
    }
}

@HiltViewModel
class AccountViewModel @Inject constructor(
    private val auth: AuthRepository,
    private val sync: SyncRepository,
    private val prefs: PreferencesRepository,
) : ViewModel() {
    val session = auth.session.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)
    val settings = prefs.state.stateIn(viewModelScope, SharingStarted.Eagerly, null)
    val busy = MutableStateFlow(false)
    val message = MutableStateFlow<String?>(null)

    fun signIn(id: String, pin: String) = viewModelScope.launch {
        busy.value = true
        message.value = auth.signIn(id, pin).fold({ "Signed in" }, { it.message ?: "Couldn't sign in" })
        if (session.value?.signedIn == true) runCatching { sync.sync() }
        busy.value = false
    }

    fun syncNow() = viewModelScope.launch {
        busy.value = true
        val r = runCatching { sync.sync() }.getOrNull()
        message.value = r?.let { "Synced · ${it.pushed} sent, ${it.pulled} received" + if (it.failed > 0) ", ${it.failed} to retry" else "" } ?: "Sign in first"
        busy.value = false
    }

    fun signOut() = viewModelScope.launch { auth.signOut(); message.value = "Signed out. Everything stays on this phone." }
    fun journalSync(on: Boolean) = viewModelScope.launch { prefs.update { it.copy(journalSync = on) } }
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
}

@OptIn(FlowPreview::class, ExperimentalCoroutinesApi::class)
@HiltViewModel
class SearchViewModel @Inject constructor(search: SearchRepository) : ViewModel() {
    val query = MutableStateFlow("")
    val results: StateFlow<List<SearchHit>> = query.debounce(200).mapLatest { q -> search.search(q) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
}
