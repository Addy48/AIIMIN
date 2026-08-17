package aiimin.core.data.export

import aiimin.core.data.ConfigState
import aiimin.core.data.DayState
import aiimin.core.data.JournalState
import aiimin.core.data.MoneyState
import aiimin.core.data.device.DeviceMetrics
import aiimin.core.data.device.PhoneDaySlice
import aiimin.core.data.device.UsageDayParser
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter

/**
 * Builds a **AI-ready** life dump: long Markdown (human + model) plus a
 * structured JSON twin. Designed so any model can reconstruct the day without
 * the app — identity, mode, captures, money, journal, phone metrics, walks.
 *
 * [rangeDays] + [phoneDays] expand section 7 into a multi-day phone ledger
 * (7 / 14 / 30). Journal rows are truncated to the window size when large.
 */
object LifeExport {

    data class Bundle(
        val markdown: String,
        val json: String,
        val fileStem: String,
    )

    fun build(
        config: ConfigState,
        day: DayState,
        money: MoneyState,
        journal: JournalState,
        device: DeviceMetrics,
        rangeDays: Int = 1,
        phoneDays: List<PhoneDaySlice> = emptyList(),
        zone: ZoneId = ZoneId.systemDefault(),
    ): Bundle {
        val now = Instant.now().atZone(zone)
        val stamp = now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd_HHmm"))
        val dayLabel = now.format(DateTimeFormatter.ISO_LOCAL_DATE)
        val window = rangeDays.coerceIn(1, 30)
        val windowStart = now.toLocalDate().minusDays((window - 1).toLong())
        val md = buildString {
            appendLine("# AIIMIN Life Export")
            appendLine()
            appendLine("> Purpose: full personal context for an AI assistant.")
            appendLine("> Read every section. Prefer facts over seed labels.")
            appendLine("> Generated: ${now.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)}")
            appendLine("> Window: last $window day${if (window == 1) "" else "s"} · $windowStart → $dayLabel")
            appendLine("> App: ${config.buildLabel}")
            appendLine("> Theme: ${config.themeName}")
            appendLine("> Sync: ${config.sync.label} · ${config.syncMeta}")
            appendLine()
            appendLine("---")
            appendLine()
            appendLine("## 1. Identity")
            appendLine()
            appendLine("- **Name:** ${config.identity.name}")
            appendLine("- **OS-ID:** `${config.identity.osId}`")
            appendLine("- **Tier:** ${config.identity.tierLabel}")
            appendLine("- **Rank:** ${config.identity.rank} (${config.identity.rankNo}/${config.identity.rankTotal})")
            appendLine("- **XP:** ${config.identity.xp} · to next (${config.identity.nextRank}): ${config.identity.xpToNext}")
            appendLine("- **Life arc:** ${config.identity.arc}")
            appendLine("- **Seed profile:** ${config.isSeed}")
            appendLine()
            appendLine("## 2. Operating mode · $dayLabel")
            appendLine()
            appendLine("- **Life mode:** ${day.mode.name}")
            appendLine("- **Micro-task (one small thing):** ${day.microTask.ifBlank { "(empty)" }}")
            appendLine("- **Baseline days logged:** ${day.baselineDays}")
            appendLine("- **Score history (newest last, up to $window):** ${day.history.takeLast(window).joinToString(prefix = "[", postfix = "]")}")
            appendLine("- **Notifications pref:** ${config.notificationsLabel}")
            appendLine("- **Daily minimums label:** ${config.minimumsLabel}")
            appendLine("- **Connections (yours):** ${config.connectionsLabel}")
            appendLine()
            appendLine("## 3. Today's commitments (pursuits + floors)")
            appendLine()
            if (day.today.isEmpty()) {
                appendLine("_No commitments on the board._")
            } else {
                day.today.forEachIndexed { i, entry ->
                    val c = entry.commitment
                    val obs = entry.observation.value
                    appendLine("### ${i + 1}. ${c.label}")
                    appendLine("- kind: ${c.kind} · shape: ${c.shape} · instrument: ${c.instrument}")
                    appendLine("- observation: ${obs?.toString() ?: "null (unset)"}")
                    appendLine("- hold: ${entry.hold}")
                    appendLine()
                }
            }
            appendLine("## 4. Settled captures (today)")
            appendLine()
            if (day.captures.isEmpty()) {
                appendLine("_Nothing settled yet._")
            } else {
                day.captures.forEachIndexed { i, line ->
                    appendLine(
                        "${i + 1}. **${line.time}** — ${line.label}" +
                            (line.amount?.let { " · amount=$it" } ?: ""),
                    )
                }
            }
            appendLine()
            appendLine("## 5. Money · window $window days")
            appendLine()
            appendLine("- **Period:** ${money.periodLabel} · ${money.sheetMeta}")
            appendLine("- **Phase:** ${money.phase} · tab=${money.tab} · sync=${money.syncLabel}")
            appendLine("- **MTD spend:** ${money.spentMtd}")
            appendLine("- **MTD income:** ${money.incomeMtd}")
            appendLine("- **Safe to spend:** ${money.safeToSpend}")
            appendLine("- **Budget total:** ${money.budgetTotal}")
            appendLine("- **Net worth:** ${money.netWorth} (Δ ${money.netWorthDelta})")
            appendLine("- **Week bars:** ${money.weekBars.joinToString { "${it.label}=${it.amount}" }}")
            appendLine("- **Budgets:**")
            money.budgets.forEach { b ->
                appendLine("  - ${b.name}: spent=${b.spent} / limit=${b.limit} (remaining=${b.remaining})")
            }
            appendLine("- **Ledger (${money.ledger.size} rows — full list; filter by meta date if present):**")
            money.ledger.forEachIndexed { i, tx ->
                appendLine("  ${i + 1}. ${tx.name} · ${tx.meta} · ${tx.amount} · cat=${tx.category}")
            }
            appendLine("- **Upcoming:**")
            money.upcoming.forEach { u ->
                appendLine("  - ${u.name} · ${u.meta} · ${u.amount}")
            }
            appendLine()
            appendLine("## 6. Journal · window $window days")
            appendLine()
            appendLine("- **Active template:** ${journal.template.label}")
            appendLine("- **Draft (unsaved):** ${journal.draft.ifBlank { "(empty)" }}")
            appendLine("- **Mood (1–5):** ${journal.mood} · ${JournalState.MOOD_LABELS.getOrNull(journal.mood - 1)}")
            val journalRows = journal.entries.take(window.coerceAtMost(journal.entries.size.coerceAtLeast(1)))
            appendLine("- **Entries (${journalRows.size} shown):**")
            journalRows.forEachIndexed { i, e ->
                appendLine()
                appendLine("### Entry ${i + 1} · ${e.date} · ${e.template.label} · mood ${e.mood}")
                appendLine()
                appendLine(e.body)
            }
            appendLine()
            appendLine("## 7. Phone day ledger · last $window day${if (window == 1) "" else "s"}")
            appendLine()
            if (phoneDays.isEmpty()) {
                appendLine("_No usage-access history for this window. Grant usage access and re-export._")
                appendLine()
                appendLine("### Today snapshot (live)")
                appendLine()
                appendPhoneToday(device)
            } else {
                phoneDays.forEach { slice ->
                    appendLine("### ${slice.dateIso}")
                    appendLine()
                    appendLine("- **Screen on:** ${UsageDayParser.formatHours(slice.screenMs)} (${slice.screenMs} ms)")
                    appendLine("- **Unlocks:** ${slice.unlocks}")
                    appendLine("- **Pickups (≥15s):** ${slice.pickups}")
                    appendLine("- **App opens:** ${slice.appOpens}")
                    appendLine("- **Peak hour:** ${slice.peakHour?.let { "%02d:00".format(it) } ?: "—"}")
                    if (slice.topApps.isNotEmpty()) {
                        appendLine("- **Top apps:**")
                        slice.topApps.forEachIndexed { i, app ->
                            appendLine("  ${i + 1}. ${app.label} (`${app.packageName}`) · ${app.hoursLabel} · ${app.opens}×")
                        }
                    }
                    val activeHours = slice.hourlyScreenMs.withIndex()
                        .filter { it.value > 0L }
                        .joinToString { (h, ms) -> "%02d=%s".format(h, UsageDayParser.formatHours(ms)) }
                    if (activeHours.isNotEmpty()) {
                        appendLine("- **Hourly screen:** $activeHours")
                    }
                    appendLine()
                }
                appendLine("### Live device (today extras)")
                appendLine()
                appendPhoneToday(device)
            }
            appendLine()
            appendLine("## 8. How to use this file")
            appendLine()
            appendLine("1. Treat OS-ID + arc as durable identity.")
            appendLine("2. Captures and money rows are ground truth for spend/events.")
            appendLine("3. Journal bodies are first-person reflection — quote carefully.")
            appendLine("4. Phone metrics are device-derived (screen-on = SCREEN_INTERACTIVE).")
            appendLine("5. Multi-day phone ledger is usage-stats truth for the selected window.")
            appendLine("6. Answer questions about *this person's life* only from sections above.")
            appendLine()
            appendLine("---")
            appendLine("End of AIIMIN export · $dayLabel · ${window}d")
        }

        val json = buildString {
            appendLine("{")
            appendLine("""  "schema": "aiimin.life.export.v2",""")
            appendLine("""  "generatedAt": "${now.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)}",""")
            appendLine("""  "rangeDays": $window,""")
            appendLine("""  "windowStart": ${jsonStr(windowStart.toString())},""")
            appendLine("""  "windowEnd": ${jsonStr(dayLabel)},""")
            appendLine("""  "build": ${jsonStr(config.buildLabel)},""")
            appendLine("""  "identity": {""")
            appendLine("""    "name": ${jsonStr(config.identity.name)},""")
            appendLine("""    "osId": ${jsonStr(config.identity.osId)},""")
            appendLine("""    "tier": ${jsonStr(config.identity.tierLabel)},""")
            appendLine("""    "rank": ${jsonStr(config.identity.rank)},""")
            appendLine("""    "rankNo": ${config.identity.rankNo},""")
            appendLine("""    "rankTotal": ${config.identity.rankTotal},""")
            appendLine("""    "xp": ${config.identity.xp},""")
            appendLine("""    "xpToNext": ${config.identity.xpToNext},""")
            appendLine("""    "nextRank": ${jsonStr(config.identity.nextRank)},""")
            appendLine("""    "arc": ${jsonStr(config.identity.arc)},""")
            appendLine("""    "isSeed": ${config.isSeed}""")
            appendLine("""  },""")
            appendLine("""  "prefs": {""")
            appendLine("""    "theme": ${jsonStr(config.themeName)},""")
            appendLine("""    "darkTheme": ${config.darkTheme},""")
            appendLine("""    "reduceMotion": ${config.reduceMotion},""")
            appendLine("""    "lifeMode": ${jsonStr(day.mode.name)},""")
            appendLine("""    "microTask": ${jsonStr(day.microTask)},""")
            appendLine("""    "notifications": ${jsonStr(config.notificationsLabel)},""")
            appendLine("""    "minimums": ${jsonStr(config.minimumsLabel)}""")
            appendLine("""  },""")
            appendLine("""  "scoreHistory": [${day.history.takeLast(window).joinToString()}],""")
            appendLine("""  "baselineDays": ${day.baselineDays},""")
            appendLine("""  "commitments": [""")
            day.today.forEachIndexed { i, entry ->
                val c = entry.commitment
                val comma = if (i < day.today.lastIndex) "," else ""
                appendLine(
                    """    {"label": ${jsonStr(c.label)}, "kind": ${jsonStr(c.kind.name)}, """ +
                        """"shape": ${jsonStr(c.shape.name)}, "instrument": ${jsonStr(c.instrument.name)}, """ +
                        """"observation": ${entry.observation.value}}""" + comma,
                )
            }
            appendLine("""  ],""")
            appendLine("""  "captures": [""")
            day.captures.forEachIndexed { i, line ->
                val comma = if (i < day.captures.lastIndex) "," else ""
                appendLine(
                    """    {"time": ${jsonStr(line.time)}, "label": ${jsonStr(line.label)}, "amount": ${line.amount}}""" + comma,
                )
            }
            appendLine("""  ],""")
            appendLine("""  "money": {""")
            appendLine("""    "period": ${jsonStr(money.periodLabel)},""")
            appendLine("""    "mtdSpend": ${money.spentMtd},""")
            appendLine("""    "mtdIncome": ${money.incomeMtd},""")
            appendLine("""    "safeToSpend": ${money.safeToSpend},""")
            appendLine("""    "netWorth": ${money.netWorth},""")
            appendLine("""    "ledger": [""")
            money.ledger.forEachIndexed { i, tx ->
                val comma = if (i < money.ledger.lastIndex) "," else ""
                appendLine(
                    """      {"name": ${jsonStr(tx.name)}, "meta": ${jsonStr(tx.meta)}, """ +
                        """"amount": ${tx.amount}, "category": ${jsonStr(tx.category)}}""" + comma,
                )
            }
            appendLine("""    ]""")
            appendLine("""  },""")
            appendLine("""  "journal": {""")
            appendLine("""    "template": ${jsonStr(journal.template.label)},""")
            appendLine("""    "mood": ${journal.mood},""")
            appendLine("""    "draft": ${jsonStr(journal.draft)},""")
            appendLine("""    "entries": [""")
            journal.entries.forEachIndexed { i, e ->
                val comma = if (i < journal.entries.lastIndex) "," else ""
                appendLine(
                    """      {"date": ${jsonStr(e.date)}, "template": ${jsonStr(e.template.label)}, """ +
                        """"mood": ${e.mood}, "body": ${jsonStr(e.body)}}""" + comma,
                )
            }
            appendLine("""    ]""")
            appendLine("""  },""")
            appendLine("""  "phoneToday": {""")
            appendLine("""    "steps": ${device.steps},""")
            appendLine("""    "stepsTarget": ${device.stepsTarget},""")
            appendLine("""    "stepsStatus": ${jsonStr(device.stepsStatus.name)},""")
            appendLine("""    "kmWalked": ${device.kmWalked},""")
            appendLine("""    "screenTimeMs": ${device.screenTimeMs},""")
            appendLine("""    "screenTargetMs": ${device.screenTargetMs},""")
            appendLine("""    "screenStatus": ${jsonStr(device.screenStatus.name)},""")
            appendLine("""    "unlocks": ${device.unlockCount},""")
            appendLine("""    "pickups": ${device.pickups},""")
            appendLine("""    "appOpens": ${device.appOpenCount},""")
            appendLine("""    "hourlySteps": [${device.hourlySteps.joinToString()}],""")
            appendLine("""    "hourlyScreenMs": [${device.hourlyScreenMs.joinToString()}],""")
            appendLine("""    "topApps": [""")
            device.topApps.forEachIndexed { i, app ->
                val comma = if (i < device.topApps.lastIndex) "," else ""
                appendLine(
                    """      {"label": ${jsonStr(app.label)}, "package": ${jsonStr(app.packageName)}, """ +
                        """"ms": ${app.ms}, "opens": ${app.opens}}""" + comma,
                )
            }
            appendLine("""    ],""")
            appendLine("""    "walks": [""")
            device.walks.forEachIndexed { i, w ->
                val comma = if (i < device.walks.lastIndex) "," else ""
                appendLine(
                    """      {"label": ${jsonStr(w.label)}, "startMs": ${w.startMs}, "endMs": ${w.endMs}, "steps": ${w.steps}}""" + comma,
                )
            }
            appendLine("""    ],""")
            appendLine("""    "lines": [${device.lines.joinToString { jsonStr(it) }}]""")
            appendLine("""  },""")
            appendLine("""  "phoneDays": [""")
            phoneDays.forEachIndexed { i, slice ->
                val comma = if (i < phoneDays.lastIndex) "," else ""
                appendLine(
                    """    {"date": ${jsonStr(slice.dateIso)}, "screenMs": ${slice.screenMs}, """ +
                        """"unlocks": ${slice.unlocks}, "pickups": ${slice.pickups}, """ +
                        """"appOpens": ${slice.appOpens}, "peakHour": ${slice.peakHour}, """ +
                        """"hourlyScreenMs": [${slice.hourlyScreenMs.joinToString()}]}""" + comma,
                )
            }
            appendLine("""  ]""")
            appendLine("}")
        }

        return Bundle(
            markdown = md,
            json = json,
            fileStem = "AIIMIN_life_export_${window}d_$stamp",
        )
    }

    private fun StringBuilder.appendPhoneToday(device: DeviceMetrics) {
        appendLine("- **Steps:** ${device.steps?.toString() ?: "null"} / ${device.stepsTarget} · status=${device.stepsStatus} · source=${device.stepsSource} · ${device.stepsMessage ?: ""}")
        appendLine("- **Km (stride est.):** ${device.kmWalked?.let { "%.2f".format(it) } ?: "null"}")
        appendLine("- **Screen on:** ${device.screenTimeMs?.let { UsageDayParser.formatHours(it) } ?: "null"} (${device.screenTimeMs} ms) · ceiling=${UsageDayParser.formatHours(device.screenTargetMs)} · status=${device.screenStatus}")
        appendLine("- **Unlocks:** ${device.unlockCount}")
        appendLine("- **Pickups (≥15s screen-on):** ${device.pickups}")
        appendLine("- **App opens (useful packages):** ${device.appOpenCount}")
        appendLine("- **Top apps:**")
        device.topApps.forEachIndexed { i, app ->
            appendLine("  ${i + 1}. ${app.label} (`${app.packageName}`) · ${app.hoursLabel} · ${app.opens}×")
        }
        appendLine("- **Walk bouts:**")
        if (device.walks.isEmpty()) {
            appendLine("  _(none — need ≥350 steps in a bout while sensor listens)_")
        } else {
            device.walks.forEach { w ->
                appendLine("  - ${w.label} · ${w.timeLabel} · ${w.steps} steps")
            }
        }
        appendLine("- **Insight lines:**")
        device.lines.forEach { appendLine("  - $it") }
    }

    private fun jsonStr(value: String?): String {
        if (value == null) return "null"
        val escaped = value
            .replace("\\", "\\\\")
            .replace("\"", "\\\"")
            .replace("\n", "\\n")
            .replace("\r", "\\r")
            .replace("\t", "\\t")
        return "\"$escaped\""
    }
}
