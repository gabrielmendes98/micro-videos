import { ClassValidatorFields } from '../class-validator-fields';
import * as libClassValidator from 'class-validator';

class StubClassValidator extends ClassValidatorFields<{ field: string }> {}

describe('ClassValidatorFields unit tests', () => {
  it('should initialize errors and validatedData vars with null', () => {
    const validator = new StubClassValidator();
    expect(validator.errors).toBeNull();
    expect(validator.validatedData).toBeNull();
  });

  it('should validate with errors', () => {
    const validateSyncSpy = jest
      .spyOn(libClassValidator, 'validateSync')
      .mockReturnValue([
        { property: 'field', constraints: { isRequired: 'some error' } },
      ]);

    const validator = new StubClassValidator();
    expect(validator.validate(null)).toBeFalsy();
    expect(validateSyncSpy).toHaveBeenCalled();
    expect(validator.validatedData).toBeNull();
    expect(validator.errors).toStrictEqual({
      field: ['some error'],
    });
  });

  it('should validate without errors', () => {
    const validateSyncSpy = jest
      .spyOn(libClassValidator, 'validateSync')
      .mockReturnValue([]);

    const validator = new StubClassValidator();
    expect(validator.validate({ field: 'test' })).toBeTruthy();
    expect(validateSyncSpy).toHaveBeenCalled();
    expect(validator.validatedData).toStrictEqual({ field: 'test' });
    expect(validator.errors).toBeNull();
  });
});
