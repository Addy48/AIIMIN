package aiimin.feature.money

import aiimin.core.data.money.AccountRepository
import aiimin.core.data.money.AccountType
import aiimin.core.data.money.AccountView
import aiimin.core.data.money.Balance
import aiimin.core.data.money.BillRepository
import aiimin.core.data.money.Cadence
import aiimin.core.data.money.Categories
import aiimin.core.data.money.Ledger
import aiimin.core.data.money.MoneyRepository
import aiimin.core.data.money.PayeeMemoryRepository
import aiimin.core.data.money.SplitRepository
import aiimin.core.data.money.Splits
import aiimin.core.data.settings.SettingsStore
import aiimin.core.data.util.Dates
import aiimin.core.data.util.Money
import aiimin.core.data.vault.FamilyRepository
import aiimin.core.database.AccountEntity
import aiimin.core.database.BillEntity
import aiimin.core.database.PayeeRuleEntity
import aiimin.core.database.PersonEntity
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppIconButton
import aiimin.designsystem.component.AppSheet
import aiimin.designsystem.component.AppTextField
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.Chevron
import aiimin.designsystem.component.DatePick
import aiimin.designsystem.component.EmptyState
import aiimin.designsystem.component.Hairline
import aiimin.designsystem.component.IconTile
import aiimin.designsystem.component.ListRow
import aiimin.designsystem.component.Pill
import aiimin.designsystem.component.PillRow
import aiimin.designsystem.component.SectionHeader
import aiimin.designsystem.component.Segmented
import aiimin.designsystem.component.SwitchRow
import aiimin.designsystem.component.Tag
import aiimin.designsystem.component.TopBar
import aiimin.designsystem.component.pressable
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.LocalToaster
import aiimin.designsystem.nav.Route
import aiimin.designsystem.theme.Aiimin
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.net.Uri
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
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.produceState
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.FileProvider
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import java.time.LocalDate
import java.time.YearMonth
import java.time.format.TextStyle
import java.time.temporal.ChronoUnit
import java.util.Locale
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

private fun ago(ms: Long?): String {
    if (ms == null) return "No alerts yet"
    val mins = (System.currentTimeMillis() - ms) / 60_000
    return when {
        mins < 60 -> "Last alert ${mins.coerceAtLeast(1)} min ago"
        mins < 24 * 60 -> "Last alert ${mins / 60}h ago"
        else -> (mins / (24 * 60)).let { d -> "No alerts for $d day${if (d == 1L) "" else "s"}" }
    }
}

// =================================================================== M9 Accounts · M10 Account

@HiltViewModel
class AccountsViewModel @Inject constructor(private val repo: AccountRepository) : ViewModel() {
    val views = MutableStateFlow<List<AccountView>?>(null)

    init {
        viewModelScope.launch {
            repo.ensureSeeded()
            repo.accounts.collect { views.value = repo.views() }
        }
    }

    fun save(a: AccountEntity) = viewModelScope.launch { repo.save(a) }
    fun archive(id: String) = viewModelScope.launch { repo.archive(id) }
    fun create(name: String, type: AccountType, last4: String?, ledger: Ledger) = viewModelScope.launch { repo.create(name, type, last4, ledger) }
}

/** M9 · Accounts. Primary per ledger; quiet alert sources are flagged. */
@Composable
fun AccountsScreen(vm: AccountsViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val c = Aiimin.colors
    val list by vm.views.collectAsStateWithLifecycle()
    var editing by remember { mutableStateOf<AccountEntity?>(null) }
    var adding by remember { mutableStateOf(false) }
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Accounts", onBack = { nav.back() }) { AppIconButton(AppIcons.Plus, "Add account", { adding = true }) }
        val items = list ?: return@Column
        LazyColumn(contentPadding = PaddingValues(start = Aiimin.space.gutter, end = Aiimin.space.gutter, bottom = 40.dp)) {
            if (items.isEmpty()) item {
                EmptyState(AppIcons.Bank, "No accounts yet", "Add the bank accounts, cards and wallets you pay from. Bank alerts fill in the last four digits for you.", action = "Add account", onAction = { adding = true }, sidePadding = 0.dp)
            }
            items(items, key = { it.account.id }) { v ->
                val a = v.account
                Row(Modifier.fillMaxWidth().pressable({ editing = a }).heightIn(min = 64.dp).padding(vertical = 10.dp), verticalAlignment = Alignment.CenterVertically) {
                    IconTile(
                        when (a.type) {
                            AccountType.CASH.name -> AppIcons.Coins
                            AccountType.CREDIT.name -> AppIcons.CreditCard
                            AccountType.WALLET.name -> AppIcons.Wallet
                            else -> AppIcons.Bank
                        },
                    )
                    Spacer(Modifier.width(12.dp))
                    Column(Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(v.short, style = Aiimin.type.bodyStrong)
                            if (a.primary) { Spacer(Modifier.width(8.dp)); Tag("Primary") }
                        }
                        val type = runCatching { AccountType.valueOf(a.type).label }.getOrDefault(a.type)
                        val health = if (a.type == AccountType.CASH.name) "Logged by you" else ago(v.lastAlertAt) + if (v.quiet()) " · Check" else ""
                        Text(
                            listOfNotNull(type, Ledger.entries.firstOrNull { it.name == a.ledger }?.label, health, a.trackFrom?.let { "Track from ${Dates.short(LocalDate.parse(it))}" }).joinToString(" · "),
                            style = Aiimin.type.caption.copy(color = if (v.quiet()) c.accentText else c.textMuted),
                        )
                    }
                    Chevron()
                }
                Hairline()
            }
            item {
                Text(
                    "Spends you speak or type without naming an account go to the primary one. Bank alerts always use the account they came from.",
                    style = Aiimin.type.caption, modifier = Modifier.padding(top = 14.dp),
                )
            }
        }
    }
    editing?.let { a -> AccountSheet(a, onDismiss = { editing = null }, onSave = { vm.save(it); editing = null }, onArchive = { vm.archive(a.id); editing = null }) }
    if (adding) NewAccountSheet({ adding = false }) { n, t, l4, l -> vm.create(n, t, l4, l); adding = false }
}

/** M10 · Account sheet. */
@Composable
private fun AccountSheet(a: AccountEntity, onDismiss: () -> Unit, onSave: (AccountEntity) -> Unit, onArchive: () -> Unit) {
    var name by remember { mutableStateOf(a.name) }
    var last4 by remember { mutableStateOf(a.last4.orEmpty()) }
    var type by remember { mutableStateOf(a.type) }
    var ledger by remember { mutableStateOf(a.ledger) }
    var primary by remember { mutableStateOf(a.primary) }
    var nickname by remember { mutableStateOf(a.nickname) }
    var notif by remember { mutableStateOf(a.notifAlerts) }
    var sms by remember { mutableStateOf(a.smsAlerts) }
    var trackFrom by remember { mutableStateOf(a.trackFrom) }
    var pickDate by remember { mutableStateOf(false) }
    AppSheet(onDismiss, title = a.name + (a.last4?.let { " ••$it" } ?: "")) {
        AppTextField(name, { name = it }, label = "Name")
        Spacer(Modifier.height(10.dp))
        AppTextField(last4, { v -> last4 = v.filter(Char::isDigit).take(4) }, label = "Last 4 digits", keyboardType = KeyboardType.Number)
        SectionHeader("Type")
        PillRow { AccountType.entries.forEach { t -> Pill(t.label, type == t.name, { type = t.name }) } }
        SectionHeader("Payments go to")
        Segmented(Ledger.entries.map { it.label }, Ledger.entries.indexOfFirst { it.name == ledger }.coerceAtLeast(0), { ledger = Ledger.entries[it].name })
        SwitchRow("Primary for this ledger", primary, { primary = it }, subtitle = "Spends without an account named go here")
        if (type != AccountType.CASH.name) {
            SwitchRow("Payment notifications", notif, { notif = it }, subtitle = "From the bank's app")
            SwitchRow("SMS alerts", sms, { sms = it })
            ListRow("Track from", subtitle = trackFrom?.let { Dates.long(LocalDate.parse(it)) } ?: "All alerts", trailing = { Chevron() }, onClick = { pickDate = true })
        }
        AppTextField(nickname, { nickname = it }, label = "Name for voice", placeholder = "salary account, business card")
        Spacer(Modifier.height(14.dp))
        AppButton("Save", {
            onSave(a.copy(name = name, last4 = last4.ifBlank { null }, type = type, ledger = ledger, primary = primary, nickname = nickname.trim(), notifAlerts = notif, smsAlerts = sms, trackFrom = trackFrom))
        }, Modifier.fillMaxWidth())
        Spacer(Modifier.height(8.dp))
        AppButton("Archive account", onArchive, Modifier.fillMaxWidth(), kind = ButtonKind.GHOST)
    }
    if (pickDate) DatePick(trackFrom?.let { LocalDate.parse(it) } ?: LocalDate.now().withDayOfMonth(1), { trackFrom = it.toString(); pickDate = false }, { pickDate = false })
}

@Composable
private fun NewAccountSheet(onDismiss: () -> Unit, onCreate: (String, AccountType, String?, Ledger) -> Unit) {
    var name by remember { mutableStateOf("") }
    var last4 by remember { mutableStateOf("") }
    var type by remember { mutableStateOf(AccountType.SAVINGS) }
    var ledger by remember { mutableStateOf(Ledger.PERSONAL) }
    AppSheet(onDismiss, title = "Add account") {
        AppTextField(name, { name = it }, label = "Bank or name", placeholder = "HDFC, Paytm wallet, Cash")
        Spacer(Modifier.height(10.dp))
        AppTextField(last4, { v -> last4 = v.filter(Char::isDigit).take(4) }, label = "Last 4 digits (optional)", keyboardType = KeyboardType.Number)
        SectionHeader("Type")
        PillRow { AccountType.entries.forEach { t -> Pill(t.label, type == t, { type = t }) } }
        SectionHeader("Payments go to")
        Segmented(Ledger.entries.map { it.label }, Ledger.entries.indexOf(ledger), { ledger = Ledger.entries[it] })
        Spacer(Modifier.height(14.dp))
        AppButton("Add", { onCreate(name, type, last4.ifBlank { null }, ledger) }, Modifier.fillMaxWidth(), enabled = name.isNotBlank())
    }
}

// =================================================================== M11 Splits · M12 Person balance

@HiltViewModel
class SplitsViewModel @Inject constructor(
    private val repo: SplitRepository,
    private val settings: SettingsStore,
    family: FamilyRepository,
) : ViewModel() {
    val balances = repo.balances.stateIn(viewModelScope, SharingStarted.Eagerly, null)
    val people = family.people.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    val myUpi = settings.settings.stateIn(viewModelScope, SharingStarted.Eagerly, null)

    fun settle(who: String, how: String) = viewModelScope.launch { repo.settle(who, how) }
    suspend fun personUpi(who: String) = repo.personUpi(who)
    fun savePersonUpi(who: String, vpa: String) = viewModelScope.launch { repo.savePersonUpi(who, vpa) }
    fun iOwe(who: String, name: String, paise: Long, title: String, category: String) = viewModelScope.launch { repo.recordIOwe(who, name, paise, title, category) }
    fun saveMyUpi(vpa: String) = viewModelScope.launch { settings.update { it.copy(myUpiId = vpa.trim()) } }
}

/** M11 · Splits and balances. */
@Composable
fun SplitsScreen(vm: SplitsViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val c = Aiimin.colors
    val list by vm.balances.collectAsStateWithLifecycle()
    val people by vm.people.collectAsStateWithLifecycle()
    var recording by remember { mutableStateOf(false) }
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Splits", onBack = { nav.back() }) { AppIconButton(AppIcons.Plus, "Record what you owe", { recording = true }) }
        val items = list ?: return@Column
        LazyColumn(contentPadding = PaddingValues(start = Aiimin.space.gutter, end = Aiimin.space.gutter, bottom = 40.dp)) {
            if (items.isEmpty()) item {
                EmptyState(
                    AppIcons.Handshake, "All square",
                    "Split a payment from its page (\"Split with…\"), or say \"split with Rahul\" when you add it. When someone pays for you, record it here.",
                    action = "Record what I owe", onAction = { recording = true },
                    sidePadding = 0.dp,
                )
            }
            val owed = items.filter { it.theyOwe }
            val owe = items.filter { !it.theyOwe }
            if (owed.isNotEmpty()) item { SectionHeader("Owed to you · ${Money.whole(owed.sumOf { it.netPaise })}") }
            items(owed, key = { "o" + it.who }) { b -> BalanceRow(b) { nav.open(Route.SplitPerson(b.who)) } }
            if (owe.isNotEmpty()) item { SectionHeader("You owe · ${Money.whole(-owe.sumOf { it.netPaise })}") }
            items(owe, key = { "i" + it.who }) { b -> BalanceRow(b) { nav.open(Route.SplitPerson(b.who)) } }
            item {
                Text("AIIMIN doesn't process payments. Payments happen in your UPI app.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 18.dp))
            }
        }
    }
    if (recording) IOweSheet(people, { recording = false }) { who, name, paise, title, cat -> vm.iOwe(who, name, paise, title, cat); recording = false }
}

@Composable
private fun BalanceRow(b: Balance, onClick: () -> Unit) {
    val c = Aiimin.colors
    Row(Modifier.fillMaxWidth().pressable(onClick).heightIn(min = 60.dp).padding(vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
        aiimin.designsystem.component.Avatar(b.name, b.name.hashCode().mod(6), size = 36.dp)
        Spacer(Modifier.width(12.dp))
        Column(Modifier.weight(1f)) {
            Text(b.name, style = Aiimin.type.bodyStrong)
            Text("${b.lines.size} shared · last ${Dates.short(LocalDate.parse(b.lines.first().txn.day))}", style = Aiimin.type.caption)
        }
        // Gap + amount over its words, so a long date never runs into it at 1.3× text (audit A-042).
        Spacer(Modifier.width(12.dp))
        Column(horizontalAlignment = Alignment.End) {
            Text(Money.whole(kotlin.math.abs(b.netPaise)), style = Aiimin.type.bodyStrong.copy(color = if (b.theyOwe) c.done else c.accentText), maxLines = 1)
            Text(if (b.theyOwe) "owes you" else "you owe", style = Aiimin.type.caption, maxLines = 1)
        }
    }
    Hairline()
}

@Composable
private fun IOweSheet(people: List<PersonEntity>, onDismiss: () -> Unit, onSave: (String, String, Long, String, String) -> Unit) {
    var who by remember { mutableStateOf<Pair<String, String>?>(null) }
    var other by remember { mutableStateOf("") }
    var amount by remember { mutableStateOf("") }
    var title by remember { mutableStateOf("") }
    var cat by remember { mutableStateOf("Food") }
    AppSheet(onDismiss, title = "Someone paid for you", subtitle = "Your part is booked as your spend, and what you owe them shows here.") {
        SectionHeader("Who paid")
        PillRow {
            people.filter { it.id != "me" && it.id != "household" }.forEach { p -> Pill(p.name, who?.first == p.id, { who = p.id to p.name; other = "" }) }
        }
        AppTextField(other, { other = it; who = null }, placeholder = "Or type a name", modifier = Modifier.padding(top = 8.dp))
        Spacer(Modifier.height(10.dp))
        AppTextField(amount, { v -> amount = v.filter { it.isDigit() } }, label = "Your part (₹)", keyboardType = KeyboardType.Number)
        Spacer(Modifier.height(10.dp))
        AppTextField(title, { title = it }, label = "What for", placeholder = "Dinner at Vaishali")
        SectionHeader("Category")
        PillRow { Categories.SPEND.forEach { k -> Pill(k, cat == k, { cat = k }) } }
        Spacer(Modifier.height(14.dp))
        val target = who ?: other.trim().takeIf { it.isNotBlank() }?.let { "name:" + it.lowercase() to it }
        val paise = (amount.toLongOrNull() ?: 0L) * 100
        AppButton("Save", { if (target != null && paise > 0) onSave(target.first, target.second, paise, title, cat) }, Modifier.fillMaxWidth(), enabled = target != null && paise > 0)
    }
}

/** M12 · One person's balance and how to settle it. */
@Composable
fun PersonBalanceScreen(who: String, vm: SplitsViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val c = Aiimin.colors
    val list by vm.balances.collectAsStateWithLifecycle()
    val s by vm.myUpi.collectAsStateWithLifecycle()
    val b = list?.firstOrNull { it.who == who }
    var askedPaid by remember { mutableStateOf(false) }
    var upiField by remember { mutableStateOf("") }
    var myUpiField by remember { mutableStateOf("") }
    val theirUpi by produceState<String?>(null, who) { value = vm.personUpi(who) }
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar(b?.name ?: "Balance", onBack = { nav.back() })
        if (b == null) {
            EmptyState(AppIcons.CheckCircle, "Settled", "Nothing open with this person.")
            return@Column
        }
        LazyColumn(Modifier.weight(1f), contentPadding = PaddingValues(start = Aiimin.space.gutter, end = Aiimin.space.gutter, bottom = 24.dp)) {
            item {
                Text(if (b.theyOwe) "${b.name} owes you" else "You owe ${b.name}", style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(top = 8.dp))
                Text(Money.format(kotlin.math.abs(b.netPaise)), style = Aiimin.type.numberLarge)
                Spacer(Modifier.height(16.dp))
                if (!b.theyOwe) {
                    val vpa = theirUpi
                    if (vpa == null && !b.who.startsWith("name:")) {
                        AppTextField(upiField, { upiField = it }, label = "${b.name}'s UPI ID", placeholder = "name@bank")
                        Spacer(Modifier.height(8.dp))
                    }
                    val pay = vpa ?: upiField.trim().takeIf { it.contains('@') }
                    AppButton("Pay ${Money.whole(-b.netPaise)} via UPI", {
                        if (pay == null) { toaster.show("Add ${b.name}'s UPI ID first"); return@AppButton }
                        if (vpa == null) vm.savePersonUpi(b.who, pay)
                        val i = Intent(Intent.ACTION_VIEW, Uri.parse(Splits.upiPayUri(pay, b.name, -b.netPaise)))
                        val ok = runCatching { context.startActivity(Intent.createChooser(i, "Pay with")) }.isSuccess
                        if (ok) askedPaid = true else {
                            copy(context, pay); toaster.show("No UPI app took the amount. UPI ID copied.")
                        }
                    }, Modifier.fillMaxWidth(), icon = AppIcons.ArrowUpRight, enabled = pay != null)
                    if (pay != null) Text("Copy UPI ID", style = Aiimin.type.label.copy(color = c.accentText, fontSize = 14.sp), modifier = Modifier.padding(top = 10.dp).pressable({ copy(context, pay); toaster.show("Copied $pay") }))
                } else {
                    val mine = s?.myUpiId.orEmpty()
                    if (mine.isBlank()) {
                        AppTextField(myUpiField, { myUpiField = it }, label = "Your UPI ID", placeholder = "you@bank")
                        Text("Used only to build a pay link. AIIMIN never sends a UPI collect request.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 4.dp, bottom = 8.dp))
                    }
                    val me = mine.ifBlank { myUpiField.trim() }
                    AppButton("Ask ${b.name} for ${Money.whole(b.netPaise)}", {
                        if (!me.contains('@')) { toaster.show("Add your UPI ID first"); return@AppButton }
                        if (mine.isBlank()) vm.saveMyUpi(me)
                        val link = Splits.upiPayUri(me, s?.name?.ifBlank { null } ?: "AIIMIN", b.netPaise, "Settle up")
                        val text = "Hi ${b.name}, settling up: ${Money.whole(b.netPaise)}. Pay here: $link"
                        context.startActivity(Intent.createChooser(Intent(Intent.ACTION_SEND).setType("text/plain").putExtra(Intent.EXTRA_TEXT, text), "Ask ${b.name}"))
                    }, Modifier.fillMaxWidth(), icon = AppIcons.Share)
                }
                Spacer(Modifier.height(8.dp))
                AppButton("Mark settled", { vm.settle(b.who, "manual"); toaster.show("Settled with ${b.name}"); nav.back() }, Modifier.fillMaxWidth(), kind = ButtonKind.SECONDARY)
                SectionHeader("Shared payments")
            }
            items(b.lines, key = { it.txn.id + it.share.who }) { l ->
                Row(Modifier.fillMaxWidth().pressable({ nav.open(Route.Txn(l.txn.id)) }).heightIn(min = 56.dp).padding(vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
                    Column(Modifier.weight(1f)) {
                        Text(l.txn.title, style = Aiimin.type.bodyStrong)
                        Text(
                            "${Dates.short(LocalDate.parse(l.txn.day))} · " + if (l.share.owesMe) "you paid ${Money.whole(l.txn.amountPaise)}" else "${b.name} paid",
                            style = Aiimin.type.caption,
                        )
                    }
                    Text((if (l.share.owesMe) "+" else "−") + Money.whole(l.share.paise), style = Aiimin.type.bodyStrong)
                }
                Hairline()
            }
            item {
                Text("AIIMIN doesn't process payments. Payments happen in your UPI app. Nothing is settled on its own.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 18.dp))
            }
        }
    }
    if (askedPaid) {
        AppSheet({ askedPaid = false }, title = "Did the payment go through?") {
            AppButton("Yes, mark settled", { askedPaid = false; vm.settle(who, "upi"); toaster.show("Settled"); nav.back() }, Modifier.fillMaxWidth())
            Spacer(Modifier.height(8.dp))
            AppButton("Not yet", { askedPaid = false }, Modifier.fillMaxWidth(), kind = ButtonKind.SECONDARY)
        }
    }
}

private fun copy(context: Context, text: String) {
    (context.getSystemService(Context.CLIPBOARD_SERVICE) as? ClipboardManager)?.setPrimaryClip(ClipData.newPlainText("UPI ID", text))
}

/** "Split with…" on a payment (M3): equal parts with the people picked. */
@Composable
fun SplitSheet(amountPaise: Long, people: List<PersonEntity>, onDismiss: () -> Unit, onSplit: (List<Pair<String, String>>) -> Unit) {
    var picked by remember { mutableStateOf(listOf<Pair<String, String>>()) }
    var other by remember { mutableStateOf("") }
    AppSheet(onDismiss, title = "Split ${Money.whole(amountPaise)}", subtitle = "Equal parts. You paid; each person owes their part.") {
        PillRow {
            people.filter { it.id != "me" && it.id != "household" }.forEach { p ->
                val on = picked.any { it.first == p.id }
                Pill(p.name, on, { picked = if (on) picked.filter { it.first != p.id } else picked + (p.id to p.name) })
            }
        }
        Row(Modifier.padding(top = 8.dp), verticalAlignment = Alignment.CenterVertically) {
            AppTextField(other, { other = it }, placeholder = "Add a name", modifier = Modifier.weight(1f), onDone = {
                if (other.isNotBlank()) { picked = picked + ("name:" + other.trim().lowercase() to other.trim()); other = "" }
            })
        }
        if (picked.isNotEmpty()) {
            val each = amountPaise / (picked.size + 1)
            Text("${picked.joinToString { it.second }} ${if (picked.size == 1) "owes" else "each owe"} ${Money.whole(each)}", style = Aiimin.type.body, modifier = Modifier.padding(top = 12.dp))
        }
        Spacer(Modifier.height(14.dp))
        AppButton("Split", { onSplit(picked) }, Modifier.fillMaxWidth(), enabled = picked.isNotEmpty())
    }
}

// =================================================================== M13 Recurring and bills

@HiltViewModel
class BillsViewModel @Inject constructor(private val repo: BillRepository, private val clock: aiimin.core.data.core.DayClock) : ViewModel() {
    val bills = repo.bills.stateIn(viewModelScope, SharingStarted.Eagerly, null)
    val today = MutableStateFlow(LocalDate.now())

    init {
        viewModelScope.launch { today.value = clock.today(); repo.refresh() }
    }

    fun confirm(id: String) = viewModelScope.launch { repo.confirm(id) }
    fun dismiss(id: String) = viewModelScope.launch { repo.dismiss(id) }
    fun paid(id: String) = viewModelScope.launch { repo.markPaid(id) }
    fun save(b: BillEntity) = viewModelScope.launch { repo.save(b) }
    fun add(title: String, paise: Long, cadence: Cadence, due: LocalDate, autopay: Boolean) = viewModelScope.launch { repo.add(title, paise, cadence, due, autopay) }
}

/** M13 · Recurring and bills, with the month's calendar strip. */
@Composable
fun RecurringScreen(vm: BillsViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val c = Aiimin.colors
    val list by vm.bills.collectAsStateWithLifecycle()
    val today by vm.today.collectAsStateWithLifecycle()
    var adding by remember { mutableStateOf(false) }
    var editing by remember { mutableStateOf<BillEntity?>(null) }
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Recurring and bills", onBack = { nav.back() }) { AppIconButton(AppIcons.Plus, "Add a bill", { adding = true }) }
        val items = list ?: return@Column
        val suggested = items.filter { it.status == "SUGGESTED" }
        val confirmed = items.filter { it.status == "CONFIRMED" }
        LazyColumn(contentPadding = PaddingValues(start = Aiimin.space.gutter, end = Aiimin.space.gutter, bottom = 40.dp)) {
            item { MonthStrip(today, confirmed) }
            if (suggested.isNotEmpty()) {
                item { SectionHeader("Looks recurring") }
                items(suggested, key = { it.id }) { b ->
                    Column(Modifier.fillMaxWidth().padding(vertical = 10.dp)) {
                        Text("Looks ${runCatching { Cadence.valueOf(b.cadence).label.lowercase() }.getOrDefault("monthly")}: ${b.title} ${Money.whole(b.amountPaise)}", style = Aiimin.type.bodyStrong)
                        Text("Last paid ${b.lastPaid?.let { Dates.short(LocalDate.parse(it)) } ?: "—"} · next around ${Dates.short(LocalDate.parse(b.nextDue))}", style = Aiimin.type.caption)
                        Row(Modifier.padding(top = 8.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            AppButton("Confirm", { vm.confirm(b.id); toaster.show("${b.title} added to bills") }, compact = true)
                            AppButton("Not recurring", { vm.dismiss(b.id) }, kind = ButtonKind.SECONDARY, compact = true)
                        }
                    }
                    Hairline()
                }
            }
            item { SectionHeader(if (confirmed.isEmpty()) "Bills" else "Bills · ${Money.whole(confirmed.sumOf { it.amountPaise })} a cycle") }
            if (confirmed.isEmpty()) item {
                Text("Confirmed bills show here with their next date. AIIMIN spots them after two or three similar payments, or add one with ＋.", style = Aiimin.type.caption, modifier = Modifier.padding(vertical = 6.dp))
            }
            items(confirmed.filter { !it.autopay }, key = { it.id }) { b -> BillRow(b, today, { editing = b }, { vm.paid(b.id); toaster.show("Marked paid") }) }
            val auto = confirmed.filter { it.autopay }
            if (auto.isNotEmpty()) {
                item { SectionHeader("UPI AutoPay") }
                items(auto, key = { it.id }) { b -> BillRow(b, today, { editing = b }, null) }
            }
        }
    }
    if (adding) BillSheet(null, today, { adding = false }) { t, p, cad, due, auto, _ -> vm.add(t, p, cad, due, auto); adding = false }
    editing?.let { e ->
        BillSheet(e, today, { editing = null }) { t, p, cad, due, auto, remind ->
            vm.save(e.copy(title = t, amountPaise = p, cadence = cad.name, nextDue = due.toString(), autopay = auto, remind = remind)); editing = null
        }
    }
}

@Composable
private fun BillRow(b: BillEntity, today: LocalDate, onOpen: () -> Unit, onPaid: (() -> Unit)?) {
    val c = Aiimin.colors
    val due = LocalDate.parse(b.nextDue)
    val days = ChronoUnit.DAYS.between(today, due)
    Row(Modifier.fillMaxWidth().pressable(onOpen).heightIn(min = 60.dp).padding(vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
        Column(Modifier.weight(1f)) {
            Text(b.title, style = Aiimin.type.bodyStrong)
            Text(
                listOfNotNull(
                    when { days < 0 -> "was due ${Dates.short(due)}"; days == 0L -> "due today"; days == 1L -> "due tomorrow"; days < 10 -> "in $days days"; else -> Dates.short(due) },
                    runCatching { Cadence.valueOf(b.cadence).label }.getOrNull(), if (b.remind) "reminder a day before" else null,
                ).joinToString(" · "),
                style = Aiimin.type.caption.copy(color = if (days in 0..2) c.accentText else c.textMuted),
            )
        }
        Text(Money.whole(b.amountPaise), style = Aiimin.type.bodyStrong)
        if (onPaid != null) Text("Paid", style = Aiimin.type.label.copy(color = c.accentText, fontSize = 14.sp), modifier = Modifier.padding(start = 14.dp).heightIn(min = 48.dp).pressable(onPaid).padding(top = 14.dp))
    }
    Hairline()
}

/** The month as a strip of days with a dot on each bill's date. */
@Composable
private fun MonthStrip(today: LocalDate, bills: List<BillEntity>) {
    val c = Aiimin.colors
    val ym = YearMonth.from(today)
    val dueDays = bills.map { LocalDate.parse(it.nextDue) }.filter { YearMonth.from(it) == ym }.map { it.dayOfMonth }.toSet()
    Column(Modifier.padding(top = 8.dp)) {
        Text(ym.month.getDisplayName(TextStyle.FULL, Locale.ENGLISH), style = Aiimin.type.caption)
        Row(Modifier.fillMaxWidth().padding(top = 6.dp), horizontalArrangement = Arrangement.SpaceBetween) {
            (1..ym.lengthOfMonth()).forEach { d ->
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Box(Modifier.size(width = 4.dp, height = if (d == today.dayOfMonth) 16.dp else 10.dp).clip(RoundedCornerShape(1.dp)).background(if (d < today.dayOfMonth) c.text else c.border))
                    Spacer(Modifier.height(3.dp))
                    Box(Modifier.size(5.dp).clip(CircleShape).background(if (d in dueDays) c.accent else androidx.compose.ui.graphics.Color.Transparent))
                }
            }
        }
    }
}

@Composable
private fun BillSheet(b: BillEntity?, today: LocalDate, onDismiss: () -> Unit, onSave: (String, Long, Cadence, LocalDate, Boolean, Boolean) -> Unit) {
    var title by remember { mutableStateOf(b?.title.orEmpty()) }
    var amount by remember { mutableStateOf(b?.amountPaise?.div(100)?.toString().orEmpty()) }
    var cadence by remember { mutableStateOf(b?.cadence?.let { runCatching { Cadence.valueOf(it) }.getOrNull() } ?: Cadence.MONTHLY) }
    var due by remember { mutableStateOf(b?.nextDue?.let(LocalDate::parse) ?: today.plusDays(7)) }
    var auto by remember { mutableStateOf(b?.autopay ?: false) }
    var remind by remember { mutableStateOf(b?.remind ?: true) }
    var pick by remember { mutableStateOf(false) }
    AppSheet(onDismiss, title = if (b == null) "Add a bill" else b.title) {
        AppTextField(title, { title = it }, label = "Name", placeholder = "Rent, Netflix, Airtel")
        Spacer(Modifier.height(10.dp))
        AppTextField(amount, { v -> amount = v.filter(Char::isDigit) }, label = "Amount (₹)", keyboardType = KeyboardType.Number)
        SectionHeader("Repeats")
        Segmented(Cadence.entries.map { it.label }, Cadence.entries.indexOf(cadence), { cadence = Cadence.entries[it] })
        ListRow("Next due", subtitle = Dates.long(due), trailing = { Chevron() }, onClick = { pick = true })
        SwitchRow("UPI AutoPay", auto, { auto = it }, subtitle = "Money leaves on its own; shown separately")
        SwitchRow("Remind me a day before", remind, { remind = it })
        Spacer(Modifier.height(12.dp))
        val paise = (amount.toLongOrNull() ?: 0) * 100
        AppButton("Save", { onSave(title.trim(), paise, cadence, due, auto, remind) }, Modifier.fillMaxWidth(), enabled = title.isNotBlank() && paise > 0)
    }
    if (pick) DatePick(due, { due = it; pick = false }, { pick = false })
}

// =================================================================== M14 Export for CA

/** M14 · Export for CA: month, ledger, CSV, then the share sheet. */
@Composable
fun ExportSheet(money: suspend (YearMonth, Ledger) -> Pair<Int, String>, export: suspend (YearMonth, Ledger) -> java.io.File, today: LocalDate, onDismiss: () -> Unit) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    var month by remember { mutableStateOf(YearMonth.from(today)) }
    var ledger by remember { mutableStateOf(Ledger.BUSINESS) }
    val info by produceState<Pair<Int, String>?>(null, month, ledger) { value = money(month, ledger) }
    AppSheet(onDismiss, title = "Export for CA") {
        Row(verticalAlignment = Alignment.CenterVertically) {
            AppIconButton(AppIcons.CaretLeft, "Earlier month", { month = month.minusMonths(1) })
            Text(month.month.getDisplayName(TextStyle.FULL, Locale.ENGLISH) + " " + month.year, style = Aiimin.type.headline, modifier = Modifier.weight(1f))
            AppIconButton(AppIcons.CaretRight, "Later month", { if (month < YearMonth.from(today)) month = month.plusMonths(1) })
        }
        SectionHeader("Ledger")
        Segmented(Ledger.entries.map { it.label }, Ledger.entries.indexOf(ledger), { ledger = Ledger.entries[it] })
        Spacer(Modifier.height(12.dp))
        Text(info?.let { "${it.second} · ${it.first} rows · CSV" } ?: "Counting…", style = Aiimin.type.body.copy(color = Aiimin.colors.textMuted))
        Text("Date, time, payee, category, account, method, UPI reference and note. Receipts stay in the vault.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 4.dp))
        Spacer(Modifier.height(14.dp))
        AppButton("Export", {
            scope.launch {
                val f = export(month, ledger)
                val uri = FileProvider.getUriForFile(context, context.packageName + ".files", f)
                context.startActivity(Intent.createChooser(Intent(Intent.ACTION_SEND).setType("text/csv").putExtra(Intent.EXTRA_STREAM, uri).addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION), "Export"))
                onDismiss()
            }
        }, Modifier.fillMaxWidth(), icon = AppIcons.Export, enabled = (info?.first ?: 0) > 0)
    }
}

// =================================================================== M16 Payee memory

@HiltViewModel
class PayeeMemoryViewModel @Inject constructor(private val repo: PayeeMemoryRepository, private val money: aiimin.core.data.money.MoneyRepository) : ViewModel() {
    val query = MutableStateFlow("")
    /** One row per place: a place is remembered under several keys (UPI handle, its name, the bank's name for it). */
    val rules = combine(repo.rules, query) { r, q ->
        r.filter { q.isBlank() || it.label.contains(q, true) || it.key.contains(q.lowercase()) || it.category.contains(q, true) }
            .groupBy { it.label.ifBlank { it.key }.lowercase() }.values.map { g -> g.maxBy { it.hits } to g.map { it.key } }
    }.stateIn(viewModelScope, SharingStarted.Eagerly, null)
    val categories = money.categories(inbound = false).stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    val custom = money.customCategories().stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

    fun save(r: PayeeRuleEntity, keys: List<String>) = viewModelScope.launch { keys.forEach { k -> repo.save(r.copy(key = k)) } }
    fun delete(keys: List<String>) = viewModelScope.launch { keys.forEach { repo.delete(it) } }
    fun archive(c: aiimin.core.database.CategoryEntity, archived: Boolean) = viewModelScope.launch { money.archiveCategory(c, archived) }
}

/** M16 · What AIIMIN has learned about payees. */
@Composable
fun PayeeMemoryScreen(vm: PayeeMemoryViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val c = Aiimin.colors
    val list by vm.rules.collectAsStateWithLifecycle()
    val q by vm.query.collectAsStateWithLifecycle()
    var editing by remember { mutableStateOf<Pair<PayeeRuleEntity, List<String>>?>(null) }
    val spendCats by vm.categories.collectAsStateWithLifecycle()
    val custom by vm.custom.collectAsStateWithLifecycle()
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Places and categories", onBack = { nav.back() })
        Column(Modifier.padding(horizontal = Aiimin.space.gutter)) {
            AppTextField(q, { vm.query.value = it }, placeholder = "Search payee or category", leading = AppIcons.Search)
        }
        val items = list ?: return@Column
        LazyColumn(contentPadding = PaddingValues(start = Aiimin.space.gutter, end = Aiimin.space.gutter, bottom = 40.dp)) {
            if (items.isEmpty()) item {
                Text(
                    if (q.isBlank()) "Nothing learned yet. When you confirm a payment and keep \"Remember\" on, the payee's category lands here." else "No payee matches.",
                    style = Aiimin.type.caption, modifier = Modifier.padding(vertical = 16.dp),
                )
            }
            items(items, key = { it.first.key }) { (r, keys) ->
                Row(Modifier.fillMaxWidth().pressable({ editing = r to keys }).heightIn(min = 60.dp).padding(vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
                    Column(Modifier.weight(1f)) {
                        Text(r.label.ifBlank { r.key.replaceFirstChar { it.uppercase() } }, style = Aiimin.type.bodyStrong)
                        Text(
                            if (r.alwaysAsk) "Always ask" else "→ ${r.category} · ${Ledger.entries.firstOrNull { it.name == r.ledger }?.label ?: r.ledger}" + if (r.hits > 1) " · used ${r.hits} times" else "",
                            style = Aiimin.type.caption,
                        )
                        aiimin.core.data.money.MerchantMemory.notes(r).takeIf { it.isNotEmpty() }?.let { n ->
                            Text("Bought: ${n.joinToString(", ")}", style = Aiimin.type.caption, maxLines = 1)
                        }
                    }
                    Chevron()
                }
                Hairline()
            }
            if (q.isBlank() && custom.isNotEmpty()) {
                item { SectionHeader("Your categories", Modifier.padding(top = 16.dp)) }
                items(custom, key = { "cat-" + it.id }) { cat ->
                    ListRow(
                        cat.name, subtitle = if (cat.archived) "Archived · hidden from the chips" else if (cat.kind == "in") "Money in" else "Money out",
                        trailing = { AppButton(if (cat.archived) "Restore" else "Archive", { vm.archive(cat, !cat.archived) }, kind = ButtonKind.GHOST, compact = true) },
                    )
                }
            }
        }
    }
    editing?.let { (r, keys) ->
        var cat by remember(r.key) { mutableStateOf(r.category) }
        var ledger by remember(r.key) { mutableStateOf(r.ledger) }
        var ask by remember(r.key) { mutableStateOf(r.alwaysAsk) }
        var label by remember(r.key) { mutableStateOf(r.label) }
        AppSheet({ editing = null }, title = r.label.ifBlank { r.key }) {
            AppTextField(label, { label = it }, label = "Shown as")
            SectionHeader("Category")
            PillRow { (spendCats + Categories.INCOME + listOf(cat)).distinct().forEach { k -> Pill(k, cat == k, { cat = k }) } }
            SectionHeader("Ledger")
            Segmented(Ledger.entries.map { it.label }, Ledger.entries.indexOfFirst { it.name == ledger }.coerceAtLeast(0), { ledger = Ledger.entries[it].name })
            SwitchRow("Always ask for this payee", ask, { ask = it }, subtitle = "For shops where one payment is groceries and the next is a gift")
            Spacer(Modifier.height(12.dp))
            AppButton("Save", { vm.save(r.copy(category = cat, ledger = ledger, alwaysAsk = ask, label = label.trim()), keys); editing = null; toaster.show("Saved") }, Modifier.fillMaxWidth())
            Spacer(Modifier.height(8.dp))
            AppButton("Forget this payee", { vm.delete(keys); editing = null; toaster.show("Forgotten") }, Modifier.fillMaxWidth(), kind = ButtonKind.GHOST)
        }
    }
}
