import { useCallback, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { sportsService } from '../services/sportsService';

export function useSportsFeedQuery(enabled = true) {
  const queryClient = useQueryClient();
  const [isSyncing, setIsSyncing] = useState(false);

  const query = useQuery({
    queryKey: ['sports', 'feed'],
    queryFn: () => sportsService.fetchSportsFeed(),
    enabled,
    staleTime: 60_000,
    refetchInterval: 120_000,
    retry: 1,
  });

  const syncScores = useCallback(async () => {
    setIsSyncing(true);
    try {
      const feed = await sportsService.refreshSportsFeed();
      queryClient.setQueryData(['sports', 'feed'], feed);
      return feed;
    } finally {
      setIsSyncing(false);
    }
  }, [queryClient]);

  return {
    ...query,
    syncScores,
    isFetching: query.isFetching || isSyncing,
  };
}
