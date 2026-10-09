package aiimin.feature.notes

import aiimin.core.data.day.DayRepository
import aiimin.core.data.notes.JournalEntry
import aiimin.core.data.notes.JournalRepository
import aiimin.core.data.notes.JournalSave
import aiimin.core.data.notes.NoteRepository
import aiimin.core.data.settings.Codecs
import aiimin.core.data.util.Dates
import aiimin.core.database.NoteEntity
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppIconButton
import aiimin.designsystem.component.AppTextField
import aiimin.designsystem.component.EmptyState
import aiimin.designsystem.component.Hairline
import aiimin.designsystem.component.Pill
import aiimin.designsystem.component.PillRow
import aiimin.designsystem.component.SectionHeader
import aiimin.designsystem.component.Tag
import aiimin.designsystem.component.TopBar
import aiimin.designsystem.component.rememberVoiceInput
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.LocalToaster
import aiimin.designsystem.nav.Route
import aiimin.designsystem.theme.Aiimin
import aiimin.designsystem.theme.Shapes
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import java.time.LocalDate
import javax.inject.Inject
import kotlinx.coroutines.NonCancellable
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

// =================================================================== view models

@HiltViewModel
class NotesViewModel @Inject constructor(private val notes: NoteRepository) : ViewModel() {
    val query = MutableStateFlow("")
    val tag = MutableStateFlow<String?>(null)
    val all = notes.all().stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)
    val shown = combine(notes.all(), query, tag) { list, q, t ->
        list.filter { n ->
            (q.isBlank() || n.title.contains(q, true) || n.body.contains(q, true)) && (t == null || t in Codecs.decodeList(n.tags))
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

    suspend fun delete(id: String) = notes.delete(id)
    fun restore(n: NoteEntity) = viewModelScope.launch { notes.restore(n) }
}

@HiltViewModel
class NoteViewModel @Inject constructor(private val notes: NoteRepository) : ViewModel() {
    var id: String? = null
        private set
    val note = MutableStateFlow<NoteEntity?>(null)
    val backlinks = MutableStateFlow<List<NoteEntity>>(emptyList())
    private var loaded = false

    fun load(noteId: String?) {
        if (loaded) return
        loaded = true
        id = noteId
        viewModelScope.launch {
            note.value = noteId?.let { notes.get(it) }
            note.value?.let { backlinks.value = notes.backlinks(it.title).filter { b -> b.id != it.id } }
        }
    }

    fun links(body: String) = notes.links(body)
    suspend fun byTitle(t: String) = notes.byTitle(t)

    /** Autosave on leave; empty new notes are not kept. */
    suspend fun save(title: String, body: String, pinned: Boolean) {
        if (title.isBlank() && body.isBlank()) return
        val existing = note.value
        if (existing != null && existing.title == title && existing.body == body && existing.pinned == pinned) return
        id = notes.save(id, title, body, pinned)
        note.value = notes.get(id!!)
    }

    suspend fun delete() = id?.let { notes.delete(it) }
}

@HiltViewModel
class JournalViewModel @Inject constructor(private val journal: JournalRepository, private val days: DayRepository) : ViewModel() {
    val entries = journal.entries.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)
    val yesterdayOpen = MutableStateFlow(false)

    init {
        viewModelScope.launch { yesterdayOpen.value = days.yesterdayOpen() }
    }

    fun quality(text: String) = journal.quality(text, emptyList())
    suspend fun save(text: String, mood: Int?, tags: List<String>, editId: String?, yesterday: Boolean): JournalSave = journal.save(text, mood, tags, editId, yesterday)
    fun delete(id: String) = viewModelScope.launch { journal.delete(id) }
}

// =================================================================== notes

@Composable
fun NotesScreen(vm: NotesViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val all by vm.all.collectAsStateWithLifecycle()
    val shown by vm.shown.collectAsStateWithLifecycle()
    var q by remember { mutableStateOf(vm.query.value) }
    LaunchedEffect(q) { vm.query.value = q }
    val tag by vm.tag.collectAsStateWithLifecycle()
    val c = Aiimin.colors
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Notes", onBack = { nav.back() }) { AppIconButton(AppIcons.Pencil, "New note", { nav.open(Route.Note()) }) }
        val list = all
        if (list != null && list.isEmpty()) {
            EmptyState(AppIcons.Note, "No notes yet", "Write anything. Link notes with [[Title]] and tag with #tags — the links connect themselves.", action = "New note", onAction = { nav.open(Route.Note()) })
            return@Column
        }
        AppTextField(q, { q = it }, placeholder = "Search notes", leading = AppIcons.Search, modifier = Modifier.padding(horizontal = Aiimin.space.gutter))
        val tags = list.orEmpty().flatMap { Codecs.decodeList(it.tags) }.groupingBy { it }.eachCount().entries.sortedByDescending { it.value }.take(12)
        if (tags.isNotEmpty()) Box(Modifier.padding(horizontal = Aiimin.space.gutter)) {
            PillRow { tags.forEach { (t, n) -> Pill("#$t", tag == t, { vm.tag.value = if (tag == t) null else t }, count = n) } }
        }
        LazyColumn(contentPadding = PaddingValues(bottom = 40.dp)) {
            items(shown, key = { it.id }) { n ->
                Column(Modifier.fillMaxWidth().clickable { nav.open(Route.Note(n.id)) }.padding(horizontal = Aiimin.space.gutter, vertical = 12.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        if (n.pinned) Icon(AppIcons.PushPin, "Pinned", tint = c.accent, modifier = Modifier.size(14.dp).padding(end = 4.dp))
                        Text(n.title, style = Aiimin.type.bodyStrong, modifier = Modifier.weight(1f), maxLines = 1)
                        Text(Dates.relative(java.time.Instant.ofEpochMilli(n.updatedAt).atZone(java.time.ZoneId.systemDefault()).toLocalDate(), LocalDate.now()), style = Aiimin.type.caption)
                    }
                    Text(n.body.replace('\n', ' ').take(140), style = Aiimin.type.caption, maxLines = 2)
                }
                Hairline(Modifier.padding(horizontal = Aiimin.space.gutter))
            }
        }
    }
}

@Composable
fun NoteScreen(id: String?, vm: NoteViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    LaunchedEffect(id) { vm.load(id) }
    val note by vm.note.collectAsStateWithLifecycle()
    val backlinks by vm.backlinks.collectAsStateWithLifecycle()
    val c = Aiimin.colors
    var title by remember(note?.id) { mutableStateOf(note?.title.orEmpty()) }
    var body by remember(note?.id) { mutableStateOf(note?.body.orEmpty()) }
    var pinned by remember(note?.id) { mutableStateOf(note?.pinned ?: false) }
    val latest = rememberUpdatedValues(title, body, pinned)
    DisposableEffect(Unit) {
        // Survives the pop: the ViewModel scope is cancelled as this screen leaves.
        onDispose { kotlinx.coroutines.CoroutineScope(kotlinx.coroutines.Dispatchers.IO + NonCancellable).launch { vm.save(latest.title, latest.body, latest.pinned) } }
    }
    Column(Modifier.fillMaxSize().background(c.base).imePadding()) {
        TopBar("", onBack = { nav.back() }) {
            AppIconButton(AppIcons.PushPin, if (pinned) "Unpin" else "Pin", { pinned = !pinned }, tint = if (pinned) c.accent else c.textMuted)
            AppIconButton(AppIcons.Trash, "Delete note", {
                scope.launch {
                    vm.delete()?.let { toaster.show("Note deleted") }
                    title = ""; body = ""
                    nav.back()
                }
            }, tint = c.textMuted)
        }
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = Aiimin.space.gutter)) {
            Box {
                if (title.isEmpty()) Text("Title", style = Aiimin.type.title.copy(color = c.textFaint))
                BasicTextField(title, { title = it }, textStyle = Aiimin.type.title, cursorBrush = SolidColor(c.accent), modifier = Modifier.fillMaxWidth())
            }
            Spacer(Modifier.height(12.dp))
            Box {
                if (body.isEmpty()) Text("Start writing. [[Another note]] links it; #tag files it.", style = Aiimin.type.body.copy(color = c.textFaint, fontSize = 16.sp))
                BasicTextField(body, { body = it }, textStyle = Aiimin.type.body.copy(fontSize = 16.sp, lineHeight = 26.sp), cursorBrush = SolidColor(c.accent), modifier = Modifier.fillMaxWidth().padding(bottom = 24.dp))
            }
            val links = vm.links(body)
            if (links.isNotEmpty() || backlinks.isNotEmpty()) {
                SectionHeader("Connected")
                PillRow {
                    links.forEach { t ->
                        Pill(t, false, {
                            scope.launch {
                                val target = vm.byTitle(t)
                                if (target != null) nav.open(Route.Note(target.id)) else toaster.show("No note called “$t” yet")
                            }
                        }, icon = AppIcons.Link)
                    }
                    backlinks.forEach { b -> Pill(b.title, false, { nav.open(Route.Note(b.id)) }, icon = AppIcons.ArrowDownLeft) }
                }
                Spacer(Modifier.height(24.dp))
            }
        }
    }
}

private class Latest(var title: String, var body: String, var pinned: Boolean)

@Composable
private fun rememberUpdatedValues(title: String, body: String, pinned: Boolean): Latest {
    val holder = remember { Latest(title, body, pinned) }
    holder.title = title
    holder.body = body
    holder.pinned = pinned
    return holder
}

// =================================================================== journal

private val moodLabels = listOf("Low", "Off", "Okay", "Good", "Great")

@Composable
private fun moodIcon(m: Int) = when (m) {
    1, 2 -> AppIcons.SmileySad
    3 -> AppIcons.SmileyMeh
    else -> AppIcons.Smiley
}

@Composable
fun JournalScreen(vm: JournalViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val entries by vm.entries.collectAsStateWithLifecycle()
    val c = Aiimin.colors
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Journal", onBack = { nav.back() }) { AppIconButton(AppIcons.Pencil, "Write", { nav.open(Route.JournalWrite()) }) }
        Row(Modifier.padding(horizontal = Aiimin.space.gutter)) { Tag("Encrypted on this phone · never visible to anyone else", icon = AppIcons.Lock) }
        val list = entries
        if (list != null && list.isEmpty()) {
            EmptyState(AppIcons.BookOpen, "Nothing written yet", "Forty honest words a day count toward your journal signal. Mood is tracked for you and never scored.", action = "Write today", onAction = { nav.open(Route.JournalWrite()) })
            return@Column
        }
        LazyColumn(contentPadding = PaddingValues(Aiimin.space.gutter)) {
            list.orEmpty().groupBy { it.day }.forEach { (day, l) ->
                item { SectionHeader(Dates.relative(day, LocalDate.now())) }
                items(l, key = { it.id }) { e -> JournalCard(e) { nav.open(Route.JournalWrite(e.id)) } }
            }
        }
    }
}

@Composable
private fun JournalCard(e: JournalEntry, onClick: () -> Unit) {
    val c = Aiimin.colors
    Column(Modifier.fillMaxWidth().padding(vertical = 6.dp).clickable(onClick = onClick)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            e.mood?.let { Icon(moodIcon(it), moodLabels[it - 1], tint = c.textMuted, modifier = Modifier.size(16.dp)); Spacer(Modifier.size(6.dp)) }
            Text("${e.words} words" + if (e.qualityOk) "" else " · short", style = Aiimin.type.caption)
        }
        Text(e.text, style = Aiimin.type.journal.copy(fontSize = 16.sp, lineHeight = 25.sp), maxLines = 4, modifier = Modifier.padding(top = 4.dp))
    }
}

@Composable
fun JournalWriteScreen(id: String?, vm: JournalViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    val entries by vm.entries.collectAsStateWithLifecycle()
    val yesterdayOpen by vm.yesterdayOpen.collectAsStateWithLifecycle()
    val existing = entries?.firstOrNull { it.id == id }
    val c = Aiimin.colors
    var text by remember(existing?.id) { mutableStateOf(existing?.text.orEmpty()) }
    var mood by remember(existing?.id) { mutableStateOf(existing?.mood) }
    var yesterday by remember { mutableStateOf(false) }
    val voice = rememberVoiceInput("Speak your entry", onText = { t -> text = (text.trimEnd() + " " + t).trim() }, onUnavailable = { toaster.show("Speech input isn't available on this phone") })
    val q = vm.quality(text)
    Column(Modifier.fillMaxSize().background(c.base).imePadding()) {
        TopBar(if (existing != null) Dates.short(existing.day) else "Today", onBack = { nav.back() }) {
            AppIconButton(AppIcons.Mic, "Dictate", voice, tint = c.accent)
        }
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = 24.dp)) {
            Text("HOW WAS IT", style = Aiimin.type.eyebrow)
            Row(Modifier.padding(vertical = 8.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                (1..5).forEach { m ->
                    val sel = mood == m
                    Column(
                        Modifier.clip(Shapes.control).border(1.dp, if (sel) c.accent else c.border, Shapes.control).background(if (sel) c.accentSoft else c.base)
                            .clickable { mood = if (sel) null else m }.padding(horizontal = 10.dp, vertical = 8.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                    ) {
                        Icon(moodIcon(m), null, tint = if (sel) c.accent else c.textMuted, modifier = Modifier.size(20.dp))
                        Text(moodLabels[m - 1], style = Aiimin.type.caption.copy(color = if (sel) c.accent else c.textMuted))
                    }
                }
            }
            Text("Mood is for you and your patterns. It never changes your score.", style = Aiimin.type.caption)
            Spacer(Modifier.height(18.dp))
            Box {
                if (text.isEmpty()) Text("What happened, what you noticed, what's next.", style = Aiimin.type.journal.copy(color = c.textFaint))
                BasicTextField(text, { text = it }, textStyle = Aiimin.type.journal, cursorBrush = SolidColor(c.accent), modifier = Modifier.fillMaxWidth().padding(bottom = 24.dp))
            }
        }
        Hairline()
        Row(Modifier.fillMaxWidth().navigationBarsPadding().padding(horizontal = Aiimin.space.gutter, vertical = 10.dp), verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f)) {
                Text("${q.words} words", style = Aiimin.type.label.copy(fontFeatureSettings = "tnum"))
                Text(q.reason ?: "Counts toward today", style = Aiimin.type.caption.copy(color = if (q.ok) c.done else c.textMuted), maxLines = 1)
            }
            if (existing == null && yesterdayOpen) {
                Pill("For yesterday", yesterday, { yesterday = !yesterday })
                Spacer(Modifier.size(8.dp))
            }
            AppButton("Save", {
                scope.launch {
                    val r = vm.save(text, mood, emptyList(), existing?.id, yesterday)
                    toaster.show(if (r.qualityOk) "Saved" + if (r.xp > 0) " · +${r.xp} XP" else "" else "Saved · ${r.reason ?: "short entry"}")
                    nav.back()
                }
            }, compact = true, enabled = text.isNotBlank())
        }
    }
}
