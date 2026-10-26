package aiimin.feature.me

import aiimin.core.data.notify.NotificationRepository
import aiimin.core.data.settings.AppSettings
import aiimin.core.data.settings.SettingsStore
import aiimin.core.engine.notify.Category
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.Chevron
import aiimin.designsystem.component.IconTile
import aiimin.designsystem.component.ListRow
import aiimin.designsystem.component.Pill
import aiimin.designsystem.component.PillRow
import aiimin.designsystem.component.SectionHeader
import aiimin.designsystem.component.SurfaceCard
import aiimin.designsystem.component.SwitchRow
import aiimin.designsystem.component.TopBar
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.Route
import aiimin.designsystem.theme.Aiimin
import android.content.Context
import android.content.Intent
import android.os.Build
import android.provider.Settings
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.LifecycleEventEffect
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

@HiltViewModel
class NotifySettingsViewModel @Inject constructor(private val store: SettingsStore, private val repo: NotificationRepository) : ViewModel() {
    val settings = store.settings.stateIn(viewModelScope, SharingStarted.Eagerly, null)
    val counters = repo.counters().stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    fun save(change: (AppSettings) -> AppSettings) = viewModelScope.launch { store.update(change) }
    fun off(): Set<Category> = repo.channelsOff()
    fun sendTest() = viewModelScope.launch { repo.announce("test:${System.currentTimeMillis()}", "A test from AIIMIN", "This is how a note from Raahi looks.", "today") }
}

private fun openAndroidSettings(context: Context) {
    val i = if (Build.VERSION.SDK_INT >= 26) Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).putExtra(Settings.EXTRA_APP_PACKAGE, context.packageName)
    else Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).setData(android.net.Uri.fromParts("package", context.packageName, null))
    runCatching { context.startActivity(i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)) }
}

/** Settings › Notifications (PRD 2.1): promises always arrive; nudges are few and earned. */
@Composable
fun NotifySettingsScreen(vm: NotifySettingsViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val context = LocalContext.current
    val c = Aiimin.colors
    val s by vm.settings.collectAsStateWithLifecycle()
    val counters by vm.counters.collectAsStateWithLifecycle()
    var off by remember { mutableStateOf(vm.off()) }
    // Re-read when coming back from Android's own settings.
    LifecycleEventEffect(Lifecycle.Event.ON_RESUME) { off = vm.off() }
    val st = s ?: return
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Notifications", onBack = { nav.back() })
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = Aiimin.space.gutter)) {
            if (off.size == Category.entries.size) {
                // Permission denied or switched off: the app works; this is the how-to (2.1 done-when).
                SurfaceCard(Modifier.padding(top = 8.dp)) {
                    Text("Notifications are off for AIIMIN", style = Aiimin.type.bodyStrong)
                    Text("Everything still shows in the inbox and on Today. To get reminders on time, turn notifications on in Android settings.", style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(top = 4.dp))
                    AppButton("Open Android settings", { openAndroidSettings(context) }, Modifier.padding(top = 12.dp), kind = ButtonKind.SECONDARY, compact = true)
                }
            } else if (off.isNotEmpty()) {
                Text("Off in Android: " + off.joinToString(", ") { it.label } + ". These show in the inbox instead.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 8.dp))
            }
            ListRow("Inbox", subtitle = "Everything AIIMIN has told you", leading = { IconTile(AppIcons.Bell) }, trailing = { Chevron() }, opens = Route.Notifications, onClick = { nav.open(Route.Notifications) }, modifier = Modifier.padding(top = 8.dp))

            SectionHeader("How many")
            Text("Nudges a day, at most", style = Aiimin.type.body)
            PillRow { (2..6).forEach { n -> Pill("$n", st.notifyCeiling == n, { vm.save { it.copy(notifyCeiling = n) } }) } }
            Text("Your own reminders, bills due and document dates are never limited. Nudges start at one a day and earn more when you open them, never more than 3 hours apart.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 4.dp))

            SectionHeader("What")
            ListRow("Your reminders", subtitle = "Tasks and events you gave a time. Always on.", leading = { IconTile(AppIcons.Clock) })
            SwitchRow("Bills and documents", st.notifyBillsDocs, { v -> vm.save { it.copy(notifyBillsDocs = v) } }, subtitle = "Bills due tomorrow, documents expiring")
            SwitchRow("Morning brief", st.notifyBrief, { v -> vm.save { it.copy(notifyBrief = v) } }, subtitle = "The shape of the day, from your third day")
            SwitchRow("Evening wrap-up", st.notifyWrapUp, { v -> vm.save { it.copy(notifyWrapUp = v) } }, subtitle = "What waited today, in one note")
            SwitchRow("Nudges", st.notifyNudges, { v -> vm.save { it.copy(notifyNudges = v) } }, subtitle = "Minimums in the evening, a lighter day, your week")
            val stopped = st.stoppedCategories.mapNotNull { n -> Category.entries.firstOrNull { it.name == n } }
            if (stopped.isNotEmpty()) {
                ListRow(
                    "Stopped: " + stopped.joinToString(", ") { it.label }, subtitle = "They stay in the inbox. Tap to turn them back on.",
                    leading = { IconTile(AppIcons.Prohibit) }, onClick = { vm.save { it.copy(stoppedCategories = emptySet(), stopAnswered = emptySet()) } },
                )
            }

            SectionHeader("Voice")
            SwitchRow("Playful lines", st.playful, { v -> vm.save { it.copy(playful = v) } }, subtitle = "A little wit on small nudges. Money, documents and safety stay plain.")

            SectionHeader("Lock screen")
            SwitchRow("Show details on the lock screen", st.lockDetails, { v -> vm.save { it.copy(lockDetails = v) } }, subtitle = "Off: amounts and document names stay hidden until you unlock.")
            ListRow("Android notification settings", subtitle = "Each kind has its own switch there", leading = { IconTile(AppIcons.Gear) }, trailing = { Chevron() }, onClick = { openAndroidSettings(context) })
            ListRow("Send a test notification", leading = { IconTile(AppIcons.Send) }, onClick = { vm.sendTest() })

            // On-phone counters (2.1 "Measure for ourselves"): tester builds only.
            if (isTesterBuild(context)) {
                SectionHeader("Last 30 days (tester build)")
                counters.filter { it.sent + it.inbox > 0 || it.channelOff }.forEach { k ->
                    Text(
                        "${k.category.label}: ${k.sent} sent, ${k.opened} opened, ${k.dismissed} dismissed, ${k.inbox} inbox only" + if (k.channelOff) " · off in Android" else "",
                        style = Aiimin.type.caption, modifier = Modifier.padding(vertical = 2.dp),
                    )
                }
                if (counters.none { it.sent + it.inbox > 0 }) Text("Nothing yet.", style = Aiimin.type.caption)
            }
            Spacer(Modifier.height(32.dp))
        }
    }
}

private fun isTesterBuild(context: Context): Boolean =
    runCatching { context.packageManager.getPackageInfo(context.packageName, 0).versionName.orEmpty().contains("beta") }.getOrDefault(false)
