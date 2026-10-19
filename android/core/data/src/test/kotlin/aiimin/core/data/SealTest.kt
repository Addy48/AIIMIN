package aiimin.core.data

import aiimin.core.data.vault.Seal
import com.google.common.truth.Truth.assertThat
import org.junit.Assert.assertThrows
import org.junit.Test

class SealTest {
    @Test fun `sealed archive opens only with the right secret`() {
        val data = "vault bytes".toByteArray()
        val sealed = Seal.seal(data, "correct horse battery".toCharArray(), Seal.KIND_BACKUP, iterations = 120_000)
        assertThat(Seal.kindOf(sealed)).isEqualTo(Seal.KIND_BACKUP)
        assertThat(Seal.open(sealed, "correct horse battery".toCharArray())).isEqualTo(data)
        assertThrows(Seal.WrongSecret::class.java) { Seal.open(sealed, "wrong".toCharArray()) }
    }

    @Test fun `a changed header fails to open`() {
        val sealed = Seal.seal("x".toByteArray(), "pw-pw-pw-pw".toCharArray(), Seal.KIND_KIT, iterations = 120_000)
        sealed[7] = Seal.KIND_BACKUP
        assertThrows(Seal.WrongSecret::class.java) { Seal.open(sealed, "pw-pw-pw-pw".toCharArray()) }
    }

    @Test fun `not an AIIMIN file`() {
        assertThat(Seal.kindOf("hello".toByteArray())).isNull()
        assertThrows(Seal.NotAiimin::class.java) { Seal.open(ByteArray(80), "x".toCharArray()) }
    }

    @Test fun `kit codes are six groups of five and survive sloppy typing`() {
        val code = Seal.newCode()
        assertThat(code).matches("([A-Z2-9]{5}-){5}[A-Z2-9]{5}")
        assertThat(Seal.normalizeCode(code.lowercase().replace("-", " "))).isEqualTo(code)
    }
}
