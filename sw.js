const CACHE_NAME = 'friday-sermons-pwa-v3';
const APP_SHELL = [
  './index.html',
  './manifest.webmanifest',
  './pwa-assets/fonts.css',
  './pwa-assets/favicon-32.png',
  './pwa-assets/icon-192.png',
  './pwa-assets/icon-512.png',
  './pwa-assets/fonts/amiri-1.woff',
  './pwa-assets/fonts/amiri-2.woff',
  './pwa-assets/fonts/aref-ruqaa-1.woff',
  './pwa-assets/fonts/aref-ruqaa-2.woff',
  './pwa-assets/fonts/cairo-1.woff',
  './pwa-assets/fonts/cairo-2.woff',
  './pwa-assets/fonts/cairo-3.woff',
  './pwa-assets/fonts/cairo-4.woff',
  './pwa-assets/fonts/lateef-1.woff',
  './pwa-assets/fonts/lateef-2.woff',
  './pwa-assets/fonts/material-symbols-outlined-1.woff',
  './pwa-assets/fonts/noto-naskh-arabic-1.woff',
  './pwa-assets/fonts/noto-naskh-arabic-2.woff',
  './pwa-assets/fonts/reem-kufi-1.woff',
  './pwa-assets/fonts/reem-kufi-2.woff',
  './pwa-assets/fonts/scheherazade-new-1.woff',
  './pwa-assets/fonts/scheherazade-new-2.woff',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const requestURL = new URL(event.request.url);
  if (requestURL.origin !== self.location.origin) return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (!response || response.status !== 200 || response.type !== 'basic') return response;
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match('./index.html')))
  );
});
