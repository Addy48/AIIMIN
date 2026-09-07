package aiimin.core.data.money

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class PaymentAlertParserTest {

    @Test
    fun parses_hdfc_style_debit() {
        val p = PaymentAlertParser.parse(
            "HDFC Bank: Rs.1,240.00 debited from A/c XX1234 on 05-08-26 to VPA swiggy@ybl. Not you? Call 1800.",
        )
        requireNotNull(p)
        assertThat(p.amountInr).isEqualTo(1240)
        assertThat(p.direction).isEqualTo(PaymentAlertParser.Direction.DEBIT)
        assertThat(p.channel).isEqualTo("UPI")
        assertThat(p.preview).doesNotContain("180011")
    }

    @Test
    fun parses_credit() {
        val p = PaymentAlertParser.parse(
            "Rs.18000 credited to your Fi a/c XX8899 from ZOHO NEFT. Avl bal Rs.42,000.",
        )
        requireNotNull(p)
        assertThat(p.amountInr).isEqualTo(18000)
        assertThat(p.direction).isEqualTo(PaymentAlertParser.Direction.CREDIT)
    }

    @Test
    fun parses_sbi_upi() {
        val p = PaymentAlertParser.parse(
            "SBI: INR 350.00 debited from A/c XX4521 via UPI to merchant@okicici on 05-08-26.",
        )
        requireNotNull(p)
        assertThat(p.amountInr).isEqualTo(350)
        assertThat(p.direction).isEqualTo(PaymentAlertParser.Direction.DEBIT)
        assertThat(p.channel).isEqualTo("UPI")
    }

    @Test
    fun parses_gpay_style_rupee() {
        val p = PaymentAlertParser.parse(
            "You paid ₹89.00 to Blinkit using Google Pay UPI. UPI Ref 123456789012.",
        )
        requireNotNull(p)
        assertThat(p.amountInr).isEqualTo(89)
        assertThat(p.direction).isEqualTo(PaymentAlertParser.Direction.DEBIT)
    }

    @Test
    fun parses_phonepe_received() {
        val p = PaymentAlertParser.parse(
            "Received Rs.2,500.00 in your PhonePe wallet from RAMESH via UPI.",
        )
        requireNotNull(p)
        assertThat(p.amountInr).isEqualTo(2500)
        assertThat(p.direction).isEqualTo(PaymentAlertParser.Direction.CREDIT)
    }

    @Test
    fun rejects_otp_only() {
        assertThat(
            PaymentAlertParser.parse("Your OTP is 482913 for login. Do not share."),
        ).isNull()
    }

    @Test
    fun rejects_too_short() {
        assertThat(PaymentAlertParser.parse("hi")).isNull()
    }

    @Test
    fun parses_amount_debited_label() {
        val p = PaymentAlertParser.parse(
            "ICICI Bank: Amount Debited: INR 1,250.00 A/c XX7788 on 05-08-26. UPI to zomato@paytm.",
        )
        requireNotNull(p)
        assertThat(p.amountInr).isEqualTo(1250)
        assertThat(p.direction).isEqualTo(PaymentAlertParser.Direction.DEBIT)
        assertThat(p.channel).isEqualTo("UPI")
    }

    @Test
    fun parses_txn_of_rs() {
        val p = PaymentAlertParser.parse(
            "Txn of Rs.499.00 debited from your Axis A/c XX9911 towards NETFLIX. Not you? Call bank.",
        )
        requireNotNull(p)
        assertThat(p.amountInr).isEqualTo(499)
        assertThat(p.direction).isEqualTo(PaymentAlertParser.Direction.DEBIT)
    }

    @Test
    fun parses_embedded_date_dash() {
        val p = PaymentAlertParser.parse(
            "HDFC Bank: Rs.1,240.00 debited from A/c XX1234 on 05-08-26 to VPA swiggy@ybl.",
        )
        requireNotNull(p)
        assertThat(p.dateIso).isEqualTo("2026-08-05")
    }

    @Test
    fun parses_embedded_date_named_month() {
        val p = PaymentAlertParser.parse(
            "You paid ₹89.00 to Blinkit using Google Pay UPI on 5 Aug 2026. UPI Ref 123456789012.",
        )
        requireNotNull(p)
        assertThat(p.dateIso).isEqualTo("2026-08-05")
        assertThat(p.amountInr).isEqualTo(89)
    }
}
