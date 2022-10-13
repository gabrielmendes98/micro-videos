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
    return new SequelizeModelFactory<StubModel, { id: string; name: string }>(
      StubModel,
      StubModel.mockFactory,
    );
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

  test('make method', async () => {
    let model = StubModel.factory().make();
    expect(uuidValidate(model.id)).toBeTruthy();
    expect(model.name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalled();

    model = StubModel.factory().make({
      id: 'dd2d887b-6403-4519-add4-81575076e105',
      name: 'test',
    });
    expect(model.id).toBe('dd2d887b-6403-4519-add4-81575076e105');
    expect(model.name).toBe('test');
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
  });

  test('bulkCreate method using count = 1', async () => {
    let models = await StubModel.factory().bulkCreate();

    expect(models).toHaveLength(1);
    expect(models[0].id).not.toBeNull();
    expect(models[0].name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalled();

    let modelFound = await StubModel.findByPk(models[0].id);
    expect(modelFound.id).toBe(models[0].id);
    expect(modelFound.name).toBe(models[0].name);

    models = await StubModel.factory().bulkCreate(() => ({
      id: 'dd2d887b-6403-4519-add4-81575076e105',
      name: 'test',
    }));

    expect(models).toHaveLength(1);
    expect(models[0].id).toBe('dd2d887b-6403-4519-add4-81575076e105');
    expect(models[0].name).toBe('test');
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);

    modelFound = await StubModel.findByPk(models[0].id);
    expect(modelFound.id).toBe(models[0].id);
    expect(modelFound.name).toBe(models[0].name);
  });

  test('bulkCreate method using count > 1', async () => {
    let models = await StubModel.factory().count(2).bulkCreate();

    expect(models).toHaveLength(2);
    expect(models[0].id).not.toBeNull();
    expect(models[0].name).not.toBeNull();
    expect(models[1].id).not.toBeNull();
    expect(models[1].name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalled();

    let modelFound = await StubModel.findByPk(models[0].id);
    expect(modelFound.id).toBe(models[0].id);
    expect(modelFound.name).toBe(models[0].name);
    modelFound = await StubModel.findByPk(models[1].id);
    expect(modelFound.id).toBe(models[1].id);
    expect(modelFound.name).toBe(models[1].name);

    models = await StubModel.factory()
      .count(2)
      .bulkCreate(() => ({
        id: chance.guid({ version: 4 }),
        name: 'test',
      }));

    expect(models).toHaveLength(2);
    expect(models[0].id).not.toBe(models[1].id);
    expect(models[0].name).toBe('test');
    expect(models[1].name).toBe('test');
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);
  });

  test('bulkMake method using count = 1', async () => {
    let models = StubModel.factory().bulkMake();

    expect(models).toHaveLength(1);
    expect(models[0].id).not.toBeNull();
    expect(models[0].name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalled();

    models = StubModel.factory().bulkMake(() => ({
      id: 'dd2d887b-6403-4519-add4-81575076e105',
      name: 'test',
    }));

    expect(models).toHaveLength(1);
    expect(models[0].id).toBe('dd2d887b-6403-4519-add4-81575076e105');
    expect(models[0].name).toBe('test');
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
  });

  test('bulkMake method using count > 1', async () => {
    let models = StubModel.factory().count(2).bulkMake();

    expect(models).toHaveLength(2);
    expect(models[0].id).not.toBeNull();
    expect(models[0].name).not.toBeNull();
    expect(models[1].id).not.toBeNull();
    expect(models[1].name).not.toBeNull();
    expect(models[0].id).not.toBe(models[1].id);
    expect(StubModel.mockFactory).toHaveBeenCalled();

    models = StubModel.factory()
      .count(2)
      .bulkMake(() => ({
        id: chance.guid({ version: 4 }),
        name: 'test',
      }));

    expect(models).toHaveLength(2);
    expect(models[0].id).not.toBe(models[1].id);
    expect(models[0].name).toBe('test');
    expect(models[1].name).toBe('test');
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);
  });
});
