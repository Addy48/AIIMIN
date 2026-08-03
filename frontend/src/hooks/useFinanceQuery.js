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

  // There were two more queries here, for /wealth/safe-to-spend and
  // /wealth/health-score. Neither route exists in server/routes/wealth.js, so
  // both 404'd on every Finance load and React Query retried each three times —
  // eight failed requests per visit. Nothing consumed their results either:
  // Finance.jsx computes savingsRate and fiYears locally. Removed rather than
  // stubbed; re-add them alongside real endpoints if those metrics move
  // server-side.

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
    refetch: bundle.refetch,
    invalidate,
  };
}
