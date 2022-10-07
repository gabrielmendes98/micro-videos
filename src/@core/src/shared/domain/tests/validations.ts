import { ClassValidatorFields } from '../validators/class-validator-fields';
import { FieldErrors } from '../validators/validator-fields-interface';
import { isMatch as testMatch } from 'lodash';
import { EntityValidationError } from '../errors/validation.error';

type Expected =
  | {
      validator: ClassValidatorFields<any>;
      data: any;
    }
  | (() => any);

function assertContainsErrorsMessages(
  expected: FieldErrors,
  received: FieldErrors
) {
  const isMatch = testMatch(expected, received);

  return isMatch
    ? { pass: true, message: () => '' }
    : {
        pass: false,
        message: () =>
          `The validation errors not contains ${JSON.stringify(
            received
          )}. Current: ${JSON.stringify(expected)}`,
      };
}

expect.extend({
  toContainErrorMessages(expected: Expected, received: FieldErrors) {
    if (typeof expected === 'function') {
      try {
        return expected();
      } catch (e) {
        const error = e as EntityValidationError;
        return assertContainsErrorsMessages(error.error, received);
      }
    } else {
      const { validator, data } = expected;
      const validated = validator.validate(data);

      if (validated) {
        return {
          pass: false,
          message: () => `Data is valid: ${JSON.stringify(data)}`,
        };
      }

      return assertContainsErrorsMessages(validator.errors ?? {}, received);
    }
  },
});
