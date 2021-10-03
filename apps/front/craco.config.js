const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = {
  webpack: {
    configure: (config, { env, paths }) => {
      if (env !== "production") {
        return config;
      }

      config.plugins.push(
        new WorkboxPlugin.InjectManifest({
          swSrc: "./src/serviceWorker.ts",
          swDest: "./serviceworker.js",
          exclude: [/index\.html/, /serviceworker\.js/],
          maximumFileSizeToCacheInBytes: 5000000,
        })
      );

      return config;
    },
  },
};
