package aiimin.app.ui

import aiimin.designsystem.component.keepFinalSize
import aiimin.designsystem.component.sharedContainer
import aiimin.designsystem.theme.LocalReduceMotion
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.fillMaxWidth
import aiimin.app.FocusDoneWorker
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
import aiimin.feature.me.BodyScreen
import aiimin.feature.me.PatternsScreen
import aiimin.feature.me.WhyScoreScreen
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
import aiimin.feature.money.CategoryScreen
import aiimin.feature.money.MoneyScreen
import aiimin.feature.money.PaymentsScreen
import aiimin.feature.money.TxnScreen
import aiimin.feature.notes.JournalScreen
import aiimin.feature.notes.JournalWriteScreen
import aiimin.feature.notes.NoteScreen
import aiimin.feature.notes.NotesScreen
import aiimin.feature.today.CalendarScreen
import aiimin.feature.today.DebriefScreen
import aiimin.feature.today.FocusScreen
import aiimin.feature.today.GoalScreen
import aiimin.feature.today.GoalsScreen
import aiimin.feature.today.WeeklyReviewScreen
import aiimin.feature.today.PlanDayScreen
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
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.displayCutout
import androidx.compose.foundation.layout.union
import androidx.compose.foundation.layout.only
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.windowInsetsTopHeight
import androidx.compose.foundation.layout.statusBars
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

@HiltViewModel
class ShellViewModel @Inject constructor(
    focus: FocusRepository,
    notifications: NotificationRepository,
    money: aiimin.core.data.money.MoneyRepository,
    private val vault: aiimin.core.data.vault.VaultRepository,
    private val sync: aiimin.core.data.sync.SyncRepository,
    val auth: aiimin.core.data.sync.AuthRepository,
    val settings: aiimin.core.data.settings.SettingsStore,
) : ViewModel() {
    val syncState = sync.state
    val merge = kotlinx.coroutines.flow.MutableStateFlow<aiimin.core.data.sync.MergePreview?>(null)
    val syncing = kotlinx.coroutines.flow.MutableStateFlow(false)
    val lastSyncAt = settings.settings.map { it.lastSyncAt }.stateIn(viewModelScope, SharingStarted.Eagerly, null)
    val signedIn = auth.session.map { it.signedIn }.stateIn(viewModelScope, SharingStarted.Eagerly, false)

    /** Quick doors learn from what is opened (Part 17); counts stay on the phone. */
    fun countOpen(route: Route) = viewModelScope.launch {
        val key = route::class.simpleName.orEmpty().lowercase()
        if (key.isNotBlank()) settings.update { it.copy(featureOpens = it.featureOpens + (key to ((it.featureOpens[key] ?: 0) + 1))) }
    }

    fun afterSignIn() = viewModelScope.launch { sync.refreshState(); merge.value = sync.previewMerge().also { if (it?.webHasData != true) sync.sync() } }
    suspend fun planReplace() = sync.planReplace()
    fun mergeChoose(choice: aiimin.feature.onboarding.MergeChoice) = viewModelScope.launch {
        merge.value = null
        when (choice) {
            aiimin.feature.onboarding.MergeChoice.SEPARATE -> { settings.update { it.copy(syncScope = emptySet()) }; sync.sync() }
            aiimin.feature.onboarding.MergeChoice.REPLACE -> sync.replaceLocalWithWeb()
            aiimin.feature.onboarding.MergeChoice.MERGE -> sync.sync()
        }
    }
    fun syncNow() = viewModelScope.launch { syncing.value = true; sync.sync(); syncing.value = false }

    val focus = focus.active.stateIn(viewModelScope, SharingStarted.Eagerly, null)
    val unread = notifications.unread.stateIn(viewModelScope, SharingStarted.Eagerly, 0)
    val reviewCount = money.pending().map { it.size }.stateIn(viewModelScope, SharingStarted.Eagerly, 0)
    val expiringSoon = kotlinx.coroutines.flow.MutableStateFlow(false)
    fun resume() = viewModelScope.launch {
        runCatching { sync.refreshState() }
        expiringSoon.value = runCatching { vault.expiring(7).isNotEmpty() }.getOrDefault(false)
    }
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
    data class Capture(val text: String, val type: String? = null) : LaunchRequest
}

@Composable
fun Shell(request: LaunchRequest?, onRequestHandled: () -> Unit, vm: ShellViewModel = hiltViewModel()) {
    val c = Aiimin.colors
    val context = LocalContext.current
    val stack = remember { mutableStateListOf<Route>(Route.Today) }
    var tabSwitch by remember { mutableStateOf(false) }
    var capture by remember { mutableStateOf<Triple<String?, Boolean, String?>?>(null) }
    val toaster = remember { Toaster() }
    val focus by vm.focus.collectAsStateWithLifecycle()
    val unread by vm.unread.collectAsStateWithLifecycle()
    val reviewCount by vm.reviewCount.collectAsStateWithLifecycle()
    val expiringSoon by vm.expiringSoon.collectAsStateWithLifecycle()
    val syncState by vm.syncState.collectAsStateWithLifecycle()
    val merge by vm.merge.collectAsStateWithLifecycle()
    val syncing by vm.syncing.collectAsStateWithLifecycle()
    val lastSyncAt by vm.lastSyncAt.collectAsStateWithLifecycle()
    val signedIn by vm.signedIn.collectAsStateWithLifecycle()
    var syncSheet by remember { mutableStateOf(false) }

    val navigator = remember {
        object : AppNavigator {
            override fun open(route: Route) {
                tabSwitch = false
                if (stack.lastOrNull() != route) {
                    stack.add(route)
                    vm.countOpen(route)
                }
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

            override fun capture(prefill: String?, voice: Boolean, type: String?) {
                capture = Triple(prefill, voice, type)
            }
        }
    }

    LifecycleEventEffect(Lifecycle.Event.ON_RESUME) { vm.resume() }
    LaunchedEffect(request) {
        when (request) {
            is LaunchRequest.Open -> navigator.open(request.route)
            is LaunchRequest.Capture -> navigator.capture(request.text, type = request.type)
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
    // Every screen is the far end of a container transform keyed by its route (Part 26.5).
    val sharedScreenDecorator = remember {
        androidx.navigation3.runtime.NavEntryDecorator<Any>(onPop = { key -> aiimin.designsystem.component.SharedNav.forget(aiimin.designsystem.component.sharedKeyOf(key)) }) { entry ->
            // Pushed screens end above the gesture bar (R6 S2); the inset is consumed here, so a screen's own
            // bottom bar doesn't pad twice. Root tabs end on the dock, which takes the inset itself.
            val root = ROOTS.any { it.toString() == entry.contentKey.toString() }
            Box(
                Modifier.fillMaxSize().sharedContainer(aiimin.designsystem.component.sharedKeyOf(entry.contentKey)).background(c.base)
                    .then(
                        if (root) Modifier
                        else Modifier.windowInsetsPadding(
                            androidx.compose.foundation.layout.WindowInsets.navigationBars.only(androidx.compose.foundation.layout.WindowInsetsSides.Bottom),
                        ),
                    ),
            ) { Box(Modifier.keepFinalSize()) { entry.Content() } }
        }
    }
    val reduce = LocalReduceMotion.current
    BackHandler(enabled = stack.size == 1 && top != Route.Today) { navigator.tab(Tab.TODAY) }

    val syncUi = remember(syncState) {
        aiimin.designsystem.component.SyncUiState(
            when (syncState) {
                is aiimin.core.data.sync.SyncState.SignedOut -> aiimin.designsystem.component.SyncUi.SIGNED_OUT
                is aiimin.core.data.sync.SyncState.Idle -> aiimin.designsystem.component.SyncUi.SYNCED
                is aiimin.core.data.sync.SyncState.Syncing -> aiimin.designsystem.component.SyncUi.SYNCING
                is aiimin.core.data.sync.SyncState.Offline -> aiimin.designsystem.component.SyncUi.OFFLINE
                is aiimin.core.data.sync.SyncState.Attention -> aiimin.designsystem.component.SyncUi.ATTENTION
            },
        ) { syncSheet = true }
    }
    CompositionLocalProvider(LocalNavigator provides navigator, LocalToaster provides toaster, aiimin.designsystem.component.LocalSyncUi provides syncUi) {
        Box(Modifier.fillMaxSize().background(c.base)) {
            // One phone-width column on every device: tablets, unfolded foldables and landscape get it centred
            // (Android 16+ ignores the portrait lock on large screens), and side insets keep a 3-button nav bar
            // or a camera cutout from covering content.
            Column(
                Modifier.align(Alignment.TopCenter).fillMaxHeight().widthIn(max = CONTENT_MAX_WIDTH).fillMaxWidth()
                    .windowInsetsPadding(
                        androidx.compose.foundation.layout.WindowInsets.navigationBars.union(androidx.compose.foundation.layout.WindowInsets.displayCutout)
                            .only(androidx.compose.foundation.layout.WindowInsetsSides.Horizontal),
                    ),
            ) {
                androidx.compose.animation.SharedTransitionLayout(Modifier.weight(1f)) {
                CompositionLocalProvider(aiimin.designsystem.component.LocalSharedScope provides this) {
                NavDisplay(
                    backStack = stack,
                    onBack = { navigator.back() },
                    modifier = Modifier.fillMaxSize(),
                    sharedTransitionScope = this,
                    entryDecorators = listOf(rememberSaveableStateHolderNavEntryDecorator(), rememberViewModelStoreNavEntryDecorator(), sharedScreenDecorator),
                    // Part 26.5: push = standard, back = exit (faster), tabs cross-fade; a card that opens its screen
                    // grows into it (container transform) while the screens cross-fade; reduce motion = 200 ms fade.
                    transitionSpec = {
                        when {
                            reduce -> fadeIn(Motion.reducedFade()).togetherWith(fadeOut(Motion.reducedFade()))
                            aiimin.designsystem.component.SharedNav.opening(sharedKeyOfScene(targetState)) ->
                                fadeIn(Motion.standard()).togetherWith(fadeOut(Motion.quick()))
                            tabSwitch -> fadeIn(Motion.quick()).togetherWith(fadeOut(Motion.tap()))
                            else -> slideInHorizontally(Motion.standard()) { it }
                                .togetherWith(slideOutHorizontally(Motion.standard()) { -it / 3 } + fadeOut(Motion.standard(), targetAlpha = 0.6f))
                        }
                    },
                    popTransitionSpec = {
                        if (reduce) fadeIn(Motion.reducedFade()).togetherWith(fadeOut(Motion.reducedFade()))
                        else if (aiimin.designsystem.component.SharedNav.closing(sharedKeyOfScene(initialState))) fadeIn(Motion.quick()).togetherWith(fadeOut(Motion.exit()))
                        else (slideInHorizontally(Motion.standard()) { -it / 3 } + fadeIn(Motion.standard(), initialAlpha = 0.6f))
                            .togetherWith(slideOutHorizontally(Motion.exit()) { it })
                    },
                    predictivePopTransitionSpec = {
                        if (reduce) fadeIn(Motion.reducedFade()).togetherWith(fadeOut(Motion.reducedFade()))
                        else if (aiimin.designsystem.component.SharedNav.closing(sharedKeyOfScene(initialState))) fadeIn(Motion.quick()).togetherWith(fadeOut(Motion.exit()))
                        else (slideInHorizontally(Motion.standard()) { -it / 3 } + fadeIn(Motion.standard(), initialAlpha = 0.6f))
                            .togetherWith(slideOutHorizontally(Motion.exit()) { it })
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
                        entry<Route.PlanDay> { PlanDayScreen(it.tomorrow) }
                        entry<Route.Debrief> { DebriefScreen() }
                        entry<Route.Goals> { GoalsScreen() }
                        entry<Route.Goal> { GoalScreen(it.id) }
                        entry<Route.WeeklyReview> { WeeklyReviewScreen() }
                        entry<Route.Upcoming> { UpcomingScreen() }
                        entry<Route.Score> { ScoreScreen() }
                        entry<Route.Body> { BodyScreen() }
                        entry<Route.Patterns> { PatternsScreen() }
                        entry<Route.WhyScore> { WhyScoreScreen() }
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
                        entry<Route.SyncSettings> { aiimin.feature.me.SyncSettingsScreen() }
                        entry<Route.EditProfile> { aiimin.feature.me.EditProfileScreen() }
                        entry<Route.Plans> { aiimin.feature.me.PlansScreen() }
                        entry<Route.Subscription> { aiimin.feature.me.SubscriptionScreen() }
                        entry<Route.LinkedDevices> { aiimin.feature.me.LinkedDevicesScreen() }
                        entry<Route.MoneySettings> { aiimin.feature.me.MoneySettingsScreen() }
                        entry<Route.Appearance> { aiimin.feature.me.AppearanceScreen() }
                        entry<Route.Language> { aiimin.feature.me.LanguageScreen() }
                        entry<Route.Help> { aiimin.feature.me.HelpScreen() }
                        entry<Route.About> { aiimin.feature.me.AboutScreen() }
                        entry<Route.NotifySettings> { aiimin.feature.me.NotifySettingsScreen() }
                        entry<Route.RaahiSettings> { aiimin.feature.me.RaahiSettingsScreen() }
                        entry<Route.AboutRaahi> { aiimin.feature.me.AboutRaahiScreen() }
                        entry<Route.Running> { aiimin.feature.me.RunningScreen() }
                        entry<Route.Accounts> { aiimin.feature.money.AccountsScreen() }
                        entry<Route.MoodYear> { aiimin.feature.notes.MoodYearScreen() }
                        entry<Route.RecentCaptures> { aiimin.feature.assistant.RecentCapturesScreen() }
                        entry<Route.VaultBackup> { aiimin.feature.vault.VaultBackupScreen() }
                        entry<Route.EmergencyKits> { aiimin.feature.vault.EmergencyKitsScreen() }
                        entry<Route.Splits> { aiimin.feature.money.SplitsScreen() }
                        entry<Route.SplitPerson> { aiimin.feature.money.PersonBalanceScreen(it.who) }
                        entry<Route.Recurring> { aiimin.feature.money.RecurringScreen() }
                        entry<Route.PayeeMemory> { aiimin.feature.money.PayeeMemoryScreen() }
                        entry<Route.Conflicts> { aiimin.feature.me.ConflictsScreen() }
                        entry<Route.Trash> { aiimin.feature.me.TrashScreen() }
                        entry<Route.SignIn> { r ->
                            aiimin.feature.onboarding.AuthFlow(
                                vm.auth, if (r.createAccount) aiimin.feature.onboarding.AuthMode.SIGN_UP else aiimin.feature.onboarding.AuthMode.SIGN_IN,
                                onBack = { navigator.back() },
                                onSignedIn = { navigator.back(); vm.afterSignIn() },
                            )
                        }
                        entry<Route.Privacy> { aiimin.feature.me.PrivacyScreen() }
                        entry<Route.HealthPrivacy> { aiimin.feature.onboarding.HealthPrivacyScreen(onBack = { navigator.back() }) }
                        entry<Route.PhoneDay> { PhoneDayScreen() }
                        entry<Route.MoneyInbox> { MoneyInboxScreen() }
                        entry<Route.SmsImport> { aiimin.feature.money.SmsImportScreen() }
                        entry<Route.Txn> { TxnScreen(it.id) }
                        entry<Route.Budget> { BudgetScreen() }
                        entry<Route.Payments> { PaymentsScreen() }
                        entry<Route.Category> { CategoryScreen(it.name) }
                        entry<Route.Doc> { DocScreen(it.id) }
                        entry<Route.Person> { PersonScreen(it.id) }
                        entry<Route.Family> { FamilyScreen() }
                        entry<Route.EmergencyCard> { EmergencyCardScreen(it.personId) }
                        entry<Route.Notes> { NotesScreen() }
                        entry<Route.Note> { NoteScreen(it.id) }
                        entry<Route.Journal> { JournalScreen() }
                        entry<Route.JournalWrite> { JournalWriteScreen(it.id, prefill = it.prefill) }
                        entry<Route.Assistant> { AssistantScreen(it) }
                    },
                )
                }
                }
                AnimatedVisibility(
                    visible = top in ROOTS,
                    enter = if (reduce) fadeIn(Motion.reducedFade()) else slideInVertically(Motion.standard()) { it } + fadeIn(Motion.quick()),
                    exit = if (reduce) fadeOut(Motion.reducedFade()) else slideOutVertically(Motion.exit()) { it } + fadeOut(Motion.exit()),
                ) {
                    Dock(
                        items = listOf(
                            DockItem("Today", AppIcons.CalendarCheck, top == Route.Today, { navigator.tab(Tab.TODAY) }, iconFill = AppIcons.CalendarCheckFill),
                            DockItem("Money", AppIcons.Wallet, top == Route.Money, { navigator.tab(Tab.MONEY) }, iconFill = AppIcons.WalletFill, count = reviewCount),
                            DockItem("Vault", AppIcons.Archive, top == Route.Vault, { navigator.tab(Tab.VAULT) }, iconFill = AppIcons.ArchiveFill, badge = expiringSoon),
                            // Part 17.1: "Me" is renamed "You".
                            DockItem("You", AppIcons.UserCircle, top == Route.Me, { navigator.tab(Tab.ME) }, iconFill = AppIcons.UserCircleFill),
                        ),
                        onPlus = { navigator.capture() },
                        onPlusLong = { navigator.capture(voice = true) },
                        plusOpen = capture != null,
                    )
                }
            }
            focus?.let { f ->
                if (top !is Route.Focus) {
                    FocusPill(f, Modifier.align(Alignment.BottomCenter).padding(bottom = if (top in ROOTS) 96.dp else 24.dp)) { navigator.open(Route.Focus()) }
                }
            }
            ToastHost(toaster, Modifier.align(Alignment.BottomCenter).padding(bottom = if (top in ROOTS) 88.dp else 16.dp))
            // Content scrolls edge to edge; this strip keeps it from running under the clock and battery icons.
            androidx.compose.foundation.layout.Spacer(
                Modifier.align(Alignment.TopCenter).fillMaxWidth()
                    .windowInsetsTopHeight(androidx.compose.foundation.layout.WindowInsets.Companion.statusBars)
                    .background(c.base.copy(alpha = 0.96f)),
            )
        }
        capture?.let { (prefill, voice, type) -> CaptureSheet(prefill, voice, onDismiss = { capture = null }, initialType = type) }
        merge?.takeIf { it.webHasData }?.let { aiimin.feature.onboarding.MergeSheet(it, { vm.planReplace() }) { choice -> vm.mergeChoose(choice) } }
        if (syncSheet) SyncSheet(syncState, signedIn, syncing, lastSyncAt, onSync = { vm.syncNow() }, onOpenAccount = { syncSheet = false; navigator.open(Route.Account) }, onDismiss = { syncSheet = false })
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

@Composable
private fun SyncSheet(
    state: aiimin.core.data.sync.SyncState, signedIn: Boolean, syncing: Boolean, lastAt: Long?,
    onSync: () -> Unit, onOpenAccount: () -> Unit, onDismiss: () -> Unit,
) {
    val c = Aiimin.colors
    val title = when (state) {
        is aiimin.core.data.sync.SyncState.SignedOut -> "Only on this phone"
        is aiimin.core.data.sync.SyncState.Idle -> "Up to date"
        is aiimin.core.data.sync.SyncState.Syncing -> "Syncing…"
        is aiimin.core.data.sync.SyncState.Offline -> "Offline"
        is aiimin.core.data.sync.SyncState.Attention -> "Needs attention"
    }
    val body = when (state) {
        is aiimin.core.data.sync.SyncState.SignedOut -> "Sign in to back up tasks, notes and payments and see them on aiimin.in."
        is aiimin.core.data.sync.SyncState.Offline -> "Changes are saved on this phone and go when you're back online."
        is aiimin.core.data.sync.SyncState.Attention -> state.message
        else -> "Last synced " + (lastAt?.let { val m = (System.currentTimeMillis() - it) / 60_000; if (m < 1) "just now" else if (m < 60) "$m min ago" else "${m / 60} h ago" } ?: "not yet") + ". The phone works offline and catches up."
    }
    aiimin.designsystem.component.AppSheet(onDismiss, title = title) {
        Text(body, style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(bottom = 16.dp))
        if (signedIn) {
            aiimin.designsystem.component.AppButton(if (syncing) "Syncing…" else "Sync now", onSync, Modifier.fillMaxWidth(), enabled = !syncing, icon = AppIcons.ArrowsClockwise)
            Spacer(Modifier.height(8.dp))
            aiimin.designsystem.component.AppButton("What syncs and account", onOpenAccount, Modifier.fillMaxWidth(), kind = aiimin.designsystem.component.ButtonKind.SECONDARY)
        } else {
            aiimin.designsystem.component.AppButton("Sign in or create an account", onOpenAccount, Modifier.fillMaxWidth())
        }
    }
}

/** The widest a screen's content gets; wider windows centre it (same as Material's bottom sheets). */
private val CONTENT_MAX_WIDTH = 640.dp

private fun sharedKeyOfScene(scene: androidx.navigation3.scene.Scene<*>): String =
    aiimin.designsystem.component.sharedKeyOf(scene.entries.last().contentKey)
