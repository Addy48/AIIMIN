package aiimin.feature.capture.parse

import com.google.common.truth.Truth.assertThat
import org.junit.Test

/**
 * The parser is the trust surface's foundation, so its rules are pinned here.
 *
 * The contract these tests defend: a confident reading is included, a guess is
 * offered switched off, and no reading is ever invented.
 */
class CaptureParserTest {

    private val parser = CaptureParser()

    private fun ParsedCapture.value(field: CaptureField) = chip(field)?.value
    private fun ParsedCapture.included(field: CaptureField) = chip(field)?.included

    @Test
    fun `empty text offers nothing`() {
        val parsed = parser.parse("   ")
        assertThat(parsed.isEmpty).isTrue()
    }

    @Test
    fun `the founder's own sentence reads end to end`() {
        val parsed = parser.parse("paid 1240 swiggy dinner with rohan, felt sluggish after")

        assertThat(parsed.value(CaptureField.AMOUNT)).isEqualTo("1,240")
        assertThat(parsed.included(CaptureField.AMOUNT)).isTrue()
        assertThat(parsed.value(CaptureField.MERCHANT)).isEqualTo("Swiggy")
        assertThat(parsed.value(CaptureField.CATEGORY)).isEqualTo("Food")
        assertThat(parsed.value(CaptureField.PEOPLE)).isEqualTo("Rohan")
        assertThat(parsed.value(CaptureField.MOOD)).isEqualTo("low")
        // A mood read from an adjective is a guess: offered, not committed.
        assertThat(parsed.included(CaptureField.MOOD)).isFalse()
    }

    @Test
    fun `a rupee sign is enough to be sure of an amount`() {
        val parsed = parser.parse("metro fare ₹60")
        assertThat(parsed.value(CaptureField.AMOUNT)).isEqualTo("60")
        assertThat(parsed.included(CaptureField.AMOUNT)).isTrue()
        assertThat(parsed.value(CaptureField.MERCHANT)).isEqualTo("Delhi Metro")
        assertThat(parsed.value(CaptureField.CATEGORY)).isEqualTo("Transport")
    }

    @Test
    fun `a bare number with no money context is offered switched off`() {
        val parsed = parser.parse("read 20 pages before bed")
        assertThat(parsed.value(CaptureField.AMOUNT)).isEqualTo("20")
        assertThat(parsed.included(CaptureField.AMOUNT)).isFalse()
    }

    @Test
    fun `a duration is not mistaken for an amount`() {
        val parsed = parser.parse("morning walk 25 min")
        assertThat(parsed.value(CaptureField.DURATION)).isEqualTo("25")
        assertThat(parsed.chip(CaptureField.AMOUNT)).isNull()
    }

    @Test
    fun `hours become minutes`() {
        val parsed = parser.parse("focus block 2 hrs")
        assertThat(parsed.value(CaptureField.DURATION)).isEqualTo("120")
    }

    @Test
    fun `a score out of ten is a confident mood`() {
        val parsed = parser.parse("felt sharp 8/10 today")
        assertThat(parsed.value(CaptureField.MOOD)).isEqualTo("8/10")
        assertThat(parsed.included(CaptureField.MOOD)).isTrue()
        assertThat(parsed.chip(CaptureField.AMOUNT)).isNull()
    }

    @Test
    fun `several people are read`() {
        val parsed = parser.parse("dinner with rohan and neha")
        val people = parser.parse("dinner with rohan and neha").chips
            .filter { it.field == CaptureField.PEOPLE }
            .map { it.value }
        assertThat(parsed.value(CaptureField.CATEGORY)).isEqualTo("Food")
        assertThat(people).containsExactly("Rohan", "Neha")
    }

    @Test
    fun `large amounts use Indian grouping`() {
        val parsed = parser.parse("paid 1234567 for the car")
        assertThat(parsed.value(CaptureField.AMOUNT)).isEqualTo("12,34,567")
    }

    @Test
    fun `a plain sentence offers nothing rather than inventing`() {
        val parsed = parser.parse("called mum")
        assertThat(parsed.isEmpty).isTrue()
    }

    @Test
    fun `only included chips are settled`() {
        val parsed = parser.parse("paid 1240 swiggy dinner")
        assertThat(parsed.settledAmount()).isEqualTo(1240)
        assertThat(parsed.toggle(CaptureField.AMOUNT).settledAmount()).isNull()
    }

    @Test
    fun `correcting a value includes it and keeps field order`() {
        val corrected = parser.parse("read 20 pages")
            .withValue(CaptureField.AMOUNT, "240")
            .withValue(CaptureField.MERCHANT, "Blinkit")

        assertThat(corrected.value(CaptureField.AMOUNT)).isEqualTo("240")
        assertThat(corrected.included(CaptureField.AMOUNT)).isTrue()
        assertThat(corrected.chips.map { it.field })
            .isInOrder(compareBy(CaptureField::ordinal))
    }

    @Test
    fun `clearing a value drops the chip`() {
        val cleared = parser.parse("metro fare ₹60").withValue(CaptureField.AMOUNT, "")
        assertThat(cleared.chip(CaptureField.AMOUNT)).isNull()
    }
}
