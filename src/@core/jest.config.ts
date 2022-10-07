export default {
  displayName: {
    name: '@core',
    color: 'blue',
  },
  clearMocks: true,
  coverageDirectory: '../__coverage',
  coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  rootDir: 'src',
  setupFilesAfterEnv: ['./shared/domain/tests/validations.ts'],
  testRegex: '.*\\..*spec\\.ts$',
  transform: {
    '^.+\\.ts?$': ['@swc/jest'],
  },
};
