import { deepFreeze } from './object';

describe('object unit tests', () => {
  describe('deepFreeze', () => {
    it('should not freeze a scalar value ', () => {
      const str = deepFreeze('a');
      expect(typeof str).toBe('string');

      let bool = deepFreeze(true);
      expect(typeof bool).toBe('boolean');

      bool = deepFreeze(false);
      expect(typeof bool).toBe('boolean');

      const num = deepFreeze(3);
      expect(typeof num).toBe('number');
    });

    it('should turn object into immutable', () => {
      const obj = deepFreeze({
        prop1: 'value',
        deep: { prop2: 'value2', prop3: new Date() },
      });

      expect(typeof obj).toBe('object');

      expect(() => {
        (obj as any).prop1 = 'test';
      }).toThrow(
        "Cannot assign to read only property 'prop1' of object '#<Object>'"
      );

      expect(() => {
        (obj as any).deep.prop2 = 'test';
      }).toThrow(
        "Cannot assign to read only property 'prop2' of object '#<Object>'"
      );

      expect(obj.deep.prop3).toBeInstanceOf(Date);
    });
  });
});
