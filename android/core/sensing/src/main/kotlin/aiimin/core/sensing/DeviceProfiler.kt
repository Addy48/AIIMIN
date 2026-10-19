package aiimin.core.sensing

import aiimin.core.sensing.logic.DeviceFacts
import aiimin.core.sensing.logic.DeviceProfile
import aiimin.core.sensing.logic.Profile
import android.content.Context
import android.os.Build
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton

/** Reads this phone's facts once a minute at most and turns them into a measuring [Profile]. */
@Singleton
class DeviceProfiler @Inject constructor(
    @ApplicationContext private val context: Context,
    private val health: HealthReader,
    private val sensor: StepSensor,
    private val usage: UsageReader,
) {
    @Volatile private var cached: Pair<Long, Pair<DeviceFacts, Profile>>? = null

    suspend fun current(): Pair<DeviceFacts, Profile> {
        val now = System.currentTimeMillis()
        cached?.let { (at, v) -> if (now - at < 60_000L) return v }
        val facts = DeviceFacts(
            maker = Build.MANUFACTURER.orEmpty(),
            sdk = Build.VERSION.SDK_INT,
            healthConnect = health.availability() == HealthAvailability.AVAILABLE && runCatching { health.hasSteps() }.getOrDefault(false),
            stepSensor = sensor.available(),
            healthApps = DeviceProfile.originPriority.filter { installed(it) }.toSet(),
            secureLock = runCatching { usage.isSecure() }.getOrDefault(false),
        )
        return (facts to DeviceProfile.pick(facts)).also { cached = now to it }
    }

    private fun installed(pkg: String) = runCatching { context.packageManager.getPackageInfo(pkg, 0); true }.getOrDefault(false)
}
