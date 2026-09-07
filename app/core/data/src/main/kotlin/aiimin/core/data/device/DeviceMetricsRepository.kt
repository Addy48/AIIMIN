package aiimin.core.data.device

import android.app.AppOpsManager
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Build
import android.os.Process
import android.provider.Settings
import androidx.core.content.ContextCompat
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.floatPreferencesKey
import androidx.datastore.preferences.core.longPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import dagger.hilt.android.qualifiers.ApplicationContext
import java.time.Instant
import java.time.LocalDate
import java.time.LocalTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.concurrent.TimeUnit
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import aiimin.core.data.di.ApplicationScope
import kotlin.math.max

/**
 * Phone-day truth from **direct Android APIs** — no invented blends.
 *
 * **Steps:** Health Connect day aggregate from the single best on-device origin
 * (Nothing pedometer / phone SPN). Never sum android+SPN (double-count).
 * Sensor ([TYPE_STEP_COUNTER] / detector) raises the floor when HC lags ≤400.
 *
 * **Screen:** [UsageDayParser.parseDay] + [ScreenTime.digitalWellbeingTotalMs] —
 * exclusive ACTIVITY_* union when reliable; busy truncated days
 * `min(unlocked, union + 12m)`. Never interactive/AOD. App rows = INTERVAL_DAILY
 * FG scaled to that total. Never Σ totalTimeVisible as the header.
 */
@Singleton
class DeviceMetricsRepository @Inject constructor(
    @param:ApplicationContext private val context: Context,
    private val dataStore: DataStore<Preferences>,
    @param:ApplicationScope private val scope: CoroutineScope,
) : SensorEventListener {

    private val _state = MutableStateFlow(DeviceMetrics.cold())
    val state: StateFlow<DeviceMetrics> = _state.asStateFlow()

    private val sensorManager =
        context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
    private val stepCounter: Sensor? =
        sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER)
    private val stepDetector: Sensor? =
        sensorManager.getDefaultSensor(Sensor.TYPE_STEP_DETECTOR)

    private val mutex = Mutex()
    private var listening = false
    private var lastCumulative: Float? = null
    private val boutBuffer = mutableListOf<StepTick>()
    /** Last Health Connect day total — authoritative when present. */
    private var healthConnectToday: Long? = null
    /** True when HC total came from phone/android origin (Nothing pedometer stream). */
    private var healthConnectPhoneOrigin: Boolean = false
    /** Sensor / detector since-listen (or day-carry) — never alone as day truth. */
    private var sensorToday: Long = 0L
    private var healthConnectPermissionOk: Boolean = false
    private var healthConnectSdkOk: Boolean = false
    private var hcPollJob: kotlinx.coroutines.Job? = null
    /** Daily steps goal — founder-editable; default 10_000. */
    @Volatile private var stepsGoal: Long = DEFAULT_STEPS_GOAL
    /** Daily screen-on ceiling — founder-editable; default 4h. */
    @Volatile private var screenGoalMs: Long = DEFAULT_SCREEN_GOAL_MS

    fun start() {
        scope.launch {
            val prefs = dataStore.data.first()
            stepsGoal = prefs[KEY_STEPS_TARGET] ?: DEFAULT_STEPS_GOAL
            screenGoalMs = prefs[KEY_SCREEN_TARGET] ?: DEFAULT_SCREEN_GOAL_MS
            _state.update {
                it.copy(stepsTarget = stepsGoal, screenTargetMs = screenGoalMs)
            }
            refreshAll()
        }
        ensureSensors(forceReregister = true)
        // Pedometer + screen: re-read while app open. HC batches; 15s keeps
        // within tens of steps of Settings. Sensor ticks raise HC lag sooner.
        hcPollJob?.cancel()
        hcPollJob = scope.launch {
            while (true) {
                kotlinx.coroutines.delay(15_000L)
                refreshAll()
            }
        }
    }

    /** Nudge daily goal by [delta] (clamped 3k–30k). Returns new goal. */
    fun adjustStepsTarget(delta: Long): Long {
        val next = (stepsGoal + delta).coerceIn(MIN_STEPS_GOAL, MAX_STEPS_GOAL)
        stepsGoal = next
        _state.update { it.copy(stepsTarget = next) }
        scope.launch { dataStore.edit { it[KEY_STEPS_TARGET] = next } }
        return next
    }

    fun setStepsTarget(target: Long): Long {
        val next = target.coerceIn(MIN_STEPS_GOAL, MAX_STEPS_GOAL)
        stepsGoal = next
        _state.update { it.copy(stepsTarget = next) }
        scope.launch { dataStore.edit { it[KEY_STEPS_TARGET] = next } }
        return next
    }

    /** Nudge screen-on daily ceiling (clamped 1h–12h). Returns new goal ms. */
    fun adjustScreenTarget(deltaMs: Long): Long {
        val next = (screenGoalMs + deltaMs).coerceIn(MIN_SCREEN_GOAL_MS, MAX_SCREEN_GOAL_MS)
        screenGoalMs = next
        _state.update { it.copy(screenTargetMs = next) }
        scope.launch { dataStore.edit { it[KEY_SCREEN_TARGET] = next } }
        return next
    }

    fun setScreenTarget(targetMs: Long): Long {
        val next = targetMs.coerceIn(MIN_SCREEN_GOAL_MS, MAX_SCREEN_GOAL_MS)
        screenGoalMs = next
        _state.update { it.copy(screenTargetMs = next) }
        scope.launch { dataStore.edit { it[KEY_SCREEN_TARGET] = next } }
        return next
    }

    fun stop() {
        hcPollJob?.cancel()
        hcPollJob = null
        if (!listening) return
        sensorManager.unregisterListener(this)
        listening = false
    }

    fun refresh() {
        scope.launch { refreshAll() }
        ensureSensors(forceReregister = true)
    }

    fun activityPermissionIntentNeeded(): Boolean =
        Build.VERSION.SDK_INT >= 29 && !hasActivityPermission()

    /** True when HC is on device but READ_STEPS not granted. */
    suspend fun needsHealthConnectPermission(): Boolean {
        if (!HealthConnectSteps.isAvailable(context)) return false
        return !HealthConnectSteps.hasReadPermission(context)
    }

    fun healthConnectAvailable(): Boolean = HealthConnectSteps.isAvailable(context)

    fun healthConnectNeedsUpdate(): Boolean = HealthConnectSteps.needsProviderUpdate(context)

    fun healthConnectPermissions(): Set<String> = HealthConnectSteps.PERMISSIONS

    fun healthConnectPermissionContract() = HealthConnectSteps.permissionContract()

    fun healthConnectInstallIntent(): Intent = HealthConnectSteps.providerInstallIntent()

    fun healthConnectSettingsIntent(): Intent? = HealthConnectSteps.settingsIntent(context)

    fun healthConnectManagePermissionsIntent(): Intent =
        HealthConnectSteps.managePermissionsIntent(context)

    fun usageAccessIntent(): Intent =
        Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

    /** When set, [phoneHistory] serves almost-true sample days (today stays live). */
    @Volatile
    private var sampleHistory: List<PhoneDaySlice>? = null

    fun loadTenDaySample() {
        sampleHistory = TenDaySample.phoneSlices()
    }

    fun clearTenDaySample() {
        sampleHistory = null
    }

    fun hasTenDaySample(): Boolean = sampleHistory != null

    /**
     * Last [days] calendar days of screen/unlock/app reads for export.
     * Today is inclusive and ends at now; prior days are full midnights.
     * If a 10-day sample is loaded, past days come from [TenDaySample] (today still live).
     */
    suspend fun phoneHistory(days: Int): List<PhoneDaySlice> = withContext(Dispatchers.Default) {
        val n = days.coerceIn(1, 30)
        val sample = sampleHistory
        if (sample != null) {
            val liveToday = if (hasUsageAccess()) {
                phoneHistoryLive(1).lastOrNull()
            } else {
                null
            }
            val past = sample.takeLast((n - 1).coerceAtLeast(0))
            return@withContext if (liveToday != null) past + liveToday else sample.takeLast(n)
        }
        if (!hasUsageAccess()) return@withContext emptyList()
        phoneHistoryLive(n)
    }

    private fun phoneHistoryLive(n: Int): List<PhoneDaySlice> {
        val zone = ZoneId.systemDefault()
        val usage = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val today = LocalDate.now(zone)
        return (0 until n).map { offset ->
            val day = today.minusDays(offset.toLong())
            val start = day.atStartOfDay(zone).toInstant().toEpochMilli()
            val end = if (offset == 0) {
                System.currentTimeMillis()
            } else {
                day.plusDays(1).atStartOfDay(zone).toInstant().toEpochMilli()
            }
            val parsed = UsageDayParser.parseDay(
                queryEvents = { s, e -> usage.queryEvents(s, e) },
                rangeStartMs = start,
                rangeEndMs = end,
            )
            val authoritativeTotalMs = UsageDayParser.queryAuthoritativeTotalMs(usage, start, end)
            val screenMs = ScreenTime.digitalWellbeingTotalMs(
                appForegroundByPackage = parsed.appFgMs,
                eventInteractiveMs = parsed.interactiveMs,
                unlockedMs = parsed.unlockedMs,
                exclusiveAppUnionMs = parsed.appUnionMs,
                authoritativeTotalMs = authoritativeTotalMs,
            )
            val historicalFg = ScreenTime.scaleAppForegroundToTotal(
                parsed.appFgMs.filterKeys { isUsefulApp(it) },
                screenMs,
            )
            val apps = historicalFg.entries
                .filter { (_, ms) -> ms >= 30_000L }
                .sortedByDescending { it.value }
                .take(5)
                .map { (pkg, ms) ->
                    AppUse(
                        packageName = pkg,
                        label = appLabel(pkg),
                        ms = ms.coerceAtMost(screenMs),
                        opens = parsed.appOpens[pkg] ?: 0,
                    )
                }
            PhoneDaySlice(
                dateIso = day.toString(),
                screenMs = screenMs,
                unlocks = parsed.unlocks,
                pickups = parsed.pickups,
                appOpens = parsed.appOpens.filterKeys { isUsefulApp(it) }.values.sum(),
                topApps = apps,
                hourlyScreenMs = parsed.hourlyInteractiveMs.toList(),
                peakHour = peakHourIndex(parsed.hourlyInteractiveMs.toList()),
            )
        }.reversed()
    }

    fun hasUsageAccess(): Boolean {
        val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = if (Build.VERSION.SDK_INT >= 29) {
            @Suppress("DEPRECATION")
            appOps.unsafeCheckOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                Process.myUid(),
                context.packageName,
            )
        } else {
            @Suppress("DEPRECATION")
            appOps.checkOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                Process.myUid(),
                context.packageName,
            )
        }
        return mode == AppOpsManager.MODE_ALLOWED
    }

    private fun hasActivityPermission(): Boolean {
        if (Build.VERSION.SDK_INT < 29) return true
        return ContextCompat.checkSelfPermission(
            context,
            android.Manifest.permission.ACTIVITY_RECOGNITION,
        ) == PackageManager.PERMISSION_GRANTED
    }

    private fun ensureSensors(forceReregister: Boolean = false) {
        if (!hasActivityPermission()) {
            _state.update {
                it.copy(
                    stepsStatus = StepsStatus.NEED_PERMISSION,
                    stepsMessage = "Allow physical activity",
                )
            }
            if (listening) {
                sensorManager.unregisterListener(this)
                listening = false
            }
            return
        }
        if (stepCounter == null && stepDetector == null) {
            _state.update {
                it.copy(
                    stepsStatus = StepsStatus.UNAVAILABLE,
                    stepsMessage = "No step sensor",
                )
            }
            return
        }
        if (forceReregister && listening) {
            sensorManager.unregisterListener(this)
            listening = false
        }
        if (listening) return
        var ok = false
        // FASTEST once so OEM delivers the last counter reading immediately.
        stepCounter?.let {
            ok = sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_FASTEST) || ok
        }
        stepDetector?.let {
            ok = sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_NORMAL) || ok
        }
        listening = ok
        if (!ok) {
            _state.update {
                it.copy(
                    stepsStatus = StepsStatus.UNAVAILABLE,
                    stepsMessage = "Step sensor refused",
                )
            }
        }
    }

    override fun onSensorChanged(event: SensorEvent?) {
        val e = event ?: return
        when (e.sensor.type) {
            Sensor.TYPE_STEP_COUNTER -> {
                val cumulative = e.values.firstOrNull() ?: return
                scope.launch { onCounter(cumulative) }
            }
            Sensor.TYPE_STEP_DETECTOR -> {
                scope.launch { onDetectorTick() }
            }
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) = Unit

    private suspend fun onCounter(cumulative: Float) = mutex.withLock {
        val today = LocalDate.now().toString()
        val prefs = dataStore.data.first()
        val storedDay = prefs[KEY_STEP_DAY]
        val existingBaseline = prefs[KEY_STEP_BASELINE]
        val detector = prefs[KEY_DETECTOR_STEPS] ?: 0L
        val lastCum = prefs[KEY_LAST_CUMULATIVE]
        val lastCumDay = prefs[KEY_LAST_CUM_DAY]

        val baseline = when {
            // Same calendar day — keep the morning baseline.
            storedDay == today && existingBaseline != null -> existingBaseline
            // Opened yesterday: carry last cumulative so today's steps aren't zeroed.
            lastCum != null && lastCumDay != null && cumulative >= lastCum -> {
                val gapDays = try {
                    java.time.temporal.ChronoUnit.DAYS.between(
                        LocalDate.parse(lastCumDay),
                        LocalDate.parse(today),
                    )
                } catch (_: Exception) {
                    99L
                }
                if (gapDays == 1L) {
                    boutBuffer.clear()
                    dataStore.edit {
                        it[KEY_STEP_DAY] = today
                        it[KEY_STEP_BASELINE] = lastCum
                        it[KEY_DETECTOR_STEPS] = 0L
                    }
                    lastCum
                } else {
                    boutBuffer.clear()
                    dataStore.edit {
                        it[KEY_STEP_DAY] = today
                        it[KEY_STEP_BASELINE] = cumulative
                        it[KEY_DETECTOR_STEPS] = 0L
                    }
                    cumulative
                }
            }
            // First install / reboot gap — honest: start from this reading.
            else -> {
                boutBuffer.clear()
                dataStore.edit {
                    it[KEY_STEP_DAY] = today
                    it[KEY_STEP_BASELINE] = cumulative
                    it[KEY_DETECTOR_STEPS] = 0L
                }
                cumulative
            }
        }

        lastCumulative = cumulative
        dataStore.edit {
            it[KEY_LAST_CUMULATIVE] = cumulative
            it[KEY_LAST_CUM_DAY] = today
        }
        val fromCounter = (cumulative - baseline).toLong().coerceAtLeast(0L)
        val steps = max(fromCounter, if (storedDay == today) detector else 0L)
        val now = System.currentTimeMillis()
        boutBuffer.add(StepTick(now, steps))
        trimBouts(now)
        sensorToday = steps
        publishMergedSteps()
    }

    private suspend fun onDetectorTick() = mutex.withLock {
        val today = LocalDate.now().toString()
        val prefs = dataStore.data.first()
        if (prefs[KEY_STEP_DAY] != today) {
            dataStore.edit {
                it[KEY_STEP_DAY] = today
                it[KEY_DETECTOR_STEPS] = 1L
                lastCumulative?.let { c -> it[KEY_STEP_BASELINE] = c }
            }
            boutBuffer.clear()
            sensorToday = 1L
            publishMergedSteps()
            return
        }
        val next = (prefs[KEY_DETECTOR_STEPS] ?: 0L) + 1L
        dataStore.edit { it[KEY_DETECTOR_STEPS] = next }
        val baseline = prefs[KEY_STEP_BASELINE]
        val fromCounter = if (baseline != null && lastCumulative != null) {
            (lastCumulative!! - baseline).toLong().coerceAtLeast(0L)
        } else {
            0L
        }
        val steps = max(fromCounter, next)
        val now = System.currentTimeMillis()
        boutBuffer.add(StepTick(now, steps))
        trimBouts(now)
        sensorToday = steps
        publishMergedSteps()
    }

    /**
     * Prefer Health Connect **phone** day total (Nothing Pedometer stream).
     * Sensor raises the floor when HC lags mid-walk (same day TYPE_STEP_COUNTER).
     */
    private fun publishMergedSteps() {
        val hc = healthConnectToday
        val sensor = sensorToday
        when {
            hc != null && hc > 0L -> {
                val shown = HealthConnectSteps.mergePhoneSteps(hc, sensor)
                val raised = shown != null && shown > hc
                _state.update {
                    it.copy(
                        steps = shown,
                        stepsStatus = StepsStatus.LIVE,
                        stepsMessage = when {
                            raised -> null // still phone truth; sensor only closed HC lag
                            healthConnectPhoneOrigin -> null
                            else -> "Health Connect · all sources"
                        },
                        stepsSource = StepsSource.HEALTH_CONNECT,
                        updatedAtMs = System.currentTimeMillis(),
                    )
                }
            }
            healthConnectSdkOk && !healthConnectPermissionOk -> {
                _state.update {
                    it.copy(
                        steps = null,
                        stepsStatus = StepsStatus.NEED_PERMISSION,
                        stepsMessage = "Allow Health Connect steps",
                        stepsSource = StepsSource.NONE,
                        updatedAtMs = System.currentTimeMillis(),
                    )
                }
            }
            healthConnectSdkOk && sensor > 0L -> {
                _state.update {
                    it.copy(
                        steps = sensor,
                        stepsStatus = StepsStatus.LIVE,
                        stepsMessage = "sensor · waiting for phone steps",
                        stepsSource = StepsSource.SENSOR,
                        updatedAtMs = System.currentTimeMillis(),
                    )
                }
            }
            healthConnectSdkOk -> {
                _state.update {
                    it.copy(
                        steps = null,
                        stepsStatus = StepsStatus.COLD,
                        stepsMessage = "Health Connect · no steps yet today",
                        stepsSource = StepsSource.NONE,
                        updatedAtMs = System.currentTimeMillis(),
                    )
                }
            }
            sensor > 0L -> {
                _state.update {
                    it.copy(
                        steps = sensor,
                        stepsStatus = StepsStatus.LIVE,
                        stepsMessage = "sensor only · grant Health Connect for pedometer match",
                        stepsSource = StepsSource.SENSOR,
                        updatedAtMs = System.currentTimeMillis(),
                    )
                }
            }
        }
    }

    private fun trimBouts(now: Long) {
        val keepFrom = now - TimeUnit.HOURS.toMillis(18)
        boutBuffer.removeAll { it.atMs < keepFrom }
    }

    private suspend fun refreshHealthConnectSteps() {
        val status = HealthConnectSteps.sdkStatus(context)
        healthConnectSdkOk = status == androidx.health.connect.client.HealthConnectClient.SDK_AVAILABLE
        android.util.Log.i(
            "AiiminMetrics",
            "healthConnectSdkStatus=$status available=$healthConnectSdkOk",
        )
        when {
            HealthConnectSteps.needsProviderUpdate(context) -> {
                healthConnectToday = null
                healthConnectPhoneOrigin = false
                healthConnectPermissionOk = false
                healthConnectSdkOk = false
                _state.update {
                    it.copy(
                        stepsStatus = StepsStatus.NEED_PERMISSION,
                        stepsMessage = "Update Health Connect",
                        stepsSource = StepsSource.NONE,
                        hcBackgroundRead = false,
                    )
                }
            }
            !healthConnectSdkOk -> {
                healthConnectToday = null
                healthConnectPhoneOrigin = false
                healthConnectPermissionOk = false
                _state.update { it.copy(hcBackgroundRead = false) }
            }
            !HealthConnectSteps.hasReadPermission(context) -> {
                healthConnectToday = null
                healthConnectPhoneOrigin = false
                healthConnectPermissionOk = false
                android.util.Log.i("AiiminMetrics", "healthConnectPermission=DENIED")
                _state.update { it.copy(hcBackgroundRead = false) }
                publishMergedSteps()
            }
            else -> {
                healthConnectPermissionOk = true
                val bg = HealthConnectSteps.hasBackgroundReadPermission(context)
                _state.update { it.copy(hcBackgroundRead = bg) }
                val read = HealthConnectSteps.readToday(context)
                if (read != null) {
                    healthConnectToday = read.best
                    healthConnectPhoneOrigin = read.usedPhoneOrigin
                    android.util.Log.d(
                        "Steps",
                        "HC read OK: phone=${read.phoneSteps} all=${read.allSteps} best=${read.best}",
                    )
                } else {
                    // Keep last good HC if any — do not wipe on background SecurityException.
                    android.util.Log.d(
                        "Steps",
                        "HC read failed or blocked; sensor=$sensorToday fallback " +
                            "lastHc=$healthConnectToday",
                    )
                }
                android.util.Log.i(
                    "AiiminMetrics",
                    "healthConnectPermission=OK best=${healthConnectToday} phone=${read?.phoneSteps} " +
                        "all=${read?.allSteps} sensor=$sensorToday phoneOrigin=$healthConnectPhoneOrigin",
                )
                publishMergedSteps()
            }
        }
    }

    private suspend fun refreshAll() = withContext(Dispatchers.Default) {
        refreshHealthConnectSteps()

        if (!hasActivityPermission()) {
            if (_state.value.stepsStatus != StepsStatus.NEED_PERMISSION ||
                _state.value.stepsSource == StepsSource.HEALTH_CONNECT
            ) {
                // Keep HC permission message primary; only set activity if HC absent.
                if (!HealthConnectSteps.isAvailable(context)) {
                    _state.update {
                        it.copy(stepsStatus = StepsStatus.NEED_PERMISSION, stepsMessage = "Allow physical activity")
                    }
                }
            }
        } else if (stepCounter == null && stepDetector == null &&
            !HealthConnectSteps.isAvailable(context)
        ) {
            _state.update {
                it.copy(stepsStatus = StepsStatus.UNAVAILABLE, stepsMessage = "No step sensor")
            }
        }

        if (!hasUsageAccess()) {
            _state.update {
                it.copy(
                    screenTimeMs = null,
                    screenStatus = ScreenStatus.NEED_PERMISSION,
                    screenMessage = "Grant usage access",
                    unlockCount = null,
                    pickups = null,
                    appOpenCount = null,
                    topApps = emptyList(),
                    walks = emptyList(),
                    lines = listOf("Grant usage access in Config · This phone to open the phone-day read."),
                )
            }
            return@withContext
        }

        val zone = ZoneId.systemDefault()
        val start = LocalDate.now().atStartOfDay(zone).toInstant().toEpochMilli()
        val end = System.currentTimeMillis()
        val usage = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        // Chunked exclusive app-union = DW donut. Never INTERVAL_BEST / visible.
        val parsed = UsageDayParser.parseDay(
            queryEvents = { s, e -> usage.queryEvents(s, e) },
            rangeStartMs = start,
            rangeEndMs = end,
        )
        val eventInteractive = parsed.interactiveMs
        val unlocks = parsed.unlocks
        val pickups = parsed.pickups

        // INTERVAL_DAILY FG — OS per-app totals (DW app rows). Used to fill
        // OEM-truncated ACTIVITY_* holes in the exclusive union.
        val dailyRows = usage.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, start, end)
            .orEmpty()
            .filter { row -> row.lastTimeStamp >= start && row.firstTimeStamp < end }
        val dailyFg = HashMap<String, Long>()
        for (row in dailyRows) {
            val pkg = row.packageName ?: continue
            if (!ScreenTime.countsTowardDigitalWellbeing(pkg)) continue
            if (ScreenTime.isDonutChrome(pkg)) continue
            val ms = row.totalTimeInForeground
            if (ms <= 0L) continue
            dailyFg[pkg] = (dailyFg[pkg] ?: 0L) + ms
        }

        val authoritativeTotalMs = UsageDayParser.queryAuthoritativeTotalMs(usage, start, end)

        val screenMs = ScreenTime.digitalWellbeingTotalMs(
            appForegroundByPackage = parsed.appFgMs,
            eventInteractiveMs = eventInteractive,
            unlockedMs = parsed.unlockedMs,
            exclusiveAppUnionMs = parsed.appUnionMs,
            dailyForegroundByPackage = dailyFg,
            authoritativeTotalMs = authoritativeTotalMs,
        )
        val scaledFg = ScreenTime.scaleAppForegroundToTotal(dailyFg, screenMs)
        android.util.Log.i(
            "AiiminMetrics",
            "dwDiag dailyUseful=${dailyFg.values.sum() / 60_000}m union=${parsed.appUnionMs / 60_000}m " +
                "interactive=${eventInteractive / 60_000}m unlocked=${parsed.unlockedMs / 60_000}m " +
                "homeChrome=${parsed.homeChromeMs / 60_000}m " +
                "shown=${screenMs / 60_000}m label=${UsageDayParser.formatHours(screenMs)}",
        )

        val screenMsg = "Digital Wellbeing"

        val openCounts = parsed.appOpens.filterKeys { isUsefulApp(it) }
        val topApps = scaledFg.entries
            .filter { (pkg, ms) -> ms >= 30_000L && isUsefulApp(pkg) }
            .sortedByDescending { it.value }
            .take(8)
            .map { (pkg, ms) ->
                AppUse(
                    packageName = pkg,
                    label = appLabel(pkg),
                    ms = ms,
                    opens = openCounts[pkg] ?: 0,
                )
            }

        val totalOpens = openCounts.values.sum()

        android.util.Log.i(
            "AiiminMetrics",
            "screen=$screenMs interactive=$eventInteractive unlocked=${parsed.unlockedMs} " +
                "unionDw=${parsed.appUnionMs} appsFg=${scaledFg.size} " +
                "label=${UsageDayParser.formatHours(screenMs)} " +
                "unlocks=$unlocks pickups=$pickups apps=${topApps.size} opens=$totalOpens " +
                "steps=${_state.value.steps} source=${_state.value.stepsSource} status=${_state.value.stepsStatus} msg=${_state.value.stepsMessage}",
        )

        val walks = deriveWalks(boutBuffer.toList(), _state.value.steps ?: 0L)
        val hourlySteps = deriveHourlySteps(boutBuffer.toList())
        val lines = composeLines(
            steps = _state.value.steps,
            screenMs = screenMs,
            unlocks = unlocks,
            apps = topApps,
            walks = walks,
        )

        dataStore.edit { it[KEY_LAST_SCREEN_MS] = screenMs }
        _state.update {
            it.copy(
                screenTimeMs = screenMs,
                screenStatus = ScreenStatus.LIVE,
                screenMessage = screenMsg,
                screenTargetMs = screenGoalMs,
                unlockCount = unlocks,
                pickups = pickups,
                appOpenCount = totalOpens,
                topApps = topApps,
                walks = walks,
                hourlySteps = hourlySteps.toList(),
                hourlyScreenMs = parsed.hourlyInteractiveMs.toList(),
                lines = lines,
                updatedAtMs = System.currentTimeMillis(),
            )
        }
    }

    private fun visibleMs(s: android.app.usage.UsageStats): Long =
        if (Build.VERSION.SDK_INT >= 29) s.totalTimeVisible else 0L

    private fun appLabel(pkg: String): String = try {
        val pm = context.packageManager
        val info = pm.getApplicationInfo(pkg, 0)
        pm.getApplicationLabel(info).toString()
    } catch (_: Exception) {
        pkg.substringAfterLast('.').replaceFirstChar { it.uppercase() }
    }

    private fun isUsefulApp(pkg: String): Boolean {
        if (pkg == "android") return false
        // Only this install — old V2 package must not double the list.
        if (pkg.startsWith("in.aiimin.") && pkg != context.packageName) return false
        // Exclude launcher chrome / permission shells from "apps that ate the day".
        if (pkg.startsWith("com.nothing.launcher")) return false
        if (pkg.startsWith("com.android.launcher")) return false
        if (pkg == "com.android.settings") return false
        if (pkg.startsWith("com.google.android.permissioncontroller")) return false
        if (pkg.startsWith("com.google.android.packageinstaller")) return false
        if (pkg.startsWith("com.android.server.telecom")) return false
        if (pkg.startsWith("com.android.systemui")) return false
        if (pkg.startsWith("com.google.android.gms")) return false
        if (pkg.startsWith("com.google.android.packageinstaller")) return false
        try {
            val info = context.packageManager.getApplicationInfo(pkg, 0)
            val isSystem = (info.flags and ApplicationInfo.FLAG_SYSTEM) != 0
            val isUpdated = (info.flags and ApplicationInfo.FLAG_UPDATED_SYSTEM_APP) != 0
            if (isSystem && !isUpdated) {
                val launch = context.packageManager.getLaunchIntentForPackage(pkg)
                if (launch == null) return false
            }
        } catch (_: PackageManager.NameNotFoundException) {
            // Android 11+ package visibility: usage stats can see the package
            // even when getApplicationInfo cannot. Keep it — do not drop.
            return true
        } catch (_: Exception) {
            return true
        }
        return true
    }

    companion object {
        private val KEY_STEP_DAY = stringPreferencesKey("device_step_day")
        private val KEY_STEP_BASELINE = floatPreferencesKey("device_step_baseline")
        private val KEY_DETECTOR_STEPS = longPreferencesKey("device_detector_steps")
        private val KEY_LAST_CUMULATIVE = floatPreferencesKey("device_last_cumulative")
        private val KEY_LAST_CUM_DAY = stringPreferencesKey("device_last_cum_day")
        private val KEY_LAST_SCREEN_MS = longPreferencesKey("device_last_screen_ms")
        private val KEY_STEPS_TARGET = longPreferencesKey("device_steps_target")
        private val KEY_SCREEN_TARGET = longPreferencesKey("device_screen_target_ms")
        const val DEFAULT_STEPS_GOAL = 10_000L
        const val MIN_STEPS_GOAL = 3_000L
        const val MAX_STEPS_GOAL = 30_000L
        const val STEPS_GOAL_STEP = 500L
        /** 4h screen-on ceiling — Digital Wellbeing style daily limit. */
        const val DEFAULT_SCREEN_GOAL_MS = 4L * 60 * 60 * 1000
        const val MIN_SCREEN_GOAL_MS = 1L * 60 * 60 * 1000
        const val MAX_SCREEN_GOAL_MS = 12L * 60 * 60 * 1000
        const val SCREEN_GOAL_STEP_MS = 15L * 60 * 1000
        /** Mean adult stride — km estimate only, not GPS. */
        const val STRIDE_METERS = 0.762
    }
}

internal data class StepTick(val atMs: Long, val stepsTotal: Long)

enum class StepsStatus { COLD, NEED_PERMISSION, LIVE, UNAVAILABLE }
enum class ScreenStatus { COLD, NEED_PERMISSION, LIVE, UNAVAILABLE }
enum class StepsSource { NONE, SENSOR, HEALTH_CONNECT }

data class AppUse(
    val packageName: String,
    val label: String,
    val ms: Long,
    val opens: Int = 0,
) {
    val hoursLabel: String
        get() = UsageDayParser.formatHours(ms)
}

/** One calendar day of phone metrics for ranged export. */
data class PhoneDaySlice(
    val dateIso: String,
    val screenMs: Long,
    val unlocks: Int,
    val pickups: Int,
    val appOpens: Int,
    val topApps: List<AppUse>,
    val hourlyScreenMs: List<Long>,
    val peakHour: Int?,
)

data class WalkBout(
    val startMs: Long,
    val endMs: Long,
    val steps: Long,
    val label: String,
) {
    val timeLabel: String
        get() {
            val zone = ZoneId.systemDefault()
            val fmt = DateTimeFormatter.ofPattern("HH:mm")
            val a = Instant.ofEpochMilli(startMs).atZone(zone).toLocalTime().format(fmt)
            val b = Instant.ofEpochMilli(endMs).atZone(zone).toLocalTime().format(fmt)
            return "$a–$b"
        }
}

data class DeviceMetrics(
    val steps: Long?,
    val stepsTarget: Long,
    val stepsStatus: StepsStatus,
    val stepsMessage: String?,
    val stepsSource: StepsSource = StepsSource.NONE,
    val screenTimeMs: Long?,
    val screenStatus: ScreenStatus,
    val screenMessage: String?,
    /** Daily screen-on ceiling (ms). Founder-editable. */
    val screenTargetMs: Long = DeviceMetricsRepository.DEFAULT_SCREEN_GOAL_MS,
    val unlockCount: Int?,
    /** Display-on sessions after screen was off (≥1s). */
    val pickups: Int?,
    /** Useful-app ACTIVITY_RESUMED sessions today. */
    val appOpenCount: Int?,
    val topApps: List<AppUse>,
    val walks: List<WalkBout>,
    /** Steps accrued per clock hour (0..23) while the app listened. */
    val hourlySteps: List<Long> = List(24) { 0L },
    /** Hourly screen-on ms per clock hour (0..23). */
    val hourlyScreenMs: List<Long> = List(24) { 0L },
    val lines: List<String>,
    val updatedAtMs: Long,
    /** Health Connect `READ_HEALTH_DATA_IN_BACKGROUND` granted. */
    val hcBackgroundRead: Boolean = false,
) {
    val stepsFraction: Float
        get() = if (steps == null || stepsTarget <= 0) 0f
        else (steps.toFloat() / stepsTarget).coerceIn(0f, 1.4f)

    val screenFraction: Float
        get() = if (screenTimeMs == null || screenTargetMs <= 0L) 0f
        else (screenTimeMs.toFloat() / screenTargetMs).coerceIn(0f, 1.4f)

    val screenHoursLabel: String?
        get() = screenTimeMs?.let { UsageDayParser.formatHours(it) }

    val screenTargetLabel: String
        get() = UsageDayParser.formatHours(screenTargetMs)

    /** Estimated km from stride model — not GPS. */
    val kmWalked: Double?
        get() = steps?.let { it * DeviceMetricsRepository.STRIDE_METERS / 1000.0 }

    companion object {
        fun cold() = DeviceMetrics(
            steps = null,
            stepsTarget = 10_000L,
            stepsStatus = StepsStatus.COLD,
            stepsMessage = null,
            stepsSource = StepsSource.NONE,
            screenTimeMs = null,
            screenStatus = ScreenStatus.COLD,
            screenMessage = null,
            screenTargetMs = DeviceMetricsRepository.DEFAULT_SCREEN_GOAL_MS,
            unlockCount = null,
            pickups = null,
            appOpenCount = null,
            topApps = emptyList(),
            walks = emptyList(),
            hourlySteps = List(24) { 0L },
            hourlyScreenMs = List(24) { 0L },
            lines = emptyList(),
            updatedAtMs = 0L,
            hcBackgroundRead = false,
        )
    }
}

/** Cluster step ticks into bouts. No invented seed bouts from a lone total. */
internal fun deriveWalks(ticks: List<StepTick>, totalSteps: Long): List<WalkBout> {
    if (ticks.size < 2) return emptyList()
    val gapMs = TimeUnit.MINUTES.toMillis(12)
    val bouts = mutableListOf<WalkBout>()
    var boutStart = ticks.first()
    var prev = ticks.first()
    for (i in 1 until ticks.size) {
        val t = ticks[i]
        val gap = t.atMs - prev.atMs
        if (gap > gapMs) {
            val boutSteps = prev.stepsTotal - boutStart.stepsTotal
            if (boutSteps >= 350L) {
                val durMin = TimeUnit.MILLISECONDS.toMinutes(prev.atMs - boutStart.atMs).coerceAtLeast(1)
                val hour = Instant.ofEpochMilli(boutStart.atMs)
                    .atZone(ZoneId.systemDefault()).hour
                bouts += WalkBout(
                    startMs = boutStart.atMs,
                    endMs = prev.atMs,
                    steps = boutSteps,
                    label = labelWalk(hour, boutSteps, durMin),
                )
            }
            boutStart = t
        }
        prev = t
    }
    val lastSteps = prev.stepsTotal - boutStart.stepsTotal
    if (lastSteps >= 350L) {
        val durMin = TimeUnit.MILLISECONDS.toMinutes(prev.atMs - boutStart.atMs).coerceAtLeast(1)
        val hour = Instant.ofEpochMilli(boutStart.atMs)
            .atZone(ZoneId.systemDefault()).hour
        bouts += WalkBout(
            startMs = boutStart.atMs,
            endMs = prev.atMs,
            steps = lastSteps,
            label = labelWalk(hour, lastSteps, durMin),
        )
    }
    return bouts.takeLast(6)
}

/** Distribute consecutive step deltas into clock-hour buckets. */
internal fun deriveHourlySteps(ticks: List<StepTick>): LongArray {
    val buckets = LongArray(24)
    if (ticks.size < 2) return buckets
    val zone = ZoneId.systemDefault()
    for (i in 1 until ticks.size) {
        val prev = ticks[i - 1]
        val cur = ticks[i]
        val delta = (cur.stepsTotal - prev.stepsTotal).coerceAtLeast(0L)
        if (delta == 0L) continue
        val hour = Instant.ofEpochMilli(cur.atMs).atZone(zone).hour.coerceIn(0, 23)
        buckets[hour] += delta
    }
    return buckets
}

/** Peak clock hour (0..23) by value, or null if all zero. */
fun peakHourIndex(values: List<Long>): Int? {
    if (values.isEmpty() || values.all { it <= 0L }) return null
    return values.indices.maxBy { values[it] }
}

/** Quietest non-zero window among hours that have any data, or null. */
fun quietHourIndex(values: List<Long>): Int? {
    val active = values.withIndex().filter { it.value > 0L }
    if (active.isEmpty()) return null
    return active.minBy { it.value }.index
}

fun formatHourLabel(hour: Int): String {
    val h = hour.coerceIn(0, 23)
    return "%02d:00".format(h)
}

internal fun labelWalk(hour: Int, steps: Long, durationMin: Long): String = when {
    steps >= 2_200 && durationMin in 18..100 -> "Gym / training walk"
    hour in 6..9 && steps >= 700 -> "Morning · college / commute"
    hour in 10..11 && steps >= 500 -> "Late morning walk"
    hour in 12..14 -> "Lunch walk"
    hour in 15..16 -> "Afternoon walk"
    hour in 17..18 -> "Before dinner walk"
    hour in 19..20 -> "After dinner walk"
    hour >= 21 -> "Late evening walk"
    else -> "Walk bout"
}

internal fun composeLines(
    steps: Long?,
    screenMs: Long?,
    unlocks: Int,
    apps: List<AppUse>,
    walks: List<WalkBout>,
): List<String> {
    val out = mutableListOf<String>()
    val screenH = screenMs?.let { TimeUnit.MILLISECONDS.toMinutes(it) / 60.0 } ?: 0.0
    val top = apps.firstOrNull()

    when {
        walks.any { it.label.startsWith("Lunch") } && screenH >= 4.0 ->
            out += "Lunch walk landed — afternoon screen still heavy (${"%.1f".format(screenH)}h)."
        walks.any { it.label.startsWith("After dinner") } && screenH >= 3.5 ->
            out += "After-dinner walk kept; evening screen still open."
        walks.any { it.label.startsWith("Morning") } && unlocks >= 40 ->
            out += "Morning commute/college walk held — phone still unlocked often ($unlocks)."
        walks.any { it.label.startsWith("Gym") } ->
            out += "Gym-paced bout found (${walks.first { it.label.startsWith("Gym") }.timeLabel}). Recovery window matters tonight."
        walks.isNotEmpty() && (steps ?: 0L) >= 6_000L ->
            out += "${walks.size} walk bout${if (walks.size == 1) "" else "s"} today · ${"%,d".format(steps)} steps."
        (steps ?: 0L) in 1 until 3_000L && screenH >= 5.0 ->
            out += "Low movement, high screen — a short walk before dinner would rebalance the day."
        (steps ?: 0L) >= 10_000L && screenH <= 3.0 ->
            out += "High steps, contained screen — body leading the day."
    }

    if (unlocks >= 70) {
        out += "Unlocked $unlocks times — attention is fragmented."
    } else if (unlocks in 1..25 && screenH >= 4.0) {
        out += "Few unlocks but long sessions — deep sits in ${top?.label ?: "apps"}, not quick checks."
    }

    if (top != null && top.ms >= TimeUnit.HOURS.toMillis(1)) {
        out += "${top.label} leads at ${top.hoursLabel}" +
            if (top.opens > 0) " · opened ${top.opens}×" else "."
    }

    walks.take(3).forEach { w ->
        out += "${w.label} · ${w.timeLabel} · ${"%,d".format(w.steps)} steps"
    }

    return out.distinct().take(8)
}
