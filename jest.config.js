/** @type {import('jest').Config} */
const config = {
  // testEnvironment: 'node',
  // roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  workerIdleMemoryLimit: '512MB'
};

module.exports = config;
