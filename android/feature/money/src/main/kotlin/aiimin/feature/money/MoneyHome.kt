package aiimin.feature.money

import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics

import aiimin.core.data.money.payeeLabel
import aiimin.designsystem.theme.Motion
import aiimin.designsystem.component.PaceChartData
import aiimin.designsystem.component.PaceChart
import aiimin.core.data.money.MoneyChartMath
import aiimin.core.data.money.Ledger
import aiimin.core.data.money.MoneyRange
import aiimin.core.data.money.MoneyRepository
import aiimin.core.data.money.SpendBar
import aiimin.core.data.util.Dates
import aiimin.core.data.util.Money
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppSheet
import aiimin.designsystem.component.AppTextField
import aiimin.designsystem.component.AxisLabel
import aiimin.designsystem.component.BarPoint
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.EvidenceDot
import aiimin.designsystem.component.Hairline
import aiimin.designsystem.component.LargeHeader
import aiimin.designsystem.component.RootActions
import aiimin.designsystem.component.ScrubBarChart
import aiimin.designsystem.component.SectionHeader
import aiimin.designsystem.component.Segmented
import aiimin.designsystem.component.Skeleton
import aiimin.designsystem.component.Tag
import aiimin.designsystem.component.pressable
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.LocalToaster
import aiimin.designsystem.nav.Route
import aiimin.designsystem.theme.Aiimin
import aiimin.designsystem.theme.Shapes
import android.content.Intent
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import kotlinx.coroutines.flow.debounce
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.snapshotFlow
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.FileProvider
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import java.time.LocalDate
import java.time.YearMonth
import java.time.format.TextStyle
import java.util.Locale
import kotlinx.coroutines.launch

/**
 * Money home (M1), per handoff §6: ledger switch, a headline that doubles as the chart readout,
 * range switch, the scrubbable bar chart, "likely to land", the payments for the selection,
 * what is floating above (not booked yet), where it went. Summary first, no raw grid on top.
 */
@OptIn(kotlinx.coroutines.FlowPreview::class)
@Composable
fun MoneyScreen(vm: MoneyViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    val context = LocalContext.current
    val data by vm.data.collectAsStateWithLifecycle()
    val series by vm.series.collectAsStateWithLifecycle()
    val ledger by vm.ledger.collectAsStateWithLifecycle()
    val range by vm.range.collectAsStateWithLifecycle()
    val offset by vm.offset.collectAsStateWithLifecycle()
    val today by vm.today.collectAsStateWithLifecycle()
    val unread by vm.unread.collectAsStateWithLifecycle()
    // Read only inside the items that show it, so scrubbing doesn't rebuild the whole list.
    val selection = remember { mutableStateOf<Int?>(null) }
    var adding by remember { mutableStateOf(false) }
    var pasting by remember { mutableStateOf(false) }
    var exporting by remember { mutableStateOf(false) }
    var picking by remember { mutableStateOf(false) }
    val extras by vm.extras.collectAsStateWithLifecycle()
    val found by vm.found.collectAsStateWithLifecycle()
    androidx.lifecycle.compose.LifecycleResumeEffect(Unit) { vm.refreshFoundNow(); onPauseOrDispose { } }
    val prefs by vm.prefs.collectAsStateWithLifecycle()
    val accountFilter by vm.accountFilter.collectAsStateWithLifecycle()
    val quiet by vm.quietAccounts.collectAsStateWithLifecycle()
    val c = Aiimin.colors
    LaunchedEffect(range, ledger, offset) { selection.value = null }
    val shownLedgers = Ledger.entries.filter { it == Ledger.PERSONAL || it.name in (prefs?.ledgersOn ?: emptySet()) }

    LazyColumn(Modifier.fillMaxSize().background(c.base), contentPadding = PaddingValues(bottom = 32.dp)) {
        // 4.4: one small "Personal ▾" in the header instead of a second pill bar.
        item {
            LargeHeader("Money", actionsBelowAtCompactWidth = true) {
                if (shownLedgers.size > 1) LedgerPicker(ledger) { picking = true }
                aiimin.designsystem.component.RaahiGuideButton(aiimin.designsystem.component.RaahiArea.MONEY)
                RootActions(unread)
            }
        }
        val s = series
        val d = data
        if (s == null || d == null) {
            item { Skeleton(Modifier.padding(Aiimin.space.gutter).fillMaxWidth().height(220.dp)) }
            return@LazyColumn
        }
        val monthIsCurrent = s.range == MoneyRange.M && s.isCurrent
        item {
            val selected = selection.value
            val bar = selected?.let { s.bars.getOrNull(it) }
            Column(Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 24.dp)) {
                Headline(s, bar, d.budget?.totalPaise, d.remaining, ledger, monthIsCurrent, d.paceLine, today)
                Spacer(Modifier.height(12.dp))
                PeriodNav(s, offset, onPage = { vm.page(it) })
                val plan = d.budget?.totalPaise?.takeIf { it > 0 && ledger == Ledger.PERSONAL }
                if (s.range == MoneyRange.M) {
                    // The month as one climbing line against the even pace to plan (plan Phase 20).
                    val pc = remember(s, plan, today) { paceData(s, plan, today) }
                    PaceChart(
                        data = pc.chart, selected = selected, onSelect = { selection.value = it },
                        barTint = Aiimin.colors.moneyGold,
                        description = pc.summary,
                    )
                    pc.footnote?.let {
                        // D-005: the chevron stays on the first line when the line wraps.
                        Row(Modifier.padding(top = 4.dp).fillMaxWidth().clip(Shapes.small).pressable({ nav.open(Route.Budget) }).heightIn(min = 48.dp).padding(vertical = 8.dp), verticalAlignment = Alignment.Top) {
                            Text(it, style = Aiimin.type.caption, modifier = Modifier.weight(1f))
                            Icon(AppIcons.CaretRight, "Open budget", tint = c.textFaint, modifier = Modifier.padding(top = 2.dp, start = 8.dp).size(16.dp))
                        }
                    }
                } else {
                    val n = s.bars.size
                    ScrubBarChart(
                        points = s.bars.map { BarPoint(it.paise / 100.0, stub = it.future) },
                        selected = selected,
                        onSelect = { selection.value = it },
                        labels = if (s.range == MoneyRange.W) s.bars.mapIndexed { i, b -> AxisLabel(i, b.label.take(3)) } else s.xLabels.map { AxisLabel(it.first, it.second) },
                        onPage = { vm.page(it) },
                        description = "${s.title}: ${Money.format(s.totalPaise)}",
                        emphasis = if (s.isCurrent && s.range == MoneyRange.W && (s.bars.lastOrNull()?.paise ?: 0) > 0) n - 1 else null,
                        alert = if (s.range == MoneyRange.Y && plan != null) s.bars.indices.filter { s.bars[it].paise > plan }.toSet() else emptySet(),
                        planLine = if (s.range == MoneyRange.Y && plan != null) plan / 100.0 else null,
                        planLabel = if (s.range == MoneyRange.Y && plan != null) "Plan ${shortRupees(plan)}" else null,
                        tint = Aiimin.colors.moneyGold,
                    )
                }
                // 4.4: range tabs under the chart (Copilot and Monarch).
                Spacer(Modifier.height(12.dp))
                Segmented(MoneyRange.entries.map { it.label }, MoneyRange.entries.indexOf(range), { vm.setRange(MoneyRange.entries[it]) })
            }
        }
        // 4.4: one "Needs you" row; the list itself is the Review screen.
        if (d.pending.isNotEmpty()) item(key = "needs") {
            Row(
                Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 20.dp).fillMaxWidth().clip(Shapes.row).background(c.surface)
                    .pressable({ nav.open(Route.MoneyInbox) }).heightIn(min = 64.dp).padding(horizontal = 16.dp, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Column(Modifier.weight(1f)) {
                    Text("Needs you · ${d.pending.size} to review", style = Aiimin.type.bodyStrong)
                    Text("From bank alerts on this phone. None of these is booked until you look.", style = Aiimin.type.caption)
                }
                Spacer(Modifier.width(8.dp))
                Icon(AppIcons.CaretRight, null, tint = c.textFaint, modifier = Modifier.size(16.dp))
            }
        }
        // Owner, 20 Oct: an account a bank message named that is not added yet; one at a time, newest first.
        found.firstOrNull()?.let { s ->
            item(key = "found-${s.last4}") {
                AccountFoundCard(
                    s, vm.linkTarget(s), onAdd = { vm.acceptFound(s) }, onNotMine = { vm.dismissFound(s) },
                    modifier = Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 20.dp),
                )
            }
        }
        // 4.4: accounts live in Money settings now; the payments below are not filtered by account here.
        // payments for the selection; follows the finger once it rests, not on every bar it crosses
        item {
            val settled by remember(s) { snapshotFlow { selection.value }.debounce(140) }.collectAsState(selection.value)
            val bar = settled?.let { s.bars.getOrNull(it) }
            val all = when {
                bar != null -> bar.txns
                s.range == MoneyRange.D -> s.bars.flatMap { it.txns }.sortedByDescending { it.at }
                else -> s.bars.flatMap { it.txns }.sortedByDescending { it.amountPaise }
            }
            val list = if (bar == null && s.range != MoneyRange.D) all.take(5) else all
            val title = when {
                bar != null -> "Payments · ${bar.label}"
                s.range == MoneyRange.D -> "Today's payments"
                s.range == MoneyRange.M -> "Biggest in ${YearMonth.from(today).month.getDisplayName(TextStyle.FULL, Locale.ENGLISH)}"
                else -> "Biggest payments"
            }
            Column(Modifier.padding(horizontal = Aiimin.space.gutter)) {
                SectionHeader(title, action = if (bar == null) "All payments" else null, onAction = { nav.open(Route.Payments) })
                if (list.isEmpty()) Text(if (bar?.future == true) "Nothing yet." else "No payments here.", style = Aiimin.type.caption, modifier = Modifier.padding(vertical = 8.dp))
                val biggest = if (bar == null && s.range != MoneyRange.D) list.firstOrNull()?.id else null
                list.forEach { t ->
                    PaymentRow(t, t.id == biggest) { nav.open(Route.Txn(t.id)) }
                    Hairline()
                }
            }
        }
        // where it went
        if (d.byCategory.isNotEmpty()) {
            item {
                Column(Modifier.padding(horizontal = Aiimin.space.gutter)) {
                    SectionHeader("Where it went · ${d.month.month.getDisplayName(TextStyle.FULL, Locale.ENGLISH)}".uppercase().lowercase().replaceFirstChar { it.uppercase() })
                    val top = d.byCategory.first().paise.coerceAtLeast(1)
                    d.byCategory.take(6).forEach { cat ->
                        Column(Modifier.fillMaxWidth().pressable({ nav.open(Route.Category(cat.category)) }).padding(vertical = 12.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(cat.category, style = Aiimin.type.bodyStrong, modifier = Modifier.weight(1f))
                                Text(Money.format(cat.paise), style = Aiimin.type.bodyStrong)
                                Spacer(Modifier.width(12.dp))
                                Text(if (d.spent > 0) "${(cat.paise * 100 / d.spent)}%" else "", style = Aiimin.type.caption, maxLines = 1, softWrap = false, textAlign = androidx.compose.ui.text.style.TextAlign.End, modifier = Modifier.widthIn(min = 36.dp))
                            }
                            Spacer(Modifier.height(8.dp))
                            Box(Modifier.fillMaxWidth().height(4.dp).clip(RoundedCornerShape(2.dp)).background(c.overlay)) {
                                Box(Modifier.fillMaxWidth(cat.paise.toFloat() / top).height(4.dp).clip(RoundedCornerShape(2.dp)).background(if (cat.cap != null && cat.paise > cat.cap!!) c.warn else c.text))
                            }
                        }
                        Hairline()
                    }
                }
            }
        }
        if (d.rollups.isNotEmpty()) {
            item {
                Column(Modifier.padding(horizontal = Aiimin.space.gutter)) {
                    SectionHeader("Small payments, rolled up")
                    d.rollups.take(4).forEach { r ->
                        Row(Modifier.fillMaxWidth().heightIn(min = 52.dp), verticalAlignment = Alignment.CenterVertically) {
                            Column(Modifier.weight(1f)) {
                                Text(r.label, style = Aiimin.type.bodyStrong)
                                Text("${r.count} payments under ₹${prefs?.rollupBelow ?: 200}", style = Aiimin.type.caption)
                            }
                            Text(Money.format(r.paise), style = Aiimin.type.bodyStrong)
                        }
                        Hairline()
                    }
                }
            }
        }
        val owed = extras?.balances.orEmpty()
        if (owed.isNotEmpty() && ledger == Ledger.PERSONAL) item {
            Column(Modifier.padding(horizontal = Aiimin.space.gutter)) {
                // The line below opens Splits, and Splits is in Tools: no third link here (audit A-005).
                SectionHeader("Owed")
                Text(
                    owed.take(3).joinToString(" · ") { b -> if (b.theyOwe) "${b.name} owes you ${Money.whole(b.netPaise)}" else "You owe ${b.name} ${Money.whole(-b.netPaise)}" },
                    style = Aiimin.type.body, modifier = Modifier.fillMaxWidth().pressable({ nav.open(Route.Splits) }).padding(vertical = 12.dp),
                )
                Hairline()
            }
        }
        val coming = extras?.comingUp.orEmpty().filter { it.ledger == ledger.name }
        item {
            Column(Modifier.padding(horizontal = Aiimin.space.gutter)) {
                SectionHeader("Coming up", action = "Bills", onAction = { nav.open(Route.Recurring) })
                if (coming.isEmpty()) Text("No bills in the next 10 days.", style = Aiimin.type.caption, modifier = Modifier.padding(vertical = 8.dp))
                coming.take(4).forEach { b ->
                    val due = LocalDate.parse(b.nextDue)
                    val days = java.time.temporal.ChronoUnit.DAYS.between(today, due)
                    Row(Modifier.fillMaxWidth().pressable({ nav.open(Route.Recurring) }).heightIn(min = 52.dp), verticalAlignment = Alignment.CenterVertically) {
                        Text(b.title, style = Aiimin.type.bodyStrong, modifier = Modifier.weight(1f))
                        Text(
                            Money.whole(b.amountPaise) + " · " + when { days <= 0 -> "today"; days == 1L -> "tomorrow"; days < 7 -> "in $days days"; else -> Dates.shortDm(due) },
                            style = Aiimin.type.body.copy(color = if (days <= 2) c.warn else c.text),
                        )
                    }
                    Hairline()
                }
            }
        }
        item {
            // Money's tools as the same quiet grid the Vault uses, not five orange links.
            aiimin.designsystem.component.ToolGrid(
                "Money tools",
                listOf(
                    aiimin.designsystem.component.Tool(AppIcons.Plus, "Add payment") { adding = true },
                    aiimin.designsystem.component.Tool(AppIcons.ChatText, "Paste a bank SMS") { pasting = true },
                    aiimin.designsystem.component.Tool(AppIcons.ClockCounter, "Past bank messages", opens = Route.SmsImport) { nav.open(Route.SmsImport) },
                    aiimin.designsystem.component.Tool(AppIcons.Export, "Export for CA") { exporting = true },
                    aiimin.designsystem.component.Tool(AppIcons.Bookmark, "Places and rules", opens = Route.PayeeMemory) { nav.open(Route.PayeeMemory) },
                    aiimin.designsystem.component.Tool(AppIcons.HandCoins, "Splits", opens = Route.Splits) { nav.open(Route.Splits) },
                    aiimin.designsystem.component.Tool(AppIcons.Repeat, "Bills", opens = Route.Recurring) { nav.open(Route.Recurring) },
                    aiimin.designsystem.component.Tool(AppIcons.Gear, "Money settings", opens = Route.MoneySettings) { nav.open(Route.MoneySettings) },
                ),
                Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 8.dp),
            )
            Text(
                "For personal budgeting only. Not investment, tax or credit advice. AIIMIN is not registered with SEBI.",
                style = Aiimin.type.caption,
                modifier = Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 16.dp, bottom = 8.dp),
            )
        }
    }

    if (picking) AppSheet({ picking = false }, title = "Ledger") {
        shownLedgers.forEach { l ->
            aiimin.designsystem.component.ListRow(
                l.label, subtitle = when (l) { Ledger.PERSONAL -> "Your own money"; Ledger.HOUSEHOLD -> "Shared at home"; Ledger.BUSINESS -> "Kept apart, never in your Life Score" },
                trailing = { if (l == ledger) Icon(AppIcons.Check, "Selected", tint = c.text, modifier = Modifier.size(20.dp)) },
                onClick = { vm.ledger.value = l; picking = false },
            )
        }
        aiimin.designsystem.component.ListRow("Ledgers in Money settings", trailing = { aiimin.designsystem.component.Chevron() }, onClick = { picking = false; nav.open(Route.MoneySettings) })
    }
    if (exporting) ExportSheet({ m, l -> vm.exportInfo(m, l) }, { m, l -> vm.exportFor(m, l) }, today, { exporting = false })
    val spendCats by vm.categoriesOut.collectAsStateWithLifecycle()
    val incomeCats by vm.categoriesIn.collectAsStateWithLifecycle()
    if (adding) AddPaymentSheet(ledger, today, { adding = false }, spendCats.ifEmpty { aiimin.core.data.money.Categories.SPEND }, incomeCats.ifEmpty { aiimin.core.data.money.Categories.INCOME }) { paise, dir, title, cat, l, day, note ->
        scope.launch {
            vm.add(paise, dir, title, cat, l, day, note)
            toaster.show("Logged ${Money.format(paise)}")
        }
        adding = false
    }
    if (pasting) {
        var text by remember { mutableStateOf("") }
        AppSheet({ pasting = false }, title = "Paste a bank SMS", subtitle = "Read on this phone. HDFC, ICICI, SBI, Axis, Kotak and UPI alerts land in your review inbox.") {
            AppTextField(text, { text = it }, placeholder = "Rs.450.00 debited from A/c XX8912 to VPA zomato@icici…", singleLine = false, minLines = 4)
            Spacer(Modifier.height(12.dp))
            AppButton("Read it", {
                scope.launch {
                    when (val it = vm.capture(text)) {
                        is MoneyRepository.Capture.Added -> {
                            pasting = false
                            val by = it.filedBy
                            if (by != null) toaster.show("Booked by your rule “$by”") else { toaster.show("Added to your review inbox"); nav.open(Route.MoneyInbox) }
                        }
                        MoneyRepository.Capture.Duplicate -> toaster.show("Already captured (same reference)")
                        MoneyRepository.Capture.NotABankAlert -> toaster.show("No amount found. Is this a bank alert?")
                    }
                }
            }, Modifier.fillMaxWidth(), enabled = text.isNotBlank())
        }
    }
}

/** "Personal ▾": the ledger shown, as one small header control (4.4). */
@Composable
private fun LedgerPicker(ledger: Ledger, onClick: () -> Unit) {
    Row(
        Modifier.heightIn(min = 48.dp).clip(Shapes.small).pressable(onClick).padding(horizontal = 8.dp)
            .semantics(mergeDescendants = true) { contentDescription = "Ledger: ${ledger.label}. Change" },
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(ledger.label, style = Aiimin.type.labelLarge)
        Spacer(Modifier.width(4.dp))
        Icon(AppIcons.CaretDown, null, tint = Aiimin.colors.textMuted, modifier = Modifier.size(16.dp))
    }
}

private data class HeadlineState(val label: String, val paise: Long, val overall: Boolean, val future: Boolean)

/** The chart readout: label, amount, sub line. Min height 96 dp so the layout never jumps while scrubbing. */
@Composable
private fun Headline(s: aiimin.core.data.money.SpendSeries, bar: SpendBar?, plan: Long?, remaining: Long?, ledger: Ledger, monthIsCurrent: Boolean, pace: Long?, today: LocalDate) {
    val c = Aiimin.colors
    Column(Modifier.heightIn(min = 100.dp)) {
        AnimatedContent(
            targetState = HeadlineState(bar?.label ?: s.title, bar?.paise ?: s.totalPaise, bar == null, bar?.future == true),
            transitionSpec = { fadeIn(Motion.quick()) togetherWith fadeOut(Motion.tap()) },
            label = "headline",
        ) { (label, paise, overall, future) ->
            Column {
                Text(label, style = Aiimin.type.body.copy(color = c.textMuted))
                Spacer(Modifier.height(4.dp))
                Text(Money.format(paise), style = Aiimin.type.numberLarge)
                Spacer(Modifier.height(4.dp))
                val sub = if (!overall) {
                    val diff = paise - s.usualPaise
                    when {
                        future -> "Not yet"
                        diff > 0 -> "Above your usual by ${Money.whole(diff)}"
                        diff < 0 -> "Below your usual by ${Money.whole(-diff)}"
                        else -> "Right at your usual"
                    }
                } else if (monthIsCurrent && ledger == Ledger.PERSONAL && plan != null && remaining != null) {
                    val daysLeft = YearMonth.from(today).lengthOfMonth() - today.dayOfMonth
                    val word = when {
                        pace == null -> ""
                        s.totalPaise <= pace -> "On pace"
                        else -> "${Money.whole(s.totalPaise - pace)} ahead of pace"
                    }
                    // Each part stays on one line; the line only breaks between parts, never inside "On pace" (audit A-006).
                    listOf("${Money.whole(remaining.coerceAtLeast(0))} left of ${Money.whole(plan)}", "$daysLeft days to go", word).filter { it.isNotBlank() }
                        .joinToString(" · ") { it.replace(' ', '\u00A0') }
                } else if (monthIsCurrent && ledger == Ledger.PERSONAL) "Set a monthly plan to see your pace" else "${Money.whole(s.usualPaise)} a ${s.unit} on average"
                // D-005: the parts wrap as whole parts; no "·" is left at a line end.
                aiimin.designsystem.component.MetaLine(sub, style = Aiimin.type.note)
            }
        }
    }
}

@Composable
private fun PeriodNav(s: aiimin.core.data.money.SpendSeries, offset: Int, onPage: (Int) -> Unit) {
    val c = Aiimin.colors
    Row(Modifier.fillMaxWidth().heightIn(min = 36.dp), verticalAlignment = Alignment.CenterVertically) {
        Row(Modifier.clip(Shapes.small).pressable({ onPage(-1) }).padding(end = 12.dp).heightIn(min = 36.dp), verticalAlignment = Alignment.CenterVertically) {
            Icon(AppIcons.CaretLeft, null, tint = c.textMuted, modifier = Modifier.size(16.dp))
            Text("Earlier", style = Aiimin.type.caption)
        }
        Spacer(Modifier.weight(1f))
        if (offset < 0) Row(Modifier.clip(Shapes.small).pressable({ onPage(1) }).padding(start = 12.dp).heightIn(min = 36.dp), verticalAlignment = Alignment.CenterVertically) {
            Text("Later", style = Aiimin.type.caption)
            Icon(AppIcons.CaretRight, null, tint = c.textMuted, modifier = Modifier.size(16.dp))
        }
    }
}

private fun roundTo(p: Long) = (p / 10_000) * 10_000

@Composable
internal fun PaymentRow(t: aiimin.core.database.TxnEntity, biggest: Boolean, onClick: () -> Unit) {
    val c = Aiimin.colors
    Row(Modifier.fillMaxWidth().pressable(onClick).heightIn(min = 60.dp), verticalAlignment = Alignment.CenterVertically) {
        Column(Modifier.weight(1f).padding(vertical = 8.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(if (t.giftHideFrom != null) "Gift" else payeeLabel(t.title), style = Aiimin.type.bodyStrong, maxLines = 1, overflow = TextOverflow.Ellipsis, modifier = Modifier.weight(1f, fill = false))
                if (biggest) {
                    Spacer(Modifier.width(8.dp))
                    Text("Biggest", style = Aiimin.type.caption.copy(color = c.textMuted, fontWeight = FontWeight.SemiBold))
                }
            }
            aiimin.designsystem.component.MetaLine(
                t.category, t.account4?.let { "••$it" }, Dates.clock(java.time.Instant.ofEpochMilli(t.at).atZone(java.time.ZoneId.systemDefault()).toLocalTime()),
            )
        }
        // D-010: one quiet mark per row (how the payment was known), not two icons.
        Column(horizontalAlignment = Alignment.End) {
            Text((if (t.direction == "in") "+" else "−") + Money.format(t.amountPaise).removePrefix("−"), style = Aiimin.type.bodyStrong)
            EvidenceDot(if (t.source == "notification" || t.source == "sms") 'A' else 'C', size = 8.dp)
        }
    }
}

/** Money's colour family on charts: the "money" domain gold, warm against the cream base. */

/** "₹20k", "₹1.2L": short enough to sit on a chart. */
private fun shortRupees(paise: Long): String {
    val r = paise / 100.0
    return when {
        r >= 1_00_000 -> "₹" + "%.1f".format(r / 1_00_000).removeSuffix(".0") + "L"
        r >= 1_000 -> "₹" + "%.1f".format(r / 1_000).removeSuffix(".0") + "k"
        else -> "₹" + r.toLong()
    }
}

private fun roundTo(paise: Long, step: Long) = (paise + step / 2) / step * step

private data class PaceView(val chart: PaceChartData, val summary: String, val footnote: String?)

/** Builds the month chart from the day bars: running total, pace to plan, likely landing, the one big day. */
private fun paceData(s: aiimin.core.data.money.SpendSeries, plan: Long?, today: LocalDate): PaceView {
    val days = s.bars.map { it.paise }
    val elapsed = s.bars.count { !it.future }.coerceAtLeast(if (s.isCurrent) 1 else s.bars.size)
    val past = days.take(elapsed)
    val cum = MoneyChartMath.cumulative(past)
    val spent = cum.lastOrNull() ?: 0L
    val pace = plan?.let { MoneyChartMath.pace(it, days.size) }
    val daysLeft = days.size - elapsed
    val typical = past.sorted().let { if (it.isEmpty()) 0L else it[it.size / 2] }
    // A projection is a guess; round it to ₹100 so it doesn't read as exact.
    val proj = if (s.isCurrent && daysLeft > 0) MoneyChartMath.projection(spent, typical, elapsed, daysLeft).let { (lo, hi) -> roundTo(lo, 10_000) to roundTo(hi, 10_000) } else null
    val spike = MoneyChartMath.spike(past)
    val spikeLabel = spike?.let { i ->
        val top = s.bars[i].txns.filter { it.direction == "out" && !it.deleted }.maxByOrNull { it.amountPaise }
        Money.whole(days[i]) + (top?.let { " · " + (it.title.ifBlank { it.category }).take(18) } ?: "")
    }
    val over = pace?.let { MoneyChartMath.overPace(cum, it) } ?: List(cum.size) { false }
    val monthEnd = s.bars.lastOrNull()?.to ?: today
    val summary = buildString {
        append("${s.title}: ${Money.format(spent)}")
        if (plan != null) append(" of ${Money.whole(plan)}")
        if (pace != null && cum.isNotEmpty()) append(if (over.last()) ". Ahead of pace" else ". On pace")
        if (proj != null) append(". Likely ${MoneyChartMath.rangeLabel(proj.first, proj.second, sep = " to ")} by ${Dates.shortDm(monthEnd)}")
        append('.')
    }
    val footnote = when {
        proj == null -> null
        plan == null -> "Likely ${MoneyChartMath.rangeLabel(proj.first, proj.second)} by ${Dates.shortDm(monthEnd)}"
        else -> {
            val perDay = ((plan - spent) / daysLeft.coerceAtLeast(1)).coerceAtLeast(0)
            "Likely ${MoneyChartMath.rangeLabel(proj.first, proj.second)} by ${Dates.shortDm(monthEnd)} · " +
                if (perDay > 0) "${Money.whole(perDay)} a day keeps it on plan" else "Over plan; every rupee from here is extra"
        }
    }
    return PaceView(
        PaceChartData(
            daily = days.mapIndexed { i, v -> if (i < elapsed) v / 100.0 else 0.0 },
            cumulative = cum.map { it / 100.0 },
            pace = pace?.map { it / 100.0 },
            plan = plan?.div(100.0),
            low = proj?.first?.div(100.0),
            high = proj?.second?.div(100.0),
            over = over,
            spikeIndex = spike,
            spikeLabel = spikeLabel,
            planLabel = plan?.let { "Plan ${shortRupees(it)}" },
            labels = s.xLabels.map { AxisLabel(it.first, it.second) },
            guides = (plan ?: proj?.second ?: spent).let { top -> listOf(top / 2 / 100.0 to shortRupees(top / 2)) },
        ),
        summary, footnote,
    )
}
