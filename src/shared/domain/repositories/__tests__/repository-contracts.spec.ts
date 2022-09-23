import { SearchParams } from '../repository-contracts';

describe('SearchParams unit tests', () => {
  test('page prop', () => {
    const params = new SearchParams();
    expect(params.page).toBe(1);

    const arrange = [
      { page: undefined, expected: 1 },
      { page: null, expected: 1 },
      { page: '', expected: 1 },
      { page: 'some string', expected: 1 },
      { page: 0, expected: 1 },
      { page: -1, expected: 1 },
      { page: 1.1, expected: 1 },
      { page: true, expected: 1 },
      { page: false, expected: 1 },
      { page: {}, expected: 1 },
      { page: [], expected: 1 },
      { page: 1, expected: 1 },
      { page: 2, expected: 2 },
    ];

    arrange.forEach((item) => {
      expect(
        new SearchParams({
          page: item.page as any,
        }).page
      ).toBe(item.expected);
    });
  });

  test('per_page prop', () => {
    const params = new SearchParams();
    expect(params.per_page).toBe(15);

    const arrange = [
      { per_page: undefined, expected: 15 },
      { per_page: null, expected: 15 },
      { per_page: '', expected: 15 },
      { per_page: 'some string', expected: 15 },
      { per_page: 0, expected: 15 },
      { per_page: -1, expected: 15 },
      { per_page: 1.1, expected: 15 },
      { per_page: true, expected: 15 },
      { per_page: false, expected: 15 },
      { per_page: {}, expected: 15 },
      { per_page: [], expected: 15 },
      { per_page: 1, expected: 1 },
      { per_page: 2, expected: 2 },
    ];

    arrange.forEach((item) => {
      expect(
        new SearchParams({
          per_page: item.per_page as any,
        }).per_page
      ).toBe(item.expected);
    });
  });

  test('sort prop', () => {
    const params = new SearchParams();
    expect(params.sort).toBeNull();

    const arrange = [
      { sort: undefined, expected: null },
      { sort: null, expected: null },
      { sort: '', expected: null },
      { sort: 'some string', expected: 'some string' },
      { sort: 0, expected: '0' },
      { sort: -1, expected: '-1' },
      { sort: 1.1, expected: '1.1' },
      { sort: true, expected: 'true' },
      { sort: false, expected: 'false' },
      { sort: {}, expected: '[object Object]' },
      { sort: [], expected: '' },
      { sort: 1, expected: '1' },
      { sort: 2, expected: '2' },
    ];

    arrange.forEach((item) => {
      expect(
        new SearchParams({
          sort: item.sort as any,
        }).sort
      ).toBe(item.expected);
    });
  });

  test('sort_dir prop', () => {
    const nullArrange = [
      undefined,
      { sort: null },
      { sort: undefined },
      { sort: '' },
    ];
    nullArrange.forEach((item) => {
      const params = new SearchParams(item);
      expect(params.sort_dir).toBeNull();
    });

    const arrange = [
      { sort_dir: undefined, expected: 'asc' },
      { sort_dir: null, expected: 'asc' },
      { sort_dir: '', expected: 'asc' },
      { sort_dir: 'some string', expected: 'asc' },
      { sort_dir: 0, expected: 'asc' },
      { sort_dir: -1, expected: 'asc' },
      { sort_dir: 1.1, expected: 'asc' },
      { sort_dir: true, expected: 'asc' },
      { sort_dir: false, expected: 'asc' },
      { sort_dir: {}, expected: 'asc' },
      { sort_dir: [], expected: 'asc' },
      { sort_dir: 1, expected: 'asc' },
      { sort_dir: 'DESC', expected: 'desc' },
      { sort_dir: 'ASC', expected: 'asc' },
      { sort_dir: 'asc', expected: 'asc' },
      { sort_dir: 'desc', expected: 'desc' },
    ];

    arrange.forEach((item) => {
      expect(
        new SearchParams({
          sort: 'some value',
          sort_dir: item.sort_dir as any,
        }).sort_dir
      ).toBe(item.expected);
    });
  });

  test('filter prop', () => {
    const params = new SearchParams();
    expect(params.filter).toBeNull();

    const arrange = [
      { filter: null, expected: null },
      { filter: undefined, expected: null },
      { filter: '', expected: null },
      { filter: 0, expected: '0' },
      { filter: -1, expected: '-1' },
      { filter: 5.5, expected: '5.5' },
      { filter: true, expected: 'true' },
      { filter: false, expected: 'false' },
      { filter: {}, expected: '[object Object]' },
      { filter: 'field', expected: 'field' },
    ];

    arrange.forEach((i) => {
      expect(new SearchParams({ filter: i.filter as any }).filter).toBe(
        i.expected
      );
    });
  });
});
