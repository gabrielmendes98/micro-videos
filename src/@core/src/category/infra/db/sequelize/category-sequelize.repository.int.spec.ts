import { Category } from '#category/domain';
import { NotFoundError, UniqueEntityId } from '#shared/domain';
import { Sequelize } from 'sequelize-typescript';
import { CategoryModel } from './category-model';
import { CategorySequelizeRepository } from './category-sequelize.repository';

describe('CategorySequelizeRepository integration tests', () => {
  let sequelize: Sequelize;
  let repository: CategorySequelizeRepository;

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
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should insert a new entity', async () => {
    let category = new Category({ name: 'movie' });
    await repository.insert(category);
    let model = await CategoryModel.findByPk(category.id);
    expect(model?.toJSON()).toStrictEqual(category.toJSON());

    category = new Category({
      name: 'movie',
      description: 'some description',
      is_active: false,
    });
    await repository.insert(category);
    model = await CategoryModel.findByPk(category.id);
    expect(model?.toJSON()).toStrictEqual(category.toJSON());
  });

  test('findById should throw error when entity not found', async () => {
    await expect(repository.findById('fake id')).rejects.toThrow(
      new NotFoundError('Entity not found using ID fake id'),
    );

    await expect(
      repository.findById(
        new UniqueEntityId('dd2d887b-6403-4519-add4-81575076e105'),
      ),
    ).rejects.toThrow(
      new NotFoundError(
        `Entity not found using ID dd2d887b-6403-4519-add4-81575076e105`,
      ),
    );
  });

  it('should find a entity by id', async () => {
    const entity = new Category({
      name: 'bla bla',
      description: 'some description',
      is_active: false,
    });
    await repository.insert(entity);

    let entityFound = await repository.findById(entity.id);
    expect(entityFound.toJSON()).toStrictEqual(entity.toJSON());

    entityFound = await repository.findById(entity.uniqueEntityId);
    expect(entityFound.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should find all entities', async () => {
    const entity = new Category({ name: 'movie' });
    await repository.insert(entity);
    const entities = await repository.findAll();
    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toStrictEqual(JSON.stringify([entity]));
  });
});
