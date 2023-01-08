import request from 'supertest';
import { Category, CategoryRepository } from 'core/category/domain';
import { CATEGORY_PROVIDERS } from 'src/categories/category.providers';
import {
  CategoryFixture,
  UpdateCategoryFixture,
} from 'src/categories/fixtures';
import { CategoriesController } from 'src/categories/categories.controller';
import { instanceToPlain } from 'class-transformer';
import { getConnectionToken } from '@nestjs/sequelize';
import { startApp } from 'src/@shared/testing/helpers';

describe('CategoriesController (e2e)', () => {
  const app = startApp();
  const uuid = 'dd2d887b-6403-4519-add4-81575076e105';

  describe('GET /categories/:id', () => {
    describe('should return error when id is invalid or not found', () => {
      const arrange = [
        {
          id: uuid,
          expected: {
            statusCode: 404,
            message:
              'Entity not found using ID dd2d887b-6403-4519-add4-81575076e105',
            error: 'Not Found',
          },
        },
        {
          id: 'fake id',
          expected: {
            statusCode: 422,
            message: 'Validation failed (uuid  is expected)',
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)('when id is $id', async ({ id, expected }) => {
        return request(app.app.getHttpServer())
          .get(`/categories/${id}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should get a category by its id', async () => {
      const category = Category.fake().aCategory().build();
      const categoryRepo = app.app.get<CategoryRepository.Repository>(
        CATEGORY_PROVIDERS.REPOSITORIES.IN_USE.provide,
      );
      categoryRepo.insert(category);

      const res = await request(app.app.getHttpServer())
        .get(`/categories/${category.id}`)
        .expect(200);

      expect(Object.keys(res.body)).toStrictEqual(['data']);
      expect(Object.keys(res.body.data)).toStrictEqual(
        CategoryFixture.keysInResponse(),
      );

      const presenter = CategoriesController.categoryToResponse(
        category.toJSON(),
      );
      const serialized = instanceToPlain(presenter);
      expect(res.body.data).toStrictEqual(serialized);
    });
  });
});
