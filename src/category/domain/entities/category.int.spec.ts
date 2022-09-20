import { ValidationError } from 'shared/domain/errors/validation.error';
import { Category } from './category';

describe('Category integration tests', () => {
  describe('create/constructor', () => {
    it('should be a invalid category when create using invalid name field', () => {
      const arrange = [
        { value: null, error: new ValidationError('The name is required') },
        {
          value: undefined,
          error: new ValidationError('The name is required'),
        },
        { value: '', error: new ValidationError('The name is required') },
        {
          value: 't'.repeat(256),
          error: new ValidationError(
            'The name must be less or equal than 255 characters'
          ),
        },
        { value: 5, error: new ValidationError('The name must be a string') },
      ];

      arrange.forEach((item) => {
        expect(() => new Category({ name: item.value as any })).toThrow(
          item.error
        );
      });
    });

    it('should be a invalid category when create using invalid description field', () => {
      const arrange = [
        {
          value: 5,
          error: new ValidationError('The description must be a string'),
        },
        {
          value: [],
          error: new ValidationError('The description must be a string'),
        },
      ];

      arrange.forEach((item) => {
        expect(
          () => new Category({ name: 'movie', description: item.value as any })
        ).toThrow(item.error);
      });
    });

    it('should be a invalid category when create using invalid is_active field', () => {
      const arrange = [
        {
          value: '5',
          error: new ValidationError('The is_active must be a boolean'),
        },
        {
          value: {},
          error: new ValidationError('The is_active must be a boolean'),
        },
      ];

      arrange.forEach((item) => {
        expect(
          () => new Category({ name: 'movie', is_active: item.value as any })
        ).toThrow(item.error);
      });
    });

    it('should be a valid category when create using valid values', () => {
      expect.assertions(0);
      const arrange = [
        { name: 'movie' },
        { name: 'movie', description: 'some description' },
        { name: 'movie', description: null },
        { name: 'movie', description: 'some description', is_active: true },
        { name: 'movie', description: 'some description', is_active: false },
        {
          name: 'movie',
          description: 'some description',
          is_active: true,
          created_at: new Date(),
        },
      ];

      arrange.forEach((item) => {
        new Category(item);
      });
    });
  });

  describe('update method', () => {
    it('should be a invalid category when update using invalid name field', () => {
      const arrange = [
        { value: null, error: new ValidationError('The name is required') },
        {
          value: undefined,
          error: new ValidationError('The name is required'),
        },
        { value: '', error: new ValidationError('The name is required') },
        {
          value: 't'.repeat(256),
          error: new ValidationError(
            'The name must be less or equal than 255 characters'
          ),
        },
        { value: 5, error: new ValidationError('The name must be a string') },
      ];

      arrange.forEach((item) => {
        const category = new Category({ name: 'movie' });
        expect(() =>
          category.update(item.value as any, 'valid description')
        ).toThrow(item.error);
      });
    });

    it('should be a invalid category when update using invalid description field', () => {
      const arrange = [
        {
          value: 5,
          error: new ValidationError('The description must be a string'),
        },
        {
          value: [],
          error: new ValidationError('The description must be a string'),
        },
      ];

      arrange.forEach((item) => {
        const category = new Category({
          name: 'movie',
          description: 'valid description',
        });
        expect(() => category.update('valid name', item.value as any)).toThrow(
          item.error
        );
      });
    });

    it('should be a valid category when update using valid values', () => {
      expect.assertions(0);
      const arrange = [
        { name: 'movie' },
        { name: 'movie', description: 'some description' },
        { name: 'movie', description: null },
        { name: 'movie', description: 'some description', is_active: true },
        { name: 'movie', description: 'some description', is_active: false },
        {
          name: 'movie',
          description: 'some description',
          is_active: true,
          created_at: new Date(),
        },
      ];

      arrange.forEach((item) => {
        const category = new Category(item);
        category.update('some valid name', 'some valid description');
      });
    });
  });
});
