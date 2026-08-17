package aiimin.app

import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.android.tools.screenshot.PreviewTest
import aiimin.core.data.MoneyState
import aiimin.core.data.MoneyTab
import aiimin.designsystem.theme.AiiminTheme
import aiimin.feature.money.MoneyScreen

/**
 * Money's states, pinned as images. Overview dark/light, Budgets, Ledger, and
 * the honest empty month — the one that must never look like ₹0 MTD.
 */
private const val PHONE_W = 390
private const val TALL = 1200

@PreviewTest
@Preview(name = "Money · overview · dark", widthDp = PHONE_W, heightDp = TALL)
@Composable
fun MoneyOverviewDark() {
    AiiminTheme(darkTheme = true) {
        Money(MoneyState.seed().copy(tab = MoneyTab.OVERVIEW))
    }
}

@PreviewTest
@Preview(name = "Money · overview · light", widthDp = PHONE_W, heightDp = TALL)
@Composable
fun MoneyOverviewLight() {
    AiiminTheme(darkTheme = false) {
        Money(MoneyState.seed().copy(tab = MoneyTab.OVERVIEW))
    }
}

@PreviewTest
@Preview(name = "Money · budgets", widthDp = PHONE_W, heightDp = TALL)
@Composable
fun MoneyBudgets() {
    AiiminTheme(darkTheme = true) {
        Money(MoneyState.seed().copy(tab = MoneyTab.BUDGETS))
    }
}

@PreviewTest
@Preview(name = "Money · ledger", widthDp = PHONE_W, heightDp = TALL)
@Composable
fun MoneyLedger() {
    AiiminTheme(darkTheme = true) {
        Money(MoneyState.seed().copy(tab = MoneyTab.LEDGER))
    }
}

@PreviewTest
@Preview(name = "Money · empty", widthDp = PHONE_W, heightDp = TALL)
@Composable
fun MoneyEmpty() {
    AiiminTheme(darkTheme = true) {
        Money(MoneyState.empty())
    }
}

@PreviewTest
@Preview(name = "Money · offline", widthDp = PHONE_W, heightDp = TALL)
@Composable
fun MoneyOffline() {
    AiiminTheme(darkTheme = true) {
        Money(
            MoneyState.seed().copy(
                phase = aiimin.core.data.MoneyPhase.OFFLINE,
                syncLabel = "HELD LOCALLY",
            ),
        )
    }
}

@Composable
private fun Money(state: MoneyState) {
    MoneyScreen(
        state = state,
        onSelectTab = {},
        onAddTransaction = {},
    )
}
