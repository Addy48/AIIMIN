import fs from 'fs';
import { pool } from './lib/googleClient.js';

const runMissingMigrations = async () => {
    try {
        console.log('Running Migration v2...');
        const v2 = fs.readFileSync(new URL('./migrations_v2.sql', import.meta.url), 'utf-8');
        await pool.query(v2);
        console.log('Migration v2 completed.');

        console.log('Running Migration v3...');
        const v3 = fs.readFileSync(new URL('./migrations_v3.sql', import.meta.url), 'utf-8');
        await pool.query(v3);
        console.log('Migration v3 completed.');

        console.log('Running Migration v3.5...');
        const v35 = fs.readFileSync(new URL('./migrations_v3.5.sql', import.meta.url), 'utf-8');
        await pool.query(v35);
        console.log('Migration v3.5 completed.');

    } catch (error) {
        console.error('Error running migrations:', error);
    } finally {
        await pool.end();
        process.exit();
    }
};

runMissingMigrations();
