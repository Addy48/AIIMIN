package aiimin.feature.config

import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
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
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.LocalLifecycleOwner
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import aiimin.core.data.ConfigIdentity
import aiimin.core.data.ConfigState
import aiimin.core.data.DiscoveryAction
import aiimin.core.data.DiscoveryState
import aiimin.core.data.DiscoveryTip
import aiimin.core.data.SyncState
import aiimin.core.data.device.DeviceMetrics
import aiimin.core.data.device.ScreenStatus
import aiimin.core.data.device.StepsSource
import aiimin.core.data.device.StepsStatus
import aiimin.core.data.formatInr
import aiimin.core.data.money.ConnectionKind
import aiimin.core.data.money.ConnectionsState
import aiimin.core.data.money.MoneyConnection
import aiimin.core.model.LifeMode
import aiimin.designsystem.component.GhostButton
import aiimin.designsystem.component.HairRule
import aiimin.designsystem.component.PrimaryButton
import aiimin.designsystem.component.ScreenHead
import aiimin.designsystem.component.SectionRule
import aiimin.designsystem.component.TapSurface
import aiimin.designsystem.component.Text
import aiimin.designsystem.theme.AiiminTheme
import aiimin.designsystem.theme.Hairline
import kotlinx.coroutines.launch

@Composable
fun ConfigRoute(
    onOpenOsId: () -> Unit,
    onOpenJournal: () -> Unit = {},
    onOpenEnglish: () -> Unit = {},
    onOpenNotes: () -> Unit = {},
    onOpenDiscipline: () -> Unit = {},
    onOpenNotifications: () -> Unit = {},
    onOpenSearch: () -> Unit = {},
    onOpenTimeline: () -> Unit = {},
    onOpenFamily: () -> Unit = {},
    onOpenDocuments: () -> Unit = {},
    onOpenGoals: () -> Unit = {},
    onGoHome: () -> Unit = {},
    modifier: Modifier = Modifier,
    viewModel: ConfigViewModel = hiltViewModel(),
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val device by viewModel.deviceMetrics.collectAsStateWithLifecycle()
    val discovery by viewModel.discoveryState.collectAsStateWithLifecycle()
    val openPlan by viewModel.openPlan.collectAsStateWithLifecycle()
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    var showConnections by remember { mutableStateOf(false) }
    var showPlan by remember { mutableStateOf(false) }
    var showExport by remember { mutableStateOf(false) }

    LaunchedEffect(openPlan) {
        if (openPlan) showPlan = true
    }

    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            if (event == Lifecycle.Event.ON_RESUME) viewModel.refreshDevice()
        }
        lifecycleOwner.lifecycle.addObserver(observer)
        onDispose { lifecycleOwner.lifecycle.removeObserver(observer) }
    }

    val activityLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission(),
    ) { granted ->
        if (granted) viewModel.refreshDevice()
    }

    val healthContract = remember { viewModel.healthConnectPermissionContract() }
    val healthLauncher = rememberLauncherForActivityResult(healthContract) {
        viewModel.refreshDevice()
    }

    val scope = rememberCoroutineScope()

    fun requestSteps() {
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
                    context.startActivity(viewModel.healthConnectManagePermissionsIntent())
                }
                android.os.Build.VERSION.SDK_INT >= 29 && viewModel.needsActivityPermission() -> {
                    activityLauncher.launch(android.Manifest.permission.ACTIVITY_RECOGNITION)
                }
                else -> viewModel.refreshDevice()
            }
        }
    }

    fun openNotifications() {
        val intent = android.content.Intent(
            android.provider.Settings.ACTION_APP_NOTIFICATION_SETTINGS,
        ).apply {
            putExtra(android.provider.Settings.EXTRA_APP_PACKAGE, context.packageName)
            data = android.net.Uri.parse("package:${context.packageName}")
            addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
    }

    fun openUrl(url: String) {
        context.startActivity(
            android.content.Intent(
                android.content.Intent.ACTION_VIEW,
                android.net.Uri.parse(url),
            ).addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK),
        )
    }

    fun openSupportMail() {
        context.startActivity(
            android.content.Intent(android.content.Intent.ACTION_SENDTO).apply {
                data = android.net.Uri.parse("mailto:hello@aiimin.in")
                addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK)
            },
        )
    }

    if (showConnections) {
        ConnectionsDialog(
            connections = state.connections,
            onAdd = viewModel::onAddConnection,
            onRemove = viewModel::onRemoveConnection,
            onEnableNotifications = {
                context.startActivity(
                    android.content.Intent(
                        "android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS",
                    ).addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK),
                )
            },
            onEnableSms = {
                // Money owns the runtime SMS permission + scan — jump user there via notice.
                viewModel.onOpenMoneyForSms()
                showConnections = false
            },
            onDismiss = { showConnections = false },
        )
    }

    if (showPlan) {
        val focus by viewModel.planFocus.collectAsStateWithLifecycle()
        aiimin.designsystem.component.PlanCatalogHost(
            current = state.prefs.identity.tier,
            onSelect = { viewModel.onSelectPlan(it) },
            onDismiss = {
                showPlan = false
                viewModel.onDismissPlan()
            },
            reduceMotion = state.prefs.reduceMotion,
            periodEndIso = state.prefs.identity.periodEndIso,
            upgradeOnly = state.prefs.upgradeOnly,
            focusTier = focus,
            onContinueHome = {
                showPlan = false
                viewModel.onDismissPlan()
                onGoHome()
            },
        )
    }

    ConfigScreen(
        state = state,
        device = device,
        discovery = discovery,
        onToggleTheme = viewModel::onToggleTheme,
        onToggleReduceMotion = viewModel::onToggleReduceMotion,
        onSelectMode = viewModel::onSelectMode,
        onSyncNow = viewModel::onSyncNow,
        onSignOut = viewModel::onSignOut,
        onOpenOsId = onOpenOsId,
        onOpenJournal = onOpenJournal,
        onOpenPlan = {
            showPlan = true
            viewModel.onOpenPlan()
        },
        onOpenEnglish = onOpenEnglish,
        onOpenNotes = onOpenNotes,
        onOpenDiscipline = onOpenDiscipline,
        onOpenNotifications = onOpenNotifications,
        onOpenSearch = onOpenSearch,
        onOpenTimeline = onOpenTimeline,
        onOpenFamily = onOpenFamily,
        onOpenDocuments = onOpenDocuments,
        onOpenGoals = onOpenGoals,
        onToggleBiometric = viewModel::onToggleBiometric,
        onOpenMinimums = {
            viewModel.onOpenMinimums()
            onGoHome()
        },
        onReplayCalibration = viewModel::onReplayCalibration,
        onOpenConnections = { showConnections = true },
        onExport = { showExport = true },
        onLoadTenDaySample = viewModel::loadTenDaySample,
        onClearTenDaySample = viewModel::clearTenDaySample,
        onOpenDelete = viewModel::onOpenDelete,
        onCloseDelete = viewModel::onCloseDelete,
        onDeleteDraft = viewModel::onDeleteDraft,
        onConfirmDelete = viewModel::onConfirmDelete,
        onDismissNotice = viewModel::onDismissNotice,
        onDismissDiscovery = viewModel::onDismissDiscovery,
        onDiscoveryAction = { action ->
            when (action) {
                aiimin.core.data.DiscoveryAction.OPEN_ENGLISH -> onOpenEnglish()
                aiimin.core.data.DiscoveryAction.OPEN_TODAY_INSIGHTS -> onGoHome()
                aiimin.core.data.DiscoveryAction.OPEN_EXPORT -> showExport = true
                aiimin.core.data.DiscoveryAction.OPEN_PLAN -> {
                    showPlan = true
                    viewModel.onOpenPlan()
                }
                aiimin.core.data.DiscoveryAction.OPEN_JOURNAL -> onOpenJournal()
                aiimin.core.data.DiscoveryAction.NONE -> Unit
            }
        },
        onOpenPrivacy = { openUrl("https://aiimin.in/privacy") },
        onOpenTerms = { openUrl("https://aiimin.in/terms") },
        onOpenSupport = { openSupportMail() },
        onRequestSteps = { requestSteps() },
        onRequestScreen = {
            context.startActivity(viewModel.usageAccessIntent())
        },
        modifier = modifier,
    )

    if (showExport) {
        ExportRangeDialog(
            onConfirm = { days ->
                showExport = false
                viewModel.onExport(days)
            },
            onDismiss = { showExport = false },
        )
    }
}

@Composable
private fun ExportRangeDialog(
    onConfirm: (Int) -> Unit,
    onDismiss: () -> Unit,
) {
    var selected by remember { mutableStateOf(7) }
    Dialog(onDismissRequest = onDismiss) {
        Column(
            Modifier
                .fillMaxWidth()
                .background(AiiminTheme.colors.bg)
                .border(Hairline, AiiminTheme.colors.accent)
                .padding(AiiminTheme.space.s4),
        ) {
            Text(
                text = "EXPORT EVERYTHING",
                style = AiiminTheme.type.cellLabel,
                color = AiiminTheme.colors.accent,
            )
            Text(
                text = "Structured Markdown + JSON. Identity, commitments, money, journal, and a phone-day ledger for the window you pick.",
                style = AiiminTheme.type.bodySmall.copy(fontSize = 12.sp, lineHeight = 18.sp),
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = AiiminTheme.space.s2),
            )
            Text(
                text = "WINDOW",
                style = AiiminTheme.type.cellLabel,
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = AiiminTheme.space.s4),
            )
            Row(
                Modifier
                    .fillMaxWidth()
                    .padding(top = AiiminTheme.space.s2),
                horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2),
            ) {
                listOf(7, 14, 30).forEach { days ->
                    val on = selected == days
                    TapSurface(
                        onClick = { selected = days },
                        minTouchTarget = false,
                        modifier = Modifier
                            .weight(1f)
                            .border(Hairline, if (on) AiiminTheme.colors.accent else AiiminTheme.colors.hair)
                            .background(if (on) AiiminTheme.colors.tint else AiiminTheme.colors.surface),
                    ) {
                        Text(
                            text = "${days}D",
                            style = AiiminTheme.type.mono(14.0, FontWeight.Bold),
                            color = if (on) AiiminTheme.colors.accent else AiiminTheme.colors.text,
                            textAlign = TextAlign.Center,
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 12.dp),
                        )
                    }
                }
            }
            Text(
                text = "Each day: screen-on · unlocks · pickups · peak hour · top apps · hourly buckets. Today also includes steps, walks, km.",
                style = AiiminTheme.type.bodySmall.copy(fontSize = 11.5.sp, lineHeight = 17.sp),
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = AiiminTheme.space.s3),
            )
            Row(
                Modifier
                    .fillMaxWidth()
                    .padding(top = AiiminTheme.space.s4),
                horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
            ) {
                GhostButton(label = "Cancel", onClick = onDismiss, modifier = Modifier.weight(1f))
                PrimaryButton(
                    label = "Export ${selected}d",
                    onClick = { onConfirm(selected) },
                    modifier = Modifier.weight(1f),
                )
            }
        }
    }
}

@Composable
private fun ConnectionsDialog(
    connections: ConnectionsState,
    onAdd: (String, ConnectionKind) -> Unit,
    onRemove: (String) -> Unit,
    onEnableNotifications: () -> Unit,
    onEnableSms: () -> Unit,
    onDismiss: () -> Unit,
) {
    var draft by remember { mutableStateOf("") }
    var kind by remember { mutableStateOf(ConnectionKind.BANK) }
    Dialog(onDismissRequest = onDismiss) {
        Column(
            Modifier
                .fillMaxWidth()
                .background(AiiminTheme.colors.surface)
                .border(Hairline, AiiminTheme.colors.rule)
                .padding(AiiminTheme.space.s4)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
        ) {
            Text(
                text = "YOUR ACCOUNTS",
                style = AiiminTheme.type.cellLabel,
                color = AiiminTheme.colors.accent,
            )
            Text(
                text = "Add the banks and UPI apps you actually use. Nothing is pre-filled — other people's labels (HDFC / Fi / Google) are gone.",
                style = AiiminTheme.type.bodySmall,
                color = AiiminTheme.colors.muted,
            )
            if (connections.items.isEmpty()) {
                Text(
                    text = "No accounts yet.",
                    style = AiiminTheme.type.body,
                    color = AiiminTheme.colors.muted,
                )
            } else {
                connections.items.forEach { item ->
                    ConnectionRow(item, onRemove = { onRemove(item.id) })
                }
            }
            Text(
                text = "ADD",
                style = AiiminTheme.type.cellLabel,
                color = AiiminTheme.colors.muted,
            )
            Row(horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2)) {
                ConnectionKind.entries.forEach { k ->
                    TapSurface(
                        onClick = { kind = k },
                        modifier = Modifier
                            .border(
                                Hairline,
                                if (kind == k) AiiminTheme.colors.accent else AiiminTheme.colors.hair,
                            )
                            .padding(horizontal = 8.dp, vertical = 6.dp),
                    ) {
                        Text(
                            text = k.label,
                            style = AiiminTheme.type.button,
                            color = if (kind == k) AiiminTheme.colors.accent else AiiminTheme.colors.muted,
                        )
                    }
                }
            }
            BasicTextField(
                value = draft,
                onValueChange = { draft = it },
                singleLine = true,
                textStyle = AiiminTheme.type.body.copy(color = AiiminTheme.colors.text),
                cursorBrush = SolidColor(AiiminTheme.colors.accent),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(Hairline, AiiminTheme.colors.rule)
                    .padding(horizontal = AiiminTheme.space.s3, vertical = 10.dp),
                decorationBox = { inner ->
                    if (draft.isEmpty()) {
                        Text(
                            text = "e.g. SBI salary · PhonePe · Amex",
                            style = AiiminTheme.type.body,
                            color = AiiminTheme.colors.muted,
                        )
                    }
                    inner()
                },
            )
            PrimaryButton(
                label = "Add account",
                onClick = {
                    onAdd(draft, kind)
                    draft = ""
                },
                enabled = draft.isNotBlank(),
                modifier = Modifier.fillMaxWidth(),
            )
            HairRule()
            Text(
                text = "PAYMENT ALERTS",
                style = AiiminTheme.type.cellLabel,
                color = AiiminTheme.colors.muted,
            )
            Text(
                text = "SMS · notification access · share/paste · Excel/AI. OTP never queued. Drafts need Approve unless signed-in bulk import.",
                style = AiiminTheme.type.bodySmall,
                color = AiiminTheme.colors.muted,
            )
            GhostButton(
                label = "Enable SMS · Money",
                onClick = onEnableSms,
                modifier = Modifier.fillMaxWidth(),
            )
            GhostButton(
                label = "Notification access",
                onClick = onEnableNotifications,
                modifier = Modifier.fillMaxWidth(),
            )
            GhostButton(
                label = "Close",
                onClick = onDismiss,
                color = AiiminTheme.colors.muted,
                modifier = Modifier.fillMaxWidth(),
            )
        }
    }
}

@Composable
private fun ConnectionRow(item: MoneyConnection, onRemove: () -> Unit) {
    Row(
        Modifier
            .fillMaxWidth()
            .border(Hairline, AiiminTheme.colors.hair)
            .padding(horizontal = AiiminTheme.space.s3, vertical = AiiminTheme.space.s2),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        val fill = Modifier.weight(1f)
        Column(fill) {
            Text(text = item.label, style = AiiminTheme.type.body)
            Text(
                text = item.kind.label,
                style = AiiminTheme.type.cellLabel,
                color = AiiminTheme.colors.muted,
            )
        }
        TapSurface(onClick = onRemove) {
            Text(
                text = "REMOVE",
                style = AiiminTheme.type.button,
                color = AiiminTheme.colors.danger,
                modifier = Modifier.padding(AiiminTheme.space.s2),
            )
        }
    }
}

/**
 * **One job: configure the OS.**
 *
 * Inspiration (settings IA only — Drafting Table palette locked):
 * profile hero · ALL-CAPS section groups · icon + label + value/› rows ·
 * toggle on preference · version footer. No cream, no rainbow icon discs,
 * no navy/gold UI accents — steel `#749dc4` only; peak-A on brand mark.
 *
 * Live steps/screen figures live on Today; deep phone-day read lives on Lab.
 */
@Composable
fun ConfigScreen(
    state: ConfigUiState,
    onToggleTheme: () -> Unit,
    onToggleReduceMotion: () -> Unit,
    onSelectMode: (LifeMode) -> Unit,
    onSyncNow: () -> Unit,
    onSignOut: () -> Unit = {},
    onOpenOsId: () -> Unit,
    onOpenJournal: () -> Unit = {},
    onOpenPlan: () -> Unit = {},
    onOpenEnglish: () -> Unit = {},
    onOpenNotes: () -> Unit = {},
    onOpenDiscipline: () -> Unit = {},
    onOpenNotifications: () -> Unit = {},
    onOpenSearch: () -> Unit = {},
    onOpenTimeline: () -> Unit = {},
    onOpenFamily: () -> Unit = {},
    onOpenDocuments: () -> Unit = {},
    onOpenGoals: () -> Unit = {},
    onToggleBiometric: () -> Unit = {},
    onOpenMinimums: () -> Unit,
    onReplayCalibration: () -> Unit,
    onOpenConnections: () -> Unit,
    onExport: () -> Unit,
    onLoadTenDaySample: () -> Unit = {},
    onClearTenDaySample: () -> Unit = {},
    onOpenDelete: () -> Unit,
    onCloseDelete: () -> Unit,
    onDeleteDraft: (String) -> Unit,
    onConfirmDelete: () -> Unit,
    onDismissNotice: () -> Unit,
    discovery: DiscoveryState = DiscoveryState(tips = emptyList(), unread = 0),
    onDismissDiscovery: (String) -> Unit = {},
    onDiscoveryAction: (DiscoveryAction) -> Unit = {},
    onOpenPrivacy: () -> Unit = {},
    onOpenTerms: () -> Unit = {},
    onOpenSupport: () -> Unit = {},
    device: DeviceMetrics = DeviceMetrics.cold(),
    onRequestSteps: () -> Unit = {},
    onRequestScreen: () -> Unit = {},
    modifier: Modifier = Modifier,
) {
    val prefs = state.prefs
    Column(
        modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = AiiminTheme.space.page)
            .padding(bottom = AiiminTheme.space.s8 + AiiminTheme.space.s6),
    ) {
        ScreenHead(
            title = "Configuration",
            meta = if (prefs.isSeed) "SEED" else null,
        )
        Text(
            text = "Identity, sync, this phone, and the levers that shape the OS.",
            style = AiiminTheme.type.bodySmall.copy(fontSize = 12.sp, lineHeight = 18.sp),
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = AiiminTheme.space.s2),
        )

        prefs.notice?.let { notice ->
            LaunchedEffect(notice.message) {
                kotlinx.coroutines.delay(4_200)
                onDismissNotice()
            }
            Text(
                text = notice.message,
                style = AiiminTheme.type.bodySmall,
                color = AiiminTheme.colors.accent,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = AiiminTheme.space.s3)
                    .border(Hairline, AiiminTheme.colors.accent)
                    .background(AiiminTheme.colors.tint)
                    .padding(AiiminTheme.space.s3),
            )
        }

        ProfileBlock(prefs.identity, onOpenOsId)
        LifeArc(prefs.identity.arc)

        SectionRule(label = "Account")
        PrefList {
            PrefRow(
                label = "Subscription",
                glyph = PrefGlyph.Plan,
                trailing = {
                    aiimin.designsystem.component.PlanStatusChip(
                        tier = prefs.identity.tier,
                        onClick = onOpenPlan,
                        periodEndIso = prefs.identity.periodEndIso,
                    )
                },
                onClick = onOpenPlan,
            )
            PrefRow(
                label = "Replay calibration",
                glyph = PrefGlyph.Calibrate,
                value = "6 steps",
                onClick = onReplayCalibration,
                last = true,
            )
        }
        Text(
            text = prefs.identity.tier.soul.description + " · tap plan to change · same ladder as aiimin.in",
            style = AiiminTheme.type.bodySmall.copy(fontSize = 11.sp, lineHeight = 16.sp),
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = AiiminTheme.space.s2, bottom = AiiminTheme.space.s2),
        )

        SectionRule(label = "Life mode")
        ModeStrip(selected = state.lifeMode, onSelect = onSelectMode)

        SectionRule(label = "Preferences")
        PrefList {
            PrefRow(
                label = "Appearance",
                glyph = PrefGlyph.Appearance,
                value = prefs.themeName,
                valueAccent = true,
                onClick = onToggleTheme,
            )
            PrefRow(
                label = "Reduce motion",
                glyph = PrefGlyph.Motion,
                trailing = {
                    MotionToggle(on = prefs.reduceMotion, onToggle = onToggleReduceMotion)
                },
            )
            PrefRow(
                label = "Notifications",
                glyph = PrefGlyph.Bell,
                value = prefs.notificationsLabel,
                onClick = onOpenNotifications,
            )
            PrefRow(
                label = "Daily minimums",
                glyph = PrefGlyph.Minimums,
                value = prefs.minimumsLabel,
                onClick = onOpenMinimums,
            )
            PrefRow(
                label = "Journal",
                glyph = PrefGlyph.Journal,
                value = "Write · optional prompts",
                onClick = onOpenJournal,
            )
            PrefRow(
                label = "Notes",
                glyph = PrefGlyph.Notes,
                value = "Park thoughts",
                onClick = onOpenNotes,
            )
            PrefRow(
                label = "Discipline",
                glyph = PrefGlyph.Minimums,
                value = "Private behavior log",
                onClick = onOpenDiscipline,
            )
            PrefRow(
                label = "English · Spark",
                glyph = PrefGlyph.Speak,
                value = "60s speaking",
                onClick = onOpenEnglish,
                last = true,
            )
        }

        SectionRule(label = "Graph")
        PrefList {
            PrefRow(
                label = "Search",
                glyph = PrefGlyph.Search,
                value = "Notes · journal · money",
                onClick = onOpenSearch,
            )
            PrefRow(
                label = "Timeline",
                glyph = PrefGlyph.Timeline,
                value = "Chronology",
                onClick = onOpenTimeline,
            )
            PrefRow(
                label = "Family",
                glyph = PrefGlyph.Family,
                value = "Shared care",
                onClick = onOpenFamily,
            )
            PrefRow(
                label = "Documents",
                glyph = PrefGlyph.Docs,
                value = "Resumes",
                onClick = onOpenDocuments,
            )
            PrefRow(
                label = "Goals",
                glyph = PrefGlyph.Goals,
                value = "List · edit on web",
                onClick = onOpenGoals,
                last = true,
            )
        }

        SectionRule(label = "This phone")
        Text(
            text = "Screen ≈ Digital Wellbeing (AOD-trimmed). Steps = Health Connect phone stream. Live figures on Day.",
            style = AiiminTheme.type.bodySmall.copy(fontSize = 11.5.sp, lineHeight = 17.sp),
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = AiiminTheme.space.s2, bottom = AiiminTheme.space.s2),
        )
        PrefList {
            PrefRow(
                label = "Unlock with biometrics",
                glyph = PrefGlyph.Lock,
                value = when {
                    prefs.biometricEnabled && !prefs.isSeed ->
                        "On · unlock ${prefs.identity.osId}"
                    prefs.biometricEnabled -> "On · unlock OS-ID"
                    else -> "Off · PIN"
                },
                trailing = {
                    MotionToggle(on = prefs.biometricEnabled, onToggle = onToggleBiometric)
                },
            )
            PrefRow(
                label = "Steps · Health Connect",
                glyph = PrefGlyph.Steps,
                value = when {
                    device.stepsSource == StepsSource.HEALTH_CONNECT && device.steps != null ->
                        "%,d".format(device.steps)
                    device.stepsStatus == StepsStatus.NEED_PERMISSION -> "Needed"
                    device.stepsStatus == StepsStatus.LIVE -> grantLabel(true, false)
                    device.hcBackgroundRead -> "On · none today"
                    else -> grantLabel(false, device.stepsStatus == StepsStatus.NEED_PERMISSION)
                },
                valueAccent = device.stepsStatus == StepsStatus.NEED_PERMISSION,
                onClick = onRequestSteps,
            )
            PrefRow(
                label = "Steps · background",
                glyph = PrefGlyph.Steps,
                value = when {
                    !device.hcBackgroundRead &&
                        device.stepsStatus == StepsStatus.NEED_PERMISSION -> "After steps grant"
                    device.hcBackgroundRead -> "On · locked poll"
                    else -> "Needed · 15s while locked"
                },
                valueAccent = !device.hcBackgroundRead &&
                    device.stepsStatus != StepsStatus.NEED_PERMISSION,
                onClick = onRequestSteps,
            )
            PrefRow(
                label = "Usage access",
                glyph = PrefGlyph.Screen,
                value = grantLabel(
                    device.screenStatus == ScreenStatus.LIVE,
                    device.screenStatus == ScreenStatus.NEED_PERMISSION,
                ),
                valueAccent = device.screenStatus == ScreenStatus.NEED_PERMISSION,
                onClick = onRequestScreen,
                last = true,
            )
        }

        SectionRule(
            label = "Data & sync",
            value = prefs.sync.label,
            valueColor = if (prefs.sync == SyncState.LIVE) AiiminTheme.colors.accent else AiiminTheme.colors.muted,
        )
        SyncCard(prefs, onSyncNow, onSignOut)
        PrefList {
            PrefRow(
                label = "Connections",
                glyph = PrefGlyph.Bank,
                value = prefs.connectionsLabel,
                onClick = onOpenConnections,
            )
            PrefRow(
                label = "Load 10-day sample",
                glyph = PrefGlyph.Sample,
                value = "QA · almost-true past",
                onClick = onLoadTenDaySample,
            )
            PrefRow(
                label = "Clear sample",
                glyph = PrefGlyph.Clear,
                value = "Restore seed Lab",
                onClick = onClearTenDaySample,
            )
            PrefRow(
                label = "Export everything",
                glyph = PrefGlyph.Export,
                value = "7 · 14 · 30d",
                onClick = onExport,
            )
            PrefRow(
                label = "Delete account",
                glyph = PrefGlyph.Delete,
                danger = true,
                onClick = onOpenDelete,
                last = true,
            )
        }

        if (prefs.deleteOpen) {
            DeleteVeil(
                draft = prefs.deleteDraft,
                onDraft = onDeleteDraft,
                onConfirm = onConfirmDelete,
                onCancel = onCloseDelete,
            )
        }

        if (discovery.tips.isNotEmpty()) {
            SectionRule(
                label = "Find your way",
                value = "${discovery.unread}",
                valueColor = AiiminTheme.colors.accent,
            )
            discovery.tips.forEach { tip ->
                DiscoveryTipCard(
                    tip = tip,
                    onAction = { onDiscoveryAction(tip.action) },
                    onDismiss = { onDismissDiscovery(tip.id) },
                )
            }
        }

        SectionRule(label = "Support")
        PrefList {
            PrefRow(
                label = "Privacy",
                glyph = PrefGlyph.Privacy,
                value = "aiimin.in/privacy",
                onClick = onOpenPrivacy,
            )
            PrefRow(
                label = "Terms",
                glyph = PrefGlyph.Terms,
                value = "aiimin.in/terms",
                onClick = onOpenTerms,
            )
            PrefRow(
                label = "Support",
                glyph = PrefGlyph.Support,
                value = "hello@aiimin.in",
                onClick = onOpenSupport,
                last = true,
            )
        }

        Text(
            text = prefs.buildLabel,
            style = AiiminTheme.type.mono(10.0),
            color = AiiminTheme.colors.muted,
            textAlign = TextAlign.Center,
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s6),
        )
    }
}

private fun grantLabel(on: Boolean, need: Boolean): String = when {
    need -> "Needed"
    on -> "On"
    else -> "Off"
}

@Composable
private fun PrefList(content: @Composable () -> Unit) {
    // Drafting Table Config: flat hair rows — not a boxed surface card.
    Column(
        Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s2),
    ) {
        content()
    }
}

@Composable
private fun ProfileBlock(
    identity: ConfigIdentity,
    onOpenOsId: () -> Unit,
) {
    val initials = remember(identity.name) {
        identity.name
            .split(Regex("\\s+"))
            .filter { it.isNotBlank() }
            .take(2)
            .mapNotNull { it.firstOrNull()?.uppercaseChar()?.toString() }
            .joinToString("")
            .ifBlank { "AU" }
    }
    Column(
        Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s6)
            .border(Hairline, AiiminTheme.colors.hair),
    ) {
        TapSurface(
            onClick = onOpenOsId,
            minTouchTarget = false,
            modifier = Modifier.fillMaxWidth(),
        ) {
            Row(
                Modifier
                    .fillMaxWidth()
                    .padding(AiiminTheme.space.s4),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s4),
            ) {
                Box(
                    Modifier
                        .size(48.dp)
                        .border(Hairline, AiiminTheme.colors.accent.copy(alpha = 0.55f), CircleShape)
                        .background(AiiminTheme.colors.tint, CircleShape),
                    contentAlignment = Alignment.Center,
                ) {
                    Text(
                        text = initials,
                        style = AiiminTheme.type.mono(14.0, FontWeight.Bold),
                        color = AiiminTheme.colors.accent,
                    )
                }
                Column(Modifier.weight(1f)) {
                    Text(
                        text = identity.name,
                        style = AiiminTheme.type.body.copy(
                            fontWeight = FontWeight.Medium,
                            fontSize = 16.sp,
                            lineHeight = 22.sp,
                        ),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                    )
                    Text(
                        text = identity.osId,
                        style = AiiminTheme.type.mono(11.0),
                        color = AiiminTheme.colors.muted,
                        modifier = Modifier.padding(top = 3.dp),
                    )
                    identity.email?.takeIf { it.isNotBlank() }?.let { mail ->
                        Text(
                            text = mail,
                            style = AiiminTheme.type.mono(10.0),
                            color = AiiminTheme.colors.muted,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                            modifier = Modifier.padding(top = 2.dp),
                        )
                    }
                }
                Text(
                    text = "›",
                    style = AiiminTheme.type.chrome.copy(fontSize = 18.sp),
                    color = AiiminTheme.colors.muted,
                )
            }
        }
        HairRule()
        Column(
            Modifier
                .fillMaxWidth()
                .padding(horizontal = AiiminTheme.space.s4, vertical = AiiminTheme.space.s3),
        ) {
            Row(
                Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Bottom,
            ) {
                Text(
                    text = "RANK ${identity.rankNo}/${identity.rankTotal} · ${identity.rank}",
                    style = AiiminTheme.type.cellLabel,
                    color = AiiminTheme.colors.accent,
                )
                Text(
                    text = "${formatInr(identity.xp).removePrefix("₹")} XP",
                    style = AiiminTheme.type.mono(11.0, FontWeight.Medium),
                )
            }
            Box(
                Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp)
                    .height(2.dp)
                    .background(AiiminTheme.colors.hair),
            ) {
                Box(
                    Modifier
                        .fillMaxHeight()
                        .fillMaxWidth(identity.xpPct.coerceIn(0f, 1f))
                        .background(AiiminTheme.colors.accent),
                )
            }
            Text(
                text = "${formatInr(identity.xpToNext).removePrefix("₹")} XP TO ${identity.nextRank}",
                style = AiiminTheme.type.mono(9.5),
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = 5.dp),
            )
        }
    }
}

@Composable
private fun LifeArc(arc: String) {
    Row(
        Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s4)
            .height(IntrinsicSize.Min)
            .background(AiiminTheme.colors.tint)
            .border(Hairline, AiiminTheme.colors.accent.copy(alpha = 0.55f)),
    ) {
        Box(
            Modifier
                .width(3.dp)
                .fillMaxHeight()
                .background(AiiminTheme.colors.accent),
        )
        Column(
            Modifier
                .weight(1f)
                .padding(AiiminTheme.space.s3),
        ) {
            Text(
                text = "LIFE ARC",
                style = AiiminTheme.type.cellLabel,
                color = AiiminTheme.colors.accent,
            )
            Text(
                text = arc,
                style = AiiminTheme.type.body.copy(fontSize = 14.sp, lineHeight = 20.sp),
                modifier = Modifier.padding(top = 6.dp),
            )
        }
    }
}

@Composable
private fun ModeStrip(selected: LifeMode, onSelect: (LifeMode) -> Unit) {
    Row(
        Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s3)
            .height(IntrinsicSize.Min)
            .border(Hairline, AiiminTheme.colors.hair),
    ) {
        LifeMode.entries.forEachIndexed { i, mode ->
            val on = mode == selected
            if (i > 0) {
                Box(
                    Modifier
                        .width(Hairline)
                        .fillMaxHeight()
                        .background(AiiminTheme.colors.hair),
                )
            }
            TapSurface(
                onClick = { onSelect(mode) },
                minTouchTarget = false,
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight()
                    .background(if (on) AiiminTheme.colors.tint else AiiminTheme.colors.surface),
            ) {
                Text(
                    text = mode.label,
                    style = AiiminTheme.type.chrome.copy(fontSize = 9.5.sp, letterSpacing = 1.sp),
                    color = if (on) AiiminTheme.colors.accent else AiiminTheme.colors.muted,
                    textAlign = TextAlign.Center,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 12.dp, horizontal = 2.dp),
                )
            }
        }
    }
}

@Composable
private fun SyncCard(
    prefs: ConfigState,
    onSyncNow: () -> Unit,
    onSignOut: () -> Unit,
) {
    Column(
        Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s3)
            .border(Hairline, AiiminTheme.colors.hair)
            .background(AiiminTheme.colors.surface)
            .padding(AiiminTheme.space.s4),
    ) {
        Row(
            Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Column(Modifier.weight(1f)) {
                Text(text = "aiimin.in", style = AiiminTheme.type.body.copy(fontWeight = FontWeight.Medium))
                Text(
                    text = prefs.syncMeta,
                    style = AiiminTheme.type.mono(10.0),
                    color = AiiminTheme.colors.muted,
                    modifier = Modifier.padding(top = 2.dp),
                )
                prefs.identity.email?.takeIf { it.isNotBlank() }?.let { mail ->
                    Text(
                        text = mail,
                        style = AiiminTheme.type.mono(10.0),
                        color = AiiminTheme.colors.muted,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                        modifier = Modifier.padding(top = 2.dp),
                    )
                }
            }
            GhostButton(
                label = if (prefs.sync == SyncState.SYNCING) "SYNCING" else "Sync",
                onClick = onSyncNow,
                enabled = prefs.sync != SyncState.SYNCING,
            )
        }
        HairRule(Modifier.padding(vertical = AiiminTheme.space.s3))
        Text(
            text = "Capture through the week on the phone. Sunday, the site opens the full drawing — charts, reports, the Lab.",
            style = AiiminTheme.type.bodySmall.copy(fontSize = 11.5.sp, lineHeight = 18.sp),
            color = AiiminTheme.colors.muted,
        )
        GhostButton(
            label = "Sign out",
            onClick = onSignOut,
            modifier = Modifier
                .padding(top = AiiminTheme.space.s3)
                .fillMaxWidth(),
        )
    }
}

@Composable
private fun DiscoveryTipCard(
    tip: DiscoveryTip,
    onAction: () -> Unit,
    onDismiss: () -> Unit,
) {
    Column(
        Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s3)
            .border(Hairline, AiiminTheme.colors.hair)
            .background(AiiminTheme.colors.surface)
            .padding(AiiminTheme.space.s3),
    ) {
        Text(
            text = tip.title.uppercase(),
            style = AiiminTheme.type.cellLabel,
            color = AiiminTheme.colors.accent,
        )
        Text(
            text = tip.body,
            style = AiiminTheme.type.bodySmall.copy(fontSize = 12.sp, lineHeight = 18.sp),
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = AiiminTheme.space.s2),
        )
        Row(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s3),
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            TapSurface(
                onClick = onAction,
                minTouchTarget = false,
                modifier = Modifier.background(AiiminTheme.colors.accent),
            ) {
                Text(
                    text = tip.actionLabel,
                    style = AiiminTheme.type.chrome,
                    color = AiiminTheme.colors.onAccent,
                    modifier = Modifier.padding(horizontal = AiiminTheme.space.s3, vertical = 8.dp),
                )
            }
            TapSurface(onClick = onDismiss, minTouchTarget = false) {
                Text(
                    text = "DISMISS",
                    style = AiiminTheme.type.button,
                    color = AiiminTheme.colors.muted,
                    modifier = Modifier.padding(AiiminTheme.space.s2),
                )
            }
        }
    }
}

@Composable
private fun PrefRow(
    label: String,
    value: String? = null,
    valueAccent: Boolean = false,
    danger: Boolean = false,
    last: Boolean = false,
    glyph: PrefGlyph? = null,
    onClick: (() -> Unit)? = null,
    trailing: (@Composable () -> Unit)? = null,
) {
    Column(Modifier.fillMaxWidth()) {
        val row = @Composable {
            Row(
                Modifier
                    .fillMaxWidth()
                    .heightIn(min = 52.dp)
                    .padding(vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
            ) {
                if (glyph != null) {
                    PrefGlyphMark(
                        glyph = glyph,
                        tint = if (danger) AiiminTheme.colors.danger else AiiminTheme.colors.accent,
                    )
                }
                Text(
                    text = label,
                    style = AiiminTheme.type.body,
                    color = if (danger) AiiminTheme.colors.danger else AiiminTheme.colors.text,
                    modifier = Modifier.weight(1f),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
                trailing?.invoke()
                if (value != null) {
                    Text(
                        text = value,
                        style = AiiminTheme.type.bodySmall,
                        color = when {
                            danger -> AiiminTheme.colors.danger
                            valueAccent -> AiiminTheme.colors.accent
                            else -> AiiminTheme.colors.muted
                        },
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                    )
                }
                if (onClick != null && trailing == null) {
                    Text(
                        text = "›",
                        style = AiiminTheme.type.chrome.copy(fontSize = 16.sp),
                        color = AiiminTheme.colors.muted,
                    )
                }
            }
        }
        if (onClick != null) {
            TapSurface(onClick = onClick, minTouchTarget = false, modifier = Modifier.fillMaxWidth()) {
                row()
            }
        } else {
            row()
        }
        if (!last) HairRule()
    }
}

/** Steel outline glyphs — inspiration from settings rows; Drafting Table stroke language. */
private enum class PrefGlyph {
    Plan, Calibrate, Appearance, Motion, Bell, Minimums, Journal, Notes, Speak,
    Search, Timeline, Family, Docs, Goals, Lock,
    Steps, Screen, Bank, Sample, Clear, Export, Delete, Privacy, Terms, Support,
}

@Composable
private fun PrefGlyphMark(glyph: PrefGlyph, tint: Color) {
    Canvas(Modifier.size(22.dp)) {
        val s = size.minDimension
        val stroke = Stroke(width = s * 0.08f, cap = StrokeCap.Round)
        when (glyph) {
            PrefGlyph.Plan -> {
                drawCircle(tint, radius = s * 0.36f, style = stroke)
                drawCircle(tint, radius = s * 0.12f)
            }
            PrefGlyph.Calibrate -> {
                drawLine(tint, Offset(s * 0.2f, s * 0.5f), Offset(s * 0.8f, s * 0.5f), strokeWidth = stroke.width, cap = StrokeCap.Round)
                drawLine(tint, Offset(s * 0.5f, s * 0.2f), Offset(s * 0.5f, s * 0.8f), strokeWidth = stroke.width, cap = StrokeCap.Round)
                drawCircle(tint, radius = s * 0.18f, style = stroke)
            }
            PrefGlyph.Appearance -> {
                drawCircle(tint, radius = s * 0.36f, style = stroke)
                drawArc(
                    color = tint,
                    startAngle = -90f,
                    sweepAngle = 180f,
                    useCenter = true,
                    topLeft = Offset(s * 0.14f, s * 0.14f),
                    size = androidx.compose.ui.geometry.Size(s * 0.72f, s * 0.72f),
                )
            }
            PrefGlyph.Motion -> {
                val p = Path().apply {
                    moveTo(s * 0.22f, s * 0.7f)
                    lineTo(s * 0.4f, s * 0.3f)
                    lineTo(s * 0.55f, s * 0.55f)
                    lineTo(s * 0.78f, s * 0.25f)
                }
                drawPath(p, tint, style = stroke)
            }
            PrefGlyph.Bell -> {
                drawArc(
                    color = tint,
                    startAngle = 200f,
                    sweepAngle = 140f,
                    useCenter = false,
                    topLeft = Offset(s * 0.22f, s * 0.18f),
                    size = androidx.compose.ui.geometry.Size(s * 0.56f, s * 0.5f),
                    style = stroke,
                )
                drawLine(tint, Offset(s * 0.28f, s * 0.62f), Offset(s * 0.72f, s * 0.62f), strokeWidth = stroke.width)
                drawCircle(tint, radius = s * 0.06f, center = Offset(s * 0.5f, s * 0.78f))
            }
            PrefGlyph.Minimums -> {
                drawRect(
                    tint,
                    topLeft = Offset(s * 0.2f, s * 0.55f),
                    size = androidx.compose.ui.geometry.Size(s * 0.18f, s * 0.25f),
                    style = stroke,
                )
                drawRect(
                    tint,
                    topLeft = Offset(s * 0.41f, s * 0.35f),
                    size = androidx.compose.ui.geometry.Size(s * 0.18f, s * 0.45f),
                    style = stroke,
                )
                drawRect(
                    tint,
                    topLeft = Offset(s * 0.62f, s * 0.22f),
                    size = androidx.compose.ui.geometry.Size(s * 0.18f, s * 0.58f),
                    style = stroke,
                )
            }
            PrefGlyph.Search -> {
                drawCircle(tint, radius = s * 0.22f, center = Offset(s * 0.4f, s * 0.4f), style = stroke)
                drawLine(tint, Offset(s * 0.56f, s * 0.56f), Offset(s * 0.78f, s * 0.78f), strokeWidth = stroke.width, cap = StrokeCap.Round)
            }
            PrefGlyph.Timeline -> {
                drawLine(tint, Offset(s * 0.25f, s * 0.3f), Offset(s * 0.75f, s * 0.3f), strokeWidth = stroke.width)
                drawLine(tint, Offset(s * 0.25f, s * 0.5f), Offset(s * 0.75f, s * 0.5f), strokeWidth = stroke.width)
                drawLine(tint, Offset(s * 0.25f, s * 0.7f), Offset(s * 0.55f, s * 0.7f), strokeWidth = stroke.width)
            }
            PrefGlyph.Family -> {
                drawCircle(tint, radius = s * 0.12f, center = Offset(s * 0.35f, s * 0.38f), style = stroke)
                drawCircle(tint, radius = s * 0.12f, center = Offset(s * 0.65f, s * 0.38f), style = stroke)
                drawLine(tint, Offset(s * 0.22f, s * 0.72f), Offset(s * 0.78f, s * 0.72f), strokeWidth = stroke.width)
            }
            PrefGlyph.Lock -> {
                drawRect(
                    tint,
                    topLeft = Offset(s * 0.28f, s * 0.42f),
                    size = androidx.compose.ui.geometry.Size(s * 0.44f, s * 0.36f),
                    style = stroke,
                )
                drawArc(
                    color = tint,
                    startAngle = 200f,
                    sweepAngle = 140f,
                    useCenter = false,
                    topLeft = Offset(s * 0.34f, s * 0.18f),
                    size = androidx.compose.ui.geometry.Size(s * 0.32f, s * 0.32f),
                    style = stroke,
                )
            }
            PrefGlyph.Journal, PrefGlyph.Notes, PrefGlyph.Terms, PrefGlyph.Docs, PrefGlyph.Goals -> {
                drawRect(
                    tint,
                    topLeft = Offset(s * 0.25f, s * 0.15f),
                    size = androidx.compose.ui.geometry.Size(s * 0.5f, s * 0.7f),
                    style = stroke,
                )
                drawLine(tint, Offset(s * 0.35f, s * 0.35f), Offset(s * 0.65f, s * 0.35f), strokeWidth = stroke.width)
                drawLine(tint, Offset(s * 0.35f, s * 0.5f), Offset(s * 0.65f, s * 0.5f), strokeWidth = stroke.width)
            }
            PrefGlyph.Speak -> {
                drawCircle(tint, radius = s * 0.16f, center = Offset(s * 0.35f, s * 0.5f), style = stroke)
                drawArc(
                    color = tint,
                    startAngle = -40f,
                    sweepAngle = 80f,
                    useCenter = false,
                    topLeft = Offset(s * 0.35f, s * 0.2f),
                    size = androidx.compose.ui.geometry.Size(s * 0.45f, s * 0.6f),
                    style = stroke,
                )
            }
            PrefGlyph.Steps -> {
                drawCircle(tint, radius = s * 0.1f, center = Offset(s * 0.32f, s * 0.35f))
                drawCircle(tint, radius = s * 0.1f, center = Offset(s * 0.62f, s * 0.55f))
                drawLine(tint, Offset(s * 0.38f, s * 0.42f), Offset(s * 0.55f, s * 0.5f), strokeWidth = stroke.width)
            }
            PrefGlyph.Screen -> {
                drawRect(
                    tint,
                    topLeft = Offset(s * 0.28f, s * 0.15f),
                    size = androidx.compose.ui.geometry.Size(s * 0.44f, s * 0.7f),
                    style = stroke,
                )
                drawLine(tint, Offset(s * 0.4f, s * 0.75f), Offset(s * 0.6f, s * 0.75f), strokeWidth = stroke.width)
            }
            PrefGlyph.Bank -> {
                drawLine(tint, Offset(s * 0.2f, s * 0.35f), Offset(s * 0.5f, s * 0.18f), strokeWidth = stroke.width)
                drawLine(tint, Offset(s * 0.5f, s * 0.18f), Offset(s * 0.8f, s * 0.35f), strokeWidth = stroke.width)
                drawLine(tint, Offset(s * 0.28f, s * 0.38f), Offset(s * 0.28f, s * 0.7f), strokeWidth = stroke.width)
                drawLine(tint, Offset(s * 0.5f, s * 0.38f), Offset(s * 0.5f, s * 0.7f), strokeWidth = stroke.width)
                drawLine(tint, Offset(s * 0.72f, s * 0.38f), Offset(s * 0.72f, s * 0.7f), strokeWidth = stroke.width)
                drawLine(tint, Offset(s * 0.2f, s * 0.75f), Offset(s * 0.8f, s * 0.75f), strokeWidth = stroke.width)
            }
            PrefGlyph.Sample, PrefGlyph.Export -> {
                drawRect(
                    tint,
                    topLeft = Offset(s * 0.28f, s * 0.22f),
                    size = androidx.compose.ui.geometry.Size(s * 0.44f, s * 0.56f),
                    style = stroke,
                )
                drawLine(tint, Offset(s * 0.5f, s * 0.35f), Offset(s * 0.5f, s * 0.62f), strokeWidth = stroke.width)
                drawLine(tint, Offset(s * 0.38f, s * 0.52f), Offset(s * 0.5f, s * 0.62f), strokeWidth = stroke.width)
                drawLine(tint, Offset(s * 0.62f, s * 0.52f), Offset(s * 0.5f, s * 0.62f), strokeWidth = stroke.width)
            }
            PrefGlyph.Clear -> {
                drawLine(tint, Offset(s * 0.28f, s * 0.28f), Offset(s * 0.72f, s * 0.72f), strokeWidth = stroke.width)
                drawLine(tint, Offset(s * 0.72f, s * 0.28f), Offset(s * 0.28f, s * 0.72f), strokeWidth = stroke.width)
            }
            PrefGlyph.Delete -> {
                drawLine(tint, Offset(s * 0.3f, s * 0.3f), Offset(s * 0.7f, s * 0.3f), strokeWidth = stroke.width)
                drawRect(
                    tint,
                    topLeft = Offset(s * 0.32f, s * 0.35f),
                    size = androidx.compose.ui.geometry.Size(s * 0.36f, s * 0.45f),
                    style = stroke,
                )
            }
            PrefGlyph.Privacy -> {
                drawCircle(tint, radius = s * 0.22f, center = Offset(s * 0.5f, s * 0.38f), style = stroke)
                drawArc(
                    color = tint,
                    startAngle = 200f,
                    sweepAngle = 140f,
                    useCenter = false,
                    topLeft = Offset(s * 0.18f, s * 0.45f),
                    size = androidx.compose.ui.geometry.Size(s * 0.64f, s * 0.45f),
                    style = stroke,
                )
            }
            PrefGlyph.Support -> {
                drawCircle(tint, radius = s * 0.36f, style = stroke)
                drawCircle(tint, radius = s * 0.06f, center = Offset(s * 0.5f, s * 0.35f))
                drawLine(tint, Offset(s * 0.5f, s * 0.48f), Offset(s * 0.5f, s * 0.72f), strokeWidth = stroke.width)
            }
        }
    }
}

@Composable
private fun MotionToggle(on: Boolean, onToggle: () -> Unit) {
    TapSurface(
        onClick = onToggle,
        minTouchTarget = false,
        modifier = Modifier
            .width(36.dp)
            .height(19.dp)
            .border(Hairline, AiiminTheme.colors.rule),
    ) {
        Box(
            Modifier
                .fillMaxSize()
                .padding(2.dp),
        ) {
            Box(
                Modifier
                    .size(13.dp)
                    .align(if (on) Alignment.CenterEnd else Alignment.CenterStart)
                    .background(if (on) AiiminTheme.colors.accent else AiiminTheme.colors.muted),
            )
        }
    }
}

@Composable
private fun DeleteVeil(
    draft: String,
    onDraft: (String) -> Unit,
    onConfirm: () -> Unit,
    onCancel: () -> Unit,
) {
    Column(
        Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s4)
            .border(Hairline, AiiminTheme.colors.danger)
            .background(AiiminTheme.colors.surface)
            .padding(AiiminTheme.space.s4),
    ) {
        Text(
            text = "TYPE DELETE TO CONTINUE",
            style = AiiminTheme.type.sectionLabel,
            color = AiiminTheme.colors.danger,
        )
        Text(
            text = "This veil is local. Confirming still refuses — account wipe needs the live API.",
            style = AiiminTheme.type.bodySmall,
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = AiiminTheme.space.s2),
        )
        BasicTextField(
            value = draft,
            onValueChange = onDraft,
            singleLine = true,
            textStyle = AiiminTheme.type.mono.copy(color = AiiminTheme.colors.text),
            cursorBrush = SolidColor(AiiminTheme.colors.accent),
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s3)
                .border(Hairline, AiiminTheme.colors.rule)
                .padding(horizontal = AiiminTheme.space.s3, vertical = 10.dp),
            decorationBox = { inner ->
                if (draft.isEmpty()) {
                    Text(text = "DELETE", style = AiiminTheme.type.mono, color = AiiminTheme.colors.muted)
                }
                inner()
            },
        )
        Row(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s3),
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
        ) {
            GhostButton(label = "Cancel", onClick = onCancel, modifier = Modifier.weight(1f))
            PrimaryButton(label = "Confirm", onClick = onConfirm, modifier = Modifier.weight(1f))
        }
    }
}

@Preview(showBackground = true, backgroundColor = 0xFF15171A)
@Composable
private fun ConfigSeedPreview() {
    AiiminTheme {
        ConfigScreen(
            state = ConfigUiState(ConfigState.seed(), LifeMode.BUILD),
            onToggleTheme = {},
            onToggleReduceMotion = {},
            onSelectMode = {},
            onSyncNow = {},
            onOpenOsId = {},
            onOpenMinimums = {},
            onReplayCalibration = {},
            onOpenConnections = {},
            onExport = {},
            onOpenDelete = {},
            onCloseDelete = {},
            onDeleteDraft = {},
            onConfirmDelete = {},
            onDismissNotice = {},
        )
    }
}
