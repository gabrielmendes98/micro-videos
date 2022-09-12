import { Category } from './category';

describe('category unit tests', () => {
  test('constructor of category', () => {
    const category = new Category('Movie');
    expect(category.name).toBe('Movie');
  });
});
