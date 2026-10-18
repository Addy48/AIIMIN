package aiimin.core.data

import aiimin.core.data.money.MerchantMemory
import aiimin.core.database.CategoryEntity
import aiimin.core.database.PayeeRuleEntity
import com.google.common.truth.Truth.assertThat
import org.junit.Test

/** Owner's story (plan §3): "₹20 at Sanchy, a grocery store, a chocolate. Next time, only type what I bought." */
class MerchantMemoryTest {
    @Test fun `settling teaches the place, the category and what was bought`() {
        val r = MerchantMemory.learn(null, "sanchy", place = "Sanchy", category = "Grocery", ledger = "PERSONAL", note = "Chocolate", now = 1L)
        assertThat(r.label).isEqualTo("Sanchy")
        assertThat(r.category).isEqualTo("Grocery")
        assertThat(MerchantMemory.notes(r)).containsExactly("Chocolate")
        assertThat(r.hits).isEqualTo(1)
    }

    @Test fun `recent buys stay newest first, without repeats, five at most`() {
        var r: PayeeRuleEntity? = null
        listOf("Milk", "Chocolate", "milk", "Bread", "Eggs", "Curd", "Butter").forEach {
            r = MerchantMemory.learn(r, "sanchy", "Sanchy", "Grocery", "PERSONAL", it, 1L)
        }
        assertThat(MerchantMemory.notes(r!!)).containsExactly("Butter", "Curd", "Eggs", "Bread", "milk").inOrder()
    }

    @Test fun `a blank note keeps the old ones, and always-ask survives`() {
        val first = MerchantMemory.learn(null, "k", "Sanchy", "Grocery", "PERSONAL", "Chocolate", 1L).copy(alwaysAsk = true)
        val again = MerchantMemory.learn(first, "k", "Sanchy", "Food", "PERSONAL", "  ", 2L)
        assertThat(MerchantMemory.notes(again)).containsExactly("Chocolate")
        assertThat(again.alwaysAsk).isTrue()
        assertThat(again.category).isEqualTo("Food")
        assertThat(again.hits).isEqualTo(2)
    }

    @Test fun `the next alert from a known place arrives named and sorted`() {
        val rule = MerchantMemory.learn(null, "sanchy", "Sanchy", "Grocery", "PERSONAL", "Chocolate", 1L)
        val g = MerchantMemory.guess(rule, parsedName = "Sanchy Enterprises", hasReference = true, fallbackCategory = "Other")
        assertThat(g.title).isEqualTo("Sanchy")
        assertThat(g.category).isEqualTo("Grocery")
        assertThat(g.confidence).isAtLeast(0.95)
    }

    @Test fun `always ask keeps the name but never fills the category`() {
        val rule = MerchantMemory.learn(null, "amazon", "Amazon", "Shopping", "PERSONAL", "", 1L).copy(alwaysAsk = true)
        val g = MerchantMemory.guess(rule, "Amazon", hasReference = true, fallbackCategory = "Other")
        assertThat(g.title).isEqualTo("Amazon")
        assertThat(g.category).isEqualTo("Other")
        assertThat(g.confidence).isLessThan(0.95)
    }

    @Test fun `an unknown place uses the cleaned SMS name`() {
        val g = MerchantMemory.guess(null, "Myntra Designs", hasReference = false, fallbackCategory = "Shopping")
        assertThat(g.title).isEqualTo("Myntra Designs")
        assertThat(g.category).isEqualTo("Shopping")
        assertThat(g.confidence).isEqualTo(0.6)
    }

    @Test fun `custom categories join the list, most used first, archived hidden`() {
        val custom = listOf(CategoryEntity("c1", "Pet", "Paw", "out", false, 1L), CategoryEntity("c2", "Old", "Tag", "out", true, 1L))
        val list = MerchantMemory.categories(listOf("Food", "Grocery", "Other"), custom, used = mapOf("Grocery" to 9, "Pet" to 4, "Food" to 1))
        assertThat(list).containsExactly("Grocery", "Pet", "Food", "Other").inOrder()
    }

    @Test fun `a new category name is tidy and never duplicates`() {
        assertThat(MerchantMemory.newCategoryName("  pet  care ", listOf("Food", "Pet care"))).isNull()
        assertThat(MerchantMemory.newCategoryName("  pet ", listOf("Food"))).isEqualTo("Pet")
        assertThat(MerchantMemory.newCategoryName(" ", listOf("Food"))).isNull()
    }
}
