/**
 * Subscription tier gating (P11).
 * explore < core < pro < elite
 */
export const TIER_RANK = { explore: 0, core: 1, pro: 2, elite: 3 };

export function tierRank(tier) {
  return TIER_RANK[tier] ?? 0;
}

export function hasTier(userTier, required) {
  return tierRank(userTier || 'explore') >= tierRank(required || 'explore');
}

export const TIER_FEATURES = {
  discipline_urges: 'core',
  journal_ai: 'core',
  finance_advanced: 'core',
  sports_personalized: 'core',
  lab_benchmark: 'core',
  family_vault: 'pro',
  weekly_digest: 'pro',
  finance_whatif: 'pro',
};

export function canAccess(userTier, featureKey) {
  const required = TIER_FEATURES[featureKey] || 'explore';
  return hasTier(userTier, required);
}
