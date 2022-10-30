import { Category } from '#category/domain';
import { CategoryModel, CategorySequelizeRepository } from '#category/infra';
import { NotFoundError } from '#shared/domain';
import { setupSequelize } from '#shared/infra';
import { UpdateCategoryUseCase } from '../../update-category.use-case';

describe('CreateCategoryUseCase integration tests', () => {
  let useCase: UpdateCategoryUseCase.UseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new UpdateCategoryUseCase.UseCase(repository);
  });

  it('should throw error when entity not found', async () => {
    await expect(() =>
      useCase.execute({
        id: 'test id',
        name: 'movie',
        description: 'some desc',
      }),
    ).rejects.toThrow(new NotFoundError('Entity not found using ID test id'));
  });

  it('should update a category', async () => {
    const entity = Category.fake().aCategory().build();
    repository.insert(entity);

    const arrange: {
      input: UpdateCategoryUseCase.Input;
      output: UpdateCategoryUseCase.Output;
    }[] = [
      {
        input: {
          name: 'movie',
          description: 'some desc',
          id: entity.id,
        },
        output: {
          id: entity.id,
          name: 'movie',
          description: 'some desc',
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          name: 'movie',
          description: 'some desc',
          id: entity.id,
          is_active: false,
        },
        output: {
          id: entity.id,
          name: 'movie',
          description: 'some desc',
          is_active: false,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          name: 'movie',
          description: 'some desc',
          id: entity.id,
          is_active: true,
        },
        output: {
          id: entity.id,
          name: 'movie',
          description: 'some desc',
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          name: 'movie',
          id: entity.id,
        },
        output: {
          id: entity.id,
          name: 'movie',
          description: null,
          is_active: true,
          created_at: entity.created_at,
        },
      },
    ];

    for (const item of arrange) {
      const output = await useCase.execute(item.input);
      expect(output).toStrictEqual(item.output);
    }
  });
});
