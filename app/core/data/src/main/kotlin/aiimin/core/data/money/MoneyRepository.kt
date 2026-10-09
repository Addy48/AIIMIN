package aiimin.core.data.money

import aiimin.core.data.core.DayClock
import aiimin.core.data.core.EventLogger
import aiimin.core.data.util.newId
import aiimin.core.database.BudgetEntity
import aiimin.core.database.MoneyDao
import aiimin.core.database.PayeeRuleEntity
import aiimin.core.database.TxnDraftEntity
import aiimin.core.database.TxnEntity
import aiimin.core.engine.Tier
import aiimin.core.nlp.BankSms
import aiimin.core.nlp.MoneyDirection
import android.content.Context
import dagger.hilt.android.qualifiers.ApplicationContext
import java.io.File
import java.time.Instant
import java.time.LocalDate
import java.time.YearMonth
import java.time.temporal.WeekFields
import java.util.Locale
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.combine

enum class Ledger(val label: String) { PERSONAL("Personal"), HOUSEHOLD("Household"), BUSINESS("Business") }

object Categories {
    val SPEND = listOf("Food", "Grocery", "Transport", "Bills", "Rent", "Subs", "Shopping", "Health", "Family", "Education", "Travel", "Fun", "Gifts", "Other")
    val INCOME = listOf("Salary", "Business", "Refund", "Gift", "Interest", "Other income")
}

data class CategorySpend(val category: String, val paise: Long, val cap: Long?, val count: Int)

data class Rollup(val label: String, val paise: Long, val count: Int)

data class MonthMoney(
    val month: YearMonth,
    val ledger: Ledger,
    val spent: Long,
    val income: Long,
    val budget: BudgetEntity?,
    /** Where spending "should" be today on a pace line that front-loads fixed costs. */
    val paceLine: Long?,
    val remaining: Long?,
    /** Safe to spend per remaining day, null without a plan. */
    val perDay: Long?,
    val byCategory: List<CategorySpend>,
    val byDay: List<Long>,
    val rollups: List<Rollup>,
    val txns: List<TxnEntity>,
    val pending: List<TxnDraftEntity>,
)

@Singleton
class MoneyRepository @Inject constructor(
    @ApplicationContext private val context: Context,
    private val dao: MoneyDao,
    private val clock: DayClock,
    private val log: EventLogger,
) {
    fun recent(n: Int) = dao.recent(n)
    fun pending() = dao.pendingDrafts()
    suspend fun get(id: String) = dao.get(id)

    fun month(month: YearMonth, ledger: Ledger, today: LocalDate): Flow<MonthMoney> = combine(
        dao.between(month.atDay(1).toString(), month.atEndOfMonth().toString()),
        dao.budget(month.toString()),
        dao.pendingDrafts(),
    ) { all, budget, pending ->
        val txns = all.filter { it.ledger == ledger.name }
        val spent = txns.filter { it.direction == "out" }.sumOf { it.amountPaise }
        val income = txns.filter { it.direction == "in" }.sumOf { it.amountPaise }
        val dom = if (YearMonth.from(today) == month) today.dayOfMonth else month.lengthOfMonth()
        val b = budget.takeIf { ledger == Ledger.PERSONAL }
        val pace = b?.let { it.fixedPaise + ((it.totalPaise - it.fixedPaise).coerceAtLeast(0) * dom / month.lengthOfMonth()) }
        val remaining = b?.let { it.totalPaise - spent }
        val daysLeft = (month.lengthOfMonth() - dom + 1).coerceAtLeast(1)
        val caps = b?.caps?.let(::parseCaps).orEmpty()
        val byCat = txns.filter { it.direction == "out" }.groupBy { it.category }.map { (c, l) ->
            CategorySpend(c, l.sumOf { it.amountPaise }, caps[c], l.size)
        }.sortedByDescending { it.paise }
        val byDay = (1..month.lengthOfMonth()).map { d ->
            val key = month.atDay(d).toString()
            txns.filter { it.day == key && it.direction == "out" }.sumOf { it.amountPaise }
        }
        MonthMoney(
            month, ledger, spent, income, b, pace, remaining,
            remaining?.let { (it / daysLeft).coerceAtLeast(0) }, byCat, byDay, rollups(txns), txns, pending,
        )
    }

    /** Payments under ₹200 to the same payee, grouped weekly ("₹1,240 on chai"). */
    private fun rollups(txns: List<TxnEntity>): List<Rollup> {
        val week = WeekFields.of(Locale.forLanguageTag("en-IN"))
        return txns.filter { it.direction == "out" && it.amountPaise < 200_00 }
            .groupBy { it.title.lowercase() to LocalDate.parse(it.day).get(week.weekOfWeekBasedYear()) }
            .filter { it.value.size >= 3 }
            .map { (k, l) -> Rollup(l.first().title.ifBlank { k.first }, l.sumOf { it.amountPaise }, l.size) }
            .sortedByDescending { it.paise }
    }

    suspend fun add(
        amountPaise: Long,
        direction: String,
        title: String,
        category: String,
        ledger: Ledger = Ledger.PERSONAL,
        method: String = "UPI",
        day: LocalDate? = null,
        source: String = "manual",
        note: String = "",
        reference: String? = null,
    ): String {
        val id = newId()
        val d = day ?: clock.today()
        dao.upsert(
            TxnEntity(
                id = id, at = System.currentTimeMillis(), day = d.toString(), amountPaise = amountPaise, direction = direction,
                title = title.trim().ifBlank { category }, category = category, ledger = ledger.name, method = method,
                source = source, reference = reference, note = note, createdAt = System.currentTimeMillis(),
            ),
        )
        log.log("txn.add", "txn", id, mapOf("dir" to direction, "ledger" to ledger.name, "src" to source), if (source == "sms" || source == "notification") Tier.A else Tier.C)
        return id
    }

    suspend fun update(t: TxnEntity, learn: Boolean = false) {
        dao.upsert(t)
        if (learn) dao.upsertRule(PayeeRuleEntity(BankSms.payeeKey(t.title), t.category, t.ledger, System.currentTimeMillis()))
        log.log("txn.edit", "txn", t.id, mapOf("learn" to learn))
    }

    suspend fun delete(id: String): TxnEntity? {
        val t = dao.get(id) ?: return null
        dao.upsert(t.copy(deleted = true))
        log.log("txn.delete", "txn", id)
        return t
    }

    suspend fun restore(t: TxnEntity) = dao.upsert(t.copy(deleted = false))

    sealed interface Capture {
        data class Added(val draft: TxnDraftEntity) : Capture
        data object Duplicate : Capture
        data object NotABankAlert : Capture
    }

    /**
     * A bank SMS, payment notification or pasted text. Parsed on the device and
     * dropped into the review inbox — nothing is booked until settled.
     */
    suspend fun capture(text: String, source: String): Capture {
        val p = BankSms.parse(text) ?: return Capture.NotABankAlert
        val ref = p.reference
        if (ref != null && (dao.countByRef(ref) > 0 || dao.draftCountByRef(ref) > 0)) return Capture.Duplicate
        val rule = dao.rule(BankSms.payeeKey(p.name))
        val inbound = p.direction == MoneyDirection.IN
        val draft = TxnDraftEntity(
            id = newId(), detectedAt = System.currentTimeMillis(), amountPaise = p.amount * 100,
            direction = if (inbound) "in" else "out", title = p.name,
            category = rule?.category ?: if (inbound) "Other income" else BankSms.guessCategory(p.name),
            reference = ref, account4 = p.accountLast4, upiId = p.upiId, raw = text.take(500), source = source,
            confidence = if (ref != null && rule != null) 0.95 else if (ref != null) 0.8 else 0.6,
        )
        dao.upsertDraft(draft)
        log.log("txn.detect", "draft", draft.id, mapOf("src" to source), Tier.A, source)
        return Capture.Added(draft)
    }

    /** Book a draft; optionally remember the payee's category for next time. */
    suspend fun settle(draftId: String, category: String, ledger: Ledger, title: String? = null, learn: Boolean = true): String? {
        val d = dao.draft(draftId) ?: return null
        val name = title ?: d.title
        val id = add(
            d.amountPaise, d.direction, name, category, ledger, "UPI",
            Instant.ofEpochMilli(d.detectedAt).atZone(clock.zone).toLocalDate(), d.source, reference = d.reference,
        )
        dao.upsertDraft(d.copy(status = "settled"))
        if (learn) dao.upsertRule(PayeeRuleEntity(BankSms.payeeKey(name), category, ledger.name, System.currentTimeMillis()))
        return id
    }

    suspend fun dismiss(draftId: String) {
        dao.draft(draftId)?.let { dao.upsertDraft(it.copy(status = "dismissed")) }
        log.log("txn.dismiss", "draft", draftId)
    }

    /**
     * The plan is fixed on the 1st. Setting it for the first time applies now;
     * changing an existing plan mid-month applies next month (plan §5.7).
     */
    suspend fun setBudget(totalPaise: Long, fixedPaise: Long, caps: Map<String, Long>): YearMonth {
        val today = clock.today()
        val month = YearMonth.from(today)
        val existing = dao.budgetNow(month.toString())
        val target = if (existing == null || today.dayOfMonth == 1) month else month.plusMonths(1)
        dao.upsertBudget(BudgetEntity(target.toString(), totalPaise, fixedPaise, encodeCaps(caps), System.currentTimeMillis()))
        log.log("budget.set", "budget", target.toString(), mapOf("applies" to target.toString()))
        return target
    }

    /** Carry last month's plan into a new month on first open. */
    suspend fun ensureBudgetCarried() {
        val month = YearMonth.from(clock.today())
        if (dao.budgetNow(month.toString()) != null) return
        dao.latestBudget(month.toString())?.let { dao.upsertBudget(it.copy(month = month.toString(), updatedAt = System.currentTimeMillis())) }
    }

    suspend fun setGift(id: String, hideFrom: String?, revealOn: LocalDate?) {
        val t = dao.get(id) ?: return
        dao.upsert(t.copy(giftHideFrom = hideFrom, giftRevealOn = revealOn?.toString()))
    }

    suspend fun linkReceipt(id: String, docId: String?) {
        val t = dao.get(id) ?: return
        dao.upsert(t.copy(receiptDocId = docId))
    }

    suspend fun search(q: String) = dao.search("%$q%")

    /** Month CSV for a CA (business ledger by default). Returns the file. */
    suspend fun exportCsv(month: YearMonth, ledger: Ledger): File {
        val rows = dao.betweenNow(month.atDay(1).toString(), month.atEndOfMonth().toString()).filter { it.ledger == ledger.name }
        val dir = File(context.cacheDir, "exports").apply { mkdirs() }
        val f = File(dir, "aiimin-${ledger.name.lowercase()}-$month.csv")
        f.bufferedWriter().use { w ->
            w.write("date,direction,amount,title,category,method,reference,receipt\n")
            rows.sortedBy { it.at }.forEach {
                w.write(listOf(it.day, it.direction, "%.2f".format(it.amountPaise / 100.0), it.title, it.category, it.method, it.reference.orEmpty(), if (it.receiptDocId != null) "yes" else "")
                    .joinToString(",") { c -> "\"" + c.replace("\"", "\"\"") + "\"" } + "\n")
            }
        }
        log.log("export.csv", "budget", month.toString(), mapOf("ledger" to ledger.name, "rows" to rows.size))
        return f
    }

    private fun parseCaps(s: String): Map<String, Long> =
        runCatching { aiimin.core.data.util.AppJson.decodeFromString<Map<String, Long>>(s) }.getOrDefault(emptyMap())

    private fun encodeCaps(m: Map<String, Long>): String =
        aiimin.core.data.util.AppJson.encodeToString(kotlinx.serialization.serializer<Map<String, Long>>(), m)
}
