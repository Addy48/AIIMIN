import fs from 'fs';
import { pool } from './lib/googleClient.js';

const runTriggerMigration = async () => {
    try {
        const migration = fs.readFileSync(new URL('./migrations_v3.5_trigger.sql', import.meta.url), 'utf-8');
        await pool.query(migration);
        console.log('Trigger updated successfully');
    } catch (error) {
        console.error('Error updating trigger:', error);
    } finally {
        await pool.end();
        process.exit();
    }
};

runTriggerMigration();
