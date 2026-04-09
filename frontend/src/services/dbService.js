/**
 * dbService.js — Centralized Supabase write layer.
 *
 * Every mutation goes through here so errors are NEVER silent:
 * - Always calls .select() so the response includes the affected rows
 * - Throws a descriptive Error on any Supabase error
 *
 * Components should catch errors and surface them with toast.error().
 */
import supabase from '../utils/supabase';

/** Insert one or more rows; returns the inserted records. */
export async function insertRow(table, payload) {
    const { data, error } = await supabase.from(table).insert(payload).select();
    if (error) throw new Error(`[db:insert:${table}] ${error.message}`);
    return data;
}

/**
 * Update rows where col = val (and optionally extraCol = extraVal).
 * Returns the updated records.
 */
export async function updateRow(table, payload, col, val, extraCol, extraVal) {
    let q = supabase.from(table).update(payload).eq(col, val);
    if (extraCol !== undefined) q = q.eq(extraCol, extraVal);
    const { data, error } = await q.select();
    if (error) throw new Error(`[db:update:${table}] ${error.message}`);
    return data;
}

/**
 * Upsert a row (insert or update on conflict column(s)).
 * Returns the upserted records.
 */
export async function upsertRow(table, payload, onConflict) {
    const opts = onConflict ? { onConflict } : {};
    const { data, error } = await supabase.from(table).upsert(payload, opts).select();
    if (error) throw new Error(`[db:upsert:${table}] ${error.message}`);
    return data;
}

/**
 * Delete rows where col = val (and optionally extraCol = extraVal).
 */
export async function deleteRow(table, col, val, extraCol, extraVal) {
    let q = supabase.from(table).delete().eq(col, val);
    if (extraCol !== undefined) q = q.eq(extraCol, extraVal);
    const { error } = await q;
    if (error) throw new Error(`[db:delete:${table}] ${error.message}`);
}
