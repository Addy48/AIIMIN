package aiimin.core.data

import aiimin.core.data.ai.Clauses
import aiimin.core.data.sync.AuthErrors
import aiimin.core.data.sync.AuthResult
import com.google.common.truth.Truth.assertThat
import org.junit.Test

class AuthAndClausesTest {
    @Test fun `rate limit`() {
        assertThat(AuthErrors.map(429, "", "x").kind).isEqualTo(AuthResult.Kind.RATE_LIMIT)
        assertThat(AuthErrors.map(400, """{"message":"Too many requests"}""", "x").kind).isEqualTo(AuthResult.Kind.RATE_LIMIT)
    }

    @Test fun `unverified email names the address`() {
        val r = AuthErrors.map(403, """{"code":"EMAIL_NOT_VERIFIED","message":"Email not verified"}""", "meera@example.com")
        assertThat(r.kind).isEqualTo(AuthResult.Kind.BAD_CREDENTIALS)
        assertThat(r.message).contains("meera@example.com")
    }

    @Test fun `taken, wrong PIN, missing server, other client error, server error`() {
        assertThat(AuthErrors.map(422, """{"code":"USER_ALREADY_EXISTS"}""", "").kind).isEqualTo(AuthResult.Kind.TAKEN)
        assertThat(AuthErrors.map(401, """{"code":"INVALID_EMAIL_OR_PASSWORD"}""", "").kind).isEqualTo(AuthResult.Kind.BAD_CREDENTIALS)
        assertThat(AuthErrors.map(404, "<html>nginx</html>", "").kind).isEqualTo(AuthResult.Kind.SERVER)
        val bad = AuthErrors.map(400, """{"message":"PIN must be 6 digits"}""", "")
        assertThat(bad.kind).isEqualTo(AuthResult.Kind.INVALID)
        assertThat(bad.message).isEqualTo("PIN must be 6 digits")
        assertThat(AuthErrors.map(500, "", "").kind).isEqualTo(AuthResult.Kind.SERVER)
    }

    @Test fun `clauses split on punctuation and on and-before-a-verb only`() {
        assertThat(Clauses.split("meeting at 3, buy milk and eggs, spent 200 on auto"))
            .containsExactly("meeting at 3", "buy milk and eggs", "spent 200 on auto").inOrder()
        assertThat(Clauses.split("call Ravi and pay rent; note: wifi password")).containsExactly("call Ravi", "pay rent", "note: wifi password").inOrder()
        assertThat(Clauses.split("bread and butter")).containsExactly("bread and butter")
        assertThat(Clauses.split("  \n , ")).isEmpty()
    }
}
