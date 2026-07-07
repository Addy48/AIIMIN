import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Anon Key. Please check the environment variables.');
}

// PKCE is the recommended SPA flow (Chrome, Firefox, Safari, Edge, mobile).
// detectSessionInUrl handles both ?code= (PKCE) and legacy #access_token= redirects.
const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder', {
    auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
});

export default supabase;
export { supabase };
