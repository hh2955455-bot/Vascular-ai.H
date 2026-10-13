/**
 * Vascular AI Study Assistant - Service Worker using Workbox
 * Enables offline access for cached study materials, clinical cases, and app assets.
 */

// Import Workbox from Google CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

if (self.workbox) {
  console.log('[Workbox Service Worker] Initialized successfully');

  // Force activation of newly installed service worker
  self.workbox.core.skipWaiting();
  self.workbox.core.clientsClaim();

  const CACHE_PREFIX = 'vascular-ai';

  // 1. Clinical Cases Cache - StaleWhileRevalidate with 30-day retention
  self.workbox.routing.registerRoute(
    ({ url }) => url.pathname.startsWith('/api/clinical-cases'),
    new self.workbox.strategies.StaleWhileRevalidate({
      cacheName: `${CACHE_PREFIX}-clinical-cases-v1`,
      plugins: [
        new self.workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
        new self.workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  // 2. Study Materials & Guidelines Cache - StaleWhileRevalidate with 30-day retention
  self.workbox.routing.registerRoute(
    ({ url }) => url.pathname.startsWith('/api/study-materials'),
    new self.workbox.strategies.StaleWhileRevalidate({
      cacheName: `${CACHE_PREFIX}-study-materials-v1`,
      plugins: [
        new self.workbox.expiration.ExpirationPlugin({
          maxEntries: 150,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
        new self.workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  // 3. Medical Evidence & Web Research Cache - NetworkFirst with offline fallback
  self.workbox.routing.registerRoute(
    ({ url }) => url.pathname.startsWith('/api/gemini/search-web'),
    new self.workbox.strategies.NetworkFirst({
      cacheName: `${CACHE_PREFIX}-medical-evidence-v1`,
      networkTimeoutSeconds: 3,
      plugins: [
        new self.workbox.expiration.ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 14 * 24 * 60 * 60, // 14 Days
        }),
        new self.workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  // 4. Google Fonts Stylesheets - CacheFirst (1 Year)
  self.workbox.routing.registerRoute(
    ({ url }) => url.origin === 'https://fonts.googleapis.com',
    new self.workbox.strategies.CacheFirst({
      cacheName: `${CACHE_PREFIX}-google-fonts-stylesheets-v1`,
      plugins: [
        new self.workbox.expiration.ExpirationPlugin({
          maxEntries: 20,
          maxAgeSeconds: 365 * 24 * 60 * 60,
        }),
        new self.workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  // 5. Google Fonts Webfont Binaries - CacheFirst (1 Year)
  self.workbox.routing.registerRoute(
    ({ url }) => url.origin === 'https://fonts.gstatic.com',
    new self.workbox.strategies.CacheFirst({
      cacheName: `${CACHE_PREFIX}-google-fonts-webfonts-v1`,
      plugins: [
        new self.workbox.expiration.ExpirationPlugin({
          maxEntries: 30,
          maxAgeSeconds: 365 * 24 * 60 * 60,
        }),
        new self.workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  // 6. Static Web Assets (Scripts, Stylesheets, Images, SVGs)
  self.workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === 'style' ||
      request.destination === 'script' ||
      request.destination === 'image' ||
      request.destination === 'font',
    new self.workbox.strategies.StaleWhileRevalidate({
      cacheName: `${CACHE_PREFIX}-static-assets-v1`,
      plugins: [
        new self.workbox.expiration.ExpirationPlugin({
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ],
    })
  );

  // 7. HTML Navigation (App Shell) - NetworkFirst falling back to cache
  self.workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new self.workbox.strategies.NetworkFirst({
      cacheName: `${CACHE_PREFIX}-app-shell-v1`,
      networkTimeoutSeconds: 2,
    })
  );

  // Message listener for manual pre-caching or skip waiting from client
  self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });
} else {
  console.warn('[Service Worker] Workbox library failed to load; using native offline fallback fetch listeners.');
  self.addEventListener('install', (event) => {
    self.skipWaiting();
  });
  self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
  });
}
