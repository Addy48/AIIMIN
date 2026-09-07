package aiimin.designsystem.component

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import aiimin.designsystem.theme.AiiminTheme
import aiimin.designsystem.theme.Hairline
import kotlin.math.abs
import kotlin.math.roundToInt

/** Small mono plate under a chart — tap a bar/point, read the figure. */
@Composable
fun ChartReadout(
    title: String,
    detail: String,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier
            .fillMaxWidth()
            .border(Hairline, AiiminTheme.colors.accent.copy(alpha = 0.55f))
            .background(AiiminTheme.colors.tint)
            .padding(horizontal = AiiminTheme.space.s3, vertical = AiiminTheme.space.s2),
    ) {
        Text(
            text = title.uppercase(),
            style = AiiminTheme.type.cellLabel,
            color = AiiminTheme.colors.accent,
        )
        Text(
            text = detail,
            style = AiiminTheme.type.mono(12.0, FontWeight.Medium),
            color = AiiminTheme.colors.text,
            modifier = Modifier.padding(top = 2.dp),
        )
    }
}

data class BarDatum(
    val label: String,
    val value: Float,
    val highlight: Boolean = false,
    val detail: String? = null,
)

/**
 * Vertical column bars with tap readout. Phone has no hover — tap is the
 * hoverable. Empty selection shows the hint; picking a bar shows its figure.
 */
@Composable
fun TapColumnBars(
    bars: List<BarDatum>,
    modifier: Modifier = Modifier,
    valueFormat: (Float) -> String = { "%,d".format(it.roundToInt()) },
    hint: String = "TAP A BAR · READ THE FIGURE",
) {
    if (bars.isEmpty()) return
    var selected by remember { mutableIntStateOf(-1) }
    val max = bars.maxOf { it.value }.coerceAtLeast(1f)

    Column(modifier.fillMaxWidth()) {
        Row(
            Modifier
                .fillMaxWidth()
                .height(88.dp)
                .padding(top = AiiminTheme.space.s2),
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            verticalAlignment = Alignment.Bottom,
        ) {
            bars.forEachIndexed { i, bar ->
                val h = ((bar.value / max) * 56f).coerceAtLeast(4f).dp
                val active = selected == i || (selected < 0 && bar.highlight)
                TapSurface(
                    onClick = { selected = if (selected == i) -1 else i },
                    minTouchTarget = false,
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxHeight(),
                ) {
                    Column(
                        Modifier.fillMaxWidth().fillMaxHeight(),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Bottom,
                    ) {
                        Box(
                            Modifier
                                .fillMaxWidth()
                                .height(h)
                                .background(
                                    when {
                                        selected == i -> AiiminTheme.colors.accent
                                        bar.highlight -> AiiminTheme.colors.accent.copy(alpha = 0.85f)
                                        active -> AiiminTheme.colors.muted
                                        else -> AiiminTheme.colors.hair
                                    },
                                ),
                        )
                        Text(
                            text = bar.label,
                            style = AiiminTheme.type.mono(8.5),
                            color = if (active) AiiminTheme.colors.accent else AiiminTheme.colors.muted,
                            maxLines = 1,
                            textAlign = TextAlign.Center,
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(top = 6.dp),
                        )
                    }
                }
            }
        }

        val pick = bars.getOrNull(selected)
        if (pick != null) {
            ChartReadout(
                title = pick.label,
                detail = pick.detail ?: valueFormat(pick.value),
                modifier = Modifier.padding(top = AiiminTheme.space.s2),
            )
        } else {
            Text(
                text = hint,
                style = AiiminTheme.type.cellLabel,
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = AiiminTheme.space.s2),
            )
        }
    }
}

/**
 * Trajectory with optional tap-to-read. Endpoint always marked; tapped day
 * gets a second ring + readout.
 */
@Composable
fun TapTrajectoryLine(
    series: List<Double>,
    modifier: Modifier = Modifier,
    color: Color = AiiminTheme.colors.accent,
    dayLabels: List<String>? = null,
) {
    if (series.size < 2) {
        TrajectoryLine(series = series, modifier = modifier, color = color)
        return
    }
    var selected by remember { mutableIntStateOf(-1) }
    val hair = AiiminTheme.colors.hair
    val fill = color.copy(alpha = 0.14f)

    Column(modifier.fillMaxWidth()) {
        Canvas(
            Modifier
                .fillMaxWidth()
                .height(52.dp)
                .pointerInput(series) {
                    detectTapGestures { pos ->
                        val step = size.width / (series.size - 1).coerceAtLeast(1)
                        val i = (pos.x / step).roundToInt().coerceIn(0, series.lastIndex)
                        selected = if (selected == i) -1 else i
                    }
                },
        ) {
            drawLine(hair, Offset(0f, size.height), Offset(size.width, size.height), 1f)
            val min = series.min()
            val max = series.max()
            val span = (max - min).takeIf { it > 0.5 } ?: 1.0
            val stepX = size.width / (series.size - 1)

            val strokePath = Path()
            val areaPath = Path()
            series.forEachIndexed { index, value ->
                val x = index * stepX
                val y = size.height - ((value - min) / span * size.height).toFloat()
                if (index == 0) {
                    strokePath.moveTo(x, y)
                    areaPath.moveTo(x, size.height)
                    areaPath.lineTo(x, y)
                } else {
                    strokePath.lineTo(x, y)
                    areaPath.lineTo(x, y)
                }
            }
            areaPath.lineTo((series.size - 1) * stepX, size.height)
            areaPath.close()
            drawPath(areaPath, fill)
            drawPath(strokePath, color, style = Stroke(width = 2f, cap = StrokeCap.Round))

            val last = series.last()
            val lx = (series.size - 1) * stepX
            val ly = size.height - ((last - min) / span * size.height).toFloat()
            drawCircle(color = color, radius = 3.5f, center = Offset(lx, ly))

            if (selected in series.indices) {
                val sx = selected * stepX
                val sy = size.height - ((series[selected] - min) / span * size.height).toFloat()
                drawCircle(color = color.copy(alpha = 0.25f), radius = 8f, center = Offset(sx, sy))
                drawCircle(color = color, radius = 4f, center = Offset(sx, sy))
            }
        }

        if (selected in series.indices) {
            val label = dayLabels?.getOrNull(selected) ?: "DAY ${selected + 1}"
            ChartReadout(
                title = label,
                detail = series[selected].roundToInt().toString(),
                modifier = Modifier.padding(top = AiiminTheme.space.s2),
            )
        } else {
            Text(
                text = "TAP THE LINE · READ A DAY",
                style = AiiminTheme.type.cellLabel,
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = 4.dp),
            )
        }
    }
}

/** Correlation strength badge copy — shared by Lab. */
fun correlationStrength(rho: Float): String = when {
    abs(rho) >= 0.5f -> "STRONG"
    abs(rho) >= 0.3f -> "MODERATE"
    else -> "WEAK"
}

fun correlationSense(rho: Float): String =
    if (rho < 0f) "INVERSE" else "DIRECT"

@Preview(showBackground = true, backgroundColor = 0xFF15171A)
@Composable
private fun ChartsPreview() {
    AiiminTheme {
        Column(
            Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            TapColumnBars(
                bars = listOf(
                    BarDatum("W27", 12_000f),
                    BarDatum("W28", 14_200f),
                    BarDatum("W29", 11_100f),
                    BarDatum("W30", 13_400f),
                    BarDatum("W31", 10_800f, highlight = true),
                ),
                valueFormat = { "₹%,d".format(it.roundToInt()) },
            )
            TapTrajectoryLine(series = listOf(62.0, 65.0, 61.0, 68.0, 70.0, 69.0, 74.0, 78.0))
        }
    }
}
