import XLSX from 'xlsx';

try {
    const workbook = XLSX.readFile('/Users/aaditya/Desktop/Money Manager_19-05-26.xlsx');
    console.log('Sheet names:', workbook.SheetNames);
    
    // Let's print the first sheet's content
    workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        console.log(`\n--- Sheet: ${sheetName} ---`);
        console.log(`Total rows: ${rows.length}`);
        console.log('First 5 rows:');
        rows.slice(0, 5).forEach((row, i) => {
            console.log(`  Row ${i + 1}:`, row);
        });
    });
} catch (error) {
    console.error('Error reading xlsx:', error);
}
