package aiimin.core.data

import aiimin.core.data.vault.KeySlots
import aiimin.core.data.vault.Seal
import com.google.common.truth.Truth.assertThat
import org.junit.Assert.assertThrows
import org.junit.Test

/** PRD Part 5 Phase 3: one data key, two sealed slots (passphrase + recovery code); either opens the backup. */
class KeySlotsTest {
    private val it = 100_000 // fast in tests; the app uses Seal.ITERATIONS
    private val key = KeySlots.newDataKey()
    private val code = KeySlots.newRecoveryCode()
    private val slots = listOf(KeySlots.slot(key, "river stone 42".toCharArray(), it), KeySlots.slot(key, KeySlots.normalize(code).toCharArray(), it))
    private val plain = "vault archive".toByteArray()

    @Test fun `the recovery code is 24 characters in six groups, no look-alike letters`() {
        assertThat(code).matches("[A-Z2-9]{4}(-[A-Z2-9]{4}){5}")
        assertThat(KeySlots.normalize(code)).hasLength(24)
        assertThat(code).doesNotContainMatch("[01OI]")
    }

    @Test fun `either secret opens it, the code typed any way`() {
        val sealed = KeySlots.seal(plain, key, slots)
        assertThat(KeySlots.isWeekly(sealed)).isTrue()
        assertThat(KeySlots.open(sealed, "river stone 42".toCharArray())).isEqualTo(plain)
        assertThat(KeySlots.open(sealed, code.toCharArray())).isEqualTo(plain)
        assertThat(KeySlots.open(sealed, code.lowercase().replace("-", " ").toCharArray())).isEqualTo(plain)
    }

    @Test fun `a wrong secret or a changed header does not open it`() {
        val sealed = KeySlots.seal(plain, key, slots)
        assertThrows(Seal.WrongSecret::class.java) { KeySlots.open(sealed, "wrong".toCharArray()) }
        val bad = sealed.copyOf().also { b -> b[b.size - 30] = (b[b.size - 30] + 1).toByte() }
        assertThrows(Seal.NotAiimin::class.java) { KeySlots.open(bad, code.toCharArray()) }
        assertThrows(Seal.NotAiimin::class.java) { KeySlots.open("nope".toByteArray(), code.toCharArray()) }
    }

    @Test fun `the weekly job reuses the stored slots without either secret`() {
        // Two backups from the same key and slots both open with the passphrase: nothing secret is needed to write one.
        val a = KeySlots.seal(plain, key, slots)
        val b = KeySlots.seal("next week".toByteArray(), key, slots)
        assertThat(String(KeySlots.open(b, "river stone 42".toCharArray()))).isEqualTo("next week")
        assertThat(a).isNotEqualTo(b)
    }
}
