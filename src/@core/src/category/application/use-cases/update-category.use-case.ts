import { CategoryRepository } from '#category/domain/repositories/category.repository';
import { UseCase as BaseUseCase } from '#shared/application/use-case';
import {
  CategoryOutputDto,
  CategoryOutputDtoMapper,
} from '../dto/category-output.dto';

export namespace UpdateCategoryUseCase {
  export class UseCase implements BaseUseCase<Input, Output> {
    constructor(private categoryRepository: CategoryRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.categoryRepository.findById(input.id);
      entity.update(input.name, input.description);

      if (input.is_active === true) {
        entity.activate();
      } else if (input.is_active === false) {
        entity.deactivate();
      }

      await this.categoryRepository.update(entity);
      return CategoryOutputDtoMapper.fromCategoryEntity(entity);
    }
  }

  export type Input = {
    id: string;
    name: string;
    description?: string;
    is_active?: boolean;
  };

  export type Output = CategoryOutputDto;
}
