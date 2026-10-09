package aiimin.core.data

import aiimin.core.network.FamilyDocDto
import aiimin.core.network.GoalDto
import aiimin.core.network.ResumeDto
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

/**
 * Family docs + resumes from bootstrap. List only — files stay on web.
 */
@Singleton
class VaultListStore @Inject constructor() {

    private val _state = MutableStateFlow(VaultListState.empty())
    val state: StateFlow<VaultListState> = _state.asStateFlow()

    fun hydrate(
        family: List<FamilyDocDto>,
        resumes: List<ResumeDto>,
        goals: List<GoalDto> = emptyList(),
    ) {
        val fam = family.mapNotNull { dto ->
            val id = dto.id?.trim().orEmpty()
            if (id.isEmpty()) null
            else VaultRow(id = id, title = dto.docType?.trim().orEmpty().ifBlank { "Family document" })
        }
        val res = resumes.mapNotNull { dto ->
            val id = dto.id?.trim().orEmpty()
            if (id.isEmpty()) null
            else VaultRow(id = id, title = dto.title?.trim().orEmpty().ifBlank { "Resume" })
        }
        val gos = goals.mapNotNull { dto ->
            val id = dto.id?.trim().orEmpty()
            if (id.isEmpty()) null
            else {
                val metric = dto.metric?.trim().orEmpty().ifBlank { "Goal" }
                val freq = dto.frequency?.trim()?.takeIf { it.isNotEmpty() }
                val target = dto.target?.let { n ->
                    if (n % 1.0 == 0.0) n.toLong().toString() else n.toString()
                }
                val title = listOfNotNull(metric, target, freq).joinToString(" · ")
                VaultRow(id = id, title = title)
            }
        }
        _state.update {
            VaultListState(
                family = fam,
                resumes = res,
                goals = gos,
                familyMeta = if (fam.isEmpty()) "LIVE · EMPTY" else "LIVE · ${fam.size}",
                resumeMeta = if (res.isEmpty()) "LIVE · EMPTY" else "LIVE · ${res.size}",
                goalsMeta = if (gos.isEmpty()) "LIVE · EMPTY" else "LIVE · ${gos.size}",
            )
        }
    }
}

data class VaultRow(val id: String, val title: String)

data class VaultListState(
    val family: List<VaultRow>,
    val resumes: List<VaultRow>,
    val goals: List<VaultRow> = emptyList(),
    val familyMeta: String,
    val resumeMeta: String,
    val goalsMeta: String = "LIVE · EMPTY",
) {
    companion object {
        fun empty() = VaultListState(
            family = emptyList(),
            resumes = emptyList(),
            goals = emptyList(),
            familyMeta = "LIVE · EMPTY",
            resumeMeta = "LIVE · EMPTY",
            goalsMeta = "LIVE · EMPTY",
        )
    }
}
