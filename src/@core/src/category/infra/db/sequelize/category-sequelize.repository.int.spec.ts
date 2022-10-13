import { Category, CategoryRepository } from '#category/domain';
import { NotFoundError, UniqueEntityId } from '#shared/domain';
import { setupSequelize } from '#shared/infra/testing/helpers/db';
import { CategoryModel } from './category-model';
import { CategorySequelizeRepository } from './category-sequelize.repository';
import _chance from 'chance';

const chance = _chance();

describe('CategorySequelizeRepository integration tests', () => {
  setupSequelize({ models: [CategoryModel] });
  let repository: CategorySequelizeRepository;

  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel);
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

  describe('search method tests', () => {
    it('should only apply paginate when other params are null', async () => {
      const created_at = new Date();
      await CategoryModel.factory()
        .count(16)
        .bulkCreate(() => ({
          id: chance.guid({ version: 4 }),
          name: 'movie',
          description: null,
          is_active: true,
          created_at,
        }));

      const searchOutput = await repository.search(
        new CategoryRepository.SearchParams(),
      );

      expect(searchOutput).toBeInstanceOf(CategoryRepository.SearchResult);
      expect(searchOutput.items).toHaveLength(15);
      expect(searchOutput).toMatchObject({
        total: 16,
        current_page: 1,
        per_page: 15,
        last_page: 2,
        sort: null,
        sort_dir: null,
        filter: null,
      });
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(Category);
        expect(item.id).toBeDefined();
      });
      const items = searchOutput.items.map((item) => item.toJSON());
      expect(items).toMatchObject(
        new Array(15).fill({
          name: 'movie',
          description: null,
          is_active: true,
          created_at: created_at,
        }),
      );
    });
  });
});
