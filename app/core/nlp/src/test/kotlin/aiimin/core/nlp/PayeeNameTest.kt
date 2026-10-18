package aiimin.core.nlp

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class PayeeNameTest {
    @Test fun `the bank's own label wins over the UPI handle`() {
        assertThat(BankSms.parse("Rs.760.00 debited from A/c XX4421 to VPA pvrcinemas@ybl PVR Phoenix on 2026-10-13 UPI Ref 1188042")!!.name).isEqualTo("PVR Phoenix")
        assertThat(BankSms.parse("Rs.380.00 debited from A/c XX4421 to VPA 9822104471@ybl Sharma Kirana on 2026-10-13 UPI Ref 5530918")!!.name).isEqualTo("Sharma Kirana")
    }

    @Test fun `known handles get their real names, numbers become a short label`() {
        assertThat(BankSms.payeeName("swiggy8@ybl")).isEqualTo("Swiggy")
        assertThat(BankSms.payeeName("VPA olamoney@ybl")).isEqualTo("Ola")
        assertThat(BankSms.payeeName("pvrcinemas@ybl")).isEqualTo("PVR Cinemas")
        assertThat(BankSms.payeeName("9822104471@ybl")).isEqualTo("UPI ••4471")
        assertThat(BankSms.payeeName("rahul.sharma99@okaxis")).isEqualTo("Rahul Sharma")
    }

    @Test fun `plain merchant text is tidied, not mangled`() {
        assertThat(BankSms.payeeName("MYNTRA DESIGNS")).isEqualTo("Myntra Designs")
        assertThat(BankSms.payeeName("McDonald's")).isEqualTo("McDonald's")
    }

    @Test fun `bill payments lose consumer numbers and card tails (audit A-003)`() {
        assertThat(BankSms.parse("Bill pay Rs.1210 to MSEDCL Consumer 1700451120 card XX0918 Ref 3300194")!!.name).isEqualTo("MSEDCL Electricity")
        assertThat(BankSms.payeeName("BESCOM Consumer No 445566778")).isEqualTo("BESCOM Electricity")
        assertThat(BankSms.payeeName("Tata Power A/c 99887766")).isEqualTo("Tata Power")
    }

    @Test fun `money in names who sent it, not the bank`() {
        assertThat(BankSms.parse("Rs 45,000.00 credited to A/c XX4421 by NEFT from ACME PVT LTD. Ref N12345678")!!.name).isEqualTo("Acme Pvt Ltd")
        assertThat(BankSms.parse("Rs.500.00 credited to A/c XX4421 from VPA rahul.sharma99@okaxis on 12-10-26 UPI Ref 4455")!!.name).isEqualTo("Rahul Sharma")
        // "debited from A/c" is our own account, never the payee
        assertThat(BankSms.parse("Rs.760.00 debited from A/c XX4421 to VPA pvrcinemas@ybl PVR Phoenix on 13-10-26 UPI Ref 1188042")!!.name).isEqualTo("PVR Phoenix")
    }
}
