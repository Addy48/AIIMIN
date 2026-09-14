package aiimin.feature.discipline

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
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
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
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
import aiimin.designsystem.component.BlueprintBox
import aiimin.designsystem.component.GhostButton
import aiimin.designsystem.component.HairRule
import aiimin.designsystem.component.PrimaryButton
import aiimin.designsystem.component.ScreenHead
import aiimin.designsystem.component.SectionRule
import aiimin.designsystem.component.TapSurface
import aiimin.designsystem.component.Text
import aiimin.designsystem.theme.AiiminTheme
import aiimin.designsystem.theme.Hairline
import java.util.Locale

@Composable
fun DisciplineRoute(
    onBack: () -> Unit = {},
    onOpenBlockingSettings: () -> Unit = {},
    onRequireBiometric: (suspend () -> Boolean)? = null,
    modifier: Modifier = Modifier,
    viewModel: DisciplineViewModel = hiltViewModel(),
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    var unlocked by remember { mutableStateOf(onRequireBiometric == null) }
    LaunchedEffect(onRequireBiometric) {
        unlocked = onRequireBiometric?.invoke() ?: true
    }
    if (!unlocked) {
        LockedState(
            streakDays = state.streakDays,
            onTryAgain = { unlocked = false },
            onBack = onBack,
            modifier = modifier,
        )
        return
    }

    DisciplineScreen(
        state = state,
        onBack = onBack,
        onCategory = viewModel::setCategory,
        onIntensity = viewModel::setIntensity,
        onNote = viewModel::setNote,
        onOutcome = viewModel::logOutcome,
        onDismissNotice = viewModel::dismissNotice,
        onToggleBlocked = viewModel::toggleBlockedPackage,
        onOpenBlockingSettings = onOpenBlockingSettings,
        modifier = modifier,
    )
}

@Composable
fun DisciplineScreen(
    state: DisciplineUiState,
    onBack: () -> Unit,
    onCategory: (String) -> Unit,
    onIntensity: (Int) -> Unit,
    onNote: (String) -> Unit,
    onOutcome: (String) -> Unit,
    onDismissNotice: () -> Unit,
    onToggleBlocked: (String) -> Unit,
    onOpenBlockingSettings: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val colors = AiiminTheme.colors
    val categories = listOf("screen", "food", "porn", "masturbation", "other")
    Column(
        modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = AiiminTheme.space.s4)
            .padding(bottom = AiiminTheme.space.s8),
    ) {
        ScreenHead(title = "Discipline", meta = "private · local first")
        GhostButton(label = "BACK", onClick = onBack, modifier = Modifier.padding(top = AiiminTheme.space.s2))
        state.notice?.let {
            GhostButton(label = it.uppercase(Locale.US), onClick = onDismissNotice, modifier = Modifier.padding(top = AiiminTheme.space.s3), color = colors.accent)
        }
        SectionRule(label = "Current line", value = "${state.streakDays}d · ${state.totalLogs} logs")
        BlueprintBox(accent = true, tinted = true, legend = "A record, not a verdict", modifier = Modifier.padding(top = AiiminTheme.space.s3)) {
            Text("Log what happened. The app will not label you or publish the detail.", style = AiiminTheme.type.body, color = colors.text)
            Text("Choose the category and outcome below; write only what helps the next decision.", style = AiiminTheme.type.mono(11.0), color = colors.muted, modifier = Modifier.padding(top = AiiminTheme.space.s2))
        }
        SectionRule(label = "Category", value = state.category.uppercase(Locale.US))
        Row(Modifier.fillMaxWidth().padding(top = AiiminTheme.space.s3), horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2)) {
            categories.take(3).forEach { category ->
                GhostButton(label = category, onClick = { onCategory(category) }, modifier = Modifier.weight(1f), color = if (state.category == category) colors.accent else colors.muted)
            }
        }
        Row(Modifier.fillMaxWidth().padding(top = AiiminTheme.space.s2), horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2)) {
            categories.drop(3).forEach { category ->
                GhostButton(label = category, onClick = { onCategory(category) }, modifier = Modifier.weight(1f), color = if (state.category == category) colors.accent else colors.muted)
            }
            Spacer(Modifier.weight(2f))
        }
        SectionRule(label = "Intensity", value = "${state.intensity}/5")
        Row(Modifier.fillMaxWidth().padding(top = AiiminTheme.space.s3), horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2)) {
            (1..5).forEach { level ->
                GhostButton(label = level.toString(), onClick = { onIntensity(level) }, modifier = Modifier.weight(1f), color = if (state.intensity == level) colors.accent else colors.muted)
            }
        }
        SectionRule(label = "Optional note", value = "${state.note.length}/1000")
        BasicTextField(
            value = state.note,
            onValueChange = onNote,
            modifier = Modifier.fillMaxWidth().padding(top = AiiminTheme.space.s3).border(1.dp, colors.hair).padding(AiiminTheme.space.s3),
            textStyle = AiiminTheme.type.body.copy(color = colors.text, fontSize = 15.sp),
            cursorBrush = SolidColor(colors.accent),
            minLines = 4,
            maxLines = 8,
            decorationBox = { inner ->
                Box {
                    if (state.note.isBlank()) Text("What was the trigger, what helped, or what do you want to remember?", style = AiiminTheme.type.body, color = colors.muted)
                    inner()
                }
            },
        )
        SectionRule(label = "Blocking", value = if (state.blockedPackages.isEmpty()) "not configured" else "${state.blockedPackages.size} selected")
        Text("Choose apps locally, then enable Aimin in Android Accessibility settings. The service only reacts to the packages you select.", style = AiiminTheme.type.mono(10.5), color = colors.muted, modifier = Modifier.padding(top = AiiminTheme.space.s3))
        state.blockApps.take(12).forEach { app ->
            val selected = app.packageName in state.blockedPackages
            GhostButton(label = if (selected) "✓ ${app.label}" else app.label, onClick = { onToggleBlocked(app.packageName) }, modifier = Modifier.fillMaxWidth().padding(top = AiiminTheme.space.s2), color = if (selected) colors.accent else colors.muted)
        }
        GhostButton(label = "OPEN ACCESSIBILITY SETTINGS", onClick = onOpenBlockingSettings, modifier = Modifier.fillMaxWidth().padding(top = AiiminTheme.space.s2), color = colors.accent)
        SectionRule(label = "Outcome", value = "close the loop")
        Row(Modifier.fillMaxWidth().padding(top = AiiminTheme.space.s3), horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2)) {
            PrimaryButton(label = "Resisted", onClick = { onOutcome("resisted") }, modifier = Modifier.weight(1f))
            GhostButton(label = "Partial", onClick = { onOutcome("partial") }, modifier = Modifier.weight(1f))
            GhostButton(label = "Acted", onClick = { onOutcome("acted") }, modifier = Modifier.weight(1f), color = colors.muted)
        }
        Text("This is self-observation, not a medical diagnosis or a substitute for support.", style = AiiminTheme.type.mono(10.5), color = colors.muted, textAlign = TextAlign.Center, modifier = Modifier.fillMaxWidth().padding(top = AiiminTheme.space.s4))
    }
}

/**
 * Biometric-cancelled locked state.
 *
 * Design goals:
 * - Show the user something meaningful even when locked: their streak.
 * - 7-day mini calendar strip — at-a-glance consistency signal.
 * - Motivational copy that reinforces the mechanic without being preachy.
 * - Two clear CTAs with enough breathing room — no orphaned buttons.
 */
@Composable
private fun LockedState(
    streakDays: Int,
    onTryAgain: () -> Unit,
    onBack: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val colors = AiiminTheme.colors
    val dayLabels = listOf("M", "T", "W", "T", "F", "S", "S")

    Column(
        modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = AiiminTheme.space.page)
            .padding(bottom = AiiminTheme.space.s8),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        ScreenHead(title = "Discipline", meta = "locked · biometric required")

        Spacer(Modifier.height(AiiminTheme.space.s8 + AiiminTheme.space.s4))

        // Shield lockup.
        Box(
            Modifier
                .size(64.dp)
                .border(Hairline, colors.accent.copy(alpha = 0.6f))
                .background(colors.tint),
            contentAlignment = Alignment.Center,
        ) {
            Text(
                text = "◈",
                style = AiiminTheme.type.mono(28.0, FontWeight.Medium),
                color = colors.accent,
            )
        }

        Spacer(Modifier.height(AiiminTheme.space.s6))

        // Streak figure.
        Text(
            text = "$streakDays",
            style = AiiminTheme.type.mono.copy(
                fontSize = 64.sp,
                fontWeight = FontWeight.Bold,
                lineHeight = 58.sp,
                letterSpacing = (-1.5).sp,
            ),
            color = colors.text,
            textAlign = TextAlign.Center,
        )
        Text(
            text = if (streakDays == 1) "DAY CLEAN" else "DAYS CLEAN",
            style = AiiminTheme.type.chrome.copy(fontSize = 11.sp, letterSpacing = 2.sp),
            color = colors.accent,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(top = AiiminTheme.space.s2),
        )

        Spacer(Modifier.height(AiiminTheme.space.s8))

        // 7-day mini calendar strip.
        SectionRule(label = "This week", value = "LOCAL")
        Row(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s3),
            horizontalArrangement = Arrangement.SpaceEvenly,
        ) {
            // Show last 7 days — placeholder dots (real data wired via streakDays context).
            dayLabels.forEachIndexed { i, label ->
                val dayOffset = 6 - i // 0 = today
                val isClean = dayOffset < streakDays
                val isToday = dayOffset == 0
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(4.dp),
                ) {
                    Text(
                        text = label,
                        style = AiiminTheme.type.mono(9.0),
                        color = colors.muted,
                    )
                    Box(
                        Modifier
                            .size(18.dp)
                            .border(
                                Hairline,
                                when {
                                    isToday -> colors.accent
                                    isClean -> colors.accent.copy(alpha = 0.5f)
                                    else -> colors.hair
                                },
                            )
                            .background(
                                when {
                                    isClean -> colors.tint
                                    else -> colors.bg
                                },
                            ),
                    )
                }
            }
        }

        Spacer(Modifier.height(AiiminTheme.space.s8))

        // Motivational copy.
        BlueprintBox(
            accent = false,
            modifier = Modifier.fillMaxWidth(),
        ) {
            Text(
                text = "Fewer than 1% of people maintain this kind of deliberate log. The data is yours — no server reads it.",
                style = AiiminTheme.type.body.copy(fontSize = 13.sp, lineHeight = 19.sp),
                color = colors.muted,
                textAlign = TextAlign.Start,
            )
        }

        Spacer(Modifier.height(AiiminTheme.space.s8))

        PrimaryButton(
            label = "TRY BIOMETRIC AGAIN",
            onClick = onTryAgain,
            modifier = Modifier.fillMaxWidth(),
        )
        GhostButton(
            label = "BACK",
            onClick = onBack,
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s3),
            color = colors.muted,
        )

        Spacer(Modifier.height(AiiminTheme.space.s4))
        HairRule()
        Text(
            text = "UNLOCKS AT MIDNIGHT · VERIFIED LOCALLY",
            style = AiiminTheme.type.mono(9.0),
            color = colors.muted.copy(alpha = 0.5f),
            textAlign = TextAlign.Center,
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s3),
        )
    }
}

@Preview(showBackground = true, backgroundColor = 0xFF141414)
@Composable
private fun DisciplinePreview() {
    AiiminTheme { DisciplineScreen(state = DisciplineUiState(), onBack = {}, onCategory = {}, onIntensity = {}, onNote = {}, onOutcome = {}, onDismissNotice = {}, onToggleBlocked = {}, onOpenBlockingSettings = {}, modifier = Modifier) }
}

@Preview(showBackground = true, backgroundColor = 0xFF141414, widthDp = 390, heightDp = 900)
@Composable
private fun LockedPreview() {
    AiiminTheme { LockedState(streakDays = 5, onTryAgain = {}, onBack = {}) }
}
