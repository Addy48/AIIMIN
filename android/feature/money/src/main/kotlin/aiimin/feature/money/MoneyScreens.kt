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
import aiimin.designsystem.component.pressable
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

internal val monthFmt = DateTimeFormatter.ofPattern("MMMM yyyy", Locale.ENGLISH)

@Composable
internal fun TxnRow(t: TxnEntity, onClick: () -> Unit) {
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
            Text(if (t.giftHideFrom != null) "Gift" else payeeLabel(t.title), style = Aiimin.type.bodyStrong, maxLines = 1, overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis)
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
    spendCategories: List<String> = Categories.SPEND,
    incomeCategories: List<String> = Categories.INCOME,
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
        PillRow { (if (income) incomeCategories else spendCategories).forEach { k -> Pill(k, cat == k, { cat = k }) } }
        PillRow { Ledger.entries.forEach { e -> Pill(e.label, l == e, { l = e }) } }
        ListRow("Date", subtitle = Dates.relative(day, today), leading = { IconTile(AppIcons.Calendar) }, onClick = { pickDay = true })
        AppTextField(note, { note = it }, placeholder = if (income) "Note (optional)" else "What did you buy? (optional)")
        Spacer(Modifier.height(14.dp))
        val paise = ((amount.toDoubleOrNull() ?: 0.0) * 100).toLong()
        AppButton("Save", { onSave(paise, if (income) "in" else "out", title.ifBlank { cat }, cat, l, day, note) }, Modifier.fillMaxWidth(), enabled = paise > 0)
    }
    if (pickDay) DatePick(day, { day = it }, { pickDay = false })
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
                AppTextField(title, { title = it }, label = if (txn.direction == "in") "From" else "Paid to")
                Spacer(Modifier.height(10.dp))
                SectionHeader("Category")
                val cats by (if (txn.direction == "in") vm.categoriesIn else vm.categoriesOut).collectAsStateWithLifecycle()
                PillRow { (cats.ifEmpty { if (txn.direction == "in") Categories.INCOME else Categories.SPEND } + listOf(cat)).distinct().forEach { k -> Pill(k, cat == k, { cat = k }) } }
                SectionHeader("Ledger")
                Segmented(Ledger.entries.map { it.label }, Ledger.entries.indexOf(ledger), { ledger = Ledger.entries[it] })
                Spacer(Modifier.height(10.dp))
                SwitchRow("Apply to this payee from now on", learn, { learn = it })
                AppTextField(note, { note = it }, label = if (txn.direction == "in") "Note" else "What did you buy? (or a note)", singleLine = false, minLines = 2)
                Spacer(Modifier.height(12.dp))
                AppButton("Save", { vm.save(txn.copy(title = title, category = cat, ledger = ledger.name, note = note), learn); toaster.show("Saved") }, Modifier.fillMaxWidth())
            }
            item {
                SectionHeader("Receipt")
                if (receipt != null && txn.receiptDocId != null) {
                    ListRow(receipt!!, subtitle = "In your vault", leading = { IconTile(AppIcons.Receipt) }, opens = Route.Doc(txn.receiptDocId!!), onClick = { nav.open(Route.Doc(txn.receiptDocId!!)) })
                } else {
                    ListRow("Attach a receipt or warranty", subtitle = "Photo or PDF — saved to the vault and linked here", leading = { IconTile(AppIcons.Paperclip) }, onClick = { picker.launch(arrayOf("image/*", "application/pdf")) })
                }
            }
            if (txn.direction == "out" && txn.method != "IOU") {
                item {
                    var splitting by remember { mutableStateOf(false) }
                    SectionHeader("Split")
                    val shares = aiimin.core.data.money.Splits.decode(txn.splits)
                    if (shares.isEmpty()) {
                        ListRow("Split with…", subtitle = "Equal parts; they show in Splits until settled", leading = { IconTile(AppIcons.Users) }, onClick = { splitting = true })
                    } else {
                        shares.forEach { sh ->
                            ListRow(sh.name.ifBlank { sh.who }, subtitle = if (sh.settled) "Settled" else "Owes you ${Money.whole(sh.paise)}", leading = { IconTile(AppIcons.Users) }, opens = Route.SplitPerson(sh.who), onClick = { nav.open(Route.SplitPerson(sh.who)) })
                        }
                        Text("Remove split", style = Aiimin.type.label.copy(color = c.accentText), modifier = Modifier.padding(vertical = 8.dp).pressable({ vm.clearSplit() }))
                    }
                    if (splitting) SplitSheet(txn.amountPaise, people, { splitting = false }) { picked -> vm.split(picked); splitting = false; toaster.show("Split with ${picked.joinToString { it.second }}") }
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
