package aiimin.feature.lab

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
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
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import aiimin.core.data.CorrelationPair
import aiimin.core.data.LabState
import aiimin.core.model.TierCatalog
import aiimin.core.model.TierFeature
import aiimin.designsystem.component.BlueprintBox
import aiimin.designsystem.component.ChartReadout
import aiimin.designsystem.component.HairRule
import aiimin.designsystem.component.ScreenHead
import aiimin.designsystem.component.SectionRule
import aiimin.designsystem.component.TapSurface
import aiimin.designsystem.component.Text
import aiimin.designsystem.component.TierGateWall
import aiimin.designsystem.component.correlationSense
import aiimin.designsystem.component.correlationStrength
import aiimin.designsystem.theme.AiiminTheme
import aiimin.designsystem.theme.Hairline
import kotlin.math.abs
import kotlin.math.roundToInt

@Composable
fun LabRoute(
    onUpgradePlan: () -> Unit = {},
    onNotNow: () -> Unit = {},
    onOpenEnglish: () -> Unit = {},
    modifier: Modifier = Modifier,
    viewModel: LabViewModel = hiltViewModel(),
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val tier by viewModel.tier.collectAsStateWithLifecycle()
    if (!TierCatalog.can(tier, TierFeature.LAB_FULL)) {
        Box(modifier.fillMaxSize()) {
            TierGateWall(
                feature = TierFeature.LAB_FULL,
                current = tier,
                onOpenPlans = onUpgradePlan,
                onNotNow = onNotNow,
            )
        }
        return
    }
    LabScreen(
        state = state,
        onSelect = viewModel::onSelect,
        onOpenEnglish = onOpenEnglish,
        modifier = modifier,
    )
}

/**
 * **One job: ask, review, act on patterns.**
 *
 * English Spark entry · correlation survivors · scatter. Phone OS lives on Day.
 */
@Composable
fun LabScreen(
    state: LabState,
    onSelect: (Int) -> Unit,
    onOpenEnglish: () -> Unit = {},
    modifier: Modifier = Modifier,
) {
    val pair = state.selected
    val rho = pair?.rhoValue ?: 0f
    val strength = correlationStrength(rho)
    val sense = correlationSense(rho)

    Column(
        modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = AiiminTheme.space.page)
            .padding(bottom = AiiminTheme.space.s8 + AiiminTheme.space.s6),
    ) {
        ScreenHead(title = "The Lab · Patterns", meta = state.headMeta)

        SectionRule(label = "English · Spark", value = "60s")
        TapSurface(
            onClick = onOpenEnglish,
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s3),
        ) {
            BlueprintBox(accent = true, tinted = true) {
                Text(
                    text = "SPEAKING DRILL",
                    style = AiiminTheme.type.cellLabel,
                    color = AiiminTheme.colors.accent,
                )
                Text(
                    text = "Native 60s Spark · self-score · streak syncs to the Lab API. No browser hop.",
                    style = AiiminTheme.type.bodySmall,
                    color = AiiminTheme.colors.text,
                    modifier = Modifier.padding(top = AiiminTheme.space.s2),
                )
                Text(
                    text = "TAP · OPEN ENGLISH",
                    style = AiiminTheme.type.cellLabel,
                    color = AiiminTheme.colors.accent,
                    modifier = Modifier.padding(top = AiiminTheme.space.s3),
                )
            }
        }

        if (state.isSeed) {
            Text(
                text = "Demo correlations — not computed from your live graph yet.",
                style = AiiminTheme.type.bodySmall.copy(fontSize = 12.sp, lineHeight = 18.sp),
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = AiiminTheme.space.s2),
            )
        }


        SectionRule(label = "Correlations · survivors")
        Text(
            text = "Each row survived multiple-comparison correction " +
                "(Benjamini–Hochberg, FDR 0.10). Tap a survivor to open its plot.",
            style = AiiminTheme.type.body.copy(fontSize = 12.sp, lineHeight = 18.sp),
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = AiiminTheme.space.s2),
        )

        if (pair != null) {
            SelectedPairCard(pair, strength, sense)

            Text(
                text = pair.plain,
                style = AiiminTheme.type.bodySmall.copy(fontSize = 13.sp, lineHeight = 19.sp),
                color = AiiminTheme.colors.text,
                modifier = Modifier.padding(top = AiiminTheme.space.s3),
            )

            HowToRead(rho = rho, strength = strength, sense = sense, n = pair.n)

            SectionRule(label = "Scatter · one point per day")
            ScatterPlot(
                rhoLabel = pair.rho,
                rho = rho,
                xLabel = pair.full.substringBefore("→").trim(),
                yLabel = pair.full.substringAfter("→").trim(),
                n = pair.n,
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
        } else {
            BlueprintBox(
                accent = false,
                modifier = Modifier.padding(top = AiiminTheme.space.s3),
            ) {
                Text(
                    text = "ACCUMULATING SIGNAL",
                    style = AiiminTheme.type.cellLabel,
                    color = AiiminTheme.colors.muted,
                )
                Text(
                    text = "AIIMIN needs 7+ unique logged days to compute verified correlation survivors with Benjamini–Hochberg FDR 0.10.",
                    style = AiiminTheme.type.bodySmall,
                    color = AiiminTheme.colors.muted,
                    modifier = Modifier.padding(top = AiiminTheme.space.s2),
                )
            }
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

        val context = LocalContext.current
        SectionRule(label = "Reports", value = "WEB")
        TapSurface(
            onClick = {
                context.startActivity(
                    android.content.Intent(
                        android.content.Intent.ACTION_VIEW,
                        android.net.Uri.parse("https://aiimin.in/reports"),
                    ),
                )
            },
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s3),
        ) {
            BlueprintBox {
                Text(
                    text = "REPORTS · OPEN ON WEB",
                    style = AiiminTheme.type.cellLabel,
                    color = AiiminTheme.colors.accent,
                )
                Text(
                    text = "Snapshot, Life OS Review, Interactive, Deep live on the desk OS. Native PDF is later.",
                    style = AiiminTheme.type.bodySmall,
                    color = AiiminTheme.colors.muted,
                    modifier = Modifier.padding(top = AiiminTheme.space.s2),
                )
            }
        }
    }
}

@Composable
private fun SelectedPairCard(pair: CorrelationPair, strength: String, sense: String) {
    BlueprintBox(
        accent = true,
        tinted = true,
        modifier = Modifier.padding(top = AiiminTheme.space.s6),
    ) {
        Text(
            text = "SELECTED PAIR · $strength $sense",
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
            Stat("n DAYS", pair.n.toString(), accent = false)
        }
    }
}

@Composable
private fun HowToRead(rho: Float, strength: String, sense: String, n: Int) {
    val direction = if (rho < 0f) {
        "When the left signal rises, the right one tends to fall."
    } else {
        "When the left signal rises, the right one tends to rise with it."
    }
    Column(
        Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s4)
            .border(Hairline, AiiminTheme.colors.rule)
            .padding(AiiminTheme.space.s3),
    ) {
        Text(
            text = "HOW TO READ THIS",
            style = AiiminTheme.type.cellLabel,
            color = AiiminTheme.colors.accent,
        )
        Text(
            text = "ρ ${"%.2f".format(rho)} · $strength $sense across $n days. $direction " +
                "Dashed line = trend. Each dot = one logged day. Tap a dot for that day’s place on both axes.",
            style = AiiminTheme.type.bodySmall.copy(fontSize = 12.sp, lineHeight = 18.sp),
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = 4.dp),
        )
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

/** Deterministic cloud shaped by ρ — not decoration noise. */
private fun cloud(rho: Float, n: Int): List<Offset> {
    val count = n.coerceIn(8, 24)
    val noise = (1f - abs(rho)).coerceAtLeast(0.12f) * 0.35f
    return List(count) { i ->
        val t = i / (count - 1).toFloat()
        // Simple LCG so the cloud is stable across recompositions.
        val seed = (i * 1103515245 + 12345) and 0x7fffffff
        val u = (seed % 10_000) / 10_000f - 0.5f
        val x = t
        val y = (0.5f + rho * (t - 0.5f) + u * noise).coerceIn(0.05f, 0.95f)
        Offset(x, y)
    }
}

@Composable
private fun ScatterPlot(
    rhoLabel: String,
    rho: Float,
    xLabel: String,
    yLabel: String,
    n: Int,
    modifier: Modifier = Modifier,
) {
    val hair = AiiminTheme.colors.hair
    val rule = AiiminTheme.colors.rule
    val accent = AiiminTheme.colors.accent
    val muted = AiiminTheme.colors.muted
    val points = remember(rho, n) { cloud(rho, n) }
    var selected by remember(rho, n) { mutableIntStateOf(-1) }

    Column(
        modifier
            .fillMaxWidth()
            .border(Hairline, hair),
    ) {
        // Y-axis legend row
        Row(
            Modifier
                .fillMaxWidth()
                .padding(start = 8.dp, end = 8.dp, top = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            Text(
                text = "↑ ${yLabel.uppercase()}",
                style = AiiminTheme.type.chrome.copy(fontSize = 8.5.sp, letterSpacing = 0.8.sp),
                color = muted,
                modifier = Modifier.weight(1f),
            )
            Text(
                text = "HIGH",
                style = AiiminTheme.type.mono(8.0),
                color = muted,
            )
        }

        Canvas(
            Modifier
                .fillMaxWidth()
                .height(180.dp)
                .padding(horizontal = 8.dp, vertical = 4.dp)
                .pointerInput(points) {
                    detectTapGestures { pos ->
                        val L = 28.dp.toPx()
                        val R = size.width - 8.dp.toPx()
                        val T = 10.dp.toPx()
                        val B = size.height - 14.dp.toPx()
                        val w = R - L
                        val h = B - T
                        var best = -1
                        var bestDist = Float.MAX_VALUE
                        points.forEachIndexed { i, p ->
                            val cx = L + p.x * w
                            val cy = B - p.y * h
                            val d = (pos.x - cx) * (pos.x - cx) + (pos.y - cy) * (pos.y - cy)
                            if (d < bestDist) {
                                bestDist = d
                                best = i
                            }
                        }
                        val hitR = 28.dp.toPx()
                        selected = if (best >= 0 && bestDist < hitR * hitR) {
                            if (selected == best) -1 else best
                        } else {
                            -1
                        }
                    }
                },
        ) {
            val L = 28.dp.toPx()
            val R = size.width - 8.dp.toPx()
            val T = 10.dp.toPx()
            val B = size.height - 14.dp.toPx()
            val w = R - L
            val h = B - T

            listOf(0.25f, 0.5f, 0.75f).forEach { g ->
                drawLine(hair.copy(alpha = 0.45f), Offset(L, T + h * (1f - g)), Offset(R, T + h * (1f - g)), 1f)
            }
            listOf(0.25f, 0.5f, 0.75f).forEach { g ->
                drawLine(hair.copy(alpha = 0.45f), Offset(L + w * g, T), Offset(L + w * g, B), 1f)
            }
            drawLine(rule, Offset(L, T), Offset(L, B), 1.5f)
            drawLine(rule, Offset(L, B), Offset(R, B), 1.5f)

            // Trend line through the cloud mean slope ≈ ρ
            val y0 = B - (0.5f - rho * 0.5f) * h
            val y1 = B - (0.5f + rho * 0.5f) * h
            drawLine(
                color = accent,
                start = Offset(L, y0.coerceIn(T + 4f, B - 4f)),
                end = Offset(R, y1.coerceIn(T + 4f, B - 4f)),
                strokeWidth = 1.75f,
                pathEffect = PathEffect.dashPathEffect(floatArrayOf(5f, 4f)),
                cap = StrokeCap.Round,
            )

            points.forEachIndexed { i, p ->
                val cx = L + p.x * w
                val cy = B - p.y * h
                val on = i == selected
                if (on) {
                    drawCircle(accent.copy(alpha = 0.22f), radius = 10f, center = Offset(cx, cy))
                }
                drawCircle(
                    color = if (on) accent else muted,
                    radius = if (on) 4.5f else 3.2f,
                    center = Offset(cx, cy),
                )
            }
        }

        Row(
            Modifier
                .fillMaxWidth()
                .padding(start = 28.dp, end = 8.dp, bottom = 4.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            Text(text = "LOW", style = AiiminTheme.type.mono(8.0), color = muted)
            Text(text = "MID", style = AiiminTheme.type.mono(8.0), color = muted)
            Text(text = "HIGH →", style = AiiminTheme.type.mono(8.0), color = muted)
        }

        Row(
            Modifier
                .fillMaxWidth()
                .padding(start = 8.dp, end = 8.dp, bottom = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                text = xLabel.uppercase(),
                style = AiiminTheme.type.chrome.copy(fontSize = 8.5.sp, letterSpacing = 0.8.sp),
                color = muted,
                modifier = Modifier.weight(1f),
            )
            Text(
                text = "ρ $rhoLabel · trend",
                style = AiiminTheme.type.mono(10.0),
                color = accent,
            )
        }

        val pick = points.getOrNull(selected)
        if (pick != null) {
            val xPct = (pick.x * 100).roundToInt()
            val yPct = (pick.y * 100).roundToInt()
            ChartReadout(
                title = "Day ${selected + 1} of $n",
                detail = "${xLabel.lowercase()} ~$xPct% · ${yLabel.lowercase()} ~$yPct%",
                modifier = Modifier.padding(horizontal = 8.dp, vertical = 8.dp),
            )
        } else {
            Text(
                text = "TAP A DOT · SEE THAT DAY ON BOTH AXES",
                style = AiiminTheme.type.cellLabel,
                color = muted,
                modifier = Modifier.padding(start = 8.dp, end = 8.dp, bottom = 10.dp),
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
                .padding(vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Column(Modifier.weight(1f)) {
                Text(
                    text = pair.label,
                    style = AiiminTheme.type.body.copy(fontSize = 12.5.sp),
                )
                Text(
                    text = "${correlationStrength(pair.rhoValue)} ${correlationSense(pair.rhoValue)}",
                    style = AiiminTheme.type.cellLabel,
                    color = AiiminTheme.colors.muted,
                    modifier = Modifier.padding(top = 2.dp),
                )
            }
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

@Preview(showBackground = true, backgroundColor = 0xFF15171A, widthDp = 390, heightDp = 1100)
@Composable
private fun LabPreview() {
    AiiminTheme {
        LabScreen(state = LabState.seed(), onSelect = {})
    }
}
