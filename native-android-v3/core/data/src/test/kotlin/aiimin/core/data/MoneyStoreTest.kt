package aiimin.core.data

import com.google.common.truth.Truth.assertThat
import org.junit.Test

/**
 * Money's invariants: empty is empty, seed is labelled, Capture and Money share
 * one ledger, and Overview figures are derived — never hard-coded next to rows.
 */
class MoneyStoreTest {

    private val store = MoneyStore()

    @Test
    fun `seed has money data and is labelled as seed`() {
        val money = store.state.value
        assertThat(money.isSeed).isTrue()
        assertThat(money.hasMoneyData).isTrue()
        assertThat(money.phase).isEqualTo(MoneyPhase.READY)
        assertThat(money.sheetMeta).isEqualTo("SEED")
        assertThat(money.safeToSpend).isNotNull()
        assertThat(money.spentMtd).isGreaterThan(0)
    }

    @Test
    fun `empty month never claims zero as an MTD result`() {
        store.clearToEmpty()
        val money = store.state.value
        assertThat(money.phase).isEqualTo(MoneyPhase.EMPTY)
        assertThat(money.hasMoneyData).isFalse()
        assertThat(money.safeToSpend).isNull()
        assertThat(money.netWorth).isNull()
        assertThat(money.receivable).isNull()
        assertThat(money.spentMtd).isEqualTo(0)
        assertThat(money.categories).isEmpty()
        assertThat(money.wowDeltaPct).isNull()
    }

    @Test
    fun `safe to spend is budget total minus spent`() {
        val money = store.state.value
        assertThat(money.safeToSpend).isEqualTo(money.budgetTotal - money.spentMtd)
    }

    @Test
    fun `category slices sum to spent expenses`() {
        val money = store.state.value
        val fromCats = money.categories.sumOf { it.amount }
        assertThat(fromCats).isEqualTo(money.spentMtd)
        assertThat(money.categories.first().fraction).isGreaterThan(0f)
    }

    @Test
    fun `week over week is negative when the last week spent less`() {
        val money = store.state.value
        val wow = money.wowDeltaPct
        assertThat(wow).isNotNull()
        assertThat(wow!!).isLessThan(0.0)
    }

    @Test
    fun `wow label uses a signed percent`() {
        val money = store.state.value
        val label = formatWowPct(money.wowDeltaPct!!)
        assertThat(label.endsWith("%")).isTrue()
        assertThat(label.contains("-") || label.contains("−")).isTrue()
    }

    @Test
    fun `recording an expense from Capture lands on the ledger`() {
        store.clearToEmpty()
        val id = store.recordExpense("Swiggy", 1_240, category = "FOOD", dateLabel = "04.08")
        val money = store.state.value
        assertThat(money.phase).isEqualTo(MoneyPhase.READY)
        assertThat(money.ledger).hasSize(1)
        assertThat(money.ledger.first().id).isEqualTo(id)
        assertThat(money.ledger.first().amount).isEqualTo(-1_240)
        assertThat(money.spentMtd).isEqualTo(1_240)
        assertThat(money.categories.single().name).isEqualTo("FOOD")
    }

    @Test
    fun `income is signed positive and does not inflate spent`() {
        store.clearToEmpty()
        store.recordIncome("Stipend", 18_000, dateLabel = "01.08")
        val money = store.state.value
        assertThat(money.incomeMtd).isEqualTo(18_000)
        assertThat(money.spentMtd).isEqualTo(0)
        assertThat(money.ledger.first().isIncome).isTrue()
    }

    @Test
    fun `undo removes the ledger row`() {
        store.clearToEmpty()
        val id = store.recordExpense("Metro", 60, category = "TRANSPORT", dateLabel = "04.08")
        store.removeEntry(id)
        assertThat(store.state.value.ledger).isEmpty()
        assertThat(store.state.value.phase).isEqualTo(MoneyPhase.EMPTY)
    }

    @Test
    fun `formatInr uses Indian grouping`() {
        assertThat(formatInr(342_180)).isEqualTo("₹3,42,180")
        assertThat(formatInr(1_240, signed = true)).isEqualTo("+₹1,240")
        assertThat(formatInr(-1_240, signed = true)).isEqualTo("−₹1,240")
        assertThat(formatInr(60)).isEqualTo("₹60")
    }

    @Test
    fun `offline phase keeps rows and says held locally`() {
        store.markOffline()
        assertThat(store.state.value.phase).isEqualTo(MoneyPhase.OFFLINE)
        assertThat(store.state.value.syncLabel).isEqualTo("HELD LOCALLY")
        assertThat(store.state.value.hasMoneyData).isTrue()
    }
}
