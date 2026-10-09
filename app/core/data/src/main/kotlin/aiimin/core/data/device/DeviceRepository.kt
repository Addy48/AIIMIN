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

        val screen = runCatching { usage.read(start, end, clock.zone, s.workApps, s.lateHour) }.getOrNull()
        val hc = health.steps(start, end)
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
                stepsHourly = AppJson.encodeToString(kotlinx.serialization.serializer<List<Long>>(), hourly ?: emptyList()),
                screenMs = screen?.totalMs ?: existing?.screenMs,
                screenPersonalMs = screen?.personalMs ?: existing?.screenPersonalMs,
                screenWorkMs = screen?.workMs ?: existing?.screenWorkMs,
                lateScreenMs = screen?.lateMs ?: existing?.lateScreenMs,
                unlocks = screen?.unlocks ?: existing?.unlocks,
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

    companion object {
        fun apps(d: DeviceDayEntity?): List<AppUse> =
            d?.apps?.let { runCatching { AppJson.decodeFromString<List<AppUse>>(it) }.getOrNull() }.orEmpty()

        fun longs(s: String?): List<Long> = s?.let { runCatching { AppJson.decodeFromString<List<Long>>(it) }.getOrNull() }.orEmpty()
    }
}

private fun AppLine.toUse() = AppUse(pkg, label, ms, opens, notifications)
