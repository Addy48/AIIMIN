package aiimin.core.data

import aiimin.core.data.money.MerchantMemory
import aiimin.core.data.money.MoneySorter
import aiimin.core.data.money.SmartRules
import aiimin.core.database.MoneyRuleEntity
import aiimin.core.database.PayeeRuleEntity
import com.google.common.truth.Truth.assertThat
import org.junit.Test

/** Part 5 Phase 2 "Done when", one test per line, all on the phone's own data (airplane mode is the same code path). */
class SmartRulesTest {
    private fun rule(
        id: String = "r1", position: Int = 0, contains: String = "", min: Long? = null, max: Long? = null, account: String? = null,
        note: String = "", direction: String = "out", category: String = "Food", ledger: String = "PERSONAL", enabled: Boolean = true, autoBook: Boolean = true,
    ) = MoneyRuleEntity(id, "rule $id", position, enabled, contains, min, max, account, note, direction, category, ledger, autoBook, 0, 1L, 1L)

    private fun pay(name: String, rupees: Long, upi: String? = null, account: String? = null, text: String = "", direction: String = "out") =
        SmartRules.Payment(name, upi, rupees * 100, account, text, direction)

    private val swiggyUnder500 = rule(contains = "swiggy", max = 500_00, category = "Food", ledger = "PERSONAL")

    @Test fun `swiggy under 500 files a 300 payment and leaves an 800 one untouched`() {
        assertThat(SmartRules.first(listOf(swiggyUnder500), pay("Swiggy", 300))?.category).isEqualTo("Food")
        assertThat(SmartRules.first(listOf(swiggyUnder500), pay("Swiggy", 800))).isNull()
        // "under" is strict, "from" includes its own amount
        assertThat(SmartRules.first(listOf(swiggyUnder500), pay("Swiggy", 500))).isNull()
        assertThat(SmartRules.first(listOf(rule(contains = "swiggy", min = 500_00)), pay("Swiggy", 500))).isNotNull()
    }

    @Test fun `Swiggy Instamart matches the Swiggy rule, also by its joined bank name and its UPI handle`() {
        assertThat(SmartRules.first(listOf(swiggyUnder500), pay("Swiggy Instamart", 120))).isNotNull()
        assertThat(SmartRules.first(listOf(swiggyUnder500), pay("SWIGGYINSTAMART", 120))).isNotNull()
        assertThat(SmartRules.first(listOf(swiggyUnder500), pay("UPI ••4471", 120, upi = "swiggy.instamart@icici"))).isNotNull()
    }

    @Test fun `rules run in order, switched-off ones are skipped, and a rule with no condition never matches`() {
        val a = rule("a", position = 0, contains = "swiggy", category = "Food", enabled = false)
        val b = rule("b", position = 1, contains = "swiggy", category = "Grocery")
        val c = rule("c", position = 2, contains = "swiggy", category = "Fun")
        assertThat(SmartRules.first(listOf(c, b, a), pay("Swiggy", 100))?.id).isEqualTo("b")
        assertThat(SmartRules.hasCondition(rule(direction = "any"))).isFalse()
        assertThat(SmartRules.first(listOf(rule(direction = "any")), pay("Anything", 100))).isNull()
    }

    @Test fun `account, note and direction conditions`() {
        val card = rule(account = "0918", category = "Bills")
        assertThat(SmartRules.first(listOf(card), pay("Amazon", 100, account = "0918"))).isNotNull()
        assertThat(SmartRules.first(listOf(card), pay("Amazon", 100, account = "4421"))).isNull()
        val rent = rule(note = "rent", category = "Rent")
        assertThat(SmartRules.first(listOf(rent), pay("Ravi Kumar", 18000, text = "Rs.18000 sent to Ravi. Remarks: October RENT"))).isNotNull()
        assertThat(SmartRules.first(listOf(rule(contains = "acme", direction = "in", category = "Salary")), pay("Acme Pvt Ltd", 50000, direction = "out"))).isNull()
        assertThat(SmartRules.first(listOf(rule(contains = "acme", direction = "any", category = "Salary")), pay("Acme Pvt Ltd", 50000, direction = "in"))).isNotNull()
    }

    @Test fun `a user rule beats payee memory and the built-in list for the same merchant`() {
        val memory = PayeeRuleEntity("swiggy", "Grocery", "PERSONAL", 1L, label = "Swiggy")
        val mine = rule(contains = "swiggy", category = "Fun", ledger = "HOUSEHOLD")
        val d = MoneySorter.decide(listOf(mine), memory, emptyList(), pay("Swiggy", 250), hasReference = true)
        assertThat(d.category).isEqualTo("Fun")
        assertThat(d.ledger).isEqualTo("HOUSEHOLD")
        assertThat(d.ruleId).isEqualTo("r1")
        assertThat(d.autoBook).isTrue()
        assertThat(d.source).isEqualTo(MoneySorter.Source.RULE)
    }

    @Test fun `without rules, payee memory comes first, then the built-in list, then Other`() {
        val memory = PayeeRuleEntity("sanchy", "Grocery", "PERSONAL", 1L, label = "Sanchy")
        assertThat(MoneySorter.decide(emptyList(), memory, emptyList(), pay("Sanchy", 20), true).let { it.category to it.title }).isEqualTo("Grocery" to "Sanchy")
        val list = MoneySorter.decide(emptyList(), null, emptyList(), pay("PVR Phoenix", 760), true)
        assertThat(list.category).isEqualTo("Fun")
        assertThat(list.source).isEqualTo(MoneySorter.Source.LIST)
        assertThat(list.autoBook).isFalse()
        assertThat(MoneySorter.decide(emptyList(), null, emptyList(), pay("Rahul Sharma", 500), true).category).isEqualTo("Other")
        assertThat(MoneySorter.decide(emptyList(), null, emptyList(), pay("Acme Pvt Ltd", 50000, direction = "in"), true).category).isEqualTo("Other income")
    }

    @Test fun `payee memory matches partial names`() {
        val swiggy = PayeeRuleEntity("swiggy", "Food", "PERSONAL", 1L, label = "Swiggy")
        val d = MoneySorter.decide(emptyList(), null, listOf(swiggy), pay("Swiggy Instamart", 120), true)
        assertThat(d.category).isEqualTo("Food")
        assertThat(d.source).isEqualTo(MoneySorter.Source.MEMORY)
        assertThat(d.title).isEqualTo("Swiggy Instamart")
        // too short to trust as a part
        val ola = PayeeRuleEntity("ola", "Transport", "PERSONAL", 1L, label = "Ola")
        assertThat(MoneySorter.decide(emptyList(), null, listOf(ola), pay("Olam Agro", 120), true).source).isNotEqualTo(MoneySorter.Source.MEMORY)
    }

    @Test fun `always ask keeps the name but never the category, even from a partial match`() {
        val amazon = PayeeRuleEntity("amazon", "Gifts", "PERSONAL", 1L, label = "Amazon", alwaysAsk = true)
        val d = MoneySorter.decide(emptyList(), amazon, emptyList(), pay("Amazon", 999), true)
        assertThat(d.title).isEqualTo("Amazon")
        assertThat(d.category).isEqualTo("Shopping")
    }

    @Test fun `three hand filings with one category offer the rule, once`() {
        var r: PayeeRuleEntity? = null
        repeat(2) { r = MerchantMemory.learn(r, "sanchy", "Sanchy", "Grocery", "PERSONAL", "Milk", 1L) }
        assertThat(MerchantMemory.offersRule(r!!, emptyList())).isFalse()
        r = MerchantMemory.learn(r, "sanchy", "Sanchy", "Grocery", "PERSONAL", null, 1L)
        assertThat(r!!.sameCount).isEqualTo(3)
        assertThat(MerchantMemory.offersRule(r!!, emptyList())).isTrue()
        // a change of category starts the count again
        assertThat(MerchantMemory.learn(r, "sanchy", "Sanchy", "Food", "PERSONAL", null, 1L).sameCount).isEqualTo(1)
        // "Not now" or an existing rule stops the offer
        assertThat(MerchantMemory.offersRule(r!!.copy(ruleOffer = 1), emptyList())).isFalse()
        assertThat(MerchantMemory.offersRule(r!!, listOf(rule(contains = "sanchy", category = "Grocery")))).isFalse()
    }

    @Test fun `accepting the offer makes a rule that files the payee by itself`() {
        val r = PayeeRuleEntity("sanchy", "Grocery", "PERSONAL", 1L, label = "Sanchy", sameCount = 3)
        val made = SmartRules.fromPayee(r, id = "n", position = 4, now = 9L)
        assertThat(made.contains).isEqualTo("sanchy")
        assertThat(made.category).isEqualTo("Grocery")
        assertThat(made.position).isEqualTo(4)
        assertThat(made.autoBook).isTrue()
        assertThat(SmartRules.first(listOf(made), pay("Sanchy Enterprises", 20))).isNotNull()
        assertThat(SmartRules.describe(made)).isEqualTo("Name has “sanchy” → Grocery · Personal")
        assertThat(SmartRules.describe(swiggyUnder500)).isEqualTo("Name has “swiggy” · under ₹500 → Food · Personal")
    }

    @Test fun `moving a rule up swaps it with the one above and renumbers`() {
        val l = listOf(rule("a", 0), rule("b", 1), rule("c", 2))
        assertThat(SmartRules.move(l, "c", up = true).map { it.id to it.position }).containsExactly("a" to 0, "c" to 1, "b" to 2).inOrder()
        assertThat(SmartRules.move(l, "a", up = true).map { it.id }).containsExactly("a", "b", "c").inOrder()
    }
}
