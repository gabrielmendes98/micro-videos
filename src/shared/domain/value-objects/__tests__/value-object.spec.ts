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
});
