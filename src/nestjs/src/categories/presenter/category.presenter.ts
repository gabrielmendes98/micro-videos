import {
  CategoryOutputDto,
  ListCategoriesUseCase,
} from 'core/category/application';
import { Transform } from 'class-transformer';
import { CollectionPresenter } from 'src/@shared/presenters/collection.presenter';

export class CategoryPresenter {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  @Transform(({ value }) => value.toISOString().slice(0, 19) + '.000Z')
  created_at: Date;

  constructor(output: CategoryOutputDto) {
    this.id = output.id;
    this.name = output.name;
    this.description = output.description;
    this.is_active = output.is_active;
    this.created_at = output.created_at;
  }
}

export class CategoryCollectionPresenter extends CollectionPresenter<CategoryPresenter> {
  data: CategoryPresenter[];

  // tambem poderia ser
  // constructor(output: CategoryOutputDto[], paginationProps) {}

  constructor(output: ListCategoriesUseCase.Output) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map((item) => new CategoryPresenter(item));
  }
}
