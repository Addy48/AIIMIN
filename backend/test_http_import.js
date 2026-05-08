import fs from 'fs';
import path from 'path';

async function testUpload(filePath, fileName) {
    console.log(`\n----------------------------------------`);
    console.log(`UPLOADING FILE: ${fileName} (${filePath})`);
    console.log(`----------------------------------------`);

    if (!fs.existsSync(filePath)) {
        console.error(`File does not exist: ${filePath}`);
        return;
    }

    const fileBuffer = fs.readFileSync(filePath);
    // Create Blob from buffer
    const blob = new Blob([fileBuffer], { type: 'application/octet-stream' });
    
    // Construct FormData
    const formData = new FormData();
    formData.append('file', blob, fileName);

    try {
        const response = await fetch('http://localhost:5002/api/wealth/import', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer mock-test-token'
            },
            body: formData
        });

        const status = response.status;
        const result = await response.json();
        console.log(`HTTP Status: ${status}`);
        console.log('Response Body:', JSON.stringify(result, null, 2));
    } catch (err) {
        console.error('Request failed:', err);
    }
}

async function run() {
    console.log('Starting HTTP API import verification tests against local Hono server on port 5002...');
    
    // 1. Upload Category Spends (Budgets)
    await testUpload('./temp_sheets/Findet_Category-Spends_2026-05-19_2210.csv', 'Findet_Category-Spends_2026-05-19_2210.csv');

    // 2. Upload Findet Transactions
    await testUpload('./temp_sheets/Findet_Transactions_2026-05-19_2210.csv', 'Findet_Transactions_2026-05-19_2210.csv');

    // 3. Upload Money Manager Excel
    await testUpload('./temp_sheets/Money Manager_19-05-26.xlsx', 'Money Manager_19-05-26.xlsx');

    // 4. Repeat Upload of Money Manager to verify duplicate checking
    console.log('\n--- VERIFYING DEDUPLICATION (RE-UPLOADING MONEY MANAGER) ---');
    await testUpload('./temp_sheets/Money Manager_19-05-26.xlsx', 'Money Manager_19-05-26.xlsx');
}

run();
