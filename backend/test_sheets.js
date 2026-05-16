import XLSX from 'xlsx';
import fs from 'fs';

const inspectFile = (path) => {
    console.log(`\n================ INSPECTING: ${path} ================`);
    if (!fs.existsSync(path)) {
        console.error(`File does not exist: ${path}`);
        return;
    }

    const fileBuffer = fs.readFileSync(path);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    console.log('Sheet Names:', workbook.SheetNames);

    for (const name of workbook.SheetNames) {
        console.log(`\n--- Sheet: ${name} ---`);
        const sheet = workbook.Sheets[name];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        if (rows.length === 0) {
            console.log('Empty sheet');
            continue;
        }

        console.log(`Total rows: ${rows.length}`);
        
        // Print first 5 rows
        for (let i = 0; i < Math.min(10, rows.length); i++) {
            console.log(`Row ${i}:`, rows[i]);
        }
    }
};

inspectFile('temp_sheets/Money Manager_19-05-26.xlsx');
inspectFile('temp_sheets/Findet_Category-Spends_2026-05-19_2210.csv');
inspectFile('temp_sheets/Findet_Transactions_2026-05-19_2210.csv');
