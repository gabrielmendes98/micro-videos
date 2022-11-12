import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { CategoryRepository } from 'core/category/domain';
import { CATEGORY_PROVIDERS } from 'src/categories/category.providers';
import { CategoryFixture } from 'src/categories/fixtures';
import { CategoriesController } from 'src/categories/categories.controller';
import { instanceToPlain } from 'class-transformer';
import { applyGlobalConfig } from 'src/global-config';

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
  describe('POST /categories', () => {
    describe('should return error 422 when request body is invalid', () => {
      const app = startApp();

      const invalidRequest = CategoryFixture.invalidRequestArrange();
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

      const invalidRequest = CategoryFixture.entityValidationErrorArrange();
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
      const arrange = CategoryFixture.arrangeForSave();

      beforeEach(() => {
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
            CategoryFixture.keysInResponse(),
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
