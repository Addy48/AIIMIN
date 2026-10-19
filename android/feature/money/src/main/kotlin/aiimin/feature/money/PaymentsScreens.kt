package aiimin.feature.money

import aiimin.core.data.money.MoneyRepository
import aiimin.core.data.util.Dates
import aiimin.core.data.util.Money
import aiimin.core.database.TxnEntity
import aiimin.designsystem.component.AppTextField
import aiimin.designsystem.component.EmptyState
import aiimin.designsystem.component.Hairline
import aiimin.designsystem.component.Pill
import aiimin.designsystem.component.PillRow
import aiimin.designsystem.component.Segmented
import aiimin.designsystem.component.Skeleton
import aiimin.designsystem.component.TopBar
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.Route
import aiimin.designsystem.theme.Aiimin
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
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import java.time.LocalDate
import javax.inject.Inject
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn

/** Every booked payment, newest first. Filtering happens in memory: the list is a phone's worth of rows. */
@HiltViewModel
class PaymentsViewModel @Inject constructor(money: MoneyRepository) : ViewModel() {
    val all: StateFlow<List<TxnEntity>?> = money.recent(5000)
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)
}

private fun TxnEntity.visible() = !deleted

/** M5 · All payments: search, direction and category filters, grouped by day with a day total. */
@Composable
fun PaymentsScreen(vm: PaymentsViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val c = Aiimin.colors
    val all by vm.all.collectAsStateWithLifecycle()
    var q by remember { mutableStateOf("") }
    var dir by remember { mutableIntStateOf(0) } // All · Spent · Received
    var cat by remember { mutableStateOf<String?>(null) }
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("All payments", onBack = { nav.back() })
        val list = all
        if (list == null) {
            Skeleton(Modifier.padding(Aiimin.space.gutter).fillMaxWidth().height(200.dp))
            return@Column
        }
        val base = list.filter { it.visible() }
        if (base.isEmpty()) {
            EmptyState(AppIcons.Wallet, "No payments yet", "Say one with the plus button, or let AIIMIN read your bank alerts.")
            return@Column
        }
        val cats = base.groupingBy { it.category }.eachCount().entries.sortedByDescending { it.value }.map { it.key }
        val shown = base.filter { t ->
            (dir == 0 || (dir == 1 && t.direction == "out") || (dir == 2 && t.direction == "in")) &&
                (cat == null || t.category == cat) &&
                (q.isBlank() || t.title.contains(q, true) || t.category.contains(q, true) || t.note.contains(q, true) || (t.account4?.contains(q) == true) || (t.amountPaise / 100).toString().contains(q.trim()))
        }
        Column(Modifier.padding(horizontal = Aiimin.space.gutter)) {
            AppTextField(q, { q = it }, placeholder = "Payee, category or ₹", leading = AppIcons.Search)
            Spacer(Modifier.height(10.dp))
            Segmented(listOf("All", "Spent", "Received"), dir, { dir = it })
            Spacer(Modifier.height(10.dp))
            PillRow {
                Pill("Any category", cat == null, { cat = null })
                cats.forEach { k -> Pill(k, cat == k, { cat = if (cat == k) null else k }) }
            }
            val out = shown.filter { it.direction == "out" }.sumOf { it.amountPaise }
            val inn = shown.filter { it.direction == "in" }.sumOf { it.amountPaise }
            Text(
                "${shown.size} ${if (shown.size == 1) "payment" else "payments"} · ${Money.whole(out)} out" + if (inn > 0) " · ${Money.whole(inn)} in" else "",
                style = Aiimin.type.caption, modifier = Modifier.padding(vertical = 10.dp),
            )
        }
        if (shown.isEmpty()) {
            EmptyState(AppIcons.Search, "Nothing matches", "Try a different word, or clear the filters.")
            return@Column
        }
        PaymentList(shown, nav)
    }
}

@Composable
private fun PaymentList(shown: List<TxnEntity>, nav: aiimin.designsystem.nav.AppNavigator) {
    val c = Aiimin.colors
    val groups = shown.groupBy { it.day }.toSortedMap(compareByDescending { it })
    LazyColumn(contentPadding = PaddingValues(start = Aiimin.space.gutter, end = Aiimin.space.gutter, bottom = 40.dp)) {
        groups.forEach { (day, rows) ->
            item(key = "h$day") {
                val d = LocalDate.parse(day)
                val spent = rows.filter { it.direction == "out" }.sumOf { it.amountPaise }
                Row(Modifier.fillMaxWidth().padding(top = 22.dp, bottom = 4.dp), verticalAlignment = Alignment.CenterVertically) {
                    Text(Dates.relative(d, LocalDate.now()).uppercase(), style = Aiimin.type.eyebrow.copy(color = c.textMuted), modifier = Modifier.weight(1f))
                    if (spent > 0) Text(Money.whole(spent), style = Aiimin.type.caption.copy(fontFeatureSettings = "tnum"))
                }
                Hairline()
            }
            items(rows, key = { it.id }) { t ->
                PaymentRow(t, false) { nav.open(Route.Txn(t.id)) }
                Hairline()
            }
        }
    }
}

/** M7 · Category: this month against last, the cap if there is one, and every payment in it. */
@Composable
fun CategoryScreen(name: String, vm: PaymentsViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val c = Aiimin.colors
    val all by vm.all.collectAsStateWithLifecycle()
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar(name, onBack = { nav.back() })
        val list = all
        if (list == null) {
            Skeleton(Modifier.padding(Aiimin.space.gutter).fillMaxWidth().height(160.dp))
            return@Column
        }
        val mine = list.filter { it.visible() && it.category == name && it.direction == "out" }
        if (mine.isEmpty()) {
            EmptyState(AppIcons.Wallet, "Nothing in $name", "Payments filed under $name appear here.")
            return@Column
        }
        val ym = java.time.YearMonth.now()
        val thisMonth = mine.filter { java.time.YearMonth.from(LocalDate.parse(it.day)) == ym }
        val lastMonth = mine.filter { java.time.YearMonth.from(LocalDate.parse(it.day)) == ym.minusMonths(1) }
        val now = thisMonth.sumOf { it.amountPaise }
        val prev = lastMonth.sumOf { it.amountPaise }
        val dayOfMonth = LocalDate.now().dayOfMonth
        // Compare like with like: last month up to the same day.
        val prevToDate = lastMonth.filter { LocalDate.parse(it.day).dayOfMonth <= dayOfMonth }.sumOf { it.amountPaise }
        LazyColumn(contentPadding = PaddingValues(start = Aiimin.space.gutter, end = Aiimin.space.gutter, bottom = 40.dp)) {
            item {
                Text("This month", style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(top = 8.dp))
                Text(Money.whole(now), style = Aiimin.type.heroNumber.copy(fontSize = 46.sp, lineHeight = 48.sp))
                val diff = now - prevToDate
                Text(
                    when {
                        prev == 0L -> "No payments in $name last month to compare."
                        diff > 0 -> "${Money.whole(diff)} more than this time last month"
                        diff < 0 -> "${Money.whole(-diff)} less than this time last month"
                        else -> "Same as this time last month"
                    },
                    style = Aiimin.type.body.copy(color = c.textMuted),
                )
                Text("${thisMonth.size} ${if (thisMonth.size == 1) "payment" else "payments"} this month · ${mine.size} in all", style = Aiimin.type.caption, modifier = Modifier.padding(top = 4.dp, bottom = 8.dp))
            }
            val groups = mine.groupBy { it.day }.toSortedMap(compareByDescending { it })
            groups.forEach { (day, rows) ->
                item(key = "h$day") {
                    Text(Dates.relative(LocalDate.parse(day), LocalDate.now()).uppercase(), style = Aiimin.type.eyebrow.copy(color = c.textMuted), modifier = Modifier.padding(top = 20.dp, bottom = 4.dp))
                    Hairline()
                }
                items(rows, key = { it.id }) { t ->
                    PaymentRow(t, false) { nav.open(Route.Txn(t.id)) }
                    Hairline()
                }
            }
        }
    }
}
