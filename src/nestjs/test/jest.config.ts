export default {
  ...require('../jest.config').default,
  rootDir: './',
  testRegex: '.*\\.e2e-spec\\.ts$',
  maxWorkers: 1,
  moduleNameMapper: {
    '^core/(.*)$': '<rootDir>/../../@core/src/$1',
    'src/(.*)$': '<rootDir>/../src/$1',
  },
};
