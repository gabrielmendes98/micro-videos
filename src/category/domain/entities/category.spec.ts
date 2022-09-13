import { Category } from './category';
import { omit } from 'lodash';

describe('category unit tests', () => {
  describe('constructor of category', () => {
    test('with name', () => {
      const category = new Category({ name: 'Movie' });
      const props = omit(category.props, 'created_at');
      expect(props).toStrictEqual({
        name: 'Movie',
        description: null,
        is_active: true,
      });
      expect(category.props.created_at).toBeInstanceOf(Date);
    });

    test('with name and descriptionn', () => {
      const category = new Category({
        name: 'Movie',
        description: 'other description',
      });
      expect(category.props).toMatchObject({
        name: 'Movie',
        description: 'other description',
      });
    });

    test('with name and is_active', () => {
      const category = new Category({
        name: 'Movie',
        is_active: true,
      });
      expect(category.props).toMatchObject({
        name: 'Movie',
        is_active: true,
      });
    });

    test('with name and created_at', () => {
      const created_at = new Date();
      const category = new Category({
        name: 'Movie',
        created_at,
      });
      expect(category.props).toMatchObject({
        name: 'Movie',
        created_at,
      });
    });

    test('with all props', () => {
      const created_at = new Date();
      const category = new Category({
        name: 'Movie',
        description: 'some description',
        is_active: false,
        created_at,
      });
      expect(category.props).toStrictEqual({
        name: 'Movie',
        description: 'some description',
        is_active: false,
        created_at,
      });
    });
  });
});
