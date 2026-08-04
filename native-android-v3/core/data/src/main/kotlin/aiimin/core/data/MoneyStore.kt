package aiimin.core.data

import javax.inject.Inject
import javax.inject.Singleton
import kotlin.math.roundToInt
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

/**
 * The money graph, in memory, for every surface that draws it.
 *
 * Capture settles expenses into it; Money reads it. Local only (G7) — the `/api`
 * writes replace [recordExpense] / [recordIncome] later; the shape stays.
 *
 * **Empty is empty.** A missing month never renders as ₹0 MTD — that lie is how
 * the website currently confuses the founder. [MoneyState.hasMoneyData] is the
 * gate every Overview figure respects.
 */
@Singleton
class MoneyStore @Inject constructor() {

    private val _state = MutableStateFlow(MoneyState.seed())
    val state: StateFlow<MoneyState> = _state.asStateFlow()

    private var nextId = (_state.value.ledger.maxOfOrNull { it.id } ?: 0L) + 1L

    fun setTab(tab: MoneyTab) = _state.update { it.copy(tab = tab) }

    /** A Capture settle with an amount lands here — one graph, two surfaces. */
    fun recordExpense(
        name: String,
        amount: Int,
        category: String = "UNCATEGORISED",
        channel: String = "CAPTURE",
        dateLabel: String,
    ): Long {
        require(amount > 0) { "expense amount must be positive rupees" }
        val id = nextId++
        _state.update { money ->
            money.copy(
                ledger = listOf(
                    LedgerEntry(
                        id = id,
                        name = name,
                        meta = "$category · $channel · $dateLabel",
                        amount = -amount,
                        category = category,
                    ),
                ) + money.ledger,
                phase = MoneyPhase.READY,
            )
        }
        return id
    }

    fun recordIncome(
        name: String,
        amount: Int,
        category: String = "INCOME",
        channel: String = "CAPTURE",
        dateLabel: String,
    ): Long {
        require(amount > 0)
        val id = nextId++
        _state.update { money ->
            money.copy(
                ledger = listOf(
                    LedgerEntry(
                        id = id,
                        name = name,
                        meta = "$category · $channel · $dateLabel",
                        amount = amount,
                        category = category,
                    ),
                ) + money.ledger,
                phase = MoneyPhase.READY,
            )
        }
        return id
    }

    fun removeEntry(id: Long) = _state.update { money ->
        val next = money.ledger.filterNot { it.id == id }
        money.copy(
            ledger = next,
            phase = if (next.isEmpty() && money.budgets.isEmpty()) MoneyPhase.EMPTY else money.phase,
        )
    }

    /** Demo / screenshot: wipe to the honest empty instrument. */
    fun clearToEmpty() = _state.update { MoneyState.empty().copy(tab = it.tab) }

    /** Demo / screenshot: restore the seed month. */
    fun restoreSeed() = _state.update { MoneyState.seed().copy(tab = it.tab) }

    fun markOffline() = _state.update { it.copy(phase = MoneyPhase.OFFLINE, syncLabel = "HELD LOCALLY") }

    fun markReady() = _state.update {
        it.copy(
            phase = if (it.ledger.isEmpty() && it.budgets.isEmpty()) MoneyPhase.EMPTY else MoneyPhase.READY,
            syncLabel = if (it.isSeed) "SEED · LOCAL" else "LOCAL",
        )
    }
}

enum class MoneyTab { OVERVIEW, BUDGETS, LEDGER }

enum class MoneyPhase {
    /** Figures are drawable from real (or seed) rows. */
    READY,

    /** No rows at all — never show ₹0 as an MTD result. */
    EMPTY,

    /** Last known rows may still show; writes queue; banner tells the truth. */
    OFFLINE,
}

data class LedgerEntry(
    val id: Long,
    val name: String,
    val meta: String,
    /** Signed rupees: positive = income, negative = expense. */
    val amount: Int,
    val category: String,
) {
    val isIncome: Boolean get() = amount > 0
}

data class BudgetLine(
    val name: String,
    val spent: Int,
    val limit: Int,
) {
    val remaining: Int get() = (limit - spent).coerceAtLeast(0)
    val usedPct: Float
        get() = if (limit <= 0) 0f else (spent.toFloat() / limit.toFloat()).coerceAtLeast(0f)
}

data class UpcomingObligation(
    val name: String,
    val meta: String,
    val amount: Int,
)

data class WeekBar(
    val label: String,
    val amount: Int,
    val highlight: Boolean = false,
)

data class CategorySlice(
    val name: String,
    val amount: Int,
    val fraction: Float,
)

/**
 * Everything Money draws, in one immutable value.
 *
 * Derived figures ([spentMtd], [safeToSpend], [categories], [wowDeltaPct]) are
 * computed from rows — never hard-coded next to a live ledger that says otherwise.
 */
data class MoneyState(
    val periodLabel: String,
    val sheetMeta: String,
    val tab: MoneyTab,
    val phase: MoneyPhase,
    val syncLabel: String,
    val isSeed: Boolean,
    val ledger: List<LedgerEntry>,
    val budgets: List<BudgetLine>,
    val upcoming: List<UpcomingObligation>,
    val weekBars: List<WeekBar>,
    /** Null = do not draw the tile. Never invent ₹0 net worth. */
    val netWorth: Int?,
    val netWorthDelta: Int?,
    val receivable: Int?,
    val receivableMeta: String?,
) {
    val hasMoneyData: Boolean get() = ledger.isNotEmpty() || budgets.isNotEmpty()

    val budgetTotal: Int get() = budgets.sumOf { it.limit }

    val spentMtd: Int get() = ledger.filter { it.amount < 0 }.sumOf { -it.amount }

    val incomeMtd: Int get() = ledger.filter { it.amount > 0 }.sumOf { it.amount }

    /**
     * Safe-to-spend only exists when budgets do. Empty month → null (UI shows
     * the empty instrument, not ₹0).
     */
    val safeToSpend: Int?
        get() {
            if (budgets.isEmpty()) return null
            return (budgetTotal - spentMtd)
        }

    val spentOfBudgetPct: Float
        get() {
            if (budgetTotal <= 0) return 0f
            return (spentMtd.toFloat() / budgetTotal.toFloat()).coerceIn(0f, 1f)
        }

    val categories: List<CategorySlice>
        get() {
            val byCat = ledger
                .filter { it.amount < 0 }
                .groupBy { it.category }
                .mapValues { (_, rows) -> rows.sumOf { -it.amount } }
                .toList()
                .sortedByDescending { it.second }
            val total = byCat.sumOf { it.second }.coerceAtLeast(1)
            return byCat.map { (name, amt) ->
                CategorySlice(name = name, amount = amt, fraction = amt.toFloat() / total)
            }
        }

    /** Week-over-week % on the last two [weekBars] amounts. Null if <2 weeks. */
    val wowDeltaPct: Double?
        get() {
            if (weekBars.size < 2) return null
            val prev = weekBars[weekBars.lastIndex - 1].amount.toDouble()
            val curr = weekBars.last().amount.toDouble()
            if (prev == 0.0) return null
            return ((curr - prev) / prev) * 100.0
        }

    companion object {
        fun empty(
            periodLabel: String = "AUGUST",
            tab: MoneyTab = MoneyTab.OVERVIEW,
        ) = MoneyState(
            periodLabel = periodLabel,
            sheetMeta = "EMPTY",
            tab = tab,
            phase = MoneyPhase.EMPTY,
            syncLabel = "LOCAL",
            isSeed = false,
            ledger = emptyList(),
            budgets = emptyList(),
            upcoming = emptyList(),
            weekBars = emptyList(),
            netWorth = null,
            netWorthDelta = null,
            receivable = null,
            receivableMeta = null,
        )

        /**
         * Seed month matching the Drafting Table Money screen. Labelled SEED so
         * the UI never pretends these rows came from `/api`.
         */
        fun seed() = MoneyState(
            periodLabel = "AUGUST",
            sheetMeta = "SEED",
            tab = MoneyTab.OVERVIEW,
            phase = MoneyPhase.READY,
            syncLabel = "SEED · LOCAL",
            isSeed = true,
            ledger = listOf(
                LedgerEntry(1, "Swiggy", "FOOD · UPI · 01.08", -1_240, "FOOD"),
                LedgerEntry(2, "Blinkit", "GROCERY · UPI · 01.08", -680, "GROCERY"),
                LedgerEntry(3, "Delhi Metro", "TRANSPORT · CARD · 31.07", -60, "TRANSPORT"),
                LedgerEntry(4, "Spotify", "SUBS · AUTO · 30.07", -119, "SUBS"),
                LedgerEntry(5, "Stipend · Zoho", "INCOME · NEFT · 01.08", 18_000, "INCOME"),
                LedgerEntry(6, "Rent · landlord", "RENT · NEFT · 01.08", -12_000, "RENT"),
                LedgerEntry(7, "Zomato", "FOOD · UPI · 28.07", -890, "FOOD"),
                LedgerEntry(8, "Uber", "TRANSPORT · UPI · 27.07", -320, "TRANSPORT"),
                LedgerEntry(9, "BigBasket", "GROCERY · UPI · 25.07", -1_450, "GROCERY"),
                LedgerEntry(10, "Netflix", "SUBS · AUTO · 22.07", -649, "SUBS"),
                LedgerEntry(11, "Swiggy", "FOOD · UPI · 20.07", -1_100, "FOOD"),
                LedgerEntry(12, "Cafe Coffee Day", "FOOD · CARD · 18.07", -410, "FOOD"),
                LedgerEntry(13, "Metro card top-up", "TRANSPORT · UPI · 15.07", -500, "TRANSPORT"),
                LedgerEntry(14, "Jio Fiber", "SUBS · AUTO · 12.07", -699, "SUBS"),
                LedgerEntry(15, "Swiggy", "FOOD · UPI · 10.07", -980, "FOOD"),
                LedgerEntry(16, "Petrol", "TRANSPORT · CARD · 08.07", -1_030, "TRANSPORT"),
                LedgerEntry(17, "Provisions", "GROCERY · UPI · 05.07", -2_100, "GROCERY"),
                LedgerEntry(18, "Swiggy", "FOOD · UPI · 03.07", -720, "FOOD"),
            ),
            budgets = listOf(
                BudgetLine("FOOD & DELIVERY", spent = 7_560, limit = 9_000),
                BudgetLine("RENT", spent = 12_000, limit = 12_000),
                BudgetLine("TRANSPORT", spent = 1_910, limit = 4_000),
                BudgetLine("SUBSCRIPTIONS", spent = 1_438, limit = 1_500),
                BudgetLine("SAVINGS", spent = 5_000, limit = 5_000),
            ),
            upcoming = listOf(
                UpcomingObligation("Rent · landlord", "05 AUG · AUTOPAY", 12_000),
                UpcomingObligation("Jio postpaid", "09 AUG · AUTOPAY", 399),
                UpcomingObligation("Gym · cult.fit", "12 AUG · CARD", 1_499),
                UpcomingObligation("Spotify", "14 AUG · AUTOPAY", 119),
            ),
            weekBars = listOf(
                WeekBar("W27", 9_800),
                WeekBar("W28", 11_900),
                WeekBar("W29", 13_400),
                WeekBar("W30", 10_600),
                WeekBar("W31", 9_280, highlight = true),
            ),
            netWorth = 342_180,
            netWorthDelta = 8_400,
            receivable = 2_500,
            receivableMeta = "ROHAN · 11d",
        )
    }
}

/** Indian-style grouping for rupee figures. Every Money numeral goes through this. */
fun formatInr(amount: Int, signed: Boolean = false): String {
    val abs = kotlin.math.abs(amount)
    val grouped = groupIndian(abs)
    return when {
        signed && amount > 0 -> "+₹$grouped"
        signed && amount < 0 -> "−₹$grouped"
        amount < 0 -> "−₹$grouped"
        else -> "₹$grouped"
    }
}

fun formatWowPct(pct: Double): String {
    val rounded = (pct * 10.0).roundToInt() / 10.0
    val body = if (rounded % 1.0 == 0.0) {
        "${rounded.toInt()}.0"
    } else {
        rounded.toString()
    }
    return if (rounded > 0) "+$body%" else "$body%"
}

private fun groupIndian(n: Int): String {
    val digits = n.toString()
    if (digits.length <= 3) return digits
    val head = digits.dropLast(3)
    val tail = digits.takeLast(3)
    val headGrouped = head.reversed().chunked(2).joinToString(",").reversed()
    return "$headGrouped,$tail"
}
