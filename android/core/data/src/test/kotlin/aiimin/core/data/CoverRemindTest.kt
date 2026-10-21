package aiimin.core.data

import aiimin.core.data.vault.life
import aiimin.core.data.vault.remindable
import aiimin.core.database.DocEntity
import aiimin.core.engine.vault.Lifecycle
import com.google.common.truth.Truth.assertThat
import org.junit.Test

/** PRD Part 5 Phase 1: reminders follow the current version only; type A never reminds. */
class CoverRemindTest {
    private fun doc(id: String, type: String?, current: Boolean = true, life: String? = null, expires: String? = "2027-01-01") =
        DocEntity(id = id, owner = "me", title = id, category = "Other", mime = "application/pdf", ext = "pdf", sizeBytes = 1, path = "$id.pdf", createdAt = 0, expires = expires, docType = type, current = current, lifecycle = life)

    @Test fun `only current versions with a date remind, and issued-once papers never do`() {
        val out = remindable(
            listOf(
                doc("old", "car_insurance", current = false), doc("new", "car_insurance"), doc("pan", "pan"),
                doc("custom-a", null, life = "A"), doc("plain", null), doc("nodate", "passport", expires = null),
            ),
        ).map { it.id }
        assertThat(out).containsExactly("new", "plain")
    }

    @Test fun `a person's lifecycle choice beats the registry`() {
        assertThat(doc("x", "pan", life = "B").life()).isEqualTo(Lifecycle.B)
        assertThat(doc("x", "pan").life()).isEqualTo(Lifecycle.A)
        assertThat(doc("x", null).life()).isNull()
        assertThat(doc("x", "car_insurance").cover).isEqualTo("x")
    }
}
