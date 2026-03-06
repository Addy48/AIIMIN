/**
 * jobs/recurringTransactions.js
 *
 * Daily cron job: generates money_transactions from recurring entries
 * whose next_due_date <= today (in Asia/Kolkata timezone).
 *
 * Design:
 *  - Idempotent: checks for an existing transaction on the same date before inserting.
 *  - NEVER triggered on page load — only runs as a scheduled job.
 *  - Updates next_due_date after each insertion.
 *
 * Suggested Railway schedule: 0 1 * * *  (01:00 UTC = 06:30 IST — before morning use)
 *
 * Run manually:
 *   node --experimental-vm-modules jobs/recurringTransactions.js
 */

import pg from 'pg';
import dotenv from 'dotenv';
import { DateTime } from 'luxon';
import logger from '../lib/logger.js';

dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const USER_TZ = 'Asia/Kolkata';

/** Returns today's date string in IST */
const todayIST = () => DateTime.now().setZone(USER_TZ).toISODate();

/**
 * Compute next due date from a given date and frequency.
 */
function computeNextDueDate(currentDue, frequency) {
    const dt = DateTime.fromISO(currentDue, { zone: USER_TZ });
    switch (frequency) {
        case 'daily':   return dt.plus({ days: 1 }).toISODate();
        case 'weekly':  return dt.plus({ weeks: 1 }).toISODate();
        case 'monthly': return dt.plus({ months: 1 }).toISODate();
        case 'yearly':  return dt.plus({ years: 1 }).toISODate();
        default:        return dt.plus({ months: 1 }).toISODate();
    }
}

async function generateDueTransactions(client) {
    const today = todayIST();
    logger.info(`[recurring] Running for date: ${today} (IST)`);

    // Fetch all active recurring entries due today or earlier
    const { rows: dueEntries } = await client.query(
        `SELECT r.*, mc.name AS category_name
         FROM recurring r
         LEFT JOIN money_categories mc ON mc.id = r.category_id
         WHERE r.active = true
           AND r.next_due_date <= $1
         ORDER BY r.next_due_date ASC`,
        [today]
    );

    logger.info(`[recurring] Found ${dueEntries.length} due entries`);
    let created = 0;
    let skipped = 0;

    for (const entry of dueEntries) {
        // Idempotency: check if a transaction was already created today for this recurring entry
        const { rows: existing } = await client.query(
            `SELECT id FROM money_transactions
             WHERE user_id = $1
               AND date = $2
               AND description = $3
               AND source = 'recurring'`,
            [entry.user_id, entry.next_due_date, `[recurring] ${entry.name}`]
        );

        if (existing.length > 0) {
            logger.info(`[recurring] Skipping (already exists): ${entry.name} on ${entry.next_due_date}`);
            skipped++;
        } else {
            // Create the transaction
            await client.query(
                `INSERT INTO money_transactions (user_id, date, category, category_id, amount, description, source)
                 VALUES ($1, $2, $3, $4, $5, $6, 'recurring')`,
                [
                    entry.user_id,
                    entry.next_due_date,
                    entry.category_name || 'Other',
                    entry.category_id || null,
                    entry.amount,
                    `[recurring] ${entry.name}`,
                ]
            );
            logger.info(`[recurring] Created: ${entry.name} — ₹${entry.amount} on ${entry.next_due_date}`);
            created++;
        }

        // Advance next_due_date regardless (handles catch-up for missed runs)
        const nextDue = computeNextDueDate(entry.next_due_date, entry.frequency);
        await client.query(
            `UPDATE recurring SET next_due_date = $1 WHERE id = $2`,
            [nextDue, entry.id]
        );
    }

    return { created, skipped, total: dueEntries.length };
}

async function main() {
    const client = await pool.connect();
    try {
        const result = await generateDueTransactions(client);
        logger.info(`[recurring] Done — created: ${result.created}, skipped: ${result.skipped}`);
        process.exit(0);
    } catch (err) {
        logger.error(`[recurring] Fatal error: ${err.message}`, { stack: err.stack });
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

main();
