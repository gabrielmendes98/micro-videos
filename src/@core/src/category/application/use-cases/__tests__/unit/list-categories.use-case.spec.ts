import { Category, CategoryRepository } from '#category/domain';
import { CategoryInMemoryRepository } from '#category/infra';
import { ListCategoriesUseCase } from '../../list-categories.use-case';

describe('ListCategoriesUseCase unit tests', () => {
  let useCase: ListCategoriesUseCase.UseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new ListCategoriesUseCase.UseCase(repository);
  });

  test('toOutput method', async () => {
    const category = new Category({ name: 'movie' });

    let searchResult = new CategoryRepository.SearchResult({
      items: [category],
      current_page: 1,
      filter: null,
      per_page: 15,
      sort: null,
      sort_dir: null,
      total: 1,
    });
    let output = useCase['toOutput'](searchResult);
    expect(output).toStrictEqual({
      items: [category.toJSON()],
      total: 1,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });

    searchResult = new CategoryRepository.SearchResult({
      items: [],
      current_page: 1,
      filter: null,
      per_page: 15,
      sort: null,
      sort_dir: null,
      total: 0,
    });
    output = useCase['toOutput'](searchResult);
    expect(output).toStrictEqual({
      items: [],
      total: 0,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it('should return output with categories ordered by created_at when use empty input', async () => {
    const items = [
      new Category({
        name: 'movie',
        created_at: new Date('2022-09-26T01:06:35.882Z'),
      }),
      new Category({
        name: 'movie',
        created_at: new Date('2022-09-27T01:06:35.882Z'),
      }),
    ];
    repository.items = items;

    const output = await useCase.execute({});

    expect(output).toStrictEqual({
      items: [items[1].toJSON(), items[0].toJSON()],
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it('should be able to use input params to paginate, search and filter', async () => {
    const items = [
      new Category({
        name: 'aaaa',
        created_at: new Date('2022-09-26T01:06:35.882Z'),
      }),
      new Category({
        name: 'test',
        created_at: new Date('2022-09-27T01:06:35.882Z'),
      }),
      new Category({
        name: 'TESTEEE',
        created_at: new Date('2022-09-25T01:06:35.882Z'),
      }),
    ];
    repository.items = items;

    const arrange: {
      input: ListCategoriesUseCase.Input;
      output: ListCategoriesUseCase.Output;
    }[] = [
      {
        input: {
          filter: 'test',
        },
        output: {
          items: [items[1].toJSON(), items[2].toJSON()],
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
          items: [items[2].toJSON()],
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
          items: [items[1].toJSON(), items[0].toJSON(), items[2].toJSON()],
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
          items: [items[2].toJSON(), items[0].toJSON(), items[1].toJSON()],
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
          items: [items[1].toJSON()],
          total: 2,
          current_page: 2,
          per_page: 1,
          last_page: 2,
        },
      },
    ];

    for (const item of arrange) {
      const output = await useCase.execute(item.input);
      expect(output).toStrictEqual(item.output);
    }
  });
});
