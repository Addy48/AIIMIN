package aiimin.designsystem.component

import aiimin.designsystem.theme.Aiimin
import androidx.compose.foundation.gestures.detectHorizontalDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.gestures.detectDragGesturesAfterLongPress
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.patrykandpatrick.vico.compose.cartesian.CartesianChartHost
import com.patrykandpatrick.vico.compose.cartesian.Zoom
import com.patrykandpatrick.vico.compose.cartesian.axis.HorizontalAxis
import com.patrykandpatrick.vico.compose.cartesian.axis.rememberAxisLabelComponent
import com.patrykandpatrick.vico.compose.cartesian.data.CartesianChartModelProducer
import com.patrykandpatrick.vico.compose.cartesian.data.CartesianLayerRangeProvider
import com.patrykandpatrick.vico.compose.cartesian.data.CartesianValueFormatter
import com.patrykandpatrick.vico.compose.cartesian.data.columnSeries
import com.patrykandpatrick.vico.compose.cartesian.decoration.HorizontalBox
import com.patrykandpatrick.vico.compose.cartesian.decoration.HorizontalLine
import com.patrykandpatrick.vico.compose.cartesian.layer.ColumnCartesianLayer
import com.patrykandpatrick.vico.compose.cartesian.layer.rememberColumnCartesianLayer
import com.patrykandpatrick.vico.compose.cartesian.rememberCartesianChart
import com.patrykandpatrick.vico.compose.cartesian.rememberVicoScrollState
import com.patrykandpatrick.vico.compose.cartesian.rememberVicoZoomState
import com.patrykandpatrick.vico.compose.common.DashedShape
import com.patrykandpatrick.vico.compose.common.Fill
import com.patrykandpatrick.vico.compose.common.Insets
import com.patrykandpatrick.vico.compose.common.component.rememberLineComponent
import com.patrykandpatrick.vico.compose.common.component.rememberShapeComponent
import com.patrykandpatrick.vico.compose.common.component.rememberTextComponent
import com.patrykandpatrick.vico.compose.common.data.ExtraStore
import kotlin.math.abs
import kotlin.math.max

/** Labels only at the x-values we name (first, middle, last…), never on every bar. */
private class PickedLabels(
    private val xs: List<Double>,
    private val base: HorizontalAxis.ItemPlacer = HorizontalAxis.ItemPlacer.aligned(spacing = { 1 }),
) : HorizontalAxis.ItemPlacer by base {
    override fun getLabelValues(
        context: com.patrykandpatrick.vico.compose.cartesian.CartesianDrawingContext,
        visibleXRange: ClosedFloatingPointRange<Double>,
        fullXRange: ClosedFloatingPointRange<Double>,
        maxLabelWidth: Float,
    ) = xs.filter { it in visibleXRange }

    override fun getWidthMeasurementLabelValues(
        context: com.patrykandpatrick.vico.compose.cartesian.CartesianMeasuringContext,
        layerDimensions: com.patrykandpatrick.vico.compose.cartesian.layer.CartesianLayerDimensions,
        fullXRange: ClosedFloatingPointRange<Double>,
    ) = xs

    override fun getHeightMeasurementLabelValues(
        context: com.patrykandpatrick.vico.compose.cartesian.CartesianMeasuringContext,
        layerDimensions: com.patrykandpatrick.vico.compose.cartesian.layer.CartesianLayerDimensions,
        fullXRange: ClosedFloatingPointRange<Double>,
        maxLabelWidth: Float,
    ) = xs
}

private class BarColumns(
    private val pick: (Int) -> com.patrykandpatrick.vico.compose.common.component.LineComponent,
    private val widest: com.patrykandpatrick.vico.compose.common.component.LineComponent,
) : ColumnCartesianLayer.ColumnProvider {
    override fun getColumn(entry: com.patrykandpatrick.vico.compose.cartesian.data.ColumnCartesianLayerModel.Entry, extraStore: ExtraStore) =
        pick(entry.x.toInt())

    override fun getWidestSeriesColumn(seriesKey: Any, seriesIndex: Int, extraStore: ExtraStore) = widest
}

/**
 * The spend / steps / sleep bar chart, drawn by Vico (open-source Compose charts) and themed to the
 * AIIMIN palette: warm graphite bars with rounded tops, a soft sand "your usual" band, a dashed
 * average line, and one accent bar for what you are reading. One interaction model for every chart
 * (plan §2.12): tap selects (tap again clears); long-press then drag scrubs with a haptic tick per
 * bar; a quick horizontal swipe pages the period. The headline *above* the chart is the readout.
 */
@Composable
fun ScrubBarChart(
    points: List<BarPoint>,
    selected: Int?,
    onSelect: (Int?) -> Unit,
    modifier: Modifier = Modifier,
    usual: Double? = null,
    usualLabel: String? = null,
    bandLow: Double? = null,
    bandHigh: Double? = null,
    labels: List<AxisLabel> = emptyList(),
    height: Dp = 200.dp,
    maxValue: Double? = null,
    onPage: ((Int) -> Unit)? = null,
    description: String = "Bar chart",
) {
    val c = Aiimin.colors
    val haptics = LocalHapticFeedback.current
    val n = points.size.coerceAtLeast(1)
    val vmax = (maxValue ?: max(points.filter { !it.stub }.maxOfOrNull { it.value } ?: 1.0, max(bandHigh ?: 0.0, usual ?: 0.0)) * 1.12).coerceAtLeast(1.0)

    // Chart colours: one calm ink for the period, the accent for the bar you are reading, soft taupe for the rest.
    val ink = Color(0xFF3B362F)
    val dim = Color(0xFFCDC5B6)
    val future = Color(0xFFE6E0D3)
    val colW = when { n > 20 -> 5.dp; n > 10 -> 11.dp; else -> 22.dp }
    val rounded = RoundedCornerShape(topStart = colW / 2.5f, topEnd = colW / 2.5f, bottomStart = 1.dp, bottomEnd = 1.dp)
    val normal = rememberLineComponent(Fill(ink), colW, rounded)
    val chosen = rememberLineComponent(Fill(c.accent), colW, rounded)
    val faded = rememberLineComponent(Fill(dim), colW, rounded)
    val stub = rememberLineComponent(Fill(future), colW, rounded)

    val producer = remember { CartesianChartModelProducer() }
    LaunchedEffect(points, vmax) {
        producer.runTransaction {
            columnSeries { series(points.map { if (it.gap) 0.0 else if (it.stub) vmax * 0.02 else it.value }) }
        }
    }

    val pts = rememberUpdatedState(points)
    val sel = rememberUpdatedState(selected)
    val provider = remember(normal, chosen, faded, stub, points, selected) {
        BarColumns({ i ->
            val p = points.getOrNull(i)
            when {
                p?.stub == true -> stub
                selected == i -> chosen
                selected != null -> faded
                else -> normal
            }
        }, normal)
    }
    val labelText = remember(labels) { labels.associate { it.index.toDouble() to it.text } }
    val axisStyle = TextStyle(color = c.textMuted, fontSize = 11.5.sp)
    val axisLabel = rememberAxisLabelComponent(style = axisStyle)
    val bandBox = rememberShapeComponent(Fill(c.band))
    val usualLine = rememberLineComponent(Fill(c.bandLine), 1.5.dp, DashedShape(dashLength = 4.dp, gapLength = 4.dp))
    val usualText = rememberTextComponent(
        style = TextStyle(color = c.textMuted, fontSize = 11.sp),
        padding = Insets(4.dp, 1.dp),
        background = rememberShapeComponent(Fill(c.base)),
    )
    val decorations = remember(bandLow, bandHigh, usual, usualLabel, bandBox, usualLine, usualText) {
        buildList {
            if (bandLow != null && bandHigh != null) add(BehindBars(HorizontalBox(y = { bandLow..bandHigh }, box = bandBox)))
            if (usual != null) add(
                HorizontalLine(
                    y = { usual }, line = usualLine, labelComponent = if (usualLabel != null) usualText else null,
                    label = { usualLabel.orEmpty() },
                    horizontalLabelPosition = com.patrykandpatrick.vico.compose.common.Position.Horizontal.End,
                    verticalLabelPosition = com.patrykandpatrick.vico.compose.common.Position.Vertical.Top,
                ),
            )
        }
    }
    val chart = rememberCartesianChart(
        rememberColumnCartesianLayer(
            columnProvider = provider,
            columnCollectionSpacing = when { n > 20 -> 2.dp; n > 10 -> 4.dp; else -> 8.dp },
            rangeProvider = remember(vmax) { CartesianLayerRangeProvider.fixed(minY = 0.0, maxY = vmax) },
        ),
        bottomAxis = HorizontalAxis.rememberBottom(
            line = rememberLineComponent(Fill(ink), 1.dp),
            tick = null, guideline = null,
            label = axisLabel.takeIf { labels.isNotEmpty() },
            valueFormatter = remember(labelText) { CartesianValueFormatter { _, x, _ -> labelText[x] ?: "·" } },
            itemPlacer = remember(labelText) { PickedLabels(labelText.keys.sorted().ifEmpty { listOf(0.0) }) },
        ),
        decorations = decorations,
    )

    Box(
        modifier.fillMaxWidth().height(height).semantics { contentDescription = description },
    ) {
        CartesianChartHost(
            chart = chart, modelProducer = producer, modifier = Modifier.fillMaxSize(),
            scrollState = rememberVicoScrollState(scrollEnabled = false),
            zoomState = rememberVicoZoomState(zoomEnabled = false, initialZoom = Zoom.Content),
            chartAreaHeight = height,
        )
        // Our gestures sit on top so every chart in the app reads, scrubs and pages the same way.
        Box(
            Modifier.fillMaxSize()
                .pointerInput(onPage != null) {
                    if (onPage != null) {
                        var total = 0f
                        detectHorizontalDragGestures(onDragStart = { total = 0f }, onDragEnd = { if (abs(total) > 80f) onPage(if (total < 0) 1 else -1) }) { change, delta -> total += delta; change.consume() }
                    }
                }
                .pointerInput(n) {
                    detectTapGestures { pos ->
                        val i = ((pos.x / size.width) * n).toInt().coerceIn(0, n - 1)
                        onSelect(if (sel.value == i) null else i)
                    }
                }
                .pointerInput(n) {
                    var last = -1
                    detectDragGesturesAfterLongPress(
                        onDragStart = { pos ->
                            val i = ((pos.x / size.width) * n).toInt().coerceIn(0, n - 1)
                            last = i; haptics.performHapticFeedback(HapticFeedbackType.LongPress); onSelect(i)
                        },
                        onDrag = { change, _ ->
                            change.consume()
                            val i = ((change.position.x / size.width) * n).toInt().coerceIn(0, n - 1)
                            if (i != last) { last = i; haptics.performHapticFeedback(HapticFeedbackType.TextHandleMove); onSelect(i) }
                        },
                    )
                },
        )
    }
}

/**
 * Vico paints a HorizontalBox in its over-the-bars pass, which cut every bar in half where it
 * crossed the "usual" band. This draws the same box in the under-the-bars pass instead.
 */
private class BehindBars(private val inner: com.patrykandpatrick.vico.compose.cartesian.decoration.Decoration) :
    com.patrykandpatrick.vico.compose.cartesian.decoration.Decoration {
    override fun drawUnderLayers(context: com.patrykandpatrick.vico.compose.cartesian.CartesianDrawingContext) {
        inner.drawUnderLayers(context)
        inner.drawOverLayers(context)
    }

    override fun drawOverLayers(context: com.patrykandpatrick.vico.compose.cartesian.CartesianDrawingContext) = Unit

    override fun equals(other: Any?) = other is BehindBars && other.inner == inner
    override fun hashCode() = inner.hashCode()
}
