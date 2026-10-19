package aiimin.core.data

import aiimin.core.data.money.Cadence
import aiimin.core.data.money.RecurringDetector
import aiimin.core.data.money.SplitShare
import aiimin.core.data.money.Splits
import aiimin.core.database.TxnEntity
import com.google.common.truth.Truth.assertThat
import org.junit.Test

class MoneyLogicTest {
    private fun t(day: String, title: String, paise: Long, splits: String = "[]") =
        TxnEntity(id = day + title + paise, at = 0, day = day, amountPaise = paise, direction = "out", title = title, category = "Subs", splits = splits, createdAt = 0)

    @Test fun `three monthly payments of a similar amount are a monthly bill`() {
        val g = RecurringDetector.detect(listOf(t("2026-08-09", "Netflix", 64900), t("2026-09-09", "Netflix", 64900), t("2026-10-09", "Netflix", 64900)))
        assertThat(g).hasSize(1)
        assertThat(g.first().cadence).isEqualTo(Cadence.MONTHLY)
        assertThat(RecurringDetector.nextAfter(g.first().lastDay, g.first().cadence).toString()).isEqualTo("2026-11-09")
    }

    @Test fun `two payments are not enough, and daily shop visits are never monthly`() {
        assertThat(RecurringDetector.detect(listOf(t("2026-09-09", "Netflix", 64900), t("2026-10-09", "Netflix", 64900)))).isEmpty()
        val chai = (1..20).map { t("2026-10-%02d".format(it), "Sharma Tea", 3000) }
        assertThat(RecurringDetector.detect(chai)).isEmpty()
    }

    @Test fun `a one-off of a different amount does not break the rhythm`() {
        val list = listOf(t("2026-08-06", "Airtel", 59900), t("2026-08-20", "Airtel", 19900), t("2026-09-06", "Airtel", 59900), t("2026-10-06", "Airtel", 59900))
        assertThat(RecurringDetector.detect(list).map { it.amountPaise }).containsExactly(59900L)
    }

    @Test fun `balances net per person over unsettled shares`() {
        val owes = Splits.encode(listOf(SplitShare("riya", 63000, name = "Riya")))
        val iOwe = Splits.encode(listOf(SplitShare("riya", 20000, owesMe = false, name = "Riya")))
        val settled = Splits.encode(listOf(SplitShare("riya", 99900, settled = true, name = "Riya")))
        val b = Splits.balances(listOf(t("2026-10-10", "Dinner", 126000, owes), t("2026-10-11", "Movie", 20000, iOwe), t("2026-10-01", "Old", 199800, settled)))
        assertThat(b).hasSize(1)
        assertThat(b.first().netPaise).isEqualTo(43000)
        assertThat(b.first().theyOwe).isTrue()
    }

    @Test fun `equal split leaves the rounding paise with the payer`() {
        val s = Splits.equal(1000, listOf("a" to "A", "b" to "B"))
        assertThat(s.map { it.paise }).containsExactly(333L, 333L)
    }

    @Test fun `UPI pay link follows the NPCI shape`() {
        assertThat(Splits.upiPayUri("priya@okhdfc", "Priya S", 30050))
            .isEqualTo("upi://pay?pa=priya%40okhdfc&pn=Priya%20S&am=300.50&cu=INR&tn=AIIMIN%20settle")
    }
}
