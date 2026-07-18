/**
 * Correlations API — Spearman signal pairs from intelligence layer.
 */
import { apiGet, apiPost } from '../utils/api';

export const fetchCorrelations = (refresh = false) =>
  apiGet('/intelligence/correlations', { params: refresh ? { refresh: '1' } : {} });

export const refreshCorrelations = () => apiPost('/intelligence/correlations/refresh', {});
