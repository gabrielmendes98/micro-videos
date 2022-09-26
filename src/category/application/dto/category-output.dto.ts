import { Category } from 'category/domain/entities/category';

export type CategoryOutputDto = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
};

export class CategoryOutputDtoMapper {
  static fromCategoryEntity(category: Category): CategoryOutputDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    };
  }
}
