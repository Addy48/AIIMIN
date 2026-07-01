import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet } from '../utils/api';

async function fetchFinanceBundle() {
  const [transactions, assets, accounts, budgets] = await Promise.all([
    apiGet('/wealth/transactions'),
    apiGet('/wealth/assets'),
    apiGet('/wealth/accounts'),
    apiGet('/wealth/budgets'),
  ]);
  return {
    transactions: transactions || [],
    assets: assets || [],
    accounts: accounts || [],
    budgets: budgets || [],
  };
}

export function useFinanceQuery(enabled = true) {
  const queryClient = useQueryClient();

  const bundle = useQuery({
    queryKey: ['finance', 'bundle'],
    queryFn: fetchFinanceBundle,
    enabled,
    staleTime: 60_000,
  });

  const aiSummary = useQuery({
    queryKey: ['finance', 'ai-summary'],
    queryFn: () => apiGet('/wealth/ai-summary'),
    enabled,
    staleTime: 120_000,
  });

  const safeToSpend = useQuery({
    queryKey: ['finance', 'safe-to-spend'],
    queryFn: () => apiGet('/wealth/safe-to-spend'),
    enabled,
    staleTime: 60_000,
  });

  const healthScore = useQuery({
    queryKey: ['finance', 'health-score'],
    queryFn: () => apiGet('/wealth/health-score'),
    enabled,
    staleTime: 120_000,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['finance'] });
  };

  return {
    transactions: bundle.data?.transactions || [],
    assets: bundle.data?.assets || [],
    accounts: bundle.data?.accounts || [],
    budgets: bundle.data?.budgets || [],
    loading: bundle.isLoading,
    aiSummary: aiSummary.data,
    aiSummaryLoading: aiSummary.isLoading,
    safeToSpend: safeToSpend.data,
    healthScore: healthScore.data,
    refetch: bundle.refetch,
    invalidate,
  };
}
