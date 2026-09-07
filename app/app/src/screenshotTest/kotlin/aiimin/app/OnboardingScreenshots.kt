package aiimin.app

import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.android.tools.screenshot.PreviewTest
import aiimin.core.data.OnboardingState
import aiimin.core.network.OsIdAvailability
import aiimin.core.network.OsIdCheckResult
import aiimin.designsystem.theme.AiiminTheme
import aiimin.feature.onboarding.OnboardingScreen

private const val PHONE_W = 390
private const val TALL = 844

@PreviewTest
@Preview(name = "Onboarding · welcome", widthDp = PHONE_W, heightDp = TALL)
@Composable
fun OnboardingWelcome() {
    AiiminTheme(darkTheme = true) {
        Board(OnboardingState.fresh())
    }
}

@PreviewTest
@Preview(name = "Onboarding · claim", widthDp = PHONE_W, heightDp = TALL)
@Composable
fun OnboardingClaim() {
    AiiminTheme(darkTheme = true) {
        Board(
            OnboardingState.fresh().copy(step = 3),
            osIdLive = OsIdCheckResult(OsIdAvailability.AVAILABLE, "Available."),
        )
    }
}

@PreviewTest
@Preview(name = "Onboarding · first capture", widthDp = PHONE_W, heightDp = TALL)
@Composable
fun OnboardingFirstCapture() {
    AiiminTheme(darkTheme = true) {
        Board(
            OnboardingState.fresh().copy(
                step = 6,
                firstCapture = "paid 240 metro, walked 25 min, felt sharp 8/10",
            ),
        )
    }
}

@PreviewTest
@Preview(name = "Onboarding · welcome light", widthDp = PHONE_W, heightDp = TALL)
@Composable
fun OnboardingWelcomeLight() {
    AiiminTheme(darkTheme = false) {
        Board(OnboardingState.fresh())
    }
}

@Composable
private fun Board(
    state: OnboardingState,
    osIdLive: OsIdCheckResult = OsIdCheckResult(OsIdAvailability.IDLE, ""),
) {
    OnboardingScreen(
        state = state,
        osIdLive = osIdLive,
        onNext = {},
        onContinueSignIn = {},
        onSelectOsId = {},
        onArcChange = {},
        onToggleMinimum = {},
        onFirstCaptureChange = {},
        onSettle = {},
        onSkip = {},
    )
}
