package aiimin.feature.english

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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import aiimin.core.data.SpeakingSession
import aiimin.core.model.TierFeature
import aiimin.designsystem.component.BlueprintBox
import aiimin.designsystem.component.GhostButton
import aiimin.designsystem.component.HairRule
import aiimin.designsystem.component.PrimaryButton
import aiimin.designsystem.component.ScreenHead
import aiimin.designsystem.component.SectionRule
import aiimin.designsystem.component.TapSurface
import aiimin.designsystem.component.Text
import aiimin.designsystem.component.TierGateWall
import aiimin.designsystem.theme.AiiminTheme
import aiimin.designsystem.theme.Hairline
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale

@Composable
fun EnglishRoute(
    onBack: () -> Unit = {},
    onUpgradePlan: () -> Unit = {},
    onNotNow: () -> Unit = {},
    modifier: Modifier = Modifier,
    viewModel: EnglishViewModel = hiltViewModel(),
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    LaunchedEffect(Unit) {
        if (state.spark.prompt == null) viewModel.spinPrompt()
    }
    if (state.gated) {
        Box(modifier.fillMaxSize()) {
            TierGateWall(
                feature = TierFeature.LAB_FULL,
                current = state.tier,
                onOpenPlans = onUpgradePlan,
                onNotNow = onNotNow,
            )
        }
        return
    }
    EnglishScreen(
        state = state,
        onBack = onBack,
        onSpin = viewModel::spinPrompt,
        onSpinCategory = { viewModel.spinPrompt(it) },
        onStart = viewModel::startTimer,
        onStop = viewModel::stopEarly,
        onConfidence = viewModel::setConfidence,
        onClarity = viewModel::setClarity,
        onPace = viewModel::setPace,
        onSave = viewModel::saveScores,
        onReset = viewModel::resetSpark,
        onDismissNotice = viewModel::dismissNotice,
        modifier = modifier,
    )
}

@Composable
fun EnglishScreen(
    state: EnglishUiState,
    onBack: () -> Unit,
    onSpin: () -> Unit,
    onSpinCategory: (String) -> Unit,
    onStart: () -> Unit,
    onStop: () -> Unit,
    onConfidence: (Int) -> Unit,
    onClarity: (Int) -> Unit,
    onPace: (Int) -> Unit,
    onSave: () -> Unit,
    onReset: () -> Unit,
    onDismissNotice: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val speak = state.speaking
    val spark = state.spark
    Column(
        modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = AiiminTheme.space.s4)
            .padding(bottom = AiiminTheme.space.s8),
    ) {
        ScreenHead(
            title = "English · Spark",
            meta = speak.headMeta,
        )
        GhostButton(
            label = "BACK",
            onClick = onBack,
            modifier = Modifier.padding(top = AiiminTheme.space.s2),
        )

        speak.notice?.let { notice ->
            TapSurface(onClick = onDismissNotice, modifier = Modifier.padding(top = AiiminTheme.space.s3)) {
                Text(
                    text = notice.message.uppercase(Locale.US),
                    style = AiiminTheme.type.mono(10.5),
                    color = AiiminTheme.colors.accent,
                )
            }
        }

        SectionRule(
            label = "Streak · mastery",
            value = "${speak.streakDays}d · ${speak.mastery.uppercase(Locale.US)}",
        )
        Row(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s3),
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
        ) {
            StatCell("LATEST", speak.latestScore?.toString() ?: "—", Modifier.weight(1f))
            StatCell("SESSIONS", speak.sessionCount.toString(), Modifier.weight(1f))
            StatCell(
                "RATED",
                if (speak.rated) "YES" else "${speak.sessionCount}/3",
                Modifier.weight(1f),
            )
        }

        SectionRule(label = "Today's drill", value = "60s")
        BlueprintBox(
            accent = spark.phase == SparkPhase.RECORDING,
            tinted = true,
            modifier = Modifier.padding(top = AiiminTheme.space.s3),
        ) {
            Text(
                text = spark.prompt?.category?.uppercase(Locale.US) ?: "PROMPT",
                style = AiiminTheme.type.cellLabel,
                color = AiiminTheme.colors.accent,
            )
            Text(
                text = spark.prompt?.text ?: "Spin a prompt to begin.",
                style = AiiminTheme.type.body.copy(fontSize = 16.sp, lineHeight = 24.sp),
                color = AiiminTheme.colors.text,
                modifier = Modifier.padding(top = AiiminTheme.space.s3),
            )
            if (spark.phase == SparkPhase.RECORDING || spark.phase == SparkPhase.READY) {
                Text(
                    text = "%02d".format(spark.secondsLeft),
                    style = AiiminTheme.type.mono.copy(fontSize = 48.sp, lineHeight = 52.sp),
                    color = if (spark.phase == SparkPhase.RECORDING) {
                        AiiminTheme.colors.accent
                    } else {
                        AiiminTheme.colors.muted
                    },
                    textAlign = TextAlign.Center,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = AiiminTheme.space.s4),
                )
            }
        }

        Row(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s3),
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2),
        ) {
            listOf("HR", "Technical", "Daily", "Debate").forEach { cat ->
                GhostButton(
                    label = cat.uppercase(Locale.US),
                    onClick = { onSpinCategory(cat) },
                    modifier = Modifier.weight(1f),
                    enabled = spark.phase != SparkPhase.RECORDING,
                )
            }
        }

        Row(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s3),
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
        ) {
            when (spark.phase) {
                SparkPhase.IDLE, SparkPhase.READY, SparkPhase.DONE -> {
                    GhostButton(label = "SPIN", onClick = onSpin, modifier = Modifier.weight(1f))
                    PrimaryButton(label = "START 60s", onClick = onStart, modifier = Modifier.weight(1f))
                }
                SparkPhase.RECORDING -> {
                    PrimaryButton(label = "STOP · SCORE", onClick = onStop, modifier = Modifier.fillMaxWidth())
                }
                SparkPhase.SCORE -> {
                    Text(
                        text = "Self-score honesty beats a fake AI grade. Mean becomes your confidence log.",
                        style = AiiminTheme.type.bodySmall,
                        color = AiiminTheme.colors.muted,
                        modifier = Modifier.fillMaxWidth(),
                    )
                }
            }
        }

        if (spark.phase == SparkPhase.SCORE || spark.phase == SparkPhase.DONE) {
            SectionRule(label = "Self-score", value = "1–100")
            ScoreSlider("CONFIDENCE", spark.confidence, onConfidence)
            ScoreSlider("CLARITY", spark.clarity, onClarity)
            ScoreSlider("PACE", spark.pace, onPace)
            Text(
                text = "MEAN ${(spark.confidence + spark.clarity + spark.pace) / 3}",
                style = AiiminTheme.type.mono(12.0),
                color = AiiminTheme.colors.accent,
                modifier = Modifier.padding(top = AiiminTheme.space.s2),
            )
            Row(
                Modifier
                    .fillMaxWidth()
                    .padding(top = AiiminTheme.space.s3),
                horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
            ) {
                if (spark.phase == SparkPhase.SCORE) {
                    PrimaryButton(label = "SAVE SESSION", onClick = onSave, modifier = Modifier.weight(1f))
                }
                GhostButton(label = "AGAIN", onClick = onReset, modifier = Modifier.weight(1f))
            }
        }

        SectionRule(label = "History", value = "${speak.sessions.size}")
        if (speak.sessions.isEmpty()) {
            Text(
                text = "No sessions yet. One honest 60s drill beats a week of skipping.",
                style = AiiminTheme.type.bodySmall,
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = AiiminTheme.space.s3),
            )
        } else {
            speak.sessions.take(12).forEach { session ->
                HistoryRow(session)
                HairRule(Modifier.padding(vertical = AiiminTheme.space.s2))
            }
        }

        Text(
            text = "Audio stays on-device for now. Scores sync to lab_speaking_logs via /api/lab/practice/speaking.",
            style = AiiminTheme.type.mono(10.0),
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = AiiminTheme.space.s4),
        )
    }
}

@Composable
private fun StatCell(label: String, value: String, modifier: Modifier = Modifier) {
    Column(
        modifier
            .border(Hairline, AiiminTheme.colors.hair)
            .padding(AiiminTheme.space.s3),
    ) {
        Text(text = label, style = AiiminTheme.type.cellLabel, color = AiiminTheme.colors.muted)
        Text(
            text = value,
            style = AiiminTheme.type.mono(18.0),
            color = AiiminTheme.colors.text,
            modifier = Modifier.padding(top = AiiminTheme.space.s2),
        )
    }
}

@Composable
private fun ScoreSlider(label: String, value: Int, onChange: (Int) -> Unit) {
    Column(Modifier.padding(top = AiiminTheme.space.s3)) {
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text(text = label, style = AiiminTheme.type.cellLabel, color = AiiminTheme.colors.muted)
            Text(text = value.toString(), style = AiiminTheme.type.mono(12.0), color = AiiminTheme.colors.accent)
        }
        Row(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s2),
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2),
        ) {
            listOf(-10, -5, 5, 10).forEach { delta ->
                GhostButton(
                    label = if (delta > 0) "+$delta" else "$delta",
                    onClick = { onChange(value + delta) },
                    modifier = Modifier.weight(1f),
                )
            }
        }
        Box(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s2)
                .height(4.dp)
                .background(AiiminTheme.colors.surface),
        ) {
            Box(
                Modifier
                    .fillMaxWidth(value / 100f)
                    .height(4.dp)
                    .background(AiiminTheme.colors.accent),
            )
        }
    }
}

@Composable
private fun HistoryRow(session: SpeakingSession) {
    val whenLabel = Instant.ofEpochMilli(session.loggedAtMs)
        .atZone(ZoneId.systemDefault())
        .format(DateTimeFormatter.ofPattern("EEE d · HH:mm", Locale.US))
    Column(Modifier.padding(top = AiiminTheme.space.s2)) {
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text(
                text = whenLabel.uppercase(Locale.US),
                style = AiiminTheme.type.mono(10.5),
                color = AiiminTheme.colors.muted,
            )
            Text(
                text = "μ ${session.mean}${if (session.pending) " · QUEUE" else ""}",
                style = AiiminTheme.type.mono(10.5),
                color = AiiminTheme.colors.accent,
            )
        }
        Text(
            text = session.promptText,
            style = AiiminTheme.type.bodySmall,
            color = AiiminTheme.colors.text,
            modifier = Modifier.padding(top = AiiminTheme.space.s2),
            maxLines = 2,
        )
        Text(
            text = "C ${session.confidence} · CL ${session.clarity} · P ${session.pace} · ${session.durationSec}s",
            style = AiiminTheme.type.mono(10.0),
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = AiiminTheme.space.s1),
        )
    }
}
