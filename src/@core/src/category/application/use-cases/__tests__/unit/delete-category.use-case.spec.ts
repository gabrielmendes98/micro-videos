import { Category } from '#category/domain';
import { CategoryInMemoryRepository } from '#category/infra';
import { NotFoundError } from '#shared/domain';
import { DeleteCategoryUseCase } from '../../delete-category.use-case';

describe('DeleteCategoryUseCase unit tests', () => {
  let useCase: DeleteCategoryUseCase.UseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new DeleteCategoryUseCase.UseCase(repository);
  });

  it('should throw error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'test id' })).rejects.toThrow(
      new NotFoundError('Entity not found using ID test id'),
    );
  });

  it('should delete category when exists', async () => {
    const category = new Category({ name: 'movie' });
    repository.items = [category];
    const spyDelete = jest.spyOn(repository, 'delete');
    await useCase.execute({ id: category.id });

    expect(spyDelete).toHaveBeenCalled();
    expect(repository.items).toStrictEqual([]);
  });
});
