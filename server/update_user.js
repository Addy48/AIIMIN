import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '/Users/aaditya/Desktop/DASHBOARD PROJECT/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing URL or SERVICE KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateUser() {
  console.log("Searching for user au48@aiimin.com...");
  
  // Update password for au48@aiimin.com
  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("Error listing users:", listError.message);
    return;
  }
  
  const user = usersData.users.find(u => u.email === 'au48@aiimin.com');
  if (!user) {
    console.error("User au48@aiimin.com not found. Let's create it!");
    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
      email: 'au48@aiimin.com',
      password: '222222',
      email_confirm: true,
      user_metadata: {
        username: 'AU48',
        full_name: 'Aaditya'
      }
    });
    if (createError) console.error("Create error:", createError.message);
    else console.log("Created successfully:", createData.user.id);
  } else {
    console.log("User found:", user.id, "Updating password...");
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: '222222', user_metadata: { username: 'AU48', full_name: 'Aaditya' } }
    );
    if (updateError) {
      console.error("Update error:", updateError.message);
    } else {
      console.log("Password updated successfully!");
    }
  }

  // Update public.users table using service role (bypasses RLS)
  const { error: dbError } = await supabase
    .from('users')
    .update({ full_name: 'Aaditya', username: 'AU48' })
    .eq('email', 'au48@aiimin.com');

  if (dbError) {
    console.error("DB update error:", dbError.message);
  } else {
    console.log("DB updated successfully!");
  }
}

updateUser();
