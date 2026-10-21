package aiimin.feature.vault

import aiimin.core.data.util.Dates
import aiimin.core.data.vault.FamilyRepository
import aiimin.core.data.vault.ImportResult
import aiimin.core.data.vault.VaultRepository
import aiimin.core.data.vault.coverDoc
import aiimin.core.data.vault.life
import aiimin.core.database.DocEntity
import aiimin.core.engine.vault.AssetKind
import aiimin.core.engine.vault.Covers
import aiimin.core.engine.vault.Lifecycle
import aiimin.core.engine.vault.Registry
import aiimin.core.engine.vault.Renewal
import aiimin.core.engine.vault.TimelineRow
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppSheet
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.EmptyState
import aiimin.designsystem.component.Hairline
import aiimin.designsystem.component.IconTile
import aiimin.designsystem.component.ListRow
import aiimin.designsystem.component.Pill
import aiimin.designsystem.component.PillRow
import aiimin.designsystem.component.SectionHeader
import aiimin.designsystem.component.Tag
import aiimin.designsystem.component.TopBar
import aiimin.designsystem.component.pressable
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.LocalToaster
import aiimin.designsystem.nav.Route
import aiimin.designsystem.theme.Aiimin
import aiimin.designsystem.theme.Shapes
import android.app.Activity
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.IntentSenderRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import com.google.mlkit.vision.documentscanner.GmsDocumentScannerOptions
import com.google.mlkit.vision.documentscanner.GmsDocumentScanning
import com.google.mlkit.vision.documentscanner.GmsDocumentScanningResult
import dagger.hilt.android.lifecycle.HiltViewModel
import java.time.LocalDate
import javax.inject.Inject
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.filterNotNull
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

private fun String?.day(): LocalDate? = this?.let { runCatching { LocalDate.parse(it) }.getOrNull() }

/** "Is this a new version of ...?" and what joining means, worded without guilt words. */
internal fun renewalLine(r: Renewal): String? = Covers.say(r)

@OptIn(ExperimentalCoroutinesApi::class)
@HiltViewModel
class CoverViewModel @Inject constructor(
    private val vault: VaultRepository,
    family: FamilyRepository,
) : ViewModel() {
    private val id = MutableStateFlow<String?>(null)
    val doc: StateFlow<DocEntity?> = id.filterNotNull().flatMapLatest { vault.observe(it) }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)
    val versions: StateFlow<List<DocEntity>?> = doc.flatMapLatest { d -> if (d == null) flowOf(null) else vault.observeCover(d.cover) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)
    val people = family.people.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    val added = MutableStateFlow<ImportResult?>(null)

    fun load(docId: String) { id.value = docId }

    /** Add new version: the file joins this cover at once (the person chose this cover). */
    fun addVersion(uri: Uri) = viewModelScope.launch {
        val d = doc.value ?: return@launch
        val r = vault.import(uri, d.owner, d.sensitive, titleHint = d.title)
        vault.joinCover(r.docId, d.cover)
        vault.get(r.docId)?.let { n -> vault.edit(n.copy(category = d.category, docType = n.docType ?: d.docType, subject = n.subject ?: d.subject, lifecycle = d.lifecycle)) }
        vault.setExpiry(r.docId, r.expires, renewalTask = r.expires != null)
        added.value = r
    }

    fun replaceFile(uri: Uri) = viewModelScope.launch { doc.value?.let { vault.replaceFile(it.id, uri) } }
    fun setLifecycle(life: Lifecycle?) = viewModelScope.launch { doc.value?.let { vault.setLifecycle(it.id, life) } }
    suspend fun deleteVersion(d: DocEntity) = vault.deleteVersion(d.id)
    suspend fun deleteCover(): List<DocEntity> = doc.value?.let { vault.deleteCover(it.cover) }.orEmpty()
    fun restore(d: DocEntity) = viewModelScope.launch { vault.restore(d) }
    fun restoreAll(all: List<DocEntity>) = viewModelScope.launch { vault.restoreAll(all) }
}

/** Opens the system scanner or the file picker and hands back one file. */
@Composable
internal fun rememberDocPicker(onPicked: (Uri) -> Unit): Pair<() -> Unit, () -> Unit> {
    val context = LocalContext.current
    val toaster = LocalToaster.current
    val files = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocument()) { it?.let(onPicked) }
    val scan = rememberLauncherForActivityResult(ActivityResultContracts.StartIntentSenderForResult()) { res ->
        if (res.resultCode == Activity.RESULT_OK) GmsDocumentScanningResult.fromActivityResultIntent(res.data)?.pdf?.uri?.let(onPicked)
    }
    val startScan = {
        (context as? Activity)?.let { activity ->
            val opts = GmsDocumentScannerOptions.Builder().setGalleryImportAllowed(true).setPageLimit(20)
                .setResultFormats(GmsDocumentScannerOptions.RESULT_FORMAT_PDF).setScannerMode(GmsDocumentScannerOptions.SCANNER_MODE_FULL).build()
            GmsDocumentScanning.getClient(opts).getStartScanIntent(activity)
                .addOnSuccessListener { scan.launch(IntentSenderRequest.Builder(it).build()) }
                .addOnFailureListener { toaster.show("Scanner isn't available on this phone") }
        }
        Unit
    }
    val choose = { files.launch(arrayOf("application/pdf", "image/*")) }
    return startScan to choose
}

// =================================================================== V7 Info and versions

@Composable
fun DocInfoScreen(id: String, vm: CoverViewModel = hiltViewModel()) {
    LaunchedEffect(id) { vm.load(id) }
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    val doc by vm.doc.collectAsStateWithLifecycle()
    val versions by vm.versions.collectAsStateWithLifecycle()
    val added by vm.added.collectAsStateWithLifecycle()
    var lifeSheet by remember { mutableStateOf(false) }
    var askDelete by remember { mutableStateOf(false) }
    var newVersion by remember { mutableStateOf(false) }
    var rescan by remember { mutableStateOf(false) }
    val (scanNew, chooseNew) = rememberDocPicker { vm.addVersion(it) }
    val (scanFix, chooseFix) = rememberDocPicker { vm.replaceFile(it); toaster.show("File replaced in the same version") }
    LaunchedEffect(added) { added?.let { toaster.show("Added as the new version"); vm.added.value = null } }
    val c = Aiimin.colors
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Info and versions", onBack = { nav.back() })
        val d = doc
        val all = versions
        if (d == null || all == null) {
            if (d == null && all == null) Spacer(Modifier.height(1.dp)) else EmptyState(AppIcons.Archive, "Not available", "This document is no longer in the vault.")
            return@Column
        }
        val type = Registry.byKey(d.docType)
        val life = d.life()
        val today = LocalDate.now()
        val rows = Covers.timeline(all.map { it.coverDoc() })
        val byId = all.associateBy { it.id }
        val current = all.firstOrNull { it.current } ?: d
        val asset = Covers.assetOf(type, d.subject)
        LazyColumn(Modifier.weight(1f), contentPadding = PaddingValues(bottom = 32.dp)) {
            item {
                Column(Modifier.padding(horizontal = Aiimin.space.gutter)) {
                    Text(type?.name ?: d.category, style = Aiimin.type.headline)
                    Spacer(Modifier.height(4.dp))
                    Text(
                        listOfNotNull(life?.label, d.subject?.takeIf { type?.subject == aiimin.core.engine.vault.Subject.VEHICLE }, "${all.size} ${if (all.size == 1) "version" else "versions"}").joinToString(" · "),
                        style = Aiimin.type.caption,
                    )
                    if (Covers.lapsed(type, current.expires.day(), today) && life != null && (life == Lifecycle.B || life == Lifecycle.C)) {
                        Spacer(Modifier.height(10.dp))
                        // Lapsed uses the warn colour: the brand has no red (30.A, 21 Oct).
                        Tag("Lapsed since ${Dates.short(current.expires.day()!!)}", color = c.warn, background = c.warnSoft)
                    }
                }
            }
            item { SectionHeader("Timeline", Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 8.dp)) }
            items(rows, key = { it.doc.id }) { row ->
                byId[row.doc.id]?.let { v -> TimelineEntry(v, row, last = row == rows.last(), isThis = v.id == d.id) { if (v.id != d.id) nav.open(Route.Doc(v.id)) } }
            }
            item {
                Column(Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 8.dp)) {
                    if (life != Lifecycle.D) AppButton("Add new version", { newVersion = true }, Modifier.fillMaxWidth(), kind = ButtonKind.SECONDARY, icon = AppIcons.Plus)
                    Spacer(Modifier.height(8.dp))
                    SectionHeader("This version")
                    ListRow("Replace the file", subtitle = "A clearer scan of the same paper stays in this version", leading = { IconTile(AppIcons.Scan) }, onClick = { rescan = true })
                    Hairline()
                    ListRow("Kind of paper", subtitle = (life?.let { "${it.label}: ${lifeHelp(it)}" } ?: "Not set. Choose how it renews"), leading = { IconTile(AppIcons.Info) }, onClick = { lifeSheet = true }, maxSubtitleLines = 3)
                    if (asset != null) {
                        Hairline()
                        ListRow(if (asset.kind == AssetKind.VEHICLE) "All papers for ${asset.key}" else "All papers for this home", leading = { IconTile(if (asset.kind == AssetKind.VEHICLE) AppIcons.Car else AppIcons.House) }, onClick = { nav.open(Route.Asset(asset.key)) })
                    }
                    type?.source?.takeIf { it.isNotBlank() }?.let {
                        Spacer(Modifier.height(12.dp))
                        Text("Usual length and reminder days come from ${it.removePrefix("https://")}. A date read from your paper always wins.", style = Aiimin.type.caption)
                    }
                    Spacer(Modifier.height(20.dp))
                    AppButton(if (all.size > 1) "Delete this version" else "Delete", {
                        scope.launch {
                            vm.deleteVersion(d)?.let { old -> toaster.undo(if (all.size > 1) "Version deleted. The cover stays" else "Document deleted") { vm.restore(old) } }
                            nav.back()
                        }
                    }, Modifier.fillMaxWidth(), kind = ButtonKind.GHOST)
                    if (all.size > 1) AppButton("Delete the whole cover", { askDelete = true }, Modifier.fillMaxWidth(), kind = ButtonKind.GHOST)
                }
            }
        }
        if (newVersion) AppSheet({ newVersion = false }, title = "Add new version", subtitle = "The new one becomes current; reminders move to it. The old one stays in the timeline.") {
            ListRow("Scan pages", leading = { IconTile(AppIcons.Scan) }, onClick = { newVersion = false; scanNew() })
            ListRow("Choose a file", leading = { IconTile(AppIcons.Upload) }, onClick = { newVersion = false; chooseNew() })
        }
        if (rescan) AppSheet({ rescan = false }, title = "Replace the file", subtitle = "For a clearer copy of the same paper. No new version is made.") {
            ListRow("Scan again", leading = { IconTile(AppIcons.Scan) }, onClick = { rescan = false; scanFix() })
            ListRow("Choose a file", leading = { IconTile(AppIcons.Upload) }, onClick = { rescan = false; chooseFix() })
        }
        if (lifeSheet) AppSheet({ lifeSheet = false }, title = "Kind of paper", subtitle = "This decides reminders and versions. ${type?.let { "Usually ${it.lifecycle.label.lowercase()} for a ${it.name}." } ?: ""}") {
            Lifecycle.entries.forEach { l ->
                ListRow(l.label, subtitle = lifeHelp(l), trailing = { if (life == l) Tag("Chosen") }, onClick = { vm.setLifecycle(if (type?.lifecycle == l) null else l); lifeSheet = false }, maxSubtitleLines = 2)
                Hairline()
            }
        }
        if (askDelete) AppSheet({ askDelete = false }, title = "Delete the whole cover?", subtitle = "All ${all.size} versions of ${type?.name ?: d.title} leave the vault. You can undo for a few seconds.") {
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                AppButton("Keep it", { askDelete = false }, Modifier.weight(1f), kind = ButtonKind.SECONDARY)
                AppButton("Delete all", {
                    scope.launch {
                        val gone = vm.deleteCover()
                        askDelete = false
                        toaster.undo("Cover deleted") { vm.restoreAll(gone) }
                        nav.back()
                    }
                }, Modifier.weight(1f), kind = ButtonKind.DANGER)
            }
        }
    }
}

internal fun lifeHelp(l: Lifecycle) = when (l) {
    Lifecycle.A -> "issued once, never expires; a new copy is a correction"
    Lifecycle.B -> "renewed for the same person or thing; the newest counts"
    Lifecycle.C -> "a contract for a period; the provider can change"
    Lifecycle.D -> "a record for a period; kept by year, never replaced"
    Lifecycle.E -> "belongs to a car or a home"
}

@Composable
private fun TimelineEntry(v: DocEntity, row: TimelineRow, last: Boolean, isThis: Boolean, onClick: () -> Unit) {
    val c = Aiimin.colors
    val starts = v.startsOn.day()
    val ends = v.expires.day()
    Row(Modifier.fillMaxWidth().pressable(onClick).padding(horizontal = Aiimin.space.gutter).heightIn(min = 72.dp)) {
        // The rail: a dot per version, a line down to the older one.
        Box(Modifier.width(24.dp).fillMaxHeight().heightIn(min = 72.dp)) {
            if (!last) Box(Modifier.align(Alignment.TopCenter).padding(top = 22.dp).width(2.dp).fillMaxHeight().background(c.border))
            Box(Modifier.align(Alignment.TopCenter).padding(top = 14.dp).size(10.dp).clip(CircleShape).background(if (v.current) c.text else c.surface).border(2.dp, if (v.current) c.text else c.borderStrong, CircleShape))
        }
        Spacer(Modifier.width(8.dp))
        Column(Modifier.weight(1f).padding(top = 8.dp, bottom = 12.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("Version ${v.version}", style = Aiimin.type.bodyStrong)
                if (v.current) Tag("Current")
                if (isThis && !v.current) Tag("Open now")
            }
            Text(
                listOfNotNull(v.provider, v.number?.let { if (v.sensitive) "••••${it.takeLast(4)}" else it }).joinToString(" · ").ifBlank { v.title },
                style = Aiimin.type.caption, maxLines = 1, overflow = TextOverflow.Ellipsis,
            )
            Text(
                when {
                    starts != null && ends != null -> "${Dates.short(starts)} ${starts.year} to ${Dates.short(ends)} ${ends.year}"
                    ends != null -> "Until ${Dates.short(ends)} ${ends.year}"
                    else -> "No dates found"
                },
                style = Aiimin.type.caption,
            )
            row.before?.let(::renewalLine)?.let { Text(it, style = Aiimin.type.caption.copy(color = c.warn), modifier = Modifier.padding(top = 4.dp)) }
        }
    }
}

// =================================================================== the save prompt

/**
 * "Is this a new version of ...?" inside the save sheet. [choice] is the cover to join, or null to keep it separate.
 * A long overlap asks "Keep both active?" instead (rule 3); a gap is said plainly (rule 4).
 */
@Composable
internal fun VersionPrompt(r: ImportResult, choice: String?, instant: Boolean = false, onChoice: (String?) -> Unit) {
    val c = Aiimin.colors
    if (r.covers.isEmpty()) return
    SectionHeader("Is this a new version?")
    r.covers.forEach { (old, renewal) ->
        val ask = renewal is Renewal.AskBoth
        val picked = choice == old.cover
        // In the save sheet the buttons show the choice; on a document page they act at once, so "join" leads.
        fun kind(join: Boolean) = if (instant) (if (join) ButtonKind.PRIMARY else ButtonKind.SECONDARY) else if (join == picked) ButtonKind.PRIMARY else ButtonKind.SECONDARY
        Column(Modifier.fillMaxWidth().padding(bottom = 8.dp).clip(Shapes.control).border(1.dp, if (picked) c.text else c.border, Shapes.control).padding(14.dp)) {
            Text("${old.title}${old.provider?.let { " · $it" } ?: ""}", style = Aiimin.type.bodyStrong, maxLines = 2, overflow = TextOverflow.Ellipsis)
            Text(old.expires.day()?.let { "Current version ends ${Dates.short(it)} ${it.year}" } ?: "Current version, no end date", style = Aiimin.type.caption)
            renewalLine(renewal)?.let { Text(it, style = Aiimin.type.caption.copy(color = c.warn), modifier = Modifier.padding(top = 4.dp)) }
            Spacer(Modifier.height(10.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                if (ask) {
                    AppButton("Keep both active", { onChoice(null) }, Modifier.weight(1f), kind = kind(false), compact = true)
                    AppButton("Replace it", { onChoice(old.cover) }, Modifier.weight(1f), kind = kind(true), compact = true)
                } else {
                    AppButton("Yes, new version", { onChoice(old.cover) }, Modifier.weight(1f), kind = kind(true), compact = true)
                    AppButton("No, separate", { onChoice(null) }, Modifier.weight(1f), kind = kind(false), compact = true)
                }
            }
        }
    }
}

/** The default answer: a normal renewal or a gap joins the cover; a long overlap keeps both until the person says. */
internal fun defaultChoice(r: ImportResult): String? = r.covers.firstOrNull { it.second !is Renewal.AskBoth }?.first?.cover

// =================================================================== asset pages

@HiltViewModel
class AssetViewModel @Inject constructor(vault: VaultRepository) : ViewModel() {
    private val key = MutableStateFlow<String?>(null)
    val docs: StateFlow<List<DocEntity>?> = vault.visible.map { list -> list.map { it.doc } }
        .let { f -> kotlinx.coroutines.flow.combine(f, key) { l, k -> if (k == null) null else l.filter { it.subject == k } } }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)

    fun load(k: String) { key.value = k }
}

@Composable
fun AssetScreen(key: String, vm: AssetViewModel = hiltViewModel()) {
    LaunchedEffect(key) { vm.load(key) }
    val nav = LocalNavigator.current
    val docs by vm.docs.collectAsStateWithLifecycle()
    val c = Aiimin.colors
    val home = key.startsWith("home:")
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar(if (home) "Home papers" else key, onBack = { nav.back() })
        val all = docs ?: return@Column
        val today = LocalDate.now()
        // Only current versions on the page; older ones live in each cover's timeline.
        val shown = all.filter { it.current }.sortedWith(compareBy<DocEntity> { it.expires.day() ?: LocalDate.MAX })
        if (shown.isEmpty()) {
            EmptyState(if (home) AppIcons.House else AppIcons.Car, "No papers yet", "Insurance, registration, PUC and service records for this ${if (home) "home" else "vehicle"} gather here.")
            return@Column
        }
        LazyColumn(contentPadding = PaddingValues(bottom = 32.dp)) {
            val soon = shown.filter { d -> d.expires.day()?.let { !it.isAfter(today.plusDays(60)) } == true && d.life() != Lifecycle.A }
            if (soon.isNotEmpty()) item {
                Column(Modifier.padding(horizontal = Aiimin.space.gutter)) {
                    SectionHeader("Needs you soon")
                    soon.forEach { d ->
                        val days = java.time.temporal.ChronoUnit.DAYS.between(today, d.expires.day())
                        ListRow(Registry.byKey(d.docType)?.name ?: d.title, subtitle = if (days < 0) "Lapsed ${-days} days ago" else "Ends in $days days", titleColor = c.text, onClick = { nav.open(Route.Doc(d.id)) })
                        Hairline()
                    }
                }
            }
            item { SectionHeader("All papers", Modifier.padding(horizontal = Aiimin.space.gutter)) }
            items(shown, key = { it.id }) { d ->
                ListRow(
                    Registry.byKey(d.docType)?.name ?: d.title,
                    Modifier.padding(horizontal = Aiimin.space.gutter),
                    subtitle = listOfNotNull(d.provider, d.expires.day()?.let { "until ${Dates.short(it)} ${it.year}" }).joinToString(" · ").ifBlank { d.title },
                    leading = { IconTile(categoryIcon(d.category)) },
                    onClick = { nav.open(Route.Doc(d.id)) },
                )
            }
        }
    }
}
