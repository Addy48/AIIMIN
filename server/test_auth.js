import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yubxgftugxbwtywyhcsv.supabase.co';
const supabaseAnonKey = 'REDACTED_SUPABASE_PUBLISHABLE_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'au48@aiimin.com',
    password: '222222'
  });
  console.log(error ? 'Error: ' + error.message : 'Success! User ID: ' + data.user.id);
}
testAuth();
