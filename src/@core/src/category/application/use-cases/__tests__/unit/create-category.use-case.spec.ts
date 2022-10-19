import { CategoryInMemoryRepository } from '#category/infra';
import { CreateCategoryUseCase } from '../../create-category.use-case';

describe('CreateCategoryUseCase unit tests', () => {
  let useCase: CreateCategoryUseCase.UseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new CreateCategoryUseCase.UseCase(repository);
  });

  it('should create a category', async () => {
    const spyInsert = jest.spyOn(repository, 'insert');

    const arrange = [
      {
        input: { name: 'movie' },
        output: (repository: CategoryInMemoryRepository) => ({
          id: repository.items[0].id,
          name: 'movie',
          description: null,
          is_active: true,
          created_at: repository.items[0].created_at,
        }),
      },
      {
        input: { name: 'movie', description: 'some description' },
        output: (repository: CategoryInMemoryRepository) => ({
          id: repository.items[1].id,
          name: 'movie',
          description: 'some description',
          is_active: true,
          created_at: repository.items[1].created_at,
        }),
      },
      {
        input: { name: 'movie', is_active: false },
        output: (repository: CategoryInMemoryRepository) => ({
          id: repository.items[2].id,
          name: 'movie',
          description: null,
          is_active: false,
          created_at: repository.items[2].created_at,
        }),
      },
      {
        input: {
          name: 'movie',
          description: 'some description',
          is_active: false,
        },
        output: (repository: CategoryInMemoryRepository) => ({
          id: repository.items[3].id,
          name: 'movie',
          description: 'some description',
          is_active: false,
          created_at: repository.items[3].created_at,
        }),
      },
    ];

    for (const item of arrange) {
      const output = await useCase.execute(item.input);
      expect(output).toStrictEqual(item.output(repository));
      expect(spyInsert).toHaveBeenCalledTimes(1);
      spyInsert.mockClear();
    }
  });
});
