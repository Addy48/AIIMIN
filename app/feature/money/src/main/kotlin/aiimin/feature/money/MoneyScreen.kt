package aiimin.feature.money

import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
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
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.material3.pulltorefresh.rememberPullToRefreshState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import aiimin.core.data.BudgetLine
import aiimin.core.data.CategorySlice
import aiimin.core.data.LedgerEntry
import aiimin.core.data.MoneyPhase
import aiimin.core.data.MoneyState
import aiimin.core.data.MoneyTab
import aiimin.core.data.UpcomingObligation
import aiimin.core.data.WeekBar
import aiimin.core.data.formatInr
import aiimin.core.data.formatWowPct
import aiimin.core.data.money.PaymentAlertParser
import aiimin.core.data.money.PaymentDraft
import aiimin.core.data.money.PaymentInboxState
import aiimin.designsystem.component.BarDatum
import aiimin.designsystem.component.BlueprintBox
import aiimin.designsystem.component.ChartReadout
import aiimin.designsystem.component.EmptyState
import aiimin.designsystem.component.GhostButton
import aiimin.designsystem.component.HairRule
import aiimin.designsystem.component.PrimaryButton
import aiimin.designsystem.component.ScreenHead
import aiimin.designsystem.component.SectionRule
import aiimin.designsystem.component.TapColumnBars
import aiimin.designsystem.component.TapSurface
import aiimin.designsystem.component.Text
import aiimin.designsystem.component.riseIn
import aiimin.designsystem.theme.AiiminTheme
import aiimin.designsystem.theme.Hairline
import kotlin.math.roundToInt

@Composable
fun MoneyRoute(
    onAddTransaction: () -> Unit,
    onUpgradePlan: () -> Unit = {},
    onNotNow: () -> Unit = {},
    modifier: Modifier = Modifier,
    viewModel: MoneyViewModel = hiltViewModel(),
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val inbox by viewModel.inboxState.collectAsStateWithLifecycle()
    val paste by viewModel.pasteDraft.collectAsStateWithLifecycle()
    val pasteNotice by viewModel.pasteNotice.collectAsStateWithLifecycle()
    val refreshing by viewModel.refreshing.collectAsStateWithLifecycle()
    val manualAmount by viewModel.manualAmount.collectAsStateWithLifecycle()
    val manualName by viewModel.manualName.collectAsStateWithLifecycle()
    val manualExpense by viewModel.manualExpense.collectAsStateWithLifecycle()
    val smsEnabled by viewModel.smsEnabled.collectAsStateWithLifecycle()
    val smsHasPermission by viewModel.smsHasPermission.collectAsStateWithLifecycle()
    val importBusy by viewModel.importBusy.collectAsStateWithLifecycle()
    val tier by viewModel.tier.collectAsStateWithLifecycle()

    if (!aiimin.core.model.TierCatalog.can(tier, aiimin.core.model.TierFeature.MONEY)) {
        androidx.compose.foundation.layout.Box(modifier.fillMaxSize()) {
            aiimin.designsystem.component.TierGateWall(
                feature = aiimin.core.model.TierFeature.MONEY,
                current = tier,
                onOpenPlans = onUpgradePlan,
                onNotNow = onNotNow,
            )
        }
        return
    }

    val smsPermission = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission(),
    ) { granted -> viewModel.onEnableSmsOptIn(granted) }
    val pickFile = rememberLauncherForActivityResult(
        ActivityResultContracts.OpenDocument(),
    ) { uri -> viewModel.onImportUri(uri) }

    LaunchedEffect(Unit) { viewModel.refreshSmsFlags() }
    LaunchedEffect(pasteNotice) {
        if (pasteNotice != null) {
            kotlinx.coroutines.delay(4_200)
            viewModel.clearPasteNotice()
        }
    }
    MoneyScreen(
        state = state,
        inbox = inbox,
        pasteDraft = paste,
        pasteNotice = pasteNotice,
        refreshing = refreshing,
        manualAmount = manualAmount,
        manualName = manualName,
        manualExpense = manualExpense,
        smsEnabled = smsEnabled,
        smsHasPermission = smsHasPermission,
        importBusy = importBusy,
        onSelectTab = viewModel::onSelectTab,
        onAddTransaction = onAddTransaction,
        onPasteChange = viewModel::onPasteDraftChange,
        onSubmitPaste = viewModel::onSubmitPaste,
        onRunAiImport = viewModel::onRunAiImport,
        onManualAmountChange = viewModel::onManualAmountChange,
        onManualNameChange = viewModel::onManualNameChange,
        onManualExpenseChange = viewModel::onManualExpenseChange,
        onSubmitManual = viewModel::onSubmitManual,
        onRequestSms = {
            if (smsHasPermission) viewModel.onEnableSmsOptIn(true)
            else smsPermission.launch(android.Manifest.permission.READ_SMS)
        },
        onDisableSms = viewModel::onDisableSms,
        onScanSms = viewModel::onScanSms,
        onPickImportFile = {
            pickFile.launch(
                arrayOf(
                    "text/*",
                    "text/csv",
                    "application/csv",
                    "application/pdf",
                    "application/vnd.ms-excel",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "application/octet-stream",
                ),
            )
        },
        onApproveDraft = viewModel::onApproveDraft,
        onDismissDraft = viewModel::onDismissDraft,
        onPullRefresh = viewModel::onPullRefresh,
        modifier = modifier,
    )
}

/**
 * **One job: log and see money truth.**
 *
 * Three tabs, one instrument. Overview is the calm read; Budgets the plan;
 * Ledger the write path. Payment alerts (share / paste / opt-in notif) land
 * in a review queue — never auto-written.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MoneyScreen(
    state: MoneyState,
    onSelectTab: (MoneyTab) -> Unit,
    onAddTransaction: () -> Unit,
    inbox: PaymentInboxState = PaymentInboxState(),
    pasteDraft: String = "",
    pasteNotice: String? = null,
    refreshing: Boolean = false,
    manualAmount: String = "",
    manualName: String = "",
    manualExpense: Boolean = true,
    smsEnabled: Boolean = false,
    smsHasPermission: Boolean = false,
    importBusy: Boolean = false,
    onPasteChange: (String) -> Unit = {},
    onSubmitPaste: () -> Unit = {},
    onRunAiImport: () -> Unit = {},
    onManualAmountChange: (String) -> Unit = {},
    onManualNameChange: (String) -> Unit = {},
    onManualExpenseChange: (Boolean) -> Unit = {},
    onSubmitManual: () -> Unit = {},
    onRequestSms: () -> Unit = {},
    onDisableSms: () -> Unit = {},
    onScanSms: () -> Unit = {},
    onPickImportFile: () -> Unit = {},
    onApproveDraft: (String) -> Unit = {},
    onDismissDraft: (String) -> Unit = {},
    onPullRefresh: () -> Unit = {},
    modifier: Modifier = Modifier,
) {
    val ptr = rememberPullToRefreshState()
    PullToRefreshBox(
        isRefreshing = refreshing || importBusy,
        onRefresh = onPullRefresh,
        state = ptr,
        modifier = modifier.fillMaxSize(),
    ) {
        Column(
            Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = AiiminTheme.space.page)
                .padding(bottom = AiiminTheme.space.s8 + AiiminTheme.space.s6),
        ) {
            ScreenHead(
                title = "Money · ${state.periodLabel}",
                meta = state.sheetMeta,
            )

            SyncBanner(state)

            if (inbox.drafts.isNotEmpty()) {
                SectionRule(
                    label = "Review",
                    value = "${inbox.pendingCount} WAITING",
                )
                inbox.drafts.forEach { draft ->
                    PaymentDraftRow(
                        draft = draft,
                        onApprove = { onApproveDraft(draft.id) },
                        onDismiss = { onDismissDraft(draft.id) },
                    )
                }
            }

            TabStrip(
                selected = state.tab,
                onSelect = onSelectTab,
                modifier = Modifier.riseIn(40),
            )

            when {
                state.phase == MoneyPhase.EMPTY ||
                    (state.phase == MoneyPhase.READY && !state.hasMoneyData) -> {
                    EmptyMoney(onAddTransaction)
                }
                else -> when (state.tab) {
                    MoneyTab.OVERVIEW -> OverviewTab(state)
                    MoneyTab.BUDGETS -> BudgetsTab(state)
                    MoneyTab.LEDGER -> LedgerTab(state, onAddTransaction)
                }
            }

            PaymentIngest(
                pasteDraft = pasteDraft,
                pasteNotice = pasteNotice,
                manualAmount = manualAmount,
                manualName = manualName,
                manualExpense = manualExpense,
                smsEnabled = smsEnabled,
                smsHasPermission = smsHasPermission,
                importBusy = importBusy,
                onPasteChange = onPasteChange,
                onSubmitPaste = onSubmitPaste,
                onRunAiImport = onRunAiImport,
                onManualAmountChange = onManualAmountChange,
                onManualNameChange = onManualNameChange,
                onManualExpenseChange = onManualExpenseChange,
                onSubmitManual = onSubmitManual,
                onRequestSms = onRequestSms,
                onDisableSms = onDisableSms,
                onScanSms = onScanSms,
                onPickImportFile = onPickImportFile,
            )
        }
    }
}

private enum class LogImportMode { TYPE, PASTE, FILE, SMS }

@Composable
private fun PaymentIngest(
    pasteDraft: String,
    pasteNotice: String?,
    manualAmount: String,
    manualName: String,
    manualExpense: Boolean,
    smsEnabled: Boolean,
    smsHasPermission: Boolean,
    importBusy: Boolean,
    onPasteChange: (String) -> Unit,
    onSubmitPaste: () -> Unit,
    onRunAiImport: () -> Unit,
    onManualAmountChange: (String) -> Unit,
    onManualNameChange: (String) -> Unit,
    onManualExpenseChange: (Boolean) -> Unit,
    onSubmitManual: () -> Unit,
    onRequestSms: () -> Unit,
    onDisableSms: () -> Unit,
    onScanSms: () -> Unit,
    onPickImportFile: () -> Unit,
) {
    var open by remember { mutableStateOf(false) }
    var mode by remember { mutableStateOf(LogImportMode.TYPE) }

    HairRule(Modifier.padding(top = AiiminTheme.space.s6))
    Row(
        Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s3),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(Modifier.weight(1f)) {
            Text(
                text = "Log · import",
                style = AiiminTheme.type.sectionLabel,
                color = AiiminTheme.colors.muted,
            )
            Text(
                text = "Type · paste · sheet · SMS. Approve drafts before they write.",
                style = AiiminTheme.type.bodySmall.copy(fontSize = 11.sp, lineHeight = 15.sp),
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = 2.dp),
            )
        }
        GhostButton(
            label = if (open) "Close" else "Open",
            onClick = { open = !open },
        )
    }

    if (!open) return

    Row(
        Modifier.padding(top = AiiminTheme.space.s3),
        horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2),
    ) {
        listOf(
            LogImportMode.TYPE to "Type",
            LogImportMode.PASTE to "Paste",
            LogImportMode.FILE to "File",
            LogImportMode.SMS to "SMS",
        ).forEach { (m, label) ->
            GhostButton(
                label = if (mode == m) "$label ·" else label,
                onClick = { mode = m },
            )
        }
    }

    when (mode) {
        LogImportMode.TYPE -> {
            Row(
                Modifier.padding(top = AiiminTheme.space.s3),
                horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2),
            ) {
                GhostButton(
                    label = if (manualExpense) "Expense ·" else "Expense",
                    onClick = { onManualExpenseChange(true) },
                )
                GhostButton(
                    label = if (!manualExpense) "Income ·" else "Income",
                    onClick = { onManualExpenseChange(false) },
                )
            }
            BasicTextField(
                value = manualAmount,
                onValueChange = onManualAmountChange,
                textStyle = AiiminTheme.type.mono(16.0, FontWeight.Medium).copy(color = AiiminTheme.colors.text),
                cursorBrush = SolidColor(AiiminTheme.colors.accent),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = AiiminTheme.space.s2)
                    .heightIn(min = 36.dp),
                decorationBox = { inner ->
                    if (manualAmount.isEmpty()) {
                        Text("Amount ₹", style = AiiminTheme.type.body, color = AiiminTheme.colors.muted)
                    }
                    inner()
                },
            )
            BasicTextField(
                value = manualName,
                onValueChange = onManualNameChange,
                textStyle = AiiminTheme.type.body.copy(fontSize = 13.sp, color = AiiminTheme.colors.text),
                cursorBrush = SolidColor(AiiminTheme.colors.accent),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = AiiminTheme.space.s2)
                    .heightIn(min = 36.dp),
                decorationBox = { inner ->
                    if (manualName.isEmpty()) {
                        Text(
                            "Merchant / note",
                            style = AiiminTheme.type.body.copy(fontSize = 13.sp),
                            color = AiiminTheme.colors.muted,
                        )
                    }
                    inner()
                },
            )
            GhostButton(
                label = "Queue draft",
                onClick = onSubmitManual,
                modifier = Modifier.padding(top = AiiminTheme.space.s2),
            )
        }
        LogImportMode.PASTE -> {
            BasicTextField(
                value = pasteDraft,
                onValueChange = onPasteChange,
                textStyle = AiiminTheme.type.body.copy(fontSize = 13.sp, color = AiiminTheme.colors.text),
                cursorBrush = SolidColor(AiiminTheme.colors.accent),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = AiiminTheme.space.s3)
                    .heightIn(min = 72.dp),
                decorationBox = { inner ->
                    if (pasteDraft.isEmpty()) {
                        Text(
                            text = "Bank SMS, chat dump, or AI notes…",
                            style = AiiminTheme.type.body.copy(fontSize = 13.sp),
                            color = AiiminTheme.colors.muted,
                        )
                    }
                    inner()
                },
            )
            Row(
                Modifier.padding(top = AiiminTheme.space.s2),
                horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2),
            ) {
                GhostButton(label = "Queue draft", onClick = onSubmitPaste)
                GhostButton(
                    label = if (importBusy) "Importing…" else "AI import",
                    onClick = onRunAiImport,
                )
            }
            pasteNotice?.let {
                Text(
                    text = it,
                    style = AiiminTheme.type.bodySmall,
                    color = AiiminTheme.colors.accent,
                    modifier = Modifier.padding(top = AiiminTheme.space.s2),
                )
            }
        }
        LogImportMode.FILE -> {
            Text(
                text = "Signed-in · .xlsx / .xls / .csv → wealth import. PDF: export sheet or paste text.",
                style = AiiminTheme.type.bodySmall.copy(fontSize = 11.sp, lineHeight = 15.sp),
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = AiiminTheme.space.s3),
            )
            GhostButton(
                label = if (importBusy) "Importing…" else "Pick file",
                onClick = onPickImportFile,
                modifier = Modifier.padding(top = AiiminTheme.space.s2),
            )
        }
        LogImportMode.SMS -> {
            Text(
                text = when {
                    smsEnabled && smsHasPermission ->
                        "On · transactional bank/UPI only. OTP skipped. Pull to refresh scans."
                    smsHasPermission && !smsEnabled ->
                        "Permission present · SMS ingest off."
                    else ->
                        "Optional. Queues drafts for Approve. Not required for paste or files."
                },
                style = AiiminTheme.type.bodySmall.copy(fontSize = 11.sp, lineHeight = 15.sp),
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = AiiminTheme.space.s3),
            )
            Row(
                Modifier.padding(top = AiiminTheme.space.s2),
                horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2),
            ) {
                if (smsEnabled && smsHasPermission) {
                    GhostButton(label = "Scan now", onClick = onScanSms)
                    GhostButton(label = "Turn off", onClick = onDisableSms)
                } else {
                    GhostButton(label = "Enable SMS", onClick = onRequestSms)
                }
            }
        }
    }
}

@Composable
private fun PaymentDraftRow(
    draft: PaymentDraft,
    onApprove: () -> Unit,
    onDismiss: () -> Unit,
) {
    Column(
        Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s3)
            .border(Hairline, AiiminTheme.colors.rule)
            .padding(AiiminTheme.space.s3),
    ) {
        Row(
            Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                text = when (draft.direction) {
                    PaymentAlertParser.Direction.DEBIT -> "−${formatInr(draft.amountInr)}"
                    PaymentAlertParser.Direction.CREDIT -> "+${formatInr(draft.amountInr)}"
                },
                style = AiiminTheme.type.mono(14.0, FontWeight.Medium),
                color = if (draft.direction == PaymentAlertParser.Direction.CREDIT) {
                    AiiminTheme.colors.accent
                } else {
                    AiiminTheme.colors.text
                },
            )
            Text(
                text = draft.source.label,
                style = AiiminTheme.type.cellLabel,
                color = AiiminTheme.colors.muted,
            )
        }
        Text(
            text = listOfNotNull(draft.merchant, draft.accountHint, draft.channel, draft.category)
                .joinToString(" · ")
                .ifBlank { "Payment" },
            style = AiiminTheme.type.bodySmall,
            color = AiiminTheme.colors.text,
            modifier = Modifier.padding(top = 4.dp),
        )
        Text(
            text = draft.preview,
            style = AiiminTheme.type.bodySmall.copy(fontSize = 11.sp),
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = 4.dp),
            maxLines = 2,
        )
        Row(
            Modifier.padding(top = AiiminTheme.space.s3),
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2),
        ) {
            PrimaryButton(label = "Approve", onClick = onApprove)
            GhostButton(label = "Dismiss", onClick = onDismiss, color = AiiminTheme.colors.muted)
        }
    }
}

@Composable
private fun SyncBanner(state: MoneyState) {
    val colors = AiiminTheme.colors
    val (label, tint) = when (state.phase) {
        MoneyPhase.OFFLINE -> "HELD LOCALLY · WRITES QUEUE UNTIL LIVE" to colors.danger
        MoneyPhase.EMPTY -> return
        MoneyPhase.READY -> state.syncLabel to colors.muted
    }
    Text(
        text = label,
        style = AiiminTheme.type.mono(9.5, FontWeight.Medium),
        color = tint,
        modifier = Modifier.padding(top = AiiminTheme.space.s3),
    )
}

@Composable
private fun TabStrip(
    selected: MoneyTab,
    onSelect: (MoneyTab) -> Unit,
    modifier: Modifier = Modifier,
) {
    Row(
        modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s4)
            .height(IntrinsicSize.Min)
            .border(Hairline, AiiminTheme.colors.hair),
    ) {
        MoneyTab.entries.forEachIndexed { i, tab ->
            val active = tab == selected
            if (i > 0) {
                Box(
                    Modifier
                        .width(Hairline)
                        .fillMaxHeight()
                        .background(AiiminTheme.colors.hair),
                )
            }
            TapSurface(
                onClick = { onSelect(tab) },
                minTouchTarget = false,
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight()
                    .background(if (active) AiiminTheme.colors.tint else Color.Transparent),
            ) {
                Text(
                    text = tab.name,
                    style = AiiminTheme.type.chrome.copy(
                        fontSize = 10.5.sp,
                        letterSpacing = 1.4.sp,
                    ),
                    color = if (active) AiiminTheme.colors.accent else AiiminTheme.colors.muted,
                    textAlign = TextAlign.Center,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 12.dp),
                )
            }
        }
    }
}

@Composable
private fun EmptyMoney(onAddTransaction: () -> Unit) {
    EmptyState(
        label = "No money logged",
        message = "This month has no spends or budgets yet. That is empty — not ₹0. " +
            "Settle a line on Capture and it lands on the ledger.",
        actionLabel = "+ Add a transaction",
        onAction = onAddTransaction,
    )
}

// --- Overview ----------------------------------------------------------------

@Composable
private fun OverviewTab(state: MoneyState) {
    val safe = state.safeToSpend
    BlueprintBox(
        legend = "Safe to spend · today",
        accent = true,
        modifier = Modifier
            .padding(top = AiiminTheme.space.s6)
            .riseIn(80),
    ) {
        if (safe == null) {
            Text(
                text = "—",
                style = AiiminTheme.type.mono.copy(
                    fontSize = 56.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = (-1.5).sp,
                    lineHeight = 50.sp,
                ),
                color = AiiminTheme.colors.muted,
            )
            Text(
                text = "Budgets are not set. Safe-to-spend needs an allocation first.",
                style = AiiminTheme.type.bodySmall,
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = AiiminTheme.space.s3),
            )
        } else {
            Text(
                text = formatInr(safe),
                style = AiiminTheme.type.mono.copy(
                    fontSize = 56.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = (-1.5).sp,
                    lineHeight = 50.sp,
                ),
            )
            SpendTrack(pct = state.spentOfBudgetPct)
            Row(
                Modifier
                    .fillMaxWidth()
                    .padding(top = 5.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
            ) {
                Text(
                    text = "${formatInr(state.spentMtd)} SPENT",
                    style = AiiminTheme.type.mono(10.0),
                    color = AiiminTheme.colors.muted,
                )
                Text(
                    text = "${formatInr(state.budgetTotal)} BUDGET",
                    style = AiiminTheme.type.mono(10.0),
                    color = AiiminTheme.colors.muted,
                )
            }
        }
    }

    if (state.categories.isNotEmpty()) {
        SectionRule(label = "Category breakdown · MTD")
        CategoryBar(state.categories)
        CategoryLegend(state.categories)
    } else {
        SectionRule(label = "Category breakdown · MTD")
        EmptyState(
            label = "No spends yet",
            message = "Category slices appear once an expense is settled.",
        )
    }

    val wow = state.wowDeltaPct
    SectionRule(
        label = "Week over week",
        value = wow?.let { formatWowPct(it) },
        valueColor = when {
            wow == null -> AiiminTheme.colors.muted
            wow < 0 -> AiiminTheme.colors.accent
            else -> AiiminTheme.colors.muted
        },
    )
    if (state.weekBars.isEmpty()) {
        Text(
            text = "Not enough weeks to compare yet.",
            style = AiiminTheme.type.bodySmall,
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = AiiminTheme.space.s3),
        )
    } else {
        TapColumnBars(
            bars = state.weekBars.map { bar ->
                BarDatum(
                    label = bar.label,
                    value = bar.amount.toFloat(),
                    highlight = bar.highlight,
                    detail = formatInr(bar.amount),
                )
            },
            valueFormat = { formatInr(it.roundToInt()) },
            hint = "TAP A WEEK · READ SPEND",
            modifier = Modifier.padding(top = AiiminTheme.space.s2),
        )
    }

    WealthStrip(state)
}

@Composable
private fun SpendTrack(pct: Float) {
    Box(
        Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s4)
            .height(8.dp)
            .border(Hairline, AiiminTheme.colors.rule),
    ) {
        Box(
            Modifier
                .fillMaxHeight()
                .fillMaxWidth(pct.coerceIn(0f, 1f))
                .background(AiiminTheme.colors.accent),
        )
    }
}

@Composable
private fun CategoryBar(slices: List<CategorySlice>) {
    val palette = listOf(
        AiiminTheme.colors.accent,
        AiiminTheme.colors.muted,
        AiiminTheme.colors.rule,
        AiiminTheme.colors.tint,
        AiiminTheme.colors.hair,
    )
    var selected by remember { mutableIntStateOf(-1) }
    Column(Modifier.fillMaxWidth()) {
        Row(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s3)
                .height(26.dp)
                .border(Hairline, AiiminTheme.colors.rule),
        ) {
            slices.take(5).forEachIndexed { i, slice ->
                TapSurface(
                    onClick = { selected = if (selected == i) -1 else i },
                    minTouchTarget = false,
                    modifier = Modifier
                        .weight(slice.fraction.coerceAtLeast(0.02f))
                        .fillMaxHeight(),
                ) {
                    Box(
                        Modifier
                            .fillMaxSize()
                            .background(
                                if (selected == i) AiiminTheme.colors.accent
                                else palette[i % palette.size],
                            )
                            .then(
                                if (i > 0) Modifier.border(Hairline, AiiminTheme.colors.rule)
                                else Modifier,
                            ),
                    )
                }
            }
        }
        val pick = slices.getOrNull(selected)
        if (pick != null) {
            ChartReadout(
                title = pick.name,
                detail = "${formatInr(pick.amount)} · ${(pick.fraction * 100).roundToInt()}% of MTD",
                modifier = Modifier.padding(top = AiiminTheme.space.s2),
            )
        } else {
            Text(
                text = "TAP A SLICE · READ CATEGORY",
                style = AiiminTheme.type.cellLabel,
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = AiiminTheme.space.s2),
            )
        }
    }
}

@Composable
private fun CategoryLegend(slices: List<CategorySlice>) {
    val palette = listOf(
        AiiminTheme.colors.accent,
        AiiminTheme.colors.muted,
        AiiminTheme.colors.rule,
        AiiminTheme.colors.tint,
    )
    Column(Modifier.padding(top = AiiminTheme.space.s3)) {
        slices.take(4).chunked(2).forEach { row ->
            Row(
                Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s4),
            ) {
                row.forEachIndexed { i, slice ->
                    val color = palette[(slices.indexOf(slice)) % palette.size]
                    Row(
                        Modifier
                            .weight(1f)
                            .padding(vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(7.dp),
                    ) {
                        Box(
                            Modifier
                                .size(9.dp)
                                .background(color)
                                .then(
                                    if (color == AiiminTheme.colors.tint) {
                                        Modifier.border(Hairline, AiiminTheme.colors.rule)
                                    } else {
                                        Modifier
                                    },
                                ),
                        )
                        Text(
                            text = slice.name.lowercase().replaceFirstChar { it.titlecase() },
                            style = AiiminTheme.type.bodySmall,
                            modifier = Modifier.weight(1f),
                        )
                        Text(
                            text = formatInr(slice.amount),
                            style = AiiminTheme.type.mono(11.5, FontWeight.Medium),
                            color = AiiminTheme.colors.muted,
                        )
                    }
                }
                if (row.size == 1) Box(Modifier.weight(1f))
            }
        }
    }
}

@Composable
private fun WealthStrip(state: MoneyState) {
    val nw = state.netWorth
    val recv = state.receivable
    if (nw == null && recv == null) return

    var selected by remember { mutableStateOf<String?>(null) }

    Column(Modifier.fillMaxWidth()) {
        Row(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s6)
                .border(Hairline, AiiminTheme.colors.hair),
        ) {
            if (nw != null) {
                TapSurface(
                    onClick = { selected = if (selected == "nw") null else "nw" },
                    minTouchTarget = false,
                    modifier = Modifier.weight(1f),
                ) {
                    Column(
                        Modifier
                            .fillMaxWidth()
                            .border(Hairline, AiiminTheme.colors.hair)
                            .padding(AiiminTheme.space.s3),
                    ) {
                        Text(text = "NET WORTH", style = AiiminTheme.type.cellLabel, color = AiiminTheme.colors.muted)
                        Text(
                            text = formatInr(nw),
                            style = AiiminTheme.type.mono.copy(fontSize = 19.sp, fontWeight = FontWeight.Bold),
                            modifier = Modifier.padding(top = 4.dp),
                        )
                        state.netWorthDelta?.let { delta ->
                            Text(
                                text = "${formatInr(delta, signed = true)} MoM",
                                style = AiiminTheme.type.mono(10.0),
                                color = AiiminTheme.colors.accent,
                            )
                        }
                        if (state.isSeed) {
                            Text(
                                text = "SEED READ · NOT LIVE",
                                style = AiiminTheme.type.mono(9.0),
                                color = AiiminTheme.colors.muted,
                                modifier = Modifier.padding(top = 2.dp),
                            )
                        }
                    }
                }
            }
            if (recv != null) {
                TapSurface(
                    onClick = { selected = if (selected == "recv") null else "recv" },
                    minTouchTarget = false,
                    modifier = Modifier.weight(1f),
                ) {
                    Column(
                        Modifier
                            .fillMaxWidth()
                            .border(Hairline, AiiminTheme.colors.hair)
                            .padding(AiiminTheme.space.s3),
                    ) {
                        Text(text = "RECEIVABLE", style = AiiminTheme.type.cellLabel, color = AiiminTheme.colors.muted)
                        Text(
                            text = formatInr(recv),
                            style = AiiminTheme.type.mono.copy(fontSize = 19.sp, fontWeight = FontWeight.Bold),
                            modifier = Modifier.padding(top = 4.dp),
                        )
                        state.receivableMeta?.let { meta ->
                            Text(
                                text = meta,
                                style = AiiminTheme.type.mono(10.0),
                                color = AiiminTheme.colors.muted,
                            )
                        }
                    }
                }
            }
        }
        when (selected) {
            "nw" -> ChartReadout(
                title = "Net worth",
                detail = buildString {
                    append(formatInr(nw ?: 0))
                    state.netWorthDelta?.let { append(" · MoM ${formatInr(it, signed = true)}") }
                    if (state.isSeed) append(" · seed")
                },
                modifier = Modifier.padding(top = AiiminTheme.space.s2),
            )
            "recv" -> ChartReadout(
                title = "Receivable",
                detail = formatInr(recv ?: 0) + (state.receivableMeta?.let { " · $it" } ?: ""),
                modifier = Modifier.padding(top = AiiminTheme.space.s2),
            )
            else -> Text(
                text = "TAP A FIGURE · READ DETAIL",
                style = AiiminTheme.type.cellLabel,
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = AiiminTheme.space.s2),
            )
        }
    }
}

// --- Budgets -----------------------------------------------------------------

@Composable
private fun BudgetsTab(state: MoneyState) {
    Text(
        text = "ALLOCATIONS",
        style = AiiminTheme.type.sectionLabel,
        color = AiiminTheme.colors.muted,
        modifier = Modifier.padding(top = AiiminTheme.space.s6),
    )
    if (state.budgets.isEmpty()) {
        EmptyState(
            label = "No budgets",
            message = "Allocations are set on the web. Until then this tab stays empty — not ₹0.",
        )
    } else {
        Column(
            Modifier.padding(top = AiiminTheme.space.s3),
            verticalArrangement = Arrangement.spacedBy(AiiminTheme.space.s4),
        ) {
            state.budgets.forEach { BudgetRow(it) }
        }
    }

    SectionRule(label = "Upcoming · next 14 days")
    if (state.upcoming.isEmpty()) {
        EmptyState(
            label = "Nothing due",
            message = "Autopays and card obligations for the next two weeks land here.",
        )
    } else {
        Column(Modifier.padding(top = AiiminTheme.space.s2)) {
            state.upcoming.forEachIndexed { i, item ->
                UpcomingRow(item)
                if (i < state.upcoming.lastIndex) HairRule()
            }
        }
    }
}

@Composable
private fun BudgetRow(line: BudgetLine) {
    Column(Modifier.fillMaxWidth()) {
        Row(
            Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            Text(text = line.name, style = AiiminTheme.type.body)
            Text(
                text = "${formatInr(line.spent).removePrefix("₹")} / ${formatInr(line.limit).removePrefix("₹")}",
                style = AiiminTheme.type.mono,
                color = AiiminTheme.colors.muted,
            )
        }
        val fill = line.usedPct.coerceIn(0f, 1f)
        val barColor = when {
            line.usedPct >= 0.95f -> AiiminTheme.colors.accent
            line.usedPct >= 0.7f -> AiiminTheme.colors.muted
            else -> AiiminTheme.colors.rule
        }
        Box(
            Modifier
                .fillMaxWidth()
                .padding(top = 5.dp)
                .height(7.dp)
                .border(Hairline, AiiminTheme.colors.rule),
        ) {
            Box(
                Modifier
                    .fillMaxHeight()
                    .fillMaxWidth(fill)
                    .background(barColor),
            )
        }
    }
}

@Composable
private fun UpcomingRow(item: UpcomingObligation) {
    Row(
        Modifier
            .fillMaxWidth()
            .padding(vertical = 9.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(Modifier.weight(1f)) {
            Text(text = item.name, style = AiiminTheme.type.body)
            Text(
                text = item.meta,
                style = AiiminTheme.type.mono(10.0),
                color = AiiminTheme.colors.muted,
            )
        }
        Text(
            text = formatInr(item.amount),
            style = AiiminTheme.type.mono(13.0, FontWeight.Medium),
        )
    }
}

// --- Ledger ------------------------------------------------------------------

@Composable
private fun LedgerTab(state: MoneyState, onAddTransaction: () -> Unit) {
    SectionRule(label = "Ledger", value = state.ledger.size.toString())
    if (state.ledger.isEmpty()) {
        EmptyState(
            label = "Ledger empty",
            message = "Nothing written this month. Capture is the write path.",
            actionLabel = "+ Add a transaction",
            onAction = onAddTransaction,
        )
    } else {
        Column(Modifier.padding(top = AiiminTheme.space.s2)) {
            state.ledger.forEach { entry ->
                LedgerRow(entry)
                HairRule()
            }
        }
        GhostButton(
            label = "+ Add a transaction",
            onClick = onAddTransaction,
            color = AiiminTheme.colors.accent,
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s6),
        )
    }
}

@Composable
private fun LedgerRow(entry: LedgerEntry) {
    Row(
        Modifier
            .fillMaxWidth()
            .padding(vertical = 9.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(Modifier.weight(1f)) {
            Text(text = entry.name, style = AiiminTheme.type.body)
            Text(
                text = entry.meta,
                style = AiiminTheme.type.mono(10.0),
                color = AiiminTheme.colors.muted,
            )
        }
        Text(
            text = formatInr(entry.amount, signed = true),
            style = AiiminTheme.type.mono(13.5, FontWeight.Medium),
            color = if (entry.isIncome) AiiminTheme.colors.accent else AiiminTheme.colors.text,
        )
    }
}

// --- Previews ----------------------------------------------------------------

@Preview(showBackground = true, backgroundColor = 0xFF15171A)
@Composable
private fun MoneySeedPreview() {
    AiiminTheme { MoneyScreen(state = MoneyState.seed(), onSelectTab = {}, onAddTransaction = {}) }
}

@Preview(showBackground = true, backgroundColor = 0xFF15171A, heightDp = 900)
@Composable
private fun MoneyEmptyPreview() {
    AiiminTheme { MoneyScreen(state = MoneyState.empty(), onSelectTab = {}, onAddTransaction = {}) }
}
