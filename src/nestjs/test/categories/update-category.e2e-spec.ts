import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { Category, CategoryRepository } from 'core/category/domain';
import { CATEGORY_PROVIDERS } from 'src/categories/category.providers';
import { UpdateCategoryFixture } from 'src/categories/fixtures';
import { CategoriesController } from 'src/categories/categories.controller';
import { instanceToPlain } from 'class-transformer';
import { applyGlobalConfig } from 'src/global-config';
import { getConnectionToken } from '@nestjs/sequelize';

function startApp({
  beforeInit,
}: {
  beforeInit?: (app: INestApplication) => void;
} = {}) {
  let _app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    _app = moduleFixture.createNestApplication();
    applyGlobalConfig(_app);
    beforeInit && beforeInit(_app);
    await _app.init();
  });

  return {
    get app() {
      return _app;
    },
  };
}

describe('CategoriesController (e2e)', () => {
  const uuid = 'dd2d887b-6403-4519-add4-81575076e105';

  describe('PUT /categories/:id', () => {
    describe('should return error when id is invalid or not found', () => {
      const app = startApp();
      const faker = Category.fake().aCategory();
      const arrange = [
        {
          id: uuid,
          sendData: { name: faker.name },
          expected: {
            statusCode: 404,
            message:
              'Entity not found using ID dd2d887b-6403-4519-add4-81575076e105',
            error: 'Not Found',
          },
        },
        {
          id: 'fake id',
          sendData: { name: faker.name },
          expected: {
            statusCode: 422,
            message: 'Validation failed (uuid  is expected)',
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)(
        'when id is $id',
        async ({ id, sendData, expected }) => {
          return request(app.app.getHttpServer())
            .put(`/categories/${id}`)
            .send(sendData)
            .expect(expected.statusCode)
            .expect(expected);
        },
      );
    });

    describe('should return error 422 when request body is invalid', () => {
      const app = startApp();

      const invalidRequest = UpdateCategoryFixture.invalidRequestArrange();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('when body is $label', ({ value }) => {
        return request(app.app.getHttpServer())
          .put(`/categories/${uuid}`)
          .send(value.sendData)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should return error 422 when throw EntityValidationError', () => {
      let categoryRepo: CategoryRepository.Repository;

      const app = startApp({
        beforeInit: (app) => {
          app['config'].globalPipes = [];
        },
      });

      beforeEach(() => {
        categoryRepo = app.app.get<CategoryRepository.Repository>(
          CATEGORY_PROVIDERS.REPOSITORIES.IN_USE.provide,
        );
      });

      const invalidRequest =
        UpdateCategoryFixture.entityValidationErrorArrange();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('when body is $label', async ({ value }) => {
        const category = Category.fake().aCategory().build();

        await categoryRepo.insert(category);

        return request(app.app.getHttpServer())
          .put(`/categories/${category.id}`)
          .send(value.sendData)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should update a category', () => {
      let categoryRepo: CategoryRepository.Repository;
      const app = startApp();
      const arrange = UpdateCategoryFixture.arrangeForSave();

      beforeEach(async () => {
        categoryRepo = app.app.get<CategoryRepository.Repository>(
          CATEGORY_PROVIDERS.REPOSITORIES.IN_USE.provide,
        );
        const sequelize = app.app.get(getConnectionToken());
        await sequelize.sync({ force: true });
      });

      test.each(arrange)(
        'when body is $sendData',
        async ({ sendData, expected }) => {
          const createdCategory = Category.fake().aCategory().build();
          await categoryRepo.insert(createdCategory);

          const res = await request(app.app.getHttpServer())
            .put(`/categories/${createdCategory.id}`)
            .send(sendData)
            .expect(200);

          expect(Object.keys(res.body)).toStrictEqual(['data']);
          expect(Object.keys(res.body.data)).toStrictEqual(
            UpdateCategoryFixture.keysInResponse(),
          );
          const updatedCategory = await categoryRepo.findById(res.body.data.id);
          const presenter = CategoriesController.categoryToResponse(
            updatedCategory.toJSON(),
          );
          const serialized = instanceToPlain(presenter);

          expect(res.body.data).toStrictEqual({
            id: serialized.id,
            created_at: serialized.created_at,
            ...expected,
          });
        },
      );
    });
  });
});
