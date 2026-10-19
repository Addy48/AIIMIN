/**
 * Export transactions to CSV (no external deps).
 */
export function exportTransactionsCsv(transactions, filename = 'aiimin-transactions.csv') {
  const headers = ['Date', 'Category', 'Description', 'Amount', 'Type', 'Currency', 'Emotion Tag'];
  const escape = (val) => {
    const s = String(val ?? '');
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const rows = (transactions || []).map((t) => [
    t.date,
    t.category || '',
    t.description || '',
    t.amount,
    t.type || 'expense',
    t.currency || 'INR',
    t.emotion_tag || '',
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.map(escape).join(','))].join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * SIP future value — standard mutual fund SIP formula.
 * FV = P × [((1+r)^n - 1) / r] × (1+r)
 */
export function calculateSIPProjection(monthlyAmount, annualReturnPct, years) {
  const P = Number(monthlyAmount) || 0;
  const r = (Number(annualReturnPct) || 0) / 100 / 12;
  const n = (Number(years) || 0) * 12;
  const invested = P * n;

  if (P <= 0 || n <= 0) {
    return { corpus: 0, invested: 0, gains: 0, chart: [] };
  }

  const chart = [];
  let corpus = 0;
  let totalInvested = 0;

  for (let month = 1; month <= n; month += 1) {
    totalInvested += P;
    if (r === 0) {
      corpus = totalInvested;
    } else {
      corpus = corpus * (1 + r) + P;
    }
    if (month % 6 === 0 || month === n) {
      chart.push({
        month,
        year: Math.ceil(month / 12),
        label: `Y${Math.ceil(month / 12)}`,
        corpus: Math.round(corpus),
        invested: Math.round(totalInvested),
        gains: Math.round(corpus - totalInvested),
      });
    }
  }

  return {
    corpus: Math.round(corpus),
    invested: Math.round(totalInvested),
    gains: Math.round(corpus - totalInvested),
    chart,
  };
}

/**
 * Client-side financial health score (mirrors server logic).
 */
export function computeFinancialHealthScore({
  totalBalance = 0,
  monthlyIncome = 0,
  monthlyExpenses = 0,
  budgets = [],
  transactions = [],
}) {
  const emergencyMonths = monthlyExpenses > 0 ? totalBalance / monthlyExpenses : 0;
  const emergencyFundPct = Math.min(100, (emergencyMonths / 6) * 100);

  const savingsRate = monthlyIncome > 0
    ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100
    : 0;

  let budgetAdherence = 100;
  if (budgets.length > 0) {
    const now = new Date();
    const categorySpent = {};
    transactions.forEach((t) => {
      const d = new Date(t.date);
      if (t.type === 'expense' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
        const cat = t.category || 'Other';
        categorySpent[cat] = (categorySpent[cat] || 0) + Math.abs(Number(t.amount) || 0);
      }
    });
    const within = budgets.filter((b) => (categorySpent[b.category] || 0) <= Number(b.amount)).length;
    budgetAdherence = (within / budgets.length) * 100;
  }

  const debtToIncome = monthlyIncome > 0 && monthlyExpenses > monthlyIncome
    ? ((monthlyExpenses - monthlyIncome) / monthlyIncome) * 100
    : 0;

  const score = Math.round(
    emergencyFundPct * 0.30
    + Math.min(100, Math.max(0, savingsRate * 2)) * 0.30
    + budgetAdherence * 0.25
    + Math.max(0, 100 - debtToIncome * 2) * 0.15
  );

  return {
    score: Math.min(100, Math.max(0, score)),
    emergencyFundPct: Math.round(emergencyFundPct * 10) / 10,
    savingsRate: Math.round(savingsRate * 10) / 10,
    budgetAdherence: Math.round(budgetAdherence * 10) / 10,
    debtToIncome: Math.round(debtToIncome * 10) / 10,
    emergencyMonths: Math.round(emergencyMonths * 10) / 10,
  };
}
