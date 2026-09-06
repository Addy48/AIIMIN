package aiimin.core.data.device

import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager

/**
 * Pure parsing of UsageEvents for unlocks, pickups, hourly heat, and app sessions.
 *
 * **Displayed screen total** comes from [ScreenTime] using unlocked screen-on
 * (busy days) or exclusive app-union (quiet days).
 *
 * Unlocks = KEYGUARD_HIDDEN after KEYGUARD_SHOWN, debounced 800ms.
 * Pickups = interactive sessions lasting ≥15s.
 *
 * Busy-day UsageEvents buffers truncate a single full-range query — [parseDay]
 * walks the day in chunks with carried state (apps + screen clocks).
 *
 * Do **not** look back before [rangeStart]: seeding overnight sessions
 * over-counted vs Digital Wellbeing by ~15–25m on AIN065 (2026-08-08).
 */
object UsageDayParser {

    private const val UNLOCK_DEBOUNCE_MS = 800L
    /** Ignore sub-second interactive blinks — DW does not count them as screen time. */
    private const val SCREEN_MIN_MS = 1_000L
    private const val PICKUP_MIN_MS = 15_000L
    /** Busy days drop early events if queried as one block — walk the day in slices. */
    private const val CHUNK_MS = 30L * 60 * 1000
    /**
     * If KEYGUARD_SHOWN arrives this soon after SCREEN_INTERACTIVE while we had
     * started an unlocked clock on that same interactive pulse, discard that
     * pulse (lockscreen wake after AOD — OEM emits keyguard a beat late).
     * Real mid-session locks are far outside this window.
     */
    private const val LOCKSCREEN_ABORT_MS = 5_000L

    /**
     * Authoritative daily total from UsageStatsManager.
     *
     * This aligns with the system's Digital Wellbeing figure by aggregating
     * totalTimeInForeground across all apps that count toward wellbeing.
     */
    fun queryAuthoritativeTotalMs(
        manager: UsageStatsManager,
        rangeStartMs: Long,
        rangeEndMs: Long,
    ): Long {
        val stats = manager.queryAndAggregateUsageStats(rangeStartMs, rangeEndMs)
        return stats.values
            .filter { ScreenTime.countsTowardDigitalWellbeing(it.packageName) }
            .filterNot { ScreenTime.isDonutChrome(it.packageName) }
            .sumOf { it.totalTimeInForeground.coerceAtLeast(0L) }
    }

    data class Result(
        val screenOnMs: Long,
        val unlocks: Int,
        val pickups: Int,
        val appFgMs: Map<String, Long>,
        val appOpens: Map<String, Int>,
        val interactiveMs: Long = 0L,
        val unlockedMs: Long = 0L,
        /**
         * Time spent unlocked with only launcher / SystemUI in FG.
         * DW app-total typically excludes this; unlocked wall-clock includes it.
         */
        val homeChromeMs: Long = 0L,
        val appUnionMs: Long = 0L,
        val hourlyInteractiveMs: LongArray = LongArray(24),
    )

    private data class Span(val start: Long, val end: Long)

    /**
     * Full calendar-day parse — one chunked walk for unlocks / interactive /
     * unlocked / app union so busy-day OEM buffers cannot drop morning events
     * from a single full-range query.
     */
    fun parseDay(
        queryEvents: (Long, Long) -> UsageEvents,
        rangeStartMs: Long,
        rangeEndMs: Long,
    ): Result {
        val parsed = parseChunked(queryEvents, rangeStartMs, rangeEndMs)
        val screenOnMs = ScreenTime.digitalWellbeingTotalMs(
            appForegroundByPackage = parsed.appFgMs,
            eventInteractiveMs = parsed.interactiveMs,
            unlockedMs = parsed.unlockedMs,
            exclusiveAppUnionMs = parsed.appUnionMs,
        )
        return parsed.copy(screenOnMs = screenOnMs)
    }

    private fun parseChunked(
        queryEvents: (Long, Long) -> UsageEvents,
        rangeStartMs: Long,
        rangeEndMs: Long,
    ): Result {
        var unlocks = 0
        var pickups = 0
        var interactiveStart: Long? = null
        var unlockedStart: Long? = null
        var interactiveMs = 0L
        var unlockedMs = 0L
        var keyguardShowing = true
        var unlocked = false
        var lastUnlockMs = Long.MIN_VALUE / 2
        val hourlyInteractiveMs = LongArray(24)

        val appStart = mutableMapOf<String, Long>()
        val appFgMs = mutableMapOf<String, Long>()
        val appOpens = mutableMapOf<String, Int>()
        val spansAll = mutableListOf<Span>()
        val spansChrome = mutableListOf<Span>()
        /** Packages currently in FG (for chrome-only gating). */
        val activeFg = sortedSetOf<String>()
        var chromeOnlyStart: Long? = null
        var chromeOnlyMs = 0L

        fun closeInteractive(at: Long) {
            val s = interactiveStart ?: return
            val dur = (at - s).coerceAtLeast(0L)
            if (dur >= SCREEN_MIN_MS) {
                interactiveMs += dur
                if (dur >= PICKUP_MIN_MS) pickups++
                addSpanToHours(hourlyInteractiveMs, s, at)
            }
            interactiveStart = null
        }

        fun closeUnlocked(at: Long) {
            val s = unlockedStart ?: return
            unlockedMs += (at - s).coerceAtLeast(0L)
            unlockedStart = null
        }

        fun abortUnlocked() {
            unlockedStart = null
        }

        fun closeChromeOnly(at: Long) {
            val s = chromeOnlyStart ?: return
            chromeOnlyMs += (at - s).coerceAtLeast(0L)
            chromeOnlyStart = null
        }

        fun isHomeChrome(pkg: String): Boolean =
            pkg.startsWith("com.nothing.launcher") ||
                pkg.startsWith("com.android.launcher") ||
                pkg.startsWith("com.android.systemui") ||
                pkg == "android"

        fun syncChromeOnly(at: Long) {
            val onlyChrome = unlockedStart != null &&
                activeFg.isNotEmpty() &&
                activeFg.all { isHomeChrome(it) }
            if (onlyChrome && chromeOnlyStart == null) {
                chromeOnlyStart = at
            } else if (!onlyChrome) {
                closeChromeOnly(at)
            }
        }

        var cursor = rangeStartMs
        while (cursor < rangeEndMs) {
            val chunkEnd = minOf(cursor + CHUNK_MS, rangeEndMs)
            val events = queryEvents(cursor, chunkEnd)
            val event = UsageEvents.Event()
            while (events.hasNextEvent()) {
                events.getNextEvent(event)
                val t = event.timeStamp
                if (t < cursor || t > chunkEnd) continue
                val type = event.eventType
                val pkg = event.packageName ?: ""

                when (type) {
                    UsageEvents.Event.KEYGUARD_SHOWN -> {
                        val unlockStarted = unlockedStart
                        val interactiveAt = interactiveStart
                        val abort = unlockStarted != null &&
                            interactiveAt != null &&
                            unlockStarted >= interactiveAt &&
                            (t - interactiveAt) <= LOCKSCREEN_ABORT_MS
                        closeChromeOnly(t)
                        if (abort) abortUnlocked() else closeUnlocked(t)
                        keyguardShowing = true
                        unlocked = false
                        activeFg.clear()
                    }
                    UsageEvents.Event.KEYGUARD_HIDDEN -> {
                        if (keyguardShowing && t - lastUnlockMs >= UNLOCK_DEBOUNCE_MS) {
                            unlocks++
                            lastUnlockMs = t
                        }
                        keyguardShowing = false
                        unlocked = true
                        // Only tick unlocked while screen is interactive.
                        if (unlockedStart == null && interactiveStart != null) {
                            unlockedStart = t
                        }
                    }

                    UsageEvents.Event.SCREEN_INTERACTIVE -> {
                        if (interactiveStart == null) interactiveStart = t
                        // Resume unlocked clock after AOD while still unlocked.
                        // Lockscreen wakes also hit this then KEYGUARD_SHOWN —
                        // abort window above drops that false pulse.
                        if (unlocked && !keyguardShowing && unlockedStart == null) {
                            unlockedStart = t
                        }
                    }
                    UsageEvents.Event.SCREEN_NON_INTERACTIVE -> {
                        // Pause clocks; keep `unlocked` (AOD ≠ lock).
                        closeChromeOnly(t)
                        closeUnlocked(t)
                        closeInteractive(t)
                        activeFg.clear()
                    }

                    UsageEvents.Event.ACTIVITY_RESUMED,
                    UsageEvents.Event.MOVE_TO_FOREGROUND,
                    -> {
                        if (pkg.isEmpty()) continue
                        if (!ScreenTime.countsTowardDigitalWellbeing(pkg) && !isHomeChrome(pkg)) continue
                        activeFg.add(pkg)
                        syncChromeOnly(t)
                        if (!ScreenTime.countsTowardDigitalWellbeing(pkg)) continue
                        if (pkg !in appStart) {
                            appStart[pkg] = t
                            appOpens[pkg] = (appOpens[pkg] ?: 0) + 1
                        }
                    }
                    UsageEvents.Event.ACTIVITY_PAUSED,
                    UsageEvents.Event.ACTIVITY_STOPPED,
                    UsageEvents.Event.MOVE_TO_BACKGROUND,
                    -> {
                        if (pkg.isEmpty()) continue
                        activeFg.remove(pkg)
                        syncChromeOnly(t)
                        if (!ScreenTime.countsTowardDigitalWellbeing(pkg)) continue
                        val s = appStart.remove(pkg) ?: continue
                        val end = t.coerceAtLeast(s)
                        appFgMs[pkg] = (appFgMs[pkg] ?: 0L) + (end - s)
                        if (pkg != "android" && !isHomeChrome(pkg)) {
                            spansAll += Span(s, end)
                        } else if (isHomeChrome(pkg)) {
                            spansChrome += Span(s, end)
                        }
                    }
                }
            }
            cursor = chunkEnd
        }

        closeChromeOnly(rangeEndMs)
        closeUnlocked(rangeEndMs)
        closeInteractive(rangeEndMs)
        appStart.forEach { (pkg, s) ->
            val end = rangeEndMs.coerceAtLeast(s)
            appFgMs[pkg] = (appFgMs[pkg] ?: 0L) + (end - s)
            if (pkg != "android" && !isHomeChrome(pkg)) spansAll += Span(s, end)
        }

        val unionAllMs = mergeUnionMs(spansAll.map { it.start to it.end })
            .coerceAtMost((rangeEndMs - rangeStartMs).coerceAtLeast(0L))
        val dayCap = (rangeEndMs - rangeStartMs).coerceAtLeast(0L)
        val screenOnMs = interactiveMs.coerceAtMost(dayCap)
        val capped = if (screenOnMs > 0L) {
            appFgMs.mapValues { (_, ms) -> ms.coerceAtMost(screenOnMs) }
        } else {
            appFgMs
        }

        return Result(
            screenOnMs = screenOnMs,
            unlocks = unlocks,
            pickups = pickups,
            appFgMs = capped,
            appOpens = appOpens,
            interactiveMs = interactiveMs,
            unlockedMs = unlockedMs,
            homeChromeMs = chromeOnlyMs,
            appUnionMs = unionAllMs,
            hourlyInteractiveMs = hourlyInteractiveMs,
        )
    }

    @Deprecated("Use ScreenTime.digitalWellbeingTotalMs — AOD trim heuristics are retired.")
    fun pickScreenOnMs(
        interactiveMs: Long,
        unlockedMs: Long,
        appUnionMs: Long = 0L,
    ): Long = ScreenTime.digitalWellbeingTotalMs(
        appForegroundByPackage = emptyMap(),
        eventInteractiveMs = interactiveMs,
        unlockedMs = unlockedMs,
        exclusiveAppUnionMs = appUnionMs,
    )

    fun addSpanToHours(buckets: LongArray, startMs: Long, endMs: Long) {
        if (endMs <= startMs || buckets.size != 24) return
        val zone = java.time.ZoneId.systemDefault()
        var cursor = startMs
        while (cursor < endMs) {
            val z = java.time.Instant.ofEpochMilli(cursor).atZone(zone)
            val hour = z.hour.coerceIn(0, 23)
            val nextHour = z.toLocalDateTime()
                .withMinute(0).withSecond(0).withNano(0)
                .plusHours(1)
                .atZone(zone)
                .toInstant()
                .toEpochMilli()
            val sliceEnd = minOf(endMs, nextHour)
            buckets[hour] += (sliceEnd - cursor).coerceAtLeast(0L)
            cursor = sliceEnd
        }
    }

    fun mergeUnionMs(raw: List<Pair<Long, Long>>): Long {
        if (raw.isEmpty()) return 0L
        val sorted = raw.map { Span(it.first, it.second) }.sortedBy { it.start }
        var total = 0L
        var curStart = sorted.first().start
        var curEnd = sorted.first().end
        for (i in 1 until sorted.size) {
            val s = sorted[i]
            if (s.start <= curEnd) {
                curEnd = maxOf(curEnd, s.end)
            } else {
                total += (curEnd - curStart).coerceAtLeast(0L)
                curStart = s.start
                curEnd = s.end
            }
        }
        total += (curEnd - curStart).coerceAtLeast(0L)
        return total
    }

    fun formatHours(ms: Long): String {
        // Half-up to nearest minute — Digital Wellbeing / Settings round;
        // floor() was the recurring ~1 minute under-read.
        val totalMin = (ms + 30_000L) / 60_000L
        val h = totalMin / 60L
        val m = totalMin % 60L
        return "${h}h ${m}m"
    }
}
