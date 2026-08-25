const CACHE_NAME = 'friday-sermons-pwa-v13';
const APP_SHELL = [
  './index.html',
  './manifest.webmanifest',
  './pwa-assets/fonts.css',
  './pwa-assets/favicon-32.png',
  './pwa-assets/icon-192.png',
  './pwa-assets/icon-512.png',
  './pwa-assets/fonts/amiri-1.ttf',
  './pwa-assets/fonts/amiri-2.ttf',
  './pwa-assets/fonts/aref-ruqaa-1.ttf',
  './pwa-assets/fonts/aref-ruqaa-2.ttf',
  './pwa-assets/fonts/cairo-1.ttf',
  './pwa-assets/fonts/cairo-2.ttf',
  './pwa-assets/fonts/cairo-3.ttf',
  './pwa-assets/fonts/cairo-4.ttf',
  './pwa-assets/fonts/lateef-1.ttf',
  './pwa-assets/fonts/lateef-2.ttf',
  './pwa-assets/fonts/MaterialSymbolsOutlined.ttf',
  './pwa-assets/fonts/noto-naskh-arabic-1.ttf',
  './pwa-assets/fonts/noto-naskh-arabic-2.ttf',
  './pwa-assets/fonts/reem-kufi-1.ttf',
  './pwa-assets/fonts/reem-kufi-2.ttf',
  './pwa-assets/fonts/scheherazade-new-1.ttf',
  './pwa-assets/fonts/scheherazade-new-2.ttf',
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
    caches.match(event.request, { ignoreSearch: event.request.mode === 'navigate' }).then(cached => cached || fetch(event.request).then(response => {
      if (!response || response.status < 200 || response.status >= 300 || response.type !== 'basic') {
        if (event.request.mode === 'navigate') return caches.match('./index.html');
        return response;
      }
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match('./index.html')))
  );
});
