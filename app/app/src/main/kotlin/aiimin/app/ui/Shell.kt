package aiimin.app.ui

import aiimin.app.FocusDoneWorker
import aiimin.core.data.app.Maintenance
import aiimin.core.data.notify.NotificationRepository
import aiimin.core.data.plan.ActiveFocus
import aiimin.core.data.plan.FocusRepository
import aiimin.designsystem.component.Dock
import aiimin.designsystem.component.DockItem
import aiimin.designsystem.component.ToastHost
import aiimin.designsystem.component.Toaster
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.AppNavigator
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.LocalToaster
import aiimin.designsystem.nav.Route
import aiimin.designsystem.nav.Tab
import aiimin.designsystem.theme.Aiimin
import aiimin.designsystem.theme.Motion
import aiimin.designsystem.theme.Shapes
import aiimin.feature.assistant.AssistantScreen
import aiimin.feature.assistant.CaptureSheet
import aiimin.feature.me.AccountScreen
import aiimin.feature.me.ActivityScreen
import aiimin.feature.me.AiSettingsScreen
import aiimin.feature.me.BatteryScreen
import aiimin.feature.me.MeScreen
import aiimin.feature.me.NotificationsScreen
import aiimin.feature.me.PhoneDayScreen
import aiimin.feature.me.ScoreScreen
import aiimin.feature.me.SearchScreen
import aiimin.feature.me.SensorsScreen
import aiimin.feature.me.SettingsScreen
import aiimin.feature.me.SignalScreen
import aiimin.feature.me.SignalsScreen
import aiimin.feature.money.BudgetScreen
import aiimin.feature.money.MoneyInboxScreen
import aiimin.feature.money.MoneyScreen
import aiimin.feature.money.TxnScreen
import aiimin.feature.notes.JournalScreen
import aiimin.feature.notes.JournalWriteScreen
import aiimin.feature.notes.NoteScreen
import aiimin.feature.notes.NotesScreen
import aiimin.feature.today.CalendarScreen
import aiimin.feature.today.FocusScreen
import aiimin.feature.today.MinimumsScreen
import aiimin.feature.today.TaskScreen
import aiimin.feature.today.TodayScreen
import aiimin.feature.today.UpcomingScreen
import aiimin.feature.vault.DocScreen
import aiimin.feature.vault.EmergencyCardScreen
import aiimin.feature.vault.FamilyScreen
import aiimin.feature.vault.PersonScreen
import aiimin.feature.vault.VaultScreen
import androidx.activity.compose.BackHandler
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.animation.slideOutVertically
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.LifecycleEventEffect
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.navigation3.rememberViewModelStoreNavEntryDecorator
import androidx.navigation3.runtime.entryProvider
import androidx.navigation3.runtime.rememberSaveableStateHolderNavEntryDecorator
import androidx.navigation3.ui.NavDisplay
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

@HiltViewModel
class ShellViewModel @Inject constructor(
    focus: FocusRepository,
    notifications: NotificationRepository,
    private val maintenance: Maintenance,
) : ViewModel() {
    val focus = focus.active.stateIn(viewModelScope, SharingStarted.Eagerly, null)
    val unread = notifications.unread.stateIn(viewModelScope, SharingStarted.Eagerly, 0)
    fun resume() = viewModelScope.launch { runCatching { maintenance.run() } }
}

private val ROOTS = setOf<Route>(Route.Today, Route.Money, Route.Vault, Route.Me)

private fun Tab.root(): Route = when (this) {
    Tab.TODAY -> Route.Today
    Tab.MONEY -> Route.Money
    Tab.VAULT -> Route.Vault
    Tab.ME -> Route.Me
}

/** Pending launch request from a notification or a share. */
sealed interface LaunchRequest {
    data class Open(val route: Route) : LaunchRequest
    data class Capture(val text: String) : LaunchRequest
}

@Composable
fun Shell(request: LaunchRequest?, onRequestHandled: () -> Unit, vm: ShellViewModel = hiltViewModel()) {
    val c = Aiimin.colors
    val context = LocalContext.current
    val stack = remember { mutableStateListOf<Route>(Route.Today) }
    var tabSwitch by remember { mutableStateOf(false) }
    var capture by remember { mutableStateOf<Pair<String?, Boolean>?>(null) }
    val toaster = remember { Toaster() }
    val focus by vm.focus.collectAsStateWithLifecycle()
    val unread by vm.unread.collectAsStateWithLifecycle()

    val navigator = remember {
        object : AppNavigator {
            override fun open(route: Route) {
                tabSwitch = false
                if (stack.lastOrNull() != route) stack.add(route)
            }

            override fun back() {
                tabSwitch = false
                if (stack.size > 1) stack.removeAt(stack.lastIndex)
            }

            override fun tab(tab: Tab) {
                val root = tab.root()
                if (stack.size == 1 && stack[0] == root) return
                tabSwitch = true
                stack.clear()
                stack.add(root)
            }

            override fun capture(prefill: String?, voice: Boolean) {
                capture = prefill to voice
            }
        }
    }

    LifecycleEventEffect(Lifecycle.Event.ON_RESUME) { vm.resume() }
    LaunchedEffect(request) {
        when (request) {
            is LaunchRequest.Open -> navigator.open(request.route)
            is LaunchRequest.Capture -> navigator.capture(request.text)
            null -> return@LaunchedEffect
        }
        onRequestHandled()
    }
    // The focus alarm follows the session: scheduled while running, cancelled otherwise.
    LaunchedEffect(focus) {
        val f = focus
        if (f != null && f.running) {
            val left = f.plannedMin - f.elapsedMs(System.currentTimeMillis()) / 60_000
            if (left > 0) FocusDoneWorker.schedule(context, f.label, left, f.plannedMin) else FocusDoneWorker.cancel(context)
        } else {
            FocusDoneWorker.cancel(context)
        }
    }

    val top = stack.last()
    BackHandler(enabled = stack.size == 1 && top != Route.Today) { navigator.tab(Tab.TODAY) }

    CompositionLocalProvider(LocalNavigator provides navigator, LocalToaster provides toaster) {
        Box(Modifier.fillMaxSize().background(c.base)) {
            Column(Modifier.fillMaxSize()) {
                NavDisplay(
                    backStack = stack,
                    onBack = { navigator.back() },
                    modifier = Modifier.weight(1f),
                    entryDecorators = listOf(rememberSaveableStateHolderNavEntryDecorator(), rememberViewModelStoreNavEntryDecorator()),
                    transitionSpec = {
                        if (tabSwitch) {
                            fadeIn(tween(Motion.FAST + 30)).togetherWith(fadeOut(tween(Motion.FAST)))
                        } else {
                            slideInHorizontally(tween(280, easing = Motion.enter)) { it }
                                .togetherWith(slideOutHorizontally(tween(280, easing = Motion.enter)) { -it / 3 } + fadeOut(tween(280), targetAlpha = 0.6f))
                        }
                    },
                    popTransitionSpec = {
                        (slideInHorizontally(tween(260, easing = Motion.enter)) { -it / 3 } + fadeIn(tween(260), initialAlpha = 0.6f))
                            .togetherWith(slideOutHorizontally(tween(240, easing = Motion.exit)) { it })
                    },
                    predictivePopTransitionSpec = {
                        (slideInHorizontally { -it / 3 } + fadeIn(initialAlpha = 0.6f)).togetherWith(slideOutHorizontally { it })
                    },
                    entryProvider = entryProvider {
                        entry<Route.Today> { TodayScreen() }
                        entry<Route.Money> { MoneyScreen() }
                        entry<Route.Vault> { VaultScreen() }
                        entry<Route.Me> { MeScreen() }
                        entry<Route.Task> { TaskScreen(it.id) }
                        entry<Route.Calendar> { CalendarScreen() }
                        entry<Route.Focus> { FocusScreen(it) }
                        entry<Route.Minimums> { MinimumsScreen() }
                        entry<Route.Upcoming> { UpcomingScreen() }
                        entry<Route.Score> { ScoreScreen() }
                        entry<Route.Signals> { SignalsScreen() }
                        entry<Route.Signal> { SignalScreen(it.key) }
                        entry<Route.Battery> { BatteryScreen() }
                        entry<Route.Activity> { ActivityScreen() }
                        entry<Route.Notifications> { NotificationsScreen() }
                        entry<Route.Search> { SearchScreen() }
                        entry<Route.Settings> { SettingsScreen() }
                        entry<Route.Sensors> { SensorsScreen() }
                        entry<Route.AiSettings> { AiSettingsScreen() }
                        entry<Route.Account> { AccountScreen() }
                        entry<Route.PhoneDay> { PhoneDayScreen() }
                        entry<Route.MoneyInbox> { MoneyInboxScreen() }
                        entry<Route.Txn> { TxnScreen(it.id) }
                        entry<Route.Budget> { BudgetScreen() }
                        entry<Route.Doc> { DocScreen(it.id) }
                        entry<Route.Person> { PersonScreen(it.id) }
                        entry<Route.Family> { FamilyScreen() }
                        entry<Route.EmergencyCard> { EmergencyCardScreen(it.personId) }
                        entry<Route.Notes> { NotesScreen() }
                        entry<Route.Note> { NoteScreen(it.id) }
                        entry<Route.Journal> { JournalScreen() }
                        entry<Route.JournalWrite> { JournalWriteScreen(it.id) }
                        entry<Route.Assistant> { AssistantScreen(it) }
                    },
                )
                AnimatedVisibility(
                    visible = top in ROOTS,
                    enter = slideInVertically(tween(Motion.BASE, easing = Motion.enter)) { it } + fadeIn(tween(Motion.FAST)),
                    exit = slideOutVertically(tween(Motion.FAST, easing = Motion.exit)) { it } + fadeOut(tween(Motion.FAST)),
                ) {
                    Dock(
                        items = listOf(
                            DockItem("Today", AppIcons.Today, top == Route.Today, { navigator.tab(Tab.TODAY) }, badge = unread > 0),
                            DockItem("Money", AppIcons.Money, top == Route.Money, { navigator.tab(Tab.MONEY) }),
                            DockItem("Vault", AppIcons.Vault, top == Route.Vault, { navigator.tab(Tab.VAULT) }),
                            DockItem("Me", AppIcons.Me, top == Route.Me, { navigator.tab(Tab.ME) }),
                        ),
                        onPlus = { navigator.capture() },
                        onPlusLong = { navigator.capture(voice = true) },
                    )
                }
            }
            focus?.let { f ->
                if (top !is Route.Focus) {
                    FocusPill(f, Modifier.align(Alignment.BottomCenter).padding(bottom = if (top in ROOTS) 96.dp else 24.dp)) { navigator.open(Route.Focus()) }
                }
            }
            ToastHost(toaster, Modifier.align(Alignment.BottomCenter).padding(bottom = if (top in ROOTS) 88.dp else 16.dp))
        }
        capture?.let { (prefill, voice) -> CaptureSheet(prefill, voice, onDismiss = { capture = null }) }
    }
}

/** Running timer, visible anywhere in the app; tap to return. */
@Composable
private fun FocusPill(f: ActiveFocus, modifier: Modifier, onClick: () -> Unit) {
    val c = Aiimin.colors
    var now by remember { mutableLongStateOf(System.currentTimeMillis()) }
    LaunchedEffect(f) {
        while (true) {
            now = System.currentTimeMillis()
            delay(1000)
        }
    }
    val left = f.plannedMin * 60_000L - f.elapsedMs(now)
    val ms = kotlin.math.abs(left)
    Row(
        modifier.clip(Shapes.control).background(c.overlay).border(1.dp, c.borderStrong, Shapes.control).clickable(onClick = onClick).padding(horizontal = 14.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(if (f.running) AppIcons.Timer else AppIcons.Pause, null, tint = c.accent, modifier = Modifier.size(16.dp))
        Spacer(Modifier.width(8.dp))
        Text((if (left < 0) "+" else "") + "%d:%02d".format(ms / 60_000, (ms / 1000) % 60), style = Aiimin.type.numberSmall)
        Spacer(Modifier.width(8.dp))
        Text(f.label, style = Aiimin.type.caption, maxLines = 1)
    }
}
