/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'app.js',
    'routes/**/*.js',
  ],
  testTimeout: 30000,
};
