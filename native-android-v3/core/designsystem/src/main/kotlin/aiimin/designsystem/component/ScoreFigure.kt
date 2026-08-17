package aiimin.designsystem.component

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import aiimin.designsystem.theme.AiiminTheme
import aiimin.designsystem.theme.Hairline
import kotlin.math.roundToInt

/**
 * The one large figure, and everything that keeps it honest.
 *
 * The number never appears alone. It carries a **± band** that widens as
 * confidence falls, so a day with little logged reads as *uncertain* rather than
 * as *bad* — the difference between an instrument and a judge.
 *
 * It counts up on arrival because a number that snaps into place looks like a
 * value that was always there; a number that climbs looks like one that was
 * measured. A short confidence rail under the band makes coverage readable at a
 * glance without inventing a second score.
 */
@Composable
fun ScoreFigure(
    state: Double,
    band: Double,
    confidence: Double,
    modifier: Modifier = Modifier,
    animated: Boolean = true,
) {
    val reduce = AiiminTheme.reduceMotion
    val target = state.toFloat()
    val shown by animateFloatAsState(
        targetValue = target,
        animationSpec = tween(durationMillis = if (animated && !reduce) 600 else 0),
        label = "score-count-up",
    )
    val cover by animateFloatAsState(
        targetValue = confidence.toFloat().coerceIn(0f, 1f),
        animationSpec = tween(durationMillis = if (animated && !reduce) 500 else 0),
        label = "confidence-rail",
    )

    Column(modifier, verticalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2)) {
        Row(verticalAlignment = Alignment.Bottom) {
            Text(
                text = shown.roundToInt().toString(),
                style = AiiminTheme.type.figure,
                color = AiiminTheme.colors.text,
            )
            Column(
                Modifier.padding(start = AiiminTheme.space.s3, bottom = 8.dp),
                verticalArrangement = Arrangement.spacedBy(2.dp),
            ) {
                Text(
                    text = "± ${band.roundToInt()}",
                    style = AiiminTheme.type.mono(13.0),
                    color = AiiminTheme.colors.accent,
                )
                Text(
                    text = confidenceLabel(confidence),
                    style = AiiminTheme.type.cellLabel,
                    color = AiiminTheme.colors.muted,
                )
            }
        }

        // Coverage rail — instrument honesty, not a progress gamification bar.
        Box(
            Modifier
                .fillMaxWidth()
                .height(3.dp)
                .background(AiiminTheme.colors.hair),
        ) {
            Box(
                Modifier
                    .fillMaxWidth(cover.coerceAtLeast(0.02f))
                    .height(3.dp)
                    .background(AiiminTheme.colors.accent),
            )
        }
    }
}

private fun confidenceLabel(confidence: Double): String = when {
    confidence >= 0.75 -> "WELL COVERED"
    confidence >= 0.45 -> "PARTLY COVERED"
    confidence > 0.0 -> "THIN — LOG MORE"
    else -> "NOTHING LOGGED YET"
}

/**
 * Twenty-eight days as one line, with a faint fill under the path so the
 * trajectory has body — still a reference, not a chart dashboard.
 */
@Composable
fun TrajectoryLine(
    series: List<Double>,
    modifier: Modifier = Modifier,
    color: Color = AiiminTheme.colors.accent,
) {
    val hair = AiiminTheme.colors.hair
    val fill = color.copy(alpha = 0.14f)
    Canvas(
        modifier
            .fillMaxWidth()
            .height(44.dp),
    ) {
        drawLine(
            color = hair,
            start = Offset(0f, size.height),
            end = Offset(size.width, size.height),
            strokeWidth = 1f,
        )
        if (series.size < 2) return@Canvas

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
        // Endpoint mark — where today sits on the line.
        val last = series.last()
        val lx = (series.size - 1) * stepX
        val ly = size.height - ((last - min) / span * size.height).toFloat()
        drawCircle(color = color, radius = 3.5f, center = Offset(lx, ly))
    }
}

/**
 * One instrument's reading on a small drafted plate. An instrument with no data
 * says so instead of showing a zero — a zero is a claim.
 */
@Composable
fun InstrumentCell(
    label: String,
    value: Double,
    covered: Boolean,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier
            .border(Hairline, AiiminTheme.colors.hair)
            .background(if (covered) AiiminTheme.colors.tint else AiiminTheme.colors.bg)
            .padding(horizontal = AiiminTheme.space.s2, vertical = AiiminTheme.space.s3),
        verticalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        Text(
            text = label,
            style = AiiminTheme.type.cellLabel,
            color = AiiminTheme.colors.muted,
        )
        Text(
            text = if (covered) value.roundToInt().toString() else "—",
            style = AiiminTheme.type.mono(20.0),
            color = if (covered) AiiminTheme.colors.text else AiiminTheme.colors.muted,
        )
        Box(
            Modifier
                .width(18.dp)
                .height(2.dp)
                .background(if (covered) AiiminTheme.colors.accent else AiiminTheme.colors.hair),
        )
    }
}

@Preview(showBackground = true, backgroundColor = 0xFF15171A)
@Composable
private fun ScoreFigurePreview() {
    AiiminTheme {
        Column(Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
            ScoreFigure(state = 78.0, band = 4.0, confidence = 0.8, animated = false)
            TrajectoryLine(series = listOf(62.0, 65.0, 61.0, 68.0, 70.0, 69.0, 74.0, 78.0))
            Row(
                Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                InstrumentCell("CRAFT", 84.0, true, Modifier.weight(1f))
                InstrumentCell("BODY", 61.0, true, Modifier.weight(1f))
                InstrumentCell("MIND", 0.0, false, Modifier.weight(1f))
            }
        }
    }
}
