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
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
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
import aiimin.designsystem.component.GhostButton
import aiimin.designsystem.component.HairRule
import aiimin.designsystem.component.PrimaryButton
import aiimin.designsystem.component.TapSurface
import aiimin.designsystem.component.Text
import aiimin.designsystem.theme.AiiminTheme
import aiimin.designsystem.theme.Hairline

@Composable
fun OnboardingRoute(
    onEntered: () -> Unit,
    modifier: Modifier = Modifier,
    viewModel: OnboardingViewModel = hiltViewModel(),
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val osIdLive by viewModel.osIdLive.collectAsStateWithLifecycle()
    OnboardingScreen(
        state = state,
        osIdLive = osIdLive,
        onNext = viewModel::onNext,
        onContinueSignIn = viewModel::onContinueSignIn,
        onSelectOsId = viewModel::onSelectOsId,
        onArcChange = viewModel::onArcChange,
        onToggleMinimum = viewModel::onToggleMinimum,
        onFirstCaptureChange = viewModel::onFirstCaptureChange,
        onSettle = {
            if (viewModel.onSettleAndEnter()) onEntered()
        },
        onSkip = {
            viewModel.onSkip()
            onEntered()
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
 * First capture. OS-ID availability is live against the API; auth / PIN stay out.
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
    modifier: Modifier = Modifier,
    osIdLive: OsIdCheckResult = OsIdCheckResult(OsIdAvailability.IDLE, ""),
    onClaim: () -> Unit = onNext,
) {
    when (state.step) {
        1 -> WelcomeStep(state, onNext, onSkip, modifier)
        2 -> SignInStep(state, onContinueSignIn, modifier)
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
    Column(
        modifier
            .fillMaxSize()
            .background(AiiminTheme.colors.bg)
            .padding(horizontal = AiiminTheme.space.page)
            .padding(top = AiiminTheme.space.s2, bottom = AiiminTheme.space.s8),
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2),
        ) {
            BrandMark(size = 22.dp)
            Text(
                text = "AIIMIN",
                style = AiiminTheme.type.chrome.copy(
                    fontSize = 13.sp,
                    letterSpacing = 3.6.sp,
                ),
            )
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

@Composable
private fun WelcomeStep(
    state: OnboardingState,
    onNext: () -> Unit,
    onSkip: () -> Unit,
    modifier: Modifier,
) {
    Frame(
        state = state,
        kicker = "WELCOME",
        title = "One screen.\nEvery day.",
        modifier = modifier,
        footer = {
            PrimaryButton(label = "Begin", onClick = onNext, modifier = Modifier.fillMaxWidth())
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
        Box(
            Modifier
                .fillMaxWidth()
                .padding(vertical = AiiminTheme.space.s8),
            contentAlignment = Alignment.Center,
        ) {
            Box(
                Modifier
                    .size(96.dp)
                    .background(AiiminTheme.colors.tint)
                    .border(Hairline, AiiminTheme.colors.rule)
                    .padding(18.dp),
                contentAlignment = Alignment.Center,
            ) {
                BrandMark(size = 60.dp)
            }
        }
    }
}

@Composable
private fun SignInStep(
    state: OnboardingState,
    onContinue: () -> Unit,
    modifier: Modifier,
) {
    Frame(
        state = state,
        kicker = "SIGN IN",
        title = "Your identity",
        modifier = modifier,
        footer = {
            PrimaryButton(label = "Continue", onClick = onContinue, modifier = Modifier.fillMaxWidth())
            Text(
                text = "OS-ID + PIN OR GOOGLE · NEVER SHARED",
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
            text = "Sign in with your 8-character OS-ID or continue with Google. " +
                "Testers are approved by invite. Local demo — nothing leaves the phone.",
            style = AiiminTheme.type.body.copy(fontSize = 13.5.sp, lineHeight = 20.sp),
            color = AiiminTheme.colors.muted,
        )
        Text(
            text = "8-char OS-ID or email",
            style = AiiminTheme.type.mono(13.0),
            color = AiiminTheme.colors.muted,
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s6)
                .border(Hairline, AiiminTheme.colors.hair)
                .padding(horizontal = AiiminTheme.space.s4, vertical = AiiminTheme.space.s3),
        )
        Text(
            text = "PIN  ● ● ● ● ● ●",
            style = AiiminTheme.type.mono(13.0),
            color = AiiminTheme.colors.muted,
            modifier = Modifier
                .fillMaxWidth()
                .border(Hairline, AiiminTheme.colors.hair)
                .padding(horizontal = AiiminTheme.space.s4, vertical = AiiminTheme.space.s3),
        )
        GhostButton(
            label = "Continue with Google",
            onClick = onContinue,
            color = AiiminTheme.colors.text,
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s3),
        )
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
