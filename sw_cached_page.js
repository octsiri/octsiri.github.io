const currentCache = 'v2';
const cacheAssets = [
    'index.html',
    '/pages/about.html',
    '/pages/contact.html',
    '/css/materialize.min.css',
    '/css/styles.css',
    '/img/dish.png',
    '/js/main.js',
    '/js/materialize.min.js',
    '/js/ui.js'
]

// Call Install Event
self.addEventListener('install', (e) => {
    console.log('Service Worker: Installed');
    e.waitUntil(
        caches.open(currentCache).
        then(cache => {
            console.log('Service Worker: Caching Files')
            cache.addAll(cacheAssets);
        }).
        then(() => self.skipWaiting())
    );
})

// Call Activate Event
self.addEventListener('activate', (e) => {
    console.log('Service Worker: Activated');
    // Remove unwanted caches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            console.log('Cache Names: ', cacheNames);
            return Promise.all(
                cacheNames.map(cacheName => {
                    if(currentCache !== cacheName) {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cacheName);
                    }
                })
            )
        })
    );            
});

// Call Fetch Event
self.addEventListener('fetch', (e) => {
    console.log('Service Worker: Fetching...');    
    e.respondWith(
        fetch(e.request).
        catch((err) => {
            console.log('Trying to fetch to : ', e.request);
            caches.match(e.request);
        }))
})