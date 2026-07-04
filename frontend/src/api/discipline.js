/**
 * Discipline API — authenticated helpers for Discipline.jsx
 */
import { apiGet, apiPost, apiPatch, apiPut, apiDelete } from '../utils/api';

const BASE = '/discipline';

export async function fetchStreakData() {
  return apiGet(`${BASE}/streak`);
}

export async function createOrUpdateStreak(data) {
  return apiPost(`${BASE}/streak`, data);
}

export async function resetStreak(data) {
  return apiPatch(`${BASE}/streak/reset`, data);
}

export async function logDisciplineEvent(data) {
  return apiPost(`${BASE}/log`, data);
}

export async function fetchDisciplineLogs(opts = {}) {
  const { type, limit = 50, days = 30 } = opts;
  const params = { limit: String(limit), days: String(days) };
  if (type) params.type = type;
  return apiGet(`${BASE}/logs`, { params });
}

export async function fetchDisciplineInsights() {
  return apiGet(`${BASE}/insights`);
}

export async function fetchReplacementHabits() {
  return apiGet(`${BASE}/replacement-habits`);
}

export async function addReplacementHabit(data) {
  return apiPost(`${BASE}/replacement-habits`, data);
}

export async function updateReplacementHabit(id, data) {
  return apiPut(`${BASE}/replacement-habits/${id}`, data);
}

export async function deleteReplacementHabit(id) {
  return apiDelete(`${BASE}/replacement-habits/${id}`);
}
