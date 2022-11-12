import { CreateCategoryDto } from './create-category.dto';
import { UpdateCategoryUseCase } from 'core/category/application';

export class UpdateCategoryDto
  extends CreateCategoryDto
  implements Omit<UpdateCategoryUseCase.Input, 'id'> {}
