/**
 * The one plan ladder for every public page, copied from the Android app so the two never disagree:
 * prices from `Plan.plannedMonthlyInr / plannedYearlyInr` (android/core/data/plan/PlayBilling.kt),
 * features from `Plan.adds` and `FeatureCatalog` (`shipped = false` → listed under `coming`).
 * Change a price or feature there first, then here.
 */
export const PLANS = [
  {
    id: 'free',
    name: 'Free',
    monthly: 0,
    yearly: 0,
    promise: 'Your day, your money, your papers',
    hero: 'Everything you need for yourself, for as long as you like.',
    includes: [
      'Today, voice capture, tasks, calendar, minimums, focus, Life Score, journal, notes',
      'Money from your bank SMS: review, payee memory, budget, splits with up to 3 people',
      'Unlimited documents on your phone for you and 2 family profiles',
      'Emergency card, expiry reminders and a printed emergency kit',
      'Private sync with aiimin.in · charts up to 3 months · export anytime',
    ],
    coming: ['1 trusted person for emergency access'],
  },
  {
    id: 'plus',
    name: 'Plus',
    monthly: 49,
    yearly: 449,
    promise: 'Your whole history, everywhere',
    hero: 'Every ledger and every month of your history, on your phone and the web.',
    includes: [
      'Everything in Free',
      'All-time charts on phone and web',
      'Household and Business ledgers, unlimited splits, receipts on payments',
      'Up to 6 family profiles · recurring bills calendar · CSV export for your CA',
      'Up to 4 linked browsers',
    ],
    coming: ['Document versions', 'Weekly vault backups to your own storage'],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthly: 99,
    yearly: 899,
    promise: 'Does the thinking for you',
    hero: 'AIIMIN explains your patterns and writes your reviews.',
    recommended: true,
    includes: ['Everything in Plus', 'Priority support'],
    coming: [
      'Patterns: what goes with what',
      'Monthly review as a PDF',
      'Weekly review drafts',
      'Smart categorisation rules',
      '3 trusted people for emergency access',
    ],
  },
  {
    id: 'family',
    name: 'Family',
    monthly: 179,
    yearly: 1599,
    promise: 'Everyone you look after',
    hero: 'Pro for up to 6 people, each with their own private space.',
    includes: ['Everything in Pro', 'Emergency kits for everyone in the family'],
    coming: [
      'Each member on their own phone, with a private journal and score',
      'A household vault shared phone to phone',
      'Caregiver roles',
      'A shared household budget and family tasks',
    ],
  },
];

const inr = (n) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
export { inr };

/** The founding offer (PRD 32.7): the first 251 testers keep 50% off any paid plan for as long as they stay on it. */
export const FOUNDING = { seats: 251, off: 0.5 };
export const foundingPrice = (n) => Math.round(n * (1 - FOUNDING.off) * 100) / 100;

/** Whole-percent saving of the yearly price against twelve monthly payments. */
export const yearlySaving = (p) => (p.monthly ? Math.round((1 - p.yearly / (p.monthly * 12)) * 100) : 0);

/** "Free" or "₹99/month · ₹899/year", the way the app's Plans screen shows it. */
export function priceLine(plan) {
  if (plan.monthly === 0) return 'Free';
  return `${inr(plan.monthly)}/month · ${inr(plan.yearly)}/year`;
}

/** Two-sided and cheap to give (master plan §1C). Rewards start when paid plans go on sale. */
export const REFERRAL = {
  friendGets: '1 month of Plus on us',
  tiers: [
    { friends: 1, reward: 'Beta access sooner: you move up the queue' },
    { friends: 3, reward: '3 months of Plus on us' },
    { friends: 10, reward: '1 year of Pro on us' },
  ],
  rules:
    'A friend counts once they verify their email. Each reward is given once. Plan rewards start when paid plans go on sale.',
};
