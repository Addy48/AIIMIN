/**
 * wealthAiImportService.js — AI text/SMS transaction import logic.
 */
import { pool } from '../lib/db.js';
import { heavyChat } from '../lib/aiChat.js';
import { trackExternalCall } from './apiUsageService.js';

export function buildAiImportSystemPrompt(today) {
    return `You are a financial transaction parser for an Indian personal finance app.
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
}

export async function parseTransactionsFromText(text, today) {
    const chat = await heavyChat({
        messages: [
            { role: 'system', content: buildAiImportSystemPrompt(today) },
            { role: 'user', content: `Parse these transactions:\n\n${text.trim()}` },
        ],
        maxTokens: 1200,
        temperature: 0.2,
    });
    if (!chat.ok) {
        const err = new Error(chat.error || 'AI parse failed');
        err.status = 503;
        throw err;
    }

    const rawText = (chat.text || '').trim().replace(/```json\n?|```/g, '');
    try {
        const transactions = JSON.parse(rawText);
        if (!Array.isArray(transactions)) throw new Error('Not an array');
        return { transactions, rawText };
    } catch {
        const err = new Error('AI could not parse transactions');
        err.status = 422;
        err.raw = rawText;
        throw err;
    }
}

export async function importParsedTransactions(userId, transactions, today) {
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
            imported += 1;
        } catch (txErr) {
            console.warn('Failed to insert AI transaction:', txErr.message);
        }
    }
    return imported;
}

export async function runAiTextImport(userId, text) {
    if (!text || !text.trim()) {
        const err = new Error('No text provided');
        err.status = 400;
        throw err;
    }
    if (!process.env.GROQ_API_KEY) {
        const err = new Error('GROQ_API_KEY not configured');
        err.status = 503;
        throw err;
    }

    const today = new Date().toISOString().split('T')[0];

    await trackExternalCall({
        userId,
        provider: 'groq',
        endpoint: '/wealth/import/ai',
        units: 1,
    });

    const { transactions } = await parseTransactionsFromText(text, today);

    if (transactions.length === 0) {
        return { success: true, imported: 0, message: 'No transactions found in the text' };
    }

    const imported = await importParsedTransactions(userId, transactions, today);
    return { success: true, imported, message: `AI imported ${imported} transactions` };
}
