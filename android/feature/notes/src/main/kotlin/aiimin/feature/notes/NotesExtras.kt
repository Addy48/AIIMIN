package aiimin.feature.notes

import aiimin.core.data.notes.Attachments
import aiimin.core.data.notes.NoteAttachment
import aiimin.core.data.notes.NoteRepository
import aiimin.core.data.notes.NotesImportPreview
import aiimin.core.data.notes.SortIt
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppIconButton
import aiimin.designsystem.component.AppSheet
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.DatePick
import aiimin.designsystem.component.Hairline
import aiimin.designsystem.component.ListRow
import aiimin.designsystem.component.Pill
import aiimin.designsystem.component.PillRow
import aiimin.designsystem.component.SectionHeader
import aiimin.designsystem.component.SurfaceCard
import aiimin.designsystem.component.TimePick
import aiimin.designsystem.component.TopBar
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.LocalToaster
import aiimin.designsystem.nav.Route
import aiimin.designsystem.theme.Aiimin
import aiimin.designsystem.theme.Shapes
import android.graphics.BitmapFactory
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricManager.Authenticators.BIOMETRIC_WEAK
import androidx.biometric.BiometricManager.Authenticators.DEVICE_CREDENTIAL
import androidx.biometric.BiometricPrompt
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.produceState
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import java.io.File
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.ZoneId
import javax.inject.Inject
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

// =================================================================== colours

/** The five note tints, all existing palette tokens (Part 11: "a small set drawn from the palette", no new colours). */
val NOTE_COLORS = listOf("" to "Plain", "peach" to "Peach", "leaf" to "Leaf", "sun" to "Sun", "lilac" to "Lilac", "stone" to "Stone")

@Composable
fun noteTint(key: String): Color {
    val c = Aiimin.colors
    return when (key) {
        "peach" -> c.accentSoft
        "leaf" -> c.doneSoft
        "sun" -> c.moneyGold.copy(alpha = 0.18f)
        "lilac" -> c.violetSoft
        "stone" -> c.stackMid
        else -> c.surface
    }
}

/** A row of 32 dp swatches inside 48 dp targets; the chosen one carries a check. */
@Composable
fun ColorRow(selected: String?, onPick: (String) -> Unit, withAny: Boolean = false) {
    val c = Aiimin.colors
    Row(Modifier.horizontalScroll(rememberScrollState()), verticalAlignment = Alignment.CenterVertically) {
        if (withAny) Pill("Any", selected == null, { onPick("*") })
        NOTE_COLORS.forEach { (key, name) ->
            Box(
                Modifier.size(48.dp).clickable { onPick(key) }.semantics { contentDescription = name + if (selected == key) ", chosen" else "" },
                contentAlignment = Alignment.Center,
            ) {
                Box(Modifier.size(32.dp).clip(RoundedCornerShape(8.dp)).background(noteTint(key)).border(1.dp, if (selected == key) c.text else c.borderStrong, RoundedCornerShape(8.dp)), contentAlignment = Alignment.Center) {
                    if (selected == key) Icon(AppIcons.Check, null, tint = c.text, modifier = Modifier.size(16.dp))
                }
            }
        }
    }
}

// =================================================================== device unlock

/**
 * Asks for the fingerprint, face or screen lock before a locked note opens (Part 11 "Safety"). On a phone with no
 * screen lock there is nothing to ask for: the note opens, and the caller says how to add a screen lock.
 */
@Composable
fun rememberDeviceAuth(title: String, onOk: () -> Unit): () -> Unit {
    val ctx = LocalContext.current
    val act = ctx as? FragmentActivity
    return remember(act, title) {
        {
            val can = BiometricManager.from(ctx).canAuthenticate(BIOMETRIC_WEAK or DEVICE_CREDENTIAL) == BiometricManager.BIOMETRIC_SUCCESS
            if (act == null || !can) onOk() else BiometricPrompt(
                act, ContextCompat.getMainExecutor(act),
                object : BiometricPrompt.AuthenticationCallback() {
                    override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) = onOk()
                },
            ).authenticate(BiometricPrompt.PromptInfo.Builder().setTitle(title).setAllowedAuthenticators(BIOMETRIC_WEAK or DEVICE_CREDENTIAL).build())
        }
    }
}

fun hasScreenLock(ctx: android.content.Context) =
    BiometricManager.from(ctx).canAuthenticate(BIOMETRIC_WEAK or DEVICE_CREDENTIAL) == BiometricManager.BIOMETRIC_SUCCESS

// =================================================================== pictures

/** Pictures and scanned pages of a note, with the text read from each behind a tap. */
@Composable
fun PictureStrip(items: List<NoteAttachment>, dir: File, onRemove: (NoteAttachment) -> Unit) {
    if (items.isEmpty()) return
    var open by remember { mutableStateOf<NoteAttachment?>(null) }
    SectionHeader("Pictures")
    Row(Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        items.forEach { a ->
            Box(Modifier.size(96.dp).clip(Shapes.small).background(Aiimin.colors.raised).clickable { open = a }.semantics { contentDescription = "Picture" + if (a.text.isNotBlank()) ", has text" else "" }) {
                Thumb(File(dir, a.file), Modifier.fillMaxSize())
            }
        }
    }
    open?.let { a ->
        AppSheet({ open = null }, title = "Picture") {
            Column(Modifier.verticalScroll(rememberScrollState())) {
                Thumb(File(dir, a.file), Modifier.fillMaxWidth().heightIn(max = 360.dp), crop = false)
                Spacer(Modifier.height(12.dp))
                Text(if (a.text.isBlank()) "No text found in this picture." else "Text read on this phone, searchable:", style = Aiimin.type.caption)
                if (a.text.isNotBlank()) Text(a.text, style = Aiimin.type.body, modifier = Modifier.padding(top = 8.dp))
                Spacer(Modifier.height(16.dp))
                AppButton("Remove picture", { onRemove(a); open = null }, Modifier.fillMaxWidth(), kind = ButtonKind.GHOST)
            }
        }
    }
}

@Composable
private fun Thumb(f: File, modifier: Modifier, crop: Boolean = true) {
    val bmp by produceState<android.graphics.Bitmap?>(null, f) {
        value = withContext(Dispatchers.IO) {
            runCatching {
                val o = BitmapFactory.Options().apply { inJustDecodeBounds = true }
                BitmapFactory.decodeFile(f.absolutePath, o)
                var s = 1
                while (o.outWidth / (s * 2) >= 720) s *= 2
                BitmapFactory.decodeFile(f.absolutePath, BitmapFactory.Options().apply { inSampleSize = s })
            }.getOrNull()
        }
    }
    bmp?.let { Image(it.asImageBitmap(), null, modifier, contentScale = if (crop) ContentScale.Crop else ContentScale.Fit) }
        ?: Box(modifier, contentAlignment = Alignment.Center) { Icon(if (f.extension == "pdf") AppIcons.FileText else AppIcons.Camera, null, tint = Aiimin.colors.textFaint) }
}

// =================================================================== sort it

/** Lines that read clearly as a task, an event or a payment; one tap files each with the "+" sheet. */
@Composable
fun SortItSheet(body: String, onDismiss: () -> Unit, onPick: (String) -> Unit) {
    val chips = remember(body) { SortIt.chips(body) }
    AppSheet(onDismiss, title = "Sort it", subtitle = "Lines that read clearly as a task, a plan or a payment. Read on this phone; nothing is sent.") {
        if (chips.isEmpty()) {
            Text("Nothing clear here yet. Lines like “call CA tomorrow 4 pm” or “240 lunch” show up here.", style = Aiimin.type.caption, modifier = Modifier.padding(bottom = 16.dp))
            return@AppSheet
        }
        chips.forEach { ch ->
            ListRow(
                ch.line, subtitle = when (ch.kind) {
                    aiimin.core.nlp.Kind.TASK -> "Task"
                    aiimin.core.nlp.Kind.EVENT -> "Plan"
                    aiimin.core.nlp.Kind.INCOME -> "Money in"
                    else -> "Payment"
                },
                trailing = { Text("Add", style = Aiimin.type.labelLarge.copy(color = Aiimin.colors.link)) },
                onClick = { onPick(ch.line) },
            )
            Hairline()
        }
        Spacer(Modifier.height(12.dp))
    }
}

// =================================================================== reminder

/** "Remind me about this note": three quick times, a chosen date and time, or off. */
@Composable
fun ReminderSheet(current: Long?, onDismiss: () -> Unit, onSet: (Long?) -> Unit) {
    val zone = ZoneId.systemDefault()
    val now = LocalDateTime.now()
    var date by remember { mutableStateOf<LocalDate?>(null) }
    var pickDate by remember { mutableStateOf(false) }
    fun at(d: LocalDate, t: LocalTime) = d.atTime(t).atZone(zone).toInstant().toEpochMilli()
    AppSheet(onDismiss, title = "Remind me", subtitle = current?.let { "Set for " + aiimin.core.data.util.Dates.relative(java.time.Instant.ofEpochMilli(it).atZone(zone).toLocalDate(), LocalDate.now()) + " " + aiimin.core.data.util.Dates.clock(java.time.Instant.ofEpochMilli(it).atZone(zone).toLocalTime()) }) {
        val quick = buildList {
            add("In 1 hour" to now.plusHours(1).withSecond(0).withNano(0).atZone(zone).toInstant().toEpochMilli())
            if (now.hour < 18) add("This evening, 6 PM" to at(now.toLocalDate(), LocalTime.of(18, 0)))
            add("Tomorrow, 9 AM" to at(now.toLocalDate().plusDays(1), LocalTime.of(9, 0)))
        }
        quick.forEach { (label, ms) -> ListRow(label, onClick = { onSet(ms) }); Hairline() }
        ListRow("Pick a date and time", onClick = { pickDate = true })
        if (current != null) { Hairline(); ListRow("No reminder", titleColor = Aiimin.colors.link, onClick = { onSet(null) }) }
        Spacer(Modifier.height(12.dp))
    }
    if (pickDate) DatePick(LocalDate.now(), { date = it; pickDate = false }, { pickDate = false })
    date?.let { d -> TimePick(LocalTime.of(9, 0), { t -> onSet(at(d, t)); date = null }, { date = null }) }
}

// =================================================================== clipboard

/**
 * "Paste copied text as a note?" (Part 11 "Capture"). Only the clipboard's type is checked when Notes opens;
 * the text itself is read only when the person taps Paste, so Android's paste notice appears only then.
 */
@Composable
fun ClipboardBanner(onPaste: (String) -> Unit) {
    val ctx = LocalContext.current
    val cm = remember { ctx.getSystemService(android.content.ClipboardManager::class.java) }
    val prefs = remember { ctx.getSharedPreferences("notes_clip", android.content.Context.MODE_PRIVATE) }
    // The clip is known by its time, never its text: "Not now" or "Paste" hides it until something new is copied.
    val stamp = remember { runCatching { cm?.primaryClipDescription?.timestamp }.getOrNull() ?: 0L }
    var hidden by remember { mutableStateOf(prefs.getLong("seen", -1L) == stamp) }
    val has = remember { runCatching { cm?.primaryClipDescription?.hasMimeType("text/*") == true }.getOrDefault(false) }
    if (!has || hidden) return
    fun seen() { hidden = true; prefs.edit().putLong("seen", stamp).apply() }
    SurfaceCard(Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 8.dp)) {
        Text("You copied some text", style = Aiimin.type.bodyStrong)
        Text("Make it a note? It's read only when you tap Paste.", style = Aiimin.type.caption)
        Row(Modifier.padding(top = 12.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            AppButton("Paste as note", {
                val t = runCatching { cm?.primaryClip?.getItemAt(0)?.coerceToText(ctx)?.toString() }.getOrNull().orEmpty()
                seen()
                if (t.isNotBlank()) onPaste(t)
            }, compact = true)
            AppButton("Not now", { seen() }, kind = ButtonKind.SECONDARY, compact = true)
        }
    }
}

// =================================================================== import and export

@HiltViewModel
class NotesImportViewModel @Inject constructor(private val notes: NoteRepository) : ViewModel() {
    val preview = MutableStateFlow<NotesImportPreview?>(null)
    val busy = MutableStateFlow(false)
    val result = MutableStateFlow<Pair<Int, Int>?>(null)

    fun read(uris: List<Uri>) = viewModelScope.launch {
        busy.value = true; result.value = null
        preview.value = runCatching { notes.previewImport(uris) }.getOrNull()
        busy.value = false
    }

    fun bringIn() = viewModelScope.launch {
        val p = preview.value ?: return@launch
        busy.value = true
        val n = notes.commitImport(p)
        result.value = n to p.plan.already
        preview.value = null
        busy.value = false
    }

    suspend fun export(uri: Uri) = notes.exportAll(uri)
}

/**
 * Bring notes in (Part 11.7 Q-1): Google Keep from Takeout, Markdown and text, Apple Notes exported from a Mac,
 * or an AIIMIN export. A preview first, nothing saved twice, then "{n} brought in, {k} skipped". Export all too.
 */
@Composable
fun NotesImportScreen(vm: NotesImportViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    val preview by vm.preview.collectAsStateWithLifecycle()
    val busy by vm.busy.collectAsStateWithLifecycle()
    val result by vm.result.collectAsStateWithLifecycle()
    val pick = rememberLauncherForActivityResult(ActivityResultContracts.OpenMultipleDocuments()) { uris -> if (uris.isNotEmpty()) vm.read(uris) }
    val save = rememberLauncherForActivityResult(ActivityResultContracts.CreateDocument("application/zip")) { uri ->
        if (uri != null) scope.launch { runCatching { vm.export(uri) }.onSuccess { toaster.show("$it notes saved") }.onFailure { toaster.show("Could not save the file") } }
    }
    val c = Aiimin.colors
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Bring in and save notes", onBack = { nav.back() })
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = Aiimin.space.gutter)) {
            SectionHeader("Bring notes in")
            Text(
                "Google Keep: export it at takeout.google.com (Keep only), then choose the zip here. Apple Notes: export notes from a Mac as files. Markdown and text files work too. Read on this phone.",
                style = Aiimin.type.caption,
            )
            Spacer(Modifier.height(12.dp))
            AppButton("Choose files", { pick.launch(arrayOf("application/zip", "application/json", "text/*", "application/octet-stream")) }, Modifier.fillMaxWidth(), icon = AppIcons.Upload, enabled = !busy)
            if (busy) Text("Reading…", style = Aiimin.type.caption, modifier = Modifier.padding(top = 12.dp))
            result?.let { (n, k) ->
                SurfaceCard(Modifier.padding(top = 16.dp)) {
                    Text("$n brought in, $k skipped", style = Aiimin.type.bodyStrong)
                    Text(if (k > 0) "Skipped notes were already here, so nothing is doubled." else "They are in Notes now, with their labels as #tags.", style = Aiimin.type.caption)
                    AppButton("Open Notes", { nav.back() }, Modifier.padding(top = 12.dp), compact = true)
                }
            }
            preview?.let { p ->
                SurfaceCard(Modifier.padding(top = 16.dp)) {
                    val total = p.plan.fresh.size + p.plan.already
                    Text(if (total == 0) "No notes found in these files" else "$total ${if (total == 1) "note" else "notes"} found", style = Aiimin.type.bodyStrong)
                    if (p.plan.already > 0) Text("${p.plan.already} already here, so they are left out.", style = Aiimin.type.caption)
                    val pics = p.plan.fresh.sumOf { it.attachments.size }
                    if (pics > 0) Text("$pics ${if (pics == 1) "picture" else "pictures"} come with them; their text is read on this phone.", style = Aiimin.type.caption)
                    Spacer(Modifier.height(8.dp))
                    p.plan.fresh.take(12).forEach { n ->
                        Text("· " + n.title + (if (n.body.contains("- [")) " · checklist" else ""), style = Aiimin.type.body, maxLines = 1, overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis)
                    }
                    if (p.plan.fresh.size > 12) Text("and ${p.plan.fresh.size - 12} more", style = Aiimin.type.caption)
                    if (p.plan.fresh.isNotEmpty()) AppButton("Bring in ${p.plan.fresh.size}", { vm.bringIn() }, Modifier.fillMaxWidth().padding(top = 12.dp), enabled = !busy)
                }
            }
            SectionHeader("Save all notes", Modifier.padding(top = 16.dp))
            Text("One zip of Markdown files with your pictures. Locked notes are included, readable, so keep the file somewhere safe. Bring it in here on any phone.", style = Aiimin.type.caption)
            Spacer(Modifier.height(12.dp))
            val auth = rememberDeviceAuth("Save all notes") { save.launch("aiimin-notes-${LocalDate.now()}.zip") }
            AppButton("Save all notes", auth, Modifier.fillMaxWidth(), kind = ButtonKind.SECONDARY, icon = AppIcons.Export)
            Spacer(Modifier.height(32.dp))
        }
    }
}

/** The note's reminder as a short line ("Reminder · Tomorrow 9:00 AM"). */
fun reminderText(at: Long): String {
    val z = java.time.Instant.ofEpochMilli(at).atZone(ZoneId.systemDefault())
    return "Reminder · " + aiimin.core.data.util.Dates.relative(z.toLocalDate(), LocalDate.now()) + " " + aiimin.core.data.util.Dates.clock(z.toLocalTime())
}

internal fun attachmentsOf(json: String) = Attachments.decode(json)
