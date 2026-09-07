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
 * Placeholder scaffold for surfaces not yet built.
 *
 * Money, Config, Lab, Journal, Score, OS-ID, Onboarding have graduated.
 * A placeholder never pretends to hold data.
 */
@Composable
fun SurfaceScaffold(
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

@Preview(showBackground = true, backgroundColor = 0xFF15171A)
@Composable
private fun SurfaceScaffoldPreview() {
    AiiminTheme {
        SurfaceScaffold(
            title = "Reports",
            meta = "NEXT",
            oneJob = "Export a settled drawing of the week.",
            waitingFor = "Reports land after Lab is live against the lab API.",
        )
    }
}
