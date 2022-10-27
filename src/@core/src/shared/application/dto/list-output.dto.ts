import { SearchResult } from '#shared/domain';

export type ListOutputDto<ItemDto = any> = {
  items: ItemDto[];
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
};

export class ListOutputDtoMapper {
  static fromSearchResult(
    searchResult: SearchResult,
  ): Omit<ListOutputDto, 'items'> {
    return {
      total: searchResult.total,
      current_page: searchResult.current_page,
      per_page: searchResult.per_page,
      last_page: searchResult.last_page,
    };
  }
}
