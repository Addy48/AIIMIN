/**
 * Subscription tier gating (P11).
 * explore < core < pro < elite
 */
export const TIER_RANK = { explore: 0, core: 1, pro: 2, elite: 3 };

export const TIER_LABELS = {
  explore: 'Explore',
  core: 'Core',
  pro: 'Pro',
  elite: 'Elite',
};

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

/** Minimum tier to open a route (subscription mode enforcement). */
export const ROUTE_MIN_TIER = {
  '/overview': 'explore',
  '/calendar': 'explore',
  '/account': 'explore',
  '/settings': 'explore',
  '/identity': 'explore',
  '/notes': 'explore',
  '/journal': 'explore',
  '/habits': 'core',
  '/goals': 'core',
  '/finance': 'core',
  '/focus': 'core',
  '/lab': 'core',
  '/sports': 'core',
  '/discipline': 'core',
  '/placements': 'core',
  '/family': 'pro',
  '/reports': 'core', /* Core+ Snapshot; Pro+ Folio PDF; Elite Deep paused */
  /* /insights redirects → /reports?tab=patterns (tier applied on /reports) */
};

/** Report product by plan: Snapshot (Core+), Standard Folio PDF (Pro+). Elite Deep not shipped. */
export const REPORT_PRODUCT = {
  snapshot: 'core',
  standardPdf: 'pro',
  deep: null, /* paused */
};

export function minTierForPath(pathname) {
  const base = pathname.split('?')[0].replace(/\/$/, '') || '/';
  if (ROUTE_MIN_TIER[base]) return ROUTE_MIN_TIER[base];
  return 'explore';
}

export function canAccess(userTier, featureKey) {
  const required = TIER_FEATURES[featureKey] || 'explore';
  return hasTier(userTier, required);
}

export const IS_SUBSCRIPTION_MODE = process.env.REACT_APP_SUBSCRIPTION_MODE !== 'false';
