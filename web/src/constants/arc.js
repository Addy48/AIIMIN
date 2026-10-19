/** Arc — Life OS direction layer (stored as user_profiles.tagline). */

export const ARC_BRAND = 'Arc';
export const ARC_KICKER = 'ARC';
export const ARC_TAGLINE = 'Where your story is headed.';
export const LIFE_ARC_LABEL = 'Life Arc';
export const LIFE_ARC_QUESTION = 'Where is your story headed right now?';
export const LIFE_ARC_HELPER =
  'Your Life Arc steers the OS. AIIMIN aligns your Daily Arc and Weekly Arc to this — planning, priorities, and nudges.';

export const ARC_LAYERS = [
  { id: 'daily', label: 'Daily Arc', hint: 'Today aligned to your story' },
  { id: 'weekly', label: 'Weekly Arc', hint: 'This week’s thread' },
  { id: 'life', label: 'Life Arc', hint: 'The direction everything bends toward', primary: true },
];

export const LIFE_ARC_EXAMPLES = [
  'Crack placements this year',
  'Be healthier than last year',
  'Spend more time with family',
  'Ship my side project before December',
];

export const GOAL_LIFE_ARC_HINTS = {
  career: 'Land a top role that matches my skills this year',
  health: 'Be healthier and more consistent than last year',
  finance: 'Build real financial freedom — one disciplined month at a time',
  skills: 'Master skills that compound into career leverage',
  peace: 'Protect my mental peace and energy every day',
};

export function lifeArcFromGoals(goalIds = []) {
  for (const id of goalIds) {
    if (GOAL_LIFE_ARC_HINTS[id]) return GOAL_LIFE_ARC_HINTS[id];
  }
  return '';
}

export function hasLifeArc(value) {
  return typeof value === 'string' && value.trim().length >= 8;
}

/** @deprecated use hasLifeArc */
export const hasNorthStar = hasLifeArc;
