package aiimin.core.data

import aiimin.core.network.HabitDto
import aiimin.core.network.MoneyBudgetDto
import aiimin.core.network.MoneyTransactionDto
import com.google.common.truth.Truth.assertThat
import org.junit.Test

class LiveHydrateTest {

    @Test
    fun `empty habits clear seed pursuits and keep captures`() {
        val day = DayStore()
        day.recordCapture("paid 100 coffee", "10:00", 100)
        assertThat(day.state.value.pursuits).isNotEmpty()
        day.hydrateFromBootstrap(habits = emptyList(), completedToday = emptySet(), userName = "A")
        val s = day.state.value
        assertThat(s.pursuits).isEmpty()
        assertThat(s.isLive).isTrue()
        assertThat(s.isSeed).isFalse()
        assertThat(s.captures).hasSize(1)
        assertThat(s.captures.first().amount).isEqualTo(100)
    }

    @Test
    fun `money hydrate clears seed net worth and week bars`() {
        val money = MoneyStore()
        assertThat(money.state.value.netWorth).isNotNull()
        money.hydrateFromApi(
            transactions = listOf(
                MoneyTransactionDto(
                    id = "1",
                    amount = -240.0,
                    type = "expense",
                    category = "FOOD",
                    description = "Metro",
                    date = "2026-08-05",
                ),
            ),
            budgets = listOf(
                MoneyBudgetDto(
                    id = "b1",
                    categoryName = "FOOD",
                    amount = 9000.0,
                ),
            ),
        )
        val s = money.state.value
        assertThat(s.isSeed).isFalse()
        assertThat(s.netWorth).isNull()
        assertThat(s.weekBars).isEmpty()
        assertThat(s.upcoming).isEmpty()
        assertThat(s.ledger).hasSize(1)
        assertThat(s.ledger.first().amount).isEqualTo(-240)
        assertThat(s.budgets.first().name).isEqualTo("FOOD")
    }

    @Test
    fun `hydrate keeps local tick when server completedToday lags`() {
        val day = DayStore()
        day.hydrateFromBootstrap(
            habits = listOf(
                HabitDto(id = "h1", name = "Meditate"),
            ),
            completedToday = emptySet(),
            userName = "A",
        )
        val id = day.state.value.pursuits.first().commitment.id
        day.setProgress(id, 1.0)
        assertThat(day.state.value.pursuits.first().observation.value).isEqualTo(1.0)

        // Bootstrap again without server acknowledging the tick yet.
        day.hydrateFromBootstrap(
            habits = listOf(
                HabitDto(id = "h1", name = "Meditate"),
            ),
            completedToday = emptySet(),
            userName = "A",
        )
        assertThat(day.state.value.pursuits.first().observation.value).isEqualTo(1.0)
    }

    @Test
    fun `pending habit overlay merges ticks and unticks`() {
        val overlay = aiimin.core.data.sync.GraphSyncRepository.PendingHabitOverlay(
            ticks = setOf("a", "b"),
            unticks = setOf("b", "c"),
        )
        val merged = overlay.apply(setOf("c", "d"))
        assertThat(merged).containsExactly("a", "d")
    }
}
