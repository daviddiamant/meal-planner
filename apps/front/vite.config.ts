import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import { dependencies } from "./package.json";
import basicSSL from "@vitejs/plugin-basic-ssl";

const vendorPackages = [
  "react",
  "react-router-dom",
  "react-dom",
  "@tanstack/react-query",
  "@stitches/react",
];

const getChunks = (deps: Record<string, string>) => {
  const chunks = {};

  Object.keys(deps).forEach((dep) => {
    if (
      vendorPackages.includes(dep) ||
      dep.includes("firebase") ||
      dep.includes("@heroicons/react")
    )
      return;

    chunks[dep] = [dep];
  });

  return chunks;
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSSL(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      manifest: {
        theme_color: "#f9fbfa",
        background_color: "#f9fbfa",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        name: "Meal Planner - Magisk kokbok",
        short_name: "Meal Planner",
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  server: {
    https: true,
    port: 3000
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: vendorPackages,
          firebase: ["firebase/app", "firebase/auth"],
          icons: ["@heroicons/react/outline"],
          ...getChunks(dependencies),
        },
      },
    },
  },
});
