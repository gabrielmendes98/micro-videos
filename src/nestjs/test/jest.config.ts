export default {
  ...require('../jest.config').default,
  displayName: {
    name: 'nestjs-e2e',
    color: 'yellow',
  },
  rootDir: '.',
  testRegex: '.*\\.e2e-spec\\.ts$',
  maxWorkers: 1,
  moduleNameMapper: {
    '^core/(.*)$': '<rootDir>/../../@core/src/$1',
    '#shared/(.*)$': '<rootDir>/../../@core/src/shared/$1',
    '#category/(.*)$': '<rootDir>/../../@core/src/category/$1',
    'src/(.*)$': '<rootDir>/../src/$1',
  },
  setupFilesAfterEnv: [],
};
