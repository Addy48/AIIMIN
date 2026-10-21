package aiimin.core.engine.pour

import com.google.common.truth.Truth.assertThat
import com.google.common.truth.Truth.assertWithMessage
import org.junit.Test
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

/** PRD Part 12: the safety check, helplines from the dataset only, fixed lines and the tools' timing. */
class PourTest {
    @Test fun `heavy phrases in English and Hinglish show the card`() {
        listOf(
            "Some days I just want to die.", "I keep thinking I'd be better off dead", "honestly i dont want to live like this",
            "I want to KILL MYSELF", "thinking about suicide again", "main mar jaana chahta hoon", "kabhi kabhi khudkushi ka khayal aata hai",
            "jeene ka mann nahi karta", "I’ve been cutting myself",
        ).forEach { assertWithMessage(it).that(SafetyCheck.flags(it)).isTrue() }
    }

    @Test fun `everyday words do not`() {
        listOf(
            "This traffic is killing me", "I could die of embarrassment lol", "the battery died", "the deadline is murder",
            "Samar jaana chahta tha Goa", "my selfie is harmless", "I cut my hair", "Studio work ended my day",
        ).forEach { assertWithMessage(it).that(SafetyCheck.flags(it)).isFalse() }
    }

    @Test fun `helplines come from the dataset, India first with Tele-MANAS`() {
        val india = Helplines.forCountry("in")!!
        assertThat(india.emergency).isEqualTo("112")
        assertThat(india.lines.first().number).isEqualTo("14416")
        assertThat(Helplines.forCountry("GB")!!.lines.map { it.number }).contains("116 123")
        assertThat(Helplines.forCountry("US")!!.lines.first().dial).isEqualTo("988")
        assertThat(Helplines.forCountry("ZZ")).isNull()
        assertThat(Helplines.forCountry(null)).isNull()
    }

    @Test fun `a trust C row is never shipped and several numbers dial the first`() {
        val rows = Helplines.parse("XX\tTest\t1\tC\tA=1\nYY\tOther\t\tB\tCrisis line=143 / 0800 1\n")
        assertThat(rows.map { it.country }).containsExactly("YY")
        assertThat(rows.single().emergency).isNull()
        assertThat(rows.single().lines.single().dial).isEqualTo("143")
    }

    @Test fun `fixed lines carry no guilt words`() {
        val banned = listOf("late", "overdue", "missed", "streak", "behind", "failed")
        (PourLines.OPEN + PourLines.CLOSE + PourLines.LET_GO + TellSomeone.TEXTS + Feelings.WORDS + PourLines.DISCLAIMER).forEach { line ->
            banned.forEach { w -> assertWithMessage("$line / $w").that(Regex("\\b$w\\b", RegexOption.IGNORE_CASE).containsMatchIn(line)).isFalse() }
        }
        assertThat(PourLines.pick(PourLines.OPEN, LocalDate.of(2026, 10, 21))).isIn(PourLines.OPEN)
    }

    @Test fun `name the feeling takes up to three words`() {
        var c = emptyList<String>()
        listOf("Sad", "Tired", "Lonely", "Angry").forEach { c = Feelings.toggle(c, it) }
        assertThat(c).containsExactly("Sad", "Tired", "Lonely").inOrder()
        assertThat(Feelings.toggle(c, "Tired")).containsExactly("Sad", "Lonely")
    }

    @Test fun `cooling-off asks after 24 hours, letters stay sealed until their date`() {
        val w = LocalDateTime.of(2026, 10, 21, 22, 0)
        assertThat(PourTiming.coolingDue(w, w.plusHours(23).plusMinutes(59))).isFalse()
        assertThat(PourTiming.coolingDue(w, w.plusHours(24))).isTrue()
        assertThat(PourTiming.sealed(LocalDate.of(2026, 11, 1), LocalDate.of(2026, 10, 31))).isTrue()
        assertThat(PourTiming.sealed(LocalDate.of(2026, 11, 1), LocalDate.of(2026, 11, 1))).isFalse()
        assertThat(PourTiming.sealed(null, LocalDate.of(2026, 11, 1))).isFalse()
    }

    @Test fun `worry time is one 15-minute slot a day`() {
        val slot = LocalTime.of(18, 30)
        assertThat(PourTiming.nextWorrySlot(slot, LocalDateTime.of(2026, 10, 21, 10, 0))).isEqualTo(LocalDateTime.of(2026, 10, 21, 18, 30))
        assertThat(PourTiming.nextWorrySlot(slot, LocalDateTime.of(2026, 10, 21, 18, 40))).isEqualTo(LocalDateTime.of(2026, 10, 21, 18, 30))
        assertThat(PourTiming.nextWorrySlot(slot, LocalDateTime.of(2026, 10, 21, 18, 45))).isEqualTo(LocalDateTime.of(2026, 10, 22, 18, 30))
        assertThat(PourTiming.inWorryTime(slot, LocalTime.of(18, 44))).isTrue()
        assertThat(PourTiming.inWorryTime(slot, LocalTime.of(18, 45))).isFalse()
        assertThat(PourTiming.inWorryTime(LocalTime.of(23, 55), LocalTime.of(0, 5))).isTrue()
    }

    @Test fun `breathing runs 4 seconds in and 6 out`() {
        assertThat(PourTiming.breath(0)).isEqualTo(0f)
        assertThat(PourTiming.breath(4_000)).isEqualTo(1f)
        assertThat(PourTiming.breath(10_000)).isEqualTo(0f)
        assertThat(PourTiming.breath(7_000)).isWithin(0.001f).of(0.5f)
    }
}
