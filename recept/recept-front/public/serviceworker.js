importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
importScripts('/localforage.min.js');

const {strategies} = workbox;
const weekRecipes = localforage.createInstance({
	name: 'weekRecipes'
});

// Clear up the caches on new version of SW
this.addEventListener('activate', function(event) {
	event.waitUntil(
		caches.keys().then(function(cacheKeys) {
			return Promise.all(cacheKeys.map(function(key) {
				return caches.delete(key);
			}));
		})
	);
});

// Cache the startpage
workbox.routing.registerRoute(
	({url: {pathname}}) => pathname === '/' ? true : false,
	new workbox.strategies.NetworkFirst()
);

// Cache the images
self.addEventListener('fetch', function(event) {
	destination = event.request.destination || '';
	if (event.request.url.match(/\.(jpeg|jpg|png)$/) !== null) {

		event.respondWith(cacheImage(event.request));
	}
});

// Cache all remaining files
workbox.routing.registerRoute(
	/\.(?:js|html|css|json|ico)$/,
	new workbox.strategies.NetworkFirst()
);

const cacheImage = req => {
	const eventResult = fetch(req).then(async response => {
		// We can reach the server

		// Check if this recipe is planned for the current week
		const urlParts = req.url.split('/');
		const path = urlParts[urlParts.length - 2];
		const inCurrentWeek = await weekRecipes.getItem(path) || false;

		const cache = await caches.open(inCurrentWeek ? 'weekImages' : 'images');

		const isCached = await cache.match(req.url);
		if (isCached === undefined) {
			// This image is not cached, cache it
			if (inCurrentWeek) {
				// This recipe is planned, cache full size
				cache.put(req.url, response.clone());
			}
			else {
				// This recipe is not planned, cache smaller version
				let newUrl = req.url.split('.');
				const ext = newUrl.pop();
				newUrl = `${newUrl.join('.')}_small.${ext}`;
				fetch(newUrl, {headers: req.headers}).then(smallResponse => {
					// We have the response, cache it
					cache.put(req.url, smallResponse.clone());
				});
			}
		}

		return response;
	}).catch(e => {
		return caches.match(req.url);
	});

	return eventResult;
}

