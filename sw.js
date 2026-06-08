var CACHE = 'awit-v1';
var ASSETS = [
  '.',
  'index.html',
  'awit-hymnal.json',
  'manifest.json',
  'fonts/droidSerif-Regular.ttf',
  'fonts/droidSerif-Bold.ttf',
  'fonts/droidSerif-Italic.ttf',
  'fonts/droidSerif-BoldItalic.ttf'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).then(function(resp) {
        // Cache MIDI files on first load
        if (e.request.url.indexOf('/midi/') !== -1 && resp.ok) {
          var clone = resp.clone();
          caches.open(CACHE).then(function(cache) { cache.put(e.request, clone); });
        }
        return resp;
      });
    }).catch(function() {
      return caches.match('index.html');
    })
  );
});
