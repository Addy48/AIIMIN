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
    /** Colour filter; null = any. */
    val color = MutableStateFlow<String?>(null)
    val showArchived = MutableStateFlow(false)
    val all = notes.all().stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)
    private val source = combine(notes.all(), notes.archived(), showArchived) { a, b, arch -> if (arch) b else a }
    val shown = combine(source, query, tag, color) { list, q, t, col -> aiimin.core.data.notes.NoteSearch.filter(list, q, t, col) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

    suspend fun delete(id: String) = notes.delete(id)
    fun restore(n: NoteEntity) = viewModelScope.launch { notes.restore(n) }
    /** Clipboard banner: the copied text becomes a note. */
    suspend fun pasteAsNote(text: String) = notes.save(null, "", text.trim(), source = "share")
    val pictureDir get() = notes.pictureDir
}

@HiltViewModel
class NoteViewModel @Inject constructor(private val notes: NoteRepository, private val linkSearch: aiimin.core.data.notes.LinkSearch) : ViewModel() {
    suspend fun findLinks(q: String) = linkSearch.find(q, id)
    suspend fun resolve(title: String) = linkSearch.resolve(title)
    var id: String? = null
        private set
    val note = MutableStateFlow<NoteEntity?>(null)
    /** The note's real title and body; null while a locked note waits for the person to unlock it. */
    val text = MutableStateFlow<aiimin.core.data.notes.NoteText?>(null)
    /** True when the note is locked and not yet opened with the screen lock. */
    val gated = MutableStateFlow(false)
    val loaded = MutableStateFlow(false)
    val backlinks = MutableStateFlow<List<NoteEntity>>(emptyList())
    private var started = false
    val pictureDir get() = notes.pictureDir

    fun load(noteId: String?) {
        if (started) return
        started = true
        id = noteId
        viewModelScope.launch {
            val n = noteId?.let { notes.get(it) }
            // A locked note is gated before anything of it reaches the screen; only unlock() reads its text.
            if (n?.locked == true) gated.value = true else text.value = n?.let(notes::textOf)
            note.value = n
            n?.takeIf { !it.locked }?.let { backlinks.value = notes.backlinks(it.title).filter { b -> b.id != it.id } }
            loaded.value = true
        }
    }

    /** After the screen lock said yes. */
    fun unlock() = viewModelScope.launch {
        val nid = id ?: return@launch
        text.value = notes.open(nid)
        gated.value = false
    }

    fun links(body: String) = notes.links(body)
    suspend fun byTitle(t: String) = notes.byTitle(t)

    /** Saves as you type and on leave; an empty new note is not kept. */
    suspend fun save(title: String, body: String, pinned: Boolean) {
        if (gated.value) return
        if (title.isBlank() && body.isBlank() && id == null) return
        val t = text.value
        if (t != null && t.title == title && t.body == body && t.note.pinned == pinned) return
        id = notes.save(id, title, body, pinned)
        refresh()
    }

    private suspend fun refresh() {
        val n = id?.let { notes.get(it) } ?: return
        note.value = n
        text.value = notes.textOf(n)
    }

    /** Colour, lock, reminder and pictures need the note to exist: an untouched new note is saved first. */
    private suspend fun ensure(title: String, body: String, pinned: Boolean): String {
        id?.let { return it }
        id = notes.save(null, title, body, pinned)
        refresh()
        return id!!
    }

    fun setColor(c: String, title: String, body: String, pinned: Boolean) = viewModelScope.launch { notes.setColor(ensure(title, body, pinned), c); refresh() }
    fun setReminder(at: Long?, title: String, body: String, pinned: Boolean) = viewModelScope.launch { notes.setReminder(ensure(title, body, pinned), at); refresh() }
    fun setArchived(a: Boolean, title: String, body: String, pinned: Boolean) = viewModelScope.launch { notes.setArchived(ensure(title, body, pinned), a); refresh() }
    fun lock(title: String, body: String, pinned: Boolean) = viewModelScope.launch {
        val nid = ensure(title, body, pinned)
        notes.save(nid, title, body, pinned)
        notes.lock(nid); refresh()
    }
    fun unlockForGood() = viewModelScope.launch { id?.let { notes.unlock(it) }; refresh() }
    fun addPicture(uri: android.net.Uri, mime: String, title: String, body: String, pinned: Boolean, done: (Boolean) -> Unit) = viewModelScope.launch {
        val a = notes.addPicture(ensure(title, body, pinned), uri, mime)
        refresh(); done(a != null)
    }
    fun removePicture(file: String) = viewModelScope.launch { id?.let { notes.removePicture(it, file) }; refresh() }

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
    val scope = rememberCoroutineScope()
    val all by vm.all.collectAsStateWithLifecycle()
    val shown by vm.shown.collectAsStateWithLifecycle()
    var q by remember { mutableStateOf(vm.query.value) }
    LaunchedEffect(q) { vm.query.value = q }
    val tag by vm.tag.collectAsStateWithLifecycle()
    val color by vm.color.collectAsStateWithLifecycle()
    val archived by vm.showArchived.collectAsStateWithLifecycle()
    var menu by remember { mutableStateOf(false) }
    val c = Aiimin.colors
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar(if (archived) "Archived notes" else "Notes", onBack = { if (archived) vm.showArchived.value = false else nav.back() }) {
            AppIconButton(AppIcons.More, "More", { menu = true })
            AppIconButton(AppIcons.Pencil, "New note", { nav.open(Route.Note()) })
        }
        ClipboardBanner { t -> scope.launch { val id = vm.pasteAsNote(t); nav.open(Route.Note(id)) } }
        val list = all
        if (!archived && list != null && list.isEmpty()) {
            EmptyState(raahi = aiimin.core.engine.raahi.RaahiPose.SATCHEL_OPEN, icon = AppIcons.Note, title = "No notes yet", body = "Write anything. Link notes with [[Title]] and tag with #tags. Already use Google Keep? Bring your notes in from the menu.", action = "New note", onAction = { nav.open(Route.Note()) })
            return@Column
        }
        AppTextField(q, { q = it }, placeholder = "Search notes and pictures", leading = AppIcons.Search, modifier = Modifier.padding(horizontal = Aiimin.space.gutter))
        val tags = list.orEmpty().flatMap { Codecs.decodeList(it.tags) }.groupingBy { it }.eachCount().entries.sortedByDescending { it.value }.take(12)
        if (tags.isNotEmpty()) Box(Modifier.padding(horizontal = Aiimin.space.gutter)) {
            PillRow { tags.forEach { (t, n) -> Pill("#$t", tag == t, { vm.tag.value = if (tag == t) null else t }, count = n) } }
        }
        if (list.orEmpty().any { it.color.isNotEmpty() }) Box(Modifier.padding(horizontal = Aiimin.space.gutter)) {
            ColorRow(color, { k -> vm.color.value = if (k == "*" || k == color) null else k }, withAny = true)
        }
        LazyColumn(contentPadding = PaddingValues(bottom = 40.dp)) {
            if (shown.isEmpty()) item {
                Text(if (archived) "Nothing archived." else "No note matches.", style = Aiimin.type.caption, modifier = Modifier.padding(horizontal = Aiimin.space.gutter, vertical = 16.dp))
            }
            itemsIndexed(shown, key = { _, it -> it.id }) { i, n ->
                // A note's colour tints its whole row (as Keep tints its card), so every title stays on the margin.
                val tint = if (n.color.isEmpty()) Color.Transparent else noteTint(n.color)
                Row(Modifier.fillMaxWidth().enterStagger(i).background(tint).clickable { nav.open(Route.Note(n.id)) }.padding(horizontal = Aiimin.space.gutter, vertical = 12.dp), verticalAlignment = Alignment.CenterVertically) {
                    Column(Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            if (n.pinned) Icon(AppIcons.PushPin, "Pinned", tint = c.accent, modifier = Modifier.size(14.dp).padding(end = 4.dp))
                            if (n.locked) Icon(AppIcons.Lock, null, tint = c.textMuted, modifier = Modifier.size(14.dp).padding(end = 4.dp))
                            // A locked note shows nothing of itself in the list (Part 11.6).
                            Text(if (n.locked) "Locked note" else n.title, style = Aiimin.type.bodyStrong, modifier = Modifier.weight(1f), maxLines = 1, overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis)
                            Text(Dates.relative(java.time.Instant.ofEpochMilli(n.updatedAt).atZone(java.time.ZoneId.systemDefault()).toLocalDate(), LocalDate.now()), style = Aiimin.type.caption)
                        }
                        // D-016: the preview ends with an ellipsis, never mid-word.
                        val preview = when {
                            n.locked -> "Unlock to read"
                            else -> aiimin.core.data.notes.notePreview(n.body).take(140).ifBlank { if (attachmentsOf(n.attachments).isNotEmpty()) "Picture" else "" }
                        }
                        if (preview.isNotBlank()) Text(preview, style = Aiimin.type.caption, maxLines = 2, overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis)
                        n.reminderAt?.takeIf { it > System.currentTimeMillis() }?.let { Text(reminderText(it), style = Aiimin.type.caption.copy(color = c.link)) }
                    }
                }
                Hairline(Modifier.padding(horizontal = Aiimin.space.gutter))
            }
        }
    }
    if (menu) AppSheet({ menu = false }, title = "Notes") {
        ListRow(if (archived) "Back to notes" else "Archived notes", leading = { IconTile(AppIcons.Archive) }, onClick = { vm.showArchived.value = !archived; menu = false })
        ListRow("Bring in and save notes", subtitle = "Google Keep, Apple Notes, Markdown; save all as a zip", leading = { IconTile(AppIcons.Upload) }, onClick = { menu = false; nav.open(Route.NotesImport) })
        ListRow("Deleted notes", subtitle = "Kept for 30 days", leading = { IconTile(AppIcons.Trash) }, onClick = { menu = false; nav.open(Route.Trash) })
        Spacer(Modifier.height(8.dp))
    }
}

/** A locked note before the screen lock is given (Part 11 "Safety"): nothing of it is shown. */
@Composable
private fun LockedGate(onUnlock: () -> Unit, hasLock: Boolean, onBack: () -> Unit) {
    val c = Aiimin.colors
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Note", onBack = onBack)
        Column(Modifier.fillMaxSize().padding(horizontal = 32.dp), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
            Icon(AppIcons.Lock, null, tint = c.textMuted, modifier = Modifier.size(40.dp))
            Spacer(Modifier.height(14.dp))
            Text("This note is locked", style = Aiimin.type.cardTitle)
            Text(
                if (hasLock) "Open it with your fingerprint, face or screen lock." else "This phone has no screen lock, so anyone holding it can open the note. Add one in Android settings to be asked.",
                style = Aiimin.type.caption, textAlign = androidx.compose.ui.text.style.TextAlign.Center, modifier = Modifier.padding(top = 6.dp),
            )
            Spacer(Modifier.height(20.dp))
            AppButton("Open note", onUnlock, icon = AppIcons.LockOpen)
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
    val text by vm.text.collectAsStateWithLifecycle()
    val gated by vm.gated.collectAsStateWithLifecycle()
    val ready by vm.loaded.collectAsStateWithLifecycle()
    val backlinks by vm.backlinks.collectAsStateWithLifecycle()
    val c = Aiimin.colors
    // Keyed on load and unlock only: saving a new note gives it an id, and that must not reset what is being typed.
    val session = ready to gated
    // A title AIIMIN made from the first line (or "Untitled") is not shown as typed: the field stays empty.
    var title by remember(session) {
        val t = text
        val derived = t?.body?.lineSequence()?.firstOrNull { it.isNotBlank() }?.take(60)?.trim()
        mutableStateOf(t?.title?.takeIf { it != "Untitled" && it != derived }.orEmpty())
    }
    var nextId by remember(session) { mutableIntStateOf(0) }
    val lines = remember(session) {
        mutableStateListOf<NLine>().also { l ->
            val src = text?.body.orEmpty().split("\n")
            src.forEach { l += NLine(nextId++, it) }
        }
    }
    var pinned by remember(session) { mutableStateOf(note?.pinned ?: false) }
    var focused by remember { mutableIntStateOf(0) }
    val requesters = remember(session) { mutableMapOf<Int, FocusRequester>() }
    var wantFocus by remember { mutableStateOf<Int?>(null) }
    val body = lines.joinToString("\n") { it.text }
    val latest = rememberUpdatedValues(title, body, pinned)
    DisposableEffect(Unit) {
        // Survives the pop: the ViewModel scope is cancelled as this screen leaves.
        onDispose { kotlinx.coroutines.CoroutineScope(kotlinx.coroutines.Dispatchers.IO + NonCancellable).launch { vm.save(latest.title, latest.body, latest.pinned) } }
    }
    // Saved as you type (Part 11.6: killing the app loses nothing), a moment after the last key.
    LaunchedEffect(title, body, pinned, ready, gated) {
        if (!ready || gated) return@LaunchedEffect
        kotlinx.coroutines.delay(400)
        vm.save(title, body, pinned)
    }
    // A new note opens straight into typing (Part 11.6: first character under 2 s).
    val keyboard = androidx.compose.ui.platform.LocalSoftwareKeyboardController.current
    LaunchedEffect(ready) { if (ready && id == null) { wantFocus = 0; keyboard?.show() } }
    var more by remember { mutableStateOf(false) }
    var reminding by remember { mutableStateOf(false) }
    var sorting by remember { mutableStateOf(false) }
    var adding by remember { mutableStateOf(false) }
    val context = androidx.compose.ui.platform.LocalContext.current
    val unlock = rememberDeviceAuth("Open locked note") { vm.unlock() }
    val unlockForGood = rememberDeviceAuth("Unlock note") { vm.unlockForGood() }
    val photo = androidx.activity.compose.rememberLauncherForActivityResult(androidx.activity.result.contract.ActivityResultContracts.PickVisualMedia()) { uri ->
        if (uri != null) { toaster.show("Reading the picture…"); vm.addPicture(uri, "image/jpeg", title, body, pinned) { ok -> toaster.show(if (ok) "Picture added" else "Could not add the picture") } }
    }
    val scan = androidx.activity.compose.rememberLauncherForActivityResult(androidx.activity.result.contract.ActivityResultContracts.StartIntentSenderForResult()) { res ->
        if (res.resultCode == android.app.Activity.RESULT_OK) {
            val r = com.google.mlkit.vision.documentscanner.GmsDocumentScanningResult.fromActivityResultIntent(res.data)
            r?.pages?.forEach { pg -> vm.addPicture(pg.imageUri, "image/jpeg", title, body, pinned) { } }
            toaster.show("Reading the scanned pages…")
        }
    }
    if (ready && (gated || (note?.locked == true && text == null))) {
        LockedGate(onUnlock = unlock, hasLock = hasScreenLock(context), onBack = { nav.back() })
        return
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
            AppIconButton(AppIcons.More, "More", { more = true }, tint = c.text)
        }
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = Aiimin.space.gutter)) {
            Text(
                listOfNotNull(
                    "Pinned to Today".takeIf { pinned }, "Locked".takeIf { note?.locked == true }, "Archived".takeIf { note?.archived == true },
                    note?.reminderAt?.takeIf { it > System.currentTimeMillis() }?.let(::reminderText), "Saved".takeIf { note != null },
                ).joinToString(" · "),
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
            PictureStrip(attachmentsOf(note?.attachments ?: "[]"), vm.pictureDir) { a -> vm.removePicture(a.file) }
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
            AppIconButton(AppIcons.Camera, "Add a picture or scan", { adding = true })
            AppIconButton(AppIcons.Sparkle, "Sort it", { sorting = true })
            Spacer(Modifier.weight(1f))
            AppButton("Dictate", { voice() }, icon = AppIcons.Mic, compact = true)
        }
    }
    if (picking) LinkPicker(vm, onDismiss = { picking = false }) { t -> insertLink(t); picking = false }
    if (adding) AppSheet({ adding = false }, title = "Add to this note") {
        ListRow("Scan pages", subtitle = "The camera finds the page edges; the text is read on this phone", leading = { IconTile(AppIcons.Scan) }, onClick = {
            adding = false
            val act = context as? android.app.Activity
            if (act != null) {
                val opts = com.google.mlkit.vision.documentscanner.GmsDocumentScannerOptions.Builder()
                    .setResultFormats(com.google.mlkit.vision.documentscanner.GmsDocumentScannerOptions.RESULT_FORMAT_JPEG)
                    .setScannerMode(com.google.mlkit.vision.documentscanner.GmsDocumentScannerOptions.SCANNER_MODE_FULL).build()
                com.google.mlkit.vision.documentscanner.GmsDocumentScanning.getClient(opts).getStartScanIntent(act)
                    .addOnSuccessListener { scan.launch(androidx.activity.result.IntentSenderRequest.Builder(it).build()) }
                    .addOnFailureListener { toaster.show("The scanner isn't available on this phone") }
            }
        })
        ListRow("Choose a photo", subtitle = "From your gallery; any text in it becomes searchable", leading = { IconTile(AppIcons.Camera) }, onClick = {
            adding = false
            photo.launch(androidx.activity.result.PickVisualMediaRequest(androidx.activity.result.contract.ActivityResultContracts.PickVisualMedia.ImageOnly))
        })
        Spacer(Modifier.height(8.dp))
    }
    if (sorting) SortItSheet(body, { sorting = false }) { line -> sorting = false; nav.capture(line) }
    if (reminding) ReminderSheet(note?.reminderAt, { reminding = false }) { at ->
        reminding = false
        vm.setReminder(at, title, body, pinned)
        toaster.show(if (at == null) "Reminder off" else "I'll remind you")
    }
    if (more) AppSheet({ more = false }, title = "This note") {
        Text("Colour", style = Aiimin.type.eyebrow)
        ColorRow(note?.color ?: "", { k -> vm.setColor(k, title, body, pinned) })
        Spacer(Modifier.height(8.dp))
        ListRow("Remind me", subtitle = note?.reminderAt?.takeIf { it > System.currentTimeMillis() }?.let(::reminderText) ?: "At a time you choose", leading = { IconTile(AppIcons.Bell) }, onClick = { more = false; reminding = true })
        if (lines.any { isCheck(it.text) }) ListRow("Move done to the bottom", leading = { IconTile(AppIcons.SortAscending) }, onClick = {
            val sorted = aiimin.core.data.notes.Checklist.moveDoneToBottom(body).split("\n")
            lines.clear(); sorted.forEach { lines += NLine(nextId++, it) }
            more = false
        })
        if (note?.locked == true) ListRow("Unlock this note", subtitle = "It shows in search and lists again", leading = { IconTile(AppIcons.LockOpen) }, onClick = { more = false; unlockForGood() })
        else ListRow(
            "Lock this note", subtitle = if (hasScreenLock(context)) "Opens with your fingerprint or screen lock; hidden from search, lists and notices" else "Hidden from search, lists and notices. Add a screen lock in Android to be asked before it opens",
            leading = { IconTile(AppIcons.Lock) }, onClick = { more = false; vm.lock(title, body, pinned); toaster.show("Note locked") },
        )
        ListRow(if (note?.archived == true) "Move back to notes" else "Archive", leading = { IconTile(AppIcons.Archive) }, onClick = {
            more = false
            val a = note?.archived != true
            vm.setArchived(a, title, body, pinned)
            toaster.show(if (a) "Archived" else "Back in notes")
            if (a) nav.back()
        })
        ListRow("Share", subtitle = "As text, to any app", leading = { IconTile(AppIcons.Share) }, onClick = {
            more = false
            val send = android.content.Intent(android.content.Intent.ACTION_SEND).setType("text/plain")
                .putExtra(android.content.Intent.EXTRA_SUBJECT, title).putExtra(android.content.Intent.EXTRA_TEXT, listOf(title, body).filter { it.isNotBlank() }.joinToString("\n\n"))
            context.startActivity(android.content.Intent.createChooser(send, "Share note"))
        })
        ListRow("Delete", leading = { IconTile(AppIcons.Trash) }, onClick = {
            more = false
            scope.launch {
                vm.delete()?.let { toaster.show("Note deleted · in Deleted notes for 30 days") }
                title = ""; lines.clear(); lines += NLine(nextId++, "")
                nav.back()
            }
        })
        Spacer(Modifier.height(8.dp))
    }
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
            EmptyState(raahi = aiimin.core.engine.raahi.RaahiPose.LISTENING, icon = AppIcons.BookOpen, title = "Nothing written yet", body = "Write as much or as little as you like. Mood is kept for you and never scored.", action = "Write today", onAction = { nav.open(Route.JournalWrite()) })
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
fun JournalWriteScreen(id: String?, prefill: String? = null, vm: JournalViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    val entries by vm.entries.collectAsStateWithLifecycle()
    val yesterdayOpen by vm.yesterdayOpen.collectAsStateWithLifecycle()
    val existing = entries?.firstOrNull { it.id == id }
    val c = Aiimin.colors
    var text by remember(existing?.id) { mutableStateOf(existing?.text ?: prefill.orEmpty()) }
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
