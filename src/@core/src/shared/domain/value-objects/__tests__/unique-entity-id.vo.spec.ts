import { InvalidUuidError } from '#shared/domain/errors/invalid-uuid.error';
import { UniqueEntityId } from '../unique-entity-id.vo';
import { validate as uuidValidate } from 'uuid';

describe('UniqueEntityId unit tests', () => {
  const validateSpy = jest.spyOn(UniqueEntityId.prototype as any, 'validate');

  it('should throw error when uuid is invalid', () => {
    expect(() => new UniqueEntityId('fake id')).toThrow(new InvalidUuidError());
    expect(validateSpy).toHaveBeenCalled();
  });

  it('should accept a uuid passed in constructor', () => {
    const uuid = '8db4bb64-7109-4da2-be10-a9c16f7ed96e';
    const vo = new UniqueEntityId(uuid);
    expect(vo.value).toBe(uuid);
    expect(validateSpy).toHaveBeenCalled();
  });
});

describe('UniqueEntityId integration tests', () => {
  const validateSpy = jest.spyOn(UniqueEntityId.prototype as any, 'validate');

  it('should generate a uuid', () => {
    const vo = new UniqueEntityId();
    expect(uuidValidate(vo.value)).toBeTruthy();
    expect(validateSpy).toHaveBeenCalled();
  });
});
