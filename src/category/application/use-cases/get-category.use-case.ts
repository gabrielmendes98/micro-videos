import { CategoryRepository } from 'category/domain/repositories/category.repository';
import { CategoryOutput } from '../dto/category-output.dto';

export class GetCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository.Repository) {}

  async execute(input: Input): Promise<Output> {
    const entity = await this.categoryRepository.findById(input.id);
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    };
  }
}

export type Input = {
  id: string;
};

export type Output = CategoryOutput;