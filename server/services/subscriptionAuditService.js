/**
 * Subscription audit — detect recurring charges from transaction history.
 * Pattern matching on amount + cadence (Kahneman: invisible recurring drains).
 */

const SUBSCRIPTION_KEYWORDS = [
  'netflix', 'spotify', 'youtube', 'prime', 'hotstar', 'jio', 'airtel',
  'subscription', 'membership', 'renewal', 'monthly', 'annual', 'icloud',
  'notion', 'chatgpt', 'openai', 'adobe', 'microsoft', 'google one',
  'gym', 'fitness', 'coursera', 'linkedin', 'apple', 'disney',
];

function normalizeDesc(desc) {
  return String(desc || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function daysBetween(a, b) {
  return Math.abs((new Date(a) - new Date(b)) / 86400000);
}

/**
 * @param {Array} transactions — expense rows with date, amount, description, category
 * @returns {{ subscriptions: Array, totalMonthly: number, count: number }}
 */
export function auditSubscriptions(transactions = []) {
  const expenses = transactions.filter((t) => {
    const amt = Number(t.amount);
    return (t.type === 'expense' || amt < 0) && Math.abs(amt) >= 49;
  });

  const groups = {};

  expenses.forEach((t) => {
    const amount = Math.abs(Number(t.amount));
    const key = `${normalizeDesc(t.description || t.category)}::${Math.round(amount)}`;
    if (!groups[key]) {
      groups[key] = {
        name: (t.description || t.category || 'Unknown').trim().slice(0, 60),
        amount,
        category: t.category || 'Other',
        dates: [],
        keywordHit: false,
      };
    }
    groups[key].dates.push(t.date);
    const desc = normalizeDesc(`${t.description} ${t.category}`);
    if (SUBSCRIPTION_KEYWORDS.some((k) => desc.includes(k))) {
      groups[key].keywordHit = true;
    }
  });

  const subscriptions = [];

  Object.values(groups).forEach((g) => {
    if (g.dates.length < 2 && !g.keywordHit) return;

    g.dates.sort();
    const intervals = [];
    for (let i = 1; i < g.dates.length; i++) {
      intervals.push(daysBetween(g.dates[i], g.dates[i - 1]));
    }
    const avgInterval = intervals.length
      ? intervals.reduce((a, b) => a + b, 0) / intervals.length
      : 30;

    const isMonthly = avgInterval >= 25 && avgInterval <= 35;
    const isAnnual = avgInterval >= 330 && avgInterval <= 400;
    const isWeekly = avgInterval >= 6 && avgInterval <= 8;

    if (g.keywordHit || isMonthly || isAnnual || (g.dates.length >= 3 && isWeekly)) {
      const frequency = isAnnual ? 'yearly' : isWeekly ? 'weekly' : 'monthly';
      const monthlyCost = frequency === 'yearly'
        ? g.amount / 12
        : frequency === 'weekly'
          ? g.amount * 4.33
          : g.amount;

      subscriptions.push({
        name: g.name,
        amount: g.amount,
        category: g.category,
        frequency,
        monthlyCost: Math.round(monthlyCost),
        occurrences: g.dates.length,
        lastCharge: g.dates[g.dates.length - 1],
        confidence: g.keywordHit ? 'high' : g.dates.length >= 3 ? 'high' : 'medium',
      });
    }
  });

  subscriptions.sort((a, b) => b.monthlyCost - a.monthlyCost);

  const totalMonthly = subscriptions.reduce((s, sub) => s + sub.monthlyCost, 0);

  return {
    subscriptions: subscriptions.slice(0, 20),
    totalMonthly,
    count: subscriptions.length,
  };
}

export default { auditSubscriptions };
