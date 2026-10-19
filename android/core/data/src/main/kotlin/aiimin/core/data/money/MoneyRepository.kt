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
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.time.LocalDate
import java.time.YearMonth
import java.time.temporal.WeekFields
import java.util.Locale
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.map
import aiimin.core.data.util.Dates

enum class Ledger(val label: String) { PERSONAL("Personal"), HOUSEHOLD("Household"), BUSINESS("Business") }

object Categories {
    val SPEND = listOf("Food", "Grocery", "Transport", "Bills", "Rent", "Subs", "Shopping", "Health", "Family", "Education", "Travel", "Fun", "Gifts", "Other")
    val INCOME = listOf("Salary", "Business", "Refund", "Gift", "Interest", "Other income")
}


enum class MoneyRange(val label: String) { D("D"), W("W"), M("M"), Q("3M"), H("6M"), Y("1Y") }

/** One bar of the money chart. [future] bars are drawn as 2 % stubs. */
data class SpendBar(val label: String, val paise: Long, val future: Boolean, val from: LocalDate, val to: LocalDate, val txns: List<TxnEntity>)

data class SpendSeries(
    val range: MoneyRange,
    val title: String,
    val bars: List<SpendBar>,
    val totalPaise: Long,
    /** Average per bar over the elapsed part of the window. */
    val usualPaise: Long,
    val p25: Long,
    val p75: Long,
    val unit: String,
    /** (bar index, text) pairs for the x-axis. */
    val xLabels: List<Pair<Int, String>>,
    /** True when the window is the current one (no paging forward). */
    val isCurrent: Boolean,
)

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
    private val ledger: aiimin.core.database.LedgerDao,
    private val settings: aiimin.core.data.settings.SettingsStore,
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
        settings.settings,
    ) { all, budget, pending, st ->
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
            remaining?.let { (it / daysLeft).coerceAtLeast(0) }, byCat, byDay, rollups(txns, st.rollupBelow * 100L), txns, pending,
        )
    }


    /** The chart data for D / W / M / 3M / 6M / 1Y. [offset] pages back (negative) by one window. */
    fun series(range: MoneyRange, ledger: Ledger, today: LocalDate, offset: Int = 0): Flow<SpendSeries> {
        val zone = clock.zone
        val (from, to) = when (range) {
            MoneyRange.D -> today.plusDays(offset.toLong()).let { it to it }
            MoneyRange.W -> today.plusDays(offset * 7L).let { it.minusDays(6) to it }
            MoneyRange.M -> YearMonth.from(today).plusMonths(offset.toLong()).let { it.atDay(1) to it.atEndOfMonth() }
            MoneyRange.Q -> today.plusWeeks(offset * 13L).let { it.minusDays(13 * 7 - 1L) to it }
            MoneyRange.H -> today.plusWeeks(offset * 26L).let { it.minusDays(26 * 7 - 1L) to it }
            MoneyRange.Y -> YearMonth.from(today).plusMonths(offset * 12L).let { it.minusMonths(11).atDay(1) to it.atEndOfMonth() }
        }
        return dao.between(from.toString(), to.toString()).map { all ->
            val txns = all.filter { it.ledger == ledger.name && it.direction == "out" }
            fun sum(l: List<TxnEntity>) = l.sumOf { it.amountPaise }
            val bars: List<SpendBar> = when (range) {
                MoneyRange.D -> (0..23).map { h ->
                    val l = txns.filter { Instant.ofEpochMilli(it.at).atZone(zone).hour == h }
                    val label = "${if (h % 12 == 0) 12 else h % 12} ${if (h < 12) "AM" else "PM"}"
                    SpendBar(label, sum(l), from == today && h > java.time.LocalTime.now(zone).hour, from, to, l)
                }
                MoneyRange.W, MoneyRange.M -> generateSequence(from) { d -> d.plusDays(1).takeIf { it <= to } }.map { d ->
                    val l = txns.filter { it.day == d.toString() }
                    SpendBar(Dates.dayMonthOf(d), sum(l), d > today, d, d, l)
                }.toList()
                MoneyRange.Q, MoneyRange.H -> {
                    val weeks = if (range == MoneyRange.Q) 13 else 26
                    (0 until weeks).map { w ->
                        val a = from.plusDays(w * 7L)
                        val b = a.plusDays(6)
                        val l = txns.filter { it.day >= a.toString() && it.day <= b.toString() }
                        SpendBar("${Dates.shortDm(a)} – ${Dates.shortDm(b)}", sum(l), a > today, a, b, l)
                    }
                }
                MoneyRange.Y -> (0 until 12).map { m ->
                    val ym = YearMonth.from(from).plusMonths(m.toLong())
                    val l = txns.filter { it.day.startsWith(ym.toString()) }
                    SpendBar(ym.month.getDisplayName(java.time.format.TextStyle.FULL, Locale.ENGLISH) + " " + ym.year, sum(l), ym.atDay(1) > today, ym.atDay(1), ym.atEndOfMonth(), l)
                }
            }
            val elapsed = bars.filter { !it.future }
            val total = elapsed.sumOf { it.paise }
            val usual = if (elapsed.isEmpty()) 0L else total / elapsed.size
            val sorted = elapsed.map { it.paise }.sorted()
            fun pct(p: Double) = if (sorted.isEmpty()) 0L else sorted[((sorted.size - 1) * p).toInt()]
            val n = bars.size
            val labels = when (range) {
                MoneyRange.D -> listOf(0 to "12 AM", 6 to "6", 12 to "12 PM", 18 to "6", 23 to "11")
                MoneyRange.W -> listOf(0 to bars.first().label, n / 2 to bars[n / 2].label, n - 1 to bars.last().label)
                MoneyRange.M -> listOf(0 to "1", 7 to "8", 14 to "15", 21 to "22", n - 1 to n.toString())
                MoneyRange.Q, MoneyRange.H -> listOf(0 to Dates.shortDm(bars.first().from), n / 2 to Dates.shortDm(bars[n / 2].from), n - 1 to Dates.shortDm(bars.last().to))
                MoneyRange.Y -> listOf(0 to bars.first().label.take(3), 5 to bars[5].label.take(3), 11 to bars.last().label.take(3))
            }
            val title = when (range) {
                MoneyRange.D -> if (offset == 0) "Spent today" else "Spent on ${Dates.dayMonthOf(from)}"
                MoneyRange.W -> if (offset == 0) "Spent in the last 7 days" else "Spent ${Dates.shortDm(from)} – ${Dates.shortDm(to)}"
                MoneyRange.M -> "Spent in ${YearMonth.from(from).month.getDisplayName(java.time.format.TextStyle.FULL, Locale.ENGLISH)}"
                MoneyRange.Q -> "Spent in the last 3 months"
                MoneyRange.H -> "Spent in the last 6 months"
                MoneyRange.Y -> "Spent in the last 12 months"
            }
            SpendSeries(
                range, title, bars, total, usual, pct(0.25), pct(0.75),
                unit = when (range) { MoneyRange.D -> "hour"; MoneyRange.W, MoneyRange.M -> "day"; MoneyRange.Q, MoneyRange.H -> "week"; MoneyRange.Y -> "month" },
                xLabels = labels, isCurrent = offset == 0,
            )
        }
    }

    /** Payments below the roll-up threshold (₹200 by default, SE7) to the same payee, grouped weekly. */
    private fun rollups(txns: List<TxnEntity>, belowPaise: Long = 200_00): List<Rollup> {
        val week = WeekFields.of(Locale.forLanguageTag("en-IN"))
        return txns.filter { it.direction == "out" && it.amountPaise < belowPaise }
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
        account4: String? = null,
        upiId: String? = null,
        at: Long? = null,
    ): String {
        val id = newId()
        val d = day ?: clock.today()
        dao.upsert(
            TxnEntity(
                id = id, at = at ?: System.currentTimeMillis(), day = d.toString(), amountPaise = amountPaise, direction = direction,
                title = title.trim().ifBlank { category }, category = category, ledger = ledger.name, method = method,
                source = source, reference = reference, account4 = account4, upiId = upiId, note = note, createdAt = System.currentTimeMillis(),
            ),
        )
        log.log("txn.add", "txn", id, mapOf("dir" to direction, "ledger" to ledger.name, "src" to source), if (source == "sms" || source == "notification") Tier.A else Tier.C)
        return id
    }

    suspend fun update(t: TxnEntity, learn: Boolean = false) {
        dao.upsert(t)
        // A short single-line note is "what you bought" and joins the place's recent items (plan §3).
        if (learn) remember(t.title, t.category, t.ledger, t.upiId, t.note.takeIf { it.length <= 40 && '\n' !in it })
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
    suspend fun capture(text: String, source: String, at: Long = System.currentTimeMillis()): Capture {
        val p = BankSms.parse(text) ?: return Capture.NotABankAlert
        // Live alerts follow the person's bank-message filter (amount, direction, account, words).
        if (source == "notification" && aiimin.core.nlp.SmsSift.filterReason(p, text, aiimin.core.nlp.SmsFilter.decode(settings.current().smsFilter)) != null) {
            return Capture.NotABankAlert
        }
        val ref = p.reference
        if (ref != null && (dao.countByRef(ref) > 0 || dao.draftCountByRef(ref) > 0)) return Capture.Duplicate
        if (ref == null && dao.draftCountByRaw(text.take(500)) > 0) return Capture.Duplicate
        // An account with a "track from" day ignores alerts dated before it (M10).
        if (accountIgnores(p.accountLast4, at)) return Capture.NotABankAlert
        // Payee memory: by the UPI handle first (stable), then by the cleaned name.
        val rule = (p.upiId?.let { dao.rule(BankSms.payeeKey(it.substringBefore('@'))) }) ?: dao.rule(BankSms.payeeKey(p.name))
        // Merchant memory (plan §3): the learned place and category; "always ask" keeps the name only.
        val inbound = p.direction == MoneyDirection.IN
        val g = MerchantMemory.guess(rule, p.name, ref != null, if (inbound) "Other income" else BankSms.guessCategory(p.name))
        val draft = TxnDraftEntity(
            id = newId(), detectedAt = at, amountPaise = p.paise,
            direction = if (inbound) "in" else "out", title = g.title, category = g.category,
            reference = ref, account4 = p.accountLast4, upiId = p.upiId, raw = text.take(500), source = source,
            confidence = g.confidence,
        )
        dao.upsertDraft(draft)
        log.log("txn.detect", "draft", draft.id, mapOf("src" to source), Tier.A, source)
        return Capture.Added(draft)
    }

    /** Book a draft; optionally remember the payee's category for next time. */
    suspend fun settle(draftId: String, category: String, ledger: Ledger, title: String? = null, learn: Boolean = true, note: String? = null): String? {
        val d = dao.draft(draftId) ?: return null
        val name = title?.trim()?.ifEmpty { null } ?: d.title
        val id = add(
            d.amountPaise, d.direction, name, category, ledger, "UPI",
            Instant.ofEpochMilli(d.detectedAt).atZone(clock.zone).toLocalDate(), d.source, reference = d.reference,
            account4 = d.account4, upiId = d.upiId, at = d.detectedAt, note = note?.trim().orEmpty(),
        )
        dao.upsertDraft(d.copy(status = "settled"))
        // The place is learned under the bank's own name too, so the next alert finds it either way.
        if (learn) remember(name, category, ledger.name, d.upiId, note, alsoKey = d.title)
        return id
    }

    /** What was bought at this draft's place lately ("Chocolate", "Milk"), for one-tap chips. */
    suspend fun recentItems(d: TxnDraftEntity): List<String> {
        val rule = d.upiId?.let { dao.rule(BankSms.payeeKey(it.substringBefore('@'))) } ?: dao.rule(BankSms.payeeKey(d.title))
        return rule?.let(MerchantMemory::notes).orEmpty()
    }

    /** Built-in and custom categories for chips, most used in the last 90 days first. */
    fun categories(inbound: Boolean): Flow<List<String>> = combine(
        dao.categories(), dao.categoryUse(LocalDate.now(clock.zone).minusDays(90).toString()),
    ) { custom, use ->
        MerchantMemory.categories(if (inbound) Categories.INCOME else Categories.SPEND, custom.filter { it.kind == if (inbound) "in" else "out" }, use.associate { it.category to it.n })
    }

    fun customCategories() = dao.categories()

    suspend fun archiveCategory(c: aiimin.core.database.CategoryEntity, archived: Boolean) = dao.upsertCategory(c.copy(archived = archived))

    /** Adds a custom category; returns its name, or null when the name is empty or taken. */
    suspend fun addCategory(raw: String, inbound: Boolean, icon: String = "Tag"): String? {
        val existing = Categories.SPEND + Categories.INCOME + dao.categoriesNow().map { it.name }
        val name = MerchantMemory.newCategoryName(raw, existing) ?: return null
        dao.upsertCategory(aiimin.core.database.CategoryEntity(newId(), name, icon, if (inbound) "in" else "out", false, System.currentTimeMillis()))
        log.log("category.add", "category", name)
        return name
    }

    /**
     * Payee memory (M16). Keyed by the cleaned name and, when the alert carried one, by the UPI
     * handle too, so "9822104471@ybl" and "Sharma Kirana" land on the same rule. Keeps the
     * person's "always ask" choice and counts uses.
     */
    private suspend fun remember(name: String, category: String, ledger: String, upiId: String? = null, note: String? = null, alsoKey: String? = null) {
        val keys = listOfNotNull(BankSms.payeeKey(name), upiId?.substringBefore('@')?.let(BankSms::payeeKey), alsoKey?.let(BankSms::payeeKey))
            .filter { it.isNotBlank() }.distinct()
        for (k in keys) dao.upsertRule(MerchantMemory.learn(dao.rule(k), k, name, category, ledger, note, System.currentTimeMillis()))
    }

    private suspend fun accountIgnores(last4: String?, at: Long): Boolean {
        val day = Instant.ofEpochMilli(at).atZone(clock.zone).toLocalDate()
        // The whole-app "track from" month (set when importing past messages) applies to every account.
        settings.current().moneyTrackFrom?.let { runCatching { LocalDate.parse(it) }.getOrNull() }?.let { if (day.isBefore(it)) return true }
        if (last4 == null) return false
        val a = ledger.accountsNow().firstOrNull { it.last4 == last4 } ?: return false
        val from = a.trackFrom?.let { runCatching { LocalDate.parse(it) }.getOrNull() } ?: return false
        return day.isBefore(from)
    }

    /** True when the person has let AIIMIN read the SMS inbox. */
    fun canReadSms(): Boolean = androidx.core.content.ContextCompat.checkSelfPermission(context, android.Manifest.permission.READ_SMS) == android.content.pm.PackageManager.PERMISSION_GRANTED

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
    /** Rows the export for [month] and [ledger] would hold (M14 shows it before exporting). */
    suspend fun exportCount(month: YearMonth, ledger: Ledger): Int =
        dao.betweenNow(month.atDay(1).toString(), month.atEndOfMonth().toString()).count { it.ledger == ledger.name && !it.deleted }

    fun exportName(month: YearMonth, ledger: Ledger) = "aiimin-${ledger.name.lowercase()}-$month.csv"

    suspend fun exportCsv(month: YearMonth, ledger: Ledger): File {
        val rows = dao.betweenNow(month.atDay(1).toString(), month.atEndOfMonth().toString()).filter { it.ledger == ledger.name && !it.deleted }
        val accounts = this.ledger.accountsNow()
        val dir = File(context.cacheDir, "exports").apply { mkdirs() }
        val f = File(dir, exportName(month, ledger))
        f.bufferedWriter().use { w ->
            w.write("date,time,direction,amount_inr,payee,category,account,method,reference,note,receipt\n")
            val fmt = java.time.format.DateTimeFormatter.ofPattern("HH:mm")
            rows.sortedBy { it.at }.forEach {
                val acct = it.account4?.let { l4 -> accounts.firstOrNull { a -> a.last4 == l4 }?.let { a -> a.name + " ••" + l4 } ?: "••$l4" }.orEmpty()
                w.write(
                    listOf(
                        it.day, fmt.format(Instant.ofEpochMilli(it.at).atZone(clock.zone)), if (it.direction == "in") "received" else "spent",
                        "%.2f".format(it.amountPaise / 100.0), it.title, it.category, acct, it.method, it.reference.orEmpty(), it.note,
                        if (it.receiptDocId != null) "yes" else "",
                    ).joinToString(",") { c -> "\"" + c.replace("\"", "\"\"") + "\"" } + "\n",
                )
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
