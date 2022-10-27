import { Category } from '#category/domain';
import { CategoryModel, CategorySequelizeRepository } from '#category/infra';
import { setupSequelize } from '#shared/infra';
import { CreateCategoryUseCase } from '../../create-category.use-case';

describe('CreateCategoryUseCase integration tests', () => {
  let useCase: CreateCategoryUseCase.UseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new CreateCategoryUseCase.UseCase(repository);
  });

  it('should create a category', async () => {
    const arrange = [
      {
        input: { name: 'movie' },
        output: (entity: Category) => ({
          id: entity.id,
          name: 'movie',
          description: null,
          is_active: true,
          created_at: entity.created_at,
        }),
      },
      {
        input: { name: 'movie', description: 'some description' },
        output: (entity: Category) => ({
          id: entity.id,
          name: 'movie',
          description: 'some description',
          is_active: true,
          created_at: entity.created_at,
        }),
      },
      {
        input: { name: 'movie', is_active: false },
        output: (entity: Category) => ({
          id: entity.id,
          name: 'movie',
          description: null,
          is_active: false,
          created_at: entity.created_at,
        }),
      },
      {
        input: {
          name: 'movie',
          description: 'some description',
          is_active: false,
        },
        output: (entity: Category) => ({
          id: entity.id,
          name: 'movie',
          description: 'some description',
          is_active: false,
          created_at: entity.created_at,
        }),
      },
    ];

    for (const item of arrange) {
      const output = await useCase.execute(item.input);
      const entity = await repository.findById(output.id);
      expect(output).toStrictEqual(item.output(entity));
    }
  });
});
