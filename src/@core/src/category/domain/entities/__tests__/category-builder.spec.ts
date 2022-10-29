import { CategoryBuilder } from '../category-builder';
import { Chance } from 'chance';

describe('CategoryBuilder unit tests', () => {
  describe('name prop', () => {
    const builder = CategoryBuilder.aCategory();

    it('should start as function', () => {
      expect(typeof builder['_name'] === 'function').toBeTruthy();
    });

    it('should call chance word method', () => {
      const chance = Chance();
      const wordSpy = jest.spyOn(chance, 'word');

      builder['chance'] = chance;
      builder.build();
      expect(wordSpy).toHaveBeenCalled();
    });

    test('withName', () => {
      builder.withName('some name');
      expect(builder['_name']).toBe('some name');

      builder.withName(() => 'some name');
      // @ts-expect-error name is not callable
      expect(builder['_name']()).toBe('some name');
    });

    it('should pass index to name factory', () => {
      builder.withName((index) => `test name ${index}`);
      const category = builder.build();
      expect(category.name).toBe('test name 0');

      const builderMany = CategoryBuilder.theCategories(2);
      builderMany.withName((index) => `test name ${index}`);
      const categories = builderMany.build();
      expect(categories[0].name).toBe('test name 0');
      expect(categories[1].name).toBe('test name 1');
    });
  });
});
