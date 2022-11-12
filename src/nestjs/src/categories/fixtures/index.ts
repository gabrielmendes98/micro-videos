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
      nullName: {
        sendData: {
          name: faker.withInvalidNameEmpty(null).name,
        },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          statusCode: 422,
          ...defaultExpected,
        },
      },
      emptyName: {
        sendData: {
          name: faker.withInvalidNameEmpty('').name,
        },
        expected: {
          message: ['name should not be empty'],
          statusCode: 422,
          ...defaultExpected,
        },
      },
      descriptionNotAString: {
        sendData: {
          name: faker.withName('valid name').name,
          description: faker.withInvalidDescriptionNotAString().description,
        },
        expected: {
          message: ['description must be a string'],
          statusCode: 422,
          ...defaultExpected,
        },
      },
      isActiveNotABoolean: {
        sendData: {
          name: faker.withName('valid name').name,
          description: faker.withDescription('valid description').description,
          is_active: faker.withInvalidIsActiveNotABoolean().is_active,
        },
        expected: {
          message: ['is_active must be a boolean value'],
          statusCode: 422,
          ...defaultExpected,
        },
      },
    };
  }

  static entityValidationErrorArrange() {
    const faker = Category.fake().aCategory();
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      empty: {
        sendData: {},
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
          ],
          statusCode: 422,
          ...defaultExpected,
        },
      },
      undefinedName: {
        sendData: {
          name: faker.withInvalidNameEmpty(undefined).name,
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
          ],
          statusCode: 422,
          ...defaultExpected,
        },
      },
      nullName: {
        sendData: {
          name: faker.withInvalidNameEmpty(null).name,
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
          ],
          statusCode: 422,
          ...defaultExpected,
        },
      },
      emptyName: {
        sendData: {
          name: faker.withInvalidNameEmpty('').name,
        },
        expected: {
          message: ['name should not be empty'],
          statusCode: 422,
          ...defaultExpected,
        },
      },
      descriptionNotAString: {
        sendData: {
          description: faker.withInvalidDescriptionNotAString().description,
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
            'description must be a string',
          ],
          statusCode: 422,
          ...defaultExpected,
        },
      },
      isActiveNotABoolean: {
        sendData: {
          name: faker.withName('valid name').name,
          description: faker.withDescription('valid description').description,
          is_active: faker.withInvalidIsActiveNotABoolean().is_active,
        },
        expected: {
          message: ['is_active must be a boolean value'],
          statusCode: 422,
          ...defaultExpected,
        },
      },
    };
  }
}
