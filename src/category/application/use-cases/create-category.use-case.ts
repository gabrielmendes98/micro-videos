import { Category } from 'category/domain/entities/category';
import { CategoryRepository } from 'category/domain/repositories/category.repository';
import { UseCase } from 'shared/application/use-case';
import {
  CategoryOutputDto,
  CategoryOutputDtoMapper,
} from '../dto/category-output.dto';

export class CreateCategoryUseCase implements UseCase<Input, Output> {
  constructor(private categoryRepository: CategoryRepository.Repository) {}

  async execute(input: Input): Promise<Output> {
    const entity = new Category(input);
    await this.categoryRepository.insert(entity);
    return CategoryOutputDtoMapper.fromCategoryEntity(entity);
  }
}

export type Input = {
  name: string;
  description?: string;
  is_active?: boolean;
};

export type Output = CategoryOutputDto;
