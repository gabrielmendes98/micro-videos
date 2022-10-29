import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from 'core/category/application';
import { CategoryPresenter } from 'src/categories/presenter/category.presenter';
import { CategoriesController } from '../../categories.controller';
import { CreateCategoryDto } from '../../dto/create-category.dto';
import { UpdateCategoryDto } from '../../dto/update-category.dto';

describe('CategoriesController unit tests', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    controller = new CategoriesController();
  });

  it('should create a category', async () => {
    const input: CreateCategoryDto = {
      name: 'movie',
      description: 'some description',
      is_active: true,
    };

    const output: CreateCategoryUseCase.Output = {
      id: '8db4bb64-7109-4da2-be10-a9c16f7ed96e',
      name: 'movie',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };

    const createUseCaseMock = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    controller['createUseCase'] = createUseCaseMock as any;
    const presenter = await controller.create(input);

    expect(createUseCaseMock.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(new CategoryPresenter(output));
  });

  it('should update a category', async () => {
    const id = '8db4bb64-7109-4da2-be10-a9c16f7ed96e';
    const input: UpdateCategoryDto = {
      name: 'movie',
      description: 'some description',
      is_active: true,
    };

    const output: UpdateCategoryUseCase.Output = {
      id,
      name: 'movie',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };

    const updateUseCaseMock = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    controller['updateUseCase'] = updateUseCaseMock as any;
    const presenter = await controller.update(id, input);

    expect(updateUseCaseMock.execute).toHaveBeenCalledWith({
      id,
      ...input,
    });
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(new CategoryPresenter(output));
  });

  it('should delete a category', async () => {
    const id = '8db4bb64-7109-4da2-be10-a9c16f7ed96e';
    const input: DeleteCategoryUseCase.Input = { id };
    const output: DeleteCategoryUseCase.Output = undefined;

    const deleteUseCaseMock = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    controller['deleteUseCase'] = deleteUseCaseMock as any;

    expect(controller.remove(id)).toBeInstanceOf(Promise);

    const response = await controller.remove(id);

    expect(deleteUseCaseMock.execute).toHaveBeenCalledWith(input);
    expect(response).toStrictEqual(output);
  });

  it('should get a category', async () => {
    const id = '8db4bb64-7109-4da2-be10-a9c16f7ed96e';
    const input: GetCategoryUseCase.Input = { id };
    const output: GetCategoryUseCase.Output = {
      id,
      name: 'movie',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };

    const getUseCaseMock = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    controller['getUseCase'] = getUseCaseMock as any;

    const presenter = await controller.findOne(id);

    expect(getUseCaseMock.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(new CategoryPresenter(output));
  });

  it('should list categories', async () => {
    const input: ListCategoriesUseCase.Input = {
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc',
      filter: 'test',
    };
    const output: ListCategoriesUseCase.Output = {
      items: [
        {
          id: '8db4bb64-7109-4da2-be10-a9c16f7ed96e',
          name: 'movie',
          description: 'some description',
          is_active: true,
          created_at: new Date(),
        },
      ],
      current_page: 1,
      last_page: 1,
      per_page: 1,
      total: 1,
    };

    const listUseCaseMock = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    controller['listUseCase'] = listUseCaseMock as any;

    const response = await controller.search(input);

    expect(listUseCaseMock.execute).toHaveBeenCalledWith(input);
    expect(response).toStrictEqual(output);
  });
});
