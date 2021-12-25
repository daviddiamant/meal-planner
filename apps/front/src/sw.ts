/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-console */

import { ManifestEntry } from "workbox-build";
import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";

// Give TypeScript the correct global.
// @ts-ignore
declare const self: {
  skipWaiting: () => undefined;
  addEventListener: any;
  __WB_MANIFEST: Array<ManifestEntry>;
};

self.skipWaiting();
clientsClaim();

// Clear up the caches on new version of SW
self.addEventListener("activate", (event: any) => {
  event.waitUntil(
    caches.keys().then((cacheKeys) => {
      return Promise.all(
        cacheKeys.map(async (key): Promise<boolean | null> => {
          if (!key.includes("precache")) {
            return null;
          }

          return caches.delete(key);
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
