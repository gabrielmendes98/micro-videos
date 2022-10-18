import { Entity } from '#shared/domain/entity/entity';
import { NotFoundError } from '#shared/domain/errors/not-found.error';
import { UniqueEntityId } from '#shared/domain/value-objects/unique-entity-id.vo';
import {
  InMemoryRepository,
  InMemorySearchableRepository,
} from '../in-memory.repository';
import { SearchParams, SearchResult } from '../repository-contracts';

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe('InMemoryRepository unit tests', () => {
  let repository: StubInMemoryRepository;

  beforeEach(() => {
    repository = new StubInMemoryRepository();
  });

  it('should insert a new entity', async () => {
    const entity = new StubEntity({ name: 'bla bla', price: 10 });
    await repository.insert(entity);
    expect(entity.toJSON()).toStrictEqual(repository.items[0].toJSON());
  });

  test('findById should throw error when entity not found', async () => {
    await expect(repository.findById('fake id')).rejects.toThrow(
      new NotFoundError('Entity not found using ID fake id'),
    );

    await expect(
      repository.findById(
        new UniqueEntityId('dd2d887b-6403-4519-add4-81575076e105'),
      ),
    ).rejects.toThrow(
      new NotFoundError(
        `Entity not found using ID dd2d887b-6403-4519-add4-81575076e105`,
      ),
    );
  });

  it('should find a entity by id', async () => {
    const entity = new StubEntity({ name: 'bla bla', price: 10 });
    await repository.insert(entity);

    let entityFound = await repository.findById(entity.id);
    expect(entityFound.toJSON()).toStrictEqual(entity.toJSON());

    entityFound = await repository.findById(entity.uniqueEntityId);
    expect(entityFound.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should return all entities', async () => {
    const entity = new StubEntity({ name: 'bla bla', price: 10 });
    await repository.insert(entity);

    const entities = await repository.findAll();
    expect(entities).toStrictEqual([entity]);
  });

  test('update should throw error when entity not found', () => {
    const entity = new StubEntity({ name: 'bla bla', price: 10 });

    expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID ${entity.id}`),
    );
  });

  it('should update an entity', async () => {
    const entity = new StubEntity({ name: 'bla bla', price: 10 });
    await repository.insert(entity);

    const newEntity = new StubEntity(
      { name: 'name updated', price: 2 },
      entity.uniqueEntityId,
    );

    await repository.update(newEntity);
    expect(newEntity).toStrictEqual(repository.items[0]);
  });

  test('delete should throw error when entity not found', () => {
    expect(repository.delete('fake id')).rejects.toThrow(
      new NotFoundError('Entity not found using ID fake id'),
    );

    expect(
      repository.delete(
        new UniqueEntityId('dd2d887b-6403-4519-add4-81575076e105'),
      ),
    ).rejects.toThrow(
      new NotFoundError(
        `Entity not found using ID dd2d887b-6403-4519-add4-81575076e105`,
      ),
    );
  });

  it('should delete an entity', async () => {
    const entity = new StubEntity({ name: 'bla bla', price: 10 });
    await repository.insert(entity);

    await repository.delete(entity.id);
    expect(repository.items).toHaveLength(0);

    await repository.insert(entity);
    await repository.delete(entity.uniqueEntityId);
    expect(repository.items).toHaveLength(0);
  });
});

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields: string[] = ['name'];

  protected async applyFilter(
    items: StubEntity[],
    filter: string | null,
  ): Promise<StubEntity[]> {
    if (!filter) {
      return items;
    }

    return items.filter(
      (item) =>
        item.props.name.toLowerCase().includes(filter.toLowerCase()) ||
        item.props.price.toString() === filter,
    );
  }
}

describe('InMemorySearchableRepository unit tests', () => {
  let repository: StubInMemorySearchableRepository;

  beforeEach(() => {
    repository = new StubInMemorySearchableRepository();
  });

  describe('applyFilter method', () => {
    it('should do not filter items when filter param is null', async () => {
      const items = [new StubEntity({ name: 'some name', price: 10 })];
      const spyFilter = jest.spyOn(items, 'filter');
      const filteredItems = await repository['applyFilter'](items, null);
      expect(spyFilter).not.toHaveBeenCalled();
      expect(items).toStrictEqual(filteredItems);
    });

    it('should filter using a filter param', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 10 }),
        new StubEntity({ name: 'TEST', price: 0 }),
        new StubEntity({ name: 'fake', price: 10 }),
      ];

      const spyFilterMethod = jest.spyOn(items, 'filter');

      let itemsFiltered = await repository['applyFilter'](items, 'TEST');
      expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);

      itemsFiltered = await repository['applyFilter'](items, '10');
      expect(itemsFiltered).toStrictEqual([items[0], items[2]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(2);

      itemsFiltered = await repository['applyFilter'](items, 'no-filter');
      expect(itemsFiltered).toHaveLength(0);
      expect(spyFilterMethod).toHaveBeenCalledTimes(3);
    });
  });

  describe('applySort method', () => {
    it('should do not sort items when sort param is null or not in sortableFields', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 10 }),
        new StubEntity({ name: 'TEST', price: 0 }),
        new StubEntity({ name: 'fake', price: 10 }),
      ];

      let sortedItems = await repository['applySort'](items, null, null);
      expect(sortedItems).toStrictEqual(items);

      sortedItems = await repository['applySort'](items, 'price', 'asc');
      expect(sortedItems).toStrictEqual(items);
    });

    it('should sort using valid sort param', async () => {
      const items = [
        new StubEntity({ name: 'zaza', price: 10 }),
        new StubEntity({ name: 'abab', price: 0 }),
        new StubEntity({ name: 'dodo', price: 10 }),
      ];

      let sortedItems = await repository['applySort'](items, 'name', 'asc');
      expect(sortedItems).toStrictEqual([items[1], items[2], items[0]]);

      sortedItems = await repository['applySort'](items, 'name', 'desc');
      expect(sortedItems).toStrictEqual([items[0], items[2], items[1]]);
    });
  });

  describe('applyPaginate method', () => {
    it('should paginate items correctly', async () => {
      const items = [
        new StubEntity({ name: 'aaa', price: 10 }),
        new StubEntity({ name: 'bbb', price: 0 }),
        new StubEntity({ name: 'ccc', price: 5 }),
        new StubEntity({ name: 'ddd', price: 3 }),
        new StubEntity({ name: 'eee', price: 2 }),
        new StubEntity({ name: 'fff', price: 8 }),
      ];

      let paginatedItems = await repository['applyPaginate'](items, 0, 3);
      expect(paginatedItems).toStrictEqual([items[0], items[1], items[2]]);

      paginatedItems = await repository['applyPaginate'](items, 1, 3);
      expect(paginatedItems).toStrictEqual([items[0], items[1], items[2]]);

      paginatedItems = await repository['applyPaginate'](items, 2, 3);
      expect(paginatedItems).toStrictEqual([items[3], items[4], items[5]]);

      paginatedItems = await repository['applyPaginate'](items, 3, 3);
      expect(paginatedItems).toStrictEqual([]);
    });
  });

  describe('search method', () => {
    it('should apply only paginate when other params are null', async () => {
      const entity = new StubEntity({ name: 'a', price: 5 });
      const items = Array(16).fill(entity);
      repository.items = items;

      const result = await repository.search(new SearchParams());
      expect(result).toStrictEqual(
        new SearchResult({
          items: Array(15).fill(entity),
          total: 16,
          current_page: 1,
          per_page: 15,
          sort: null,
          sort_dir: null,
          filter: null,
        }),
      );
    });

    it('should apply paginate and filter', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 5 }),
        new StubEntity({ name: 'a', price: 5 }),
        new StubEntity({ name: 'TEST', price: 5 }),
        new StubEntity({ name: 'TeSt', price: 5 }),
      ];
      repository.items = items;

      let result = await repository.search(
        new SearchParams({ page: 1, per_page: 2, filter: 'TEST' }),
      );
      expect(result).toStrictEqual(
        new SearchResult({
          items: [items[0], items[2]],
          total: 3,
          current_page: 1,
          per_page: 2,
          sort: null,
          sort_dir: null,
          filter: 'TEST',
        }),
      );

      result = await repository.search(
        new SearchParams({ page: 2, per_page: 2, filter: 'TEST' }),
      );
      expect(result).toStrictEqual(
        new SearchResult({
          items: [items[3]],
          total: 3,
          current_page: 2,
          per_page: 2,
          sort: null,
          sort_dir: null,
          filter: 'TEST',
        }),
      );
    });

    describe('should apply paginate and sort', () => {
      const items = [
        new StubEntity({ name: 'b', price: 5 }),
        new StubEntity({ name: 'a', price: 5 }),
        new StubEntity({ name: 'd', price: 5 }),
        new StubEntity({ name: 'e', price: 5 }),
        new StubEntity({ name: 'c', price: 5 }),
      ];

      const arrange = [
        {
          params: { page: 1, per_page: 2, sort: 'name' },
          result: {
            items: [items[1], items[0]],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc' as const,
            filter: null,
          },
        },
        {
          params: { page: 2, per_page: 2, sort: 'name' },
          result: {
            items: [items[4], items[2]],
            total: 5,
            current_page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc' as const,
            filter: null,
          },
        },
        {
          params: {
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc' as const,
          },
          result: {
            items: [items[3], items[2]],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc' as const,
            filter: null,
          },
        },
        {
          params: {
            page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc' as const,
          },
          result: {
            items: [items[4], items[0]],
            total: 5,
            current_page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc' as const,
            filter: null,
          },
        },
      ];

      beforeEach(() => {
        repository.items = items;
      });

      test.each(arrange)(
        'when params is $params. result should be $result',
        async (item) => {
          const result = await repository.search(new SearchParams(item.params));
          expect(result).toStrictEqual(new SearchResult(item.result));
        },
      );
    });

    it('should search using filter, sort and paginate', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 5 }),
        new StubEntity({ name: 'a', price: 5 }),
        new StubEntity({ name: 'TEST', price: 5 }),
        new StubEntity({ name: 'e', price: 5 }),
        new StubEntity({ name: 'TeSt', price: 5 }),
      ];
      repository.items = items;

      const arrange = [
        {
          params: {
            page: 1,
            per_page: 2,
            sort: 'name',
            filter: 'TEST',
          },
          result: {
            items: [items[2], items[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc' as const,
            filter: 'TEST',
          },
        },
        {
          params: {
            page: 2,
            per_page: 2,
            sort: 'name',
            filter: 'TEST',
          },
          result: {
            items: [items[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc' as const,
            filter: 'TEST',
          },
        },
        {
          params: {
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc' as const,
            filter: 'TEST',
          },
          result: {
            items: [items[0], items[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc' as const,
            filter: 'TEST',
          },
        },
      ];

      for (const i of arrange) {
        const result = await repository.search(new SearchParams(i.params));
        expect(result).toStrictEqual(new SearchResult(i.result));
      }
    });
  });
});
