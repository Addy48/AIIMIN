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
class ActivityRepository @Inject constructor(
    private val log: EventLogger,
    private val taskDao: aiimin.core.database.TaskDao,
    private val minimumDao: aiimin.core.database.MinimumDao,
    private val moneyDao: aiimin.core.database.MoneyDao,
    private val noteDao: aiimin.core.database.NoteDao,
    private val vaultDao: aiimin.core.database.VaultDao,
) {
    /** The real activity bus: what you did, from the log, in plain words — and which thing (audit A-032). */
    fun recent(n: Int = 60): Flow<List<ActivityLine>> = log.recent(n * 2).map { list -> list.mapNotNull(::line).take(n).map { named(it) } }

    /** Adds the task, note, payee, document or minimum a row is about. The journal stays unnamed: it is private. */
    private suspend fun named(l: ActivityLine): ActivityLine {
        val id = l.refId ?: return l
        val name = runCatching {
            when {
                l.type.startsWith("task.") -> taskDao.get(id)?.title
                l.type.startsWith("min.") -> minimumDao.get(id)?.name
                l.type == "txn.add" -> moneyDao.get(id)?.let { "${aiimin.core.data.money.payeeLabel(it.title)} ${aiimin.core.data.util.Money.whole(it.amountPaise)}" }
                l.type == "txn.detect" -> (moneyDao.draft(id)?.let { it.title to it.amountPaise } ?: moneyDao.get(id)?.let { it.title to it.amountPaise })
                    ?.let { (t, p) -> "${aiimin.core.data.money.payeeLabel(t)} ${aiimin.core.data.util.Money.whole(p)}" }
                l.type.startsWith("doc.") -> vaultDao.get(id)?.title
                l.type == "note.create" -> noteDao.get(id)?.title
                else -> null
            }
        }.getOrNull()
        return l.copy(text = withName(l.text, name))
    }

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
            "day.settle" -> daySettledText(e.ref?.id)
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

    suspend fun addCustomSignal(name: String, unit: String, domain: String, target: Double, more: Boolean = true): String {
        val key = "c_" + System.currentTimeMillis().toString(36)
        settings.update {
            val def = SignalDef(key, name.trim(), unit.trim().ifBlank { "count" }, domain, Tier.C, "Logged by you")
            it.copy(intentions = it.intentions.copy(customDefs = it.intentions.customDefs + (key to def)).with(key, Intention(if (more) aiimin.core.engine.Direction.MORE else aiimin.core.engine.Direction.LESS, target, 1)))
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
    /** Everything onboarding gathered. Nothing here needs an account. */
    data class SetupInput(
        val name: String,
        /** The age band only; the date of birth itself never reaches storage (PRD 4.7). */
        val ageBand: String?,
        val role: String,
        /** (minimum, tiny version) */
        val mins: List<Pair<String, String>>,
        val battery: BatteryMode,
        val banks: List<String>,
        val primaryBank: String?,
        val cash: Boolean,
        val monthlyPlanRupees: Long?,
    )

    suspend fun complete(i: SetupInput) {
        val preset = RolePreset.byKey(i.role)
        settings.update {
            it.copy(
                name = i.name.trim(), role = i.role, ageBand = i.ageBand,
                batteryMode = preset?.suggestsBattery ?: i.battery,
                batteryModeChangedOn = null,
                intentions = preset?.applyTo(aiimin.core.engine.IntentionSet.default()) ?: it.intentions,
                banks = i.banks, primaryBank = i.primaryBank ?: i.banks.firstOrNull(), cashWallet = i.cash || i.banks.isEmpty(),
            )
        }
        family.ensureSelf(i.name)
        days.ensureToday()
        i.mins.filter { it.first.isNotBlank() }.forEach { (m, tiny) -> minimums.add(m, tiny.ifBlank { "" }, startToday = true) }
        i.monthlyPlanRupees?.takeIf { it > 0 }?.let { money.setBudget(it * 100, 0, emptyMap()) }
        // Last: flipping this swaps the UI to Today.
        settings.update { it.copy(onboarded = true) }
        log.log("onboarding.done", data = mapOf("role" to i.role, "mins" to i.mins.size, "banks" to i.banks.size), tier = Tier.A, source = "system")
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
            // Every kept note; a locked note's text stays locked here (Notes › Save all notes exports it after the screen lock).
            put("notes.md", db.notes().keptNow().joinToString("\n\n---\n\n") { if (it.locked) "# Locked note\n\n(Locked. Export it from Notes › Bring in and save notes.)" else "# ${it.title}\n\n${it.body}" })
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

// ------------------------------------------------------------------ erase

/**
 * "Remove data from this phone": the database, vault files, caches, goals and every setting.
 * What was already synced to aiimin.in is not touched here; that has its own, separate choice.
 */
@Singleton
class DataControlRepository @Inject constructor(
    @ApplicationContext private val context: Context,
    private val db: AppDatabase,
    private val settings: SettingsStore,
) {
    suspend fun eraseThisPhone() = withContext(Dispatchers.IO) {
        runCatching { db.clearAllTables() }
        listOf("vault", "exports").forEach { File(context.filesDir, it).deleteRecursively() }
        context.cacheDir.listFiles()?.forEach { it.deleteRecursively() }
        listOf("goals", "demo", "onboarding_draft", "vault_backup", "replace_undo", "captures").forEach { name -> context.getSharedPreferences(name, Context.MODE_PRIVATE).edit().clear().apply() }
        settings.clearAll()
    }
}

/** D-029: "Day settled: Sun 18 Oct", not the raw ISO date. */
fun daySettledText(isoDay: String?): String =
    isoDay?.let { runCatching { "Day settled: " + aiimin.core.data.util.Dates.short(java.time.LocalDate.parse(it)) }.getOrNull() } ?: "Day settled"

/** "Added a task · Buy milk": the row's words plus what it was about, cut to fit one line. */

fun withName(text: String, name: String?): String {
    val n = name?.trim().orEmpty()
    if (n.isEmpty()) return text
    return "$text · " + if (n.length > 40) n.take(39) + "…" else n
}
