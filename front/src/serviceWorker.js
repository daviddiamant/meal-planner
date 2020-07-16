/* eslint-disable no-restricted-globals */

import { createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

// Clear up the caches on new version of SW
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheKeys) => {
      return Promise.all(
        cacheKeys.map((key) => {
          if (key.indexOf("precache") === -1) {
            return caches.delete(key);
          }
          return null;
        })
      );
    })
  );
});

// Set up precache
precacheAndRoute(self.__WB_MANIFEST || []);

// Cache the sites
const handler = createHandlerBoundToURL("/index.html");
const navigationRoute = new NavigationRoute(handler);
registerRoute(navigationRoute);

// Cache the API calls
registerRoute(
  ({ url: { pathname } }) =>
    (pathname.indexOf("/api/") > -1 ? true : false) && pathname !== "/api/ping",
  new NetworkFirst()
);

// Cache all remaining files
registerRoute(/\.(?:js|html|css|json|ico)$/, new StaleWhileRevalidate());

// Cache Google Fonts with a stale-while-revalidate strategy, with
// a maximum number of entries.
registerRoute(
  ({ url }) =>
    url.origin === "https://fonts.googleapis.com" ||
    url.origin === "https://fonts.gstatic.com",
  new StaleWhileRevalidate({
    cacheName: "google-fonts",
    plugins: [new ExpirationPlugin({ maxEntries: 20 })],
  })
);
