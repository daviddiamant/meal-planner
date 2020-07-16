/* global module */

// eslint-disable-next-line no-undef
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = function override(config, env) {
  if (env !== "production") {
    return config;
  }

  config.plugins.push(
    new WorkboxPlugin.InjectManifest({
      swSrc: "./src/serviceWorker.js",
      swDest: "./serviceworker.js",
    })
  );

  return config;
};
