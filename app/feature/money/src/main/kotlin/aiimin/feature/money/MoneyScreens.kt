package aiimin.feature.money

import aiimin.core.data.money.Categories
import aiimin.core.data.money.Ledger
import aiimin.core.data.money.MoneyRepository
import aiimin.core.data.money.MonthMoney
import aiimin.core.data.util.Dates
import aiimin.core.data.util.Money
import aiimin.core.database.TxnEntity
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppIconButton
import aiimin.designsystem.component.AppSheet
import aiimin.designsystem.component.AppTextField
import aiimin.designsystem.component.Bars
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.CountingNumber
import aiimin.designsystem.component.DatePick
import aiimin.designsystem.component.EmptyState
import aiimin.designsystem.component.IconTile
import aiimin.designsystem.component.LargeHeader
import aiimin.designsystem.component.ListRow
import aiimin.designsystem.component.Meter
import aiimin.designsystem.component.Panel
import aiimin.designsystem.component.Pill
import aiimin.designsystem.component.PillRow
import aiimin.designsystem.component.SectionHeader
import aiimin.designsystem.component.Segmented
import aiimin.designsystem.component.Skeleton
import aiimin.designsystem.component.SwitchRow
import aiimin.designsystem.component.Tag
import aiimin.designsystem.component.TopBar
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.LocalToaster
import aiimin.designsystem.nav.Route
import aiimin.designsystem.theme.Aiimin
import aiimin.designsystem.theme.Shapes
import android.content.Intent
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
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
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.FileProvider
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Locale
import kotlinx.coroutines.launch

private val monthFmt = DateTimeFormatter.ofPattern("MMMM yyyy", Locale.ENGLISH)

@Composable
fun MoneyScreen(vm: MoneyViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    val context = LocalContext.current
    val data by vm.data.collectAsStateWithLifecycle()
    val ledger by vm.ledger.collectAsStateWithLifecycle()
    val month by vm.month.collectAsStateWithLifecycle()
    val today by vm.today.collectAsStateWithLifecycle()
    var adding by remember { mutableStateOf(false) }
    var pasting by remember { mutableStateOf(false) }
    val c = Aiimin.colors

    LazyColumn(Modifier.fillMaxSize().background(c.base), contentPadding = PaddingValues(bottom = 120.dp)) {
        item {
            LargeHeader("Money", overline = "Local · your SMS never leaves the phone") {
                AppIconButton(AppIcons.Export, "Export CSV for your CA", {
                    scope.launch {
                        val f = vm.export()
                        val uri = FileProvider.getUriForFile(context, context.packageName + ".files", f)
                        context.startActivity(Intent.createChooser(Intent(Intent.ACTION_SEND).setType("text/csv").putExtra(Intent.EXTRA_STREAM, uri).addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION), "Export ${month.format(monthFmt)}"))
                    }
                })
                AppIconButton(AppIcons.Plus, "Add payment", { adding = true })
            }
        }
        item {
            Column(Modifier.padding(horizontal = Aiimin.space.gutter)) {
                Segmented(Ledger.entries.map { it.label }, Ledger.entries.indexOf(ledger), { vm.ledger.value = Ledger.entries[it] })
                Row(Modifier.fillMaxWidth().padding(top = 6.dp), verticalAlignment = Alignment.CenterVertically) {
                    AppIconButton(AppIcons.CaretLeft, "Previous month", { vm.shift(-1) }, tint = c.textMuted, size = 40.dp)
                    Text(month.format(monthFmt), style = Aiimin.type.label, textAlign = TextAlign.Center, modifier = Modifier.weight(1f))
                    AppIconButton(AppIcons.CaretRight, "Next month", { vm.shift(1) }, tint = c.textMuted, size = 40.dp)
                }
            }
        }
        val d = data
        if (d == null) {
            item { Skeleton(Modifier.padding(Aiimin.space.gutter).fillMaxWidth().height(160.dp)) }
            return@LazyColumn
        }
        item { Hero(d, today) }
        if (d.pending.isNotEmpty()) {
            item {
                Panel(Modifier.padding(horizontal = Aiimin.space.gutter, vertical = 6.dp), onClick = { nav.open(Route.MoneyInbox) }, color = c.accentSoft) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        IconTile(AppIcons.Receipt, tint = c.accent, background = c.surface)
                        Spacer(Modifier.width(12.dp))
                        Column(Modifier.weight(1f)) {
                            Text("${d.pending.size} payment${if (d.pending.size == 1) "" else "s"} to review", style = Aiimin.type.bodyStrong)
                            Text("From bank alerts. Nothing is booked until you settle it.", style = Aiimin.type.caption)
                        }
                        Icon(AppIcons.CaretRight, null, tint = c.accent, modifier = Modifier.size(16.dp))
                    }
                }
            }
        }
        item {
            Row(Modifier.padding(horizontal = Aiimin.space.gutter, vertical = 6.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                AppButton("Paste bank SMS", { pasting = true }, kind = ButtonKind.SECONDARY, compact = true, icon = AppIcons.Copy)
                if (ledger == Ledger.PERSONAL) AppButton("Monthly plan", { nav.open(Route.Budget) }, kind = ButtonKind.SECONDARY, compact = true, icon = AppIcons.Target)
            }
        }
        item {
            Column(Modifier.padding(horizontal = Aiimin.space.gutter)) {
                SectionHeader("Each day")
                Bars(
                    d.byDay.map { it.toFloat() }, highlight = if (month == java.time.YearMonth.from(today)) today.dayOfMonth - 1 else null,
                    labels = listOf("1", "8", "15", "22", d.byDay.size.toString()), description = "Spending per day",
                )
            }
        }
        if (d.byCategory.isNotEmpty()) {
            item {
                Column(Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 12.dp)) {
                    SectionHeader("Where it went")
                    Panel {
                        d.byCategory.take(8).forEachIndexed { i, cat ->
                            if (i > 0) Spacer(Modifier.height(12.dp))
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(cat.category, style = Aiimin.type.body, modifier = Modifier.weight(1f))
                                Text(Money.format(cat.paise), style = Aiimin.type.numberSmall)
                                cat.cap?.let { Text(" / " + Money.short(it), style = Aiimin.type.caption) }
                            }
                            Spacer(Modifier.height(6.dp))
                            Meter(if (cat.cap != null && cat.cap!! > 0) cat.paise.toFloat() / cat.cap!! else cat.paise.toFloat() / (d.byCategory.first().paise.coerceAtLeast(1)), color = if (cat.cap != null) c.accent else c.textFaint)
                        }
                    }
                }
            }
        }
        if (d.rollups.isNotEmpty()) {
            item {
                Column(Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 12.dp)) {
                    SectionHeader("Small payments, rolled up")
                    d.rollups.take(4).forEach { r -> ListRow(r.label, subtitle = "${r.count} payments under ₹200 this week", trailing = { Text(Money.format(r.paise), style = Aiimin.type.numberSmall) }) }
                }
            }
        }
        item { Box(Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 12.dp)) { SectionHeader("Ledger") } }
        if (d.txns.isEmpty()) {
            item { EmptyState(AppIcons.Money, "No payments in ${month.format(monthFmt)}", "Add one, paste a bank SMS, or say it to the assistant: “spent 240 on lunch”.", action = "Add payment", onAction = { adding = true }) }
        }
        d.txns.groupBy { it.day }.forEach { (day, list) ->
            item(key = "h$day") {
                Row(Modifier.padding(horizontal = Aiimin.space.gutter).padding(top = 10.dp, bottom = 2.dp)) {
                    Text(Dates.relative(LocalDate.parse(day), today), style = Aiimin.type.label.copy(color = c.textMuted), modifier = Modifier.weight(1f))
                    Text(Money.format(list.filter { it.direction == "out" }.sumOf { it.amountPaise }), style = Aiimin.type.caption.copy(fontFeatureSettings = "tnum"))
                }
            }
            items(list, key = { it.id }) { t -> TxnRow(t) { nav.open(Route.Txn(t.id)) } }
        }
    }

    if (adding) AddPaymentSheet(ledger, today, { adding = false }) { paise, dir, title, cat, l, day, note ->
        scope.launch {
            vm.add(paise, dir, title, cat, l, day, note)
            toaster.show("Logged ${Money.format(paise)}")
        }
        adding = false
    }
    if (pasting) {
        var text by remember { mutableStateOf("") }
        AppSheet({ pasting = false }, title = "Paste a bank SMS", subtitle = "Parsed on this phone. HDFC, ICICI, SBI, Axis, Kotak and UPI alerts. It lands in your review inbox.") {
            AppTextField(text, { text = it }, placeholder = "Rs.450.00 debited from A/c XX8912 to VPA zomato@icici…", singleLine = false, minLines = 4)
            Spacer(Modifier.height(12.dp))
            AppButton("Read it", {
                scope.launch {
                    when (vm.capture(text)) {
                        is MoneyRepository.Capture.Added -> { toaster.show("Added to your review inbox"); pasting = false; nav.open(Route.MoneyInbox) }
                        MoneyRepository.Capture.Duplicate -> toaster.show("Already captured (same reference)")
                        MoneyRepository.Capture.NotABankAlert -> toaster.show("No amount found — is this a bank alert?")
                    }
                }
            }, Modifier.fillMaxWidth(), enabled = text.isNotBlank())
        }
    }
}

@Composable
private fun Hero(d: MonthMoney, today: LocalDate) {
    val c = Aiimin.colors
    Panel(Modifier.padding(horizontal = Aiimin.space.gutter, vertical = 8.dp)) {
        Text(if (d.ledger == Ledger.BUSINESS) "BUSINESS SPEND" else "SPENT", style = Aiimin.type.eyebrow)
        Row(verticalAlignment = Alignment.Bottom) {
            CountingNumber((d.spent / 100).toInt(), Aiimin.type.numberLarge, format = { Money.format(it * 100L) })
            d.budget?.let { Text("  of ${Money.format(it.totalPaise)}", style = Aiimin.type.caption, modifier = Modifier.padding(bottom = 6.dp)) }
        }
        if (d.budget != null) {
            Spacer(Modifier.height(10.dp))
            val total = d.budget!!.totalPaise.coerceAtLeast(1)
            Box(Modifier.fillMaxWidth()) {
                Meter(d.spent.toFloat() / total, color = if ((d.paceLine ?: 0) >= d.spent) c.done else c.warn, height = 8.dp)
                d.paceLine?.let { pl ->
                    Box(Modifier.fillMaxWidth((pl.toFloat() / total).coerceIn(0f, 1f)).height(14.dp).padding(top = 0.dp)) {
                        Box(Modifier.align(Alignment.CenterEnd).size(width = 2.dp, height = 14.dp).background(c.text))
                    }
                }
            }
            Spacer(Modifier.height(8.dp))
            val diff = (d.paceLine ?: 0) - d.spent
            Row {
                Text(
                    if (diff >= 0) "${Money.format(diff)} under your pace" else "${Money.format(-diff)} over your pace",
                    style = Aiimin.type.caption.copy(color = if (diff >= 0) c.done else c.warn), modifier = Modifier.weight(1f),
                )
                d.perDay?.let { Text("${Money.format(it)}/day left", style = Aiimin.type.caption) }
            }
        } else if (d.ledger == Ledger.PERSONAL) {
            Text("Set a monthly plan to see your pace and a safe daily amount.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 6.dp))
        }
        if (d.income > 0) Tag("+${Money.format(d.income)} in", color = c.done, background = c.doneSoft)
        if (today.dayOfMonth == 1) Text("Your plan is fixed for the month from today.", style = Aiimin.type.caption)
    }
}

@Composable
private fun TxnRow(t: TxnEntity, onClick: () -> Unit) {
    val c = Aiimin.colors
    Row(
        Modifier.fillMaxWidth().clickable(onClick = onClick).padding(horizontal = Aiimin.space.gutter, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(Modifier.size(36.dp).clip(CircleShape).background(c.raised), contentAlignment = Alignment.Center) {
            Text(t.title.take(1).uppercase(), style = Aiimin.type.label.copy(color = c.textMuted))
        }
        Spacer(Modifier.width(12.dp))
        Column(Modifier.weight(1f)) {
            Text(if (t.giftHideFrom != null) "Gift" else t.title, style = Aiimin.type.bodyStrong, maxLines = 1)
            Text(listOfNotNull(t.category, t.method.takeIf { it != "UPI" }, if (t.receiptDocId != null) "Receipt" else null, if (t.source == "sms" || t.source == "notification") "Bank alert" else null).joinToString(" · "), style = Aiimin.type.caption)
        }
        Text(
            (if (t.direction == "in") "+" else "") + Money.format(t.amountPaise),
            style = Aiimin.type.numberSmall.copy(color = if (t.direction == "in") c.done else c.text),
        )
    }
}

@Composable
internal fun AddPaymentSheet(
    ledger: Ledger,
    today: LocalDate,
    onDismiss: () -> Unit,
    onSave: (Long, String, String, String, Ledger, LocalDate, String) -> Unit,
) {
    val c = Aiimin.colors
    var amount by remember { mutableStateOf("") }
    var income by remember { mutableStateOf(false) }
    var title by remember { mutableStateOf("") }
    var cat by remember { mutableStateOf("Food") }
    var l by remember { mutableStateOf(ledger) }
    var day by remember { mutableStateOf(today) }
    var note by remember { mutableStateOf("") }
    var pickDay by remember { mutableStateOf(false) }
    AppSheet(onDismiss, title = if (income) "Money in" else "Payment") {
        Segmented(listOf("Spent", "Received"), if (income) 1 else 0, { income = it == 1; cat = if (income) "Salary" else "Food" })
        Spacer(Modifier.height(16.dp))
        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth()) {
            Text("₹", style = Aiimin.type.numberLarge.copy(color = c.textMuted))
            Spacer(Modifier.width(6.dp))
            Box(Modifier.weight(1f)) {
                if (amount.isEmpty()) Text("0", style = Aiimin.type.numberLarge.copy(color = c.textFaint, fontSize = 40.sp))
                BasicTextField(
                    amount, { v -> amount = v.filter { it.isDigit() || it == '.' }.take(10) },
                    textStyle = Aiimin.type.numberLarge.copy(fontSize = 40.sp), singleLine = true, cursorBrush = SolidColor(c.accent),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal), modifier = Modifier.fillMaxWidth(),
                )
            }
        }
        Spacer(Modifier.height(12.dp))
        AppTextField(title, { title = it }, placeholder = if (income) "From (e.g. Salary, Client)" else "Where (e.g. Swiggy, Auto)")
        Spacer(Modifier.height(10.dp))
        PillRow { (if (income) Categories.INCOME else Categories.SPEND).forEach { k -> Pill(k, cat == k, { cat = k }) } }
        PillRow { Ledger.entries.forEach { e -> Pill(e.label, l == e, { l = e }) } }
        ListRow("Date", subtitle = Dates.relative(day, today), leading = { IconTile(AppIcons.Calendar) }, onClick = { pickDay = true })
        AppTextField(note, { note = it }, placeholder = "Note (optional)")
        Spacer(Modifier.height(14.dp))
        val paise = ((amount.toDoubleOrNull() ?: 0.0) * 100).toLong()
        AppButton("Save", { onSave(paise, if (income) "in" else "out", title.ifBlank { cat }, cat, l, day, note) }, Modifier.fillMaxWidth(), enabled = paise > 0)
    }
    if (pickDay) DatePick(day, { day = it }, { pickDay = false })
}

// ------------------------------------------------------------------ inbox

@Composable
fun MoneyInboxScreen(vm: InboxViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    val pending by vm.pending.collectAsStateWithLifecycle()
    val c = Aiimin.colors
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Review", onBack = { nav.back() })
        if (pending.isEmpty()) {
            EmptyState(AppIcons.CheckCircle, "All reviewed", "New bank alerts land here. Turn on notification access in Me → Sensors to catch them automatically.")
            return@Column
        }
        LazyColumn(contentPadding = PaddingValues(Aiimin.space.gutter)) {
            items(pending, key = { it.id }) { d ->
                var cat by remember(d.id) { mutableStateOf(d.category) }
                var ledger by remember(d.id) { mutableStateOf(Ledger.PERSONAL) }
                var title by remember(d.id) { mutableStateOf(d.title) }
                var learn by remember(d.id) { mutableStateOf(true) }
                Panel(Modifier.padding(vertical = 6.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Column(Modifier.weight(1f)) {
                            Text((if (d.direction == "in") "+" else "") + Money.format(d.amountPaise), style = Aiimin.type.numberMedium.copy(color = if (d.direction == "in") c.done else c.text))
                            Text(listOfNotNull(d.account4?.let { "A/c ••$it" }, d.upiId, d.reference?.let { "Ref $it" }).joinToString(" · "), style = Aiimin.type.caption, maxLines = 1)
                        }
                        Tag(if (d.confidence >= 0.9) "Known payee" else if (d.confidence >= 0.75) "Confident" else "Check this", color = if (d.confidence >= 0.75) c.textMuted else c.warn)
                    }
                    Spacer(Modifier.height(10.dp))
                    AppTextField(title, { title = it }, placeholder = "Payee")
                    PillRow { (if (d.direction == "in") Categories.INCOME else Categories.SPEND).forEach { k -> Pill(k, cat == k, { cat = k }) } }
                    PillRow { Ledger.entries.forEach { e -> Pill(e.label, ledger == e, { ledger = e }) } }
                    SwitchRow("Remember for this payee", learn, { learn = it }, subtitle = "Next time it's filed the same way")
                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        AppButton("Not mine", { vm.dismiss(d.id) }, Modifier.weight(1f), kind = ButtonKind.SECONDARY, compact = true)
                        AppButton("Settle", { scope.launch { vm.settle(d.id, cat, ledger, title, learn); toaster.show("Booked to ${ledger.label}") } }, Modifier.weight(1f), compact = true)
                    }
                }
            }
        }
    }
}

// ------------------------------------------------------------------ txn detail

@Composable
fun TxnScreen(id: String, vm: TxnViewModel = hiltViewModel()) {
    LaunchedEffect(id) { vm.load(id) }
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    val t by vm.txn.collectAsStateWithLifecycle()
    val people by vm.people.collectAsStateWithLifecycle()
    val receipt by vm.receiptTitle.collectAsStateWithLifecycle()
    val c = Aiimin.colors
    val picker = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocument()) { uri ->
        if (uri != null) scope.launch { runCatching { vm.attachReceipt(uri) }.onSuccess { toaster.show("Receipt saved to the vault") } }
    }
    val txn = t
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Payment", onBack = { nav.back() }) {
            if (txn != null) AppIconButton(AppIcons.Trash, "Delete payment", {
                scope.launch {
                    vm.delete(txn.id)?.let { old -> toaster.undo("Payment deleted") { vm.restore(old) } }
                    nav.back()
                }
            })
        }
        if (txn == null) return@Column
        var title by remember(txn.id) { mutableStateOf(txn.title) }
        var cat by remember(txn.id) { mutableStateOf(txn.category) }
        var ledger by remember(txn.id) { mutableStateOf(Ledger.valueOf(txn.ledger)) }
        var note by remember(txn.id) { mutableStateOf(txn.note) }
        var learn by remember { mutableStateOf(false) }
        LazyColumn(Modifier.weight(1f), contentPadding = PaddingValues(Aiimin.space.gutter)) {
            item {
                Text((if (txn.direction == "in") "+" else "") + Money.format(txn.amountPaise), style = Aiimin.type.numberLarge.copy(color = if (txn.direction == "in") c.done else c.text))
                Text("${Dates.long(LocalDate.parse(txn.day))} · ${txn.method}" + if (txn.source != "manual") " · from ${txn.source}" else "", style = Aiimin.type.caption)
                Spacer(Modifier.height(16.dp))
                AppTextField(title, { title = it }, label = "Payee")
                Spacer(Modifier.height(10.dp))
                SectionHeader("Category")
                PillRow { (if (txn.direction == "in") Categories.INCOME else Categories.SPEND).forEach { k -> Pill(k, cat == k, { cat = k }) } }
                SectionHeader("Ledger")
                Segmented(Ledger.entries.map { it.label }, Ledger.entries.indexOf(ledger), { ledger = Ledger.entries[it] })
                Spacer(Modifier.height(10.dp))
                SwitchRow("Apply to this payee from now on", learn, { learn = it })
                AppTextField(note, { note = it }, label = "Note", singleLine = false, minLines = 2)
                Spacer(Modifier.height(12.dp))
                AppButton("Save", { vm.save(txn.copy(title = title, category = cat, ledger = ledger.name, note = note), learn); toaster.show("Saved") }, Modifier.fillMaxWidth())
            }
            item {
                SectionHeader("Receipt")
                if (receipt != null && txn.receiptDocId != null) {
                    ListRow(receipt!!, subtitle = "In your vault", leading = { IconTile(AppIcons.Receipt) }, onClick = { nav.open(Route.Doc(txn.receiptDocId!!)) })
                } else {
                    ListRow("Attach a receipt or warranty", subtitle = "Photo or PDF — saved to the vault and linked here", leading = { IconTile(AppIcons.Paperclip) }, onClick = { picker.launch(arrayOf("image/*", "application/pdf")) })
                }
            }
            if (txn.direction == "out") {
                item {
                    SectionHeader("Gift mode")
                    val others = people.filter { it.id != "me" }
                    if (others.isEmpty()) {
                        Text("Add family in Vault to hide a gift from someone until it's given.", style = Aiimin.type.caption)
                    } else {
                        Text("The amount still counts in shared totals; the payee and note stay hidden from this person until you reveal it.", style = Aiimin.type.caption)
                        PillRow {
                            Pill("Off", txn.giftHideFrom == null, { vm.gift(null, null) })
                            others.forEach { p -> Pill("Hide from ${p.name}", txn.giftHideFrom == p.id, { vm.gift(p.id, LocalDate.parse(txn.day).plusDays(30)) }) }
                        }
                    }
                }
            }
        }
    }
}

// ------------------------------------------------------------------ budget

@Composable
fun BudgetScreen(vm: BudgetViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    val cur by vm.current.collectAsStateWithLifecycle()
    val c = Aiimin.colors
    var total by remember(cur) { mutableStateOf(cur?.totalPaise?.div(100)?.toString().orEmpty()) }
    var fixed by remember(cur) { mutableStateOf(cur?.fixedPaise?.div(100)?.toString().orEmpty()) }
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Monthly plan", onBack = { nav.back() })
        Column(Modifier.weight(1f).padding(Aiimin.space.gutter)) {
            Text("Your plan is the yardstick for the Money signal: are you on your own pace, not \"did you spend less\". It's fixed on the 1st — a change made mid-month applies next month.", style = Aiimin.type.caption)
            Spacer(Modifier.height(16.dp))
            AppTextField(total, { v -> total = v.filter(Char::isDigit) }, label = "Total for the month (₹)", keyboardType = KeyboardType.Number)
            Spacer(Modifier.height(12.dp))
            AppTextField(fixed, { v -> fixed = v.filter(Char::isDigit) }, label = "Fixed costs early in the month (rent, EMIs, subscriptions)", keyboardType = KeyboardType.Number)
            Spacer(Modifier.height(8.dp))
            Text("Fixed costs count from day one; the rest is spread evenly, so paying rent on the 2nd doesn't look like overspending.", style = Aiimin.type.caption)
        }
        AppButton("Save plan", {
            scope.launch {
                val m = vm.save((total.toLongOrNull() ?: 0) * 100, (fixed.toLongOrNull() ?: 0) * 100, emptyMap())
                toaster.show("Plan saved for ${m.format(monthFmt)}")
                nav.back()
            }
        }, Modifier.fillMaxWidth().navigationBarsPadding().padding(Aiimin.space.gutter), enabled = (total.toLongOrNull() ?: 0) > 0)
    }
}
