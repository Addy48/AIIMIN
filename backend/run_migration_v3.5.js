import fs from 'fs';
import { pool } from './lib/googleClient.js';

const runMigration = async () => {
    try {
        const migration = fs.readFileSync(new URL('./migrations_v3.5.sql', import.meta.url), 'utf-8');
        await pool.query(migration);
        console.log('Migration v3.5 completed successfully');
    } catch (error) {
        console.error('Error running migration v3.5:', error);
    } finally {
        await pool.end();
        process.exit();
    }
};

runMigration();
