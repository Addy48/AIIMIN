/**
 * Habits API
 */
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api';

export const fetchHabits = (params = {}) => apiGet('/habits', { params });
export const createHabit = (payload) => apiPost('/habits', payload);
export const updateHabit = (id, payload) => apiPut(`/habits/${id}`, payload);
export const deleteHabit = (id) => apiDelete(`/habits/${id}`);
export const fetchHabitLogs = (habitId, params = {}) =>
  apiGet(`/habits/${habitId}/logs`, { params });
