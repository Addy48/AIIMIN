import XLSX from 'xlsx';
import fs from 'fs';

const path = '/Users/aaditya/Desktop/Money Manager_19-05-26.xlsx';
const fileBuffer = fs.readFileSync(path);
const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
const sheet = workbook.Sheets['Money Manager'];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

console.log('Finding transfer rows:');
rows.forEach((row, idx) => {
    if (idx > 0 && String(row[6]).toLowerCase().includes('trans')) {
        console.log(`Row ${idx}:`, row);
    }
});
