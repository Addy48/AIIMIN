package aiimin.feature.today

import android.Manifest
import android.os.Build
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.layout.positionInParent
import kotlinx.coroutines.delay
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.material3.pulltorefresh.rememberPullToRefreshState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import aiimin.core.data.AgendaEvent
import aiimin.core.data.AgendaState
import aiimin.core.data.DayEntry
import aiimin.core.data.DayState
import aiimin.core.data.NoteItem
import aiimin.core.data.NoteState
import aiimin.core.data.PublishedLifeScoreState
import aiimin.core.data.device.DeviceMetrics
import aiimin.core.data.device.DeviceMetricsRepository
import aiimin.core.data.device.ScreenStatus
import aiimin.core.data.device.StepsSource
import aiimin.core.data.device.StepsStatus
import aiimin.core.model.CommitmentShape
import aiimin.core.model.Direction
import aiimin.designsystem.component.BlueprintBox
import aiimin.designsystem.component.EmptyState
import aiimin.designsystem.component.GhostButton
import aiimin.designsystem.component.HairRule
import aiimin.designsystem.component.InstrumentCell
import aiimin.designsystem.component.PrimaryButton
import aiimin.designsystem.component.ScoreFigure
import aiimin.designsystem.component.ScreenHead
import aiimin.designsystem.component.SectionRule
import aiimin.designsystem.component.TapSurface
import aiimin.designsystem.component.TapTrajectoryLine
import aiimin.designsystem.component.Text
import aiimin.designsystem.component.riseIn
import aiimin.designsystem.theme.AiiminTheme
import aiimin.designsystem.theme.Hairline
import kotlin.math.roundToInt
import kotlinx.coroutines.launch

@Composable
fun TodayRoute(
    onOpenCapture: (String) -> Unit,
    onOpenScore: () -> Unit = {},
    onOpenNotes: () -> Unit = {},
    modifier: Modifier = Modifier,
    viewModel: TodayViewModel = hiltViewModel(),
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val device by viewModel.deviceMetrics.collectAsStateWithLifecycle()
    val dayQuote by viewModel.dayQuote.collectAsStateWithLifecycle()
    val refreshing by viewModel.refreshing.collectAsStateWithLifecycle()
    val agenda by viewModel.agenda.collectAsStateWithLifecycle()
    val notes by viewModel.notes.collectAsStateWithLifecycle()
    val publishedScore by viewModel.publishedScore.collectAsStateWithLifecycle()
    val focusMinimums by viewModel.focusMinimums.collectAsStateWithLifecycle()
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val lifecycleOwner = androidx.lifecycle.compose.LocalLifecycleOwner.current
    var showStepsGoal by remember { mutableStateOf(false) }
    var showScreenGoal by remember { mutableStateOf(false) }
    var showStepsInsight by remember { mutableStateOf(false) }
    var showScreenInsight by remember { mutableStateOf(false) }

    DisposableEffect(lifecycleOwner) {
        val observer = androidx.lifecycle.LifecycleEventObserver { _, event ->
            if (event == androidx.lifecycle.Lifecycle.Event.ON_RESUME) viewModel.refreshDevice()
        }
        lifecycleOwner.lifecycle.addObserver(observer)
        onDispose { lifecycleOwner.lifecycle.removeObserver(observer) }
    }

    val activityLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission(),
    ) { granted ->
        if (granted) viewModel.refreshDevice()
    }

    // Contract must be remembered — new instance each recomposition breaks the dialog.
    val healthContract = remember { viewModel.healthConnectPermissionContract() }
    val healthLauncher = rememberLauncherForActivityResult(healthContract) {
        viewModel.refreshDevice()
    }

    fun requestSteps(openSettingsFallback: Boolean = false) {
        scope.launch {
            when {
                viewModel.healthConnectNeedsUpdate() -> {
                    context.startActivity(viewModel.healthConnectInstallIntent())
                }
                viewModel.needsHealthConnectPermission() -> {
                    try {
                        healthLauncher.launch(viewModel.healthConnectPermissions())
                    } catch (_: Exception) {
                        context.startActivity(viewModel.healthConnectManagePermissionsIntent())
                    }
                    if (openSettingsFallback) {
                        context.startActivity(viewModel.healthConnectManagePermissionsIntent())
                    }
                }
                viewModel.needsActivityPermission() -> {
                    if (Build.VERSION.SDK_INT >= 29) {
                        activityLauncher.launch(Manifest.permission.ACTIVITY_RECOGNITION)
                    } else {
                        viewModel.refreshDevice()
                    }
                }
                else -> viewModel.refreshDevice()
            }
        }
    }

    // Auto-prompt once when Day needs Health Connect — silent fail was the 1.3k lie.
    LaunchedEffect(device.stepsStatus) {
        if (device.stepsStatus == StepsStatus.NEED_PERMISSION) {
            requestSteps()
        }
    }

    TodayScreen(
        state = state,
        device = device,
        dayQuote = dayQuote,
        refreshing = refreshing,
        agenda = agenda,
        notes = notes,
        publishedScore = publishedScore,
        onOpenCapture = onOpenCapture,
        onOpenScore = onOpenScore,
        onOpenNotes = onOpenNotes,
        onToggle = viewModel::onToggle,
        onRequestSteps = { requestSteps(openSettingsFallback = true) },
        onRequestScreen = {
            context.startActivity(viewModel.usageAccessIntent())
        },
        onRefreshDevice = viewModel::refreshDevice,
        onPullRefresh = viewModel::onPullRefresh,
        onEditStepsGoal = { showStepsGoal = true },
        onEditScreenGoal = { showScreenGoal = true },
        onOpenStepsInsight = { showStepsInsight = true },
        onOpenScreenInsight = { showScreenInsight = true },
        scrollToMinimums = focusMinimums,
        onScrollToMinimumsConsumed = viewModel::onScrollToMinimumsConsumed,
        modifier = modifier,
    )

    if (showStepsInsight) {
        StepsInsightSheet(
            device = device,
            onDismiss = { showStepsInsight = false },
            onEditGoal = {
                showStepsInsight = false
                showStepsGoal = true
            },
        )
    }
    if (showScreenInsight) {
        ScreenInsightSheet(
            device = device,
            onDismiss = { showScreenInsight = false },
            onEditGoal = {
                showScreenInsight = false
                showScreenGoal = true
            },
        )
    }
    if (showStepsGoal) {
        StepsGoalDialog(
            goal = device.stepsTarget,
            onAdjust = viewModel::adjustStepsGoal,
            onDismiss = { showStepsGoal = false },
        )
    }
    if (showScreenGoal) {
        ScreenGoalDialog(
            goalMs = device.screenTargetMs,
            onAdjust = viewModel::adjustScreenGoal,
            onDismiss = { showScreenGoal = false },
        )
    }
}

/**
 * **One job: act on this day.**
 *
 * Order is doctrine (Genesis GOV-106 / GOV-165): capture in, day's signal,
 * device strip, then the read. Score sits below because a number you cannot act
 * on is not a reason to open an app.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TodayScreen(
    state: DayState,
    device: DeviceMetrics = DeviceMetrics.cold(),
    dayQuote: String = "",
    refreshing: Boolean = false,
    agenda: AgendaState = AgendaState.empty(),
    notes: NoteState = NoteState.empty(),
    publishedScore: PublishedLifeScoreState = PublishedLifeScoreState.absent(),
    onOpenCapture: (String) -> Unit,
    onToggle: (Long) -> Unit,
    onOpenScore: () -> Unit = {},
    onOpenNotes: () -> Unit = {},
    onRequestSteps: () -> Unit = {},
    onRequestScreen: () -> Unit = {},
    onRefreshDevice: () -> Unit = {},
    onPullRefresh: () -> Unit = onRefreshDevice,
    onEditStepsGoal: () -> Unit = {},
    onEditScreenGoal: () -> Unit = {},
    onOpenStepsInsight: () -> Unit = {},
    onOpenScreenInsight: () -> Unit = {},
    scrollToMinimums: Boolean = false,
    onScrollToMinimumsConsumed: () -> Unit = {},
    modifier: Modifier = Modifier,
) {
    val ptr = rememberPullToRefreshState()
    val scroll = rememberScrollState()
    var minimumsY by remember { mutableIntStateOf(0) }
    LaunchedEffect(scrollToMinimums, minimumsY) {
        if (!scrollToMinimums) return@LaunchedEffect
        delay(32)
        scroll.animateScrollTo(minimumsY.coerceAtLeast(0))
        onScrollToMinimumsConsumed()
    }
    PullToRefreshBox(
        isRefreshing = refreshing,
        onRefresh = onPullRefresh,
        state = ptr,
        modifier = modifier.fillMaxSize(),
    ) {
        Column(
            Modifier
                .fillMaxSize()
                .verticalScroll(scroll)
                .padding(horizontal = AiiminTheme.space.page)
                .padding(bottom = AiiminTheme.space.s8 + AiiminTheme.space.s6),
        ) {
            ScreenHead(title = "AIIMIN · Day sheet", meta = "TODAY", modifier = Modifier.riseIn(0))

            CaptureLead(
                onOpenCapture = onOpenCapture,
                modifier = Modifier
                    .padding(top = AiiminTheme.space.s6)
                    .riseIn(70),
            )

            DaySignal(
                quote = dayQuote,
                modifier = Modifier.riseIn(120),
            )

            NotesStrip(notes, onOpenNotes = onOpenNotes)

            DeviceStrip(
                device = device,
                onRequestSteps = onRequestSteps,
                onRequestScreen = onRequestScreen,
                onRefresh = onRefreshDevice,
                onEditStepsGoal = onEditStepsGoal,
                onEditScreenGoal = onEditScreenGoal,
                onOpenStepsInsight = onOpenStepsInsight,
                onOpenScreenInsight = onOpenScreenInsight,
                modifier = Modifier.riseIn(170),
            )

            state.breachedFloors.forEach { floor -> FloorWarning(floor) }

            SectionRule(label = "Today's read", value = state.mode.label)
            TodayScore(state, published = publishedScore, onOpenScore = onOpenScore)

            AgendaStrip(agenda)

            SectionRule(
                label = "Daily minimums",
                value = minimumsLabel(state),
                modifier = Modifier.onGloballyPositioned { coords ->
                    minimumsY = coords.positionInParent().y.toInt()
                },
            )
            if (state.pursuits.isEmpty()) {
                EmptyState(
                    label = "Nothing set",
                    message = "Calibration picks these with you. Until then the seed set is standing in.",
                )
            } else {
                state.pursuits.forEach { entry -> MinimumRow(entry, onToggle) }
            }

            SectionRule(label = "Settled today", value = "${state.captures.size}")
            if (state.captures.isEmpty()) {
                EmptyState(
                    label = "Nothing settled yet",
                    message = "Write one line above. What you settle on Capture lands here.",
                )
            } else {
                state.captures.forEach { capture ->
                    Column {
                        Row(
                            Modifier
                                .fillMaxWidth()
                                .padding(vertical = 8.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                        ) {
                            Text(text = capture.label, style = AiiminTheme.type.body, modifier = Modifier.weight(1f))
                            Text(
                                text = capture.time,
                                style = AiiminTheme.type.mono,
                                color = AiiminTheme.colors.muted,
                            )
                        }
                        HairRule()
                    }
                }
            }
        }
    }
}

@Composable
private fun CaptureLead(onOpenCapture: (String) -> Unit, modifier: Modifier = Modifier) {
    BlueprintBox(modifier = modifier, legend = "Universal capture", accent = true, tinted = true) {
        Text(
            text = "Log anything — AIIMIN sorts it. 'paid 240 metro, felt sharp 8/10'",
            style = AiiminTheme.type.body.copy(fontSize = 15.sp, lineHeight = 22.sp),
            color = AiiminTheme.colors.muted,
        )
        Row(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s4),
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                text = "ENTER TO PARSE · AI READS IT",
                style = AiiminTheme.type.cellLabel,
                color = AiiminTheme.colors.muted,
                modifier = Modifier.weight(1f),
            )
            TapSurface(
                onClick = { onOpenCapture("") },
                minTouchTarget = false,
                modifier = Modifier.background(AiiminTheme.colors.accent),
            ) {
                Text(
                    text = "LOG →",
                    style = AiiminTheme.type.chrome,
                    color = AiiminTheme.colors.onAccent,
                    modifier = Modifier.padding(horizontal = AiiminTheme.space.s4, vertical = 10.dp),
                )
            }
        }
    }
}

@Composable
private fun DeviceStrip(
    device: DeviceMetrics,
    onRequestSteps: () -> Unit,
    onRequestScreen: () -> Unit,
    onRefresh: () -> Unit,
    onEditStepsGoal: () -> Unit,
    onEditScreenGoal: () -> Unit,
    onOpenStepsInsight: () -> Unit,
    onOpenScreenInsight: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s3),
    ) {
        SectionRule(label = "From this phone", value = "OS")
        Text(
            text = "SCREEN = DIGITAL WELLBEING DONUT  ·  LONG-PRESS DEEP  ·  TRIPLE-TAP GOAL",
            style = AiiminTheme.type.cellLabel,
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = AiiminTheme.space.s1),
        )
        Row(
            Modifier
                .fillMaxWidth()
                .height(IntrinsicSize.Min)
                .padding(top = AiiminTheme.space.s2),
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2),
        ) {
            DeviceCell(
                label = "STEPS",
                value = when (device.stepsStatus) {
                    StepsStatus.LIVE -> {
                        val s = device.steps ?: 0L
                        if (s <= 0L) "…" else "%,d".format(s)
                    }
                    StepsStatus.NEED_PERMISSION -> "ALLOW"
                    StepsStatus.UNAVAILABLE -> "—"
                    StepsStatus.COLD -> "…"
                },
                meta = when (device.stepsStatus) {
                    StepsStatus.LIVE ->
                        when {
                            device.kmWalked != null && (device.steps ?: 0L) > 0L ->
                                "%.1f km · goal %,d".format(device.kmWalked, device.stepsTarget)
                            device.stepsSource == StepsSource.HEALTH_CONNECT &&
                                device.stepsMessage == null ->
                                "goal %,d · phone".format(device.stepsTarget)
                            device.stepsSource == StepsSource.HEALTH_CONNECT ->
                                device.stepsMessage ?: "goal %,d".format(device.stepsTarget)
                            (device.steps ?: 0L) <= 0L -> "live · walk to seed"
                            else -> device.stepsMessage ?: "goal %,d".format(device.stepsTarget)
                        }
                    StepsStatus.NEED_PERMISSION -> device.stepsMessage ?: "tap to grant"
                    StepsStatus.UNAVAILABLE -> device.stepsMessage ?: "no sensor"
                    StepsStatus.COLD -> device.stepsMessage ?: "starting"
                },
                fraction = if (device.stepsStatus == StepsStatus.LIVE && (device.steps ?: 0L) > 0L) {
                    device.stepsFraction
                } else {
                    0f
                },
                live = device.stepsStatus == StepsStatus.LIVE && (device.steps ?: 0L) > 0L,
                overGoal = false,
                onClick = {
                    when (device.stepsStatus) {
                        StepsStatus.NEED_PERMISSION -> onRequestSteps()
                        else -> onRefresh()
                    }
                },
                onLongClick = onOpenStepsInsight,
                onTripleClick = onEditStepsGoal,
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight()
                    .width(0.dp),
            )
            DeviceCell(
                label = "SCREEN",
                value = when (device.screenStatus) {
                    ScreenStatus.LIVE -> device.screenHoursLabel ?: "—"
                    ScreenStatus.NEED_PERMISSION -> "ALLOW"
                    ScreenStatus.UNAVAILABLE -> "—"
                    ScreenStatus.COLD -> "…"
                },
                meta = when (device.screenStatus) {
                    ScreenStatus.LIVE -> {
                        val unlocks = device.unlockCount?.let { "$it unlocks" } ?: "DW"
                        "ceil ${device.screenTargetLabel} · $unlocks"
                    }
                    ScreenStatus.NEED_PERMISSION -> "usage access"
                    ScreenStatus.UNAVAILABLE -> device.screenMessage ?: "n/a"
                    ScreenStatus.COLD -> "starting"
                },
                fraction = if (device.screenStatus == ScreenStatus.LIVE && (device.screenTimeMs ?: 0L) > 0L) {
                    device.screenFraction
                } else {
                    0f
                },
                live = device.screenStatus == ScreenStatus.LIVE,
                overGoal = device.screenStatus == ScreenStatus.LIVE && device.screenFraction > 1f,
                onClick = {
                    when (device.screenStatus) {
                        ScreenStatus.NEED_PERMISSION -> onRequestScreen()
                        else -> onRefresh()
                    }
                },
                onLongClick = onOpenScreenInsight,
                onTripleClick = onEditScreenGoal,
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight()
                    .width(0.dp),
            )
        }
    }
}

@Composable
private fun DeviceCell(
    label: String,
    value: String,
    meta: String,
    fraction: Float,
    live: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    overGoal: Boolean = false,
    onLongClick: (() -> Unit)? = null,
    onTripleClick: (() -> Unit)? = null,
) {
    val scope = rememberCoroutineScope()
    var tapCount by remember { mutableStateOf(0) }
    var lastTapAt by remember { mutableStateOf(0L) }

    fun handleClick() {
        if (onTripleClick == null) {
            onClick()
            return
        }
        val now = System.currentTimeMillis()
        if (now - lastTapAt > 420L) tapCount = 0
        lastTapAt = now
        tapCount += 1
        val n = tapCount
        if (n >= 3) {
            tapCount = 0
            onTripleClick()
            return
        }
        scope.launch {
            kotlinx.coroutines.delay(430L)
            if (tapCount == n && n < 3) {
                tapCount = 0
                onClick()
            }
        }
    }

    val stroke = when {
        overGoal -> AiiminTheme.colors.danger
        live -> AiiminTheme.colors.accent
        else -> AiiminTheme.colors.hair
    }
    val fill = if (live) AiiminTheme.colors.tint else AiiminTheme.colors.bg
    val barFill = if (overGoal) AiiminTheme.colors.danger else AiiminTheme.colors.accent

    TapSurface(onClick = { handleClick() }, onLongClick = onLongClick, modifier = modifier) {
        Column(
            Modifier
                .fillMaxWidth()
                .fillMaxHeight()
                .heightIn(min = 104.dp)
                .border(Hairline, stroke)
                .background(fill)
                .padding(AiiminTheme.space.s3),
        ) {
            Text(
                text = label,
                style = AiiminTheme.type.cellLabel,
                color = AiiminTheme.colors.muted,
            )
            Text(
                text = value,
                style = AiiminTheme.type.mono(18.0),
                color = if (live) AiiminTheme.colors.text else AiiminTheme.colors.accent,
                modifier = Modifier.padding(top = 4.dp),
                maxLines = 1,
            )
            Text(
                text = meta.uppercase(),
                style = AiiminTheme.type.chrome.copy(fontSize = 8.5.sp, letterSpacing = 0.8.sp),
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = 4.dp),
                maxLines = 2,
                overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis,
            )
            Spacer(Modifier.weight(1f))
            Box(
                Modifier
                    .fillMaxWidth()
                    .padding(top = AiiminTheme.space.s2)
                    .height(2.dp)
                    .background(AiiminTheme.colors.hair),
            ) {
                if (fraction > 0f) {
                    Box(
                        Modifier
                            .fillMaxWidth(fraction.coerceIn(0.02f, 1f))
                            .height(2.dp)
                            .background(barFill),
                    )
                }
            }
        }
    }
}

@Composable
private fun DaySignal(quote: String, modifier: Modifier = Modifier) {
    Row(
        modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s2)
            .background(AiiminTheme.colors.surface)
            .border(Hairline, AiiminTheme.colors.rule)
            .padding(horizontal = AiiminTheme.space.s3, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
    ) {
        Text(
            text = "SIGNAL",
            style = AiiminTheme.type.cellLabel,
            color = AiiminTheme.colors.muted,
        )
        Text(
            text = quote.ifBlank { "Show up before you feel ready." },
            style = AiiminTheme.type.bodySmall,
            color = AiiminTheme.colors.text,
            modifier = Modifier.weight(1f),
            maxLines = 2,
            overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis,
        )
    }
}

@Composable
private fun StepsGoalDialog(
    goal: Long,
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
                text = "DAILY STEPS GOAL",
                style = AiiminTheme.type.cellLabel,
                color = AiiminTheme.colors.muted,
            )
            Text(
                text = "%,d".format(goal),
                style = AiiminTheme.type.mono(28.0),
                color = AiiminTheme.colors.text,
                modifier = Modifier.padding(top = AiiminTheme.space.s3),
            )
            Text(
                text = "Triple-tap STEPS on Day to reopen. Range 3,000–30,000.",
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
                    label = "− 500",
                    onClick = {
                        onAdjust(-DeviceMetricsRepository.STEPS_GOAL_STEP)
                    },
                    modifier = Modifier.weight(1f),
                )
                GhostButton(
                    label = "+ 500",
                    onClick = {
                        onAdjust(DeviceMetricsRepository.STEPS_GOAL_STEP)
                    },
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
private fun FloorWarning(entry: DayEntry) {
    val value = entry.observation.value ?: return
    Row(
        Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s3)
            .border(Hairline, AiiminTheme.colors.danger)
            .padding(AiiminTheme.space.s3),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
    ) {
        Box(
            Modifier
                .size(7.dp)
                .background(AiiminTheme.colors.danger),
        )
        Text(
            text = "Body floor ${format(entry.commitment.target)} ${entry.commitment.unit} · now ${format(value)}",
            style = AiiminTheme.type.mono(11.5),
            color = AiiminTheme.colors.text,
            modifier = Modifier.weight(1f),
        )
        Text(
            text = entry.commitment.reason.uppercase(),
            style = AiiminTheme.type.cellLabel,
            color = AiiminTheme.colors.muted,
        )
    }
}

@Composable
private fun AgendaStrip(agenda: AgendaState) {
    val events = agenda.forTodayStrip(limit = 4)
    val context = LocalContext.current
    SectionRule(label = "Agenda", value = agenda.headMeta)
    if (events.isEmpty()) {
        Text(
            text = "Pull to sync · create on the web calendar",
            style = AiiminTheme.type.bodySmall,
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = AiiminTheme.space.s2, bottom = AiiminTheme.space.s2),
        )
    } else {
        events.forEach { event -> AgendaRow(event) }
    }
    TapSurface(
        onClick = {
            context.startActivity(
                android.content.Intent(
                    android.content.Intent.ACTION_VIEW,
                    android.net.Uri.parse("https://aiimin.in/calendar"),
                ),
            )
        },
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s2, bottom = AiiminTheme.space.s2),
    ) {
        Text(
            text = "ADD ON AIIMIN.IN/CALENDAR",
            style = AiiminTheme.type.cellLabel,
            color = AiiminTheme.colors.accent,
        )
    }
}

@Composable
private fun AgendaRow(event: AgendaEvent) {
    Column {
        Row(
            Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                text = event.title,
                style = AiiminTheme.type.body,
                modifier = Modifier.weight(1f),
                maxLines = 1,
                overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis,
            )
            Text(
                text = event.whenLabel(),
                style = AiiminTheme.type.mono(10.5),
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(start = AiiminTheme.space.s3),
            )
        }
        HairRule()
    }
}

@Composable
private fun NotesStrip(notes: NoteState, onOpenNotes: () -> Unit) {
    val items = notes.pinnedFirst.take(2)
    SectionRule(label = "Notes", value = notes.headMeta)
    TapSurface(
        onClick = onOpenNotes,
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s2),
    ) {
        // TapSurface is a Box — stack children in a Column or they paint on top of each other.
        Column(
            Modifier.fillMaxWidth(),
        ) {
            if (items.isEmpty()) {
                Text(
                    text = "Park a thought · tap to open vault",
                    style = AiiminTheme.type.bodySmall,
                    color = AiiminTheme.colors.muted,
                    modifier = Modifier.padding(vertical = AiiminTheme.space.s2),
                )
            } else {
                items.forEach { note -> NoteRow(note) }
                Text(
                    text = "OPEN VAULT · ${notes.notes.size} NOTES",
                    style = AiiminTheme.type.cellLabel,
                    color = AiiminTheme.colors.accent,
                    modifier = Modifier.padding(top = AiiminTheme.space.s2, bottom = AiiminTheme.space.s2),
                )
            }
        }
    }
}

@Composable
private fun NoteRow(note: NoteItem) {
    Column {
        Column(
            Modifier
                .fillMaxWidth()
                .padding(vertical = 6.dp),
        ) {
            Text(
                text = note.title,
                style = AiiminTheme.type.body,
                maxLines = 1,
                overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis,
            )
            if (note.excerpt.isNotBlank()) {
                Text(
                    text = note.excerpt,
                    style = AiiminTheme.type.bodySmall,
                    color = AiiminTheme.colors.muted,
                    maxLines = 2,
                    overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis,
                    modifier = Modifier.padding(top = 2.dp),
                )
            }
        }
        HairRule()
    }
}

@Composable
private fun TodayScore(
    state: DayState,
    published: PublishedLifeScoreState,
    onOpenScore: () -> Unit,
) {
    if (published.available) {
        PublishedTodayScore(published, onOpenScore = onOpenScore)
    } else {
        LocalTodayScore(state, onOpenScore = onOpenScore)
    }
}

@Composable
private fun PublishedTodayScore(
    published: PublishedLifeScoreState,
    onOpenScore: () -> Unit,
) {
    TapSurface(
        onClick = onOpenScore,
        minTouchTarget = false,
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s3)
            .riseIn(120),
    ) {
        BlueprintBox(accent = true, tinted = true, legend = "Life score · published") {
            ScoreFigure(
                state = published.global.toDouble(),
                band = 0.0,
                confidence = 1.0,
            )
            Text(
                text = published.sourceLabel,
                style = AiiminTheme.type.mono(10.5),
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = AiiminTheme.space.s2),
            )
            if (published.dimensions.isNotEmpty()) {
                Row(
                    Modifier
                        .fillMaxWidth()
                        .padding(top = AiiminTheme.space.s4),
                    horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2),
                ) {
                    published.dimensions.forEach { dim ->
                        InstrumentCell(
                            label = dim.label,
                            value = dim.score.toDouble(),
                            covered = true,
                            modifier = Modifier.weight(1f),
                        )
                    }
                }
            }
            published.daysWithData?.let { days ->
                Text(
                    text = "$days DAYS WITH DATA",
                    style = AiiminTheme.type.mono(10.0),
                    color = AiiminTheme.colors.muted,
                    modifier = Modifier.padding(top = AiiminTheme.space.s3),
                )
            }
            Text(
                text = "TAP · MARK THE DAY",
                style = AiiminTheme.type.cellLabel,
                color = AiiminTheme.colors.accent,
                modifier = Modifier.padding(top = AiiminTheme.space.s3),
            )
        }
    }
}

@Composable
private fun LocalTodayScore(state: DayState, onOpenScore: () -> Unit) {
    val score = state.score
    TapSurface(
        onClick = onOpenScore,
        minTouchTarget = false,
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s3)
            .riseIn(120),
    ) {
        BlueprintBox(accent = true, tinted = true, legend = "Life score") {
            ScoreFigure(state = score.state, band = score.band, confidence = score.confidence)

            if (state.history.size >= 2) {
                TapTrajectoryLine(
                    series = state.history,
                    modifier = Modifier.padding(top = AiiminTheme.space.s3),
                )
            } else {
                Text(
                    text = trajectoryLabel(score.trajectory.direction, state.history.size),
                    style = AiiminTheme.type.mono(10.5),
                    color = AiiminTheme.colors.muted,
                    modifier = Modifier.padding(top = AiiminTheme.space.s3),
                )
            }

            Row(
                Modifier
                    .fillMaxWidth()
                    .padding(top = AiiminTheme.space.s4),
                horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2),
            ) {
                score.readings.forEach { reading ->
                    InstrumentCell(
                        label = reading.instrument.label,
                        value = reading.score,
                        covered = reading.covered,
                        modifier = Modifier.weight(1f),
                    )
                }
            }

            if (score.attribution.isNotEmpty()) {
                Text(
                    text = score.attribution.joinToString("  ·  ") { attribution ->
                        val sign = if (attribution.delta >= 0) "+" else "−"
                        "${attribution.instrument.label} $sign${kotlin.math.abs(attribution.delta).roundToInt()}"
                    },
                    style = AiiminTheme.type.mono(10.5),
                    color = AiiminTheme.colors.accent,
                    modifier = Modifier.padding(top = AiiminTheme.space.s3),
                )
            }

            Text(
                text = "TAP · MARK THE DAY",
                style = AiiminTheme.type.cellLabel,
                color = AiiminTheme.colors.accent,
                modifier = Modifier.padding(top = AiiminTheme.space.s3),
            )
        }
    }
}

@Composable
private fun MinimumRow(entry: DayEntry, onToggle: (Long) -> Unit) {
    val done = (entry.attainment ?: 0.0) >= 0.999
    val tickable = entry.commitment.shape == CommitmentShape.SHOW_UP
    val title = aiimin.core.data.cleanHabitLabel(entry.commitment.label)
        .ifBlank { entry.commitment.label }
    Column {
        TapSurface(
            onClick = { onToggle(entry.commitment.id) },
            enabled = tickable,
            modifier = Modifier.fillMaxWidth(),
        ) {
            Row(
                Modifier
                    .fillMaxWidth()
                    .padding(vertical = 10.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
            ) {
                if (tickable) {
                    Box(
                        Modifier
                            .size(16.dp)
                            .background(if (done) AiiminTheme.colors.accent else AiiminTheme.colors.surface)
                            .border(Hairline, if (done) AiiminTheme.colors.accent else AiiminTheme.colors.rule),
                    )
                } else {
                    ProgressMark(entry.attainment)
                }
                Text(
                    text = title,
                    style = AiiminTheme.type.body,
                    color = if (done) AiiminTheme.colors.muted else AiiminTheme.colors.text,
                    modifier = Modifier.weight(1f),
                    maxLines = 1,
                    overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis,
                )
                Text(
                    text = attainmentLabel(entry),
                    style = AiiminTheme.type.mono(11.0),
                    color = AiiminTheme.colors.muted,
                )
            }
        }
        HairRule()
    }
}

@Composable
private fun ProgressMark(attainment: Double?) {
    val filled = ((attainment ?: 0.0).coerceIn(0.0, 1.0)).toFloat()
    Box(
        Modifier
            .size(width = 12.dp, height = 12.dp)
            .border(Hairline, AiiminTheme.colors.rule),
        contentAlignment = Alignment.BottomStart,
    ) {
        Box(
            Modifier
                .fillMaxWidth()
                .fillMaxHeight(filled)
                .background(AiiminTheme.colors.accent),
        )
    }
}

private fun attainmentLabel(entry: DayEntry): String {
    val attainment = entry.attainment ?: return "—"
    val hold = entry.hold
    val percent = (attainment.coerceAtMost(1.0) * 100).roundToInt()
    val obs = entry.observation.value
    if (entry.commitment.unit == "steps" && obs != null) {
        return "%,d".format(obs.roundToInt())
    }
    return if (hold.observedDays == 0) "$percent%" else "$percent% · HOLD ${(hold.value * 100).roundToInt()}"
}

private fun minimumsLabel(state: DayState): String {
    val entries = state.pursuits
    val held = entries.count { (it.attainment ?: 0.0) >= 0.9 }
    return "$held OF ${entries.size}"
}

private fun trajectoryLabel(direction: Direction, days: Int): String = when {
    days < 7 -> "28 DAYS · NOT ENOUGH YET"
    direction == Direction.RISING -> "28 DAYS · RISING"
    direction == Direction.SLIPPING -> "28 DAYS · SLIPPING"
    else -> "28 DAYS · HOLDING"
}

private fun format(value: Double): String =
    if (value >= 1000) "%,d".format(value.roundToInt()) else value.toString().removeSuffix(".0")

@Preview(showBackground = true, backgroundColor = 0xFF15171A, heightDp = 1200)
@Composable
private fun TodayPreview() {
    AiiminTheme {
        TodayScreen(
            state = DayState.seed(),
            onOpenCapture = {},
            onToggle = {},
        )
    }
}
