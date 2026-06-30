/**
 * One-off user bootstrap — copy to scripts/create-user.mjs and set env vars.
 * Never commit real credentials.
 *
 * Required env (root .env):
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   CREATE_USER_EMAIL
 *   CREATE_USER_PASSWORD
 */
import { createClient } from '@supabase/supabase-js';
import { requireEnv } from './lib/load-env.mjs';

const supabase = createClient(
  requireEnv('SUPABASE_URL'),
  requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const email = requireEnv('CREATE_USER_EMAIL');
const password = requireEnv('CREATE_USER_PASSWORD');

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: {
    full_name: process.env.CREATE_USER_FULL_NAME || 'User',
    username: process.env.CREATE_USER_USERNAME || 'user',
  },
});

if (error) {
  console.error('Error creating user:', error.message);
  process.exit(1);
}

console.log('User created:', data.user?.id, data.user?.email);
process.exit(0);
