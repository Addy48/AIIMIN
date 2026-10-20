package aiimin.feature.money

import aiimin.core.data.money.Categories
import aiimin.core.data.money.Ledger
import aiimin.core.data.money.SmartRules
import aiimin.core.data.util.newId
import aiimin.core.database.AccountEntity
import aiimin.core.database.MoneyRuleEntity
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppIconButton
import aiimin.designsystem.component.AppSheet
import aiimin.designsystem.component.AppTextField
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.Hairline
import aiimin.designsystem.component.Pill
import aiimin.designsystem.component.PillRow
import aiimin.designsystem.component.SectionHeader
import aiimin.designsystem.component.Segmented
import aiimin.designsystem.component.SwitchRow
import aiimin.designsystem.component.pressable
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.theme.Aiimin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp

/** One smart rule (Phase 2): what it matches, where it files, on or off; tap to edit, arrows to reorder. */
@Composable
internal fun RuleRow(r: MoneyRuleEntity, first: Boolean, last: Boolean, onOpen: () -> Unit, onMove: (Boolean) -> Unit) {
    Row(Modifier.fillMaxWidth().heightIn(min = 64.dp), verticalAlignment = Alignment.CenterVertically) {
        Column(Modifier.weight(1f).pressable(onOpen).padding(vertical = 10.dp)) {
            Text(r.name, style = Aiimin.type.bodyStrong.copy(color = if (r.enabled) Aiimin.colors.text else Aiimin.colors.textMuted), maxLines = 1, overflow = TextOverflow.Ellipsis)
            Text(SmartRules.describe(r), style = Aiimin.type.caption, maxLines = 2, overflow = TextOverflow.Ellipsis)
            Text(
                listOfNotNull(
                    if (!r.enabled) "Off" else if (r.autoBook) "Books by itself" else "Fills in, waits in Review",
                    if (r.hits > 0) "used ${r.hits} ${if (r.hits == 1) "time" else "times"}" else null,
                ).joinToString(" · "),
                style = Aiimin.type.caption,
            )
        }
        // Order matters (the first matching rule wins), so each rule can move one place at a time.
        if (!first) AppIconButton(AppIcons.ArrowUp, "Move ${r.name} up", { onMove(true) }, tint = Aiimin.colors.textMuted)
        if (!last) AppIconButton(AppIcons.ArrowDown, "Move ${r.name} down", { onMove(false) }, tint = Aiimin.colors.textMuted)
    }
}

/** The rule builder: every condition that is filled in must hold. */
@Composable
internal fun RuleSheet(
    start: MoneyRuleEntity?, categories: List<String>, accounts: List<AccountEntity>,
    onDismiss: () -> Unit, onSave: (MoneyRuleEntity) -> Unit, onDelete: (() -> Unit)?,
) {
    val now = System.currentTimeMillis()
    // A new rule only fills payments in; booking without a look is something the person switches on.
    val base = start ?: MoneyRuleEntity(id = newId(), name = "", position = 0, category = "Food", autoBook = false, createdAt = now, updatedAt = now)
    var contains by remember { mutableStateOf(base.contains) }
    var from by remember { mutableStateOf(base.minPaise?.let { (it / 100).toString() }.orEmpty()) }
    var under by remember { mutableStateOf(base.maxPaise?.let { (it / 100).toString() }.orEmpty()) }
    var account by remember { mutableStateOf(base.account4) }
    var note by remember { mutableStateOf(base.noteContains) }
    var direction by remember { mutableStateOf(base.direction) }
    var cat by remember { mutableStateOf(base.category) }
    var ledger by remember { mutableStateOf(base.ledger) }
    var auto by remember { mutableStateOf(base.autoBook) }
    var enabled by remember { mutableStateOf(base.enabled) }
    var name by remember { mutableStateOf(base.name) }
    val draft = base.copy(
        contains = contains.trim(), minPaise = from.toLongOrNull()?.times(100), maxPaise = under.toLongOrNull()?.times(100),
        account4 = account, noteContains = note.trim(), direction = direction, category = cat, ledger = ledger, autoBook = auto, enabled = enabled,
    )
    val ok = SmartRules.hasCondition(draft) && (draft.minPaise == null || draft.maxPaise == null || draft.minPaise!! < draft.maxPaise!!)
    AppSheet(onDismiss, title = if (start == null) "New rule" else "Edit rule", subtitle = "Every line you fill in must match. Rules run top to bottom, before anything AIIMIN guessed.") {
        Column(Modifier.verticalScroll(rememberScrollState())) {
            AppTextField(contains, { contains = it }, label = "Name has", placeholder = "swiggy · a comma for more names")
            Spacer(Modifier.height(12.dp))
            Row {
                AppTextField(from, { from = it.filter(Char::isDigit).take(9) }, Modifier.weight(1f), label = "Amount from ₹", placeholder = "Any", keyboardType = KeyboardType.Number)
                Spacer(Modifier.width(12.dp))
                AppTextField(under, { under = it.filter(Char::isDigit).take(9) }, Modifier.weight(1f), label = "Under ₹", placeholder = "Any", keyboardType = KeyboardType.Number)
            }
            val cards = accounts.filter { !it.last4.isNullOrBlank() && !it.archived }
            if (cards.isNotEmpty()) {
                SectionHeader("Account or card")
                PillRow {
                    Pill("Any", account == null, { account = null })
                    cards.forEach { a -> Pill("${a.name} ••${a.last4}", account == a.last4, { account = a.last4 }) }
                }
            }
            Spacer(Modifier.height(12.dp))
            AppTextField(note, { note = it }, label = "Note or message has", placeholder = "rent, school fee")
            SectionHeader("Money")
            Segmented(listOf("Out", "In", "Both"), listOf("out", "in", "any").indexOf(direction).coerceAtLeast(0), { direction = listOf("out", "in", "any")[it] })
            SectionHeader("Files as")
            PillRow { (categories + Categories.INCOME + listOf(cat)).distinct().forEach { k -> Pill(k, cat == k, { cat = k }) } }
            Spacer(Modifier.height(8.dp))
            Segmented(Ledger.entries.map { it.label }, Ledger.entries.indexOfFirst { it.name == ledger }.coerceAtLeast(0), { ledger = Ledger.entries[it].name })
            Spacer(Modifier.height(8.dp))
            SwitchRow("Book without asking", auto, { auto = it }, subtitle = if (auto) "Matching bank alerts are booked at once. Change or delete them in Payments." else "Matching alerts arrive filled in and wait in Review")
            if (start != null) SwitchRow("Rule on", enabled, { enabled = it })
            Spacer(Modifier.height(8.dp))
            AppTextField(name, { name = it }, label = "Rule name", placeholder = contains.trim().replaceFirstChar { it.uppercase() }.ifEmpty { "My rule" })
            if (!ok) Text("Fill in at least one line above it: a name, an amount, an account or a word.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 8.dp))
            Spacer(Modifier.height(16.dp))
            AppButton("Save rule", {
                onSave(draft.copy(name = name.trim().ifEmpty { contains.trim().replaceFirstChar { it.uppercase() }.ifEmpty { cat + " rule" } }))
            }, Modifier.fillMaxWidth(), enabled = ok)
            if (onDelete != null) {
                Spacer(Modifier.height(8.dp))
                AppButton("Delete rule", onDelete, Modifier.fillMaxWidth(), kind = ButtonKind.GHOST)
            }
        }
    }
}

/** The "Your rules" block of Places and rules. */
@Composable
internal fun RulesBlock(rules: List<MoneyRuleEntity>, onNew: () -> Unit, onOpen: (MoneyRuleEntity) -> Unit, onMove: (MoneyRuleEntity, Boolean) -> Unit) {
    SectionHeader("Your rules", action = "New rule", onAction = onNew)
    if (rules.isEmpty()) {
        Text(
            "A rule files payments the same way every time, for example: name has “swiggy”, under ₹500 → Food. AIIMIN also offers one after you file a place the same way 3 times.",
            style = Aiimin.type.caption, modifier = Modifier.padding(bottom = 8.dp),
        )
        Hairline()
        return
    }
    rules.forEachIndexed { i, r ->
        RuleRow(r, first = i == 0, last = i == rules.lastIndex, onOpen = { onOpen(r) }, onMove = { up -> onMove(r, up) })
        Hairline()
    }
}
