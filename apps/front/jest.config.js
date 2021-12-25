const config = {
  roots: ["<rootDir>"],
  verbose: true,
  resetMocks: true,
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/jest/setupTests.ts"],
  testMatch: ["<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}"],
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
  transformIgnorePatterns: [
    "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$",
    "node_modules/@meal-planner/*",
  ],
  moduleDirectories: ["node_modules"],
  moduleFileExtensions: ["js", "mjs", "jsx", "ts", "tsx", "json"],
};

export default config;
