import { THEME_LIGHT } from '../constants/themes';

const TRANSITION_MS = 580;

export function getTransitionOrigin(event) {
  if (!event) return {};
  const { clientX, clientY } = event;
  if (typeof clientX === 'number' && typeof clientY === 'number') {
    return { clientX, clientY };
  }
  return {};
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function setTransitionOrigin({ clientX, clientY } = {}) {
  const root = document.documentElement;
  const x = clientX ?? window.innerWidth / 2;
  const y = clientY ?? window.innerHeight / 2;
  root.style.setProperty('--theme-transition-x', `${x}px`);
  root.style.setProperty('--theme-transition-y', `${y}px`);
}

function runOverlayFallback(applyTheme, nextTheme) {
  const root = document.documentElement;
  const overlay = document.createElement('div');
  overlay.className = 'theme-transition-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.style.background = nextTheme === THEME_LIGHT ? '#F7F4EE' : '#14171A';
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.classList.add('is-visible');
  });

  window.setTimeout(() => {
    root.classList.add('theme-transitioning');
    applyTheme();
    overlay.classList.add('is-exiting');

    window.setTimeout(() => {
      overlay.remove();
      root.classList.remove('theme-transitioning');
    }, TRANSITION_MS);
  }, Math.round(TRANSITION_MS * 0.42));
}

/**
 * Animate theme swap — circular reveal from click (View Transitions API)
 * with overlay crossfade fallback for browsers without support.
 */
export function runThemeTransition(applyTheme, options = {}) {
  if (prefersReducedMotion()) {
    applyTheme();
    return;
  }

  setTransitionOrigin(options);
  const root = document.documentElement;
  root.classList.add('theme-transition-active');

  const cleanup = () => {
    window.setTimeout(() => root.classList.remove('theme-transition-active'), TRANSITION_MS + 80);
  };

  if (typeof document.startViewTransition === 'function') {
    const transition = document.startViewTransition(() => {
      applyTheme();
    });
    transition.finished.finally(cleanup);
    return;
  }

  runOverlayFallback(applyTheme, options.nextTheme);
  cleanup();
}
