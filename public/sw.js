/**
 * Achu AI — Offline Service Worker
 * Pre-caches application shell, offline 15-minute physics lesson, quiz assets, and fonts.
 */

const CACHE_NAME = 'achu-ai-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/icon.svg',
  '/apple-touch-icon.png',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/manifest.webmanifest',
];

// Install: Cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Pre-cache asset warning:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: Clean up older caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network first with Cache fallback (or Cache first for fonts and static assets)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip API queries from cache (API should use network, handles offline gracefully in UI)
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Static assets and fonts: Cache First, fallback to Network
  if (
    url.pathname.match(/\.(png|svg|jpg|jpeg|css|js|woff|woff2)$/) ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request)
          .then((networkRes) => {
            if (networkRes && networkRes.status === 200) {
              const resClone = networkRes.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
            }
            return networkRes;
          })
          .catch(() => cached || Response.error());
      })
    );
    return;
  }

  // Navigation requests: Network first, fallback to cached index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html') || caches.match('/');
      })
    );
    return;
  }

  // General requests: Network first, Cache fallback
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
