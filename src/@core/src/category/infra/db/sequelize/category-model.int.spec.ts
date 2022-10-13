import { DataType, Sequelize } from 'sequelize-typescript';
import { CategoryModel } from './category-model';

describe('CategoryModel integration tests', () => {
  let sequelize: Sequelize;

  beforeAll(() => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      host: ':memory:',
      logging: false,
      models: [CategoryModel],
    });
  });

  beforeEach(async () => {
    await sequelize.sync({
      force: true,
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('mapping props', async () => {
    const attrsMap = CategoryModel.getAttributes();
    const attrs = Object.keys(attrsMap);
    expect(attrs).toStrictEqual([
      'id',
      'name',
      'description',
      'is_active',
      'created_at',
    ]);

    expect(attrsMap.id).toMatchObject({
      field: 'id',
      fieldName: 'id',
      primaryKey: true,
      type: DataType.UUID(),
    });

    expect(attrsMap.name).toMatchObject({
      field: 'name',
      fieldName: 'name',
      allowNull: false,
      type: DataType.STRING(255),
    });

    expect(attrsMap.description).toMatchObject({
      field: 'description',
      fieldName: 'description',
      allowNull: true,
      type: DataType.TEXT(),
    });

    expect(attrsMap.is_active).toMatchObject({
      field: 'is_active',
      fieldName: 'is_active',
      type: DataType.BOOLEAN(),
    });

    expect(attrsMap.created_at).toMatchObject({
      field: 'created_at',
      fieldName: 'created_at',
      type: DataType.DATE(),
    });
  });

  it('create', async () => {
    const arrange = {
      id: '8db4bb64-7109-4da2-be10-a9c16f7ed96e',
      name: 'movie',
      is_active: true,
      created_at: new Date(),
    };
    const category = await CategoryModel.create(arrange);

    expect(category.toJSON()).toStrictEqual(arrange);
  });
});
