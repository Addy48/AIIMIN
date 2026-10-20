package aiimin.core.data

import aiimin.core.data.money.payeeLabel
import aiimin.core.data.app.daySettledText

import org.junit.Test
import kotlin.test.assertEquals

/** D-043: a bare phone number as the payee reads like an error. */
class PayeeLabelTest {
    @Test fun ten_digit_number_becomes_a_masked_phone() = assertEquals("Phone ••6766", payeeLabel("9215676766"))

    @Test fun with_country_code_too() = assertEquals("Phone ••6766", payeeLabel("+91 92156 76766"))

    @Test fun upi_handle_of_a_number_too() = assertEquals("Phone ••6766", payeeLabel("9215676766@ybl"))

    @Test fun names_are_kept() = assertEquals("Blinkit", payeeLabel("Blinkit"))

    @Test fun a_name_with_digits_is_kept() = assertEquals("Shop 24", payeeLabel("Shop 24"))

    @Test fun blank_stays_blank() = assertEquals("", payeeLabel(" "))

    @Test fun settled_day_reads_as_a_date() = assertEquals("Day settled: Sun 18 Oct", daySettledText("2026-10-18"))

    @Test fun settled_day_without_a_date() = assertEquals("Day settled", daySettledText(null))
}
