import { CategoryRepository } from '#category/domain';
import { UseCase as BaseUseCase } from '#shared/application';
import {
  CategoryOutputDto,
  CategoryOutputDtoMapper,
} from '../dto/category-output.dto';

export namespace GetCategoryUseCase {
  export class UseCase implements BaseUseCase<Input, Output> {
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
}
