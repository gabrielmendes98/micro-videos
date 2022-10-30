import { CategoryModel, CategorySequelizeRepository } from '#category/infra';
import { setupSequelize } from '#shared/infra';
import { ListCategoriesUseCase } from '../../list-categories.use-case';
import { Category } from '#category/domain';

describe('ListCategoriesUseCase integration tests', () => {
  let useCase: ListCategoriesUseCase.UseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new ListCategoriesUseCase.UseCase(repository);
  });

  it('should return output with categories ordered by created_at when use empty input', async () => {
    const builder = Category.fake().theCategories(2);
    const entities = builder
      .withName('movie')
      .withCreatedAt((index) => new Date(new Date().getTime() + 100 + index))
      .build();

    await repository.bulkInsert(entities);

    const output = await useCase.execute({});

    expect(output).toMatchObject({
      items: [entities[1].toJSON(), entities[0].toJSON()],
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it('should be able to use input params to paginate, search and filter', async () => {
    const builder = Category.fake().aCategory();
    const entities = [
      builder
        .withName('aaaa')
        .withCreatedAt(new Date('2022-09-26T01:06:35.882Z'))
        .build(),
      builder
        .withName('test')
        .withCreatedAt(new Date('2022-09-27T01:06:35.882Z'))
        .build(),
      builder
        .withName('TESTEEE')
        .withCreatedAt(new Date('2022-09-25T01:06:35.882Z'))
        .build(),
    ];

    await repository.bulkInsert(entities);

    const arrange: {
      input: ListCategoriesUseCase.Input;
      output: ListCategoriesUseCase.Output;
    }[] = [
      {
        input: {
          filter: 'test',
        },
        output: {
          items: [entities[1].toJSON(), entities[2].toJSON()],
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
          items: [entities[2].toJSON()],
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
            entities[1].toJSON(),
            entities[0].toJSON(),
            entities[2].toJSON(),
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
            entities[2].toJSON(),
            entities[0].toJSON(),
            entities[1].toJSON(),
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
          items: [entities[1].toJSON()],
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
