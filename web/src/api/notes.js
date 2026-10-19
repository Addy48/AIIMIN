/**
 * Notes + voice recall API helpers
 */
import { apiGet, apiPost, apiPatch, apiDelete, apiPut } from '../utils/api';

const BASE = '/notes';

export async function fetchNotes(opts = {}) {
  const params = {};
  if (opts.q) params.q = opts.q;
  if (opts.limit) params.limit = String(opts.limit);
  return apiGet(BASE, { params });
}

export async function fetchNote(id) {
  return apiGet(`${BASE}/${id}`);
}

export async function createNote(data) {
  return apiPost(BASE, data);
}

export async function updateNote(id, data) {
  return apiPatch(`${BASE}/${id}`, data);
}

export async function deleteNote(id) {
  return apiDelete(`${BASE}/${id}`);
}

export async function suggestNoteLinks(id) {
  return apiPost(`${BASE}/${id}/link-suggest`, {});
}

export async function confirmAnchor(edgeId) {
  return apiPost(`${BASE}/anchors/${edgeId}/confirm`, {});
}

export async function fetchNoteAnchors(id) {
  return apiGet(`${BASE}/${id}/anchors`);
}

export async function fetchRecallDue() {
  return apiGet(`${BASE}/recall/due`);
}

export async function enqueueRecall(data) {
  return apiPost(`${BASE}/recall/enqueue`, data);
}

export async function recallOutcome(id, outcome) {
  return apiPost(`${BASE}/recall/${id}/outcome`, { outcome });
}

export async function fetchDriveStatus() {
  return apiGet(`${BASE}/drive/status`);
}

export async function saveDriveWatch(data) {
  return apiPut(`${BASE}/drive/watch`, data);
}

export async function deleteDriveWatch(id) {
  return apiDelete(`${BASE}/drive/watch/${id}`);
}

export async function syncDriveFolder(data = {}) {
  return apiPost(`${BASE}/drive/sync`, data);
}
