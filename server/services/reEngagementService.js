/**
 * Re-engagement email jobs (ENG-01, ENG-02).
 * Called from cron route — requires AWS SES for live sends.
 */
import { pool } from '../lib/db.js';
import { sendEmail } from '../lib/email.js';
import { wasEmailSentRecently, logEmailSent } from './emailLogService.js';

function prefsAllow(prefs, key) {
  if (!prefs || typeof prefs !== 'object') return true;
  if (prefs[key] === false) return false;
  if (prefs.activity_notifications === false && key.startsWith('activity')) return false;
  return true;
}

export async function runStreakRecoveryEmails() {
  const results = { sent: 0, skipped: 0, errors: 0 };

  try {
    const { rows } = await pool.query(`
      SELECT ds.user_id, ds.streak_days, ds.longest_streak, u.email, up.notification_prefs
      FROM discipline_streaks ds
      JOIN users u ON u.id = ds.user_id
      LEFT JOIN user_profiles up ON up.user_id = ds.user_id
      WHERE ds.last_reset_at >= NOW() - INTERVAL '1 day'
        AND ds.last_reset_at < NOW()
        AND ds.streak_days = 0
        AND ds.longest_streak >= 3
    `);

    for (const row of rows) {
      if (!row.email) { results.skipped++; continue; }
      if (!prefsAllow(row.notification_prefs, 'activity_notifications')) { results.skipped++; continue; }
      if (await wasEmailSentRecently(row.user_id, 'streak_recovery', 48)) { results.skipped++; continue; }

      try {
        const res = await sendEmail(row.email, 'streak_recovery', {
          streak_days: String(row.longest_streak || row.streak_days),
          user_id: row.user_id,
        });
        await logEmailSent(row.user_id, 'streak_recovery', res.messageId);
        results.sent++;
      } catch {
        results.errors++;
      }
    }
  } catch (err) {
    console.error('[reEngagement] streak recovery:', err.message);
  }

  return results;
}

export async function runIdleUserEmails() {
  const results = { day3: 0, day7: 0, day14: 0, skipped: 0 };

  const intervals = [
    { days: 3, type: 'idle_day3' },
    { days: 7, type: 'idle_day7' },
    { days: 14, type: 'idle_day14' },
  ];

  for (const { days, type } of intervals) {
    try {
      const { rows } = await pool.query(
        `SELECT u.id AS user_id, u.email, up.notification_prefs
         FROM users u
         LEFT JOIN user_profiles up ON up.user_id = u.id
         WHERE u.last_seen IS NOT NULL
           AND u.last_seen::date = (CURRENT_DATE - $1::int)
           AND u.email IS NOT NULL`,
        [days]
      );

      for (const row of rows) {
        if (!prefsAllow(row.notification_prefs, 'activity_notifications')) { results.skipped++; continue; }
        if (await wasEmailSentRecently(row.user_id, type, 168)) { results.skipped++; continue; }

        try {
          const res = await sendEmail(row.email, type, { user_id: row.user_id });
          await logEmailSent(row.user_id, type, res.messageId);
          results[type] = (results[type] || 0) + 1;
        } catch {
          /* continue */
        }
      }
    } catch (err) {
      console.warn(`[reEngagement] ${type}:`, err.message);
    }
  }

  return results;
}
