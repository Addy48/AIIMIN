import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const { data: users, error } = await supabase.from('users').select('*');
  if (error) throw error;
  console.log("Public Users:", users);
  process.exit(0);
}
main().catch(console.error);
