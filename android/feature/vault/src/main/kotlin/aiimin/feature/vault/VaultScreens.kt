package aiimin.feature.vault

import androidx.compose.foundation.lazy.itemsIndexed
import aiimin.designsystem.component.enterStagger
import aiimin.designsystem.component.RootActions
import aiimin.designsystem.component.DocThumb
import aiimin.designsystem.component.ExpiryVial
import aiimin.designsystem.component.Hairline
import aiimin.designsystem.component.pressable
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.heightIn
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import aiimin.core.data.util.Dates
import aiimin.core.data.vault.DOC_CATEGORIES
import aiimin.core.data.vault.DocKind
import aiimin.core.data.vault.DocView
import aiimin.core.data.vault.ME
import aiimin.core.data.vault.kindOf
import aiimin.core.privacy.Access
import aiimin.core.privacy.HOUSEHOLD
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppIconButton
import aiimin.designsystem.component.AppSheet
import aiimin.designsystem.component.AppTextField
import aiimin.designsystem.component.Avatar
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.DatePick
import aiimin.designsystem.component.EmptyState
import aiimin.designsystem.component.IconTile
import aiimin.designsystem.component.LargeHeader
import aiimin.designsystem.component.ListRow
import aiimin.designsystem.component.Panel
import aiimin.designsystem.component.Pill
import aiimin.designsystem.component.PillRow
import aiimin.designsystem.component.SectionHeader
import aiimin.designsystem.component.Skeleton
import aiimin.designsystem.component.SwitchRow
import aiimin.designsystem.component.Tag
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.LocalToaster
import aiimin.designsystem.nav.Route
import aiimin.designsystem.theme.Aiimin
import aiimin.designsystem.theme.Shapes
import android.app.Activity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.IntentSenderRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Icon
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.google.mlkit.vision.documentscanner.GmsDocumentScannerOptions
import com.google.mlkit.vision.documentscanner.GmsDocumentScanning
import com.google.mlkit.vision.documentscanner.GmsDocumentScanningResult
import java.time.LocalDate
import kotlinx.coroutines.launch

internal fun categoryIcon(cat: String): ImageVector = when (cat) {
    "Identity" -> AppIcons.IdCard
    "Insurance" -> AppIcons.ShieldCheck
    "Health" -> AppIcons.FirstAid
    "Vehicle" -> AppIcons.Car
    "Finance & Tax" -> AppIcons.Bank
    "Property" -> AppIcons.House
    "Education" -> AppIcons.GraduationCap
    "Bills & Warranties" -> AppIcons.Receipt
    "Legal" -> AppIcons.Scales
    else -> AppIcons.Package
}

internal fun kindIcon(ext: String, mime: String): ImageVector = when (kindOf(ext, mime)) {
    DocKind.PDF -> AppIcons.FilePdf
    DocKind.DOCX -> AppIcons.FileDoc
    DocKind.SHEET -> AppIcons.FileXls
    DocKind.CSV -> AppIcons.FileCsv
    DocKind.IMAGE -> AppIcons.ImageIcon
    else -> AppIcons.FileText
}

@Composable
internal fun ExpiryTag(days: Long?) {
    val c = Aiimin.colors
    if (days == null) return
    when {
        // Lapsed and today use the warn colour: the brand has no red.
        days < 0 -> Tag("Lapsed", color = c.warn, background = c.warnSoft)
        days == 0L -> Tag("Ends today", color = c.warn, background = c.warnSoft)
        days <= 30 -> Tag("$days days", color = c.warn, background = c.warnSoft)
        days <= 90 -> Tag("$days days", color = c.textMuted)
        else -> Unit
    }
}

@OptIn(androidx.compose.foundation.layout.ExperimentalLayoutApi::class)
@Composable
fun VaultScreen(vm: VaultViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val docs by vm.docs.collectAsStateWithLifecycle()
    val people by vm.people.collectAsStateWithLifecycle()
    val viewer by vm.viewer.collectAsStateWithLifecycle()
    val busy by vm.busy.collectAsStateWithLifecycle()
    val last by vm.lastImport.collectAsStateWithLifecycle()
    var cat by remember { mutableStateOf<String?>(null) }
    var owner by remember { mutableStateOf(ME) }
    var query by remember { mutableStateOf("") }
    var adding by remember { mutableStateOf(false) }
    val toaster = LocalToaster.current
    val c = Aiimin.colors

    Box(Modifier.fillMaxSize().background(c.base)) {
        LazyColumn(Modifier.fillMaxSize(), contentPadding = PaddingValues(bottom = 32.dp)) {
            item {
                LargeHeader("Vault") {
                    RootActions(0)
                    AppIconButton(AppIcons.Plus, "Add document", { adding = true })
                }
            }
            if (viewer != ME) {
                item {
                    Row(
                        Modifier.padding(horizontal = Aiimin.space.gutter, vertical = 4.dp).fillMaxWidth().clip(Shapes.control).background(c.violetSoft).clickable { vm.previewAs(ME) }.padding(12.dp),
                    ) { Text("Previewing as ${people.firstOrNull { it.id == viewer }?.name ?: "someone"}. This is exactly what they could see. Tap to return.", style = Aiimin.type.label) }
                }
            }
            // person chips: Emergency first, then each vault; wrapping, never scrolling
            item {
                FlowRow(Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 2.dp), horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    PersonChip("Emergency", selected = false, emergency = true) { nav.open(Route.EmergencyCard(ME)) }
                    people.forEach { p -> PersonChip(if (p.id == ME) "Me" else p.name, owner == p.id, onLong = { nav.open(Route.Person(p.id)) }) { owner = p.id; cat = null } }
                    PersonChip("Household", owner == HOUSEHOLD) { owner = HOUSEHOLD; cat = null }
                    PersonChip("Person", false, dashed = true, icon = AppIcons.Plus) { nav.open(Route.Family) }
                }
            }
            item {
                Box(Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 14.dp)) {
                    Row(Modifier.fillMaxWidth().heightIn(min = 48.dp).clip(Shapes.control).background(c.raised).padding(horizontal = 14.dp), verticalAlignment = Alignment.CenterVertically) {
                        Icon(AppIcons.Search, null, tint = c.textFaint, modifier = Modifier.size(20.dp))
                        Spacer(Modifier.width(10.dp))
                        androidx.compose.foundation.layout.Box(Modifier.weight(1f)) {
                            if (query.isEmpty()) Text("Find by name, or the last 4 digits", style = Aiimin.type.body.copy(color = c.textFaint), maxLines = 1, overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis, modifier = Modifier.padding(start = 3.dp))
                            androidx.compose.foundation.text.BasicTextField(query, { query = it }, singleLine = true, textStyle = Aiimin.type.body, cursorBrush = androidx.compose.ui.graphics.SolidColor(c.text), modifier = Modifier.fillMaxWidth())
                        }
                    }
                }
            }
            val all = docs
            if (all == null) {
                item { Skeleton(Modifier.padding(Aiimin.space.gutter).fillMaxWidth().height(200.dp)) }
                return@LazyColumn
            }
            val mine = all.filter { it.doc.owner == owner }
            val q = query.trim().lowercase()
            val shown = mine.filter { (cat == null || it.doc.category == cat) && (q.isEmpty() || it.doc.title.lowercase().contains(q) || (it.doc.number ?: "").lowercase().contains(q) || (it.doc.number ?: "").takeLast(4) == q) }
            val expiring = all.filter { (it.daysToExpiry ?: 9999) in -30..90 }.sortedBy { it.daysToExpiry }.take(3)
            if (q.isEmpty() && expiring.isNotEmpty()) {
                item {
                    Column(Modifier.padding(horizontal = Aiimin.space.gutter)) {
                        SectionHeader("Expiring soon", action = "See all", onAction = { nav.open(Route.Family) })
                        expiring.forEach { d ->
                            Row(Modifier.fillMaxWidth().pressable({ nav.open(Route.Doc(d.doc.id)) }).heightIn(min = 56.dp), verticalAlignment = Alignment.CenterVertically) {
                                Column(Modifier.weight(1f)) {
                                    Text(d.doc.title, style = Aiimin.type.bodyStrong, maxLines = 1, overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis)
                                    Text(d.ownerName, style = Aiimin.type.caption)
                                }
                                val n = d.daysToExpiry ?: 0
                                Text(if (n < 0) "lapsed" else "ends in $n days", style = Aiimin.type.label.copy(color = if (n <= 30) c.warn else c.textMuted, fontWeight = if (n <= 30) FontWeight.SemiBold else FontWeight.Normal, fontSize = 13.5.sp))
                            }
                            Hairline()
                        }
                    }
                }
            }
            val packs = if (q.isEmpty()) readyPacks(mine) else emptyList()
            if (packs.isNotEmpty()) {
                item {
                    Column(Modifier.padding(horizontal = Aiimin.space.gutter)) {
                        SectionHeader("Ready packs")
                        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) { packs.forEach { p -> PackCard(p, Modifier.weight(1f)) { adding = true } }; if (packs.size == 1) Spacer(Modifier.weight(1f)) }
                    }
                }
            }
            item {
                Column(Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 18.dp)) {
                    // Filter chips only once there is something to filter ("All 0" said nothing).
                    if (mine.isNotEmpty()) FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Pill("All ${mine.size}", cat == null, { cat = null })
                        DOC_CATEGORIES.filter { k -> mine.any { it.doc.category == k } }.forEach { k -> Pill("$k ${mine.count { it.doc.category == k }}", cat == k, { cat = k }) }
                    }
                    SectionHeader((if (owner == ME) "My" else if (owner == HOUSEHOLD) "Household" else (people.firstOrNull { it.id == owner }?.name ?: "") + "'s") + " · " + (if (q.isEmpty()) "recently opened" else "results"))
                }
            }
            if (shown.isEmpty()) {
                item {
                    EmptyState(
                        AppIcons.Archive,
                        if (mine.isEmpty()) "Keep your family's papers here" else "Nothing matches",
                        if (mine.isEmpty()) "They open in the app, and expiry dates turn into reminders. Files stay on this phone; AIIMIN never uploads them." else "Try the title, or the last 4 digits of a number.",
                        action = if (mine.isEmpty()) "Add a document" else null, onAction = { adding = true },
                    )
                }
            }
            itemsIndexed(shown.sortedByDescending { it.doc.createdAt }, key = { _, it -> it.doc.id }) { i, d ->
                Column(Modifier.enterStagger(i)) {
                    DocRow(d) { nav.open(Route.Doc(d.doc.id)) }
                    Hairline(Modifier.padding(start = Aiimin.space.gutter + 54.dp, end = Aiimin.space.gutter))
                }
            }
            item {
                // The empty state already promises files stay on the phone; the count line is for a vault with papers.
                if (all.isNotEmpty()) Text(
                    "${all.size} ${if (all.size == 1) "document" else "documents"} · ${"%.1f".format(all.sumOf { it.doc.sizeBytes } / 1_048_576.0)} MB on this phone. Files stay on this phone; AIIMIN never uploads them.",
                    style = Aiimin.type.caption.copy(fontSize = 12.sp), modifier = Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 16.dp),
                )
                val backupLine = remember(all.size) { vm.backupLine() }
                if (all.isNotEmpty()) backupLine?.let {
                    Text(it, style = Aiimin.type.caption.copy(fontSize = 12.sp, color = if (it.startsWith("This week")) c.warn else c.textMuted), modifier = Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 4.dp).clickable { nav.open(Route.VaultBackup) })
                }
                // Everything else the vault does, as a quiet 2-column grid instead of a row of orange links.
                aiimin.designsystem.component.ToolGrid(
                    "Vault tools",
                    listOf(
                        aiimin.designsystem.component.Tool(AppIcons.Users, "Family", opens = Route.Family) { nav.open(Route.Family) },
                        aiimin.designsystem.component.Tool(AppIcons.FirstAid, "Emergency card", opens = Route.EmergencyCard(ME)) { nav.open(Route.EmergencyCard(ME)) },
                        aiimin.designsystem.component.Tool(AppIcons.CloudArrowUp, "Backups", opens = Route.VaultBackup) { nav.open(Route.VaultBackup) },
                        aiimin.designsystem.component.Tool(AppIcons.FirstAidKit, "Emergency kits", opens = Route.EmergencyKits) { nav.open(Route.EmergencyKits) },
                        aiimin.designsystem.component.Tool(AppIcons.Eye, "Who saw what", opens = Route.Activity) { nav.open(Route.Activity) },
                    ),
                    Modifier.padding(horizontal = Aiimin.space.gutter),
                )
                Spacer(Modifier.height(24.dp))
            }
        }
        if (busy) {
            Box(Modifier.align(Alignment.BottomCenter).padding(bottom = 100.dp).clip(Shapes.control).background(c.text).padding(horizontal = 16.dp, vertical = 12.dp)) {
                Text("Reading your document…", style = Aiimin.type.label.copy(color = c.onInk))
            }
        }
    }

    if (adding) AddDocSheet(people.map { it.id to (if (it.id == ME) "You" else it.name) } + (HOUSEHOLD to "Household"), onDismiss = { adding = false }) { uris, owner, sensitive ->
        vm.import(uris, owner, sensitive)
        adding = false
    }
    last?.let { r ->
        var expires by remember(r.docId) { mutableStateOf(r.expires) }
        var task by remember(r.docId) { mutableStateOf(true) }
        var pick by remember { mutableStateOf(false) }
        var category by remember(r.docId) { mutableStateOf(r.category) }
        var title by remember(r.docId) { mutableStateOf("") }
        var join by remember(r.docId) { mutableStateOf(defaultChoice(r)) }
        LaunchedEffect(r.docId) { title = vm.doc(r.docId)?.title.orEmpty() }
        val scope = rememberCoroutineScope()
        suspend fun commit() {
            vm.doc(r.docId)?.let { d -> vm.saveDoc(d.copy(category = category, title = title.trim().ifBlank { d.title })) }
            vm.saveVersion(r.docId, join, expires, task)
            vm.clearImport()
        }
        AppSheet({ scope.launch { commit() } }, title = "Saved to the vault", subtitle = r.duplicateOf?.let { "This file is already in the vault as “${it.title}”." }) {
            AppTextField(title, { title = it }, label = "Title")
            if (r.duplicateOf != null) {
                Row(Modifier.padding(top = 8.dp), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    AppButton("Open the old one", { scope.launch { vm.removeCopy(r.docId); vm.clearImport(); nav.open(Route.Doc(r.duplicateOf!!.id)) } }, compact = true, kind = ButtonKind.SECONDARY)
                    AppButton("Remove this copy", { scope.launch { vm.removeCopy(r.docId); vm.clearImport(); toaster.show("Copy removed") } }, compact = true, kind = ButtonKind.GHOST)
                }
            }
            if (r.duplicateOf == null) VersionPrompt(r, join) { join = it }
            SectionHeader(r.typeName?.let { "Category · looks like a $it" } ?: "Category")
            PillRow { DOC_CATEGORIES.forEach { k -> Pill(k, category == k, { category = k }) } }
            r.number?.let { ListRow("Number found", subtitle = it, leading = { IconTile(AppIcons.Barcode) }) }
            ListRow(
                "Expires", subtitle = expires?.let { "${Dates.longYear(it)} · found in the document" } ?: "No date found. Add one for reminders.",
                leading = { IconTile(AppIcons.Hourglass) }, onClick = { pick = true },
            )
            if (expires == null) r.suggestedEnd?.let { s ->
                // The registry's length is only a suggestion; a date read from the paper always wins.
                ListRow("Usually ends ${Dates.longYear(s)}", subtitle = "Check your document. Tap to use this date", leading = { IconTile(AppIcons.CalendarCheck) }, onClick = { expires = s })
            }
            if (expires != null) SwitchRow("Add a renewal task", task, { task = it }, subtitle = "Two weeks before, with reminders at 90/60/30/7 days")
            Text("Stored only on this phone. Documents you store are your responsibility; keep the originals.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 6.dp))
            Spacer(Modifier.height(12.dp))
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                AppButton("Open", { scope.launch { commit(); nav.open(Route.Doc(r.docId)) } }, Modifier.weight(1f), kind = ButtonKind.SECONDARY)
                AppButton("Done", { scope.launch { commit(); toaster.show(if (expires != null) "Saved · reminders set" else "Saved") } }, Modifier.weight(1f))
            }
        }
        if (pick) DatePick(expires ?: LocalDate.now().plusYears(1), { expires = it }, { pick = false })
    }
}

@Composable
private fun DocRow(d: DocView, onClick: () -> Unit) {
    val c = Aiimin.colors
    val days = d.daysToExpiry
    val left = days?.let { (it / 365f).coerceIn(0f, 1f) }
    Row(Modifier.fillMaxWidth().pressable(onClick).padding(horizontal = Aiimin.space.gutter).heightIn(min = 76.dp), verticalAlignment = Alignment.CenterVertically) {
        DocThumb(locked = d.doc.sensitive)
        Spacer(Modifier.width(14.dp))
        Column(Modifier.weight(1f).padding(vertical = 10.dp)) {
            Text(d.doc.title, style = Aiimin.type.bodyStrong, maxLines = 1, overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis)
            Text(
                listOfNotNull(d.ownerName, d.doc.category, d.doc.number?.let { n -> if (d.doc.sensitive) null else n.takeLast(4).let { "••••$it" } }, if (d.access is Access.Granted && (d.access as Access.Granted).why != Access.Why.OWN_ITEM) "Shared with you" else null).joinToString(" · "),
                style = Aiimin.type.caption, maxLines = 1, overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis,
            )
            val line = when {
                days == null -> "No expiry"
                days < 0 -> "Lapsed ${-days} days ago"
                days <= 120 -> "Expires ${d.doc.expires?.let { Dates.short(LocalDate.parse(it)) }} · $days days"
                else -> "Valid to ${d.doc.expires?.let { Dates.short(LocalDate.parse(it)) }}"
            }
            Text(line, style = Aiimin.type.caption.copy(color = if (days != null && days <= 36) c.warn else c.textMuted, fontWeight = if (days != null && days <= 36) androidx.compose.ui.text.font.FontWeight.SemiBold else androidx.compose.ui.text.font.FontWeight.Normal))
        }
        ExpiryVial(left)
    }
}

@Composable
private fun PersonChip(text: String, selected: Boolean, emergency: Boolean = false, dashed: Boolean = false, icon: androidx.compose.ui.graphics.vector.ImageVector? = null, onLong: (() -> Unit)? = null, onClick: () -> Unit) {
    val c = Aiimin.colors
    val onInk = c.onInk
    val shape = androidx.compose.foundation.shape.RoundedCornerShape(8.dp)
    val emColor = c.danger
    val fg = when { emergency -> c.warn; selected -> onInk; dashed -> c.textMuted; else -> c.text }
    @OptIn(androidx.compose.foundation.ExperimentalFoundationApi::class)
    Row(
        Modifier.clip(shape)
            .then(if (selected) Modifier.background(c.text) else Modifier)
            .then(
                if (!selected) Modifier.border(if (emergency) 1.5.dp else 1.dp, if (emergency) emColor else c.borderStrong, shape) else Modifier,
            )
            .combinedClickable(onClick = onClick, onLongClick = onLong)
            .heightIn(min = 40.dp).padding(horizontal = 14.dp),
        verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(7.dp),
    ) {
        if (emergency) Icon(AppIcons.Heartbeat, null, tint = fg, modifier = Modifier.size(17.dp)) else if (icon != null) Icon(icon, null, tint = fg, modifier = Modifier.size(15.dp))
        Text(text, style = Aiimin.type.label.copy(color = fg, fontSize = 14.5.sp, fontWeight = androidx.compose.ui.text.font.FontWeight.Medium))
    }
}

private data class Pack(val title: String, val have: Int, val total: Int, val missing: String?)

/** Packs are computed from what the person actually holds, never invented. */
private fun readyPacks(mine: List<DocView>): List<Pack> {
    fun has(vararg k: String) = mine.any { d -> k.any { d.doc.title.contains(it, true) || d.doc.category.contains(it, true) } }
    val defs = listOf(
        Triple("Passport renewal", listOf("Old passport" to has("passport"), "ID proof" to has("pan", "aadhaar", "licence", "identity"), "Address proof" to has("rent", "agreement", "electricity", "bill"), "Photos" to has("photo")), has("passport")),
        Triple("Car insurance renewal", listOf("Policy" to has("insurance", "policy"), "RC book" to has("rc book", "registration"), "PUC" to has("puc"), "ID proof" to has("pan", "aadhaar", "licence", "identity")), has("car", "motor", "vehicle")),
    )
    return defs.filter { it.third }.map { (t, items, _) -> Pack(t, items.count { it.second }, items.size, items.firstOrNull { !it.second }?.first?.let { "$it missing" }) }
}

@Composable
private fun PackCard(p: Pack, modifier: Modifier, onClick: () -> Unit) {
    val c = Aiimin.colors
    val shape = androidx.compose.foundation.shape.RoundedCornerShape(14.dp)
    Column(modifier.clip(shape).background(c.surface).border(1.dp, c.border, shape).pressable(onClick).padding(14.dp)) {
        Text(p.title, style = Aiimin.type.headline.copy(fontSize = 16.sp, lineHeight = 20.sp), minLines = 2)
        Spacer(Modifier.height(12.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(3.dp)) {
            repeat(p.total) { i -> Box(Modifier.weight(1f).height(5.dp).clip(androidx.compose.foundation.shape.RoundedCornerShape(2.dp)).background(if (i < p.have) c.text else c.borderStrong)) }
        }
        Spacer(Modifier.height(10.dp))
        Text("${p.have} of ${p.total} ready" + (p.missing?.let { " · $it" } ?: ""), style = Aiimin.type.caption.copy(color = if (p.missing != null) c.warn else c.done, fontWeight = androidx.compose.ui.text.font.FontWeight.Medium, fontSize = 12.sp))
    }
}

@Composable
internal fun AddDocSheet(owners: List<Pair<String, String>>, onDismiss: () -> Unit, onPicked: (List<android.net.Uri>, String, Boolean) -> Unit) {
    val context = LocalContext.current
    val toaster = LocalToaster.current
    var owner by remember { mutableStateOf(ME) }
    var sensitive by remember { mutableStateOf(false) }
    val files = rememberLauncherForActivityResult(ActivityResultContracts.OpenMultipleDocuments()) { uris -> if (uris.isNotEmpty()) onPicked(uris, owner, sensitive) }
    val scan = rememberLauncherForActivityResult(ActivityResultContracts.StartIntentSenderForResult()) { res ->
        if (res.resultCode == Activity.RESULT_OK) {
            GmsDocumentScanningResult.fromActivityResultIntent(res.data)?.pdf?.uri?.let { onPicked(listOf(it), owner, sensitive) }
        }
    }
    AppSheet(onDismiss, title = "Add to the vault", subtitle = "Read on this phone: expiry dates, policy and ID numbers are found for you.") {
        SectionHeader("Whose")
        PillRow { owners.forEach { (id, name) -> Pill(name, owner == id, { owner = id }) } }
        SwitchRow("Sensitive", sensitive, { sensitive = it }, subtitle = "Encrypted with this phone's key; never read by the assistant", icon = AppIcons.Lock)
        Spacer(Modifier.height(8.dp))
        ListRow("Scan pages", subtitle = "Camera, multiple pages, one PDF with text", leading = { IconTile(AppIcons.Scan) }, onClick = {
            val activity = context as? Activity ?: return@ListRow
            val opts = GmsDocumentScannerOptions.Builder()
                .setGalleryImportAllowed(true).setPageLimit(20)
                .setResultFormats(GmsDocumentScannerOptions.RESULT_FORMAT_PDF)
                .setScannerMode(GmsDocumentScannerOptions.SCANNER_MODE_FULL).build()
            GmsDocumentScanning.getClient(opts).getStartScanIntent(activity)
                .addOnSuccessListener { scan.launch(IntentSenderRequest.Builder(it).build()) }
                .addOnFailureListener { toaster.show("Scanner isn't available on this phone") }
        })
        ListRow("Choose files", subtitle = "PDF, Word, Excel, CSV, images, text", leading = { IconTile(AppIcons.Upload) }, onClick = {
            files.launch(arrayOf("application/pdf", "image/*", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel", "text/*", "application/json"))
        })
    }
}
