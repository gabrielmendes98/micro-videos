import {
  CategoryInMemoryRepository,
  CategoryModel,
  CategorySequelizeRepository,
} from 'core/category/infra';
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from 'core/category/application';
import { CategoryRepository } from 'core/category/domain';
import { getModelToken } from '@nestjs/sequelize';

export namespace CATEGORY_PROVIDERS {
  export namespace REPOSITORIES {
    export const IN_MEMORY = {
      provide: 'CategoryInMemoryRepository',
      useClass: CategoryInMemoryRepository,
    };

    export const SEQUELIZE = {
      provide: 'CategorySequelizeRepository',
      useFactory: (categoryModel: typeof CategoryModel) =>
        new CategorySequelizeRepository(categoryModel),
      inject: [getModelToken(CategoryModel)],
    };

    export const IN_USE = {
      provide: 'CategoryRepositoy',
      useExisting: 'CategorySequelizeRepository',
    };
  }

  export namespace USE_CASES {
    export const UPDATE = {
      provide: UpdateCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.Repository) => {
        return new UpdateCategoryUseCase.UseCase(categoryRepo);
      },
      inject: [REPOSITORIES.IN_USE.provide],
    };

    export const CREATE = {
      provide: CreateCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.Repository) => {
        return new CreateCategoryUseCase.UseCase(categoryRepo);
      },
      inject: [REPOSITORIES.IN_USE.provide],
    };

    export const DELETE = {
      provide: DeleteCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.Repository) => {
        return new DeleteCategoryUseCase.UseCase(categoryRepo);
      },
      inject: [REPOSITORIES.IN_USE.provide],
    };

    export const GET = {
      provide: GetCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.Repository) => {
        return new GetCategoryUseCase.UseCase(categoryRepo);
      },
      inject: [REPOSITORIES.IN_USE.provide],
    };

    export const LIST = {
      provide: ListCategoriesUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.Repository) => {
        return new ListCategoriesUseCase.UseCase(categoryRepo);
      },
      inject: [REPOSITORIES.IN_USE.provide],
    };
  }
}
