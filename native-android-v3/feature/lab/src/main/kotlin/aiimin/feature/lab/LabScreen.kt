package aiimin.feature.lab

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import aiimin.core.data.CorrelationPair
import aiimin.core.data.LabState
import aiimin.designsystem.component.BlueprintBox
import aiimin.designsystem.component.HairRule
import aiimin.designsystem.component.ScreenHead
import aiimin.designsystem.component.SectionRule
import aiimin.designsystem.component.TapSurface
import aiimin.designsystem.component.Text
import aiimin.designsystem.theme.AiiminTheme
import aiimin.designsystem.theme.Hairline
import kotlin.math.max
import kotlin.math.min

@Composable
fun LabRoute(
    modifier: Modifier = Modifier,
    viewModel: LabViewModel = hiltViewModel(),
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    LabScreen(
        state = state,
        onSelect = viewModel::onSelect,
        modifier = modifier,
    )
}

/**
 * **One job: ask, review, act on patterns.**
 *
 * Selected pair · scatter · survivors (q under 0.10) · rejected note.
 * Seed only — live Spearman / BH correction with the lab API.
 */
@Composable
fun LabScreen(
    state: LabState,
    onSelect: (Int) -> Unit,
    modifier: Modifier = Modifier,
) {
    val pair = state.selected
    Column(
        modifier
            .fillMaxSize()
            .background(AiiminTheme.colors.bg)
            .verticalScroll(rememberScrollState())
            .padding(horizontal = AiiminTheme.space.page)
            .padding(bottom = AiiminTheme.space.s8),
    ) {
        ScreenHead(title = "The Lab · Correlations", meta = state.headMeta)

        Text(
            text = "Spearman rank correlation across your logged signals, corrected for " +
                "multiple comparisons (Benjamini–Hochberg, FDR 0.10). Only survivors are shown.",
            style = AiiminTheme.type.body.copy(fontSize = 12.sp, lineHeight = 18.sp),
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = AiiminTheme.space.s3),
        )

        SelectedPairCard(pair)

        Text(
            text = pair.plain,
            style = AiiminTheme.type.bodySmall.copy(fontSize = 12.sp, lineHeight = 18.sp),
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = AiiminTheme.space.s3),
        )

        SectionRule(label = "Scatter")
        ScatterPlot(
            rhoLabel = pair.rho,
            rho = pair.rhoValue,
            xLabel = pair.full.substringBefore("→").trim().uppercase(),
            yLabel = pair.full.substringAfter("→").trim().uppercase(),
            modifier = Modifier.padding(top = AiiminTheme.space.s3),
        )

        SectionRule(label = "All survivors · q < 0.10")
        SurvivorsHeader()
        state.pairs.forEachIndexed { i, p ->
            SurvivorRow(
                pair = p,
                selected = i == state.selectedIndex,
                onClick = { onSelect(i) },
            )
            HairRule()
        }

        Column(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s4)
                .border(Hairline, AiiminTheme.colors.rule)
                .padding(AiiminTheme.space.s3),
        ) {
            Text(
                text = "REJECTED BY CORRECTION · ${state.rejectedCount} PAIRS",
                style = AiiminTheme.type.cellLabel,
                color = AiiminTheme.colors.muted,
            )
            Text(
                text = "${state.rejectedCount} pairs looked significant before correction and did not survive. " +
                    "AIIMIN does not show you those.",
                style = AiiminTheme.type.bodySmall.copy(fontSize = 11.5.sp, lineHeight = 17.sp),
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = 4.dp),
            )
        }
    }
}

@Composable
private fun SelectedPairCard(pair: CorrelationPair) {
    BlueprintBox(
        accent = true,
        tinted = true,
        modifier = Modifier.padding(top = AiiminTheme.space.s6),
    ) {
        Text(
            text = "SELECTED PAIR",
            style = AiiminTheme.type.cellLabel,
            color = AiiminTheme.colors.accent,
        )
        Text(
            text = pair.full,
            style = AiiminTheme.type.body.copy(fontSize = 16.sp, lineHeight = 22.sp),
            modifier = Modifier.padding(top = AiiminTheme.space.s2),
        )
        Row(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s3),
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s6),
        ) {
            Stat("ρ", pair.rho, accent = true)
            Stat("q-VALUE", pair.q, accent = false)
            Stat("n", pair.n.toString(), accent = false)
        }
    }
}

@Composable
private fun Stat(label: String, value: String, accent: Boolean) {
    Column {
        Text(
            text = label,
            style = AiiminTheme.type.chrome.copy(
                fontSize = 9.5.sp,
                fontWeight = FontWeight.Normal,
                letterSpacing = 1.2.sp,
            ),
            color = AiiminTheme.colors.muted,
        )
        Text(
            text = value,
            style = AiiminTheme.type.mono(22.0, FontWeight.Bold),
            color = if (accent) AiiminTheme.colors.accent else AiiminTheme.colors.text,
            modifier = Modifier.padding(top = 2.dp),
        )
    }
}

/** Deterministic Drafting Table scatter — jitter seed matches the web proto. */
private val SCATTER_SEED = floatArrayOf(
    0.42f, -0.55f, 0.18f, 0.63f, -0.28f, 0.35f, -0.6f, 0.22f, 0.5f, -0.4f, 0.12f, -0.18f, 0.3f,
)

@Composable
private fun ScatterPlot(
    rhoLabel: String,
    rho: Float,
    xLabel: String,
    yLabel: String,
    modifier: Modifier = Modifier,
) {
    val hair = AiiminTheme.colors.hair
    val rule = AiiminTheme.colors.rule
    val accent = AiiminTheme.colors.accent
    val muted = AiiminTheme.colors.muted
    val negative = rho < 0f

    Column(
        modifier
            .fillMaxWidth()
            .border(Hairline, hair),
    ) {
        Canvas(
            Modifier
                .fillMaxWidth()
                .height(150.dp)
                .padding(horizontal = 4.dp, vertical = 4.dp),
        ) {
            val L = 34.dp.toPx()
            val R = size.width - 8.dp.toPx()
            val T = 12.dp.toPx()
            val B = size.height - 18.dp.toPx()
            val w = R - L
            val h = B - T
            val n = SCATTER_SEED.size

            listOf(0.25f, 0.5f, 0.75f).forEach { g ->
                drawLine(hair.copy(alpha = 0.5f), Offset(L, T + h * g), Offset(R, T + h * g), 1f)
            }
            listOf(0.33f, 0.66f).forEach { g ->
                drawLine(hair.copy(alpha = 0.5f), Offset(L + w * g, T), Offset(L + w * g, B), 1f)
            }
            drawLine(rule, Offset(L, T), Offset(L, B), 1f)
            drawLine(rule, Offset(L, B), Offset(R, B), 1f)

            val y0 = if (negative) T + 8f else B - 8f
            val y1 = if (negative) B - 8f else T + 8f
            drawLine(
                color = accent,
                start = Offset(L, y0),
                end = Offset(R, y1),
                strokeWidth = 1.5f,
                pathEffect = PathEffect.dashPathEffect(floatArrayOf(4f, 3f)),
                cap = StrokeCap.Round,
            )

            SCATTER_SEED.forEachIndexed { i, jit ->
                val t = i / (n - 1).toFloat()
                val x = L + t * w
                val trendY = y0 + (y1 - y0) * t
                val y = max(T + 4f, min(B - 4f, trendY + jit * (h * 0.22f)))
                val last = i == n - 1
                drawCircle(
                    color = if (last) accent else muted,
                    radius = if (last) 3.5f else 3f,
                    center = Offset(x, y),
                )
            }
        }
        Row(
            Modifier
                .fillMaxWidth()
                .padding(start = 34.dp, end = 8.dp, bottom = 6.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                text = "$xLabel →",
                style = AiiminTheme.type.chrome.copy(fontSize = 8.5.sp, letterSpacing = 1.sp),
                color = AiiminTheme.colors.muted,
            )
            Text(
                text = "ρ $rhoLabel",
                style = AiiminTheme.type.mono(10.0),
                color = AiiminTheme.colors.accent,
            )
            Text(
                text = "↑ $yLabel",
                style = AiiminTheme.type.chrome.copy(fontSize = 8.5.sp, letterSpacing = 1.sp),
                color = AiiminTheme.colors.muted,
            )
        }
    }
}

@Composable
private fun SurvivorsHeader() {
    Row(
        Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s2, bottom = 6.dp),
    ) {
        Text(
            text = "PAIR",
            style = AiiminTheme.type.chrome.copy(fontSize = 9.5.sp, letterSpacing = 1.2.sp),
            color = AiiminTheme.colors.muted,
            modifier = Modifier.weight(1f),
        )
        Text(
            text = "ρ",
            style = AiiminTheme.type.chrome.copy(fontSize = 9.5.sp, letterSpacing = 1.2.sp),
            color = AiiminTheme.colors.muted,
            textAlign = TextAlign.End,
            modifier = Modifier.padding(end = AiiminTheme.space.s2).weight(0.22f),
        )
        Text(
            text = "q",
            style = AiiminTheme.type.chrome.copy(fontSize = 9.5.sp, letterSpacing = 1.2.sp),
            color = AiiminTheme.colors.muted,
            textAlign = TextAlign.End,
            modifier = Modifier.weight(0.22f),
        )
    }
    HairRule()
}

@Composable
private fun SurvivorRow(
    pair: CorrelationPair,
    selected: Boolean,
    onClick: () -> Unit,
) {
    TapSurface(
        onClick = onClick,
        minTouchTarget = false,
        modifier = Modifier
            .fillMaxWidth()
            .background(if (selected) AiiminTheme.colors.tint else AiiminTheme.colors.bg),
    ) {
        Row(
            Modifier
                .fillMaxWidth()
                .padding(vertical = 9.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                text = pair.label,
                style = AiiminTheme.type.body.copy(fontSize = 12.5.sp),
                modifier = Modifier.weight(1f),
            )
            Text(
                text = pair.rho,
                style = AiiminTheme.type.mono(12.0, FontWeight.Medium),
                color = AiiminTheme.colors.accent,
                textAlign = TextAlign.End,
                modifier = Modifier.padding(end = AiiminTheme.space.s2).weight(0.22f),
            )
            Text(
                text = pair.q,
                style = AiiminTheme.type.mono(12.0),
                color = AiiminTheme.colors.muted,
                textAlign = TextAlign.End,
                modifier = Modifier.weight(0.22f),
            )
        }
    }
}

@Preview(showBackground = true, backgroundColor = 0xFF15171A, widthDp = 390, heightDp = 980)
@Composable
private fun LabPreview() {
    AiiminTheme {
        LabScreen(state = LabState.seed(), onSelect = {})
    }
}
