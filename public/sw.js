// Minimal service worker: exists only to satisfy Chrome's PWA installability
// check (which requires a registered service worker with a fetch handler).
// No caching — every request just goes straight to the network as normal.
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request))
})
