/**
 * lib/db.js
 * 
 * Central database connector for Cloudflare Workers.
 * Refactored to handle global process.env or direct env binding.
 */
import { createClient } from '@supabase/supabase-js';

// We rely on index.js setting globalThis.process.env from the Cloudflare 'env' object
const initClient = () => {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

    if (!url || !key) {
        // Fallback for initialization phase / local dev without proper env but using nodejs_compat
        return null;
    }
    return createClient(url, key);
};

const supabase = initClient();
const supabaseAdmin = supabase; // Standardized for privileged operations

export { supabase, supabaseAdmin };
export default supabase;
