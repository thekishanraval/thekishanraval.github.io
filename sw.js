// Define cache name for us to use later
const cacheName = 'news-v1';
 // define static assets to be cached
const staticAssets = [
  './',
  './app.js',
  './style.css'
];

// Add an event listener for install of the service worker and add them to cache
self.addEventListener('install', async function () {
  const cache = await caches.open(cacheName);
  cache.addAll(staticAssets);
});

// Add an event listener when service worker is activated
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});


 // Add an event listener when a JSON request is fetched from an API
self.addEventListener('fetch', event => {
//define the request
  const request = event.request;
  //define the URL
  const url = new URL(request.url);
  //Check if the URL resource is available at our location, then serve from cache
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request));
  } else {
    // Else server from the network
    event.respondWith(networkFirst(request));
  }
});

// Implement the cacheFirst mechanism to serve resources from cache first
async function cacheFirst(request) {
  // Define the cached response with the request
  const cachedResponse = await caches.match(request);
  // Check and return if it exists in cache, else fetch from network.
  return cachedResponse || fetch(request);
}

// Implement the networkFirst mechanism to server resources from Network
async function networkFirst(request) {
  //Define the dynamic cache
  const dynamicCache = await caches.open('news-dynamic');
// Check if the resource is available over the network
  try {
    //fetch the resource over the network
    const networkResponse = await fetch(request);
    //Add the resouce to the cache and return
    dynamicCache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (err) {
    // If unsuccessful, check if the resource exists in cache, else serve fallback JSON
    const cachedResponse = await dynamicCache.match(request);
    return cachedResponse || await caches.match('./fallback.json');
  }
}
