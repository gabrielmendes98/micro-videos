import { UniqueEntityId, Entity, EntityValidationError } from '#shared/domain';
import { CategoryValidatorFactory } from '../validators/category.validators';

export type CategoryProperties = {
  name: string;
  description?: string | null;
  is_active?: boolean;
  created_at?: Date;
};

export class Category extends Entity<CategoryProperties> {
  public readonly props: Required<CategoryProperties> = {
    name: '',
    description: null,
    is_active: true,
    created_at: new Date(),
  };

  constructor(props: CategoryProperties, id?: UniqueEntityId) {
    Category.validate(props);
    super(props, id);
    this.props = Object.assign(this.props, props);
  }

  // First validation method
  // static validate(props: Omit<CategoryProperties, 'created_at'>) {
  //   ValidatorRules.values(props.name, 'name')
  //     .required()
  //     .string()
  //     .maxLength(255);
  //   ValidatorRules.values(props.description, 'description').string();
  //   ValidatorRules.values(props.is_active, 'is_active').boolean();
  // }

  static validate(props: CategoryProperties) {
    const validator = CategoryValidatorFactory.create();
    validator.validate(props);
    if (validator.errors) {
      throw new EntityValidationError(validator.errors);
    }
  }

  get name() {
    return this.props.name;
  }

  get description() {
    return this.props.description;
  }

  get is_active() {
    return this.props.is_active;
  }

  get created_at() {
    return this.props.created_at;
  }

  update(name: string, description?: string) {
    Category.validate({
      name,
      description,
    });
    this.props.name = name;
    this.props.description = description ?? null;
  }

  activate() {
    this.props.is_active = true;
  }

  deactivate() {
    this.props.is_active = false;
  }
}
