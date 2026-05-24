import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  // First update auth.users to have username
  const { data: authUsers } = await supabase.auth.admin.listUsers();
  const targetUser = authUsers.users.find(u => u.email === 'aadityaupadhyay10@gmail.com');
  
  if (targetUser) {
    await supabase.auth.admin.updateUserById(targetUser.id, {
      user_metadata: { ...targetUser.user_metadata, username: 'AU48' }
    });
    console.log("Updated auth metadata for", targetUser.email);
    
    // Now insert into public.users bypassing RLS
    const { data: inserted, error } = await supabase.from('users').upsert({
      id: targetUser.id,
      email: targetUser.email,
      full_name: 'Aaditya Upadhyay',
      username: 'AU48',
      role: 'user',
      onboarding_stage: 0
    }).select();
    
    if (error) console.error("Error inserting into public.users:", error);
    else console.log("Inserted into public.users:", inserted);
  } else {
    console.log("User not found in auth.users");
  }
}
main().catch(console.error);
