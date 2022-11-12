import { Category } from 'core/category/domain';

export class CategoryFixture {
  static keysInResponse() {
    return ['id', 'name', 'description', 'is_active', 'created_at'];
  }

  static arrangeForSave() {
    const faker = Category.fake().aCategory().withName('Movie');
    return [
      {
        sendData: {
          name: faker.name,
        },
        expected: {
          name: faker.name,
          description: null,
          is_active: true,
        },
      },
      {
        sendData: {
          name: faker.name,
          description: null,
        },
        expected: {
          name: faker.name,
          description: null,
          is_active: true,
        },
      },
      {
        sendData: {
          name: faker.name,
          is_active: true,
        },
        expected: {
          name: faker.name,
          is_active: true,
          description: null,
        },
      },
    ];
  }

  static invalidRequestArrange() {
    const faker = Category.fake().aCategory();
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      empty: {
        sendData: {},
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          statusCode: 422,
          ...defaultExpected,
        },
      },
      undefinedName: {
        sendData: {
          name: faker.withInvalidNameEmpty(undefined).name,
        },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          statusCode: 422,
          ...defaultExpected,
        },
      },
    };
  }
}
