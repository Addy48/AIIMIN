package aiimin.core.data.app

import aiimin.core.data.core.DayClock
import aiimin.core.data.core.EventLogger
import aiimin.core.data.day.DayRepository
import aiimin.core.data.device.DeviceRepository
import aiimin.core.data.money.MoneyRepository
import aiimin.core.data.notes.JournalRepository
import aiimin.core.data.notes.NoteRepository
import aiimin.core.data.notify.NotificationRepository
import aiimin.core.data.plan.CalendarRepository
import aiimin.core.data.plan.MinimumRepository
import aiimin.core.data.plan.TaskRepository
import aiimin.core.data.settings.AppSettings
import aiimin.core.data.settings.SettingsStore
import aiimin.core.data.sync.SyncRepository
import aiimin.core.data.util.Dates
import aiimin.core.data.util.Money
import aiimin.core.data.vault.FamilyRepository
import aiimin.core.data.vault.VaultRepository
import aiimin.core.database.AppDatabase
import aiimin.core.database.FamilyDao
import aiimin.core.engine.BatteryMode
import aiimin.core.engine.DayMode
import aiimin.core.engine.Intention
import aiimin.core.engine.IntentionChange
import aiimin.core.engine.IntentionPolicy
import aiimin.core.engine.LogEvent
import aiimin.core.engine.LogicalDay
import aiimin.core.engine.RolePreset
import aiimin.core.engine.SignalDef
import aiimin.core.engine.Tier
import android.content.Context
import dagger.hilt.android.qualifiers.ApplicationContext
import java.io.File
import java.time.LocalDate
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.withContext

// ------------------------------------------------------------------ search

enum class ResultType(val label: String) { TASK("Tasks"), NOTE("Notes"), MONEY("Money"), DOC("Vault"), PERSON("People"), EVENT("Calendar") }

data class SearchHit(val type: ResultType, val id: String, val title: String, val subtitle: String)

@Singleton
class SearchRepository @Inject constructor(
    private val tasks: TaskRepository,
    private val notes: NoteRepository,
    private val money: MoneyRepository,
    private val vault: VaultRepository,
    private val family: FamilyDao,
    private val calendar: CalendarRepository,
    private val clock: DayClock,
) {
    suspend fun search(q: String): List<SearchHit> {
        val query = q.trim()
        if (query.length < 2) return emptyList()
        val today = clock.today()
        val visibleDocs = vault.visible.first().map { it.doc.id }.toSet()
        return buildList {
            tasks.search(query).forEach { add(SearchHit(ResultType.TASK, it.id, it.title, it.day?.let { d -> Dates.relative(LocalDate.parse(d), today) } ?: "Someday")) }
            notes.search(query).forEach { add(SearchHit(ResultType.NOTE, it.id, it.title, it.body.take(80).replace('\n', ' '))) }
            money.search(query).forEach { add(SearchHit(ResultType.MONEY, it.id, it.title, "${Money.format(if (it.direction == "in") it.amountPaise else -it.amountPaise)} · ${it.category} · ${Dates.relative(LocalDate.parse(it.day), today)}")) }
            vault.search(query).filter { it.id in visibleDocs && !it.sensitive }.forEach { add(SearchHit(ResultType.DOC, it.id, it.title, it.category + (it.expires?.let { e -> " · expires ${Dates.short(LocalDate.parse(e))}" } ?: ""))) }
            family.allNow().filter { it.name.contains(query, true) || it.relation.contains(query, true) }.forEach { add(SearchHit(ResultType.PERSON, it.id, it.name, it.relation)) }
            calendar.search(query).forEach { add(SearchHit(ResultType.EVENT, it.id, it.title, Dates.short(java.time.Instant.ofEpochMilli(it.startAt).atZone(clock.zone).toLocalDate()))) }
        }
    }
}

// ------------------------------------------------------------------ activity

data class ActivityLine(val at: Long, val text: String, val tier: Tier, val type: String, val refId: String?)

@Singleton
class ActivityRepository @Inject constructor(private val log: EventLogger) {
    /** The real activity bus: what you did, from the log, in plain words. */
    fun recent(n: Int = 60): Flow<List<ActivityLine>> = log.recent(n * 2).map { list -> list.mapNotNull(::line).take(n) }

    private fun line(e: LogEvent): ActivityLine? {
        val d = e.data
        val text = when (e.type) {
            "task.create" -> "Added a task"
            "task.toggle" -> if (d["done"] == true) "Finished a task" else "Reopened a task"
            "min.toggle" -> if (d["done"] == true) "Kept a minimum" else "Unticked a minimum"
            "min.proof" -> "Added proof to a minimum"
            "focus.session" -> "Focused for ${d["min"]} min" + ((d["distracted"] as? Number)?.toInt()?.takeIf { it > 0 }?.let { " ($it min in other apps removed)" } ?: "")
            "journal.entry" -> if (d["ok"] == true) "Wrote in the journal" else "Saved a short journal entry"
            "txn.add" -> "Logged a payment"
            "txn.detect" -> "Detected a bank alert"
            "doc.add" -> "Added a document"
            "doc.share" -> "Shared a document"
            "doc.expiry" -> "Set a document expiry"
            "note.create" -> "Wrote a note"
            "ai.apply" -> "Applied ${d["n"]} change${if ((d["n"] as? Number)?.toInt() == 1) "" else "s"} from the assistant"
            "ai.undo" -> "Undid the assistant's changes"
            "day.settle" -> "Day settled: ${e.ref?.id}"
            "backfill" -> "Filed an entry to yesterday"
            "intent.change" -> "Changed what a signal means"
            "emergency.request" -> "Requested emergency access"
            "emergency.granted" -> "Emergency access granted"
            "sync" -> "Synced with aiimin.in"
            else -> return null
        }
        return ActivityLine(e.at.toEpochMilli(), text, e.tier, e.type, e.ref?.id)
    }
}

// ------------------------------------------------------------------ settings actions

/** Choices with rules attached: cooldowns, history floors, coverage. */
@Singleton
class PreferencesRepository @Inject constructor(
    private val settings: SettingsStore,
    private val days: DayRepository,
    private val clock: DayClock,
    private val log: EventLogger,
) {
    val state: Flow<AppSettings> = settings.settings

    suspend fun update(change: (AppSettings) -> AppSettings) = settings.update(change)

    sealed interface Result {
        data object Done : Result
        data class Wait(val until: LocalDate) : Result
    }

    /** Battery mode can change once every 7 days. */
    suspend fun setBatteryMode(mode: BatteryMode): Result {
        val s = settings.current()
        if (mode == s.batteryMode) return Result.Done
        val today = clock.today()
        val last = s.batteryModeChangedOn
        if (last != null && last.plusDays(clock.rules.battery.modeCooldownDays.toLong()) > today) {
            return Result.Wait(last.plusDays(clock.rules.battery.modeCooldownDays.toLong()))
        }
        settings.update { it.copy(batteryMode = mode, batteryModeChangedOn = today) }
        log.log("battery.mode", data = mapOf("mode" to mode.name))
        return Result.Done
    }

    /** Day mode applies from tomorrow, at most once every 14 days. */
    suspend fun setDayMode(mode: DayMode): Result {
        val s = settings.current()
        val today = clock.today()
        if (!LogicalDay.canChangeMode(s.dayModeChangedOn, today, clock.rules)) {
            return Result.Wait(s.dayModeChangedOn!!.plusDays(clock.rules.day.modeChangeCooldownDays.toLong()))
        }
        settings.update { it.copy(dayMode = mode, dayModeChangedOn = today) }
        log.log("day.mode", data = mapOf("mode" to aiimin.core.data.settings.Codecs.encodeDayMode(mode)), tier = Tier.A)
        return Result.Done
    }

    suspend fun changeIntention(key: String, next: Intention): IntentionChange {
        val s = settings.current()
        val r = IntentionPolicy(clock.rules).propose(s.intentions, key, next, days.history(), clock.today())
        when (r) {
            is IntentionChange.Applied -> settings.update { it.copy(intentions = r.set) }
            is IntentionChange.Scheduled -> settings.update { it.copy(intentions = r.set) }
            else -> Unit
        }
        log.log("intent.change", "signal", key, mapOf("result" to r::class.simpleName), Tier.C)
        return r
    }

    suspend fun suggestedTarget(key: String): Double? = IntentionPolicy(clock.rules).suggestedTarget(settings.current().intentions, key, days.history())

    suspend fun addCustomSignal(name: String, unit: String, domain: String, target: Double): String {
        val key = "c_" + System.currentTimeMillis().toString(36)
        settings.update {
            val def = SignalDef(key, name.trim(), unit.trim().ifBlank { "count" }, domain, Tier.C, "Logged by you")
            it.copy(intentions = it.intentions.copy(customDefs = it.intentions.customDefs + (key to def)).with(key, Intention(aiimin.core.engine.Direction.MORE, target, 1)))
        }
        log.log("intent.custom", "signal", key)
        return key
    }

    suspend fun logCustom(key: String, value: Double, forYesterday: Boolean = false) {
        val day = if (forYesterday) clock.today().minusDays(1) else clock.today()
        log.log("signal.log", "signal", key, mapOf("key" to key, "value" to value), if (forYesterday) Tier.D else Tier.C, day = day)
        if (forYesterday) {
            days.noteBackfill()
            days.refreshYesterday()
        }
    }

    suspend fun applyPreset(key: String) {
        val p = RolePreset.byKey(key) ?: return
        settings.update { s ->
            val fresh = p.applyTo(aiimin.core.engine.IntentionSet.default()).copy(customDefs = s.intentions.customDefs)
            s.copy(intentions = fresh, role = key)
        }
        log.log("intent.preset", data = mapOf("preset" to key))
    }
}

// ------------------------------------------------------------------ setup

@Singleton
class SetupRepository @Inject constructor(
    private val settings: SettingsStore,
    private val family: FamilyRepository,
    private val minimums: MinimumRepository,
    private val days: DayRepository,
    private val money: MoneyRepository,
    private val log: EventLogger,
) {
    suspend fun complete(name: String, role: String, priorities: List<String>, battery: BatteryMode, mins: List<String>, monthlyPlanRupees: Long?) {
        val preset = RolePreset.byKey(role)
        settings.update {
            it.copy(
                name = name.trim(), role = role, priorities = priorities, batteryMode = preset?.suggestsBattery ?: battery,
                intentions = preset?.applyTo(aiimin.core.engine.IntentionSet.default()) ?: it.intentions,
            )
        }
        family.ensureSelf(name)
        days.ensureToday()
        mins.filter { it.isNotBlank() }.forEach { minimums.add(it, startToday = true) }
        monthlyPlanRupees?.takeIf { it > 0 }?.let { money.setBudget(it * 100, 0, emptyMap()) }
        // Last: flipping this swaps the UI to Today.
        settings.update { it.copy(onboarded = true) }
        log.log("onboarding.done", data = mapOf("role" to role, "mins" to mins.size), tier = Tier.A, source = "system")
    }
}

// ------------------------------------------------------------------ export

@Singleton
class ExportRepository @Inject constructor(
    @ApplicationContext private val context: Context,
    private val db: AppDatabase,
    private val journal: JournalRepository,
    private val log: EventLogger,
) {
    /** Everything you have, as one zip: data as JSON lines plus your vault files. */
    suspend fun exportAll(includeJournal: Boolean): File = withContext(Dispatchers.IO) {
        val dir = File(context.cacheDir, "exports").apply { mkdirs() }
        val out = File(dir, "aiimin-export-${LocalDate.now()}.zip")
        ZipOutputStream(out.outputStream()).use { z ->
            fun put(name: String, text: String) {
                z.putNextEntry(ZipEntry(name)); z.write(text.toByteArray()); z.closeEntry()
            }
            put("events.jsonl", db.events().all().joinToString("\n") { "{\"seq\":${it.seq},\"at\":${it.at},\"day\":\"${it.day}\",\"type\":\"${it.type}\",\"data\":${it.data},\"tier\":\"${it.tier}\",\"hash\":\"${it.hash}\"}" })
            put("tasks.csv", "day,time,title,done\n" + db.tasks().search("%").joinToString("\n") { "${it.day},${it.time.orEmpty()},\"${it.title.replace("\"", "'")}\",${it.done}" })
            put("notes.md", db.notes().search("%").joinToString("\n\n---\n\n") { "# ${it.title}\n\n${it.body}" })
            if (includeJournal) put("journal.md", journal.entries.first().joinToString("\n\n---\n\n") { "## ${it.day}${it.mood?.let { m -> " · mood $m/5" } ?: ""}\n\n${it.text}" })
            File(context.filesDir, "vault").listFiles()?.filter { !it.name.endsWith(".enc") }?.forEach { f ->
                z.putNextEntry(ZipEntry("vault/${f.name}")); f.inputStream().use { it.copyTo(z) }; z.closeEntry()
            }
        }
        log.log("export.all", data = mapOf("journal" to includeJournal), tier = Tier.A)
        out
    }
}

// ------------------------------------------------------------------ maintenance

/** The heartbeat: run on open, on resume, and from the periodic worker. */
@Singleton
class Maintenance @Inject constructor(
    private val days: DayRepository,
    private val money: MoneyRepository,
    private val device: DeviceRepository,
    private val family: FamilyRepository,
    private val notifications: NotificationRepository,
    private val sync: SyncRepository,
    private val settings: SettingsStore,
    private val clock: DayClock,
) {
    suspend fun run(syncNow: Boolean = false) {
        if (!settings.current().onboarded) return
        runCatching { device.refreshRecent() }
        days.ensureToday()
        runCatching { money.ensureBudgetCarried() }
        runCatching { family.tick() }
        runCatching { notifications.run() }
        val last = settings.current().lastSyncAt ?: 0
        if (syncNow || System.currentTimeMillis() - last > 15 * 60_000L) runCatching { sync.sync() }
        clock.pulse()
    }
}
