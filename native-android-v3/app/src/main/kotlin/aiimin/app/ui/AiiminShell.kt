package aiimin.app.ui

import android.app.Application
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import aiimin.app.di.ConfigEntryPoint
import aiimin.app.di.PaymentInboxEntryPoint
import aiimin.app.navigation.Capture
import aiimin.app.navigation.Config
import aiimin.app.navigation.Day
import aiimin.app.navigation.English
import aiimin.app.navigation.Journal
import aiimin.app.navigation.Lab
import aiimin.app.navigation.Money
import aiimin.app.navigation.Notes
import aiimin.app.navigation.Documents
import aiimin.app.navigation.Family
import aiimin.app.navigation.Goals
import aiimin.app.navigation.Notifications
import aiimin.app.navigation.OsId
import aiimin.app.navigation.Score
import aiimin.app.navigation.Search
import aiimin.app.navigation.Tab
import aiimin.app.navigation.Timeline
import aiimin.app.ui.shell.BottomBar
import aiimin.designsystem.component.SheetGround
import aiimin.designsystem.theme.AiiminTheme
import aiimin.feature.capture.CaptureRoute
import aiimin.feature.config.ConfigRoute
import aiimin.feature.english.EnglishRoute
import aiimin.feature.journal.JournalRoute
import aiimin.feature.lab.LabRoute
import aiimin.feature.money.MoneyRoute
import aiimin.feature.notes.NotesRoute
import aiimin.feature.osid.OsIdRoute
import aiimin.feature.score.ScoreRoute
import aiimin.feature.today.TodayRoute
import androidx.navigation3.runtime.entryProvider
import androidx.navigation3.runtime.rememberNavBackStack
import androidx.navigation3.ui.NavDisplay
import dagger.hilt.android.EntryPointAccessors

/**
 * The app shell: one back stack, five tabs, nothing else.
 *
 * Selecting a tab resets the stack to that surface's root — the bottom bar is a
 * switch between surfaces, not a history. Deeper flows (Score, Journal, Notes,
 * OS-ID, English) push onto the current surface and pop with back.
 */
@Composable
fun AiiminShell(modifier: Modifier = Modifier) {
    val backStack = rememberNavBackStack(Day)
    val top = backStack.lastOrNull()
    val currentTab = when (top) {
        is OsId -> Tab.CONFIG
        is Journal -> Tab.CAPTURE
        is Notes -> Tab.DAY
        is English -> Tab.LAB
        is Notifications -> Tab.CONFIG
        is Search -> Tab.CONFIG
        is Timeline -> Tab.CONFIG
        is Family -> Tab.CONFIG
        is Documents -> Tab.CONFIG
        is Goals -> Tab.CONFIG
        is Score -> Tab.DAY
        else -> Tab.of(top)
    }
    val app = LocalContext.current.applicationContext as Application
    val paymentInbox = remember(app) {
        EntryPointAccessors.fromApplication(app, PaymentInboxEntryPoint::class.java).paymentInbox()
    }
    val configEntry = remember(app) {
        EntryPointAccessors.fromApplication(app, ConfigEntryPoint::class.java)
    }
    val configStore = configEntry.configStore()
    val knockStore = configEntry.knockStore()
    fun openPlans(focus: aiimin.core.model.SubscriptionTier? = null) {
        configStore.requestOpenPlan(focus)
        backStack.clear()
        backStack.add(Config)
    }
    LaunchedEffect(paymentInbox) {
        if (paymentInbox.consumeStickyOpenMoney()) {
            backStack.clear()
            backStack.add(Money)
        }
        paymentInbox.openMoneyRequests.collect {
            backStack.clear()
            backStack.add(Money)
        }
    }
    LaunchedEffect(knockStore) {
        fun openKnock(link: String) {
            backStack.clear()
            when (link) {
                "money" -> backStack.add(Money)
                "capture" -> backStack.add(Capture)
                "english" -> {
                    backStack.add(Lab)
                    backStack.add(English)
                }
                "config" -> backStack.add(Config)
                "notes" -> backStack.add(Notes)
                "score" -> {
                    backStack.add(Day)
                    backStack.add(Score)
                }
                else -> backStack.add(Day)
            }
        }
        knockStore.consumePendingDeepLink()?.let { openKnock(it) }
    }

    AiiminShellContent(
        currentTab = currentTab,
        onSelectTab = { tab ->
            if (tab != currentTab || top is OsId || top is Score || top is Journal || top is English || top is Notes || top is Notifications || top is Search || top is Timeline || top is Family || top is Documents || top is Goals) {
                backStack.clear()
                backStack.add(tab.destination)
            }
        },
        modifier = modifier,
    ) {
        NavDisplay(
            backStack = backStack,
            onBack = { backStack.removeLastOrNull() },
            entryProvider = entryProvider {
                entry<Day> {
                    TodayRoute(
                        onOpenCapture = {
                            backStack.clear()
                            backStack.add(Capture)
                        },
                        onOpenScore = { backStack.add(Score) },
                        onOpenNotes = { backStack.add(Notes) },
                    )
                }
                entry<Score> { ScoreRoute() }
                entry<Money> {
                    MoneyRoute(
                        onAddTransaction = {
                            backStack.clear()
                            backStack.add(Capture)
                        },
                        onUpgradePlan = {
                            openPlans(aiimin.core.model.TierFeature.MONEY.min)
                        },
                        onNotNow = {
                            backStack.clear()
                            backStack.add(Day)
                        },
                    )
                }
                entry<Capture> {
                    CaptureRoute(
                        onOpenJournal = { backStack.add(Journal) },
                    )
                }
                entry<Lab> {
                    LabRoute(
                        onUpgradePlan = {
                            openPlans(aiimin.core.model.TierFeature.LAB_FULL.min)
                        },
                        onNotNow = {
                            backStack.clear()
                            backStack.add(Day)
                        },
                        onOpenEnglish = { backStack.add(English) },
                    )
                }
                entry<Config> {
                    ConfigRoute(
                        onOpenOsId = { backStack.add(OsId) },
                        onOpenJournal = { backStack.add(Journal) },
                        onOpenEnglish = { backStack.add(English) },
                        onOpenNotes = { backStack.add(Notes) },
                        onOpenNotifications = { backStack.add(Notifications) },
                        onOpenSearch = { backStack.add(Search) },
                        onOpenTimeline = { backStack.add(Timeline) },
                        onOpenFamily = { backStack.add(Family) },
                        onOpenDocuments = { backStack.add(Documents) },
                        onOpenGoals = { backStack.add(Goals) },
                        onGoHome = {
                            backStack.clear()
                            backStack.add(Day)
                        },
                    )
                }
                entry<OsId> { OsIdRoute() }
                entry<Journal> {
                    JournalRoute(onBack = { backStack.removeLastOrNull() })
                }
                entry<Notes> {
                    NotesRoute(onBack = { backStack.removeLastOrNull() })
                }
                entry<English> {
                    EnglishRoute(
                        onBack = { backStack.removeLastOrNull() },
                        onUpgradePlan = {
                            openPlans(aiimin.core.model.TierFeature.LAB_FULL.min)
                        },
                        onNotNow = { backStack.removeLastOrNull() },
                    )
                }
                entry<Search> {
                    aiimin.feature.today.SearchRoute(onBack = { backStack.removeLastOrNull() })
                }
                entry<Timeline> {
                    aiimin.feature.today.TimelineRoute(onBack = { backStack.removeLastOrNull() })
                }
                entry<Family> {
                    aiimin.feature.config.FamilyRoute(onBack = { backStack.removeLastOrNull() })
                }
                entry<Documents> {
                    aiimin.feature.config.DocumentsRoute(onBack = { backStack.removeLastOrNull() })
                }
                entry<Goals> {
                    aiimin.feature.config.GoalsRoute(onBack = { backStack.removeLastOrNull() })
                }
                entry<Notifications> {
                    aiimin.feature.config.NotificationsRoute(
                        onBack = { backStack.removeLastOrNull() },
                        onSystemSettings = {
                            val ctx = app
                            val intent = android.content.Intent(
                                android.provider.Settings.ACTION_APP_NOTIFICATION_SETTINGS,
                            ).apply {
                                putExtra(android.provider.Settings.EXTRA_APP_PACKAGE, ctx.packageName)
                                addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK)
                            }
                            ctx.startActivity(intent)
                        },
                    )
                }
            },
        )
    }
}

/**
 * The shell's layout, with no navigation in it: surface above, tab bar below.
 *
 * Kept separate from [AiiminShell] so it renders in a preview and in a
 * screenshot test — `NavDisplay` needs a navigation-event dispatcher that only
 * a real Activity provides.
 */
@Composable
fun AiiminShellContent(
    currentTab: Tab?,
    onSelectTab: (Tab) -> Unit,
    modifier: Modifier = Modifier,
    surface: @Composable () -> Unit,
) {
    SheetGround(modifier.fillMaxSize()) {
        Column(Modifier.fillMaxSize()) {
            Box(
                Modifier
                    .weight(1f)
                    .statusBarsPadding(),
            ) {
                surface()
            }
            BottomBar(current = currentTab, onSelect = onSelectTab)
        }
    }
}
