import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;

// Check both names for compatibility with different dashboard setups
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase;
let supabaseAdmin;

if (!supabaseUrl || !supabaseServiceKey) {
    if (process.env.NODE_ENV === 'production') {
        console.error('[CRITICAL] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from environment variables.');
    }
    // Return null to allow the BOOT CHECK in index.js to handle the error message gracefully
    supabase = null;
    supabaseAdmin = null;
} else {
    // Base client for general operations
    supabase = createClient(supabaseUrl, supabaseServiceKey);
    // Admin client for privileged operations
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
}

export default supabase;
export { supabaseAdmin };
