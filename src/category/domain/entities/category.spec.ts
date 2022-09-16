import { Category, CategoryProperties } from './category';
import { omit } from 'lodash';
import { UniqueEntityId } from 'shared/domain/value-objects/unique-entity-id.vo';

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

    test('with name and id', () => {
      type CategoryData = { props: CategoryProperties; id?: UniqueEntityId };
      const data: CategoryData[] = [
        { props: { name: 'Movie' } },
        { props: { name: 'Movie' }, id: null },
        { props: { name: 'Movie' }, id: undefined },
        {
          props: { name: 'Movie' },
          id: new UniqueEntityId(),
        },
      ];

      data.forEach((i) => {
        const category = new Category(i.props, i.id);
        expect(category.id).not.toBeNull();
        expect(category.id).toBeInstanceOf(UniqueEntityId);
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

  describe('getters and setters', () => {
    test('name getter', () => {
      const category = new Category({
        name: 'Movie',
      });
      expect(category.name).toBe('Movie');
    });
    test('name setter', () => {
      const category = new Category({
        name: 'Movie',
      });
      category['name'] = 'change movie';
      expect(category.name).toBe('change movie');
    });

    test('description getter', () => {
      let category = new Category({
        name: 'Movie',
        description: 'some description',
      });
      expect(category.description).toBe('some description');

      category = new Category({
        name: 'Movie',
      });
      expect(category.description).toBeNull();
    });
    test('description setter', () => {
      const category = new Category({
        name: 'Movie',
      });

      category['description'] = 'desc';
      expect(category.description).toBe('desc');

      category['description'] = undefined;
      expect(category.description).toBeNull();

      category['description'] = null;
      expect(category.description).toBeNull();
    });

    test('is_active getter', () => {
      let category = new Category({
        name: 'Movie',
      });
      expect(category.is_active).toBeTruthy();

      category = new Category({
        name: 'Movie',
        is_active: true,
      });
      expect(category.is_active).toBeTruthy();

      category = new Category({
        name: 'Movie',
        is_active: false,
      });
      expect(category.is_active).toBeFalsy();
    });
    test('is_active setter', () => {
      const category = new Category({
        name: 'Movie',
      });

      category['is_active'] = false;
      expect(category.is_active).toBeFalsy();

      category['is_active'] = true;
      expect(category.is_active).toBeTruthy();
    });

    test('created_at getter', () => {
      let category = new Category({
        name: 'Movie',
      });

      expect(category.created_at).toBeInstanceOf(Date);

      const created_at = new Date();
      category = new Category({
        name: 'Movie',
        created_at,
      });
      expect(category.created_at).toBe(created_at);
    });
  });
});
