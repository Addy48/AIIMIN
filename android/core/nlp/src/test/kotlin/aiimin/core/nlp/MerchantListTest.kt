package aiimin.core.nlp

import com.google.common.truth.Truth.assertThat
import org.junit.Test

/** Part 5 Phase 2: the built-in merchant list sorts payments on the phone, with no AI and no network. */
class MerchantListTest {
    private val spend = setOf("Food", "Grocery", "Transport", "Bills", "Rent", "Subs", "Shopping", "Health", "Family", "Education", "Travel", "Fun", "Gifts")

    @Test fun `the longest name wins, so Instamart is groceries and Swiggy is food`() {
        assertThat(MerchantList.categoryOf("Swiggy")?.category).isEqualTo("Food")
        assertThat(MerchantList.categoryOf("Swiggy Instamart")?.category).isEqualTo("Grocery")
        assertThat(MerchantList.categoryOf("SWIGGYINSTAMART")?.category).isEqualTo("Grocery")
    }

    @Test fun `a longer brand beats a short word inside it`() {
        assertThat(MerchantList.categoryOf("Metropolis Healthcare")?.category).isEqualTo("Health")
        assertThat(MerchantList.categoryOf("Metro Shoes")?.category).isEqualTo("Shopping")
        assertThat(MerchantList.categoryOf("Delhi Metro Rail Corporation")?.category).isEqualTo("Transport")
    }

    @Test fun `a brand beats a shop word, however long the shop word is`() {
        assertThat(MerchantList.categoryOf("KFC online order")?.category).isEqualTo("Food")
        assertThat(MerchantList.categoryOf("Manipal University")?.category).isEqualTo("Education")
        assertThat(MerchantList.categoryOf("Sharma Medical Store")?.category).isEqualTo("Health")
    }

    @Test fun `short names match whole words only`() {
        assertThat(MerchantList.categoryOf("Coca Cola Bottlers")?.category).isNotEqualTo("Transport")
        assertThat(MerchantList.categoryOf("Ola")?.category).isEqualTo("Transport")
        assertThat(MerchantList.categoryOf("Rahul Sharma")).isNull()
        assertThat(MerchantList.categoryOf("UPI ••4471")).isNull()
    }

    @Test fun `the UPI handle helps when the name is a number`() {
        assertThat(MerchantList.categoryOf("UPI ••4471", upiId = "bookmyshow.razorpay@icici")?.category).isEqualTo("Fun")
    }

    @Test fun `every entry files into a built-in spending category and names one merchant once`() {
        val entries = MerchantList.entries
        assertThat(entries.size).isAtLeast(1500)
        assertThat(entries.map { it.category }.toSet()).isEqualTo(entries.map { it.category }.toSet().intersect(spend))
        val clashes = entries.groupBy { it.key }.filter { (_, v) -> v.map { it.category }.toSet().size > 1 }.keys
        assertThat(clashes).isEmpty()
    }

    @Test fun `95 percent of the seeded sample of 200 merchant strings is sorted correctly`() {
        val rows = javaClass.getResource("/merchant_sample_200.tsv")!!.readText().lines()
            .filter { it.isNotBlank() && !it.startsWith("#") }
            .map { it.split('\t').let { p -> p[0] to p[1] } }
        assertThat(rows).hasSize(200)
        val wrong = rows.filter { (name, want) -> MerchantList.categoryOf(name)?.category != want }
        val rate = (rows.size - wrong.size) * 100.0 / rows.size
        println("merchant sample: ${rows.size - wrong.size}/${rows.size} = $rate%; wrong: $wrong")
        assertThat(wrong.map { "${it.first} → ${MerchantList.categoryOf(it.first)?.category} (want ${it.second})" }.takeIf { rate < 95.0 }.orEmpty()).isEmpty()
        assertThat(rate).isAtLeast(95.0)
    }
}
