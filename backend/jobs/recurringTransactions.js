/**
 * jobs/recurringTransactions.js
 *
 * Daily cron job: generates money_transactions from recurring entries
 * whose next_due_date <= today (in Asia/Kolkata timezone).
 */

import { DateTime } from 'luxon';
import logger from '../lib/logger.js';

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

export async function runRecurringTransactions(supabase) {
    const today = todayIST();
    logger.info(`[recurring] Running for date: ${today} (IST)`);

    // Fetch all active recurring entries due today or earlier
    const { data: dueEntries, error: fetchErr } = await supabase
        .from('recurring')
        .select(`
            *,
            category:money_categories(name)
        `)
        .eq('active', true)
        .lte('next_due_date', today)
        .order('next_due_date', { ascending: true });

    if (fetchErr) {
        logger.error(`[recurring] Error fetching entries: ${fetchErr.message}`);
        return;
    }

    logger.info(`[recurring] Found ${dueEntries.length} due entries`);
    let created = 0;
    let skipped = 0;

    for (const entry of dueEntries) {
        const categoryName = entry.category?.name || 'Other';
        
        // Idempotency: check if a transaction was already created today for this recurring entry
        const { data: existing, error: existErr } = await supabase
            .from('money_transactions')
            .select('id')
            .eq('user_id', entry.user_id)
            .eq('date', entry.next_due_date)
            .eq('description', `[recurring] ${entry.name}`)
            .eq('source', 'recurring')
            .maybeSingle();

        if (existErr) {
            logger.error(`[recurring] Idempotency check failed for ${entry.name}: ${existErr.message}`);
            continue;
        }

        if (existing) {
            logger.info(`[recurring] Skipping (already exists): ${entry.name} on ${entry.next_due_date}`);
            skipped++;
        } else {
            // Create the transaction
            const { error: insErr } = await supabase
                .from('money_transactions')
                .insert({
                    user_id: entry.user_id,
                    date: entry.next_due_date,
                    category: categoryName,
                    category_id: entry.category_id || null,
                    amount: entry.amount,
                    description: `[recurring] ${entry.name}`,
                    source: 'recurring'
                });

            if (insErr) {
                logger.error(`[recurring] Failed to create transaction for ${entry.name}: ${insErr.message}`);
            } else {
                logger.info(`[recurring] Created: ${entry.name} — ₹${entry.amount} on ${entry.next_due_date}`);
                created++;
            }
        }

        // Advance next_due_date regardless (handles catch-up for missed runs)
        const nextDue = computeNextDueDate(entry.next_due_date, entry.frequency);
        const { error: updErr } = await supabase
            .from('recurring')
            .update({ next_due_date: nextDue })
            .eq('id', entry.id);

        if (updErr) {
            logger.error(`[recurring] Failed to update next_due_date for ${entry.name}: ${updErr.message}`);
        }
    }

    return { created, skipped, total: dueEntries.length };
}
