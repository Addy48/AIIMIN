package aiimin.core.data

import aiimin.core.network.FamilyDocDto
import aiimin.core.network.GoalDto
import aiimin.core.network.ResumeDto
import com.google.common.truth.Truth.assertThat
import org.junit.Test

class VaultListStoreTest {

    private val store = VaultListStore()

    @Test
    fun `empty hydrate stays empty not seed`() {
        store.hydrate(emptyList(), emptyList())
        val s = store.state.value
        assertThat(s.family).isEmpty()
        assertThat(s.resumes).isEmpty()
        assertThat(s.familyMeta).isEqualTo("LIVE · EMPTY")
        assertThat(s.resumeMeta).isEqualTo("LIVE · EMPTY")
    }

    @Test
    fun `family and resume hydrate`() {
        store.hydrate(
            listOf(FamilyDocDto(id = "f1", docType = "Aadhaar")),
            listOf(ResumeDto(id = "r1", title = "CV 2026")),
        )
        val s = store.state.value
        assertThat(s.family).hasSize(1)
        assertThat(s.family.first().title).isEqualTo("Aadhaar")
        assertThat(s.resumes.first().title).isEqualTo("CV 2026")
        assertThat(s.familyMeta).isEqualTo("LIVE · 1")
        assertThat(s.goals).isEmpty()
        assertThat(s.goalsMeta).isEqualTo("LIVE · EMPTY")
    }

    @Test
    fun `goals hydrate metric target frequency`() {
        store.hydrate(
            emptyList(),
            emptyList(),
            listOf(GoalDto(id = "g1", metric = "steps", target = 8000.0, frequency = "daily")),
        )
        val s = store.state.value
        assertThat(s.goals).hasSize(1)
        assertThat(s.goals.first().title).isEqualTo("steps · 8000 · daily")
        assertThat(s.goalsMeta).isEqualTo("LIVE · 1")
    }
}
