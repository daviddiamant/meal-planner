module.exports = {
  env: {
    es2020: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier",
  ],
  plugins: [
    "@typescript-eslint",
    "jest",
    "prettier",
    "simple-import-sort",
    "sort-destructure-keys",
  ],
  rules: {
    "jest/valid-describe": "off",
    "prettier/prettier": "error",
    "simple-import-sort/exports": "error",
    "simple-import-sort/imports": "error",
    "sort-destructure-keys/sort-destructure-keys": 2,
  },
  parser: "@typescript-eslint/parser",
};
