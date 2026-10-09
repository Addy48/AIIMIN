package aiimin.core.data.ai

import aiimin.core.data.core.DayClock
import aiimin.core.data.core.EventLogger
import aiimin.core.data.device.DeviceRepository
import aiimin.core.data.life.LifeRepository
import aiimin.core.data.money.Ledger
import aiimin.core.data.money.MoneyRepository
import aiimin.core.data.notes.NoteRepository
import aiimin.core.data.plan.CalendarRepository
import aiimin.core.data.plan.FocusRepository
import aiimin.core.data.plan.MinimumRepository
import aiimin.core.data.plan.TaskRepository
import aiimin.core.data.settings.SettingsStore
import aiimin.core.data.util.AppJson
import aiimin.core.data.util.Dates
import aiimin.core.data.util.Money
import aiimin.core.data.util.newId
import aiimin.core.data.vault.VaultRepository
import aiimin.core.database.ChatDao
import aiimin.core.database.ChatMessageEntity
import aiimin.core.database.ChatThreadEntity
import aiimin.core.database.FamilyDao
import aiimin.core.database.TaskDao
import aiimin.core.engine.Signals
import aiimin.core.engine.Tier
import aiimin.core.nlp.AiDecision
import aiimin.core.nlp.AiModule
import aiimin.core.nlp.AiScope
import aiimin.core.nlp.Assistant
import aiimin.core.nlp.Proposal
import aiimin.core.network.AiiminApi
import aiimin.core.network.ApiAuth
import aiimin.core.network.ChatMessageDto
import aiimin.core.network.ChatRequest
import java.time.LocalDate
import java.time.LocalTime
import java.time.YearMonth
import java.time.temporal.ChronoUnit
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.builtins.ListSerializer

/** Something the assistant can do, once you approve it. */
@Serializable
sealed class Action {
    abstract val label: String

    @Serializable @SerialName("expense")
    data class Expense(val title: String, val paise: Long, val category: String, val day: String) : Action() {
        override val label get() = "Expense · ${Money.format(paise)} · $category"
    }

    @Serializable @SerialName("income")
    data class Income(val title: String, val paise: Long, val category: String, val day: String) : Action() {
        override val label get() = "Income · ${Money.format(paise)}"
    }

    @Serializable @SerialName("task")
    data class Task(val title: String, val day: String, val time: String? = null) : Action() {
        override val label get() = "Task · " + Dates.relative(LocalDate.parse(day), LocalDate.now()) + (time?.let { " · " + Dates.clock(it) } ?: "")
    }

    @Serializable @SerialName("event")
    data class Event(val title: String, val date: String, val time: String, val minutes: Int = 30) : Action() {
        override val label get() = "Calendar · " + Dates.relative(LocalDate.parse(date), LocalDate.now()) + " · " + Dates.clock(time)
    }

    @Serializable @SerialName("note")
    data class Note(val title: String, val body: String) : Action() {
        override val label get() = "Note"
    }

    @Serializable @SerialName("minimum")
    data class TickMinimum(val minimumId: String, val name: String) : Action() {
        override val label get() = "Minimum kept · $name"
    }

    @Serializable @SerialName("focus")
    data class StartFocus(val minutes: Int, val title: String) : Action() {
        override val label get() = "Focus · $minutes min"
    }

    @Serializable @SerialName("family")
    data class FamilyTask(val personId: String, val personName: String, val title: String, val day: String) : Action() {
        override val label get() = "Family task · for $personName"
    }

    val headline: String get() = when (this) {
        is Expense -> title
        is Income -> title
        is Task -> title
        is Event -> title
        is Note -> title
        is TickMinimum -> name
        is StartFocus -> title
        is FamilyTask -> title
    }
}

/** A tappable citation: opens the exact item. */
@Serializable
data class Source(val type: String, val id: String, val label: String)

data class ChatContext(val module: AiModule? = null, val docId: String? = null, val personId: String? = null, val label: String? = null)

@Singleton
class AssistantRepository @Inject constructor(
    private val chat: ChatDao,
    private val settings: SettingsStore,
    private val clock: DayClock,
    private val log: EventLogger,
    private val tasks: TaskRepository,
    private val taskDao: TaskDao,
    private val calendar: CalendarRepository,
    private val money: MoneyRepository,
    private val notes: NoteRepository,
    private val minimums: MinimumRepository,
    private val focus: FocusRepository,
    private val vault: VaultRepository,
    private val family: FamilyDao,
    private val life: LifeRepository,
    private val device: DeviceRepository,
    private val api: AiiminApi,
) {
    private val actionList = ListSerializer(Action.serializer())
    private val sourceList = ListSerializer(Source.serializer())
    private val strings = ListSerializer(kotlinx.serialization.serializer<String>())

    val threads: Flow<List<ChatThreadEntity>> = chat.threads()
    fun messages(threadId: String) = chat.messages(threadId)

    fun actions(m: ChatMessageEntity): List<Action> = runCatching { AppJson.decodeFromString(actionList, m.proposals) }.getOrDefault(emptyList())
    fun sources(m: ChatMessageEntity): List<Source> = runCatching { AppJson.decodeFromString(sourceList, m.sources) }.getOrDefault(emptyList())
    fun followups(m: ChatMessageEntity): List<String> = runCatching { AppJson.decodeFromString(strings, m.followups) }.getOrDefault(emptyList())
    fun saw(m: ChatMessageEntity): List<String> = runCatching { AppJson.decodeFromString(strings, m.saw) }.getOrDefault(emptyList())

    suspend fun newThread(title: String = "New conversation"): String {
        val id = newId()
        val now = System.currentTimeMillis()
        chat.upsertThread(ChatThreadEntity(id, title, now, now))
        return id
    }

    suspend fun deleteThread(id: String) {
        chat.deleteMessages(id)
        chat.deleteThread(id)
    }

    suspend fun rename(id: String, title: String) {
        threads.first().firstOrNull { it.id == id }?.let { chat.upsertThread(it.copy(title = title)) }
    }

    /** Time-of-day starters for the empty state. */
    suspend fun starters(): List<String> {
        val h = LocalTime.now(clock.zone).hour
        val expiring = vault.expiring(30).isNotEmpty()
        return buildList {
            if (h < 12) add("Plan my day") else if (h < 17) add("What's left today?") else add("Debrief my day")
            add("Spent 250 on lunch and 120 on auto")
            if (expiring) add("What's expiring soon?") else add("How much can I safely spend today?")
            add("Why is my score where it is?")
        }
    }

    /** One turn: your message, then the assistant's reply (proposal, refusal or answer). */
    suspend fun send(threadId: String, text: String, ctx: ChatContext? = null) {
        val now = System.currentTimeMillis()
        chat.upsertMessage(ChatMessageEntity(newId(), threadId, "user", text.trim(), createdAt = now))
        val s = settings.current()
        val scope = AiScope(s.aiScope)
        val today = clock.today()
        val reply: Reply = when (val d = Assistant.decide(text, scope, today)) {
            is AiDecision.Propose -> {
                val actions = enrich(d.proposals.mapNotNull { toAction(it, today) } + extraActions(text))
                Reply(
                    "Here's what I'd do. Nothing changes until you apply it.",
                    actions = actions.distinctBy { it.label + it.headline },
                    saw = listOf("Your message only"),
                    followups = listOf("What's left today?", "How much have I spent this month?"),
                )
            }
            is AiDecision.ScopeBlocked -> Reply(
                if (d.module == AiModule.JOURNAL) "Your journal is private, and the assistant can't read it. You can change that in AI settings." else
                    "That needs your ${d.module.label}, which is switched off for the assistant. You can switch it on in AI settings.",
                saw = listOf("Nothing — that area is off"),
                followups = listOf("Open AI settings"),
            )
            is AiDecision.Answer -> {
                val extra = extraActions(text)
                if (extra.isNotEmpty()) {
                    Reply("Here's what I'd do. Nothing changes until you apply it.", actions = extra, saw = listOf("Your message only"))
                } else {
                    val local = answer(text, ctx?.module ?: d.module, today)
                    if (s.aiSmart && ApiAuth.isSignedIn) cloud(threadId, text, d.module, scope, local) ?: local else local
                }
            }
        }
        chat.upsertMessage(
            ChatMessageEntity(
                newId(), threadId, "assistant", reply.text,
                proposals = AppJson.encodeToString(actionList, reply.actions),
                proposalState = if (reply.actions.isNotEmpty()) "proposed" else null,
                saw = AppJson.encodeToString(strings, reply.saw),
                sources = AppJson.encodeToString(sourceList, reply.sources),
                followups = AppJson.encodeToString(strings, reply.followups),
                createdAt = System.currentTimeMillis(),
            ),
        )
        threads.first().firstOrNull { it.id == threadId }?.let {
            chat.upsertThread(it.copy(title = if (it.title == "New conversation") text.take(48) else it.title, updatedAt = System.currentTimeMillis()))
        }
        log.log("ai.turn", "chat", threadId, mapOf("proposed" to reply.actions.size, "saw" to reply.saw.size), Tier.C, "ai")
    }

    private data class Reply(
        val text: String,
        val actions: List<Action> = emptyList(),
        val sources: List<Source> = emptyList(),
        val saw: List<String> = emptyList(),
        val followups: List<String> = emptyList(),
    )

    private fun toAction(p: Proposal, today: LocalDate): Action? = when (p) {
        is Proposal.Expense -> Action.Expense(p.title, p.amount * 100, p.category, today.toString())
        is Proposal.Income -> Action.Income(p.title, p.amount * 100, p.category, today.toString())
        is Proposal.Task -> Action.Task(p.title, p.day.toString(), p.time24)
        is Proposal.CalendarBlock -> Action.Event(p.title, p.date.toString(), p.time24)
        is Proposal.Note -> Action.Note(p.title, p.body)
    }

    /** "remind Mom about the bill" → a task for Mom, not for you. */
    private suspend fun enrich(actions: List<Action>): List<Action> {
        val people = family.allNow().filter { it.id != "me" }
        return actions.map { a ->
            val title = (a as? Action.Task)?.title ?: return@map a
            val who = people.firstOrNull { p -> Regex("\\b${Regex.escape(p.name.lowercase())}\\b").containsMatchIn(title.lowercase()) } ?: return@map a
            Action.FamilyTask(who.id, who.name, title.replace(Regex("(?i)^(remind\\s+)?${Regex.escape(who.name)}\\s+(to|about)\\s+"), "").replaceFirstChar { it.uppercase() }, a.day)
        }
    }

    /** Logger intents beyond the parser: ticking a minimum by name, starting focus. */
    private suspend fun extraActions(text: String): List<Action> {
        val t = text.lowercase()
        val out = mutableListOf<Action>()
        val doneVerb = Regex("\\b(did|done|finished|completed|kept|went for|had my|ticked)\\b").containsMatchIn(t)
        if (doneVerb) {
            minimums.active().forEach { m ->
                val words = m.name.lowercase().split(Regex("\\W+")).filter { it.length > 3 }
                if (words.isNotEmpty() && words.any { t.contains(it) }) out += Action.TickMinimum(m.id, m.name)
            }
        }
        Regex("\\b(?:start|begin)\\s+(?:an?\\s+)?(\\d{1,3})\\s*(?:-|\\s)?\\s*min(?:ute)?s?\\s+focus(?:\\s+on\\s+(.+))?").find(t)?.let { m ->
            out += Action.StartFocus(m.groupValues[1].toInt().coerceIn(5, 180), m.groupValues.getOrNull(2)?.trim()?.ifBlank { null }?.replaceFirstChar { it.uppercase() } ?: "Focus")
        } ?: Regex("\\bfocus\\s+(?:for\\s+)?(\\d{1,3})\\s*min").find(t)?.let { m ->
            out += Action.StartFocus(m.groupValues[1].toInt().coerceIn(5, 180), "Focus")
        }
        return out
    }

    // ------------------------------------------------------------- apply / undo

    /** Carry out approved actions; returns what was created (for Undo). */
    suspend fun execute(list: List<Action>, source: String = "ai"): List<Source> = list.map { a ->
        when (a) {
            is Action.Expense -> Source("txn", money.add(a.paise, "out", a.title, a.category, Ledger.PERSONAL, day = LocalDate.parse(a.day), source = source), a.title)
            is Action.Income -> Source("txn", money.add(a.paise, "in", a.title, a.category, Ledger.PERSONAL, day = LocalDate.parse(a.day), source = source), a.title)
            is Action.Task -> Source("task", tasks.create(a.title, LocalDate.parse(a.day), a.time, source = source), a.title)
            is Action.Event -> {
                val start = LocalDate.parse(a.date).atTime(LocalTime.parse(a.time)).atZone(clock.zone).toInstant()
                Source("event", calendar.create(a.title, start, start.plusSeconds(a.minutes * 60L)), a.title)
            }
            is Action.Note -> Source("note", notes.save(null, a.title, a.body), a.title)
            is Action.TickMinimum -> {
                minimums.toggle(a.minimumId)
                Source("min", a.minimumId, a.name)
            }
            is Action.StartFocus -> {
                focus.start(a.title, a.minutes)
                Source("focus", "active", a.title)
            }
            is Action.FamilyTask -> Source("task", tasks.create(a.title, LocalDate.parse(a.day), assignee = a.personId, source = source), a.title)
        }
    }

    /** Reverse what [execute] created. */
    suspend fun revert(created: List<Source>) = created.forEach { s ->
        when (s.type) {
            "txn" -> money.delete(s.id)
            "task" -> tasks.delete(s.id)
            "event" -> calendar.delete(s.id)
            "note" -> notes.delete(s.id)
            "min" -> minimums.toggle(s.id)
            "focus" -> focus.discard()
        }
    }

    /**
     * The ＋ sheet: what this line would become, without a chat. Multi-item
     * lines split; anything else falls back to the single best guess.
     * Journal and mood lines return empty — the caller opens the journal.
     */
    suspend fun preview(text: String): List<Action> {
        val t = text.trim()
        if (t.isEmpty()) return emptyList()
        val today = clock.today()
        val proposed = enrich(Assistant.proposalsFrom(t, today).mapNotNull { toAction(it, today) } + extraActions(t))
        if (proposed.isNotEmpty()) return proposed.distinctBy { it.label + it.headline }
        val c = aiimin.core.nlp.CaptureParser.parse(t)
        val day = (if (c.dayWord == "tomorrow") today.plusDays(1) else today).toString()
        return when (c.type) {
            aiimin.core.nlp.CaptureType.EXPENSE -> listOf(Action.Expense(c.label, c.amount * 100, c.category ?: "Other", today.toString()))
            aiimin.core.nlp.CaptureType.INCOME -> listOf(Action.Income(c.label, c.amount * 100, c.category ?: "Other income", today.toString()))
            aiimin.core.nlp.CaptureType.TASK, aiimin.core.nlp.CaptureType.HABIT -> listOf(Action.Task(c.label.ifBlank { t }, day, c.time24))
            aiimin.core.nlp.CaptureType.JOURNAL -> emptyList()
            else -> listOf(Action.Note(c.label.ifBlank { t.take(60) }, t))
        }
    }

    suspend fun apply(messageId: String, only: Set<Int>? = null): Int {
        val m = chat.message(messageId) ?: return 0
        if (m.proposalState != "proposed") return 0
        val created = execute(actions(m).filterIndexed { i, _ -> only == null || i in only })
        chat.upsertMessage(m.copy(proposalState = "applied", sources = AppJson.encodeToString(sourceList, created)))
        log.log("ai.apply", "chat", messageId, mapOf("n" to created.size), Tier.C, "ai")
        return created.size
    }

    suspend fun undo(messageId: String) {
        val m = chat.message(messageId) ?: return
        if (m.proposalState != "applied") return
        revert(sources(m))
        chat.upsertMessage(m.copy(proposalState = "undone"))
        log.log("ai.undo", "chat", messageId, tier = Tier.C, source = "ai")
    }

    suspend fun discard(messageId: String) {
        chat.message(messageId)?.let { chat.upsertMessage(it.copy(proposalState = "discarded")) }
    }

    /** Replace a proposed action after an inline edit. */
    suspend fun editAction(messageId: String, index: Int, action: Action) {
        val m = chat.message(messageId) ?: return
        val list = actions(m).toMutableList()
        if (index !in list.indices) return
        list[index] = action
        chat.upsertMessage(m.copy(proposals = AppJson.encodeToString(actionList, list)))
    }

    // ------------------------------------------------------------- local answers

    private suspend fun answer(q: String, module: AiModule, today: LocalDate): Reply {
        val s = q.lowercase()
        return when {
            module == AiModule.VAULT -> vaultAnswer(s, today)
            module == AiModule.MONEY -> moneyAnswer(s, today)
            module == AiModule.CALENDAR -> calendarAnswer(s, today)
            module == AiModule.NOTES -> notesAnswer(s)
            module == AiModule.FAMILY -> familyAnswer()
            Regex("score|battery|streak|why").containsMatchIn(s) -> scoreAnswer()
            Regex("step|walk|screen|phone|sleep|unlock|app").containsMatchIn(s) -> bodyAnswer(s, today)
            Regex("plan my day|debrief|summary|today").containsMatchIn(s) -> dayAnswer(today, debrief = "debrief" in s)
            else -> dayAnswer(today, debrief = false)
        }
    }

    private suspend fun dayAnswer(today: LocalDate, debrief: Boolean): Reply {
        val list = tasks.forDay(today).first().filter { it.assignee == null }
        val open = list.filter { !it.done }
        val done = list.count { it.done }
        val v = life.compute()
        val m = v.today.minimums
        val sources = open.take(4).map { Source("task", it.id, it.title) }
        val text = buildString {
            if (debrief) {
                append("Today you finished $done of ${list.size} tasks and kept ${m.kept} of ${m.planned} minimums.")
                v.today.value(Signals.FOCUS)?.takeIf { it > 0 }?.let { append(" Focus: ${Dates.minutes(it.toLong())}.") }
                if (open.isNotEmpty()) append(" ${open.size} open task${if (open.size == 1) "" else "s"} will roll to tomorrow quietly.")
            } else {
                if (open.isEmpty()) append("Nothing open on today's plan.") else append("${open.size} open today. Start with “${open.first().title}”.")
                if (m.planned > m.kept) append(" ${m.planned - m.kept} minimum${if (m.planned - m.kept == 1) "" else "s"} left.")
                v.nudges.firstOrNull()?.let { append(" Biggest move right now: ${it.label.lowercase()} (+${"%.1f".format(it.gain)} today).") }
            }
        }
        return Reply(text, sources = sources, saw = listOf("Today's tasks", "Today's minimums", "Life Score inputs"), followups = listOf("Start 25 min focus", "Debrief my day"))
    }

    private suspend fun moneyAnswer(s: String, today: LocalDate): Reply {
        val mm = money.month(YearMonth.from(today), Ledger.PERSONAL, today).first()
        val cat = mm.byCategory.firstOrNull { s.contains(it.category.lowercase()) }
        val text = when {
            cat != null -> "${Money.format(cat.paise)} on ${cat.category} this month, across ${cat.count} payment${if (cat.count == 1) "" else "s"}."
            "safe" in s || "can i" in s -> mm.perDay?.let { "You can spend about ${Money.format(it)} a day for the rest of the month and stay on plan." }
                ?: "Set a monthly plan in Money and I'll tell you a safe daily amount."
            "today" in s -> "${Money.format(mm.byDay.getOrElse(today.dayOfMonth - 1) { 0 })} spent today."
            else -> "This month: ${Money.format(mm.spent)} spent" + (mm.budget?.let { " of ${Money.format(it.totalPaise)}" } ?: "") +
                ". Top: " + mm.byCategory.take(3).joinToString { "${it.category} ${Money.short(it.paise)}" } + "."
        }
        return Reply(text, sources = mm.txns.take(3).map { Source("txn", it.id, it.title) }, saw = listOf("Personal ledger, this month"), followups = listOf("Where is my money going?", "How much can I safely spend today?"))
    }

    private suspend fun calendarAnswer(s: String, today: LocalDate): Reply {
        val day = if ("tomorrow" in s) today.plusDays(1) else today
        val events = calendar.forDay(day).first()
        val text = if (events.isEmpty()) "Nothing on the calendar ${Dates.relative(day, today).lowercase()}." else
            events.joinToString("\n") { e -> (if (e.allDay) "All day" else Dates.clock(java.time.Instant.ofEpochMilli(e.startAt).atZone(clock.zone).toLocalTime())) + " · " + e.title }
        return Reply(text, sources = events.take(4).map { Source("event", it.id, it.title) }, saw = listOf("Calendar, ${Dates.relative(day, today).lowercase()}"))
    }

    private suspend fun vaultAnswer(s: String, today: LocalDate): Reply {
        val visible = vault.visible.first().filter { !it.doc.sensitive }
        if ("expir" in s || "renew" in s && visible.none { s.contains(it.doc.title.lowercase().split(" ").first()) }) {
            val soon = visible.filter { it.doc.expires != null }.sortedBy { it.doc.expires }.filter { ChronoUnit.DAYS.between(today, LocalDate.parse(it.doc.expires)) in -30..120 }
            val text = if (soon.isEmpty()) "Nothing in your vault expires in the next four months." else soon.take(5).joinToString("\n") {
                "${it.doc.title}: ${Dates.short(LocalDate.parse(it.doc.expires))} (${ChronoUnit.DAYS.between(today, LocalDate.parse(it.doc.expires))} days)"
            }
            return Reply(text, sources = soon.take(5).map { Source("doc", it.doc.id, it.doc.title) }, saw = listOf("Vault: titles and dates (no sensitive documents)"), followups = listOf("Set renewal tasks"))
        }
        val words = s.split(Regex("\\W+")).filter { it.length > 2 && it !in STOP }
        val scored = visible.map { dv ->
            val hay = (dv.doc.title + " " + dv.doc.category + " " + dv.ownerName + " " + dv.doc.text.take(4000)).lowercase()
            dv to words.count { hay.contains(it) }
        }.filter { it.second > 0 }.sortedByDescending { it.second }
        val top = scored.firstOrNull()?.first ?: return Reply("I couldn't find that in your vault.", saw = listOf("Vault titles and text"))
        val parts = buildList {
            top.doc.expires?.let { add("expires ${Dates.short(LocalDate.parse(it))} (${ChronoUnit.DAYS.between(today, LocalDate.parse(it))} days)") }
            top.doc.number?.let { add("number $it") }
            top.doc.vehicle?.let { add("vehicle $it") }
        }
        val text = "${top.doc.title} (${top.ownerName}, ${top.doc.category})" + if (parts.isEmpty()) "." else ": " + parts.joinToString(", ") + "."
        return Reply(text, sources = scored.take(3).map { Source("doc", it.first.doc.id, it.first.doc.title) }, saw = listOf("Vault: ${scored.size} matching documents"))
    }

    private suspend fun notesAnswer(s: String): Reply {
        val words = s.split(Regex("\\W+")).filter { it.length > 3 && it !in STOP }
        val hits = words.flatMap { notes.search(it) }.distinctBy { it.id }.take(5)
        val text = if (hits.isEmpty()) "No notes match that." else "Found ${hits.size} note${if (hits.size == 1) "" else "s"}: " + hits.joinToString { "“${it.title}”" } + "."
        return Reply(text, sources = hits.map { Source("note", it.id, it.title) }, saw = listOf("Notes matching your words"))
    }

    private suspend fun familyAnswer(): Reply {
        val people = family.allNow().associateBy { it.id }
        val open = taskDao.family().first().filter { it.assignee != "me" }
        val text = if (open.isEmpty()) "No open family tasks." else open.take(6).joinToString("\n") { "${people[it.assignee]?.name ?: "Someone"}: ${it.title}" }
        return Reply(text, sources = open.take(4).map { Source("task", it.id, it.title) }, saw = listOf("Family tasks (shared items only)"))
    }

    private suspend fun scoreAnswer(): Reply {
        val v = life.compute()
        val r = v.readout
        val text = buildString {
            if (r.score == null) append("Still calibrating — ${r.calibrating.size} signals need more days before there's a fair score.")
            else append("Life Score ${r.score} (${r.band.label}). ")
            val up = r.contributors.filter { it.points > 0 }.take(2)
            val down = r.contributors.filter { it.points < 0 }.takeLast(2)
            if (up.isNotEmpty()) append(" Lifting it: " + up.joinToString { "${name(it.signal, v)} +${it.points}" } + ".")
            if (down.isNotEmpty()) append(" Holding it back: " + down.joinToString { "${name(it.signal, v)} ${it.points}" } + ".")
            append(" Battery ${r.battery.value}%, streak ${r.streak.current} days.")
        }
        return Reply(text, sources = listOf(Source("score", "score", "Life Score")), saw = listOf("Your own history (never compared with anyone)"), followups = listOf("What would move it today?"))
    }

    private suspend fun bodyAnswer(s: String, today: LocalDate): Reply {
        val d = device.observe(today).first()
        val text = when {
            "sleep" in s -> d?.sleepMin?.let { "Last night: ${Dates.minutes(it.toLong())} of sleep." } ?: "No sleep data yet — connect Health Connect in Me → Sensors."
            "step" in s || "walk" in s -> d?.steps?.let { "%,d steps so far today.".format(it) } ?: "Steps aren't connected yet — Me → Sensors."
            else -> d?.screenMs?.let { ms ->
                val apps = DeviceRepository.apps(d).take(3).joinToString { "${it.label} ${Dates.minutes(it.ms / 60_000)}" }
                "Screen time today: ${Dates.minutes(ms / 60_000)}${d.unlocks?.let { " across $it unlocks" } ?: ""}. Top: $apps."
            } ?: "Screen time needs Usage access — Me → Sensors."
        }
        return Reply(text, sources = listOf(Source("device", today.toString(), "Today's phone data")), saw = listOf("Phone measurements for today"))
    }

    private fun name(key: String, v: aiimin.core.data.life.LifeView) = v.intentions.def(key)?.name ?: key

    // ------------------------------------------------------------- smart mode

    /** Sends only in-scope data. Falls back to the local answer on any failure. */
    private suspend fun cloud(threadId: String, q: String, module: AiModule, scope: AiScope, local: Reply): Reply? = runCatching {
        val today = clock.today()
        val packet = buildString {
            appendLine("Date: ${Dates.long(today)}")
            if (AiModule.TASKS in scope) appendLine("Today's tasks: " + tasks.forDay(today).first().filter { it.assignee == null }.joinToString { (if (it.done) "[x] " else "[ ] ") + it.title })
            if (AiModule.MONEY in scope) money.month(YearMonth.from(today), Ledger.PERSONAL, today).first().let { appendLine("Money this month: spent ${Money.format(it.spent)}" + (it.budget?.let { b -> " of ${Money.format(b.totalPaise)}" } ?: "")) }
            if (AiModule.CALENDAR in scope) appendLine("Today's calendar: " + calendar.forDay(today).first().joinToString { it.title })
            appendLine("Local note: ${local.text}")
        }
        val history = chat.messages(threadId).first().takeLast(8).map { ChatMessageDto(if (it.role == "user") "user" else "assistant", it.text) }
        val res = api.chat(
            ChatRequest(
                messages = history.ifEmpty { listOf(ChatMessageDto("user", q)) },
                systemPrompt = "You are the AIIMIN assistant. Answer briefly and concretely using only the data given. " +
                    "Never invent numbers. You cannot change data; suggest the user ask you to add or log things.\n$packet",
            ),
        )
        res.text?.takeIf { it.isNotBlank() }?.let { local.copy(text = it.trim(), saw = local.saw + "Sent to aiimin.in: ${module.label} summary") }
    }.getOrNull()

    private companion object {
        val STOP = setOf("when", "does", "what", "the", "my", "is", "for", "and", "dad", "mom", "expire", "expires", "about", "show", "find", "notes", "note", "where")
    }
}
