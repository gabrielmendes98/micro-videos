import { CategoryRepository } from 'category/domain/repositories/category.repository';
import { UseCase } from 'shared/application/use-case';
import {
  CategoryOutputDto,
  CategoryOutputDtoMapper,
} from '../dto/category-output.dto';

export class GetCategoryUseCase implements UseCase<Input, Output> {
  constructor(private categoryRepository: CategoryRepository.Repository) {}

  async execute(input: Input): Promise<Output> {
    const entity = await this.categoryRepository.findById(input.id);
    return CategoryOutputDtoMapper.fromCategoryEntity(entity);
  }
}

export type Input = {
  id: string;
};

export type Output = CategoryOutputDto;
