/**
 * Shared Idempotency-Key store for mobile + wealth routes.
 * Uses existing `mobile_idempotency` table — no schema change.
 */
import { pool } from './db.js';
import { randomUUID } from 'crypto';

const IDEMPOTENCY_TTL_HOURS = 48;

export async function rememberIdempotency(userId, key, responseBody) {
  if (!key) return;
  try {
    await pool.query(
      `INSERT INTO mobile_idempotency (id, user_id, idem_key, response_json, created_at)
       VALUES ($1, $2, $3, $4::jsonb, NOW())
       ON CONFLICT (user_id, idem_key) DO NOTHING`,
      [randomUUID(), userId, String(key).slice(0, 128), JSON.stringify(responseBody)],
    );
  } catch (err) {
    if (!String(err.message).includes('mobile_idempotency')) {
      console.warn('[idempotency] write:', err.message);
    }
  }
}

export async function loadIdempotency(userId, key) {
  if (!key) return null;
  try {
    const { rows } = await pool.query(
      `SELECT response_json FROM mobile_idempotency
       WHERE user_id = $1 AND idem_key = $2
         AND created_at > NOW() - ($3 || ' hours')::interval`,
      [userId, String(key).slice(0, 128), String(IDEMPOTENCY_TTL_HOURS)],
    );
    return rows[0]?.response_json || null;
  } catch {
    return null;
  }
}
