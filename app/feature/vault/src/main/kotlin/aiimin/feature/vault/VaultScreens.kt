package aiimin.feature.vault

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
        days < 0 -> Tag("Expired", color = c.danger, background = c.dangerSoft)
        days == 0L -> Tag("Expires today", color = c.danger, background = c.dangerSoft)
        days <= 30 -> Tag("$days days", color = c.warn, background = c.warnSoft)
        days <= 90 -> Tag("$days days", color = c.textMuted)
        else -> Unit
    }
}

@Composable
fun VaultScreen(vm: VaultViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val docs by vm.docs.collectAsStateWithLifecycle()
    val people by vm.people.collectAsStateWithLifecycle()
    val viewer by vm.viewer.collectAsStateWithLifecycle()
    val busy by vm.busy.collectAsStateWithLifecycle()
    val last by vm.lastImport.collectAsStateWithLifecycle()
    var cat by remember { mutableStateOf<String?>(null) }
    var adding by remember { mutableStateOf(false) }
    val c = Aiimin.colors

    Box(Modifier.fillMaxSize().background(c.base)) {
        LazyColumn(Modifier.fillMaxSize(), contentPadding = PaddingValues(bottom = 120.dp)) {
            item {
                LargeHeader("Vault", overline = "Private by default · opens inside the app") {
                    AppIconButton(AppIcons.Users, "Family", { nav.open(Route.Family) })
                    AppIconButton(AppIcons.Plus, "Add document", { adding = true })
                }
            }
            if (viewer != ME) {
                item {
                    Panel(Modifier.padding(horizontal = Aiimin.space.gutter, vertical = 4.dp), color = c.violetSoft, onClick = { vm.previewAs(ME) }) {
                        Text("Previewing as ${people.firstOrNull { it.id == viewer }?.name ?: "someone"} — this is exactly what they could see. Tap to return.", style = Aiimin.type.label)
                    }
                }
            }
            item {
                Row(Modifier.fillMaxWidth().horizontalScroll(rememberScrollState()).padding(horizontal = Aiimin.space.gutter, vertical = 8.dp), horizontalArrangement = Arrangement.spacedBy(14.dp)) {
                    people.forEach { p ->
                        Column(Modifier.width(64.dp).clickable { nav.open(Route.Person(p.id)) }, horizontalAlignment = Alignment.CenterHorizontally) {
                            Avatar(p.name, p.hue, size = 52.dp)
                            Spacer(Modifier.height(6.dp))
                            Text(if (p.id == ME) "You" else p.name, style = Aiimin.type.caption.copy(color = c.text), maxLines = 1)
                        }
                    }
                    Column(Modifier.width(64.dp).clickable { cat = null }, horizontalAlignment = Alignment.CenterHorizontally) {
                        Box(Modifier.size(52.dp).clip(CircleShape).background(c.raised), contentAlignment = Alignment.Center) { Icon(AppIcons.House, null, tint = c.textMuted) }
                        Spacer(Modifier.height(6.dp))
                        Text("Household", style = Aiimin.type.caption.copy(color = c.text), maxLines = 1)
                    }
                    Column(Modifier.width(64.dp).clickable { nav.open(Route.Family) }, horizontalAlignment = Alignment.CenterHorizontally) {
                        Box(Modifier.size(52.dp).clip(CircleShape).background(c.surface), contentAlignment = Alignment.Center) { Icon(AppIcons.Plus, null, tint = c.textMuted) }
                        Spacer(Modifier.height(6.dp))
                        Text("Add", style = Aiimin.type.caption, maxLines = 1)
                    }
                }
            }
            val list = docs
            if (list == null) {
                item { Skeleton(Modifier.padding(Aiimin.space.gutter).fillMaxWidth().height(200.dp)) }
                return@LazyColumn
            }
            val expiring = list.filter { (it.daysToExpiry ?: 999) in -30..90 }.sortedBy { it.daysToExpiry }
            if (expiring.isNotEmpty()) {
                item {
                    Column(Modifier.padding(horizontal = Aiimin.space.gutter)) {
                        SectionHeader("Expiry radar")
                        Panel(padding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)) {
                            expiring.take(5).forEach { d ->
                                ListRow(
                                    d.doc.title, subtitle = "${d.ownerName} · ${d.doc.expires?.let { Dates.short(LocalDate.parse(it)) }}",
                                    leading = { IconTile(categoryIcon(d.doc.category), tint = c.warn, background = c.warnSoft) },
                                    trailing = { ExpiryTag(d.daysToExpiry) }, onClick = { nav.open(Route.Doc(d.doc.id)) },
                                )
                            }
                        }
                    }
                }
            }
            item {
                Column(Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 8.dp)) {
                    SectionHeader("Documents · ${list.size}")
                    PillRow {
                        Pill("All", cat == null, { cat = null })
                        DOC_CATEGORIES.filter { k -> list.any { it.doc.category == k } }.forEach { k -> Pill(k, cat == k, { cat = k }, icon = categoryIcon(k)) }
                    }
                }
            }
            val shown = list.filter { cat == null || it.doc.category == cat }
            if (shown.isEmpty()) {
                item {
                    EmptyState(
                        AppIcons.Vault, "Your vault is empty",
                        "IDs, insurance, prescriptions, warranties — for you and your family. Expiry dates are found for you and reminded at 90, 60, 30 and 7 days.",
                        action = "Add a document", onAction = { adding = true },
                    )
                }
            }
            items(shown, key = { it.doc.id }) { d -> DocRow(d) { nav.open(Route.Doc(d.doc.id)) } }
        }
        if (busy) {
            Panel(Modifier.align(Alignment.BottomCenter).padding(bottom = 100.dp), color = c.overlay) {
                Text("Reading your document…", style = Aiimin.type.label)
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
        val scope = rememberCoroutineScope()
        AppSheet({ vm.clearImport() }, title = "Saved to the vault", subtitle = r.duplicateOf?.let { "Looks the same as “${it.title}” you already have." }) {
            SectionHeader("Category")
            PillRow { DOC_CATEGORIES.forEach { k -> Pill(k, category == k, { category = k }) } }
            r.number?.let { ListRow("Number found", subtitle = it, leading = { IconTile(AppIcons.Barcode) }) }
            ListRow(
                "Expires", subtitle = expires?.let { "${Dates.long(it)} — found in the document" } ?: "No date found. Add one for reminders.",
                leading = { IconTile(AppIcons.Hourglass) }, onClick = { pick = true },
            )
            if (expires != null) SwitchRow("Add a renewal task", task, { task = it }, subtitle = "Two weeks before, with reminders at 90/60/30/7 days")
            Spacer(Modifier.height(12.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                AppButton("Open", {
                    scope.launch {
                        vm.doc(r.docId)?.let { d -> vm.setCategory(d, category) }
                        vm.setExpiry(r.docId, expires, task)
                        vm.clearImport()
                        nav.open(Route.Doc(r.docId))
                    }
                }, Modifier.weight(1f), kind = ButtonKind.SECONDARY)
                AppButton("Done", {
                    scope.launch {
                        vm.doc(r.docId)?.let { d -> vm.setCategory(d, category) }
                        vm.setExpiry(r.docId, expires, task)
                        vm.clearImport()
                        toaster.show(if (expires != null) "Saved · reminders set" else "Saved")
                    }
                }, Modifier.weight(1f))
            }
        }
        if (pick) DatePick(expires ?: LocalDate.now().plusYears(1), { expires = it }, { pick = false })
    }
}

@Composable
private fun DocRow(d: DocView, onClick: () -> Unit) {
    val c = Aiimin.colors
    Row(Modifier.fillMaxWidth().clickable(onClick = onClick).padding(horizontal = Aiimin.space.gutter, vertical = 10.dp), verticalAlignment = Alignment.CenterVertically) {
        IconTile(kindIcon(d.doc.ext, d.doc.mime), size = 40.dp)
        Spacer(Modifier.width(12.dp))
        Column(Modifier.weight(1f)) {
            Text(d.doc.title, style = Aiimin.type.bodyStrong, maxLines = 1)
            Text(
                listOfNotNull(d.ownerName, d.doc.category, if (d.access is Access.Granted && (d.access as Access.Granted).why != Access.Why.OWN_ITEM) "Shared with you" else null).joinToString(" · "),
                style = Aiimin.type.caption, maxLines = 1,
            )
        }
        if (d.doc.sensitive) Icon(AppIcons.Lock, "Sensitive", tint = c.textMuted, modifier = Modifier.size(16.dp).padding(end = 2.dp))
        ExpiryTag(d.daysToExpiry)
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
