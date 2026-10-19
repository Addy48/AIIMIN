import { useEffect, useState } from 'react';
import { apiGet } from '../../utils/api';
import { hasTier, TIER_LABELS } from '../../utils/tierGating';

/**
 * Read-only plan + finance glance for /m/score (no full finance bundle).
 */
export function useMobilePlanGlance(userId) {
  const [tier, setTier] = useState('explore');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return undefined;
    }
    let cancelled = false;
    setLoading(true);
    apiGet('/billing/status')
      .then((st) => {
        if (!cancelled) setTier(st?.tier || 'explore');
      })
      .catch(() => {
        if (!cancelled) setTier('explore');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [userId]);

  const financeUnlocked = hasTier(tier, 'core');

  return {
    tier,
    tierLabel: TIER_LABELS[tier] || 'Explore',
    financeUnlocked,
    loading,
    financeTitle: financeUnlocked ? `${TIER_LABELS[tier] || 'Core'} plan` : 'Explore plan',
    financeSub: financeUnlocked
      ? 'Full finance on iPad / desktop'
      : 'Core unlocks money tools',
  };
}
