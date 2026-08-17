package aiimin.core.data.device

import android.app.ActivityManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.util.Log
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.PermissionController
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.records.metadata.DataOrigin
import androidx.health.connect.client.request.AggregateRequest
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId

/**
 * Day-total steps at **Nothing pedometer / phone** accuracy.
 *
 * Health Connect on-device counting (what Nothing Pedometer tracks) used to
 * attribute as DataOrigin `android`. From the June 2026 HC update it uses a
 * device Synthetic Package Name (SPN) like
 * `com.android.healthconnect.phone.<hash>`. Filtering only `android` misses
 * today's phone stream and falls through to Fit/watch mixes — wrong number.
 *
 * We resolve phone origins via: platform SPN + `android` + record discovery,
 * then aggregate those. Never treat sensor since-listen as the day total.
 */
internal object HealthConnectSteps {

    /** Manifest + HC dialog: steps + background so 15s poll works while locked. */
    private const val READ_HEALTH_DATA_IN_BACKGROUND =
        "android.permission.health.READ_HEALTH_DATA_IN_BACKGROUND"

    val PERMISSIONS: Set<String> = setOf(
        HealthPermission.getReadPermission(StepsRecord::class),
        READ_HEALTH_DATA_IN_BACKGROUND,
    )

    /** Enough to attempt a foreground aggregate — background is optional. */
    private val FOREGROUND_READ: Set<String> = setOf(
        HealthPermission.getReadPermission(StepsRecord::class),
    )

    data class ReadResult(
        /** Preferred: phone / Nothing-pedometer stream. */
        val phoneSteps: Long?,
        /** Unfiltered HC aggregate (Fit + phone + wearables). */
        val allSteps: Long?,
        /** Package origins that contributed to [phoneSteps]. */
        val phoneOrigins: Set<String> = emptySet(),
        /** Debug map: origin → summed record counts today. */
        val originBreakdown: Map<String, Long> = emptyMap(),
    ) {
        /** Show phone when present; else all sources. */
        val best: Long?
            get() = when {
                phoneSteps != null && phoneSteps > 0L -> phoneSteps
                allSteps != null && allSteps > 0L -> allSteps
                else -> phoneSteps ?: allSteps
            }

        val usedPhoneOrigin: Boolean
            get() = phoneSteps != null && phoneSteps > 0L
    }

    fun permissionContract() =
        PermissionController.createRequestPermissionResultContract()

    fun sdkStatus(context: Context): Int =
        HealthConnectClient.getSdkStatus(context)

    fun isAvailable(context: Context): Boolean =
        sdkStatus(context) == HealthConnectClient.SDK_AVAILABLE

    fun needsProviderUpdate(context: Context): Boolean =
        sdkStatus(context) == HealthConnectClient.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED

    fun providerInstallIntent(): Intent =
        Intent(
            Intent.ACTION_VIEW,
            Uri.parse("market://details?id=com.google.android.apps.healthdata"),
        ).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

    fun settingsIntent(context: Context): Intent? {
        val action = if (Build.VERSION.SDK_INT >= 34) {
            "android.health.connect.action.HEALTH_HOME_SETTINGS"
        } else {
            HealthConnectClient.ACTION_HEALTH_CONNECT_SETTINGS
        }
        return Intent(action).takeIf {
            it.resolveActivity(context.packageManager) != null
        }?.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    }

    fun managePermissionsIntent(context: Context): Intent {
        val pkg = context.packageName
        val candidates = listOf(
            Intent("android.health.connect.action.MANAGE_HEALTH_PERMISSIONS").apply {
                putExtra(Intent.EXTRA_PACKAGE_NAME, pkg)
            },
            Intent(HealthConnectClient.ACTION_HEALTH_CONNECT_SETTINGS),
        )
        for (intent in candidates) {
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            if (intent.resolveActivity(context.packageManager) != null) return intent
        }
        return providerInstallIntent()
    }

    suspend fun hasReadPermission(context: Context): Boolean {
        if (!isAvailable(context)) return false
        val client = HealthConnectClient.getOrCreate(context)
        val granted = client.permissionController.getGrantedPermissions()
        // READ_STEPS alone is enough for a foreground query.
        return granted.containsAll(FOREGROUND_READ)
    }

    suspend fun hasBackgroundReadPermission(context: Context): Boolean {
        if (!isAvailable(context)) return false
        val client = HealthConnectClient.getOrCreate(context)
        return client.permissionController.getGrantedPermissions()
            .contains(READ_HEALTH_DATA_IN_BACKGROUND)
    }

    /** True when this process is interactive (visible activity). */
    fun isProcessForeground(): Boolean {
        val info = ActivityManager.RunningAppProcessInfo()
        ActivityManager.getMyMemoryState(info)
        return info.importance <= ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND
    }

    /**
     * Today’s steps. Prefers on-device (Nothing pedometer) origin; falls back
     * to full HC aggregate.
     *
     * Background aggregates need [READ_HEALTH_DATA_IN_BACKGROUND]. Without it,
     * skip when not foreground (no spam) or catch [SecurityException] → null
     * so [DeviceMetricsRepository] keeps sensor fallback / last good HC.
     */
    suspend fun readToday(context: Context): ReadResult? {
        if (!isAvailable(context)) return null
        if (!hasReadPermission(context)) return null
        val foreground = isProcessForeground()
        val backgroundOk = hasBackgroundReadPermission(context)
        if (!foreground && !backgroundOk) {
            Log.i(
                "HC",
                "HC foreground-only; skip background poll (no READ_HEALTH_DATA_IN_BACKGROUND)",
            )
            return null
        }
        val client = HealthConnectClient.getOrCreate(context)
        val zone = ZoneId.systemDefault()
        val start = LocalDate.now(zone).atStartOfDay(zone).toInstant()
        val end = Instant.now()
        return try {
            val all = aggregateFiltered(client, start, end, dataOriginFilter = null)
            val breakdown = originBreakdown(client, start, end)
            val phonePkgs = resolvePhoneOrigins(
                seenOrigins = breakdown.keys,
                deviceSpn = currentDeviceSpn(context),
            )
            // Per origin: max(aggregate, records). Across origins: take the
            // single highest stream — never sum (duplicates the pedometer).
            var bestOrigin: String? = null
            var bestCount = 0L
            for (pkg in phonePkgs) {
                val filtered = aggregateFiltered(
                    client,
                    start,
                    end,
                    dataOriginFilter = setOf(DataOrigin(pkg)),
                ) ?: 0L
                val fromRecords = breakdown[pkg] ?: 0L
                val count = maxOf(filtered, fromRecords)
                if (count > bestCount) {
                    bestCount = count
                    bestOrigin = pkg
                }
            }
            // Tie-break via pickBest if aggregates equal / empty.
            if (bestOrigin == null || bestCount <= 0L) {
                bestOrigin = pickBestPhoneOrigin(phonePkgs, breakdown)
                bestCount = bestOrigin?.let { breakdown[it] ?: 0L } ?: 0L
            }
            val phone = bestCount.takeIf { it > 0L }
            Log.i(
                "HC",
                "readToday OK phone=$phone all=$all bestOrigin=$bestOrigin " +
                    "fg=$foreground bgPerm=$backgroundOk origins=$phonePkgs",
            )
            android.util.Log.i(
                "AiiminMetrics",
                "healthConnect phone=$phone all=$all bestOrigin=$bestOrigin " +
                    "origins=$phonePkgs breakdown=$breakdown",
            )
            ReadResult(
                phoneSteps = phone,
                allSteps = all,
                phoneOrigins = bestOrigin?.let { setOf(it) } ?: emptySet(),
                originBreakdown = breakdown,
            )
        } catch (e: SecurityException) {
            Log.e("HC", "readToday SecurityException: ${e.message}", e)
            Log.i("HC", "HC foreground-only; sensor fallback")
            null
        } catch (e: Exception) {
            // HC wraps SecurityException in HealthConnectException.
            val security = e.cause is SecurityException ||
                (e.message?.contains("SecurityException") == true) ||
                (e.message?.contains("must be in foreground") == true) ||
                (e.message?.contains("READ_HEALTH_DATA_IN_BACKGROUND") == true)
            if (security) {
                Log.e("HC", "readToday SecurityException: ${e.message}", e)
                Log.i("HC", "HC foreground-only; sensor fallback")
            } else {
                Log.e("HC", "readToday other error: ${e.message}", e)
            }
            null
        }
    }

    /** @deprecated use [readToday] */
    suspend fun readTodayTotal(context: Context): Long? = readToday(context)?.best

    private suspend fun aggregateFiltered(
        client: HealthConnectClient,
        start: Instant,
        end: Instant,
        dataOriginFilter: Set<DataOrigin>?,
    ): Long? {
        return try {
            val response = client.aggregate(
                AggregateRequest(
                    metrics = setOf(StepsRecord.COUNT_TOTAL),
                    timeRangeFilter = TimeRangeFilter.between(start, end),
                    dataOriginFilter = dataOriginFilter.orEmpty(),
                ),
            )
            response[StepsRecord.COUNT_TOTAL]
        } catch (e: Exception) {
            android.util.Log.w(
                "AiiminMetrics",
                "aggregate failed filter=${dataOriginFilter?.map { it.packageName }}: ${e.message}",
            )
            null
        }
    }

    private suspend fun originBreakdown(
        client: HealthConnectClient,
        start: Instant,
        end: Instant,
    ): Map<String, Long> {
        val out = linkedMapOf<String, Long>()
        try {
            var pageToken: String? = null
            do {
                val response = client.readRecords(
                    ReadRecordsRequest(
                        recordType = StepsRecord::class,
                        timeRangeFilter = TimeRangeFilter.between(start, end),
                        pageSize = 1000,
                        pageToken = pageToken,
                    ),
                )
                for (record in response.records) {
                    val pkg = record.metadata.dataOrigin.packageName
                    out[pkg] = (out[pkg] ?: 0L) + record.count
                }
                pageToken = response.pageToken
            } while (pageToken != null)
        } catch (e: Exception) {
            android.util.Log.w("AiiminMetrics", "origin breakdown failed: ${e.message}")
        }
        return out
    }

    /**
     * Phone / on-device origins only. Excludes Fit, watches, Garmin, etc. that
     * diverge from the Nothing Pedometer widget.
     */
    internal fun resolvePhoneOrigins(
        seenOrigins: Set<String>,
        deviceSpn: String? = null,
    ): Set<String> {
        val out = linkedSetOf<String>()
        out += "android"
        deviceSpn?.takeIf { it.isNotBlank() }?.let { out += it }
        for (pkg in seenOrigins) {
            if (isOnDevicePhoneOrigin(pkg)) out += pkg
        }
        // Drop mix sources even if they somehow matched a nothing.* pattern.
        return out.filterNot { isExcludedMixOrigin(it) }.toSet()
    }

    /**
     * Pick one on-device origin. Prefer the **highest** single-stream count
     * (never sum). Rank breaks ties (SPN > Nothing > android).
     *
     * Rank-first was wrong: SPN can lag `android` by tens of steps while
     * Settings shows the higher stream — founder saw 3031 vs 3041.
     */
    internal fun pickBestPhoneOrigin(
        phonePkgs: Set<String>,
        breakdown: Map<String, Long>,
    ): String? {
        if (phonePkgs.isEmpty()) return null
        fun rank(pkg: String): Int = when {
            pkg.startsWith("com.android.healthconnect.phone.") -> 300
            pkg.startsWith("com.nothing.") -> 200
            pkg == "android" -> 100
            else -> 50
        }
        return phonePkgs
            .sortedWith(
                compareByDescending<String> { breakdown[it] ?: 0L }
                    .thenByDescending { rank(it) },
            )
            .firstOrNull()
    }

    /**
     * HC day total can lag the live pedometer / TYPE_STEP_COUNTER by tens of
     * steps. Raise the floor with same-day sensor when the lead is small.
     * Large sensor lead ⇒ baseline drift — keep HC.
     */
    internal fun mergePhoneSteps(hc: Long?, sensor: Long, maxSensorLead: Long = 400L): Long? {
        if (hc == null || hc <= 0L) return sensor.takeIf { it > 0L }
        if (sensor <= 0L) return hc
        if (sensor <= hc) return hc
        val lead = sensor - hc
        return if (lead <= maxSensorLead) sensor else hc
    }

    internal fun isOnDevicePhoneOrigin(packageName: String): Boolean {
        if (packageName == "android") return true
        if (packageName.startsWith("com.android.healthconnect.phone.")) return true
        if (packageName == "com.nothing.health") return true
        if (packageName == "com.nothing.pedometer") return true
        if (packageName.startsWith("com.nothing.") &&
            (packageName.contains("health", ignoreCase = true) ||
                packageName.contains("pedometer", ignoreCase = true) ||
                packageName.contains("fitness", ignoreCase = true))
        ) {
            return true
        }
        return false
    }

    internal fun isExcludedMixOrigin(packageName: String): Boolean {
        val p = packageName.lowercase()
        return p.contains("watch") ||
            p.contains("wear") ||
            p == "com.google.android.apps.fitness" ||
            p.contains("garmin") ||
            p.contains("fitbit") ||
            p.contains("samsung.health") ||
            p.contains("shealth") ||
            p.contains("xiaomi.wear") ||
            p.contains("huami") ||
            p.contains("amazfit")
    }

    /**
     * Platform SPN for on-device HC steps (June 2026+). Reflective — API may
     * be absent on older Health Connect providers.
     */
    internal fun currentDeviceSpn(context: Context): String? {
        if (Build.VERSION.SDK_INT < 34) return null
        return try {
            val mgrClass = Class.forName("android.health.connect.HealthConnectManager")
            val mgr = context.getSystemService(mgrClass) ?: return null
            val method = mgrClass.methods.firstOrNull {
                it.name == "getCurrentDeviceDataSource" && it.parameterTypes.isEmpty()
            } ?: mgrClass.methods.firstOrNull {
                it.name == "getCurrentDeviceDataSource" && it.parameterCount <= 1
            } ?: return null
            val dataSource = try {
                if (method.parameterCount == 0) method.invoke(mgr)
                else null
            } catch (_: Exception) {
                null
            } ?: return null
            val origin = dataSource.javaClass.methods
                .firstOrNull { it.name == "getDeviceDataOrigin" && it.parameterTypes.isEmpty() }
                ?.invoke(dataSource)
                ?: dataSource.javaClass.methods
                    .firstOrNull { it.name == "getDataOrigin" && it.parameterTypes.isEmpty() }
                    ?.invoke(dataSource)
                ?: return null
            val pkg = origin.javaClass.methods
                .firstOrNull { it.name == "getPackageName" && it.parameterTypes.isEmpty() }
                ?.invoke(origin) as? String
            pkg?.takeIf { it.isNotBlank() }?.also {
                android.util.Log.i("AiiminMetrics", "healthConnect SPN=$it")
            }
        } catch (e: Exception) {
            android.util.Log.d("AiiminMetrics", "SPN lookup skipped: ${e.message}")
            null
        }
    }
}
