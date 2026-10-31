/**
 * The one plan ladder for every public page, copied from the Android app so the two never disagree:
 * prices from `Plan.plannedMonthlyInr / plannedYearlyInr` (android/core/data/plan/PlayBilling.kt),
 * features from `Plan.adds` and `FeatureCatalog` (`shipped = false` → listed under `coming`).
 * Change a price or feature there first, then here. Rupee prices are India's; other countries use REGIONS below.
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
    monthly: 59,
    yearly: 399,
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
    monthly: 119,
    yearly: 799,
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
    monthly: 199,
    yearly: 1299,
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

/** "Free" or "₹119/month · ₹799/year", the way the app's Plans screen shows it. */
export function priceLine(plan) {
  if (plan.monthly === 0) return 'Free';
  return `${inr(plan.monthly)}/month · ${inr(plan.yearly)}/year`;
}

/** Two-sided and cheap to give (master plan §1C). Rewards start when paid plans go on sale. */
export const REFERRAL = {
  friendGets: '1 month of Plus on us',
  tiers: [
    { friends: 1, reward: 'You move up the queue and get the beta sooner' },
    { friends: 3, reward: '3 months of Plus on us' },
    { friends: 10, reward: '1 year of Pro on us' },
  ],
  rules:
    'A friend counts once they verify their email. Each reward is given once. Plan rewards start when paid plans go on sale.',
};

/**
 * Prices by region (owner-approved 31 Oct 2026). Google Play charges each country in its own money; these are the
 * amounts the website shows. India uses PLANS above. Zone 3 outside India is the rupee ladder converted at ₹84 = $1.
 */
export const LIFETIME_PRO_INR = 2999;
export const REGIONS = {
  in: { label: 'India', currency: 'INR', plus: [59, 399], pro: [119, 799], family: [199, 1299], lifetime: LIFETIME_PRO_INR },
  z3: { label: 'South Asia, South-East Asia and Africa', currency: 'USD', plus: [0.69, 4.79], pro: [1.39, 9.49], family: [2.39, 15.49], lifetime: 35.99 },
  z2: { label: 'Latin America, Eastern Europe, Malaysia, Turkey, South Africa', currency: 'USD', plus: [1.69, 10.99], pro: [3.29, 21.99], family: [5.49, 37.99], lifetime: 54.99 },
  z1: { label: 'US, UK, Western Europe, the Gulf, Australia, Singapore, Japan', currency: 'USD', plus: [2.99, 19.99], pro: [5.99, 39.99], family: [9.99, 69.99], lifetime: 99 },
};
const Z1 = 'US CA GB IE FR DE NL BE LU AT CH LI DK SE NO FI IS IT ES PT MT CY GR MC AU NZ SG JP KR HK TW IL AE SA QA KW BH OM';
const Z2 = 'PL CZ SK HU RO BG HR SI EE LV LT RS BA ME MK AL MD UA BY RU GE AM AZ KZ MX BR AR CL CO PE UY PY BO EC VE CR PA DO GT SV HN NI JM TT PR MY TH CN TR ZA MA TN DZ JO LB IQ IR';
const Z3 = 'PK BD LK NP BT MV MM AF ID PH VN KH LA NG KE GH ET TZ UG RW EG SN CI CM ZM ZW MZ';
const ZONE_OF = {};
[[Z1, 'z1'], [Z2, 'z2'], [Z3, 'z3']].forEach(([list, z]) => list.split(' ').forEach((c) => { ZONE_OF[c] = z; }));

/** Two-letter country code (from the visitor's connection) to a price region. Unknown countries get Zone 2. */
export function regionForCountry(country) {
  const c = String(country || '').toUpperCase();
  if (c === 'IN') return 'in';
  return ZONE_OF[c] || 'z2';
}

/** No-network first guess from the browser's time zone, used until the connection's country is known. */
export function regionFromTimeZone(tz) {
  if (!tz) return 'in';
  if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') return 'in';
  if (/^(Asia\/(Karachi|Dhaka|Colombo|Kathmandu|Thimphu|Jakarta|Manila|Ho_Chi_Minh|Saigon|Yangon)|Africa\/(Lagos|Nairobi|Accra|Cairo|Addis_Ababa))$/.test(tz)) return 'z3';
  if (/^(America\/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage|Toronto|Vancouver)|Europe\/(London|Dublin|Paris|Berlin|Amsterdam|Brussels|Madrid|Rome|Lisbon|Vienna|Zurich|Stockholm|Oslo|Copenhagen|Helsinki)|Australia\/.*|Pacific\/Auckland|Asia\/(Singapore|Tokyo|Seoul|Dubai|Riyadh|Qatar|Hong_Kong))$/.test(tz)) return 'z1';
  return 'z2';
}

const usd = (n) => '$' + (n % 1 ? n.toFixed(2) : String(n));
/** Formats an amount the way the region is charged on the website. */
export const money = (n, region = 'in') => (REGIONS[region].currency === 'INR' ? inr(n) : usd(n));

/** Monthly and yearly price of a plan in a region: { monthly, yearly } (0 and 0 for Free). */
export function regionPrice(plan, region = 'in') {
  if (plan.monthly === 0) return { monthly: 0, yearly: 0 };
  const [monthly, yearly] = REGIONS[region][plan.id];
  return { monthly, yearly };
}
