package aiimin.core.model

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class OsIdRulesTest {

    @Test
    fun `valid seed id passes`() {
        assertThat(OsIdRules.isValid("AADI2004")).isTrue()
        assertThat(OsIdRules.digitCount("AADI2004")).isEqualTo(4)
    }

    @Test
    fun `wrong length fails`() {
        assertThat(OsIdRules.isValid("AADI200")).isFalse()
        assertThat(OsIdRules.isValid("AADI20045")).isFalse()
    }

    @Test
    fun `lowercase normalizes then validates`() {
        assertThat(OsIdRules.normalize("aadi2004")).isEqualTo("AADI2004")
        assertThat(OsIdRules.isValid("aadi2004")).isTrue()
    }

    @Test
    fun `more than four digits fails`() {
        assertThat(OsIdRules.isValid("AA12345B")).isFalse()
        assertThat(OsIdRules.issues("AA12345B").any { it.contains("digits") }).isTrue()
    }

    @Test
    fun `symbols fail`() {
        assertThat(OsIdRules.isValid("AADI-004")).isFalse()
    }
}
