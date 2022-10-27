import { UseCase as BaseUseCase } from '#shared/application';
import { Category, CategoryRepository } from '#category/domain';
import {
  CategoryOutputDto,
  CategoryOutputDtoMapper,
} from '../dto/category-output.dto';

export namespace CreateCategoryUseCase {
  export class UseCase implements BaseUseCase<Input, Output> {
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
}
