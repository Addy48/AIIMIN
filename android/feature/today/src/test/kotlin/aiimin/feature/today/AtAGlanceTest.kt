package aiimin.feature.today

import aiimin.designsystem.nav.Route
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import java.time.LocalDate

class AtAGlanceTest {

    private val today = LocalDate.of(2026, 10, 18)

    private fun lines(
        spent: Long = 0, toReview: Int = 0,
        doc: GlanceDoc? = null, journalToday: Boolean = false,
    ) = atAGlance(today, spent, toReview, doc, journalToday)

    private fun money(l: List<GlanceLine>) = l.firstOrNull { it.area == GlanceArea.MONEY }
    private fun vault(l: List<GlanceLine>) = l.firstOrNull { it.area == GlanceArea.VAULT }
    private fun journal(l: List<GlanceLine>) = l.first { it.area == GlanceArea.JOURNAL }

    @Test fun `money with payments to review opens the review inbox`() {
        val m = money(lines(spent = 54_000, toReview = 2))!!
        assertEquals("₹540 this month · 2 to review", m.text)
        assertEquals(Route.MoneyInbox, m.route)
    }

    @Test fun `money with nothing to review opens Money`() {
        val m = money(lines(spent = 54_000))!!
        assertEquals("₹540 spent this month", m.text)
        assertEquals(Route.Money, m.route)
    }

    @Test fun `only reviews waiting still shows money`() =
        assertEquals("1 payment to review", money(lines(toReview = 1))!!.text)

    @Test fun `money hides when there is nothing to say`() = assertEquals(null, money(lines()))

    @Test fun `vault says how many days until a document expires`() {
        val v = vault(lines(doc = GlanceDoc("d1", "Passport", today.plusDays(41))))!!
        assertEquals("Passport expires in 41 days", v.text)
        assertEquals(Route.Doc("d1"), v.route)
    }

    @Test fun `vault words today, tomorrow and past dates`() {
        assertEquals("Passport expires today", vault(lines(doc = GlanceDoc("d", "Passport", today)))!!.text)
        assertEquals("Passport expires tomorrow", vault(lines(doc = GlanceDoc("d", "Passport", today.plusDays(1))))!!.text)
        assertEquals("Passport has expired", vault(lines(doc = GlanceDoc("d", "Passport", today.minusDays(3))))!!.text)
    }

    @Test fun `vault hides when nothing expires`() = assertEquals(null, vault(lines()))

    @Test fun `journal not written yet opens a new entry`() {
        val j = journal(lines())
        assertEquals("Journal · not written today", j.text)
        assertEquals(Route.JournalWrite(), j.route)
    }

    @Test fun `journal written today opens the journal`() {
        val j = journal(lines(journalToday = true))
        assertEquals("Journal · written today", j.text)
        assertEquals(Route.Journal, j.route)
    }

    @Test fun `order is money, vault, journal`() {
        val l = lines(spent = 100, doc = GlanceDoc("d", "PUC", today.plusDays(5)))
        assertEquals(listOf(GlanceArea.MONEY, GlanceArea.VAULT, GlanceArea.JOURNAL), l.map { it.area })
        assertTrue(l.size == 3)
    }
}
