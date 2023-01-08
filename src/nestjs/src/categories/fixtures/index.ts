import { Category } from 'core/category/domain';

export class CategoryFixture {
  static keysInResponse() {
    return ['id', 'name', 'description', 'is_active', 'created_at'];
  }

  static arrangeForSave() {
    const faker = Category.fake()
      .aCategory()
      .withName('Movie')
      .withDescription('valid description');

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
      {
        sendData: {
          name: faker.name,
          is_active: false,
        },
        expected: {
          name: faker.name,
          is_active: false,
          description: null,
        },
      },
      {
        sendData: {
          name: faker.name,
          description: faker.description,
          is_active: true,
        },
        expected: {
          name: faker.name,
          description: faker.description,
          is_active: true,
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

export class CreateCategoryFixture extends CategoryFixture {}

export class UpdateCategoryFixture {
  static keysInResponse() {
    return CategoryFixture.keysInResponse();
  }

  static arrangeForSave() {
    return CategoryFixture.arrangeForSave();
  }

  static invalidRequestArrange() {
    return CategoryFixture.invalidRequestArrange();
  }

  static entityValidationErrorArrange() {
    const { isActiveNotABoolean, ...otherKeys } =
      CategoryFixture.entityValidationErrorArrange();

    return otherKeys;
  }
}

export class ListCategoriesFixture {
  static arrangeIncrementedWithCreatedAt() {
    const _entities = Category.fake()
      .theCategories(4)
      .withName((i) => i + '')
      .withCreatedAt((i) => new Date(new Date().getTime() + i * 2000))
      .build();

    const entitiesMap = {
      first: _entities[0],
      second: _entities[1],
      third: _entities[2],
      fourth: _entities[3],
    };

    const arrange = [
      {
        send_data: {},
        expected: {
          entities: [
            entitiesMap.fourth,
            entitiesMap.third,
            entitiesMap.second,
            entitiesMap.first,
          ],
          meta: {
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 4,
          },
        },
      },
      {
        send_data: {
          page: 1,
          per_page: 2,
        },
        expected: {
          entities: [entitiesMap.fourth, entitiesMap.third],
          meta: {
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 4,
          },
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
        },
        expected: {
          entities: [entitiesMap.second, entitiesMap.first],
          meta: {
            current_page: 2,
            last_page: 2,
            per_page: 2,
            total: 4,
          },
        },
      },
    ];

    return { arrange, entitiesMap };
  }

  static arrangeUnsorted() {
    const faker = Category.fake().aCategory();

    const entitiesMap = {
      a: faker.withName('a').build(),
      AAA: faker.withName('AAA').build(),
      AaA: faker.withName('AaA').build(),
      b: faker.withName('b').build(),
      c: faker.withName('c').build(),
    };

    const arrange = [
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'name',
          filter: 'a',
        },
        expected: {
          entities: [entitiesMap.AAA, entitiesMap.AaA],
          meta: {
            total: 3,
            current_page: 1,
            last_page: 2,
            per_page: 2,
          },
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
          sort: 'name',
          filter: 'a',
        },
        expected: {
          entities: [entitiesMap.a],
          meta: {
            total: 3,
            current_page: 2,
            last_page: 2,
            per_page: 2,
          },
        },
      },
    ];

    return { arrange, entitiesMap };
  }
}
