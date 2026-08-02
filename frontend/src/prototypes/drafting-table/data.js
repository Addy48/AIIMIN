// Drafting Table — seed data + constants (ported from the design prototype).

export const MIN_LABELS = [
  'Morning walk · 25 min',
  'Journal entry',
  'Log spends',
  'Read 20 pages',
  'Lab: shadowing drill',
];

export const RAIL_LABELS = ['Body', 'Mind', 'People'];

export const PAIRS = [
  { label: 'Walk → screen time', rho: '−.61', q: '.004', n: 18, full: '07:00 walk → screen time' },
  { label: 'Sleep → focus hours', rho: '+.54', q: '.011', n: 96, full: 'Sleep duration → focus hours' },
  { label: 'Delivery spend → mood', rho: '−.38', q: '.042', n: 74, full: 'Delivery spend → next-day mood' },
  { label: 'Journal streak → Mind', rho: '+.35', q: '.058', n: 120, full: 'Journal streak → Mind area' },
  { label: 'Steps → sleep quality', rho: '+.31', q: '.089', n: 151, full: 'Daily steps → sleep quality' },
];

export const CHIP_DEFS = [
  { label: '₹1,240', on: true },
  { label: 'Food', on: true },
  { label: 'Swiggy', on: false },
  { label: '+ Rohan', on: false },
  { label: 'Mood −1', on: false },
];

export const SEED_LEDGER = [
  { name: 'Swiggy', meta: 'FOOD · UPI · 01.08', amt: '−₹1,240', pos: false },
  { name: 'Blinkit', meta: 'GROCERY · UPI · 01.08', amt: '−₹680', pos: false },
  { name: 'Delhi Metro', meta: 'TRANSPORT · CARD · 31.07', amt: '−₹60', pos: false },
  { name: 'Spotify', meta: 'SUBS · AUTO · 30.07', amt: '−₹119', pos: false },
  { name: 'Stipend · Zoho', meta: 'INCOME · NEFT · 01.08', amt: '+₹18,000', pos: true },
];

export const SEED_CAPTURES = [
  { label: 'Morning walk logged', time: '07:29' },
  { label: 'Journal · 240 words', time: '08:06' },
  { label: 'Metro fare ₹60', time: '09:51' },
  { label: 'Focus block · 75 min', time: '10:20' },
];

export const SEED_HOLDS = [
  { label: 'Voice note · 0:34' },
  { label: 'Receipt scan · Blinkit' },
];

export const ID_ALTS = ['ADIT2K04', 'AADIUP04', 'UPADHY24'];

// Subscription tiers — matches production tierGating.js (explore < core < pro < elite).
export const TIERS = ['explore', 'core', 'pro', 'elite'];
export const TIER_LABELS = { explore: 'EXPLORE', core: 'CORE', pro: 'PRO', elite: 'ELITE' };
export const TIER_PRICE = { explore: 'FREE', core: '₹29', pro: '₹49', elite: '₹79' };

// 14-bar life-score sparkline (height %, last three in accent — see DaySheet).
export const SPARK_BARS = [52, 58, 49, 66, 61, 70, 64, 72, 69, 75, 71, 80, 74, 78];
