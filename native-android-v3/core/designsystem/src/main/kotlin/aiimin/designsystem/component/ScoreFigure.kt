package aiimin.designsystem.component

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
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
import androidx.compose.ui.unit.sp
import aiimin.designsystem.theme.AiiminTheme
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
 * measured.
 */
@Composable
fun ScoreFigure(
    state: Double,
    band: Double,
    confidence: Double,
    modifier: Modifier = Modifier,
    animated: Boolean = true,
) {
    val target = state.toFloat()
    val shown by animateFloatAsState(
        targetValue = target,
        animationSpec = tween(durationMillis = if (animated) 600 else 0),
        label = "score-count-up",
    )

    Row(modifier, verticalAlignment = Alignment.Bottom) {
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
                style = AiiminTheme.type.mono(12.0),
                color = AiiminTheme.colors.accent,
            )
            Text(
                text = confidenceLabel(confidence),
                style = AiiminTheme.type.cellLabel,
                color = AiiminTheme.colors.muted,
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
 * Twenty-eight days as one line.
 *
 * A single figure hides the difference between a bad day and a bad month. The
 * line is drawn flat and quiet — it is a reference, not a headline — and its
 * direction is only ever claimed when the slope clears its own error bar.
 */
@Composable
fun TrajectoryLine(
    series: List<Double>,
    modifier: Modifier = Modifier,
    color: Color = AiiminTheme.colors.accent,
) {
    val hair = AiiminTheme.colors.hair
    Canvas(
        modifier
            .fillMaxWidth()
            .height(34.dp),
    ) {
        // The baseline is drawn even with no data, so the space reads as
        // "not enough yet" rather than as an empty box.
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

        val path = Path()
        series.forEachIndexed { index, value ->
            val x = index * stepX
            val y = size.height - ((value - min) / span * size.height).toFloat()
            if (index == 0) path.moveTo(x, y) else path.lineTo(x, y)
        }
        drawPath(path, color, style = Stroke(width = 1.6f, cap = StrokeCap.Round))
    }
}

/**
 * One instrument's reading. An instrument with no data says so instead of
 * showing a zero — a zero is a claim, and we do not have one to make.
 */
@Composable
fun InstrumentCell(
    label: String,
    value: Double,
    covered: Boolean,
    modifier: Modifier = Modifier,
) {
    Column(modifier, verticalArrangement = Arrangement.spacedBy(3.dp)) {
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
    }
}

@Preview(showBackground = true, backgroundColor = 0xFF15171A)
@Composable
private fun ScoreFigurePreview() {
    AiiminTheme {
        Column(Modifier.padding(20.dp)) {
            ScoreFigure(state = 78.0, band = 4.0, confidence = 0.8, animated = false)
            TrajectoryLine(series = listOf(62.0, 65.0, 61.0, 68.0, 70.0, 69.0, 74.0, 78.0))
            Row(horizontalArrangement = Arrangement.spacedBy(20.dp)) {
                InstrumentCell("CRAFT", 84.0, true)
                InstrumentCell("BODY", 61.0, true)
                InstrumentCell("MIND", 0.0, false)
            }
        }
    }
}
