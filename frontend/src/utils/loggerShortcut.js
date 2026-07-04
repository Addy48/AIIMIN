/** Global Smart Logger shortcut — press Space, then L (works on Mac & Windows) */

export const OPEN_LOGGER_EVENT = 'aiimin-open-logger';
const CHORD_MS = 700;

function isTypingTarget(el = document.activeElement) {
  if (!el) return false;
  const tag = el.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (el.isContentEditable) return true;
  return false;
}

/**
 * Two-key chord: Space → L within CHORD_MS.
 * Returns listener + disarm for cleanup.
 */
export function createLoggerShortcutListener(onTrigger, { shouldArmSpace } = {}) {
  let spaceArmed = false;
  let timer = null;

  const disarm = () => {
    spaceArmed = false;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const canArm = () => {
    if (isTypingTarget()) return false;
    if (shouldArmSpace && !shouldArmSpace()) return false;
    return true;
  };

  const onKeyDown = (e) => {
    if (e.repeat) return;

    const hasMods = e.metaKey || e.ctrlKey || e.altKey || e.shiftKey;

    if (e.code === 'Space' && !hasMods) {
      if (!canArm()) return;
      e.preventDefault();
      disarm();
      spaceArmed = true;
      timer = setTimeout(disarm, CHORD_MS);
      return;
    }

    if (
      spaceArmed &&
      !hasMods &&
      (e.code === 'KeyL' || e.key === 'l' || e.key === 'L')
    ) {
      e.preventDefault();
      disarm();
      onTrigger();
      return;
    }

    if (spaceArmed) disarm();
  };

  return { onKeyDown, disarm };
}

export function loggerShortcutParts() {
  return ['Space', 'L'];
}

export function loggerShortcutLabel() {
  return 'Space · L';
}

export function openLogger({ focusAiLog = false } = {}) {
  window.dispatchEvent(new CustomEvent(OPEN_LOGGER_EVENT, { detail: { focusAiLog } }));
}
