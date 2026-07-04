/**
 * Weekly digest email job (ENG-03) — real user stats + template.
 */
import { pool } from '../lib/db.js';
import { sendEmail } from '../lib/email.js';
import { wasEmailSentRecently, logEmailSent } from './emailLogService.js';

async function getWeeklyStats(userId) {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const since = weekStart.toISOString().split('T')[0];

  const [habitsRes, focusRes, journalRes, spendRes] = await Promise.all([
    pool.query(
      `SELECT COUNT(*)::int AS total FROM habits WHERE user_id = $1`,
      [userId],
    ).catch(() => ({ rows: [{ total: 0 }] })),
    pool.query(
      `SELECT COALESCE(SUM(duration_minutes), 0)::int AS mins
       FROM pomodoro_sessions
       WHERE user_id = $1 AND completed_at >= $2::date`,
      [userId, since],
    ).catch(() => ({ rows: [{ mins: 0 }] })),
    pool.query(
      `SELECT COUNT(*)::int AS entries
       FROM journal_entries
       WHERE user_id = $1 AND date >= $2::date`,
      [userId, since],
    ).catch(() => ({ rows: [{ entries: 0 }] })),
    pool.query(
      `SELECT COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0)::numeric AS spent
       FROM money_transactions
       WHERE user_id = $1 AND date >= $2::date`,
      [userId, since],
    ).catch(() => ({ rows: [{ spent: 0 }] })),
  ]);

  const streakRes = await pool.query(
    `SELECT streak_days FROM discipline_streaks WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
    [userId],
  ).catch(() => ({ rows: [{ streak_days: 0 }] }));

  return {
    habit_count: habitsRes.rows[0]?.total || 0,
    focus_hours: Math.round((focusRes.rows[0]?.mins || 0) / 60),
    journal_entries: journalRes.rows[0]?.entries || 0,
    net_spend: Number(spendRes.rows[0]?.spent || 0).toFixed(0),
    streak_days: streakRes.rows[0]?.streak_days || 0,
  };
}

export async function runWeeklyDigestEmails() {
  const results = { sent: 0, skipped: 0, errors: 0 };

  try {
    const { rows } = await pool.query(`
      SELECT u.id AS user_id, u.email, up.notification_prefs, up.ai_tone
      FROM users u
      LEFT JOIN user_profiles up ON up.user_id = u.id
      WHERE u.last_seen >= NOW() - INTERVAL '7 days'
        AND u.email IS NOT NULL
    `);

    for (const row of rows) {
      const prefs = row.notification_prefs || {};
      if (prefs.weekly_digest === false) { results.skipped++; continue; }
      if (await wasEmailSentRecently(row.user_id, 'weekly_digest', 144)) { results.skipped++; continue; }

      try {
        const stats = await getWeeklyStats(row.user_id);
        const res = await sendEmail(row.email, 'weekly_digest', {
          ...stats,
          ai_tone: row.ai_tone || 'motivating',
        });
        await logEmailSent(row.user_id, 'weekly_digest', res.messageId, stats);
        results.sent++;
      } catch {
        results.errors++;
      }
    }
  } catch (err) {
    console.error('[weeklyDigest]', err.message);
  }

  return results;
}
