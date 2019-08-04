const filesToCache = [
  'https://unpkg.com/modern-normalize@0.5.0/modern-normalize.css',
  'index.html',
];

const staticCacheName = 'pages-cache-v1';

self.addEventListener('install', (event) => {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(staticCacheName)
      .then(cache => cache.addAll(filesToCache))
  );
});

/**
 * Caching with cache falling back to network strategy
 */
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then(response =>
        caches.open(staticCacheName).then((cache) => {
          cache.put(event.request.url, response.clone());
          return response;
        })
      );
    })
  );
});

/**
 * Remove outdated caches
 */
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [staticCacheName];

  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  )
});
