import { ValueObject } from '../value-object';

class StubValueObject extends ValueObject {}

describe('ValueObject unit tests', () => {
  it('should set value', () => {
    let vo = new StubValueObject('some value');
    expect(vo.value).toBe('some value');

    vo = new StubValueObject({ prop: 'some value 2' });
    expect(vo.value).toStrictEqual({
      prop: 'some value 2',
    });
  });

  it('should convert to a string', () => {
    const date = new Date();
    const arrange = [
      { received: '', expected: '' },
      { received: 'any string', expected: 'any string' },
      { received: 10, expected: '10' },
      { received: 0, expected: '0' },
      { received: true, expected: 'true' },
      { received: false, expected: 'false' },
      { received: date, expected: date.toString() },
      {
        received: { prop: 'some prop ' },
        expected: JSON.stringify({ prop: 'some prop ' }),
      },
    ];

    arrange.forEach((value) => {
      const vo = new StubValueObject(value.received);
      expect(vo + '').toBe(value.expected);
    });
  });

  it('should be immutable', () => {
    const obj = {
      prop1: 'value',
      deep: { prop2: 'value2', prop3: new Date() },
    };
    const vo = new StubValueObject(obj);

    expect(typeof obj).toBe('object');

    expect(() => {
      (vo as any).value.prop1 = 'test';
    }).toThrow(
      "Cannot assign to read only property 'prop1' of object '#<Object>'"
    );

    expect(() => {
      (vo as any).value.deep.prop2 = 'test';
    }).toThrow(
      "Cannot assign to read only property 'prop2' of object '#<Object>'"
    );

    expect(vo.value.deep.prop3).toBeInstanceOf(Date);
  });
});
