package aiimin.feature.notes

import androidx.compose.foundation.lazy.itemsIndexed
import aiimin.designsystem.component.enterStagger
import androidx.compose.ui.graphics.Color
import kotlin.math.roundToInt
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.layout.width
import kotlinx.coroutines.flow.map
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.input.TransformedText
import androidx.compose.ui.text.input.OffsetMapping
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.input.key.type
import androidx.compose.ui.input.key.onPreviewKeyEvent
import androidx.compose.ui.input.key.key
import androidx.compose.ui.input.key.KeyEventType
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableIntStateOf
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
import aiimin.designsystem.component.AppSheet
import aiimin.designsystem.component.ListRow
import aiimin.designsystem.component.IconTile
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
import androidx.compose.runtime.produceState
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
class NoteViewModel @Inject constructor(private val notes: NoteRepository, private val linkSearch: aiimin.core.data.notes.LinkSearch) : ViewModel() {
    suspend fun findLinks(q: String) = linkSearch.find(q, id)
    suspend fun resolve(title: String) = linkSearch.resolve(title)
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
class JournalViewModel @Inject constructor(private val journal: JournalRepository, private val days: DayRepository, settings: aiimin.core.data.settings.SettingsStore) : ViewModel() {
    val entries = journal.entries.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)
    /** True when the person switched on journal sync (then a plain-text copy goes to aiimin.in). */
    val syncs = settings.settings.map { it.journalSync }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), false)
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
            itemsIndexed(shown, key = { _, it -> it.id }) { i, n ->
                Column(Modifier.fillMaxWidth().enterStagger(i).clickable { nav.open(Route.Note(n.id)) }.padding(horizontal = Aiimin.space.gutter, vertical = 12.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        if (n.pinned) Icon(AppIcons.PushPin, "Pinned", tint = c.accent, modifier = Modifier.size(14.dp).padding(end = 4.dp))
                        Text(n.title, style = Aiimin.type.bodyStrong, modifier = Modifier.weight(1f), maxLines = 1)
                        Text(Dates.relative(java.time.Instant.ofEpochMilli(n.updatedAt).atZone(java.time.ZoneId.systemDefault()).toLocalDate(), LocalDate.now()), style = Aiimin.type.caption)
                    }
                    // D-016: the preview ends with an ellipsis, never mid-word.
                    Text(aiimin.core.data.notes.notePreview(n.body).take(140), style = Aiimin.type.caption, maxLines = 2, overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis)
                }
                Hairline(Modifier.padding(horizontal = Aiimin.space.gutter))
            }
        }
    }
}

private class NLine(val id: Int, val text: String)

private val CHECK = Regex("^- \\[( |x)] ?")

private fun isCheck(t: String) = CHECK.containsMatchIn(t)
private fun isDone(t: String) = t.startsWith("- [x]")
private fun stripCheck(t: String) = t.replace(CHECK, "")

/** Shows [[links]] as chips (brackets hidden) without changing what is stored. */
private class MentionTransform(val bg: Color, val fg: Color) : VisualTransformation {
    override fun filter(text: AnnotatedString): TransformedText {
        val src = text.text
        val removed = mutableListOf<Int>() // original indexes of hidden bracket chars
        val spans = mutableListOf<Pair<Int, Int>>() // original [start, end) of the name
        Regex("\\[\\[([^\\]\\n]+)]]").findAll(src).forEach { m ->
            removed += m.range.first; removed += m.range.first + 1
            removed += m.range.last - 1; removed += m.range.last
            spans += (m.range.first + 2) to (m.range.last - 1)
        }
        val keep = src.indices.filter { it !in removed }
        val out = buildAnnotatedString {
            append(keep.joinToString("") { src[it].toString() })
            spans.forEach { (st, en) ->
                val ts = keep.indexOfFirst { it >= st }.coerceAtLeast(0)
                val te = keep.indexOfLast { it < en } + 1
                if (te > ts) addStyle(SpanStyle(color = fg, background = bg), ts, te)
            }
        }
        val mapping = object : OffsetMapping {
            override fun originalToTransformed(offset: Int) = removed.count { it < offset }.let { offset - it }.coerceIn(0, keep.size)
            override fun transformedToOriginal(offset: Int) = if (offset >= keep.size) src.length else keep[offset.coerceAtLeast(0)]
        }
        return TransformedText(out, mapping)
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
    var nextId by remember(note?.id) { mutableIntStateOf(0) }
    val lines = remember(note?.id) {
        mutableStateListOf<NLine>().also { l ->
            val src = note?.body.orEmpty().split("\n")
            src.forEach { l += NLine(nextId++, it) }
        }
    }
    var pinned by remember(note?.id) { mutableStateOf(note?.pinned ?: false) }
    var focused by remember { mutableIntStateOf(0) }
    val requesters = remember(note?.id) { mutableMapOf<Int, FocusRequester>() }
    var wantFocus by remember { mutableStateOf<Int?>(null) }
    val body = lines.joinToString("\n") { it.text }
    val latest = rememberUpdatedValues(title, body, pinned)
    DisposableEffect(Unit) {
        // Survives the pop: the ViewModel scope is cancelled as this screen leaves.
        onDispose { kotlinx.coroutines.CoroutineScope(kotlinx.coroutines.Dispatchers.IO + NonCancellable).launch { vm.save(latest.title, latest.body, latest.pinned) } }
    }
    LaunchedEffect(wantFocus, lines.size) {
        val w = wantFocus ?: return@LaunchedEffect
        lines.getOrNull(w)?.let { runCatching { requesters.getOrPut(it.id) { FocusRequester() }.requestFocus() } }
        wantFocus = null
    }
    fun setLine(i: Int, t: String) { lines[i] = NLine(lines[i].id, t) }
    fun toggleChecklist() {
        val i = focused.coerceIn(0, lines.lastIndex)
        val t = lines[i].text
        setLine(i, if (isCheck(t)) stripCheck(t) else "- [ ] $t")
    }
    fun insertAtEnd(piece: String) {
        val i = focused.coerceIn(0, lines.lastIndex)
        setLine(i, lines[i].text + piece); wantFocus = i
    }
    var picking by remember { mutableStateOf(false) }
    /** N3: replaces the "[[" just typed on the focused line with the chosen link. */
    fun insertLink(t: String) {
        val i = focused.coerceIn(0, lines.lastIndex)
        val cur = lines[i].text
        val at = cur.lastIndexOf("[[")
        val clean = t.replace("]]", "").replace("[[", "")
        setLine(i, (if (at >= 0) cur.substring(0, at) else cur) + "[[" + clean + "]] ")
        wantFocus = i
    }
    val voice = rememberVoiceInput(onText = { insertAtEnd((if (lines.getOrNull(focused)?.text.orEmpty().isBlank()) "" else " ") + it) }, onUnavailable = { toaster.show("Speech input isn't available on this phone") })
    val hasLinks = Regex("\\[\\[").containsMatchIn(body)
    val transform = remember(c) { MentionTransform(c.linkChip, c.linkChipText) }
    val bodyStyle = Aiimin.type.body.copy(fontSize = 16.sp, lineHeight = 26.sp, color = c.text)

    Column(Modifier.fillMaxSize().background(c.base).imePadding()) {
        TopBar("Note", onBack = { nav.back() }) {
            AppIconButton(AppIcons.PushPin, if (pinned) "Unpin" else "Pin", { pinned = !pinned }, tint = if (pinned) c.accent else c.text)
            AppIconButton(AppIcons.Trash, "Delete note", {
                scope.launch {
                    vm.delete()?.let { toaster.show("Note deleted") }
                    title = ""; lines.clear(); lines += NLine(nextId++, "")
                    nav.back()
                }
            }, tint = c.text)
        }
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = Aiimin.space.gutter)) {
            Text(
                listOfNotNull("Pinned to Today".takeIf { pinned }, "Saved".takeIf { note != null }).joinToString(" · "),
                style = Aiimin.type.body.copy(color = c.textMuted, fontSize = 14.sp),
            )
            Box(Modifier.padding(top = 6.dp)) {
                if (title.isEmpty()) Text("Title", style = Aiimin.type.title.copy(fontSize = 30.sp, lineHeight = 36.sp, color = c.textFaint))
                BasicTextField(title, { title = it.replace("\n", " ") }, textStyle = Aiimin.type.title.copy(fontSize = 30.sp, lineHeight = 36.sp), cursorBrush = SolidColor(c.accent), modifier = Modifier.fillMaxWidth())
            }
            Spacer(Modifier.height(16.dp))
            lines.forEachIndexed { i, line ->
                key(line.id) {
                    val check = isCheck(line.text)
                    val done = isDone(line.text)
                    val text = stripCheck(line.text)
                    val fr = requesters.getOrPut(line.id) { FocusRequester() }
                    Row(Modifier.fillMaxWidth().padding(vertical = if (check) 8.dp else 6.dp), verticalAlignment = Alignment.Top) {
                        if (check) {
                            Box(
                                Modifier.padding(top = 2.dp, end = 14.dp).size(24.dp).clip(RoundedCornerShape(6.dp))
                                    .background(if (done) c.text else Color.Transparent)
                                    .border(1.5.dp, if (done) c.text else c.textFaint, RoundedCornerShape(6.dp))
                                    .clickable { setLine(i, (if (done) "- [ ] " else "- [x] ") + text) },
                                contentAlignment = Alignment.Center,
                            ) { if (done) Icon(AppIcons.Check, "Done", tint = c.base, modifier = Modifier.size(16.dp)) }
                        }
                        Box(Modifier.weight(1f)) {
                            if (text.isEmpty() && lines.size == 1 && i == 0) Text("Start writing. [[Another note]] links it; #tag files it.", style = bodyStyle.copy(color = c.textFaint))
                            BasicTextField(
                                value = text,
                                onValueChange = { v ->
                                    if ('\n' in v) {
                                        val at = v.indexOf('\n')
                                        val before = v.substring(0, at)
                                        val after = v.substring(at + 1).replace("\n", " ")
                                        if (check && before.isEmpty() && after.isEmpty()) {
                                            setLine(i, "") // an empty checklist item ends the list
                                        } else {
                                            setLine(i, (if (check) (if (done) "- [x] " else "- [ ] ") else "") + before)
                                            lines.add(i + 1, NLine(nextId++, (if (check) "- [ ] " else "") + after))
                                            wantFocus = i + 1
                                        }
                                    } else {
                                        setLine(i, (if (check) (if (done) "- [x] " else "- [ ] ") else "") + v)
                                        if (v.endsWith("[[") && !text.endsWith("[[")) picking = true
                                    }
                                },
                                textStyle = bodyStyle.copy(
                                    color = if (done) c.textMuted else c.text,
                                    textDecoration = if (done) androidx.compose.ui.text.style.TextDecoration.LineThrough else null,
                                ),
                                cursorBrush = SolidColor(c.accent),
                                visualTransformation = transform,
                                modifier = Modifier.fillMaxWidth().focusRequester(fr)
                                    .onFocusChanged { if (it.isFocused) focused = i }
                                    .onPreviewKeyEvent { e ->
                                        if (e.type == KeyEventType.KeyDown && e.key == Key.Backspace && text.isEmpty()) {
                                            when {
                                                check -> { setLine(i, ""); true }
                                                i > 0 -> { lines.removeAt(i); wantFocus = i - 1; true }
                                                else -> false
                                            }
                                        } else false
                                    },
                            )
                        }
                    }
                }
            }
            Spacer(Modifier.height(20.dp))
            val links = vm.links(body)
            if (!hasLinks) Box(Modifier.fillMaxWidth().clip(RoundedCornerShape(10.dp)).background(c.raised).padding(16.dp)) {
                Text(
                    buildAnnotatedString {
                        append("Type "); withStyle(SpanStyle(fontWeight = androidx.compose.ui.text.font.FontWeight.Bold)) { append("[[") }
                        append(" to link a task, document, person or payment. Linked items open from here, and show this note back.")
                    },
                    style = Aiimin.type.body.copy(fontSize = 15.sp, lineHeight = 22.sp),
                )
            }
            if (links.isNotEmpty() || backlinks.isNotEmpty()) {
                SectionHeader("Connected")
                PillRow {
                    links.forEach { t ->
                        Pill(t, false, {
                            scope.launch {
                                val target = vm.resolve(t)
                                when (target?.kind) {
                                    "note" -> nav.open(Route.Note(target.id))
                                    "task" -> nav.open(Route.Task(target.id))
                                    "doc" -> nav.open(Route.Doc(target.id))
                                    "person" -> nav.open(Route.Person(target.id))
                                    "txn" -> nav.open(Route.Txn(target.id))
                                    else -> toaster.show("Nothing called “$t” yet")
                                }
                            }
                        }, icon = AppIcons.Link)
                    }
                    backlinks.forEach { b -> Pill(b.title, false, { nav.open(Route.Note(b.id)) }, icon = AppIcons.ArrowDownLeft) }
                }
            }
            Spacer(Modifier.height(24.dp))
        }
        Hairline()
        Row(Modifier.fillMaxWidth().padding(horizontal = Aiimin.space.gutter, vertical = 12.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(Modifier.size(48.dp).clickable { insertAtEnd("[["); picking = true }, contentAlignment = Alignment.Center) { Text("[[", style = Aiimin.type.title.copy(fontSize = 20.sp)) }
            AppIconButton(AppIcons.ListChecks, "Checklist", { toggleChecklist() })
            Spacer(Modifier.weight(1f))
            AppButton("Dictate", { voice() }, icon = AppIcons.Mic)
        }
    }
    if (picking) LinkPicker(vm, onDismiss = { picking = false }) { t -> insertLink(t); picking = false }
}

private fun linkIcon(kind: String) = when (kind) {
    "note" -> AppIcons.Note
    "task" -> AppIcons.CheckSquare
    "doc" -> AppIcons.FileText
    "person" -> AppIcons.UserCircle
    "txn" -> AppIcons.Receipt
    else -> AppIcons.Link
}

/** N3 · Link picker: search notes, tasks, documents, people and payments; picking inserts a link chip. */
@Composable
private fun LinkPicker(vm: NoteViewModel, onDismiss: () -> Unit, onPick: (String) -> Unit) {
    var q by remember { mutableStateOf("") }
    val results by produceState(emptyList<aiimin.core.data.notes.LinkTarget>(), q) { value = vm.findLinks(q) }
    AppSheet(onDismiss, title = "Link to…") {
        AppTextField(q, { q = it }, placeholder = "Search notes, tasks, documents, people, payments", leading = AppIcons.Search, onDone = { if (q.isNotBlank()) onPick(results.firstOrNull()?.title ?: q) })
        Spacer(Modifier.height(8.dp))
        if (results.isEmpty() && q.isNotBlank()) {
            ListRow("Link “${q.trim()}” as a new note", subtitle = "Creates the link now; the note is made when you open it", leading = { IconTile(AppIcons.Plus) }, onClick = { onPick(q.trim()) })
        }
        results.take(12).forEach { r ->
            ListRow(r.title, subtitle = r.subtitle, leading = { IconTile(linkIcon(r.kind)) }, onClick = { onPick(r.title) })
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
    val syncs by vm.syncs.collectAsStateWithLifecycle()
    val c = Aiimin.colors
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Journal", onBack = { nav.back() }) { AppIconButton(AppIcons.Pencil, "Write", { nav.open(Route.JournalWrite()) }) }
        Row(Modifier.padding(horizontal = Aiimin.space.gutter)) {
            Tag(if (syncs) "Encrypted on this phone · a plain-text copy syncs to aiimin.in" else "Private · encrypted on this phone", icon = AppIcons.Lock)
        }
        entries?.let { all ->
            MoodMonth(all, Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 14.dp)) { nav.open(Route.MoodYear) }
        }
        val list = entries
        if (list != null && list.isEmpty()) {
            EmptyState(AppIcons.BookOpen, "Nothing written yet", "Write as much or as little as you like. Mood is kept for you and never scored.", action = "Write today", onAction = { nav.open(Route.JournalWrite()) })
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

/** Mood shade: no entry is an outline; 1 (low) to 5 (great) run from pale to full ink. */
@Composable
private fun moodColor(m: Int?): Color {
    val c = Aiimin.colors
    return if (m == null) Color.Transparent else c.text.copy(alpha = listOf(0.16f, 0.32f, 0.5f, 0.72f, 1f)[(m - 1).coerceIn(0, 4)])
}

/** The day's mood: the last entry with a mood that day. */
private fun moodsByDay(all: List<JournalEntry>): Map<LocalDate, Int?> =
    all.groupBy { it.day }.mapValues { (_, l) -> l.sortedBy { it.createdAt }.lastOrNull { it.mood != null }?.mood }

@Composable
private fun MoodSquare(m: Int?, has: Boolean, size: androidx.compose.ui.unit.Dp, selected: Boolean = false, onClick: (() -> Unit)? = null) {
    val c = Aiimin.colors
    val shape = RoundedCornerShape(3.dp)
    Box(
        Modifier.size(size).clip(shape).background(moodColor(m))
            .border(if (selected) 2.dp else 1.dp, if (selected) c.accent else if (has && m == null) c.textFaint else c.border, shape)
            .then(if (onClick != null) Modifier.clickable(onClick = onClick) else Modifier),
    )
}

/** J1 · this month's mood strip: one square per day. Tap → the year (J3). */
@Composable
private fun MoodMonth(all: List<JournalEntry>, modifier: Modifier, onOpen: () -> Unit) {
    val today = LocalDate.now()
    val ym = java.time.YearMonth.from(today)
    val moods = moodsByDay(all)
    Column(modifier.fillMaxWidth().clickable(onClick = onOpen)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(ym.month.getDisplayName(java.time.format.TextStyle.FULL, java.util.Locale.ENGLISH), style = Aiimin.type.caption, modifier = Modifier.weight(1f))
            Text("Mood year", style = Aiimin.type.label.copy(color = Aiimin.colors.link, fontSize = 13.sp))
        }
        Spacer(Modifier.height(8.dp))
        // D-018: two rows of equal columns, so the second row lines up with the first; the strip as a whole
        // is the tap target (it opens the year).
        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
            (1..ym.lengthOfMonth()).chunked(16).forEach { week ->
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    week.forEach { d ->
                        val day = ym.atDay(d)
                        Box(Modifier.weight(1f).aspectRatio(1f)) { MoodSquare(moods[day], day in moods, 40.dp, selected = day == today) }
                    }
                    repeat(16 - week.size) { Spacer(Modifier.weight(1f)) }
                }
            }
        }
    }
}

/** J3 · Mood year: twelve months of days, a legend in words, tap a day for that entry. */
@Composable
fun MoodYearScreen(vm: JournalViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val c = Aiimin.colors
    val entries by vm.entries.collectAsStateWithLifecycle()
    var year by remember { mutableIntStateOf(LocalDate.now().year) }
    var picked by remember { mutableStateOf<LocalDate?>(null) }
    // The open month belongs to the year on screen (this month in the current year, none in other years).
    var openMonth by remember(year) { mutableStateOf<java.time.YearMonth?>(java.time.YearMonth.now().takeIf { it.year == year }) }
    val all = entries.orEmpty()
    val moods = remember(all) { moodsByDay(all) }
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Mood year", onBack = { nav.back() }) {
            AppIconButton(AppIcons.CaretLeft, "Earlier year", { year-- })
            AppIconButton(AppIcons.CaretRight, "Later year", { if (year < LocalDate.now().year) year++ })
        }
        LazyColumn(contentPadding = PaddingValues(start = Aiimin.space.gutter, end = Aiimin.space.gutter, bottom = 32.dp)) {
            item {
                val inYear = moods.filterKeys { it.year == year }
                val withMood = inYear.values.filterNotNull()
                Text("$year", style = Aiimin.type.title.copy(fontSize = 26.sp))
                Text(
                    if (inYear.isEmpty()) "No entries this year." else "${inYear.size} ${if (inYear.size == 1) "day" else "days"} written" + if (withMood.isNotEmpty()) " · mostly ${moodLabels[(withMood.average().roundToInt() - 1).coerceIn(0, 4)].lowercase()}" else "",
                    style = Aiimin.type.caption,
                )
                Spacer(Modifier.height(10.dp))
                // Legend in words.
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp), verticalAlignment = Alignment.CenterVertically) {
                    (1..5).forEach { m ->
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            MoodSquare(m, true, 12.dp); Spacer(Modifier.width(4.dp)); Text(moodLabels[m - 1], style = Aiimin.type.caption.copy(fontSize = 11.5.sp))
                        }
                    }
                }
                Spacer(Modifier.height(14.dp))
            }
            // D-037: twelve small month calendars (Monday first) in two columns; tapping a month opens it below
            // as a full-width calendar whose days are real 44 dp+ targets.
            items((1..12).chunked(2)) { pair ->
                Row(Modifier.fillMaxWidth().padding(vertical = 6.dp), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                    pair.forEach { mo ->
                        val ym = java.time.YearMonth.of(year, mo)
                        val future = ym.atDay(1).isAfter(LocalDate.now())
                        Column(
                            Modifier.weight(1f).clip(RoundedCornerShape(8.dp))
                                .clickable(enabled = !future, onClickLabel = "Open ${ym.month.getDisplayName(java.time.format.TextStyle.FULL, java.util.Locale.ENGLISH)}") { openMonth = ym }
                                .padding(vertical = 4.dp),
                        ) {
                            Text(
                                ym.month.getDisplayName(java.time.format.TextStyle.FULL, java.util.Locale.ENGLISH) + if (future) " · not yet" else "",
                                style = Aiimin.type.caption.copy(color = if (openMonth == ym) c.text else c.textMuted), maxLines = 1,
                            )
                            Spacer(Modifier.height(4.dp))
                            MonthGrid(ym, moods, picked, gap = 2.dp, onPick = null)
                        }
                    }
                }
            }
            openMonth?.let { ym ->
                item {
                    Spacer(Modifier.height(12.dp))
                    Hairline()
                    Text(ym.month.getDisplayName(java.time.format.TextStyle.FULL, java.util.Locale.ENGLISH) + " ${ym.year}", style = Aiimin.type.headline, modifier = Modifier.padding(top = 12.dp, bottom = 8.dp))
                    MonthGrid(ym, moods, picked, gap = 4.dp, onPick = { picked = it })
                }
            }
            picked?.let { day ->
                val e = all.filter { it.day == day }.sortedBy { it.createdAt }
                item {
                    Spacer(Modifier.height(16.dp))
                    Hairline()
                    Text(Dates.long(day) + (moods[day]?.let { " · " + moodLabels[it - 1] } ?: ""), style = Aiimin.type.headline, modifier = Modifier.padding(top = 12.dp))
                    e.forEach { j -> JournalCard(j) { nav.open(Route.JournalWrite(j.id)) } }
                }
            }
        }
    }
}

/** A month as a Monday-first calendar of equal cells; future days are blank. [onPick] makes written days tappable. */
@Composable
private fun MonthGrid(ym: java.time.YearMonth, moods: Map<LocalDate, Int?>, picked: LocalDate?, gap: androidx.compose.ui.unit.Dp, onPick: ((LocalDate) -> Unit)?) {
    val lead = ym.atDay(1).dayOfWeek.value - 1
    val cells: List<Int?> = List(lead) { null } + (1..ym.lengthOfMonth()).toList()
    Column(verticalArrangement = Arrangement.spacedBy(gap)) {
        cells.chunked(7).forEach { week ->
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(gap)) {
                week.forEach { d ->
                    Box(Modifier.weight(1f).aspectRatio(1f)) {
                        if (d != null) {
                            val day = ym.atDay(d)
                            if (!day.isAfter(LocalDate.now())) {
                                MoodSquare(
                                    moods[day], day in moods, 64.dp, selected = day == picked,
                                    onClick = if (onPick != null && day in moods) ({ onPick(day) }) else null,
                                )
                            }
                        }
                    }
                }
                repeat(7 - week.size) { Spacer(Modifier.weight(1f)) }
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
        // D-018: a long entry ends with an ellipsis; the card opens the whole entry.
        Text(e.text, style = Aiimin.type.journal.copy(fontSize = 16.sp, lineHeight = 25.sp), maxLines = 4, overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis, modifier = Modifier.padding(top = 4.dp))
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
