import { Category, CategoryProperties } from './category';
import { omit } from 'lodash';
import { UniqueEntityId } from '#shared/domain';

describe('category unit tests', () => {
  beforeEach(() => {
    Category.validate = jest.fn();
  });

  describe('constructor of category', () => {
    test('with name', () => {
      const category = new Category({ name: 'Movie' });
      const props = omit(category.props, 'created_at');
      expect(Category.validate).toHaveBeenCalled();
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

    describe('with name and id', () => {
      type CategoryData = { props: CategoryProperties; id?: UniqueEntityId };
      const arrange: CategoryData[] = [
        { props: { name: 'Movie' } },
        { props: { name: 'Movie' }, id: undefined },
        {
          props: { name: 'Movie' },
          id: new UniqueEntityId(),
        },
      ];

      test.each(arrange)('when props is (%j)', (item) => {
        const category = new Category(item.props, item.id);
        expect(category.uniqueEntityId).not.toBeNull();
        expect(category.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
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

  describe('getters', () => {
    test('name getter', () => {
      const category = new Category({
        name: 'Movie',
      });
      expect(category.name).toBe('Movie');
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

  describe('methods', () => {
    test('update should update name and description', () => {
      const arrange = {
        name: 'movie updated',
        description: 'description updated',
      };
      const category = new Category({
        name: 'movie',
        description: 'some description',
      });
      category.update(arrange.name, arrange.description);
      expect(Category.validate).toHaveBeenCalledTimes(2); // constructor and update
      expect(category.name).toBe(arrange.name);
      expect(category.description).toBe(arrange.description);
    });

    test('update should update description to null when not passed', () => {
      const arrange = {
        name: 'movie updated',
      };
      const category = new Category({
        name: 'movie',
        description: 'some description',
      });
      category.update(arrange.name);
      expect(Category.validate).toHaveBeenCalledTimes(2); // constructor and update
      expect(category.name).toBe(arrange.name);
      expect(category.description).toBeNull();
    });

    test('activate should turn is_active into true', () => {
      const category = new Category({
        name: 'movie',
        is_active: false,
      });
      category.activate();
      expect(category.is_active).toBeTruthy();
    });

    test('deactivate should turn is_active into false', () => {
      const category = new Category({
        name: 'movie',
        is_active: true,
      });
      category.deactivate();
      expect(category.is_active).toBeFalsy();
    });
  });
});
