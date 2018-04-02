
const filesToCache = [
  './',
  '/index.html',
  '/restaurant.html',
  '/js/main.js',
  '/js/dbhelper.js',
  '/js/restaurant_info.js',
  '/img/1.jpg',
  '/img/2.jpg',
  '/img/3.jpg',
  '/img/4.jpg',
  '/img/5.jpg',
  '/img/6.jpg',
  '/img/7.jpg',
  '/img/8.jpg',
  '/img/9.jpg',
  '/img/10.jpg',
  '/data/restaurants.json'
];

const staticCacheName = 'simple-sw-v1';

self.addEventListener('install', event => {
  // We pass a promise to event.waitUntil to signal how 
  // long install takes, and if it failed
  console.log('installing sw');
  event.waitUntil(
    // We open a cache…
    caches.open(staticCacheName).then(cache => {
      // And add resources to it
      return cache.addAll(filesToCache);
    })
    .then(result => {
        console.log('cached ', result);
    })
    .catch(err => {
        console.log('err caching ', err);
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('Activating new service worker...');

  const cacheWhitelist = [staticCacheName];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// The fetch event happens for the page request with the
// ServiceWorker's scope, and any request made within that
// page
self.addEventListener('fetch', function(event) {
    console.log('in fetch');
    console.log(event.request);
    // Calling event.respondWith means we're in charge
    // of providing the response. We pass in a promise
    // that resolves with a response object
    event.respondWith(
      // First we look for something in the caches that
      // matches the request
      caches.match(event.request).then(function(response) {
        // If we get something, we return it, otherwise
        // it's null, and we'll pass the request to
        // fetch, which will use the network.
        return response || fetch(event.request);
      })
    );
  });
