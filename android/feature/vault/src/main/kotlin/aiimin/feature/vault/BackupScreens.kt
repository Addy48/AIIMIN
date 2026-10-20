package aiimin.feature.vault

import aiimin.core.data.vault.BackupHealth
import aiimin.core.data.vault.Kit
import aiimin.core.data.vault.Seal
import aiimin.core.data.vault.VaultBackupRepository
import aiimin.core.data.vault.VaultRepository
import aiimin.core.data.vault.ME
import aiimin.core.database.DocEntity
import aiimin.core.database.FamilyDao
import aiimin.core.database.PersonEntity
import aiimin.core.database.VaultDao
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppSheet
import aiimin.designsystem.component.AppTextField
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.Chevron
import aiimin.designsystem.component.Hairline
import aiimin.designsystem.component.IconTile
import aiimin.designsystem.component.ListRow
import aiimin.designsystem.component.Pill
import aiimin.designsystem.component.PillRow
import aiimin.designsystem.component.SectionHeader
import aiimin.designsystem.component.TopBar
import aiimin.designsystem.component.pressable
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.LocalToaster
import aiimin.designsystem.theme.Aiimin
import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.selection.SelectionContainer
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.FileProvider
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import java.io.File
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch

@HiltViewModel
class VaultBackupViewModel @Inject constructor(
    @ApplicationContext private val context: Context,
    private val repo: VaultBackupRepository,
    private val vaultDao: VaultDao,
    private val familyDao: FamilyDao,
) : ViewModel() {
    val health = MutableStateFlow<BackupHealth?>(null)
    val busy = MutableStateFlow<String?>(null)
    val message = MutableStateFlow<String?>(null)
    val kits = MutableStateFlow<List<Kit>>(emptyList())
    val docs = MutableStateFlow<List<DocEntity>>(emptyList())
    val people = MutableStateFlow<List<PersonEntity>>(emptyList())
    /** Set right after a kit is built: the file to send and its code, shown once. */
    val built = MutableStateFlow<Pair<File, String>?>(null)

    init { refresh() }

    fun refresh() = viewModelScope.launch {
        val all = vaultDao.allNow().filter { !it.deleted }
        docs.value = all
        health.value = repo.health(all.size)
        kits.value = repo.kits()
        people.value = familyDao.allNow()
    }

    fun setFolder(tree: Uri) { repo.setFolder(tree); refresh() }

    fun backup(pass: String) = viewModelScope.launch {
        busy.value = "Encrypting and writing your backup…"
        message.value = runCatching { "Backed up · " + repo.backupNow(pass.toCharArray()) }.getOrElse { it.message ?: "Backup didn't finish" }
        busy.value = null
        refresh()
    }

    fun restore(uri: Uri, secret: String, kit: Boolean) = viewModelScope.launch {
        busy.value = if (kit) "Opening the kit…" else "Restoring…"
        message.value = runCatching {
            val r = repo.restore(uri, (if (kit) Seal.normalizeCode(secret) else secret).toCharArray())
            buildString {
                append(if (kit) "Kit opened · ${r.docs} documents" else "Restored ${r.docs} documents")
                if (r.skipped > 0) append(" · ${r.skipped} already here")
                if (r.people > 0) append(" · ${r.people} people added")
            }
        }.getOrElse { it.message ?: "Couldn't open that file" }
        busy.value = null
        refresh()
    }

    fun buildKit(to: String, ids: List<String>, replace: String? = null) = viewModelScope.launch {
        busy.value = "Building the kit…"
        runCatching { repo.buildKit(to, ids, replace) }.onSuccess { built.value = it }.onFailure { message.value = it.message }
        busy.value = null
        refresh()
    }

    fun deleteKit(id: String) { repo.deleteKit(id); refresh() }

    suspend fun sheet(code: String, to: String): File = repo.printableSheet(code, to)
}

private val stamp = DateTimeFormatter.ofPattern("d MMM, h:mm a", Locale.ENGLISH)

/** VB1 · Vault backups to a place you choose. */
@Composable
fun VaultBackupScreen(vm: VaultBackupViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val c = Aiimin.colors
    val h by vm.health.collectAsStateWithLifecycle()
    val busy by vm.busy.collectAsStateWithLifecycle()
    val msg by vm.message.collectAsStateWithLifecycle()
    var ask by remember { mutableStateOf<String?>(null) } // "backup" | "restore"
    var restoreUri by remember { mutableStateOf<Uri?>(null) }
    androidx.compose.runtime.LaunchedEffect(msg) { msg?.let { toaster.show(it); vm.message.value = null } }
    val folder = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocumentTree()) { it?.let(vm::setFolder) }
    val pickFile = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocument()) { u -> if (u != null) { restoreUri = u; ask = "restore" } }
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Vault backups", onBack = { nav.back() })
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = Aiimin.space.gutter)) {
            val health = h ?: return@Column
            Text(
                health.lastAt?.let { "Last backup " + stamp.format(Instant.ofEpochMilli(it).atZone(ZoneId.systemDefault())) } ?: "No backup yet",
                style = Aiimin.type.title.copy(fontSize = 22.sp), modifier = Modifier.padding(top = 8.dp),
            )
            Text(
                (health.where?.let { "In $it · " } ?: "") + "${health.docs} documents on this phone" + if (health.overdue) " · due for a backup" else "",
                style = Aiimin.type.caption.copy(color = if (health.overdue) c.warn else c.textMuted, fontSize = 13.5.sp),
            )
            Spacer(Modifier.height(16.dp))
            AppButton(
                if (busy != null) busy!! else "Back up now", { if (!health.folderSet) folder.launch(null) else ask = "backup" },
                Modifier.fillMaxWidth(), enabled = busy == null && health.docs > 0, icon = AppIcons.CloudArrowUp,
            )
            SectionHeader("Where")
            ListRow(
                health.where ?: "Choose a place", subtitle = "Your Google Drive, a USB drive, an SD card or a phone folder. The newest three backups are kept.",
                leading = { IconTile(AppIcons.FolderSimple) }, trailing = { Chevron() }, onClick = { folder.launch(null) }, maxSubtitleLines = 3,
            )
            Hairline()
            SectionHeader("Restore")
            ListRow("Restore from a backup", subtitle = "Pick an .aiimin backup file and type its passphrase", maxSubtitleLines = 2, leading = { IconTile(AppIcons.ClockCounter) }, trailing = { Chevron() }, onClick = { pickFile.launch(arrayOf("*/*")) })
            Hairline()
            SectionHeader("How it works")
            listOf(
                "Your documents live only on your phones. AIIMIN can't see, scan or recover them. Keep a backup somewhere you trust.",
                "Each backup is one encrypted file (AES-256-GCM, key from your passphrase). Without the passphrase nobody can open it, including AIIMIN.",
                "Sensitive documents are decrypted for the backup and encrypted again with the new phone's key when restored.",
            ).forEach { Text(it, style = Aiimin.type.caption.copy(fontSize = 13.5.sp, lineHeight = 20.sp), modifier = Modifier.padding(bottom = 8.dp)) }
            Spacer(Modifier.height(32.dp))
        }
    }
    when (ask) {
        "backup" -> PassSheet("Backup passphrase", "At least 10 characters. You'll need it to restore; AIIMIN can't reset it.", confirm = true, onDismiss = { ask = null }) { vm.backup(it); ask = null }
        "restore" -> PassSheet("Passphrase for this backup", "The one you set when you made it.", confirm = false, onDismiss = { ask = null }) { p -> restoreUri?.let { vm.restore(it, p, kit = false) }; ask = null }
    }
}

@Composable
private fun PassSheet(title: String, hint: String, confirm: Boolean, onDismiss: () -> Unit, onOk: (String) -> Unit) {
    var a by remember { mutableStateOf("") }
    var b by remember { mutableStateOf("") }
    AppSheet(onDismiss, title = title, subtitle = hint) {
        AppTextField(a, { a = it }, label = "Passphrase", keyboardType = KeyboardType.Password)
        if (confirm) {
            Spacer(Modifier.height(10.dp))
            AppTextField(b, { b = it }, label = "Type it again", keyboardType = KeyboardType.Password)
        }
        Spacer(Modifier.height(14.dp))
        val ok = if (confirm) a.length >= 10 && a == b else a.isNotEmpty()
        AppButton("Continue", { onOk(a) }, Modifier.fillMaxWidth(), enabled = ok)
    }
}

/** EK1 / EK2 · Emergency kits for a trusted person, and opening one sent to you. */
@Composable
fun EmergencyKitsScreen(vm: VaultBackupViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val c = Aiimin.colors
    val kits by vm.kits.collectAsStateWithLifecycle()
    val docs by vm.docs.collectAsStateWithLifecycle()
    val people by vm.people.collectAsStateWithLifecycle()
    val busy by vm.busy.collectAsStateWithLifecycle()
    val built by vm.built.collectAsStateWithLifecycle()
    val msg by vm.message.collectAsStateWithLifecycle()
    androidx.compose.runtime.LaunchedEffect(msg) { msg?.let { toaster.show(it); vm.message.value = null } }
    var building by remember { mutableStateOf<Kit?>(null) }
    var newKit by remember { mutableStateOf(false) }
    var openUri by remember { mutableStateOf<Uri?>(null) }
    val pickKit = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocument()) { u -> openUri = u }
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Emergency kits", onBack = { nav.back() })
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = Aiimin.space.gutter)) {
            Text(
                "Your documents never sit on AIIMIN's servers, so emergency access works by giving a trusted person an encrypted kit ahead of time. It stays locked until they type the code from your printed sheet.",
                style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(top = 8.dp),
            )
            SectionHeader("Your kits", action = "New kit", onAction = { newKit = true })
            if (kits.isEmpty()) Text("No kits yet.", style = Aiimin.type.caption, modifier = Modifier.padding(vertical = 6.dp))
            kits.forEach { k ->
                Row(Modifier.fillMaxWidth().pressable({ building = k }).heightIn(min = 60.dp).padding(vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
                    IconTile(AppIcons.FirstAidKit)
                    Spacer(Modifier.width(12.dp))
                    Column(Modifier.weight(1f)) {
                        Text("For ${k.to}", style = Aiimin.type.bodyStrong)
                        Text(
                            "${k.docIds.size} documents · made " + stamp.format(Instant.ofEpochMilli(k.createdAt).atZone(ZoneId.systemDefault())) + if (k.dueForRefresh) " · refresh it" else "",
                            style = Aiimin.type.caption.copy(color = if (k.dueForRefresh) c.warn else c.textMuted),
                        )
                    }
                    Chevron()
                }
                Hairline()
            }
            SectionHeader("Sent to you")
            ListRow("Open an emergency kit", subtitle = "Pick the kit file someone sent you and type the code from their sheet", leading = { IconTile(AppIcons.Key) }, trailing = { Chevron() }, onClick = { pickKit.launch(arrayOf("*/*")) }, maxSubtitleLines = 2)
            Hairline()
            Text("Anyone with both the kit file and the code can open it. Keep the printed sheet somewhere safe, like a home locker.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 14.dp, bottom = 32.dp))
        }
    }
    if (newKit || building != null) {
        val k = building
        KitSheet(k, docs, people, onDismiss = { newKit = false; building = null }, onDelete = k?.let { { vm.deleteKit(it.id); building = null } }) { to, ids ->
            vm.buildKit(to, ids, k?.id); newKit = false; building = null
        }
    }
    built?.let { (file, code) ->
        val to = kits.lastOrNull()?.to ?: "them"
        AppSheet({ vm.built.value = null }, title = "Kit ready", subtitle = "Send the file to $to now, then print the sheet. The code is shown only this once.") {
            Text("Kit code", style = Aiimin.type.caption)
            SelectionContainer { Text(code, style = Aiimin.type.code.copy(fontSize = 19.sp, lineHeight = 28.sp, color = Aiimin.colors.text), modifier = Modifier.padding(vertical = 8.dp)) }
            AppButton("Send the kit file", {
                share(context, file, "application/octet-stream", "Send kit")
            }, Modifier.fillMaxWidth(), icon = AppIcons.Share)
            Spacer(Modifier.height(8.dp))
            AppButton("Print the emergency sheet", {
                scope.launch { share(context, vm.sheet(code, to), "application/pdf", "Print or save") }
            }, Modifier.fillMaxWidth(), kind = ButtonKind.SECONDARY, icon = AppIcons.Printer)
            Spacer(Modifier.height(8.dp))
            AppButton("Done", { vm.built.value = null }, Modifier.fillMaxWidth(), kind = ButtonKind.GHOST)
        }
    }
    openUri?.let { u ->
        var code by remember(u) { mutableStateOf("") }
        AppSheet({ openUri = null }, title = "Open the kit", subtitle = "Type the code from the printed emergency sheet.") {
            AppTextField(code, { code = it }, label = "Kit code", placeholder = "ABCDE-FGHJK-…")
            Spacer(Modifier.height(14.dp))
            AppButton(if (busy != null) busy!! else "Open", { vm.restore(u, code, kit = true); openUri = null }, Modifier.fillMaxWidth(), enabled = Seal.normalizeCode(code).length >= 35 && busy == null)
        }
    }
}

@Composable
private fun KitSheet(k: Kit?, docs: List<DocEntity>, people: List<PersonEntity>, onDismiss: () -> Unit, onDelete: (() -> Unit)?, onBuild: (String, List<String>) -> Unit) {
    var to by remember { mutableStateOf(k?.to.orEmpty()) }
    // Suggested first: insurance, medical, ID and nominee papers.
    val suggested = remember(docs) { docs.filter { d -> Regex("insur|policy|medic|health|prescri|passport|aadhaar|pan|licen|nominee|will", RegexOption.IGNORE_CASE).containsMatchIn(d.title + " " + d.category) }.map { it.id }.toSet() }
    var picked by remember { mutableStateOf(k?.docIds?.toSet() ?: suggested) }
    AppSheet(onDismiss, title = if (k == null) "Build an emergency kit" else "Kit for ${k.to}") {
        SectionHeader("Trusted person")
        PillRow { people.filter { it.id != ME && it.relation != "Emergency kit" }.forEach { p -> Pill(p.name, to == p.name, { to = p.name }) } }
        AppTextField(to, { to = it }, placeholder = "Or type a name", modifier = Modifier.padding(top = 8.dp))
        SectionHeader("Documents · ${picked.size}")
        docs.take(40).forEach { d ->
            val on = d.id in picked
            Row(Modifier.fillMaxWidth().pressable({ picked = if (on) picked - d.id else picked + d.id }).heightIn(min = 48.dp), verticalAlignment = Alignment.CenterVertically) {
                aiimin.designsystem.component.CheckCircle(on, { picked = if (on) picked - d.id else picked + d.id }, "Include ${d.title}")
                Spacer(Modifier.width(10.dp))
                Text(d.title, style = Aiimin.type.body, modifier = Modifier.weight(1f), maxLines = 1)
            }
        }
        Spacer(Modifier.height(14.dp))
        AppButton(if (k == null) "Build the kit" else "Refresh the kit", { onBuild(to.trim(), picked.toList()) }, Modifier.fillMaxWidth(), enabled = to.isNotBlank() && picked.isNotEmpty())
        if (onDelete != null) {
            Spacer(Modifier.height(8.dp))
            AppButton("Forget this kit", onDelete, Modifier.fillMaxWidth(), kind = ButtonKind.GHOST)
            Text("Forgetting it here doesn't remove the copy on their phone.", style = Aiimin.type.caption)
        }
    }
}

private fun share(context: Context, f: File, mime: String, title: String) {
    val uri = FileProvider.getUriForFile(context, context.packageName + ".files", f)
    context.startActivity(Intent.createChooser(Intent(Intent.ACTION_SEND).setType(mime).putExtra(Intent.EXTRA_STREAM, uri).addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION), title))
}
