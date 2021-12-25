require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  extends: ["@meal-planner/eslint-config/back"],
  root: true,
  parserOptions: {
    sourceType: "module",
    project: ["./tsconfig.json"],
  },
};
