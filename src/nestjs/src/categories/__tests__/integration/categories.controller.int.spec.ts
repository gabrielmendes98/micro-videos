import { Test } from '@nestjs/testing';
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from 'core/category/application';
import { Category, CategoryRepository } from 'core/category/domain';
import { CategoryModel, CategoryModelMapper } from 'core/category/infra';
import { CategoriesController } from 'src/categories/categories.controller';
import { CategoriesModule } from 'src/categories/categories.module';
import { CATEGORY_PROVIDERS } from 'src/categories/category.providers';
import { ConfigModule } from 'src/config/config.module';
import { DatabaseModule } from 'src/database/database.module';

describe('CategoriesController integration tests', () => {
  let controller: CategoriesController;
  let repository: CategoryRepository.Repository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
    }).compile();
    controller = module.get(CategoriesController);
    repository = module.get(CATEGORY_PROVIDERS.REPOSITORIES.IN_USE.provide);
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
    expect(controller['createUseCase']).toBeInstanceOf(
      CreateCategoryUseCase.UseCase,
    );
    expect(controller['deleteUseCase']).toBeInstanceOf(
      DeleteCategoryUseCase.UseCase,
    );
    expect(controller['getUseCase']).toBeInstanceOf(GetCategoryUseCase.UseCase);
    expect(controller['listUseCase']).toBeInstanceOf(
      ListCategoriesUseCase.UseCase,
    );
    expect(controller['updateUseCase']).toBeInstanceOf(
      UpdateCategoryUseCase.UseCase,
    );
  });

  describe('should create a category', () => {
    const arrange = [
      {
        request: {
          name: 'Movie',
        },
        expectedPresenter: {
          name: 'Movie',
          description: null,
          is_active: true,
        },
      },
      {
        request: {
          name: 'Movie',
          description: null,
        },
        expectedPresenter: {
          name: 'Movie',
          description: null,
          is_active: true,
        },
      },
      {
        request: {
          name: 'Movie',
          is_active: true,
        },
        expectedPresenter: {
          name: 'Movie',
          description: null,
          is_active: true,
        },
      },
    ];

    test.each(arrange)(
      'with request $request',
      async ({ request, expectedPresenter }) => {
        const presenter = await controller.create(request);
        const entity = await repository.findById(presenter.id);

        expect(entity).toMatchObject({
          id: presenter.id,
          name: expectedPresenter.name,
          description: expectedPresenter.description,
          is_active: expectedPresenter.is_active,
          created_at: presenter.created_at,
        });

        expect(presenter.id).toBe(entity.id);
        expect(presenter.name).toBe(expectedPresenter.name);
        expect(presenter.description).toBe(expectedPresenter.description);
        expect(presenter.is_active).toBe(expectedPresenter.is_active);
        expect(presenter.created_at).toStrictEqual(entity.created_at);
      },
    );
  });

  // describe('should update a category', () => {
  //   const category = Category.fake().aCategory().build();
  //   beforeEach(async () => {
  //     await repository.insert(category);
  //   });
  //   const arrange = [
  //     {
  //       request: {
  //         name: 'Movie',
  //       },
  //       expectedPresenter: {
  //         name: 'Movie',
  //         description: null,
  //         is_active: true,
  //       },
  //     },
  //     {
  //       request: {
  //         name: 'Movie',
  //         description: null,
  //       },
  //       expectedPresenter: {
  //         name: 'Movie',
  //         description: null,
  //         is_active: true,
  //       },
  //     },
  //     {
  //       request: {
  //         name: 'Movie',
  //         is_active: true,
  //       },
  //       expectedPresenter: {
  //         name: 'Movie',
  //         description: null,
  //         is_active: true,
  //       },
  //     },
  //     {
  //       request: {
  //         name: 'Movie',
  //         is_active: false,
  //       },
  //       expectedPresenter: {
  //         name: 'Movie',
  //         description: null,
  //         is_active: false,
  //       },
  //     },
  //     {
  //       request: {
  //         name: 'Movie',
  //         description: 'description test',
  //       },
  //       expectedPresenter: {
  //         name: 'Movie',
  //         description: 'description test',
  //         is_active: true,
  //       },
  //     },
  //   ];

  //   test.each(arrange)(
  //     'with request $request',
  //     async ({ request, expectedPresenter }) => {
  //       const presenter = await controller.update(category.id, request);
  //       const entity = await repository.findById(presenter.id);

  //       expect(entity).toMatchObject({
  //         id: presenter.id,
  //         name: expectedPresenter.name,
  //         description: expectedPresenter.description,
  //         is_active: expectedPresenter.is_active,
  //         created_at: presenter.created_at,
  //       });

  //       expect(presenter.id).toBe(entity.id);
  //       expect(presenter.name).toBe(expectedPresenter.name);
  //       expect(presenter.description).toBe(expectedPresenter.description);
  //       expect(presenter.is_active).toBe(expectedPresenter.is_active);
  //       expect(presenter.created_at).toStrictEqual(entity.created_at);
  //     },
  //   );
  // });

  // it('should delete a category', async () => {
  //   const category = Category.fake().aCategory().build();
  //   await repository.insert(category);
  //   const response = await controller.remove(category.id);
  //   expect(response).not.toBeDefined();
  //   await expect(repository.findById(category.id)).rejects.toThrow(
  //     new NotFoundError(`Entity Not Found using ID ${category.id}`),
  //   );
  // });

  // it('should get a category', async () => {
  //   const category = Category.fake().aCategory().build();
  //   await repository.insert(category);
  //   const presenter = await controller.findOne(category.id);

  //   expect(presenter.id).toBe(category.id);
  //   expect(presenter.name).toBe(category.name);
  //   expect(presenter.description).toBe(category.description);
  //   expect(presenter.is_active).toBe(category.is_active);
  //   expect(presenter.created_at).toStrictEqual(category.created_at);
  // });
});
