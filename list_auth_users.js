import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  if (error) throw error;
  console.log("Auth Users:", users.map(u => ({ id: u.id, email: u.email, metadata: u.user_metadata })));
}
main().catch(console.error);
