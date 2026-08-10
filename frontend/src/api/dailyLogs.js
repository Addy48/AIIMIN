/**
 * Daily logs API
 */
import { apiGet, apiPost } from '../utils/api';

export function dateRange(days) {
  const to = new Date().toLocaleDateString('en-CA');
  const from = new Date(Date.now() - (days - 1) * 86400000).toLocaleDateString('en-CA');
  return { from, to };
}

export const fetchDailyLogs = (from, to, opts = {}) => {
  const params = { from, to };
  if (opts.fields) params.fields = opts.fields;
  return apiGet('/daily-logs', { params });
};

export const fetchDailyLog = (userId, date) =>
  apiGet(`/daily-logs/${userId}/${date}`);

export const upsertDailyLog = (payload) => apiPost('/daily-logs', payload);
