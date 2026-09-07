package aiimin.designsystem.icon

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/**
 * The tab glyphs, drawn rather than imported.
 *
 * Material's icon set is rounded and filled; this app is a line drawing. Each
 * glyph is stroked on a 24-unit grid at a constant 1.5-unit weight, so the whole
 * bar reads as one hand.
 */
enum class AiiminIcon { Day, Money, Capture, Lab, Config }

@Composable
fun AiiminGlyph(
    icon: AiiminIcon,
    color: Color,
    modifier: Modifier = Modifier,
    size: Dp = 18.dp,
) {
    Canvas(modifier.size(size)) {
        val u = this.size.minDimension / GridUnits
        val stroke = Stroke(
            width = StrokeUnits * u,
            cap = StrokeCap.Round,
            join = StrokeJoin.Round,
        )
        drawPath(path = icon.path(u), color = color, style = stroke)
        if (icon == AiiminIcon.Money) {
            // The card's chip — the one filled dot in the bar.
            drawCircle(color, radius = 1.2f * u, center = Offset(17f * u, 14.5f * u))
        }
    }
}

private const val GridUnits = 24f
private const val StrokeUnits = 1.5f

private fun AiiminIcon.path(u: Float): Path = when (this) {
    // Axis pair with a rising line — the day, read as a trace.
    AiiminIcon.Day -> Path().apply {
        moveTo(4f * u, 3f * u); lineTo(4f * u, 20f * u); lineTo(21f * u, 20f * u)
        moveTo(7f * u, 16f * u); lineTo(11f * u, 11f * u)
        lineTo(14f * u, 14f * u); lineTo(19f * u, 6f * u)
    }
    // A ledger card.
    AiiminIcon.Money -> Path().apply {
        moveTo(3f * u, 6f * u); lineTo(21f * u, 6f * u)
        lineTo(21f * u, 18f * u); lineTo(3f * u, 18f * u); close()
        moveTo(3f * u, 10f * u); lineTo(21f * u, 10f * u)
    }
    // The cross. The only glyph that is an instruction.
    AiiminIcon.Capture -> Path().apply {
        moveTo(12f * u, 4f * u); lineTo(12f * u, 20f * u)
        moveTo(4f * u, 12f * u); lineTo(20f * u, 12f * u)
    }
    // A flask: the Lab.
    AiiminIcon.Lab -> Path().apply {
        moveTo(9f * u, 3f * u); lineTo(15f * u, 3f * u)
        moveTo(10f * u, 3f * u); lineTo(10f * u, 10f * u); lineTo(5f * u, 20f * u)
        lineTo(19f * u, 20f * u); lineTo(14f * u, 10f * u); lineTo(14f * u, 3f * u)
        moveTo(7.4f * u, 15f * u); lineTo(16.6f * u, 15f * u)
    }
    // Sliders: the configuration board.
    AiiminIcon.Config -> Path().apply {
        moveTo(3f * u, 7f * u); lineTo(21f * u, 7f * u)
        moveTo(3f * u, 12f * u); lineTo(21f * u, 12f * u)
        moveTo(3f * u, 17f * u); lineTo(21f * u, 17f * u)
        moveTo(9f * u, 5f * u); lineTo(9f * u, 9f * u)
        moveTo(16f * u, 10f * u); lineTo(16f * u, 14f * u)
        moveTo(7f * u, 15f * u); lineTo(7f * u, 19f * u)
    }
}
