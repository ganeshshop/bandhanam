/* Bandhanam service worker — registered from an external file so it works
   on GitHub Pages subpaths (https://USERNAME.github.io/bandhanam/).
   Strategy: cache-first for same-origin GET requests, network fallback,
   with runtime caching of visited pages so the app works offline after
   first load. */
const CACHE = 'bandhanam-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
  // Cache the start URL (the directory index). Use './' so it resolves
  // relative to the SW's scope regardless of the subpath depth.
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(['./'])).catch(() => {})
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Remove old cache versions if you bump CACHE above.
      caches.keys().then(keys =>
        Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
      )
    ])
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  // Only handle same-origin requests; let cross-origin (QR API, fonts) pass through.
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    caches.match(req).then(cached => {
      const network = fetch(req).then(resp => {
        if (resp && resp.status === 200 && resp.type === 'basic') {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(req, clone)).catch(() => {});
        }
        return resp;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
