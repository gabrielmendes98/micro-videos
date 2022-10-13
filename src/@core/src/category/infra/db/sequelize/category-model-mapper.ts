import { Category } from '#category/domain';
import { EntityValidationError, UniqueEntityId } from '#shared/domain';
import { LoadEntityError } from '#shared/domain/errors/load-entity.error';
import { CategoryModel } from './category-model';

export class CategoryModelMapper {
  static toEntity(model: CategoryModel): Category {
    const { id, ...other } = model.toJSON();
    try {
      return new Category(other, new UniqueEntityId(id));
    } catch (error) {
      if (error instanceof EntityValidationError) {
        throw new LoadEntityError(error.error);
      }

      throw error;
    }
  }
}
