export default {
  displayName: {
    name: 'nestjs',
    color: 'magentaBright',
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
  setupFilesAfterEnv: [
    '<rootDir>/../../@core/src/shared/domain/tests/validations.ts',
    '<rootDir>/../../@core/src/shared/domain/tests/jest.ts',
  ],
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^core/(.*)$': '<rootDir>/../../@core/src/$1',
    '#shared/(.*)$': '<rootDir>/../../@core/src/shared/$1',
    '#category/(.*)$': '<rootDir>/../../@core/src/category/$1',
  },
};
