/**
 * Rule-based Life Arc sharpen — zero tokens when AI unavailable.
 */

const GOAL_HINTS = {
  career: 'Land a top role that matches my skills this year',
  health: 'Be healthier and more consistent than last year',
  finance: 'Build real financial freedom — one disciplined month at a time',
  skills: 'Master skills that compound into career leverage',
  peace: 'Protect my mental peace and energy every day',
};

export function sharpenLifeArcLocally(draft, goalIds = []) {
  let text = String(draft || '').trim().replace(/^["']+|["']+$/g, '');
  if (!text) {
    for (const id of goalIds) {
      if (GOAL_HINTS[id]) return GOAL_HINTS[id];
    }
    return '';
  }

  text = text.replace(/\s+/g, ' ');
  if (!/[.!?]$/.test(text)) text += '.';

  const hint = goalIds.map((id) => GOAL_HINTS[id]).find(Boolean);
  if (hint && text.length < 24) {
    return hint;
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** @deprecated */
export const sharpenNorthStarLocally = sharpenLifeArcLocally;
