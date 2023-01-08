import request from 'supertest';
import { instanceToPlain } from 'class-transformer';
import { CategoryRepository } from 'core/category/domain';
import { startApp } from 'src/@shared/testing/helpers';
import { CategoriesController } from 'src/categories/categories.controller';
import { CATEGORY_PROVIDERS } from 'src/categories/category.providers';
import { ListCategoriesFixture } from 'src/categories/fixtures';

describe('CategoriesController (e2e)', () => {
  describe('GET /categories', () => {
    describe('should return categories sorted by created_at when request query is empty', () => {
      let categoryRepo: CategoryRepository.Repository;
      const nestApp = startApp();
      const { entitiesMap, arrange } =
        ListCategoriesFixture.arrangeIncrementedWithCreatedAt();

      beforeEach(async () => {
        categoryRepo = nestApp.app.get<CategoryRepository.Repository>(
          CATEGORY_PROVIDERS.REPOSITORIES.IN_USE.provide,
        );
        await categoryRepo.bulkInsert(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when query params is $send_data',
        async ({ send_data, expected }) => {
          const queryParams = new URLSearchParams(send_data as any).toString();
          return request(nestApp.app.getHttpServer())
            .get(`/categories/?${queryParams}`)
            .expect(200)
            .expect({
              data: expected.entities.map((e) =>
                instanceToPlain(CategoriesController.categoryToResponse(e)),
              ),
              meta: expected.meta,
            });
        },
      );
    });

    describe('should return categories using paginate, filter and sort', () => {
      let categoryRepo: CategoryRepository.Repository;
      const nestApp = startApp();
      const { entitiesMap, arrange } = ListCategoriesFixture.arrangeUnsorted();

      beforeEach(async () => {
        categoryRepo = nestApp.app.get<CategoryRepository.Repository>(
          CATEGORY_PROVIDERS.REPOSITORIES.IN_USE.provide,
        );
        await categoryRepo.bulkInsert(Object.values(entitiesMap));
      });

      test.each([arrange[0]])(
        'when query params is $send_data',
        async ({ send_data, expected }) => {
          const queryParams = new URLSearchParams(send_data as any).toString();
          return request(nestApp.app.getHttpServer())
            .get(`/categories/?${queryParams}`)
            .expect(200)
            .expect({
              data: expected.entities.map((e) =>
                instanceToPlain(CategoriesController.categoryToResponse(e)),
              ),
              meta: expected.meta,
            });
        },
      );
    });
  });
});
