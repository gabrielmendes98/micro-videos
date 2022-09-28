import { Entity } from '#shared/domain/entity/entity';
import { SearchResult } from '#shared/domain/repositories/repository-contracts';
import { ListOutputDtoMapper } from './list-output.dto';

class StubEntity extends Entity {
  constructor(public name: string, public price: number) {
    super({
      name,
      price,
    });
  }
}

describe('ListOutputDtoMapper unit tests', () => {
  it('should convert searchResult to list output', () => {
    const searchResult = new SearchResult({
      items: [new StubEntity('aa', 2), new StubEntity('bb', 3)],
      total: 2,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: '',
    });

    const output = ListOutputDtoMapper.fromSearchResult(searchResult);
    expect(output).toStrictEqual({
      total: searchResult.total,
      current_page: searchResult.current_page,
      per_page: searchResult.per_page,
      last_page: searchResult.last_page,
    });
  });
});
