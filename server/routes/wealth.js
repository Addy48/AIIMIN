import { Hono } from 'hono';
import { pool } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import { nvidiaOrGroqChat, heavyChat } from '../lib/aiChat.js';
import { trackExternalCall } from '../services/apiUsageService.js';
import { runAiTextImport } from '../services/wealthAiImportService.js';
import { processSpreadsheetImport } from '../services/wealthSpreadsheetImportService.js';
import { parseExcelDate, cleanCategoryName } from '../services/wealthImportHelpers.js';

const wealthRoutes = new Hono();

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
        const result = await processSpreadsheetImport(userId, buffer);
        return c.json(result);

    } catch (err) {
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
            });

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
            if (aiErr.code === 'USER_AI_BUDGET_EXCEEDED' || aiErr.code === 'BUDGET_EXCEEDED') {
                aiStatus = 'limit_reached';
            }
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
        const result = await runAiTextImport(userId, text);
        return c.json(result);
    } catch (err) {
        if (err.code === 'USER_AI_BUDGET_EXCEEDED' || err.code === 'BUDGET_EXCEEDED') {
            return c.json({
                error: err.message,
                code: err.code,
                ...(err.meta || {}),
            }, 429);
        }
        if (err.status === 422) {
            return c.json({ error: err.message, raw: err.raw }, 422);
        }
        if (err.status) {
            return c.json({ error: err.message }, err.status);
        }
        console.error('[wealth/import/ai] Error:', err.message);
        return c.json({ error: 'Failed to process AI import', message: err.message }, 500);
    }
});

export default wealthRoutes;
