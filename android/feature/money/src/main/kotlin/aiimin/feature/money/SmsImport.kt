package aiimin.feature.money

import aiimin.core.data.money.Categories
import aiimin.core.data.money.Ledger
import aiimin.core.data.money.MoneyRepository
import aiimin.core.data.money.SmsImporter
import aiimin.core.data.money.SmsPeriods
import aiimin.core.data.money.SmsYearRun
import aiimin.core.data.util.Dates
import aiimin.core.data.util.Money
import aiimin.core.database.TxnDraftEntity
import aiimin.core.nlp.MoneyDirection
import aiimin.core.nlp.SiftedSms
import aiimin.core.nlp.SmsDirection
import aiimin.core.nlp.SmsFilter
import aiimin.core.nlp.SmsSift
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppTextField
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.Meter
import aiimin.designsystem.component.Pill
import aiimin.designsystem.component.SectionHeader
import aiimin.designsystem.component.Segmented
import aiimin.designsystem.component.SwitchRow
import aiimin.designsystem.component.TopBar
import aiimin.designsystem.component.pressable
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.LocalToaster
import aiimin.designsystem.nav.Route
import aiimin.designsystem.theme.Aiimin
import android.Manifest
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
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
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import java.time.Instant
import java.time.YearMonth
import java.time.ZoneId
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

enum class SmsMode(val title: String, val line: String) {
    ONE("One by one", "See each payment, then book it, keep it for Review, or skip it."),
    MONTH("A month at a time", "Every payment from one month goes to Review together."),
    YEAR("A whole year, automatically", "AIIMIN reads month by month in the background and tells you when it is done."),
}

@HiltViewModel
class SmsImportViewModel @Inject constructor(private val importer: SmsImporter, private val money: MoneyRepository) : ViewModel() {
    val now: YearMonth = YearMonth.now()
    val mode = MutableStateFlow(SmsMode.MONTH)
    val month = MutableStateFlow(now)
    /** null = the last 12 months. */
    val year = MutableStateFlow<Int?>(null)
    val granted = MutableStateFlow(importer.canRead())
    val filter = importer.filter.stateIn(viewModelScope, SharingStarted.Eagerly, SmsFilter())
    val yearRun = importer.yearRun.stateIn(viewModelScope, SharingStarted.Eagerly, null)
    val preview = MutableStateFlow<SmsImporter.Preview?>(null)
    val loading = MutableStateFlow(false)
    private val tick = MutableStateFlow(0)
    /** Banks and accounts seen over the last 12 months, for the filter chips. */
    val seenBanks = MutableStateFlow<Map<String, Int>>(emptyMap())
    val seenAccounts = MutableStateFlow<Map<String, Int>>(emptyMap())

    fun months(): List<YearMonth> = if (mode.value == SmsMode.YEAR) SmsPeriods.yearMonths(year.value, now) else listOf(month.value)

    init {
        viewModelScope.launch {
            combine(combine(mode, month, year) { _, _, _ -> }, filter, granted, tick) { _, f, g, _ -> f to g }.collectLatest { (f, g) ->
                if (!g) { preview.value = null; return@collectLatest }
                loading.value = true
                preview.value = importer.preview(months(), f)
                loading.value = false
            }
        }
        viewModelScope.launch {
            granted.collectLatest { g ->
                if (!g) return@collectLatest
                // Chips list every bank, even ones the current filter leaves out.
                importer.preview(SmsPeriods.yearMonths(null, now), SmsFilter(banksOnly = false))?.let {
                    seenBanks.value = it.sift.banks
                    seenAccounts.value = it.sift.accounts
                }
            }
        }
    }

    fun recheck() { granted.value = importer.canRead() }
    fun refresh() { tick.value++ }
    fun setFilter(f: SmsFilter) = viewModelScope.launch { importer.setFilter(f) }
    suspend fun importMonth() = importer.importMonths(listOf(month.value), filter.value)
    fun startYear() = viewModelScope.launch { importer.startYear(year.value) }
    fun stopYear() = viewModelScope.launch { importer.stopYear() }
    fun resumeYear() = viewModelScope.launch { importer.resumeYear() }
    fun clearYear() = viewModelScope.launch { importer.clearYear() }

    suspend fun prepare(s: SiftedSms): TxnDraftEntity? = importer.addOne(s)
    suspend fun book(d: TxnDraftEntity, category: String) = money.settle(d.id, category, Ledger.PERSONAL, d.title, learn = true)
    suspend fun skip(d: TxnDraftEntity) = money.dismiss(d.id)
    suspend fun rest(list: List<SiftedSms>): Int = list.count { importer.addOne(it) != null }
}

/**
 * "Past bank messages" (plan §3A): pick how (one by one, a month, a whole year), which period,
 * and a filter; see what would come in before anything is added.
 */
@OptIn(ExperimentalLayoutApi::class)
@Composable
fun SmsImportScreen(vm: SmsImportViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    val c = Aiimin.colors
    val mode by vm.mode.collectAsStateWithLifecycle()
    val month by vm.month.collectAsStateWithLifecycle()
    val year by vm.year.collectAsStateWithLifecycle()
    val granted by vm.granted.collectAsStateWithLifecycle()
    val filter by vm.filter.collectAsStateWithLifecycle()
    val run by vm.yearRun.collectAsStateWithLifecycle()
    val preview by vm.preview.collectAsStateWithLifecycle()
    val loading by vm.loading.collectAsStateWithLifecycle()
    val banks by vm.seenBanks.collectAsStateWithLifecycle()
    val accounts by vm.seenAccounts.collectAsStateWithLifecycle()
    var editing by remember { mutableStateOf(false) }
    var queue by remember { mutableStateOf<List<SiftedSms>?>(null) }
    var busy by remember { mutableStateOf(false) }
    val permission = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { ok ->
        vm.recheck()
        if (!ok) toaster.show("Without SMS access, AIIMIN reads only new payment notifications")
    }

    queue?.let { q ->
        OneByOne(q, vm, onDone = { queue = null; vm.refresh() }, onReview = { queue = null; nav.back(); nav.open(Route.MoneyInbox) })
        return
    }

    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Past bank messages", onBack = { nav.back() })
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = Aiimin.space.gutter)) {
            Text(
                "Your bank already texted you every payment. AIIMIN reads those messages on this phone, never uploads them, and nothing is booked until you say so.",
                style = Aiimin.type.body.copy(color = c.textMuted),
            )
            run?.let { YearCard(it, vm, onReview = { nav.open(Route.MoneyInbox) }) }
            if (!granted) {
                Column(Modifier.padding(top = 18.dp).fillMaxWidth().clip(RoundedCornerShape(14.dp)).background(c.surface).border(1.dp, c.border, RoundedCornerShape(14.dp)).padding(16.dp)) {
                    Text("Let AIIMIN read your SMS", style = Aiimin.type.cardTitle)
                    Spacer(Modifier.height(6.dp))
                    Text("Only bank payments are used. OTPs, offers and personal chats are skipped and never stored.", style = Aiimin.type.caption.copy(fontSize = 14.sp))
                }
            }

            SectionHeader("How", Modifier.padding(top = 18.dp))
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                SmsMode.entries.forEach { m -> ModeRow(m, mode == m) { vm.mode.value = m } }
            }

            SectionHeader(if (mode == SmsMode.YEAR) "Which year" else "Which month", Modifier.padding(top = 18.dp))
            FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                if (mode == SmsMode.YEAR) {
                    listOf<Int?>(null, vm.now.year, vm.now.year - 1, vm.now.year - 2).forEach { y ->
                        val label = if (y == null) "Last 12 months" else SmsPeriods.yearLabel(y, vm.now).replaceFirstChar { it.uppercase() }
                        Pill(label, year == y, { vm.year.value = y })
                    }
                } else {
                    SmsPeriods.recentMonths(vm.now, 12).forEach { m -> Pill(SmsPeriods.monthName(m, vm.now), month == m, { vm.month.value = m }) }
                }
            }

            SectionHeader("Filter", Modifier.padding(top = 18.dp), action = if (editing) "Done" else "Change", onAction = { editing = !editing })
            Text(filter.summary(), style = Aiimin.type.bodyStrong)
            if (editing) FilterEditor(filter, banks, accounts, vm::setFilter)
            Text(
                "Always skipped: OTPs, offers, collect requests, failed payments, statements and balance updates.",
                style = Aiimin.type.caption, modifier = Modifier.padding(top = 8.dp),
            )

            PreviewCard(mode, granted, loading, preview, run, vm)
            Spacer(Modifier.height(24.dp))
        }
        val n = preview?.fresh?.size ?: 0
        Column(Modifier.padding(horizontal = Aiimin.space.gutter, vertical = 10.dp)) {
            val label = when {
                !granted -> "Allow SMS access"
                busy -> "Bringing them in…"
                mode == SmsMode.ONE -> if (n == 0) "Nothing new to go through" else "Go through $n one by one"
                mode == SmsMode.MONTH -> if (n == 0) "Nothing new in ${SmsPeriods.monthName(month, vm.now)}" else "Bring in $n payment${if (n == 1) "" else "s"}"
                run != null && !run!!.finished && !run!!.stopped -> "Reading in the background…"
                else -> "Read ${SmsPeriods.yearLabel(year, vm.now)} in the background"
            }
            val enabled = !busy && (!granted || when (mode) { SmsMode.YEAR -> run == null || run!!.finished || run!!.stopped; else -> n > 0 })
            AppButton(label, {
                when {
                    !granted -> permission.launch(Manifest.permission.READ_SMS)
                    mode == SmsMode.ONE -> queue = preview?.fresh.orEmpty()
                    mode == SmsMode.MONTH -> {
                        busy = true
                        scope.launch {
                            val r = vm.importMonth()
                            busy = false
                            if (r != null && r.added > 0) {
                                toaster.show("${r.added} payment${if (r.added == 1) " is" else "s are"} waiting in Review")
                                nav.back(); nav.open(Route.MoneyInbox)
                            } else toaster.show("Nothing new in ${SmsPeriods.monthName(month, vm.now)}")
                        }
                    }
                    else -> { vm.startYear(); toaster.show("Reading ${SmsPeriods.yearLabel(year, vm.now)}. You can leave this screen.") }
                }
            }, enabled = enabled, modifier = Modifier.fillMaxWidth())
        }
    }
}

@Composable
private fun ModeRow(m: SmsMode, selected: Boolean, onClick: () -> Unit) {
    val c = Aiimin.colors
    val shape = RoundedCornerShape(14.dp)
    Row(
        Modifier.fillMaxWidth().clip(shape).background(if (selected) c.accentSoft else c.surface)
            .border(1.dp, if (selected) c.accent else c.border, shape).pressable(onClick).padding(14.dp),
        verticalAlignment = Alignment.Top,
    ) {
        Icon(if (selected) AppIcons.CheckCircle else AppIcons.Circle, null, tint = if (selected) c.accentText else c.textFaint, modifier = Modifier.padding(top = 2.dp).size(20.dp))
        Spacer(Modifier.width(12.dp))
        Column(Modifier.weight(1f)) {
            Text(m.title, style = Aiimin.type.bodyStrong)
            Spacer(Modifier.height(2.dp))
            Text(m.line, style = Aiimin.type.caption.copy(fontSize = 14.sp, lineHeight = 19.sp))
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun FilterEditor(f: SmsFilter, banks: Map<String, Int>, accounts: Map<String, Int>, set: (SmsFilter) -> Unit) {
    var words by remember { mutableStateOf(f.words.joinToString(", ")) }
    Column(Modifier.padding(top = 12.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
        Column {
            Text("Banks", style = Aiimin.type.label, modifier = Modifier.padding(bottom = 8.dp))
            FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Pill("Every bank", f.banks.isEmpty(), { set(f.copy(banks = emptySet())) })
                banks.keys.sorted().forEach { b ->
                    Pill(b, b in f.banks, { set(f.copy(banks = if (b in f.banks) f.banks - b else f.banks + b)) }, count = banks[b])
                }
            }
            if (banks.isEmpty()) Text("Banks appear here once AIIMIN has read your messages.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 6.dp))
        }
        if (accounts.size > 1) Column {
            Text("Accounts and cards", style = Aiimin.type.label, modifier = Modifier.padding(bottom = 8.dp))
            FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Pill("All", f.accounts.isEmpty(), { set(f.copy(accounts = emptySet())) })
                accounts.keys.sorted().forEach { a ->
                    Pill("••$a", a in f.accounts, { set(f.copy(accounts = if (a in f.accounts) f.accounts - a else f.accounts + a)) }, count = accounts[a])
                }
            }
        }
        Column {
            Text("Money", style = Aiimin.type.label, modifier = Modifier.padding(bottom = 8.dp))
            Segmented(listOf("In and out", "Out", "In"), SmsDirection.entries.indexOf(f.direction), { set(f.copy(direction = SmsDirection.entries[it])) })
        }
        Column {
            Text("Smallest amount", style = Aiimin.type.label, modifier = Modifier.padding(bottom = 8.dp))
            FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf(0L, 50L, 100L, 500L, 1000L).forEach { r -> Pill(if (r == 0L) "Any" else SmsSift.rupees(r), f.minRupees == r, { set(f.copy(minRupees = r)) }) }
            }
        }
        AppTextField(
            words, { words = it; set(f.copy(skipWords = it.split(',').map(String::trim).filter(String::isNotEmpty))) },
            label = "Skip messages that mention", placeholder = "wallet, mandate, EMI",
        )
        SwitchRow("Bank senders only", f.banksOnly, { set(f.copy(banksOnly = it)) }, subtitle = "Skips messages from phone numbers, like forwards from family")
    }
}

@Composable
private fun PreviewCard(mode: SmsMode, granted: Boolean, loading: Boolean, p: SmsImporter.Preview?, run: SmsYearRun?, vm: SmsImportViewModel) {
    if (!granted) return
    val c = Aiimin.colors
    val shape = RoundedCornerShape(14.dp)
    Column(Modifier.padding(top = 18.dp).fillMaxWidth().clip(shape).background(c.surface).border(1.dp, c.border, shape).padding(16.dp)) {
        val period = if (mode == SmsMode.YEAR) SmsPeriods.yearLabel(vm.year.value, vm.now) else SmsPeriods.monthName(vm.month.value, vm.now)
        when {
            loading || p == null -> Text("Reading $period…", style = Aiimin.type.bodyStrong)
            else -> {
                val n = p.fresh.size
                Text(if (n == 0) "Nothing new in $period" else "$n payment${if (n == 1) "" else "s"} to bring in from $period", style = Aiimin.type.cardTitle)
                val sums = p.fresh.groupBy { it.alert.direction }.mapValues { (_, l) -> l.sumOf { it.alert.amount } }
                val money = listOfNotNull(
                    sums[MoneyDirection.OUT]?.let { "${SmsSift.rupees(it)} out" },
                    sums[MoneyDirection.IN]?.let { "${SmsSift.rupees(it)} in" },
                ).joinToString(" · ")
                if (money.isNotEmpty()) Text(money, style = Aiimin.type.bodyStrong, modifier = Modifier.padding(top = 4.dp))
                val lines = listOfNotNull(
                    p.already.takeIf { it > 0 }?.let { "$it already in AIIMIN" },
                    SmsSift.skippedLine(p.sift.skipped).ifEmpty { null },
                    "${p.read} message${if (p.read == 1) "" else "s"} read".takeIf { p.read > 0 },
                )
                lines.forEach { Text(it, style = Aiimin.type.caption.copy(fontSize = 14.sp), modifier = Modifier.padding(top = 4.dp)) }
                if (mode == SmsMode.YEAR && run != null && !run.finished && !run.stopped) {
                    Text("A year is already being read. Stop it to start another.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 6.dp))
                }
            }
        }
    }
}

@Composable
private fun YearCard(run: SmsYearRun, vm: SmsImportViewModel, onReview: () -> Unit) {
    val c = Aiimin.colors
    val shape = RoundedCornerShape(14.dp)
    Column(Modifier.padding(top = 18.dp).fillMaxWidth().clip(shape).background(c.surface).border(1.dp, c.border, shape).padding(16.dp)) {
        Text(
            when {
                run.finished -> run.doneLine()
                run.stopped -> "Paused: ${run.label}"
                else -> "Reading ${run.label}"
            },
            style = Aiimin.type.cardTitle,
        )
        Spacer(Modifier.height(10.dp))
        Meter(run.doneMonths / run.total.coerceAtLeast(1).toFloat(), color = if (run.finished) c.done else c.accent)
        Text(run.progressLine(), style = Aiimin.type.caption.copy(fontSize = 14.sp), modifier = Modifier.padding(top = 8.dp))
        Row(Modifier.padding(top = 12.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            when {
                run.finished -> {
                    if (run.added > 0) AppButton("Open Review", onReview, compact = true)
                    AppButton("Hide", { vm.clearYear() }, kind = ButtonKind.GHOST, compact = true)
                }
                run.stopped -> {
                    AppButton("Carry on", { vm.resumeYear() }, compact = true)
                    AppButton("Hide", { vm.clearYear() }, kind = ButtonKind.GHOST, compact = true)
                }
                else -> AppButton("Pause", { vm.stopYear() }, kind = ButtonKind.SECONDARY, compact = true)
            }
        }
    }
}

/** One payment at a time: book it with a category, keep it for Review, or skip it for good. */
@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun OneByOne(queue: List<SiftedSms>, vm: SmsImportViewModel, onDone: () -> Unit, onReview: () -> Unit) {
    val c = Aiimin.colors
    val scope = rememberCoroutineScope()
    var i by remember { mutableStateOf(0) }
    var draft by remember { mutableStateOf<TxnDraftEntity?>(null) }
    var cat by remember { mutableStateOf("") }
    var booked by remember { mutableStateOf(0) }
    var later by remember { mutableStateOf(0) }
    var skipped by remember { mutableStateOf(0) }
    var working by remember { mutableStateOf(false) }
    val s = queue.getOrNull(i)
    LaunchedEffect(i) {
        draft = null
        val cur = queue.getOrNull(i) ?: return@LaunchedEffect
        val d = vm.prepare(cur)
        if (d == null) i++ else { draft = d; cat = d.category }
    }
    fun next(after: suspend (TxnDraftEntity) -> Unit) {
        val d = draft ?: return
        working = true
        scope.launch { after(d); working = false; i++ }
    }
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar(if (s == null) "All done" else "${i + 1} of ${queue.size}", onBack = onDone)
        Meter((i.coerceAtMost(queue.size)) / queue.size.coerceAtLeast(1).toFloat(), Modifier.padding(horizontal = Aiimin.space.gutter))
        if (s == null) {
            Column(Modifier.fillMaxSize().padding(32.dp), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
                Icon(AppIcons.CheckCircleFill, null, tint = c.done, modifier = Modifier.size(56.dp))
                Spacer(Modifier.height(16.dp))
                Text("All done", style = Aiimin.type.cardTitle)
                Spacer(Modifier.height(6.dp))
                Text(listOf("$booked booked", "$later in Review", "$skipped skipped").joinToString(" · "), style = Aiimin.type.caption.copy(fontSize = 14.sp))
                Spacer(Modifier.height(22.dp))
                if (later > 0) AppButton("Open Review", onReview, compact = true)
                AppButton("Done", onDone, kind = if (later > 0) ButtonKind.GHOST else ButtonKind.PRIMARY, compact = true, modifier = Modifier.padding(top = 8.dp))
            }
            return@Column
        }
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = Aiimin.space.gutter).padding(top = 14.dp)) {
            val shape = RoundedCornerShape(16.dp)
            Column(Modifier.fillMaxWidth().clip(shape).background(c.surface).border(1.dp, c.border, shape).padding(18.dp)) {
                val at = Instant.ofEpochMilli(s.message.at).atZone(ZoneId.systemDefault())
                Text(
                    listOfNotNull(Dates.dayMonthOf(at.toLocalDate()), s.bank, s.alert.accountLast4?.let { "••$it" }).joinToString(" · "),
                    style = Aiimin.type.caption,
                )
                Spacer(Modifier.height(12.dp))
                Row(verticalAlignment = Alignment.Bottom) {
                    Text(Money.format(s.alert.amount * 100), style = Aiimin.type.numberLarge.copy(fontSize = 44.sp, lineHeight = 48.sp))
                    Spacer(Modifier.width(8.dp))
                    Text(if (s.alert.direction == MoneyDirection.IN) "Received" else "Paid", style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(bottom = 6.dp))
                }
                Spacer(Modifier.height(6.dp))
                Text(draft?.title ?: s.alert.name, style = Aiimin.type.headline.copy(fontSize = 20.sp, lineHeight = 26.sp))
                Spacer(Modifier.height(6.dp))
                Text(s.message.body, style = Aiimin.type.caption.copy(fontFamily = FontFamily.Monospace, fontSize = 12.sp, lineHeight = 17.sp), maxLines = 4)
                Spacer(Modifier.height(16.dp))
                Text("CATEGORY", style = Aiimin.type.eyebrow)
                Spacer(Modifier.height(8.dp))
                FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    (if (s.alert.direction == MoneyDirection.IN) Categories.INCOME else Categories.SPEND).forEach { k -> Pill(k, cat == k, { cat = k }) }
                }
            }
        }
        Column(Modifier.padding(horizontal = Aiimin.space.gutter, vertical = 10.dp)) {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                AppButton("Skip", { next { vm.skip(it); skipped++ } }, kind = ButtonKind.GHOST, enabled = draft != null && !working, modifier = Modifier.weight(1f))
                AppButton("Later", { next { later++ } }, kind = ButtonKind.SECONDARY, enabled = draft != null && !working, modifier = Modifier.weight(1f))
                AppButton("Book", { next { vm.book(it, cat); booked++ } }, enabled = draft != null && !working, modifier = Modifier.weight(1f))
            }
            val left = queue.size - i - 1
            if (left > 0) AppButton(
                "Send the other $left to Review",
                { working = true; scope.launch { draft?.let { later++ }; later += vm.rest(queue.drop(i + 1)); working = false; i = queue.size } },
                kind = ButtonKind.GHOST, enabled = !working, modifier = Modifier.fillMaxWidth().padding(top = 4.dp),
            )
        }
    }
}
