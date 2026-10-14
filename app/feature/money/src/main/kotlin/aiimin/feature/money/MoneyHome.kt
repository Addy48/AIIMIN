package aiimin.feature.money

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
import androidx.compose.animation.animateContentSize
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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
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
    var selected by remember { mutableStateOf<Int?>(null) }
    var adding by remember { mutableStateOf(false) }
    var pasting by remember { mutableStateOf(false) }
    var exporting by remember { mutableStateOf(false) }
    val extras by vm.extras.collectAsStateWithLifecycle()
    val prefs by vm.prefs.collectAsStateWithLifecycle()
    val accountFilter by vm.accountFilter.collectAsStateWithLifecycle()
    val quiet by vm.quietAccounts.collectAsStateWithLifecycle()
    val c = Aiimin.colors
    LaunchedEffect(range, ledger, offset) { selected = null }

    LazyColumn(Modifier.fillMaxSize().background(c.base), contentPadding = PaddingValues(bottom = 32.dp)) {
        item { LargeHeader("Money") { RootActions(unread) } }
        item {
            Column(Modifier.padding(horizontal = Aiimin.space.gutter)) {
                val shownLedgers = Ledger.entries.filter { it == Ledger.PERSONAL || it.name in (prefs?.ledgersOn ?: emptySet()) }
                if (shownLedgers.size > 1) Segmented(shownLedgers.map { it.label }, shownLedgers.indexOf(ledger).coerceAtLeast(0), { vm.ledger.value = shownLedgers[it] })
            }
        }
        val s = series
        val d = data
        if (s == null || d == null) {
            item { Skeleton(Modifier.padding(Aiimin.space.gutter).fillMaxWidth().height(220.dp)) }
            return@LazyColumn
        }
        val bar = selected?.let { s.bars.getOrNull(it) }
        val monthIsCurrent = s.range == MoneyRange.M && s.isCurrent
        item {
            Column(Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 22.dp)) {
                Headline(s, bar, d.budget?.totalPaise, d.remaining, ledger, monthIsCurrent, d.paceLine, today)
                Spacer(Modifier.height(16.dp))
                Segmented(MoneyRange.entries.map { it.label }, MoneyRange.entries.indexOf(range), { vm.setRange(MoneyRange.entries[it]) })
                Spacer(Modifier.height(14.dp))
                if (!(s.range == MoneyRange.D) && s.range != MoneyRange.Y || true) PeriodNav(s, offset, onPage = { vm.page(it) })
                ScrubBarChart(
                    points = s.bars.map { BarPoint(it.paise / 100.0, stub = it.future) },
                    selected = selected,
                    onSelect = { selected = it },
                    usual = s.usualPaise / 100.0,
                    usualLabel = "usual ${Money.whole(s.usualPaise)}/${s.unit}",
                    bandLow = if (s.bars.count { !it.future } > 3) s.p25 / 100.0 else null,
                    bandHigh = if (s.bars.count { !it.future } > 3) s.p75 / 100.0 else null,
                    labels = s.xLabels.map { AxisLabel(it.first, it.second) },
                    onPage = { vm.page(it) },
                    description = "${s.title}: ${Money.format(s.totalPaise)}",
                )
                Spacer(Modifier.height(6.dp))
                Text("Shaded is your usual. Hover or tap a bar; the number above follows you.", style = Aiimin.type.caption)
            }
        }
        if (monthIsCurrent && selected == null && d.budget != null && ledger == Ledger.PERSONAL) {
            item { LikelyToLand(d.budget!!.totalPaise, d.spent, s.bars.filter { !it.future }.map { it.paise }.sorted().let { if (it.isEmpty()) 0L else it[it.size / 2] }, today, Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 18.dp)) { nav.open(Route.Budget) } }
        }
        // accounts (M1 item 6): wrapping chips; tap filters the payments below
        val accts = extras?.accounts.orEmpty().filter { it.ledger == ledger.name || it.type == "CASH" }
        if (accts.isNotEmpty()) item {
            Column(Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 18.dp)) {
                androidx.compose.foundation.layout.FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    accts.forEach { a ->
                        val label = a.name + (a.last4?.let { " ••$it" } ?: "") + if (a.primary) " · Primary" else ""
                        Box {
                            aiimin.designsystem.component.Pill(label, accountFilter == a.id, { vm.accountFilter.value = if (accountFilter == a.id) null else a.id })
                            if (a.id in quiet) Box(Modifier.align(Alignment.TopEnd).padding(top = 4.dp, end = 4.dp).size(6.dp).clip(androidx.compose.foundation.shape.CircleShape).background(c.accent))
                        }
                    }
                    Text("Manage", style = Aiimin.type.label.copy(color = c.accentText, fontSize = 14.sp), modifier = Modifier.clip(Shapes.small).pressable({ nav.open(Route.Accounts) }).padding(horizontal = 6.dp, vertical = 8.dp))
                }
            }
        }
        // payments for the selection
        item {
            val all = when {
                bar != null -> bar.txns
                s.range == MoneyRange.D -> s.bars.flatMap { it.txns }.sortedByDescending { it.at }
                else -> s.bars.flatMap { it.txns }.sortedByDescending { it.amountPaise }
            }
            val filtered = accountFilter?.let { id -> all.filter { vm.accountOf(it) == id } } ?: all
            val list = if (bar == null && s.range != MoneyRange.D) filtered.take(5) else filtered
            val title = when {
                bar != null -> "Payments · ${bar.label}"
                s.range == MoneyRange.D -> "Today's payments"
                s.range == MoneyRange.M -> "Biggest in ${YearMonth.from(today).month.getDisplayName(TextStyle.FULL, Locale.ENGLISH)}"
                else -> "Biggest payments"
            }
            Column(Modifier.padding(horizontal = Aiimin.space.gutter).animateContentSize(tween(200))) {
                SectionHeader(title, action = if (bar == null) "All payments" else null, onAction = { nav.open(Route.Payments) })
                if (list.isEmpty()) Text(if (bar?.future == true) "Nothing yet." else "No payments here.", style = Aiimin.type.caption, modifier = Modifier.padding(vertical = 6.dp))
                val biggest = if (bar == null && s.range != MoneyRange.D) list.firstOrNull()?.id else null
                list.forEach { t ->
                    PaymentRow(t, t.id == biggest) { nav.open(Route.Txn(t.id)) }
                    Hairline()
                }
            }
        }
        // floating above: detected, not booked
        if (d.pending.isNotEmpty()) {
            item {
                Column(Modifier.padding(horizontal = Aiimin.space.gutter)) {
                    SectionHeader("Floating above · not in yet · ${d.pending.size}", action = "Review", onAction = { nav.open(Route.MoneyInbox) })
                    Text("Read from bank alerts on this phone. Nothing is booked until you look.", style = Aiimin.type.caption)
                    Spacer(Modifier.height(6.dp))
                    d.pending.take(2).forEach { p ->
                        Row(Modifier.fillMaxWidth().pressable({ nav.open(Route.MoneyInbox) }).heightIn(min = 56.dp), verticalAlignment = Alignment.CenterVertically) {
                            Column(Modifier.weight(1f)) {
                                Text(p.title, style = Aiimin.type.bodyStrong)
                                Text(listOfNotNull(p.account4?.let { "••$it" }, Dates.clock(java.time.Instant.ofEpochMilli(p.detectedAt).atZone(java.time.ZoneId.systemDefault()).toLocalTime()), "${p.category}?").joinToString(" · "), style = Aiimin.type.caption)
                            }
                            Text((if (p.direction == "in") "+" else "−") + Money.format(p.amountPaise).removePrefix("−"), style = Aiimin.type.bodyStrong)
                        }
                        Hairline()
                    }
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
                                Spacer(Modifier.width(10.dp))
                                Text(if (d.spent > 0) "${(cat.paise * 100 / d.spent)}%" else "", style = Aiimin.type.caption, modifier = Modifier.width(34.dp))
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
                SectionHeader("Owed", action = "Splits", onAction = { nav.open(Route.Splits) })
                Text(
                    owed.take(3).joinToString(" · ") { b -> if (b.theyOwe) "${b.name} owes you ${Money.whole(b.netPaise)}" else "You owe ${b.name} ${Money.whole(-b.netPaise)}" },
                    style = Aiimin.type.body, modifier = Modifier.fillMaxWidth().pressable({ nav.open(Route.Splits) }).padding(vertical = 10.dp),
                )
                Hairline()
            }
        }
        val coming = extras?.comingUp.orEmpty().filter { it.ledger == ledger.name }
        item {
            Column(Modifier.padding(horizontal = Aiimin.space.gutter)) {
                SectionHeader("Coming up", action = "Bills", onAction = { nav.open(Route.Recurring) })
                if (coming.isEmpty()) Text("No bills in the next 10 days.", style = Aiimin.type.caption, modifier = Modifier.padding(vertical = 6.dp))
                coming.take(4).forEach { b ->
                    val due = LocalDate.parse(b.nextDue)
                    val days = java.time.temporal.ChronoUnit.DAYS.between(today, due)
                    Row(Modifier.fillMaxWidth().pressable({ nav.open(Route.Recurring) }).heightIn(min = 52.dp), verticalAlignment = Alignment.CenterVertically) {
                        Text(b.title, style = Aiimin.type.bodyStrong, modifier = Modifier.weight(1f))
                        Text(
                            Money.whole(b.amountPaise) + " · " + when { days <= 0 -> "today"; days == 1L -> "tomorrow"; days < 7 -> "in $days days"; else -> Dates.shortDm(due) },
                            style = Aiimin.type.body.copy(color = if (days <= 2) c.accentText else c.text),
                        )
                    }
                    Hairline()
                }
            }
        }
        item {
            Row(Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 16.dp), horizontalArrangement = Arrangement.spacedBy(18.dp)) {
                FooterLink("Add payment") { adding = true }
                FooterLink("Paste a bank SMS") { pasting = true }
                FooterLink("Export for CA") { exporting = true }
            }
            Row(Modifier.padding(horizontal = Aiimin.space.gutter), horizontalArrangement = Arrangement.spacedBy(18.dp)) {
                FooterLink("Payee memory") { nav.open(Route.PayeeMemory) }
                FooterLink("Splits") { nav.open(Route.Splits) }
            }
            Text(
                "For personal budgeting only. Not investment, tax or credit advice. AIIMIN is not registered with SEBI.",
                style = Aiimin.type.caption.copy(fontSize = 11.5.sp),
                modifier = Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 14.dp, bottom = 8.dp),
            )
        }
    }

    if (exporting) ExportSheet({ m, l -> vm.exportInfo(m, l) }, { m, l -> vm.exportFor(m, l) }, today, { exporting = false })
    if (adding) AddPaymentSheet(ledger, today, { adding = false }) { paise, dir, title, cat, l, day, note ->
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
                    when (vm.capture(text)) {
                        is MoneyRepository.Capture.Added -> { toaster.show("Added to your review inbox"); pasting = false; nav.open(Route.MoneyInbox) }
                        MoneyRepository.Capture.Duplicate -> toaster.show("Already captured (same reference)")
                        MoneyRepository.Capture.NotABankAlert -> toaster.show("No amount found. Is this a bank alert?")
                    }
                }
            }, Modifier.fillMaxWidth(), enabled = text.isNotBlank())
        }
    }
}

@Composable
private fun FooterLink(text: String, onClick: () -> Unit) {
    Text(text, style = Aiimin.type.label.copy(color = Aiimin.colors.accentText, fontSize = 14.sp), modifier = Modifier.clip(Shapes.small).pressable(onClick).padding(vertical = 10.dp))
}

private data class HeadlineState(val label: String, val paise: Long, val overall: Boolean, val future: Boolean)

/** The chart readout: label, amount, sub line. Min height 96 dp so the layout never jumps while scrubbing. */
@Composable
private fun Headline(s: aiimin.core.data.money.SpendSeries, bar: SpendBar?, plan: Long?, remaining: Long?, ledger: Ledger, monthIsCurrent: Boolean, pace: Long?, today: LocalDate) {
    val c = Aiimin.colors
    Column(Modifier.heightIn(min = 100.dp)) {
        AnimatedContent(
            targetState = HeadlineState(bar?.label ?: s.title, bar?.paise ?: s.totalPaise, bar == null, bar?.future == true),
            transitionSpec = { fadeIn(tween(120)) togetherWith fadeOut(tween(90)) },
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
                    listOf("${Money.whole(remaining.coerceAtLeast(0))} left of ${Money.whole(plan)}", "$daysLeft days to go", word).filter { it.isNotBlank() }.joinToString(" · ")
                } else if (monthIsCurrent && ledger == Ledger.PERSONAL) "Set a monthly plan to see your pace" else "${Money.whole(s.usualPaise)} a ${s.unit} on average"
                Text(sub, style = Aiimin.type.caption.copy(fontSize = 14.sp, lineHeight = 20.sp))
            }
        }
    }
}

@Composable
private fun PeriodNav(s: aiimin.core.data.money.SpendSeries, offset: Int, onPage: (Int) -> Unit) {
    val c = Aiimin.colors
    Row(Modifier.fillMaxWidth().heightIn(min = 36.dp), verticalAlignment = Alignment.CenterVertically) {
        Row(Modifier.clip(Shapes.small).pressable({ onPage(-1) }).padding(end = 10.dp).heightIn(min = 36.dp), verticalAlignment = Alignment.CenterVertically) {
            Icon(AppIcons.CaretLeft, null, tint = c.textMuted, modifier = Modifier.size(14.dp))
            Text("Earlier", style = Aiimin.type.caption)
        }
        Spacer(Modifier.weight(1f))
        if (offset < 0) Row(Modifier.clip(Shapes.small).pressable({ onPage(1) }).padding(start = 10.dp).heightIn(min = 36.dp), verticalAlignment = Alignment.CenterVertically) {
            Text("Later", style = Aiimin.type.caption)
            Icon(AppIcons.CaretRight, null, tint = c.textMuted, modifier = Modifier.size(14.dp))
        }
    }
}

/** A sunk block: where this month is likely to land, as a range against the plan marker. */
@Composable
private fun LikelyToLand(plan: Long, spent: Long, typicalDay: Long, today: LocalDate, modifier: Modifier, onClick: () -> Unit) {
    val c = Aiimin.colors
    val ym = YearMonth.from(today)
    val daysLeft = (ym.lengthOfMonth() - today.dayOfMonth).coerceAtLeast(0)
    val elapsed = today.dayOfMonth.coerceAtLeast(1)
    val rate = typicalDay.takeIf { it > 0 } ?: (spent / elapsed)
    val low = spent + (rate * 0.8 * daysLeft).toLong()
    val high = spent + (rate * 1.2 * daysLeft).toLong()
    val scale = maxOf(plan, high).toFloat() * 1.08f
    val perDay = if (daysLeft > 0) ((plan - spent) / daysLeft).coerceAtLeast(0) else 0
    Column(modifier.fillMaxWidth().clip(Shapes.card).background(c.raised).pressable(onClick).padding(16.dp)) {
        Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.Bottom) {
            Text("Likely to land on plan", style = Aiimin.type.headline, modifier = Modifier.weight(1f))
            Text("plan ${Money.format(plan)}", style = Aiimin.type.caption)
        }
        Spacer(Modifier.height(14.dp))
        Box(Modifier.fillMaxWidth().height(22.dp)) {
            Box(Modifier.align(Alignment.CenterStart).fillMaxWidth().height(10.dp).clip(RoundedCornerShape(3.dp)).background(if (c.isDark) c.overlay else androidx.compose.ui.graphics.Color(0xFFDAD4C9)))
            Box(
                Modifier.align(Alignment.CenterStart).padding(start = 0.dp).fillMaxWidth(high / scale).height(10.dp),
            ) {
                Box(Modifier.fillMaxWidth(1f).height(10.dp).clip(RoundedCornerShape(3.dp)).background(androidx.compose.ui.graphics.Color.Transparent))
            }
            val startFrac = low / scale
            val endFrac = high / scale
            Box(Modifier.fillMaxWidth().height(10.dp).align(Alignment.CenterStart)) {
                androidx.compose.foundation.layout.BoxWithConstraints(Modifier.fillMaxWidth()) {
                    Box(Modifier.padding(start = maxWidth * startFrac).width(maxWidth * (endFrac - startFrac).coerceAtLeast(0.02f)).height(10.dp).clip(RoundedCornerShape(3.dp)).background(c.text))
                    Box(Modifier.padding(start = maxWidth * (plan / scale)).size(width = 2.dp, height = 22.dp).background(c.accent))
                }
            }
        }
        Spacer(Modifier.height(12.dp))
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text("By ${ym.atEndOfMonth().dayOfMonth} ${ym.month.getDisplayName(TextStyle.SHORT, Locale.ENGLISH)}: ${Money.whole(roundTo(low))}–${Money.whole(roundTo(high))}", style = Aiimin.type.caption.copy(fontSize = 13.sp), modifier = Modifier.weight(1f))
            Text("${Money.whole(perDay)} a day keeps it clear", style = Aiimin.type.caption.copy(fontSize = 13.sp), modifier = Modifier.weight(1f), textAlign = androidx.compose.ui.text.style.TextAlign.End)
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
                Text(if (t.giftHideFrom != null) "Gift" else t.title, style = Aiimin.type.bodyStrong, maxLines = 1, overflow = TextOverflow.Ellipsis, modifier = Modifier.weight(1f, fill = false))
                if (biggest) {
                    Spacer(Modifier.width(8.dp))
                    Text("Biggest", style = Aiimin.type.caption.copy(color = c.accentText, fontWeight = FontWeight.SemiBold, fontSize = 11.5.sp))
                }
            }
            Text(
                listOfNotNull(t.category, t.account4?.let { "••$it" }, Dates.clock(java.time.Instant.ofEpochMilli(t.at).atZone(java.time.ZoneId.systemDefault()).toLocalTime())).joinToString(" · "),
                style = Aiimin.type.caption,
            )
        }
        Column(horizontalAlignment = Alignment.End) {
            Text((if (t.direction == "in") "+" else "−") + Money.format(t.amountPaise).removePrefix("−"), style = Aiimin.type.bodyStrong)
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                Icon(
                    when (t.source) { "notification" -> AppIcons.BellSimple; "sms", "paste" -> AppIcons.ChatText; "ai" -> AppIcons.Mic; else -> AppIcons.Pencil },
                    null, tint = c.textFaint, modifier = Modifier.size(12.dp),
                )
                EvidenceDot(if (t.source == "notification" || t.source == "sms") 'A' else 'C', size = 8.dp)
            }
        }
    }
}
