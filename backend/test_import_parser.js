import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

// Helper: Parse Excel numeric serial or standard string dates
const parseExcelDate = (val) => {
    if (!val) return new Date().toISOString().split('T')[0];
    if (typeof val === 'number') {
        const date = new Date(Math.round((val - 25569) * 86400 * 1000));
        if (!isNaN(date.getTime())) return date.toISOString().split('T')[0];
    }
    if (typeof val === 'string') {
        const cleanStr = val.trim();
        let parts = cleanStr.match(/^(\d{1,2})[-./](\d{1,2})[-./](\d{4})$/);
        if (parts) {
            const d = new Date(parseInt(parts[3], 10), parseInt(parts[2], 10) - 1, parseInt(parts[1], 10));
            if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
        }
        parts = cleanStr.match(/^(\d{4})[-./](\d{1,2})[-./](\d{1,2})$/);
        if (parts) {
            const d = new Date(parseInt(parts[1], 10), parseInt(parts[2], 10) - 1, parseInt(parts[3], 10));
            if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
        }
        parts = cleanStr.match(/^(\d{1,2})[-./](\d{1,2})[-./](\d{2})$/);
        if (parts) {
            const year = 2000 + parseInt(parts[3], 10);
            const d = new Date(year, parseInt(parts[2], 10) - 1, parseInt(parts[1], 10));
            if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
        }
    }
    try {
        const d = new Date(val);
        if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
    } catch (e) {}
    return new Date().toISOString().split('T')[0];
};

const testFile = (filePath) => {
    console.log(`\n==================================================`);
    console.log(`TESTING FILE: ${filePath}`);
    console.log(`==================================================`);

    if (!fs.existsSync(filePath)) {
        console.error(`File does not exist: ${filePath}`);
        return;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    for (const sheetName of workbook.SheetNames) {
        console.log(`\n--- Sheet: "${sheetName}" ---`);
        const worksheet = workbook.Sheets[sheetName];
        const sheetRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (!sheetRows || sheetRows.length === 0) {
            console.log('Empty sheet.');
            continue;
        }

        // Locate header row dynamically
        let headerIndex = -1;
        for (let i = 0; i < sheetRows.length; i++) {
            const row = sheetRows[i];
            if (!Array.isArray(row) || row.length === 0) continue;

            let score = 0;
            row.forEach(cell => {
                if (typeof cell !== 'string' && typeof cell !== 'number') return;
                const clean = String(cell).toLowerCase().trim();
                if (['date', 'datum', 'time', 'when', 'timestamp'].includes(clean)) score += 3;
                if (['amount', 'spend', 'spent', 'sum', 'value', 'price', 'cost', 'charge', 'total', 'inr', 'usd'].includes(clean)) score += 3;
                if (['category', 'class', 'group', 'type', 'tag', 'cat'].includes(clean)) score += 2;
                if (['note', 'notes', 'description', 'desc', 'comment', 'memo', 'info', 'detail', 'details', 'particulars'].includes(clean)) score += 2;
                if (['account', 'wallet', 'asset', 'mode', 'source', 'payment', 'bank', 'card'].includes(clean)) score += 2;
            });

            if (score >= 4) {
                headerIndex = i;
                break;
            }
        }

        if (headerIndex === -1) {
            headerIndex = sheetRows.findIndex(row =>
                Array.isArray(row) && row.filter(cell => cell !== null && cell !== undefined && cell !== '').length >= 2
            );
        }

        if (headerIndex === -1) {
            console.log('No headers found.');
            continue;
        }

        console.log(`Detected header row index: ${headerIndex}`);
        const headers = sheetRows[headerIndex].map(h => String(h || '').toLowerCase().trim());
        console.log(`Headers:`, headers);

        const findColumnIndex = (aliases) => {
            for (const alias of aliases) {
                const idx = headers.findIndex(h => h.includes(alias));
                if (idx !== -1) return idx;
            }
            return -1;
        };

        const colMap = {
            date: findColumnIndex(['date', 'datum', 'time', 'when', 'timestamp']),
            amount: findColumnIndex(['amount', 'spend', 'spent', 'sum', 'value', 'price', 'cost', 'charge', 'total', 'inr', 'usd']),
            category: findColumnIndex(['category', 'class', 'group', 'tag', 'cat']),
            description: findColumnIndex(['note', 'notes', 'description', 'desc', 'comment', 'memo', 'info', 'detail', 'details', 'particulars']),
            account: findColumnIndex(['card/bank/wallet', 'account', 'wallet', 'bank', 'card', 'mode', 'source', 'payment', 'asset']),
            type: findColumnIndex(['transaction type', 'income/expense', 'credit/debit', 'type', 'kind'])
        };

        console.log('Column Map:', colMap);

        const parsedTransactions = [];

        for (let r = headerIndex + 1; r < sheetRows.length; r++) {
            const row = sheetRows[r];
            if (!Array.isArray(row) || row.length === 0) continue;

            const rawDate = colMap.date !== -1 ? row[colMap.date] : null;
            const rawAmount = colMap.amount !== -1 ? row[colMap.amount] : null;
            const rawCategory = colMap.category !== -1 ? row[colMap.category] : null;
            const rawDesc = colMap.description !== -1 ? row[colMap.description] : null;
            const rawAccount = colMap.account !== -1 ? row[colMap.account] : null;
            const rawType = colMap.type !== -1 ? row[colMap.type] : null;

            if (rawAmount === null || rawAmount === undefined || rawAmount === '') continue;
            let amountVal = parseFloat(String(rawAmount).replace(/[^0-9.-]/g, ''));
            if (isNaN(amountVal)) continue;

            let parsedDate = parseExcelDate(rawDate);
            let categoryVal = String(rawCategory || 'Other').trim();
            categoryVal = categoryVal.replace(/\s+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

            let descVal = rawDesc ? String(rawDesc).trim() : '';
            let accountVal = rawAccount ? String(rawAccount).trim() : 'Unknown';

            let typeVal = 'expense';
            if (rawType) {
                const cleanType = String(rawType).toLowerCase().trim();
                if (cleanType.includes('inc') || cleanType.includes('inflow') || cleanType.includes('credit')) {
                    typeVal = 'income';
                } else if (cleanType.includes('exp') || cleanType.includes('outflow') || cleanType.includes('debit')) {
                    typeVal = 'expense';
                } else if (cleanType.includes('trans')) {
                    typeVal = 'transfer';
                }
            } else {
                const catLower = categoryVal.toLowerCase();
                if (catLower.includes('income') || catLower.includes('salary') || catLower.includes('wage') || catLower.includes('dividend') || catLower.includes('interest')) {
                    typeVal = 'income';
                } else if (amountVal < 0) {
                    typeVal = 'expense';
                }
            }

            let finalAmount = Math.abs(amountVal);
            if (typeVal === 'expense') {
                finalAmount = -finalAmount;
            }

            parsedTransactions.push({
                date: parsedDate,
                amount: finalAmount,
                category: categoryVal,
                description: descVal,
                account: accountVal,
                type: typeVal
            });
        }

        console.log(`Total transactions parsed: ${parsedTransactions.length}`);
        console.log('First 5 parsed transactions:', parsedTransactions.slice(0, 5));
    }
};

const run = () => {
    testFile('./temp_sheets/Money Manager_19-05-26.xlsx');
    testFile('./temp_sheets/Findet_Transactions_2026-05-19_2210.csv');
    testFile('./temp_sheets/Findet_Category-Spends_2026-05-19_2210.csv');
};

run();
