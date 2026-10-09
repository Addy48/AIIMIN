package aiimin.core.sensing

import aiimin.core.sensing.logic.UsageTimeline
import android.app.AppOpsManager
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Process
import android.provider.Settings
import dagger.hilt.android.qualifiers.ApplicationContext
import java.time.Instant
import java.time.ZoneId
import java.time.temporal.ChronoUnit
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class AppLine(val pkg: String, val label: String, val ms: Long, val opens: Int, val notifications: Int)

data class ScreenDay(
    val totalMs: Long,
    val personalMs: Long,
    val workMs: Long,
    val lateMs: Long,
    val unlocks: Int,
    val notifications: Int,
    val firstUnlockAt: Long?,
    val hourlyMs: List<Long>,
    val apps: List<AppLine>,
)

/**
 * Reads UsageStats events and turns them into one day's screen time with
 * [UsageTimeline]. Needs "Usage access" (Settings → Apps → Special access).
 */
@Singleton
class UsageReader @Inject constructor(@ApplicationContext private val context: Context) {

    private val usm get() = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
    private val labels = HashMap<String, String>()

    fun hasAccess(): Boolean {
        val ops = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            ops.unsafeCheckOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, Process.myUid(), context.packageName)
        } else {
            @Suppress("DEPRECATION")
            ops.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, Process.myUid(), context.packageName)
        }
        return mode == AppOpsManager.MODE_ALLOWED
    }

    fun settingsIntent(): Intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

    /**
     * @param lateHour local hour after which screen time counts as "late" (default 23:00).
     */
    suspend fun read(
        windowStart: Instant,
        windowEnd: Instant,
        zone: ZoneId,
        workPackages: Set<String>,
        lateHour: Int = 23,
    ): ScreenDay? = withContext(Dispatchers.IO) {
        if (!hasAccess()) return@withContext null
        val start = windowStart.toEpochMilli()
        val end = minOf(windowEnd.toEpochMilli(), System.currentTimeMillis())
        val lookback = start - LOOKBACK_MS
        val events = ArrayList<UsageTimeline.Event>(4096)
        // Walk in 2 h slices: a single long query can come back truncated on
        // busy OEM builds. Half-open slices, so boundary events are read once.
        var cursor = lookback
        while (cursor < end) {
            val sliceEnd = minOf(cursor + SLICE_MS, end)
            val it = usm.queryEvents(cursor, sliceEnd)
            val ev = UsageEvents.Event()
            while (it.hasNextEvent()) {
                it.getNextEvent(ev)
                val t = ev.timeStamp
                if (t < cursor || t >= sliceEnd) continue
                val kind = kindOf(ev.eventType) ?: continue
                events += UsageTimeline.Event(t, kind, ev.packageName.orEmpty(), ev.className.orEmpty())
            }
            cursor = sliceEnd
        }
        val homes = homePackages()
        val lateFrom = Instant.ofEpochMilli(start).atZone(zone).toLocalDate().atTime(lateHour, 0).atZone(zone).toInstant().toEpochMilli()
        val r = UsageTimeline.compute(
            events = events,
            windowStart = start,
            windowEnd = end,
            counted = { pkg -> counts(pkg, homes) },
            isHome = { it in homes },
            isWork = { it in workPackages },
            lateFrom = lateFrom,
            hourOf = { Instant.ofEpochMilli(it).atZone(zone).hour },
            hourStart = { Instant.ofEpochMilli(it).atZone(zone).truncatedTo(ChronoUnit.HOURS).toInstant().toEpochMilli() },
        )
        ScreenDay(
            totalMs = r.totalMs,
            personalMs = r.personalMs,
            workMs = r.workMs,
            lateMs = r.lateMs,
            unlocks = r.unlocks,
            notifications = r.notifications,
            firstUnlockAt = r.firstUnlockAt,
            hourlyMs = r.hourlyMs.toList(),
            apps = r.apps.take(40).map { AppLine(it.pkg, label(it.pkg), it.ms, it.opens, it.notifications) },
        )
    }

    /** Launchable apps for the "tag as work" picker. */
    suspend fun launchableApps(): List<Pair<String, String>> = withContext(Dispatchers.IO) {
        val pm = context.packageManager
        val intent = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER)
        pm.queryIntentActivities(intent, 0)
            .map { it.activityInfo.packageName }
            .distinct()
            .filter { it != context.packageName }
            .map { it to label(it) }
            .sortedBy { it.second.lowercase() }
    }

    fun label(pkg: String): String = labels.getOrPut(pkg) {
        runCatching {
            val pm = context.packageManager
            pm.getApplicationLabel(pm.getApplicationInfo(pkg, 0)).toString()
        }.getOrDefault(pkg.substringAfterLast('.').replaceFirstChar { it.uppercase() })
    }

    private fun homePackages(): Set<String> {
        val intent = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_HOME)
        return context.packageManager.queryIntentActivities(intent, PackageManager.MATCH_DEFAULT_ONLY)
            .map { it.activityInfo.packageName }.toSet()
    }

    private fun counts(pkg: String, homes: Set<String>): Boolean {
        if (pkg.isEmpty() || pkg == "android" || pkg in homes) return false
        if (pkg.startsWith("com.android.systemui") || pkg.startsWith("com.android.permissioncontroller") ||
            pkg.startsWith("com.google.android.permissioncontroller") || pkg.startsWith("com.android.packageinstaller") ||
            pkg.startsWith("com.google.android.packageinstaller") || pkg.startsWith("com.android.providers.") ||
            pkg.startsWith("com.google.android.gms") || pkg == "com.android.settings.intelligence"
        ) {
            return false
        }
        return true
    }

    private fun kindOf(type: Int): UsageTimeline.Kind? = when (type) {
        UsageEvents.Event.ACTIVITY_RESUMED -> UsageTimeline.Kind.RESUMED
        UsageEvents.Event.ACTIVITY_PAUSED -> UsageTimeline.Kind.PAUSED
        UsageEvents.Event.ACTIVITY_STOPPED -> UsageTimeline.Kind.STOPPED
        UsageEvents.Event.SCREEN_INTERACTIVE -> UsageTimeline.Kind.SCREEN_ON
        UsageEvents.Event.SCREEN_NON_INTERACTIVE -> UsageTimeline.Kind.SCREEN_OFF
        UsageEvents.Event.KEYGUARD_SHOWN -> UsageTimeline.Kind.KEYGUARD_SHOWN
        UsageEvents.Event.KEYGUARD_HIDDEN -> UsageTimeline.Kind.KEYGUARD_HIDDEN
        UsageEvents.Event.DEVICE_SHUTDOWN -> UsageTimeline.Kind.SHUTDOWN
        UsageEvents.Event.DEVICE_STARTUP -> UsageTimeline.Kind.STARTUP
        NOTIFICATION_INTERRUPTION -> UsageTimeline.Kind.NOTIFICATION
        else -> null
    }

    private companion object {
        const val LOOKBACK_MS = 6L * 3_600_000L
        const val SLICE_MS = 2L * 3_600_000L
        /** UsageEvents.Event.NOTIFICATION_INTERRUPTION is hidden API; value 12 since API 28. */
        const val NOTIFICATION_INTERRUPTION = 12
    }
}
