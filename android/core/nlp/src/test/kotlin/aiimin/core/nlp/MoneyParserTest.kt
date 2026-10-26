package aiimin.core.nlp

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class MoneyParserTest {
    private fun paise(s: String) = first(s).paise
    private fun cur(s: String) = first(s).currency

    // ---- P0-1: the 1000x inflation (k/cr read right after a number with no word boundary)
    @Test fun `ka after a number is a word not a thousand`() {
        assertThat(paise("240 ka lunch kiya")).isEqualTo(24_000L)
        assertThat(paise("500 ka petrol dalwaya")).isEqualTo(50_000L)
    }
    @Test fun `kharch after a number is a word not a thousand`() {
        assertThat(paise("chai pe 20 kharch")).isEqualTo(2_000L)
        assertThat(paise("20 kharch chai pe")).isEqualTo(2_000L)
    }
    @Test fun `cr and k still work when they stand alone`() {
        assertThat(paise("paid 1 crore for flat")).isEqualTo(1_000_000_000L)
        assertThat(paise("paid 2 cr for flat")).isEqualTo(2_000_000_000L)
        assertThat(paise("paid 5k to plumber")).isEqualTo(500_000L)
        assertThat(paise("paid 5 k to plumber")).isEqualTo(500_000L)
    }

    // ---- P0-1: paise are never rounded away
    @Test fun `decimals keep paise`() {
        assertThat(paise("paid 19.50 for chai")).isEqualTo(1_950L)
        assertThat(paise("spent 250.75 on medicines")).isEqualTo(25_075L)
        assertThat(paise("auto 99.99")).isEqualTo(9_999L)
        assertThat(paise("paid 0.75 for sample")).isEqualTo(75L)
    }

    // ---- P0-1: Indian and Western grouping
    @Test fun `Indian grouping is one number`() {
        assertThat(paise("paid 1,20,000 for tuition")).isEqualTo(12_000_000L)
        assertThat(paise("spent 1,00,000 on trip")).isEqualTo(10_000_000L)
        assertThat(paise("bijli ka bill 2,350 bhara")).isEqualTo(235_000L)
    }
    @Test fun `Western grouping and decimals together`() {
        assertThat(paise("dinner for 1,250.50")).isEqualTo(125_050L)
    }
    @Test fun `abbreviations`() {
        assertThat(paise("spent 1.5k on groceries")).isEqualTo(150_000L)
        assertThat(paise("spent 2 lakh on car")).isEqualTo(20_000_000L)
        assertThat(paise("spent 2.5 lakh on wedding")).isEqualTo(25_000_000L)
        assertThat(paise("lunch 0.5k")).isEqualTo(50_000L)
        assertThat(paise("bought shoes 3999/-")).isEqualTo(399_900L)
    }

    // ---- number words
    @Test fun `number words in English and Hinglish`() {
        assertThat(paise("spent two hundred on snacks")).isEqualTo(20_000L)
        assertThat(paise("paid five hundred for auto")).isEqualTo(50_000L)
        assertThat(paise("spent two thousand five hundred on shoes")).isEqualTo(250_000L)
        assertThat(paise("do sau rupaye ka chai")).isEqualTo(20_000L)
        assertThat(paise("dedh sau ka khana")).isEqualTo(15_000L)
        assertThat(paise("hazaar rupaye ka grocery")).isEqualTo(100_000L)
    }

    // ---- quantity vs price
    @Test fun `a count next to a price is not the price`() {
        assertThat(paise("bought 3 books 900")).isEqualTo(90_000L)
        assertThat(paise("buy 2kg rice 120")).isEqualTo(12_000L)
        assertThat(paise("two coffees 160")).isEqualTo(16_000L)
        assertThat(paise("split rent 24000 with 3 people")).isEqualTo(2_400_000L)
        assertThat(paise("wifi 799 for 3 months")).isEqualTo(79_900L)
    }
    @Test fun `my share wins`() {
        assertThat(paise("Riya paid 900 for lunch, my share 450")).isEqualTo(45_000L)
    }

    // ---- refuse what is not certain
    @Test fun `unsure amounts are not saved`() {
        for (s in listOf("paid 50 + 30 + 20 for snacks", "spent -50 on chai", "paid 1e3 for auto", "lunch 24O", "30 40", "5000 ya 6000 shayad", "maybe 500 on shopping")) {
            val it = first(s)
            assertThat(it.kind).isEqualTo(Kind.CHOOSE)
            assertThat(it.paise).isNull()
        }
    }
    @Test fun `times and dates are never money`() {
        assertThat(first("standup at 17:30").paise).isNull()
        assertThat(first("call Ravi at 5").paise).isNull()
        assertThat(first("kal 5 baje Ravi ko call karna").paise).isNull()
        assertThat(first("passport expires 3 March 2029").paise).isNull()
        assertThat(first("note: dentist number 98 followed by X").paise).isNull()
    }

    // ---- P0-5: currency
    @Test fun `currency words and symbols are kept`() {
        assertThat(cur("usd 12.50 coffee at starbucks")).isEqualTo("USD")
        assertThat(paise("usd 12.50 coffee at starbucks")).isEqualTo(1_250L)
        assertThat(cur("paid 45 pounds for train to London")).isEqualTo("GBP")
        assertThat(cur("30 euros groceries at lidl")).isEqualTo("EUR")
        assertThat(cur("aud 20 uber to the airport")).isEqualTo("AUD")
        assertThat(cur("spent 8 dollars on lunch")).isEqualTo("USD")
        assertThat(cur("paid 300 aed for taxi")).isEqualTo("AED")
        assertThat(cur("\$12.50 coffee")).isEqualTo("USD")
        assertThat(cur("£45 train ticket")).isEqualTo("GBP")
        assertThat(cur("€30 groceries")).isEqualTo("EUR")
        assertThat(cur("₹250 chai")).isEqualTo("INR")
        assertThat(cur("spent Rs 240 on lunch")).isEqualTo("INR")
    }
    @Test fun `default currency applies when none is written`() {
        val a = CaptureEngine.analyze("lunch 240", TEST_NOW, defaultCurrency = "USD")
        assertThat(a.items.first().currency).isEqualTo("USD")
    }
}
