import * as XLSX from 'xlsx';
import { pool } from '../lib/db.js';
import { parseExcelDate, cleanCategoryName } from './wealthImportHelpers.js';

export async function processSpreadsheetImport(userId, buffer) {
const workbook = XLSX.read(buffer, { type: 'buffer' });

let allParsedTransactions = [];
let allParsedBudgets = [];

// 1. Fetch current categories, accounts, and transactions for auto-resolution and deduplication
const categoriesRes = await pool.query(
    'SELECT * FROM public.money_categories WHERE user_id = $1 OR user_id IS NULL',
    [userId]
);
const accountsRes = await pool.query(
    'SELECT * FROM public.accounts WHERE user_id = $1 AND archived = false',
    [userId]
);
const transactionsRes = await pool.query(
    'SELECT date::text, amount, category, description FROM public.money_transactions WHERE user_id = $1',
    [userId]
);
const budgetsRes = await pool.query(
    'SELECT * FROM public.budgets WHERE user_id = $1',
    [userId]
);

let userCategories = categoriesRes.rows;
let userAccounts = accountsRes.rows;
let existingTransactions = transactionsRes.rows;
let existingBudgets = budgetsRes.rows;

// Tracks queued entities to create
const accountsCreatedInThisImport = new Map();
const categoriesCreatedInThisImport = new Map();

// Dynamic helper to resolve accounts locally
const resolveAccount = (accNameRaw) => {
    if (!accNameRaw) return null;
    const accName = String(accNameRaw).trim();
    const searchAcc = accName.toLowerCase();
    
    // 1. Check existing accounts in DB
    let matchedAcc = userAccounts.find(a =>
        a.name.toLowerCase().trim() === searchAcc ||
        a.name.toLowerCase().includes(searchAcc) ||
        searchAcc.includes(a.name.toLowerCase())
    );
    if (matchedAcc) return { id: matchedAcc.id, name: matchedAcc.name };

    // 2. Check accounts queued for creation in this import
    let queuedAcc = accountsCreatedInThisImport.get(searchAcc);
    if (queuedAcc) return { id: queuedAcc.tempId, name: accName };

    // 3. Queue new account
    const tempId = `temp-acc-${accountsCreatedInThisImport.size}`;
    accountsCreatedInThisImport.set(searchAcc, { tempId, name: accName });
    return { id: tempId, name: accName };
};

// Dynamic helper to resolve categories locally
const resolveCategory = (catNameRaw, catType = 'expense') => {
    const catName = cleanCategoryName(catNameRaw);
    if (!catName) return null;
    const searchCat = catName.toLowerCase().trim();

    // 1. Check existing categories in DB
    let matchedCat = userCategories.find(c => c.name.toLowerCase().trim() === searchCat);
    if (matchedCat) return { id: matchedCat.id, name: matchedCat.name };

    // 2. Check categories queued for creation in this import
    let queuedCat = categoriesCreatedInThisImport.get(searchCat);
    if (queuedCat) return { id: queuedCat.tempId, name: catName };

    // 3. Queue new category
    const tempId = `temp-cat-${categoriesCreatedInThisImport.size}`;
    categoriesCreatedInThisImport.set(searchCat, { tempId, name: catName, type: catType });
    return { id: tempId, name: catName };
};

// Iterate through all sheets to support multi-sheet or single-sheet files
for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const sheetRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (!sheetRows || sheetRows.length === 0) continue;

    // 2. Locate the header row dynamically
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

    // Fallback: use first row that has at least 2 non-empty values
    if (headerIndex === -1) {
        headerIndex = sheetRows.findIndex(row =>
            Array.isArray(row) && row.filter(cell => cell !== null && cell !== undefined && cell !== '').length >= 2
        );
    }

    if (headerIndex === -1) continue;

    const headers = sheetRows[headerIndex].map(h => String(h || '').toLowerCase().trim());

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

    const hasDateCol = colMap.date !== -1;
    const hasCategoryCol = colMap.category !== -1;
    const hasAmountOrBudget = colMap.amount !== -1 || headers.some(h => h.includes('budget') || h.includes('spent') || h.includes('spend'));

    const isBudgetSheet = !hasDateCol && hasCategoryCol && hasAmountOrBudget;

    if (isBudgetSheet) {
        // Parse Budget / Spent Summary Sheet
        const categoryIdx = colMap.category;
        const budgetIdx = headers.findIndex(h => h === 'budget');
        const spentIdx = headers.findIndex(h => h.includes('spent') || h.includes('spend'));

        for (let r = headerIndex + 1; r < sheetRows.length; r++) {
            const row = sheetRows[r];
            if (!Array.isArray(row) || row.length === 0) continue;

            const rawCategory = categoryIdx !== -1 ? row[categoryIdx] : null;
            const rawBudget = budgetIdx !== -1 ? row[budgetIdx] : null;
            const rawSpent = spentIdx !== -1 ? row[spentIdx] : null;

            if (!rawCategory) continue;

            let budgetAmt = null;
            if (rawBudget !== null && rawBudget !== undefined && rawBudget !== '') {
                budgetAmt = parseFloat(String(rawBudget).replace(/[^0-9.-]/g, ''));
            }
            if ((budgetAmt === null || isNaN(budgetAmt)) && rawSpent !== null && rawSpent !== undefined && rawSpent !== '') {
                budgetAmt = parseFloat(String(rawSpent).replace(/[^0-9.-]/g, ''));
            }

            if (budgetAmt === null || isNaN(budgetAmt)) continue;

            const categoryVal = cleanCategoryName(rawCategory);
            let catType = 'expense';
            const catLower = categoryVal.toLowerCase();
            if (catLower.includes('income') || catLower.includes('salary')) {
                catType = 'income';
            }

            const resolvedCat = resolveCategory(categoryVal, catType);
            if (!resolvedCat) continue;

            allParsedBudgets.push({
                user_id: userId,
                category_id: resolvedCat.id,
                category_name: categoryVal,
                amount: Math.abs(budgetAmt),
                period: 'monthly',
                start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
            });
        }
    } else {
        // Parse Transactions Sheet
        for (let r = headerIndex + 1; r < sheetRows.length; r++) {
            const row = sheetRows[r];
            if (!Array.isArray(row) || row.length === 0) continue;

            const rawDate = colMap.date !== -1 ? row[colMap.date] : null;
            const rawAmount = colMap.amount !== -1 ? row[colMap.amount] : null;
            const rawCategory = colMap.category !== -1 ? row[colMap.category] : null;
            const rawDesc = colMap.description !== -1 ? row[colMap.description] : null;
            const rawAccount = colMap.account !== -1 ? row[colMap.account] : null;
            const rawType = colMap.type !== -1 ? row[colMap.type] : null;

            // Validate Amount
            if (rawAmount === null || rawAmount === undefined || rawAmount === '') continue;
            let amountVal = parseFloat(String(rawAmount).replace(/[^0-9.-]/g, ''));
            if (isNaN(amountVal)) continue;

            // Date parsing
            let parsedDate = new Date().toISOString().split('T')[0];
            if (rawDate !== null && rawDate !== undefined && rawDate !== '') {
                parsedDate = parseExcelDate(rawDate);
            }

            // Description parsing
            let descVal = rawDesc ? String(rawDesc).trim() : '';

            // Type parsing (income / expense / transfer)
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
                // Infer from category if possible
                const catLower = String(rawCategory || '').toLowerCase().trim();
                if (catLower.includes('income') || catLower.includes('salary') || catLower.includes('wage') || catLower.includes('dividend') || catLower.includes('interest')) {
                    typeVal = 'income';
                } else if (amountVal < 0) {
                    typeVal = 'expense';
                }
            }

            if (typeVal === 'transfer') {
                // Transfer-Out: Source is rawAccount, Target/Destination is rawCategory
                const sourceAcc = resolveAccount(rawAccount || 'Cash');
                const targetAcc = resolveAccount(rawCategory);

                if (sourceAcc && targetAcc) {
                    const transferCat = resolveCategory('Transfer', 'transfer');
                    const transferCatId = transferCat ? transferCat.id : null;

                    // 1. Outflow transaction (transfer_out)
                    allParsedTransactions.push({
                        user_id: userId,
                        date: parsedDate,
                        category: 'Transfer',
                        category_id: transferCatId,
                        description: descVal ? `To: ${targetAcc.name} — ${descVal}` : `To: ${targetAcc.name}`,
                        amount: -Math.abs(amountVal),
                        source: 'import',
                        currency: 'INR',
                        type: 'transfer_out',
                        account_id: sourceAcc.id
                    });

                    // 2. Inflow transaction (transfer_in)
                    allParsedTransactions.push({
                        user_id: userId,
                        date: parsedDate,
                        category: 'Transfer',
                        category_id: transferCatId,
                        description: descVal ? `From: ${sourceAcc.name} — ${descVal}` : `From: ${sourceAcc.name}`,
                        amount: Math.abs(amountVal),
                        source: 'import',
                        currency: 'INR',
                        type: 'transfer_in',
                        account_id: targetAcc.id
                    });
                }
            } else {
                // Standard transaction logic
                const categoryVal = cleanCategoryName(rawCategory);
                const resolvedCat = resolveCategory(categoryVal, typeVal === 'income' ? 'income' : 'expense');
                const resolvedCatId = resolvedCat ? resolvedCat.id : null;

                const resolvedAcc = resolveAccount(rawAccount || 'Cash');
                const resolvedAccId = resolvedAcc ? resolvedAcc.id : null;

                let finalAmount = Math.abs(amountVal);
                if (typeVal === 'expense') {
                    finalAmount = -finalAmount;
                }

                allParsedTransactions.push({
                    user_id: userId,
                    date: parsedDate,
                    category: categoryVal,
                    category_id: resolvedCatId,
                    description: descVal || null,
                    amount: finalAmount,
                    source: 'import',
                    currency: 'INR',
                    type: typeVal,
                    account_id: resolvedAccId
                });
            }
        }
    }
}

if (allParsedTransactions.length === 0 && allParsedBudgets.length === 0) {
    return c.json({ error: 'No valid data found in the file.' }, 400);
}

// Process duplicate checks
let duplicateFreeTransactions = [];
if (allParsedTransactions.length > 0) {
    duplicateFreeTransactions = allParsedTransactions.filter(newT => {
        const isDup = existingTransactions.some(existing => {
            const dateMatches = existing.date.split('T')[0] === newT.date;
            const amountMatches = Math.abs(Number(existing.amount) - Number(newT.amount)) < 0.01;
            const catMatches = String(existing.category || '').toLowerCase().trim() === String(newT.category || '').toLowerCase().trim();
            const descMatches = String(existing.description || '').toLowerCase().trim() === String(newT.description || '').toLowerCase().trim();
            return dateMatches && amountMatches && catMatches && descMatches;
        });
        return !isDup;
    });
}

// Identify which temporary IDs are actually referenced by non-duplicates
const activeTempAccountIds = new Set();
const activeTempCategoryIds = new Set();

for (const tx of duplicateFreeTransactions) {
    if (String(tx.account_id).startsWith('temp-acc-')) {
        activeTempAccountIds.add(tx.account_id);
    }
    if (String(tx.category_id).startsWith('temp-cat-')) {
        activeTempCategoryIds.add(tx.category_id);
    }
}

for (const b of allParsedBudgets) {
    if (String(b.category_id).startsWith('temp-cat-')) {
        activeTempCategoryIds.add(b.category_id);
    }
}

// Start DB Client for safe Transaction handling
dbClient = await pool.connect();
await dbClient.query('BEGIN');

let transactionsImported = 0;
let budgetsImported = 0;

// 1. Create new accounts actually used
const tempIdToRealAccountId = {};
for (const [key, acc] of accountsCreatedInThisImport) {
    if (!activeTempAccountIds.has(acc.tempId)) continue;
    console.log(`[Batch-Create Account] Creating account: "${acc.name}" for user ${userId}`);
    const newAccRes = await dbClient.query(
        `INSERT INTO public.accounts (user_id, name, type, balance, icon, color) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [userId, acc.name, 'bank', 0, '🏦', '#6b7280']
    );
    tempIdToRealAccountId[acc.tempId] = newAccRes.rows[0].id;
}

// 2. Create new categories actually used
const tempIdToRealCategoryId = {};
for (const [key, cat] of categoriesCreatedInThisImport) {
    if (!activeTempCategoryIds.has(cat.tempId)) continue;
    console.log(`[Batch-Create Category] Creating category: "${cat.name}" for user ${userId}`);
    const newCatRes = await dbClient.query(
        `INSERT INTO public.money_categories (user_id, name, color, icon, type) 
        VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [userId, cat.name, '#6b7280', '📦', cat.type]
    );
    tempIdToRealCategoryId[cat.tempId] = newCatRes.rows[0].id;
}

// 3. Resolve temporary IDs in non-duplicate transactions
for (const tx of duplicateFreeTransactions) {
    if (String(tx.account_id).startsWith('temp-acc-')) {
        tx.account_id = tempIdToRealAccountId[tx.account_id];
    }
    if (String(tx.category_id).startsWith('temp-cat-')) {
        tx.category_id = tempIdToRealCategoryId[tx.category_id];
    }
}

// 4. Resolve temporary IDs in budgets
for (const b of allParsedBudgets) {
    if (String(b.category_id).startsWith('temp-cat-')) {
        b.category_id = tempIdToRealCategoryId[b.category_id];
    }
}

// 5. Insert Transactions in batches
if (duplicateFreeTransactions.length > 0) {
    const values = [];
    const valueStrings = [];
    let paramIndex = 1;

    for (const tx of duplicateFreeTransactions) {
        valueStrings.push(`($${paramIndex}, $${paramIndex+1}, $${paramIndex+2}, $${paramIndex+3}, $${paramIndex+4}, $${paramIndex+5}, $${paramIndex+6}, $${paramIndex+7}, $${paramIndex+8}, $${paramIndex+9})`);
        values.push(
            tx.user_id,
            tx.date,
            tx.category,
            tx.category_id,
            tx.description,
            tx.amount,
            tx.currency,
            tx.source,
            tx.account_id,
            tx.type
        );
        paramIndex += 10;
    }

    const insertQuery = `INSERT INTO public.money_transactions 
        (user_id, date, category, category_id, description, amount, currency, source, account_id, type) 
        VALUES ${valueStrings.join(', ')}`;

    await dbClient.query(insertQuery, values);

    // Aggregate balance changes per account to reduce UPDATE queries
    const accountBalanceChanges = {};
    for (const tx of duplicateFreeTransactions) {
        if (tx.account_id) {
            accountBalanceChanges[tx.account_id] = (accountBalanceChanges[tx.account_id] || 0) + Number(tx.amount);
        }
    }

    for (const [accountId, changeAmount] of Object.entries(accountBalanceChanges)) {
        await dbClient.query(
            'UPDATE public.accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3',
            [changeAmount, accountId, userId]
        );
    }

    transactionsImported = duplicateFreeTransactions.length;
}

// 6. Process Budgets
if (allParsedBudgets.length > 0) {
    for (const b of allParsedBudgets) {
        const existingBudget = existingBudgets.find(exB => exB.category_id === b.category_id && exB.period === b.period);
        if (existingBudget) {
            await dbClient.query(
                `UPDATE public.budgets 
                SET amount = $1, start_date = $2 
                WHERE id = $3`,
                [b.amount, b.start_date, existingBudget.id]
            );
        } else {
            await dbClient.query(
                `INSERT INTO public.budgets 
                (user_id, category_id, amount, period, start_date) 
                VALUES ($1, $2, $3, $4, $5)`,
                [b.user_id, b.category_id, b.amount, b.period, b.start_date]
            );
        }
    }
    budgetsImported = allParsedBudgets.length;
}

await dbClient.query('COMMIT');
dbClient.release();
dbClient = null;

let msg = '';
if (transactionsImported > 0 && budgetsImported > 0) {
    msg = `Successfully imported ${transactionsImported} transactions and ${budgetsImported} budgets!`;
} else if (transactionsImported > 0) {
    msg = `Successfully imported ${transactionsImported} transactions!`;
} else if (budgetsImported > 0) {
    msg = `Successfully imported ${budgetsImported} budgets!`;
} else {
    msg = 'All data in this file has already been imported.';
}

return {
    success: true,
    message: msg,
    transactionsImported,
    budgetsImported,
};
}
