import { CategoryModel } from '#category/infra/db/sequelize/category-model';
import { CategorySequelizeRepository } from '#category/infra/db/sequelize/category-sequelize.repository';
import { NotFoundError } from '#shared/domain/errors/not-found.error';
import { setupSequelize } from '#shared/infra/testing/helpers/db';
import { GetCategoryUseCase } from '../../get-category.use-case';

describe('GetCategoryUseCase integration tests', () => {
  let useCase: GetCategoryUseCase.UseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new GetCategoryUseCase.UseCase(repository);
  });

  it('should throw error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'test id' })).rejects.toThrow(
      new NotFoundError('Entity not found using ID test id'),
    );
  });

  it('should return category when exists', async () => {
    const model = await CategoryModel.factory().create();
    const result = await useCase.execute({ id: model.id });

    expect(result).toStrictEqual(model.toJSON());
  });
});
