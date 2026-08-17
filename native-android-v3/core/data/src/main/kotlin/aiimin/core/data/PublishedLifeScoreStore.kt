package aiimin.core.data

import aiimin.core.network.LifeHealthDto
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.decodeFromJsonElement
import kotlin.math.roundToInt

/**
 * Server-published Life Score (ADR 2026-08-03).
 * Keys: physical · cognitive · discipline · financial · emotional
 * Labels: BODY · MIND · DISCIPLINE · MONEY · MOOD
 *
 * Clients never recompute the published figure.
 */
@Singleton
class PublishedLifeScoreStore @Inject constructor() {

    private val json = Json { ignoreUnknownKeys = true }

    private val _state = MutableStateFlow(PublishedLifeScoreState.absent())
    val state: StateFlow<PublishedLifeScoreState> = _state.asStateFlow()

    fun hydrateFromApi(dto: LifeHealthDto) {
        _state.value = dto.toPublished(source = LifeScoreSource.API)
    }

    fun hydrateFromBootstrap(raw: JsonElement?) {
        if (raw == null) return
        val dto = runCatching { json.decodeFromJsonElement<LifeHealthDto>(raw) }.getOrNull() ?: return
        // Prefer richer API hydrate when both land; bootstrap wins only if empty.
        if (_state.value.available && _state.value.source == LifeScoreSource.API) return
        _state.value = dto.toPublished(source = LifeScoreSource.BOOTSTRAP)
    }

    fun clear() {
        _state.value = PublishedLifeScoreState.absent()
    }

    fun resetToSeed() {
        _state.value = PublishedLifeScoreState.absent()
    }
}

enum class LifeScoreSource { ABSENT, BOOTSTRAP, API }

data class PublishedDimension(
    val key: String,
    val label: String,
    val score: Int,
)

data class PublishedLifeScoreState(
    val global: Int,
    val dimensions: List<PublishedDimension>,
    val daysWithData: Int?,
    val source: LifeScoreSource,
    val fetchedAtMs: Long?,
) {
    val available: Boolean get() = source != LifeScoreSource.ABSENT

    val sourceLabel: String
        get() = when (source) {
            LifeScoreSource.ABSENT -> "UNWIRED"
            LifeScoreSource.BOOTSTRAP -> "SERVER · BOOTSTRAP"
            LifeScoreSource.API -> "SERVER · LHS"
        }

    companion object {
        fun absent() = PublishedLifeScoreState(
            global = 0,
            dimensions = emptyList(),
            daysWithData = null,
            source = LifeScoreSource.ABSENT,
            fetchedAtMs = null,
        )
    }
}

private fun LifeHealthDto.toPublished(source: LifeScoreSource): PublishedLifeScoreState {
    val systems = systemScores
    val dims = listOf(
        PublishedDimension("physical", "BODY", (systems?.physical ?: 0.0).roundToInt()),
        PublishedDimension("cognitive", "MIND", (systems?.cognitive ?: 0.0).roundToInt()),
        PublishedDimension("discipline", "DISCIPLINE", (systems?.discipline ?: 0.0).roundToInt()),
        PublishedDimension("financial", "MONEY", (systems?.financial ?: 0.0).roundToInt()),
        PublishedDimension("emotional", "MOOD", (systems?.emotional ?: 0.0).roundToInt()),
    )
    return PublishedLifeScoreState(
        global = (globalScore ?: 0.0).roundToInt().coerceIn(0, 100),
        dimensions = dims,
        daysWithData = meta?.daysWithData,
        source = source,
        fetchedAtMs = System.currentTimeMillis(),
    )
}
