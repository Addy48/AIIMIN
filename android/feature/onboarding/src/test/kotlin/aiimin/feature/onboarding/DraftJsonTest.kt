package aiimin.feature.onboarding

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class DraftJsonTest {
    @Test fun `draft survives a round trip through JSON`() {
        val d = Draft(
            step = 4, helloOpen = true, name = "Meera", dob = "1996-04-12", country = "IN", wakeMin = 6 * 60 + 30, sleepMin = 30,
            mins = listOf(MinPick("Walk 20 minutes", "Walk to the gate"), MinPick("Read 10 pages", "")),
            minsTouched = true, firstWin = "Task · Call Ravi", raahiMode = "OFF", ageOk = true,
        )
        assertThat(Draft.fromJson(d.toJson())).isEqualTo(d)
    }

    @Test fun `nulls stay null and garbage is rejected`() {
        val d = Draft(name = "A")
        assertThat(Draft.fromJson(d.toJson())).isEqualTo(d)
        assertThat(Draft.fromJson("not json")).isNull()
    }

    @Test fun `a draft from the old ten-page flow resumes on screen 1 with what it had`() {
        val old = """{"step":7,"name":"Meera","dob":"1996-04-12","role":"shift","battery":"STANDARD","mins":[{"t":"A","y":""},{"t":"B","y":""},{"t":"C","y":""},{"t":"D","y":""}]}"""
        val d = Draft.fromJson(old)!!
        assertThat(d.step).isEqualTo(0)
        assertThat(d.helloOpen).isTrue()
        assertThat(d.name).isEqualTo("Meera")
        assertThat(d.dob).isEqualTo("1996-04-12")
        // At most three minimums now (1.6).
        assertThat(d.mins).hasSize(MAX_MINS)
        assertThat(d.raahiMode).isEqualTo("QUIET")
    }

    @Test fun `before the age check nothing typed on screen 1 is written`() {
        val d = Draft(helloOpen = true, name = "Kid", dob = "2012-10-15")
        val stored = Draft.fromJson(d.storable().toJson())!!
        assertThat(stored.name).isEmpty()
        assertThat(stored.dob).isNull()
        assertThat(d.storable().toJson()).doesNotContain("Kid")
        assertThat(d.storable().toJson()).doesNotContain("2012")
        // After the check passes, Back keeps them (1.6).
        assertThat(Draft.fromJson(d.copy(ageOk = true, dob = "1996-04-12").storable().toJson())!!.name).isEqualTo("Kid")
    }

    @Test fun `steps never run past the last screen`() {
        assertThat(Draft.fromJson(Draft(step = 6).toJson())!!.step).isEqualTo(Draft.LAST)
        assertThat(Draft.fromJson("""{"v":2,"step":12}""")!!.step).isEqualTo(Draft.LAST)
    }

    @Test fun `the first minimum is pre-ticked and the example is the 1_6b line`() {
        assertThat(FIRST_MIN.title).isEqualTo("Walk 20 minutes")
        assertThat("Try it: $TRY_EXAMPLE.").isEqualTo("Try it: spend 240 on lunch and call Ravi at 5.")
    }
}
