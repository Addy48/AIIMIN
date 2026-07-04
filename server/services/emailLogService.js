/**
 * Email log — duplicate prevention for re-engagement flows (ENG-07).
 */
import { pool } from '../lib/db.js';

export async function wasEmailSentRecently(userId, emailType, withinHours = 24) {
  try {
    const cutoff = new Date(Date.now() - withinHours * 3600000).toISOString();
    const { rows } = await pool.query(
      `SELECT id FROM public.email_logs
       WHERE user_id = $1 AND email_type = $2 AND sent_at > $3
       LIMIT 1`,
      [userId, emailType, cutoff]
    );
    return rows.length > 0;
  } catch {
    return false;
  }
}

export async function logEmailSent(userId, emailType, sesMessageId = null, metadata = {}) {
  try {
    const { rows } = await pool.query(
      `INSERT INTO public.email_logs (user_id, email_type, ses_message_id, metadata)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [userId, emailType, sesMessageId, JSON.stringify(metadata)]
    );
    return rows[0]?.id;
  } catch (err) {
    console.warn('[emailLog] insert failed:', err.message);
    return null;
  }
}
