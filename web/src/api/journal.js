/**
 * Journal API — dedicated route (not generic /api/db).
 */
import { apiGet, apiPost, apiPatch, apiDelete } from '../utils/api';

const BASE = '/journal';

export async function fetchJournalEntries(opts = {}) {
  const params = {};
  if (opts.limit) params.limit = String(opts.limit);
  if (opts.orderCol) params.orderCol = opts.orderCol;
  if (opts.ascending != null) params.ascending = String(opts.ascending);
  return apiGet(BASE, { params });
}

export async function fetchJournalEntry(id) {
  return apiGet(`${BASE}/${id}`);
}

export async function createJournalEntry(row) {
  return apiPost(BASE, row);
}

export async function updateJournalEntry(id, payload) {
  return apiPatch(`${BASE}/${id}`, payload);
}

export async function deleteJournalEntry(id) {
  return apiDelete(`${BASE}/${id}`);
}
