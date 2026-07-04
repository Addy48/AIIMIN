/**
 * designVoteShip.js — reads Design Lab votes from localStorage at runtime.
 * Approve → ship. Maybe → ship only if listed in MAYBE_OK. Skip / no vote → skip.
 */

const STORAGE_KEY = 'aiimin-design-lab-votes';

/** Maybe votes we will ship when the use-case clearly fits */
const MAYBE_OK = new Set([
  'chart-area-loading-pulse',
  'chart-line-loading-sweep',
  'chart-heatmap-loading',
  'k-shimmer-text',
  'k-loader',
  'k-smooth-tab',
  'k-ai-text-load',
  'k-v0-btn',
  'motion-page-fade',
  'motion-layout',
  'motion-stagger',
  'motion-hover-lift',
  'motion-progress',
  'motion-spring-number',
]);

export function getDesignVotes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function getVote(id) {
  return getDesignVotes()[id] || null;
}

export function shouldShip(id) {
  const vote = getVote(id);
  if (vote === 'skip') return false;
  if (vote === 'approve') return true;
  if (vote === 'maybe') return MAYBE_OK.has(id);
  // Promote shipped patterns by default. Skip remains the only hard off switch.
  return true;
}

export function voteSummary() {
  const votes = getDesignVotes();
  const entries = Object.entries(votes);
  return {
    approved: entries.filter(([, v]) => v === 'approve').length,
    maybe: entries.filter(([, v]) => v === 'maybe').length,
    skipped: entries.filter(([, v]) => v === 'skip').length,
    total: entries.length,
  };
}

export function exportVotesJson() {
  return JSON.stringify(getDesignVotes(), null, 2);
}
