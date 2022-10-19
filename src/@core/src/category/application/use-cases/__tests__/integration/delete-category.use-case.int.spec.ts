import { CategoryModel } from '#category/infra/db/sequelize/category-model';
import { CategorySequelizeRepository } from '#category/infra/db/sequelize/category-sequelize.repository';
import { NotFoundError } from '#shared/domain/errors/not-found.error';
import { setupSequelize } from '#shared/infra/testing/helpers/db';
import { DeleteCategoryUseCase } from '../../delete-category.use-case';

describe('DeleteCategoryUseCase integration tests', () => {
  let useCase: DeleteCategoryUseCase.UseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new DeleteCategoryUseCase.UseCase(repository);
  });

  it('should throw error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'test id' })).rejects.toThrow(
      new NotFoundError('Entity not found using ID test id'),
    );
  });

  it('should delete category when exists', async () => {
    const model = await CategoryModel.factory().create();

    expect(await CategoryModel.findByPk(model.id)).toBeTruthy();

    await useCase.execute({ id: model.id });

    expect(await CategoryModel.findByPk(model.id)).toBeNull();
  });
});
