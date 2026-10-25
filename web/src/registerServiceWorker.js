import { isCapacitorNative } from './utils/capacitorEnv';

export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  if (isCapacitorNative()) return;

  // The development server reuses stable JavaScript URLs. A service worker can
  // serve an older bundle over HMR, making the public pages appear to roll back.
  if (process.env.NODE_ENV !== 'production') {
    navigator.serviceWorker.getRegistrations().then((registrations) => Promise.all(
      registrations
        .filter((registration) => registration.active?.scriptURL === `${window.location.origin}/sw.js`)
        .map((registration) => registration.unregister()),
    )).catch(() => {});
    if ('caches' in window) window.caches.delete('aiimin-shell-v1').catch(() => {});
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('[PWA] Service worker registration failed:', err);
    });
  });
}
