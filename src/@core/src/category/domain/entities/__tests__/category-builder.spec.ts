import { Chance } from 'chance';
import { UniqueEntityId } from '#shared/domain';
import { CategoryBuilder } from '../category-builder';

describe('CategoryBuilder Unit Tests', () => {
  describe('unique_entity_id prop', () => {
    const builder = CategoryBuilder.aCategory();

    it('should throw error when any with methods has called', () => {
      expect(() => builder['getValue']('unique_entity_id')).toThrow(
        new Error(
          "Property unique_entity_id not have a factory, use 'with' methods",
        ),
      );
    });

    it('should be undefined', () => {
      expect(builder['_unique_entity_id']).toBeUndefined();
    });

    test('withUniqueEntityId', () => {
      const uniqueEntityId = new UniqueEntityId();
      const $this = builder.withUniqueEntityId(uniqueEntityId);
      expect($this).toBeInstanceOf(CategoryBuilder);
      expect(builder['_unique_entity_id']).toBe(uniqueEntityId);

      builder.withUniqueEntityId(() => uniqueEntityId);
      expect(builder['_unique_entity_id']()).toBe(uniqueEntityId);

      expect(builder.unique_entity_id).toBe(uniqueEntityId);
    });

    it('should pass index to unique_entity_id factory', () => {
      let mockFactory = jest.fn().mockReturnValue(new UniqueEntityId());
      builder.withUniqueEntityId(mockFactory);
      builder.build();
      expect(mockFactory).toHaveBeenCalledWith(0);

      mockFactory = jest.fn().mockReturnValue(new UniqueEntityId());
      const builderMany = CategoryBuilder.theCategories(2);
      builderMany.withUniqueEntityId(mockFactory);
      builderMany.build();

      expect(mockFactory).toHaveBeenCalledWith(0);
      expect(mockFactory).toHaveBeenCalledWith(1);
    });
  });

  describe('name prop', () => {
    const builder = CategoryBuilder.aCategory();
    it('should be a function', () => {
      expect(typeof builder['_name'] === 'function').toBeTruthy();
    });

    it('should call the word method', () => {
      const chance = Chance();
      const spyWordMethod = jest.spyOn(chance, 'word');
      builder['chance'] = chance;
      builder.build();

      expect(spyWordMethod).toHaveBeenCalled();
    });

    test('withName', () => {
      const $this = builder.withName('test name');
      expect($this).toBeInstanceOf(CategoryBuilder);
      expect(builder['_name']).toBe('test name');

      builder.withName(() => 'test name');
      //@ts-expect-error name is callable
      expect(builder['_name']()).toBe('test name');

      expect(builder.name).toBe('test name');
    });

    it('should pass index to name factory', () => {
      builder.withName((index) => `test name ${index}`);
      const category = builder.build();
      expect(category.name).toBe(`test name 0`);

      const builderMany = CategoryBuilder.theCategories(2);
      builderMany.withName((index) => `test name ${index}`);
      const categories = builderMany.build();

      expect(categories[0].name).toBe(`test name 0`);
      expect(categories[1].name).toBe(`test name 1`);
    });

    test('invalid empty case', () => {
      const $this = builder.withInvalidNameEmpty(undefined);
      expect($this).toBeInstanceOf(CategoryBuilder);
      expect(builder['_name']).toBeUndefined();

      builder.withInvalidNameEmpty(null);
      expect(builder['_name']).toBeNull();

      builder.withInvalidNameEmpty('');
      expect(builder['_name']).toBe('');
    });

    test('invalid too long case', () => {
      const $this = builder.withInvalidNameTooLong();
      expect($this).toBeInstanceOf(CategoryBuilder);
      expect(builder['_name'].length).toBe(256);

      const tooLong = 'a'.repeat(256);
      builder.withInvalidNameTooLong(tooLong);
      expect(builder['_name'].length).toBe(256);
      expect(builder['_name']).toBe(tooLong);
    });
  });

  describe('description prop', () => {
    const builder = CategoryBuilder.aCategory();
    it('should be a function', () => {
      expect(typeof builder['_description'] === 'function').toBeTruthy();
    });

    it('should call the paragraph method', () => {
      const chance = Chance();
      const spyWordMethod = jest.spyOn(chance, 'paragraph');
      builder['chance'] = chance;
      builder.build();

      expect(spyWordMethod).toHaveBeenCalled();
    });

    test('withDescription', () => {
      const $this = builder.withDescription('test description');
      expect($this).toBeInstanceOf(CategoryBuilder);
      expect(builder['_description']).toBe('test description');

      builder.withDescription(() => 'test description');
      //@ts-expect-error description is callable
      expect(builder['_description']()).toBe('test description');

      expect(builder.description).toBe('test description');
    });

    it('should pass index to description factory', () => {
      builder.withDescription((index) => `test description ${index}`);
      const category = builder.build();
      expect(category.description).toBe(`test description 0`);

      const builderMany = CategoryBuilder.theCategories(2);
      builderMany.withDescription((index) => `test description ${index}`);
      const categories = builderMany.build();

      expect(categories[0].description).toBe(`test description 0`);
      expect(categories[1].description).toBe(`test description 1`);
    });
  });

  describe('is_active prop', () => {
    const builder = CategoryBuilder.aCategory();
    it('should be a function', () => {
      expect(typeof builder['_is_active'] === 'function').toBeTruthy();
    });

    test('activate', () => {
      const $this = builder.activate();
      expect($this).toBeInstanceOf(CategoryBuilder);
      expect(builder['_is_active']).toBeTruthy();
      expect(builder.is_active).toBeTruthy();
    });

    test('deactivate', () => {
      const $this = builder.deactivate();
      expect($this).toBeInstanceOf(CategoryBuilder);
      expect(builder['_is_active']).toBeFalsy();
      expect(builder.is_active).toBeFalsy();
    });
  });

  describe('created_at prop', () => {
    const builder = CategoryBuilder.aCategory();

    it('should throw error when any with methods has called', () => {
      const builderCategory = CategoryBuilder.aCategory();
      expect(() => builderCategory.created_at).toThrow(
        new Error("Property created_at not have a factory, use 'with' methods"),
      );
    });

    it('should be undefined', () => {
      expect(builder['_created_at']).toBeUndefined();
    });

    test('withCreatedAt', () => {
      const date = new Date();
      const $this = builder.withCreatedAt(date);
      expect($this).toBeInstanceOf(CategoryBuilder);
      expect(builder['_created_at']).toBe(date);

      builder.withCreatedAt(() => date);
      expect(builder['_created_at']()).toBe(date);
      expect(builder.created_at).toBe(date);
    });

    it('should pass index to created_at factory', () => {
      const date = new Date();
      builder.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const category = builder.build();
      expect(category.created_at.getTime()).toBe(date.getTime() + 2);

      const builderMany = CategoryBuilder.theCategories(2);
      builderMany.withCreatedAt(
        (index) => new Date(date.getTime() + index + 2),
      );
      const categories = builderMany.build();

      expect(categories[0].created_at.getTime()).toBe(date.getTime() + 0 + 2);
      expect(categories[1].created_at.getTime()).toBe(date.getTime() + 1 + 2);
    });
  });

  it('should create a category', () => {
    const builder = CategoryBuilder.aCategory();
    let category = builder.build();

    expect(category.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    expect(typeof category.name === 'string').toBeTruthy();
    expect(typeof category.description === 'string').toBeTruthy();
    expect(category.is_active).toBeTruthy();
    expect(category.created_at).toBeInstanceOf(Date);

    const created_at = new Date();
    const uniqueEntityId = new UniqueEntityId();
    category = builder
      .withUniqueEntityId(uniqueEntityId)
      .withName('name test')
      .withDescription('description test')
      .deactivate()
      .withCreatedAt(created_at)
      .build();

    expect(category.uniqueEntityId.value).toBe(uniqueEntityId.value);
    expect(category.name).toBe('name test');
    expect(category.description).toBe('description test');
    expect(category.is_active).toBeFalsy();
    expect(category.props.created_at).toEqual(created_at);
  });

  it('should create many categories', () => {
    const builder = CategoryBuilder.theCategories(2);
    let categories = builder.build();

    categories.forEach((category) => {
      expect(category.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
      expect(typeof category.name === 'string').toBeTruthy();
      expect(typeof category.description === 'string').toBeTruthy();
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });

    const created_at = new Date();
    const uniqueEntityId = new UniqueEntityId();
    categories = builder
      .withUniqueEntityId(uniqueEntityId)
      .withName('name test')
      .withDescription('description test')
      .deactivate()
      .withCreatedAt(created_at)
      .build();

    categories.forEach((category) => {
      expect(category.uniqueEntityId.value).toBe(uniqueEntityId.value);
      expect(category.name).toBe('name test');
      expect(category.description).toBe('description test');
      expect(category.is_active).toBeFalsy();
      expect(category.props.created_at).toEqual(created_at);
    });
  });
});
