import { Test } from '@nestjs/testing';
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from 'core/category/application';
import { CategoryRepository } from 'core/category/domain';
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

  it('should create a category', async () => {
    const output = await controller.create({
      name: 'movie',
    });

    expect(output).toMatchObject({
      name: 'movie',
      description: null,
      is_active: true,
    });
    expect(output.id).toBeTruthy();
    expect(output.created_at).toBeInstanceOf(Date);
  });
});
