/**
 * Document expiry alert emails (ENG-08 / P7).
 */
import { pool } from '../lib/db.js';
import { sendEmail } from '../lib/email.js';
import { wasEmailSentRecently, logEmailSent } from './emailLogService.js';

export async function runDocumentExpiryEmails() {
  const results = { sent: 0, skipped: 0, errors: 0 };

  try {
    const { rows } = await pool.query(`
      SELECT fd.id AS doc_id, fd.doc_type, fd.expiry_date, fd.user_id, u.email,
             fm.name AS member_name
      FROM family_documents fd
      JOIN users u ON u.id = fd.user_id
      LEFT JOIN family_members fm ON fm.id = fd.member_id
      WHERE fd.expiry_date IS NOT NULL
        AND fd.expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
        AND u.email IS NOT NULL
    `);

    for (const row of rows) {
      const daysUntil = Math.ceil((new Date(row.expiry_date) - new Date()) / 86400000);
      const dedupeKey = `document_expiry:${row.doc_id}:${daysUntil <= 7 ? '7' : daysUntil <= 14 ? '14' : '30'}`;
      if (await wasEmailSentRecently(row.user_id, dedupeKey, 168)) {
        results.skipped++;
        continue;
      }

      try {
        const res = await sendEmail(row.email, 'document_expiry', {
          doc_type: row.doc_type,
          member_name: row.member_name || 'Family member',
          expiry_date: row.expiry_date,
          days_until: daysUntil,
        });
        await logEmailSent(row.user_id, dedupeKey, res.messageId, { doc_id: row.doc_id });
        results.sent++;
      } catch {
        results.errors++;
      }
    }
  } catch (err) {
    console.error('[documentExpiry]', err.message);
  }

  return results;
}
