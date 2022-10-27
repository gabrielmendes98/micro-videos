import _chance from 'chance';
import {
  CategoryModel,
  CategorySequelizeRepository,
  CategoryModelMapper,
} from '#category/infra';
import { setupSequelize } from '#shared/infra';
import { ListCategoriesUseCase } from '../../list-categories.use-case';

const chance = _chance();

describe('ListCategoriesUseCase integration tests', () => {
  let useCase: ListCategoriesUseCase.UseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new ListCategoriesUseCase.UseCase(repository);
  });

  it('should return output with categories ordered by created_at when use empty input', async () => {
    const models = await CategoryModel.factory()
      .count(2)
      .bulkCreate((index) => ({
        id: chance.guid({ version: 4 }),
        name: 'movie',
        description: 'some description',
        is_active: true,
        created_at: new Date(new Date().getTime() + 100 + index),
      }));

    const output = await useCase.execute({});

    expect(output).toMatchObject({
      items: [
        CategoryModelMapper.toEntity(models[1]).toJSON(),
        CategoryModelMapper.toEntity(models[0]).toJSON(),
      ],
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it('should be able to use input params to paginate, search and filter', async () => {
    const models = CategoryModel.factory().count(3).bulkMake();
    models[0].name = 'aaaa';
    models[0].created_at = new Date('2022-09-26T01:06:35.882Z');
    models[1].name = 'test';
    models[1].created_at = new Date('2022-09-27T01:06:35.882Z');
    models[2].name = 'TESTEEE';
    models[2].created_at = new Date('2022-09-25T01:06:35.882Z');

    const modelsCreated = await CategoryModel.bulkCreate(
      models.map((m) => m.toJSON()),
    );

    const arrange: {
      input: ListCategoriesUseCase.Input;
      output: ListCategoriesUseCase.Output;
    }[] = [
      {
        input: {
          filter: 'test',
        },
        output: {
          items: [
            CategoryModelMapper.toEntity(modelsCreated[1]).toJSON(),
            CategoryModelMapper.toEntity(modelsCreated[2]).toJSON(),
          ],
          total: 2,
          current_page: 1,
          per_page: 15,
          last_page: 1,
        },
      },
      {
        input: {
          page: 2,
          per_page: 2,
        },
        output: {
          items: [CategoryModelMapper.toEntity(modelsCreated[2]).toJSON()],
          total: 3,
          current_page: 2,
          per_page: 2,
          last_page: 2,
        },
      },
      {
        input: {
          sort: 'name',
          sort_dir: 'desc',
        },
        output: {
          items: [
            CategoryModelMapper.toEntity(modelsCreated[1]).toJSON(),
            CategoryModelMapper.toEntity(modelsCreated[0]).toJSON(),
            CategoryModelMapper.toEntity(modelsCreated[2]).toJSON(),
          ],
          total: 3,
          current_page: 1,
          per_page: 15,
          last_page: 1,
        },
      },
      {
        input: {
          sort: 'name',
          sort_dir: 'asc',
        },
        output: {
          items: [
            CategoryModelMapper.toEntity(modelsCreated[2]).toJSON(),
            CategoryModelMapper.toEntity(modelsCreated[0]).toJSON(),
            CategoryModelMapper.toEntity(modelsCreated[1]).toJSON(),
          ],
          total: 3,
          current_page: 1,
          per_page: 15,
          last_page: 1,
        },
      },
      {
        input: {
          filter: 'test',
          page: 2,
          per_page: 1,
          sort: 'created_at',
          sort_dir: 'asc',
        },
        output: {
          items: [CategoryModelMapper.toEntity(modelsCreated[1]).toJSON()],
          total: 2,
          current_page: 2,
          per_page: 1,
          last_page: 2,
        },
      },
    ];

    for (const item of arrange) {
      const output = await useCase.execute(item.input);
      expect(output).toMatchObject(item.output);
    }
  });
});
