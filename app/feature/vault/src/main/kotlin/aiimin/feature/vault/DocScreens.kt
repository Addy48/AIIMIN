package aiimin.feature.vault

import aiimin.core.data.settings.Codecs
import aiimin.core.data.util.Dates
import aiimin.core.data.vault.DOC_CATEGORIES
import aiimin.core.data.vault.DocKind
import aiimin.core.data.vault.ME
import aiimin.core.data.vault.kindOf
import aiimin.core.database.DocEntity
import aiimin.core.database.PersonEntity
import aiimin.core.privacy.Access
import aiimin.core.privacy.AccessLevel
import aiimin.core.privacy.HOUSEHOLD
import aiimin.core.privacy.Role
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppIconButton
import aiimin.designsystem.component.AppSheet
import aiimin.designsystem.component.AppTextField
import aiimin.designsystem.component.Avatar
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.DatePick
import aiimin.designsystem.component.EmptyState
import aiimin.designsystem.component.Hairline
import aiimin.designsystem.component.IconTile
import aiimin.designsystem.component.ListRow
import aiimin.designsystem.component.Panel
import aiimin.designsystem.component.Pill
import aiimin.designsystem.component.PillRow
import aiimin.designsystem.component.SectionHeader
import aiimin.designsystem.component.Segmented
import aiimin.designsystem.component.Skeleton
import aiimin.designsystem.component.SwitchRow
import aiimin.designsystem.component.Tag
import aiimin.designsystem.component.TopBar
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.LocalToaster
import aiimin.designsystem.nav.Route
import aiimin.designsystem.theme.Aiimin
import aiimin.designsystem.theme.Shapes
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.pdf.PdfRenderer
import android.net.Uri
import android.os.ParcelFileDescriptor
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectTransformGestures
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.produceState
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.FileProvider
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import java.io.File
import java.time.LocalDate
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

// =================================================================== doc viewer

@Composable
fun DocScreen(id: String, vm: DocViewModel = hiltViewModel()) {
    LaunchedEffect(id) { vm.load(id) }
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    val context = LocalContext.current
    val view by vm.view.collectAsStateWithLifecycle()
    val file by vm.file.collectAsStateWithLifecycle()
    val people by vm.people.collectAsStateWithLifecycle()
    val log by vm.log.collectAsStateWithLifecycle()
    var menu by remember { mutableStateOf(false) }
    var sharing by remember { mutableStateOf(false) }
    var remind by remember { mutableStateOf(false) }
    var info by remember { mutableStateOf(false) }
    val c = Aiimin.colors
    val v = view
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar(v?.doc?.title ?: "Document", onBack = { nav.back() }) {
            if (v != null) AppIconButton(AppIcons.More, "More", { menu = true })
        }
        if (v == null) {
            EmptyState(AppIcons.Lock, "Not available", "This document is private, or no longer in the vault.")
            return@Column
        }
        val d = v.doc
        Row(Modifier.fillMaxWidth().padding(horizontal = Aiimin.space.gutter, vertical = 4.dp).horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
            Tag(v.ownerName, icon = AppIcons.Me)
            Tag(d.category, icon = categoryIcon(d.category))
            d.expires?.let { Tag("Expires ${Dates.short(LocalDate.parse(it))}", icon = AppIcons.Hourglass, color = if ((v.daysToExpiry ?: 999) <= 30) c.warn else c.textMuted) }
            d.number?.let { Tag(it, icon = AppIcons.Barcode) }
            if (d.sensitive) Tag("Sensitive", icon = AppIcons.Lock)
            if (d.pages > 1) Tag("${d.pages} pages")
        }
        Box(Modifier.weight(1f).fillMaxWidth()) {
            val f = file
            if (f == null) Skeleton(Modifier.padding(Aiimin.space.gutter).fillMaxWidth().height(320.dp)) else DocBody(d, f)
        }
        Hairline()
        Row(Modifier.fillMaxWidth().navigationBarsPadding().padding(horizontal = 8.dp, vertical = 6.dp), horizontalArrangement = Arrangement.SpaceAround) {
            BarAction(AppIcons.Share, "Share") {
                scope.launch {
                    val copy = vm.shareCopy(d)
                    val uri = FileProvider.getUriForFile(context, context.packageName + ".files", copy)
                    context.startActivity(Intent.createChooser(Intent(Intent.ACTION_SEND).setType(d.mime).putExtra(Intent.EXTRA_STREAM, uri).addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION), "Share ${d.title}"))
                }
            }
            BarAction(AppIcons.Chat, "Ask AI") {
                if (d.sensitive) toaster.show("Sensitive documents are never read by the assistant")
                else nav.open(Route.Assistant(prompt = "About ${d.title}: ", context = "doc:${d.id}"))
            }
            BarAction(AppIcons.Bell, "Remind") { remind = true }
            BarAction(AppIcons.Users, "Access") { sharing = true }
        }
    }
    val d = v?.doc ?: return
    if (menu) {
        var title by remember { mutableStateOf(d.title) }
        AppSheet({ menu = false }, title = "Document") {
            AppTextField(title, { title = it }, label = "Name")
            if (title != d.title && title.isNotBlank()) AppButton("Rename", { vm.rename(d, title); menu = false }, compact = true, modifier = Modifier.padding(top = 8.dp))
            SectionHeader("Category")
            PillRow { DOC_CATEGORIES.forEach { k -> Pill(k, d.category == k, { vm.setCategory(d, k) }) } }
            SectionHeader("Move to")
            PillRow {
                (people.map { it.id to if (it.id == ME) "You" else it.name } + (HOUSEHOLD to "Household")).forEach { (id, n) -> Pill(n, d.owner == id, { vm.move(d, id) }) }
            }
            ListRow("Why you can see this", subtitle = whyText(v.access), leading = { IconTile(AppIcons.Info) }, onClick = { info = true }, maxSubtitleLines = 2)
            ListRow("Open with another app", leading = { IconTile(AppIcons.ArrowUpRight) }, onClick = {
                scope.launch {
                    val copy = vm.shareCopy(d)
                    val uri = FileProvider.getUriForFile(context, context.packageName + ".files", copy)
                    runCatching { context.startActivity(Intent(Intent.ACTION_VIEW).setDataAndType(uri, d.mime).addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)) }
                        .onFailure { toaster.show("No app can open this type") }
                }
            })
            ListRow("Delete", titleColor = c.danger, leading = { IconTile(AppIcons.Trash, tint = c.danger, background = c.dangerSoft) }, onClick = {
                scope.launch {
                    vm.delete(d)?.let { old -> toaster.undo("Document deleted") { vm.restore(old) } }
                    menu = false
                    nav.back()
                }
            })
        }
    }
    if (remind) {
        var date by remember { mutableStateOf(d.expires?.let(LocalDate::parse)) }
        var task by remember { mutableStateOf(true) }
        var pick by remember { mutableStateOf(false) }
        AppSheet({ remind = false }, title = "Expiry & reminders", subtitle = "Reminders at 90, 60, 30 and 7 days, a calendar marker on the day, and an optional renewal task.") {
            ListRow("Expires", subtitle = date?.let(Dates::long) ?: "Not set", leading = { IconTile(AppIcons.Hourglass) }, onClick = { pick = true })
            SwitchRow("Renewal task two weeks before", task, { task = it })
            Spacer(Modifier.height(12.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                if (d.expires != null) AppButton("Clear", { vm.setExpiry(d, null, false); remind = false }, Modifier.weight(1f), kind = ButtonKind.SECONDARY)
                AppButton("Save", { vm.setExpiry(d, date, task); remind = false; toaster.show("Reminders set") }, Modifier.weight(1f), enabled = date != null)
            }
        }
        if (pick) DatePick(date ?: LocalDate.now().plusYears(1), { date = it }, { pick = false })
    }
    if (sharing) ShareSheet(d, v.shares.map { it.who to it.level }, people, log.size, onShare = { who, level, whenKind, until -> vm.share(d, who, level, whenKind, until) }, onUnshare = { vm.unshare(d, it) }, onDismiss = { sharing = false })
    if (info) {
        AppSheet({ info = false }, title = "Access") {
            Text(whyText(v.access), style = Aiimin.type.body)
            Spacer(Modifier.height(12.dp))
            SectionHeader("Who opened it")
            if (log.isEmpty()) Text("Nobody outside its vault has opened it.", style = Aiimin.type.caption)
            log.take(10).forEach { a ->
                ListRow("${people.firstOrNull { it.id == a.by }?.name ?: a.by} · ${a.action}", subtitle = java.text.DateFormat.getDateTimeInstance().format(java.util.Date(a.at)))
            }
        }
    }
}

private fun whyText(a: Access): String = when (a) {
    is Access.Granted -> when (a.why) {
        Access.Why.OWN_ITEM -> "It's in a vault you hold."
        Access.Why.HOUSEHOLD_SPACE -> "It's in the shared Household vault."
        Access.Why.SHARED_WITH_YOU -> "Shared with you (${a.level.name.lowercase()})."
        Access.Why.CAREGIVER -> "You're the named caregiver for this category."
        Access.Why.EMERGENCY_GRANT -> "Emergency access, read-only, until it expires."
        else -> "Allowed."
    }
    is Access.Denied -> "Private."
}

@Composable
private fun BarAction(icon: androidx.compose.ui.graphics.vector.ImageVector, label: String, onClick: () -> Unit) {
    Column(Modifier.clip(Shapes.row).clickable(onClick = onClick).padding(horizontal = 14.dp, vertical = 6.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        Icon(icon, null, tint = Aiimin.colors.text, modifier = Modifier.size(22.dp))
        Text(label, style = Aiimin.type.caption.copy(color = Aiimin.colors.text))
    }
}

@Composable
private fun DocBody(d: DocEntity, f: File) {
    when (kindOf(d.ext, d.mime)) {
        DocKind.PDF -> PdfPages(f)
        DocKind.IMAGE -> Zoomable {
            val bmp by produceState<Bitmap?>(null, f) { value = withContext(Dispatchers.IO) { decodeSampled(f, 2400) } }
            bmp?.let { Image(it.asImageBitmap(), d.title, Modifier.fillMaxWidth(), contentScale = ContentScale.Fit) }
        }
        DocKind.CSV -> CsvTable(d.text.ifBlank { runCatching { f.readText() }.getOrDefault("") })
        DocKind.TEXT, DocKind.DOCX, DocKind.SHEET -> ReadingView(d.text.ifBlank { if (kindOf(d.ext, d.mime) == DocKind.TEXT) runCatching { f.readText() }.getOrDefault("") else "" })
        DocKind.OTHER -> EmptyState(AppIcons.FileText, "Preview not available", "Share it or open it with another app from the menu. Any text found is searchable and the assistant can read it.")
    }
}

private fun decodeSampled(f: File, maxSide: Int): Bitmap? {
    val o = BitmapFactory.Options().apply { inJustDecodeBounds = true }
    BitmapFactory.decodeFile(f.absolutePath, o)
    var sample = 1
    while (o.outWidth / sample > maxSide || o.outHeight / sample > maxSide) sample *= 2
    return BitmapFactory.decodeFile(f.absolutePath, BitmapFactory.Options().apply { inSampleSize = sample })
}

@Composable
private fun Zoomable(content: @Composable () -> Unit) {
    var scale by remember { mutableFloatStateOf(1f) }
    var offset by remember { mutableStateOf(Offset.Zero) }
    Box(
        Modifier.fillMaxSize().pointerInput(Unit) {
            detectTransformGestures { _, pan, zoom, _ ->
                scale = (scale * zoom).coerceIn(1f, 5f)
                offset = if (scale == 1f) Offset.Zero else offset + pan
            }
        },
        contentAlignment = Alignment.Center,
    ) {
        Box(Modifier.graphicsLayer { scaleX = scale; scaleY = scale; translationX = offset.x; translationY = offset.y }) { content() }
    }
}

@Composable
private fun PdfPages(f: File) {
    val pages by produceState(0, f) {
        value = withContext(Dispatchers.IO) { runCatching { ParcelFileDescriptor.open(f, ParcelFileDescriptor.MODE_READ_ONLY).use { PdfRenderer(it).use { r -> r.pageCount } } }.getOrDefault(0) }
    }
    val c = Aiimin.colors
    if (pages == 0) return
    Zoomable {
        LazyColumn(Modifier.fillMaxSize(), contentPadding = PaddingValues(12.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            items((0 until pages).toList()) { i ->
                val bmp by produceState<Bitmap?>(null, f, i) {
                    value = withContext(Dispatchers.IO) {
                        runCatching {
                            ParcelFileDescriptor.open(f, ParcelFileDescriptor.MODE_READ_ONLY).use { fd ->
                                PdfRenderer(fd).use { r ->
                                    r.openPage(i).use { p ->
                                        val w = 1400
                                        val h = (w.toFloat() * p.height / p.width).toInt()
                                        Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888).also { b ->
                                            b.eraseColor(android.graphics.Color.WHITE)
                                            p.render(b, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY)
                                        }
                                    }
                                }
                            }
                        }.getOrNull()
                    }
                }
                Column {
                    val b = bmp
                    if (b == null) Skeleton(Modifier.fillMaxWidth().aspectRatio(0.707f)) else
                        Image(b.asImageBitmap(), "Page ${i + 1}", Modifier.fillMaxWidth().clip(Shapes.small).border(1.dp, c.border, Shapes.small), contentScale = ContentScale.FillWidth)
                    Text("${i + 1} / $pages", style = Aiimin.type.caption, modifier = Modifier.align(Alignment.CenterHorizontally).padding(top = 4.dp))
                }
            }
        }
    }
}

@Composable
private fun ReadingView(text: String) {
    if (text.isBlank()) {
        EmptyState(AppIcons.FileText, "No text to show", "This file has no readable text. Share or open it with another app from the menu.")
        return
    }
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(horizontal = 24.dp, vertical = 16.dp)) {
        Text(text, style = Aiimin.type.body.copy(fontSize = 16.sp, lineHeight = 26.sp))
    }
}

@Composable
private fun CsvTable(text: String) {
    val c = Aiimin.colors
    val rows = text.lineSequence().filter { it.isNotBlank() }.take(500).map { parseCsvLine(it) }.toList()
    if (rows.isEmpty()) {
        ReadingView(text)
        return
    }
    val cols = rows.maxOf { it.size }
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).horizontalScroll(rememberScrollState()).padding(12.dp)) {
        rows.forEachIndexed { r, cells ->
            Row(Modifier.background(if (r == 0) c.raised else if (r % 2 == 0) c.surface else Color.Transparent)) {
                (0 until cols).forEach { i ->
                    Text(
                        cells.getOrElse(i) { "" }, style = (if (r == 0) Aiimin.type.label.copy(fontWeight = FontWeight.SemiBold) else Aiimin.type.body).copy(fontFeatureSettings = "tnum"),
                        modifier = Modifier.width(120.dp).padding(horizontal = 8.dp, vertical = 8.dp), maxLines = 2,
                    )
                }
            }
        }
    }
}

private fun parseCsvLine(line: String): List<String> {
    val out = mutableListOf<String>()
    val sb = StringBuilder()
    var quoted = false
    var i = 0
    while (i < line.length) {
        val ch = line[i]
        when {
            ch == '"' && quoted && i + 1 < line.length && line[i + 1] == '"' -> { sb.append('"'); i++ }
            ch == '"' -> quoted = !quoted
            ch == ',' && !quoted -> { out += sb.toString(); sb.clear() }
            else -> sb.append(ch)
        }
        i++
    }
    out += sb.toString()
    return out
}

@Composable
private fun ShareSheet(
    d: DocEntity,
    current: List<Pair<String, String>>,
    people: List<PersonEntity>,
    opened: Int,
    onShare: (String, AccessLevel, String, LocalDate?) -> Unit,
    onUnshare: (String) -> Unit,
    onDismiss: () -> Unit,
) {
    val others = people.filter { it.id != d.owner && it.id != ME || (d.owner != ME && it.id == ME) }.filter { it.id != d.owner }
    AppSheet(onDismiss, title = "Who can see this", subtitle = "Private by default. Shares are per person, and every access is logged ($opened so far).") {
        if (others.isEmpty()) Text("Add family in Vault → Family to share with someone.", style = Aiimin.type.caption)
        others.forEach { p ->
            val level = current.firstOrNull { it.first == p.id }?.second
            var whenKind by remember(p.id) { mutableStateOf("NOW") }
            Panel(Modifier.padding(vertical = 4.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Avatar(p.name, p.hue, size = 32.dp)
                    Spacer(Modifier.width(10.dp))
                    Text(p.name, style = Aiimin.type.bodyStrong, modifier = Modifier.weight(1f))
                    Text(level?.lowercase()?.replaceFirstChar { it.uppercase() } ?: "No access", style = Aiimin.type.caption)
                }
                Spacer(Modifier.height(8.dp))
                Segmented(listOf("None", "Summary", "View"), when (level) { "SUMMARY" -> 1; "VIEW", "EDIT", "COMMENT" -> 2; else -> 0 }, { i ->
                    when (i) {
                        0 -> onUnshare(p.id)
                        1 -> onShare(p.id, AccessLevel.SUMMARY, whenKind, null)
                        else -> onShare(p.id, AccessLevel.VIEW, whenKind, null)
                    }
                })
                PillRow {
                    listOf("NOW" to "Now", "UNTIL" to "For 30 days", "EMERGENCY" to "Emergency only", "AFTER_DEATH" to "After death").forEach { (k, l) ->
                        Pill(l, whenKind == k, {
                            whenKind = k
                            if (level != null) onShare(p.id, if (level == "SUMMARY") AccessLevel.SUMMARY else AccessLevel.VIEW, k, if (k == "UNTIL") LocalDate.now().plusDays(30) else null)
                        })
                    }
                }
            }
        }
    }
}

// =================================================================== person

@Composable
fun PersonScreen(id: String, vm: PersonViewModel = hiltViewModel()) {
    LaunchedEffect(id) { vm.load(id) }
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val p by vm.person.collectAsStateWithLifecycle()
    val docs by vm.docs.collectAsStateWithLifecycle()
    val tasks by vm.tasksFor.collectAsStateWithLifecycle()
    val requests by vm.requests.collectAsStateWithLifecycle()
    var editCard by remember { mutableStateOf(false) }
    var delegate by remember { mutableStateOf(false) }
    var newTask by remember { mutableStateOf("") }
    val c = Aiimin.colors
    val person = p
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar(person?.name ?: "", onBack = { nav.back() }) {
            if (person != null && person.id != ME) AppIconButton(AppIcons.Eye, "Preview the app as ${person.name}", { vm.previewAs(person.id); toaster.show("Previewing as ${person.name}"); nav.open(Route.Vault) })
        }
        if (person == null) return@Column
        val role = runCatching { Role.valueOf(person.role) }.getOrDefault(Role.ADULT)
        LazyColumn(contentPadding = PaddingValues(Aiimin.space.gutter)) {
            item {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Avatar(person.name, person.hue, size = 64.dp)
                    Spacer(Modifier.width(14.dp))
                    Column {
                        Text(person.name, style = Aiimin.type.title)
                        Text(listOf(person.relation, role.label).filter { it.isNotBlank() }.joinToString(" · "), style = Aiimin.type.caption)
                        Spacer(Modifier.height(4.dp))
                        Tag(
                            when {
                                person.id == ME -> "You"
                                person.pending -> "Invite pending"
                                person.linked -> "Own account · private items stay private"
                                else -> "Managed by you"
                            },
                        )
                    }
                }
                Spacer(Modifier.height(16.dp))
            }
            item {
                Panel(onClick = { nav.open(Route.EmergencyCard(person.id)) }) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        IconTile(AppIcons.FirstAid, tint = c.danger, background = c.dangerSoft)
                        Spacer(Modifier.width(12.dp))
                        Column(Modifier.weight(1f)) {
                            Text("Emergency card", style = Aiimin.type.bodyStrong)
                            Text(listOf(person.blood.ifBlank { "Blood group —" }, person.allergies.ifBlank { "Allergies —" }).joinToString(" · "), style = Aiimin.type.caption)
                        }
                        Text("Edit", style = Aiimin.type.label.copy(color = c.accent), modifier = Modifier.clickable { editCard = true }.padding(8.dp))
                    }
                }
            }
            item {
                SectionHeader("Documents · ${docs.size}")
                if (docs.isEmpty()) Text(if (person.linked && person.id != ME) "Their documents are private. They can share items with you." else "Nothing here yet.", style = Aiimin.type.caption)
            }
            items(docs, key = { it.doc.id }) { d ->
                ListRow(d.doc.title, subtitle = d.doc.category, leading = { IconTile(kindIcon(d.doc.ext, d.doc.mime)) }, trailing = { ExpiryTag(d.daysToExpiry) }, onClick = { nav.open(Route.Doc(d.doc.id)) })
            }
            if (person.id != ME) {
                item {
                    SectionHeader("Tasks for ${person.name}")
                    tasks.forEach { t -> ListRow(t.title, subtitle = t.day?.let { Dates.relative(LocalDate.parse(it), LocalDate.now()) }, leading = { IconTile(AppIcons.ListChecks) }, onClick = { nav.open(Route.Task(t.id)) }) }
                    AppTextField(newTask, { newTask = it }, placeholder = "Remind ${person.name} to…", leading = AppIcons.Plus, onDone = { vm.addTask(newTask); newTask = "" })
                }
                if (role == Role.ELDER) {
                    item {
                        SectionHeader("Caregiver")
                        ListRow(
                            if (person.delegateTo != null) "You help with ${Codecs.decodeList(person.delegateCats).joinToString()}" else "Name a caregiver",
                            subtitle = "Delegated management of chosen categories — not blanket access. Consent is renewed yearly.",
                            leading = { IconTile(AppIcons.Heart) }, maxSubtitleLines = 3, onClick = { delegate = true },
                        )
                    }
                }
                if (person.linked) {
                    item {
                        SectionHeader("Emergency access")
                        Text("Request → ${person.name} is notified → a wait → read-only access to medical, insurance and ID for 30 days.", style = Aiimin.type.caption)
                        requests.forEach { r -> ListRow("Request · ${r.status.lowercase()}", subtitle = r.expiresOn?.let { "Until $it" }, trailing = { if (r.status == "WAITING") AppButton("Grant now", { vm.decide(r.id, true) }, compact = true, kind = ButtonKind.SECONDARY) }) }
                        if (requests.none { it.status == "WAITING" || it.status == "GRANTED" }) AppButton("Request access", { vm.request(); toaster.show("${person.name} is notified · 72 h wait") }, kind = ButtonKind.SECONDARY, compact = true, modifier = Modifier.padding(top = 8.dp))
                    }
                }
                item {
                    Spacer(Modifier.height(24.dp))
                    AppButton("Remove from family", { vm.remove(); nav.back() }, kind = ButtonKind.DANGER, compact = true)
                }
            }
        }
    }
    if (editCard && person != null) {
        var blood by remember { mutableStateOf(person.blood) }
        var allergies by remember { mutableStateOf(person.allergies) }
        var meds by remember { mutableStateOf(person.meds) }
        var doctor by remember { mutableStateOf(person.doctor) }
        var contact by remember { mutableStateOf(Codecs.decodeList(person.contacts).firstOrNull().orEmpty()) }
        AppSheet({ editCard = false }, title = "Emergency card", subtitle = "Visible to family even when the vault is locked.") {
            AppTextField(blood, { blood = it }, label = "Blood group")
            Spacer(Modifier.height(8.dp))
            AppTextField(allergies, { allergies = it }, label = "Allergies")
            Spacer(Modifier.height(8.dp))
            AppTextField(meds, { meds = it }, label = "Medicines")
            Spacer(Modifier.height(8.dp))
            AppTextField(doctor, { doctor = it }, label = "Doctor")
            Spacer(Modifier.height(8.dp))
            AppTextField(contact, { contact = it }, label = "Emergency contact (name · phone)")
            Spacer(Modifier.height(12.dp))
            AppButton("Save", {
                vm.save(person.copy(blood = blood, allergies = allergies, meds = meds, doctor = doctor, contacts = Codecs.encodeList(listOf(contact).filter { it.isNotBlank() })))
                editCard = false
            }, Modifier.fillMaxWidth())
        }
    }
    if (delegate && person != null) {
        var cats by remember { mutableStateOf(Codecs.decodeList(person.delegateCats).toSet().ifEmpty { setOf("Insurance", "Health") }) }
        AppSheet({ delegate = false }, title = "Caregiver for ${person.name}", subtitle = "${person.name} agrees to let you manage these categories. Re-confirmed every year.") {
            PillRow { listOf("Insurance", "Health", "Identity", "Vehicle", "Finance & Tax", "Property").forEach { k -> Pill(k, k in cats, { cats = if (k in cats) cats - k else cats + k }) } }
            Spacer(Modifier.height(12.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                if (person.delegateTo != null) AppButton("Remove", { vm.setDelegate(null, emptySet()); delegate = false }, Modifier.weight(1f), kind = ButtonKind.SECONDARY)
                AppButton("Confirm", { vm.setDelegate(ME, cats); delegate = false }, Modifier.weight(1f), enabled = cats.isNotEmpty())
            }
        }
    }
}

@Composable
fun EmergencyCardScreen(id: String, vm: PersonViewModel = hiltViewModel()) {
    LaunchedEffect(id) { vm.load(id) }
    val nav = LocalNavigator.current
    val context = LocalContext.current
    val p by vm.person.collectAsStateWithLifecycle()
    val c = Aiimin.colors
    val person = p ?: return
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Emergency card", onBack = { nav.back() })
        Column(Modifier.padding(Aiimin.space.gutter)) {
            Text(person.name, style = Aiimin.type.title)
            Spacer(Modifier.height(16.dp))
            listOf("Blood group" to person.blood, "Allergies" to person.allergies, "Medicines" to person.meds, "Doctor" to person.doctor).forEach { (k, v) ->
                Text(k.uppercase(), style = Aiimin.type.eyebrow)
                Text(v.ifBlank { "—" }, style = Aiimin.type.headline.copy(fontSize = 22.sp), modifier = Modifier.padding(bottom = 14.dp))
            }
            Codecs.decodeList(person.contacts).forEach { contact ->
                val phone = Regex("[+\\d][\\d\\s-]{6,}").find(contact)?.value?.filter { it.isDigit() || it == '+' }
                ListRow(contact, leading = { IconTile(AppIcons.Phonecall, tint = c.done, background = c.doneSoft) }, onClick = {
                    if (phone != null) context.startActivity(Intent(Intent.ACTION_DIAL, Uri.parse("tel:$phone")))
                })
            }
        }
    }
}

// =================================================================== family

@Composable
fun FamilyScreen(vm: FamilyViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val people by vm.people.collectAsStateWithLifecycle()
    val requests by vm.requests.collectAsStateWithLifecycle()
    val log by vm.log.collectAsStateWithLifecycle()
    var adding by remember { mutableStateOf(false) }
    val c = Aiimin.colors
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Family", onBack = { nav.back() }) { AppIconButton(AppIcons.Plus, "Add person", { adding = true }) }
        LazyColumn(contentPadding = PaddingValues(Aiimin.space.gutter)) {
            item {
                Panel(color = c.surface) {
                    Text("How sharing works", style = Aiimin.type.bodyStrong)
                    Spacer(Modifier.height(6.dp))
                    listOf(
                        "Private by default. People share results, not inputs.",
                        "Managing someone's account never means reading it.",
                        "Journals are never visible to anyone else — no override.",
                        "Life Scores are private unless the owner shares the number.",
                        "Every access outside a share is logged and notified.",
                    ).forEach { Text("· $it", style = Aiimin.type.caption, modifier = Modifier.padding(vertical = 2.dp)) }
                }
                Spacer(Modifier.height(8.dp))
            }
            items(people, key = { it.id }) { p ->
                ListRow(
                    if (p.id == ME) "${p.name} (you)" else p.name,
                    subtitle = listOf(p.relation, runCatching { Role.valueOf(p.role).label }.getOrDefault(p.role), if (p.pending) "Invite pending" else if (!p.linked && p.id != ME) "Managed profile" else "").filter { it.isNotBlank() }.joinToString(" · "),
                    leading = { Avatar(p.name, p.hue) }, onClick = { nav.open(Route.Person(p.id)) },
                )
            }
            val waiting = requests.filter { it.status == "WAITING" }
            if (waiting.isNotEmpty()) {
                item { SectionHeader("Emergency requests") }
                items(waiting, key = { it.id }) { r ->
                    val from = people.firstOrNull { it.id == r.fromId }?.name ?: "Someone"
                    Panel(Modifier.padding(vertical = 4.dp)) {
                        Text("$from asked for emergency access", style = Aiimin.type.bodyStrong)
                        Text("Grants automatically after ${r.waitHours} h unless you decline. Declining keeps them as a contact.", style = Aiimin.type.caption)
                        Row(Modifier.padding(top = 8.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            AppButton("Decline", { vm.decide(r.id, false) }, kind = ButtonKind.SECONDARY, compact = true)
                            AppButton("Grant", { vm.decide(r.id, true) }, compact = true)
                        }
                    }
                }
            }
            item { SectionHeader("Who saw what") }
            if (log.isEmpty()) item { Text("No one has opened anything outside their own vault.", style = Aiimin.type.caption) }
            items(log.take(20), key = { it.id }) { a ->
                ListRow("${people.firstOrNull { it.id == a.by }?.name ?: a.by} ${a.action}ed “${a.title}”", subtitle = java.text.DateFormat.getDateTimeInstance().format(java.util.Date(a.at)))
            }
        }
    }
    if (adding) {
        var name by remember { mutableStateOf("") }
        var relation by remember { mutableStateOf("") }
        var role by remember { mutableStateOf(Role.ADULT) }
        var invite by remember { mutableStateOf(false) }
        AppSheet({ adding = false }, title = "Add to family") {
            AppTextField(name, { name = it }, placeholder = "Name")
            Spacer(Modifier.height(8.dp))
            AppTextField(relation, { relation = it }, placeholder = "Relation (Mother, Brother…)")
            SectionHeader("Role")
            PillRow { listOf(Role.CO_ADMIN, Role.ADULT, Role.TEEN, Role.CHILD, Role.ELDER, Role.GUEST).forEach { r -> Pill(r.label, role == r, { role = r }) } }
            SwitchRow(
                "Invite to their own account", invite, { invite = it },
                subtitle = if (invite) "They'll have a private vault you can't read. Shares are their choice." else "A profile you manage — for parents or kids without their own phone.",
            )
            Spacer(Modifier.height(12.dp))
            AppButton("Add", { vm.add(name, relation, role, invite); adding = false; toaster.show("$name added") }, Modifier.fillMaxWidth(), enabled = name.isNotBlank())
        }
    }
}
