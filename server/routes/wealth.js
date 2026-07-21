import { Hono } from 'hono';
import * as XLSX from 'xlsx';
import { pool } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import { nvidiaOrGroqChat, groqChat } from '../lib/aiChat.js';
import { trackExternalCall } from '../services/apiUsageService.js';

const wealthRoutes = new Hono();

// Helper: Parse Excel numeric serial or standard string dates
const parseExcelDate = (val) => {
    if (!val) return new Date().toISOString().split('T')[0];
    if (typeof val === 'number') {
        // Excel serial date to JS date
        const date = new Date(Math.round((val - 25569) * 86400 * 1000));
        if (!isNaN(date.getTime())) return date.toISOString().split('T')[0];
    }
    if (typeof val === 'string') {
        const cleanStr = val.trim();
        // Match DD-MM-YYYY, DD/MM/YYYY, DD.MM.YYYY
        let parts = cleanStr.match(/^(\d{1,2})[-./](\d{1,2})[-./](\d{4})$/);
        if (parts) {
            const d = new Date(parseInt(parts[3], 10), parseInt(parts[2], 10) - 1, parseInt(parts[1], 10));
            if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
        }
        // Match YYYY-MM-DD, YYYY/MM/DD, YYYY.MM.DD
        parts = cleanStr.match(/^(\d{4})[-./](\d{1,2})[-./](\d{1,2})$/);
        if (parts) {
            const d = new Date(parseInt(parts[1], 10), parseInt(parts[2], 10) - 1, parseInt(parts[3], 10));
            if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
        }
        // Match DD-MM-YY or DD/MM/YY
        parts = cleanStr.match(/^(\d{1,2})[-./](\d{1,2})[-./](\d{2})$/);
        if (parts) {
            const year = 2000 + parseInt(parts[3], 10);
            const d = new Date(year, parseInt(parts[2], 10) - 1, parseInt(parts[1], 10));
            if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
        }
    }
    // Try parsing standard string
    try {
        const d = new Date(val);
        if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
    } catch (e) {}
    return new Date().toISOString().split('T')[0];
};

const cleanCategoryName = (cat) => {
    if (!cat) return 'Other';
    let clean = String(cat).trim();
    // Strip leading Nerd Font icons/glyphs (like ☕, 晴, ) and extra spaces
    clean = clean.replace(/^[^a-zA-Z0-9\s]+/, '').trim();
    clean = clean.replace(/\s+/g, ' ');
    clean = clean.replace(/\b\w/g, c => c.toUpperCase()); // Title Case
    
    const lower = clean.toLowerCase();
    if (lower === 'food' || lower === 'drinks' || lower === 'food & dining' || lower === 'groceries') return 'Food & Dining';
    if (lower === 'household' || lower === 'utilities' || lower === 'home') return 'Utilities';
    if (lower === 'misc' || lower === 'other' || lower === 'miscellaneous') return 'Other';
    return clean;
};

// ==========================================
// Assets CRUD
// ==========================================
wealthRoutes.get('/assets', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const res = await pool.query(
            'SELECT * FROM public.wealth_assets WHERE user_id = $1 ORDER BY current_value DESC',
            [userId]
        );
        return c.json(res.rows);
    } catch (err) {
        console.error('Error fetching wealth assets:', err);
        return c.json({ error: 'Failed to fetch assets' }, 500);
    }
});

wealthRoutes.post('/assets', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const { asset_name, asset_type, units, current_value, invested_value } = await c.req.json();
        const res = await pool.query(
            `INSERT INTO public.wealth_assets 
            (user_id, asset_name, asset_type, units, current_value, invested_value) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *`,
            [userId, asset_name, asset_type, units || 0, current_value || 0, invested_value || 0]
        );
        return c.json(res.rows[0]);
    } catch (err) {
        console.error('Error creating wealth asset:', err);
        return c.json({ error: 'Failed to create asset' }, 500);
    }
});

wealthRoutes.put('/assets/:id', requireAuth, async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    try {
        const updates = await c.req.json();
        const { asset_name, asset_type, units, current_value, invested_value } = updates;
        const res = await pool.query(
            `UPDATE public.wealth_assets 
            SET asset_name = $1, asset_type = $2, units = $3, current_value = $4, invested_value = $5, updated_at = NOW() 
            WHERE id = $6 AND user_id = $7 
            RETURNING *`,
            [asset_name, asset_type, units, current_value, invested_value, id, userId]
        );
        if (res.rows.length === 0) {
            return c.json({ error: 'Asset not found or unauthorized' }, 404);
        }
        return c.json(res.rows[0]);
    } catch (err) {
        console.error('Error updating wealth asset:', err);
        return c.json({ error: 'Failed to update asset' }, 500);
    }
});

wealthRoutes.delete('/assets/:id', requireAuth, async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    try {
        const res = await pool.query(
            'DELETE FROM public.wealth_assets WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, userId]
        );
        if (res.rows.length === 0) {
            return c.json({ error: 'Asset not found or unauthorized' }, 404);
        }
        return c.json({ success: true });
    } catch (err) {
        console.error('Error deleting wealth asset:', err);
        return c.json({ error: 'Failed to delete asset' }, 500);
    }
});

// ==========================================
// Accounts CRUD
// ==========================================
wealthRoutes.get('/accounts', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const res = await pool.query(
            'SELECT * FROM public.accounts WHERE user_id = $1 AND archived = false ORDER BY balance DESC',
            [userId]
        );
        return c.json(res.rows);
    } catch (err) {
        console.error('Error fetching accounts:', err);
        return c.json({ error: 'Failed to fetch accounts' }, 500);
    }
});

wealthRoutes.post('/accounts', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const { name, type, balance, icon, color, is_default } = await c.req.json();
        
        if (is_default) {
            await pool.query('UPDATE public.accounts SET is_default = false WHERE user_id = $1', [userId]);
        }

        const res = await pool.query(
            `INSERT INTO public.accounts 
            (user_id, name, type, balance, icon, color, is_default) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *`,
            [userId, name, type, balance || 0, icon || '🏦', color || '#6b7280', !!is_default]
        );
        return c.json(res.rows[0]);
    } catch (err) {
        console.error('Error creating account:', err);
        return c.json({ error: 'Failed to create account' }, 500);
    }
});

wealthRoutes.put('/accounts/:id', requireAuth, async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    try {
        const { name, type, balance, icon, color, is_default, archived } = await c.req.json();
        
        if (is_default) {
            await pool.query('UPDATE public.accounts SET is_default = false WHERE user_id = $1', [userId]);
        }

        const res = await pool.query(
            `UPDATE public.accounts 
            SET name = $1, type = $2, balance = $3, icon = $4, color = $5, is_default = $6, archived = $7
            WHERE id = $8 AND user_id = $9 
            RETURNING *`,
            [name, type, balance, icon || '🏦', color || '#6b7280', !!is_default, !!archived, id, userId]
        );
        if (res.rows.length === 0) {
            return c.json({ error: 'Account not found or unauthorized' }, 404);
        }
        return c.json(res.rows[0]);
    } catch (err) {
        console.error('Error updating account:', err);
        return c.json({ error: 'Failed to update account' }, 500);
    }
});

wealthRoutes.delete('/accounts/:id', requireAuth, async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    try {
        const res = await pool.query(
            'DELETE FROM public.accounts WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, userId]
        );
        if (res.rows.length === 0) {
            return c.json({ error: 'Account not found or unauthorized' }, 404);
        }
        return c.json({ success: true });
    } catch (err) {
        console.error('Error deleting account:', err);
        return c.json({ error: 'Failed to delete account' }, 500);
    }
});

// ==========================================
// Transactions CRUD
// ==========================================
wealthRoutes.get('/transactions', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const res = await pool.query(
            'SELECT * FROM public.money_transactions WHERE user_id = $1 ORDER BY date DESC, created_at DESC',
            [userId]
        );
        
        // Map DB types transfer_out / transfer_in back to 'transfer' for frontend UI
        const mappedRows = res.rows.map(row => {
            if (row.type === 'transfer_out' || row.type === 'transfer_in') {
                return { ...row, type: 'transfer' };
            }
            return row;
        });
        
        return c.json(mappedRows);
    } catch (err) {
        console.error('Error fetching transactions:', err);
        return c.json({ error: 'Failed to fetch transactions' }, 500);
    }
});

wealthRoutes.post('/transactions', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const { date, category, category_id, description, amount, currency, source, account_id, type } = await c.req.json();
        
        let mappedType = type || 'expense';
        if (mappedType === 'transfer') {
            mappedType = amount < 0 ? 'transfer_out' : 'transfer_in';
        }

        await pool.query('BEGIN');
        
        const res = await pool.query(
            `INSERT INTO public.money_transactions 
            (user_id, date, category, category_id, description, amount, currency, source, account_id, type) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *`,
            [userId, date, category, category_id || null, description || null, amount || 0, currency || 'INR', source || 'manual', account_id || null, mappedType]
        );

        if (account_id) {
            await pool.query(
                'UPDATE public.accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3',
                [amount || 0, account_id, userId]
            );
        }

        await pool.query('COMMIT');
        
        const tx = res.rows[0];
        if (tx.type === 'transfer_out' || tx.type === 'transfer_in') {
            tx.type = 'transfer';
        }
        return c.json(tx);
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('Error creating transaction:', err);
        return c.json({ error: 'Failed to create transaction' }, 500);
    }
});

wealthRoutes.put('/transactions/:id', requireAuth, async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    try {
        const updates = await c.req.json();
        const { date, category, category_id, description, amount, currency, source, account_id, type } = updates;
        
        let mappedType = type;
        if (mappedType === 'transfer') {
            mappedType = amount < 0 ? 'transfer_out' : 'transfer_in';
        }

        await pool.query('BEGIN');

        const oldTxRes = await pool.query(
            'SELECT amount, account_id FROM public.money_transactions WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        if (oldTxRes.rows.length === 0) {
            await pool.query('ROLLBACK');
            return c.json({ error: 'Transaction not found or unauthorized' }, 404);
        }

        const oldTx = oldTxRes.rows[0];

        const res = await pool.query(
            `UPDATE public.money_transactions 
            SET date = $1, category = $2, category_id = $3, description = $4, amount = $5, currency = $6, source = $7, account_id = $8, type = $9
            WHERE id = $10 AND user_id = $11 
            RETURNING *`,
            [date, category, category_id, description, amount, currency, source, account_id, mappedType, id, userId]
        );

        if (oldTx.account_id) {
            await pool.query(
                'UPDATE public.accounts SET balance = balance - $1 WHERE id = $2 AND user_id = $3',
                [oldTx.amount, oldTx.account_id, userId]
            );
        }

        if (account_id) {
            await pool.query(
                'UPDATE public.accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3',
                [amount, account_id, userId]
            );
        }

        await pool.query('COMMIT');
        
        const tx = res.rows[0];
        if (tx.type === 'transfer_out' || tx.type === 'transfer_in') {
            tx.type = 'transfer';
        }
        return c.json(tx);
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('Error updating transaction:', err);
        return c.json({ error: 'Failed to update transaction' }, 500);
    }
});

wealthRoutes.delete('/transactions/:id', requireAuth, async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    try {
        await pool.query('BEGIN');

        const txRes = await pool.query(
            'SELECT amount, account_id FROM public.money_transactions WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        if (txRes.rows.length === 0) {
            await pool.query('ROLLBACK');
            return c.json({ error: 'Transaction not found or unauthorized' }, 404);
        }

        const tx = txRes.rows[0];

        await pool.query('DELETE FROM public.money_transactions WHERE id = $1 AND user_id = $2', [id, userId]);

        if (tx.account_id) {
            await pool.query(
                'UPDATE public.accounts SET balance = balance - $1 WHERE id = $2 AND user_id = $3',
                [tx.amount, tx.account_id, userId]
            );
        }

        await pool.query('COMMIT');
        return c.json({ success: true });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('Error deleting transaction:', err);
        return c.json({ error: 'Failed to delete transaction' }, 500);
    }
});

// ==========================================
// Budgets CRUD
// ==========================================
wealthRoutes.get('/budgets', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const res = await pool.query(
            `SELECT b.*, mc.name as category_name, mc.color as category_color, mc.icon as category_icon 
            FROM public.budgets b 
            LEFT JOIN public.money_categories mc ON b.category_id = mc.id 
            WHERE b.user_id = $1 
            ORDER BY b.amount DESC`,
            [userId]
        );
        const budgets = res.rows.map(b => ({
            ...b,
            money_categories: b.category_id ? { name: b.category_name, color: b.category_color, icon: b.category_icon } : null
        }));
        return c.json(budgets);
    } catch (err) {
        console.error('Error fetching budgets:', err);
        return c.json({ error: 'Failed to fetch budgets' }, 500);
    }
});

wealthRoutes.post('/budgets', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const { category_id, amount, period, start_date } = await c.req.json();
        const res = await pool.query(
            `INSERT INTO public.budgets 
            (user_id, category_id, amount, period, start_date) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *`,
            [userId, category_id, amount, period || 'monthly', start_date || new Date().toISOString().split('T')[0]]
        );
        const budget = res.rows[0];
        const catRes = await pool.query('SELECT name, color, icon FROM public.money_categories WHERE id = $1', [budget.category_id]);
        if (catRes.rows.length > 0) {
            budget.money_categories = catRes.rows[0];
        }
        return c.json(budget);
    } catch (err) {
        console.error('Error creating budget:', err);
        return c.json({ error: 'Failed to create budget' }, 500);
    }
});

wealthRoutes.put('/budgets/:id', requireAuth, async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    try {
        const { category_id, amount, period, start_date } = await c.req.json();
        const res = await pool.query(
            `UPDATE public.budgets 
            SET category_id = $1, amount = $2, period = $3, start_date = $4
            WHERE id = $5 AND user_id = $6 
            RETURNING *`,
            [category_id, amount, period, start_date, id, userId]
        );
        if (res.rows.length === 0) {
            return c.json({ error: 'Budget not found or unauthorized' }, 404);
        }
        const budget = res.rows[0];
        const catRes = await pool.query('SELECT name, color, icon FROM public.money_categories WHERE id = $1', [budget.category_id]);
        if (catRes.rows.length > 0) {
            budget.money_categories = catRes.rows[0];
        }
        return c.json(budget);
    } catch (err) {
        console.error('Error updating budget:', err);
        return c.json({ error: 'Failed to update budget' }, 500);
    }
});

wealthRoutes.delete('/budgets/:id', requireAuth, async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    try {
        const res = await pool.query(
            'DELETE FROM public.budgets WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, userId]
        );
        if (res.rows.length === 0) {
            return c.json({ error: 'Budget not found or unauthorized' }, 404);
        }
        return c.json({ success: true });
    } catch (err) {
        console.error('Error deleting budget:', err);
        return c.json({ error: 'Failed to delete budget' }, 500);
    }
});

// ==========================================
// Categories GET & POST
// ==========================================
wealthRoutes.get('/categories', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const res = await pool.query(
            'SELECT * FROM public.money_categories WHERE user_id = $1 OR user_id IS NULL ORDER BY name ASC',
            [userId]
        );
        return c.json(res.rows);
    } catch (err) {
        console.error('Error fetching categories:', err);
        return c.json({ error: 'Failed to fetch categories' }, 500);
    }
});

wealthRoutes.post('/categories', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const { name, color, icon, type, parent_id } = await c.req.json();
        const res = await pool.query(
            `INSERT INTO public.money_categories 
            (user_id, name, color, icon, type, parent_id) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *`,
            [userId, name, color || '#6b7280', icon || '📦', type || 'expense', parent_id || null]
        );
        return c.json(res.rows[0]);
    } catch (err) {
        console.error('Error creating category:', err);
        return c.json({ error: 'Failed to create category' }, 500);
    }
});

// ==========================================
// Universal Sheet Import Parser
// ==========================================
wealthRoutes.post('/import', requireAuth, async (c) => {
    const userId = c.get('userId');
    let dbClient;
    try {
        let file;
        try {
            const formData = await c.req.raw.formData();
            file = formData.get('file');
        } catch (formDataErr) {
            console.warn('Failed to parse via raw.formData(), trying parseBody fallback:', formDataErr);
            const body = await c.req.parseBody();
            file = body.file;
        }

        if (!file || typeof file.arrayBuffer !== 'function') {
            return c.json({ error: 'No file uploaded or invalid file object.' }, 400);
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
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

        return c.json({ 
            success: true, 
            message: msg, 
            transactionsImported, 
            budgetsImported 
        });

    } catch (err) {
        if (dbClient) {
            await dbClient.query('ROLLBACK');
            dbClient.release();
        }
        console.error('Excel/CSV Import Error:', err);
        return c.json({ error: 'Failed to process spreadsheet', details: err.message }, 500);
    }
});

// ==========================================
// AI Finance Summary
// ==========================================
wealthRoutes.get('/ai-summary', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const dateStr = thirtyDaysAgo.toISOString().split('T')[0];

        const txRes = await pool.query(
            `SELECT date, category, amount, type, description
             FROM public.money_transactions
             WHERE user_id = $1 AND date >= $2
             ORDER BY date DESC
             LIMIT 200`,
            [userId, dateStr]
        );

        const transactions = txRes.rows;

        if (transactions.length === 0) {
            return c.json({
                summary: 'No transactions found in the last 30 days. Start adding your expenses to get AI-powered insights!',
                categoryBreakdown: [],
                totalIncome: 0,
                totalExpense: 0,
                netFlow: 0,
                generatedAt: new Date().toISOString(),
            });
        }

        // Compute stats server-side
        let totalIncome = 0, totalExpense = 0;
        const catTotals = {};
        for (const tx of transactions) {
            const amt = parseFloat(tx.amount) || 0;
            if (tx.type === 'income') totalIncome += amt;
            else if (tx.type === 'expense') totalExpense += Math.abs(amt);
            const cat = tx.category || 'Other';
            catTotals[cat] = (catTotals[cat] || 0) + Math.abs(amt);
        }
        const categoryBreakdown = Object.entries(catTotals)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([cat, amt]) => ({ category: cat, amount: amt }));

        const netFlow = totalIncome - totalExpense;

        // Prefer NVIDIA if models work; otherwise Groq (working free tier)
        let aiSummary = null;
        let aiStatus = 'success';

        try {
            const prompt = `You are a personal finance advisor. Analyze this user's last 30 days of financial data and provide a helpful, conversational summary.

Financial Data:
- Total Income: ₹${totalIncome.toFixed(2)}
- Total Expenses: ₹${totalExpense.toFixed(2)}
- Net Flow: ₹${netFlow.toFixed(2)} (${netFlow >= 0 ? 'surplus' : 'deficit'})
- Top spending categories: ${categoryBreakdown.map(c => `${c.category}: ₹${c.amount.toFixed(0)}`).join(', ')}
- Transaction count: ${transactions.length}

Provide a response as JSON with these exact keys:
{
  "headline": "one punchy sentence about their financial health (max 15 words)",
  "summary": "2-3 sentences explaining their spending pattern in plain English",
  "insights": ["insight 1", "insight 2", "insight 3"],
  "recommendations": ["action 1", "action 2", "action 3"],
  "sentiment": "positive|neutral|warning"
}

Do not include markdown formatting like \`\`\`json.`;

            await trackExternalCall({
                userId,
                provider: 'groq',
                endpoint: '/wealth/ai-summary',
                units: 1,
                enforceBudget: false,
            }).catch(() => {});

            const chat = await nvidiaOrGroqChat({
                messages: [{ role: 'user', content: prompt }],
                maxTokens: 1000,
                temperature: 0.7,
            });

            if (chat.ok && chat.text) {
                const rawText = chat.text.replace(/```json/g, '').replace(/```/g, '').trim();
                aiSummary = JSON.parse(rawText.match(/\{[\s\S]*\}/)?.[0] || rawText);
            } else {
                aiStatus = 'limit_reached';
            }
        } catch (aiErr) {
            console.warn('[wealth/ai-summary] AI call failed:', aiErr.message);
        }

        // Fallback summary if no NVIDIA key, API call failed, or limit reached
        if (!aiSummary) {
            aiSummary = {
                headline: netFlow >= 0
                    ? `You're saving ₹${netFlow.toFixed(0)} this month — great work!`
                    : `You've spent ₹${Math.abs(netFlow).toFixed(0)} more than you earned this month.`,
                summary: `Over the last 30 days, you recorded ${transactions.length} transactions with ₹${totalIncome.toFixed(0)} income and ₹${totalExpense.toFixed(0)} in expenses.`,
                insights: [
                    `Your top spending category is ${categoryBreakdown[0]?.category || 'Other'} at ₹${(categoryBreakdown[0]?.amount || 0).toFixed(0)}.`,
                    `Net cash flow: ${netFlow >= 0 ? '+' : ''}₹${netFlow.toFixed(0)}.`,
                    `You have ${categoryBreakdown.length} active spending categories.`,
                ],
                recommendations: [
                    'AI-powered insights are currently unavailable due to API limits.',
                    'Set budget limits for your top categories.',
                    'Track daily expenses to stay within your targets.',
                ],
                sentiment: netFlow >= 0 ? 'positive' : 'warning',
            };
        }

        return c.json({
            ...aiSummary,
            aiStatus,
            categoryBreakdown,
            totalIncome,
            totalExpense,
            netFlow,
            transactionCount: transactions.length,
            generatedAt: new Date().toISOString(),
        });
    } catch (err) {
        console.error('[wealth/ai-summary] Error:', err.message);
        return c.json({ error: 'Failed to generate summary' }, 500);
    }
});

// ==========================================
// AI TEXT / SMS IMPORT
// ==========================================
wealthRoutes.post('/import/ai', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const { text } = await c.req.json();
        if (!text || !text.trim()) {
            return c.json({ error: 'No text provided' }, 400);
        }

        if (!process.env.GROQ_API_KEY) {
            return c.json({ error: 'GROQ_API_KEY not configured' }, 503);
        }

        const today = new Date().toISOString().split('T')[0];
        const systemPrompt = `You are a financial transaction parser for an Indian personal finance app.
Given any unstructured text (bank SMS alerts, WhatsApp logs, expense notes, AI conversations, etc.),
extract all financial transactions and return ONLY a valid JSON array (no markdown, no explanation).

Each transaction object must have:
- date: YYYY-MM-DD string (infer from context; if unknown use today: ${today})
- amount: positive number (absolute value)
- type: "expense" | "income" | "transfer"
- category: a sensible category like "Food & Dining", "Transportation", "Shopping", "Utilities", "Entertainment", "Health", "Salary", "Transfer", "Other"
- description: short description of the transaction

Example output:
[
  {"date":"${today}","amount":450,"type":"expense","category":"Food & Dining","description":"Groceries at DMart"},
  {"date":"${today}","amount":1200,"type":"expense","category":"Utilities","description":"Electricity bill"},
  {"date":"${today}","amount":5000,"type":"income","category":"Salary","description":"Salary advance"}
]

Rules:
- If the text says "spent", "paid", "debit", "debited", or "-" before an amount → type is "expense"
- If the text says "received", "credit", "credited", "salary", "refund" → type is "income"
- Convert amounts with commas (1,200) to plain numbers (1200)
- Skip non-financial text
- Return [] if no transactions found`;

        await trackExternalCall({
            userId,
            provider: 'groq',
            endpoint: '/wealth/import/ai',
            units: 1,
            enforceBudget: false,
        }).catch(() => {});

        const chat = await groqChat({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Parse these transactions:\n\n${text.trim()}` },
            ],
            maxTokens: 1200,
            temperature: 0.2,
        });
        if (!chat.ok) {
            return c.json({ error: chat.error || 'AI parse failed' }, 503);
        }

        const rawText = (chat.text || '').trim().replace(/```json\n?|```/g, '');
        let transactions;
        try {
            transactions = JSON.parse(rawText);
            if (!Array.isArray(transactions)) throw new Error('Not an array');
        } catch (e) {
            return c.json({ error: 'AI could not parse transactions', raw: rawText }, 422);
        }

        if (transactions.length === 0) {
            return c.json({ success: true, imported: 0, message: 'No transactions found in the text' });
        }

        // Fetch user's default account
        const accountRes = await pool.query(
            'SELECT id FROM public.accounts WHERE user_id = $1 AND is_default = true LIMIT 1',
            [userId]
        );
        const defaultAccountId = accountRes.rows[0]?.id || null;

        let imported = 0;
        for (const tx of transactions) {
            try {
                const amount = tx.type === 'expense' ? -Math.abs(tx.amount) : Math.abs(tx.amount);
                await pool.query(
                    `INSERT INTO public.money_transactions
                    (user_id, date, category, description, amount, currency, source, account_id, type)
                    VALUES ($1, $2, $3, $4, $5, 'INR', 'ai_import', $6, $7)`,
                    [userId, tx.date || today, tx.category || 'Other', tx.description || '', amount, defaultAccountId, tx.type || 'expense']
                );
                if (defaultAccountId) {
                    await pool.query(
                        'UPDATE public.accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3',
                        [amount, defaultAccountId, userId]
                    );
                }
                imported++;
            } catch (txErr) {
                console.warn('Failed to insert AI transaction:', txErr.message);
            }
        }

        return c.json({ success: true, imported, message: `AI imported ${imported} transactions` });
    } catch (err) {
        console.error('[wealth/import/ai] Error:', err.message);
        return c.json({ error: 'Failed to process AI import', message: err.message }, 500);
    }
});

export default wealthRoutes;
