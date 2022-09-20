import {
  CategoryRules,
  CategoryValidator,
  CategoryValidatorFactory,
} from './category.validators';

describe('CategoryValidator integration tests', () => {
  let validator: CategoryValidator;

  beforeEach(() => {
    validator = CategoryValidatorFactory.create();
  });

  test('invalidation cases for name field', () => {
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
      expect({
        validator,
        data: {
          name: item.value,
        },
      }).containErrorMessages({
        name: item.messages,
      });
    });
  });

  test('valid cases for all fields', () => {
    const arrange = [
      { name: 'some name' },
      { name: 'some name', description: null },
      { name: 'some name', description: undefined },
      { name: 'some name', description: 'some description' },
      { name: 'some name', is_active: undefined },
      { name: 'some name', is_active: true },
      { name: 'some name', is_active: false },
      { name: 'some name', created_at: undefined },
      { name: 'some name', created_at: new Date() },
    ];

    arrange.forEach((item) => {
      const isValid = validator.validate(item);
      expect(isValid).toBeTruthy();
      expect(validator.validatedData).toStrictEqual(new CategoryRules(item));
    });
  });
});
