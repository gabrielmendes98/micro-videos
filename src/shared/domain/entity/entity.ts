import { UniqueEntityId } from '../value-objects/unique-entity-id.vo';

export abstract class Entity<Props> {
  public readonly uniqueEntityId: UniqueEntityId;

  constructor(public readonly props: Props, uniqueEntityId?: UniqueEntityId) {
    this.uniqueEntityId = uniqueEntityId || new UniqueEntityId();
  }

  get id(): string {
    return this.uniqueEntityId.value;
  }

  toJSON(): Required<{ id: string } & Props> {
    return {
      id: this.id,
      ...this.props,
    } as Required<{ id: string } & Props>;
  }
}
