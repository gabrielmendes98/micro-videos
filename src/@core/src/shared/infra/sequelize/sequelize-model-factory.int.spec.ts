import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { SequelizeModelFactory } from './sequelize-model-factory';
import _chance from 'chance';
import { validate as uuidValidate } from 'uuid';
import { Sequelize } from 'sequelize-typescript';
import { setupSequelize } from '../testing/helpers/db';

const chance = _chance();

@Table({})
class StubModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name: string;

  static mockFactory = jest.fn(() => ({
    id: chance.guid({ version: 4 }),
    name: chance.word(),
  }));

  static factory() {
    return new SequelizeModelFactory(StubModel, StubModel.mockFactory);
  }
}

describe('SequelizeModelFactory integration tests', () => {
  setupSequelize({ models: [StubModel] });

  test('create method', async () => {
    let model = await StubModel.factory().create();
    expect(uuidValidate(model.id)).toBeTruthy();
    expect(model.name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalled();

    let modelFound = await StubModel.findByPk(model.id);
    expect(modelFound.id).toBe(model.id);

    model = await StubModel.factory().create({
      id: 'dd2d887b-6403-4519-add4-81575076e105',
      name: 'test',
    });
    expect(model.id).toBe('dd2d887b-6403-4519-add4-81575076e105');
    expect(model.name).toBe('test');
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);

    modelFound = await StubModel.findByPk(
      'dd2d887b-6403-4519-add4-81575076e105',
    );
    expect(modelFound.id).toBe(model.id);
  });
});
