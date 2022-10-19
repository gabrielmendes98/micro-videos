import { CategoryModel } from '#category/infra/db/sequelize/category-model';
import { CategorySequelizeRepository } from '#category/infra/db/sequelize/category-sequelize.repository';
import { NotFoundError } from '#shared/domain/errors/not-found.error';
import { setupSequelize } from '#shared/infra/testing/helpers/db';
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
    const category = await CategoryModel.factory().create({
      name: 'fake name',
      created_at: new Date(),
      description: 'fake desc',
      id: 'dd2d887b-6403-4519-add4-81575076e105',
      is_active: true,
    });

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
    }
  });
});
