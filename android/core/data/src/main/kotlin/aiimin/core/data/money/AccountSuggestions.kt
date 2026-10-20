package aiimin.core.data.money

import aiimin.core.database.AccountEntity
import aiimin.core.nlp.SmsSift

/**
 * A masked account number seen in bank messages (owner, 20 Oct): offered as "Add this account" when it is
 * not in Accounts. Nothing is added without a tap; "Not mine" hides the number for good.
 */
data class SeenAccount(val last4: String, val bank: String?, val alerts: Int, val lastAt: Long) {
    val label: String get() = (bank ?: "Bank") + " ••" + last4

    /** An account of the same bank that has no number yet: link to it instead of adding a second one. */
    fun linkTarget(accounts: List<AccountEntity>): AccountEntity? =
        bank?.let { b ->
            accounts.firstOrNull {
                !it.archived && it.last4 == null && it.type != "CASH" &&
                    (it.bank.equals(b, ignoreCase = true) || it.name.equals(b, ignoreCase = true))
            }
        }
}

/** The bank a stored alert came from: its sender header first, then a bank named in the text. */
fun bankFromRaw(raw: String): String? {
    val first = raw.trim().substringBefore(' ')
    return SmsSift.knownBankOf(first) ?: SmsSift.bankNamedIn(raw)
}

/** Numbers to offer: merged per number, not already an account (archived counts), not dismissed; newest first. */
fun suggestAccounts(seen: List<SeenAccount>, accounts: List<AccountEntity>, dismissed: Set<String>): List<SeenAccount> {
    val known = accounts.mapNotNull { it.last4 }.toSet()
    return seen.groupBy { it.last4 }
        .filterKeys { it !in known && it !in dismissed }
        .map { (l4, list) -> SeenAccount(l4, list.maxByOrNull { it.lastAt }?.bank ?: list.firstNotNullOfOrNull { it.bank }, list.sumOf { it.alerts }, list.maxOf { it.lastAt }) }
        .sortedByDescending { it.lastAt }
}
