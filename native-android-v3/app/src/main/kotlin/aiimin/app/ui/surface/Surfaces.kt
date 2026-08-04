package aiimin.app.ui.surface

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import aiimin.designsystem.component.EmptyState
import aiimin.designsystem.component.ScreenHead
import aiimin.designsystem.component.SectionRule
import aiimin.designsystem.component.Text
import aiimin.designsystem.theme.AiiminTheme

/**
 * Placeholders for the five surfaces of the shell.
 *
 * Each states its ONE job (P8-R-124) and nothing else. They are replaced, one at
 * a time, by the real surface — Capture first, then Today, Money, Config. A
 * placeholder never pretends to hold data it does not have.
 */
@Composable
private fun SurfaceScaffold(
    title: String,
    meta: String,
    oneJob: String,
    waitingFor: String,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier
            .fillMaxSize()
            .background(AiiminTheme.colors.bg)
            .verticalScroll(rememberScrollState())
            .padding(horizontal = AiiminTheme.space.page),
    ) {
        ScreenHead(title = title, meta = meta)
        SectionRule(label = "One job")
        Text(
            text = oneJob,
            style = AiiminTheme.type.body,
            modifier = Modifier.padding(top = AiiminTheme.space.s2),
        )
        EmptyState(label = "Not built yet", message = waitingFor)
    }
}

@Composable
fun MoneySurface(modifier: Modifier = Modifier) = SurfaceScaffold(
    title = "Money",
    meta = "OVERVIEW",
    oneJob = "Log and see money truth — safe to spend, where it went, what is owed.",
    waitingFor = "Overview, Budgets and Ledger land after the capture loop writes real entries.",
    modifier = modifier,
)

@Composable
fun LabSurface(modifier: Modifier = Modifier) = SurfaceScaffold(
    title = "Lab",
    meta = "PATTERNS",
    oneJob = "Ask, review and act on the patterns in your own record.",
    waitingFor = "Correlations need months of logged days before they mean anything.",
    modifier = modifier,
)

@Composable
fun ConfigSurface(modifier: Modifier = Modifier) = SurfaceScaffold(
    title = "Config",
    meta = "OS",
    oneJob = "Configure the OS — identity, arc, life mode, sync, preferences, data.",
    waitingFor = "Config follows Money: OS-ID, XP, Life Arc, life modes, sync state.",
    modifier = modifier,
)

@Preview(showBackground = true, backgroundColor = 0xFF15171A)
@Composable
private fun MoneySurfacePreview() {
    AiiminTheme { MoneySurface() }
}
