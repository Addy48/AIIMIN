package aiimin.core.data.plan

import com.google.common.truth.Truth.assertThat
import org.junit.Test

/** Owner decision A-036 (18 Oct): plans show everything planned, but unbuilt items are marked, never sold as included. */
class PlanComingTest {
    // Document versions, weekly backups and smart rules were built on 21 Oct (B6, B9) and left this list.
    private val unbuilt = listOf("Patterns", "PDF", "review drafts", "trusted people", "own phone")

    @Test fun `what a plan includes today never names an unbuilt feature`() {
        Plan.entries.forEach { p ->
            p.adds.forEach { line -> unbuilt.forEach { w -> assertThat(line).doesNotContain(w) } }
        }
    }

    @Test fun `a plan with unbuilt hero features lists them as coming`() {
        Plan.entries.filter { !it.complete }.forEach { p -> assertThat(p.coming).isNotEmpty() }
        assertThat(Plan.PRO.coming).containsAtLeast("Patterns: what goes with what", "Monthly review as a PDF", "Weekly review drafts")
        // Built in B6 and B9 (21 Oct): sold as included, never as coming.
        assertThat(Plan.PRO.coming).doesNotContain("Smart categorisation rules")
        assertThat(Plan.PLUS.coming).isEmpty()
    }

    @Test fun `the website lists the same plans at the same prices`() {
        // web/src/marketing/plans.js mirrors these; change both together.
        assertThat(Plan.entries.map { it.plannedMonthlyInr }).containsExactly(0, 49, 99, 179).inOrder()
        assertThat(Plan.entries.map { it.plannedYearlyInr }).containsExactly(0, 449, 899, 1599).inOrder()
    }
}
