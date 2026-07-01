import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPut, apiPost, apiDelete } from '../utils/api';

function normalizeHabits(rows) {
  return (rows || []).map((h) => ({
    ...h,
    meta: h.meta || { completedDates: [] },
  }));
}

const EMPTY_ARRAY = [];

export function useHabitsQuery(options = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['habits'],
    queryFn: async () => normalizeHabits(await apiGet('/habits')),
    staleTime: 30_000,
    ...options,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['habits'] });

  const updateHabit = async (id, payload) => {
    const updated = await apiPut(`/habits/${id}`, payload);
    queryClient.setQueryData(['habits'], (old) =>
      (old || []).map((h) => (h.id === id ? { ...h, ...updated, meta: updated.meta || h.meta } : h))
    );
    return updated;
  };

  const createHabit = async (payload) => {
    const created = await apiPost('/habits', payload);
    queryClient.setQueryData(['habits'], (old) => [...(old || []), { ...created, meta: created.meta || { completedDates: [] } }]);
    return created;
  };

  const deleteHabit = async (id) => {
    await apiDelete(`/habits/${id}`);
    queryClient.setQueryData(['habits'], (old) => (old || []).filter((h) => h.id !== id));
  };

  return {
    habits: query.data || EMPTY_ARRAY,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    invalidate,
    updateHabit,
    createHabit,
    deleteHabit,
  };
}

export function useGoalsQuery(options = {}) {
  return useQuery({
    queryKey: ['goals'],
    queryFn: () => apiGet('/goals'),
    staleTime: 30_000,
    ...options,
  });
}
