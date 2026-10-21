package aiimin.feature.me

import aiimin.designsystem.component.ListRow
import aiimin.designsystem.component.IconTile
import aiimin.core.data.app.DataControlRepository
import aiimin.core.data.app.ExportRepository
import aiimin.core.data.app.PreferencesRepository
import aiimin.core.data.settings.AppSettings
import aiimin.core.data.settings.SyncKinds
import aiimin.core.data.sync.AuthRepository
import aiimin.core.data.sync.AuthResult
import aiimin.core.data.sync.Session
import aiimin.core.data.sync.SyncRepository
import aiimin.core.data.sync.SyncState
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppSheet
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.Hairline
import aiimin.designsystem.component.PinInput
import aiimin.designsystem.component.SectionHeader
import aiimin.designsystem.component.SwitchRow
import aiimin.designsystem.component.TopBar
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.LocalToaster
import aiimin.designsystem.nav.Route
import aiimin.designsystem.theme.Aiimin
import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.FileProvider
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

@HiltViewModel
class AccountViewModel @Inject constructor(
    private val auth: AuthRepository,
    private val sync: SyncRepository,
    private val prefs: PreferencesRepository,
    private val data: DataControlRepository,
    private val export: ExportRepository,
) : ViewModel() {
    val session = auth.session.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)
    val settings = prefs.state.stateIn(viewModelScope, SharingStarted.Eagerly, null)
    val state = sync.state
    val busy = MutableStateFlow(false)
    val message = MutableStateFlow<String?>(null)

    init { viewModelScope.launch { sync.refreshState(); auth.refreshProfile() } }

    fun syncNow() = viewModelScope.launch {
        busy.value = true
        val r = sync.sync()
        message.value = when {
            r != null -> "Synced · ${r.pushed} sent, ${r.pulled} received" + if (r.failed > 0) ", ${r.failed} to retry" else ""
            sync.state.value is SyncState.Offline -> "Offline. Changes are saved on this phone and will go when you're back."
            sync.state.value is SyncState.Attention -> (sync.state.value as SyncState.Attention).message
            else -> "Sign in first"
        }
        busy.value = false
    }


    /** Signs out of aiimin.in. [removeLocal] also wipes this phone; nothing on aiimin.in is touched. */
    fun signOut(removeLocal: Boolean) = viewModelScope.launch {
        auth.signOut()
        sync.unlinkAll()
        sync.refreshState()
        if (removeLocal) data.eraseThisPhone() else message.value = "Signed out. Everything stays on this phone."
    }

    fun eraseThisPhone() = viewModelScope.launch { auth.signOut(); data.eraseThisPhone() }

    fun wipeServer() = viewModelScope.launch {
        busy.value = true
        message.value = if (auth.wipeServerData()) {
            // Without this the next sync would read the empty server as "deleted on the web".
            sync.unlinkAll()
            prefs.update { it.copy(syncScope = emptySet(), journalSync = false) }
            "Your data on aiimin.in is deleted. Your login is kept. Sync is paused; switch kinds back on in Sync settings."
        } else "Couldn't reach aiimin.in. Nothing was deleted."
        busy.value = false
    }

    suspend fun deleteAccount(pin: String): AuthResult {
        busy.value = true
        val r = auth.deleteAccount(pin)
        if (r is AuthResult.Ok) { sync.refreshState(); data.eraseThisPhone() }
        busy.value = false
        return r
    }

    suspend fun exportZip() = export.exportAll(includeJournal = false)
}

private fun relativeTime(ms: Long?): String {
    if (ms == null) return "not yet"
    val mins = (System.currentTimeMillis() - ms) / 60_000
    return when {
        mins < 1 -> "just now"
        mins < 60 -> "$mins min ago"
        mins < 24 * 60 -> "${mins / 60} h ago"
        else -> java.text.DateFormat.getDateInstance().format(java.util.Date(ms))
    }
}

// =================================================================== SE1 Account and sync

@Composable
fun AccountScreen(vm: AccountViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val c = Aiimin.colors
    val session by vm.session.collectAsStateWithLifecycle()
    val s by vm.settings.collectAsStateWithLifecycle()
    val state by vm.state.collectAsStateWithLifecycle()
    val busy by vm.busy.collectAsStateWithLifecycle()
    val msg by vm.message.collectAsStateWithLifecycle()
    var signOut by remember { mutableStateOf(false) }
    var confirmRemove by remember { mutableStateOf(false) }
    androidx.compose.runtime.LaunchedEffect(msg) { msg?.let { toaster.show(it); vm.message.value = null } }
    val sess = session
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Account and sync", onBack = { nav.back() })
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = Aiimin.space.gutter)) {
            if (sess?.signedIn == true) {
                SignedIn(sess, s, state, busy, vm, onSignOut = { signOut = true })
            } else {
                Text("Keep it safe, and on the web too", style = Aiimin.type.title.copy(fontSize = 26.sp, lineHeight = 32.sp), modifier = Modifier.padding(top = 8.dp))
                Text(
                    "Sign in to aiimin.in to back up your tasks, notes and payments and see them on the website. The app works fully without an account, and you can sign in any time.",
                    style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(top = 10.dp, bottom = 24.dp),
                )
                AppButton("Sign in", { nav.open(Route.SignIn(false)) }, Modifier.fillMaxWidth())
                Spacer(Modifier.height(10.dp))
                AppButton("Create an account", { nav.open(Route.SignIn(true)) }, Modifier.fillMaxWidth(), kind = ButtonKind.SECONDARY)
                Text(
                    "Only what you allow leaves the phone: tasks, notes and payments. Documents, bank-message text and health samples never do.",
                    style = Aiimin.type.caption, modifier = Modifier.padding(top = 20.dp),
                )
            }
            Spacer(Modifier.height(24.dp))
            Text("Privacy and data", style = Aiimin.type.label.copy(color = c.link), modifier = Modifier.clickable { nav.open(Route.Privacy) }.padding(vertical = 8.dp))
            Spacer(Modifier.height(32.dp))
        }
    }
    if (signOut) {
        AppSheet({ signOut = false }, title = "Sign out of aiimin.in?") {
            Text("Your data on aiimin.in stays there. Choose what happens to the copy on this phone.", style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(bottom = 16.dp))
            AppButton("Keep my data on this phone", { signOut = false; vm.signOut(false) }, Modifier.fillMaxWidth())
            Spacer(Modifier.height(8.dp))
            AppButton("Remove data from this phone", { signOut = false; confirmRemove = true }, Modifier.fillMaxWidth(), kind = ButtonKind.DANGER)
            Spacer(Modifier.height(8.dp))
            AppButton("Cancel", { signOut = false }, Modifier.fillMaxWidth(), kind = ButtonKind.GHOST)
        }
    }
    if (confirmRemove) {
        AppSheet({ confirmRemove = false }, title = "Remove everything from this phone?") {
            Text("Your journal, vault files, notes, tasks and settings on this phone are erased and AIIMIN starts over. Anything already synced to aiimin.in stays there.", style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(bottom = 16.dp))
            AppButton("Remove and sign out", { confirmRemove = false; vm.signOut(true) }, Modifier.fillMaxWidth(), kind = ButtonKind.DANGER)
            Spacer(Modifier.height(8.dp))
            AppButton("Cancel", { confirmRemove = false }, Modifier.fillMaxWidth(), kind = ButtonKind.SECONDARY)
        }
    }
}

@Composable
private fun SignedIn(sess: Session, s: AppSettings?, state: SyncState, busy: Boolean, vm: AccountViewModel, onSignOut: () -> Unit) {
    val c = Aiimin.colors
    val context = LocalContext.current
    Text(sess.name?.takeIf { it.isNotBlank() } ?: sess.osId ?: sess.label.orEmpty(), style = Aiimin.type.title.copy(fontSize = 26.sp), modifier = Modifier.padding(top = 8.dp))
    listOfNotNull(sess.osId?.let { "OS-ID $it" }, sess.email).forEach { Text(it, style = Aiimin.type.body.copy(color = c.textMuted)) }
    if (!sess.verified) Text("Your email isn't verified yet. Check your inbox for the link from aiimin.in.", style = Aiimin.type.caption.copy(color = c.warn, fontSize = 13.sp), modifier = Modifier.padding(top = 8.dp))
    SectionHeader("Sync")
    Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth().heightIn(min = 56.dp)) {
        Column(Modifier.weight(1f)) {
            Text(
                when (state) {
                    is SyncState.Syncing -> "Syncing…"
                    is SyncState.Offline -> "Offline"
                    is SyncState.Attention -> "Needs attention"
                    is SyncState.SignedOut -> "Signed out"
                    is SyncState.Idle -> "Up to date"
                },
                style = Aiimin.type.headline,
            )
            Text(
                when (state) {
                    is SyncState.Attention -> state.message
                    is SyncState.Offline -> "Changes are saved on this phone and go when you're back online."
                    else -> "Last synced ${relativeTime(s?.lastSyncAt)}"
                },
                style = Aiimin.type.caption,
            )
        }
        AppButton(if (busy) "Syncing…" else "Sync now", { vm.syncNow() }, enabled = !busy, compact = true, icon = AppIcons.ArrowsClockwise)
    }
    Hairline()
    SectionHeader("What syncs")
    val scope = s?.syncScope.orEmpty()
    val on = listOfNotNull(
        "tasks".takeIf { SyncKinds.TASKS in scope }, "calendar".takeIf { SyncKinds.CALENDAR in scope },
        "notes".takeIf { SyncKinds.NOTES in scope }, "goals".takeIf { SyncKinds.GOALS in scope },
        "minimums".takeIf { SyncKinds.MINIMUMS in scope }, "payments".takeIf { SyncKinds.MONEY in scope },
        "journal".takeIf { s?.journalSync == true },
    )
    val nav = LocalNavigator.current
    Row(Modifier.fillMaxWidth().clickable { nav.open(Route.SyncSettings) }.heightIn(min = 60.dp), verticalAlignment = Alignment.CenterVertically) {
        Icon(AppIcons.Sliders, null, tint = c.text, modifier = Modifier.padding(end = 16.dp))
        Column(Modifier.weight(1f)) {
            Text("Sync settings", style = Aiimin.type.body.copy(color = c.text, fontSize = 16.sp))
            Text(if (on.isEmpty()) "Nothing syncs. Everything stays on this phone." else on.joinToString(", ").replaceFirstChar { it.uppercase() }, style = Aiimin.type.caption)
        }
        Icon(AppIcons.CaretRight, null, tint = c.textMuted)
    }
    Hairline()
    Text("Documents, emergency cards and health samples never sync. What syncs is stored on aiimin.in as plain text.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 10.dp))
    SectionHeader("Account")
    Row(Modifier.fillMaxWidth().clickable { context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://www.aiimin.in"))) }.heightIn(min = 56.dp), verticalAlignment = Alignment.CenterVertically) {
        Icon(AppIcons.Export, null, tint = c.text, modifier = Modifier.padding(end = 16.dp))
        Text("Open aiimin.in", style = Aiimin.type.body.copy(color = c.text, fontSize = 16.sp))
    }
    Hairline()
    Row(Modifier.fillMaxWidth().clickable(onClick = onSignOut).heightIn(min = 56.dp), verticalAlignment = Alignment.CenterVertically) {
        Icon(AppIcons.Lock, null, tint = c.text, modifier = Modifier.padding(end = 16.dp))
        Text("Sign out", style = Aiimin.type.body.copy(color = c.text, fontSize = 16.sp))
    }
    Hairline()
}

// =================================================================== SE10 Privacy and data

@Composable
fun PrivacyScreen(vm: AccountViewModel = hiltViewModel(), me: MeViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    val context = LocalContext.current
    val c = Aiimin.colors
    val session by vm.session.collectAsStateWithLifecycle()
    val s by vm.settings.collectAsStateWithLifecycle()
    val integrity by me.integrity.collectAsStateWithLifecycle()
    var sheet by remember { mutableStateOf<String?>(null) }
    var pin by remember { mutableStateOf("") }
    var err by remember { mutableStateOf<String?>(null) }
    val msg by vm.message.collectAsStateWithLifecycle()
    androidx.compose.runtime.LaunchedEffect(msg) { msg?.let { toaster.show(it); vm.message.value = null } }
    val st = s ?: return
    val signedIn = session?.signedIn == true
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Privacy and data", onBack = { nav.back() })
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = Aiimin.space.gutter)) {
            SectionHeader("Where your data lives")
            listOf(
                "On this phone" to "Everything: tasks, notes, payments, journal, documents, scores. The journal, sensitive documents and your sign-in are encrypted with a key that never leaves this phone.",
                "On aiimin.in" to if (signedIn) {
                    val kinds = listOfNotNull(
                        "tasks".takeIf { SyncKinds.TASKS in st.syncScope }, "calendar events".takeIf { SyncKinds.CALENDAR in st.syncScope },
                        "notes".takeIf { SyncKinds.NOTES in st.syncScope }, "goals".takeIf { SyncKinds.GOALS in st.syncScope },
                        "minimums".takeIf { SyncKinds.MINIMUMS in st.syncScope }, "payments".takeIf { SyncKinds.MONEY in st.syncScope },
                        "journal text".takeIf { st.journalSync },
                    )
                    (if (kinds.isEmpty()) "Nothing right now; every kind is switched off in Sync settings." else "Only what you allow in Sync settings: " + kinds.joinToString(", ") + ".") +
                        " It is stored there as plain text so the website can show it. There is no end-to-end encryption."
                } else "Nothing. You're not signed in.",
                "Never leaves the phone" to "Document files, bank-message text, emergency cards and health samples.",
                "Never done" to "Selling your data, ads, lending, or credit scoring.",
            ).forEach { (h, b) ->
                Text(h, style = Aiimin.type.headline, modifier = Modifier.padding(top = 14.dp))
                Text(b, style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(top = 2.dp))
            }
            SectionHeader("Protection")
            SwitchRow("Lock the app", st.appLock, { v -> me.update { it.copy(appLock = v) } }, subtitle = "Fingerprint, face or screen lock when opening AIIMIN", icon = AppIcons.Fingerprint)
            SwitchRow("Hide AIIMIN in the app switcher", st.hideInRecents, { v -> me.update { it.copy(hideInRecents = v) } }, subtitle = "Also blocks screenshots", icon = AppIcons.LockSimple)
            // D-035: the same row shape as the switches above, so icon and text share their columns.
            ListRow(
                "Check data integrity",
                subtitle = when (integrity) { null -> "Verifies the hash chain of your activity log"; true -> "Intact. Nothing changed outside AIIMIN"; false -> "Data was changed outside AIIMIN" },
                leading = { IconTile(AppIcons.ShieldCheck) },
                onClick = { me.verify() },
            )
            Hairline()
            SectionHeader("Your rights")
            ListRow("Your rights", subtitle = "See, correct, export or erase your data, withdraw consent, name someone, complain", leading = { IconTile(AppIcons.Scales) }, onClick = { nav.open(Route.YourRights) }, maxSubtitleLines = 2)
            Hairline()
            SectionHeader("Your copy")
            Row(Modifier.fillMaxWidth().clickable {
                scope.launch {
                    val f = vm.exportZip()
                    val uri = FileProvider.getUriForFile(context, context.packageName + ".files", f)
                    context.startActivity(Intent.createChooser(Intent(Intent.ACTION_SEND).setType("application/zip").putExtra(Intent.EXTRA_STREAM, uri).addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION), "Export"))
                }
            }.heightIn(min = 60.dp), verticalAlignment = Alignment.CenterVertically) {
                Icon(AppIcons.Export, null, tint = c.text, modifier = Modifier.padding(end = 16.dp))
                Column {
                    Text("Export everything", style = Aiimin.type.body.copy(color = c.text, fontSize = 16.sp))
                    Text("A zip of your log, tasks, notes and vault files", style = Aiimin.type.caption)
                }
            }
            Hairline()
            SectionHeader("Erase")
            DangerRow("Remove data from this phone", "Erases everything here and starts over. aiimin.in is not touched.") { sheet = "phone" }
            if (signedIn) {
                DangerRow("Delete my data on aiimin.in", "Clears what was synced. Your login and this phone's data stay.") { sheet = "server" }
                DangerRow("Delete my aiimin.in account", "Removes your account and its data from aiimin.in, and erases this phone.") { sheet = "account"; pin = ""; err = null }
            }
            Row(Modifier.padding(top = 24.dp, bottom = 32.dp)) {
                Text("Privacy Policy", style = Aiimin.type.label.copy(color = c.link), modifier = Modifier.clickable { context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://www.aiimin.in/privacy"))) }.padding(end = 20.dp))
                Text("Terms", style = Aiimin.type.label.copy(color = c.link), modifier = Modifier.clickable { context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://www.aiimin.in/terms"))) })
            }
        }
    }
    when (sheet) {
        "phone" -> AppSheet({ sheet = null }, title = "Remove everything from this phone?") {
            Text("Your journal, vault files, notes, tasks and settings here are erased and AIIMIN starts over.${if (signedIn) " You'll be signed out. What's on aiimin.in stays there." else ""} This can't be undone.", style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(bottom = 16.dp))
            AppButton("Erase this phone", { sheet = null; vm.eraseThisPhone() }, Modifier.fillMaxWidth(), kind = ButtonKind.DANGER)
            Spacer(Modifier.height(8.dp))
            AppButton("Cancel", { sheet = null }, Modifier.fillMaxWidth(), kind = ButtonKind.SECONDARY)
        }
        "server" -> AppSheet({ sheet = null }, title = "Delete your data on aiimin.in?") {
            Text("Your synced tasks, notes, payments and everything else on the website are deleted. You stay signed in, and this phone keeps its own copy. This can't be undone.", style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(bottom = 16.dp))
            AppButton("Delete from aiimin.in", { sheet = null; vm.wipeServer() }, Modifier.fillMaxWidth(), kind = ButtonKind.DANGER)
            Spacer(Modifier.height(8.dp))
            AppButton("Cancel", { sheet = null }, Modifier.fillMaxWidth(), kind = ButtonKind.SECONDARY)
        }
        "account" -> AppSheet({ sheet = null }, title = "Delete your aiimin.in account?") {
            Text("Your account and all its data on aiimin.in are removed, and this phone is erased. Enter your PIN to confirm. This can't be undone.", style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(bottom = 16.dp))
            PinInput(pin, { pin = it; err = null })
            err?.let { Text(it, style = Aiimin.type.caption.copy(color = c.warn), modifier = Modifier.padding(top = 8.dp)) }
            Spacer(Modifier.height(16.dp))
            AppButton("Delete my account", {
                scope.launch {
                    val r = vm.deleteAccount(pin)
                    if (r is AuthResult.Failed) err = r.message else sheet = null
                }
            }, Modifier.fillMaxWidth(), kind = ButtonKind.DANGER, enabled = pin.length == 6)
            Spacer(Modifier.height(8.dp))
            AppButton("Cancel", { sheet = null }, Modifier.fillMaxWidth(), kind = ButtonKind.SECONDARY)
        }
    }
}

@Composable
private fun DangerRow(title: String, sub: String, onClick: () -> Unit) {
    val c = Aiimin.colors
    Column(Modifier.fillMaxWidth().clickable(onClick = onClick).padding(vertical = 14.dp)) {
        Text(title, style = Aiimin.type.body.copy(color = c.warn, fontSize = 16.sp, fontWeight = FontWeight.Medium))
        Text(sub, style = Aiimin.type.caption)
    }
    Hairline()
}

/** Part 21 s.9 and 9a, verbatim where the policy speaks; DPDP Rule 14 asks that the means and the identifier needed be shown. */
object Rights {
    const val EMAIL = "support@aiimin.in"
    const val ASK = "You can ask to see, correct, export or erase your information, withdraw consent (as easily as you gave it), and have a grievance answered. Write to support@aiimin.in; we will reply within 30 days. If you are not satisfied, you may complain to the Data Protection Board of India once it is constituted. If you live in the European Union or United Kingdom, you may also complain to your local data protection authority."
    const val WITHDRAW = "In the app go to Settings > Privacy and switch off sync, bank-message reading, health, usage, microphone or voice. This is as easy as turning them on. Turning one off does not remove what already sits on your phone; use \"Erase this phone\" for that."
    const val NOMINATE = "You may name a person who can use your rights for you if you die or cannot act. Email support@aiimin.in from your sign-in address with their name and contact details. We check them before we act."
    const val BOARD = "You may complain to the Data Protection Board of India (website: dpb.gov.in, once it is constituted). We ask that you contact us first, but you do not have to."
    const val IDENTIFIER = "Write from your sign-in email, or include it, so we can find your account. Nothing else is needed."
    const val REPLY = "Within 30 days; the law allows us at most 90 days."
    const val BREACH = "If a personal-data breach affects you, we will tell you without delay in the app and by email. Our message will say what happened, when, how far it reached, what it may mean for you, what we have done, what you can do to protect yourself, and a person you can ask. We will also report it to the Data Protection Board without delay and send a full report within 72 hours."
}

@Composable
fun YourRightsScreen(me: MeViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val context = LocalContext.current
    val c = Aiimin.colors
    fun mail(subject: String) = runCatching {
        context.startActivity(Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:${Rights.EMAIL}")).putExtra(Intent.EXTRA_SUBJECT, subject))
    }
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Your rights", onBack = { nav.back() })
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = Aiimin.space.gutter)) {
            Text(Rights.ASK, style = Aiimin.type.body, modifier = Modifier.padding(top = 4.dp))
            SectionHeader("Do it in the app")
            ListRow("Export everything", subtitle = "Settings > Privacy > Your copy", leading = { IconTile(AppIcons.Export) }, onClick = { nav.open(Route.Privacy) })
            Hairline()
            ListRow("Correct", subtitle = "Edit any entry where you see it; your name in Edit profile", leading = { IconTile(AppIcons.Pencil) }, onClick = { nav.open(Route.EditProfile) })
            Hairline()
            ListRow("Erase this phone or delete your account", subtitle = "Settings > Privacy > Erase", leading = { IconTile(AppIcons.Trash) }, onClick = { nav.open(Route.Privacy) })
            SectionHeader("Withdraw consent")
            Text(Rights.WITHDRAW, style = Aiimin.type.caption.copy(fontSize = 14.sp, lineHeight = 21.sp))
            SectionHeader("Ask us")
            Text(Rights.IDENTIFIER, style = Aiimin.type.caption.copy(fontSize = 14.sp, lineHeight = 21.sp))
            Text("Reply time: ${Rights.REPLY}", style = Aiimin.type.caption.copy(fontSize = 14.sp, lineHeight = 21.sp), modifier = Modifier.padding(top = 6.dp))
            Spacer(Modifier.height(10.dp))
            AppButton("Write to ${Rights.EMAIL}", { mail("My data rights") }, Modifier.fillMaxWidth(), kind = ButtonKind.SECONDARY, icon = AppIcons.EnvelopeSimple)
            SectionHeader("Nominate someone")
            Text(Rights.NOMINATE, style = Aiimin.type.caption.copy(fontSize = 14.sp, lineHeight = 21.sp))
            AppButton("Name a nominee by email", { mail("Nominee for my AIIMIN account") }, Modifier.padding(top = 10.dp), kind = ButtonKind.GHOST, compact = true)
            SectionHeader("Complain")
            Text(Rights.BOARD, style = Aiimin.type.caption.copy(fontSize = 14.sp, lineHeight = 21.sp))
            SectionHeader("If there is a breach")
            Text(Rights.BREACH, style = Aiimin.type.caption.copy(fontSize = 14.sp, lineHeight = 21.sp))
            Text("Grievance contact: ${Rights.EMAIL}", style = Aiimin.type.label, modifier = Modifier.padding(top = 20.dp, bottom = 32.dp))
        }
    }
}
