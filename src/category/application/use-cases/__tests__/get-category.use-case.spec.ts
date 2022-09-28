import { Category } from '#category/domain/entities/category';
import { CategoryInMemoryRepository } from '#category/infra/repositories/category-in-memory.repository';
import { NotFoundError } from '#shared/domain/errors/not-found.error';
import { GetCategoryUseCase } from '../get-category.use-case';

describe('GetCategoryUseCase unit tests', () => {
  let useCase: GetCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new GetCategoryUseCase(repository);
  });

  it('should throw error when entity not found', async () => {
    expect(() => useCase.execute({ id: 'test id' })).rejects.toThrow(
      new NotFoundError('Entity not found using ID test id')
    );
  });

  it('should return category when exists', async () => {
    const category = new Category({ name: 'movie' });
    repository.items = [category];
    const spyFindById = jest.spyOn(repository, 'findById');
    const result = await useCase.execute({ id: category.id });

    expect(spyFindById).toHaveBeenCalled();
    expect(result).toStrictEqual(category.toJSON());
  });
});
