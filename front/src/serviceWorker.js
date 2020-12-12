/* eslint-disable no-restricted-globals */

import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { skipWaiting, clientsClaim } from "workbox-core";

skipWaiting();
clientsClaim();

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

// Cache the API calls
registerRoute(
  ({ url: { pathname } }) => (pathname.indexOf("/api/") > -1 ? true : false),
  new NetworkFirst()
);
registerRoute(
  ({ url: { pathname } }) =>
    pathname.indexOf("/api/user") > -1 ? true : false,
  new StaleWhileRevalidate({
    cacheName: "user-info",
  })
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
