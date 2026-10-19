package aiimin.core.nlp

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class SmsSiftTest {
    private val pay = "Rs.760.00 debited from A/c XX4421 to VPA pvrcinemas@ybl PVR Phoenix on 13-10-26 UPI Ref 1188042"
    private val salary = "Rs 45,000.00 credited to A/c XX4421 by NEFT from ACME PVT LTD. Ref N12345678"
    private val card = "Rs.2,499.00 spent on HDFC Bank Card XX0918 at AMAZON on 2026-10-12. Ref 7766554433"
    private fun m(body: String, sender: String = "VM-HDFCBK-S", at: Long = 0) = SmsMessage(sender, body, at)

    // --- what kind of message is it ---

    @Test fun `real debits and credits are payments`() {
        assertThat(SmsSift.kind("VM-HDFCBK-S", pay)).isEqualTo(SmsKind.PAYMENT)
        assertThat(SmsSift.kind("VM-HDFCBK-S", salary)).isEqualTo(SmsKind.PAYMENT)
        assertThat(SmsSift.kind("AD-HDFCBK", card)).isEqualTo(SmsKind.PAYMENT)
    }

    @Test fun `an OTP is never a payment, even with an amount in it`() {
        val otp = "123456 is your OTP for txn of Rs 2,499.00 at AMAZON on HDFC Bank card XX0918. Do not share it with anyone."
        assertThat(SmsSift.kind("VM-HDFCBK-S", otp)).isEqualTo(SmsKind.OTP)
        assertThat(SmsSift.kind("VM-SBIOTP", "Your one time password for Rs 500 is 4421. Valid for 3 mins")).isEqualTo(SmsKind.OTP)
    }

    @Test fun `offers are skipped, by the promo sender tag or by their words`() {
        assertThat(SmsSift.kind("JM-HDFCBK-P", "Get instant loan up to Rs 5,00,000 at 10.5% p.a. Apply now")).isEqualTo(SmsKind.OFFER)
        assertThat(SmsSift.kind("VM-ICICIB", "Congratulations! You are eligible for a pre-approved credit card with limit of Rs.1,50,000. Click to apply")).isEqualTo(SmsKind.OFFER)
    }

    @Test fun `cashback that actually landed is a payment, not an offer`() {
        assertThat(SmsSift.kind("VM-HDFCBK-S", "Cashback of Rs 50 credited to your A/c XX4421 for UPI txn Ref 556677")).isEqualTo(SmsKind.PAYMENT)
    }

    @Test fun `a collect request asks for money, it is not a payment`() {
        val req = "Rs.500 requested by rahul@okaxis via UPI. Approve only if you know the sender. Collect request ref 112233"
        assertThat(SmsSift.kind("VM-HDFCBK-S", req)).isEqualTo(SmsKind.REQUEST)
    }

    @Test fun `failed payments are skipped but their refunds are kept`() {
        assertThat(SmsSift.kind("VM-HDFCBK-S", "Your UPI txn of Rs 340.00 to swiggy@ybl failed. Ref 99887766. Any amount debited will be refunded"))
            .isEqualTo(SmsKind.FAILED)
        assertThat(SmsSift.kind("VM-HDFCBK-S", "Refund of Rs 340.00 for your failed txn has been credited to A/c XX4421. Ref 99887766"))
            .isEqualTo(SmsKind.PAYMENT)
    }

    @Test fun `balance updates, statements and autopay notices move no money`() {
        assertThat(SmsSift.kind("VM-HDFCBK-S", "Avl Bal in A/c XX4421 is Rs 12,430.50 as on 13-Oct-26")).isEqualTo(SmsKind.BALANCE)
        assertThat(SmsSift.kind("VM-HDFCBK-S", "HDFC Bank Credit Card XX0918 statement: Total due Rs 8,430, Min due Rs 430. Due date 05-Nov"))
            .isEqualTo(SmsKind.REMINDER)
        assertThat(SmsSift.kind("VM-HDFCBK-S", "Rs 199 will be debited on 20-Oct for Netflix e-mandate on card XX0918")).isEqualTo(SmsKind.REMINDER)
    }

    @Test fun `messages without money are not payments`() {
        assertThat(SmsSift.kind("AX-AMAZON", "Your Amazon order has shipped and arrives Friday")).isEqualTo(SmsKind.NOT_MONEY)
    }

    // --- who sent it ---

    @Test fun `sender codes lose their operator prefix and type suffix`() {
        assertThat(SmsSift.senderCode("VM-HDFCBK-S")).isEqualTo("HDFCBK")
        assertThat(SmsSift.senderCode("AD-SBIUPI")).isEqualTo("SBIUPI")
        assertThat(SmsSift.senderCode("HDFCBK")).isEqualTo("HDFCBK")
        assertThat(SmsSift.senderCode("+919822104471")).isEmpty()
    }

    @Test fun `phones that drop the hyphen still name the bank`() {
        assertThat(SmsSift.senderCode("VMHDFCBK")).isEqualTo("HDFCBK")
        assertThat(SmsSift.bankOf("VMSBIUPI")).isEqualTo("SBI")
        assertThat(SmsSift.senderCode("AMAZON")).isEqualTo("AMAZON")
    }

    @Test fun `bank names are the ones people say`() {
        assertThat(SmsSift.bankOf("JD-ICICIT-T")).isEqualTo("ICICI Bank")
        assertThat(SmsSift.bankOf("AD-SBIUPI")).isEqualTo("SBI")
        assertThat(SmsSift.bankOf("VM-SBIINB")).isEqualTo("SBI")
        assertThat(SmsSift.bankOf("BZ-XYZBNK")).isEqualTo("XYZBNK")
        assertThat(SmsSift.bankOf("+919822104471")).isNull()
    }

    // --- the filter ---

    @Test fun `the default filter keeps every bank payment and skips the noise`() {
        val r = SmsSift.sift(
            listOf(m(pay), m(salary), m("123456 is your OTP for Rs 99. Do not share"), m("Avl Bal in A/c XX4421 is Rs 12,430.50")),
            SmsFilter(),
        )
        assertThat(r.kept.map { it.alert.amount }).containsExactly(760L, 45000L).inOrder()
        assertThat(r.skipped).containsExactly(SkipReason.OTP, 1, SkipReason.BALANCE, 1)
    }

    @Test fun `messages from people are skipped unless asked for`() {
        val fwd = m(pay, sender = "+919822104471")
        assertThat(SmsSift.sift(listOf(fwd), SmsFilter()).skipped).containsExactly(SkipReason.PERSON, 1)
        assertThat(SmsSift.sift(listOf(fwd), SmsFilter(banksOnly = false)).kept).hasSize(1)
    }

    @Test fun `bank, account, direction, amount and words each narrow the list`() {
        val all = listOf(m(pay), m(salary), m(card, sender = "AD-HDFCBK"), m(pay.replace("760.00", "40.00").replace("1188042", "1188043"), sender = "VM-SBIUPI"))
        fun kept(f: SmsFilter) = SmsSift.sift(all, f).kept.map { it.alert.amount }
        assertThat(kept(SmsFilter(banks = setOf("SBI")))).containsExactly(40L)
        assertThat(kept(SmsFilter(accounts = setOf("0918")))).containsExactly(2499L)
        assertThat(kept(SmsFilter(direction = SmsDirection.IN))).containsExactly(45000L)
        assertThat(kept(SmsFilter(direction = SmsDirection.OUT))).containsExactly(760L, 2499L, 40L).inOrder()
        assertThat(kept(SmsFilter(minRupees = 100))).containsExactly(760L, 45000L, 2499L).inOrder()
        assertThat(kept(SmsFilter(skipWords = listOf("amazon", " ")))).containsExactly(760L, 45000L, 40L).inOrder()
    }

    @Test fun `the same alert twice counts once`() {
        val r = SmsSift.sift(listOf(m(salary, sender = "JD-HDFCBK-S"), m(salary, sender = "HDFCBK"), m(pay), m(pay)), SmsFilter())
        assertThat(r.kept.map { it.alert.amount }).containsExactly(45000L, 760L).inOrder()
        assertThat(r.skipped).containsExactly(SkipReason.REPEAT, 2)
    }

    @Test fun `filtered-out reasons are counted so the person sees why`() {
        val r = SmsSift.sift(listOf(m(pay), m(salary)), SmsFilter(direction = SmsDirection.OUT))
        assertThat(r.skipped).containsExactly(SkipReason.DIRECTION, 1)
    }

    @Test fun `banks and accounts seen are listed even when filtered out, for the chips`() {
        val r = SmsSift.sift(listOf(m(pay), m(card, sender = "AD-HDFCBK"), m(pay.replace("1188042", "2"), sender = "VM-SBIUPI")), SmsFilter(banks = setOf("SBI")))
        assertThat(r.banks).containsExactly("HDFC Bank", 2, "SBI", 1)
        assertThat(r.accounts).containsExactly("4421", 2, "0918", 1)
    }

    @Test fun `the skipped line names the biggest reasons in plain words`() {
        assertThat(SmsSift.skippedLine(mapOf(SkipReason.OTP to 18, SkipReason.OFFER to 9, SkipReason.BALANCE to 4, SkipReason.REQUEST to 1)))
            .isEqualTo("32 skipped: 18 OTPs, 9 offers, 4 balance updates and 1 more")
        assertThat(SmsSift.skippedLine(mapOf(SkipReason.REQUEST to 1))).isEqualTo("1 skipped: 1 payment request")
        assertThat(SmsSift.skippedLine(emptyMap())).isEmpty()
    }

    @Test fun `the filter summary reads like a sentence`() {
        assertThat(SmsFilter().summary()).isEqualTo("Every bank · Money in and out · Any amount")
        assertThat(SmsFilter(banks = setOf("SBI", "HDFC Bank"), direction = SmsDirection.OUT, minRupees = 100, skipWords = listOf("wallet")).summary())
            .isEqualTo("HDFC Bank, SBI · Money out · ₹100 and up · Skips 1 word")
        assertThat(SmsFilter(accounts = setOf("0918")).summary()).isEqualTo("Every bank · ••0918 · Money in and out · Any amount")
    }

    @Test fun `a filter survives being saved and read back`() {
        val f = SmsFilter(setOf("SBI", "HDFC Bank"), setOf("0918"), SmsDirection.IN, 500, listOf("wallet", "mandate"), banksOnly = false)
        assertThat(SmsFilter.decode(f.encode())).isEqualTo(f)
        assertThat(SmsFilter.decode(null)).isEqualTo(SmsFilter())
        assertThat(SmsFilter.decode("garbage")).isEqualTo(SmsFilter())
    }
}
