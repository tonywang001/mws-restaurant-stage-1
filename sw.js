self.addEventListener('install', event => {
  // We pass a promise to event.waitUntil to signal how 
  // long install takes, and if it failed
  console.log('installing sw');
  event.waitUntil(
    // We open a cache…
    caches.open('simple-sw-v1').then(cache => {
      // And add resources to it
      return cache.addAll([
        './',
        '/index.html',
        '/restaurant.html',
        '/js/main.js',
        '/js/dbhelper.js',
        '/restaurant_info.js'
      ]);
    })
    .then(result => {
        console.log('cached ', result);
    })
    .catch(err => {
        console.log('err caching ', err);
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
