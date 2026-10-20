package aiimin.core.data.money

import aiimin.core.data.util.Money
import aiimin.core.database.MoneyRuleEntity
import aiimin.core.database.PayeeRuleEntity
import aiimin.core.nlp.BankSms
import aiimin.core.nlp.MerchantList

/**
 * Smart rules (Part 5 Phase 2): conditions the person sets ("name has swiggy, under ₹500 → Food, Personal").
 * Every condition that is set must hold. Rules run in order before payee memory and the built-in list. Pure.
 */
object SmartRules {
    /** One payment as a rule sees it: the shown name, the UPI handle, the amount, the card or account, and the text. */
    data class Payment(val name: String, val upiId: String?, val paise: Long, val account4: String?, val text: String, val direction: String)

    fun hasCondition(r: MoneyRuleEntity): Boolean =
        r.contains.isNotBlank() || r.minPaise != null || r.maxPaise != null || !r.account4.isNullOrBlank() || r.noteContains.isNotBlank()

    fun matches(r: MoneyRuleEntity, p: Payment): Boolean {
        if (!r.enabled || !hasCondition(r)) return false
        if (r.direction != "any" && r.direction != p.direction) return false
        if (r.contains.isNotBlank() && !nameHas(p, r.contains)) return false
        r.minPaise?.let { if (p.paise < it) return false }
        r.maxPaise?.let { if (p.paise >= it) return false }
        if (!r.account4.isNullOrBlank() && r.account4 != p.account4) return false
        if (r.noteContains.isNotBlank() && !p.text.contains(r.noteContains.trim(), ignoreCase = true)) return false
        return true
    }

    /** The first rule in order that matches, or null. */
    fun first(rules: List<MoneyRuleEntity>, p: Payment): MoneyRuleEntity? =
        rules.sortedWith(compareBy<MoneyRuleEntity> { it.position }.thenBy { it.createdAt }).firstOrNull { matches(it, p) }

    /**
     * "swiggy" is in "Swiggy Instamart", "SWIGGYINSTAMART" and "swiggy.instamart@icici"; "ola" is not in "Bholanath".
     * Words match whole, or a word of 5 letters or more may start a joined name. A comma separates alternatives.
     */
    private fun nameHas(p: Payment, needle: String): Boolean {
        val hay = listOfNotNull(p.name, p.upiId?.substringBefore('@')?.replace(Regex("""\d+"""), " ")).map(MerchantList::words)
        return needle.split(',').map(MerchantList::words).filter { it.isNotEmpty() }.any { n -> hay.any { w -> MerchantList.has(w, n) } }
    }

    /**
     * "Make this a rule?" accepted: the place under every name it is remembered by (its UPI handle and the bank's
     * name for it, not only the name the person gave it), its category and ledger, filed without asking.
     */
    fun fromPayee(r: PayeeRuleEntity, keys: List<String>, id: String, position: Int, now: Long): MoneyRuleEntity {
        val names = (keys + r.key).filter { it.isNotBlank() }.distinct()
        return MoneyRuleEntity(
            id = id, name = r.label.ifBlank { r.key }, position = position, contains = names.joinToString(", "),
            category = r.category, ledger = r.ledger, autoBook = true, createdAt = now, updatedAt = now,
        )
    }

    /** True when a rule that books by itself already answers this place (under any of its [keys]). */
    fun covers(rules: List<MoneyRuleEntity>, keys: List<String>): Boolean =
        rules.any { r -> r.enabled && r.autoBook && r.contains.isNotBlank() && keys.any { k -> nameHas(Payment(k, null, 0, null, "", "out"), r.contains) } }

    /** One line a person reads: "Name has “swiggy” · under ₹500 → Food · Personal". */
    fun describe(r: MoneyRuleEntity): String {
        val parts = buildList {
            if (r.contains.isNotBlank()) add("Name has “${r.contains.trim()}”")
            val lo = r.minPaise
            val hi = r.maxPaise
            when {
                lo != null && hi != null -> add("${Money.whole(lo)} to under ${Money.whole(hi)}")
                lo != null -> add("from ${Money.whole(lo)}")
                hi != null -> add("under ${Money.whole(hi)}")
            }
            if (!r.account4.isNullOrBlank()) add("••${r.account4}")
            if (r.noteContains.isNotBlank()) add("message has “${r.noteContains.trim()}”")
            if (r.direction == "in") add("money in") else if (r.direction == "any") add("in or out")
        }
        val ledger = Ledger.entries.firstOrNull { it.name == r.ledger }?.label ?: r.ledger
        return parts.joinToString(" · ") + " → ${r.category} · $ledger"
    }

    /** Moves a rule one place up or down; positions are renumbered 0, 1, 2… */
    fun move(rules: List<MoneyRuleEntity>, id: String, up: Boolean): List<MoneyRuleEntity> {
        val l = rules.sortedWith(compareBy<MoneyRuleEntity> { it.position }.thenBy { it.createdAt }).toMutableList()
        val i = l.indexOfFirst { it.id == id }
        val j = if (up) i - 1 else i + 1
        if (i >= 0 && j in l.indices) { val t = l[i]; l[i] = l[j]; l[j] = t }
        return l.mapIndexed { k, r -> r.copy(position = k) }
    }
}

/**
 * How a new bank alert is filled in (Phase 2 order): the person's rules, then payee memory (exact, then a
 * partial name), then the built-in merchant list, then a plain guess. Only a rule can book without asking.
 */
object MoneySorter {
    enum class Source { RULE, MEMORY, LIST, GUESS }

    data class Decision(
        val title: String, val category: String, val ledger: String, val confidence: Double,
        val autoBook: Boolean, val ruleId: String?, val source: Source,
    )

    /** A remembered key this long may stand for a longer name ("swiggy" for "Swiggy Instamart"). */
    private const val PART_MIN = 5

    fun decide(rules: List<MoneyRuleEntity>, exact: PayeeRuleEntity?, memory: List<PayeeRuleEntity>, p: SmartRules.Payment, hasReference: Boolean): Decision {
        val inbound = p.direction == "in"
        val title = exact?.label?.ifBlank { null } ?: p.name
        SmartRules.first(rules, p)?.let { r ->
            // "Always ask for this payee" wins over booking: the rule still fills it in, the person still looks.
            return Decision(title, r.category, r.ledger, 0.97, r.autoBook && exact?.alwaysAsk != true, r.id, Source.RULE)
        }
        if (exact != null && !exact.alwaysAsk) {
            return Decision(title, exact.category, exact.ledger, if (hasReference) 0.95 else 0.9, false, null, Source.MEMORY)
        }
        val listed = if (inbound) null else MerchantList.categoryOf(p.name, p.upiId)
        if (listed != null) return Decision(title, listed.category, Ledger.PERSONAL.name, if (hasReference) 0.85 else 0.8, false, null, Source.LIST)
        // A remembered place whose name starts this one ("kamalam" for "Kamalam Andheri") lends its category only:
        // weaker than an exact match, never its ledger or name, and only when the list knows nothing better.
        if (exact == null) partial(memory, p)?.takeIf { !it.alwaysAsk }?.let { m ->
            return Decision(title, m.category, Ledger.PERSONAL.name, 0.75, false, null, Source.MEMORY)
        }
        val guess = if (inbound) "Other income" else BankSms.guessCategory(p.name)
        return Decision(title, guess, Ledger.PERSONAL.name, if (hasReference) 0.8 else 0.6, false, null, Source.GUESS)
    }

    /** The longest remembered key that starts the payee's key ("swiggy" in "swiggyinstamart"), or the reverse. */
    fun partial(memory: List<PayeeRuleEntity>, p: SmartRules.Payment): PayeeRuleEntity? {
        val keys = listOfNotNull(BankSms.payeeKey(p.name), p.upiId?.substringBefore('@')?.let(BankSms::payeeKey)).filter { it.length >= PART_MIN }
        return memory.filter { m -> m.key.length >= PART_MIN && keys.any { k -> k.length > m.key.length && k.startsWith(m.key) } }
            .maxByOrNull { it.key.length }
    }
}
