/**
 * lib/db.js
 * 
 * Central database connector for Cloudflare Workers.
 * Refactored to handle global process.env or direct env binding.
 */
import { createClient } from '@supabase/supabase-js';

// We rely on index.js setting globalThis.process.env from the Cloudflare 'env' object.
// Using a Proxy/Getter ensures we don't initialize with undefined during module load.
let _supabase = null;

const getSupabase = () => {
    if (_supabase) return _supabase;

    const url = globalThis.process?.env?.SUPABASE_URL;
    const key = globalThis.process?.env?.SUPABASE_SERVICE_ROLE_KEY || globalThis.process?.env?.SUPABASE_SERVICE_KEY;

    if (!url || !key) {
        // Return a proxy that throws on use, or null
        return null;
    }
    
    _supabase = createClient(url, key);
    return _supabase;
};

// Export as a getter proxy to maintain the 'import { supabase }' syntax
export const supabase = new Proxy({}, {
    get: (target, prop) => {
        const client = getSupabase();
        if (!client) {
            throw new Error(`Supabase client not initialized. Missing env vars? Attempted to access: ${prop}`);
        }
        return client[prop];
    }
});

export const supabaseAdmin = supabase;
export default supabase;

