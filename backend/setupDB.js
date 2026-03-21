import fs from 'fs';
import { pool } from './lib/googleClient.js';

const setupDB = async () => {
    try {
        const schema = fs.readFileSync(new URL('./supabase_init.sql', import.meta.url), 'utf-8');
        await pool.query(schema);
        console.log('Supabase schema applied successfully');
    } catch (error) {
        console.error('Error applying supabase_init.sql:', error);
        process.exit(1);
    } finally {
        await pool.end();
        process.exit(0);
    }
};

setupDB();
