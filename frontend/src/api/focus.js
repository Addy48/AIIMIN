import { apiGet, apiPost } from '../utils/api';

export function fetchFocusWeekStats(days = 7) {
  return apiGet('/focus/week-stats', { params: { days: String(days) } });
}

export function logFocusSession(data) {
  return apiPost('/focus/sessions', data);
}
