package aiimin.feature.today

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import aiimin.core.data.DayEntry
import aiimin.core.data.DayState
import aiimin.core.model.CommitmentShape
import aiimin.core.model.Direction
import aiimin.designsystem.component.BlueprintBox
import aiimin.designsystem.component.EmptyState
import aiimin.designsystem.component.HairRule
import aiimin.designsystem.component.InstrumentCell
import aiimin.designsystem.component.ScoreFigure
import aiimin.designsystem.component.ScreenHead
import aiimin.designsystem.component.SectionRule
import aiimin.designsystem.component.TapSurface
import aiimin.designsystem.component.Text
import aiimin.designsystem.component.TrajectoryLine
import aiimin.designsystem.theme.AiiminTheme
import aiimin.designsystem.theme.Hairline
import kotlin.math.roundToInt

@Composable
fun TodayRoute(
    onOpenCapture: (String) -> Unit,
    onOpenScore: () -> Unit = {},
    modifier: Modifier = Modifier,
    viewModel: TodayViewModel = hiltViewModel(),
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    TodayScreen(
        state = state,
        onOpenCapture = onOpenCapture,
        onOpenScore = onOpenScore,
        onToggle = viewModel::onToggle,
        onMicroTaskChange = viewModel::onMicroTaskChange,
        modifier = modifier,
    )
}

/**
 * **One job: act on this day.**
 *
 * Order is doctrine, not taste (Genesis GOV-106, and GOV-165 — there is no
 * Dashboard surface): the way *in* comes first, then the one small thing, and
 * only then the read. Nothing above the fold asks to be understood before
 * something can be done.
 *
 * The score sits below because a number you cannot act on is not a reason to
 * open an app.
 */
@Composable
fun TodayScreen(
    state: DayState,
    onOpenCapture: (String) -> Unit,
    onToggle: (Long) -> Unit,
    onMicroTaskChange: (String) -> Unit,
    onOpenScore: () -> Unit = {},
    modifier: Modifier = Modifier,
) {
    Column(
        modifier
            .fillMaxSize()
            .background(AiiminTheme.colors.bg)
            .verticalScroll(rememberScrollState())
            .padding(horizontal = AiiminTheme.space.page)
            .padding(bottom = AiiminTheme.space.s8),
    ) {
        ScreenHead(title = "AIIMIN · Day sheet", meta = "TODAY")

        // ① the way in
        CaptureLead(onOpenCapture = onOpenCapture, modifier = Modifier.padding(top = AiiminTheme.space.s6))

        // ② the one small thing
        MicroTask(text = state.microTask, onChange = onMicroTaskChange)

        // ③ floors — warnings, never score
        state.breachedFloors.forEach { floor -> FloorWarning(floor) }

        // ④ the read — tap opens Live Score
        SectionRule(label = "Today's read", value = state.mode.label)
        TodayScore(state, onOpenScore = onOpenScore)

        // ⑤ what is being held
        SectionRule(label = "Daily minimums", value = minimumsLabel(state))
        if (state.pursuits.isEmpty()) {
            EmptyState(
                label = "Nothing set",
                message = "Calibration picks these with you. Until then the seed set is standing in.",
            )
        } else {
            state.pursuits.forEach { entry -> MinimumRow(entry, onToggle) }
        }

        // ⑥ what landed
        SectionRule(label = "Settled today", value = "${state.captures.size}")
        if (state.captures.isEmpty()) {
            EmptyState(
                label = "Nothing settled yet",
                message = "Write one line above. What you settle on Capture lands here.",
            )
        } else {
            state.captures.forEach { capture ->
                Column {
                    Row(
                        Modifier
                            .fillMaxWidth()
                            .padding(vertical = 8.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                    ) {
                        Text(text = capture.label, style = AiiminTheme.type.body, modifier = Modifier.weight(1f))
                        Text(
                            text = capture.time,
                            style = AiiminTheme.type.mono,
                            color = AiiminTheme.colors.muted,
                        )
                    }
                    HairRule()
                }
            }
        }
    }
}

/** The composer's doorway. Tapping it lands on Capture with the cursor already in the line. */
@Composable
private fun CaptureLead(onOpenCapture: (String) -> Unit, modifier: Modifier = Modifier) {
    BlueprintBox(modifier = modifier, accent = true, tinted = true) {
        Text(
            text = "Log anything — AIIMIN sorts it. 'paid 240 metro, felt sharp 8/10'",
            style = AiiminTheme.type.body.copy(fontSize = 15.sp),
            color = AiiminTheme.colors.muted,
        )
        Row(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s4),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                text = "ENTER TO PARSE · AI READS IT",
                style = AiiminTheme.type.cellLabel,
                color = AiiminTheme.colors.muted,
            )
            TapSurface(
                onClick = { onOpenCapture("") },
                minTouchTarget = false,
                modifier = Modifier.background(AiiminTheme.colors.accent),
            ) {
                Text(
                    text = "LOG →",
                    style = AiiminTheme.type.chrome,
                    color = AiiminTheme.colors.onAccent,
                    modifier = Modifier.padding(horizontal = AiiminTheme.space.s4, vertical = 10.dp),
                )
            }
        }
    }
}

/** One line. The single move that makes today count — and it is the user's line, not ours. */
@Composable
private fun MicroTask(text: String, onChange: (String) -> Unit) {
    Row(
        Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s2)
            .border(Hairline, AiiminTheme.colors.hair)
            .padding(horizontal = AiiminTheme.space.s3, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
    ) {
        Text(
            text = "ONE SMALL THING",
            style = AiiminTheme.type.cellLabel,
            color = AiiminTheme.colors.muted,
        )
        Box(Modifier.weight(1f)) {
            if (text.isEmpty()) {
                Text(
                    text = "the single move that makes today count",
                    style = AiiminTheme.type.bodySmall,
                    color = AiiminTheme.colors.muted,
                )
            }
            BasicTextField(
                value = text,
                onValueChange = onChange,
                singleLine = true,
                textStyle = AiiminTheme.type.bodySmall.copy(color = AiiminTheme.colors.text),
                cursorBrush = SolidColor(AiiminTheme.colors.accent),
                modifier = Modifier.fillMaxWidth(),
            )
        }
    }
}

/**
 * A breached floor. One line, one fact, no verdict — and the score is untouched,
 * because a floor is what your body needs, not something you promised.
 */
@Composable
private fun FloorWarning(entry: DayEntry) {
    val value = entry.observation.value ?: return
    Row(
        Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s3)
            .border(Hairline, AiiminTheme.colors.danger)
            .padding(AiiminTheme.space.s3),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
    ) {
        Box(
            Modifier
                .size(7.dp)
                .background(AiiminTheme.colors.danger),
        )
        Text(
            text = "${format(value)} · floor ${format(entry.commitment.target)} ${entry.commitment.unit}",
            style = AiiminTheme.type.mono(11.5),
            color = AiiminTheme.colors.text,
            modifier = Modifier.weight(1f),
        )
        Text(
            text = entry.commitment.reason.uppercase(),
            style = AiiminTheme.type.cellLabel,
            color = AiiminTheme.colors.muted,
        )
    }
}

@Composable
private fun TodayScore(state: DayState, onOpenScore: () -> Unit) {
    val score = state.score
    TapSurface(
        onClick = onOpenScore,
        minTouchTarget = false,
        modifier = Modifier.fillMaxWidth(),
    ) {
        Column(Modifier.padding(top = AiiminTheme.space.s3)) {
            ScoreFigure(state = score.state, band = score.band, confidence = score.confidence)

            TrajectoryLine(series = state.history, modifier = Modifier.padding(top = AiiminTheme.space.s2))
            Text(
                text = trajectoryLabel(score.trajectory.direction, state.history.size),
                style = AiiminTheme.type.mono(10.5),
                color = AiiminTheme.colors.muted,
            )

            Row(
                Modifier
                    .fillMaxWidth()
                    .padding(top = AiiminTheme.space.s4),
                horizontalArrangement = Arrangement.SpaceBetween,
            ) {
                score.readings.forEach { reading ->
                    InstrumentCell(
                        label = reading.instrument.label,
                        value = reading.score,
                        covered = reading.covered,
                    )
                }
            }

            if (score.attribution.isNotEmpty()) {
                Text(
                    text = score.attribution.joinToString("  ·  ") { attribution ->
                        val sign = if (attribution.delta >= 0) "+" else "−"
                        "${attribution.instrument.label} $sign${kotlin.math.abs(attribution.delta).roundToInt()}"
                    },
                    style = AiiminTheme.type.mono(10.5),
                    color = AiiminTheme.colors.accent,
                    modifier = Modifier.padding(top = AiiminTheme.space.s3),
                )
            }

            Text(
                text = "TAP · MARK THE DAY",
                style = AiiminTheme.type.cellLabel,
                color = AiiminTheme.colors.accent,
                modifier = Modifier.padding(top = AiiminTheme.space.s3),
            )
        }
    }
}

/**
 * A minimum, drawn without a streak anywhere near it.
 *
 * The right-hand figure is **Hold** — how well this is being held, with memory.
 * A missed day moves it a little; ten good days are still visible underneath.
 */
@Composable
private fun MinimumRow(entry: DayEntry, onToggle: (Long) -> Unit) {
    val done = (entry.attainment ?: 0.0) >= 0.999
    val tickable = entry.commitment.shape == CommitmentShape.SHOW_UP
    Column {
        TapSurface(
            onClick = { onToggle(entry.commitment.id) },
            enabled = tickable,
            modifier = Modifier.fillMaxWidth(),
        ) {
            Row(
                Modifier
                    .fillMaxWidth()
                    .padding(vertical = 10.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
            ) {
                // A box you can tap, or a gauge you cannot. The mark must not
                // promise an interaction the row does not have.
                if (tickable) {
                    Box(
                        Modifier
                            .size(12.dp)
                            .background(if (done) AiiminTheme.colors.accent else AiiminTheme.colors.bg)
                            .border(Hairline, if (done) AiiminTheme.colors.accent else AiiminTheme.colors.rule),
                    )
                } else {
                    ProgressMark(entry.attainment)
                }
                Text(
                    text = entry.commitment.label,
                    style = AiiminTheme.type.body,
                    color = if (done) AiiminTheme.colors.muted else AiiminTheme.colors.text,
                    modifier = Modifier.weight(1f),
                )
                Text(
                    text = attainmentLabel(entry),
                    style = AiiminTheme.type.mono(11.0),
                    color = AiiminTheme.colors.muted,
                )
            }
        }
        HairRule()
    }
}

/** A quantity's fill, drawn as a short rule rather than a box. */
@Composable
private fun ProgressMark(attainment: Double?) {
    val filled = ((attainment ?: 0.0).coerceIn(0.0, 1.0)).toFloat()
    Box(
        Modifier
            .size(width = 12.dp, height = 12.dp)
            .border(Hairline, AiiminTheme.colors.rule),
        contentAlignment = Alignment.BottomStart,
    ) {
        Box(
            Modifier
                .fillMaxWidth()
                .fillMaxHeight(filled)
                .background(AiiminTheme.colors.accent),
        )
    }
}

private fun attainmentLabel(entry: DayEntry): String {
    val attainment = entry.attainment ?: return "—"
    val hold = entry.hold
    val percent = (attainment.coerceAtMost(1.0) * 100).roundToInt()
    return if (hold.observedDays == 0) "$percent%" else "$percent% · HOLD ${(hold.value * 100).roundToInt()}"
}

private fun minimumsLabel(state: DayState): String {
    val entries = state.pursuits
    val held = entries.count { (it.attainment ?: 0.0) >= 0.9 }
    return "$held OF ${entries.size}"
}

private fun trajectoryLabel(direction: Direction, days: Int): String = when {
    days < 7 -> "28 DAYS · NOT ENOUGH YET"
    direction == Direction.RISING -> "28 DAYS · RISING"
    direction == Direction.SLIPPING -> "28 DAYS · SLIPPING"
    else -> "28 DAYS · HOLDING"
}

private fun format(value: Double): String =
    if (value >= 1000) "%,d".format(value.roundToInt()) else value.toString().removeSuffix(".0")

@Preview(showBackground = true, backgroundColor = 0xFF15171A, heightDp = 1100)
@Composable
private fun TodayPreview() {
    AiiminTheme {
        TodayScreen(
            state = DayState.seed(),
            onOpenCapture = {},
            onToggle = {},
            onMicroTaskChange = {},
        )
    }
}
