package aiimin.app.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import aiimin.app.navigation.Capture
import aiimin.app.navigation.Config
import aiimin.app.navigation.Day
import aiimin.app.navigation.Lab
import aiimin.app.navigation.Money
import aiimin.app.navigation.Tab
import aiimin.app.ui.shell.BottomBar
import aiimin.app.ui.surface.ConfigSurface
import aiimin.app.ui.surface.LabSurface
import aiimin.app.ui.surface.MoneySurface
import aiimin.designsystem.theme.AiiminTheme
import aiimin.feature.capture.CaptureRoute
import aiimin.feature.today.TodayRoute
import androidx.navigation3.runtime.entryProvider
import androidx.navigation3.runtime.rememberNavBackStack
import androidx.navigation3.ui.NavDisplay

/**
 * The app shell: one back stack, five tabs, nothing else.
 *
 * Selecting a tab resets the stack to that surface's root — the bottom bar is a
 * switch between surfaces, not a history. Deeper flows (Score, Journal, OS-ID)
 * push onto the current surface and pop with back.
 */
@Composable
fun AiiminShell(modifier: Modifier = Modifier) {
    val backStack = rememberNavBackStack(Day)
    val currentTab = Tab.of(backStack.lastOrNull())

    AiiminShellContent(
        currentTab = currentTab,
        onSelectTab = { tab ->
            if (tab != currentTab) {
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
                    )
                }
                entry<Money> { MoneySurface() }
                entry<Capture> { CaptureRoute() }
                entry<Lab> { LabSurface() }
                entry<Config> { ConfigSurface() }
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
    Column(
        modifier
            .fillMaxSize()
            .background(AiiminTheme.colors.bg),
    ) {
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
