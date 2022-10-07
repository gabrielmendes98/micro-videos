import { CategoryRepository } from '#category/domain/repositories/category.repository';
import {
  ListOutputDto,
  ListOutputDtoMapper,
} from '#shared/application/dto/list-output.dto';
import { SearchInputDto } from '#shared/application/dto/search-input.dto';
import { UseCase as BaseUseCase } from '#shared/application/use-case';
import {
  CategoryOutputDto,
  CategoryOutputDtoMapper,
} from '../dto/category-output.dto';

export namespace ListCategoriesUseCase {
  export class UseCase implements BaseUseCase<Input, Output> {
    constructor(private categoryRepository: CategoryRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const params = new CategoryRepository.SearchParams(input);
      const searchResult = await this.categoryRepository.search(params);
      return this.toOutput(searchResult);
    }

    private toOutput(searchResult: CategoryRepository.SearchResult): Output {
      return {
        items: searchResult.items.map(
          CategoryOutputDtoMapper.fromCategoryEntity,
        ),
        ...ListOutputDtoMapper.fromSearchResult(searchResult),
      };
    }
  }

  export type Input = SearchInputDto<CategoryRepository.Filter>;

  export type Output = ListOutputDto<CategoryOutputDto>;
}
