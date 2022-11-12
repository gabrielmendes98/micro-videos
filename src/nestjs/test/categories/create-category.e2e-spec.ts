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

describe('CategoriesController (e2e)', () => {
  let app: INestApplication;
  let categoryRepo: CategoryRepository.Repository;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    categoryRepo = moduleFixture.get<CategoryRepository.Repository>(
      CATEGORY_PROVIDERS.REPOSITORIES.IN_USE.provide,
    );

    app = moduleFixture.createNestApplication();
    applyGlobalConfig(app);
    await app.init();
  });

  describe('POST /categories', () => {
    describe('should return error 422 when request body is invalid', () => {
      const invalidRequest = CategoryFixture.invalidRequestArrange();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('when body is $label', async ({ value }) => {
        const res = await request(app.getHttpServer())
          .post('/categories')
          .send(value)
          .expect(422);
      });
    });

    describe('should create a category', () => {
      const arrange = CategoryFixture.arrangeForSave();

      test.each(arrange)(
        'when body is $sendData',
        async ({ sendData, expected }) => {
          const res = await request(app.getHttpServer())
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
