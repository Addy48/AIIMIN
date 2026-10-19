import { useQuery } from '@tanstack/react-query';
import { fetchCorrelations } from '../api/correlations';

export function useCorrelationsQuery({ enabled = true, refresh = false } = {}) {
  const query = useQuery({
    queryKey: ['correlations', refresh ? 'refresh' : 'cached'],
    queryFn: () => fetchCorrelations(refresh),
    enabled,
    staleTime: 5 * 60_000,
    gcTime: 15 * 60_000,
  });

  const data = query.data || {};
  const correlations = (data.correlations || [])
    .filter((c) => c.bhPassed !== false && Math.abs(c.rho || c.strength || 0) >= 0.25)
    .sort((a, b) => Math.abs(b.rho || b.strength || 0) - Math.abs(a.rho || a.strength || 0));

  return {
    correlations,
    insights: data.insights || [],
    insufficientData: data.insufficientData ?? correlations.length < 3,
    source: data.source,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
