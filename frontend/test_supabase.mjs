import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: 'frontend/.env' });

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
let serviceKey = null;
try {
    dotenv.config({ path: 'backend/.env' });
    serviceKey = process.env.SUPABASE_SERVICE_KEY;
} catch (e) { }

const supabase = createClient(supabaseUrl, serviceKey || supabaseKey);

async function test() {
    console.log('Fetching money_transactions...');
    const { data: mt, error } = await supabase.from('money_transactions').select('*');
    if (error) console.error('Error MT:', error.message);
    else console.log('MT Rows:', mt);

    const { data: users, error: errU } = await supabase.from('users').select('*');
    if (errU) console.error('Error U:', errU.message);
    else console.log('Public Users:', users);
}
test();
