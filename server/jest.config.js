module.exports = {
  // Environment for Node.js
  testEnvironment: "node",

  // Where Jest should look for tests
  testMatch: ["**/__tests__/**/*.test.js", "**/?(*.)+(spec|test).js"],

  // Automatically clear mocks between tests
  clearMocks: true,

  // Collect coverage
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/config/**",
    "!src/utils/**",
  ],

  // Coverage output
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],

  // Detect async resources that keep Jest alive
  detectOpenHandles: true,

  // Force exit if something still hangs (last resort)
  forceExit: true,

  // Setup file (DB connections, env vars, etc.)
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // Ignore unnecessary folders
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],

  // Test timeout
  testTimeout: 15000,
};
