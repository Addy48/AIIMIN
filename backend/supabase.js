/**
 * backend/supabase.js
 * 
 * Compatibility shim for Cloudflare Workers migration.
 * Routes imports to lib/db.js.
 */
import { supabase, supabaseAdmin } from './lib/db.js';

export { supabaseAdmin };
export default supabase;
