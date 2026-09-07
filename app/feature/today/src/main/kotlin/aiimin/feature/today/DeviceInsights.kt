package aiimin.feature.today

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectVerticalDragGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import android.view.HapticFeedbackConstants
import aiimin.core.data.device.DeviceMetrics
import aiimin.core.data.device.DeviceMetricsRepository
import aiimin.core.data.device.UsageDayParser
import aiimin.core.data.device.formatHourLabel
import aiimin.core.data.device.peakHourIndex
import aiimin.core.data.device.quietHourIndex
import aiimin.designsystem.component.BarDatum
import aiimin.designsystem.component.ChartReadout
import aiimin.designsystem.component.GhostButton
import aiimin.designsystem.component.HairRule
import aiimin.designsystem.component.PrimaryButton
import aiimin.designsystem.component.SectionRule
import aiimin.designsystem.component.TapColumnBars
import aiimin.designsystem.component.Text
import aiimin.designsystem.theme.AiiminTheme
import aiimin.designsystem.theme.Hairline
import java.time.LocalTime
import java.util.concurrent.TimeUnit
import kotlin.math.roundToInt

/**
 * Deep read for STEPS — long-press opens; triple-tap edits goal.
 * Swipe down to dismiss.
 */
@Composable
fun StepsInsightSheet(
    device: DeviceMetrics,
    onDismiss: () -> Unit,
    onEditGoal: () -> Unit,
) {
    val steps = device.steps ?: 0L
    val km = device.kmWalked
    val peak = peakHourIndex(device.hourlySteps)
    val quiet = quietHourIndex(device.hourlySteps)
    val bands = dayBands(device.hourlySteps)
    val remaining = (device.stepsTarget - steps).coerceAtLeast(0L)
    val hourNow = LocalTime.now().hour.coerceIn(0, 23)
    val hoursLeft = (24 - hourNow).coerceAtLeast(1)
    val paceNeeded = if (remaining > 0L) (remaining.toDouble() / hoursLeft).roundToInt() else 0
    val pct = (device.stepsFraction * 100).roundToInt().coerceAtMost(160)
    val narrative = stepsNarrative(steps, device.stepsTarget, km, peak, bands, paceNeeded)
    val bars = wakingHourBars(device.hourlySteps, peak) { h, v ->
        "%,d steps · %s".format(v, formatHourLabel(h))
    }

    InsightDialog(onDismiss = onDismiss) {
        SheetHandle()
        Text(
            text = "BODY · STEPS",
            style = AiiminTheme.type.cellLabel,
            color = AiiminTheme.colors.accent,
        )
        Row(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s3),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s4),
        ) {
            GoalRing(
                fraction = device.stepsFraction.coerceIn(0f, 1f),
                over = device.stepsFraction > 1f,
                center = if (steps > 0L) "%,d".format(steps) else "—",
                caption = "$pct%",
            )
            Column(Modifier.fillMaxWidth()) {
                Text(
                    text = "goal %,d".format(device.stepsTarget),
                    style = AiiminTheme.type.mono(13.0, FontWeight.Medium),
                )
                Text(
                    text = when {
                        steps <= 0L -> "Walk to seed the day."
                        remaining <= 0L -> "Goal cleared · keep moving if you want."
                        else -> "%,d left · ~%,d / hr to finish".format(remaining, paceNeeded)
                    },
                    style = AiiminTheme.type.bodySmall.copy(fontSize = 12.sp, lineHeight = 17.sp),
                    color = AiiminTheme.colors.muted,
                    modifier = Modifier.padding(top = 4.dp),
                )
                Text(
                    text = km?.let { "%.2f km · stride est.".format(it) } ?: "km pending",
                    style = AiiminTheme.type.mono(11.0),
                    color = AiiminTheme.colors.accent,
                    modifier = Modifier.padding(top = 6.dp),
                )
            }
        }

        ChartReadout(
            title = "Read",
            detail = narrative,
            modifier = Modifier.padding(top = AiiminTheme.space.s4),
        )

        SectionRule(label = "Day bands")
        Row(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s2),
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2),
        ) {
            bands.forEach { band ->
                InsightStat(
                    label = band.label,
                    value = if (band.value > 0L) "%,d".format(band.value) else "—",
                    meta = band.meta,
                    modifier = Modifier.weight(1f),
                )
            }
        }

        Row(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s2),
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2),
        ) {
            InsightStat(
                label = "PEAK",
                value = peak?.let { formatHourLabel(it) } ?: "—",
                meta = peak?.let { "%,d".format(device.hourlySteps[it]) } ?: "no bout",
                modifier = Modifier.weight(1f),
            )
            InsightStat(
                label = "QUIET",
                value = quiet?.let { formatHourLabel(it) } ?: "—",
                meta = "least active",
                modifier = Modifier.weight(1f),
            )
            InsightStat(
                label = "BOUTS",
                value = device.walks.size.toString(),
                meta = "≥350 steps",
                modifier = Modifier.weight(1f),
            )
        }

        SectionRule(label = "By clock hour")
        if (bars.any { it.value > 0f }) {
            TapColumnBars(
                bars = bars,
                valueFormat = { "%,d".format(it.roundToInt()) },
                hint = "TAP AN HOUR · READ STEPS",
                modifier = Modifier.padding(top = AiiminTheme.space.s2),
            )
        } else {
            Text(
                text = "No hour buckets yet — walk with the app open so bouts land on the clock.",
                style = AiiminTheme.type.bodySmall,
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = AiiminTheme.space.s2),
            )
        }

        if (device.walks.isNotEmpty()) {
            SectionRule(label = "Named walks")
            device.walks.forEach { walk ->
                Row(
                    Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                ) {
                    Column {
                        Text(text = walk.label, style = AiiminTheme.type.body.copy(fontSize = 13.sp))
                        Text(
                            text = walk.timeLabel,
                            style = AiiminTheme.type.cellLabel,
                            color = AiiminTheme.colors.muted,
                            modifier = Modifier.padding(top = 2.dp),
                        )
                    }
                    Text(
                        text = "%,d".format(walk.steps),
                        style = AiiminTheme.type.mono(13.0, FontWeight.Medium),
                        color = AiiminTheme.colors.accent,
                    )
                }
                HairRule()
            }
        }

        val bodyLines = device.lines.filter {
            it.contains("walk", ignoreCase = true) ||
                it.contains("step", ignoreCase = true) ||
                it.contains("movement", ignoreCase = true) ||
                it.contains("Gym", ignoreCase = true) ||
                it.contains("body", ignoreCase = true)
        }.ifEmpty { device.lines.take(4) }
        if (bodyLines.isNotEmpty()) {
            SectionRule(label = "What it means")
            MeaningBlock(bodyLines)
        }

        GestureLegend(primary = "SWIPE DOWN · CLOSE", secondary = "TRIPLE-TAP CELL · EDIT GOAL")
        SheetActions(editLabel = "Edit goal", onEdit = onEditGoal, onDismiss = onDismiss)
    }
}

/**
 * Deep read for SCREEN — long-press opens; triple-tap edits ceiling.
 * Swipe down to dismiss.
 */
@Composable
fun ScreenInsightSheet(
    device: DeviceMetrics,
    onDismiss: () -> Unit,
    onEditGoal: () -> Unit,
) {
    val ms = device.screenTimeMs ?: 0L
    val peak = peakHourIndex(device.hourlyScreenMs)
    val quiet = quietHourIndex(device.hourlyScreenMs)
    val bands = dayBands(device.hourlyScreenMs)
    val pct = (device.screenFraction * 100).roundToInt().coerceAtMost(160)
    val remain = (device.screenTargetMs - ms).coerceAtLeast(0L)
    val over = (ms - device.screenTargetMs).coerceAtLeast(0L)
    val avgPickup = if ((device.pickups ?: 0) > 0 && ms > 0L) {
        UsageDayParser.formatHours(ms / device.pickups!!)
    } else {
        "—"
    }
    val narrative = screenNarrative(ms, device.screenTargetMs, device.unlockCount, device.pickups, peak, bands)
    val bars = wakingHourBars(device.hourlyScreenMs, peak, fromHour = 6, toHour = 23) { h, v ->
        "${UsageDayParser.formatHours(v)} · ${formatHourLabel(h)}"
    }.map {
        it.copy(value = (device.hourlyScreenMs.getOrElse(it.label.toIntOrNull() ?: 0) { 0L } / 60_000L).toFloat())
    }

    InsightDialog(onDismiss = onDismiss) {
        SheetHandle()
        Text(
            text = "ATTENTION · SCREEN",
            style = AiiminTheme.type.cellLabel,
            color = AiiminTheme.colors.accent,
        )
        Row(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s3),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s4),
        ) {
            GoalRing(
                fraction = device.screenFraction.coerceIn(0f, 1f),
                over = device.screenFraction > 1f,
                center = device.screenHoursLabel ?: "—",
                caption = "$pct%",
                dangerWhenOver = true,
            )
            Column(Modifier.fillMaxWidth()) {
                Text(
                    text = "ceiling ${device.screenTargetLabel}",
                    style = AiiminTheme.type.mono(13.0, FontWeight.Medium),
                )
                Text(
                    text = when {
                        ms <= 0L -> "Usage access live — clock will fill."
                        over > 0L -> "${UsageDayParser.formatHours(over)} past ceiling"
                        else -> "${UsageDayParser.formatHours(remain)} under ceiling"
                    },
                    style = AiiminTheme.type.bodySmall.copy(fontSize = 12.sp, lineHeight = 17.sp),
                    color = if (over > 0L) AiiminTheme.colors.danger else AiiminTheme.colors.muted,
                    modifier = Modifier.padding(top = 4.dp),
                )
                Text(
                    text = (device.screenMessage ?: "Digital Wellbeing · app total").uppercase(),
                    style = AiiminTheme.type.cellLabel,
                    color = AiiminTheme.colors.muted,
                    modifier = Modifier.padding(top = 6.dp),
                )
            }
        }

        ChartReadout(
            title = "Read",
            detail = narrative,
            modifier = Modifier.padding(top = AiiminTheme.space.s4),
        )

        Row(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s3),
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2),
        ) {
            InsightStat(
                label = "UNLOCKS",
                value = device.unlockCount?.toString() ?: "—",
                meta = "after lock",
                modifier = Modifier.weight(1f),
            )
            InsightStat(
                label = "PICKUPS",
                value = device.pickups?.toString() ?: "—",
                meta = "≥15s on",
                modifier = Modifier.weight(1f),
            )
            InsightStat(
                label = "AVG SIT",
                value = avgPickup,
                meta = "per pickup",
                modifier = Modifier.weight(1f),
            )
        }

        SectionRule(label = "Day bands")
        Row(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s2),
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2),
        ) {
            bands.forEach { band ->
                InsightStat(
                    label = band.label,
                    value = if (band.value > 0L) UsageDayParser.formatHours(band.value) else "—",
                    meta = band.meta,
                    modifier = Modifier.weight(1f),
                )
            }
        }

        Row(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s2),
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2),
        ) {
            InsightStat(
                label = "PEAK",
                value = peak?.let { formatHourLabel(it) } ?: "—",
                meta = peak?.let { UsageDayParser.formatHours(device.hourlyScreenMs[it]) } ?: "—",
                modifier = Modifier.weight(1f),
            )
            InsightStat(
                label = "QUIET",
                value = quiet?.let { formatHourLabel(it) } ?: "—",
                meta = "least screen",
                modifier = Modifier.weight(1f),
            )
            InsightStat(
                label = "OPENS",
                value = device.appOpenCount?.toString()
                    ?: device.topApps.sumOf { it.opens }.takeIf { it > 0 }?.toString()
                    ?: "—",
                meta = "app sessions",
                modifier = Modifier.weight(1f),
            )
        }

        SectionRule(label = "By clock hour · minutes")
        if (bars.any { it.value > 0f }) {
            TapColumnBars(
                bars = bars,
                valueFormat = { "${it.roundToInt()}m" },
                hint = "TAP AN HOUR · READ SCREEN",
                modifier = Modifier.padding(top = AiiminTheme.space.s2),
            )
        } else {
            Text(
                text = "No hour buckets yet — usage access must be live for the clock read.",
                style = AiiminTheme.type.bodySmall,
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = AiiminTheme.space.s2),
            )
        }

        if (device.topApps.isNotEmpty()) {
            SectionRule(label = "Apps · foreground")
            val topMs = device.topApps.take(6).sumOf { it.ms }.coerceAtLeast(1L)
            device.topApps.take(6).forEachIndexed { i, app ->
                val share = ((app.ms.toDouble() / topMs) * 100).roundToInt()
                Column(Modifier.padding(vertical = 6.dp)) {
                    Row(
                        Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                    ) {
                        Text(
                            text = "${i + 1}. ${app.label}",
                            style = AiiminTheme.type.body.copy(fontSize = 13.sp),
                            modifier = Modifier.weight(1f),
                            maxLines = 1,
                        )
                        Text(
                            text = if (app.opens > 0) "${app.hoursLabel} · ${app.opens}×" else app.hoursLabel,
                            style = AiiminTheme.type.mono(12.0),
                            color = AiiminTheme.colors.muted,
                        )
                    }
                    Box(
                        Modifier
                            .fillMaxWidth()
                            .padding(top = 5.dp)
                            .height(3.dp)
                            .background(AiiminTheme.colors.hair),
                    ) {
                        Box(
                            Modifier
                                .fillMaxWidth((share / 100f).coerceIn(0.04f, 1f))
                                .height(3.dp)
                                .background(AiiminTheme.colors.accent),
                        )
                    }
                    Text(
                        text = "$share% OF TOP APPS",
                        style = AiiminTheme.type.cellLabel,
                        color = AiiminTheme.colors.muted,
                        modifier = Modifier.padding(top = 3.dp),
                    )
                }
                HairRule()
            }
        }

        if (device.lines.isNotEmpty()) {
            SectionRule(label = "What it means")
            MeaningBlock(device.lines.take(5))
        }

        GestureLegend(primary = "SWIPE DOWN · CLOSE", secondary = "TRIPLE-TAP CELL · EDIT CEILING")
        SheetActions(editLabel = "Edit ceiling", onEdit = onEditGoal, onDismiss = onDismiss)
    }
}

@Composable
fun ScreenGoalDialog(
    goalMs: Long,
    onAdjust: (Long) -> Unit,
    onDismiss: () -> Unit,
) {
    Dialog(onDismissRequest = onDismiss) {
        Column(
            Modifier
                .fillMaxWidth()
                .background(AiiminTheme.colors.bg)
                .border(Hairline, AiiminTheme.colors.accent)
                .padding(AiiminTheme.space.s4),
        ) {
            Text(
                text = "DAILY SCREEN CEILING",
                style = AiiminTheme.type.cellLabel,
                color = AiiminTheme.colors.muted,
            )
            Text(
                text = UsageDayParser.formatHours(goalMs),
                style = AiiminTheme.type.mono(28.0),
                color = AiiminTheme.colors.text,
                modifier = Modifier.padding(top = AiiminTheme.space.s3),
            )
            Text(
                text = "Triple-tap SCREEN on Day to reopen. Range 1h–12h.",
                style = AiiminTheme.type.bodySmall,
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = AiiminTheme.space.s2),
            )
            Row(
                Modifier
                    .fillMaxWidth()
                    .padding(top = AiiminTheme.space.s4),
                horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
            ) {
                GhostButton(
                    label = "− 15m",
                    onClick = { onAdjust(-DeviceMetricsRepository.SCREEN_GOAL_STEP_MS) },
                    modifier = Modifier.weight(1f),
                )
                GhostButton(
                    label = "+ 15m",
                    onClick = { onAdjust(DeviceMetricsRepository.SCREEN_GOAL_STEP_MS) },
                    modifier = Modifier.weight(1f),
                )
            }
            PrimaryButton(
                label = "Done",
                onClick = onDismiss,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = AiiminTheme.space.s3),
            )
        }
    }
}

@Composable
private fun InsightDialog(
    onDismiss: () -> Unit,
    content: @Composable () -> Unit,
) {
    val view = LocalView.current
    var dragY by remember { mutableFloatStateOf(0f) }
    val density = LocalDensity.current
    val dismissPx = with(density) { 140.dp.toPx() }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false),
    ) {
        Column(
            Modifier
                .fillMaxWidth(0.94f)
                .heightIn(max = 680.dp)
                .offset { IntOffset(0, dragY.roundToInt().coerceAtLeast(0)) }
                .pointerInput(Unit) {
                    detectVerticalDragGestures(
                        onDragEnd = {
                            if (dragY > dismissPx) {
                                view.performHapticFeedback(HapticFeedbackConstants.GESTURE_END)
                                onDismiss()
                            } else {
                                dragY = 0f
                            }
                        },
                        onVerticalDrag = { _, amount ->
                            dragY = (dragY + amount).coerceAtLeast(0f)
                        },
                    )
                }
                .background(AiiminTheme.colors.bg)
                .border(Hairline, AiiminTheme.colors.accent)
                .padding(AiiminTheme.space.s4)
                .verticalScroll(rememberScrollState()),
        ) {
            content()
        }
    }
}

@Composable
private fun SheetHandle() {
    Box(
        Modifier
            .fillMaxWidth()
            .padding(bottom = AiiminTheme.space.s3),
        contentAlignment = Alignment.Center,
    ) {
        Box(
            Modifier
                .size(width = 36.dp, height = 3.dp)
                .background(AiiminTheme.colors.rule),
        )
    }
}

@Composable
private fun GoalRing(
    fraction: Float,
    over: Boolean,
    center: String,
    caption: String,
    dangerWhenOver: Boolean = false,
) {
    val sweep = remember { Animatable(0f) }
    LaunchedEffect(fraction) {
        sweep.snapTo(0f)
        sweep.animateTo(fraction.coerceIn(0f, 1f), tween(900, easing = FastOutSlowInEasing))
    }
    val ring = when {
        over && dangerWhenOver -> AiiminTheme.colors.danger
        over -> AiiminTheme.colors.accent
        else -> AiiminTheme.colors.accent
    }
    val track = AiiminTheme.colors.hair
    Box(
        Modifier.size(96.dp),
        contentAlignment = Alignment.Center,
    ) {
        Canvas(Modifier.size(96.dp)) {
            val stroke = 7.dp.toPx()
            val inset = stroke / 2f
            drawArc(
                color = track,
                startAngle = -90f,
                sweepAngle = 360f,
                useCenter = false,
                topLeft = Offset(inset, inset),
                size = Size(size.width - stroke, size.height - stroke),
                style = Stroke(width = stroke, cap = StrokeCap.Round),
            )
            drawArc(
                color = ring,
                startAngle = -90f,
                sweepAngle = 360f * sweep.value,
                useCenter = false,
                topLeft = Offset(inset, inset),
                size = Size(size.width - stroke, size.height - stroke),
                style = Stroke(width = stroke, cap = StrokeCap.Round),
            )
        }
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = center,
                style = AiiminTheme.type.mono(14.0, FontWeight.Bold),
                maxLines = 1,
            )
            Text(
                text = caption,
                style = AiiminTheme.type.cellLabel,
                color = AiiminTheme.colors.muted,
            )
        }
    }
}

@Composable
private fun MeaningBlock(lines: List<String>) {
    Column(
        Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s2)
            .border(Hairline, AiiminTheme.colors.hair)
            .background(AiiminTheme.colors.tint)
            .padding(AiiminTheme.space.s3),
        verticalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2),
    ) {
        lines.forEach { line ->
            Text(
                text = "· $line",
                style = AiiminTheme.type.bodySmall.copy(fontSize = 12.5.sp, lineHeight = 18.sp),
            )
        }
    }
}

@Composable
private fun GestureLegend(primary: String, secondary: String) {
    Text(
        text = "$primary  ·  $secondary",
        style = AiiminTheme.type.cellLabel,
        color = AiiminTheme.colors.muted,
        modifier = Modifier.padding(top = AiiminTheme.space.s4),
    )
}

@Composable
private fun SheetActions(editLabel: String, onEdit: () -> Unit, onDismiss: () -> Unit) {
    Row(
        Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s3),
        horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
    ) {
        GhostButton(label = editLabel, onClick = onEdit, modifier = Modifier.fillMaxWidth(0.48f))
        PrimaryButton(label = "Close", onClick = onDismiss, modifier = Modifier.fillMaxWidth(0.48f))
    }
}

@Composable
private fun InsightStat(
    label: String,
    value: String,
    meta: String,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier
            .border(Hairline, AiiminTheme.colors.hair)
            .background(AiiminTheme.colors.surface)
            .padding(AiiminTheme.space.s3),
    ) {
        Text(text = label, style = AiiminTheme.type.cellLabel, color = AiiminTheme.colors.muted)
        Text(
            text = value,
            style = AiiminTheme.type.mono(15.0, FontWeight.Bold),
            modifier = Modifier.padding(top = 4.dp),
            maxLines = 1,
        )
        Text(
            text = meta.uppercase(),
            style = AiiminTheme.type.chrome.copy(fontSize = 8.sp, letterSpacing = 0.5.sp),
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = 2.dp),
            maxLines = 2,
        )
    }
}

private data class DayBand(val label: String, val value: Long, val meta: String)

private fun dayBands(hourly: List<Long>): List<DayBand> {
    fun sum(from: Int, to: Int) =
        (from..to).sumOf { hourly.getOrElse(it) { 0L } }
    val morning = sum(5, 11)
    val afternoon = sum(12, 17)
    val evening = sum(18, 23)
    val total = (morning + afternoon + evening).coerceAtLeast(1L)
    fun share(v: Long) = "${((v.toDouble() / total) * 100).roundToInt()}%"
    return listOf(
        DayBand("AM", morning, share(morning)),
        DayBand("PM", afternoon, share(afternoon)),
        DayBand("EVE", evening, share(evening)),
    )
}

private fun wakingHourBars(
    hourly: List<Long>,
    peak: Int?,
    fromHour: Int = 6,
    toHour: Int = 22,
    detail: (Int, Long) -> String,
): List<BarDatum> {
    val window = (fromHour..toHour).map { hour ->
        val v = hourly.getOrElse(hour) { 0L }
        BarDatum(
            label = "%02d".format(hour),
            value = v.toFloat(),
            highlight = peak == hour,
            detail = detail(hour, v),
        )
    }
    return if (window.any { it.value > 0f }) window else window
}

private fun stepsNarrative(
    steps: Long,
    goal: Long,
    km: Double?,
    peak: Int?,
    bands: List<DayBand>,
    paceNeeded: Int,
): String {
    if (steps <= 0L) return "No steps yet today. A short walk seeds the clock and the Day strip."
    val lead = bands.maxByOrNull { it.value }
    val peakBit = peak?.let { " Peak ${formatHourLabel(it)}." } ?: ""
    val kmBit = km?.let { " ≈%.2f km.".format(it) } ?: ""
    return when {
        steps >= goal ->
            "Goal cleared (%,d / %,d).$kmBit${lead?.let { " Heaviest in ${it.label}." } ?: ""}$peakBit"
                .format(steps, goal)
        steps >= goal * 0.7 ->
            "On track — %,d of %,d. Need ~%,d steps/hr to finish.$kmBit$peakBit"
                .format(steps, goal, paceNeeded)
        lead != null && lead.value > steps / 2 ->
            "Movement clustered in ${lead.label} (%,d). Spread a walk later to lift the day."
                .format(lead.value)
        else ->
            "%,d of %,d.$kmBit ~%,d/hr closes the gap.$peakBit"
                .format(steps, goal, paceNeeded)
    }
}

private fun screenNarrative(
    ms: Long,
    ceiling: Long,
    unlocks: Int?,
    pickups: Int?,
    peak: Int?,
    bands: List<DayBand>,
): String {
    if (ms <= 0L) return "No screen time yet. Grant usage access if the strip still shows ALLOW."
    val label = UsageDayParser.formatHours(ms)
    val lead = bands.maxByOrNull { it.value }
    val peakBit = peak?.let { " Peak ${formatHourLabel(it)}." } ?: ""
    val frag = when {
        (unlocks ?: 0) >= 70 -> " Unlocks high (${unlocks}) — attention fragmented."
        (unlocks ?: 0) in 1..25 && ms >= TimeUnit.HOURS.toMillis(4) ->
            " Few unlocks, long sits — deep sessions, not quick checks."
        (pickups ?: 0) >= 40 -> " Pickups elevated (${pickups})."
        else -> ""
    }
    val source = " Same figure as Digital Wellbeing app total."
    return when {
        ms > ceiling ->
            "$label — past ceiling ${UsageDayParser.formatHours(ceiling)}." +
                (lead?.let { " Heaviest ${it.label}." } ?: "") + peakBit + frag + source
        ms > ceiling * 0.85 ->
            "$label — near ceiling.${lead?.let { " Watch ${it.label}." } ?: ""}$peakBit$frag$source"
        else ->
            "$label under ceiling ${UsageDayParser.formatHours(ceiling)}." +
                (lead?.let { " ${it.label} leads." } ?: "") + peakBit + frag + source
    }
}
