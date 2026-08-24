/**
 * jestSetupGlobals.js — runs BEFORE any module imports (jest setupFiles, not setupFilesAfterFramework).
 * Polyfills browser APIs that jsdom does not implement but that framer-motion and other
 * animation/media libraries call synchronously at import time or during element mounting.
 */

// window.matchMedia — framer-motion 11 calls window.matchMedia(...) during element mount
// (initPrefersReducedMotion at line 5188 of framer-motion/dist/cjs/index.js).
// The return value must be a full MediaQueryList-like object — never undefined/null.
function _matchMediaImpl(query) {
  return {
    matches: false,
    media: query || '',
    onchange: null,
    addListener: function () {},   // deprecated but framer-motion 11 uses this
    removeListener: function () {},
    addEventListener: function () {},
    removeEventListener: function () {},
    dispatchEvent: function () { return false; },
  };
}

// Assign on global first (jsdom shares global === window, but be explicit)
global.matchMedia = _matchMediaImpl;

// Also set directly on window — covers cases where framer-motion reads window.matchMedia
// vs global.matchMedia in the JSDOM vm context.
if (typeof window !== 'undefined') {
  window.matchMedia = _matchMediaImpl;
  // Additionally patch via defineProperty to handle any cached descriptor
  try {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: _matchMediaImpl,
    });
  } catch (_) {
    // already set via direct assignment above — safe to ignore
  }
}


// IntersectionObserver — used in Brand.jsx and Identity.jsx
if (typeof global.IntersectionObserver === 'undefined') {
  global.IntersectionObserver = function IntersectionObserver() {
    return { observe: function () {}, unobserve: function () {}, disconnect: function () {} };
  };
}

// ResizeObserver — used by @visx and chart components
if (typeof global.ResizeObserver === 'undefined') {
  global.ResizeObserver = function ResizeObserver() {
    return { observe: function () {}, unobserve: function () {}, disconnect: function () {} };
  };
}
