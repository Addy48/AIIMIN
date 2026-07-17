/**
 * Life Arc — user's macro direction for AI (stored as user_profiles.tagline).
 */
import { pool } from './db.js';

export async function getLifeArc(userId) {
  if (!userId) return null;
  try {
    const { rows } = await pool.query(
      'SELECT tagline FROM user_profiles WHERE user_id = $1 LIMIT 1',
      [userId],
    );
    const value = rows[0]?.tagline;
    return typeof value === 'string' && value.trim() ? value.trim() : null;
  } catch {
    return null;
  }
}

/** @deprecated */
export const getNorthStar = getLifeArc;

export function lifeArcPromptBlock(lifeArc) {
  if (!lifeArc) return '';
  return `\n\nUser Life Arc (macro direction — align Daily Arc, Weekly Arc, tasks, and nudges to this): "${lifeArc}"`;
}

/** @deprecated */
export const northStarPromptBlock = lifeArcPromptBlock;

export async function enrichSystemPrompt(userId, systemPrompt = null) {
  const lifeArc = await getLifeArc(userId);
  if (!systemPrompt && !lifeArc) return null;
  const base = systemPrompt || 'You are AIIMIN, a personal life operating system assistant.';
  return `${base}${lifeArcPromptBlock(lifeArc)}`;
}
