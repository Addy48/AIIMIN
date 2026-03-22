import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Admin client with service-role key for privileged operations
// (user management, auth admin, etc.)
const supabaseAdmin = createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default supabase;
export { supabaseAdmin };
