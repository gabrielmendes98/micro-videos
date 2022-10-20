import { testConfig } from '#shared/infra/config';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';

const defaultOptions: SequelizeOptions = {
  dialect: testConfig.db.vendor,
  host: testConfig.db.host,
  logging: testConfig.db.logging,
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
