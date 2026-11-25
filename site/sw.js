// Lightweight Offline PWA Service Worker for Ulduz (active on Web/PWA only; skipped in Tauri native app).
const CACHE_NAME = 'ulduz-pwa-v8';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './css/tokens.css',
  './css/primitives.css',
  './css/styles.css',
  './css/themes.css',
  './assets/favicon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/textures/matte-stock-dark.png',
  './assets/textures/matte-stock-light.png',
  './vendor/fonts/fonts.css',
  './vendor/fonts/theme-fonts.css',
  './vendor/fonts/ulduz-intel.woff2',
  './vendor/fonts/ulduz-nvidia.woff2',
  './vendor/fonts/ulduz-amd.woff2',
  './vendor/fonts/ulduz-wide.woff2',
  './vendor/katex/katex.min.css',
  './vendor/katex/katex.min.js',
  './vendor/katex/auto-render.min.js',
  './js/core/themes.js',
  './js/core/native.js',
  './js/core/telemetry.js',
  './js/core/ai-gateway.js',
  './js/core/updater.js',
  './js/subjects/_shared/block-helpers.js',
  './js/lessons/index.js',
  './js/lessons/svg-diagrams.js',
  './js/app/fx-engine.js',
  './js/app/ui-kit.js',
  './js/app/theme-modal.js',
  './js/app/views/lesson.js',
  './js/app/views/ai.js',
  './js/app/views/settings.js',
  './js/app/main.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.includes('/vendor/') || url.pathname.includes('/assets/')) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        });
      })
    );
    return;
  }

  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html')))
  );
});
