package aiimin.core.data.device

import aiimin.core.data.core.DayClock
import aiimin.core.data.settings.SettingsStore
import aiimin.core.data.util.AppJson
import aiimin.core.database.DeviceDayDao
import aiimin.core.database.DeviceDayEntity
import aiimin.core.sensing.AppLine
import aiimin.core.sensing.HealthAvailability
import aiimin.core.sensing.HealthReader
import aiimin.core.sensing.StepSensor
import aiimin.core.sensing.UsageReader
import aiimin.core.sensing.logic.StepCounterMath
import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.provider.Settings
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import dagger.hilt.android.qualifiers.ApplicationContext
import java.time.LocalDate
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import aiimin.core.model.ScreenSummary
import aiimin.core.sensing.DeviceProfiler
import aiimin.core.sensing.logic.DeviceProfile
import aiimin.core.sensing.logic.ScreenStrategy
import kotlinx.serialization.Serializable

@Serializable
data class AppUse(val pkg: String, val label: String, val ms: Long, val opens: Int, val notifications: Int)

/** What the phone is allowed to measure right now. */
data class SensorAccess(
    val usage: Boolean,
    val health: HealthAvailability,
    val healthGranted: Set<String>,
    val activityRecognition: Boolean,
    val notificationListener: Boolean,
    val postNotifications: Boolean,
    val stepSensor: Boolean,
) {
    val steps: Boolean get() = healthGranted.any { it.contains("READ_STEPS") } || (activityRecognition && stepSensor)
    val sleep: Boolean get() = healthGranted.any { it.contains("READ_SLEEP") }
}

/**
 * Measures the logical day from the phone and stores it. Re-measured on every
 * refresh (never typed), so the numbers converge on what Digital Wellbeing and
 * Health Connect report.
 */
@Singleton
class DeviceRepository @Inject constructor(
    @ApplicationContext private val context: Context,
    private val dao: DeviceDayDao,
    private val usage: UsageReader,
    private val health: HealthReader,
    private val sensor: StepSensor,
    private val settings: SettingsStore,
    private val clock: DayClock,
    private val profiler: DeviceProfiler,
) {
    private val mutex = Mutex()

    fun observe(day: LocalDate): Flow<DeviceDayEntity?> = dao.observe(day.toString())
    fun since(from: LocalDate) = dao.since(from.toString())

    val healthPermissions: Set<String> get() = health.permissions
    fun healthContract() = health.permissionContract()
    fun healthInstallIntent() = health.installIntent()
    fun usageSettingsIntent() = usage.settingsIntent()
    suspend fun launchableApps() = usage.launchableApps()

    suspend fun access(): SensorAccess = SensorAccess(
        usage = usage.hasAccess(),
        health = health.availability(),
        healthGranted = health.granted(),
        activityRecognition = Build.VERSION.SDK_INT < 29 ||
            ContextCompat.checkSelfPermission(context, Manifest.permission.ACTIVITY_RECOGNITION) == PackageManager.PERMISSION_GRANTED,
        notificationListener = NotificationManagerCompat.getEnabledListenerPackages(context).contains(context.packageName),
        postNotifications = Build.VERSION.SDK_INT < 33 ||
            ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED,
        stepSensor = sensor.available(),
    )

    /** This phone's facts and how AIIMIN measures on it. */
    suspend fun profile() = profiler.current()

    /** True when the phone lets AIIMIN run in the background without battery limits. */
    fun backgroundUnrestricted(): Boolean =
        (context.getSystemService(Context.POWER_SERVICE) as android.os.PowerManager).isIgnoringBatteryOptimizations(context.packageName)

    /** AIIMIN's App info page, where every maker keeps its battery and autostart switches. */
    fun appDetailsIntent() = android.content.Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, android.net.Uri.fromParts("package", context.packageName, null))
        .addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK)

    fun notificationListenerSettings() = android.content.Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
        .addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK)

    /** Today, plus yesterday while it is still open for late data. */
    suspend fun refreshRecent() {
        val today = clock.today()
        refresh(today)
        refresh(today.minusDays(1))
    }

    suspend fun refresh(day: LocalDate) = mutex.withLock {
        val s = settings.current()
        val logical = clock.logical()
        val start = logical.startOf(day).toInstant()
        val end = logical.endOf(day).toInstant()
        val existing = dao.get(day.toString())
        val isToday = day == clock.today()

        // Screen time always uses the calendar day, the same window as Android's Digital Wellbeing.
        // Use after midnight but before the logical day ends still counts as late for this night.
        val calStart = day.atStartOfDay(clock.zone).toInstant()
        val calEnd = day.plusDays(1).atStartOfDay(clock.zone).toInstant()
        // The phone's profile decides whether sessions need a cap (makers that drop pause events);
        // a calibration against Digital Wellbeing (Phone day > Check against your phone) overrides it.
        val profile = runCatching { profiler.current().second }.getOrNull()
        val gapFill = when (s.screenStrategy) {
            ScreenStrategy.EVENTS.name -> false
            ScreenStrategy.EVENTS_WITH_GAP_FILL.name -> true
            else -> profile?.screen == ScreenStrategy.EVENTS_WITH_GAP_FILL
        }
        val screen = runCatching { usage.read(calStart, calEnd, clock.zone, s.workApps, s.lateHour, lateUntil = maxOf(end, calEnd), gapFill = gapFill) }.getOrNull()
        val pick = screen?.let { ScreenSummary.pickups(usage.isSecure(), it.unlocks, it.screenOns) }
        // Steps use the calendar day too, the same day Samsung Health, Google Fit and Mi Fitness show.
        val hc = health.steps(calStart, calEnd)
        val origin = hc?.origins?.let { o -> DeviceProfile.originPriority.firstOrNull { it in o } ?: o.firstOrNull() }?.let { originName(it) }
        var steps = hc?.total
        var source = if (hc != null) "health_connect" else null
        var hourly = hc?.hourly
        if (hc == null && isToday) {
            sensor.read()?.let { r ->
                val prev = s.stepCounterState?.let { runCatching { AppJson.decodeFromString(CounterW.serializer(), it) }.getOrNull() }
                    ?.let { StepCounterMath.State(it.day, it.bootAt, it.baseline, it.last, it.carried) }
                val (st, total) = StepCounterMath.update(prev, day.toString(), r.bootAt, r.counter)
                settings.update { it.copy(stepCounterState = AppJson.encodeToString(CounterW.serializer(), CounterW(st.day, st.bootAt, st.baseline, st.last, st.carried))) }
                // The counter only knows steps since we first saw it today; never let it lower a better number.
                steps = maxOf(total, existing?.steps ?: 0)
                source = "sensor"
            }
        }
        if (hourly == null) hourly = existing?.stepsHourly?.let { runCatching { AppJson.decodeFromString<List<Long>>(it) }.getOrNull() }
        val sleep = health.sleep(start)
        val rhr = health.restingHeartRate(start, end)

        dao.upsert(
            DeviceDayEntity(
                day = day.toString(),
                steps = steps ?: existing?.steps,
                stepsSource = source ?: existing?.stepsSource,
                stepsOrigin = if (source == "health_connect") origin else if (source != null) null else existing?.stepsOrigin,
                screenStrategy = if (screen != null) (if (gapFill) ScreenStrategy.EVENTS_WITH_GAP_FILL else ScreenStrategy.EVENTS).name else existing?.screenStrategy,
                stepsHourly = AppJson.encodeToString(kotlinx.serialization.serializer<List<Long>>(), hourly ?: emptyList()),
                screenMs = screen?.totalMs ?: existing?.screenMs,
                screenPersonalMs = screen?.personalMs ?: existing?.screenPersonalMs,
                screenWorkMs = screen?.workMs ?: existing?.screenWorkMs,
                lateScreenMs = screen?.lateMs ?: existing?.lateScreenMs,
                unlocks = screen?.unlocks ?: existing?.unlocks,
                pickups = pick?.first ?: existing?.pickups,
                pickupsLabel = pick?.second ?: existing?.pickupsLabel,
                notifications = screen?.notifications ?: existing?.notifications,
                firstUnlockAt = screen?.firstUnlockAt ?: existing?.firstUnlockAt,
                apps = screen?.apps?.let { list -> AppJson.encodeToString(kotlinx.serialization.serializer<List<AppUse>>(), list.map(AppLine::toUse)) } ?: existing?.apps ?: "[]",
                screenHourly = screen?.hourlyMs?.let { AppJson.encodeToString(kotlinx.serialization.serializer<List<Long>>(), it) } ?: existing?.screenHourly ?: "[]",
                sleepMin = sleep?.minutes ?: existing?.sleepMin,
                sleepStart = sleep?.start?.toEpochMilli() ?: existing?.sleepStart,
                sleepEnd = sleep?.end?.toEpochMilli() ?: existing?.sleepEnd,
                restingHr = rhr ?: existing?.restingHr,
                updatedAt = System.currentTimeMillis(),
            ),
        )
    }

    @Serializable
    private data class CounterW(val day: String, val bootAt: Long, val baseline: Long, val last: Long, val carried: Long)

    /**
     * "Check against your phone": the person typed what Digital Wellbeing shows for today. Measure
     * today both ways, keep the closer one (plain events unless they're off by more than 10 %),
     * store the ratio, and re-measure. Raw events are never altered; only the method changes.
     */
    suspend fun calibrate(userMs: Long): Calibration? {
        val day = clock.today()
        val s = settings.current()
        val from = day.atStartOfDay(clock.zone).toInstant()
        val to = day.plusDays(1).atStartOfDay(clock.zone).toInstant()
        val plain = usage.read(from, to, clock.zone, s.workApps, s.lateHour, gapFill = false)?.totalMs ?: return null
        val capped = usage.read(from, to, clock.zone, s.workApps, s.lateHour, gapFill = true)?.totalMs ?: plain
        val pick = DeviceProfile.chooseByCalibration(plain, capped, userMs)
        val measured = if (pick == ScreenStrategy.EVENTS_WITH_GAP_FILL) capped else plain
        val ratio = if (measured > 0) userMs.toDouble() / measured else 1.0
        settings.update { it.copy(screenStrategy = pick.name, screenCalibration = ratio) }
        refresh(day)
        return Calibration(measured, userMs, pick == ScreenStrategy.EVENTS_WITH_GAP_FILL)
    }

    private fun originName(pkg: String): String = when (pkg) {
        "com.sec.android.app.shealth" -> "Samsung Health"
        "com.google.android.apps.fitness" -> "Google Fit"
        "com.xiaomi.wearable", "com.mi.health" -> "Mi Fitness"
        "com.google.android.apps.healthdata" -> "Health Connect"
        // Some origins are opaque ids, not packages; only name an app we can actually resolve.
        else -> if (runCatching { context.packageManager.getApplicationInfo(pkg, 0) }.isSuccess) usage.label(pkg) else "Health Connect"
    }

    companion object {
        fun apps(d: DeviceDayEntity?): List<AppUse> =
            d?.apps?.let { runCatching { AppJson.decodeFromString<List<AppUse>>(it) }.getOrNull() }.orEmpty()

        fun longs(s: String?): List<Long> = s?.let { runCatching { AppJson.decodeFromString<List<Long>>(it) }.getOrNull() }.orEmpty()
    }
}

/** Result of a self-check: what AIIMIN now measures against what the phone said. */
data class Calibration(val measuredMs: Long, val phoneMs: Long, val capped: Boolean) {
    val offPercent: Int get() = if (phoneMs <= 0) 0 else (kotlin.math.abs(measuredMs - phoneMs) * 100 / phoneMs).toInt()
}

private fun AppLine.toUse() = AppUse(pkg, label, ms, opens, notifications)
