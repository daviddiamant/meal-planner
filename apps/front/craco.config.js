const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = {
  webpack: {
    configure: (config, { env }) => {
      // ts-loader is required to reference @meal-planner/types (non-transpiled)
      config.module.rules.push({
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          transpileOnly: true,
          configFile: "tsconfig.json",
        },
      });

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
