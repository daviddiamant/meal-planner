require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  extends: ["@meal-planner/eslint-config/front"],
  root: true,
  parserOptions: {
    sourceType: "module",
    project: ["./tsconfig.json"],
  },
  ignorePatterns: ["vite.config.ts"],
};
