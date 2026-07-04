import { useEffect } from 'react';
import { queryClient } from '../context/QueryProvider';
import { apiGet } from '../utils/api';

async function fetchDashboardWidgets() {
  return apiGet('/dashboard/widgets');
}

async function fetchDashboardSummary() {
  return apiGet('/dashboard/summary');
}

/**
 * Prefetch Overview data after auth so /overview feels instant (PERF-09).
 */
export function useDashboardPrefetch(user) {
  useEffect(() => {
    if (!user || user.isGuest) return;
    const userId = user.id;
    queryClient.prefetchQuery({
      queryKey: ['dashboard', 'widgets', userId],
      queryFn: fetchDashboardWidgets,
      staleTime: 30_000,
    });
    queryClient.prefetchQuery({
      queryKey: ['dashboard', 'summary', userId],
      queryFn: fetchDashboardSummary,
      staleTime: 30_000,
    });
  }, [user?.id, user?.isGuest]);
}
