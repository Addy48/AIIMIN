/**
 * Optional Sentry init (LC-09). Install @sentry/react and set REACT_APP_SENTRY_DSN.
 */
export function initSentry() {
  const dsn = process.env.REACT_APP_SENTRY_DSN;
  if (!dsn) return;
  if (typeof window !== 'undefined' && !window.__SENTRY_DSN__) {
    window.__SENTRY_DSN__ = dsn;
  }
}
