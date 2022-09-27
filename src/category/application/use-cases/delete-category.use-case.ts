import { CategoryRepository } from 'category/domain/repositories/category.repository';
import { UseCase } from 'shared/application/use-case';

export class DeleteCategoryUseCase implements UseCase<Input, Output> {
  constructor(private categoryRepository: CategoryRepository.Repository) {}

  async execute(input: Input): Promise<Output> {
    return await this.categoryRepository.delete(input.id);
  }
}

export type Input = {
  id: string;
};

export type Output = void;
