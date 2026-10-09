package aiimin.core.data

import aiimin.core.network.LifeHealthDto
import aiimin.core.network.LifeHealthMetaDto
import aiimin.core.network.LifeHealthSystemsDto
import aiimin.core.network.LifeHealthTrendDto
import com.google.common.truth.Truth.assertThat
import org.junit.Test

class PublishedLifeScoreStoreTest {

    @Test
    fun `maps the server score to canonical dimensions and metadata`() {
        val store = PublishedLifeScoreStore()

        store.hydrateFromApi(
            LifeHealthDto(
                globalScore = 72.4,
                systemScores = LifeHealthSystemsDto(
                    physical = 80.0,
                    cognitive = 68.0,
                    discipline = 74.0,
                    financial = 61.0,
                    emotional = 77.0,
                ),
                meta = LifeHealthMetaDto(
                    days = 30,
                    daysWithData = 18,
                    calculationVersion = "lhs-v3.0.0-calibrated",
                    profileVersion = "personal-baseline-v2-median-mad",
                    referenceDatasetVersion = "lhs-reference-v1",
                    coverage = 0.76,
                    scoreConfidence = "moderate",
                    confidenceScore = 0.81,
                    uncertaintyBand = 7.0,
                    effectiveSampleSize = 12.5,
                    trend = LifeHealthTrendDto(direction = "improving", delta = 3.2),
                ),
            ),
        )

        val state = store.state.value
        assertThat(state.available).isTrue()
        assertThat(state.global).isEqualTo(72)
        assertThat(state.dimensions.map { it.label }).containsExactly(
            "BODY", "MIND", "DISCIPLINE", "MONEY", "MOOD",
        ).inOrder()
        assertThat(state.dimensions.map { it.score }).containsExactly(80, 68, 74, 61, 77).inOrder()
        assertThat(state.daysWithData).isEqualTo(18)
        assertThat(state.coverage).isWithin(1e-6).of(0.76)
        assertThat(state.confidenceLabel).isEqualTo("moderate")
        assertThat(state.uncertaintyBand).isEqualTo(7)
        assertThat(state.trendDirection).isEqualTo("improving")
        assertThat(state.trendDelta).isWithin(1e-6).of(3.2)
        assertThat(state.calculationVersion).isEqualTo("lhs-v3.0.0-calibrated")
        assertThat(state.profileVersion).isEqualTo("personal-baseline-v2-median-mad")
        assertThat(state.referenceDatasetVersion).isEqualTo("lhs-reference-v1")
        assertThat(state.source).isEqualTo(LifeScoreSource.API)
    }

    @Test
    fun `keeps unavailable server values nullable instead of inventing zero`() {
        val store = PublishedLifeScoreStore()
        store.hydrateFromApi(
            LifeHealthDto(
                globalScore = null,
                systemScores = LifeHealthSystemsDto(physical = null, emotional = 0.0),
                meta = LifeHealthMetaDto(scoreConfidence = "unavailable"),
            ),
        )

        val state = store.state.value
        assertThat(state.available).isFalse()
        assertThat(state.global).isNull()
        assertThat(state.dimensions.first { it.key == "physical" }.score).isNull()
        assertThat(state.dimensions.first { it.key == "emotional" }.score).isEqualTo(0)
        assertThat(state.confidenceLabel).isEqualTo("unavailable")
    }
}
