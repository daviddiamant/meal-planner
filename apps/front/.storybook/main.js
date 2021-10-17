module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
  ],
  webpackFinal: async (config) => {
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

    return config;
  },
};
