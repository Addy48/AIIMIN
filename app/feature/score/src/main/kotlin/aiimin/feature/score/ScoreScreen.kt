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
            title = "Life score",
            meta = state.confidenceLabel.uppercase(),
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

        PublishedScoreFigure(state.published)

        SectionRule(
            label = "How this number is made",
            value = "SERVER MODEL",
            valueColor = AiiminTheme.colors.accent,
        )
        Text(
            text = "The server combines your observed BODY, MIND, DISCIPLINE, MONEY, and MOOD signals. Missing data narrows confidence; it never becomes a zero.",
            style = AiiminTheme.type.bodySmall.copy(fontSize = 11.5.sp, lineHeight = 17.sp),
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = 5.dp),
        )
        CanonicalDimensions(state.published)

        SectionRule(
            label = "Daily reflection",
            value = "ONE TAP",
            valueColor = AiiminTheme.colors.accent,
        )
        Text(
            text = "This reflection is saved as an input for the next server calculation. It does not directly change the score.",
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

        PrimaryButton(
            label = if (state.marks.settled) "Reflection saved" else "Save reflection",
            onClick = onSettle,
            enabled = !state.marks.settled,
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s6),
        )
    }
}

@Composable
private fun PublishedScoreFigure(published: PublishedLifeScoreState) {
    BlueprintBox(
        accent = true,
        tinted = true,
        legend = if (published.available) published.sourceLabel else "Awaiting server sync",
        modifier = Modifier.padding(top = AiiminTheme.space.s6),
    ) {
        Row(
            Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.Bottom,
        ) {
            Text(
                text = published.global?.toString() ?: "—",
                style = AiiminTheme.type.mono.copy(
                    fontSize = 72.sp,
                    fontWeight = FontWeight.Bold,
                    lineHeight = 62.sp,
                    letterSpacing = (-1.5).sp,
                ),
            )
            Text(
                text = published.confidenceLabel?.uppercase() ?: "UNAVAILABLE",
                style = AiiminTheme.type.mono(10.5, FontWeight.Medium),
                color = AiiminTheme.colors.accent,
                modifier = Modifier.padding(bottom = 8.dp),
            )
        }
        if (published.available) {
            val coverageText = published.coverage?.let { "${(it * 100).roundToInt()}% observed" } ?: "coverage unavailable"
            val bandText = published.uncertaintyBand?.let { " · uncertainty ±$it" } ?: ""
            Text(
                text = "$coverageText$bandText · ${published.trendDirection ?: "trend unknown"}",
                style = AiiminTheme.type.mono(9.5),
                color = AiiminTheme.colors.muted,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = AiiminTheme.space.s2),
            )
            Text(
                text = "${published.calculationVersion ?: "server model"} · ${published.daysWithData ?: 0} observed days",
                style = AiiminTheme.type.mono(9.5),
                color = AiiminTheme.colors.muted,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 4.dp),
            )
        } else {
            Text(
                text = "The score appears after authenticated sync. This screen never invents a local replacement number.",
                style = AiiminTheme.type.bodySmall.copy(fontSize = 11.sp, lineHeight = 16.sp),
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = AiiminTheme.space.s3),
            )
        }
    }
}

@Composable
private fun CanonicalDimensions(published: PublishedLifeScoreState) {
    if (published.dimensions.isEmpty()) return
    Row(
        Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s3),
        horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2),
    ) {
        published.dimensions.forEach { dim: PublishedDimension ->
            InstrumentCell(
                label = dim.label,
                value = dim.score?.toDouble() ?: 0.0,
                covered = dim.score != null,
                modifier = Modifier.weight(1f),
            )
        }
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
