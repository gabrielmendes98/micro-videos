import { Category } from '#category/domain';
import { UniqueEntityId } from '#shared/domain';
import { LoadEntityError } from '#shared/domain/errors/load-entity.error';
import { setupSequelize } from '#shared/infra/testing/helpers/db';
import { CategoryModel } from './category-model';
import { CategoryModelMapper } from './category-model-mapper';

describe('CategoryModelMapper integration tests', () => {
  setupSequelize({ models: [CategoryModel] });

  it('should throw error when category is invalid', () => {
    const model = CategoryModel.build({
      id: 'dd2d887b-6403-4519-add4-81575076e105',
    } as any);
    try {
      CategoryModelMapper.toEntity(model);
      fail('The category is valid, but must throw a LoadEntityError');
    } catch (error) {
      expect(error).toBeInstanceOf(LoadEntityError);
      expect(error.error).toMatchObject({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      });
    }
  });

  it('should throw generic error', () => {
    const error = new Error('generic error');
    const spyValidate = jest
      .spyOn(Category, 'validate')
      .mockImplementation(() => {
        throw error;
      });
    const model = CategoryModel.build({
      id: 'dd2d887b-6403-4519-add4-81575076e105',
    } as any);
    expect(() => CategoryModelMapper.toEntity(model)).toThrow(error);
    expect(spyValidate).toHaveBeenCalled();
    spyValidate.mockRestore();
  });

  it('should convert category model into category entity', () => {
    const created_at = new Date();
    const model = CategoryModel.build({
      id: 'dd2d887b-6403-4519-add4-81575076e105',
      name: 'some name',
      description: 'some description',
      is_active: true,
      created_at,
    });

    const entity = CategoryModelMapper.toEntity(model);

    expect(entity.toJSON()).toStrictEqual(
      new Category(
        {
          name: 'some name',
          description: 'some description',
          is_active: true,
          created_at,
        },
        new UniqueEntityId('dd2d887b-6403-4519-add4-81575076e105'),
      ).toJSON(),
    );
    expect(entity).toBeInstanceOf(Category);
  });
});
