package aiimin.core.data.money

import aiimin.core.data.core.DayClock
import aiimin.core.data.core.EventLogger
import aiimin.core.data.settings.SettingsStore
import aiimin.core.data.util.AppJson
import aiimin.core.data.util.Money
import aiimin.core.data.util.newId
import aiimin.core.database.AccountEntity
import aiimin.core.database.BillEntity
import aiimin.core.database.FamilyDao
import aiimin.core.database.LedgerDao
import aiimin.core.database.MoneyDao
import aiimin.core.database.PayeeRuleEntity
import aiimin.core.database.TxnEntity
import aiimin.core.nlp.BankSms
import java.time.LocalDate
import java.time.temporal.ChronoUnit
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.math.abs
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.map
import kotlinx.serialization.Serializable
import kotlinx.serialization.builtins.ListSerializer

// =================================================================== accounts (M9 / M10)

enum class AccountType(val label: String) { SAVINGS("Savings"), CREDIT("Credit card"), WALLET("Wallet"), CASH("Cash") }

data class AccountView(val account: AccountEntity, val lastAlertAt: Long?) {
    val short: String get() = account.name + (account.last4?.let { " ••$it" } ?: "")

    /** Quiet for 7+ days on an account that should be sending alerts. */
    fun quiet(now: Long = System.currentTimeMillis()): Boolean =
        account.type != AccountType.CASH.name && (account.notifAlerts || account.smsAlerts) &&
            (lastAlertAt == null || now - lastAlertAt > 7 * 86_400_000L)
}

/**
 * Accounts come from onboarding (banks picked, cash wallet) and from the last four digits that bank
 * alerts carry. One primary per ledger: spends spoken or typed without an account go there. Bank
 * alerts always use the account they came from.
 */
@Singleton
class AccountRepository @Inject constructor(
    private val dao: LedgerDao,
    private val settings: SettingsStore,
    private val log: EventLogger,
) {
    val accounts: Flow<List<AccountEntity>> = dao.accounts()

    suspend fun views(): List<AccountView> = dao.accountsNow().filter { !it.archived }.map { a ->
        AccountView(a, a.last4?.let { dao.lastAlertAt(it) })
    }

    suspend fun get(id: String) = dao.account(id)

    /** First open: build the list from what onboarding knows and the cards alerts have shown. */
    suspend fun ensureSeeded() {
        val existing = dao.accountsNow()
        val now = System.currentTimeMillis()
        if (existing.isEmpty()) {
            val s = settings.current()
            s.banks.forEachIndexed { i, bank ->
                val type = if (bank.contains("card", ignoreCase = true)) AccountType.CREDIT else AccountType.SAVINGS
                dao.upsertAccount(AccountEntity(newId(), bank, bank, type = type.name, primary = (s.primaryBank ?: s.banks.first()) == bank, createdAt = now + i, updatedAt = now))
            }
            if (s.cashWallet) dao.upsertAccount(AccountEntity(newId(), "Cash", type = AccountType.CASH.name, notifAlerts = false, smsAlerts = false, createdAt = now + 50, updatedAt = now))
        }
        // Learned last-four digits: fill the primary bank's blank first, then add the rest.
        val all = dao.accountsNow()
        val known = all.mapNotNull { it.last4 }.toSet()
        for (l4 in dao.knownLast4().filter { it !in known }) {
            val blank = dao.accountsNow().firstOrNull { it.last4 == null && it.type != AccountType.CASH.name && !it.archived }
            if (blank != null) dao.upsertAccount(blank.copy(last4 = l4, updatedAt = now))
            else dao.upsertAccount(AccountEntity(newId(), "Bank", last4 = l4, primary = dao.accountsNow().none { it.primary }, createdAt = now, updatedAt = now))
        }
    }

    suspend fun save(a: AccountEntity): String {
        val now = System.currentTimeMillis()
        dao.upsertAccount(a.copy(name = a.name.trim().ifBlank { a.bank.ifBlank { "Account" } }, updatedAt = now))
        if (a.primary) dao.clearPrimary(a.ledger, a.id)
        log.log("account.save", "account", a.id, mapOf("type" to a.type, "primary" to a.primary))
        return a.id
    }

    suspend fun create(name: String, type: AccountType, last4: String?, ledger: Ledger = Ledger.PERSONAL): String =
        save(AccountEntity(newId(), name, name, last4?.takeLast(4)?.ifBlank { null }, type.name, ledger.name, createdAt = System.currentTimeMillis(), updatedAt = System.currentTimeMillis()))

    suspend fun archive(id: String) {
        dao.account(id)?.let { dao.upsertAccount(it.copy(archived = true, primary = false, updatedAt = System.currentTimeMillis())) }
        log.log("account.archive", "account", id)
    }

    /** The account a txn belongs to: by last four, else the ledger's primary. */
    fun accountFor(t: TxnEntity, all: List<AccountEntity>): AccountEntity? =
        t.account4?.let { l4 -> all.firstOrNull { it.last4 == l4 } }
            ?: if (t.method == "CASH") all.firstOrNull { it.type == AccountType.CASH.name } else all.firstOrNull { it.primary && it.ledger == t.ledger }

    /** Alerts dated before an account's "track from" day are ignored. */
    suspend fun ignores(last4: String?, day: LocalDate): Boolean {
        val a = dao.accountsNow().firstOrNull { it.last4 != null && it.last4 == last4 } ?: return false
        val from = a.trackFrom?.let { runCatching { LocalDate.parse(it) }.getOrNull() } ?: return false
        return day.isBefore(from)
    }
}

// =================================================================== recurring and bills (M13)

enum class Cadence(val label: String, val days: Long) { WEEKLY("Weekly", 7), MONTHLY("Monthly", 30), YEARLY("Yearly", 365) }

/** A series spotted in payment history. Pure, so it can be tested. */
data class RecurringGuess(val payeeKey: String, val title: String, val amountPaise: Long, val cadence: Cadence, val lastDay: LocalDate, val hits: Int, val category: String)

object RecurringDetector {
    /**
     * Three payments (two for yearly) to the same payee at a steady weekly or monthly gap, with amounts
     * within 15% of each other. Daily spends at the same shop are never "monthly".
     */
    fun detect(txns: List<TxnEntity>): List<RecurringGuess> =
        txns.filter { it.direction == "out" && !it.deleted }
            .groupBy { BankSms.payeeKey(it.title) }
            .filter { (k, l) -> k.isNotBlank() && l.size >= 2 }
            .mapNotNull { (key, all) ->
                // Anchor on the latest amount: one-off spends at the same payee don't break the rhythm.
                val anchor = all.maxBy { it.at }.amountPaise
                val list = all.filter { abs(it.amountPaise - anchor) <= anchor * 0.15 }
                if (list.size < 2) return@mapNotNull null
                val sorted = list.sortedBy { it.day }
                val days = sorted.map { LocalDate.parse(it.day) }.distinct()
                if (days.size < 2) return@mapNotNull null
                val gaps = days.zipWithNext { a, b -> ChronoUnit.DAYS.between(a, b) }
                val cadence = when {
                    gaps.all { it in 26..35 } && days.size >= 3 -> Cadence.MONTHLY
                    gaps.all { it in 6..8 } && days.size >= 3 -> Cadence.WEEKLY
                    gaps.all { it in 350..380 } -> Cadence.YEARLY
                    else -> return@mapNotNull null
                }
                val amounts = sorted.map { it.amountPaise }
                val median = amounts.sorted()[amounts.size / 2]
                if (median <= 0 || amounts.any { abs(it - median) > median * 0.15 }) return@mapNotNull null
                val last = sorted.last()
                RecurringGuess(key, last.title, median, cadence, days.last(), days.size, last.category)
            }

    fun nextAfter(day: LocalDate, cadence: Cadence): LocalDate = when (cadence) {
        Cadence.WEEKLY -> day.plusWeeks(1)
        Cadence.MONTHLY -> day.plusMonths(1)
        Cadence.YEARLY -> day.plusYears(1)
    }
}

@Singleton
class BillRepository @Inject constructor(
    private val dao: LedgerDao,
    private val clock: DayClock,
    private val log: EventLogger,
) {
    val bills: Flow<List<BillEntity>> = dao.bills()

    /** Confirmed bills due in the next [days] days (Money home "Coming up"). */
    fun comingUp(days: Long = 10): Flow<List<BillEntity>> = dao.bills().map { list ->
        val today = clock.today()
        list.filter { it.status == "CONFIRMED" }.filter { LocalDate.parse(it.nextDue) <= today.plusDays(days) }.sortedBy { it.nextDue }
    }

    /**
     * Looks at the last 120 days. New series become suggestions; a payment to a confirmed bill
     * moves its due date on. Dismissed series are never suggested again.
     */
    suspend fun refresh() {
        val today = clock.today()
        val txns = dao.txnsSince(today.minusDays(120).toString())
        val existing = dao.billsNow().associateBy { it.payeeKey }
        val now = System.currentTimeMillis()
        for (g in RecurringDetector.detect(txns)) {
            val cur = existing[g.payeeKey]
            var next = RecurringDetector.nextAfter(g.lastDay, g.cadence)
            while (next.isBefore(today.minusDays(3))) next = RecurringDetector.nextAfter(next, g.cadence)
            if (cur == null) {
                dao.upsertBill(
                    BillEntity(newId(), g.title, g.payeeKey, g.amountPaise, g.cadence.name, next.toString(), category = g.category, lastPaid = g.lastDay.toString(), createdAt = now, updatedAt = now),
                )
            } else if (cur.status != "DISMISSED" && (cur.lastPaid?.let { g.lastDay.toString() > it } ?: true)) {
                dao.upsertBill(cur.copy(lastPaid = g.lastDay.toString(), nextDue = next.toString(), updatedAt = now))
            }
        }
        // Confirmed bills whose date passed without a payment roll to the next period.
        for (b in dao.billsNow().filter { it.status == "CONFIRMED" }) {
            var due = LocalDate.parse(b.nextDue)
            val cad = runCatching { Cadence.valueOf(b.cadence) }.getOrDefault(Cadence.MONTHLY)
            if (due.isBefore(today.minusDays(5))) {
                while (due.isBefore(today.minusDays(5))) due = RecurringDetector.nextAfter(due, cad)
                dao.upsertBill(b.copy(nextDue = due.toString(), updatedAt = now))
            }
        }
    }

    suspend fun confirm(id: String) = dao.bill(id)?.let { dao.upsertBill(it.copy(status = "CONFIRMED", updatedAt = System.currentTimeMillis())); log.log("bill.confirm", "bill", id) }

    suspend fun dismiss(id: String) = dao.bill(id)?.let { dao.upsertBill(it.copy(status = "DISMISSED", updatedAt = System.currentTimeMillis())); log.log("bill.dismiss", "bill", id) }

    suspend fun save(b: BillEntity) = dao.upsertBill(b.copy(updatedAt = System.currentTimeMillis()))

    suspend fun add(title: String, amountPaise: Long, cadence: Cadence, nextDue: LocalDate, autopay: Boolean): String {
        val now = System.currentTimeMillis()
        val id = newId()
        dao.upsertBill(BillEntity(id, title.trim(), BankSms.payeeKey(title), amountPaise, cadence.name, nextDue.toString(), "CONFIRMED", autopay, createdAt = now, updatedAt = now))
        log.log("bill.add", "bill", id)
        return id
    }

    suspend fun markPaid(id: String) {
        val b = dao.bill(id) ?: return
        val cad = runCatching { Cadence.valueOf(b.cadence) }.getOrDefault(Cadence.MONTHLY)
        val due = LocalDate.parse(b.nextDue)
        dao.upsertBill(b.copy(lastPaid = clock.today().toString(), nextDue = RecurringDetector.nextAfter(due, cad).toString(), updatedAt = System.currentTimeMillis()))
        log.log("bill.paid", "bill", id)
    }

    suspend fun get(id: String) = dao.bill(id)
}

// =================================================================== splits (M11 / M12)

/** One share of a payment. [owesMe] true: they owe you their part; false: you owe them yours. */
@Serializable
data class SplitShare(val who: String, val paise: Long, val settled: Boolean = false, val owesMe: Boolean = true, val name: String = "")

data class SplitLine(val txn: TxnEntity, val share: SplitShare)

data class Balance(val who: String, val name: String, val netPaise: Long, val lines: List<SplitLine>, val lastAt: Long) {
    /** Positive: they owe you. Negative: you owe them. */
    val theyOwe get() = netPaise > 0
}

object Splits {
    private val ser = ListSerializer(SplitShare.serializer())

    fun decode(json: String): List<SplitShare> = runCatching { AppJson.decodeFromString(ser, json) }.getOrDefault(emptyList())

    fun encode(list: List<SplitShare>): String = AppJson.encodeToString(ser, list)

    /** Equal parts, the rounding paise going to the payer so the shares never exceed the total. */
    fun equal(totalPaise: Long, people: List<Pair<String, String>>): List<SplitShare> {
        val n = people.size + 1
        val each = totalPaise / n
        return people.map { (id, name) -> SplitShare(id, each, owesMe = true, name = name) }
    }

    /** Net per person over unsettled shares. Pure, so it can be tested. */
    fun balances(txns: List<TxnEntity>): List<Balance> {
        val lines = txns.filter { !it.deleted }.flatMap { t -> decode(t.splits).filter { !it.settled }.map { SplitLine(t, it) } }
        return lines.groupBy { it.share.who }.map { (who, l) ->
            Balance(
                who, l.first().share.name.ifBlank { who },
                l.sumOf { if (it.share.owesMe) it.share.paise else -it.share.paise },
                l.sortedByDescending { it.txn.at }, l.maxOf { it.txn.at },
            )
        }.filter { it.netPaise != 0L }.sortedByDescending { abs(it.netPaise) }
    }

    /** UPI deep link per NPCI: pay [vpa] [paise] with a note. Never a collect request. */
    fun upiPayUri(vpa: String, name: String, paise: Long, note: String = "AIIMIN settle"): String {
        fun enc(s: String) = java.net.URLEncoder.encode(s, "UTF-8").replace("+", "%20")
        val am = "%d.%02d".format(paise / 100, paise % 100)
        return "upi://pay?pa=${enc(vpa.trim())}&pn=${enc(name)}&am=$am&cu=INR&tn=${enc(note)}"
    }
}

@Singleton
class SplitRepository @Inject constructor(
    private val dao: LedgerDao,
    private val money: MoneyDao,
    private val family: FamilyDao,
    private val clock: DayClock,
    private val log: EventLogger,
) {
    val balances: Flow<List<Balance>> = dao.splitTxns().map { Splits.balances(it) }

    /** Distinct people ever split with (Free covers 3). */
    suspend fun peopleCount(): Int =
        money.betweenNow("0000-01-01", "9999-12-31").flatMap { Splits.decode(it.splits) }.map { it.who }.toSet().size

    /** Split a payment you made equally with [people] (id to name). */
    suspend fun splitEqually(txnId: String, people: List<Pair<String, String>>) {
        val t = money.get(txnId) ?: return
        val shares = Splits.equal(t.amountPaise, people)
        money.upsert(t.copy(splits = Splits.encode(shares)))
        log.log("split.add", "txn", txnId, mapOf("people" to people.size))
    }

    /** "Priya paid ₹600 for dinner, my part is ₹300": books your part and what you owe her. */
    suspend fun recordIOwe(who: String, name: String, myPartPaise: Long, title: String, category: String): String {
        val id = newId()
        val now = System.currentTimeMillis()
        money.upsert(
            TxnEntity(
                id = id, at = now, day = clock.today().toString(), amountPaise = myPartPaise, direction = "out", title = title.ifBlank { "Paid by $name" },
                category = category, method = "IOU", source = "manual", note = "Paid by $name",
                splits = Splits.encode(listOf(SplitShare(who, myPartPaise, owesMe = false, name = name))), createdAt = now,
            ),
        )
        log.log("split.iou", "txn", id)
        return id
    }

    /** Settles every open share with [who] (cash, UPI or forgiven). */
    suspend fun settle(who: String, how: String) {
        val txns = money.betweenNow("0000-01-01", "9999-12-31").filter { it.splits != "[]" }
        for (t in txns) {
            val shares = Splits.decode(t.splits)
            if (shares.none { it.who == who && !it.settled }) continue
            money.upsert(t.copy(splits = Splits.encode(shares.map { if (it.who == who) it.copy(settled = true) else it })))
        }
        log.log("split.settle", "person", who, mapOf("how" to how))
    }

    suspend fun personUpi(who: String): String? = family.get(who)?.upiId?.ifBlank { null }

    suspend fun savePersonUpi(who: String, vpa: String) {
        family.get(who)?.let { family.upsert(it.copy(upiId = vpa.trim())) }
    }

    fun format(paise: Long) = Money.whole(paise)
}

// =================================================================== payee memory (M16)

@Singleton
class PayeeMemoryRepository @Inject constructor(private val dao: LedgerDao, private val money: MoneyDao, private val log: EventLogger) {
    val rules: Flow<List<PayeeRuleEntity>> = dao.rules()

    suspend fun save(r: PayeeRuleEntity) {
        money.upsertRule(r.copy(updatedAt = System.currentTimeMillis()))
        log.log("payee.edit", "payee", r.key)
    }

    suspend fun delete(key: String) {
        dao.deleteRule(key)
        log.log("payee.forget", "payee", key)
    }
}

/** Money home extras in one flow: accounts with health, balances and bills due soon. */
data class MoneyExtras(val accounts: List<AccountEntity>, val balances: List<Balance>, val comingUp: List<BillEntity>)

fun moneyExtras(accounts: AccountRepository, splits: SplitRepository, bills: BillRepository): Flow<MoneyExtras> =
    combine(accounts.accounts, splits.balances, bills.comingUp()) { a, s, b -> MoneyExtras(a, s, b) }
