/**
 * Lightweight request validation (SEC-05) — no external deps.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HEX_COLOR_RE = /^#[0-9A-Fa-f]{6}$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}/;
const USERNAME_PATTERN = /^[A-Z0-9@,._\-=+*^$#!]+$/;
const NAME_RE = /^[\p{L}\p{M}'\-\s.]+$/u;

export function validateEmail(email) {
  const v = String(email || '').trim().toLowerCase();
  if (!v || !EMAIL_RE.test(v)) return { ok: false, error: 'Invalid email address' };
  return { ok: true, value: v };
}

export function validateName(name, max = 100) {
  const v = String(name || '').trim().slice(0, max);
  return { ok: true, value: v || null };
}

export function validateRequiredName(name, max = 100) {
  const v = String(name || '').trim().slice(0, max);
  if (!v) return { ok: false, error: 'First name is required' };
  if (!NAME_RE.test(v)) return { ok: false, error: 'Name contains invalid characters' };
  return { ok: true, value: v };
}

/** OS-ID style username — exactly 8 chars, max 4 digits */
export function validateOsId(username) {
  const v = String(username || '').trim().toUpperCase();
  if (v.length !== 8) {
    return { ok: false, error: 'OS-ID must be exactly 8 characters' };
  }
  if (!USERNAME_PATTERN.test(v)) {
    return { ok: false, error: 'Only letters, numbers, and @,._-=+*^$#! are allowed' };
  }
  const digits = (v.match(/[0-9]/g) || []).length;
  if (digits > 4) {
    return { ok: false, error: 'OS-ID can have at most 4 numbers' };
  }
  return { ok: true, value: v };
}

export function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function validateHabitBody(body = {}) {
  const name = String(body.name || '').trim();
  if (!name || name.length > 100) {
    return { ok: false, error: 'name must be 1–100 characters' };
  }
  const frequency = body.frequency || 'daily';
  const allowedFreq = ['daily', 'weekly', 'custom'];
  if (!allowedFreq.includes(frequency)) {
    return { ok: false, error: 'frequency must be daily, weekly, or custom' };
  }
  if (body.color && !HEX_COLOR_RE.test(body.color)) {
    return { ok: false, error: 'color must be a hex value like #2563EB' };
  }
  return {
    ok: true,
    value: {
      name,
      emoji: body.emoji || '🎯',
      category: body.category || null,
      frequency,
      meta: body.meta || {},
      goal_id: body.goal_id || null,
    },
  };
}

export function validateGoalBody(body = {}) {
  const title = String(body.title || '').trim();
  if (!title || title.length > 200) {
    return { ok: false, error: 'title must be 1–200 characters' };
  }
  if (body.target_date && !ISO_DATE_RE.test(String(body.target_date))) {
    return { ok: false, error: 'target_date must be ISO8601 (YYYY-MM-DD)' };
  }
  const progress = body.progress != null ? Number(body.progress) : undefined;
  if (progress != null && (Number.isNaN(progress) || progress < 0 || progress > 100)) {
    return { ok: false, error: 'progress must be 0–100' };
  }
  return { ok: true, value: { ...body, title } };
}

export function validateTransactionBody(body = {}) {
  const amount = Number(body.amount);
  if (!Number.isFinite(amount)) {
    return { ok: false, error: 'amount must be a valid number' };
  }
  if (body.date && !ISO_DATE_RE.test(String(body.date))) {
    return { ok: false, error: 'date must be ISO8601 (YYYY-MM-DD)' };
  }
  return { ok: true, value: body };
}

export function validateJournalBody(body = {}) {
  const content = body.content ?? body.encrypted_content ?? '';
  if (String(content).length > 50000) {
    return { ok: false, error: 'content must be under 50,000 characters' };
  }
  const modes = ['free_write', 'cbt', 'www', 'morning', 'weekly', 'free'];
  if (body.mode && !modes.includes(body.mode)) {
    return { ok: false, error: 'invalid journal mode' };
  }
  return { ok: true, value: body };
}

export function validateDisciplineLogBody(body = {}) {
  const allowed = ['urge', 'milestone', 'reflection', 'reset'];
  const eventType = body.event_type;
  if (!eventType || !allowed.includes(eventType)) {
    return { ok: false, error: 'event_type must be urge, milestone, reflection, or reset' };
  }
  const triggers = ['stress', 'boredom', 'social_pressure', 'physical', 'other'];
  if (body.trigger_type && !triggers.includes(body.trigger_type)) {
    return { ok: false, error: 'invalid trigger_type' };
  }
  if (body.notes && String(body.notes).length > 500) {
    return { ok: false, error: 'notes must be under 500 characters' };
  }
  return { ok: true, value: body };
}

export function validateFamilyMemberBody(body = {}) {
  const name = String(body.name || '').trim();
  if (!name || name.length > 200) {
    return { ok: false, error: 'name must be 1–200 characters' };
  }
  const relationships = ['self', 'spouse', 'child', 'parent', 'sibling', 'other'];
  if (body.relationship && !relationships.includes(body.relationship)) {
    return { ok: false, error: 'invalid relationship' };
  }
  return { ok: true, value: { ...body, name } };
}
