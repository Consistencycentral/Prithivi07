// HabitArc Service Worker v4.0 — fixed GA interception
const CACHE_NAME = 'habitarc-v4';
const STATIC_CACHE = 'habitarc-static-v4';
const DYNAMIC_CACHE = 'habitarc-dynamic-v4';

// Static assets to pre-cache on install
const PRECACHE_URLS = [
    '/dashboard/',
    '/daily/',
    '/weekly/',
    '/monthly/',
    '/annual/',
    '/calendar/',
    '/login/',
    '/manifest.json',
];

// Install: pre-cache app shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            return cache.addAll(PRECACHE_URLS);
        }).then(() => {
            return self.skipWaiting();
        })
    );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
                    .map((name) => caches.delete(name))
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

// Fetch: network-first for API, cache-first for static assets
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip Chrome extension requests
    if (url.protocol === 'chrome-extension:') return;

    // Skip Google Analytics & Tag Manager entirely — never cache these
    if (
        url.hostname.includes('googletagmanager.com') ||
        url.hostname.includes('google-analytics.com') ||
        url.hostname.includes('analytics.google.com') ||
        url.hostname.includes('googleads.g.doubleclick.net')
    ) {
        return;
    }

    // Network-first for Supabase API calls
    if (url.hostname.includes('supabase')) {
        event.respondWith(networkFirst(request));
        return;
    }

    // Network-first for Google Fonts (CSS files that @import)
    if (url.hostname.includes('fonts.googleapis.com')) {
        event.respondWith(networkFirst(request));
        return;
    }

    // Cache-first for font files (they rarely change)
    if (url.hostname.includes('fonts.gstatic.com')) {
        event.respondWith(cacheFirst(request));
        return;
    }

    // Cache-first for static assets (JS, CSS, images, icons)
    if (
        url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)
    ) {
        event.respondWith(cacheFirst(request));
        return;
    }

    // Network-first for HTML pages (navigation)
    event.respondWith(networkFirst(request));
});

// Cache-first strategy
async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        return new Response('Offline', { status: 503 });
    }
}

// Network-first strategy
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        const cached = await caches.match(request);
        if (cached) return cached;

        // Return offline fallback for navigation requests
        if (request.mode === 'navigate') {
            const offlinePage = await caches.match('/dashboard/');
            if (offlinePage) return offlinePage;
        }

        return new Response('Offline', { status: 503 });
    }
}
