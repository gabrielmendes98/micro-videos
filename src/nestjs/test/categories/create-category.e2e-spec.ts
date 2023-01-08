import request from 'supertest';
import { CategoryRepository } from 'core/category/domain';
import { CATEGORY_PROVIDERS } from 'src/categories/category.providers';
import { CreateCategoryFixture } from 'src/categories/fixtures';
import { CategoriesController } from 'src/categories/categories.controller';
import { instanceToPlain } from 'class-transformer';
import { getConnectionToken } from '@nestjs/sequelize';
import { startApp } from 'src/@shared/testing/helpers';

describe('CategoriesController (e2e)', () => {
  describe('POST /categories', () => {
    describe('should return error 422 when request body is invalid', () => {
      const app = startApp();

      const invalidRequest = CreateCategoryFixture.invalidRequestArrange();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('when body is $label', ({ value }) => {
        return request(app.app.getHttpServer())
          .post('/categories')
          .send(value.sendData)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should return error 422 when throw EntityValidationError', () => {
      const app = startApp({
        beforeInit: (app) => {
          app['config'].globalPipes = [];
        },
      });

      const invalidRequest =
        CreateCategoryFixture.entityValidationErrorArrange();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('when body is $label', ({ value }) => {
        return request(app.app.getHttpServer())
          .post('/categories')
          .send(value.sendData)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should create a category', () => {
      let categoryRepo: CategoryRepository.Repository;
      const app = startApp();
      const arrange = CreateCategoryFixture.arrangeForSave();

      beforeEach(async () => {
        const sequelize = app.app.get(getConnectionToken());
        await sequelize.sync({ force: true });
        categoryRepo = app.app.get<CategoryRepository.Repository>(
          CATEGORY_PROVIDERS.REPOSITORIES.IN_USE.provide,
        );
      });

      test.each(arrange)(
        'when body is $sendData',
        async ({ sendData, expected }) => {
          const res = await request(app.app.getHttpServer())
            .post('/categories')
            .send(sendData)
            .expect(201);

          expect(Object.keys(res.body)).toStrictEqual(['data']);
          expect(Object.keys(res.body.data)).toStrictEqual(
            CreateCategoryFixture.keysInResponse(),
          );
          const createdCategory = await categoryRepo.findById(res.body.data.id);
          const presenter = CategoriesController.categoryToResponse(
            createdCategory.toJSON(),
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
