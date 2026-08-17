package aiimin.feature.score

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import aiimin.core.data.PublishedDimension
import aiimin.core.data.PublishedLifeScoreState
import aiimin.core.data.RailMark
import aiimin.core.data.ScoreMover
import aiimin.core.data.ScoreState
import aiimin.designsystem.component.BlueprintBox
import aiimin.designsystem.component.HairRule
import aiimin.designsystem.component.InstrumentCell
import aiimin.designsystem.component.PrimaryButton
import aiimin.designsystem.component.ScreenHead
import aiimin.designsystem.component.SectionRule
import aiimin.designsystem.component.TapSurface
import aiimin.designsystem.component.Text
import aiimin.designsystem.theme.AiiminTheme
import aiimin.designsystem.theme.Hairline
import kotlin.math.roundToInt

@Composable
fun ScoreRoute(
    modifier: Modifier = Modifier,
    viewModel: ScoreViewModel = hiltViewModel(),
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    ScoreScreen(
        state = state,
        onBumpRail = viewModel::onBumpRail,
        onSetRung = viewModel::onSetRung,
        onSettle = viewModel::onSettle,
        onDismissNotice = viewModel::onDismissNotice,
        modifier = modifier,
    )
}

/**
 * **One job: mark and settle the day.**
 *
 * Provisional figure (Rail + Ladder + minimums) · attribution · Settle.
 * Engine state shown as honesty meta — not a second competing headline.
 */
@Composable
fun ScoreScreen(
    state: ScoreUiState,
    onBumpRail: (Int) -> Unit,
    onSetRung: (Int) -> Unit,
    onSettle: () -> Unit,
    onDismissNotice: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = AiiminTheme.space.page)
            .padding(bottom = AiiminTheme.space.s8 + AiiminTheme.space.s6),
    ) {
        ScreenHead(
            title = "Live score",
            meta = if (state.marks.settled) "SETTLED" else "PROVISIONAL",
        )

        state.marks.notice?.let { notice ->
            LaunchedEffect(notice.message) {
                kotlinx.coroutines.delay(3_800)
                onDismissNotice()
            }
            Text(
                text = notice.message,
                style = AiiminTheme.type.bodySmall,
                color = AiiminTheme.colors.accent,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = AiiminTheme.space.s3)
                    .border(Hairline, AiiminTheme.colors.accent)
                    .padding(AiiminTheme.space.s3),
            )
        }

        if (state.published.available) {
            PublishedServerBlock(state.published)
        }

        ProvisionalFigure(state)

        SectionRule(
            label = "Mechanism 01 · The rail",
            value = "TAP TO SET",
            valueColor = AiiminTheme.colors.accent,
        )
        Text(
            text = "Tap anywhere on a rail to mark that area. Snaps to fives, so a mark is always a decision, never a wobble.",
            style = AiiminTheme.type.bodySmall.copy(fontSize = 11.5.sp, lineHeight = 17.sp),
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = 5.dp),
        )
        Column(
            Modifier.padding(top = AiiminTheme.space.s4),
            verticalArrangement = Arrangement.spacedBy(AiiminTheme.space.s4),
        ) {
            state.marks.rails.forEachIndexed { i, rail ->
                RailRow(rail, onBump = { onBumpRail(i) })
            }
        }

        SectionRule(
            label = "Mechanism 02 · The ladder",
            value = "ONE TAP",
            valueColor = AiiminTheme.colors.accent,
        )
        Text(
            text = "Five rungs, one tap, done in a second at the door. For the nights you will not drag anything.",
            style = AiiminTheme.type.bodySmall.copy(fontSize = 11.5.sp, lineHeight = 17.sp),
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = 5.dp),
        )
        Text(
            text = "How did today go?",
            style = AiiminTheme.type.body.copy(fontSize = 12.sp),
            modifier = Modifier.padding(top = AiiminTheme.space.s4, bottom = AiiminTheme.space.s2),
        )
        Ladder(rung = state.marks.rung, onSet = onSetRung)

        SectionRule(
            label = "What moved the number",
        )
        Movers(state.movers)

        PrimaryButton(
            label = if (state.marks.settled) "Settled · ${state.live}" else "Settle the day",
            onClick = onSettle,
            enabled = !state.marks.settled,
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s6),
        )
    }
}

@Composable
private fun PublishedServerBlock(published: PublishedLifeScoreState) {
    BlueprintBox(
        accent = true,
        tinted = true,
        legend = "Published · server",
        modifier = Modifier.padding(top = AiiminTheme.space.s6),
    ) {
        Row(
            Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.Bottom,
        ) {
            Text(
                text = published.global.toString(),
                style = AiiminTheme.type.mono.copy(
                    fontSize = 48.sp,
                    fontWeight = FontWeight.Bold,
                    lineHeight = 44.sp,
                    letterSpacing = (-1).sp,
                ),
            )
            Text(
                text = published.sourceLabel,
                style = AiiminTheme.type.mono(10.5),
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(bottom = 6.dp),
            )
        }
        if (published.dimensions.isNotEmpty()) {
            Row(
                Modifier
                    .fillMaxWidth()
                    .padding(top = AiiminTheme.space.s3),
                horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2),
            ) {
                published.dimensions.forEach { dim: PublishedDimension ->
                    InstrumentCell(
                        label = dim.label,
                        value = dim.score.toDouble(),
                        covered = true,
                        modifier = Modifier.weight(1f),
                    )
                }
            }
        }
        Text(
            text = "Server figure — rails below are provisional local marks.",
            style = AiiminTheme.type.bodySmall.copy(fontSize = 11.sp, lineHeight = 16.sp),
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = AiiminTheme.space.s3),
        )
    }
}

@Composable
private fun ProvisionalFigure(state: ScoreUiState) {
    val target = state.live.toFloat()
    val reduceMotion = AiiminTheme.reduceMotion
    val shown by animateFloatAsState(
        targetValue = target,
        animationSpec = tween(durationMillis = if (reduceMotion) 0 else 520),
        label = "live-score",
    )
    BlueprintBox(
        accent = false,
        modifier = Modifier.padding(top = AiiminTheme.space.s6),
    ) {
        Row(
            Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.Bottom,
        ) {
            Text(
                text = shown.roundToInt().toString(),
                style = AiiminTheme.type.mono.copy(
                    fontSize = 72.sp,
                    fontWeight = FontWeight.Bold,
                    lineHeight = 62.sp,
                    letterSpacing = (-1.5).sp,
                ),
            )
            Text(
                text = state.delta,
                style = AiiminTheme.type.mono(15.0, FontWeight.Medium),
                color = AiiminTheme.colors.accent,
                modifier = Modifier.padding(start = AiiminTheme.space.s3, bottom = 10.dp),
            )
        }
        Text(
            text = if (state.marks.settled) {
                "Locked for today · local mark"
            } else {
                "Settles at 23:59 · marks still open"
            },
            style = AiiminTheme.type.body.copy(fontSize = 11.sp),
            color = AiiminTheme.colors.muted,
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s2),
        )
        Text(
            text = "Engine ${state.engineState.roundToInt()} ±${state.engineBand.roundToInt()} · pursuits",
            style = AiiminTheme.type.mono(9.5),
            color = AiiminTheme.colors.muted,
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 4.dp),
        )
    }
}

@Composable
private fun RailRow(rail: RailMark, onBump: () -> Unit) {
    val reduceMotion = AiiminTheme.reduceMotion
    val pct by animateFloatAsState(
        targetValue = rail.pct,
        animationSpec = tween(if (reduceMotion) 0 else 240),
        label = "rail-${rail.label}",
    )
    Column {
        Row(
            Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            Text(text = rail.label, style = AiiminTheme.type.body.copy(fontSize = 12.sp))
            Text(
                text = rail.value.toString(),
                style = AiiminTheme.type.mono(12.0),
                color = AiiminTheme.colors.accent,
            )
        }
        TapSurface(
            onClick = onBump,
            minTouchTarget = false,
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 6.dp)
                .height(24.dp)
                .border(Hairline, AiiminTheme.colors.hair),
        ) {
            BoxWithConstraints(Modifier.fillMaxSize()) {
                Box(
                    Modifier
                        .fillMaxHeight()
                        .fillMaxWidth(pct)
                        .background(AiiminTheme.colors.tint),
                )
                Box(
                    Modifier
                        .offset(x = (maxWidth * pct) - 4.dp, y = (-4).dp)
                        .width(9.dp)
                        .height(32.dp)
                        .background(AiiminTheme.colors.accent),
                )
            }
        }
    }
}

@Composable
private fun Ladder(rung: Int, onSet: (Int) -> Unit) {
    Row(
        Modifier
            .fillMaxWidth()
            .height(82.dp),
        horizontalArrangement = Arrangement.spacedBy(6.dp),
        verticalAlignment = Alignment.Bottom,
    ) {
        (1..5).forEach { n ->
            val on = n == rung
            val h = (18 + n * 9).dp
            TapSurface(
                onClick = { onSet(n) },
                minTouchTarget = false,
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight(),
            ) {
                Column(
                    Modifier.fillMaxSize(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Bottom,
                ) {
                    Box(
                        Modifier
                            .fillMaxWidth()
                            .height(h)
                            .background(
                                if (on) AiiminTheme.colors.accent else AiiminTheme.colors.hair,
                            ),
                    )
                    Text(
                        text = n.toString(),
                        style = AiiminTheme.type.mono(10.0, FontWeight.Medium),
                        color = if (on) AiiminTheme.colors.accent else AiiminTheme.colors.muted,
                        modifier = Modifier.padding(top = 5.dp),
                    )
                }
            }
        }
    }
    Row(
        Modifier
            .fillMaxWidth()
            .padding(top = 6.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
    ) {
        Text(text = "ROUGH", style = AiiminTheme.type.mono(9.5), color = AiiminTheme.colors.muted)
        Text(text = "STRONG", style = AiiminTheme.type.mono(9.5), color = AiiminTheme.colors.muted)
    }
}

@Composable
private fun Movers(movers: List<ScoreMover>) {
    Column(Modifier.padding(top = AiiminTheme.space.s2)) {
        movers.forEachIndexed { i, m ->
            Row(
                Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
            ) {
                Text(text = m.label, style = AiiminTheme.type.body)
                Text(
                    text = m.value,
                    style = AiiminTheme.type.mono(12.5, FontWeight.Medium),
                    color = if (m.accent) AiiminTheme.colors.accent else AiiminTheme.colors.muted,
                )
            }
            if (i < movers.lastIndex) HairRule()
        }
    }
}

@Preview(showBackground = true, backgroundColor = 0xFF15171A, widthDp = 390, heightDp = 900)
@Composable
private fun ScorePreview() {
    AiiminTheme {
        ScoreScreen(
            state = ScoreUiState(
                marks = ScoreState.seed(),
                minsDone = 3,
                minsTotal = 4,
                engineState = 0.0,
                engineBand = 12.0,
                engineConfidence = 0.0,
            ),
            onBumpRail = {},
            onSetRung = {},
            onSettle = {},
            onDismissNotice = {},
        )
    }
}
