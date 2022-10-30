import { Category } from './category';
import { Chance } from 'chance';
import { UniqueEntityId } from '#shared/domain';

type PropOrFactory<T> = T | ((index: number) => T);

export class CategoryBuilder<TBuild = any> {
  private chance: Chance.Chance;
  private amount: number;

  // auto generated in entity
  private _unique_entity_id: PropOrFactory<UniqueEntityId | undefined> =
    undefined;
  private _name: PropOrFactory<string> = () => this.chance.word();
  private _description: PropOrFactory<string | null> = () =>
    this.chance.paragraph();
  private _is_active: PropOrFactory<boolean> = () => true;
  // auto generated in entity
  private _created_at: PropOrFactory<Date> = undefined;

  constructor(countObjs: number = 1) {
    this.amount = countObjs;
    this.chance = Chance();
  }

  static aCategory() {
    return new CategoryBuilder<Category>();
  }

  static theCategories(countObjs: number) {
    return new CategoryBuilder<Category[]>(countObjs);
  }

  withUniqueEntityId(valueOrFactory: PropOrFactory<UniqueEntityId>) {
    this._unique_entity_id = valueOrFactory;
    return this;
  }

  withName(valueOrFactory: PropOrFactory<string>) {
    this._name = valueOrFactory;
    return this;
  }

  withInvalidNameEmpty(value: '' | null | undefined) {
    this._name = value;
    return this;
  }

  withInvalidNameNotAString(value?: any) {
    this._name = value ?? 5;
    return this;
  }

  withInvalidNameTooLong(value?: string) {
    this._name = value ?? this.chance.word({ length: 256 });
    return this;
  }

  withDescription(valueOrFactory: PropOrFactory<string | null>) {
    this._description = valueOrFactory;
    return this;
  }

  withInvalidDescriptionNotAString(value?: any) {
    this._description = value ?? 5;
    return this;
  }

  activate() {
    this._is_active = true;
    return this;
  }

  deactivate() {
    this._is_active = false;
    return this;
  }

  withInvalidIsActiveEmpty(value: '' | null | undefined) {
    this._is_active = value as any;
    return this;
  }

  withInvalidIsActiveNotABoolean(value?: any) {
    this._description = value ?? 'fake boolean';
    return this;
  }

  withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
    this._created_at = valueOrFactory;
    return this;
  }

  build(): TBuild {
    const categories = new Array(this.amount).fill(undefined).map(
      (_, index) =>
        new Category(
          {
            name: this.callFactory(this._name, index),
            description: this.callFactory(this._description, index),
            is_active: this.callFactory(this._is_active, index),
            ...(this._created_at && {
              created_at: this.callFactory(this._created_at, index),
            }),
          },
          !this._unique_entity_id
            ? undefined
            : this.callFactory(this._unique_entity_id, index),
        ),
    );
    return this.amount === 1 ? (categories[0] as any) : categories;
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === 'function'
      ? factoryOrValue(index)
      : factoryOrValue;
  }

  get unique_entity_id() {
    return this.getValue('unique_entity_id');
  }

  get name() {
    return this.getValue('name');
  }

  get description() {
    return this.getValue('description');
  }

  get is_active() {
    return this.getValue('is_active');
  }

  get created_at() {
    return this.getValue('created_at');
  }

  private getValue(prop: string) {
    const optional = ['unique_entity_id', 'created_at'];
    const privateProp = `_${prop}`;
    if (!this[privateProp] && optional.includes(prop)) {
      throw new Error(
        `Property ${prop} not have a factory, use 'with' methods`,
      );
    }
    return this.callFactory(this[privateProp], 0);
  }
}
