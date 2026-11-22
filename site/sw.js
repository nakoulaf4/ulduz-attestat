// Lightweight Offline PWA Service Worker for Ulduz (active on Web/PWA only; skipped in Tauri native app).
const CACHE_NAME = 'ulduz-pwa-v2';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './css/themes.css',
  './assets/favicon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/themes/voshod-scene.svg',
  './assets/themes/voshod-clouds-layer.svg',
  './assets/themes/voshod-sun.svg',
  './vendor/fonts/fonts.css',
  './vendor/fonts/theme-fonts.css',
  './vendor/fonts/ulduz-gta.woff2',
  './vendor/fonts/ulduz-intel.woff2',
  './vendor/fonts/ulduz-nvidia.woff2',
  './vendor/fonts/ulduz-amd.woff2',
  './vendor/fonts/ulduz-wide.woff2',
  './vendor/katex/katex.min.css',
  './vendor/katex/katex.min.js',
  './vendor/katex/auto-render.min.js',
  './js/core/themes.js',
  './js/core/native.js',
  './js/app/theme-modal.js',
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

  // Cache-first for immutable vendored fonts, KaTeX & icons/theme SVGs
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

  // Network-first with offline cache fallback for HTML, JS, CSS & JSON data
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
