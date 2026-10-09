package aiimin.core.nlp

import com.google.common.truth.Truth.assertThat
import java.time.LocalDate
import kotlin.test.Test

/** Prototype harness T18–T22 (v2_80_tests.js), plus the logger cases they stand for. */
class NlpParityTest {

    private val today = LocalDate.of(2026, 10, 9)

    @Test
    fun `T18 AI refuses journal questions while journal scope is off`() {
        val d = Assistant.decide("what did I write in my journal", AiScope.DEFAULT, today)

        assertThat(d).isEqualTo(AiDecision.ScopeBlocked(AiModule.JOURNAL))
        val allowed = AiScope(AiScope.DEFAULT.allowed + AiModule.JOURNAL)
        assertThat(Assistant.decide("what did I write in my journal", allowed, today)).isEqualTo(AiDecision.Answer(AiModule.JOURNAL))
    }

    @Test
    fun `T19 paid 450 for lunch and 180 for uber becomes 2 expense proposals`() {
        val p = Assistant.proposalsFrom("paid 450 for lunch and 180 for uber", today)

        assertThat(p).hasSize(2)
        assertThat(p.all { it is Proposal.Expense }).isTrue()
        assertThat((p[0] as Proposal.Expense).amount).isEqualTo(450)
        assertThat((p[1] as Proposal.Expense).amount).isEqualTo(180)
        assertThat((p[0] as Proposal.Expense).category).isEqualTo("Food")
        assertThat((p[1] as Proposal.Expense).category).isEqualTo("Transport")
    }

    @Test
    fun `T20 capture - rupee 340 swiggy dinner is an expense, not income`() {
        val c = CaptureParser.parse("₹340 swiggy dinner")

        assertThat(c.type).isEqualTo(CaptureType.EXPENSE)
        assertThat(c.amount).isEqualTo(340)
    }

    @Test
    fun `T21 expiry extraction from document text`() {
        val f = DocumentFields.extract("Policy No: 3001/58234/77 Valid till: 17/12/2026")

        assertThat(f.expires).isEqualTo(LocalDate.of(2026, 12, 17))
        assertThat(f.number).contains("3001")
    }

    @Test
    fun `T22 bank SMS parsing`() {
        val p = BankSms.parse("Rs.450.00 debited from A/c XX8912 to VPA zomato@icici on 09-10-26 UPI Ref 4278192831")!!

        assertThat(p.amount).isEqualTo(450)
        assertThat(p.direction).isEqualTo(MoneyDirection.OUT)
        assertThat(p.name).isEqualTo("Zomato")
        assertThat(p.reference).isEqualTo("4278192831")
        assertThat(p.accountLast4).isEqualTo("8912")
        assertThat(p.upiId).isEqualTo("zomato@icici")
    }

    // ---- beyond the prototype harness: the voice-logger cases -----------------

    @Test
    fun `one spoken sentence becomes a task, an expense and a calendar block`() {
        val p = Assistant.proposalsFrom("add call the plumber, spent 1.2k on groceries and remind me to pay rent tomorrow at 6pm", today)

        assertThat(p.map { it::class.simpleName }).containsExactly("Task", "Expense", "CalendarBlock").inOrder()
        assertThat((p[1] as Proposal.Expense).amount).isEqualTo(1200)
        val block = p[2] as Proposal.CalendarBlock
        assertThat(block.date).isEqualTo(today.plusDays(1))
        assertThat(block.time24).isEqualTo("18:00")
    }

    @Test
    fun `a motor policy is filed as insurance, not identity`() {
        assertThat(DocumentFields.guessCategory("car-insurance", "Motor Insurance Policy Vehicle: DL-3C-AB-1234")).isEqualTo("Insurance")
        assertThat(DocumentFields.guessCategory("scan", "Republic of India Passport No S1234567")).isEqualTo("Identity")
    }

    @Test
    fun `a bare amount after an expense is another expense`() {
        val p = Assistant.proposalsFrom("Spent 250 on lunch and 120 on auto", today)
        assertThat(p).hasSize(2)
        assertThat((p[1] as Proposal.Expense).amount).isEqualTo(120)
        assertThat((p[1] as Proposal.Expense).category).isEqualTo("Transport")
    }

    @Test
    fun `times and mood scores never become money`() {
        assertThat(CaptureParser.parse("standup at 17:30").amount).isEqualTo(0)
        val mood = CaptureParser.parse("feeling 7/10 today")
        assertThat(mood.type).isEqualTo(CaptureType.JOURNAL)
        assertThat(mood.mood).isEqualTo(7)
        assertThat(CaptureParser.parse("₹500 refund received").type).isEqualTo(CaptureType.INCOME)
        assertThat(CaptureParser.parse("got 2 lakh salary").amount).isEqualTo(200_000)
    }

    @Test
    fun `the assistant never proposes journal writes and checks money scope`() {
        assertThat(Assistant.proposalsFrom("log mood 6/10", today)).isEmpty()

        val noMoney = AiScope(AiScope.DEFAULT.allowed - AiModule.MONEY)
        assertThat(Assistant.decide("paid 200 for chai", noMoney, today)).isEqualTo(AiDecision.ScopeBlocked(AiModule.MONEY))
    }

    @Test
    fun `aadhaar is masked and month-year expiry resolves to the month end`() {
        assertThat(DocumentFields.extract("Aadhaar 1234 5678 9012").number).isEqualTo("XXXX XXXX 9012")
        assertThat(DocumentFields.extract("Expiry: Mar 2027").expires).isEqualTo(LocalDate.of(2027, 3, 31))
        assertThat(DocumentFields.parseAnyDate("31/02/2026")).isNull()
    }
}
