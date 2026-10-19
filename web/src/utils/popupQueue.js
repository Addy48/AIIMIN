import { useEffect, useState } from 'react';

/**
 * One popup at a time. Auto-opening surfaces (tour invite, consent bar …)
 * request the slot; the first one shows, the rest wait their turn by priority.
 * A popup that is already showing is never pushed aside.
 */
let active = null;
let waiting = []; // [{ id, priority, order }]
let order = 0;
const listeners = new Set();

function setActive(id) {
  if (active === id) return;
  active = id;
  listeners.forEach((fn) => fn(active));
}

function takeNext() {
  if (waiting.length === 0) return null;
  const next = waiting.reduce((best, w) => (
    w.priority > best.priority || (w.priority === best.priority && w.order < best.order) ? w : best
  ));
  waiting = waiting.filter((w) => w !== next);
  return next.id;
}

function promote() {
  if (active !== null) return;
  const next = takeNext();
  if (next !== null) setActive(next);
}

export function requestPopup(id, priority = 0) {
  if (active === id || waiting.some((w) => w.id === id)) return;
  waiting.push({ id, priority, order: order++ });
  promote();
}

export function releasePopup(id) {
  waiting = waiting.filter((w) => w.id !== id);
  // Hand the slot straight to the next popup, without a moment of "none".
  if (active === id) setActive(takeNext());
}

export function activePopup() {
  return active;
}

export function subscribePopups(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function resetPopupsForTests() {
  active = null;
  waiting = [];
  order = 0;
  listeners.clear();
}

/** Priorities: higher shows first when several popups are waiting. */
export const POPUP_PRIORITY = { tour: 10, consent: 5 };

/**
 * Returns true while `id` owns the popup slot. Pass `want=false` to give it up
 * (or never ask for it).
 */
export function usePopupSlot(id, { priority = 0, want = true } = {}) {
  const [current, setCurrent] = useState(activePopup);

  useEffect(() => subscribePopups(setCurrent), []);

  useEffect(() => {
    if (!want) return undefined;
    requestPopup(id, priority);
    return () => releasePopup(id);
  }, [id, priority, want]);

  return want && current === id;
}

/** True while any popup is showing (e.g. to tuck floating buttons away). */
export function useAnyPopupOpen() {
  const [current, setCurrent] = useState(activePopup);
  useEffect(() => subscribePopups(setCurrent), []);
  return current !== null;
}
