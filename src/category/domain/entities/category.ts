import { UniqueEntityId } from 'shared/domain/value-objects/unique-entity-id.vo';
import { Entity } from 'shared/entity/entity';

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
    super(props, id);
    this.props = Object.assign(this.props, props);
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
}
