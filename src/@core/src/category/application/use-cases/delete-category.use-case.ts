import { CategoryRepository } from '#category/domain/repositories/category.repository';
import { UseCase as BaseUseCase } from '#shared/application/use-case';

export namespace DeleteCategoryUseCase {
  export class UseCase implements BaseUseCase<Input, Output> {
    constructor(private categoryRepository: CategoryRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      return await this.categoryRepository.delete(input.id);
    }
  }

  export type Input = {
    id: string;
  };

  export type Output = void;
}
