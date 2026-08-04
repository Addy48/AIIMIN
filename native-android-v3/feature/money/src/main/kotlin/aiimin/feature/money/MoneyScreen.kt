package aiimin.feature.money

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
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
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
import aiimin.designsystem.component.BlueprintBox
import aiimin.designsystem.component.EmptyState
import aiimin.designsystem.component.GhostButton
import aiimin.designsystem.component.HairRule
import aiimin.designsystem.component.ScreenHead
import aiimin.designsystem.component.SectionRule
import aiimin.designsystem.component.TapSurface
import aiimin.designsystem.component.Text
import aiimin.designsystem.theme.AiiminTheme
import aiimin.designsystem.theme.Hairline
import kotlin.math.roundToInt

@Composable
fun MoneyRoute(
    onAddTransaction: () -> Unit,
    modifier: Modifier = Modifier,
    viewModel: MoneyViewModel = hiltViewModel(),
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    MoneyScreen(
        state = state,
        onSelectTab = viewModel::onSelectTab,
        onAddTransaction = onAddTransaction,
        modifier = modifier,
    )
}

/**
 * **One job: log and see money truth.**
 *
 * Three tabs, one instrument. Overview is the calm read; Budgets the plan;
 * Ledger the write path. Add never invents a second form — it opens Capture,
 * the trust surface that already knows how to settle an amount.
 */
@Composable
fun MoneyScreen(
    state: MoneyState,
    onSelectTab: (MoneyTab) -> Unit,
    onAddTransaction: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier
            .fillMaxSize()
            .background(AiiminTheme.colors.bg)
            .verticalScroll(rememberScrollState())
            .padding(horizontal = AiiminTheme.space.page)
            .padding(bottom = AiiminTheme.space.s8),
    ) {
        ScreenHead(
            title = "Money · ${state.periodLabel}",
            meta = state.sheetMeta,
        )

        SyncBanner(state)

        TabStrip(selected = state.tab, onSelect = onSelectTab)

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
private fun TabStrip(selected: MoneyTab, onSelect: (MoneyTab) -> Unit) {
    Row(
        Modifier
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
        modifier = Modifier.padding(top = AiiminTheme.space.s6),
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
        WowBars(state.weekBars)
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
    Row(
        Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s3)
            .height(26.dp)
            .border(Hairline, AiiminTheme.colors.rule),
    ) {
        slices.take(5).forEachIndexed { i, slice ->
            Box(
                Modifier
                    .weight(slice.fraction.coerceAtLeast(0.02f))
                    .fillMaxHeight()
                    .background(palette[i % palette.size])
                    .then(
                        if (i > 0) Modifier.border(Hairline, AiiminTheme.colors.rule)
                        else Modifier,
                    ),
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
private fun WowBars(bars: List<WeekBar>) {
    val max = bars.maxOf { it.amount }.coerceAtLeast(1)
    Row(
        Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s3)
            .height(72.dp),
        horizontalArrangement = Arrangement.spacedBy(6.dp),
        verticalAlignment = Alignment.Bottom,
    ) {
        bars.forEach { bar ->
            val h = ((bar.amount.toFloat() / max) * 48f).roundToInt().coerceAtLeast(4).dp
            Column(
                Modifier
                    .weight(1f)
                    .fillMaxHeight(),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Bottom,
            ) {
                Box(
                    Modifier
                        .fillMaxWidth()
                        .height(h)
                        .background(
                            if (bar.highlight) AiiminTheme.colors.accent
                            else AiiminTheme.colors.hair,
                        ),
                )
                Text(
                    text = bar.label,
                    style = AiiminTheme.type.mono(8.5),
                    color = if (bar.highlight) AiiminTheme.colors.accent else AiiminTheme.colors.muted,
                    maxLines = 1,
                    overflow = androidx.compose.ui.text.style.TextOverflow.Clip,
                    textAlign = TextAlign.Center,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 6.dp),
                )
            }
        }
    }
}

@Composable
private fun WealthStrip(state: MoneyState) {
    val nw = state.netWorth
    val recv = state.receivable
    if (nw == null && recv == null) return

    Row(
        Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s6)
            .border(Hairline, AiiminTheme.colors.hair),
    ) {
        if (nw != null) {
            Column(
                Modifier
                    .weight(1f)
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
        if (recv != null) {
            Column(
                Modifier
                    .weight(1f)
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
    AiiminTheme { MoneyScreen(MoneyState.seed(), {}, {}) }
}

@Preview(showBackground = true, backgroundColor = 0xFF15171A)
@Composable
private fun MoneyEmptyPreview() {
    AiiminTheme { MoneyScreen(MoneyState.empty(), {}, {}) }
}
