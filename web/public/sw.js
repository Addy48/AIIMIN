/* AIIMIN PWA — cache static shell; network-first for API */
const CACHE = 'aiimin-shell-v2';
const SHELL = ['/', '/m', '/manifest.json', '/logo192.png', '/logo512.png', '/favicon-light.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
    )).then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith('/api') || url.hostname.includes('api.aiimin.in')) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request)),
    );
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/')),
    );
    return;
  }

  // Prefer the current deployment. Use the cached copy only when offline so
  // stable public URLs (CSS, fonts and images) cannot freeze an older design.
  event.respondWith(
    fetch(request).then((response) => {
      if (!response || response.status !== 200 || response.type !== 'basic') return response;
      const clone = response.clone();
      caches.open(CACHE).then((cache) => cache.put(request, clone));
      return response;
    }).catch(() => caches.match(request)),
  );
});
