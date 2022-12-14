import {
  SearchableRepositoryInterface,
  SearchParams as BaseSearchParams,
  SearchResult as BaseSearchResult,
} from '#shared/domain';
import { Category } from '../entities/category';

export namespace CategoryRepository {
  export type Filter = string;

  export class SearchParams extends BaseSearchParams<Filter> {}

  export class SearchResult extends BaseSearchResult<Category, Filter> {}

  export interface Repository
    extends SearchableRepositoryInterface<
      Category,
      Filter,
      SearchParams,
      SearchResult
    > {}
}
