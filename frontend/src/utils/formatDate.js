/**
 * India-first date formatting for user-facing UI.
 * Never render raw ISO strings like 2026-07-17T00:00:00.000Z.
 */
export function formatDate(value, fallback = '—') {
  if (value == null || value === '') return fallback;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return fallback;
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Long calendar line: "Saturday, 18 Jul 2026" */
export function formatDateLong(value, fallback = '—') {
  if (value == null || value === '') return fallback;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return fallback;
  return d.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Month header: "July 2026" */
export function formatMonthYear(value, fallback = '—') {
  if (value == null || value === '') return fallback;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return fallback;
  return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

/** Week-of line: "Week of 13 Jul 2026" */
export function formatWeekOf(value, fallback = '—') {
  if (value == null || value === '') return fallback;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return fallback;
  return `Week of ${formatDate(d)}`;
}

/** Compact: "9 Jul 2026" — same as formatDate with en-IN short month */
export function formatDateShort(value, fallback = '—') {
  return formatDate(value, fallback);
}

/** Date only without year when same calendar year as now */
export function formatDateRelativeYear(value, fallback = '—') {
  if (value == null || value === '') return fallback;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return fallback;
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
}

/** Indian Rupee with grouping: ₹18,500 */
export function formatINR(amount, fallback = '—') {
  if (amount == null || amount === '' || Number.isNaN(Number(amount))) return fallback;
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}
