import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { fetchDailyLogs, dateRange } from '../api/dailyLogs';

/**
 * Cached daily_logs reads — single React Query source for all analytics widgets.
 */
export function useDailyLogsQuery({ from, to, fields, enabled = true } = {}) {
  const { user } = useAuth();
  const range = from && to ? { from, to } : dateRange(30);

  const query = useQuery({
    queryKey: ['daily-logs', user?.id, range.from, range.to, fields || 'all'],
    queryFn: () => fetchDailyLogs(range.from, range.to, fields ? { fields } : {}),
    enabled: Boolean(enabled && user?.id && !user.isGuest),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });

  const logs = Array.isArray(query.data) ? query.data : [];
  const logsAsc = [...logs].sort((a, b) => String(a.date).localeCompare(String(b.date)));

  return {
    logs,
    logsAsc,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    from: range.from,
    to: range.to,
  };
}

/** Rolling N-day window (inclusive of today). */
export function useDailyLogsRange(days = 30, opts = {}) {
  const { from, to } = dateRange(days);
  return useDailyLogsQuery({ from, to, ...opts });
}

/** Single date lookup from cached range or direct fetch. */
export function useDailyLogByDate(date, opts = {}) {
  const { logs, loading, error, refetch } = useDailyLogsQuery({
    from: date,
    to: date,
    ...opts,
  });
  return {
    log: logs.find((l) => l.date === date) || null,
    loading,
    error,
    refetch,
  };
}

export function pickLogByDate(logs, date) {
  return (logs || []).find((l) => l.date === date) || null;
}
