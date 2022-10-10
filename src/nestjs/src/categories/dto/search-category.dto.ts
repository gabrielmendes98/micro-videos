import { ListCategoriesUseCase } from 'core/category/application';
import { SortDirection } from 'core/shared/domain';

export class SearchCategoryDto implements ListCategoriesUseCase.Input {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  filter?: string;
}
