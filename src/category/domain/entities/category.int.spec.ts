import { Category } from './category';

describe('Category integration tests', () => {
  describe('create/constructor', () => {
    it('should be a invalid category when create using invalid name field', () => {
      const arrange = [
        {
          value: null,
          messages: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
          ],
        },
        {
          value: '',
          messages: ['name should not be empty'],
        },
        {
          value: 1,
          messages: [
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
          ],
        },
        {
          value: 'a'.repeat(256),
          messages: ['name must be shorter than or equal to 255 characters'],
        },
      ];

      arrange.forEach((item) => {
        expect(
          () => new Category({ name: item.value as any }),
        ).toContainErrorMessages({
          name: item.messages,
        });
      });
    });

    it('should be a invalid category when create using invalid description field', () => {
      const arrange = [
        {
          value: 10,
          messages: ['description must be a string'],
        },
        {
          value: true,
          messages: ['description must be a string'],
        },
      ];

      arrange.forEach((item) => {
        expect(
          () => new Category({ name: 'movie', description: item.value as any }),
        ).toContainErrorMessages({
          description: item.messages,
        });
      });
    });

    it('should be a invalid category when create using invalid is_active field', () => {
      const arrange = [
        {
          value: 10,
          messages: ['is_active must be a boolean value'],
        },
        {
          value: '',
          messages: ['is_active must be a boolean value'],
        },
      ];

      arrange.forEach((item) => {
        expect(
          () => new Category({ name: 'movie', is_active: item.value as any }),
        ).toContainErrorMessages({
          is_active: item.messages,
        });
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
        {
          value: null,
          messages: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
          ],
        },
        {
          value: '',
          messages: ['name should not be empty'],
        },
        {
          value: 1,
          messages: [
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
          ],
        },
        {
          value: 'a'.repeat(256),
          messages: ['name must be shorter than or equal to 255 characters'],
        },
      ];
      arrange.forEach((item) => {
        const category = new Category({ name: 'movie' });
        expect(() =>
          category.update(item.value as any, 'valid description'),
        ).toContainErrorMessages({
          name: item.messages,
        });
      });
    });

    it('should be a invalid category when update using invalid description field', () => {
      const arrange = [
        {
          value: 10,
          messages: ['description must be a string'],
        },
        {
          value: true,
          messages: ['description must be a string'],
        },
      ];

      arrange.forEach((item) => {
        const category = new Category({
          name: 'movie',
          description: 'valid description',
        });
        expect(() =>
          category.update('valid name', item.value as any),
        ).toContainErrorMessages({
          description: item.messages,
        });
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
