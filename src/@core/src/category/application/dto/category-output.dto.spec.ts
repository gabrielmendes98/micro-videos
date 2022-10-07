import { Category } from '#category/domain/entities/category';
import { CategoryOutputDtoMapper } from './category-output.dto';

describe('CategoryOutputDtoMapper unit tests', () => {
  it('should convert category entity to category output', () => {
    const category = new Category({ name: 'movie' });
    const output = CategoryOutputDtoMapper.fromCategoryEntity(category);

    expect(output).toStrictEqual({
      id: category.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    });
  });
});
