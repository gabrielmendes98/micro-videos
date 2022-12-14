import { Category } from '#category/domain';
import { CategoryInMemoryRepository } from '#category/infra';
import { NotFoundError } from '#shared/domain';
import { UpdateCategoryUseCase } from '../../update-category.use-case';

describe('CreateCategoryUseCase unit tests', () => {
  let useCase: UpdateCategoryUseCase.UseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new UpdateCategoryUseCase.UseCase(repository);
  });

  it('should throw error when entity not found', async () => {
    expect(() =>
      useCase.execute({
        id: 'test id',
        name: 'movie',
        description: 'some desc',
      }),
    ).rejects.toThrow(new NotFoundError('Entity not found using ID test id'));
  });

  it('should update a category', async () => {
    const spyUpdate = jest.spyOn(repository, 'update');

    const category = new Category({ name: 'test' });
    repository.items = [category];

    const arrange: {
      input: UpdateCategoryUseCase.Input;
      output: UpdateCategoryUseCase.Output;
    }[] = [
      {
        input: { name: 'movie', description: 'some desc', id: category.id },
        output: {
          id: category.id,
          name: 'movie',
          description: 'some desc',
          is_active: true,
          created_at: category.created_at,
        },
      },
      {
        input: {
          name: 'movie',
          description: 'some desc',
          id: category.id,
          is_active: false,
        },
        output: {
          id: category.id,
          name: 'movie',
          description: 'some desc',
          is_active: false,
          created_at: category.created_at,
        },
      },
      {
        input: {
          name: 'movie',
          description: 'some desc',
          id: category.id,
          is_active: true,
        },
        output: {
          id: category.id,
          name: 'movie',
          description: 'some desc',
          is_active: true,
          created_at: category.created_at,
        },
      },
      {
        input: {
          name: 'movie',
          id: category.id,
        },
        output: {
          id: category.id,
          name: 'movie',
          description: null,
          is_active: true,
          created_at: category.created_at,
        },
      },
    ];

    for (const item of arrange) {
      const output = await useCase.execute(item.input);
      expect(output).toStrictEqual(item.output);
      expect(spyUpdate).toHaveBeenCalledTimes(1);
      spyUpdate.mockClear();
    }
  });
});
