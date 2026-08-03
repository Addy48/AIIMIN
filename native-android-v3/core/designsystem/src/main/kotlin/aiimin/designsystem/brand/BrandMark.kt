package aiimin.designsystem.brand

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.scale
import androidx.compose.ui.graphics.drawscope.translate
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import aiimin.designsystem.theme.AiiminTheme
import aiimin.designsystem.theme.BrandSpark

/**
 * The AIIMIN mark: a peak "A" of nested chevrons under an arch, with the warm
 * node at the summit.
 *
 * Drawn from the same 512-unit geometry as the web `BrandMark`, so the phone and
 * the site render the identical mark. The strokes take theme ink; the node stays
 * [BrandSpark] — the one warm point in an otherwise steel app.
 */
@Composable
fun BrandMark(
    modifier: Modifier = Modifier,
    size: Dp = 20.dp,
    inkColor: Color = AiiminTheme.colors.text,
    mutedColor: Color = AiiminTheme.colors.muted,
    nodeColor: Color = BrandSpark,
) {
    Canvas(
        modifier
            .size(size)
            .semantics { contentDescription = "AIIMIN" },
    ) {
        drawBrandMark(inkColor, mutedColor, nodeColor)
    }
}

/** Visible geometry: x 60..452, y 96..416 of the 512-unit artboard. */
private const val ViewX = 60f
private const val ViewY = 96f
private const val ViewW = 392f
private const val ViewH = 320f

private fun DrawScope.drawBrandMark(ink: Color, muted: Color, node: Color) {
    val unit = minOf(size.width / ViewW, size.height / ViewH)
    val drawnW = ViewW * unit
    val drawnH = ViewH * unit

    translate(
        left = (size.width - drawnW) / 2f - ViewX * unit,
        top = (size.height - drawnH) / 2f - ViewY * unit,
    ) {
        scale(scale = unit, pivot = Offset.Zero) {
            drawPath(archPath(), muted, alpha = 0.55f, style = stroke(24f))
            drawPath(peakPath(), ink, style = stroke(24f))
            drawPath(innerPeakPath(), muted, alpha = 0.8f, style = stroke(18f))
            drawCircle(node, radius = 30f, center = Offset(256f, 240f))
        }
    }
}

private fun stroke(width: Float) =
    Stroke(width = width, cap = StrokeCap.Round, join = StrokeJoin.Round)

private fun archPath() = Path().apply {
    moveTo(80f, 384f)
    cubicTo(80f, 192f, 208f, 112f, 256f, 112f)
    cubicTo(304f, 112f, 432f, 192f, 432f, 384f)
}

private fun peakPath() = Path().apply {
    moveTo(144f, 384f)
    lineTo(256f, 176f)
    lineTo(368f, 384f)
}

private fun innerPeakPath() = Path().apply {
    moveTo(192f, 368f)
    lineTo(256f, 272f)
    lineTo(320f, 368f)
}

@Preview
@Composable
private fun BrandMarkPreview() {
    AiiminTheme { BrandMark(size = 96.dp) }
}
