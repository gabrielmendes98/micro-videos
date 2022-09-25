import {
  RepositoryInterface,
  SearchableRepositoryInterface,
  SearchParams as BaseSearchParams,
  SearchResult as BaseSearchResult,
} from 'shared/domain/repositories/repository-contracts';
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
