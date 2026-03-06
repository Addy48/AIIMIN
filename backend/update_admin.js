import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});

async function run() {
    const adminEmail = process.env.DEV_EMAIL || 'aadityaupadhyay10@gmail.com';

    let adminUser;

    console.log(`Fetching users to find admin email: ${adminEmail}...`);
    const dbRes = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $2', [adminEmail, 'AU4803']);

    if (dbRes.rows.length > 0) {
        let user = dbRes.rows.find(r => r.email === adminEmail) || dbRes.rows.find(r => r.username === 'AU4803');
        adminUser = { id: user.id, email: user.email };
        console.log(`Found DB user: ${user.id} (${user.email})`);
    }

    if (adminUser) {
        console.log('Admin user found. Updating password...');
        const { data, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            adminUser.id,
            { password: 'Aaditya@05', user_metadata: { username: 'AU4803' } }
        );
        if (updateError) throw updateError;
        console.log('Password updated.');
    } else {
        console.log('Admin user not found in DB! Creating one...');
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email: adminEmail,
            password: 'Aaditya@05',
            email_confirm: true,
            user_metadata: { username: 'AU4803', full_name: 'Admin' }
        });
        if (error) throw error;
        adminUser = data.user;
        console.log('Created user:', adminUser.id);
    }

    // Update username in public.users table
    try {
        await pool.query('UPDATE users SET username = $1 WHERE id = $2', ['AU4803', adminUser.id]);
        console.log('Updated username to AU4803 in DB users table');
    } catch (dbErr) {
        console.log('DB error:', dbErr.message);
    }

    console.log('Admin credentials updated successfully!');
    console.log(`Username: AU4803\nEmail: ${adminEmail}\nPassword: Aaditya@05`);
    process.exit(0);
}

run().catch(console.error);
