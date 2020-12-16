const currentCache = 'v2';


// Call Install Event
self.addEventListener('install', (e) => {
    console.log('Service Worker: Installed');
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
    console.log('Service Worker: Fetching Nih...');    
    e.respondWith(
        fetch(e.request).then(res => {
            console.log('Fetching....')
            // Make copy / clone of response
            const resClone = res.clone();
            // Open Cache
            caches.open(currentCache).then(cache => {
                // Add response to cache
                console.log({cache, resClone});
                cache.put(e.request, resClone);
            });
            return res;
        }).catch(err => caches.match(e.request).then(res => res))
    );    
});