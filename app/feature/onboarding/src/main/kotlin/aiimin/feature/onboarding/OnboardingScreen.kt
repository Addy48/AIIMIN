package aiimin.feature.onboarding

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import aiimin.core.data.OnboardingMinimum
import aiimin.core.data.OnboardingState
import aiimin.core.model.OsIdRules
import aiimin.core.network.OsIdAvailability
import aiimin.core.network.OsIdCheckResult
import aiimin.designsystem.brand.BrandMark
import aiimin.designsystem.component.BlueprintBox
import aiimin.designsystem.component.SheetGround
import aiimin.designsystem.component.GhostButton
import aiimin.designsystem.component.HairRule
import aiimin.designsystem.component.PrimaryButton
import aiimin.designsystem.component.TapSurface
import aiimin.designsystem.component.Text
import aiimin.designsystem.theme.AiiminTheme
import aiimin.designsystem.theme.Hairline
import kotlinx.coroutines.launch

@Composable
fun OnboardingRoute(
    onEntered: () -> Unit,
    onRequestBiometric: suspend () -> Boolean = { false },
    modifier: Modifier = Modifier,
    viewModel: OnboardingViewModel = hiltViewModel(),
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val osIdLive by viewModel.osIdLive.collectAsStateWithLifecycle()
    val identifier by viewModel.identifier.collectAsStateWithLifecycle()
    val pin by viewModel.pin.collectAsStateWithLifecycle()
    val authNotice by viewModel.authNotice.collectAsStateWithLifecycle()
    val authBusy by viewModel.authBusy.collectAsStateWithLifecycle()
    val offerBiometric by viewModel.offerBiometric.collectAsStateWithLifecycle()
    val unlock by viewModel.signInUnlock.collectAsStateWithLifecycle()
    val scope = rememberCoroutineScope()
    OnboardingScreen(
        state = state,
        osIdLive = osIdLive,
        identifier = identifier,
        pin = pin,
        authNotice = authNotice,
        authBusy = authBusy,
        offerBiometric = offerBiometric,
        unlockPlate = unlock.plate,
        canDirectUnlock = unlock.canDirect,
        onNext = viewModel::onNext,
        onAgeConfirmed = viewModel::onAgeConfirmed,
        onIdentifierChange = viewModel::onIdentifierChange,
        onPinChange = viewModel::onPinChange,
        onSignIn = { viewModel.onSignIn(onEntered) },
        onUnlockBiometric = {
            scope.launch {
                if (onRequestBiometric()) viewModel.onBiometricUnlocked(onEntered)
                else viewModel.onAuthNotice("Use PIN for this OS-ID")
            }
        },
        onEnableBiometricNextTime = viewModel::onEnableBiometricNextTime,
        onSkipBiometricOffer = viewModel::onSkipBiometricOffer,
        onContinueSignIn = viewModel::onContinueSignIn,
        onSelectOsId = viewModel::onSelectOsId,
        onArcChange = viewModel::onArcChange,
        onToggleMinimum = viewModel::onToggleMinimum,
        onFirstCaptureChange = viewModel::onFirstCaptureChange,
        onSettle = {
            if (viewModel.onSettleAndEnter()) onEntered()
        },
        onSkip = {
            if (viewModel.onSkip()) onEntered()
        },
        onClaim = {
            if (viewModel.canClaimOsId()) viewModel.onNext()
        },
        modifier = modifier,
    )
}

/**
 * **One job: get a person from install to their first settled log.**
 *
 * Six Drafting Table steps — Welcome · Sign in · Claim · Arc · Minimums ·
 * First capture. Sign-in and OS-ID availability hit the live API.
 */
@Composable
fun OnboardingScreen(
    state: OnboardingState,
    onNext: () -> Unit,
    onContinueSignIn: () -> Unit,
    onSelectOsId: (String) -> Unit,
    onArcChange: (String) -> Unit,
    onToggleMinimum: (Int) -> Unit,
    onFirstCaptureChange: (String) -> Unit,
    onSettle: () -> Unit,
    onSkip: () -> Unit,
    onAgeConfirmed: (Boolean) -> Unit = {},
    modifier: Modifier = Modifier,
    osIdLive: OsIdCheckResult = OsIdCheckResult(OsIdAvailability.IDLE, ""),
    onClaim: () -> Unit = onNext,
    identifier: String = "",
    pin: String = "",
    authNotice: String? = null,
    authBusy: Boolean = false,
    offerBiometric: Boolean = false,
    unlockPlate: String? = null,
    canDirectUnlock: Boolean = false,
    onIdentifierChange: (String) -> Unit = {},
    onPinChange: (String) -> Unit = {},
    onSignIn: () -> Unit = onContinueSignIn,
    onUnlockBiometric: () -> Unit = {},
    onEnableBiometricNextTime: () -> Unit = {},
    onSkipBiometricOffer: () -> Unit = {},
) {
    when (state.step) {
        1 -> WelcomeStep(state, onNext, onSkip, onAgeConfirmed, modifier)
        2 -> SignInStep(
            state = state,
            identifier = identifier,
            pin = pin,
            authNotice = authNotice,
            authBusy = authBusy,
            offerBiometric = offerBiometric,
            unlockPlate = unlockPlate,
            canDirectUnlock = canDirectUnlock,
            onIdentifierChange = onIdentifierChange,
            onPinChange = onPinChange,
            onSignIn = onSignIn,
            onUnlockBiometric = onUnlockBiometric,
            onEnableBiometricNextTime = onEnableBiometricNextTime,
            onSkipBiometricOffer = onSkipBiometricOffer,
            onSkipAuth = onContinueSignIn,
            modifier = modifier,
        )
        3 -> ClaimStep(state, osIdLive, onSelectOsId, onClaim, modifier)
        4 -> ArcStep(state, onArcChange, onNext, modifier)
        5 -> MinimumsStep(state, onToggleMinimum, onNext, modifier)
        else -> FirstCaptureStep(state, onFirstCaptureChange, onSettle, modifier)
    }
}

@Composable
private fun Frame(
    state: OnboardingState,
    kicker: String,
    title: String,
    modifier: Modifier = Modifier,
    footer: @Composable ColumnScope.() -> Unit,
    content: @Composable ColumnScope.() -> Unit,
) {
    SheetGround(modifier.fillMaxSize()) {
    Column(
        Modifier
            .fillMaxSize()
            .statusBarsPadding()
            .navigationBarsPadding()
            .padding(horizontal = AiiminTheme.space.page)
            .padding(top = AiiminTheme.space.s2, bottom = AiiminTheme.space.s8),
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
        ) {
            BrandMark(size = 36.dp)
            Column {
                Text(
                    text = "AIIMIN",
                    style = AiiminTheme.type.wordmark,
                    color = AiiminTheme.colors.text,
                )
                Text(
                    text = "One screen. Every day.",
                    style = AiiminTheme.type.splashLaw,
                    color = AiiminTheme.colors.muted,
                    modifier = Modifier.padding(top = 2.dp),
                )
            }
        }

        Row(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s6),
            horizontalArrangement = Arrangement.spacedBy(3.dp),
        ) {
            repeat(OnboardingState.STEPS) { i ->
                Box(
                    Modifier
                        .weight(1f)
                        .height(3.dp)
                        .background(
                            if (i < state.step) AiiminTheme.colors.accent
                            else AiiminTheme.colors.hair,
                        ),
                )
            }
        }

        Text(
            text = "STEP ${state.step.toString().padStart(2, '0')} / 0${OnboardingState.STEPS} · $kicker",
            style = AiiminTheme.type.mono(10.0),
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = AiiminTheme.space.s3),
        )
        Text(
            text = title.uppercase(),
            style = AiiminTheme.type.chrome.copy(
                fontSize = 32.sp,
                lineHeight = 34.sp,
                fontWeight = FontWeight.SemiBold,
                letterSpacing = 0.5.sp,
            ),
            modifier = Modifier.padding(top = AiiminTheme.space.s3),
        )

        Column(
            Modifier
                .weight(1f)
                .fillMaxWidth()
                .verticalScroll(rememberScrollState())
                .padding(top = AiiminTheme.space.s4),
            content = content,
        )
        Column(Modifier.padding(top = AiiminTheme.space.s4), content = footer)
    }
    }
}

@Composable
private fun WelcomeStep(
    state: OnboardingState,
    onNext: () -> Unit,
    onSkip: () -> Unit,
    onAgeConfirmed: (Boolean) -> Unit,
    modifier: Modifier,
) {
    Frame(
        state = state,
        kicker = "WELCOME",
        title = "One screen.\nEvery day.",
        modifier = modifier,
        footer = {
            TapSurface(
                onClick = { onAgeConfirmed(!state.ageConfirmed) },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = AiiminTheme.space.s3)
                    .border(Hairline, if (state.ageConfirmed) AiiminTheme.colors.accent else AiiminTheme.colors.hair)
                    .padding(AiiminTheme.space.s3),
            ) {
                Text(
                    text = if (state.ageConfirmed) "18 OR OLDER · CONFIRMED" else "I AM 18 OR OLDER",
                    style = AiiminTheme.type.chrome.copy(fontSize = 12.sp),
                    color = if (state.ageConfirmed) AiiminTheme.colors.accent else AiiminTheme.colors.muted,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth(),
                )
            }
            PrimaryButton(
                label = "Begin",
                onClick = onNext,
                enabled = state.ageConfirmed,
                modifier = Modifier.fillMaxWidth(),
            )
            TapSurface(onClick = onSkip, minTouchTarget = false, modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "SKIP · LOCAL DEMO",
                    style = AiiminTheme.type.mono(9.5),
                    color = AiiminTheme.colors.muted,
                    textAlign = TextAlign.Center,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = AiiminTheme.space.s3),
                )
            }
        },
    ) {
        Text(
            text = "Your habits, money, focus and mood — one calm operating system. " +
                "Capture through the week on the phone; the site opens the full drawing on Sunday.",
            style = AiiminTheme.type.body.copy(fontSize = 14.sp, lineHeight = 22.sp),
            color = AiiminTheme.colors.muted,
        )
        Column(
            Modifier
                .fillMaxWidth()
                .padding(vertical = AiiminTheme.space.s8),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            BrandMark(size = 120.dp)
            Text(
                text = "AIIMIN",
                style = AiiminTheme.type.wordmarkSplash.copy(fontSize = 28.sp, lineHeight = 28.sp),
                color = AiiminTheme.colors.text,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(top = AiiminTheme.space.s4),
            )
            Box(
                Modifier
                    .padding(top = AiiminTheme.space.s3)
                    .width(32.dp)
                    .height(1.dp)
                    .background(AiiminTheme.colors.accent.copy(alpha = 0.45f)),
            )
            Text(
                text = "One screen. Every day.",
                style = AiiminTheme.type.splashLaw,
                color = AiiminTheme.colors.muted,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(top = AiiminTheme.space.s3),
            )
        }
    }
}

@Composable
private fun SignInStep(
    state: OnboardingState,
    identifier: String,
    pin: String,
    authNotice: String?,
    authBusy: Boolean,
    offerBiometric: Boolean,
    unlockPlate: String?,
    canDirectUnlock: Boolean,
    onIdentifierChange: (String) -> Unit,
    onPinChange: (String) -> Unit,
    onSignIn: () -> Unit,
    onUnlockBiometric: () -> Unit,
    onEnableBiometricNextTime: () -> Unit,
    onSkipBiometricOffer: () -> Unit,
    onSkipAuth: () -> Unit,
    modifier: Modifier,
) {
    Frame(
        state = state,
        kicker = "SIGN IN",
        title = "Your identity",
        modifier = modifier,
        footer = {
            if (offerBiometric) {
                PrimaryButton(
                    label = "Unlock ${unlockPlate ?: "this OS-ID"} next time",
                    onClick = onEnableBiometricNextTime,
                    modifier = Modifier.fillMaxWidth(),
                )
                GhostButton(
                    label = "Not now · continue",
                    onClick = onSkipBiometricOffer,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = AiiminTheme.space.s2),
                )
            } else {
                if (canDirectUnlock && !unlockPlate.isNullOrBlank()) {
                    PrimaryButton(
                        label = "Unlock $unlockPlate",
                        onClick = onUnlockBiometric,
                        enabled = !authBusy,
                        modifier = Modifier.fillMaxWidth(),
                    )
                }
                PrimaryButton(
                    label = if (authBusy) "Signing in…" else "Sign in with PIN",
                    onClick = onSignIn,
                    enabled = !authBusy && pin.length == 6 && identifier.isNotBlank(),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = if (canDirectUnlock) AiiminTheme.space.s2 else 0.dp),
                )
                GhostButton(
                    label = "Continue offline (demo)",
                    onClick = onSkipAuth,
                    color = AiiminTheme.colors.muted,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = AiiminTheme.space.s2),
                )
            }
            Text(
                text = "OS-ID + PIN · SAME PLATE AS THE WEBSITE",
                style = AiiminTheme.type.mono(9.5),
                color = AiiminTheme.colors.muted,
                textAlign = TextAlign.Center,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = AiiminTheme.space.s2),
            )
        },
    ) {
        Text(
            text = if (offerBiometric) {
                "PIN accepted. Unlock ${unlockPlate ?: "this OS-ID"} with the sensor next cold open — or skip and keep PIN."
            } else {
                "Google signup lives on aiimin.in — Gmail is already bound to your OS-ID there. " +
                    "This phone uses the 8-character OS-ID and the same 6-digit PIN. " +
                    "Biometrics unlock that plate when a session is stored."
            },
            style = AiiminTheme.type.body.copy(fontSize = 13.5.sp, lineHeight = 20.sp),
            color = AiiminTheme.colors.muted,
        )
        if (!offerBiometric) {
            if (!unlockPlate.isNullOrBlank()) {
                Text(
                    text = "RETURNING · $unlockPlate",
                    style = AiiminTheme.type.mono(10.0),
                    color = AiiminTheme.colors.accent,
                    modifier = Modifier.padding(top = AiiminTheme.space.s6),
                )
            }
            BasicTextField(
                value = identifier,
                onValueChange = onIdentifierChange,
                singleLine = true,
                textStyle = AiiminTheme.type.mono(13.0).copy(color = AiiminTheme.colors.text),
                cursorBrush = SolidColor(AiiminTheme.colors.accent),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = if (unlockPlate.isNullOrBlank()) AiiminTheme.space.s6 else AiiminTheme.space.s2)
                    .border(Hairline, AiiminTheme.colors.rule)
                    .padding(horizontal = AiiminTheme.space.s4, vertical = AiiminTheme.space.s3),
                decorationBox = { inner ->
                    if (identifier.isEmpty()) {
                        Text(
                            text = "8-char OS-ID",
                            style = AiiminTheme.type.mono(13.0),
                            color = AiiminTheme.colors.muted,
                        )
                    }
                    inner()
                },
            )
            BasicTextField(
                value = pin,
                onValueChange = onPinChange,
                singleLine = true,
                textStyle = AiiminTheme.type.mono(13.0).copy(color = AiiminTheme.colors.text),
                cursorBrush = SolidColor(AiiminTheme.colors.accent),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(Hairline, AiiminTheme.colors.rule)
                    .padding(horizontal = AiiminTheme.space.s4, vertical = AiiminTheme.space.s3),
                decorationBox = { inner ->
                    if (pin.isEmpty()) {
                        Text(
                            text = "PIN · 6 digits",
                            style = AiiminTheme.type.mono(13.0),
                            color = AiiminTheme.colors.muted,
                        )
                    }
                    inner()
                },
            )
        }
        authNotice?.let {
            Text(
                text = it,
                style = AiiminTheme.type.bodySmall,
                color = AiiminTheme.colors.accent,
                modifier = Modifier.padding(top = AiiminTheme.space.s3),
            )
        }
    }
}

@Composable
private fun ClaimStep(
    state: OnboardingState,
    osIdLive: OsIdCheckResult,
    onSelectOsId: (String) -> Unit,
    onClaim: () -> Unit,
    modifier: Modifier,
) {
    val id = state.chosenId.padEnd(OsIdRules.LENGTH).take(OsIdRules.LENGTH)
    val claimEnabled = when (osIdLive.status) {
        OsIdAvailability.AVAILABLE -> state.chosenValid
        OsIdAvailability.OFFLINE -> state.chosenValid
        else -> false
    }
    val statusLabel = when (osIdLive.status) {
        OsIdAvailability.CHECKING -> "… CHECKING"
        OsIdAvailability.AVAILABLE -> "✓ AVAILABLE · LIVE"
        OsIdAvailability.TAKEN -> "✗ TAKEN"
        OsIdAvailability.INVALID -> "✗ INVALID"
        OsIdAvailability.OFFLINE -> if (state.chosenValid) "◌ OFFLINE · UNVERIFIED" else "✗ INVALID"
        OsIdAvailability.IDLE -> if (state.chosenValid) "… CHECKING" else "✗ INVALID"
    }
    val statusColor = when (osIdLive.status) {
        OsIdAvailability.AVAILABLE -> AiiminTheme.colors.accent
        OsIdAvailability.TAKEN, OsIdAvailability.INVALID -> AiiminTheme.colors.danger
        else -> AiiminTheme.colors.muted
    }
    Frame(
        state = state,
        kicker = "CLAIM",
        title = "Claim your OS-ID",
        modifier = modifier,
        footer = {
            PrimaryButton(
                label = when (osIdLive.status) {
                    OsIdAvailability.OFFLINE -> "Continue ${state.chosenId} · offline"
                    else -> "Claim ${state.chosenId}"
                },
                onClick = onClaim,
                enabled = claimEnabled,
                modifier = Modifier.fillMaxWidth(),
            )
            Text(
                text = "ONE REVISION PERMITTED, LATER",
                style = AiiminTheme.type.mono(9.5),
                color = AiiminTheme.colors.muted,
                textAlign = TextAlign.Center,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = AiiminTheme.space.s2),
            )
        },
    ) {
        Text(
            text = "Eight characters, yours permanently — on the app, on aiimin.in, " +
                "on anything AIIMIN builds next. Availability is checked live.",
            style = AiiminTheme.type.body.copy(fontSize = 13.5.sp, lineHeight = 20.sp),
            color = AiiminTheme.colors.muted,
        )
        Row(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s6)
                .height(IntrinsicSize.Min)
                .border(Hairline, AiiminTheme.colors.rule),
        ) {
            id.forEachIndexed { i, ch ->
                if (i > 0) {
                    Box(
                        Modifier
                            .width(Hairline)
                            .fillMaxHeight()
                            .background(AiiminTheme.colors.rule),
                    )
                }
                Box(
                    Modifier
                        .weight(1f)
                        .aspectRatio(1f / 1.2f),
                    contentAlignment = Alignment.Center,
                ) {
                    Text(
                        text = if (ch.isWhitespace()) "" else ch.toString(),
                        style = AiiminTheme.type.mono(20.0, FontWeight.Bold),
                    )
                }
            }
        }
        Row(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s2),
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            Text(
                text = statusLabel,
                style = AiiminTheme.type.mono(10.0),
                color = statusColor,
            )
            Text(
                text = "${state.chosenId.length}/8 CHARS · ${state.digitCount}/4 DIGITS",
                style = AiiminTheme.type.mono(10.0),
                color = AiiminTheme.colors.muted,
            )
        }
        if (osIdLive.message.isNotBlank() &&
            osIdLive.status != OsIdAvailability.CHECKING &&
            osIdLive.status != OsIdAvailability.IDLE
        ) {
            Text(
                text = osIdLive.message,
                style = AiiminTheme.type.body.copy(fontSize = 11.sp),
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = AiiminTheme.space.s2),
            )
        }
        Row(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s4),
            horizontalArrangement = Arrangement.spacedBy(5.dp),
        ) {
            state.alts.forEach { alt ->
                val on = alt == state.chosenId
                TapSurface(
                    onClick = { onSelectOsId(alt) },
                    minTouchTarget = false,
                    modifier = Modifier
                        .border(
                            Hairline,
                            if (on) AiiminTheme.colors.accent else AiiminTheme.colors.hair,
                        )
                        .padding(horizontal = 10.dp, vertical = 7.dp),
                ) {
                    Text(
                        text = alt,
                        style = AiiminTheme.type.mono(12.0, FontWeight.Medium),
                        color = if (on) AiiminTheme.colors.accent else AiiminTheme.colors.text,
                    )
                }
            }
        }
    }
}

@Composable
private fun ArcStep(
    state: OnboardingState,
    onArcChange: (String) -> Unit,
    onNext: () -> Unit,
    modifier: Modifier,
) {
    Frame(
        state = state,
        kicker = "DIRECTION",
        title = "Set your arc",
        modifier = modifier,
        footer = {
            PrimaryButton(label = "Set direction", onClick = onNext, modifier = Modifier.fillMaxWidth())
        },
    ) {
        Text(
            text = "One line for where your story is headed. The OS aligns your day and week to it.",
            style = AiiminTheme.type.body.copy(fontSize = 13.5.sp, lineHeight = 20.sp),
            color = AiiminTheme.colors.muted,
        )
        BlueprintBox(
            accent = true,
            tinted = true,
            modifier = Modifier.padding(top = AiiminTheme.space.s6),
        ) {
            BasicTextField(
                value = state.arc,
                onValueChange = onArcChange,
                textStyle = AiiminTheme.type.body.copy(
                    fontSize = 15.sp,
                    color = AiiminTheme.colors.text,
                ),
                cursorBrush = SolidColor(AiiminTheme.colors.accent),
                modifier = Modifier.fillMaxWidth(),
                decorationBox = { inner ->
                    if (state.arc.isEmpty()) {
                        Text(
                            text = "Crack placements · be healthier than last year · ship the side project",
                            style = AiiminTheme.type.body.copy(fontSize = 15.sp),
                            color = AiiminTheme.colors.muted,
                        )
                    }
                    inner()
                },
            )
        }
        Text(
            text = "LATER: DAILY ARC · WEEKLY ARC · LIFE ARC",
            style = AiiminTheme.type.mono(9.5),
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = AiiminTheme.space.s3),
        )
    }
}

@Composable
private fun MinimumsStep(
    state: OnboardingState,
    onToggle: (Int) -> Unit,
    onNext: () -> Unit,
    modifier: Modifier,
) {
    Frame(
        state = state,
        kicker = "COMMIT",
        title = "Your daily minimums",
        modifier = modifier,
        footer = {
            PrimaryButton(
                label = "Lock ${state.pickedCount} minimums",
                onClick = onNext,
                enabled = state.pickedCount >= 3,
                modifier = Modifier.fillMaxWidth(),
            )
        },
    ) {
        Text(
            text = "The non-negotiables. Tick a few — the day clears when these are done.",
            style = AiiminTheme.type.body.copy(fontSize = 13.5.sp, lineHeight = 20.sp),
            color = AiiminTheme.colors.muted,
        )
        Column(Modifier.padding(top = AiiminTheme.space.s4)) {
            state.minimums.forEachIndexed { i, min ->
                MinimumRow(min, onClick = { onToggle(i) })
                if (i < state.minimums.lastIndex) HairRule()
            }
        }
    }
}

@Composable
private fun MinimumRow(min: OnboardingMinimum, onClick: () -> Unit) {
    TapSurface(
        onClick = onClick,
        minTouchTarget = false,
        modifier = Modifier.fillMaxWidth(),
    ) {
        Row(
            Modifier
                .fillMaxWidth()
                .padding(vertical = 11.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
        ) {
            Box(
                Modifier
                    .size(18.dp)
                    .border(
                        Hairline,
                        if (min.picked) AiiminTheme.colors.accent else AiiminTheme.colors.rule,
                    )
                    .background(if (min.picked) AiiminTheme.colors.accent else AiiminTheme.colors.bg),
            )
            Text(
                text = min.label,
                style = AiiminTheme.type.body.copy(fontSize = 13.5.sp),
                color = if (min.picked) AiiminTheme.colors.text else AiiminTheme.colors.muted,
            )
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun FirstCaptureStep(
    state: OnboardingState,
    onChange: (String) -> Unit,
    onSettle: () -> Unit,
    modifier: Modifier,
) {
    Frame(
        state = state,
        kicker = "FIRST LOG",
        title = "Log your first thing",
        modifier = modifier,
        footer = {
            PrimaryButton(
                label = "Settle & enter AIIMIN",
                onClick = onSettle,
                enabled = state.canSettle,
                modifier = Modifier.fillMaxWidth(),
            )
        },
    ) {
        Text(
            text = "Write anything — AIIMIN reads it and offers a structure. This is the whole loop, once.",
            style = AiiminTheme.type.body.copy(fontSize = 13.5.sp, lineHeight = 20.sp),
            color = AiiminTheme.colors.muted,
        )
        BlueprintBox(
            accent = true,
            tinted = true,
            modifier = Modifier.padding(top = AiiminTheme.space.s6),
        ) {
            BasicTextField(
                value = state.firstCapture,
                onValueChange = onChange,
                textStyle = AiiminTheme.type.body.copy(
                    fontSize = 15.sp,
                    lineHeight = 22.sp,
                    color = AiiminTheme.colors.text,
                ),
                cursorBrush = SolidColor(AiiminTheme.colors.accent),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(72.dp),
                decorationBox = { inner ->
                    if (state.firstCapture.isEmpty()) {
                        Text(
                            text = "paid 240 metro, walked 25 min, felt sharp 8/10",
                            style = AiiminTheme.type.body.copy(fontSize = 15.sp, lineHeight = 22.sp),
                            color = AiiminTheme.colors.muted,
                        )
                    }
                    inner()
                },
            )
        }
        if (state.firstCapture.isNotBlank()) {
            FlowRow(
                Modifier.padding(top = AiiminTheme.space.s3),
                horizontalArrangement = Arrangement.spacedBy(5.dp),
                verticalArrangement = Arrangement.spacedBy(5.dp),
            ) {
                listOf("₹240", "Transport", "Walk 25m", "Mood 8").forEach { chip ->
                    Text(
                        text = chip,
                        style = AiiminTheme.type.body.copy(
                            fontSize = 11.5.sp,
                            fontWeight = FontWeight.Medium,
                        ),
                        color = AiiminTheme.colors.onAccent,
                        modifier = Modifier
                            .background(AiiminTheme.colors.accent)
                            .padding(horizontal = 9.dp, vertical = 5.dp),
                    )
                }
            }
        }
    }
}

@Preview(showBackground = true, backgroundColor = 0xFF15171A, widthDp = 390, heightDp = 844)
@Composable
private fun WelcomePreview() {
    AiiminTheme {
        OnboardingScreen(
            state = OnboardingState.fresh(),
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
}
