const path = require("path");
const slsw = require("serverless-webpack");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: slsw.lib.entries,
  target: "node12.19",
  mode: slsw.lib.options.stage === "prod" ? "production" : "development",
  optimization: {
    minimize: true,
    usedExports: true,
    minimizer: [new TerserPlugin({ parallel: true })],
  },
  performance: {
    hints: false,
  },
  externals: ["chrome-aws-lambda", "aws-sdk", "sharp", "firebase-admin"],
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|ts)$/,
        include: path.resolve(__dirname, "src"),
        sideEffects: false,
        loader: "babel-loader",
        options: {
          comments: false,
          presets: [
            [
              "@babel/preset-env",
              {
                modules: false,
                useBuiltIns: "usage",
                corejs: 3,
                targets: {
                  node: "12.19",
                },
              },
            ],
          ],
        },
      },
    ],
  },
};
