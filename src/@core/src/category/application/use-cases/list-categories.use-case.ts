import { CategoryRepository } from '#category/domain';
import {
  ListOutputDto,
  ListOutputDtoMapper,
  SearchInputDto,
  UseCase as BaseUseCase,
} from '#shared/application';
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
