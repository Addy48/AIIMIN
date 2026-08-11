import { upsertRow } from '../services/dbService';

const DB_NAME = 'aiimin_offline';
const STORE = 'pending_logs';
const VERSION = 1;

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onerror = () => reject(req.error);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
  });
}

export async function queueOfflineLog(payload) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).add({
      created_at: new Date().toISOString(),
      payload,
      synced: false,
    });
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getPendingLogCount() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve((req.result || []).filter((r) => !r.synced).length);
    req.onerror = () => reject(req.error);
  });
}

export async function syncPendingLogs() {
  const db = await openDb();
  const pending = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });

  let synced = 0;
  for (const row of pending.filter((r) => !r.synced)) {
    try {
      await upsertRow('daily_logs', row.payload, 'user_id,date');
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).put({ ...row, synced: true });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
      synced += 1;
    } catch {
      break;
    }
  }
  return synced;
}

export function installOfflineSyncListener(onSynced) {
  if (typeof window === 'undefined') return () => {};
  const handler = async () => {
    if (!navigator.onLine) return;
    const count = await syncPendingLogs();
    if (count > 0) onSynced?.(count);
  };
  window.addEventListener('online', handler);
  return () => window.removeEventListener('online', handler);
}
