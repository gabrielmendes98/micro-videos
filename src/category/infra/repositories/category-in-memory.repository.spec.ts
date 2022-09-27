import { Category } from 'category/domain/entities/category';
import { CategoryInMemoryRepository } from './category-in-memory.repository';

describe('CategoryInMemoryRepository unit tests', () => {
  const items: Category[] = [
    new Category({
      name: 'movie',
      created_at: new Date('2022-02-19T00:00:00Z'),
    }),
    new Category({
      name: 'series',
      created_at: new Date('2022-02-21T00:00:00Z'),
    }),
    new Category({
      name: 'trailers',
      created_at: new Date('2022-02-20T00:00:00Z'),
    }),
  ];
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
  });

  describe('applyFilter method', () => {
    it('should return all items when filter is not passed', async () => {
      repository.items = items;

      const filteredItems = await repository['applyFilter'](
        repository.items,
        ''
      );
      expect(filteredItems).toStrictEqual(items);
    });

    it('should filter category by full name', async () => {
      repository.items = items;

      const filteredItems = await repository['applyFilter'](
        repository.items,
        'movie'
      );
      expect(filteredItems).toStrictEqual([items[0]]);
    });

    it('should filter category by part of name', async () => {
      repository.items = items;

      const filteredItems = await repository['applyFilter'](
        repository.items,
        'mov'
      );
      expect(filteredItems).toStrictEqual([items[0]]);
    });
  });

  describe('applySort method', () => {
    it('should sort by created_at and desc order by default', async () => {
      const sortedItems = await repository['applySort'](items, null, null);

      expect(sortedItems).toStrictEqual([items[1], items[2], items[0]]);
    });

    it('should sort by passed sort and direction', async () => {
      let sortedItems = await repository['applySort'](
        items,
        'created_at',
        'desc'
      );
      expect(sortedItems).toStrictEqual([items[1], items[2], items[0]]);

      sortedItems = await repository['applySort'](items, 'created_at', 'asc');
      expect(sortedItems).toStrictEqual([items[0], items[2], items[1]]);

      sortedItems = await repository['applySort'](items, 'name', 'desc');
      expect(sortedItems).toStrictEqual([items[2], items[1], items[0]]);

      sortedItems = await repository['applySort'](items, 'name', 'asc');
      expect(sortedItems).toStrictEqual([items[0], items[1], items[2]]);
    });
  });
});
