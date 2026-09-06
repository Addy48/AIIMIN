package aiimin.core.data.device

/**
 * Digital Wellbeing / home Screen-time widget figure.
 *
 * Cannot read the widget number — WellbeingSettingsProvider rejects third-party
 * query. Rebuild from UsageStats (same OS substrate DW uses).
 *
 * | Signal | vs DW | Why |
 * |--------|-------|-----|
 * | Exclusive ACTIVITY_* union | under busy days | OEM event buffer truncates |
 * | Unlocked screen-on wall-clock | slight over | home / shade / lock residue |
 * | Busy cap vs union +12m | stops +20m over-read | never weight unlocked / AOD |
 *
 * **Law (founder 2026-08-13 — app was +20m high):**
 * Gap ≥45m and union < 92% of unlocked →
 *   `shown = min(unlocked, exclusiveUnion + 12m)`  (`union_plus_12`)
 * Never weight unlocked (that was `union_unlock_w2` and over-read AOD).
 * Never cap against interactive (AOD). Cap against unlocked.
 * Else prefer exclusive union (quiet / complete events).
 *
 * Parser: chunked UsageEvents; abort unlock-pulse on KEYGUARD_SHOWN ≤5s after
 * SCREEN_INTERACTIVE (lockscreen wake); never clear `unlocked` on AOD.
 */
object ScreenTime {

    private const val LOCKSCREEN_GAP_MIN_MS = 45L * 60_000L
    private const val UNION_RELIABLE_PCT = 92L
    private const val UNION_OVER_CAP_MS = 12L * 60_000L
    private const val FG_EVENT_AGREE_MS = 25L * 60_000L

    fun digitalWellbeingTotalMs(
        appForegroundByPackage: Map<String, Long> = emptyMap(),
        systemInteractiveMs: Long = 0L,
        eventInteractiveMs: Long = 0L,
        unlockedMs: Long = 0L,
        exclusiveAppUnionMs: Long = 0L,
        dailyForegroundByPackage: Map<String, Long> = emptyMap(),
        authoritativeTotalMs: Long = 0L,
    ): Long {
        if (authoritativeTotalMs > 0L) return authoritativeTotalMs

        val interactive = when {
            eventInteractiveMs > 0L -> eventInteractiveMs
            systemInteractiveMs > 0L -> systemInteractiveMs
            else -> 0L
        }
        val dailyForegroundMs = dailyForegroundByPackage.values.sumOf { it.coerceAtLeast(0L) }

        var gap = 0L
        var trimmed = 0L
        var path = "unset"

        val result: Long = run {
            if (interactive > 0L && unlockedMs > 0L) {
                gap = (interactive - unlockedMs).coerceAtLeast(0L)
                if (gap >= LOCKSCREEN_GAP_MIN_MS && exclusiveAppUnionMs > 0L) {
                    val reliable = exclusiveAppUnionMs * 100L >= unlockedMs * UNION_RELIABLE_PCT
                    if (reliable) {
                        path = "exclusive_union"
                        return@run exclusiveAppUnionMs.coerceAtMost(unlockedMs)
                    }
                    // Truncated union — recover at most 12m, never AOD interactive.
                    trimmed = minOf(unlockedMs, exclusiveAppUnionMs + UNION_OVER_CAP_MS)
                    val recovered = dailyForegroundMs.coerceAtMost(unlockedMs)
                    if (recovered > trimmed) {
                        path = "daily_foreground_recovery"
                        trimmed = recovered
                        return@run recovered
                    }
                    path = "union_plus_12"
                    return@run trimmed.coerceAtMost(unlockedMs)
                }
                if (gap >= LOCKSCREEN_GAP_MIN_MS) {
                    path = "unlocked_screen_on"
                    trimmed = unlockedMs
                    return@run unlockedMs
                }
            }

            if (exclusiveAppUnionMs > 0L) {
                path = "exclusive_union"
                return@run when {
                    interactive > 0L -> exclusiveAppUnionMs.coerceAtMost(interactive)
                    systemInteractiveMs > 0L ->
                        exclusiveAppUnionMs.coerceAtMost(systemInteractiveMs)
                    else -> exclusiveAppUnionMs
                }
            }

            val fgSum = appForegroundByPackage.values.sum().coerceAtLeast(0L)
            path = "fg_fallback"
            when {
                fgSum > 0L && interactive > 0L -> {
                    val delta = kotlin.math.abs(fgSum - interactive)
                    when {
                        delta <= FG_EVENT_AGREE_MS -> {
                            val ceiling = when {
                                systemInteractiveMs > 0L ->
                                    minOf(systemInteractiveMs, interactive)
                                else -> interactive
                            }
                            fgSum.coerceAtMost(ceiling)
                        }
                        fgSum < interactive -> fgSum
                        else -> interactive
                    }
                }
                fgSum > 0L -> {
                    if (systemInteractiveMs > 0L) fgSum.coerceAtMost(systemInteractiveMs) else fgSum
                }
                interactive > 0L -> interactive
                else -> 0L
            }
        }

        try {
            android.util.Log.d(
                "DW_CALC",
                "in: auth=$authoritativeTotalMs union=$exclusiveAppUnionMs interactive=$eventInteractiveMs " +
                    "unlocked=$unlockedMs dailyFg=$dailyForegroundMs gap=$gap trimmed=$trimmed " +
                    "path=$path → out=$result " +
                    "(unionMin=${exclusiveAppUnionMs / 60_000}m " +
                    "outMin=${result / 60_000}m label=${UsageDayParser.formatHours(result)})",
            )
        } catch (_: Throwable) {
            // Unit tests run on JVM — android.util.Log is a stub that throws.
        }
        return result
    }

    fun scaleAppForegroundToTotal(
        appForegroundByPackage: Map<String, Long>,
        targetTotalMs: Long,
    ): Map<String, Long> {
        if (appForegroundByPackage.isEmpty() || targetTotalMs <= 0L) return emptyMap()
        val sum = appForegroundByPackage.values.sum()
        if (sum <= 0L) return emptyMap()
        if (kotlin.math.abs(sum - targetTotalMs) <= 60_000L) return appForegroundByPackage
        return appForegroundByPackage.mapValues { (_, ms) ->
            (ms.toDouble() * targetTotalMs / sum).toLong().coerceAtLeast(0L)
        }
    }

    fun countsTowardDigitalWellbeing(packageName: String): Boolean {
        if (packageName.isBlank() || packageName == "android") return false
        if (packageName == "_union") return true
        if (packageName.startsWith("com.android.systemui")) return false
        if (packageName.startsWith("com.android.server.")) return false
        if (packageName.startsWith("com.google.android.gms")) return false
        if (packageName.startsWith("com.google.android.gsf")) return false
        if (packageName.startsWith("com.google.android.ext.")) return false
        if (packageName.startsWith("com.google.android.networkstack")) return false
        if (packageName.startsWith("com.android.providers.")) return false
        if (packageName == "com.android.traceur") return false
        return true
    }

    fun isDonutChrome(packageName: String): Boolean {
        if (packageName.startsWith("com.nothing.launcher")) return true
        if (packageName.startsWith("com.android.launcher")) return true
        if (packageName.startsWith("com.google.android.permissioncontroller")) return true
        if (packageName.startsWith("com.google.android.packageinstaller")) return true
        return false
    }
}
