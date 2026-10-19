package aiimin.feature.me

import aiimin.core.data.app.PreferencesRepository
import aiimin.core.data.settings.SyncKinds
import aiimin.core.data.sync.AuthRepository
import aiimin.core.data.sync.Snap
import aiimin.core.data.sync.SyncRepository
import aiimin.core.data.sync.SyncScheduler
import aiimin.core.data.sync.SyncState
import aiimin.core.data.sync.TrashItem
import aiimin.core.data.sync.TrashRepository
import aiimin.core.database.SyncConflictEntity
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppSheet
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.Chevron
import aiimin.designsystem.component.EmptyState
import aiimin.designsystem.component.Hairline
import aiimin.designsystem.component.IconTile
import aiimin.designsystem.component.ListRow
import aiimin.designsystem.component.SectionHeader
import aiimin.designsystem.component.SwitchRow
import aiimin.designsystem.component.TopBar
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.LocalToaster
import aiimin.designsystem.nav.Route
import aiimin.designsystem.theme.Aiimin
import android.content.Context
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

@HiltViewModel
class SyncSettingsViewModel @Inject constructor(
    @ApplicationContext private val context: Context,
    private val sync: SyncRepository,
    private val auth: AuthRepository,
    private val prefs: PreferencesRepository,
    trash: TrashRepository,
) : ViewModel() {
    val state = sync.state
    val session = auth.session.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)
    val settings = prefs.state.stateIn(viewModelScope, SharingStarted.Eagerly, null)
    val conflicts = sync.openConflicts.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    val trashCount = trash.items.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    val busy = MutableStateFlow(false)
    val message = MutableStateFlow<String?>(null)

    fun syncNow() = viewModelScope.launch {
        busy.value = true
        val r = sync.sync(force = true)
        message.value = when {
            r != null && r.conflicts > 0 -> "${r.conflicts} ${if (r.conflicts == 1) "change needs" else "changes need"} your choice"
            r != null -> "Synced · ${r.pushed} sent, ${r.pulled} received" + if (r.failed > 0) ", ${r.failed} to retry" else ""
            sync.state.value is SyncState.Offline -> "Offline. Changes are saved on this phone and go when you're back."
            sync.state.value is SyncState.Attention -> (sync.state.value as SyncState.Attention).message
            else -> "Sign in first"
        }
        busy.value = false
    }

    fun scope(key: String, on: Boolean) = viewModelScope.launch {
        prefs.update { it.copy(syncScope = if (on) it.syncScope + key else it.syncScope - key) }
    }

    fun journal(on: Boolean) = viewModelScope.launch { prefs.update { it.copy(journalSync = on) } }

    fun wifiOnly(on: Boolean) = viewModelScope.launch {
        prefs.update { it.copy(syncWifiOnly = on) }
        SyncScheduler.schedulePeriodic(context, on)
    }

    fun retryAt(): Long? = sync.retryAt()
    val lastReplace = MutableStateFlow(sync.lastReplace())
    fun undoReplace() = viewModelScope.launch {
        val n = sync.undoReplace()
        lastReplace.value = null
        message.value = "Brought back $n ${if (n == 1) "item" else "items"}. They'll sync up as new."
        sync.sync(force = true)
    }
}

private val clockFmt = DateTimeFormatter.ofPattern("h:mm a", Locale.ENGLISH)

private fun syncedAgo(ms: Long?): String {
    if (ms == null) return "Not synced yet"
    val mins = (System.currentTimeMillis() - ms) / 60_000
    return when {
        mins < 1 -> "Synced just now"
        mins < 60 -> "Synced $mins min ago"
        mins < 24 * 60 -> "Synced at " + clockFmt.format(Instant.ofEpochMilli(ms).atZone(ZoneId.systemDefault()))
        else -> "Synced ${mins / (24 * 60)} days ago"
    }
}

/** Sync settings: what travels, when, and the two places sync can need you (conflicts, Trash). */
@Composable
fun SyncSettingsScreen(vm: SyncSettingsViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val c = Aiimin.colors
    val s by vm.settings.collectAsStateWithLifecycle()
    val state by vm.state.collectAsStateWithLifecycle()
    val session by vm.session.collectAsStateWithLifecycle()
    val conflicts by vm.conflicts.collectAsStateWithLifecycle()
    val trash by vm.trashCount.collectAsStateWithLifecycle()
    val busy by vm.busy.collectAsStateWithLifecycle()
    val msg by vm.message.collectAsStateWithLifecycle()
    var journalAsk by remember { mutableStateOf(false) }
    LaunchedEffect(msg) { msg?.let { toaster.show(it); vm.message.value = null } }
    val st = s ?: return
    val signedIn = session?.signedIn == true
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Sync", onBack = { nav.back() })
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = Aiimin.space.gutter)) {
            // Status line + Sync now.
            Row(Modifier.fillMaxWidth().padding(top = 8.dp).heightIn(min = 64.dp), verticalAlignment = Alignment.CenterVertically) {
                Column(Modifier.weight(1f)) {
                    Text(
                        when {
                            !signedIn -> "Only on this phone"
                            state is SyncState.Syncing -> "Syncing…"
                            state is SyncState.Offline -> "Offline"
                            state is SyncState.Attention -> "Needs you"
                            else -> "Up to date"
                        },
                        style = Aiimin.type.title.copy(fontSize = 22.sp),
                    )
                    val retry = vm.retryAt()
                    Text(
                        when {
                            !signedIn -> "Sign in to aiimin.in to keep a copy on the website."
                            state is SyncState.Attention -> (state as SyncState.Attention).message
                            state is SyncState.Offline -> "Changes are saved here and go when you're back online."
                            retry != null -> "Last try failed. Next try at " + clockFmt.format(Instant.ofEpochMilli(retry).atZone(ZoneId.systemDefault()))
                            else -> syncedAgo(st.lastSyncAt)
                        },
                        style = Aiimin.type.caption.copy(fontSize = 13.5.sp),
                    )
                }
                if (signedIn) AppButton(if (busy) "Syncing…" else "Sync now", { vm.syncNow() }, enabled = !busy, compact = true, icon = AppIcons.ArrowsClockwise)
                else AppButton("Sign in", { nav.open(Route.SignIn()) }, compact = true)
            }
            Hairline(Modifier.padding(top = 8.dp))
            if (conflicts.isNotEmpty()) {
                ListRow(
                    "${conflicts.size} ${if (conflicts.size == 1) "change" else "changes"} to choose",
                    subtitle = "Edited on this phone and on aiimin.in since the last sync",
                    leading = { IconTile(AppIcons.WarningCircle, tint = c.accentText) },
                    trailing = { Chevron() },
                    onClick = { nav.open(Route.Conflicts) },
                    titleColor = c.accentText,
                )
                Hairline()
            }

            SectionHeader("What syncs")
            val scope = st.syncScope
            SwitchRow("Tasks", SyncKinds.TASKS in scope, { vm.scope(SyncKinds.TASKS, it) }, subtitle = "Dated tasks, both ways. Someday and family tasks stay here.", icon = AppIcons.CheckSquare)
            SwitchRow("Calendar", SyncKinds.CALENDAR in scope, { vm.scope(SyncKinds.CALENDAR, it) }, subtitle = "Events you add, both ways. Vault expiry markers stay here.", icon = AppIcons.CalendarBlank)
            SwitchRow("Notes", SyncKinds.NOTES in scope, { vm.scope(SyncKinds.NOTES, it) }, subtitle = "Title and text, both ways.", icon = AppIcons.NotePencil)
            SwitchRow("Goals", SyncKinds.GOALS in scope, { vm.scope(SyncKinds.GOALS, it) }, subtitle = "Title, why, date and milestones.", icon = AppIcons.Flag)
            SwitchRow("Minimums", SyncKinds.MINIMUMS in scope, { vm.scope(SyncKinds.MINIMUMS, it) }, subtitle = "As habits on the website, with each day's tick.", icon = AppIcons.ListChecks)
            SwitchRow("Payments", SyncKinds.MONEY in scope, { vm.scope(SyncKinds.MONEY, it) }, subtitle = "Booked personal payments. The bank-alert text stays here.", icon = AppIcons.Wallet)
            SwitchRow(
                "Journal text", st.journalSync, { on -> if (on) journalAsk = true else vm.journal(false) },
                subtitle = if (st.journalSync) "On. Each day's entries are sent as one entry." else "Off. Your journal never leaves this phone.",
                icon = AppIcons.BookOpen,
            )

            SectionHeader("When")
            SwitchRow("Only on Wi-Fi", st.syncWifiOnly, { vm.wifiOnly(it) }, subtitle = "Background sync waits for Wi-Fi. Sync now always works.", icon = AppIcons.WifiHigh)
            Text(
                "Sync runs when you open AIIMIN, every half hour in the background, and as soon as the network comes back. If a try fails, the next one waits a little longer each time, up to 30 minutes.",
                style = Aiimin.type.caption.copy(fontSize = 13.sp, lineHeight = 19.sp), modifier = Modifier.padding(top = 6.dp),
            )

            val replaced by vm.lastReplace.collectAsStateWithLifecycle()
            replaced?.let { (_, count) ->
                SectionHeader("Last replace")
                ListRow(
                    "Undo replace", subtitle = "Bring back the $count ${if (count == 1) "item" else "items"} this phone moved to Trash",
                    leading = { IconTile(AppIcons.ClockCounter, tint = c.accentText) }, onClick = { vm.undoReplace() },
                )
                Hairline()
            }
            SectionHeader("Deleted items")
            ListRow(
                "Trash", subtitle = if (trash.isEmpty()) "Empty" else "${trash.size} ${if (trash.size == 1) "item" else "items"} · kept 30 days",
                leading = { IconTile(AppIcons.Trash) }, trailing = { Chevron() }, onClick = { nav.open(Route.Trash) },
            )
            Hairline()

            SectionHeader("What this means")
            listOf(
                "On aiimin.in" to "What you switch on above is stored on aiimin.in as plain text so the website can show it. It is not end-to-end encrypted.",
                "Never synced" to "Document files, bank-message text, emergency cards and health samples stay on this phone.",
                "On this phone" to "Your sign-in, journal and sensitive vault files are encrypted with a key kept in this phone's secure hardware.",
            ).forEach { (h, b) ->
                Text(h, style = Aiimin.type.bodyStrong, modifier = Modifier.padding(top = 12.dp))
                Text(b, style = Aiimin.type.caption.copy(fontSize = 13.5.sp, lineHeight = 20.sp), modifier = Modifier.padding(top = 2.dp))
            }
            Spacer(Modifier.height(40.dp))
        }
    }
    if (journalAsk) {
        AppSheet({ journalAsk = false }, title = "Send journal text to aiimin.in?") {
            Text(
                "Your journal is encrypted on this phone. With this on, each day's entries are sent to aiimin.in and stored there as plain text so you can read them on the website. You can switch it off any time; entries already sent stay until you delete them there.",
                style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(bottom = 16.dp),
            )
            AppButton("Send my journal", { journalAsk = false; vm.journal(true) }, Modifier.fillMaxWidth())
            Spacer(Modifier.height(8.dp))
            AppButton("Keep it on this phone", { journalAsk = false }, Modifier.fillMaxWidth(), kind = ButtonKind.SECONDARY)
        }
    }
}

// =================================================================== G5 Conflicts

@HiltViewModel
class ConflictsViewModel @Inject constructor(private val sync: SyncRepository) : ViewModel() {
    val conflicts = sync.openConflicts.stateIn(viewModelScope, SharingStarted.Eagerly, null)
    fun keep(c: SyncConflictEntity, phone: Boolean) = viewModelScope.launch {
        sync.resolve(c.id, keepPhone = phone)
        sync.sync(force = true)
    }
}

private val fieldNames = mapOf(
    "title" to "Title", "done" to "Done", "body" to "Text", "pinned" to "Pinned", "start" to "Starts", "end" to "Ends",
    "allDay" to "All day", "location" to "Place", "why" to "Why", "due" to "Target date", "archived" to "Archived",
    "milestones" to "Milestones", "name" to "Name",
)

private val whenFmt = DateTimeFormatter.ofPattern("d MMM, h:mm a", Locale.ENGLISH)

private fun fieldValue(field: String, v: String?): String = when {
    v.isNullOrBlank() -> "—"
    v == "true" -> "Yes"
    v == "false" -> "No"
    (field == "start" || field == "end") && v.toLongOrNull() != null -> whenFmt.format(Instant.ofEpochMilli(v.toLong()).atZone(ZoneId.systemDefault()))
    field == "milestones" -> v.lines().joinToString(" · ") { (if (it.startsWith("x ")) "✓ " else "") + it.drop(2) }
    else -> v
}

/** G5 · both sides changed the same item. Each one shows what differs; nothing moves until you choose. */
@Composable
fun ConflictsScreen(vm: ConflictsViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val c = Aiimin.colors
    val list by vm.conflicts.collectAsStateWithLifecycle()
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Changes to choose", onBack = { nav.back() })
        val items = list ?: return@Column
        if (items.isEmpty()) {
            EmptyState(AppIcons.CheckCircle, "Nothing to choose", "When the same item is changed here and on aiimin.in between syncs, it waits here for you.")
            return@Column
        }
        LazyColumn(contentPadding = PaddingValues(start = Aiimin.space.gutter, end = Aiimin.space.gutter, bottom = 40.dp)) {
            item {
                Text(
                    "These were changed on this phone and on aiimin.in since the last sync. Pick the version to keep; the other is replaced on both sides.",
                    style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(vertical = 12.dp),
                )
            }
            items(items, key = { it.id }) { conflict ->
                val local = Snap.parse(conflict.local)
                val remote = Snap.parse(conflict.remote)
                Column(Modifier.fillMaxWidth().padding(vertical = 14.dp)) {
                    Text(SyncRepository.kindLabel(conflict.kind).uppercase(), style = Aiimin.type.eyebrow.copy(color = c.accentText))
                    Text(conflict.title, style = Aiimin.type.headline, modifier = Modifier.padding(top = 4.dp))
                    Snap.diff(conflict.local, conflict.remote).forEach { f ->
                        Text(fieldNames[f] ?: f, style = Aiimin.type.caption.copy(fontWeight = FontWeight.SemiBold), modifier = Modifier.padding(top = 12.dp))
                        Row(Modifier.fillMaxWidth().padding(top = 4.dp)) {
                            Column(Modifier.weight(1f)) {
                                Text("This phone", style = Aiimin.type.caption.copy(fontSize = 12.sp))
                                Text(fieldValue(f, local[f]), style = Aiimin.type.body, maxLines = 4)
                            }
                            Spacer(Modifier.width(16.dp))
                            Column(Modifier.weight(1f)) {
                                Text("aiimin.in", style = Aiimin.type.caption.copy(fontSize = 12.sp))
                                Text(fieldValue(f, remote[f]), style = Aiimin.type.body, maxLines = 4)
                            }
                        }
                    }
                    Row(Modifier.fillMaxWidth().padding(top = 14.dp), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        AppButton("Keep this phone's", { vm.keep(conflict, true); toaster.show("Kept this phone's version") }, Modifier.weight(1f), compact = true)
                        AppButton("Keep aiimin.in's", { vm.keep(conflict, false); toaster.show("Kept the website's version") }, Modifier.weight(1f), kind = ButtonKind.SECONDARY, compact = true)
                    }
                }
                Hairline()
            }
        }
    }
}

// =================================================================== G7 Trash

@HiltViewModel
class TrashViewModel @Inject constructor(private val trash: TrashRepository) : ViewModel() {
    val items = trash.items.stateIn(viewModelScope, SharingStarted.Eagerly, null)
    fun restore(i: TrashItem) = viewModelScope.launch { trash.restore(i) }
    fun delete(i: TrashItem) = viewModelScope.launch { trash.deleteForever(i) }
    fun empty() = viewModelScope.launch { trash.empty(items.value.orEmpty()) }
}

private fun kindIcon(kind: String) = when (kind) {
    SyncRepository.KIND_TASK -> AppIcons.CheckSquare
    SyncRepository.KIND_NOTE -> AppIcons.NotePencil
    SyncRepository.KIND_EVENT -> AppIcons.CalendarBlank
    SyncRepository.KIND_GOAL -> AppIcons.Flag
    else -> AppIcons.FileText
}

/** G7 · Trash. Deleted items wait 30 days, then go for good. */
@Composable
fun TrashScreen(vm: TrashViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val c = Aiimin.colors
    val list by vm.items.collectAsStateWithLifecycle()
    var confirmEmpty by remember { mutableStateOf(false) }
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Trash", onBack = { nav.back() })
        val items = list ?: return@Column
        if (items.isEmpty()) {
            EmptyState(AppIcons.Trash, "Trash is empty", "Deleted tasks, notes, events and goals stay here for 30 days, so a slip is easy to undo.")
            return@Column
        }
        LazyColumn(Modifier.weight(1f), contentPadding = PaddingValues(start = Aiimin.space.gutter, end = Aiimin.space.gutter, bottom = 24.dp)) {
            item {
                SectionHeader("${items.size} ${if (items.size == 1) "item" else "items"}", action = "Empty trash", onAction = { confirmEmpty = true })
            }
            items(items, key = { it.kind + it.id }) { item ->
                Row(Modifier.fillMaxWidth().heightIn(min = 60.dp).padding(vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
                    IconTile(kindIcon(item.kind))
                    Spacer(Modifier.width(12.dp))
                    Column(Modifier.weight(1f)) {
                        Text(item.title, style = Aiimin.type.bodyStrong, maxLines = 2)
                        val left = item.daysLeft()
                        Text(
                            SyncRepository.kindLabel(item.kind) + " · " + if (left <= 1) "goes for good tomorrow" else "$left days left",
                            style = Aiimin.type.caption,
                        )
                    }
                    Text(
                        "Restore",
                        style = Aiimin.type.label.copy(color = c.accentText, fontSize = 14.sp),
                        modifier = Modifier.padding(horizontal = 6.dp).heightIn(min = 48.dp).wrapClick { vm.restore(item); toaster.show("Restored") },
                    )
                    Text(
                        "Delete",
                        style = Aiimin.type.label.copy(color = c.textMuted, fontSize = 14.sp),
                        modifier = Modifier.padding(start = 6.dp).heightIn(min = 48.dp).wrapClick { vm.delete(item) },
                    )
                }
                Hairline()
            }
        }
    }
    if (confirmEmpty) {
        AppSheet({ confirmEmpty = false }, title = "Empty Trash?") {
            Text("Everything here is removed for good, on this phone and, when synced, on aiimin.in. This can't be undone.", style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(bottom = 16.dp))
            AppButton("Empty trash", { confirmEmpty = false; vm.empty() }, Modifier.fillMaxWidth(), kind = ButtonKind.DANGER)
            Spacer(Modifier.height(8.dp))
            AppButton("Cancel", { confirmEmpty = false }, Modifier.fillMaxWidth(), kind = ButtonKind.SECONDARY)
        }
    }
}

/** A text action with a 48 dp touch target, vertically centred. */
private fun Modifier.wrapClick(onClick: () -> Unit): Modifier =
    this.clickable(onClick = onClick).wrapContentHeight(Alignment.CenterVertically)
