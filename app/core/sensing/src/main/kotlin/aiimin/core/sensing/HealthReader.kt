package aiimin.core.sensing

import aiimin.core.sensing.logic.SleepMath
import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.activity.result.contract.ActivityResultContract
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.PermissionController
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.ExerciseSessionRecord
import androidx.health.connect.client.records.RestingHeartRateRecord
import androidx.health.connect.client.records.SleepSessionRecord
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.request.AggregateGroupByDurationRequest
import androidx.health.connect.client.request.AggregateRequest
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import dagger.hilt.android.qualifiers.ApplicationContext
import java.time.Duration
import java.time.Instant
import java.time.ZoneId
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

enum class HealthAvailability { AVAILABLE, NEEDS_UPDATE, UNAVAILABLE }

/** [origins] are the apps whose records made up the total (Health Connect removes overlaps). */
data class StepsDay(val total: Long, val hourly: List<Long>, val origins: Set<String> = emptySet())

data class SleepNight(val minutes: Int, val start: Instant, val end: Instant)

/**
 * Health Connect reads. Steps use the platform's own aggregate, which
 * de-duplicates phone + watch using the person's data-source priority — the
 * same number Google Fit / Samsung Health show. v3 picked "the highest phone
 * stream" and mixed in the raw sensor, which is why steps never matched.
 */
@Singleton
class HealthReader @Inject constructor(@ApplicationContext private val context: Context) {

    val permissions: Set<String> = setOf(
        HealthPermission.getReadPermission(StepsRecord::class),
        HealthPermission.getReadPermission(SleepSessionRecord::class),
        HealthPermission.getReadPermission(RestingHeartRateRecord::class),
        HealthPermission.getReadPermission(ExerciseSessionRecord::class),
        HealthPermission.PERMISSION_READ_HEALTH_DATA_IN_BACKGROUND,
    )

    fun availability(): HealthAvailability = when (HealthConnectClient.getSdkStatus(context, PROVIDER)) {
        HealthConnectClient.SDK_AVAILABLE -> HealthAvailability.AVAILABLE
        HealthConnectClient.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED -> HealthAvailability.NEEDS_UPDATE
        else -> HealthAvailability.UNAVAILABLE
    }

    fun permissionContract(): ActivityResultContract<Set<String>, Set<String>> =
        PermissionController.createRequestPermissionResultContract()

    fun installIntent(): Intent = Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=$PROVIDER&url=healthconnect%3A%2F%2Fonboarding"))
        .setPackage("com.android.vending").addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

    private fun client(): HealthConnectClient? =
        if (availability() == HealthAvailability.AVAILABLE) HealthConnectClient.getOrCreate(context) else null

    suspend fun granted(): Set<String> = runCatching { client()?.permissionController?.getGrantedPermissions() ?: emptySet() }.getOrDefault(emptySet())

    suspend fun hasSteps(): Boolean = HealthPermission.getReadPermission(StepsRecord::class) in granted()

    /** Total and per-hour steps for [start, end). Null when not readable. */
    suspend fun steps(start: Instant, end: Instant): StepsDay? = withContext(Dispatchers.IO) {
        val c = client() ?: return@withContext null
        if (!hasSteps()) return@withContext null
        runCatching {
            val range = TimeRangeFilter.between(start, end)
            val agg = c.aggregate(AggregateRequest(setOf(StepsRecord.COUNT_TOTAL), range))
            val total = agg[StepsRecord.COUNT_TOTAL] ?: 0L
            // Slot 0 is the hour containing [start] (midnight for a calendar day), never wrapped by clock hour.
            val slots = (Duration.between(start, end).toHours().toInt()).coerceIn(1, 26)
            val hourly = LongArray(slots)
            c.aggregateGroupByDuration(AggregateGroupByDurationRequest(setOf(StepsRecord.COUNT_TOTAL), range, Duration.ofHours(1)))
                .forEach { g ->
                    val slot = Duration.between(start, g.startTime).toHours().toInt().coerceIn(0, slots - 1)
                    hourly[slot] += g.result[StepsRecord.COUNT_TOTAL] ?: 0L
                }
            StepsDay(total, hourly.toList(), agg.dataOrigins.map { it.packageName }.toSet())
        }.getOrNull()
    }

    /** The night you woke from inside [dayStart, dayStart + 18 h). */
    suspend fun sleep(dayStart: Instant): SleepNight? = withContext(Dispatchers.IO) {
        val c = client() ?: return@withContext null
        if (HealthPermission.getReadPermission(SleepSessionRecord::class) !in granted()) return@withContext null
        runCatching {
            val range = TimeRangeFilter.between(dayStart.minus(Duration.ofHours(20)), dayStart.plus(Duration.ofHours(18)))
            val sessions = c.readRecords(ReadRecordsRequest(SleepSessionRecord::class, range)).records
                .map { SleepMath.Session(it.startTime.toEpochMilli(), it.endTime.toEpochMilli()) }
            SleepMath.nightFor(sessions, dayStart.toEpochMilli())?.let {
                SleepNight(it.minutes, Instant.ofEpochMilli(it.start), Instant.ofEpochMilli(it.end))
            }
        }.getOrNull()
    }

    suspend fun restingHeartRate(start: Instant, end: Instant): Int? = withContext(Dispatchers.IO) {
        val c = client() ?: return@withContext null
        if (HealthPermission.getReadPermission(RestingHeartRateRecord::class) !in granted()) return@withContext null
        runCatching {
            c.aggregate(AggregateRequest(setOf(RestingHeartRateRecord.BPM_AVG), TimeRangeFilter.between(start, end)))[RestingHeartRateRecord.BPM_AVG]?.toInt()
        }.getOrNull()
    }

    /** Minutes of logged exercise sessions in the window (watch workouts, manual entries). */
    suspend fun exerciseMinutes(start: Instant, end: Instant): Int? = withContext(Dispatchers.IO) {
        val c = client() ?: return@withContext null
        if (HealthPermission.getReadPermission(ExerciseSessionRecord::class) !in granted()) return@withContext null
        runCatching {
            c.aggregate(AggregateRequest(setOf(ExerciseSessionRecord.EXERCISE_DURATION_TOTAL), TimeRangeFilter.between(start, end)))[ExerciseSessionRecord.EXERCISE_DURATION_TOTAL]
                ?.toMinutes()?.toInt()
        }.getOrNull()
    }

    private companion object {
        const val PROVIDER = "com.google.android.apps.healthdata"
    }
}
