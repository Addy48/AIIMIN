package aiimin.feature.money

import aiimin.core.data.money.payeeLabel
import aiimin.core.data.money.Categories
import aiimin.core.data.money.Ledger
import aiimin.core.data.util.Dates
import aiimin.core.data.util.Money
import aiimin.core.database.PayeeRuleEntity
import aiimin.core.database.TxnDraftEntity
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppIconButton
import aiimin.designsystem.component.AppTextField
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.CheckCircle
import aiimin.designsystem.component.Hairline
import aiimin.designsystem.component.Pill
import aiimin.designsystem.component.SurfaceCard
import aiimin.designsystem.component.TopBar
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.LocalToaster
import aiimin.designsystem.nav.Route
import aiimin.designsystem.theme.Aiimin
import aiimin.designsystem.theme.Shapes
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.produceState
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import java.time.Instant
import java.time.ZoneId
import kotlinx.coroutines.launch

/**
 * Review (4.4, improvement plan §3 Money): bank alerts as a list. Each row shows the guessed place and category;
 * a tap opens it in place to name the place, pick the category, say what was bought and choose the ledger.
 * "Confirm all" books every row as it stands. Nothing is booked before a tap.
 */
@Composable
fun MoneyInboxScreen(vm: InboxViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    val pending by vm.pending.collectAsStateWithLifecycle()
    val ledgers by vm.ledgers.collectAsStateWithLifecycle()
    val offer by vm.offer.collectAsStateWithLifecycle()
    val c = Aiimin.colors
    var open by remember { mutableStateOf<String?>(null) }
    // Edits live per payment, keyed by id, so closing a row keeps what was typed.
    var cats by remember { mutableStateOf(mapOf<String, String>()) }
    var keep by remember { mutableStateOf(mapOf<String, Boolean>()) }
    var names by remember { mutableStateOf(mapOf<String, String>()) }
    var notes by remember { mutableStateOf(mapOf<String, String>()) }
    var books by remember { mutableStateOf(mapOf<String, Ledger>()) }
    var busy by remember { mutableStateOf(false) }
    val spendCats by vm.categoriesOut.collectAsStateWithLifecycle()
    val incomeCats by vm.categoriesIn.collectAsStateWithLifecycle()

    fun ledgerOf(d: TxnDraftEntity) = books[d.id] ?: Ledger.entries.firstOrNull { it.name == d.ledger } ?: Ledger.PERSONAL
    fun placeOf(d: TxnDraftEntity) = names[d.id]?.trim()?.ifEmpty { null } ?: d.title
    suspend fun confirm(d: TxnDraftEntity) =
        vm.settle(d.id, cats[d.id] ?: d.category, ledgerOf(d), placeOf(d), keep[d.id] ?: true, notes[d.id], d.upiId)

    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar(if (pending.isEmpty()) "Review" else "Review · ${pending.size}", onBack = { nav.back() }) {
            AppIconButton(AppIcons.ClockCounter, "Bring in past messages", { nav.open(Route.SmsImport) })
        }
        if (pending.isEmpty() && offer == null) {
            Column(Modifier.fillMaxSize().padding(horizontal = 32.dp), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
                Icon(AppIcons.CheckCircleFill, null, tint = c.done, modifier = Modifier.size(56.dp))
                Spacer(Modifier.height(18.dp))
                Text("All caught up", style = Aiimin.type.cardTitle)
                Spacer(Modifier.height(6.dp))
                Text("New bank alerts land here as they arrive. Want older ones? Bring in this month's messages, or start from an earlier month.", style = Aiimin.type.caption.copy(fontSize = 14.sp), textAlign = androidx.compose.ui.text.style.TextAlign.Center)
                Spacer(Modifier.height(24.dp))
                AppButton("Bring in past messages", { nav.open(Route.SmsImport) }, compact = true)
                Spacer(Modifier.height(8.dp))
                AppButton("Back to Money", { nav.back() }, kind = ButtonKind.GHOST, compact = true)
            }
            return@Column
        }
        LazyColumn(Modifier.weight(1f), contentPadding = PaddingValues(start = Aiimin.space.gutter, end = Aiimin.space.gutter, bottom = 24.dp)) {
            offer?.let { place ->
                item(key = "offer") { RuleOfferCard(place, { vm.makeRule(place); toaster.show("Rule made · ${place.label.ifBlank { place.key }} files itself") }, { vm.notNow(place) }) }
            }
            if (pending.isNotEmpty()) item(key = "intro") {
                Text(
                    "Guessed from your rules, the places you named and a built-in list of shops. Tap a payment to change it.",
                    style = Aiimin.type.caption, modifier = Modifier.padding(top = 4.dp, bottom = 8.dp),
                )
                Hairline()
            }
            items(pending, key = { it.id }) { d ->
                val expanded = open == d.id
                DraftRow(d, placeOf(d), cats[d.id] ?: d.category, ledgerOf(d), showLedger = ledgers.size > 1, expanded = expanded) { open = if (expanded) null else d.id }
                if (expanded) {
                    val recent by produceState(emptyList<String>(), d.id) { value = vm.recentItems(d) }
                    DraftEditor(
                        d,
                        // D-043: a bare phone number is not shown as a name; the field starts empty with a masked hint.
                        name = names[d.id] ?: d.title.takeIf { payeeLabel(it) == it }.orEmpty(), onName = { names = names + (d.id to it) },
                        cat = cats[d.id] ?: d.category, onCat = { cats = cats + (d.id to it) },
                        categories = if (d.direction == "in") incomeCats else spendCats,
                        onNewCategory = { raw -> scope.launch { vm.addCategory(raw, d.direction == "in")?.let { cats = cats + (d.id to it) } ?: toaster.show("That category already exists") } },
                        note = notes[d.id].orEmpty(), onNote = { notes = notes + (d.id to it) }, recent = recent,
                        ledgers = ledgers, ledger = ledgerOf(d), onLedger = { books = books + (d.id to it) },
                        rememberIt = keep[d.id] ?: true, onRemember = { keep = keep + (d.id to it) },
                        onNotPayment = { open = null; vm.dismiss(d.id); toaster.show("Removed from review") },
                        onConfirm = {
                            scope.launch {
                                val place = placeOf(d)
                                confirm(d)
                                open = null
                                toaster.show("Confirmed ${Money.format(d.amountPaise)} · $place")
                            }
                        },
                    )
                }
                Hairline()
            }
        }
        // While one payment is open its own Confirm is the action; "Confirm all" waits until it is closed.
        if (pending.size > 1 && open == null) {
            Box(Modifier.fillMaxWidth().background(c.base).navigationBarsPadding().padding(horizontal = Aiimin.space.gutter).padding(top = 8.dp, bottom = 14.dp)) {
                AppButton(
                    "Confirm all ${pending.size}",
                    {
                        if (busy) return@AppButton
                        busy = true
                        scope.launch {
                            val all = pending.toList()
                            all.forEach { confirm(it) }
                            open = null
                            busy = false
                            toaster.show("Confirmed ${all.size} payments")
                        }
                    },
                    Modifier.fillMaxWidth(), icon = AppIcons.Check, enabled = !busy,
                )
            }
        }
    }
}

/** One payment: place and when on the left, amount and guessed category on the right. */
@Composable
private fun DraftRow(d: TxnDraftEntity, place: String, category: String, ledger: Ledger, showLedger: Boolean, expanded: Boolean, onClick: () -> Unit) {
    val whenText = Instant.ofEpochMilli(d.detectedAt).atZone(ZoneId.systemDefault()).let { Dates.relative(it.toLocalDate(), java.time.LocalDate.now()) + " " + Dates.clock(it.toLocalTime()) }
    val unclear = d.confidence < 0.75
    Row(
        Modifier.fillMaxWidth().clip(Shapes.row).clickable(onClickLabel = if (expanded) "Close" else "Change") { onClick() }.heightIn(min = 64.dp).padding(vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(Modifier.weight(1f)) {
            Text(payeeLabel(place), style = Aiimin.type.bodyStrong, maxLines = 1, overflow = TextOverflow.Ellipsis)
            Text(
                listOfNotNull(d.account4?.let { "••$it" }, whenText, if (showLedger && ledger != Ledger.PERSONAL) ledger.label else null).joinToString(" · "),
                style = Aiimin.type.caption, maxLines = 1, overflow = TextOverflow.Ellipsis,
            )
            if (unclear) Text("Check the amount. The alert text was unclear.", style = Aiimin.type.caption.copy(color = Aiimin.colors.warn))
        }
        Spacer(Modifier.width(12.dp))
        Column(horizontalAlignment = Alignment.End) {
            Text((if (d.direction == "in") "+" else "") + Money.format(d.amountPaise).removePrefix("−"), style = Aiimin.type.bodyStrong)
            Text(category, style = Aiimin.type.caption, maxLines = 1)
        }
        Spacer(Modifier.width(8.dp))
        Icon(if (expanded) AppIcons.CaretUp else AppIcons.CaretDown, null, tint = Aiimin.colors.textFaint, modifier = Modifier.size(16.dp))
    }
}

@OptIn(androidx.compose.foundation.layout.ExperimentalLayoutApi::class)
@Composable
private fun DraftEditor(
    d: TxnDraftEntity,
    name: String, onName: (String) -> Unit,
    cat: String, onCat: (String) -> Unit, categories: List<String>, onNewCategory: (String) -> Unit,
    note: String, onNote: (String) -> Unit, recent: List<String>,
    ledgers: List<Ledger>, ledger: Ledger, onLedger: (Ledger) -> Unit,
    rememberIt: Boolean, onRemember: (Boolean) -> Unit,
    onNotPayment: () -> Unit, onConfirm: () -> Unit,
) {
    var adding by remember(d.id) { mutableStateOf(false) }
    var newCat by remember(d.id) { mutableStateOf("") }
    var showRaw by remember(d.id) { mutableStateOf(false) }
    Column(Modifier.fillMaxWidth().padding(bottom = 16.dp)) {
        // Name the place once; the next alert from it arrives with this name (3.5).
        val masked = payeeLabel(d.title)
        AppTextField(name, onName, label = if (d.direction == "in") "From" else "Paid to", placeholder = if (masked != d.title) "$masked · add a name" else "Shop or person")
        Spacer(Modifier.height(16.dp))
        Text("CATEGORY", style = Aiimin.type.eyebrow)
        Spacer(Modifier.height(8.dp))
        // D-008 (S9): equal columns, so the chips form a grid instead of ragged rows.
        val chips = (categories.ifEmpty { if (d.direction == "in") Categories.INCOME else Categories.SPEND }).map { it to false } + ("New" to true)
        aiimin.designsystem.component.PillGrid(chips, columns = if (chips.any { it.first.length > 9 } || LocalDensity.current.fontScale >= 1.5f) 2 else 3) { (k, isNew), m ->
            if (isNew) Pill("New", adding, { adding = !adding }, m, icon = AppIcons.Plus) else Pill(k, cat == k, { onCat(k) }, m)
        }
        if (adding) Row(Modifier.padding(top = 10.dp), verticalAlignment = Alignment.CenterVertically) {
            AppTextField(newCat, { newCat = it }, Modifier.weight(1f), placeholder = "Pet, Gym, Chai…")
            Spacer(Modifier.width(8.dp))
            AppButton("Add", { onNewCategory(newCat); newCat = ""; adding = false }, compact = true, enabled = newCat.isNotBlank())
        }
        if (d.direction != "in") {
            Spacer(Modifier.height(16.dp))
            AppTextField(note, onNote, label = "What did you buy?", placeholder = "Optional · chocolate, milk")
            if (recent.isNotEmpty()) FlowRow(Modifier.padding(top = 8.dp), horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                recent.forEach { r -> Pill(r, note.equals(r, ignoreCase = true), { onNote(r) }) }
            }
        }
        if (ledgers.size > 1) {
            Spacer(Modifier.height(16.dp))
            Text("LEDGER", style = Aiimin.type.eyebrow)
            Spacer(Modifier.height(8.dp))
            FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) { ledgers.forEach { l -> Pill(l.label, l == ledger, { onLedger(l) }) } }
        }
        Spacer(Modifier.height(8.dp))
        Row(Modifier.fillMaxWidth().clickable { onRemember(!rememberIt) }, verticalAlignment = Alignment.CenterVertically) {
            CheckCircle(rememberIt, { onRemember(!rememberIt) }, "Remember ${name.ifBlank { d.title }}")
            Text("Remember ${name.ifBlank { payeeLabel(d.title) }} as $cat · next time it fills in by itself", style = Aiimin.type.body.copy(fontSize = 14.sp, lineHeight = 20.sp), modifier = Modifier.weight(1f))
        }
        // The bank's own words sit behind a tap (improvement plan §3).
        Box(Modifier.heightIn(min = 48.dp).clip(Shapes.small).clickable { showRaw = !showRaw }.semantics { contentDescription = if (showRaw) "Hide message" else "Show message" }, contentAlignment = Alignment.CenterStart) {
            Text(if (showRaw) "Hide message" else "Show message", style = Aiimin.type.label.copy(color = Aiimin.colors.link, fontSize = 14.sp))
        }
        if (showRaw) Text(d.raw, style = Aiimin.type.code, modifier = Modifier.clip(RoundedCornerShape(6.dp)).background(Aiimin.colors.raised).padding(10.dp).fillMaxWidth())
        Spacer(Modifier.height(12.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            AppButton("Not a payment", onNotPayment, Modifier.weight(1f), kind = ButtonKind.SECONDARY)
            AppButton("Confirm", onConfirm, Modifier.weight(1f), icon = AppIcons.Check)
        }
    }
}

/** Phase 2: a place filed the same way three times by hand. Accepting makes a rule that files it without asking. */
@Composable
private fun RuleOfferCard(place: PayeeRuleEntity, onMake: () -> Unit, onNotNow: () -> Unit) {
    val name = place.label.ifBlank { place.key }
    SurfaceCard(Modifier.padding(top = 8.dp, bottom = 8.dp)) {
        Text("Make this a rule?", style = Aiimin.type.bodyStrong)
        Text(
            "You filed $name as ${place.category} 3 times. Make it a rule and its payments are booked by themselves; change or stop it in Places and rules.",
            style = Aiimin.type.caption, modifier = Modifier.padding(top = 4.dp),
        )
        @OptIn(androidx.compose.foundation.layout.ExperimentalLayoutApi::class)
        FlowRow(Modifier.padding(top = 12.dp), horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            AppButton("Make rule", onMake, compact = true)
            AppButton("Not now", onNotNow, kind = ButtonKind.SECONDARY, compact = true)
        }
    }
}
