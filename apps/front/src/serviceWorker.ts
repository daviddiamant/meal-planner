/// <reference lib="WebWorker" />

import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";

declare const self: ServiceWorkerGlobalScope;

// @ts-ignore
self.skipWaiting();
clientsClaim();

// Clear up the caches on new version of SW
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheKeys) => {
      return Promise.all(
        cacheKeys.map((key) => {
          if (!key.includes("precache")) {
            return null;
          }

          caches.delete(key);
        })
      );
    })
  );
});

// Set up precache
precacheAndRoute(self.__WB_MANIFEST);

// Cache the API calls
registerRoute(
  ({ url: { pathname } }) => (pathname.includes("/api/") ? true : false),
  new NetworkFirst()
);
registerRoute(
  ({ url: { pathname } }) => (pathname.includes("/api/user") ? true : false),
  new StaleWhileRevalidate({
    cacheName: "user-info",
  })
);

// Cache all remaining files
registerRoute(
  /\.(?:js|html|css|json|ico|jpg|jpeg|png|svg)$/,
  new StaleWhileRevalidate()
);

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
