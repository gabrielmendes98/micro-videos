import { Sequelize, SequelizeOptions } from 'sequelize-typescript';

const defaultOptions: SequelizeOptions = {
  dialect: 'sqlite',
  host: ':memory:',
  logging: false,
};

export function setupSequelize(options: SequelizeOptions) {
  let _sequelize: Sequelize;

  beforeAll(() => {
    _sequelize = new Sequelize({ ...defaultOptions, ...options });
  });

  beforeEach(async () => {
    await _sequelize.sync({
      force: true,
    });
  });

  afterAll(async () => {
    await _sequelize.close();
  });

  return {
    get sequelize() {
      return _sequelize;
    },
  };
}
