/* ═══════════════════════════════════════════════════════════════
   ARCHIT KONDE — PORTFOLIO  |  sw.js  (Service Worker)

   What is a Service Worker?
   ─────────────────────────
   A Service Worker is a script the browser runs in the background,
   completely separate from the web page. It acts as a programmable
   network proxy — intercepting every request your page makes and
   deciding whether to fetch it from the network or serve it from
   a local cache.

   Why does this matter?
   ─────────────────────
   Once installed, the site works even with no internet connection.
   Repeat visits also load instantly (served from cache, not network).

   Lifecycle (3 events):
   ─────────────────────
   1. install  → runs ONCE when the SW is first registered
                  → we use it to pre-cache all site assets

   2. activate → runs when the SW takes control of the page
                  → we use it to delete any OLD cache versions

   3. fetch    → runs on EVERY network request the page makes
                  → we intercept it and choose: cache or network

   Cache Strategy used here:
   ─────────────────────────
   • HTML pages   → Network-first, fall back to cache
                     (so content updates are always reflected when online)
   • CSS/JS/fonts → Cache-first, fall back to network
                     (these rarely change; fast from cache is ideal)

   Diagram:
   ─────────────────────────────────────────────────────────
   Page requests asset
        │
        ▼
   Is it in PRECACHE_ASSETS? → YES → return cached version (instant)
        │
        NO
        ▼
   Is it a navigation (HTML page)?
        YES → try network first → if offline, serve cache
        NO  → try cache first  → if not cached, try network
        │
        ▼
   Serve response to page
   ─────────────────────────────────────────────────────────
═══════════════════════════════════════════════════════════════ */

/* ── Cache version ───────────────────────────────────────────────
   Bump this string (e.g. 'v2', 'v3') whenever you deploy major
   changes. The activate event deletes any caches with old names,
   forcing users to re-download the latest assets.
──────────────────────────────────────────────────────────────── */
const CACHE_NAME = 'archit-portfolio-v5';
const OFFLINE_PAGE = '/404.html';   // shown if navigation fails offline

/* ── Assets to pre-cache on install ─────────────────────────────
   These are downloaded and stored the moment the SW installs.
   After that, they're served from cache on every request.
──────────────────────────────────────────────────────────────── */
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/styles/main.min.css',
  '/scripts/app.min.js',
  '/404.html',
  '/manifest.json',
  '/assets/icons/icon-192.svg',
  '/assets/icons/icon-512.svg'
];


/* ── INSTALL event ───────────────────────────────────────────────
   Fires once when the service worker is first installed.
   We open our named cache and store all precache assets.
   waitUntil() tells the browser "don't finish installing until
   this Promise resolves" — ensuring the cache is ready before
   the SW activates.
──────────────────────────────────────────────────────────────── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );

  /* skipWaiting() makes the new SW take over immediately
     instead of waiting for the old one to be dismissed.    */
  self.skipWaiting();
});


/* ── ACTIVATE event ──────────────────────────────────────────────
   Fires when the SW takes control of the page.
   We delete any caches whose name doesn't match CACHE_NAME.
   This is how old versions are cleaned up after a cache bump.
──────────────────────────────────────────────────────────────── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)  // find old caches
          .map(name => caches.delete(name))      // delete each one
      );
    })
  );

  /* clients.claim() makes the SW control already-open pages
     without needing a full reload.                          */
  self.clients.claim();
});


/* ── FETCH event ─────────────────────────────────────────────────
   Fires on EVERY network request from the page.
   We apply different strategies depending on the request type.
──────────────────────────────────────────────────────────────── */
self.addEventListener('fetch', event => {

  /* Ignore non-GET requests (POST, PUT, etc.) and
     cross-origin requests (e.g. Google Fonts CDN).
     Let those pass straight through to the network.          */
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  /* ── Navigation requests (HTML pages) → Network-first ──────
     Try to get a fresh version from the network.
     If offline, serve the cached version instead.
     If nothing is cached either, show the offline page.       */
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          /* Got a network response — clone it into cache      */
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => {
          /* Offline — serve cached page or fallback           */
          return caches.match(event.request)
            .then(cached => cached || caches.match(OFFLINE_PAGE));
        })
    );
    return;
  }

  /* ── All other requests (CSS, JS, fonts, images) → Cache-first
     Check cache first. If found, return immediately (fast!).
     If not cached, fetch from network and store for next time. */
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        /* Only cache valid responses (status 200, not opaque) */
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      });
    })
  );

});
