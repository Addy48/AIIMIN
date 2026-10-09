package aiimin.core.sensing.logic

/**
 * Screen time rebuilt the way Digital Wellbeing builds it: from per-activity
 * resume → pause intervals, not from the OS bucket totals (which overlap the
 * day and over-count).
 *
 * Rules, each fixing a v3 bug:
 * 1. Sessions are keyed by package + activity class, so two activities of one
 *    app never cancel each other.
 * 2. Screen off, keyguard shown and shutdown close every open session — the
 *    "app used all night" artefact can't happen.
 * 3. A new app resuming closes other apps' sessions (one foreground app), so a
 *    dropped pause event can't leave an app running for hours.
 * 4. Events are read from a lookback before the window, then clipped, so an app
 *    opened at 23:50 and used past midnight counts its after-midnight minutes.
 * 5. The day total is the union of intervals, so split screen never double counts.
 */
object UsageTimeline {

    enum class Kind { RESUMED, PAUSED, STOPPED, SCREEN_ON, SCREEN_OFF, KEYGUARD_SHOWN, KEYGUARD_HIDDEN, SHUTDOWN, STARTUP, NOTIFICATION }

    data class Event(val at: Long, val kind: Kind, val pkg: String = "", val cls: String = "")

    data class AppUsage(val pkg: String, val ms: Long, val opens: Int, val notifications: Int)

    data class Result(
        /** Union of all foreground app time inside the window. */
        val totalMs: Long,
        val workMs: Long,
        val personalMs: Long,
        val apps: List<AppUsage>,
        val unlocks: Int,
        val notifications: Int,
        val hourlyMs: LongArray,
        /** Foreground time at or after [lateFrom] inside the window. */
        val lateMs: Long,
        val firstUnlockAt: Long?,
    )

    private const val UNLOCK_DEBOUNCE_MS = 1_000L

    /**
     * @param events every event from (window start − lookback) to window end, any order.
     * @param counted false for launchers, System UI and other chrome that DW ignores.
 * @param isHome launcher packages: bringing home to the front ends the app session.
     * @param hourOf maps an instant to its local hour 0–23.
     * @param hourStart maps an instant to the start of its local hour.
     */
    fun compute(
        events: List<Event>,
        windowStart: Long,
        windowEnd: Long,
        counted: (String) -> Boolean,
        isHome: (String) -> Boolean = { false },
        isWork: (String) -> Boolean = { false },
        lateFrom: Long = Long.MAX_VALUE,
        hourOf: (Long) -> Int,
        hourStart: (Long) -> Long,
    ): Result {
        val sorted = events.sortedWith(compareBy<Event> { it.at }.thenBy { it.kind.ordinal })
        val open = LinkedHashMap<String, Pair<String, Long>>() // key → (pkg, start)
        val intervals = HashMap<String, MutableList<LongArray>>()
        val opens = HashMap<String, Int>()
        val notifs = HashMap<String, Int>()
        var unlocks = 0
        var lastUnlock: Long? = null
        var firstUnlock: Long? = null
        var lastForegroundPkg: String? = null

        fun close(key: String, at: Long) {
            val (pkg, start) = open.remove(key) ?: return
            if (at > start) intervals.getOrPut(pkg) { mutableListOf() } += longArrayOf(start, at)
        }

        fun closeAll(at: Long) = open.keys.toList().forEach { close(it, at) }

        for (e in sorted) {
            if (e.at > windowEnd) break
            when (e.kind) {
                Kind.RESUMED -> {
                    if (!counted(e.pkg)) {
                        // Home in front: whatever app was open has left. Other chrome
                        // (System UI, shade) is ignored so it can't cut real use.
                        if (isHome(e.pkg)) {
                            closeAll(e.at)
                            lastForegroundPkg = null
                        }
                        continue
                    }
                    open.keys.filter { open[it]!!.first != e.pkg }.forEach { close(it, e.at) }
                    val key = e.pkg + "/" + e.cls
                    if (key !in open) {
                        if (lastForegroundPkg != e.pkg && open.values.none { it.first == e.pkg } && e.at >= windowStart) {
                            opens[e.pkg] = (opens[e.pkg] ?: 0) + 1
                        }
                        open[key] = e.pkg to e.at
                    }
                    lastForegroundPkg = e.pkg
                }
                Kind.PAUSED, Kind.STOPPED -> close(e.pkg + "/" + e.cls, e.at)
                Kind.SCREEN_OFF, Kind.KEYGUARD_SHOWN, Kind.SHUTDOWN -> {
                    closeAll(e.at)
                    lastForegroundPkg = null
                }
                Kind.STARTUP -> {
                    open.clear()
                    lastForegroundPkg = null
                }
                Kind.KEYGUARD_HIDDEN -> if (e.at in windowStart until windowEnd && (lastUnlock == null || e.at - lastUnlock!! >= UNLOCK_DEBOUNCE_MS)) {
                    unlocks++
                    lastUnlock = e.at
                    if (firstUnlock == null) firstUnlock = e.at
                }
                Kind.SCREEN_ON -> Unit
                Kind.NOTIFICATION -> if (e.at in windowStart until windowEnd && counted(e.pkg)) {
                    notifs[e.pkg] = (notifs[e.pkg] ?: 0) + 1
                }
            }
        }
        closeAll(windowEnd)

        fun clip(list: List<LongArray>) = list.mapNotNull { (s, t) ->
            val a = maxOf(s, windowStart)
            val b = minOf(t, windowEnd)
            if (b > a) longArrayOf(a, b) else null
        }

        val perApp = intervals.mapValues { (_, v) -> merge(clip(v)) }
        val all = merge(perApp.values.flatten())
        val work = merge(perApp.filterKeys(isWork).values.flatten())
        val personal = merge(perApp.filterKeys { !isWork(it) }.values.flatten())

        val hourly = LongArray(24)
        for ((s, t) in all) {
            var c = s
            while (c < t) {
                val next = minOf(t, hourStart(c) + 3_600_000L)
                hourly[hourOf(c)] += next - c
                c = if (next > c) next else t
            }
        }
        val late = all.sumOf { (s, t) -> (minOf(t, windowEnd) - maxOf(s, lateFrom)).coerceAtLeast(0) }

        val apps = perApp.map { (pkg, iv) ->
            AppUsage(pkg, iv.sumOf { it[1] - it[0] }, opens[pkg] ?: 0, notifs[pkg] ?: 0)
        }.filter { it.ms > 0 || it.notifications > 0 }
            .plus(notifs.keys.filter { it !in perApp }.map { AppUsage(it, 0, 0, notifs[it] ?: 0) })
            .sortedByDescending { it.ms }

        return Result(
            totalMs = all.sumOf { it[1] - it[0] },
            workMs = work.sumOf { it[1] - it[0] },
            personalMs = personal.sumOf { it[1] - it[0] },
            apps = apps,
            unlocks = unlocks,
            notifications = notifs.values.sum(),
            hourlyMs = hourly,
            lateMs = late,
            firstUnlockAt = firstUnlock,
        )
    }

    /** Sorted, non-overlapping union of intervals. */
    fun merge(raw: List<LongArray>): List<LongArray> {
        if (raw.isEmpty()) return emptyList()
        val s = raw.sortedBy { it[0] }
        val out = mutableListOf(s[0].copyOf())
        for (i in 1 until s.size) {
            val cur = out.last()
            if (s[i][0] <= cur[1]) cur[1] = maxOf(cur[1], s[i][1]) else out += s[i].copyOf()
        }
        return out
    }
}
