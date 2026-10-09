package aiimin.app.security

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import aiimin.designsystem.brand.BrandMark
import aiimin.designsystem.component.BlueprintBox
import aiimin.designsystem.component.GhostButton
import aiimin.designsystem.component.PrimaryButton
import aiimin.designsystem.component.SheetGround
import aiimin.designsystem.component.TapSurface
import aiimin.designsystem.component.Text
import aiimin.designsystem.theme.AiiminTheme
import aiimin.designsystem.theme.BrandSpark
import aiimin.designsystem.theme.Hairline
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

/**
 * Dedicated, secure biometric and return login lock gate for returning users.
 * Matches Drafting Table palette and provides seamless fingerprint or 6-digit PIN unlocking.
 */
@Composable
fun BiometricLockGate(
    plate: String?,
    onRequestBiometric: suspend () -> Boolean,
    onVerifyPin: suspend (String) -> Result<Unit>,
    onUnlocked: () -> Unit,
    onSignOut: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val haptic = LocalHapticFeedback.current
    val scope = rememberCoroutineScope()
    val focusRequester = remember { FocusRequester() }
    val focusManager = LocalFocusManager.current

    var pinText by remember { mutableStateOf("") }
    var verifyingPin by remember { mutableStateOf(false) }
    var errorNotice by remember { mutableStateOf<String?>(null) }
    var showPinInput by remember { mutableStateOf(false) }
    var bioPromptedOnLaunch by remember { mutableStateOf(false) }

    fun triggerBiometric() {
        errorNotice = null
        scope.launch {
            val ok = onRequestBiometric()
            if (ok) {
                haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                onUnlocked()
            } else {
                // Biometric cancelled or not recognized; allow PIN entry seamlessly
                showPinInput = true
            }
        }
    }

    // Auto-prompt biometrics once on gate appearance
    LaunchedEffect(Unit) {
        if (!bioPromptedOnLaunch) {
            bioPromptedOnLaunch = true
            delay(180)
            triggerBiometric()
        }
    }

    fun submitPin(pin: String) {
        if (pin.length != 6 || verifyingPin) return
        verifyingPin = true
        errorNotice = null
        scope.launch {
            val result = onVerifyPin(pin)
            verifyingPin = false
            result.fold(
                onSuccess = {
                    haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                    onUnlocked()
                },
                onFailure = { err ->
                    haptic.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                    pinText = ""
                    errorNotice = err.message ?: "Incorrect PIN. Please try again."
                    focusRequester.requestFocus()
                },
            )
        }
    }

    SheetGround(modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
                .navigationBarsPadding()
                .padding(horizontal = AiiminTheme.space.page)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(AiiminTheme.space.s4),
        ) {
            // Header: Brand & Identity
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = AiiminTheme.space.s4),
            ) {
                BrandMark(size = 64.dp)
                Text(
                    text = "AIIMIN",
                    style = AiiminTheme.type.wordmark.copy(fontSize = 20.sp, letterSpacing = 2.sp),
                    color = AiiminTheme.colors.text,
                    modifier = Modifier.padding(top = AiiminTheme.space.s3),
                )
                Text(
                    text = "One screen. Every day.",
                    style = AiiminTheme.type.mono(10.0),
                    color = AiiminTheme.colors.muted,
                    modifier = Modifier.padding(top = 2.dp),
                )

                // User Identity Card
                BlueprintBox(
                    accent = true,
                    tinted = true,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = AiiminTheme.space.s6),
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.fillMaxWidth(),
                    ) {
                        Text(
                            text = "RETURNING OPERATING IDENTITY",
                            style = AiiminTheme.type.mono(9.5),
                            color = AiiminTheme.colors.muted,
                        )
                        Text(
                            text = if (!plate.isNullOrBlank()) "@$plate" else "LOCAL IDENTITY",
                            style = AiiminTheme.type.mono(18.0, FontWeight.Bold),
                            color = AiiminTheme.colors.text,
                            modifier = Modifier.padding(top = 4.dp),
                        )
                    }
                }
            }

            // Center: Interactive Unlock Controls
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = AiiminTheme.space.s6),
            ) {
                if (!showPinInput) {
                    // Fingerprint biometric primary card
                    TapSurface(
                        onClick = { triggerBiometric() },
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(Hairline, AiiminTheme.colors.accent.copy(alpha = 0.65f))
                            .background(AiiminTheme.colors.surface)
                            .padding(vertical = AiiminTheme.space.s6, horizontal = AiiminTheme.space.s4),
                    ) {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            modifier = Modifier.fillMaxWidth(),
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(56.dp)
                                    .background(AiiminTheme.colors.accent.copy(alpha = 0.12f), CircleShape)
                                    .border(Hairline, AiiminTheme.colors.accent, CircleShape),
                                contentAlignment = Alignment.Center,
                            ) {
                                Text(
                                    text = "✦",
                                    style = AiiminTheme.type.mono(22.0),
                                    color = BrandSpark,
                                )
                            }
                            Text(
                                text = "TOUCH FINGERPRINT SENSOR",
                                style = AiiminTheme.type.chrome.copy(fontSize = 13.sp, letterSpacing = 1.sp),
                                color = AiiminTheme.colors.text,
                                modifier = Modifier.padding(top = AiiminTheme.space.s3),
                            )
                            Text(
                                text = "Tap to prompt biometrics or use 6-digit PIN below",
                                style = AiiminTheme.type.bodySmall.copy(fontSize = 11.5.sp),
                                color = AiiminTheme.colors.muted,
                                modifier = Modifier.padding(top = 4.dp),
                            )
                        }
                    }

                    Spacer(Modifier.height(AiiminTheme.space.s4))
                    GhostButton(
                        label = "Enter 6-digit PIN instead",
                        onClick = {
                            showPinInput = true
                            scope.launch {
                                delay(100)
                                focusRequester.requestFocus()
                            }
                        },
                        modifier = Modifier.fillMaxWidth(),
                    )
                } else {
                    // PIN Entry Mode: 6 tactile digit cells
                    Text(
                        text = "ENTER 6-DIGIT PIN",
                        style = AiiminTheme.type.mono(11.0, FontWeight.Medium),
                        color = AiiminTheme.colors.muted,
                    )

                    // 6 Square Digit Display Boxes hosted directly in BasicTextField decorationBox
                    BasicTextField(
                        value = pinText,
                        onValueChange = { input ->
                            val filtered = input.filter { it.isDigit() }.take(6)
                            pinText = filtered
                            if (filtered.length == 6) {
                                submitPin(filtered)
                            }
                        },
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.NumberPassword,
                            imeAction = ImeAction.Done,
                        ),
                        keyboardActions = KeyboardActions(
                            onDone = {
                                if (pinText.length == 6) submitPin(pinText)
                                focusManager.clearFocus()
                            },
                        ),
                        singleLine = true,
                        cursorBrush = SolidColor(androidx.compose.ui.graphics.Color.Transparent),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = AiiminTheme.space.s4)
                            .focusRequester(focusRequester),
                        decorationBox = {
                            Row(
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.fillMaxWidth(),
                            ) {
                                repeat(6) { idx ->
                                    val isFilled = idx < pinText.length
                                    val isCurrent = idx == pinText.length
                                    Box(
                                        modifier = Modifier
                                            .weight(1f)
                                            .aspectRatio(0.85f)
                                            .border(
                                                width = if (isCurrent) 1.5.dp else Hairline,
                                                color = when {
                                                    isCurrent -> AiiminTheme.colors.accent
                                                    isFilled -> BrandSpark
                                                    else -> AiiminTheme.colors.rule
                                                },
                                            )
                                            .background(
                                                if (isFilled) AiiminTheme.colors.surface else AiiminTheme.colors.bg,
                                            ),
                                        contentAlignment = Alignment.Center,
                                    ) {
                                        Text(
                                            text = if (isFilled) "●" else if (isCurrent) "—" else "",
                                            style = AiiminTheme.type.mono(18.0, FontWeight.Bold),
                                            color = if (isFilled) BrandSpark else AiiminTheme.colors.muted,
                                        )
                                    }
                                }
                            }
                        },
                    )

                    if (verifyingPin) {
                        Text(
                            text = "VERIFYING PIN…",
                            style = AiiminTheme.type.mono(10.0),
                            color = AiiminTheme.colors.accent,
                            modifier = Modifier.padding(top = AiiminTheme.space.s3),
                        )
                    }

                    Spacer(Modifier.height(AiiminTheme.space.s4))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
                    ) {
                        GhostButton(
                            label = "Fingerprint",
                            onClick = {
                                showPinInput = false
                                triggerBiometric()
                            },
                            modifier = Modifier.weight(1f),
                        )
                        PrimaryButton(
                            label = "Unlock",
                            onClick = { submitPin(pinText) },
                            enabled = pinText.length == 6 && !verifyingPin,
                            modifier = Modifier.weight(1f),
                        )
                    }
                }

                // Error Notice feedback
                AnimatedVisibility(
                    visible = errorNotice != null,
                    enter = fadeIn(),
                    exit = fadeOut(),
                ) {
                    errorNotice?.let {
                        Text(
                            text = it,
                            style = AiiminTheme.type.bodySmall.copy(fontSize = 12.sp),
                            color = AiiminTheme.colors.danger,
                            textAlign = TextAlign.Center,
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(top = AiiminTheme.space.s3),
                        )
                    }
                }
            }

            // Footer: Sign Out / Reset session if needed
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = AiiminTheme.space.s4),
            ) {
                TapSurface(
                    onClick = onSignOut,
                    minTouchTarget = false,
                ) {
                    Text(
                        text = "SIGN OUT / USE DIFFERENT ACCOUNT",
                        style = AiiminTheme.type.mono(9.5),
                        color = AiiminTheme.colors.muted,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.padding(vertical = AiiminTheme.space.s2),
                    )
                }
            }
        }
    }
}
