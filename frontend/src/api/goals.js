/**
 * Goals API
 */
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api';

export const fetchGoals = () => apiGet('/goals');
export const createGoal = (payload) => apiPost('/goals', payload);
export const updateGoal = (id, payload) => apiPut(`/goals/${id}`, payload);
export const deleteGoal = (id) => apiDelete(`/goals/${id}`);
