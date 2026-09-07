package aiimin.core.model

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class SubscriptionTierTest {
    @Test
    fun ladder_ranks_match_web() {
        assertThat(SubscriptionTier.EXPLORE.rank).isLessThan(SubscriptionTier.CORE.rank)
        assertThat(SubscriptionTier.CORE.rank).isLessThan(SubscriptionTier.PRO.rank)
        assertThat(SubscriptionTier.PRO.rank).isLessThan(SubscriptionTier.ELITE.rank)
    }

    @Test
    fun money_requires_core() {
        assertThat(TierCatalog.can(SubscriptionTier.EXPLORE, TierFeature.MONEY)).isFalse()
        assertThat(TierCatalog.can(SubscriptionTier.CORE, TierFeature.MONEY)).isTrue()
    }

    @Test
    fun fromId_parses_web_ids() {
        assertThat(SubscriptionTier.fromId("pro")).isEqualTo(SubscriptionTier.PRO)
        assertThat(SubscriptionTier.fromId("ELITE")).isEqualTo(SubscriptionTier.ELITE)
    }

    @Test
    fun catalog_interlinks_app_and_web() {
        val core = TierCatalog.unlock(SubscriptionTier.CORE)
        assertThat(core.app).isNotEmpty()
        assertThat(core.web).isNotEmpty()
        assertThat(core.aiCallsPerDay).isEqualTo(10)
    }

    @Test
    fun souls_match_web_account_colors() {
        assertThat(TierSouls.of(SubscriptionTier.EXPLORE).soulArgb).isEqualTo(0xFF6B7280L)
        assertThat(TierSouls.of(SubscriptionTier.CORE).soulArgb).isEqualTo(0xFF2DD4BFL)
        assertThat(TierSouls.of(SubscriptionTier.PRO).soulArgb).isEqualTo(0xFFFF6B35L)
        assertThat(TierSouls.of(SubscriptionTier.ELITE).soulArgb).isEqualTo(0xFFFBBF24L)
    }

    @Test
    fun pro_is_recommended_with_founding_strike() {
        val pro = TierSouls.of(SubscriptionTier.PRO)
        assertThat(pro.recommended).isTrue()
        assertThat(pro.priceInr).isEqualTo(49)
        assertThat(pro.listPriceInr).isEqualTo(59)
    }
}
