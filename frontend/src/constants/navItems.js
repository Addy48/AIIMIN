/** All primary app routes available in the masthead */

export const NAV_MAX_PINNED = 12;
export const NAV_MIN_PINNED = 1;

export const NAV_REGISTRY = [
  { id: 'overview', to: '/overview', label: 'Today' },
  { id: 'habits', to: '/habits', label: 'Habits' },
  { id: 'goals', to: '/goals', label: 'Goals' },
  { id: 'journal', to: '/journal', label: 'Journal' },
  { id: 'finance', to: '/finance', label: 'Finance' },
  { id: 'family', to: '/family', label: 'Family' },
  { id: 'calendar', to: '/calendar', label: 'Calendar' },
  { id: 'placements', to: '/placements', label: 'Career' },
  { id: 'sports', to: '/sports', label: 'Sports', hideFromGuest: true },
  { id: 'discipline', to: '/discipline', label: 'Discipline', hideFromGuest: true },
  { id: 'focus', to: '/focus', label: 'Focus' },
  { id: 'lab', to: '/lab', label: 'Lab' },
];

export const DEFAULT_PINNED_IDS = ['overview', 'habits', 'goals', 'journal'];
export const DEFAULT_ACTIVE_IDS = NAV_REGISTRY.map((item) => item.id);

export const NAV_PERSONA_PRESETS = [
  {
    id: 'custom',
    label: 'Custom',
    desc: 'Start from the full product and tune every section yourself.',
    activeIds: DEFAULT_ACTIVE_IDS,
    pinnedIds: DEFAULT_PINNED_IDS,
  },
  {
    id: 'student',
    label: 'Student',
    desc: 'Study rhythm, placements, habits, money, and focus.',
    activeIds: ['overview', 'habits', 'goals', 'journal', 'finance', 'calendar', 'placements', 'focus', 'discipline', 'sports', 'lab'],
    pinnedIds: ['overview', 'habits', 'goals', 'journal', 'calendar', 'placements', 'focus', 'finance'],
  },
  {
    id: 'professional',
    label: 'Working professional',
    desc: 'Calendar, money, health, family, goals, and career growth.',
    activeIds: ['overview', 'goals', 'journal', 'finance', 'family', 'calendar', 'placements', 'habits', 'focus', 'discipline'],
    pinnedIds: ['overview', 'calendar', 'goals', 'finance', 'journal', 'family', 'focus'],
  },
  {
    id: 'founder',
    label: 'Founder / builder',
    desc: 'Execution, experiments, finance, discipline, and shipping momentum.',
    activeIds: ['overview', 'goals', 'journal', 'finance', 'calendar', 'discipline', 'focus', 'lab', 'habits', 'placements'],
    pinnedIds: ['overview', 'goals', 'finance', 'calendar', 'lab', 'journal', 'focus', 'discipline'],
  },
  {
    id: 'family',
    label: 'Family / household',
    desc: 'Shared routines, family, finances, calendar, and reflection.',
    activeIds: ['overview', 'habits', 'goals', 'journal', 'finance', 'family', 'calendar', 'focus'],
    pinnedIds: ['overview', 'family', 'finance', 'calendar', 'journal', 'goals', 'habits'],
  },
  {
    id: 'athlete',
    label: 'Athlete / fitness',
    desc: 'Training consistency, discipline, sports, recovery, and goals.',
    activeIds: ['overview', 'habits', 'goals', 'journal', 'calendar', 'sports', 'discipline', 'focus', 'finance'],
    pinnedIds: ['overview', 'habits', 'sports', 'discipline', 'focus', 'journal', 'goals'],
  },
];

const REGISTRY_BY_ID = Object.fromEntries(NAV_REGISTRY.map((item) => [item.id, item]));

export function getNavItem(id) {
  return REGISTRY_BY_ID[id];
}

export function resolveNavItems(ids, { isGuest = false, activeIds = DEFAULT_ACTIVE_IDS } = {}) {
  const seen = new Set();
  const active = new Set(sanitizeActiveIds(activeIds));
  const items = [];
  for (const id of ids) {
    const item = REGISTRY_BY_ID[id];
    if (!item || seen.has(id)) continue;
    if (!active.has(id)) continue;
    if (isGuest && item.hideFromGuest) continue;
    seen.add(id);
    items.push(item);
  }
  return items;
}

export function availableForMore(pinnedIds, { isGuest = false, activeIds = DEFAULT_ACTIVE_IDS } = {}) {
  const pinned = new Set(pinnedIds);
  const active = new Set(sanitizeActiveIds(activeIds));
  return NAV_REGISTRY.filter((item) => {
    if (pinned.has(item.id)) return false;
    if (!active.has(item.id)) return false;
    if (isGuest && item.hideFromGuest) return false;
    return true;
  });
}

export function sanitizePinnedIds(ids) {
  const valid = [];
  const seen = new Set();
  for (const id of ids || []) {
    if (!REGISTRY_BY_ID[id] || seen.has(id)) continue;
    seen.add(id);
    valid.push(id);
  }
  if (valid.length < NAV_MIN_PINNED) {
    return [...DEFAULT_PINNED_IDS];
  }
  return valid.slice(0, NAV_MAX_PINNED);
}

export function sanitizeActiveIds(ids) {
  const valid = [];
  const seen = new Set();
  for (const id of ids || []) {
    if (!REGISTRY_BY_ID[id] || seen.has(id)) continue;
    seen.add(id);
    valid.push(id);
  }
  if (valid.length < NAV_MIN_PINNED) {
    return [...DEFAULT_ACTIVE_IDS];
  }
  return valid;
}

export function getPersonaPreset(id) {
  return NAV_PERSONA_PRESETS.find((preset) => preset.id === id) || NAV_PERSONA_PRESETS[0];
}
