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
      { received: null, expected: 'null' },
      { received: undefined, expected: 'undefined' },
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
});
